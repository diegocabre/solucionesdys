import Image from "next/image";
import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";
import { getCasosVisibles } from "@/lib/casos";

// Tarjetas de casos de éxito con sus resultados medibles. Si no hay casos
// publicados (en producción), la sección no se muestra.
export default function CasosDeExito() {
  const casos = getCasosVisibles();
  if (casos.length === 0) return null;

  return (
    <section aria-labelledby="casos-de-exito" className="mb-24 space-y-12">
      <div className="text-center space-y-2">
        <span className="text-xs font-semibold text-dys-primary uppercase bg-dys-primary/10 px-3 py-1 rounded-full">
          Resultados reales
        </span>
        <h2 id="casos-de-exito" className="text-3xl font-bold text-dys-text">
          Casos de éxito
        </h2>
        <p className="text-dys-muted font-light max-w-xl mx-auto">
          Lo que cambió para nuestros clientes después de lanzar su sitio, medido antes y después.
        </p>
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {casos.map((caso) => (
          <li key={caso.slug}>
            <article className="h-full bg-dys-surface rounded-3xl border border-dys-border shadow-xs hover:shadow-xl transition-all overflow-hidden flex flex-col">
              <div className="relative aspect-[24/11] bg-dys-surface">
                <Image
                  src={caso.imagen}
                  alt={`Sitio web de ${caso.cliente}`}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover object-top"
                />
                {!caso.published && (
                  <span className="absolute top-3 left-3 rounded-full bg-dys-accent/10 text-dys-accent text-xs font-semibold px-3 py-1">
                    Borrador (no se publica)
                  </span>
                )}
              </div>
              <div className="p-6 space-y-4 flex flex-col grow">
                <div>
                  <h3 className="text-xl font-bold text-dys-text">{caso.cliente}</h3>
                  <p className="text-sm text-dys-muted">
                    {caso.rubro} · {caso.ciudad}
                  </p>
                </div>
                <ul className="space-y-2 grow">
                  {caso.resultados.slice(0, 3).map((r) => (
                    <li key={r.metrica} className="flex gap-2 text-sm">
                      <TrendingUp className="w-4 h-4 mt-0.5 text-dys-primary shrink-0" aria-hidden="true" />
                      <span>
                        <span className="text-dys-muted">{r.metrica}:</span>{" "}
                        <strong className="text-dys-text">
                          {r.antes} → {r.despues}
                        </strong>
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/webs/casos/${caso.slug}`}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-dys-primary hover:text-dys-text transition-colors"
                >
                  Ver el caso completo <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
