// Farmacias de turno: consulta el servicio abierto del MINSAL, lo normaliza y
// lo filtra a la zona de Puerto Varas. Lo usa el endpoint /api/farmacias-turno y, como
// respaldo, el navegador del visitante (el MINSAL bloquea a veces las IP de servidores
// pero permite CORS, así que la consulta directa desde el navegador sigue funcionando).

export const MINSAL_URL = "https://midas.minsal.cl/farmacia_v2/WS/getLocalesTurnos.php";

// Cuánto tiempo (segundos) reutilizamos la respuesta del MINSAL antes de volver a pedirla.
const REVALIDATE_SECONDS = 900;

export const FUENTE = "MINSAL - Farmacias de turno";

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

export interface FarmaciasResponse {
  /** Fecha (YYYY-MM-DD) a la que corresponde el turno informado. */
  fecha: string;
  /** Momento en que se generó esta respuesta (ISO). */
  actualizado: string;
  fuente: string;
  total: number;
  farmacias: FarmaciaTurno[];
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

// Convierte la respuesta cruda del MINSAL en la respuesta limpia que usa la página.
// Es una función pura: corre igual en el servidor y en el navegador.
export function normalizarRespuesta(data: unknown, comunaSlug?: string): FarmaciasResponse {
  if (!Array.isArray(data)) throw new Error("Respuesta inesperada del MINSAL");
  const locales = data as MinsalLocal[];

  // Junto con los turnos del día, el servicio arrastra registros antiguos (locales de
  // urgencia con fecha vieja). Nos quedamos solo con la fecha más reciente.
  const fecha = locales.reduce((max, l) => (l.fecha > max ? l.fecha : max), "");

  const zona = new Set(COMUNAS_ZONA.map((c) => toSlug(c)));
  const orden = new Map<string, number>(COMUNAS_ZONA.map((c, i) => [toSlug(c), i]));

  const farmacias = locales
    .filter((l) => l.fecha === fecha && zona.has(toSlug(l.comuna_nombre)))
    .map(normalizar)
    .filter((f) => !comunaSlug || f.comunaSlug === comunaSlug)
    .sort(
      (a, b) =>
        (orden.get(a.comunaSlug) ?? 99) - (orden.get(b.comunaSlug) ?? 99) ||
        a.nombre.localeCompare(b.nombre, "es"),
    );

  return {
    fecha,
    actualizado: new Date().toISOString(),
    fuente: FUENTE,
    total: farmacias.length,
    farmacias,
  };
}

export async function obtenerFarmaciasTurno(comunaSlug?: string): Promise<FarmaciasResponse> {
  const res = await fetch(MINSAL_URL, {
    headers: { Accept: "application/json", "User-Agent": "SolucionesDyS/1.0 (+https://www.solucionesdys.cl)" },
    next: { revalidate: REVALIDATE_SECONDS },
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`MINSAL respondió ${res.status}`);
  return normalizarRespuesta(await res.json(), comunaSlug);
}
