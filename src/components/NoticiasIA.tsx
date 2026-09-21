"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, ArrowUpRight, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import type { NoticiasResponse } from "@/lib/ia-noticias";

const VISIBLES_AL_INICIO = 9;

type Estado =
  | { tipo: "cargando" }
  | { tipo: "error" }
  | { tipo: "listo"; data: NoticiasResponse; ahora: number };

const COLOR_FUENTE: Record<string, string> = {
  anthropic: "bg-brand-accent/15 text-brand-accent-dark",
  "claude-code": "bg-brand-green/10 text-brand-green-dark",
  openai: "bg-brand-primary/10 text-brand-primary",
  deepmind: "bg-sky-100 text-sky-800",
  google: "bg-sky-100 text-sky-800",
  mit: "bg-rose-100 text-rose-800",
};

const rtf = new Intl.RelativeTimeFormat("es", { numeric: "auto" });

function hace(fechaISO: string, ahora: number): string {
  const horas = Math.round((Date.parse(fechaISO) - ahora) / 3_600_000);
  if (Math.abs(horas) < 1) return "hace un momento";
  if (Math.abs(horas) < 24) return rtf.format(horas, "hour");
  const dias = Math.round(horas / 24);
  if (Math.abs(dias) < 45) return rtf.format(dias, "day");
  return new Intl.DateTimeFormat("es-CL", { day: "numeric", month: "long", year: "numeric" }).format(
    new Date(fechaISO),
  );
}

async function pedirNoticias(signal?: AbortSignal): Promise<Estado | null> {
  try {
    const res = await fetch("/api/ia-noticias", { signal });
    if (!res.ok) throw new Error(String(res.status));
    const data = (await res.json()) as NoticiasResponse;
    return { tipo: "listo", data, ahora: Date.now() };
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") return null;
    return { tipo: "error" };
  }
}

export default function NoticiasIA() {
  const [estado, setEstado] = useState<Estado>({ tipo: "cargando" });
  const [filtro, setFiltro] = useState("todas");
  const [expandido, setExpandido] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    pedirNoticias(controller.signal).then((e) => e && setEstado(e));
    return () => controller.abort();
  }, []);

  const reintentar = () => {
    setEstado({ tipo: "cargando" });
    pedirNoticias().then((e) => e && setEstado(e));
  };

  if (estado.tipo === "cargando") {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" aria-busy="true">
        <span className="sr-only">Cargando noticias…</span>
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-48 rounded-3xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (estado.tipo === "error") {
    return (
      <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8 text-center space-y-4">
        <AlertTriangle className="w-8 h-8 text-amber-600 mx-auto" aria-hidden="true" />
        <p className="text-brand-primary font-medium">No pudimos cargar las noticias en este momento.</p>
        <button
          type="button"
          onClick={reintentar}
          className="inline-flex items-center gap-2 rounded-md bg-brand-primary text-white px-4 py-2 text-sm font-medium hover:bg-brand-primary/90 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
        >
          <RefreshCw className="w-4 h-4" aria-hidden="true" />
          Reintentar
        </button>
      </div>
    );
  }

  const { data, ahora } = estado;
  const fuentesConNoticias = data.fuentes.filter((f) => data.noticias.some((n) => n.fuenteId === f.id));
  const fuentesCaidas = data.fuentes.filter((f) => !f.ok);
  const lista = data.noticias.filter((n) => filtro === "todas" || n.fuenteId === filtro);
  const visibles = expandido || filtro !== "todas" ? lista : lista.slice(0, VISIBLES_AL_INICIO);

  return (
    <div className="space-y-6">
      <div role="group" aria-label="Filtrar por fuente" className="flex flex-wrap gap-2">
        {[{ id: "todas", nombre: "Todas" }, ...fuentesConNoticias].map((f) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={filtro === f.id}
            onClick={() => setFiltro(f.id)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-accent ${
              filtro === f.id
                ? "bg-brand-primary text-white border-brand-primary"
                : "bg-white text-foreground border-gray-200 hover:border-brand-accent hover:text-brand-accent-dark"
            }`}
          >
            {f.nombre}
          </button>
        ))}
      </div>

      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visibles.map((n) => (
            <motion.li
              key={n.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-shadow p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${COLOR_FUENTE[n.fuenteId] ?? "bg-gray-100 text-gray-700"}`}
                >
                  {n.fuente}
                </span>
                <time dateTime={n.fecha} className="text-xs text-gray-500">
                  {hace(n.fecha, ahora)}
                </time>
              </div>
              <h3 lang="en" className="mt-4 text-lg font-bold font-serif text-brand-primary leading-snug">
                {n.titulo}
              </h3>
              {n.resumen && (
                <p lang="en" className="mt-3 grow text-sm leading-relaxed text-gray-600 line-clamp-4">
                  {n.resumen}
                </p>
              )}
              <a
                href={n.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-1.5 self-start text-sm font-semibold text-brand-accent-dark hover:text-brand-primary transition-colors"
              >
                Leer en {n.fuente}
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </a>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      {!expandido && filtro === "todas" && lista.length > VISIBLES_AL_INICIO && (
        <div className="text-center">
          <button
            type="button"
            onClick={() => setExpandido(true)}
            className="rounded-md border-2 border-brand-accent px-5 py-2 text-sm font-medium text-brand-accent-dark hover:bg-brand-accent hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
          >
            Ver {lista.length - VISIBLES_AL_INICIO} noticias más
          </button>
        </div>
      )}

      <p className="text-xs text-gray-500 leading-relaxed">
        Titulares en inglés, tal como los publica cada fuente oficial. Se actualiza cada hora. Fuentes:{" "}
        {data.fuentes.map((f) => f.nombre).join(", ")}.
        {fuentesCaidas.length > 0 && (
          <> No pudimos leer ahora: {fuentesCaidas.map((f) => f.nombre).join(", ")}.</>
        )}
      </p>
    </div>
  );
}
