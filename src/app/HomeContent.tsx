import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/Button';
import FeaturedCase from '@/components/FeaturedCase';
import FaqSection from '@/components/FaqSection';
import RutaDys from '@/components/RutaDys';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import { PARTNER_PROJECTS } from '@/lib/partners';
import { AREA_SERVED, BUSINESS, PRECIO_DESDE } from '@/lib/site';
import type { ReactNode } from 'react';

// "A, B, C y D"
const enumerar = (items: readonly string[]) => items.join(', ').replace(/, ([^,]*)$/, ' y $1');

// Respaldo del llamado final: solo hechos confirmados; comunas y clientes salen de sus fuentes únicas.
const RESPALDO = [
  'Hablas directo con quien diseña y programa tu sitio.',
  `Nos juntamos en persona en ${enumerar(AREA_SERVED)}.`,
  `Sitios reales para ${enumerar(PARTNER_PROJECTS.map((p) => p.name))}.`,
];

// Ejemplos reales de cada tipo de sitio (según su descripción en partners.ts).
// Landing Pages no tiene un caso confirmado, así que va sin ejemplo.
const SERVICIOS = [
  {
    title: 'Sitios corporativos',
    motivo: 'Diseño de Sitios Web',
    description: 'Varias páginas para contar quién eres, qué ofreces y cómo contactarte, para que un cliente nuevo confíe antes de escribirte.',
    ejemplo: PARTNER_PROJECTS.find((p) => p.name === 'Rincón del Aromo'),
  },
  {
    title: 'Tiendas online',
    motivo: 'Tienda Online / E-commerce',
    description: 'Tu catálogo con carrito y pago en línea, para vender también cuando el local está cerrado.',
    ejemplo: PARTNER_PROJECTS.find((p) => p.name === 'Dogtoralia Vet'),
  },
  {
    title: 'Landing pages',
    motivo: 'Landing Page',
    description: 'Una sola página enfocada en una oferta o campaña, pensada para que quien llega te escriba.',
    ejemplo: undefined,
  },
];

// Opiniones reales de Google, copiadas tal cual (noviembre 2026). Sin AggregateRating: son pocas y propias.
const OPINIONES = [
  {
    texto: 'Excelente servicio y atención. Entendió exactamente lo que queríamos y lo reflejo en nuestra página web. Súper recomendado!',
    autor: 'Carolina Cosentino, Caroline Magic',
  },
  {
    texto: 'Muy buen servicio, siempre dispuestos a resolver dudas y a dar nuevas ideas. Los recomiendo',
    autor: 'Equipo de Dogtoralia Vet',
  },
];

