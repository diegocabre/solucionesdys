"use client";

import { useState } from "react";
import { CATEGORIAS_IA, IA_NOVEDADES, type CategoriaIA } from "@/lib/ia-content";

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
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-dys-primary ${
              filtro === c
                ? "bg-dys-primary text-dys-on-primary border-dys-primary"
                : "bg-dys-surface text-dys-text border-dys-border hover:border-dys-primary hover:text-dys-primary"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <ul className="grid gap-x-10 md:grid-cols-2">
        {lista.map((n) => (
          <li key={n.titulo} className="flex min-w-0 flex-col border-t border-dys-border pt-6 pb-8">
            <p className="text-sm text-dys-muted">{n.categoria}</p>
            <h3 className="mt-2 font-display text-xl font-semibold text-dys-text leading-snug">{n.titulo}</h3>
            <p className="mt-3 grow leading-relaxed text-dys-muted">{n.resumen}</p>
            {n.fuente && (
              <a
                href={n.fuente.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 self-start font-semibold text-dys-link underline underline-offset-4 hover:text-dys-text"
              >
                {n.fuente.etiqueta}
                <span className="sr-only"> (abre en una pestaña nueva)</span>
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
