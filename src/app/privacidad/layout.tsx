import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad y Cookies | Soluciones DyS",
  description:
    "Política de privacidad y cookies de Soluciones DyS SpA: qué datos recopilamos, cómo los usamos y tus derechos conforme a la legislación chilena de protección de datos.",
  alternates: { canonical: "/privacidad" },
  robots: { index: true, follow: true },
};

export default function PrivacidadLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
