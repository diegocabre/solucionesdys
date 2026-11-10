// Fuente única de los partners: la página /partners y el carrusel del inicio
// leen de aquí, así que agregar un partner en esta lista lo muestra en ambos.

export interface PartnerProject {
  id: number;
  name: string;
  category: string;
  /** Descripción larga para la tarjeta de /partners. */
  description: string;
  /** Descripción corta para el carrusel del inicio. */
  summary: string;
  url: string;
  /** Captura de la web (public/assets/img/partners), recortada a la parte superior. */
  image: string;
  tags: string[];
  gradient: string;
  features: string[];
}

export const PARTNER_PROJECTS: PartnerProject[] = [
  {
    id: 1,
    name: "Rincón del Aromo",
    category: "Cowork, cafetería y talleres",
    description: "Un espacio inspirador y colaborativo en el sur de Chile. Sitio web corporativo completo con presentación de sus servicios de cafetería premium, arriendo de salas de reuniones, puestos de cowork y calendario de talleres dinámicos.",
    summary: "Sitio web real para un cowork, cafetería y espacio de talleres en Puerto Varas.",
    url: "https://www.rincondelaromo.com/home",
    image: "/assets/img/partners/rincon-del-aromo-web.jpg",
    tags: ["React", "Next.js", "TailwindCSS", "Framer Motion"],
    gradient: "from-[#aa7b49] via-[#bf915f] to-[#5c3e21]",
    features: ["Arriendo de espacios", "Menú de cafetería", "Calendario de actividades"]
  },
  {
    id: 2,
    name: "Estribor Consultores",
    category: "Consultoría en seguridad, personas y sostenibilidad",
    description: "Consultora boutique de Puerto Varas que asesora a empresas de acuicultura, construcción, energía e industria en gestión de personas, seguridad laboral, sostenibilidad y comunicaciones. Sitio corporativo con sus servicios por sector, recursos, portal de empleo y agenda de reuniones.",
    summary: "Sitio corporativo real para una consultora de seguridad laboral, personas y sostenibilidad.",
    url: "https://www.estriborconsultores.cl/",
    image: "/assets/img/partners/estribor-consultores-web.jpg",
    tags: ["Next.js", "React", "TailwindCSS", "TypeScript"],
    gradient: "from-[#0d2a45] via-[#1a3d60] to-[#081b2e]",
    features: ["Servicios por sector", "Portal de empleo", "Agenda de reuniones"]
  },
  {
    id: 3,
    name: "Dogtoralia Vet",
    category: "Veterinaria y tienda online",
    description: "Clínicas veterinarias con sedes en Puente Alto y Santiago Centro. Sitio web con sus servicios de atención veterinaria, tienda online de productos para el bienestar de las mascotas y contacto directo por WhatsApp.",
    summary: "Sitio web real para clínicas veterinarias con tienda online en Puente Alto y Santiago Centro.",
    url: "https://www.dogtoraliavet.cl/home",
    image: "/assets/img/partners/dogtoralia-vet-web.jpg",
    tags: ["React", "Next.js", "TailwindCSS"],
    gradient: "from-[#2793bb] via-[#2e8aa0] to-[#6ea34a]",
    features: ["Tienda online de productos", "Servicios veterinarios", "Contacto por WhatsApp"]
  },
  {
    id: 4,
    name: "Caroline Magic",
    category: "Tarot evolutivo y arte místico",
    description: "Espacio sagrado y contemporáneo de tarot evolutivo guiado por Caroline. Sitio con oráculo interactivo del día, agenda de lecturas y talleres grupales, y una identidad visual mística que conecta arte, energía y transformación personal.",
    summary: "Sitio web real de tarot evolutivo, talleres y arte místico con oráculo interactivo.",
    url: "https://www.carolinemagic.cl/",
    image: "/assets/img/partners/caroline-magic-web.jpg",
    tags: ["Next.js", "React", "TailwindCSS", "Framer Motion"],
    gradient: "from-[#7b3f61] via-[#a4487a] to-[#2e1a3d]",
    features: ["Oráculo interactivo del día", "Agenda de lecturas de tarot", "Talleres y rituales grupales"]
  }
];
