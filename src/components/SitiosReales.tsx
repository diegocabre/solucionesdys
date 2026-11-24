'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { PARTNER_PROJECTS } from '@/lib/partners';

// Los sitios reales se recorren de arriba abajo dentro de su marco 24:11:
// con el cursor o el foco en escritorio; en pantallas táctiles, el que queda a la vista
// después de que la persona desliza la fila. Nunca se mueve solo al cargar.
export default function SitiosReales() {
  const lista = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const ul = lista.current;
    if (!ul || !window.matchMedia('(hover: none)').matches) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) e.target.classList.toggle('recorriendo', e.intersectionRatio >= 0.9);
      },
      { root: ul, threshold: [0, 0.9] },
    );
    // Solo después del primer deslizamiento: el movimiento responde a la persona.
    const empezar = () => ul.querySelectorAll('li').forEach((li) => io.observe(li));
    ul.addEventListener('scroll', empezar, { once: true, passive: true });
    return () => {
      ul.removeEventListener('scroll', empezar);
      io.disconnect();
    };
  }, []);

  return (
    <ul
      ref={lista}
      className="mt-10 -mx-4 px-4 sm:mx-0 sm:px-0 flex lg:grid lg:grid-cols-2 gap-6 lg:gap-x-10 lg:gap-y-12 overflow-x-auto lg:overflow-visible snap-x snap-mandatory scroll-px-4 sm:scroll-px-0 pb-2"
    >
      {PARTNER_PROJECTS.map((project) => (
        <li key={project.id} className="snap-start shrink-0 w-[82%] sm:w-[60%] lg:w-auto">
          <a href={project.url} target="_blank" rel="noopener noreferrer" className="group relative block focus-visible:outline-none">
            <div className="sitio-marco relative aspect-[24/11] overflow-hidden rounded-xl border border-dys-border group-focus-visible:ring-2 group-focus-visible:ring-dys-primary group-focus-visible:ring-offset-2">
              <Image
                src={project.pagina.src}
                alt={`Sitio web de ${project.name}, desarrollado por Soluciones DyS`}
                width={1200}
                height={project.pagina.alto}
                sizes="(min-width: 1280px) 590px, (min-width: 1024px) 46vw, 82vw"
                className="sitio-pagina block w-full h-auto"
              />
            </div>
            <span className="mt-4 block font-display text-xl sm:text-2xl font-semibold text-dys-text underline-offset-4 decoration-2 group-hover:underline group-hover:decoration-dys-primary">
              {project.name}
            </span>
            <span className="mt-1 block text-sm text-dys-muted">{project.summary}</span>
            <span className="sr-only">(abre en una pestaña nueva)</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
