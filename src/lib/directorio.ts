// Solo servidor: el formulario recibe rubros y comunas como props desde su página.
// Directorio de negocios locales: rubros, comunas y validación de la ficha que llega
// del formulario. Funciones puras (testeadas en test/directorio.test.ts); el guardado
// está en src/app/comunidad/directorio/actions.ts.

import "server-only";
import { COMUNAS_ZONA, toSlug } from "@/lib/farmacias";
import { EMAIL_REGEX, PHONE_REGEX } from "@/lib/form-utils";

export const RUBROS = [
  "Alojamiento y turismo",
  "Gastronomía",
  "Comercio",
  "Salud y bienestar",
  "Servicios profesionales",
  "Construcción y hogar",
  "Oficios y reparaciones",
  "Educación",
  "Otro",
] as const;

export const COMUNAS_DIRECTORIO = COMUNAS_ZONA.map((nombre) => ({ slug: toSlug(nombre), nombre }));

const COMUNAS = new Map(COMUNAS_DIRECTORIO.map((c) => [c.slug, c.nombre]));

export const nombreComunaDirectorio = (slug: string) => COMUNAS.get(slug) ?? slug;

const INSTAGRAM_REGEX = /^[A-Za-z0-9._]{1,30}$/;

// Una sola línea, sin caracteres de control (los textos van también en el correo de aviso).
const limpiar = (v: FormDataEntryValue | null, max: number) =>
  (v?.toString() ?? "").replace(/[\r\n\t\0]+/g, " ").replace(/\s+/g, " ").trim().slice(0, max);

/** "www.mitienda.cl" → "https://www.mitienda.cl/". null si no es una URL http(s) con dominio. */
export function normalizarSitio(raw: string): string | null {
  const valor = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const url = new URL(valor);
    if (!["http:", "https:"].includes(url.protocol) || !url.hostname.includes(".") || url.username || url.password) {
      return null;
    }
    return url.toString().slice(0, 200);
  } catch {
    return null;
  }
}

/** "@mitienda", "instagram.com/mitienda/" o "mitienda" → "mitienda". null si no es un usuario válido. */
export function normalizarInstagram(raw: string): string | null {
  const usuario = raw
    .replace(/^https?:\/\/(www\.)?instagram\.com\//i, "")
    .replace(/^@/, "")
    .replace(/[/?#].*$/, "");
  return INSTAGRAM_REGEX.test(usuario) ? usuario : null;
}

export interface FichaNegocio {
  nombre: string;
  rubro: string;
  comuna_slug: string;
  descripcion: string;
  telefono: string | null;
  sitio_web: string | null;
  instagram: string | null;
  contacto_nombre: string;
  email_contacto: string;
  quiere_sitio: boolean;
}

export type ResultadoFicha = { ok: true; ficha: FichaNegocio } | { ok: false; error: string };

export function validarFicha(formData: FormData): ResultadoFicha {
  const nombre = limpiar(formData.get("nombre"), 80);
  const rubro = limpiar(formData.get("rubro"), 40);
  const comunaSlug = limpiar(formData.get("comuna"), 40);
  const descripcion = limpiar(formData.get("descripcion"), 300);
  const telefono = limpiar(formData.get("telefono"), 30);
  const sitio = limpiar(formData.get("sitio_web"), 200);
  const instagram = limpiar(formData.get("instagram"), 80);
  const contactoNombre = limpiar(formData.get("contacto_nombre"), 100);
  const email = limpiar(formData.get("email"), 254).toLowerCase();

  if (nombre.length < 2) return { ok: false, error: "Escribe el nombre del negocio." };
  if (!(RUBROS as readonly string[]).includes(rubro)) return { ok: false, error: "Elige un rubro de la lista." };
  if (!COMUNAS.has(comunaSlug)) return { ok: false, error: "Elige una comuna de la lista." };
  if (descripcion.length < 10) return { ok: false, error: "Cuéntanos en una frase qué ofrece tu negocio (mínimo 10 caracteres)." };
  if (!contactoNombre) return { ok: false, error: "Escribe tu nombre." };
  if (!EMAIL_REGEX.test(email)) return { ok: false, error: "Ingresa un correo electrónico válido." };
  if (telefono && !PHONE_REGEX.test(telefono)) {
    return { ok: false, error: "Revisa el teléfono: usa solo números, por ejemplo +56 9 1234 5678." };
  }
  const sitioWeb = sitio ? normalizarSitio(sitio) : null;
  if (sitio && !sitioWeb) return { ok: false, error: "Revisa el sitio web, por ejemplo www.minegocio.cl." };
  const usuarioIg = instagram ? normalizarInstagram(instagram) : null;
  if (instagram && !usuarioIg) return { ok: false, error: "Revisa el Instagram, por ejemplo @minegocio." };
  if (formData.get("acepto") !== "on") {
    return { ok: false, error: "Necesitamos tu autorización para publicar la ficha." };
  }

  return {
    ok: true,
    ficha: {
      nombre,
      rubro,
      comuna_slug: comunaSlug,
      descripcion,
      telefono: telefono || null,
      sitio_web: sitioWeb,
      instagram: usuarioIg,
      contacto_nombre: contactoNombre,
      email_contacto: email,
      quiere_sitio: formData.get("quiere_sitio") === "on",
    },
  };
}

/**
 * Enlace mailto: con el correo de bienvenida ya escrito, para el botón del aviso que llega
 * a contacto@. Al aprobar la ficha, Diego lo abre, lo revisa y lo envía desde su correo.
 */
export function mailtoBienvenida(ficha: Pick<FichaNegocio, "nombre" | "contacto_nombre" | "email_contacto">): string {
  const asunto = `¡${ficha.nombre} ya está en el directorio de Puerto Varas! 🎉`;
  const cuerpo = [
    `Hola ${ficha.contacto_nombre}:`,
    "",
    `La ficha de ${ficha.nombre} ya está publicada en el Directorio de negocios locales de Puerto Varas y alrededores:`,
    "https://www.solucionesdys.cl/comunidad/directorio",
    "",
    "Si quieres cambiar algo de la ficha, responde este correo y lo actualizamos.",
    "",
    "Te pido un favor: comparte el directorio con otros emprendedores que conozcas. Mientras más negocios haya, más gente lo visita y más clientes te llegan a ti también.",
    "",
    "¡Gracias por sumarte!",
    "Diego · Soluciones DyS",
  ].join("\r\n");
  return `mailto:${encodeURIComponent(ficha.email_contacto)}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
}
