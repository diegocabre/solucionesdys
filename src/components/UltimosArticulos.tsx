import Link from "next/link";
import { getPosts } from "@/lib/blog";

// Enlaces internos a los artículos más recientes del blog (componente de servidor).
export default function UltimosArticulos({ limit = 3 }: { limit?: number }) {
  const posts = getPosts().slice(0, limit);
  if (posts.length === 0) return null;

  return (
    <section aria-labelledby="ultimos-articulos" className="py-24 bg-dys-bg border-t border-dys-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-12 items-start">
        <div className="space-y-4">
          <h2 id="ultimos-articulos" className="text-titular-2 font-bold text-dys-text">
            Guías para tu negocio
          </h2>
          <Link href="/blog" className="inline-block font-semibold text-dys-link underline underline-offset-4 hover:text-dys-text">
            Ver todos los artículos
          </Link>
        </div>

        <ul className="border-t border-dys-border">
          {posts.map((post) => (
            <li key={post.slug} className="border-b border-dys-border">
              <Link href={`/blog/${post.slug}`} className="group block py-6">
                <span className="block font-display text-xl sm:text-2xl font-semibold text-dys-text underline-offset-4 decoration-2 group-hover:underline group-hover:decoration-dys-primary">
                  {post.title}
                </span>
                <span className="mt-2 block max-w-[65ch] text-dys-muted leading-relaxed">{post.description}</span>
                <span className="mt-2 block text-sm text-dys-muted">{post.readingMinutes} min de lectura</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
