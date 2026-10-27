import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Quote, TrendingUp } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import { getCasoVisible, getCasosVisibles } from "@/lib/casos";
import { SITE_URL } from "@/lib/site";

// Solo existen las rutas de los casos visibles (en producción: los publicados).
export const dynamicParams = false;

export function generateStaticParams() {
  return getCasosVisibles().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const caso = getCasoVisible(slug);
  if (!caso) return {};

  const title = `Caso de éxito: ${caso.cliente}`;
  const description = `Cómo ayudamos a ${caso.cliente} (${caso.rubro}, ${caso.ciudad}) con su sitio web: el problema, la solución y los resultados medidos.`;
  return {
    title,
    description,
    alternates: { canonical: `/webs/casos/${caso.slug}` },
    openGraph: {
      title: `${title} | Soluciones DyS`,
      description,
      url: `/webs/casos/${caso.slug}`,
      type: "article",
      images: [{ url: caso.imagen, alt: `Sitio web de ${caso.cliente}` }],
    },
    // Los borradores solo se ven en desarrollo, pero por si acaso: fuera de buscadores.
    robots: caso.published ? undefined : { index: false, follow: false },
  };
}

export default async function CasoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const caso = getCasoVisible(slug);
  if (!caso) notFound();

  const url = `${SITE_URL}/webs/casos/${caso.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: `Caso de éxito: ${caso.cliente}`,
        description: caso.solucion,
        image: `${SITE_URL}${caso.imagen}`,
        url,
        inLanguage: "es-CL",
        author: { "@id": `${SITE_URL}/#business` },
        publisher: { "@id": `${SITE_URL}/#business` },
        about: { "@type": "Organization", name: caso.cliente, url: caso.url },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Sitios web", item: `${SITE_URL}/webs` },
          { "@type": "ListItem", position: 3, name: caso.cliente, item: url },
        ],
      },
      // Reseña solo si el testimonio es real y el caso está publicado.
      ...(caso.published && caso.testimonio
        ? [
            {
              "@type": "Review",
              itemReviewed: { "@id": `${SITE_URL}/#business` },
              reviewBody: caso.testimonio.texto,
              author: { "@type": "Person", name: caso.testimonio.autor },
              ...(caso.testimonio.calificacion
                ? { reviewRating: { "@type": "Rating", ratingValue: caso.testimonio.calificacion, bestRating: 5 } }
                : {}),
            },
          ]
        : []),
    ],
  };

  return (
    <div className="bg-dys-bg py-12 pb-24">
      <JsonLd data={jsonLd} />
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <nav aria-label="Migas de pan" className="text-sm text-dys-muted">
          <Link href="/webs" className="hover:text-dys-text">
            Sitios web
          </Link>{" "}
          / <span className="text-dys-text">{caso.cliente}</span>
        </nav>

        <header className="space-y-4">
          {!caso.published && (
            <p className="inline-block rounded-full bg-dys-accent/10 text-dys-accent text-xs font-semibold px-3 py-1">
              Borrador: completa los datos en src/lib/casos.ts y cambia published a true
            </p>
          )}
          <p className="text-sm font-semibold text-dys-primary uppercase tracking-wider">
            {caso.rubro} · {caso.ciudad}
          </p>
          <h1 className="text-4xl lg:text-5xl font-bold text-dys-text">{caso.cliente}</h1>
          <a
            href={caso.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-dys-text underline decoration-dys-link underline-offset-4 hover:text-dys-link"
          >
            Visitar el sitio <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
          </a>
        </header>

        <div className="relative aspect-[24/11] rounded-3xl overflow-hidden border border-dys-border/60 shadow-xl bg-dys-surface">
          <Image
            src={caso.imagen}
            alt={`Sitio web de ${caso.cliente} desarrollado por Soluciones DyS`}
            fill
            priority
            sizes="(min-width: 896px) 896px, 100vw"
            className="object-cover object-top"
          />
        </div>

        <section aria-labelledby="resultados" className="space-y-6">
          <h2 id="resultados" className="text-2xl font-bold text-dys-text">
            Resultados
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            {caso.resultados.map((r) => (
              <li key={r.metrica} className="bg-dys-surface rounded-2xl border border-dys-border p-5 space-y-2">
                <p className="flex items-center gap-2 text-sm text-dys-muted">
                  <TrendingUp className="w-4 h-4 text-dys-primary" aria-hidden="true" />
                  {r.metrica}
                </p>
                <p className="text-2xl font-bold text-dys-text">
                  {r.antes} <span className="text-dys-primary">→</span> {r.despues}
                </p>
                <p className="text-xs text-dys-muted">{r.periodo}</p>
              </li>
            ))}
          </ul>
        </section>

        <div className="grid gap-8 md:grid-cols-2">
          <section aria-labelledby="problema" className="space-y-3">
            <h2 id="problema" className="text-2xl font-bold text-dys-text">
              El desafío
            </h2>
            <p className="text-dys-text leading-relaxed">{caso.problema}</p>
          </section>
          <section aria-labelledby="solucion" className="space-y-3">
            <h2 id="solucion" className="text-2xl font-bold text-dys-text">
              Lo que hicimos
            </h2>
            <p className="text-dys-text leading-relaxed">{caso.solucion}</p>
            <p className="text-sm text-dys-muted">Tecnología: {caso.stack.join(", ")}.</p>
          </section>
        </div>

        {caso.testimonio && (
          <figure className="bg-dys-surface rounded-3xl border border-dys-border p-8 space-y-4">
            <Quote className="w-8 h-8 text-dys-primary" aria-hidden="true" />
            <blockquote className="text-lg text-dys-text leading-relaxed">{caso.testimonio.texto}</blockquote>
            <figcaption className="text-sm text-dys-muted">
              <strong className="text-dys-text">{caso.testimonio.autor}</strong>, {caso.testimonio.cargo}
            </figcaption>
          </figure>
        )}

        <section className="bg-dys-surface rounded-3xl p-8 sm:p-12 text-center text-dys-text space-y-4">
          <h2 className="text-3xl font-bold">¿Quieres resultados así para tu negocio?</h2>
          <p className="text-dys-muted font-light max-w-xl mx-auto">
            Cuéntanos qué necesitas y te respondemos con una propuesta clara, sin compromiso.
          </p>
          <Link
            href="/contacto"
            className="inline-flex items-center justify-center h-11 px-8 mt-2 rounded-md bg-dys-surface text-dys-text text-lg font-medium hover:bg-dys-surface transition-colors focus:outline-none focus:ring-2 focus:ring-dys-primary focus:ring-offset-2"
          >
            Cotizar mi sitio
          </Link>
        </section>
      </article>
    </div>
  );
}
