import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getPosts } from "@/lib/blog";
import { CASOS } from "@/lib/casos";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: { path: string; priority: number; changeFrequency: "weekly" | "monthly" }[] = [
    { path: "", priority: 1, changeFrequency: "weekly" },
    { path: "/webs", priority: 0.9, changeFrequency: "monthly" },
    { path: "/blog", priority: 0.8, changeFrequency: "weekly" },
    { path: "/aprende-ia", priority: 0.7, changeFrequency: "monthly" },
    { path: "/comunidad", priority: 0.7, changeFrequency: "monthly" },
    { path: "/comunidad/farmacias-de-turno", priority: 0.8, changeFrequency: "weekly" },
    { path: "/comunidad/directorio", priority: 0.7, changeFrequency: "weekly" },
    { path: "/comunidad/directorio/inscribir", priority: 0.5, changeFrequency: "monthly" },
    { path: "/partners", priority: 0.7, changeFrequency: "monthly" },
    { path: "/contacto", priority: 0.8, changeFrequency: "monthly" },
    { path: "/privacidad", priority: 0.3, changeFrequency: "monthly" },
    { path: "/terminos", priority: 0.3, changeFrequency: "monthly" },
  ];

  // Solo artículos publicados (sin draft) y casos con published: true.
  const publicados = getPosts().filter((p) => !p.draft);
  // El índice del blog cambia cuando cambia su artículo más reciente.
  const ultimoArticulo = publicados.map((p) => p.updated).sort().at(-1);

  // Sin lastmod en páginas sin fecha real: new Date() marcaba todo como cambiado en cada deploy.
  const pages: MetadataRoute.Sitemap = routes.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: path === "/blog" && ultimoArticulo ? new Date(`${ultimoArticulo}T12:00:00Z`) : undefined,
    changeFrequency,
    priority,
  }));

  const posts: MetadataRoute.Sitemap = publicados.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: new Date(`${p.updated}T12:00:00Z`),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const casos: MetadataRoute.Sitemap = CASOS.filter((c) => c.published).map((c) => ({
    url: `${SITE_URL}/webs/casos/${c.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...pages, ...posts, ...casos];
}
