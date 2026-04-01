'use client';

import { motion } from 'framer-motion';
import { Hammer, Truck, Briefcase, Globe } from 'lucide-react';
import Button from '@/components/Button';
import ServiceCard from '@/components/ServiceCard';
import ServicesCarousel from '@/components/ServicesCarousel';

export default function Home() {
  const services = [
    {
      title: "Productos y Ferretería",
      description: "Catálogo completo de herramientas y materiales de construcción con los mejores estándares del mercado.",
      icon: Hammer,
      id: "ferreteria",
      href: "/productos"
    },
    {
      title: "Servicios Generales",
      description: "Servicio de limpieza de tapicería y alfombras de casa y auto, y traslados VIP a ejecutivos y empresas (máx. 4 personas).",
      icon: Truck,
      id: "servicios",
      href: "/servicios"
    },
    {
      title: "Consultoría y Partners",
      description: "Asesoramiento profesional y alianzas con empresas partners especializadas para impulsar tus proyectos.",
      icon: Briefcase,
      id: "consultoria",
      href: "/consultoria"
    },
    {
      title: "Creación de Sitios Web",
      description: "Desarrollo de presencia digital y tiendas online para llevar tu negocio, taller o constructora al siguiente nivel.",
      icon: Globe,
      id: "webs",
      href: "/webs"
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center bg-gray-50 overflow-hidden">
        {/* Background gradient pattern */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 -left-1/4 w-1/2 h-full bg-brand-accent/5 blur-3xl rounded-full"></div>
          <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gray-200/50 blur-3xl rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-brand-accent/10 border border-brand-accent/20">
              <span className="text-sm font-semibold tracking-wider text-brand-accent uppercase">
                Productos Online y Soluciones
              </span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-brand-primary leading-tight">
              Construimos <br/>
              <span className="font-serif italic font-light text-brand-accent">lo que imaginas</span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-lg leading-relaxed">
              Soluciones integrales de ferretería, logística, consultoría y tecnología para hacer realidad tus proyectos.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" onClick={() => window.location.href='/productos'}>
                Ver Catálogo
              </Button>
              <Button size="lg" variant="outline" onClick={() => window.location.href='#servicios'}>
                Nuestros Servicios
              </Button>
            </div>
          </motion.div>

          {/* Hero Image / Services Carousel */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative h-[400px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl"
          >
            <ServicesCarousel />
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicios" className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-sm font-semibold tracking-wider text-brand-accent uppercase">
              Todo en un solo lugar
            </h2>
            <h3 className="text-4xl font-bold text-brand-primary">
              Nuestros Servicios
            </h3>
            <p className="text-gray-500">
              No solo vendemos herramientas, te acompañamos en todo el ciclo de vida de tu negocio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
      <section className="py-24 bg-slate-900 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 flex justify-center items-center">
           <Hammer className="w-[800px] h-[800px] text-white -rotate-12 transform translate-x-1/4" />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-3xl mx-auto px-4 space-y-8"
        >
          <h2 className="text-4xl lg:text-5xl font-serif">¿Listo para empezar?</h2>
          <p className="text-xl text-gray-300 font-light">
            Consulta por presupuestos en herramientas, transporte de materiales o solicita una asesoría.
          </p>
          <Button size="lg" variant="primary" className="mt-8 bg-white! text-slate-900! hover:bg-gray-100! ring-white!" onClick={() => window.location.href='/contacto'}>
            Contáctanos Hoy
          </Button>
        </motion.div>
      </section>
    </div>
  );
}
