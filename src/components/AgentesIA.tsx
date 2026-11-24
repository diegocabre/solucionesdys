'use client';

import { useState } from 'react';
import Button from '@/components/Button';
import { whatsappLink } from '@/lib/dys-links';

// Agentes con IA: lo mismo que hacen los workflows de n8n de DyS (atender, revisar el calendario,
// agendar y avisar al equipo), contado con una demo guionada que funciona aunque n8n esté apagado.
// El negocio y las horas son de ejemplo.

const HORAS = ['09:00', '10:00', '11:00', '12:00', '15:00', '16:00', '17:00', '18:00'];
const OCUPADAS = new Set(['09:00', '11:00', '15:00', '16:00', '18:00']);
const LIBRES = HORAS.filter((h) => !OCUPADAS.has(h));

type Mensaje = { de: 'cliente' | 'agente'; texto: string };

const INICIO: Mensaje[] = [{ de: 'agente', texto: '¡Hola! Soy el asistente de Kine Sur. ¿Te ayudo a tomar una hora?' }];

const PUEDE = [
  { titulo: 'Atiende a cualquier hora', texto: 'Responde en tu web o en Telegram con la información de tu negocio, en español de Chile.' },
  { titulo: 'Revisa tu calendario y agenda', texto: 'Ofrece solo horas libres de tu Google Calendar y deja la cita anotada con los datos del cliente.' },
  { titulo: 'Te avisa lo importante', texto: 'Si una cita queda sin teléfono o correo, te llega un aviso para que no se pierda.' },
];

const espera = (ms: number) => new Promise((r) => setTimeout(r, ms));

