import Link from "next/link";
import { MapPin } from "lucide-react";
import { AREA_SERVED } from "@/lib/site";

// Bloque visible con las comunas que atendemos. Sus datos estructurados ya están
// en StructuredData (layout raíz, areaServed), así que aquí no se repite el JSON-LD.
export default function ZonaAtencion() {
  const comunas = AREA_SERVED.join(", ").replace(/, ([^,]*)$/, " y $1");

  return (
    <section aria-labelledby="zona-atencion" className="dys-light py-16 bg-dys-bg border-y border-dys-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <MapPin className="w-8 h-8 text-dys-primary" aria-hidden="true" />
        <h2 id="zona-atencion" className="max-w-3xl text-3xl font-bold text-dys-text">
          Atendemos en {comunas}
        </h2>
        <p className="text-dys-muted font-light max-w-2xl leading-relaxed">
          Nos juntamos en persona con negocios de la cuenca del Llanquihue y Puerto Montt, y trabajamos de forma remota con
          pymes de toda la Región de Los Lagos y Chile.
        </p>
        <p className="text-sm text-dys-muted">
          ¿Quieres que tu negocio aparezca cuando te buscan en tu comuna? Lee nuestra guía para{" "}
          <Link
            href="/blog/aparecer-en-google-maps-puerto-varas"
            className="text-dys-link underline underline-offset-2 hover:text-dys-text"
          >
            aparecer en Google Maps en Puerto Varas
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
