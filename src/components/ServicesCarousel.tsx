'use client';

import { useState, useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { PARTNER_PROJECTS } from '@/lib/partners';

// Capturas de escritorio (24:11) enmarcadas como en FeaturedCase; el pie de
// foto va fuera de la imagen para que el texto del sitio no choque con el nuestro.
const slides = PARTNER_PROJECTS.map((project) => ({
  id: project.id,
  title: project.name,
  description: project.summary,
  image: project.image,
  href: '/partners',
}));

// Avance lento; se detiene con hover/foco y no corre con prefers-reduced-motion.
const AUTOPLAY_MS = 8000;

export default function ServicesCarousel() {
  const [current, setCurrent] = useState(0);
  const [hover, setHover] = useState(false);
  const [foco, setFoco] = useState(false);
  const reducir = useReducedMotion();
  const autoplay = !reducir && !hover && !foco;

  useEffect(() => {
    if (!autoplay) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [autoplay]);

  return (
    <div
      role="region"
      aria-roledescription="carrusel"
      aria-label="Proyectos reales"
      className="w-full"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setFoco(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setFoco(false);
      }}
    >
      {/* Marco: todas las capturas apiladas, se cruzan con opacidad */}
      <div className="relative aspect-[24/11] rounded-3xl overflow-hidden shadow-2xl border border-gray-200/40 bg-white">
        {slides.map((slide, idx) => (
          <Image
            key={slide.id}
            src={slide.image}
            alt={`Proyecto real: ${slide.title}`}
            aria-hidden={idx !== current}
            fill
            sizes="(min-width: 1280px) 600px, (min-width: 1024px) 45vw, 100vw"
            priority={idx === 0}
            className={`object-cover object-top transition-opacity duration-700 ease-out motion-reduce:transition-none ${
              idx === current ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
      </div>

      {/* Pie de foto fuera de la imagen; todos ocupan la misma celda para que la altura no salte */}
      <div className="mt-6 grid" aria-live={hover || foco ? 'polite' : 'off'}>
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            aria-hidden={idx !== current}
            inert={idx !== current}
            className={`[grid-area:1/1] transition-opacity duration-500 ease-out motion-reduce:transition-none ${
              idx === current ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <span className="text-brand-accent-dark text-xs font-semibold uppercase tracking-widest">
              Proyecto real
            </span>
            <p className="text-brand-primary text-2xl font-bold mt-1">{slide.title}</p>
            {slide.description && (
              <p className="text-gray-600 mt-2 text-lg font-light leading-relaxed">{slide.description}</p>
            )}
            <Link
              href={slide.href}
              className="inline-block mt-3 py-2 text-sm font-semibold text-brand-primary underline decoration-brand-accent underline-offset-4 hover:text-brand-accent-dark transition-colors"
            >
              Ver proyecto →
            </Link>
          </div>
        ))}
      </div>

      {/* Indicadores: botones con área táctil de 44px */}
      <div className="flex gap-1 -ml-2 mt-1">
        {slides.map((slide, idx) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => setCurrent(idx)}
            aria-label={`Ver ${slide.title}`}
            aria-current={idx === current}
            className="h-11 px-2 flex items-center group"
          >
            <span
              className={`block h-1.5 rounded-full transition-all duration-300 motion-reduce:transition-none ${
                idx === current ? 'w-8 bg-brand-accent' : 'w-4 bg-gray-300 group-hover:bg-gray-400'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
