"use client";

import { motion } from "framer-motion";
import { Code, Sparkles, Smartphone } from "lucide-react";
import Button from "@/components/Button";
import Link from "next/link";
import PartnersShowcase from "@/components/PartnersShowcase";

export default function PartnersPage() {
  return (
    <div className="min-h-screen py-16 bg-background relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-accent/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-10 right-1/4 w-[600px] h-[600px] bg-brand-green/5 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Encabezado */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-accent/10 border border-brand-accent/20"
          >
            <Sparkles className="w-4 h-4 text-brand-accent" />
            <span className="text-sm font-semibold tracking-wider text-brand-accent uppercase">
              Proyectos en el Mundo Digital
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-bold text-brand-primary"
          >
            Nuestros <span className="font-serif italic font-light text-brand-accent">Partners</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 font-light leading-relaxed"
          >
            Presentamos los sitios web que hemos diseñado y desarrollado para nuestros clientes y aliados. Proyectos activos, optimizados y listos para competir en internet.
          </motion.p>
        </div>

        {/* Showcase interactivo de proyectos */}
        <div className="mb-24">
          <PartnersShowcase />
        </div>

        {/* CTA Banner de Alianza */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-[#182838] rounded-3xl p-8 sm:p-16 text-center text-white relative overflow-hidden shadow-2xl"
        >
          {/* Background shapes */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-green/10 rounded-full blur-3xl" />
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 p-2 bg-white/10 rounded-xl backdrop-blur-xs">
              <Code className="w-5 h-5 text-brand-accent-light" />
              <Smartphone className="w-5 h-5 text-brand-accent-light" />
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold font-serif leading-tight">
              ¿Listo para dar el salto digital?
            </h2>
            <p className="text-lg text-gray-300 font-light leading-relaxed">
              Desarrollamos tu sitio corporativo, catálogo con base de datos, o tienda online a la medida con integraciones estables y diseño de vanguardia.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contacto">
                <Button size="lg" className="w-full sm:w-auto bg-brand-accent! hover:bg-brand-accent-dark! text-white! border-brand-accent!">
                  Cotizar mi Sitio Web
                </Button>
              </Link>
              <Link href="/contacto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/40 hover:bg-white/10 text-white!">
                  Convertirme en Partner
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
