import "server-only";

// Cliente mínimo de Supabase para el servidor, sobre su API REST (PostgREST).
// Usa la service role key, que salta RLS: NUNCA debe llegar al navegador ni
// llevar el prefijo NEXT_PUBLIC. No usamos @supabase/supabase-js porque solo
// necesitamos unas pocas consultas a `leads`, `suscripciones_farmacias` y `negocios`.

export interface NewLead {
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  source_page: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  ip_hash: string | null;
  user_agent: string | null;
}

interface SupabaseConfig {
  url: string;
  key: string;
}

function getConfig(): SupabaseConfig | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return { url: url.replace(/\/+$/, ""), key };
}

export const isSupabaseConfigured = () => getConfig() !== null;

async function request(path: string, init: RequestInit & { prefer?: string } = {}): Promise<Response> {
  const config = getConfig();
  if (!config) throw new Error("Supabase no está configurado (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).");

  const headers = new Headers(init.headers);
  headers.set("apikey", config.key);
  // Las llaves antiguas (JWT) van también como Bearer; las nuevas `sb_secret_…` solo en `apikey`.
  if (config.key.startsWith("eyJ")) headers.set("Authorization", `Bearer ${config.key}`);
  headers.set("Content-Type", "application/json");
  if (init.prefer) headers.set("Prefer", init.prefer);

  const res = await fetch(`${config.url}/rest/v1/${path}`, {
    ...init,
    headers,
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) {
    const detalle = (await res.text()).slice(0, 300);
    throw new Error(`Supabase respondió ${res.status}: ${detalle}`);
  }
  return res;
}

/** Guarda un lead y devuelve su id. */
export async function insertLead(lead: NewLead): Promise<string> {
  const res = await request("leads?select=id", {
    method: "POST",
    body: JSON.stringify(lead),
    prefer: "return=representation",
  });
  const rows = (await res.json()) as { id: string }[];
  const id = rows[0]?.id;
  if (!id) throw new Error("Supabase no devolvió el id del lead.");
  return id;
}

// --- Aviso diario de farmacia de turno (tabla `suscripciones_farmacias`) ---

export interface SuscripcionActiva {
  email: string;
  comuna_slug: string;
  token: string;
}

export const TOKEN_REGEX = /^[0-9a-f]{64}$/;

/**
 * Crea la suscripción (sin confirmar) si el email no existía y devuelve su token.
 * Si ya existía no la modifica: los cambios solo se aplican al confirmar desde el correo.
 */
export async function registrarSuscripcion(email: string, comunaSlug: string, token: string, ipHash: string | null): Promise<string> {
  await request("suscripciones_farmacias?on_conflict=email", {
    method: "POST",
    body: JSON.stringify({ email, comuna_slug: comunaSlug, token, ip_hash: ipHash }),
    prefer: "resolution=ignore-duplicates,return=minimal",
  });
  const res = await request(`suscripciones_farmacias?select=token&email=eq.${encodeURIComponent(email)}`);
  const rows = (await res.json()) as { token: string }[];
  if (!rows[0]?.token) throw new Error("Supabase no devolvió el token de la suscripción.");
  return rows[0].token;
}

async function actualizarSuscripcion(token: string, cambios: Record<string, unknown>): Promise<boolean> {
  if (!TOKEN_REGEX.test(token)) return false;
  const res = await request(`suscripciones_farmacias?token=eq.${token}&select=id`, {
    method: "PATCH",
    body: JSON.stringify(cambios),
    prefer: "return=representation",
  });
  return ((await res.json()) as unknown[]).length > 0;
}

/** Confirma (o reactiva, o cambia de comuna) una suscripción. false si el token no existe. */
export const confirmarSuscripcion = (token: string, comunaSlug: string) =>
  actualizarSuscripcion(token, {
    confirmado: true,
    confirmado_en: new Date().toISOString(),
    baja_en: null,
    comuna_slug: comunaSlug,
  });

/** Da de baja una suscripción. false si el token no existe. */
export const darDeBajaSuscripcion = (token: string) =>
  actualizarSuscripcion(token, { baja_en: new Date().toISOString() });

const PAGINA = 1000;

/** Suscripciones confirmadas y sin baja, paginadas de a 1000 (máximo por defecto de PostgREST). */
export async function listarSuscripcionesActivas(): Promise<SuscripcionActiva[]> {
  const todas: SuscripcionActiva[] = [];
  for (let offset = 0; ; offset += PAGINA) {
    const res = await request(
      `suscripciones_farmacias?select=email,comuna_slug,token&confirmado=is.true&baja_en=is.null&order=id&limit=${PAGINA}&offset=${offset}`,
    );
    const rows = (await res.json()) as SuscripcionActiva[];
    todas.push(...rows);
    if (rows.length < PAGINA) return todas;
  }
}

// --- Directorio de negocios locales (tabla `negocios`) ---

export interface NuevoNegocio {
  nombre: string;
  rubro: string;
  comuna_slug: string;
  descripcion: string;
  telefono: string | null;
  sitio_web: string | null;
  instagram: string | null;
  contacto_nombre: string;
  email_contacto: string;
  quiere_sitio: boolean;
  ip_hash: string | null;
}

/** Columnas que se pueden mostrar en la página pública. */
export type NegocioPublico = Pick<
  NuevoNegocio,
  "nombre" | "rubro" | "comuna_slug" | "descripcion" | "telefono" | "sitio_web" | "instagram"
> & { id: string };

export async function insertNegocio(negocio: NuevoNegocio): Promise<void> {
  await request("negocios", { method: "POST", body: JSON.stringify(negocio), prefer: "return=minimal" });
}

export async function listarNegociosAprobados(): Promise<NegocioPublico[]> {
  const res = await request(
    "negocios?select=id,nombre,rubro,comuna_slug,descripcion,telefono,sitio_web,instagram&estado=eq.aprobado&order=rubro,nombre",
  );
  return (await res.json()) as NegocioPublico[];
}
