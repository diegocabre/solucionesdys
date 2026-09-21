"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ROBOT_INTRO, ROBOT_NOMBRE, ROBOT_TEMAS, type RobotTema } from "@/lib/ia-content";

const MS_POR_LETRA = 18;

function Robot({ hablando }: { hablando: boolean }) {
  const reducir = useReducedMotion();
  const animar = !reducir;

  return (
    <motion.svg
      viewBox="0 0 200 220"
      role="img"
      aria-label={`${ROBOT_NOMBRE}, el robot de Soluciones DyS`}
      className="w-40 sm:w-48 h-auto drop-shadow-xl"
      animate={animar ? { y: [0, -6, 0] } : undefined}
      transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Antena */}
      <line x1="100" y1="22" x2="100" y2="44" stroke="#9e7f69" strokeWidth="4" strokeLinecap="round" />
      <motion.circle
        cx="100"
        cy="16"
        r="8"
        fill="#bfa38a"
        animate={animar ? { opacity: hablando ? [1, 0.3, 1] : [1, 0.6, 1] } : undefined}
        transition={{ duration: hablando ? 0.5 : 2, repeat: Infinity }}
      />

      {/* Orejas */}
      <rect x="22" y="78" width="16" height="36" rx="8" fill="#9e7f69" />
      <rect x="162" y="78" width="16" height="36" rx="8" fill="#9e7f69" />

      {/* Cabeza */}
      <rect x="34" y="44" width="132" height="96" rx="28" fill="#182838" />
      <rect x="34" y="44" width="132" height="96" rx="28" fill="none" stroke="#bfa38a" strokeWidth="3" />

      {/* Pantalla de la cara */}
      <rect x="48" y="58" width="104" height="68" rx="18" fill="#0d1822" />

      {/* Ojos (parpadean) */}
      <motion.g
        style={{ transformOrigin: "100px 86px", transformBox: "view-box" }}
        animate={animar ? { scaleY: [1, 1, 0.08, 1, 1] } : undefined}
        transition={{ duration: 4, repeat: Infinity, times: [0, 0.9, 0.94, 0.98, 1] }}
      >
        <ellipse cx="78" cy="86" rx="9" ry="11" fill="#d1baaa" />
        <ellipse cx="122" cy="86" rx="9" ry="11" fill="#d1baaa" />
        <circle cx="80" cy="83" r="3" fill="#fff" opacity="0.8" />
        <circle cx="124" cy="83" r="3" fill="#fff" opacity="0.8" />
      </motion.g>

      {/* Boca: se abre y cierra mientras habla */}
      <motion.rect
        x="84"
        y="106"
        width="32"
        height="10"
        rx="5"
        fill="#5d8254"
        style={{ transformOrigin: "100px 111px", transformBox: "view-box" }}
        animate={
          hablando && animar
            ? { scaleY: [0.4, 1.3, 0.6, 1.1, 0.4], scaleX: [1, 0.85, 1, 0.9, 1] }
            : { scaleY: 0.35 }
        }
        transition={hablando ? { duration: 0.55, repeat: Infinity } : { duration: 0.2 }}
      />

      {/* Cuello, cuerpo y brazos */}
      <rect x="88" y="140" width="24" height="10" fill="#9e7f69" />
      <rect x="56" y="150" width="88" height="58" rx="22" fill="#182838" stroke="#bfa38a" strokeWidth="3" />
      <circle cx="100" cy="178" r="10" fill="#43663b" />
      <circle cx="100" cy="178" r="4" fill="#d1baaa" />
      <rect x="36" y="158" width="16" height="40" rx="8" fill="#182838" stroke="#bfa38a" strokeWidth="2" />
      <motion.g
        style={{ transformOrigin: "156px 164px", transformBox: "view-box" }}
        animate={hablando && animar ? { rotate: [0, -14, 0, -10, 0] } : { rotate: 0 }}
        transition={hablando ? { duration: 1.1, repeat: Infinity } : { duration: 0.3 }}
      >
        <rect x="148" y="158" width="16" height="40" rx="8" fill="#182838" stroke="#bfa38a" strokeWidth="2" />
      </motion.g>
    </motion.svg>
  );
}

