import Link from "next/link";
import { MapPin } from "lucide-react";
import { AREA_SERVED } from "@/lib/site";

// Bloque visible con las comunas que atendemos. Sus datos estructurados ya están
// en StructuredData (layout raíz, areaServed), así que aquí no se repite el JSON-LD.
export default function ZonaAtencion() {
  const comunas = AREA_SERVED.join(", ").replace(/, ([^,]*)$/, " y $1");

  return (
    <section aria-labelledby="zona-atencion" className="py-16 bg-white border-y border-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <MapPin className="w-8 h-8 text-brand-accent-dark mx-auto" aria-hidden="true" />
        <h2 id="zona-atencion" className="text-3xl font-bold text-brand-primary font-serif">
          Atendemos en {comunas}
        </h2>
        <p className="text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">
          Nos juntamos en persona con negocios de la cuenca del Llanquihue y Puerto Montt, y trabajamos de forma remota con
          pymes de toda la Región de Los Lagos y Chile.
        </p>
        <ul className="flex flex-wrap justify-center gap-2">
          {AREA_SERVED.map((comuna) => (
            <li
              key={comuna}
              className="rounded-full border border-brand-primary/10 bg-brand-primary/5 px-4 py-1.5 text-sm font-medium text-brand-primary"
            >
              {comuna}
            </li>
          ))}
        </ul>
        <p className="text-sm text-gray-500">
          ¿Quieres que tu negocio aparezca cuando te buscan en tu comuna? Lee nuestra guía para{" "}
          <Link
            href="/blog/aparecer-en-google-maps-puerto-varas"
            className="text-brand-accent-dark underline underline-offset-2 hover:text-brand-primary"
          >
            aparecer en Google Maps en Puerto Varas
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
