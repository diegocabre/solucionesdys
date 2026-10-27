import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, HeartHandshake, House, Lightbulb, Pill, Store } from "lucide-react";

export const metadata: Metadata = {
  title: "Comunidad Puerto Varas: servicios útiles para vecinos",
  description:
    "Servicios gratuitos para la comunidad de Puerto Varas y alrededores, creados por Soluciones DyS. Farmacias de turno con aviso diario por correo, directorio de negocios locales y cabañas en el sur.",
  alternates: { canonical: "/comunidad" },
  openGraph: {
    title: "Comunidad Puerto Varas | Soluciones DyS",
    description: "Servicios útiles y gratuitos para vecinos de Puerto Varas.",
    url: "/comunidad",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Soluciones DyS" }],
  },
};

export default function ComunidadPage() {
  return (
    <div className="min-h-screen py-16 bg-dys-bg relative overflow-hidden">
      <div className="absolute bottom-10 right-1/4 w-[600px] h-[600px] bg-dys-primary/5 rounded-full blur-3xl -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl mb-14 space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-dys-primary/10 border border-dys-primary/20">
            <HeartHandshake className="w-4 h-4 text-dys-primary" aria-hidden="true" />
            <span className="text-sm font-semibold tracking-wider text-dys-primary uppercase">
              Servicio a la comunidad
            </span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold text-dys-text">
            Comunidad{" "}
            <span className="text-dys-primary">Puerto Varas</span>
          </h1>
          <p className="text-lg sm:text-xl text-dys-muted font-light leading-relaxed">
            Herramientas útiles y gratuitas para los vecinos de Puerto Varas y alrededores. Somos de acá y
            usamos la tecnología para hacerle la vida más fácil a la comunidad.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          <Link
            href="/comunidad/farmacias-de-turno"
            className="group flex flex-col rounded-3xl bg-dys-surface border border-dys-border p-8 shadow-sm hover:shadow-xl hover:border-dys-primary transition-all focus:outline-none focus:ring-2 focus:ring-dys-primary focus:ring-offset-2"
          >
            <span className="grid size-12 place-items-center rounded-xl bg-dys-primary/10 text-dys-primary">
              <Pill className="size-6" aria-hidden="true" />
            </span>
            <h2 className="mt-5 text-2xl font-bold text-dys-text">Farmacias de turno</h2>
            <p className="mt-3 grow text-dys-muted leading-relaxed">
              Mira qué farmacia está de turno hoy en Puerto Varas, Llanquihue, Frutillar y Puerto Montt, con
              dirección, horario, teléfono y mapa. Y recíbela cada mañana en tu correo.
            </p>
            <span className="mt-6 inline-flex items-center gap-2 font-semibold text-dys-primary group-hover:text-dys-text">
              Ver farmacias
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </span>
          </Link>

          <Link
            href="/comunidad/directorio"
            className="group flex flex-col rounded-3xl bg-dys-surface border border-dys-border p-8 shadow-sm hover:shadow-xl hover:border-dys-primary transition-all focus:outline-none focus:ring-2 focus:ring-dys-primary focus:ring-offset-2"
          >
            <span className="grid size-12 place-items-center rounded-xl bg-dys-primary/10 text-dys-primary">
              <Store className="size-6" aria-hidden="true" />
            </span>
            <h2 className="mt-5 text-2xl font-bold text-dys-text">Directorio de negocios</h2>
            <p className="mt-3 grow text-dys-muted leading-relaxed">
              Negocios locales de Puerto Varas y alrededores, inscritos por sus dueños. ¿Tienes uno? Aparece gratis.
            </p>
            <span className="mt-6 inline-flex items-center gap-2 font-semibold text-dys-primary group-hover:text-dys-text">
              Ver directorio
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </span>
          </Link>

          <a
            href="https://reservas.solucionesdys.cl"
            target="_blank"
            rel="noopener"
            className="group flex flex-col rounded-3xl bg-dys-surface border border-dys-border p-8 shadow-sm hover:shadow-xl hover:border-dys-primary transition-all focus:outline-none focus:ring-2 focus:ring-dys-primary focus:ring-offset-2"
          >
            <span className="grid size-12 place-items-center rounded-xl bg-dys-primary/10 text-dys-primary">
              <House className="size-6" aria-hidden="true" />
            </span>
            <h2 className="mt-5 text-2xl font-bold text-dys-text">Cabañas en el sur</h2>
            <p className="mt-3 grow text-dys-muted leading-relaxed">
              Cabañas del sur de Chile con reserva directa: eliges la cabaña, pagas el abono y tratas con su
              dueño, sin intermediarios.
            </p>
            <span className="mt-6 inline-flex items-center gap-2 font-semibold text-dys-primary group-hover:text-dys-text">
              Ver cabañas
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true" />
              <span className="sr-only">(se abre en una pestaña nueva)</span>
            </span>
          </a>

          <Link
            href="/contacto"
            className="group flex flex-col rounded-3xl border-2 border-dashed border-dys-primary/50 bg-dys-primary/5 p-8 hover:bg-dys-primary/10 transition-colors focus:outline-none focus:ring-2 focus:ring-dys-primary focus:ring-offset-2"
          >
            <span className="grid size-12 place-items-center rounded-xl bg-dys-primary/20 text-dys-primary">
              <Lightbulb className="size-6" aria-hidden="true" />
            </span>
            <h2 className="mt-5 text-2xl font-bold text-dys-text">Próximamente más servicios</h2>
            <p className="mt-3 grow text-dys-muted leading-relaxed">
              Estamos empezando. ¿Qué información local te gustaría tener a mano? Cuéntanos tu idea.
            </p>
            <span className="mt-6 inline-flex items-center gap-2 font-semibold text-dys-primary group-hover:text-dys-text">
              Proponer un servicio
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
