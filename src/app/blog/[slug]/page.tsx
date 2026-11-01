import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import { formatPostDate, getPost, getPosts, getRelatedPosts } from "@/lib/blog";
import { SITE_URL } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    alternates: { canonical: `/blog/${post.slug}` },
    // La imagen la genera opengraph-image.tsx de esta misma carpeta.
    openGraph: {
      title: post.title,
      description: post.description,
      url: `/blog/${post.slug}`,
      type: "article",
      locale: "es_CL",
      publishedTime: post.date,
      modifiedTime: post.updated,
      tags: post.tags,
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.description },
    robots: post.draft ? { index: false, follow: false } : undefined,
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const { default: Content } = await import(`../../../../content/blog/${post.slug}.mdx`);
  const related = getRelatedPosts(post);
  const url = `${SITE_URL}/blog/${post.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        headline: post.title,
        description: post.description,
        url,
        mainEntityOfPage: url,
        image: `${url}/opengraph-image`,
        datePublished: post.date,
        dateModified: post.updated,
        inLanguage: "es-CL",
        keywords: post.tags.join(", "),
        author: { "@id": `${SITE_URL}/#business` },
        publisher: { "@id": `${SITE_URL}/#business` },
        ...(post.ciudad ? { contentLocation: { "@type": "Place", name: `${post.ciudad}, Chile` } } : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
          { "@type": "ListItem", position: 3, name: post.title, item: url },
        ],
      },
    ],
  };

  const toc = post.headings.filter((h) => h.level === 2);

  return (
    <div className="bg-dys-bg py-12 pb-24">
      <JsonLd data={jsonLd} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav aria-label="Migas de pan" className="text-sm text-dys-muted mb-8">
          <Link href="/" className="hover:text-dys-text">
            Inicio
          </Link>{" "}
          /{" "}
          <Link href="/blog" className="underline underline-offset-4 hover:text-dys-text">
            Blog
          </Link>
        </nav>

        <div className="grid gap-12 lg:grid-cols-[1fr_16rem]">
          <article className="min-w-0 max-w-3xl">
            <header className="space-y-5 mb-10">
              {post.draft && (
                <p className="text-sm font-semibold text-dys-muted">
                  Borrador: no se publica en producción
                </p>
              )}
              <h1 className="firma-punto text-titular-2 font-bold text-dys-text">{post.title}</h1>
              <p className="text-lg sm:text-xl text-dys-muted leading-relaxed">{post.description}</p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-dys-muted">
                <span>
                  <time dateTime={post.date}>{formatPostDate(post.date)}</time>
                </span>
                {post.updated !== post.date && (
                  <span>
                    Actualizado el <time dateTime={post.updated}>{formatPostDate(post.updated)}</time>
                  </span>
                )}
                <span>{post.readingMinutes} min de lectura</span>
              </div>
            </header>

            {toc.length > 0 && (
              <nav aria-labelledby="toc-movil" className="lg:hidden mb-10 border-y border-dys-border py-5">
                <p id="toc-movil" className="font-semibold text-dys-text mb-3">
                  En este artículo
                </p>
                <ol className="space-y-2 text-sm">
                  {toc.map((h) => (
                    <li key={h.id}>
                      <a href={`#${h.id}`} className="text-dys-muted underline-offset-4 hover:text-dys-text hover:underline">
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            <Content />

            {/* Cierre discreto: el blog es informativo, sin bloque de venta */}
            <p className="mt-16 border-t border-dys-border pt-6 text-dys-muted">
              ¿Necesitas un sitio para tu negocio? Puedes{" "}
              <Link
                href="/contacto"
                className="text-dys-link underline underline-offset-2 hover:text-dys-text"
              >
                cotizar tu sitio
              </Link>{" "}
              cuando quieras.
            </p>
          </article>

          {toc.length > 0 && (
            <aside className="hidden lg:block">
              <nav aria-labelledby="toc-escritorio" className="sticky top-28 space-y-3">
                <p id="toc-escritorio" className="font-semibold text-dys-text">
                  En este artículo
                </p>
                <ol className="space-y-2 text-sm border-l border-dys-border">
                  {toc.map((h) => (
                    <li key={h.id}>
                      <a
                        href={`#${h.id}`}
                        className="block pl-4 -ml-px border-l-2 border-transparent text-dys-muted hover:text-dys-text hover:border-dys-text"
                      >
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </aside>
          )}
        </div>

        {related.length > 0 && (
          <section aria-labelledby="relacionados" className="mt-20 space-y-6">
            <h2 id="relacionados" className="text-titular-2 font-bold text-dys-text">
              Sigue leyendo
            </h2>
            <ul className="border-t border-dys-border">
              {related.map((p) => (
                <li key={p.slug} className="border-b border-dys-border">
                  <Link href={`/blog/${p.slug}`} className="group block py-6">
                    <span className="block font-display text-xl sm:text-2xl font-semibold text-dys-text underline-offset-4 decoration-2 group-hover:underline group-hover:decoration-dys-primary">
                      {p.title}
                    </span>
                    <span className="mt-2 block max-w-[65ch] text-dys-muted leading-relaxed">{p.description}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
