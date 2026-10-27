import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import Analytics from "@/components/Analytics";
import StructuredData from "@/components/StructuredData";
import AttributionTracker from "@/components/AttributionTracker";
import { SITE_URL, SITE_NAME } from "@/lib/site";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
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
        url: "/og-image.png",
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
    images: ["/og-image.png"],
  },
  // favicon.ico, icon.svg y apple-icon.png de app/ se enlazan solos (convención de archivos).
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${bricolage.variable} scroll-smooth`}>
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
