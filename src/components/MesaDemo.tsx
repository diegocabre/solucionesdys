'use client';

import { useEffect, useState } from 'react';

// Demo jugable de la portada: la mesa (con la marca de un restaurante de ejemplo) y el celular
// del mesonero. Todo es local; no llama a ningún servidor.

type Tipo = 'mesonero' | 'cuenta' | 'agua';
type Llamada = { id: number; tipo: Tipo; mesa: number; desde: number; atendida: boolean };

const ACCIONES: { tipo: Tipo; label: string; aviso: string }[] = [
  { tipo: 'mesonero', label: 'Llamar al mesonero', aviso: 'Llama al mesonero' },
  { tipo: 'cuenta', label: 'Pedir la cuenta', aviso: 'Pide la cuenta' },
  { tipo: 'agua', label: 'Pedir agua', aviso: 'Pide agua' },
];

// Una llamada ya en espera, para que el celular del mesonero no parta vacío.
const INICIAL: Llamada[] = [{ id: 0, tipo: 'agua', mesa: 7, desde: 0, atendida: false }];

const ESCALA_SEG = 180; // a los 3 minutos sin atender, se avisa al dueño
const DEMORA_SEG = 120; // desde aquí el tiempo se marca en rojo

function tiempo(seg: number) {
  if (seg < 60) return `hace ${seg} s`;
  return `hace ${Math.floor(seg / 60)} min`;
}

export default function MesaDemo() {
  const [llamadas, setLlamadas] = useState<Llamada[]>(INICIAL);
  const [ahora, setAhora] = useState(0);
  const [ultima, setUltima] = useState<Tipo | null>(null);

  // Reloj de la demo en segundos. La llamada inicial lleva 2 min esperando, para mostrar el contador.
  useEffect(() => {
    const inicio = Date.now() - 125_000;
    const tick = () => setAhora(Math.floor((Date.now() - inicio) / 1000));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  function pedir(tipo: Tipo) {
    setUltima(tipo);
    setLlamadas((ls) => [
      { id: Date.now(), tipo, mesa: 4, desde: ahora, atendida: false },
      // shortcut: la demo guarda solo las 4 más recientes, de sobra para mostrar la idea.
      ...ls.slice(0, 3),
    ]);
  }

  function atender(id: number) {
    setLlamadas((ls) => ls.map((l) => (l.id === id ? { ...l, atendida: true } : l)));
  }

  const pendientes = llamadas.filter((l) => !l.atendida).length;

  return (
    <figure className="m-0" data-evento="demo_mesonero">
      <div className="grid grid-cols-2 gap-3 sm:gap-6">
        {/* Celular de la mesa: vestido con la marca del restaurante, no con la de DyS. */}
        <div className="flex min-h-[22rem] flex-col rounded-[1.75rem] border border-dys-border p-1.5 sm:min-h-[27rem]">
          <div className="flex flex-1 flex-col rounded-[1.4rem] bg-[#5B1A24] px-3 pt-5 pb-4 text-[#F8EBDD] sm:px-5">
            <p className="font-display text-lg leading-tight font-bold sm:text-2xl">Cocina del Valle</p>
            <p className="mt-1 text-xs opacity-80 sm:text-sm">Mesa 4 · Terraza</p>
            <div className="mt-5 flex flex-1 flex-col gap-2">
              {ACCIONES.map((a) => (
                <button
                  key={a.tipo}
                  type="button"
                  onClick={() => pedir(a.tipo)}
                  className="min-h-11 rounded-lg bg-[#F8EBDD] px-2 text-left text-sm font-semibold text-[#5B1A24] transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F8EBDD] focus-visible:ring-offset-2 focus-visible:ring-offset-[#5B1A24] active:bg-[#EAD5C0] motion-reduce:transition-none sm:px-4 sm:text-base"
                >
                  {a.label}
                </button>
              ))}
              <p className="mt-auto pt-3 text-xs opacity-80 sm:text-sm" aria-live="polite">
                {ultima ? 'Listo, ya le avisamos.' : 'También puede ver la carta u opinar.'}
              </p>
            </div>
          </div>
        </div>

        {/* Celular del mesonero: le llegan las llamadas de su zona. */}
        <div className="flex min-h-[22rem] flex-col rounded-[1.75rem] border border-dys-border p-1.5 sm:min-h-[27rem]">
          <div className="dys-light flex flex-1 flex-col rounded-[1.4rem] bg-dys-bg px-3 pt-5 pb-4 sm:px-5">
            <div className="flex items-baseline justify-between gap-2">
              <p className="font-display text-lg leading-tight font-bold text-dys-text sm:text-2xl">Terraza</p>
              <p className="text-xs font-semibold text-dys-muted sm:text-sm">
                {pendientes === 0 ? 'Al día' : `${pendientes} ${pendientes === 1 ? 'mesa espera' : 'mesas esperan'}`}
              </p>
            </div>
            <ul className="mt-4 flex-1 border-t border-dys-border" aria-live="polite" aria-label="Llamadas recibidas">
              {llamadas.map((l) => {
                const seg = Math.max(0, ahora - l.desde);
                const tarde = !l.atendida && seg >= DEMORA_SEG;
                const accion = ACCIONES.find((a) => a.tipo === l.tipo)!;
                return (
                  <li
                    key={l.id}
                    className={`llamada-entra border-b border-dys-border py-2.5 ${l.atendida ? 'opacity-50' : ''}`}
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="text-sm font-semibold text-dys-text sm:text-base">Mesa {l.mesa}</p>
                      <p
                        className={`text-xs tabular-nums sm:text-sm ${tarde ? 'font-semibold text-[#A8321E]' : 'text-dys-muted'}`}
                      >
                        {l.atendida ? 'Atendida' : tiempo(seg)}
                      </p>
                    </div>
                    <p className="text-sm text-dys-muted">{accion.aviso}</p>
                    {!l.atendida && seg >= ESCALA_SEG && (
                      <p className="text-sm font-semibold text-[#A8321E]">Le avisamos al dueño</p>
                    )}
                    {!l.atendida && (
                      <button
                        type="button"
                        onClick={() => atender(l.id)}
                        className="mt-1.5 min-h-9 rounded-md border border-dys-primary px-2.5 text-sm font-semibold text-dys-primary transition-colors hover:bg-dys-primary hover:text-dys-on-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dys-primary focus-visible:ring-offset-2 motion-reduce:transition-none"
                      >
                        Atender
                        <span className="sr-only">: mesa {l.mesa}</span>
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
      <figcaption className="mt-4 text-sm text-dys-muted sm:text-base">
        Toca un botón en la mesa y mira cómo le llega al mesonero. Si pasan 3 minutos sin atender, te avisa a ti.
      </figcaption>
    </figure>
  );
}
