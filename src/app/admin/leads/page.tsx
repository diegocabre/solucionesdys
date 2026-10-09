import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import {
  LEAD_STATUSES,
  isLeadStatus,
  isSupabaseConfigured,
  listLeads,
  type Lead,
  type LeadStatus,
} from "@/lib/supabase/server";
import { logout, updateLeadStatus } from "../actions";

export const metadata: Metadata = { title: "Leads" };

const STATUS_LABEL: Record<LeadStatus, string> = {
  nuevo: "Nuevo",
  contactado: "Contactado",
  cerrado: "Cerrado",
  descartado: "Descartado",
};

const STATUS_CLASS: Record<LeadStatus, string> = {
  nuevo: "bg-green-50 text-green-800",
  contactado: "bg-blue-50 text-blue-800",
  cerrado: "bg-brand-accent/15 text-brand-accent-dark",
  descartado: "bg-gray-100 text-gray-600",
};

const fecha = (iso: string) =>
  new Intl.DateTimeFormat("es-CL", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Santiago",
  }).format(new Date(iso));

function LeadCard({ lead }: { lead: Lead }) {
  const origen = [lead.source_page, lead.utm_source, lead.utm_medium, lead.utm_campaign].filter(Boolean);
  return (
    <li className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-brand-primary">{lead.name}</p>
          <p className="text-sm text-gray-600">
            <a href={`mailto:${lead.email}`} className="underline underline-offset-2 hover:text-brand-primary">
              {lead.email}
            </a>
            {lead.phone && (
              <>
                {" · "}
                <a href={`tel:${lead.phone.replace(/[^\d+]/g, "")}`} className="hover:text-brand-primary">
                  {lead.phone}
                </a>
              </>
            )}
          </p>
        </div>
        <div className="text-right space-y-1">
          <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${STATUS_CLASS[lead.status]}`}>
            {STATUS_LABEL[lead.status]}
          </span>
          <p className="text-xs text-gray-500">{fecha(lead.created_at)}</p>
        </div>
      </div>

      <div className="text-sm space-y-1">
        <p className="font-medium text-gray-700">{lead.subject}</p>
        <p className="text-gray-600 whitespace-pre-line">{lead.message}</p>
        {origen.length > 0 && <p className="text-xs text-gray-500">Origen: {origen.join(" · ")}</p>}
      </div>

      <form action={updateLeadStatus} className="grid gap-3 sm:grid-cols-[10rem_1fr_auto] sm:items-start border-t border-gray-100 pt-4">
        <input type="hidden" name="id" value={lead.id} />
        <label className="sr-only" htmlFor={`status-${lead.id}`}>
          Estado
        </label>
        <select
          id={`status-${lead.id}`}
          name="status"
          defaultValue={lead.status}
          className="rounded-lg border border-gray-200 bg-white p-2 text-sm"
        >
          {LEAD_STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABEL[s]}
            </option>
          ))}
        </select>
        <label className="sr-only" htmlFor={`notes-${lead.id}`}>
          Notas
        </label>
        <textarea
          id={`notes-${lead.id}`}
          name="notes"
          rows={1}
          defaultValue={lead.notes ?? ""}
          placeholder="Notas internas"
          className="rounded-lg border border-gray-200 bg-white p-2 text-sm"
        />
        <button
          type="submit"
          className="rounded-md bg-brand-primary text-white px-4 py-2 text-sm font-medium hover:bg-brand-primary/90 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
        >
          Guardar
        </button>
      </form>
    </li>
  );
}

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string | string[] }>;
}) {
  const session = await requireAdmin();
  const { estado } = await searchParams;
  const filtro = typeof estado === "string" && isLeadStatus(estado) ? estado : undefined;

  let leads: Lead[] = [];
  let error = "";
  if (!isSupabaseConfigured()) {
    error = "Supabase no está configurado (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).";
  } else {
    try {
      leads = await listLeads({ status: filtro });
    } catch (e) {
      console.error("[admin] Error listando leads:", e);
      error = "No pudimos cargar los leads. Revisa los logs del servidor.";
    }
  }

  const filtros: { href: string; label: string; activo: boolean }[] = [
    { href: "/admin/leads", label: "Todos", activo: !filtro },
    ...LEAD_STATUSES.map((s) => ({ href: `/admin/leads?estado=${s}`, label: STATUS_LABEL[s], activo: filtro === s })),
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-primary">Leads</h1>
          <p className="text-sm text-gray-500">Sesión: {session.sub}</p>
        </div>
        <form action={logout}>
          <button type="submit" className="text-sm font-medium text-gray-600 hover:text-brand-primary underline underline-offset-2">
            Cerrar sesión
          </button>
        </form>
      </div>

      <nav aria-label="Filtrar por estado" className="flex flex-wrap gap-2">
        {filtros.map((f) => (
          <Link
            key={f.href}
            href={f.href}
            aria-current={f.activo ? "page" : undefined}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              f.activo
                ? "bg-brand-primary text-white border-brand-primary"
                : "bg-white text-foreground border-gray-200 hover:border-brand-accent"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </nav>

      {error ? (
        <p role="alert" className="p-4 bg-red-50 text-red-800 rounded-md text-sm border border-red-200">
          {error}
        </p>
      ) : leads.length === 0 ? (
        <p className="text-gray-500">No hay leads {filtro ? `con estado "${STATUS_LABEL[filtro]}"` : "todavía"}.</p>
      ) : (
        <ul className="space-y-4">
          {leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </ul>
      )}
    </div>
  );
}
