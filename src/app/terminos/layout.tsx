import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y Condiciones de Servicio",
  description:
    "Términos y condiciones de uso del sitio y de contratación de los servicios de diseño y desarrollo web de Soluciones DyS SpA, conforme a la legislación chilena.",
  alternates: { canonical: "/terminos" },
  robots: { index: true, follow: true },
};

export default function TerminosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
