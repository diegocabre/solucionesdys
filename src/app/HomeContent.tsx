'use client';

import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/Button';
import ServicesCarousel from '@/components/ServicesCarousel';
import FeaturedCase from '@/components/FeaturedCase';
import FaqSection from '@/components/FaqSection';
import { PARTNER_PROJECTS, type PartnerProject } from '@/lib/partners';
import type { ReactNode } from 'react';

// Ejemplos reales de cada tipo de sitio (según su descripción en partners.ts).
// Landing Pages no tiene un caso confirmado, así que va sin captura.
const ejemplo = (name: string) => PARTNER_PROJECTS.find((p) => p.name === name);

const SERVICIOS = {
  corporativo: {
    title: "Sitios Corporativos",
    description: "Varias páginas para contar quién eres, qué ofreces y cómo contactarte, para que un cliente nuevo confíe antes de escribirte.",
    proyecto: ejemplo("Rincón del Aromo"),
  },
  tienda: {
    title: "E-commerce & Tiendas Online",
    description: "Tu catálogo con carrito y pago en línea, para vender también cuando el local está cerrado.",
    proyecto: ejemplo("Dogtoralia Vet"),
  },
  landing: {
    title: "Landing Pages",
    description: "Una sola página enfocada en una oferta o campaña, pensada para que quien llega te escriba.",
  },
};

// Servicio con la captura de un proyecto real, enmarcada igual que en FeaturedCase.
function ServicioConEjemplo({
  title,
  description,
  proyecto,
  sizes,
}: {
  title: string;
  description: string;
  proyecto?: PartnerProject;
  sizes: string;
}) {
  return (
    <Link href="/webs" className="group block">
      {proyecto && (
        <div className="relative aspect-[24/11] rounded-3xl overflow-hidden shadow-2xl border border-gray-200/40">
          <Image
            src={proyecto.image}
            alt={`${title}: sitio de ${proyecto.name} desarrollado por Soluciones DyS`}
            fill
            sizes={sizes}
            className="object-cover object-top transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        </div>
      )}
      <h3 className="mt-6 text-2xl font-bold text-brand-primary transition-colors group-hover:text-brand-accent-dark">
        {title}
      </h3>
      <p className="mt-2 max-w-prose text-gray-600 font-light leading-relaxed">{description}</p>
    </Link>
  );
}

