// Farmacias de turno: valida y normaliza la respuesta del servicio abierto del MINSAL
// y la filtra a la zona de Puerto Varas. Este módulo es compartido: lo usa el servidor
// (src/lib/farmacias-server.ts, con caché en Redis) y, como respaldo, el navegador del
// visitante (el MINSAL bloquea a veces las IP de servidores pero permite CORS, así que
// la consulta directa desde el navegador sigue funcionando).

export const MINSAL_URL = "https://midas.minsal.cl/farmacia_v2/WS/getLocalesTurnos.php";

// Comunas de la zona. Puerto Varas va primero: es la principal.
export const COMUNAS_ZONA = [
  "Puerto Varas",
  "Llanquihue",
  "Frutillar",
  "Puerto Montt",
  "Puerto Octay",
  "Fresia",
  "Cochamó",
  "Calbuco",
  "Maullín",
] as const;

const DIA_MS = 86_400_000;

const sumarDias = (fecha: string, dias: number) =>
  new Date(Date.parse(`${fecha}T00:00:00Z`) + dias * DIA_MS).toISOString().slice(0, 10);

// Un turno con fecha D dura desde las 09:00 de D hasta las 08:59 de D+1.
const HORA_CAMBIO_TURNO = 9;

export interface TurnoVigente {
  /** Fecha (YYYY-MM-DD) del turno que está en curso ahora en Santiago. */
  fechaVigente: string;
  /** Fecha del turno anterior, ya terminado. */
  fechaAnterior: string;
  /** Hora actual en Santiago (0-23). */
  hora: number;
}

/** Turno en curso según el reloj de Santiago: antes de las 09:00 sigue el turno del día anterior. */
export function turnoVigente(ahora: Date = new Date()): TurnoVigente {
  const partes: Record<string, string> = {};
  for (const p of new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Santiago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
  }).formatToParts(ahora)) {
    partes[p.type] = p.value;
  }
  const hoy = `${partes.year}-${partes.month}-${partes.day}`;
  const hora = Number(partes.hour);
  const fechaVigente = hora < HORA_CAMBIO_TURNO ? sumarDias(hoy, -1) : hoy;
  return { fechaVigente, fechaAnterior: sumarDias(fechaVigente, -1), hora };
}

// Centro de Puerto Varas: punto de referencia para ordenar las farmacias cercanas.
const CENTRO_PUERTO_VARAS = { lat: -41.3186, lng: -72.9857 };

/** Distancia en línea recta (km) entre una farmacia y el centro de Puerto Varas, o null sin coordenadas. */
export function distanciaAPuertoVarasKm(f: Pick<FarmaciaTurno, "lat" | "lng">): number | null {
  if (f.lat === null || f.lng === null) return null;
  const rad = (g: number) => (g * Math.PI) / 180;
  const dLat = rad(f.lat - CENTRO_PUERTO_VARAS.lat);
  const dLng = rad(f.lng - CENTRO_PUERTO_VARAS.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(CENTRO_PUERTO_VARAS.lat)) * Math.cos(rad(f.lat)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(a));
}

export interface FarmaciaTurno {
  id: string;
  nombre: string;
  comuna: string;
  comunaSlug: string;
  localidad: string;
  direccion: string;
  telefono: string | null;
  /** Número listo para un enlace tel:, o null si el dato del MINSAL no es confiable. */
  telefonoHref: string | null;
  lat: number | null;
  lng: number | null;
  apertura: string;
  cierre: string;
  /** El turno termina al día siguiente (p. ej. 09:00 → 08:59). */
  cruzaMedianoche: boolean;
  fecha: string;
}

/**
 * De dónde salen los datos:
 * - "minsal": respuesta reciente del MINSAL.
 * - "cache": el MINSAL no respondió; es la última respuesta válida guardada.
 */
export type FuenteFarmacias = "minsal" | "cache";

export interface FarmaciasResponse {
  /** Fecha (YYYY-MM-DD) del turno vigente al generar la respuesta. */
  fecha: string;
  /** Momento (ISO) en que se obtuvieron estos datos del MINSAL. */
  actualizadoEn: string;
  fuente: FuenteFarmacias;
  total: number;
  /** Farmacias del turno vigente. Vacío si el MINSAL aún no publica el turno en curso. */
  farmacias: FarmaciaTurno[];
  /**
   * Turnos recientes de otras fechas (el anterior, ya terminado, o uno futuro ya publicado).
   * Sirven de respaldo si el MINSAL se atrasa; no son farmacias de turno ahora.
   */
  otrasFechas: FarmaciaTurno[];
}

interface MinsalLocal {
  fecha: string;
  local_id: string;
  local_nombre: string;
  comuna_nombre: string;
  localidad_nombre: string;
  local_direccion: string;
  funcionamiento_hora_apertura: string;
  funcionamiento_hora_cierre: string;
  local_telefono: string;
  local_lat: string;
  local_lng: string;
}

const sinTildes = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export const toSlug = (s: string) =>
  sinTildes(s).trim().toLowerCase().replace(/\s+/g, "-");

const MINUSCULAS = new Set(["de", "del", "la", "las", "los", "el", "y", "e"]);

// El MINSAL entrega todo en MAYÚSCULAS y con espacios de sobra: "AVENIDA DEL SALVADOR  400".
function limpiarTexto(raw: string): string {
  return raw
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .map((palabra, i) => {
      if (/\d/.test(palabra)) return palabra;
      const p = palabra.toLowerCase();
      if (i > 0 && MINUSCULAS.has(p)) return p;
      return p.charAt(0).toUpperCase() + p.slice(1);
    })
    .join(" ");
}

