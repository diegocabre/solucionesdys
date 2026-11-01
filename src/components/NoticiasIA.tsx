"use client";

import { RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import type { NoticiasResponse } from "@/lib/ia-noticias";

const VISIBLES_AL_INICIO = 9;

type Estado =
  | { tipo: "cargando" }
  | { tipo: "error" }
  | { tipo: "listo"; data: NoticiasResponse; ahora: number };

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
      <div className="grid gap-x-10 md:grid-cols-2" aria-busy="true">
        <span className="sr-only">Cargando noticias…</span>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="border-t border-dys-border py-6">
            <div className="h-28 rounded-md bg-dys-border/60 animate-pulse motion-reduce:animate-none" />
          </div>
        ))}
      </div>
    );
  }

  if (estado.tipo === "error") {
    return (
      <div role="alert" className="border-l-4 border-dys-accent py-2 pl-6 space-y-4">
        <p className="text-dys-text font-medium">No pudimos cargar las noticias. Revisa tu conexión y vuelve a intentarlo.</p>
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

      {/* Lista en dos columnas con divisores: sin tarjetas ni animación al filtrar */}
      <ul className="grid gap-x-10 md:grid-cols-2">
        {visibles.map((n) => (
          <li key={n.id} className="flex min-w-0 flex-col border-t border-dys-border pt-6 pb-8 [overflow-wrap:anywhere]">
            <p className="text-sm text-dys-muted">
              {n.fuente}, <time dateTime={n.fecha}>{hace(n.fecha, ahora)}</time>
            </p>
            <h3 lang="en" className="mt-2 font-display text-xl font-semibold text-dys-text leading-snug">
              {n.titulo}
            </h3>
            {n.resumen && (
              <p lang="en" className="mt-3 grow leading-relaxed text-dys-muted line-clamp-4">
                {n.resumen}
              </p>
            )}
            <a
              href={n.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 self-start font-semibold text-dys-link underline underline-offset-4 hover:text-dys-text"
            >
              Leer en {n.fuente}
              <span className="sr-only"> (abre en una pestaña nueva)</span>
            </a>
          </li>
        ))}
      </ul>

      {!expandido && filtro === "todas" && lista.length > VISIBLES_AL_INICIO && (
        <div>
          <button
            type="button"
            onClick={() => setExpandido(true)}
            className="rounded-lg border-2 border-dys-primary px-5 py-2.5 font-semibold text-dys-text hover:bg-dys-primary hover:text-dys-on-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dys-primary focus-visible:ring-offset-2"
          >
            Ver {lista.length - VISIBLES_AL_INICIO} noticias más
          </button>
        </div>
      )}

      <p className="text-sm text-dys-muted leading-relaxed">
        Titulares en inglés, tal como los publica cada fuente oficial. Se actualiza cada hora. Fuentes:{" "}
        {data.fuentes.map((f) => f.nombre).join(", ")}.
        {fuentesCaidas.length > 0 && (
          <> No pudimos leer ahora: {fuentesCaidas.map((f) => f.nombre).join(", ")}.</>
        )}
      </p>
    </div>
  );
}
