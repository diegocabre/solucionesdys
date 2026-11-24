declare global {
  interface Window {
    clarity?: (...args: unknown[]) => void;
  }
}

// Evento de Clarity según el destino del enlace; null si no es una acción de contacto.
export function eventoDeEnlace(href: string): string | null {
  if (href.includes("wa.me/")) return "cta_whatsapp";
  if (href.startsWith("tel:")) return "cta_telefono";
  if (href.startsWith("mailto:")) return "cta_correo";
  if (/^\/contacto(?:[?#]|$)/.test(href)) return "cta_cotizar";
  return null;
}

// Eventos de un clic: la acción de contacto, la misma acción con la sección de origen
// (id del <section>, ej. "cta_whatsapp_cotizador") y la demo tocada, si la hay.
export function eventosDeClic({ href, seccion, demo }: { href?: string | null; seccion?: string | null; demo?: string | null }): string[] {
  const eventos: string[] = [];
  const contacto = href ? eventoDeEnlace(href) : null;
  if (contacto) {
    eventos.push(contacto);
    if (seccion) eventos.push(`${contacto}_${seccion.replace(/-/g, "_")}`);
  }
  if (demo) eventos.push(demo);
  return eventos;
}
