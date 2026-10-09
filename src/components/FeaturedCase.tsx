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
    <section id="caso-de-exito" className="py-24 bg-white dark:bg-slate-950 border-b border-gray-100 dark:border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-4xl font-bold text-brand-primary dark:text-white">
            Caso de éxito: {project.name}
          </h2>
          <p className="text-sm font-semibold text-brand-accent-dark uppercase tracking-wider">
            {project.category}
          </p>
          <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed">
            {project.description}
          </p>
          <ul className="space-y-2">
            {project.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-gray-700 dark:text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-brand-accent-dark shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-6 pt-2">
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-brand-primary dark:text-white underline decoration-brand-accent underline-offset-4 hover:text-brand-accent-dark transition-colors"
            >
              Visitar el sitio <ArrowUpRight className="w-4 h-4" />
            </a>
            <Link
              href="/partners"
              className="font-semibold text-gray-500 hover:text-brand-primary dark:hover:text-white transition-colors"
            >
              Ver todos los proyectos →
            </Link>
          </div>
        </div>

        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block relative aspect-[24/11] rounded-3xl overflow-hidden shadow-2xl border border-gray-200/40 dark:border-slate-800"
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
