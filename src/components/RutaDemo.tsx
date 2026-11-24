'use client';

import { useState } from 'react';

// Demo de Ruta DyS: clientes con el semáforo de la app (días desde la última visita).
// Al marcar una visita el pin pasa a verde, la ruta del día suma ese tramo y los kilómetros.
// Mapa y clientes de ejemplo.

type Cliente = { id: string; nombre: string; x: number; y: number; dias: number };

const SALIDA = { x: 60, y: 60 };
const CLIENTES: Cliente[] = [
  { id: 'a', nombre: 'Ferretería Los Alerces', x: 190, y: 45, dias: 41 },
  { id: 'b', nombre: 'Minimarket Don Lucho', x: 330, y: 95, dias: 22 },
  { id: 'c', nombre: 'Panadería La Espiga', x: 470, y: 55, dias: 8 },
  { id: 'd', nombre: 'Botillería El Lago', x: 250, y: 165, dias: 35 },
  { id: 'e', nombre: 'Almacén Doña Rosa', x: 410, y: 185, dias: 17 },
  { id: 'f', nombre: 'Distribuidora Sur', x: 540, y: 150, dias: 52 },
];
const KM_POR_UNIDAD = 0.018; // el ancho del mapa son unos 11 km

function estado(dias: number) {
  if (dias > 30) return { color: '#E5484D', texto: 'urgente' };
  if (dias >= 15) return { color: '#F08C2E', texto: 'en alerta' };
  return { color: '#30A46C', texto: 'al día' };
}

const dist = (a: { x: number; y: number }, b: { x: number; y: number }) => Math.hypot(a.x - b.x, a.y - b.y);

export default function RutaDemo() {
  const [ruta, setRuta] = useState<string[]>([]);

  function marcar(id: string) {
    setRuta((r) => (r.includes(id) ? r.filter((x) => x !== id) : [...r, id]));
  }

  const puntos = [SALIDA, ...ruta.map((id) => CLIENTES.find((c) => c.id === id)!)];
  const km = puntos.slice(1).reduce((s, p, i) => s + dist(puntos[i], p), 0) * KM_POR_UNIDAD;
  const urgentes = CLIENTES.filter((c) => !ruta.includes(c.id) && c.dias > 30).length;

  return (
    <div>
      <div className="relative aspect-[24/11] overflow-hidden rounded-xl border border-dys-border bg-[#0E1411]">
        <svg viewBox="0 0 600 275" className="absolute inset-0 size-full" aria-hidden="true">
          {/* Calles y la orilla del lago, solo de referencia. */}
          <g stroke="#26302B" strokeWidth="6" fill="none" strokeLinecap="round">
            <path d="M0 80 H600" />
            <path d="M0 140 C150 130 300 150 600 120" />
            <path d="M120 0 V230" />
            <path d="M300 0 C290 90 310 160 300 230" />
            <path d="M450 0 V220" />
          </g>
          <path d="M0 230 C120 210 260 250 380 228 S540 205 600 222 V275 H0 Z" fill="#14324A" />
          {puntos.slice(1).map((p, i) => (
            <line
              key={`${ruta[i]}`}
              x1={puntos[i].x}
              y1={puntos[i].y}
              x2={p.x}
              y2={p.y}
              pathLength={1}
              className="tramo-entra"
              stroke="#4C9AFF"
              strokeWidth="4"
              strokeLinecap="round"
            />
          ))}
          <rect x={SALIDA.x - 9} y={SALIDA.y - 9} width="18" height="18" rx="3" fill="#F6F1E7" />
          <text x={SALIDA.x} y={SALIDA.y + 30} textAnchor="middle" fill="#B5B0A3" fontSize="15" fontWeight="600">
            Salida
          </text>
        </svg>

        {CLIENTES.map((c) => {
          const visitado = ruta.includes(c.id);
          const e = estado(visitado ? 0 : c.dias);
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => marcar(c.id)}
              aria-pressed={visitado}
              aria-label={`${c.nombre}: ${visitado ? 'visitado hoy' : `${c.dias} días sin visita, ${e.texto}`}`}
              style={{ left: `${(c.x / 600) * 100}%`, top: `${(c.y / 275) * 100}%`, backgroundColor: e.color }}
              className="absolute grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-[#0E1411] text-xs font-bold text-black tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F6F1E7] motion-reduce:transition-none sm:size-12"
            >
              {visitado ? 'Hoy' : `${c.dias} d`}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <p className="text-dys-text" aria-live="polite">
          {ruta.length === 0
            ? 'Toca un cliente para registrar la visita.'
            : `${ruta.length} ${ruta.length === 1 ? 'visita' : 'visitas'}, ${km.toLocaleString('es-CL', { maximumFractionDigits: 1 })} km recorridos.`}
          {urgentes > 0 && <span className="text-dys-muted"> Quedan {urgentes} urgentes.</span>}
        </p>
        {ruta.length > 0 && (
          <button
            type="button"
            onClick={() => setRuta([])}
            className="min-h-11 font-semibold text-dys-link underline underline-offset-4 hover:text-dys-text"
          >
            Reiniciar el día
          </button>
        )}
      </div>
      <p className="mt-2 text-sm text-dys-muted">
        Rojo: más de 30 días sin visita. Naranjo: entre 15 y 30. Verde: al día. Mapa y clientes de ejemplo.
      </p>
    </div>
  );
}
