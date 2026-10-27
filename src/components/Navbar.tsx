"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bot, MapPin, Menu, X } from "lucide-react";
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
    { label: "Diseño Web", href: "/webs" },
    { label: "Aprende IA", href: "/aprende-ia", icon: Bot },
    { label: "Comunidad Puerto Varas", href: "/comunidad", icon: MapPin },
    { label: "Partners", href: "/partners" },
    { label: "Cotizar mi sitio", href: "/contacto" },
  ];

  return (
    <nav className="fixed w-full bg-dys-bg border-b border-dys-border z-50 transition-colors">
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

          {/* Desktop Menu */}
          <div className="hidden xl:flex items-center space-x-2">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
              const Icon = link.icon;

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`relative px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                    isActive ? "text-dys-primary" : "text-dys-text hover:text-dys-primary"
                  }`}
                >
                  <span className="relative z-10 inline-flex items-center gap-1.5">
                    {Icon && <Icon size={15} aria-hidden="true" />}
                    {link.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active-desktop"
                      className="absolute inset-0 bg-dys-primary/10 rounded-md"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              );
            })}
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
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden border-t border-dys-border overflow-hidden bg-dys-bg"
          >
            <div className="flex flex-col px-4 pt-2 pb-6 space-y-1 shadow-inner">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
                const Icon = link.icon;

                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-2 px-3 py-3 text-base font-medium rounded-md transition-colors ${
                      isActive
                        ? "text-dys-primary bg-dys-primary/10"
                        : "text-dys-text hover:text-dys-primary hover:bg-dys-text/10"
                    }`}
                  >
                    {Icon && <Icon size={18} aria-hidden="true" />}
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
