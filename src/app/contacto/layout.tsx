import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto | Cotiza Limpieza de Tapicería y Diseño Web en Puerto Varas",
  description: "Comunícate con Soluciones DyS. Cotiza limpieza profunda de sillones, alfombras y autos, mantención de canaletas o el diseño de tu próximo sitio web profesional.",
  openGraph: {
    title: "Contacto | Soluciones DyS Puerto Varas",
    description: "Cotiza limpieza profunda de sillones, alfombras y autos, mantención de canaletas o el diseño de tu próximo sitio web profesional.",
    type: "website",
  }
};

export default function ContactoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