// titulo: en /agentes la página ya tiene su H1, así que la sección usa otro.
export default function AgentesIA({ titulo = 'Agentes con IA que atienden y agendan por ti' }: { titulo?: string }) {
  const [mensajes, setMensajes] = useState<Mensaje[]>(INICIO);
  const [paso, setPaso] = useState(0);
  const [pensando, setPensando] = useState<string | null>(null);
  const [hora, setHora] = useState<string | null>(null);
  const [contacto, setContacto] = useState<boolean | null>(null);

  async function responder(texto: string, accion: string, respuesta: string, siguiente: number) {
    setMensajes((m) => [...m, { de: 'cliente', texto }]);
    setPaso(-1);
    setPensando(accion);
    await espera(900);
    setPensando(null);
    setMensajes((m) => [...m, { de: 'agente', texto: respuesta }]);
    setPaso(siguiente);
  }

  function reiniciar() {
    setMensajes(INICIO);
    setPaso(0);
    setHora(null);
    setContacto(null);
  }

  // Respuestas sugeridas según el paso de la conversación.
  const opciones: { label: string; elegir: () => void }[] =
    paso === 0
      ? [
          {
            label: 'Quiero una hora para el jueves',
            elegir: () =>
              responder(
                'Quiero una hora para el jueves',
                'Revisando el calendario…',
                `El jueves tengo libre a las ${LIBRES.join(', ').replace(/, ([^,]*)$/, ' o $1')}. ¿Cuál te acomoda?`,
                1,
              ),
          },
        ]
      : paso === 1
        ? LIBRES.map((h) => ({
            label: h,
            elegir: () => {
              setHora(h);
              responder(h, 'Anotando…', 'Perfecto. ¿Me dejas un WhatsApp para confirmarte? Es opcional.', 2);
            },
          }))
        : paso === 2
          ? [
              { label: '+56 9 1234 5678', con: true },
              { label: 'Prefiero no', con: false },
            ].map((o) => ({
              label: o.label,
              elegir: () => {
                setContacto(o.con);
                responder(
                  o.label,
                  'Agendando en el calendario…',
                  `Listo, quedó agendada tu hora el jueves a las ${hora}.${o.con ? ' Te escribimos para confirmar.' : ' Si quieres, escríbenos por WhatsApp para confirmar.'}`,
                  3,
                );
              },
            }))
          : [];

  const agendada = paso === 3 && hora;

  return (
    <section id="agentes" aria-labelledby="agentes-titulo" className="scroll-mt-20 py-24 bg-dys-bg border-b border-dys-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-12">
        <div className="space-y-6">
          <h2 id="agentes-titulo" className="text-titular-2 font-bold text-dys-text">
            {titulo}
          </h2>
          <p className="text-lg text-dys-muted leading-relaxed">
            Un asistente entrenado con la información de tu negocio, conectado a tus herramientas. El mismo que atiende
            el chat de esta web.
          </p>
          <ul className="border-t border-dys-border">
            {PUEDE.map((p) => (
              <li key={p.titulo} className="border-b border-dys-border py-4">
                <h3 className="font-semibold text-dys-text">{p.titulo}</h3>
                <p className="mt-1 text-dys-muted leading-relaxed">{p.texto}</p>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button
              size="lg"
              href={whatsappLink('Hola, quiero un agente con IA para mi empresa')}
              external
              rel="noopener noreferrer"
            >
              Quiero un agente
            </Button>
            <Button size="lg" variant="outline" href="/contacto#agenda">
              Hablar con el nuestro
            </Button>
          </div>
        </div>

        <div data-evento="demo_agentes">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-[7fr_5fr]">
            {/* Chat */}
            <div className="flex min-h-[26rem] flex-col rounded-xl border border-dys-border">
              <p className="border-b border-dys-border px-4 py-3 font-semibold text-dys-text">Asistente de Kine Sur</p>
              <ol className="flex flex-1 flex-col gap-2 p-4" aria-live="polite" aria-label="Conversación de ejemplo">
                {mensajes.map((m, i) => (
                  <li
                    key={i}
                    className={`llamada-entra max-w-[85%] rounded-lg px-3 py-2 leading-snug ${
                      m.de === 'cliente'
                        ? 'self-end bg-dys-primary text-dys-on-primary'
                        : 'self-start bg-dys-text/10 text-dys-text'
                    }`}
                  >
                    {m.texto}
                  </li>
                ))}
                {pensando && <li className="self-start text-sm text-dys-muted">{pensando}</li>}
              </ol>
              <div className="flex flex-wrap gap-2 border-t border-dys-border p-3">
                {opciones.map((o) => (
                  <button
                    key={o.label}
                    type="button"
                    onClick={o.elegir}
                    className="min-h-11 rounded-lg border-2 border-dys-primary px-3 text-sm font-semibold text-dys-text transition-colors hover:bg-dys-primary hover:text-dys-on-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dys-primary focus-visible:ring-offset-2 motion-reduce:transition-none"
                  >
                    {o.label}
                  </button>
                ))}
                {paso === 3 && (
                  <button
                    type="button"
                    onClick={reiniciar}
                    className="min-h-11 px-1 font-semibold text-dys-link underline underline-offset-4 hover:text-dys-text"
                  >
                    Probar de nuevo
                  </button>
                )}
                {paso === -1 && <span className="min-h-11" aria-hidden="true" />}
              </div>
            </div>

            {/* Calendario del negocio y aviso al dueño */}
            <div className="flex flex-col gap-4">
              <div className="dys-light rounded-xl border border-dys-border bg-dys-bg p-4">
                <p className="font-semibold text-dys-text">Jueves</p>
                <ul className="mt-3 space-y-1 text-sm" aria-label="Calendario del jueves">
                  {HORAS.map((h) => {
                    const esLaCita = agendada && h === hora;
                    const ofrecida = paso >= 1 && !OCUPADAS.has(h) && !agendada;
                    return (
                      <li
                        key={h}
                        className={`flex gap-3 rounded-md px-2 py-1 ${
                          esLaCita ? 'llamada-entra bg-dys-primary text-dys-on-primary' : OCUPADAS.has(h) ? 'bg-dys-text/10 text-dys-muted' : 'text-dys-text'
                        }`}
                      >
                        <span className="tabular-nums">{h}</span>
                        <span className={esLaCita ? 'font-semibold' : ''}>
                          {esLaCita ? 'Nueva hora (agente)' : OCUPADAS.has(h) ? 'Ocupado' : ofrecida ? 'Libre, ofrecida' : 'Libre'}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="min-h-[5.5rem] rounded-xl border border-dys-border p-4" aria-live="polite">
                {agendada ? (
                  <div className="llamada-entra">
                    <p className="text-sm text-dys-muted">Aviso al dueño</p>
                    <p className="mt-1 text-dys-text">
                      {contacto
                        ? `Nueva hora el jueves a las ${hora}, con WhatsApp para confirmar.`
                        : `Hora del jueves a las ${hora} sin contacto. Revísala.`}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-dys-muted">Aquí te llegan los avisos del agente.</p>
                )}
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm text-dys-muted">Conversación de ejemplo: toca las respuestas para ver cómo agenda.</p>
        </div>
      </div>
    </section>
  );
}
