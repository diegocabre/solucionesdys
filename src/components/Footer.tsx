"use client";

import Image from "next/image";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import Link from "next/link";
import { COOKIE_CONSENT_EVENT } from "@/components/CookieConsent";

export default function Footer() {
  return (
    <footer className="dys-light bg-dys-bg text-dys-text border-t border-dys-border pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="space-y-4">
            <Image
              src="/assets/img/logo/dys-logo-para-fondo-claro.svg"
              alt="Soluciones DyS"
              width={112}
              height={63}
              className="w-28 h-auto"
            />
            <p className="text-dys-muted text-sm max-w-sm">
              Sitios web a medida para pymes de Puerto Varas, Los Lagos y todo Chile.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-medium">Servicios</h2>
            <ul className="text-dys-muted text-sm">
              <li>
                <Link
                  href="/webs"
                  className="inline-flex min-h-11 items-center hover:text-dys-primary transition"
                >
                  Diseño de Sitios Web
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="inline-flex min-h-11 items-center hover:text-dys-primary transition"
                >
                  Blog: guías para pymes
                </Link>
              </li>
              <li>
                <Link
                  href="/partners"
                  className="inline-flex min-h-11 items-center hover:text-dys-primary transition"
                >
                  Nuestros Partners
                </Link>
              </li>
              <li>
                <Link
                  href="/aprende-ia"
                  className="inline-flex min-h-11 items-center hover:text-dys-primary transition"
                >
                  Aprende IA
                </Link>
              </li>
              <li>
                <Link
                  href="/comunidad/farmacias-de-turno"
                  className="inline-flex min-h-11 items-center hover:text-dys-primary transition"
                >
                  Farmacias de turno Puerto Varas
                </Link>
              </li>
              <li>
                <Link
                  href="/comunidad/directorio"
                  className="inline-flex min-h-11 items-center hover:text-dys-primary transition"
                >
                  Directorio de negocios locales
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-medium">Contacto</h2>
            <ul className="text-dys-muted text-sm">
              <li>
                <a href="mailto:contacto@solucionesdys.cl" className="inline-flex min-h-11 items-center hover:text-dys-primary transition">
                  contacto@solucionesdys.cl
                </a>
              </li>
              <li>
                <a href="tel:+56947637541" className="inline-flex min-h-11 items-center hover:text-dys-primary transition">
                  +56 9 4763 7541
                </a>
              </li>
              <li className="flex min-h-11 items-center">Puerto Varas, Chile</li>
            </ul>
            <div className="flex gap-1 -ml-2.5">
              <a
                href="https://wa.me/56947637541"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex size-11 items-center justify-center text-dys-muted hover:text-dys-primary transition"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon className="size-6" />
              </a>
              <a
                href="https://www.instagram.com/solucionesdys.cl/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex size-11 items-center justify-center text-dys-muted hover:text-dys-primary transition"
                aria-label="Instagram"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-dys-border pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-dys-muted">
          <p>
            © {new Date().getFullYear()} Soluciones DyS. Todos los derechos
            reservados.
          </p>
          <div className="mt-4 md:mt-0 flex flex-wrap justify-center gap-x-4">
            <Link href="/terminos" className="inline-flex min-h-11 items-center hover:text-dys-text transition">
              Términos de Servicio
            </Link>
            <Link href="/privacidad" className="inline-flex min-h-11 items-center hover:text-dys-text transition">
              Privacidad
            </Link>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event(COOKIE_CONSENT_EVENT))}
              className="inline-flex min-h-11 items-center hover:text-dys-text transition"
            >
              Preferencias de Cookies
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
