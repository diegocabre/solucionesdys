"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  CircleCheck,
  ListChecks,
  MessageSquare,
  RotateCcw,
  Search,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  CAPACIDADES_CLAUDE,
  CLAUDE_CODE_SUPERFICIES,
  ESCENARIOS_TERMINAL,
  PASOS_FLUJO,
  type LineaTerminal,
} from "@/lib/ia-content";

const MS_ENTRE_LINEAS = 900;

// ── 1. Terminal simulada ─────────────────────────────────────────────────────

const ESTILO_LINEA: Record<LineaTerminal["tipo"], string> = {
  usuario: "text-dys-text",
  herramienta: "text-dys-muted",
  claude: "text-dys-primary",
  ok: "text-dys-primary",
};

const PREFIJO_LINEA: Record<LineaTerminal["tipo"], string> = {
  usuario: ">",
  herramienta: "●",
  claude: "◆",
  ok: "✓",
};

function TerminalDemo() {
  const reducir = useReducedMotion();
  const [escenarioId, setEscenarioId] = useState(ESCENARIOS_TERMINAL[0].id);
  const [visibles, setVisibles] = useState(1);
  const escenario = ESCENARIOS_TERMINAL.find((e) => e.id === escenarioId) ?? ESCENARIOS_TERMINAL[0];
  const total = escenario.lineas.length;

  useEffect(() => {
    if (reducir || visibles >= total) return;
    const id = window.setTimeout(() => setVisibles((n) => n + 1), MS_ENTRE_LINEAS);
    return () => window.clearTimeout(id);
  }, [visibles, total, reducir, escenarioId]);

  const elegir = (id: string) => {
    setEscenarioId(id);
    setVisibles(1);
  };

  const mostrar = reducir ? total : visibles;
  const terminado = mostrar >= total;

  return (
    <div className="rounded-xl overflow-hidden bg-dys-surface border border-dys-border">
      <div className="border-b border-dys-border px-4 py-3">
        <span className="text-sm text-dys-muted font-mono">claude, en mi-proyecto</span>
      </div>

      <div role="tablist" aria-label="Ejemplos de uso" className="flex flex-wrap gap-2 px-4 pt-4">
        {ESCENARIOS_TERMINAL.map((e) => (
          <button
            key={e.id}
            type="button"
            role="tab"
            aria-selected={e.id === escenario.id}
            onClick={() => elegir(e.id)}
            className={`rounded-full px-3.5 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-dys-primary ${
              e.id === escenario.id
                ? "bg-dys-primary text-dys-on-primary"
                : "bg-dys-text/10 text-dys-muted hover:bg-dys-text/20"
            }`}
          >
            {e.pestana}
          </button>
        ))}
      </div>

      <div className="px-5 py-5 font-mono text-sm leading-relaxed min-h-72" aria-live="polite">
        <AnimatePresence initial={false}>
          {escenario.lineas.slice(0, mostrar).map((l, i) => (
            <motion.p
              key={`${escenario.id}-${i}`}
              initial={reducir ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex gap-3 ${i > 0 ? "mt-3" : ""} ${ESTILO_LINEA[l.tipo]}`}
            >
              <span aria-hidden="true" className="shrink-0 select-none">
                {PREFIJO_LINEA[l.tipo]}
              </span>
              <span>{l.texto}</span>
            </motion.p>
          ))}
        </AnimatePresence>
        {!terminado && (
          <span aria-hidden="true" className="mt-3 inline-block h-4 w-2 bg-dys-border animate-pulse" />
        )}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-dys-text/10 px-5 py-3 text-xs text-dys-muted">
        <span>Simulación ilustrativa</span>
        <button
          type="button"
          onClick={() => setVisibles(1)}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-dys-muted hover:bg-dys-text/10 focus:outline-none focus:ring-2 focus:ring-dys-primary"
        >
          <RotateCcw className="size-3.5" aria-hidden="true" />
          Repetir
        </button>
      </div>
    </div>
  );
}

// ── 2. Diagrama de flujo clicable ────────────────────────────────────────────

const ICONOS_FLUJO: LucideIcon[] = [MessageSquare, Search, ListChecks, Wrench, CircleCheck];

function FlujoInteractivo() {
  const [activo, setActivo] = useState(0);
  const paso = PASOS_FLUJO[activo];
  const Icono = ICONOS_FLUJO[activo];

  return (
    <div className="rounded-xl bg-dys-surface border border-dys-border p-6 sm:p-8">
      <ol className="relative grid grid-cols-5 gap-2">
        {/* Línea que conecta los pasos */}
        <span aria-hidden="true" className="absolute left-[10%] right-[10%] top-6 h-0.5 bg-dys-border" />
        <motion.span
          aria-hidden="true"
          className="absolute left-[10%] top-6 h-0.5 bg-dys-primary origin-left"
          style={{ width: "80%" }}
          animate={{ scaleX: activo / (PASOS_FLUJO.length - 1) }}
          transition={{ type: "spring", bounce: 0, duration: 0.5 }}
        />
        {PASOS_FLUJO.map((p, i) => {
          const I = ICONOS_FLUJO[i];
          const alcanzado = i <= activo;
          return (
            <li key={p.titulo} className="relative flex flex-col items-center text-center">
              <button
                type="button"
                onClick={() => setActivo(i)}
                aria-current={i === activo ? "step" : undefined}
                aria-label={`Paso ${i + 1}: ${p.titulo}`}
                className={`relative z-10 grid size-12 place-items-center rounded-full border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-dys-primary focus:ring-offset-2 ${
                  alcanzado
                    ? "bg-dys-primary border-dys-primary text-dys-on-primary"
                    : "bg-dys-surface border-dys-border text-dys-muted hover:border-dys-primary"
                } ${i === activo ? "scale-110 shadow-lg" : ""}`}
              >
                <I className="size-5" aria-hidden="true" />
              </button>
              <span
                className={`mt-2 text-xs sm:text-sm font-semibold ${i === activo ? "text-dys-text" : "text-dys-muted"}`}
              >
                {p.titulo}
              </span>
            </li>
          );
        })}
      </ol>

      <div className="mt-8 min-h-40" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.div
            key={activo}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="flex gap-4 border-l-4 border-dys-primary pl-5 sm:pl-6 py-1"
          >
            <span className="hidden sm:grid size-12 shrink-0 place-items-center rounded-xl border border-dys-border text-dys-text">
              <Icono className="size-6" aria-hidden="true" />
            </span>
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-dys-text">
                {activo + 1}. {paso.titulo}: <span className="font-sans text-base font-medium text-dys-muted">{paso.corto}</span>
              </h3>
              <p className="text-dys-text leading-relaxed">{paso.detalle}</p>
              <p className="text-dys-muted italic">{paso.ejemplo}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── 3. Tarjetas que se voltean ───────────────────────────────────────────────

function TarjetaGiratoria({ titulo, resumen, detalle }: { titulo: string; resumen: string; detalle: string }) {
  const reducir = useReducedMotion();
  const [volteada, setVolteada] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setVolteada((v) => !v)}
      aria-pressed={volteada}
      className="group h-44 w-full text-left [perspective:1000px] focus:outline-none focus-visible:ring-2 focus-visible:ring-dys-primary rounded-xl"
    >
      <motion.div
        className="relative size-full [transform-style:preserve-3d]"
        animate={{ rotateY: volteada ? 180 : 0 }}
        transition={{ duration: reducir ? 0 : 0.5 }}
      >
        {/* El nombre del botón es el texto de la cara visible; la otra se oculta al lector de pantalla. */}
        <div aria-hidden={volteada} className="absolute inset-0 flex flex-col justify-between rounded-xl bg-dys-surface border border-dys-border p-5 text-dys-text [backface-visibility:hidden]">
          <span className="font-mono text-lg text-dys-text">{titulo}</span>
          <div>
            <p className="font-semibold">{resumen}</p>
            <p className="mt-1 text-sm text-dys-muted underline underline-offset-4">Toca para ver más</p>
          </div>
        </div>
        <div aria-hidden={!volteada} className="absolute inset-0 overflow-auto rounded-xl border border-dys-text/40 bg-dys-surface p-5 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <p className="font-mono text-sm font-semibold text-dys-text mb-2">{titulo}</p>
          <p className="text-sm leading-relaxed text-dys-text">{detalle}</p>
        </div>
      </motion.div>
    </button>
  );
}

export default function ClaudeCodeShowcase() {
  return (
    <div className="space-y-16">
      <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
        <div className="space-y-5">
          <h3 className="text-titular-3 font-semibold text-dys-text">
            Míralo trabajar, paso a paso
          </h3>
          <p className="text-dys-muted leading-relaxed">
            Describes lo que quieres en lenguaje normal y Claude Code lee tu proyecto, hace los cambios y
            comprueba que funcionen. Elige un ejemplo y observa cómo lo resuelve.
          </p>
          <div>
            <p className="text-sm font-semibold text-dys-text mb-2">Dónde funciona</p>
            <ul className="flex flex-wrap gap-2">
              {CLAUDE_CODE_SUPERFICIES.map((s) => (
                <li
                  key={s}
                  className="rounded-full border border-dys-border px-3 py-1 text-sm text-dys-text"
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <TerminalDemo />
      </div>

      <div className="space-y-6">
        <div className="max-w-2xl space-y-3">
          <h3 className="text-titular-3 font-semibold text-dys-text">Cómo trabaja</h3>
          <p className="text-dys-muted leading-relaxed">Toca cada paso para ver qué pasa por dentro.</p>
        </div>
        <FlujoInteractivo />
      </div>

      <div className="space-y-6">
        <div className="max-w-2xl space-y-3">
          <h3 className="text-titular-3 font-semibold text-dys-text">
            Lo que lo hace potente
          </h3>
          <p className="text-dys-muted leading-relaxed">Voltea las tarjetas para conocer cada pieza.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CAPACIDADES_CLAUDE.map((c) => (
            <TarjetaGiratoria key={c.titulo} {...c} />
          ))}
        </div>
      </div>
    </div>
  );
}
