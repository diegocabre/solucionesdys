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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-4">
          <span className="text-xs font-semibold tracking-widest text-brand-green uppercase bg-brand-green/10 px-3 py-1 rounded-full">
            Preguntas Frecuentes
          </span>
          <h2 className="text-4xl font-bold text-brand-primary dark:text-white">
            Desarrollo web en Puerto Varas: lo que más nos preguntan
          </h2>
        </div>

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
