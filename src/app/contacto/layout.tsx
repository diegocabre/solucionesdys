import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto: cotiza tu sitio web en Puerto Varas",
  description: "Comunícate con Soluciones DyS. Cotiza el diseño y desarrollo de tu próximo sitio web, landing page o tienda online para tu negocio. Respuesta con propuesta clara, sin compromiso.",
  alternates: { canonical: "/contacto" },
  openGraph: {
    title: "Contacto | Soluciones DyS Puerto Varas",
    description: "Cotiza el diseño y desarrollo de tu próximo sitio web, landing page o tienda online para tu negocio. Respuesta con propuesta clara, sin compromiso.",
    url: "/contacto",
    type: "website",
    images: [{ url: "/assets/img/og-image.jpg", width: 1200, height: 630, alt: "Soluciones DyS" }],
  }
};

export default function ContactoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
