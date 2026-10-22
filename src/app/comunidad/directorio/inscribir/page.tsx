import type { Metadata } from "next";
import Link from "next/link";
import { Store } from "lucide-react";
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
    <div className="min-h-screen py-16 bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav aria-label="Migas de pan" className="text-sm text-gray-500 mb-8">
          <Link href="/comunidad" className="hover:text-brand-accent-dark">Comunidad Puerto Varas</Link>
          <span className="mx-2">/</span>
          <Link href="/comunidad/directorio" className="hover:text-brand-accent-dark">Directorio</Link>
          <span className="mx-2">/</span>
          <span className="text-brand-primary">Inscribir</span>
        </nav>

        <header className="mb-10 space-y-4">
          <span className="grid size-12 place-items-center rounded-xl bg-brand-accent/10 text-brand-accent-dark">
            <Store className="size-6" aria-hidden="true" />
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold text-brand-primary">Inscribe tu negocio gratis</h1>
          <p className="text-lg text-gray-600 font-light leading-relaxed">
            Completa la ficha y, después de revisarla, la publicamos en el directorio para que los vecinos y
            turistas te encuentren.
          </p>
        </header>

        <div className="rounded-3xl bg-white border border-gray-100 p-6 sm:p-10 shadow-sm">
          <InscribirNegocioForm rubros={RUBROS} comunas={COMUNAS_DIRECTORIO} />
        </div>
      </div>
    </div>
  );
}
