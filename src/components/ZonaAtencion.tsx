import Link from "next/link";
import { AREA_SERVED } from "@/lib/site";

// Bloque visible con las comunas que atendemos. Sus datos estructurados ya están
// en StructuredData (layout raíz, areaServed), así que aquí no se repite el JSON-LD.
export default function ZonaAtencion() {
  const comunas = AREA_SERVED.join(", ").replace(/, ([^,]*)$/, " y $1");

  return (
    <section aria-labelledby="zona-atencion" className="dys-light py-20 bg-dys-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <h2 id="zona-atencion" className="max-w-3xl text-titular-2 font-bold text-dys-text">
          Atendemos en {comunas}
        </h2>
        <p className="text-lg text-dys-muted max-w-2xl leading-relaxed">
          Nos juntamos en persona con negocios de la cuenca del Llanquihue y Puerto Montt, y trabajamos de forma remota con
          pymes de toda la Región de Los Lagos y Chile.
        </p>
        <p className="text-dys-muted max-w-2xl">
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
