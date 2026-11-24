// Rangos del cotizador de la home. Propuesta a partir de un estudio de mercado (nov 2026) de guías
// de precios publicadas por agencias chilenas: rocketmedia.cl, kotizame.cl, forrate.cl y estudiobrief.cl.
// DyS se ubica entre el sitio de plantilla y la agencia premium: código a medida, estudio chico.
// Si cambian los precios, se cambian solo aquí.

export type TipoSitio = 'landing' | 'corporativo' | 'tienda';
export type Extra = 'blog' | 'reservas' | 'idioma' | 'textos';

export const TIPOS: { id: TipoSitio; label: string; detalle: string; min: number; max: number }[] = [
  // Mercado: 300.000 a 640.000 a medida. Parte en PRECIO_DESDE (site.ts).
  { id: 'landing', label: 'Una página', detalle: 'Para presentar un servicio o una campaña.', min: 350_000, max: 500_000 },
  // Mercado: 450.000 a 1.200.000 a medida (4 a 8 páginas).
  { id: 'corporativo', label: 'Sitio de varias páginas', detalle: 'Inicio, servicios, nosotros y contacto (4 a 8 páginas).', min: 650_000, max: 1_100_000 },
  // Mercado: 700.000 a 1.500.000 básica; 1.500.000 a 3.000.000 a medida.
  { id: 'tienda', label: 'Tienda online', detalle: 'Catálogo, carrito y pago con Webpay o Mercado Pago.', min: 1_100_000, max: 1_900_000 },
];

// Montos fijos o porcentaje sobre el sitio base.
export const EXTRAS: { id: Extra; label: string; monto?: [number, number]; pct?: number }[] = [
  // Autoadministrar: +15 % aprox. (Kotízame).
  { id: 'blog', label: 'Blog o noticias que tú mismo publicas', pct: 0.15 },
  // Una agenda o reserva simple dentro del sitio, no una plataforma (esas parten en 3.500.000).
  { id: 'reservas', label: 'Agenda o reservas en línea', monto: [400_000, 800_000] },
  // Idioma adicional: +30 % aprox. (Kotízame).
  { id: 'idioma', label: 'Segundo idioma', pct: 0.3 },
  // Redacción: 50.000 a 200.000 por sitio (Estudio Brief).
  { id: 'textos', label: 'Te escribimos los textos', monto: [100_000, 200_000] },
];

export const URGENCIA_PCT = 0.3; // urgencia: +30 % aprox. (Kotízame)

const redondear = (n: number) => Math.round(n / 10_000) * 10_000;

export function cotizar(tipo: TipoSitio, extras: Extra[], urgente: boolean): { min: number; max: number } {
  const base = TIPOS.find((t) => t.id === tipo)!;
  let min = base.min;
  let max = base.max;
  for (const e of EXTRAS.filter((x) => extras.includes(x.id))) {
    if (e.monto) {
      min += e.monto[0];
      max += e.monto[1];
    } else if (e.pct) {
      min += base.min * e.pct;
      max += base.max * e.pct;
    }
  }
  if (urgente) {
    min *= 1 + URGENCIA_PCT;
    max *= 1 + URGENCIA_PCT;
  }
  return { min: redondear(min), max: redondear(max) };
}
