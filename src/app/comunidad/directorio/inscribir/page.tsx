import type { Metadata } from "next";
import Link from "next/link";
import InscribirNegocioForm from "@/components/InscribirNegocioForm";
import { COMUNAS_DIRECTORIO, RUBROS } from "@/lib/directorio";

export const metadata: Metadata = {
  title: "Inscribe tu negocio en el directorio de Puerto Varas",
  description:
    "Aparece gratis en el directorio de negocios locales de Puerto Varas, Llanquihue, Frutillar y alrededores.",
  alternates: { canonical: "/comunidad/directorio/inscribir" },
};

export default function InscribirNegocioPage() {
  return (
    <div className="min-h-screen py-16 bg-dys-bg">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav aria-label="Migas de pan" className="text-sm text-dys-muted mb-8">
          <Link href="/comunidad" className="underline underline-offset-4 hover:text-dys-text">Comunidad Puerto Varas</Link>
          <span className="mx-2">/</span>
          <Link href="/comunidad/directorio" className="underline underline-offset-4 hover:text-dys-text">Directorio</Link>
          <span className="mx-2">/</span>
          <span className="text-dys-text">Inscribir</span>
        </nav>

        <header className="mb-10 space-y-6">
          <h1 className="firma-punto text-titular-1 font-bold text-dys-text">Inscribe tu negocio gratis</h1>
          <p className="text-lg sm:text-xl text-dys-muted leading-relaxed">
            Completa la ficha y, después de revisarla, la publicamos en el directorio para que los vecinos y
            turistas te encuentren.
          </p>
        </header>

        <div className="rounded-xl bg-dys-surface border border-dys-border p-6 sm:p-10">
          <InscribirNegocioForm rubros={RUBROS} comunas={COMUNAS_DIRECTORIO} />
        </div>
      </div>
    </div>
  );
}
