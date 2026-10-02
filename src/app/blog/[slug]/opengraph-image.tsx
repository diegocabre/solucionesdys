import { ImageResponse } from "next/og";
import { getPost, getPosts } from "@/lib/blog";

// Imagen para compartir cada artículo (Open Graph / WhatsApp / redes), generada al compilar.

export const alt = "Artículo del blog de Soluciones DyS";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  const title = post?.title ?? "Blog de Soluciones DyS";
  const ciudad = post?.ciudad ? `${post.ciudad} · ` : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "linear-gradient(135deg, #182838 0%, #0f172a 100%)",
          color: "#ffffff",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, color: "#d1baaa", letterSpacing: 2 }}>
          {`${ciudad}BLOG`.toUpperCase()}
        </div>
        <div style={{ display: "flex", fontSize: title.length > 60 ? 60 : 72, fontWeight: 700, lineHeight: 1.1 }}>
          {title}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 30 }}>
          <span style={{ color: "#bfa38a", fontWeight: 700 }}>Soluciones DyS</span>
          <span style={{ color: "#cbd5e1" }}>solucionesdys.cl</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
