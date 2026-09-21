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
    { label: "Contacto", href: "/contacto" },
  ];

  return (
    <nav className="fixed w-full bg-background border-b z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo como Emblema con Texto Elegante Al Lado */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-12 w-12 sm:h-15 sm:w-15 rounded-xl overflow-hidden border border-brand-accent/30 shadow-md shadow-brand-accent/15 transition-transform duration-300 group-hover:scale-105 shrink-0">
              <Image
                src="/assets/img/logo.png"
                alt="Soluciones DyS"
                fill
                sizes="(max-width: 640px) 48px, 60px"
                style={{
                  objectFit: "cover",
                }}
                priority
              />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-lg sm:text-2xl font-bold font-serif text-brand-primary tracking-wide leading-none transition-colors group-hover:text-brand-accent-dark">
                Soluciones <span className="text-brand-accent-dark">DyS</span>
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-brand-green-light mt-1.5 leading-none">
                Soluciones Digitales
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
              const Icon = link.icon;

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`relative px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive ? "text-brand-accent-dark" : "text-foreground hover:text-brand-accent-dark"
                  }`}
                >
                  <span className="relative z-10 inline-flex items-center gap-1.5">
                    {Icon && <Icon size={15} aria-hidden="true" />}
                    {link.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active-desktop"
                      className="absolute inset-0 bg-brand-accent/10 dark:bg-brand-accent/20 rounded-md"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile Actions */}
          <div className="flex lg:hidden items-center gap-4">
            <button
              onClick={toggleMenu}
              aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={isOpen}
              className="p-2 text-foreground hover:bg-gray-100 rounded-md focus:outline-none"
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
            className="lg:hidden border-t overflow-hidden bg-background"
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
                        ? "text-brand-accent-dark bg-brand-accent/10 dark:bg-brand-accent/20"
                        : "text-foreground hover:text-brand-accent-dark hover:bg-gray-50 dark:hover:bg-slate-800"
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
