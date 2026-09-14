import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto | Cotiza tu Sitio Web en Puerto Varas | Soluciones DyS",
  description: "Comunícate con Soluciones DyS. Cotiza el diseño y desarrollo de tu próximo sitio web, landing page o tienda online con React, Next.js y Tailwind CSS.",
  openGraph: {
    title: "Contacto | Soluciones DyS Puerto Varas",
    description: "Cotiza el diseño y desarrollo de tu próximo sitio web, landing page o tienda online con React, Next.js y Tailwind CSS.",
    type: "website",
  }
};

export default function ContactoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
