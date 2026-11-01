'use client';

import { useState } from 'react';
import Image from 'next/image';
import { PARTNER_PROJECTS, type PartnerProject } from '@/lib/partners';

/** Captura del sitio con su dominio debajo: sin marco de navegador falso ni brillos de color. */
function Captura({ project, priority = false }: { project: PartnerProject; priority?: boolean }) {
  return (
    <figure>
      <div className="relative aspect-[24/11] overflow-hidden rounded-xl border border-dys-border">
        <Image
          src={project.image}
          alt={`Captura del sitio web de ${project.name}`}
          fill
          sizes="(max-width: 1024px) 92vw, 45vw"
          priority={priority}
          className="object-cover object-top"
        />
      </div>
      <figcaption className="mt-2 text-sm text-dys-muted">
        {new URL(project.url).hostname.replace(/^www\./, '')}
      </figcaption>
    </figure>
  );
}

/** Descripción, lo que hace el sitio (features) y enlace al proyecto activo. */
function ProjectDetails({ project }: { project: PartnerProject }) {
  return (
    <div className="space-y-5">
      <p className="text-base leading-relaxed text-dys-muted">{project.description}</p>

      <ul className="border-t border-dys-border">
        {project.features.map((feature) => (
          <li key={feature} className="border-b border-dys-border py-3 text-dys-text">
            {feature}
          </li>
        ))}
      </ul>

      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block font-semibold text-dys-text underline decoration-dys-link decoration-2 underline-offset-4 hover:text-dys-link"
      >
        Visitar el sitio de {project.name}
        <span className="sr-only"> (abre en una pestaña nueva)</span>
      </a>
    </div>
  );
}

export default function PartnersShowcase() {
  const [activeId, setActiveId] = useState(PARTNER_PROJECTS[0].id);
  const active = PARTNER_PROJECTS.find((p) => p.id === activeId) ?? PARTNER_PROJECTS[0];

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-x-14">
      {/* Lista de partners: al pasar o enfocar, el panel de la derecha muestra ese proyecto */}
      <div className="lg:col-span-5">
        <ul>
          {PARTNER_PROJECTS.map((project) => {
            const isActive = project.id === activeId;
            return (
              <li key={project.id} className="border-b border-dys-border first:border-t">
                <button
                  type="button"
                  onMouseEnter={() => setActiveId(project.id)}
                  onFocus={() => setActiveId(project.id)}
                  onClick={() => setActiveId(project.id)}
                  aria-expanded={isActive}
                  className="group block w-full py-6 text-left"
                >
                  <span
                    className={`block font-display font-semibold text-2xl transition-colors sm:text-4xl ${
                      isActive ? 'text-dys-text' : 'text-dys-muted group-hover:text-dys-text'
                    }`}
                  >
                    {project.name}
                  </span>
                  <span className="mt-1 block text-sm text-dys-muted">{project.category}</span>
                </button>

                {/* Vista previa en línea (móvil / tablet, sin panel fijo) */}
                {isActive && (
                  <div className="space-y-6 pb-8 lg:hidden">
                    {/* El primer proyecto viene abierto: su captura es el LCP en móvil. */}
                    <Captura project={project} priority={project.id === PARTNER_PROJECTS[0].id} />
                    <ProjectDetails project={project} />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Panel fijo con la vista previa (escritorio) */}
      <div className="hidden lg:col-span-7 lg:block">
        <div className="sticky top-28 space-y-8">
          <Captura project={active} />
          <ProjectDetails project={active} />
        </div>
      </div>
    </div>
  );
}
