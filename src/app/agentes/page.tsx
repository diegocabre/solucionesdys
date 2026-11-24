import type { Metadata } from 'next';
import AgentesIA from '@/components/AgentesIA';
import Button from '@/components/Button';
import { whatsappLink } from '@/lib/dys-links';

export const metadata: Metadata = {
  title: 'Agentes con IA para empresas: atienden y agendan por ti',
  description:
    'Asistentes con IA entrenados con la información de tu negocio: atienden en tu web o Telegram, agendan en Google Calendar y avisan a tu equipo. Hecho en Puerto Varas.',
  alternates: { canonical: '/agentes' },
  openGraph: {
    title: 'Agentes con IA para empresas | Soluciones DyS',
    description: 'Atienden en tu web o Telegram, agendan en tu calendario y avisan a tu equipo.',
    url: '/agentes',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Soluciones DyS' }],
  },
};

const REL = 'noopener noreferrer';

// Usos reales de los agentes que DyS ya tiene funcionando (n8n + Google Calendar + Telegram).
const usos = [
  { title: 'Agendar horas y reuniones', desc: 'Revisa tu calendario, ofrece solo horas libres, pide los datos de contacto y deja la cita anotada.' },
  { title: 'Responder lo que siempre preguntan', desc: 'Precios, horarios, servicios y zonas de atención, con la información que tú le das. Si no sabe algo, deriva a tu WhatsApp.' },
  { title: 'Avisar a tu equipo', desc: 'Te manda un mensaje por Telegram cuando entra una cita nueva o cuando una queda sin teléfono ni correo.' },
  { title: 'Atender donde están tus clientes', desc: 'En el chat de tu sitio web o en un bot de Telegram, con el mismo agente detrás.' },
];

const pasos = [
  { title: 'Conversamos', desc: 'Vemos qué tareas se repiten en tu negocio y cuáles conviene que haga el agente.' },
  { title: 'Lo armamos', desc: 'Le cargamos la información de tu negocio y lo conectamos a tu calendario y canales.' },
  { title: 'Lo pruebas', desc: 'Conversas con él antes de publicarlo y ajustamos cómo responde.' },
  { title: 'Queda funcionando', desc: 'Lo dejamos en un servidor con respaldo diario y lo vamos afinando contigo.' },
];

export default function AgentesPage() {
  const wsp = whatsappLink('Hola, quiero un agente con IA para mi empresa');

  return (
    <div className="flex flex-col bg-dys-bg">
      <section className="pt-16 pb-16 sm:pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="firma-punto max-w-[16ch] text-titular-1 font-bold text-dys-text">Agentes con IA para tu empresa</h1>
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-[7fr_5fr] gap-8 lg:gap-12 items-end">
            <p className="max-w-[56ch] text-lg sm:text-xl text-dys-muted leading-relaxed">
              Un asistente que conoce tu negocio, atiende a tus clientes a cualquier hora, agenda en tu calendario y te
              avisa lo importante. Lo hacemos a la medida de lo que tú necesitas.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-end">
              <Button size="lg" href={wsp} external rel={REL}>
                Quiero un agente
              </Button>
            </div>
          </div>
        </div>
      </section>

      <AgentesIA titulo="Así atiende y agenda" />

      <section aria-labelledby="usos" className="dys-light bg-dys-bg py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-12">
          <h2 id="usos" className="text-titular-2 font-bold text-dys-text">
            Qué puede hacer por tu negocio
          </h2>
          <ul className="border-t border-dys-border">
            {usos.map((u) => (
              <li key={u.title} className="border-b border-dys-border py-8">
                <h3 className="text-titular-3 font-semibold text-dys-text">{u.title}</h3>
                <p className="mt-3 max-w-[60ch] text-dys-muted leading-relaxed">{u.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="como-trabajamos" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <h2 id="como-trabajamos" className="text-titular-2 font-bold text-dys-text">
            Cómo trabajamos
          </h2>
          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 border-t border-dys-border">
            {pasos.map((paso, idx) => (
              <li key={paso.title} className="border-b border-dys-border lg:border-b-0 py-8">
                <span className="block font-display text-titular-2 font-bold text-dys-muted" aria-hidden="true">
                  {idx + 1}
                </span>
                <h3 className="mt-4 text-xl font-semibold text-dys-text">{paso.title}</h3>
                <p className="mt-2 text-dys-muted leading-relaxed">{paso.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="cierre-agentes" className="dys-light bg-dys-bg py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="cierre-agentes" className="max-w-2xl text-titular-2 font-bold text-dys-text">
            ¿Qué tarea te gustaría dejar de hacer?
          </h2>
          <p className="mt-6 max-w-2xl text-lg text-dys-muted leading-relaxed">
            Cuéntanos y te decimos si un agente lo puede resolver. Se cotiza según el caso.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button size="lg" href={wsp} external rel={REL}>
              Escribir por WhatsApp
            </Button>
            <Button size="lg" variant="outline" href="/contacto#agenda">
              Hablar con nuestro agente
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
