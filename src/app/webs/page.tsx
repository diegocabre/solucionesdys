import { Globe, Code, Layers, MousePointerClick } from 'lucide-react';
import Button from '@/components/Button';
import Link from 'next/link';

export default function WebsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 pt-12 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 flex flex-col md:flex-row gap-12 items-center">
            
            <div className="flex-1">
              <div className="inline-block px-4 py-1.5 rounded-full bg-brand-accent/10 border border-brand-accent/20 mb-6">
                <span className="text-sm font-semibold tracking-wider text-brand-accent uppercase">
                  Desarrollo Digital
                </span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold text-brand-primary mb-6 leading-tight">
                Creación de <br />
                <span className="text-brand-accent italic font-serif font-light">Sitios Web</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
                Llevamos tu constructora, taller o negocio al siguiente nivel mediante un ecosistema digital robusto. Desde páginas corporativas hasta tiendas online avanzadas a tu medida.
              </p>
              <Link href="/contacto">
                 <Button variant="primary" size="lg" className="shadow-lg hover:shadow-brand-accent/50 hover:-translate-y-1 transition-all">
                   Iniciar mi Proyecto
                 </Button>
              </Link>
            </div>
            
            <div className="flex-1 w-full bg-gray-50 dark:bg-slate-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 relative overflow-hidden shadow-2xl">
               <div className="absolute -top-10 -right-10 p-4 opacity-10 rotate-12">
                 <Globe className="w-80 h-80 text-brand-accent" />
               </div>
               
               <div className="space-y-6 relative z-10">
                 <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm flex items-start gap-5 hover:shadow-md transition-shadow">
                   <div className="bg-blue-100 dark:bg-blue-900/50 p-4 rounded-xl">
                     <Code className="text-blue-600 dark:text-blue-400 w-6 h-6" />
                   </div>
                   <div>
                     <h3 className="font-bold text-lg text-foreground">Tecnología Moderna</h3>
                     <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                       Desarrollamos catálogos y sistemas veloces, seguros y completamente adaptados a dispositivos móviles.
                     </p>
                   </div>
                 </div>
                 
                 <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm flex items-start gap-5 hover:shadow-md transition-shadow">
                   <div className="bg-green-100 dark:bg-green-900/50 p-4 rounded-xl">
                     <Layers className="text-green-600 dark:text-green-400 w-6 h-6" />
                   </div>
                   <div>
                     <h3 className="font-bold text-lg text-foreground">Diseño a Medida</h3>
                     <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                       Interfaces estéticamente profesionales y premium coherentes con los estándares de tu marca.
                     </p>
                   </div>
                 </div>
                 
                 <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm flex items-start gap-5 hover:shadow-md transition-shadow">
                   <div className="bg-purple-100 dark:bg-purple-900/50 p-4 rounded-xl">
                     <MousePointerClick className="text-purple-600 dark:text-purple-400 w-6 h-6" />
                   </div>
                   <div>
                     <h3 className="font-bold text-lg text-foreground">Optimizado para Vender</h3>
                     <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                       Mejores prácticas en UX/UI, botones de conversión amigables y la exposición ideal para captar tus clientes.
                     </p>
                   </div>
                 </div>
               </div>
            </div>
            
          </div>
        </div>
      </main>
    </div>
  );
}