// Home. Recibe desde page.tsx las secciones que leen datos en el servidor, como los últimos artículos del blog.
export default function HomeContent({ serverSections }: { serverSections?: ReactNode }) {
  return (
    <div className="flex flex-col bg-dys-bg">
      {/* Hero: el titular solo, en grande; el punto amarillo del logo lo cierra (único gesto animado del sitio). */}
      <section className="pt-10 pb-20 sm:pt-24 sm:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="mb-4 text-sm sm:text-base font-semibold text-dys-muted">
            Diseño y desarrollo web en Puerto Varas
          </p>
          <h1 className="firma-punto firma-punto-entrada max-w-[15ch] text-titular-1 font-bold text-dys-text">
            Sitios web y apps a medida para tu pyme
          </h1>

          <div className="mt-6 sm:mt-10 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto] gap-8 lg:gap-12 items-end">
            <p className="max-w-[52ch] text-lg sm:text-xl text-dys-muted leading-relaxed">
              Tu proyecto queda seguro y con apoyo después de la entrega: actualizaciones, respaldos y soporte. Hablas
              directo con quien lo construye.
            </p>
            <div className="flex flex-col sm:flex-row lg:justify-end gap-4">
              <Button size="lg" href="/contacto" className="whitespace-nowrap">
                Cotizar mi proyecto
              </Button>
              <Button size="lg" variant="outline" href={BUSINESS.whatsapp} external className="whitespace-nowrap">
                <WhatsAppIcon className="size-5" />
                Escribir por WhatsApp
              </Button>
            </div>
          </div>
          <p className="mt-8 text-dys-muted">
            <a href="#opiniones" className="underline underline-offset-4 decoration-dys-border hover:text-dys-text">
              <span aria-hidden="true" className="text-dys-accent">★★★★★</span>
              <span className="sr-only">5 de 5 estrellas en Google:</span>{' '}
              “Entendió exactamente lo que queríamos” · Caroline Magic
            </a>
          </p>
        </div>
      </section>

      {/* Trabajo real en vez de un carrusel: los cuatro sitios, cada uno enlazado a su web.
          En móvil es una fila que se desliza; desde lg, una grilla de 2 × 2. */}
      <section aria-labelledby="sitios-reales" className="dys-light bg-dys-bg py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="sitios-reales" className="max-w-2xl text-titular-3 font-semibold text-dys-text">
            Sitios reales hechos por nosotros. Entra y míralos funcionando.
          </h2>

          <ul className="mt-10 -mx-4 px-4 sm:mx-0 sm:px-0 flex lg:grid lg:grid-cols-2 gap-6 lg:gap-x-10 lg:gap-y-12 overflow-x-auto lg:overflow-visible snap-x snap-mandatory scroll-px-4 sm:scroll-px-0 pb-2">
            {PARTNER_PROJECTS.map((project, i) => (
              <li key={project.id} className="snap-start shrink-0 w-[82%] sm:w-[60%] lg:w-auto">
                <a href={project.url} target="_blank" rel="noopener noreferrer" className="group relative block">
                  <div className="relative aspect-[24/11] overflow-hidden rounded-xl border border-dys-border">
                    <Image
                      src={project.image}
                      alt={`Sitio web de ${project.name}, desarrollado por Soluciones DyS`}
                      fill
                      priority={i === 0}
                      sizes="(min-width: 1280px) 590px, (min-width: 1024px) 46vw, 82vw"
                      className="object-cover object-top"
                    />
                  </div>
                  <span className="mt-4 block font-display text-xl sm:text-2xl font-semibold text-dys-text underline-offset-4 decoration-2 group-hover:underline group-hover:decoration-dys-primary">
                    {project.name}
                  </span>
                  <span className="mt-1 block text-sm text-dys-muted">{project.summary}</span>
                  <span className="sr-only">(abre en una pestaña nueva)</span>
                </a>
              </li>
            ))}
          </ul>

          <div id="opiniones" className="scroll-mt-24 mt-16">
            <h3 className="text-titular-3 font-semibold text-dys-text">Lo que dicen en Google</h3>
            <ul className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
              {OPINIONES.map((o) => (
                <li key={o.autor} className="border-t border-dys-border pt-6">
                  <figure>
                    <blockquote className="text-lg text-dys-text leading-relaxed">“{o.texto}”</blockquote>
                    <figcaption className="mt-3 text-sm text-dys-muted">{o.autor} · 5 estrellas en Google</figcaption>
                  </figure>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm text-dys-muted">Hechos a medida con Next.js y React, sin plantillas ni WordPress.</p>
          </div>
        </div>
      </section>

      {/* Servicios como lista tipográfica: las capturas ya están arriba, aquí basta nombrar el ejemplo. */}
      <section id="servicios" aria-labelledby="servicios-titulo" className="scroll-mt-20 py-24 bg-dys-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-12">
          <div className="space-y-5">
            <h2 id="servicios-titulo" className="text-titular-2 font-bold text-dys-text">
              Tres formas de llevar tu negocio a internet
            </h2>
            <p className="max-w-md text-lg text-dys-muted leading-relaxed">
              Elige según lo que necesitas: captar clientes con una campaña, mostrar tu empresa o vender en línea.
            </p>
            <p className="text-lg text-dys-text">
              <Link href="/contacto#formulario" className="underline underline-offset-4 decoration-dys-primary hover:text-dys-primary">
                Desde <strong className="font-semibold">{PRECIO_DESDE}</strong> por una página estática
              </Link>
              .
            </p>
          </div>

          <ul className="border-t border-dys-border">
            {SERVICIOS.map((servicio) => (
              <li key={servicio.title} className="relative border-b border-dys-border py-8">
                <h3 className="text-titular-3 font-semibold text-dys-text">{servicio.title}</h3>
                <p className="mt-3 max-w-[60ch] text-dys-muted leading-relaxed">{servicio.description}</p>
                {servicio.ejemplo && (
                  <p className="mt-3 text-sm text-dys-muted">
                    Ejemplo real:{' '}
                    <a
                      href={servicio.ejemplo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative z-10 text-dys-link underline underline-offset-4 hover:text-dys-text"
                    >
                      {servicio.ejemplo.name}
                    </a>
                  </p>
                )}
                {/* after: extiende el clic a toda la fila; el ejemplo real queda por encima. */}
                <Link
                  href={`/contacto?motivo=${encodeURIComponent(servicio.motivo)}#formulario`}
                  className="mt-4 inline-block font-semibold text-dys-link underline underline-offset-4 hover:text-dys-text after:absolute after:inset-0"
                >
                  Cotizar {servicio.title.toLowerCase()}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          <Link href="/webs" className="font-semibold text-dys-link underline underline-offset-4 hover:text-dys-text">
            Ver en detalle cómo trabajamos cada tipo de sitio
          </Link>
        </div>
      </section>

      <FeaturedCase />

      <RutaDys />

      <FaqSection />

      {serverSections}

      {/* Cierre: sin animación de entrada, para que se vea aunque no cargue el JavaScript. */}
      <section aria-labelledby="cierre-titulo" className="py-24 bg-dys-bg text-dys-text">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[7fr_5fr] gap-12 lg:gap-16 items-end">
          <div className="space-y-8">
            <h2 id="cierre-titulo" className="max-w-2xl text-titular-2 font-bold">
              ¿Hablamos sobre tu proyecto?
            </h2>
            <p className="max-w-2xl text-xl text-dys-muted">
              Cuéntanos qué necesita tu negocio y te respondemos con una propuesta clara, sin compromiso.
            </p>
            <Button size="lg" href="/contacto">
              Cotizar mi proyecto
            </Button>
          </div>

          {/* Respaldo concreto: hechos confirmados (PRODUCT.md) y casos reales de partners.ts */}
          <ul className="border-t border-dys-border text-lg text-dys-text">
            {RESPALDO.map((hecho) => (
              <li key={hecho} className="border-b border-dys-border py-4">
                {hecho}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
