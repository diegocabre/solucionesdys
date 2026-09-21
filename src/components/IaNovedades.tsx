"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { CATEGORIAS_IA, IA_NOVEDADES, type CategoriaIA } from "@/lib/ia-content";

const COLOR_CATEGORIA: Record<CategoriaIA, string> = {
  Agentes: "bg-brand-green/10 text-brand-green-dark",
  Herramientas: "bg-brand-accent/15 text-brand-accent-dark",
  Modelos: "bg-brand-primary/10 text-brand-primary",
  "Uso responsable": "bg-amber-100 text-amber-800",
};

export default function IaNovedades() {
  const [filtro, setFiltro] = useState<CategoriaIA | "Todas">("Todas");
  const lista = IA_NOVEDADES.filter((n) => filtro === "Todas" || n.categoria === filtro);

  return (
    <div className="space-y-8">
      <div role="group" aria-label="Filtrar por categoría" className="flex flex-wrap gap-2">
        {(["Todas", ...CATEGORIAS_IA] as const).map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={filtro === c}
            onClick={() => setFiltro(c)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-accent ${
              filtro === c
                ? "bg-brand-primary text-white border-brand-primary"
                : "bg-white text-foreground border-gray-200 hover:border-brand-accent hover:text-brand-accent-dark"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {lista.map((n) => (
            <motion.li
              key={n.titulo}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-shadow p-6"
            >
              <span
                className={`self-start rounded-full px-3 py-1 text-xs font-semibold ${COLOR_CATEGORIA[n.categoria]}`}
              >
                {n.categoria}
              </span>
              <h3 className="mt-4 text-lg font-bold font-serif text-brand-primary leading-snug">{n.titulo}</h3>
              <p className="mt-3 grow text-sm leading-relaxed text-gray-600">{n.resumen}</p>
              {n.fuente && (
                <a
                  href={n.fuente.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-1.5 self-start text-sm font-semibold text-brand-accent-dark hover:text-brand-primary transition-colors"
                >
                  {n.fuente.etiqueta}
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </a>
              )}
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
