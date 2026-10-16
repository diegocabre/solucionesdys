import "server-only";

// Cliente mínimo de Supabase para el servidor, sobre su API REST (PostgREST).
// Usa la service role key, que salta RLS: NUNCA debe llegar al navegador ni
// llevar el prefijo NEXT_PUBLIC. No usamos @supabase/supabase-js porque solo
// necesitamos insertar en la tabla `leads`.

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
