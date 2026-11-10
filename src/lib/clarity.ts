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
