import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Button from "@/components/Button";
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
    <div className="bg-dys-bg pt-12 pb-24">
      <JsonLd data={jsonLd} />
      <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        <nav aria-label="Migas de pan" className="text-sm text-dys-muted">
          <Link href="/webs" className="underline underline-offset-4 hover:text-dys-text">
            Sitios web
          </Link>{" "}
          / <span className="text-dys-text">{caso.cliente}</span>
        </nav>

        <header className="space-y-5">
          {!caso.published && (
            <p className="text-sm font-semibold text-dys-muted">
              Borrador: completa los datos en src/lib/casos.ts y cambia published a true
            </p>
          )}
          <h1 className="firma-punto text-titular-1 font-bold text-dys-text">{caso.cliente}</h1>
          <p className="text-lg sm:text-xl text-dys-muted">
            {caso.rubro}, en {caso.ciudad}
          </p>
          <a
            href={caso.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block font-semibold text-dys-text underline decoration-dys-link decoration-2 underline-offset-4 hover:text-dys-link"
          >
            Visitar el sitio de {caso.cliente}
            <span className="sr-only"> (abre en una pestaña nueva)</span>
          </a>
        </header>

        <div className="relative aspect-[24/11] rounded-xl overflow-hidden border border-dys-border">
          <Image
            src={caso.imagen}
            alt={`Sitio web de ${caso.cliente} desarrollado por Soluciones DyS`}
            fill
            priority
            sizes="(min-width: 1024px) 976px, 100vw"
            className="object-cover object-top"
          />
        </div>

        <section aria-labelledby="resultados" className="space-y-6">
          <h2 id="resultados" className="text-titular-2 font-bold text-dys-text">
            Resultados
          </h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 border-t border-dys-border">
            {caso.resultados.map((r) => (
              <div key={r.metrica} className="border-b border-dys-border py-6">
                <dt className="text-dys-muted">{r.metrica}</dt>
                <dd className="mt-2 font-display text-titular-3 font-semibold text-dys-text">
                  {r.antes} → {r.despues}
                </dd>
                <dd className="mt-1 text-sm text-dys-muted">{r.periodo}</dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="grid gap-10 md:grid-cols-2">
          <section aria-labelledby="problema" className="space-y-3">
            <h2 id="problema" className="text-titular-3 font-semibold text-dys-text">
              El desafío
            </h2>
            <p className="text-dys-text leading-relaxed">{caso.problema}</p>
          </section>
          <section aria-labelledby="solucion" className="space-y-3">
            <h2 id="solucion" className="text-titular-3 font-semibold text-dys-text">
              Lo que hicimos
            </h2>
            <p className="text-dys-text leading-relaxed">{caso.solucion}</p>
            <p className="text-sm text-dys-muted">Tecnología: {caso.stack.join(", ")}.</p>
          </section>
        </div>

        {caso.testimonio && (
          <figure className="border-l-4 border-dys-text/30 pl-6 sm:pl-8 space-y-4">
            <blockquote className="font-display text-titular-3 font-medium text-dys-text">
              {caso.testimonio.texto}
            </blockquote>
            <figcaption className="text-dys-muted">
              <strong className="text-dys-text">{caso.testimonio.autor}</strong>, {caso.testimonio.cargo}
            </figcaption>
          </figure>
        )}

        <section aria-labelledby="cierre-caso" className="dys-light bg-dys-bg rounded-xl p-8 sm:p-12 text-dys-text space-y-5">
          <h2 id="cierre-caso" className="text-titular-2 font-bold">
            ¿Quieres resultados así para tu negocio?
          </h2>
          <p className="max-w-xl text-lg text-dys-muted">
            Cuéntanos qué necesitas y te respondemos con una propuesta clara, sin compromiso.
          </p>
          <Button size="lg" href="/contacto">
            Cotizar mi sitio
          </Button>
        </section>
      </article>
    </div>
  );
}
