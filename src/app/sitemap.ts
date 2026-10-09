import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getPosts } from "@/lib/blog";
import { CASOS } from "@/lib/casos";

// /admin queda fuera a propósito (además tiene noindex).
export default function sitemap(): MetadataRoute.Sitemap {
  const routes: { path: string; priority: number; changeFrequency: "weekly" | "monthly" }[] = [
    { path: "", priority: 1, changeFrequency: "weekly" },
    { path: "/webs", priority: 0.9, changeFrequency: "monthly" },
    { path: "/blog", priority: 0.8, changeFrequency: "weekly" },
    { path: "/aprende-ia", priority: 0.7, changeFrequency: "monthly" },
    { path: "/comunidad", priority: 0.7, changeFrequency: "monthly" },
    { path: "/comunidad/farmacias-de-turno", priority: 0.8, changeFrequency: "weekly" },
    { path: "/partners", priority: 0.7, changeFrequency: "monthly" },
    { path: "/contacto", priority: 0.8, changeFrequency: "monthly" },
    { path: "/privacidad", priority: 0.3, changeFrequency: "monthly" },
    { path: "/terminos", priority: 0.3, changeFrequency: "monthly" },
  ];

  const pages: MetadataRoute.Sitemap = routes.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));

  // Solo artículos publicados (sin draft) y casos con published: true.
  const posts: MetadataRoute.Sitemap = getPosts()
    .filter((p) => !p.draft)
    .map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: new Date(`${p.updated}T12:00:00Z`),
      changeFrequency: "monthly",
      priority: 0.7,
    }));

  const casos: MetadataRoute.Sitemap = CASOS.filter((c) => c.published).map((c) => ({
    url: `${SITE_URL}/webs/casos/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...pages, ...posts, ...casos];
}
