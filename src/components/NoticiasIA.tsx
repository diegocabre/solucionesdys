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
  anthropic: "bg-dys-primary/15 text-dys-primary",
  "claude-code": "bg-dys-surface text-dys-text",
  openai: "bg-dys-surface text-dys-text",
  deepmind: "bg-dys-link/15 text-dys-link",
  google: "bg-dys-link/15 text-dys-link",
  mit: "bg-red-500/10 text-red-300",
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
          <div key={i} className="h-48 rounded-3xl bg-dys-surface animate-pulse" />
        ))}
      </div>
    );
  }

  if (estado.tipo === "error") {
    return (
      <div className="rounded-3xl border border-dys-accent/40 bg-dys-accent/10 p-8 text-center space-y-4">
        <AlertTriangle className="w-8 h-8 text-dys-accent mx-auto" aria-hidden="true" />
        <p className="text-dys-text font-medium">No pudimos cargar las noticias en este momento.</p>
        <button
          type="button"
          onClick={reintentar}
          className="inline-flex items-center gap-2 rounded-md bg-dys-primary text-dys-on-primary px-4 py-2 text-sm font-medium hover:bg-dys-primary/85 focus:outline-none focus:ring-2 focus:ring-dys-primary focus:ring-offset-2"
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
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-dys-primary ${
              filtro === f.id
                ? "bg-dys-primary text-dys-on-primary border-dys-primary"
                : "bg-dys-surface text-dys-text border-dys-border hover:border-dys-primary hover:text-dys-primary"
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
              className="flex flex-col rounded-3xl bg-dys-surface border border-dys-border shadow-sm hover:shadow-lg transition-shadow p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${COLOR_FUENTE[n.fuenteId] ?? "bg-dys-surface text-dys-text"}`}
                >
                  {n.fuente}
                </span>
                <time dateTime={n.fecha} className="text-xs text-dys-muted">
                  {hace(n.fecha, ahora)}
                </time>
              </div>
              <h3 lang="en" className="mt-4 text-lg font-bold text-dys-text leading-snug">
                {n.titulo}
              </h3>
              {n.resumen && (
                <p lang="en" className="mt-3 grow text-sm leading-relaxed text-dys-muted line-clamp-4">
                  {n.resumen}
                </p>
              )}
              <a
                href={n.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-1.5 self-start text-sm font-semibold text-dys-primary hover:text-dys-text transition-colors"
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
            className="rounded-md border-2 border-dys-primary px-5 py-2 text-sm font-medium text-dys-primary hover:bg-dys-primary hover:text-dys-on-primary transition-colors focus:outline-none focus:ring-2 focus:ring-dys-primary focus:ring-offset-2"
          >
            Ver {lista.length - VISIBLES_AL_INICIO} noticias más
          </button>
        </div>
      )}

      <p className="text-xs text-dys-muted leading-relaxed">
        Titulares en inglés, tal como los publica cada fuente oficial. Se actualiza cada hora. Fuentes:{" "}
        {data.fuentes.map((f) => f.nombre).join(", ")}.
        {fuentesCaidas.length > 0 && (
          <> No pudimos leer ahora: {fuentesCaidas.map((f) => f.nombre).join(", ")}.</>
        )}
      </p>
    </div>
  );
}
