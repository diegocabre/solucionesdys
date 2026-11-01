import type { Metadata } from "next";
import Button from "@/components/Button";
import RobotGuide from "@/components/RobotGuide";
import IaNovedades from "@/components/IaNovedades";
import NoticiasIA from "@/components/NoticiasIA";
import ClaudeCodeShowcase from "@/components/ClaudeCodeShowcase";
import { IA_REVISADO } from "@/lib/ia-content";

export const metadata: Metadata = {
  title: "Aprende de Inteligencia Artificial y Claude Code",
  description:
    "Aprende qué es la IA, cómo funcionan los agentes y cómo trabaja Claude Code, con ejemplos interactivos y un robot que te lo explica. Por Soluciones DyS, Puerto Varas.",
  alternates: { canonical: "/aprende-ia" },
  openGraph: {
    title: "Aprende de IA y Claude Code | Soluciones DyS",
    description: "La IA explicada sin tecnicismos, con ejemplos interactivos y un robot guía.",
    url: "/aprende-ia",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Soluciones DyS" }],
  },
};

export default function AprendeIaPage() {
  return (
    <div className="bg-dys-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado + robot */}
        <section className="grid gap-12 pt-16 pb-16 sm:pt-24 lg:grid-cols-2 lg:items-center">
          <div className="space-y-8">
            <h1 className="firma-punto text-titular-1 font-bold text-dys-text">
              La inteligencia artificial, sin complicaciones
            </h1>
            <p className="max-w-[52ch] text-lg sm:text-xl text-dys-muted leading-relaxed">
              Qué es, cómo evoluciona y cómo usarla en serio. Conversa con DyBot, mira a Claude Code trabajar y
              descubre qué puede hacer por tu negocio.
            </p>
            <nav aria-label="En esta página" className="flex flex-wrap gap-x-6 gap-y-2">
              <a href="#panorama" className="font-semibold text-dys-link underline underline-offset-4 hover:text-dys-text">
                La IA hoy
              </a>
              <a href="#claude-code" className="font-semibold text-dys-link underline underline-offset-4 hover:text-dys-text">
                Claude Code
              </a>
            </nav>
          </div>

          <RobotGuide />
        </section>

        {/* Noticias en vivo + conceptos clave */}
        <section id="panorama" className="scroll-mt-28 py-16 space-y-20 border-t border-dys-border">
          <div className="space-y-10">
            <div className="max-w-3xl space-y-4">
              <h2 className="text-titular-2 font-bold text-dys-text">La IA hoy</h2>
              <p className="text-lg text-dys-muted leading-relaxed">
                Lo último que publican las fuentes oficiales: Anthropic, OpenAI, Google y MIT Technology Review.
                Se actualiza solo, cada hora.
              </p>
            </div>
            <NoticiasIA />
          </div>

          <div className="space-y-10">
            <div className="max-w-3xl space-y-4">
              <h3 className="text-titular-2 font-bold text-dys-text">Conceptos clave</h3>
              <p className="text-lg text-dys-muted leading-relaxed">
                Lo que conviene entender detrás de los titulares. Revisado en {IA_REVISADO}; donde hay fuente
                oficial, la enlazamos.
              </p>
            </div>
            <IaNovedades />
          </div>
        </section>

        {/* Claude Code */}
        <section id="claude-code" className="scroll-mt-28 py-16 space-y-12 border-t border-dys-border">
          <div className="max-w-3xl space-y-4">
            <h2 className="text-titular-2 font-bold text-dys-text">Claude Code</h2>
            <p className="text-lg text-dys-muted leading-relaxed">
              Es el asistente de programación de Anthropic y la herramienta que más usamos en Soluciones DyS.
              Lee tu código, edita archivos, ejecuta comandos y se integra con tus herramientas de trabajo.
            </p>
          </div>
          <ClaudeCodeShowcase />
        </section>
      </div>

      {/* Cierre en franja marfil, como en el resto del sitio */}
      <section aria-labelledby="aprende-cierre" className="dys-light bg-dys-bg py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[7fr_5fr] gap-10 items-end">
          <div className="space-y-6">
            <h2 id="aprende-cierre" className="max-w-2xl text-titular-2 font-bold text-dys-text">
              ¿Quieres llevar esto a tu negocio?
            </h2>
            <p className="max-w-2xl text-lg text-dys-muted leading-relaxed">
              Construimos sitios web y soluciones digitales a medida usando estas mismas herramientas. Cuéntanos qué
              necesitas.
            </p>
          </div>
          <div className="lg:flex lg:justify-end">
            <Button size="lg" href="/contacto">
              Cotizar mi sitio
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
