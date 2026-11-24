import type { ReactNode } from 'react';
import Button from '@/components/Button';
import CabanaDemo from '@/components/CabanaDemo';
import MesaDemo from '@/components/MesaDemo';
import { OFERTAS, SITES, whatsappLink, withUtm } from '@/lib/dys-links';

// "¿Restaurante o cabañas?": lleva a los dos productos propios (Mesonero y reservas directas).
type Cta = { label: string; href: string };

type ProductCard = {
  id: string;
  eyebrow: string;
  title: string;
  text: string;
  oferta: string;
  demo: ReactNode;
  primary: Cta;
  secondary: Cta;
};

const utmBase = {
  source: 'solucionesdys.cl',
  medium: 'web',
  campaign: 'inicio_productos',
} as const;

const cards: ProductCard[] = [
  {
    id: 'restaurantes',
    eyebrow: 'Para restaurantes',
    title: 'Mesonero: la mesa te avisa',
    text: 'Tus clientes tocan la mesa con su celular, sin descargar nada, y el mesonero recibe el aviso al instante. Si pasan 3 minutos sin atender, te avisa a ti.',
    oferta: OFERTAS.restaurantes,
    demo: <MesaDemo />,
    primary: {
      label: 'Ver cómo funciona',
      href: '/restaurantes',
    },
    secondary: {
      label: 'Pedir demo por WhatsApp',
      href: whatsappLink('Hola, quiero probar Mesonero en mi restaurante'),
    },
  },
  {
    id: 'cabanas',
    eyebrow: 'Para cabañas',
    title: 'Reservas directas, sin comisión de plataforma',
    text: 'Tus huéspedes ven fechas y precio al tiro, piden la reserva y tú la apruebas desde el celular. El abono llega directo a tu cuenta de Mercado Pago.',
    oferta: OFERTAS.cabanas,
    demo: <CabanaDemo />,
    primary: {
      label: 'Ver cómo funciona',
      href: withUtm(SITES.reservas, { ...utmBase, content: 'cabanas_ver' }),
    },
    secondary: {
      label: 'Quiero reservas directas',
      href: whatsappLink('Hola, quiero reservas directas para mis cabañas'),
    },
  },
];

const REL = 'noopener noreferrer';

export default function ProductChooser() {
  return (
    <section
      id="productos"
      aria-labelledby="productos-titulo"
      className="scroll-mt-20 py-24 bg-dys-bg border-b border-dys-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 id="productos-titulo" className="max-w-2xl text-titular-2 font-bold text-dys-text">
          ¿Tienes un restaurante o cabañas?
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-dys-muted leading-relaxed">
          Dos sistemas listos para probar, hechos en Puerto Varas. Hablas directo con quien los programa.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {cards.map((card) => (
            <article
              key={card.id}
              className="flex flex-col rounded-xl border border-dys-border p-6 sm:p-8"
            >
              <p className="text-sm font-semibold text-dys-muted">{card.eyebrow}</p>
              <h3 className="mt-2 text-titular-3 font-semibold text-dys-text">{card.title}</h3>
              <p className="mt-4 text-dys-muted leading-relaxed">{card.text}</p>
              <div className="mt-8 flex-1">{card.demo}</div>
              <p className="mt-6 border-l-2 border-dys-primary pl-4 text-dys-text">{card.oferta}</p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button href={card.primary.href} external={card.primary.href.startsWith('http')} rel={REL}>
                  {card.primary.label}
                </Button>
                <Button href={card.secondary.href} variant="outline" external rel={REL}>
                  {card.secondary.label}
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
