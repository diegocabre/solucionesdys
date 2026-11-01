import { Plus } from 'lucide-react';
import JsonLd from '@/components/JsonLd';
import { FAQS } from '@/lib/faq';

export default function FaqSection() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };

  return (
    <section id="preguntas-frecuentes" className="py-24 bg-dys-bg">
      <JsonLd data={faqSchema} />
      {/* Dos columnas: el título queda fijo a la izquierda mientras se recorren las preguntas.
          Lista con divisores, igual que servicios: sin cajas repetidas. */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-12 items-start">
        <h2 className="text-titular-2 font-bold text-dys-text lg:sticky lg:top-28">
          Desarrollo web en Puerto Varas: lo que más nos preguntan
        </h2>

        <div className="border-t border-dys-border">
          {FAQS.map((faq) => (
            <details key={faq.question} className="group border-b border-dys-border">
              <summary className="flex items-center justify-between gap-6 cursor-pointer list-none py-6 text-dys-text hover:text-dys-primary [&::-webkit-details-marker]:hidden">
                <h3 className="text-lg sm:text-xl font-semibold">{faq.question}</h3>
                <Plus
                  className="w-6 h-6 shrink-0 transition-transform group-open:rotate-45 motion-reduce:transition-none"
                  aria-hidden="true"
                />
              </summary>
              <p className="-mt-2 pb-6 max-w-[65ch] text-dys-muted leading-relaxed">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
