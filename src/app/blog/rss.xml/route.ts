import { getPosts } from "@/lib/blog";
import { SITE_NAME, SITE_URL } from "@/lib/site";

// Feed RSS del blog: /blog/rss.xml (se genera al compilar).
export const dynamic = "force-static";

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const rfc822 = (date: string) => new Date(`${date}T12:00:00Z`).toUTCString();

export function GET() {
  const posts = getPosts();
  const lastUpdate = posts.reduce((max, p) => (p.updated > max ? p.updated : max), "");
  const items = posts
    .map((post) => {
      const url = `${SITE_URL}/blog/${post.slug}`;
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(post.description)}</description>
      <pubDate>${rfc822(post.date)}</pubDate>
${post.tags.map((t) => `      <category>${escapeXml(t)}</category>`).join("\n")}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`Blog de ${SITE_NAME}`)}</title>
    <link>${SITE_URL}/blog</link>
    <description>Guías sobre sitios web y Google para negocios de Puerto Varas y la Región de Los Lagos.</description>
    <language>es-CL</language>
    <atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml" />
${lastUpdate ? `    <lastBuildDate>${rfc822(lastUpdate)}</lastBuildDate>\n` : ""}${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
