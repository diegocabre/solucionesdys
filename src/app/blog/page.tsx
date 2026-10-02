import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, Rss } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import { formatPostDate, getPosts } from "@/lib/blog";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog: sitios web y Google para negocios de Puerto Varas",
  description:
    "Guías prácticas para pymes de Puerto Varas y Los Lagos: cuánto cuesta un sitio web, cómo aparecer en Google Maps y qué tipo de sitio necesita tu negocio.",
  alternates: {
    canonical: "/blog",
    types: { "application/rss+xml": [{ url: "/blog/rss.xml", title: "Blog de Soluciones DyS" }] },
  },
  openGraph: {
    title: "Blog | Soluciones DyS Puerto Varas",
    description: "Guías prácticas sobre sitios web y Google para negocios de Puerto Varas y Los Lagos.",
    url: "/blog",
    type: "website",
    images: [{ url: "/assets/img/og-image.jpg", width: 1200, height: 630, alt: "Soluciones DyS" }],
  },
};

export default function BlogPage() {
  const posts = getPosts();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${SITE_URL}/blog#blog`,
    name: "Blog de Soluciones DyS",
    url: `${SITE_URL}/blog`,
    inLanguage: "es-CL",
    publisher: { "@id": `${SITE_URL}/#business` },
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `${SITE_URL}/blog/${p.slug}`,
      datePublished: p.date,
      dateModified: p.updated,
    })),
  };

  return (
    <div className="bg-background py-16">
      <JsonLd data={jsonLd} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <header className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-xs font-semibold tracking-widest text-brand-accent-dark uppercase bg-brand-accent/10 px-3 py-1 rounded-full">
            Blog
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold text-brand-primary font-serif">
            Guías para vender más con tu sitio web
          </h1>
          <p className="text-gray-600 font-light">
            Respuestas claras para negocios de Puerto Varas, Llanquihue, Frutillar y Puerto Montt: precios, Google y qué
            sitio te conviene.
          </p>
          <a
            href="/blog/rss.xml"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand-primary"
          >
            <Rss className="w-4 h-4" aria-hidden="true" /> Suscríbete por RSS
          </a>
        </header>

        <ul className="grid gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <li key={post.slug}>
              <article className="h-full bg-white rounded-3xl border border-gray-100 shadow-xs hover:shadow-xl transition-all p-8 flex flex-col gap-4">
                <div className="flex flex-wrap gap-2">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-xs font-semibold px-3 py-1 rounded-full bg-brand-green/10 text-brand-green-dark">
                      {tag}
                    </span>
                  ))}
                  {post.draft && (
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-100 text-amber-900">Borrador</span>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-brand-primary font-serif">
                  <Link href={`/blog/${post.slug}`} className="hover:text-brand-accent-dark transition-colors">
                    {post.title}
                  </Link>
                </h2>
                <p className="text-gray-600 font-light leading-relaxed grow">{post.description}</p>
                <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-gray-500">
                  <span className="inline-flex items-center gap-2">
                    <time dateTime={post.date}>{formatPostDate(post.date)}</time>
                    <span aria-hidden="true">·</span>
                    <Clock className="w-4 h-4" aria-hidden="true" /> {post.readingMinutes} min de lectura
                  </span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1 font-semibold text-brand-accent-dark hover:text-brand-primary"
                    aria-label={`Leer: ${post.title}`}
                  >
                    Leer <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
