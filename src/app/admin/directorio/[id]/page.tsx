import Link from "next/link";
import { notFound } from "next/navigation";
import { exigirAdmin } from "@/lib/admin";
import { COMUNAS_DIRECTORIO, RUBROS } from "@/lib/directorio";
import { obtenerNegocioAdmin } from "@/lib/supabase/server";
import EditarNegocioForm from "./EditarNegocioForm";

export const dynamic = "force-dynamic";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function EditarNegocioPage({ params }: { params: Promise<{ id: string }> }) {
  await exigirAdmin();
  const { id } = await params;
  if (!UUID_REGEX.test(id)) notFound();
  const negocio = await obtenerNegocioAdmin(id);
  if (!negocio) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <Link href="/admin/directorio" className="text-sm text-brand-accent-dark underline underline-offset-2">
        ← Volver al panel
      </Link>
      <h1 className="text-3xl font-bold text-brand-primary">Editar {negocio.nombre}</h1>
      <div className="rounded-3xl bg-white border border-gray-100 p-6 sm:p-8 shadow-sm">
        <EditarNegocioForm negocio={negocio} rubros={RUBROS} comunas={COMUNAS_DIRECTORIO} />
      </div>
    </div>
  );
}
