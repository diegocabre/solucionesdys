import React from 'react';
import Link from 'next/link';

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
              Brindamos herramientas de construcción, transporte personalizado, asesoría técnica y diseño web profesional para impulsar tus proyectos.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-medium">Servicios</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/productos" className="hover:text-brand-accent-light transition">Ferretería & Productos Online</Link></li>
              <li><Link href="#transporte" className="hover:text-brand-accent-light transition">Transporte Personalizado</Link></li>
              <li><Link href="#consultoria" className="hover:text-brand-accent-light transition">Consultorías</Link></li>
              <li><Link href="#webs" className="hover:text-brand-accent-light transition">Creación de Sitios Web</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-medium">Contacto</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>sandracydiegoc@gmail.com</li>
              <li>+56 9 8788 7209</li>
              <li>Puerto Varas, Chile</li>
            </ul>
          </div>
          
        </div>
        
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Soluciones DyS. Todos los derechos reservados.</p>
          <div className="mt-4 md:mt-0 space-x-4">
            <Link href="#" className="hover:text-white transition">Términos de Servicio</Link>
            <Link href="#" className="hover:text-white transition">Privacidad</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
