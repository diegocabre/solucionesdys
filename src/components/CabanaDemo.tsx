'use client';

import { useState, useSyncExternalStore } from 'react';

// Demo de reservas directas: el huésped elige fechas y personas y ve el total y el abono.
// Precios de ejemplo; las reglas sí son las del producto: precio por noche según el grupo,
// abono del 50 % con Mercado Pago y el saldo en la cabaña.

const TARIFAS = [
  { hasta: 4, noche: 55000 },
  { hasta: 8, noche: 75000 },
];
const ABONO = 0.5;
const MAX_PERSONAS = 8;
// Días ya vendidos en el mes de ejemplo (en Airbnb, Booking o directo).
const OCUPADOS = new Set([5, 6, 12, 13, 14, 24, 25, 26]);
const DIAS_SEMANA = ['lu', 'ma', 'mi', 'ju', 'vi', 'sá', 'do'];

// Mes siguiente al de hoy, como número (estable entre renders). En el servidor no hay mes.
const sinSuscripcion = () => () => {};
function primerDiaMesSiguiente() {
  const hoy = new Date();
  return new Date(hoy.getFullYear(), hoy.getMonth() + 1, 1).getTime();
}

const clp = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });

export default function CabanaDemo() {
  // El mes se calcula en el navegador para no desalinear servidor y cliente en el cambio de mes.
  const [llegada, setLlegada] = useState<number | null>(null);
  const [salida, setSalida] = useState<number | null>(null);
  const [personas, setPersonas] = useState(4);

  const inicioMes = useSyncExternalStore(sinSuscripcion, primerDiaMesSiguiente, () => null);

  if (inicioMes === null) return <div className="aspect-[4/5] sm:aspect-[5/4]" aria-hidden="true" />;

  const mes = new Date(inicioMes);
  const nombreMes = mes.toLocaleDateString('es-CL', { month: 'long' });
  const diasMes = new Date(mes.getFullYear(), mes.getMonth() + 1, 0).getDate();
  const desfase = (mes.getDay() + 6) % 7; // lunes primero

  function elegir(dia: number) {
    if (llegada === null || salida !== null || dia <= llegada) {
      setLlegada(dia);
      setSalida(null);
      return;
    }
    // No se puede pasar por encima de una noche ocupada.
    for (let d = llegada; d < dia; d++) {
      if (OCUPADOS.has(d)) {
        setLlegada(dia);
        return;
      }
    }
    setSalida(dia);
  }

  const noches = llegada !== null && salida !== null ? salida - llegada : 0;
  const noche = TARIFAS.find((t) => personas <= t.hasta)!.noche;
  const total = noches * noche;

  return (
    <div className="rounded-xl border border-dys-border p-4 sm:p-5">
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-display text-lg font-semibold text-dys-text first-letter:uppercase">{nombreMes}</p>
        <p className="text-sm text-dys-muted">
          {llegada === null ? 'Elige tu llegada' : salida === null ? 'Ahora tu salida' : `${noches} ${noches === 1 ? 'noche' : 'noches'}`}
        </p>
      </div>

      <div className="mt-3 grid grid-cols-7 gap-1 text-center" role="group" aria-label={`Calendario de ${nombreMes}`}>
        {DIAS_SEMANA.map((d) => (
          <span key={d} className="pb-1 text-xs text-dys-muted" aria-hidden="true">
            {d}
          </span>
        ))}
        {Array.from({ length: desfase }, (_, i) => (
          <span key={`v${i}`} />
        ))}
        {Array.from({ length: diasMes }, (_, i) => {
          const dia = i + 1;
          const ocupado = OCUPADOS.has(dia);
          const extremo = dia === llegada || dia === salida;
          const dentro = llegada !== null && salida !== null && dia > llegada && dia < salida;
          return (
            <button
              key={dia}
              type="button"
              disabled={ocupado}
              onClick={() => elegir(dia)}
              aria-pressed={extremo || dentro}
              aria-label={`${dia} de ${nombreMes}${ocupado ? ', ocupado' : ''}`}
              className={`h-9 rounded-md text-sm tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dys-primary motion-reduce:transition-none ${
                ocupado
                  ? 'text-dys-muted/60 line-through'
                  : extremo
                    ? 'bg-dys-primary font-semibold text-dys-on-primary'
                    : dentro
                      ? 'bg-dys-primary/20 text-dys-text'
                      : 'text-dys-text hover:bg-dys-text/10'
              }`}
            >
              {dia}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-dys-border pt-4">
        <p className="text-dys-text" id="personas-demo">
          {personas} {personas === 1 ? 'persona' : 'personas'}
        </p>
        <div className="flex gap-2" role="group" aria-labelledby="personas-demo">
          <button
            type="button"
            onClick={() => setPersonas((p) => Math.max(1, p - 1))}
            disabled={personas === 1}
            aria-label="Una persona menos"
            className="size-11 rounded-lg border border-dys-border text-lg text-dys-text hover:bg-dys-text/10 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dys-primary"
          >
            −
          </button>
          <button
            type="button"
            onClick={() => setPersonas((p) => Math.min(MAX_PERSONAS, p + 1))}
            disabled={personas === MAX_PERSONAS}
            aria-label="Una persona más"
            className="size-11 rounded-lg border border-dys-border text-lg text-dys-text hover:bg-dys-text/10 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dys-primary"
          >
            +
          </button>
        </div>
      </div>

      <div className="mt-4 min-h-[4.5rem]" aria-live="polite">
        {noches > 0 ? (
          <>
            <p className="text-dys-text">
              {noches} × {clp.format(noche)} = <strong className="font-semibold">{clp.format(total)}</strong>
            </p>
            <p className="mt-1 text-dys-muted">
              Para reservar pagas {clp.format(total * ABONO)} de abono con Mercado Pago. El resto, en la cabaña.
            </p>
          </>
        ) : (
          <p className="text-dys-muted">Los días tachados ya están vendidos. Precios de ejemplo.</p>
        )}
      </div>
    </div>
  );
}
