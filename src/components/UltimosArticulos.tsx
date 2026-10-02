import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getPosts } from "@/lib/blog";

// Enlaces internos a los artículos más recientes del blog (componente de servidor).
export default function UltimosArticulos({ limit = 3 }: { limit?: number }) {
  const posts = getPosts().slice(0, limit);
  if (posts.length === 0) return null;

  return (
    <section aria-labelledby="ultimos-articulos" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-semibold tracking-widest text-brand-accent-dark uppercase bg-brand-accent/10 px-3 py-1 rounded-full">
              Blog
            </span>
            <h2 id="ultimos-articulos" className="text-3xl font-bold text-brand-primary font-serif">
              Guías para tu negocio
            </h2>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand-accent-dark hover:text-brand-primary"
          >
            Ver todos los artículos <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
        <ul className="grid gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="group h-full flex flex-col gap-3 bg-white rounded-2xl border border-gray-100 p-6 shadow-xs hover:shadow-lg transition-shadow"
              >
                <span className="text-lg font-semibold text-brand-primary group-hover:text-brand-accent-dark">
                  {post.title}
                </span>
                <span className="text-sm text-gray-600 font-light grow">{post.description}</span>
                <span className="text-xs text-gray-500">{post.readingMinutes} min de lectura</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
