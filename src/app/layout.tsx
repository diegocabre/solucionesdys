import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import Analytics from "@/components/Analytics";
import StructuredData from "@/components/StructuredData";
import AttributionTracker from "@/components/AttributionTracker";
import { SITE_URL, SITE_NAME } from "@/lib/site";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
// Playfair queda solo para el logotipo "Soluciones DyS".
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });
// Fuente de titulares (h1–h3); el eje opsz ajusta el dibujo al tamaño.
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage", axes: ["opsz"] });

const title = "Diseño y Desarrollo Web en Puerto Varas | Soluciones DyS";
const description =
  "Diseñamos y desarrollamos sitios web, landing pages y tiendas online a medida en Puerto Varas, para pymes de Los Lagos y todo Chile. Rápidos en el celular, optimizados para Google y con WhatsApp a la vista.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: title,
    template: `%s | ${SITE_NAME}`,
  },
  description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title,
    description,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "es_CL",
    type: "website",
    images: [
      {
        url: "/assets/img/og-image.jpg",
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/assets/img/og-image.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable} ${bricolage.variable} scroll-smooth`}>
      <body className="antialiased min-h-screen flex flex-col">
        <StructuredData />
        <Navbar />
        <main className="grow pt-16">
          {children}
        </main>
        <Footer />
        <CookieConsent />
        <Analytics />
        <AttributionTracker />
      </body>
    </html>
  );
}
