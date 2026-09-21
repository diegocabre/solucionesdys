import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, HeartHandshake, Lightbulb, Pill } from "lucide-react";

export const metadata: Metadata = {
  title: "Comunidad Puerto Varas: servicios útiles para vecinos",
  description:
    "Servicios gratuitos para la comunidad de Puerto Varas y alrededores, creados por Soluciones DyS. Empezamos con las farmacias de turno.",
  alternates: { canonical: "/comunidad" },
  openGraph: {
    title: "Comunidad Puerto Varas | Soluciones DyS",
    description: "Servicios útiles y gratuitos para vecinos de Puerto Varas.",
    url: "/comunidad",
    type: "website",
    images: [{ url: "/assets/img/og-image.jpg", width: 1200, height: 630, alt: "Soluciones DyS" }],
  },
};

export default function ComunidadPage() {
  return (
    <div className="min-h-screen py-16 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-green/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-10 right-1/4 w-[600px] h-[600px] bg-brand-accent/5 rounded-full blur-3xl -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl mb-14 space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-green/10 border border-brand-green/20">
            <HeartHandshake className="w-4 h-4 text-brand-green" aria-hidden="true" />
            <span className="text-sm font-semibold tracking-wider text-brand-green uppercase">
              Servicio a la comunidad
            </span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold text-brand-primary">
            Comunidad{" "}
            <span className="font-serif italic font-light text-brand-accent">Puerto Varas</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 font-light leading-relaxed">
            Herramientas útiles y gratuitas para los vecinos de Puerto Varas y alrededores. Somos de acá y
            usamos la tecnología para hacerle la vida más fácil a la comunidad.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          <Link
            href="/comunidad/farmacias-de-turno"
            className="group flex flex-col rounded-3xl bg-white border border-gray-100 p-8 shadow-sm hover:shadow-xl hover:border-brand-accent transition-all focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
          >
            <span className="grid size-12 place-items-center rounded-xl bg-brand-green/10 text-brand-green">
              <Pill className="size-6" aria-hidden="true" />
            </span>
            <h2 className="mt-5 text-2xl font-bold font-serif text-brand-primary">Farmacias de turno</h2>
            <p className="mt-3 grow text-gray-600 leading-relaxed">
              Mira qué farmacia está de turno hoy en Puerto Varas, Llanquihue, Frutillar y Puerto Montt, con
              dirección, horario, teléfono y mapa.
            </p>
            <span className="mt-6 inline-flex items-center gap-2 font-semibold text-brand-accent-dark group-hover:text-brand-primary">
              Ver farmacias
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </span>
          </Link>

          <Link
            href="/contacto"
            className="group flex flex-col rounded-3xl border-2 border-dashed border-brand-accent/50 bg-brand-accent/5 p-8 hover:bg-brand-accent/10 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
          >
            <span className="grid size-12 place-items-center rounded-xl bg-brand-accent/20 text-brand-accent-dark">
              <Lightbulb className="size-6" aria-hidden="true" />
            </span>
            <h2 className="mt-5 text-2xl font-bold font-serif text-brand-primary">Próximamente más servicios</h2>
            <p className="mt-3 grow text-gray-600 leading-relaxed">
              Estamos empezando. ¿Qué información local te gustaría tener a mano? Cuéntanos tu idea.
            </p>
            <span className="mt-6 inline-flex items-center gap-2 font-semibold text-brand-accent-dark group-hover:text-brand-primary">
              Proponer un servicio
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
