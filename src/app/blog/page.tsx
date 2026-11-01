import type { Metadata } from "next";
import Link from "next/link";
import { Rss } from "lucide-react";
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
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Soluciones DyS" }],
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
    <div className="bg-dys-bg py-16">
      <JsonLd data={jsonLd} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        <header className="space-y-6 pt-8">
          <h1 className="firma-punto max-w-[18ch] text-titular-1 font-bold text-dys-text">
            Guías para vender más con tu sitio web
          </h1>
          <p className="max-w-[56ch] text-lg sm:text-xl text-dys-muted leading-relaxed">
            Respuestas claras para negocios de Puerto Varas, Llanquihue, Frutillar y Puerto Montt: precios, Google y qué
            sitio te conviene.
          </p>
          <a href="/blog/rss.xml" className="inline-flex items-center gap-1.5 text-dys-muted underline underline-offset-4 hover:text-dys-text">
            <Rss className="w-4 h-4" aria-hidden="true" /> Suscríbete por RSS
          </a>
        </header>

        {/* Lista de artículos con divisores, como las guías de la home */}
        <ul className="border-t border-dys-border">
          {posts.map((post) => (
            <li key={post.slug} className="border-b border-dys-border">
              <article className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-3 lg:gap-12 py-8 sm:py-10">
                <p className="text-dys-muted">
                  <time dateTime={post.date}>{formatPostDate(post.date)}</time>, {post.readingMinutes} min de lectura
                  {post.draft && <span className="ml-2 font-semibold text-dys-text">(borrador)</span>}
                  <span className="mt-1 block text-sm">{post.tags.slice(0, 3).join(", ")}</span>
                </p>
                <div className="space-y-3">
                  <h2 className="text-titular-3 font-semibold text-dys-text">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="underline-offset-4 decoration-2 hover:underline hover:decoration-dys-primary"
                    >
                      {post.title}
                    </Link>
                  </h2>
                  <p className="max-w-[65ch] text-lg text-dys-muted leading-relaxed">{post.description}</p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
