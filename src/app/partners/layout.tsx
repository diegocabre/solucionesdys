import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nuestros Partners y Portafolio de Sitios Web | Soluciones DyS",
  description: "Conoce los proyectos web creados por Soluciones DyS: Rincón del Aromo y Estribor Consultores. Casos de éxito y portafolio de clientes.",
  alternates: { canonical: "/partners" },
  openGraph: {
    title: "Partners y Portafolio Web | Soluciones DyS",
    description: "Conoce los proyectos web creados por Soluciones DyS: Rincón del Aromo y Estribor Consultores.",
    url: "/partners",
    type: "website",
    images: [{ url: "/assets/img/og-image.jpg", width: 1200, height: 630, alt: "Soluciones DyS" }],
  }
};

export default function PartnersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
