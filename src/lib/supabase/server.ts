import "server-only";

// Cliente mínimo de Supabase para el servidor, sobre su API REST (PostgREST).
// Usa la service role key, que salta RLS: NUNCA debe llegar al navegador ni
// llevar el prefijo NEXT_PUBLIC. No usamos @supabase/supabase-js porque solo
// necesitamos insertar, listar y actualizar la tabla `leads`.

export const LEAD_STATUSES = ["nuevo", "contactado", "cerrado", "descartado"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const isLeadStatus = (value: string): value is LeadStatus =>
  (LEAD_STATUSES as readonly string[]).includes(value);

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

export interface Lead extends NewLead {
  id: string;
  created_at: string;
  status: LeadStatus;
  notes: string | null;
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

export async function listLeads({ status, limit = 200 }: { status?: LeadStatus; limit?: number } = {}): Promise<Lead[]> {
  const params = new URLSearchParams({ select: "*", order: "created_at.desc", limit: String(limit) });
  if (status) params.set("status", `eq.${status}`);
  const res = await request(`leads?${params}`);
  return (await res.json()) as Lead[];
}

export async function updateLead(id: string, changes: { status: LeadStatus; notes: string | null }): Promise<void> {
  const params = new URLSearchParams({ id: `eq.${id}` });
  await request(`leads?${params}`, {
    method: "PATCH",
    body: JSON.stringify(changes),
    prefer: "return=minimal",
  });
}
