'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  {
    id: 1,
    title: 'Productos Online',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2940&auto=format&fit=crop',
  },
  {
    id: 2,
    title: 'Transporte VIP Empresas',
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2940&auto=format&fit=crop',
  },
  {
    id: 3,
    title: 'Limpieza de Tapicería',
    description: 'Auto y Casa',
    image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?q=80&w=2874&auto=format&fit=crop',
  },
  {
    id: 4,
    title: 'Partner en Consultorías',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2940&auto=format&fit=crop',
  }
];

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
            alt={slides[current].title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 p-8 z-20 bg-linear-to-t from-black/90 via-black/40 to-transparent">
            <motion.h3 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-white text-2xl md:text-3xl font-bold"
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
