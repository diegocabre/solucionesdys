'use client';

import { useState } from 'react';
import Button from '@/components/Button';
import { EXTRAS, TIPOS, cotizar, type Extra, type TipoSitio } from '@/lib/cotizador';
import { whatsappLink } from '@/lib/dys-links';

const clp = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });

// Fila de opción: lista con divisores (regla de DESIGN.md), con el control nativo visible.
const fila =
  'flex cursor-pointer items-start gap-3 border-b border-dys-border py-4 has-[:checked]:text-dys-text has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-dys-primary';
const control = 'mt-1 size-5 shrink-0 accent-[var(--dys-primary)]';

export default function Cotizador() {
  const [tipo, setTipo] = useState<TipoSitio>('corporativo');
  const [extras, setExtras] = useState<Extra[]>([]);
  const [urgente, setUrgente] = useState(false);

  const { min, max } = cotizar(tipo, extras, urgente);
  const tipoSel = TIPOS.find((t) => t.id === tipo)!;
  const rango = `${clp.format(min)} a ${clp.format(max)} + IVA`;

  const mensaje = [
    'Hola, usé el cotizador de la web:',
    `- ${tipoSel.label}`,
    ...EXTRAS.filter((e) => extras.includes(e.id)).map((e) => `- ${e.label}`),
    urgente ? '- Lo necesito urgente' : null,
    `Rango: ${rango}. ¿Conversamos?`,
  ]
    .filter(Boolean)
    .join('\n');

  function alternar(id: Extra) {
    setExtras((xs) => (xs.includes(id) ? xs.filter((x) => x !== id) : [...xs, id]));
  }

  return (
    <section id="cotizador" aria-labelledby="cotizador-titulo" className="dys-light scroll-mt-20 bg-dys-bg py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[5fr_7fr] lg:grid-rows-[auto_1fr] gap-x-12 gap-y-10">
        <div className="lg:col-start-1 lg:row-start-1">
          <h2 id="cotizador-titulo" className="text-titular-2 font-bold text-dys-text">
            ¿Cuánto cuesta tu sitio?
          </h2>
          <p className="mt-5 max-w-md text-lg text-dys-muted leading-relaxed">
            Elige lo que necesitas y ve el rango al tiro. Los valores son sin IVA; el final te lo confirmamos en una
            propuesta antes de empezar.
          </p>
        </div>

        {/* En móvil el precio va después de las opciones, para ver cómo cambia; en escritorio queda fijo al lado. */}
        <div className="order-last lg:order-none lg:col-start-1 lg:row-start-2 lg:sticky lg:top-28 lg:self-start">
          <div className="border-t border-dys-border pt-6" aria-live="polite">
            <p className="text-dys-muted">Tu sitio, a medida</p>
            <p className="mt-1 font-display text-titular-3 font-bold text-dys-text tabular-nums">{rango}</p>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap" data-clarity-tag={`cotizador_tipo=${tipo}`}>
            <Button size="lg" href={whatsappLink(mensaje)} external rel="noopener noreferrer">
              Enviar por WhatsApp
            </Button>
            <Button size="lg" variant="outline" href="/contacto#formulario">
              Escribir por el formulario
            </Button>
          </div>
        </div>

        <div data-evento="cotizador_uso" className="space-y-10 lg:col-start-2 lg:row-start-1 lg:row-span-2">
          <fieldset>
            <legend className="text-xl font-semibold text-dys-text">Qué necesitas</legend>
            <div className="mt-3 border-t border-dys-border text-dys-muted">
              {TIPOS.map((t) => (
                <label key={t.id} className={fila}>
                  <input
                    type="radio"
                    name="tipo"
                    checked={tipo === t.id}
                    onChange={() => setTipo(t.id)}
                    className={control}
                  />
                  <span>
                    <span className="block font-semibold text-dys-text">{t.label}</span>
                    <span className="block">{t.detalle}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-xl font-semibold text-dys-text">Qué más le sumas</legend>
            <div className="mt-3 border-t border-dys-border text-dys-muted">
              {EXTRAS.map((e) => (
                <label key={e.id} className={fila}>
                  <input
                    type="checkbox"
                    checked={extras.includes(e.id)}
                    onChange={() => alternar(e.id)}
                    className={control}
                  />
                  <span className="font-semibold text-dys-text">{e.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-xl font-semibold text-dys-text">Para cuándo</legend>
            <div className="mt-3 border-t border-dys-border text-dys-muted">
              {[
                { v: false, label: 'En el plazo normal', detalle: 'El plazo depende del tamaño; te lo confirmamos en la propuesta.' },
                { v: true, label: 'Lo necesito urgente', detalle: 'Le damos prioridad; suma un 30 %.' },
              ].map((o) => (
                <label key={o.label} className={fila}>
                  <input
                    type="radio"
                    name="plazo"
                    checked={urgente === o.v}
                    onChange={() => setUrgente(o.v)}
                    className={control}
                  />
                  <span>
                    <span className="block font-semibold text-dys-text">{o.label}</span>
                    <span className="block">{o.detalle}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      </div>
    </section>
  );
}
