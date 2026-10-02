// Casos de éxito de /webs y /webs/casos/[slug].
//
// Regla: solo se publican casos con datos REALES y autorizados por el cliente.
// Mientras `published` sea false, el caso no aparece en producción (ni en la
// página, ni en el sitemap, ni en el JSON-LD); en `next dev` se ve como borrador
// para poder revisarlo.

export interface ResultadoMedible {
  /** Qué se midió, p. ej. "Consultas por WhatsApp al mes". */
  metrica: string;
  antes: string;
  despues: string;
  /** Periodo comparado, p. ej. "ene–mar 2026 vs. abr–jun 2026". */
  periodo: string;
}

export interface Testimonio {
  texto: string;
  autor: string;
  cargo: string;
  /** Calificación 1–5 dada por el cliente. Solo con ella se genera AggregateRating. */
  calificacion?: number;
}

export interface CasoExito {
  slug: string;
  cliente: string;
  rubro: string;
  ciudad: string;
  problema: string;
  solucion: string;
  stack: string[];
  resultados: ResultadoMedible[];
  testimonio?: Testimonio;
  /** Captura del sitio en /public. */
  imagen: string;
  url: string;
  published: boolean;
}

const PENDIENTE = "Pendiente";

export const CASOS: CasoExito[] = [
  {
    slug: "dogtoralia-vet",
    cliente: "Dogtoralia Vet",
    rubro: "Veterinaria y tienda online",
    ciudad: "Puente Alto y Santiago Centro",
    // TODO(diego): reemplazar con el problema real que tenía el cliente antes del sitio.
    problema: "Borrador: describir qué problema tenía la clínica antes del sitio (p. ej. cómo llegaban las consultas y qué se perdía).",
    solucion:
      "Sitio web con los servicios de atención veterinaria de sus dos sedes, tienda online de productos para mascotas y contacto directo por WhatsApp.",
    stack: ["Next.js", "React", "Tailwind CSS"],
    // TODO(diego): reemplazar con métricas reales (Google Analytics / Search Console / WhatsApp Business / PageSpeed).
    resultados: [
      { metrica: "Visitas al mes", antes: PENDIENTE, despues: PENDIENTE, periodo: PENDIENTE },
      { metrica: "Consultas por WhatsApp al mes", antes: PENDIENTE, despues: PENDIENTE, periodo: PENDIENTE },
      { metrica: "Posición en Google para \"veterinaria Puente Alto\"", antes: PENDIENTE, despues: PENDIENTE, periodo: PENDIENTE },
      { metrica: "PageSpeed móvil", antes: PENDIENTE, despues: PENDIENTE, periodo: PENDIENTE },
    ],
    // TODO(diego): reemplazar: agregar testimonio real (con autorización escrita del cliente).
    imagen: "/assets/img/partners/dogtoralia-vet-web.jpg",
    url: "https://www.dogtoraliavet.cl/home",
    published: false,
  },
  {
    slug: "caroline-magic",
    cliente: "Caroline Magic",
    rubro: "Tarot evolutivo y talleres",
    // TODO(diego): reemplazar con la ciudad real de la clienta.
    ciudad: "Chile",
    // TODO(diego): reemplazar con el problema real que tenía la clienta antes del sitio.
    problema: "Borrador: describir cómo se agendaban las lecturas antes del sitio y qué se quería mejorar.",
    solucion:
      "Sitio con oráculo interactivo del día, agenda de lecturas y talleres grupales, y una identidad visual propia.",
    stack: ["Next.js", "React", "Tailwind CSS", "Framer Motion"],
    // TODO(diego): reemplazar con métricas reales.
    resultados: [
      { metrica: "Visitas al mes", antes: PENDIENTE, despues: PENDIENTE, periodo: PENDIENTE },
      { metrica: "Consultas por WhatsApp al mes", antes: PENDIENTE, despues: PENDIENTE, periodo: PENDIENTE },
      { metrica: "Posición en Google para \"tarot evolutivo\"", antes: PENDIENTE, despues: PENDIENTE, periodo: PENDIENTE },
      { metrica: "PageSpeed móvil", antes: PENDIENTE, despues: PENDIENTE, periodo: PENDIENTE },
    ],
    imagen: "/assets/img/partners/caroline-magic-web.jpg",
    url: "https://www.carolinemagic.cl/",
    published: false,
  },
  {
    slug: "soluciones-dys",
    cliente: "Soluciones DyS",
    rubro: "Diseño y desarrollo web",
    ciudad: "Puerto Varas",
    // TODO(diego): reemplazar con la situación real antes del rediseño.
    problema: "Borrador: describir el punto de partida del propio sitio (velocidad, posicionamiento, consultas).",
    solucion:
      "Sitio propio con SEO local para Puerto Varas, contenido útil para la comunidad (farmacias de turno) y formulario de contacto con registro de consultas.",
    stack: ["Next.js", "React", "Tailwind CSS", "TypeScript"],
    // TODO(diego): reemplazar con métricas reales (Search Console y PageSpeed antes/después).
    resultados: [
      { metrica: "Visitas al mes", antes: PENDIENTE, despues: PENDIENTE, periodo: PENDIENTE },
      { metrica: "Consultas por WhatsApp y formulario al mes", antes: PENDIENTE, despues: PENDIENTE, periodo: PENDIENTE },
      { metrica: "Posición en Google para \"diseño web Puerto Varas\"", antes: PENDIENTE, despues: PENDIENTE, periodo: PENDIENTE },
      { metrica: "PageSpeed móvil", antes: PENDIENTE, despues: PENDIENTE, periodo: PENDIENTE },
    ],
    imagen: "/assets/img/og-image.jpg",
    url: "https://www.solucionesdys.cl/",
    published: false,
  },
];

/** En producción solo los publicados; en desarrollo también los borradores. */
export const mostrarBorradores = process.env.NODE_ENV !== "production";

export function getCasosVisibles(): CasoExito[] {
  return CASOS.filter((c) => c.published || mostrarBorradores);
}

export function getCasoVisible(slug: string): CasoExito | undefined {
  return getCasosVisibles().find((c) => c.slug === slug);
}

/** Casos publicados con testimonio real (los únicos que pueden ir en JSON-LD de reseñas). */
export function getTestimoniosPublicados(): (CasoExito & { testimonio: Testimonio })[] {
  return CASOS.filter((c): c is CasoExito & { testimonio: Testimonio } => c.published && Boolean(c.testimonio));
}
