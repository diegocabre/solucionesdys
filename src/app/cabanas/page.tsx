import type { Metadata } from 'next';
import Button from '@/components/Button';
import CabanaDemo from '@/components/CabanaDemo';
import { OFERTAS, SITES, whatsappLink, withUtm } from '@/lib/dys-links';

export const metadata: Metadata = {
  title: 'Reservas directas para cabañas, sin comisión de plataforma',
  description:
    'Página propia para tus cabañas: el huésped ve fechas y precio, reserva y paga el abono con Mercado Pago. Sin comisión de Airbnb ni Booking. Hecho en Puerto Varas.',
  alternates: { canonical: '/cabanas' },
  openGraph: {
    title: 'Reservas directas para cabañas | Soluciones DyS',
    description: 'El huésped reserva y paga el abono en tu propia página, sin comisión de plataforma.',
    url: '/cabanas',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Soluciones DyS' }],
  },
};

const utm = { source: 'solucionesdys.cl', medium: 'web', campaign: 'pagina_cabanas' } as const;
const REL = 'noopener noreferrer';

// Así funciona hoy el sistema (reserva-cabanas): página por cabaña, abono con Mercado Pago,
// reserva apartada 30 minutos mientras se paga y aviso al dueño.
const pasos = [
  { title: 'Tu cabaña con su página', desc: 'Fotos, servicios y ubicación de tu cabaña, con tus colores. La compartes en Instagram o WhatsApp.' },
  { title: 'El huésped elige fechas', desc: 'Ve qué días están libres y cuánto cuesta para su grupo, sin escribirte para preguntar.' },
  { title: 'Paga el abono', desc: 'Paga con Mercado Pago y las fechas quedan apartadas mientras termina. El resto te lo paga a ti en la cabaña.' },
  { title: 'Te llega el aviso', desc: 'Recibes la reserva por correo y el huésped su confirmación, con un código para volver a revisarla.' },
];

const incluye = [
  { title: 'Para tu huésped', items: ['Disponibilidad y precio al tiro', 'Pago del abono con Mercado Pago', 'Confirmación por correo y código de reserva'] },
  { title: 'Para ti', items: ['Precio por noche según el grupo y los días', 'Panel para ver reservas y bloquear fechas', 'Una o varias cabañas en la misma página'] },
  { title: 'Sin comisión', items: ['El abono llega a tu cuenta de Mercado Pago', 'Tratas directo con tu huésped', 'Tu página, tus fotos y tu marca'] },
];

export default function CabanasPage() {
  const wsp = whatsappLink('Hola, quiero reservas directas para mis cabañas');

  return (
    <div className="flex flex-col bg-dys-bg">
      <section className="pt-16 pb-20 sm:pt-24 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[6fr_5fr] gap-12 lg:gap-16 items-center">
          <div>
            <h1 className="firma-punto max-w-[13ch] text-titular-1 font-bold text-dys-text">Reservas directas, sin comisión</h1>
            <p className="mt-8 max-w-[48ch] text-lg sm:text-xl text-dys-muted leading-relaxed">
              Para cabañas del sur. Tus huéspedes ven fechas y precio, reservan y pagan el abono en tu propia página.
              Tú apruebas desde el celular y no le pagas comisión a ninguna plataforma.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button size="lg" href={wsp} external rel={REL}>
                Quiero reservas directas
              </Button>
              <Button size="lg" variant="outline" href={withUtm(SITES.reservas, { ...utm, content: 'hero_ejemplo' })} external rel={REL}>
                Ver una cabaña de ejemplo
              </Button>
            </div>
          </div>
          <div>
            <CabanaDemo />
            <p className="mt-3 text-sm text-dys-muted">Elige llegada, salida y personas: así lo ve tu huésped.</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="como-funciona" className="dys-light bg-dys-bg py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <h2 id="como-funciona" className="text-titular-2 font-bold text-dys-text">
            Cómo funciona
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

      <section aria-labelledby="que-incluye" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-12">
          <h2 id="que-incluye" className="text-titular-2 font-bold text-dys-text">
            Qué incluye
          </h2>
          <ul className="border-t border-dys-border">
            {incluye.map((grupo) => (
              <li key={grupo.title} className="border-b border-dys-border py-8">
                <h3 className="text-titular-3 font-semibold text-dys-text">{grupo.title}</h3>
                <ul className="mt-3 space-y-1 text-dys-muted leading-relaxed">
                  {grupo.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="probarlo" className="dys-light bg-dys-bg py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="probarlo" className="max-w-2xl text-titular-2 font-bold text-dys-text">
            ¿Lo probamos con tu cabaña?
          </h2>
          <p className="mt-6 max-w-2xl border-l-2 border-dys-primary pl-4 text-lg text-dys-text">{OFERTAS.cabanas}</p>
          <p className="mt-6 max-w-2xl text-lg text-dys-muted leading-relaxed">
            Armamos la página con tus fotos y tarifas, y te mostramos cómo llegan las reservas. Hablas directo con quien
            lo programa.
          </p>
          <div className="mt-10">
            <Button size="lg" href={wsp} external rel={REL}>
              Escribir por WhatsApp
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
