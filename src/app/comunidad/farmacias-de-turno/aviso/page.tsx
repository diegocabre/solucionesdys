import type { Metadata } from "next";
import Link from "next/link";
import GestionarAviso from "@/components/GestionarAviso";
import { nombreComuna } from "@/lib/aviso-farmacias";

export const metadata: Metadata = {
  title: "Aviso de farmacia de turno",
  robots: { index: false, follow: false },
};

// Destino de los enlaces de los correos. No confirma ni da de baja al abrirse: lo hace el
// botón (POST), así los antivirus de correo que abren los enlaces no actúan por la persona.
export default async function AvisoPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const { accion, token = "", comuna = "" } = await searchParams;
  const nombre = nombreComuna(comuna);
  const valida = (accion === "confirmar" && nombre) || accion === "baja";

  return (
    <div className="min-h-[70vh] py-16 bg-dys-bg">
      <div className="max-w-xl mx-auto px-4 sm:px-6">
        <div className="rounded-xl bg-dys-surface border border-dys-border p-8 space-y-5">
          {valida ? (
            <>
              <h1 className="text-titular-2 font-bold text-dys-text">
                {accion === "confirmar" ? `Aviso de farmacia de turno en ${nombre}` : "Dejar de recibir el aviso"}
              </h1>
              <p className="text-dys-muted leading-relaxed">
                {accion === "confirmar"
                  ? "Confirma y te llegará cada mañana un correo con la farmacia de turno de tu comuna."
                  : "Si te das de baja, dejarás de recibir el correo diario con la farmacia de turno."}
              </p>
              <GestionarAviso accion={accion} token={token} comuna={comuna} />
            </>
          ) : (
            <>
              <h1 className="text-titular-2 font-bold text-dys-text">Enlace no válido</h1>
              <p className="text-dys-muted">Revisa que hayas abierto el enlace completo del correo.</p>
            </>
          )}
          <Link href="/comunidad/farmacias-de-turno" className="inline-block font-semibold text-dys-link underline underline-offset-4 hover:text-dys-text">
            Volver a farmacias de turno
          </Link>
        </div>
      </div>
    </div>
  );
}
