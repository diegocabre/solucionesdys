import type { Metadata } from "next";
import Link from "next/link";

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

// Servicios a la comunidad; externo = abre otro sitio en una pestaña nueva.
const SERVICIOS = [
  {
    titulo: "Farmacias de turno",
    descripcion:
      "Mira qué farmacia está de turno hoy en Puerto Varas, Llanquihue, Frutillar y Puerto Montt, con dirección, horario, teléfono y mapa. Y recíbela cada mañana en tu correo.",
    href: "/comunidad/farmacias-de-turno",
    accion: "Ver farmacias de turno",
    externo: false,
  },
  {
    titulo: "Directorio de negocios",
    descripcion: "Negocios locales de Puerto Varas y alrededores, inscritos por sus dueños. ¿Tienes uno? Aparece gratis.",
    href: "/comunidad/directorio",
    accion: "Ver el directorio",
    externo: false,
  },
  {
    titulo: "Cabañas en el sur",
    descripcion:
      "Cabañas del sur de Chile con reserva directa: eliges la cabaña, pagas el abono y tratas con su dueño, sin intermediarios.",
    href: "https://reservas.solucionesdys.cl",
    accion: "Ver cabañas",
    externo: true,
  },
];

export default function ComunidadPage() {
  return (
    <div className="bg-dys-bg">
      <section className="pt-16 pb-12 sm:pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <h1 className="firma-punto max-w-[14ch] text-titular-1 font-bold text-dys-text">Comunidad Puerto Varas</h1>
          <p className="max-w-[56ch] text-lg sm:text-xl text-dys-muted leading-relaxed">
            Herramientas útiles y gratuitas para los vecinos de Puerto Varas y alrededores. Somos de acá y usamos la
            tecnología para hacerle la vida más fácil a la comunidad.
          </p>
        </div>
      </section>

      {/* Servicios como lista tipográfica, igual que los sitios reales de la home */}
      <section aria-label="Servicios a la comunidad" className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="border-t border-dys-border">
            {SERVICIOS.map((s) => (
              <li key={s.titulo} className="border-b border-dys-border py-8 sm:py-10">
                <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-4 lg:gap-12">
                  <h2 className="text-titular-2 font-bold text-dys-text">{s.titulo}</h2>
                  <div className="space-y-4">
                    <p className="max-w-[60ch] text-lg text-dys-muted leading-relaxed">{s.descripcion}</p>
                    {s.externo ? (
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener"
                        className="inline-block font-semibold text-dys-link underline underline-offset-4 hover:text-dys-text"
                      >
                        {s.accion}
                        <span className="sr-only"> (se abre en una pestaña nueva)</span>
                      </a>
                    ) : (
                      <Link
                        href={s.href}
                        className="inline-block font-semibold text-dys-link underline underline-offset-4 hover:text-dys-text"
                      >
                        {s.accion}
                      </Link>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <p className="mt-10 max-w-[60ch] text-lg text-dys-muted leading-relaxed">
            Estamos empezando. ¿Qué información local te gustaría tener a mano?{" "}
            <Link href="/contacto" className="font-semibold text-dys-link underline underline-offset-4 hover:text-dys-text">
              Propón un servicio
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
