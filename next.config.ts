import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const securityHeaders = [
  // Evita que el sitio sea embebido en un iframe ajeno (protección contra clickjacking)
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Evita que el navegador intente "adivinar" tipos MIME (protección XSS/mime-sniffing)
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Limita cuánta información de la URL de origen se envía al navegar a otros sitios
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Desactiva APIs sensibles del navegador que este sitio no usa
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  // Fuerza HTTPS en visitas futuras (una vez desplegado con certificado válido)
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // No hay Content-Security-Policy por ahora. Si se agrega, Cloudflare Turnstile (formulario
  // de contacto) necesita https://challenges.cloudflare.com en script-src y frame-src.
];

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        // Artículo de precios retirado del blog: quien llegue desde Google va a la guía más cercana.
        source: "/blog/diseno-web-puerto-varas-cuanto-cuesta",
        destination: "/blog/landing-page-vs-sitio-corporativo-vs-tienda-online",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // Panel interno: que ningún buscador lo indexe.
        source: "/admin/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

// Artículos del blog en content/blog/*.mdx. Los plugins van como texto para que
// funcionen con Turbopack: frontmatter YAML (se lee aparte en src/lib/blog.ts) y
// tablas estilo GitHub.
const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-frontmatter", "remark-gfm"],
  },
});

export default withMDX(nextConfig);
