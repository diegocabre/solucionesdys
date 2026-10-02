import type { Metadata } from "next";

// Panel interno: fuera de buscadores (además del X-Robots-Tag de next.config.ts).
export const metadata: Metadata = {
  title: "Panel",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="bg-background min-h-[calc(100vh-64px)] py-12">{children}</div>;
}
