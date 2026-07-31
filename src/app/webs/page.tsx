import { Globe, Code, Layers, MousePointerClick, Zap, Search, Sparkles, Smartphone } from 'lucide-react';
import Button from '@/components/Button';
import Link from 'next/link';

export default function WebsPage() {
  const webServices = [
    {
      title: "Landing Pages",
      description: "Páginas de un solo scroll diseñadas específicamente para convertir visitas en clientes potenciales. Perfectas para promocionar un servicio o campaña en redes sociales.",
      icon: MousePointerClick,
      color: "from-blue-500/10 to-blue-600/5 text-blue-600 dark:text-blue-400"
    },
    {
      title: "Sitios Corporativos",
      description: "Sitios profesionales multipáginas para constructoras, talleres, oficinas y comercios que desean transmitir confianza y establecer una sólida presencia de marca.",
      icon: Layers,
      color: "from-amber-500/10 to-amber-600/5 text-amber-600 dark:text-amber-400"
    },
    {
      title: "E-Commerce & Catálogos",
      description: "Tiendas virtuales completas con carrito de compras, catálogos enlazados a bases de datos y pasarela de pagos integrada para vender tus productos online sin esfuerzo.",
      icon: Code,
      color: "from-green-500/10 to-green-600/5 text-green-600 dark:text-brand-accent-light"
    }
  ];

  const processSteps = [
    {
      step: "01",
      title: "Planificación",
      desc: "Analizamos tu negocio y definimos el mapa del sitio junto con los objetivos clave de conversión."
    },
    {
      step: "02",
      title: "Diseño UX/UI",
      desc: "Creamos la maqueta visual alineada a los colores e identidad corporativa de tu marca."
    },
    {
      step: "03",
      title: "Desarrollo",
      desc: "Codificamos con tecnologías modernas (React/Next.js) garantizando velocidad óptima y SEO integrado."
    },
    {
      step: "04",
      title: "Lanzamiento",
      desc: "Realizamos pruebas de usabilidad, conectamos tu dominio y publicamos tu sitio al mundo digital."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 pt-12 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Hero Section / Cabecera */}
          <div className="mb-20 flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1 space-y-6">
              <div className="inline-block px-4 py-1.5 rounded-full bg-brand-accent/10 border border-brand-accent/20">
                <span className="text-sm font-semibold tracking-wider text-brand-accent uppercase">
                  Diseño & Desarrollo Profesional
                </span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold text-brand-primary leading-tight">
                Lleva tu marca al <br />
                <span className="text-brand-accent italic font-serif font-light">Mundo Digital</span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 font-light leading-relaxed max-w-xl">
                Diseñamos ecosistemas web rápidos, atractivos y optimizados para motores de búsqueda. Potenciamos tu negocio para atraer nuevos clientes las 24 horas del día.
              </p>
              <div className="pt-2">
                <Link href="/contacto?subject=Diseño Web">
                  <Button variant="primary" size="lg" className="shadow-lg hover:shadow-brand-accent/40 transition-all">
                    Iniciar mi Proyecto
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Visual card */}
            <div className="flex-1 w-full bg-linear-to-br from-[#182838] to-[#0f172a] rounded-3xl p-8 sm:p-12 text-white border border-slate-800 relative overflow-hidden shadow-2xl">
              <div className="absolute -bottom-10 -right-10 p-4 opacity-5 rotate-12">
                <Globe className="w-96 h-96" />
              </div>
              
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3">
                  <Sparkles className="text-brand-accent-light w-6 h-6 animate-pulse" />
                  <h3 className="text-xl font-bold font-serif text-brand-accent-light">Estándares Premium</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex gap-4 items-start">
                    <div className="p-2 bg-white/10 rounded-lg"><Zap className="w-5 h-5 text-brand-accent" /></div>
                    <div>
                      <h4 className="font-semibold text-sm">Velocidad Ultrarrápida</h4>
                      <p className="text-xs text-gray-300">Carga en menos de 1.5 segundos para no perder visitas.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="p-2 bg-white/10 rounded-lg"><Smartphone className="w-5 h-5 text-brand-accent" /></div>
                    <div>
                      <h4 className="font-semibold text-sm">Diseño 100% Responsivo</h4>
                      <p className="text-xs text-gray-300">Adaptado a celulares, tablets y computadoras.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="p-2 bg-white/10 rounded-lg"><Search className="w-5 h-5 text-brand-accent" /></div>
                    <div>
                      <h4 className="font-semibold text-sm">Optimización SEO Base</h4>
                      <p className="text-xs text-gray-300">Estructurado para aparecer en las búsquedas de Google.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Grid de Tipos de Sitio */}
          <div className="mb-24 space-y-12">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-brand-primary font-serif">¿Qué tipo de sitio web necesitas?</h2>
              <p className="text-gray-500 font-light max-w-xl mx-auto">Selecciona la estructura ideal para cumplir tus metas de negocio.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {webServices.map((service, idx) => {
                const Icon = service.icon;
                return (
                  <div 
                    key={idx}
                    className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-gray-100 dark:border-slate-800 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-6">
                      <div className={`w-12 h-12 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold text-brand-primary">{service.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-light leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                    <div className="pt-6 border-t border-gray-50 dark:border-slate-800 mt-6">
                      <Link href={`/contacto?subject=Consulta - ${service.title}`}>
                        <span className="text-xs font-semibold text-brand-accent hover:text-brand-accent-dark transition-colors cursor-pointer inline-flex items-center gap-1">
                          Saber más &rarr;
                        </span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Proceso de Trabajo */}
          <div className="bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800/80 rounded-3xl p-8 sm:p-16 space-y-16">
            <div className="text-center space-y-2">
              <span className="text-xs font-semibold text-brand-accent uppercase bg-brand-accent/10 px-3 py-1 rounded-full">Metodología</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-brand-primary font-serif">Proceso de Desarrollo</h2>
              <p className="text-gray-500 font-light max-w-xl mx-auto">De la idea a la pantalla de forma ordenada y transparente.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {processSteps.map((step, idx) => (
                <div key={idx} className="space-y-4 relative">
                  <div className="text-4xl font-bold font-serif text-brand-accent/30">{step.step}</div>
                  <h3 className="text-lg font-bold text-brand-primary">{step.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-light leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
