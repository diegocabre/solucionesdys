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
  /** Imagen vertical para el carrusel del inicio; si falta se usa `image`. */
  cover?: string;
  tags: string[];
  gradient: string;
  features: string[];
}

export const PARTNER_PROJECTS: PartnerProject[] = [
  {
    id: 1,
    name: "Rincón del Aromo",
    category: "Cowork, Cafetería & Talleres",
    description: "Un espacio inspirador y colaborativo en el sur de Chile. Sitio web corporativo completo con presentación de sus servicios de cafetería premium, arriendo de salas de reuniones, puestos de cowork y calendario de talleres dinámicos.",
    summary: "Sitio web real para un cowork, cafetería y espacio de talleres en Puerto Varas.",
    url: "https://www.rincondelaromo.com/home",
    image: "/assets/img/partners/rincon-del-aromo-web.jpg",
    cover: "/assets/img/partners/rincon-del-aromo.jpg",
    tags: ["React", "Next.js", "TailwindCSS", "Framer Motion"],
    gradient: "from-[#aa7b49] via-[#bf915f] to-[#5c3e21]",
    features: ["Arriendo de Espacios", "Menú de Cafetería", "Calendario de Actividades"]
  },
  {
    id: 2,
    name: "Estribor Consultores",
    category: "Consultoría Estratégica & Asesorías",
    description: "Consultores de negocios de primer nivel. Plataforma corporativa diseñada con una estética limpia e institucional para la difusión de servicios de análisis financiero, gestión de riesgos y desarrollo de estrategias de crecimiento comercial.",
    summary: "Plataforma corporativa real para una consultora de estrategia y gestión.",
    url: "https://www.estriborconsultores.cl/",
    image: "/assets/img/partners/estribor-consultores-web.jpg",
    cover: "/assets/img/partners/estribor-consultores.jpg",
    tags: ["Next.js", "React", "TailwindCSS", "TypeScript"],
    gradient: "from-[#0d2a45] via-[#1a3d60] to-[#081b2e]",
    features: ["Portafolio de Asesorías", "Formulario de Diagnóstico", "Optimización de Velocidad"]
  },
  {
    id: 3,
    name: "Dogtoralia Vet",
    category: "Veterinaria & Tienda Online",
    description: "Clínicas veterinarias con sedes en Puente Alto y Santiago Centro. Sitio web con sus servicios de atención veterinaria, tienda online de productos para el bienestar de las mascotas y contacto directo por WhatsApp.",
    summary: "Sitio web real para clínicas veterinarias con tienda online en Puente Alto y Santiago Centro.",
    url: "https://www.dogtoraliavet.cl/home",
    image: "/assets/img/partners/dogtoralia-vet-web.jpg",
    tags: ["React", "Next.js", "TailwindCSS"],
    gradient: "from-[#2793bb] via-[#2e8aa0] to-[#6ea34a]",
    features: ["Tienda Online de Productos", "Servicios Veterinarios", "Contacto por WhatsApp"]
  }
];
