import Image from 'next/image';
import Link from 'next/link';
import { PARTNER_PROJECTS } from '@/lib/partners';

// Partner destacado en el inicio como caso de éxito.
const FEATURED_PARTNER = 'Estribor Consultores';

export default function FeaturedCase() {
  const project = PARTNER_PROJECTS.find((p) => p.name === FEATURED_PARTNER);
  if (!project) return null;

  return (
    <section id="caso-de-exito" aria-labelledby="caso-titulo" className="dys-light py-24 bg-dys-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-12 items-center">
        <div className="space-y-6">
          <h2 id="caso-titulo" className="text-titular-2 font-bold text-dys-text">
            Caso de éxito: {project.name}
          </h2>
          <p className="text-dys-muted leading-relaxed">{project.description}</p>

          <div>
            <h3 className="text-base font-semibold text-dys-text">Qué incluye el sitio</h3>
            <ul className="mt-3 border-t border-dys-border">
              {project.features.map((feature) => (
                <li key={feature} className="border-b border-dys-border py-3 text-dys-text">
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-3 pt-2">
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-dys-text underline decoration-dys-link decoration-2 underline-offset-4 hover:text-dys-link transition-colors"
            >
              Visitar el sitio de {project.name}
              <span className="sr-only"> (abre en una pestaña nueva)</span>
            </a>
            <Link
              href="/partners"
              className="font-semibold text-dys-muted underline underline-offset-4 hover:text-dys-text transition-colors"
            >
              Ver todos los proyectos
            </Link>
          </div>
        </div>

        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={-1}
          aria-hidden="true"
          className="block relative aspect-[24/11] rounded-xl overflow-hidden border border-dys-border"
        >
          <Image
            src={project.image}
            alt=""
            fill
            sizes="(min-width: 1280px) 720px, (min-width: 1024px) 58vw, 100vw"
            className="object-cover object-top"
          />
        </a>
      </div>
    </section>
  );
}