// El dato de teléfono del MINSAL es inconsistente ("2234544", "+566944000", "963008227").
// Solo devolvemos un enlace tel: cuando el número tiene forma válida.
function telefonoHref(raw: string): string | null {
  let digitos = raw.replace(/\D/g, "");
  if (digitos.length === 11 && digitos.startsWith("56")) digitos = digitos.slice(2);
  if (digitos.length === 7) digitos = `65${digitos}`; // fijo de la Región de Los Lagos
  if (digitos.length === 9 && (digitos.startsWith("9") || digitos.startsWith("65"))) {
    return `+56${digitos}`;
  }
  return null;
}

const hhmm = (t: string) => (t ?? "").slice(0, 5);

const num = (s: string) => {
  const n = Number.parseFloat(s);
  return Number.isFinite(n) ? n : null;
};

function normalizar(l: MinsalLocal): FarmaciaTurno {
  const apertura = hhmm(l.funcionamiento_hora_apertura);
  const cierre = hhmm(l.funcionamiento_hora_cierre);
  const comuna = limpiarTexto(l.comuna_nombre);
  const telefono = l.local_telefono?.trim() || null;

  return {
    id: l.local_id,
    nombre: limpiarTexto(l.local_nombre),
    comuna,
    comunaSlug: toSlug(comuna),
    localidad: limpiarTexto(l.localidad_nombre ?? ""),
    direccion: limpiarTexto(l.local_direccion),
    telefono,
    telefonoHref: telefono ? telefonoHref(telefono) : null,
    lat: num(l.local_lat),
    lng: num(l.local_lng),
    apertura,
    cierre,
    cruzaMedianoche: cierre <= apertura,
    fecha: l.fecha,
  };
}

const CAMPOS_OBLIGATORIOS = [
  "fecha",
  "local_id",
  "local_nombre",
  "comuna_nombre",
  "local_direccion",
  "funcionamiento_hora_apertura",
  "funcionamiento_hora_cierre",
] as const;

const FECHA_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function esLocalValido(item: unknown): item is MinsalLocal {
  if (typeof item !== "object" || item === null) return false;
  const r = item as Record<string, unknown>;
  return (
    CAMPOS_OBLIGATORIOS.every((k) => typeof r[k] === "string" && (r[k] as string).trim() !== "") &&
    FECHA_REGEX.test(r.fecha as string)
  );
}

/**
 * Valida la forma de la respuesta cruda del MINSAL y devuelve solo los registros bien
 * formados. Lanza error si no es una lista, viene vacía o la mayoría está malformada
 * (señal de que el servicio cambió o respondió basura): eso nunca debe cachearse.
 */
export function validarRespuestaMinsal(data: unknown): MinsalLocal[] {
  if (!Array.isArray(data)) throw new Error("Respuesta inesperada del MINSAL (no es una lista)");
  if (data.length === 0) throw new Error("El MINSAL respondió una lista vacía");
  const validos = data.filter(esLocalValido);
  if (validos.length < data.length * 0.9) {
    throw new Error(`Respuesta del MINSAL malformada (${validos.length} de ${data.length} registros válidos)`);
  }
  return validos;
}

/** Deja solo una comuna (o todo, si no se indica) y recalcula el total. */
export function filtrarPorComuna(data: FarmaciasResponse, comunaSlug?: string): FarmaciasResponse {
  if (!comunaSlug) return data;
  const farmacias = data.farmacias.filter((f) => f.comunaSlug === comunaSlug);
  return {
    ...data,
    total: farmacias.length,
    farmacias,
    otrasFechas: data.otrasFechas.filter((f) => f.comunaSlug === comunaSlug),
  };
}

// Convierte la respuesta cruda del MINSAL en la respuesta limpia que usa la página.
// Es una función pura: corre igual en el servidor y en el navegador.
export function normalizarRespuesta(data: unknown, comunaSlug?: string): FarmaciasResponse {
  const locales = validarRespuestaMinsal(data);

  const { fechaVigente } = turnoVigente();

  // Junto con los turnos del día, el servicio arrastra registros antiguos (locales de
  // urgencia con fecha vieja). Descartamos todo lo que quede más de 2 días atrás de la
  // fecha más nueva del servicio.
  const fechaMax = locales.reduce((max, l) => (l.fecha > max ? l.fecha : max), "");
  const limite = sumarDias(fechaMax, -2);

  const zona = new Set(COMUNAS_ZONA.map((c) => toSlug(c)));
  const orden = new Map<string, number>(COMUNAS_ZONA.map((c, i) => [toSlug(c), i]));

  const recientes = locales
    .filter((l) => l.fecha >= limite && zona.has(toSlug(l.comuna_nombre)))
    .map(normalizar)
    .sort(
      (a, b) =>
        (orden.get(a.comunaSlug) ?? 99) - (orden.get(b.comunaSlug) ?? 99) ||
        a.nombre.localeCompare(b.nombre, "es"),
    );

  const farmacias = recientes.filter((f) => f.fecha === fechaVigente);

  return filtrarPorComuna(
    {
      fecha: fechaVigente,
      actualizadoEn: new Date().toISOString(),
      fuente: "minsal",
      total: farmacias.length,
      farmacias,
      otrasFechas: recientes.filter((f) => f.fecha !== fechaVigente),
    },
    comunaSlug,
  );
}
