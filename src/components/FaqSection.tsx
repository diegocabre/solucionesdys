import { ChevronDown } from 'lucide-react';
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
    <section id="preguntas-frecuentes" className="py-24 bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {/* Dos columnas: el título queda fijo a la izquierda mientras se recorren las preguntas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-12 items-start">
        <h2 className="text-4xl font-bold text-brand-primary dark:text-white lg:sticky lg:top-28">
          Desarrollo web en Puerto Varas: lo que más nos preguntan
        </h2>

        <div className="space-y-4">
          {FAQS.map((faq) => (
            <details
              key={faq.question}
              className="group bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-6 open:shadow-md transition-shadow"
            >
              <summary className="flex items-center justify-between gap-4 cursor-pointer list-none font-semibold text-brand-primary dark:text-slate-100">
                <h3 className="text-base sm:text-lg">{faq.question}</h3>
                <ChevronDown className="w-5 h-5 shrink-0 text-brand-accent-dark transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-4 text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
