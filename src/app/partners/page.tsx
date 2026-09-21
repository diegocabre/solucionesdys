"use client";

import { motion } from "framer-motion";
import { Globe, ArrowUpRight, Code, ShieldCheck, Sparkles, Smartphone } from "lucide-react";
import Button from "@/components/Button";
import Image from "next/image";
import Link from "next/link";

interface PartnerProject {
  id: number;
  name: string;
  category: string;
  description: string;
  url: string;
  /** Captura de la web (public/assets/img/partners), recortada a la parte superior. */
  image: string;
  tags: string[];
  gradient: string;
  features: string[];
}

const PARTNER_PROJECTS: PartnerProject[] = [
  {
    id: 1,
    name: "Rincón del Aromo",
    category: "Cowork, Cafetería & Talleres",
    description: "Un espacio inspirador y colaborativo en el sur de Chile. Sitio web corporativo completo con presentación de sus servicios de cafetería premium, arriendo de salas de reuniones, puestos de cowork y calendario de talleres dinámicos.",
    url: "https://www.rincondelaromo.com/home",
    image: "/assets/img/partners/rincon-del-aromo-web.jpg",
    tags: ["React", "Next.js", "TailwindCSS", "Framer Motion"],
    gradient: "from-[#aa7b49] via-[#bf915f] to-[#5c3e21]",
    features: ["Arriendo de Espacios", "Menú de Cafetería", "Calendario de Actividades"]
  },
  {
    id: 2,
    name: "Estribor Consultores",
    category: "Consultoría Estratégica & Asesorías",
    description: "Consultores de negocios de primer nivel. Plataforma corporativa diseñada con una estética limpia e institucional para la difusión de servicios de análisis financiero, gestión de riesgos y desarrollo de estrategias de crecimiento comercial.",
    url: "https://www.estriborconsultores.cl/",
    image: "/assets/img/partners/estribor-consultores-web.jpg",
    tags: ["Next.js", "React", "TailwindCSS", "TypeScript"],
    gradient: "from-[#0d2a45] via-[#1a3d60] to-[#081b2e]",
    features: ["Portafolio de Asesorías", "Formulario de Diagnóstico", "Optimización de Velocidad"]
  },
  {
    id: 3,
    name: "Dogtoralia Vet",
    category: "Veterinaria & Tienda Online",
    description: "Clínicas veterinarias con sedes en Puente Alto y Santiago Centro. Sitio web con sus servicios de atención veterinaria, tienda online de productos para el bienestar de las mascotas y contacto directo por WhatsApp.",
    url: "https://www.dogtoraliavet.cl/home",
    image: "/assets/img/partners/dogtoralia-vet-web.jpg",
    tags: ["React", "Next.js", "TailwindCSS"],
    gradient: "from-[#2793bb] via-[#2e8aa0] to-[#6ea34a]",
    features: ["Tienda Online de Productos", "Servicios Veterinarios", "Contacto por WhatsApp"]
  }
];

export default function PartnersPage() {
  return (
    <div className="min-h-screen py-16 bg-background relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-accent/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-10 right-1/4 w-[600px] h-[600px] bg-brand-green/5 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Encabezado */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-accent/10 border border-brand-accent/20"
          >
            <Sparkles className="w-4 h-4 text-brand-accent" />
            <span className="text-sm font-semibold tracking-wider text-brand-accent uppercase">
              Proyectos en el Mundo Digital
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-bold text-brand-primary"
          >
            Nuestros <span className="font-serif italic font-light text-brand-accent">Partners</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 font-light leading-relaxed"
          >
            Presentamos los sitios web que hemos diseñado y desarrollado para nuestros clientes y aliados. Proyectos activos, optimizados y listos para competir en internet.
          </motion.p>
        </div>

        {/* Grilla de Proyectos */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-24">
          {PARTNER_PROJECTS.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl border border-gray-100 dark:border-slate-800 transition-all flex flex-col group h-full"
            >
              {/* Cintillo de color con la captura del sitio en un marco de navegador */}
              <div className={`relative overflow-hidden bg-linear-to-br ${project.gradient} pt-6 px-6`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10" />

                <div className="relative z-10 rounded-t-xl overflow-hidden bg-white shadow-2xl shadow-black/30 ring-1 ring-black/10 transition-transform duration-500 group-hover:-translate-y-1">
                  <div className="flex items-center gap-3 bg-gray-100 px-3 py-2">
                    <div className="flex gap-1.5 shrink-0" aria-hidden="true">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                    </div>
                    <div className="flex items-center gap-1.5 min-w-0 grow rounded-md bg-white px-2 py-0.5 text-[10px] text-gray-500">
                      <Globe className="w-3 h-3 shrink-0" aria-hidden="true" />
                      <span className="truncate">{new URL(project.url).hostname.replace(/^www\./, "")}</span>
                    </div>
                  </div>
                  <div className="relative aspect-1200/550 bg-gray-50">
                    <Image
                      src={project.image}
                      alt={`Captura del sitio web de ${project.name}`}
                      fill
                      sizes="(max-width: 768px) 90vw, (max-width: 1280px) 45vw, 30vw"
                      className="object-cover object-top"
                    />
                  </div>
                </div>

                {/* Nombre y categoría sobre el color de la marca del cliente */}
                <div className="relative z-10 pt-5 pb-6">
                  <span className="text-xs font-semibold text-white/90 uppercase tracking-widest bg-white/15 px-3 py-1 rounded-full backdrop-blur-xs inline-block">
                    {project.category}
                  </span>
                  <h3 className="text-2xl font-bold text-white mt-3 font-serif">
                    {project.name}
                  </h3>
                </div>
              </div>

              {/* Contenido descriptivo */}
              <div className="p-8 flex flex-col justify-between grow space-y-6">
                <div className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                    {project.description}
                  </p>
                  
                  {/* Características */}
                  <ul className="space-y-2">
                    {project.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <ShieldCheck className="w-4 h-4 text-brand-green shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tags de Tecnologías */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {project.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="text-xs bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-md font-medium border border-gray-200/50 dark:border-slate-700/50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Enlace de visita */}
                <div className="pt-4 border-t border-gray-100 dark:border-slate-800">
                  <a 
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-brand-primary dark:text-brand-accent hover:text-brand-accent-dark transition-colors group/link"
                  >
                    <span>Visitar sitio web en vivo</span>
                    <ArrowUpRight className="w-4 h-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Banner de Alianza */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-[#182838] rounded-3xl p-8 sm:p-16 text-center text-white relative overflow-hidden shadow-2xl"
        >
          {/* Background shapes */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-green/10 rounded-full blur-3xl" />
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 p-2 bg-white/10 rounded-xl backdrop-blur-xs">
              <Code className="w-5 h-5 text-brand-accent-light" />
              <Smartphone className="w-5 h-5 text-brand-accent-light" />
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold font-serif leading-tight">
              ¿Listo para dar el salto digital?
            </h2>
            <p className="text-lg text-gray-300 font-light leading-relaxed">
              Desarrollamos tu sitio corporativo, catálogo con base de datos, o tienda online a la medida con integraciones estables y diseño de vanguardia.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contacto">
                <Button size="lg" className="w-full sm:w-auto bg-brand-accent! hover:bg-brand-accent-dark! text-white! border-brand-accent!">
                  Cotizar mi Sitio Web
                </Button>
              </Link>
              <Link href="/contacto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/40 hover:bg-white/10 text-white!">
                  Convertirme en Partner
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
