import type { Metadata } from "next";
import Link from "next/link";
import { Code2, Info, Pill } from "lucide-react";
import FarmaciasTurno from "@/components/FarmaciasTurno";

export const metadata: Metadata = {
  title: "Farmacias de turno en Puerto Varas hoy",
  description:
    "Consulta qué farmacia está de turno hoy en Puerto Varas, Llanquihue, Frutillar y Puerto Montt: dirección, horario, teléfono y cómo llegar. Datos oficiales del MINSAL.",
  alternates: { canonical: "/comunidad/farmacias-de-turno" },
  openGraph: {
    title: "Farmacias de turno en Puerto Varas hoy | Soluciones DyS",
    description: "Qué farmacia está de turno hoy en Puerto Varas y alrededores, con mapa y teléfono.",
    url: "/comunidad/farmacias-de-turno",
    type: "website",
    images: [{ url: "/assets/img/og-image.jpg", width: 1200, height: 630, alt: "Soluciones DyS" }],
  },
};

export default function FarmaciasDeTurnoPage() {
  return (
    <div className="min-h-screen py-16 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-green/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-10 right-1/4 w-[600px] h-[600px] bg-brand-accent/5 rounded-full blur-3xl -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav aria-label="Migas de pan" className="text-sm text-gray-500 mb-8">
          <Link href="/comunidad" className="hover:text-brand-accent-dark">
            Comunidad Puerto Varas
          </Link>
          <span className="mx-2">/</span>
          <span className="text-brand-primary">Farmacias de turno</span>
        </nav>

        <header className="max-w-3xl mb-12 space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-green/10 border border-brand-green/20">
            <Pill className="w-4 h-4 text-brand-green" aria-hidden="true" />
            <span className="text-sm font-semibold tracking-wider text-brand-green uppercase">
              Servicio a la comunidad
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-brand-primary">
            Farmacias de turno en{" "}
            <span className="font-serif italic font-light text-brand-accent">Puerto Varas</span>
          </h1>
          <p className="text-lg text-gray-600 font-light leading-relaxed">
            Encuentra la farmacia que está de turno hoy en Puerto Varas y las comunas cercanas, con su
            dirección, horario y teléfono.
          </p>
        </header>

        <FarmaciasTurno />

        <section className="mt-16 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl bg-white border border-gray-100 p-6 space-y-3">
            <h2 className="flex items-center gap-2 text-lg font-bold text-brand-primary">
              <Info className="w-5 h-5 text-brand-accent-dark" aria-hidden="true" />
              Cómo funciona
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600 leading-relaxed">
              <li>
                Los datos vienen del servicio oficial de farmacias de turno del Ministerio de Salud (MINSAL) y se
                actualizan cada 15 minutos.
              </li>
              <li>Los turnos suelen comenzar a las 09:00 y terminar a las 08:59 del día siguiente.</li>
              <li>
                Si vas de noche o de madrugada, <strong>llama antes</strong>: un cambio de última hora puede no
                estar reflejado todavía.
              </li>
            </ul>
          </div>

          <div className="rounded-3xl bg-brand-primary text-white p-6 space-y-3">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <Code2 className="w-5 h-5 text-brand-accent-light" aria-hidden="true" />
              API abierta
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              ¿Desarrollas un sitio o app local? Puedes consultar los mismos datos, ya limpios, en JSON:
            </p>
            <pre className="overflow-x-auto rounded-xl bg-black/30 p-4 text-xs leading-relaxed text-brand-accent-light">
              <code>{`GET /api/farmacias-turno
GET /api/farmacias-turno?comuna=puerto-varas`}</code>
            </pre>
          </div>
        </section>
      </div>
    </div>
  );
}
