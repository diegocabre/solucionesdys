import type { Metadata } from "next";
import Link from "next/link";
import FarmaciasTurno from "@/components/FarmaciasTurno";
import AvisoFarmaciasForm from "@/components/AvisoFarmaciasForm";
import { COMUNAS_AVISO } from "@/lib/aviso-farmacias";

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
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Soluciones DyS" }],
  },
};

export default function FarmaciasDeTurnoPage() {
  return (
    <div className="min-h-screen pt-12 pb-24 bg-dys-bg">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav aria-label="Migas de pan" className="text-sm text-dys-muted mb-8">
          <Link href="/comunidad" className="underline underline-offset-4 hover:text-dys-text">
            Comunidad Puerto Varas
          </Link>
          <span className="mx-2">/</span>
          <span className="text-dys-text">Farmacias de turno</span>
        </nav>

        <header className="max-w-3xl mb-12 space-y-5">
          <h1 className="firma-punto text-titular-1 font-bold text-dys-text">Farmacias de turno en Puerto Varas</h1>
          <p className="max-w-[56ch] text-lg sm:text-xl text-dys-muted leading-relaxed">
            Encuentra la farmacia que está de turno hoy en Puerto Varas y las comunas cercanas, con su
            dirección, horario y teléfono.
          </p>
        </header>

        <FarmaciasTurno />

        <AvisoFarmaciasForm comunas={COMUNAS_AVISO} />

        <section className="mt-16 grid gap-10 md:grid-cols-2">
          <div className="border-t border-dys-border pt-6 space-y-3">
            <h2 className="text-titular-3 font-semibold text-dys-text">
              Cómo funciona
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-dys-muted leading-relaxed">
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

          <div className="border-t border-dys-border pt-6 space-y-3">
            <h2 className="text-titular-3 font-semibold text-dys-text">
              API abierta
            </h2>
            <p className="text-dys-muted leading-relaxed">
              ¿Desarrollas un sitio o app local? Puedes consultar los mismos datos, ya limpios, en JSON:
            </p>
            <pre className="overflow-x-auto rounded-xl bg-dys-surface border border-dys-border p-4 text-xs leading-relaxed text-dys-text">
              <code>{`GET /api/farmacias-turno
GET /api/farmacias-turno?comuna=puerto-varas`}</code>
            </pre>
          </div>
        </section>
      </div>
    </div>
  );
}
