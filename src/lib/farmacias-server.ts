import "server-only";
import { after } from "next/server";
import { getRedis } from "@/lib/redis";
import {
  MINSAL_URL,
  filtrarPorComuna,
  normalizarRespuesta,
  turnoVigente,
  type FarmaciasResponse,
  type FuenteFarmacias,
} from "@/lib/farmacias";

// Farmacias de turno en el servidor, con caché resiliente en Upstash Redis.
//
// Orden de resolución:
//   (a) MINSAL, con timeout de 8 s y 1 reintento;
//   (b) si falla, la última respuesta VÁLIDA guardada en Redis (fuente: "cache");
//   (c) si tampoco hay caché, el endpoint responde error y el navegador del visitante
//       consulta directo al MINSAL (respaldo que ya existía en FarmaciasTurno.tsx).
//
// Stale-while-revalidate: una respuesta guardada hace menos de 15 min se sirve tal
// cual; entre 15 min y 2 h se sirve al tiro y se refresca en segundo plano (after),
// así el visitante nunca espera al MINSAL si hay datos recientes.

const TIMEOUT_MS = 8_000;
const REINTENTOS = 1;
const TTL_SEGUNDOS = 36 * 60 * 60;
/** Antes de esto, la respuesta guardada se usa sin consultar al MINSAL. */
const FRESCO_MS = 15 * 60 * 1000;
/** Si el turno vigente aún no estaba publicado, se vuelve a preguntar antes. */
const FRESCO_SIN_TURNO_MS = 5 * 60 * 1000;
/** Hasta esto, se sirve la respuesta guardada y se refresca en segundo plano. */
const SWR_MAX_MS = 2 * 60 * 60 * 1000;

const PREFIJO = "dys:farmacias";
const clave = (fechaTurno: string) => `${PREFIJO}:${fechaTurno}`;
const CLAVE_LOCK = `${PREFIJO}:refrescando`;

interface EntradaCache {
  data: FarmaciasResponse;
  /** Momento (ISO) en que se obtuvo del MINSAL. */
  obtenidoEn: string;
}

async function pedirMinsal(): Promise<FarmaciasResponse> {
  let ultimoError: unknown;
  for (let intento = 0; intento <= REINTENTOS; intento++) {
    try {
      const res = await fetch(MINSAL_URL, {
        headers: { Accept: "application/json", "User-Agent": "SolucionesDyS/1.0 (+https://www.solucionesdys.cl)" },
        // El caché lo maneja Redis: aquí siempre se pide la versión actual.
        cache: "no-store",
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      if (!res.ok) throw new Error(`MINSAL respondió ${res.status}`);
      // normalizarRespuesta valida la forma y lanza error si viene vacía o malformada.
      const data = normalizarRespuesta(await res.json());
      if (data.farmacias.length + data.otrasFechas.length === 0) {
        throw new Error("El MINSAL no informó farmacias de la zona");
      }
      return data;
    } catch (error) {
      ultimoError = error;
    }
  }
  throw ultimoError;
}

function esEntradaValida(valor: unknown): valor is EntradaCache {
  if (typeof valor !== "object" || valor === null) return false;
  const e = valor as Partial<EntradaCache>;
  return (
    typeof e.obtenidoEn === "string" &&
    !Number.isNaN(Date.parse(e.obtenidoEn)) &&
    typeof e.data === "object" &&
    e.data !== null &&
    Array.isArray(e.data.farmacias) &&
    Array.isArray(e.data.otrasFechas)
  );
}

async function leerCache(fechaTurno: string): Promise<EntradaCache | null> {
  const redis = getRedis();
  if (!redis) return null;
  try {
    const valor = await redis.get<unknown>(clave(fechaTurno));
    return esEntradaValida(valor) ? valor : null;
  } catch (error) {
    console.error("[farmacias] Error leyendo caché:", error);
    return null;
  }
}

async function guardarCache(data: FarmaciasResponse): Promise<void> {
  const redis = getRedis();
  if (!redis) return;
  const entrada: EntradaCache = { data, obtenidoEn: data.actualizadoEn };
  try {
    await redis.set(clave(data.fecha), entrada, { ex: TTL_SEGUNDOS });
  } catch (error) {
    console.error("[farmacias] Error guardando caché:", error);
  }
}

async function refrescarEnSegundoPlano(): Promise<void> {
  const redis = getRedis();
  if (!redis) return;
  try {
    // Un solo refresco a la vez entre todas las instancias.
    const lock = await redis.set(CLAVE_LOCK, "1", { nx: true, ex: 30 });
    if (lock !== "OK") return;
    await guardarCache(await pedirMinsal());
  } catch (error) {
    console.warn("[farmacias] No se pudo refrescar en segundo plano:", error);
  }
}

const desdeCache = (entrada: EntradaCache, fuente: FuenteFarmacias, comunaSlug?: string): FarmaciasResponse =>
  filtrarPorComuna({ ...entrada.data, fuente, actualizadoEn: entrada.obtenidoEn }, comunaSlug);

export async function obtenerFarmaciasTurno(comunaSlug?: string): Promise<FarmaciasResponse> {
  // Sin Redis configurado: consulta directa, como antes.
  if (!getRedis()) return filtrarPorComuna(await pedirMinsal(), comunaSlug);

  const { fechaVigente, fechaAnterior } = turnoVigente();
  const actual = await leerCache(fechaVigente);

  if (actual) {
    const edad = Date.now() - Date.parse(actual.obtenidoEn);
    const fresco = actual.data.farmacias.length > 0 ? FRESCO_MS : FRESCO_SIN_TURNO_MS;
    if (edad < fresco) return desdeCache(actual, "minsal", comunaSlug);
    if (edad < SWR_MAX_MS) {
      after(refrescarEnSegundoPlano);
      return desdeCache(actual, "minsal", comunaSlug);
    }
  }

  try {
    const data = await pedirMinsal();
    await guardarCache(data);
    return filtrarPorComuna(data, comunaSlug);
  } catch (error) {
    // Recién cambió el turno (09:00) y el MINSAL no responde: sirve el último guardado.
    const respaldo = actual ?? (await leerCache(fechaAnterior));
    if (respaldo) {
      console.warn("[farmacias] MINSAL no disponible, se usa la caché del", respaldo.obtenidoEn, error);
      return desdeCache(respaldo, "cache", comunaSlug);
    }
    throw error;
  }
}
