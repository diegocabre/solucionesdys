// Atribución de leads: de qué campaña (utm_*) y desde qué página llegó la consulta.
// Se guarda solo en sessionStorage del visitante (se borra al cerrar la pestaña)
// y viaja al servidor únicamente si envía el formulario de contacto.

export const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign"] as const;
export type UtmKey = (typeof UTM_KEYS)[number];

const STORAGE_UTM = "dys_utm";
const STORAGE_ORIGEN = "dys_origen";
const PAGINA_CONTACTO = "/contacto";

function leer(key: string): string | null {
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function guardar(key: string, value: string) {
  try {
    window.sessionStorage.setItem(key, value);
  } catch {
    // Almacenamiento bloqueado (modo privado estricto): la atribución es opcional.
  }
}

/** Registra la visita actual: guarda los utm_* si vienen en la URL y la última página vista. */
export function registrarVisita(pathname: string, search: string) {
  const params = new URLSearchParams(search);
  const utm: Partial<Record<UtmKey, string>> = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key)?.trim().slice(0, 100);
    if (value) utm[key] = value;
  }
  if (Object.keys(utm).length > 0) guardar(STORAGE_UTM, JSON.stringify(utm));
  if (pathname !== PAGINA_CONTACTO && !pathname.startsWith("/admin")) guardar(STORAGE_ORIGEN, pathname.slice(0, 300));
}

/** Agrega al formulario los campos ocultos de atribución antes de enviarlo. */
export function agregarAtribucion(formData: FormData) {
  formData.set("source_page", leer(STORAGE_ORIGEN) ?? PAGINA_CONTACTO);

  let utm: Partial<Record<UtmKey, string>> = {};
  try {
    utm = JSON.parse(leer(STORAGE_UTM) ?? "{}") as Partial<Record<UtmKey, string>>;
  } catch {
    utm = {};
  }
  // Los utm_* de la propia URL de /contacto tienen prioridad.
  const actuales = new URLSearchParams(window.location.search);
  for (const key of UTM_KEYS) {
    const value = actuales.get(key) ?? utm[key];
    if (value) formData.set(key, value);
  }
}
