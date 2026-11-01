import Image from "next/image";
import Link from "next/link";
import { getCasosVisibles } from "@/lib/casos";

// Casos de éxito con sus resultados medibles. Si no hay casos
// publicados (en producción), la sección no se muestra.
export default function CasosDeExito() {
  const casos = getCasosVisibles();
  if (casos.length === 0) return null;

  return (
    <section aria-labelledby="casos-de-exito" className="py-24 border-t border-dys-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="max-w-2xl space-y-4">
          <h2 id="casos-de-exito" className="text-titular-2 font-bold text-dys-text">
            Casos de éxito
          </h2>
          <p className="text-lg text-dys-muted leading-relaxed">
            Lo que cambió para nuestros clientes después de lanzar su sitio, medido antes y después.
          </p>
        </div>

        <ul className="border-t border-dys-border">
          {casos.map((caso) => (
            <li key={caso.slug} className="border-b border-dys-border py-10">
              <article className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-8 lg:gap-12 items-start">
                <div className="relative aspect-[24/11] overflow-hidden rounded-xl border border-dys-border">
                  <Image
                    src={caso.imagen}
                    alt={`Sitio web de ${caso.cliente}`}
                    fill
                    sizes="(min-width: 1024px) 500px, 100vw"
                    className="object-cover object-top"
                  />
                </div>
                <div className="space-y-4">
                  {!caso.published && (
                    <p className="text-sm font-semibold text-dys-muted">Borrador: no se publica</p>
                  )}
                  <h3 className="text-titular-3 font-semibold text-dys-text">{caso.cliente}</h3>
                  <p className="text-dys-muted">
                    {caso.rubro}, en {caso.ciudad}
                  </p>
                  <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {caso.resultados.slice(0, 3).map((r) => (
                      <div key={r.metrica}>
                        <dt className="text-sm text-dys-muted">{r.metrica}</dt>
                        <dd className="mt-1 font-semibold text-dys-text">
                          {r.antes} → {r.despues}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <Link
                    href={`/webs/casos/${caso.slug}`}
                    className="inline-block font-semibold text-dys-link underline underline-offset-4 hover:text-dys-text"
                  >
                    Ver el caso de {caso.cliente}
                  </Link>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
