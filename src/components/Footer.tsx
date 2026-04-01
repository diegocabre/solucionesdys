import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-serif tracking-wide">
              Soluciones <span className="text-brand-accent-light">DyS</span>
            </h3>
            <p className="text-gray-400 text-sm max-w-sm">
              Brindamos herramientas de construcción, transporte personalizado,
              asesoría técnica y diseño web profesional para impulsar tus
              proyectos.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-medium">Servicios</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link
                  href="/productos"
                  className="hover:text-brand-accent-light transition"
                >
                  Ferretería & Productos Online
                </Link>
              </li>
              <li>
                <Link
                  href="#transporte"
                  className="hover:text-brand-accent-light transition"
                >
                  Transporte Personalizado
                </Link>
              </li>
              <li>
                <Link
                  href="#consultoria"
                  className="hover:text-brand-accent-light transition"
                >
                  Consultorías
                </Link>
              </li>
              <li>
                <Link
                  href="#webs"
                  className="hover:text-brand-accent-light transition"
                >
                  Creación de Sitios Web
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-medium">Contacto</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>sandracydiegoc@gmail.com</li>
              <li>+56 9 8788 7209</li>
              <li>Puerto Varas, Chile</li>
            </ul>
            <div className="flex gap-4 pt-2">
              <a
                href="https://wa.me/56987887209"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-brand-accent-light transition"
                aria-label="WhatsApp"
              >
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 448 512"
                  height="24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zM223.9 414.7c-32 0-64-8.8-92-25.5l-6.6-3.9-68.4 18 18.3-66.7-4.2-6.8c-18.7-30.2-28.5-65-28.5-102 0-104.9 85.3-190.2 190.4-190.2 50.8 0 98.7 19.8 134.6 55.7 35.9 35.9 55.6 83.8 55.6 134.7 0 105-85.3 190.2-190.3 190.2zm104.5-142.6c-5.7-2.8-33.8-16.7-39-18.6-5.2-1.9-9-2.8-12.8 2.8-3.8 5.7-14.7 18.6-18 22.4-3.3 3.8-6.6 4.7-12.3 1.9-5.7-2.8-24.1-8.9-45.9-28.4-17-15.3-28.5-34.2-31.9-39.9-3.3-5.7-.4-8.8 2.4-11.6 2.6-2.6 5.7-6.6 8.5-9.9 2.8-3.3 3.8-5.7 5.7-9.5 1.9-3.8.9-7.1-.5-9.9-1.4-2.8-12.8-30.9-17.5-42.3-4.6-11.2-9.3-9.7-12.8-9.9-3.3-.2-7.1-.2-10.9-.2-3.8 0-9.9 1.4-15.1 7.1-5.2 5.7-20.3 19.9-20.3 48.4 0 28.5 20.8 56.1 23.7 59.9 2.8 3.8 40.8 62.3 98.9 87.4 13.8 5.9 24.6 9.4 33 12 14.1 4.5 26.9 3.8 37 2.3 11.4-1.6 33.8-13.8 38.6-27.1 4.7-13.3 4.7-24.7 3.3-27.1-1.4-2.5-5.2-3.9-10.9-6.7z"></path>
                </svg>
              </a>
              <a
                href="https://www.instagram.com/solucionesdys.cl/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-brand-accent-light transition"
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

        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>
            © {new Date().getFullYear()} Soluciones DyS. Todos los derechos
            reservados.
          </p>
          <div className="mt-4 md:mt-0 space-x-4">
            <Link href="#" className="hover:text-white transition">
              Términos de Servicio
            </Link>
            <Link href="#" className="hover:text-white transition">
              Privacidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
