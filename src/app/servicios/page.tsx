import { Sparkles, Home, Car, ShieldCheck } from 'lucide-react';
import Button from '@/components/Button';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Limpieza Profesional de Tapicería, Alfombras y Autos en Puerto Varas | Soluciones DyS",
  description: "Servicios de limpieza profunda a domicilio en Puerto Varas, Llanquihue y Puerto Montt. Lavado de sillones, alfombras, interiores de autos y mantención de canaletas.",
  openGraph: {
    title: "Limpieza Profesional de Tapicería y Alfombras | Soluciones DyS",
    description: "Servicios de limpieza profunda a domicilio en Puerto Varas. Lavado de sillones, alfombras, autos y mantención de canaletas.",
    type: "website",
  }
};

export default function ServiciosPage() {
  const cleaningServices = [
    {
      id: "tapiceria",
      title: "Limpieza de Tapicería",
      icon: Sparkles,
      description: "Higiene y restauración profunda mediante inyección y extracción. Devolvemos la vitalidad a las telas de tu hogar eliminando manchas difíciles, ácaros, gérmenes y malos olores.",
      items: [
        "Sillones de tela, felpa y cuero",
        "Alfombras sueltas y alfombras muro a muro",
        "Sillas de comedor y oficina",
        "Colchones y respaldos de cama"
      ],
      btnText: "Cotizar Tapicería"
    },
    {
      id: "canaletas",
      title: "Limpieza de Canaletas",
      icon: Home,
      description: "Mantención preventiva y limpieza profunda de canaletas en techumbres. Retiramos hojas, ramas y lodos acumulados para evitar filtraciones y daños estructurales en tu hogar.",
      items: [
        "Remoción completa de obstrucciones",
        "Lavado y prueba de flujo de agua",
        "Inspección básica de uniones y soportes",
        "Preparación para temporadas de lluvias"
      ],
      btnText: "Cotizar Canaletas"
    },
    {
      id: "auto",
      title: "Tapicería de Autos",
      icon: Car,
      description: "Detallado e higienización completa del interior de tu vehículo. Limpiamos cada rincón textil y de cuero para que vuelvas a sentir el aroma y confort de un auto nuevo.",
      items: [
        "Lavado profundo de butacas (asientos)",
        "Limpieza de alfombras y maletero",
        "Higiene de techo y pilares internos",
        "Desinfección de tableros y puertas"
      ],
      btnText: "Cotizar Tapicería Auto"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 pt-12 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Cabecera de Página */}
          <div className="mb-16 text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-semibold tracking-widest text-brand-accent uppercase bg-brand-accent/10 px-3 py-1 rounded-full">
              Hogar & Vehículos
            </span>
            <h1 className="text-4xl lg:text-6xl font-bold text-brand-primary dark:text-white flex justify-center items-center gap-3">
              Limpieza Profesional
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 font-light leading-relaxed">
              Servicios especializados de limpieza profunda e higienización para proteger y renovar los espacios de tu hogar y el interior de tu auto.
            </p>
          </div>

          {/* Grilla de 3 Servicios */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {cleaningServices.map((service) => {
              const Icon = service.icon;
              return (
                <div 
                  key={service.id} 
                  className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-brand-accent/20 transition-all flex flex-col justify-between h-full group"
                >
                  <div className="space-y-6">
                    <div className="w-14 h-14 bg-brand-accent/10 rounded-2xl flex items-center justify-center group-hover:bg-brand-accent/20 transition-colors">
                      <Icon className="w-7 h-7 text-brand-accent" />
                    </div>
                    
                    <h2 className="text-2xl font-bold text-brand-primary dark:text-slate-100 font-serif">{service.title}</h2>
                    
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-light">
                      {service.description}
                    </p>
                    
                    <ul className="space-y-3 pt-2">
                      {service.items.map((item, index) => (
                        <li key={index} className="flex items-start gap-2.5 text-xs text-gray-600 dark:text-gray-400">
                          <ShieldCheck className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-8">
                    <Link href={`/contacto?subject=Limpieza - ${service.title}`}>
                      <Button variant="outline" className="w-full justify-center text-sm">
                        {service.btnText}
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Banner de Contacto Rapido */}
          <div className="bg-[#182838] rounded-3xl p-8 sm:p-16 text-center text-white relative overflow-hidden shadow-2xl">
            {/* Elementos decorativos */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-accent/20 rounded-full blur-3xl" />
            
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl sm:text-4xl font-serif">¿Deseas una cotización personalizada?</h2>
              <p className="text-lg text-gray-300 font-light">
                Indícanos las dimensiones de tu alfombra, cantidad de sillones o modelo de tu vehículo, y te responderemos con un presupuesto a la brevedad.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contacto">
                  <Button size="lg" className="w-full sm:w-auto bg-brand-accent! hover:bg-brand-accent-dark! text-white! border-brand-accent!">
                    Solicitar Presupuesto
                  </Button>
                </Link>
                <a href="https://wa.me/56987887209" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/30 hover:bg-white/10 text-white!">
                    Escríbenos por WhatsApp
                  </Button>
                </a>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
