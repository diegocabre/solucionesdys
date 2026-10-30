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
  // CSP en modo Report-Only: el navegador solo avisa en consola, no bloquea. Cuando no haya
  // avisos en producción, cambiar la clave a "Content-Security-Policy" para que se aplique.
  { key: "Content-Security-Policy-Report-Only", value: contentSecurityPolicy() },
  // Destino de report-to (Reporting API); report-uri queda para Firefox y Safari.
  { key: "Reporting-Endpoints", value: 'csp-endpoint="/api/csp-report"' },
];

// 'unsafe-inline' en scripts: Next.js, el JSON-LD y el arranque de Clarity usan scripts
// en línea y el sitio no usa nonces. 'unsafe-eval' solo en desarrollo (recarga en caliente).
function contentSecurityPolicy(): string {
  const dev = process.env.NODE_ENV !== "production";
  return [
    "default-src 'self'",
    // Turnstile (formulario de contacto) y Microsoft Clarity (solo con cookies aceptadas):
    // www.clarity.ms/tag/<id> carga el script real desde scripts.clarity.ms.
    `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ""} https://challenges.cloudflare.com https://www.clarity.ms https://scripts.clarity.ms`,
    "style-src 'self' 'unsafe-inline'",
    // Fuentes de next/font/google se sirven desde el propio sitio.
    "font-src 'self' data:",
    // next/image se sirve desde /_next/image (self). Clarity envía su píxel a c.clarity.ms y c.bing.com.
    "img-src 'self' data: blob: https://c.clarity.ms https://c.bing.com",
    // Respaldo de farmacias desde el navegador (MINSAL), Turnstile y Clarity. Clarity reparte
    // la recolección entre subdominios de una letra (a.clarity.ms, k.clarity.ms…), por eso
    // *.clarity.ms es el valor que documenta Microsoft; se limita a connect-src.
    "connect-src 'self' https://midas.minsal.cl https://challenges.cloudflare.com https://*.clarity.ms",
    // Mapa de farmacias (OpenStreetMap) y el widget de Turnstile.
    "frame-src https://challenges.cloudflare.com https://www.openstreetmap.org",
    "frame-ancestors 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "report-uri /api/csp-report",
    "report-to csp-endpoint",
  ].join("; ");
}

const nextConfig: NextConfig = {
  // AVIF pesa menos que WebP en las capturas del carrusel (LCP en móvil); WebP queda de respaldo.
  images: { formats: ["image/avif", "image/webp"] },
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
