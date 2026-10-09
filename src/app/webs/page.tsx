import { Globe, Code, Layers, MousePointerClick, Zap, Search, Sparkles, Smartphone } from 'lucide-react';
import Button from '@/components/Button';
import Link from 'next/link';
import type { Metadata } from 'next';
import CasosDeExito from '@/components/CasosDeExito';
import UltimosArticulos from '@/components/UltimosArticulos';
import ZonaAtencion from '@/components/ZonaAtencion';
import JsonLd from '@/components/JsonLd';
import { getTestimoniosPublicados } from '@/lib/casos';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: "Diseño Web en Puerto Varas: sitios rápidos que traen clientes",
  description: "Sitios web, landing pages y tiendas online a medida para pymes de Puerto Varas y Los Lagos: cargan rápido en el celular, aparecen en Google y convierten visitas en consultas por WhatsApp.",
  alternates: { canonical: "/webs" },
  openGraph: {
    title: "Diseño Web en Puerto Varas: sitios rápidos que traen clientes | Soluciones DyS",
    description: "Sitios web a medida que cargan rápido, aparecen en Google y generan más consultas para tu negocio.",
    url: "/webs",
    type: "website",
    images: [{ url: "/assets/img/og-image.jpg", width: 1200, height: 630, alt: "Soluciones DyS" }],
  }
};

export default function WebsPage() {
  const webServices = [
    {
      title: "Landing Pages",
      description: "Páginas de un solo scroll diseñadas específicamente para convertir visitas en clientes potenciales. Perfectas para promocionar un servicio o campaña en redes sociales.",
      icon: MousePointerClick,
      color: "from-brand-accent/15 to-brand-accent/5 text-brand-accent-dark"
    },
    {
      title: "Sitios Corporativos",
      description: "Sitios profesionales multipáginas para constructoras, talleres, oficinas y comercios que desean transmitir confianza y establecer una sólida presencia de marca.",
      icon: Layers,
      color: "from-brand-accent/15 to-brand-accent/5 text-brand-accent-dark"
    },
    {
      title: "E-Commerce & Catálogos",
      description: "Tiendas virtuales completas con carrito de compras, catálogos enlazados a bases de datos y pasarela de pagos integrada para vender tus productos online sin esfuerzo.",
      icon: Code,
      color: "from-brand-accent/15 to-brand-accent/5 text-brand-accent-dark"
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
      desc: "Construimos tu sitio para que cargue rápido en cualquier celular y Google lo entienda desde el primer día."
    },
    {
      step: "04",
      title: "Lanzamiento",
      desc: "Realizamos pruebas de usabilidad, conectamos tu dominio y publicamos tu sitio al mundo digital."
    }
  ];

  // AggregateRating solo con reseñas reales publicadas que tengan calificación.
  const calificaciones = getTestimoniosPublicados()
    .map((c) => c.testimonio.calificacion)
    .filter((n): n is number => typeof n === 'number');
  const ratingJsonLd =
    calificaciones.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'ProfessionalService',
          '@id': `${SITE_URL}/#business`,
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: (calificaciones.reduce((a, b) => a + b, 0) / calificaciones.length).toFixed(1),
            reviewCount: calificaciones.length,
            bestRating: 5,
          },
        }
      : null;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {ratingJsonLd && <JsonLd data={ratingJsonLd} />}
      <div className="flex-1 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Hero Section / Cabecera */}
          <div className="mb-20 flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1 space-y-6">
              <div className="inline-block px-4 py-1.5 rounded-full bg-brand-accent/10 border border-brand-accent/20">
                <span className="text-sm font-semibold tracking-wider text-brand-accent-dark uppercase">
                  Diseño & Desarrollo Profesional
                </span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold text-brand-primary dark:text-white leading-tight">
                Sitios web que <br />
                <span className="text-brand-accent-dark">te traen clientes</span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 font-light leading-relaxed max-w-xl">
                Desde Puerto Varas diseñamos sitios que cargan rápido en el celular, aparecen cuando te buscan en Google y hacen fácil que te escriban por WhatsApp. Tu negocio recibiendo consultas las 24 horas, también mientras duermes.
              </p>
              <div className="pt-2">
                <Link href="/contacto?subject=Diseño Web">
                  <Button variant="primary" size="lg" className="shadow-lg hover:shadow-brand-accent/40 transition-all">
                    Cotizar mi sitio
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
                  <h2 className="text-xl font-bold text-brand-accent-light">Lo que gana tu negocio</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex gap-4 items-start">
                    <div className="p-2 bg-white/10 rounded-lg"><Zap className="w-5 h-5 text-brand-accent" /></div>
                    <div>
                      <h3 className="font-semibold text-sm">Carga rápida en el celular</h3>
                      <p className="text-xs text-gray-300">Si tu sitio demora, la visita se va a la competencia. Optimizamos cada imagen y cada línea de código.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="p-2 bg-white/10 rounded-lg"><Smartphone className="w-5 h-5 text-brand-accent" /></div>
                    <div>
                      <h3 className="font-semibold text-sm">Se ve bien en cualquier pantalla</h3>
                      <p className="text-xs text-gray-300">La mayoría de tus clientes te encontrará desde el celular.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="p-2 bg-white/10 rounded-lg"><Search className="w-5 h-5 text-brand-accent" /></div>
                    <div>
                      <h3 className="font-semibold text-sm">Aparecer en Google</h3>
                      <p className="text-xs text-gray-300">Preparado para que te encuentren quienes buscan lo que ofreces en tu zona.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="p-2 bg-white/10 rounded-lg"><Code className="w-5 h-5 text-brand-accent" /></div>
                    <div>
                      <h3 className="font-semibold text-sm">Más consultas</h3>
                      <p className="text-xs text-gray-300">Botones de WhatsApp y formularios a la vista para que contactarte sea fácil.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Grid de Tipos de Sitio */}
          <div className="mb-24 space-y-12">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-brand-primary dark:text-white">¿Qué tipo de sitio web necesitas?</h2>
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
                      <h3 className="text-xl font-bold text-brand-primary dark:text-slate-100">{service.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-light leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                    <div className="pt-6 border-t border-gray-50 dark:border-slate-800 mt-6">
                      <Link href={`/contacto?subject=Consulta - ${service.title}`}>
                        <span className="text-xs font-semibold text-brand-accent-dark hover:text-brand-primary transition-colors cursor-pointer inline-flex items-center gap-1">
                          Cotizar mi sitio &rarr;
                        </span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <CasosDeExito />

          {/* Proceso de Trabajo */}
          <div className="bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800/80 rounded-3xl p-8 sm:p-16 space-y-16">
            <div className="text-center space-y-2">
              <span className="text-xs font-semibold text-brand-accent-dark uppercase bg-brand-accent/10 px-3 py-1 rounded-full">Metodología</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-brand-primary dark:text-white">Proceso de Desarrollo</h2>
              <p className="text-gray-500 dark:text-slate-300 font-light max-w-xl mx-auto">De la idea a la pantalla de forma ordenada y transparente.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {processSteps.map((step, idx) => (
                <div key={idx} className="space-y-4 relative">
                  <div className="text-4xl font-bold font-display text-brand-accent-dark">{step.step}</div>
                  <h3 className="text-lg font-bold text-brand-primary dark:text-slate-100">{step.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-slate-300 font-light leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
      <UltimosArticulos />
      <ZonaAtencion />
    </div>
  );
}