// Contenido interactivo de la home. Recibe desde page.tsx (servidor) las secciones
// que leen datos en el servidor, como los últimos artículos del blog.
export default function HomeContent({ serverSections }: { serverSections?: ReactNode }) {

  return (
    <div className="flex flex-col bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Background gradient pattern matching the logo */}
        <div className="absolute inset-0 -z-10 bg-linear-to-b from-[#182838]/10 via-background to-background">
          <div className="absolute top-0 -left-1/4 w-[600px] h-[600px] bg-brand-accent/5 blur-3xl rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 z-10 grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-12 items-center">
          <div className="space-y-6 sm:space-y-8">
            <div className="inline-block px-3 sm:px-4 py-1.5 rounded-full bg-brand-accent/10 border border-brand-accent/20">
              <span className="text-xs sm:text-sm font-semibold tracking-wider text-brand-accent-dark uppercase">
                Soluciones DyS • Puerto Varas, Chile
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-bold text-brand-primary leading-tight">
              Diseño y desarrollo web en{' '}
              <span className="text-brand-accent-dark whitespace-nowrap">Puerto Varas</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-lg leading-relaxed font-light">
              {/* En móvil, versión corta: el H1 ya nombra Puerto Varas */}
              <span className="sm:hidden">
                Sitios web a medida para pymes: rápidos en el celular, visibles en Google y con WhatsApp a un toque.
              </span>
              <span className="hidden sm:inline">
                Sitios web a medida para pymes de Puerto Varas, Los Lagos y todo Chile: rápidos en el celular, visibles en Google y con WhatsApp a un toque.
              </span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button size="lg" onClick={() => window.location.href='/webs'}>
                Ver servicios
              </Button>
              <Button size="lg" variant="outline" onClick={() => window.location.href='/contacto'}>
                Cotizar mi sitio
              </Button>
            </div>
          </div>

          {/* Hero Image / Services Carousel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <ServicesCarousel />
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicios" className="py-24 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-14 space-y-4">
            <h2 className="text-4xl font-bold text-brand-primary">
              Tres formas de llevar tu negocio a internet
            </h2>
            <p className="text-lg text-gray-600 font-light leading-relaxed">
              Elige según lo que necesitas: captar clientes con una campaña, mostrar tu empresa o vender en línea.
            </p>
          </div>

          {/* Composición 7/5: el servicio principal con su captura a la izquierda; a la derecha,
              Landing Pages en bloque marino y la tienda online con su captura. */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-14 items-start">
            {/* Fija al hacer scroll: la columna derecha es más alta y así no queda un hueco bajo esta */}
            <div className="lg:col-span-7 lg:sticky lg:top-28">
              <ServicioConEjemplo {...SERVICIOS.corporativo} sizes="(min-width: 1280px) 700px, (min-width: 1024px) 56vw, 100vw" />
            </div>

            <div className="lg:col-span-5 grid gap-14">
              <Link
                href="/webs"
                className="group block rounded-3xl bg-brand-primary p-8 sm:p-10 text-white shadow-2xl"
              >
                <h3 className="text-2xl font-bold">{SERVICIOS.landing.title}</h3>
                <p className="mt-3 text-gray-300 font-light leading-relaxed">{SERVICIOS.landing.description}</p>
                <ArrowRight
                  className="mt-8 w-6 h-6 text-brand-accent transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                  aria-hidden="true"
                />
              </Link>

              <ServicioConEjemplo {...SERVICIOS.tienda} sizes="(min-width: 1280px) 500px, (min-width: 1024px) 40vw, 100vw" />
            </div>
          </div>
        </div>
      </section>

      <FeaturedCase />

      {/* Partners: lista con enlace a cada sitio, misma proporción 5/7 que el caso de éxito */}
      <section id="partners" aria-labelledby="partners-titulo" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-12">
          <div className="space-y-4">
            <h2 id="partners-titulo" className="text-4xl font-bold text-brand-primary">
              Nuestros Partners
            </h2>
            <p className="max-w-md text-lg text-gray-600 font-light leading-relaxed">
              Sitios que hicimos para clientes y aliados. Entra y míralos funcionando.
            </p>
          </div>

          <ul className="border-t border-gray-200">
            {PARTNER_PROJECTS.map((project) => (
              <li key={project.id} className="border-b border-gray-200">
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-6 py-6"
                >
                  <span className="min-w-0">
                    <span className="block font-display text-2xl sm:text-3xl font-semibold text-brand-primary transition-colors group-hover:text-brand-accent-dark">
                      {project.name}
                    </span>
                    <span className="mt-1 block text-sm text-gray-600">{project.category}</span>
                  </span>
                  <ArrowUpRight
                    className="w-6 h-6 shrink-0 text-brand-accent-dark transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none"
                    aria-hidden="true"
                  />
                  <span className="sr-only">(abre en una pestaña nueva)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <FaqSection />

      {serverSections}

      {/* CTA Section */}
      <section className="py-24 bg-[#182838] text-white relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8"
        >
          <h2 className="max-w-2xl text-4xl lg:text-5xl font-bold">¿Hablamos sobre tu proyecto?</h2>
          <p className="max-w-2xl text-xl text-gray-300 font-light">
            Cuéntanos qué necesita tu negocio y te respondemos con una propuesta clara, sin compromiso.
          </p>
          <Button size="lg" variant="primary" className="mt-8 bg-white! text-[#182838]! hover:bg-gray-100! shadow-lg shadow-white/10" onClick={() => window.location.href='/contacto'}>
            Cotizar mi sitio
          </Button>
        </motion.div>
      </section>
    </div>
  );
}
