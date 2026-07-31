'use client';

import { motion } from 'framer-motion';
import { ShoppingBag, Sparkles, Code, Globe, HelpCircle } from 'lucide-react';
import Button from '@/components/Button';
import ServiceCard from '@/components/ServiceCard';
import ServicesCarousel from '@/components/ServicesCarousel';

export default function Home() {
  const services = [
    {
      title: "Productos Online",
      description: "Catálogo completo de herramientas y materiales de ferretería listos para tu compra digital centralizada.",
      icon: ShoppingBag,
      id: "productos",
      href: "/productos"
    },
    {
      title: "Limpieza de Hogar & Auto",
      description: "Especialistas en limpieza de tapicería profunda, mantención de canaletas y lavado de interiores de vehículos.",
      icon: Sparkles,
      id: "limpieza",
      href: "/servicios"
    },
    {
      title: "Diseño de Sitios Web",
      description: "Desarrollamos landing pages, tiendas en línea y catálogos a medida para digitalizar tu negocio.",
      icon: Code,
      id: "webs",
      href: "/webs"
    },
    {
      title: "Nuestros Partners",
      description: "Visita los sitios web de nuestros clientes y aliados que ya están triunfando en el mundo digital.",
      icon: Globe,
      id: "partners",
      href: "/partners"
    }
  ];

  return (
    <div className="flex flex-col bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Background gradient pattern matching the logo */}
        <div className="absolute inset-0 -z-10 bg-linear-to-b from-[#182838]/10 via-background to-background">
          <div className="absolute top-0 -left-1/4 w-[600px] h-[600px] bg-brand-accent/5 blur-3xl rounded-full"></div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand-green/5 blur-3xl rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-brand-accent/10 border border-brand-accent/20">
              <span className="text-sm font-semibold tracking-wider text-brand-accent uppercase">
                Soluciones DyS • 100% Enfocados
              </span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-brand-primary leading-tight">
              Calidad y <br/>
              <span className="font-serif italic font-light text-brand-accent">Confianza</span> digital
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-lg leading-relaxed font-light">
              Desde herramientas y suministros esenciales en línea, hasta limpieza integral del hogar y desarrollo web profesional para impulsar tu marca.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button size="lg" onClick={() => window.location.href='/productos'}>
                Ver Productos
              </Button>
              <Button size="lg" variant="outline" onClick={() => window.location.href='#servicios'}>
                Nuestras Áreas
              </Button>
            </div>
          </motion.div>

          {/* Hero Image / Services Carousel */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative h-[400px] lg:h-[550px] rounded-3xl overflow-hidden shadow-2xl border border-gray-200/20"
          >
            <ServicesCarousel />
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicios" className="py-24 bg-white dark:bg-slate-950 border-y border-gray-100 dark:border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-semibold tracking-widest text-brand-green uppercase bg-brand-green/10 px-3 py-1 rounded-full">
              Servicios & Productos
            </span>
            <h3 className="text-4xl font-bold text-brand-primary dark:text-white">
              ¿Qué Ofrecemos?
            </h3>
            <p className="text-gray-500 font-light">
              Soluciones diseñadas para simplificar tu vida y potenciar tu presencia en internet.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, idx) => (
              <ServiceCard
                key={service.id}
                title={service.title}
                description={service.description}
                Icon={service.icon}
                href={service.href}
                index={idx}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#182838] text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 flex justify-center items-center">
           <Sparkles className="w-[800px] h-[800px] text-white -rotate-12 transform translate-x-1/4" />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-3xl mx-auto px-4 space-y-8"
        >
          <h2 className="text-4xl lg:text-5xl font-serif">¿Hablamos sobre tu proyecto?</h2>
          <p className="text-xl text-gray-300 font-light">
            Escríbenos para coordinar servicios de limpieza profunda o iniciar la cotización de tu sitio web corporativo.
          </p>
          <Button size="lg" variant="primary" className="mt-8 bg-white! text-[#182838]! hover:bg-gray-100! shadow-lg shadow-white/10" onClick={() => window.location.href='/contacto'}>
            Contáctanos Hoy
          </Button>
        </motion.div>
      </section>
    </div>
  );
}
