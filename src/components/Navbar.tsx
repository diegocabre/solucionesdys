"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);

  const NAV_LINKS = [
    { label: "Inicio", href: "/" },
    { label: "Diseño web", href: "/webs" },
    { label: "Aprende IA", href: "/aprende-ia" },
    { label: "Comunidad Puerto Varas", href: "/comunidad" },
    { label: "Partners", href: "/partners" },
  ];
  // Cotizar es la acción principal del sitio: va aparte, como botón verde.
  const CTA = { label: "Cotizar mi proyecto", href: "/contacto" };

  const isActive = (href: string) => pathname === href || (href !== "/" && pathname?.startsWith(href));

  return (
    <nav className="fixed w-full bg-dys-bg border-b border-dys-border z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Wordmark DyS.: nunca bajo 80 px de ancho (regla del kit de marca). */}
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/assets/img/logo/dys-logo-para-fondo-oscuro.svg"
              alt="Soluciones DyS"
              width={96}
              height={54}
              className="w-24 h-auto"
              priority
            />
          </Link>

          {/* Desktop Menu: la página actual se marca con texto verde y subrayado, sin cápsula animada */}
          <div className="hidden xl:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`px-3 py-2 text-[15px] font-medium whitespace-nowrap underline-offset-8 decoration-2 transition-colors ${
                  isActive(link.href) ? "text-dys-primary underline" : "text-dys-text hover:text-dys-primary"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={CTA.href}
              aria-current={isActive(CTA.href) ? "page" : undefined}
              className="ml-4 inline-flex h-10 items-center rounded-lg bg-dys-primary px-4 text-[15px] font-semibold text-dys-on-primary transition-colors hover:bg-dys-primary/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dys-primary focus-visible:ring-offset-2"
            >
              {CTA.label}
            </Link>
          </div>

          {/* Mobile Actions */}
          <div className="flex xl:hidden items-center gap-4">
            <button
              onClick={toggleMenu}
              aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={isOpen}
              className="p-2.5 text-dys-text hover:bg-dys-text/10 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-dys-primary"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="entrada-menu xl:hidden border-t border-dys-border overflow-hidden bg-dys-bg">
          <div className="flex flex-col px-4 pt-2 pb-6 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`px-3 py-3 text-lg font-medium rounded-md transition-colors ${
                  isActive(link.href)
                    ? "text-dys-primary"
                    : "text-dys-text hover:text-dys-primary hover:bg-dys-text/10"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={CTA.href}
              onClick={() => setIsOpen(false)}
              className="mt-3 inline-flex h-12 items-center justify-center rounded-lg bg-dys-primary px-5 text-base font-semibold text-dys-on-primary transition-colors hover:bg-dys-primary/85"
            >
              {CTA.label}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
