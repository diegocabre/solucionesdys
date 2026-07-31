import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ferretería y Herramientas Online en Puerto Varas | Soluciones DyS",
  description: "Compra materiales de ferretería y herramientas online en Puerto Varas, Llanquihue y Puerto Montt. Despacho rápido y stock garantizado para tus proyectos.",
  openGraph: {
    title: "Ferretería y Herramientas Online en Puerto Varas | Soluciones DyS",
    description: "Compra materiales de ferretería y herramientas online en Puerto Varas, Llanquihue y Puerto Montt. Despacho rápido y stock garantizado.",
    type: "website",
  }
};

export default function ProductosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
