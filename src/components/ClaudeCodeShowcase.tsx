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
  usuario: "text-white",
  herramienta: "text-gray-400",
  claude: "text-brand-accent-light",
  ok: "text-emerald-400",
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
    <div className="rounded-3xl overflow-hidden bg-[#0d1822] shadow-2xl border border-white/10">
      <div className="flex items-center gap-3 bg-[#182838] px-4 py-3">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="size-3 rounded-full bg-red-500/80" />
          <span className="size-3 rounded-full bg-yellow-500/80" />
          <span className="size-3 rounded-full bg-green-500/80" />
        </div>
        <span className="text-xs text-gray-400 font-mono">claude — mi-proyecto</span>
      </div>

      <div role="tablist" aria-label="Ejemplos de uso" className="flex flex-wrap gap-2 px-4 pt-4">
        {ESCENARIOS_TERMINAL.map((e) => (
          <button
            key={e.id}
            type="button"
            role="tab"
            aria-selected={e.id === escenario.id}
            onClick={() => elegir(e.id)}
            className={`rounded-full px-3.5 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-accent ${
              e.id === escenario.id
                ? "bg-brand-accent text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
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
          <span aria-hidden="true" className="mt-3 inline-block h-4 w-2 bg-gray-300 animate-pulse" />
        )}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-white/10 px-5 py-3 text-xs text-gray-500">
        <span>Simulación ilustrativa</span>
        <button
          type="button"
          onClick={() => setVisibles(1)}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-gray-300 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-brand-accent"
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
    <div className="rounded-3xl bg-white border border-gray-100 shadow-sm p-6 sm:p-8">
      <ol className="relative grid grid-cols-5 gap-2">
        {/* Línea que conecta los pasos */}
        <span aria-hidden="true" className="absolute left-[10%] right-[10%] top-6 h-0.5 bg-gray-200" />
        <motion.span
          aria-hidden="true"
          className="absolute left-[10%] top-6 h-0.5 bg-brand-accent origin-left"
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
                className={`relative z-10 grid size-12 place-items-center rounded-full border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 ${
                  alcanzado
                    ? "bg-brand-primary border-brand-accent text-white"
                    : "bg-white border-gray-200 text-gray-400 hover:border-brand-accent"
                } ${i === activo ? "scale-110 shadow-lg" : ""}`}
              >
                <I className="size-5" aria-hidden="true" />
              </button>
              <span
                className={`mt-2 text-xs sm:text-sm font-semibold ${i === activo ? "text-brand-primary" : "text-gray-500"}`}
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
            className="flex gap-4 rounded-2xl bg-brand-accent/10 p-5 sm:p-6"
          >
            <span className="hidden sm:grid size-12 shrink-0 place-items-center rounded-xl bg-brand-primary text-brand-accent-light">
              <Icono className="size-6" aria-hidden="true" />
            </span>
            <div className="space-y-3">
              <h3 className="text-lg font-bold font-serif text-brand-primary">
                {activo + 1}. {paso.titulo} <span className="font-sans text-sm font-medium text-gray-500">· {paso.corto}</span>
              </h3>
              <p className="text-gray-700 leading-relaxed">{paso.detalle}</p>
              <p className="text-sm text-brand-accent-dark italic">{paso.ejemplo}</p>
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
      aria-label={`${titulo}: ${volteada ? "ocultar" : "ver"} detalle`}
      className="group h-44 w-full text-left [perspective:1000px] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent rounded-2xl"
    >
      <motion.div
        className="relative size-full [transform-style:preserve-3d]"
        animate={{ rotateY: volteada ? 180 : 0 }}
        transition={{ duration: reducir ? 0 : 0.5 }}
      >
        <div className="absolute inset-0 flex flex-col justify-between rounded-2xl bg-brand-primary p-5 text-white [backface-visibility:hidden]">
          <span className="font-mono text-lg text-brand-accent-light">{titulo}</span>
          <div>
            <p className="font-semibold">{resumen}</p>
            <p className="mt-1 text-xs text-gray-400 group-hover:text-brand-accent-light">Toca para ver más</p>
          </div>
        </div>
        <div className="absolute inset-0 overflow-auto rounded-2xl border border-brand-accent bg-white p-5 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <p className="font-mono text-xs font-semibold text-brand-accent-dark mb-2">{titulo}</p>
          <p className="text-sm leading-relaxed text-gray-700">{detalle}</p>
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
          <h3 className="text-2xl sm:text-3xl font-bold font-serif text-brand-primary">
            Míralo trabajar, paso a paso
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Describes lo que quieres en lenguaje normal y Claude Code lee tu proyecto, hace los cambios y
            comprueba que funcionen. Elige un ejemplo y observa cómo lo resuelve.
          </p>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Dónde funciona</p>
            <ul className="flex flex-wrap gap-2">
              {CLAUDE_CODE_SUPERFICIES.map((s) => (
                <li
                  key={s}
                  className="rounded-full border border-brand-accent/40 bg-brand-accent/10 px-3 py-1 text-sm text-brand-accent-dark"
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
          <h3 className="text-2xl sm:text-3xl font-bold font-serif text-brand-primary">Cómo trabaja</h3>
          <p className="text-gray-600 leading-relaxed">Toca cada paso para ver qué pasa por dentro.</p>
        </div>
        <FlujoInteractivo />
      </div>

      <div className="space-y-6">
        <div className="max-w-2xl space-y-3">
          <h3 className="text-2xl sm:text-3xl font-bold font-serif text-brand-primary">
            Lo que lo hace potente
          </h3>
          <p className="text-gray-600 leading-relaxed">Voltea las tarjetas para conocer cada pieza.</p>
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
