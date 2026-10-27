import { ChevronDown } from 'lucide-react';
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
      {/* Dos columnas: el título queda fijo a la izquierda mientras se recorren las preguntas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-12 items-start">
        <h2 className="text-4xl font-bold text-dys-text lg:sticky lg:top-28">
          Desarrollo web en Puerto Varas: lo que más nos preguntan
        </h2>

        <div className="space-y-4">
          {FAQS.map((faq) => (
            <details
              key={faq.question}
              className="group bg-dys-surface rounded-2xl border border-dys-border p-6 open:shadow-md transition-shadow"
            >
              <summary className="flex items-center justify-between gap-4 cursor-pointer list-none font-semibold text-dys-text">
                <h3 className="text-base sm:text-lg">{faq.question}</h3>
                <ChevronDown className="w-5 h-5 shrink-0 text-dys-primary transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-4 text-dys-muted font-light leading-relaxed">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
