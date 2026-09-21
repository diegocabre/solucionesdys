'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { PARTNER_PROJECTS } from '@/lib/partners';

const slides = PARTNER_PROJECTS.map((project) => ({
  id: project.id,
  title: project.name,
  description: project.summary,
  image: project.cover ?? project.image,
  href: '/partners',
}));

export default function ServicesCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-full relative overflow-hidden bg-slate-900 rounded-2xl group">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-black/40 z-10" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={slides[current].image}
            alt={`Proyecto real: ${slides[current].title}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 p-8 z-20 bg-linear-to-t from-black/90 via-black/40 to-transparent">
            <span className="text-brand-accent-light text-xs font-semibold uppercase tracking-widest">
              Proyecto real
            </span>
            <motion.h3
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-white text-2xl md:text-3xl font-bold mt-1"
            >
              {slides[current].title}
            </motion.h3>
            {slides[current].description && (
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-gray-200 mt-2 text-lg font-light"
              >
                {slides[current].description}
              </motion.p>
            )}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Link
                href={slides[current].href}
                className="inline-block mt-4 text-sm font-semibold text-white underline decoration-brand-accent-light underline-offset-4 hover:text-brand-accent-light transition-colors"
              >
                Ver proyecto →
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Progress indicators */}
      <div className="absolute top-4 left-0 right-0 flex justify-center gap-2 z-20">
        {slides.map((_, idx) => (
          <div
            key={idx}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === current ? 'w-8 bg-brand-accent' : 'w-4 bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
