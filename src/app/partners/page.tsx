"use client";

import { motion } from "framer-motion";
import { Code, Sparkles, Smartphone } from "lucide-react";
import Button from "@/components/Button";
import Link from "next/link";
import PartnersShowcase from "@/components/PartnersShowcase";

export default function PartnersPage() {
  return (
    <div className="min-h-screen py-16 bg-dys-bg relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-dys-primary/5 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Encabezado */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-dys-primary/10 border border-dys-primary/20"
          >
            <Sparkles className="w-4 h-4 text-dys-primary" />
            <span className="text-sm font-semibold tracking-wider text-dys-primary uppercase">
              Proyectos en el Mundo Digital
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-bold text-dys-text"
          >
            Nuestros <span className="text-dys-primary">Partners</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-dys-muted font-light leading-relaxed"
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
          className="bg-dys-surface border border-dys-border rounded-3xl p-8 sm:p-16 text-center text-dys-text relative overflow-hidden shadow-2xl"
        >
          {/* Background shapes */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-dys-primary/10 rounded-full blur-3xl" />
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 p-2 bg-dys-text/10 rounded-xl backdrop-blur-xs">
              <Code className="w-5 h-5 text-dys-primary" />
              <Smartphone className="w-5 h-5 text-dys-primary" />
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold leading-tight">
              ¿Listo para dar el salto digital?
            </h2>
            <p className="text-lg text-dys-muted font-light leading-relaxed">
              Hacemos tu sitio corporativo, catálogo o tienda online a medida, para que tus clientes te encuentren y te escriban.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contacto">
                <Button size="lg" className="w-full sm:w-auto bg-dys-primary! hover:bg-dys-primary/85! text-dys-on-primary! border-dys-primary!">
                  Cotizar mi sitio
                </Button>
              </Link>
              <Link href="/contacto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-dys-text/40 hover:bg-dys-text/10 text-dys-text!">
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
