import type { NextConfig } from "next";

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
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
