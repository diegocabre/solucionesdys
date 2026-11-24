import type { Metadata } from 'next';
import Button from '@/components/Button';
import MesaDemo from '@/components/MesaDemo';
import { OFERTAS, SITES, whatsappLink, withUtm } from '@/lib/dys-links';

export const metadata: Metadata = {
  title: 'Mesonero: la mesa le avisa al mesonero, sin instalar nada',
  description:
    'Tus clientes llaman al mesonero, piden la cuenta, ven la carta y opinan desde su celular con un tag NFC o un QR en la mesa. Hecho en Puerto Varas.',
  alternates: { canonical: '/restaurantes' },
  openGraph: {
    title: 'Mesonero: la mesa te avisa | Soluciones DyS',
    description: 'Llamar al mesonero, pedir la cuenta y ver la carta desde el celular, con un tag NFC o un QR en cada mesa.',
    url: '/restaurantes',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Soluciones DyS' }],
  },
};

const utm = { source: 'solucionesdys.cl', medium: 'web', campaign: 'pagina_restaurantes' } as const;
const REL = 'noopener noreferrer';

const pasos = [
  { title: 'Un tag en cada mesa', desc: 'Cada mesa lleva un tag NFC y un QR con la marca de tu restaurante. Se instala una sola vez.' },
  { title: 'El cliente toca', desc: 'Acerca el celular o escanea el QR y elige «Llamar al mesonero», «Pedir la cuenta» o «Pedir agua». Sin descargar nada.' },
  { title: 'El mesonero lo ve', desc: 'Le llega el aviso con sonido a su celular, solo de las mesas de su zona, y lo marca como atendido.' },
];

const incluye = [
  {
    title: 'Para tu cliente',
    items: ['Llamar al mesonero, pedir la cuenta o agua', 'Ver la carta, con lo agotado marcado', 'Dejar una reseña o una sugerencia privada'],
  },
  {
    title: 'Para tu equipo',
    items: ['Llamadas en vivo con sonido, por zona', 'Cada mesonero ve solo sus mesas', 'Funciona en el celular que ya tienen'],
  },
  {
    title: 'Para ti',
    items: ['Carta, mesas y zonas desde un panel', 'QR imprimibles y grabación de tags NFC', 'Reseñas y sugerencias en una bandeja'],
  },
];

export default function RestaurantesPage() {
  const demo = withUtm(`${SITES.restaurantes}/demo`, { ...utm, content: 'hero_demo' });
  const wsp = whatsappLink('Hola, quiero probar Mesonero en mi restaurante');

  return (
    <div className="flex flex-col bg-dys-bg">
      {/* Portada: la demo jugable es la pieza memorable de la página; el resto queda sobrio. */}
      <section className="pt-16 pb-20 sm:pt-24 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-12 lg:gap-16 items-center">
          <div>
            <h1 className="firma-punto max-w-[12ch] text-titular-1 font-bold text-dys-text">La mesa te avisa</h1>
            <p className="mt-8 max-w-[46ch] text-lg sm:text-xl text-dys-muted leading-relaxed">
              Mesonero es para restaurantes. Tu cliente acerca el celular al tag o escanea el QR de su mesa y llama al
              mesonero, pide la cuenta o ve la carta. Sin instalar nada y sin hacer señas.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button size="lg" href={demo} external rel={REL}>
                Probar la demo real
              </Button>
              <Button size="lg" href={wsp} variant="outline" external rel={REL}>
                Pedir demo por WhatsApp
              </Button>
            </div>
          </div>
          <MesaDemo />
        </div>
      </section>

      <section aria-labelledby="como-funciona" className="dys-light bg-dys-bg py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <h2 id="como-funciona" className="text-titular-2 font-bold text-dys-text">
            Cómo funciona
          </h2>
          <ol className="grid grid-cols-1 md:grid-cols-3 gap-x-10 border-t border-dys-border">
            {pasos.map((paso, idx) => (
              <li key={paso.title} className="border-b border-dys-border md:border-b-0 py-8">
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
          <div className="space-y-5">
            <h2 id="que-incluye" className="text-titular-2 font-bold text-dys-text">
              Con tu marca, no con la nuestra
            </h2>
            <p className="max-w-md text-lg text-dys-muted leading-relaxed">
              La pantalla de la mesa lleva el logo y los colores de tu restaurante.
            </p>
          </div>
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
            ¿Lo probamos en tu restaurante?
          </h2>
          <p className="mt-6 max-w-2xl border-l-2 border-dys-primary pl-4 text-lg text-dys-text">{OFERTAS.restaurantes}</p>
          <p className="mt-6 max-w-2xl text-lg text-dys-muted leading-relaxed">
            Te mostramos la demo con tu carta y tu logo, y vemos cuántas mesas y zonas necesitas. Hablas directo con
            quien lo programa.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button size="lg" href={wsp} external rel={REL}>
              Pedir demo por WhatsApp
            </Button>
            <Button
              size="lg"
              variant="outline"
              href={withUtm(SITES.restaurantes, { ...utm, content: 'cierre_sitio' })}
              external
              rel={REL}
            >
              Ver el sitio de Mesonero
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
