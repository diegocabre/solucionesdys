import { useEffect, useState } from "react";
import { MINSAL_URL, normalizarRespuesta, turnoVigente } from "@/lib/farmacias";
import type { FarmaciasResponse, TurnoVigente } from "@/lib/farmacias";

export type EstadoFarmacias =
  | { tipo: "cargando" }
  | { tipo: "error" }
  | { tipo: "listo"; data: FarmaciasResponse; turno: TurnoVigente };

// Primero consulta nuestro API. Si el servidor no logra llegar al MINSAL (su Cloudflare bloquea
// a veces las IP de servidores), reintenta directo desde el navegador del visitante, que el MINSAL
// sí acepta (CORS abierto). Devuelve siempre un estado: los errores no se lanzan.
async function pedirFarmacias(signal?: AbortSignal): Promise<EstadoFarmacias | null> {
  // El turno vigente se decide con el reloj del visitante, no con el de la respuesta: el caché
  // del API puede haberse generado antes del cambio de turno de las 09:00.
  const listo = (data: FarmaciasResponse): EstadoFarmacias => ({ tipo: "listo", data, turno: turnoVigente() });

  try {
    const res = await fetch("/api/farmacias-turno", { signal });
    if (!res.ok) throw new Error(String(res.status));
    return listo((await res.json()) as FarmaciasResponse);
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") return null;
  }

  try {
    const res = await fetch(MINSAL_URL, { signal: signal ?? AbortSignal.timeout(15_000) });
    if (!res.ok) throw new Error(String(res.status));
    return listo(normalizarRespuesta(await res.json()));
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") return null;
    return { tipo: "error" };
  }
}

/** Carga las farmacias de turno al montar y permite reintentar tras un error. */
export function useFarmaciasTurno() {
  const [estado, setEstado] = useState<EstadoFarmacias>({ tipo: "cargando" });

  useEffect(() => {
    const controller = new AbortController();
    pedirFarmacias(controller.signal).then((e) => e && setEstado(e));
    return () => controller.abort();
  }, []);

  const reintentar = () => {
    setEstado({ tipo: "cargando" });
    pedirFarmacias().then((e) => e && setEstado(e));
  };

  return { estado, reintentar };
}
