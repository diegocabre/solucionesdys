import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });

export const metadata: Metadata = {
  title: "Soluciones DyS | Productos Online, Consultorías y más",
  description: "Especialistas en Ferretería y Herramientas. Complementamos con Transporte Personalizado, Consultoría y Creación de Sitios Web.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable} scroll-smooth`}>
      <body className="antialiased min-h-screen flex flex-col">
        <Navbar />
        <CartDrawer />
        <main className="grow pt-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
