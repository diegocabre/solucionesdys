import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { PARTNER_PROJECTS } from '@/lib/partners';

// Partner destacado en el inicio como caso de éxito.
const FEATURED_PARTNER = 'Estribor Consultores';

export default function FeaturedCase() {
  const project = PARTNER_PROJECTS.find((p) => p.name === FEATURED_PARTNER);
  if (!project) return null;

  return (
    <section id="caso-de-exito" className="py-24 bg-dys-surface border-b border-dys-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-4xl font-bold text-dys-text">
            Caso de éxito: {project.name}
          </h2>
          <p className="text-sm font-semibold text-dys-primary uppercase tracking-wider">
            {project.category}
          </p>
          <p className="text-dys-muted font-light leading-relaxed">
            {project.description}
          </p>
          <ul className="space-y-2">
            {project.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-dys-text">
                <CheckCircle2 className="w-5 h-5 text-dys-primary shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-6 pt-2">
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-dys-text underline decoration-dys-link underline-offset-4 hover:text-dys-link transition-colors"
            >
              Visitar el sitio <ArrowUpRight className="w-4 h-4" />
            </a>
            <Link
              href="/partners"
              className="font-semibold text-dys-muted hover:text-dys-text transition-colors"
            >
              Ver todos los proyectos →
            </Link>
          </div>
        </div>

        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block relative aspect-[24/11] rounded-3xl overflow-hidden shadow-2xl border border-dys-border/40"
        >
          <Image
            src={project.image}
            alt={`Sitio web de ${project.name} desarrollado por Soluciones DyS`}
            fill
            sizes="(min-width: 1280px) 720px, (min-width: 1024px) 58vw, 100vw"
            className="object-cover object-top hover:scale-105 transition-transform duration-500"
          />
        </a>
      </div>
    </section>
  );
}
