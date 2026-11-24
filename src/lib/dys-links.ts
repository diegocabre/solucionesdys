// Enlaces a los productos de Soluciones DyS y textos de sus ofertas.

// Mismo número que BUSINESS.whatsapp en site.ts, en formato internacional sin "+".
export const WHATSAPP_NUMBER = "56947637541";

export const SITES = {
  restaurantes: "https://restaurantes.solucionesdys.cl",
  reservas: "https://reservas.solucionesdys.cl",
} as const;

// Condiciones que aparecen hoy en los reels. Si cambian, se cambian aquí.
export const OFERTAS = {
  restaurantes: "Prueba de 30 días sin costo para 3 restaurantes de Puerto Varas.",
  cabanas: "Piloto sin costo hasta el 31 de diciembre para 3 cabañas del sur.",
} as const;

type Utm = {
  source: string;
  medium: string;
  campaign: string;
  content?: string;
};

// Agrega UTM para medir en Analytics lo que llega desde cada bloque.
export function withUtm(url: string, utm: Utm): string {
  const u = new URL(url);
  u.searchParams.set("utm_source", utm.source);
  u.searchParams.set("utm_medium", utm.medium);
  u.searchParams.set("utm_campaign", utm.campaign);
  if (utm.content) u.searchParams.set("utm_content", utm.content);
  return u.toString();
}

// WhatsApp con el mensaje ya escrito.
export function whatsappLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
