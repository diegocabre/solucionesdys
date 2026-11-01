import Button from '@/components/Button';
import Link from 'next/link';
import type { Metadata } from 'next';
import CasosDeExito from '@/components/CasosDeExito';
import UltimosArticulos from '@/components/UltimosArticulos';
import ZonaAtencion from '@/components/ZonaAtencion';
import JsonLd from '@/components/JsonLd';
import { getTestimoniosPublicados } from '@/lib/casos';
import { PRECIO_DESDE, SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: "Diseño Web en Puerto Varas: sitios rápidos que traen clientes",
  description: "Sitios web, landing pages y tiendas online a medida para pymes de Puerto Varas y Los Lagos: cargan rápido en el celular, aparecen en Google y convierten visitas en consultas por WhatsApp.",
  alternates: { canonical: "/webs" },
  openGraph: {
    title: "Diseño Web en Puerto Varas: sitios rápidos que traen clientes | Soluciones DyS",
    description: "Sitios web a medida que cargan rápido, aparecen en Google y generan más consultas para tu negocio.",
    url: "/webs",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Soluciones DyS" }],
  }
};

export default function WebsPage() {
  // Lo que gana el negocio: beneficios concretos, sin íconos de relleno.
  const beneficios = [
    {
      title: "Carga rápida en el celular",
      description: "Si tu sitio demora, la visita se va a la competencia. Optimizamos cada imagen y cada línea de código.",
    },
    {
      title: "Se ve bien en cualquier pantalla",
      description: "La mayoría de tus clientes te encontrará desde el celular.",
    },
    {
      title: "Aparecer en Google",
      description: "Preparado para que te encuentren quienes buscan lo que ofreces en tu zona.",
    },
    {
      title: "Más consultas",
      description: "Botones de WhatsApp y formularios a la vista para que contactarte sea fácil.",
    },
  ];

  const webServices = [
    {
      title: "Landing pages",
      description: "Páginas de un solo scroll diseñadas específicamente para convertir visitas en clientes potenciales. Perfectas para promocionar un servicio o campaña en redes sociales.",
    },
    {
      title: "Sitios corporativos",
      description: "Sitios profesionales multipáginas para constructoras, talleres, oficinas y comercios que desean transmitir confianza y establecer una sólida presencia de marca.",
    },
    {
      title: "Tiendas online y catálogos",
      description: "Tiendas virtuales completas con carrito de compras, catálogos enlazados a bases de datos y pasarela de pagos integrada para vender tus productos online sin esfuerzo.",
    },
  ];

  // El proceso sí es una secuencia: aquí los números tienen sentido.
  const processSteps = [
    {
      title: "Planificación",
      desc: "Analizamos tu negocio y definimos el mapa del sitio junto con los objetivos clave de conversión.",
    },
    {
      title: "Diseño",
      desc: "Creamos la maqueta visual alineada a los colores e identidad corporativa de tu marca.",
    },
    {
      title: "Desarrollo",
      desc: "Construimos tu sitio para que cargue rápido en cualquier celular y Google lo entienda desde el primer día.",
    },
    {
      title: "Lanzamiento",
      desc: "Realizamos pruebas de usabilidad, conectamos tu dominio y publicamos tu sitio.",
    },
  ];

  // AggregateRating solo con reseñas reales publicadas que tengan calificación.
  const calificaciones = getTestimoniosPublicados()
    .map((c) => c.testimonio.calificacion)
    .filter((n): n is number => typeof n === 'number');
  const ratingJsonLd =
    calificaciones.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'ProfessionalService',
          '@id': `${SITE_URL}/#business`,
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: (calificaciones.reduce((a, b) => a + b, 0) / calificaciones.length).toFixed(1),
            reviewCount: calificaciones.length,
            bestRating: 5,
          },
        }
      : null;

  return (
    <div className="flex flex-col bg-dys-bg">
      {ratingJsonLd && <JsonLd data={ratingJsonLd} />}

      {/* Hero: el titular solo, cerrado con el punto del logo, como en la home. */}
      <section className="pt-16 pb-20 sm:pt-24 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="firma-punto max-w-[14ch] text-titular-1 font-bold text-dys-text">
            Sitios web que te traen clientes
          </h1>
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-[7fr_5fr] gap-8 lg:gap-12 items-end">
            <p className="max-w-[56ch] text-lg sm:text-xl text-dys-muted leading-relaxed">
              Desde Puerto Varas diseñamos sitios que cargan rápido en el celular, aparecen cuando te buscan en Google y
              hacen fácil que te escriban por WhatsApp. Tu negocio recibiendo consultas las 24 horas, también mientras
              duermes.
            </p>
            <div className="lg:flex lg:justify-end">
              <Button size="lg" href="/contacto">
                Cotizar mi sitio
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Beneficios en lista de dos columnas con divisores */}
      <section aria-labelledby="beneficios" className="dys-light bg-dys-bg py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-12">
          <h2 id="beneficios" className="text-titular-2 font-bold text-dys-text">
            Lo que gana tu negocio
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 border-t border-dys-border">
            {beneficios.map((b) => (
              <li key={b.title} className="border-b border-dys-border py-6">
                <h3 className="text-xl font-semibold text-dys-text">{b.title}</h3>
                <p className="mt-2 text-dys-muted leading-relaxed">{b.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Tipos de sitio: misma lista tipográfica que en la home */}
      <section aria-labelledby="tipos-de-sitio" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-12">
          <div className="space-y-5">
            <h2 id="tipos-de-sitio" className="text-titular-2 font-bold text-dys-text">
              ¿Qué tipo de sitio web necesitas?
            </h2>
            <p className="max-w-md text-lg text-dys-muted leading-relaxed">
              Elige la estructura que mejor calza con lo que quieres lograr.
            </p>
            <p className="text-lg text-dys-text">
              Desde <strong className="font-semibold">{PRECIO_DESDE}</strong> por una página estática.
            </p>
          </div>

          <ul className="border-t border-dys-border">
            {webServices.map((service) => (
              <li key={service.title} className="border-b border-dys-border py-8">
                <h3 className="text-titular-3 font-semibold text-dys-text">{service.title}</h3>
                <p className="mt-3 max-w-[60ch] text-dys-muted leading-relaxed">{service.description}</p>
                <Link
                  href="/contacto"
                  className="mt-4 inline-block font-semibold text-dys-link underline underline-offset-4 hover:text-dys-text"
                >
                  Cotizar {service.title.toLowerCase()}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CasosDeExito />

      {/* Proceso: una secuencia real, por eso va numerada */}
      <section aria-labelledby="proceso" className="dys-light bg-dys-bg py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-2xl space-y-4">
            <h2 id="proceso" className="text-titular-2 font-bold text-dys-text">
              Cómo trabajamos
            </h2>
            <p className="text-lg text-dys-muted leading-relaxed">
              De la idea a la pantalla, en cuatro pasos y hablando siempre con quien construye tu sitio.
            </p>
          </div>

          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 border-t border-dys-border">
            {processSteps.map((step, idx) => (
              <li key={step.title} className="border-b border-dys-border lg:border-b-0 py-8">
                <span className="block font-display text-titular-2 font-bold text-dys-muted" aria-hidden="true">
                  {idx + 1}
                </span>
                <h3 className="mt-4 text-xl font-semibold text-dys-text">{step.title}</h3>
                <p className="mt-2 text-dys-muted leading-relaxed">{step.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <UltimosArticulos />
      <ZonaAtencion />
    </div>
  );
}
