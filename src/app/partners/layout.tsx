import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nuestros Partners y Portafolio de Sitios Web | Soluciones DyS",
  description: "Conoce los proyectos web creados por Soluciones DyS: Rincon de la Romo y Estribor Consultores. Casos de éxito y portafolio de clientes.",
  openGraph: {
    title: "Partners y Portafolio Web | Soluciones DyS",
    description: "Conoce los proyectos web creados por Soluciones DyS: Rincon de la Romo y Estribor Consultores.",
    type: "website",
  }
};

export default function PartnersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