export default function RobotGuide() {
  const reducir = useReducedMotion();
  const [tema, setTema] = useState<RobotTema>(ROBOT_INTRO);
  const [letras, setLetras] = useState(0);
  const [voz, setVoz] = useState(false);
  const [vozDisponible, setVozDisponible] = useState(false);
  const vozRef = useRef(false);

  // La voz depende de APIs del navegador: se detecta después del montaje para no romper el SSR.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVozDisponible(typeof window !== "undefined" && "speechSynthesis" in window);
    return () => {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);

  // Máquina de escribir: avanza una letra cada pocos milisegundos hasta completar el texto.
  useEffect(() => {
    if (reducir) return;
    const id = window.setInterval(() => {
      setLetras((n) => {
        if (n >= tema.texto.length) {
          window.clearInterval(id);
          return n;
        }
        return n + 1;
      });
    }, MS_POR_LETRA);
    return () => window.clearInterval(id);
  }, [tema, reducir]);

  const hablar = (texto: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const voces = window.speechSynthesis.getVoices();
    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = "es-CL";
    utterance.voice =
      voces.find((v) => v.lang === "es-CL") ?? voces.find((v) => v.lang.toLowerCase().startsWith("es")) ?? null;
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  };

  const elegir = (nuevo: RobotTema) => {
    setTema(nuevo);
    setLetras(0);
    if (vozRef.current) hablar(nuevo.texto);
  };

  const alternarVoz = () => {
    const activar = !voz;
    setVoz(activar);
    vozRef.current = activar;
    if (activar) hablar(tema.texto);
    else window.speechSynthesis.cancel();
  };

  const visible = reducir ? tema.texto : tema.texto.slice(0, letras);
  const hablando = !reducir && letras < tema.texto.length;

  return (
    <div className="relative rounded-3xl bg-white border border-gray-100 shadow-xl p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="shrink-0">
          <Robot hablando={hablando} />
          <p className="mt-1 text-center text-sm font-semibold font-serif text-brand-primary">{ROBOT_NOMBRE}</p>
        </div>

        {/* Globo de diálogo */}
        <div className="relative grow w-full">
          <div className="relative rounded-2xl bg-brand-primary text-white p-5 sm:p-6 min-h-44 sm:min-h-52">
            <span
              aria-hidden="true"
              className="absolute -top-2 left-1/2 -translate-x-1/2 sm:top-8 sm:-left-2 sm:translate-x-0 size-4 rotate-45 bg-brand-primary"
            />
            {/* El texto animado no se anuncia letra por letra: el lector de pantalla recibe la frase completa. */}
            <p className="sr-only" aria-live="polite">
              {tema.texto}
            </p>
            <p aria-hidden="true" className="relative text-base sm:text-lg leading-relaxed">
              {visible}
              {hablando && (
                <span className="inline-block w-2 h-5 ml-0.5 align-middle bg-brand-accent-light animate-pulse" />
              )}
            </p>
          </div>

          {vozDisponible && (
            <button
              type="button"
              onClick={alternarVoz}
              aria-pressed={voz}
              className="mt-3 inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-brand-primary hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-accent"
            >
              {voz ? <Volume2 className="w-4 h-4" aria-hidden="true" /> : <VolumeX className="w-4 h-4" aria-hidden="true" />}
              {voz ? "Voz activada" : "Activar voz"}
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Temas de conversación">
        {ROBOT_TEMAS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => elegir(t)}
            aria-pressed={tema.id === t.id}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-accent ${
              tema.id === t.id
                ? "bg-brand-accent text-white border-brand-accent"
                : "bg-white text-foreground border-gray-200 hover:border-brand-accent hover:text-brand-accent-dark"
            }`}
          >
            {t.chip}
          </button>
        ))}
      </div>
    </div>
  );
}
