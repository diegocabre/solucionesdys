// Preguntas frecuentes del inicio. Se muestran en la página y se publican como
// datos estructurados FAQPage, así que las respuestas deben ser cortas y directas.

import { BUSINESS } from "@/lib/site";

export interface Faq {
  question: string;
  answer: string;
}

export const FAQS: Faq[] = [
  {
    question: "¿Dónde está ubicada Soluciones DyS y a qué zonas atienden?",
    answer:
      "Estamos en Puerto Varas, Región de Los Lagos. Atendemos a pymes y emprendedores de Puerto Varas, Llanquihue, Frutillar y Puerto Montt, y trabajamos de forma remota con clientes de todo Chile.",
  },
  {
    question: "¿Qué tipo de sitios web desarrollan?",
    answer:
      "Desarrollamos landing pages para campañas y captación de clientes, sitios corporativos multipágina y tiendas online con carrito de compras y pasarela de pagos.",
  },
  {
    question: "¿Por qué no usan plantillas?",
    answer:
      "Hacemos cada sitio a medida, sin plantillas. Así carga más rápido, es más seguro y es más fácil de posicionar en Google que un sitio armado sobre una plantilla.",
  },
  {
    question: "¿Mi sitio web va a aparecer en Google?",
    answer:
      "Todos nuestros sitios incluyen optimización SEO base: carga rápida, diseño adaptado a celulares, títulos y descripciones optimizadas y datos estructurados para que Google entienda tu negocio.",
  },
  {
    question: "¿Cómo es el proceso para crear mi sitio web?",
    answer:
      "Trabajamos en cuatro etapas: planificación de objetivos y mapa del sitio, diseño visual alineado a tu marca, desarrollo con optimización SEO y, finalmente, pruebas, conexión de tu dominio y publicación.",
  },
  {
    question: "¿Cómo puedo cotizar mi proyecto?",
    answer: `Puedes escribirnos desde el formulario de contacto, por WhatsApp al ${BUSINESS.phoneDisplay} o al correo ${BUSINESS.email}. Te respondemos con una propuesta según lo que necesita tu negocio.`,
  },
];
