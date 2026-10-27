'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ArrowUpRight, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { PARTNER_PROJECTS, type PartnerProject } from '@/lib/partners';

/** Marco tipo navegador con la captura del sitio, coloreado con la marca del cliente. */
function BrowserFrame({ project }: { project: PartnerProject }) {
  return (
    <div className={`relative rounded-2xl bg-linear-to-br ${project.gradient} p-1.5 shadow-2xl shadow-dys-bg/10`}>
      <div className="overflow-hidden rounded-xl bg-dys-surface border border-dys-border">
        <div className="flex items-center gap-3 bg-dys-surface px-3 py-2">
          <div className="flex shrink-0 gap-1.5" aria-hidden="true">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-dys-accent/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-dys-primary/80" />
          </div>
          <div className="flex min-w-0 grow items-center gap-1.5 rounded-md bg-dys-surface px-2 py-0.5 text-[11px] text-dys-muted ring-1 ring-dys-border">
            <Globe className="h-3 w-3 shrink-0" aria-hidden="true" />
            <span className="truncate">{new URL(project.url).hostname.replace(/^www\./, "")}</span>
          </div>
        </div>
        <div className="relative aspect-[24/11] bg-dys-surface">
          <Image
            src={project.image}
            alt={`Captura del sitio web de ${project.name}`}
            fill
            sizes="(max-width: 1024px) 92vw, 45vw"
            className="object-cover object-top"
          />
        </div>
      </div>
    </div>
  );
}

/** Descripción, lo que hace el sitio (features) y CTA del proyecto activo. */
function ProjectDetails({ project }: { project: PartnerProject }) {
  return (
    <div className="space-y-5">
      <p className="text-base leading-relaxed text-dys-muted">{project.description}</p>

      <ul className="grid gap-2 sm:grid-cols-2">
        {project.features.map((feature) => (
          <li key={feature} className="flex items-center gap-2 text-sm text-dys-muted">
            <ShieldCheck className="h-4 w-4 shrink-0 text-dys-primary" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-center gap-2 text-sm font-semibold text-dys-text transition-colors hover:text-dys-primary"
      >
        <span>Visitar sitio web en vivo</span>
        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </a>
    </div>
  );
}

export default function PartnersShowcase() {
  const [activeId, setActiveId] = useState(PARTNER_PROJECTS[0].id);
  const active = PARTNER_PROJECTS.find((p) => p.id === activeId) ?? PARTNER_PROJECTS[0];

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-x-14">
      {/* Lista interactiva de partners */}
      <div className="lg:col-span-5">
        <ul>
          {PARTNER_PROJECTS.map((project, idx) => {
            const isActive = project.id === activeId;
            return (
              <li key={project.id} className="border-b border-dys-border first:border-t">
                <button
                  type="button"
                  onMouseEnter={() => setActiveId(project.id)}
                  onFocus={() => setActiveId(project.id)}
                  onClick={() => setActiveId(project.id)}
                  aria-expanded={isActive}
                  className="group flex w-full items-center gap-4 py-6 text-left sm:gap-6"
                >
                  <span
                    className={`font-mono text-sm transition-colors ${
                      isActive ? 'text-dys-primary' : 'text-dys-muted'
                    }`}
                  >
                    {String(idx + 1).padStart(2, '0')}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span
                      className={`block font-display font-semibold text-2xl transition-colors sm:text-4xl ${
                        isActive ? 'text-dys-text' : 'text-dys-muted group-hover:text-dys-text'
                      }`}
                    >
                      {project.name}
                    </span>
                    <span
                      className={`mt-1 block text-xs uppercase tracking-widest transition-colors ${
                        isActive ? 'text-dys-primary' : 'text-dys-muted'
                      }`}
                    >
                      {project.category}
                    </span>
                  </span>

                  <ArrowUpRight
                    className={`h-5 w-5 shrink-0 transition-all ${
                      isActive
                        ? 'rotate-0 text-dys-primary opacity-100'
                        : '-rotate-45 text-dys-muted opacity-0 group-hover:opacity-100'
                    }`}
                  />
                </button>

                {/* Vista previa en línea (móvil / tablet, sin panel fijo) */}
                <div className="lg:hidden">
                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-6 pb-8">
                          <BrowserFrame project={project} />
                          <ProjectDetails project={project} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Panel fijo con la vista previa (escritorio) */}
      <div className="relative hidden lg:col-span-7 lg:block">
        <div className="sticky top-28">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={`glow-${active.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.18 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className={`absolute -inset-x-10 -inset-y-10 -z-10 rounded-[3rem] bg-linear-to-br ${active.gradient} blur-3xl`}
              aria-hidden="true"
            />
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="space-y-8"
            >
              <BrowserFrame project={active} />
              <ProjectDetails project={active} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
