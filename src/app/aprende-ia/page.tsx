import type { Metadata } from "next";
import Link from "next/link";
import { Bot, Newspaper, Terminal } from "lucide-react";
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
    images: [{ url: "/assets/img/og-image.jpg", width: 1200, height: 630, alt: "Soluciones DyS" }],
  },
};

export default function AprendeIaPage() {
  return (
    <div className="bg-background relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-brand-accent/5 rounded-full blur-3xl -z-10" />
      <div className="absolute top-[900px] left-0 w-[600px] h-[600px] bg-brand-green/5 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado + robot */}
        <section className="grid gap-12 py-16 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-accent/10 border border-brand-accent/20">
              <Bot className="w-4 h-4 text-brand-accent" aria-hidden="true" />
              <span className="text-sm font-semibold tracking-wider text-brand-accent uppercase">
                Aprende IA
              </span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold text-brand-primary leading-tight">
              La inteligencia artificial,{" "}
              <span className="font-serif italic font-light text-brand-accent">sin complicaciones</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 font-light leading-relaxed">
              Qué es, cómo evoluciona y cómo usarla en serio. Conversa con DyBot, mira a Claude Code trabajar y
              descubre qué puede hacer por tu negocio.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="#panorama"
                className="inline-flex items-center gap-2 rounded-md bg-brand-primary px-5 py-2.5 font-medium text-white hover:bg-brand-primary/90 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
              >
                <Newspaper className="w-4 h-4" aria-hidden="true" />
                La IA hoy
              </a>
              <a
                href="#claude-code"
                className="inline-flex items-center gap-2 rounded-md border-2 border-brand-accent px-5 py-2 font-medium text-brand-accent-dark hover:bg-brand-accent hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
              >
                <Terminal className="w-4 h-4" aria-hidden="true" />
                Claude Code
              </a>
            </div>
          </div>

          <RobotGuide />
        </section>

        {/* Noticias en vivo + conceptos clave */}
        <section id="panorama" className="scroll-mt-28 py-16 space-y-16">
          <div className="space-y-10">
            <div className="max-w-3xl space-y-3">
              <h2 className="text-3xl sm:text-4xl font-bold text-brand-primary">
                La IA <span className="font-serif italic font-light text-brand-accent">hoy</span>
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Lo último que publican las fuentes oficiales: Anthropic, OpenAI, Google y MIT Technology Review.
                Se actualiza solo, cada hora.
              </p>
            </div>
            <NoticiasIA />
          </div>

          <div className="space-y-10">
            <div className="max-w-3xl space-y-3">
              <h3 className="text-2xl sm:text-3xl font-bold text-brand-primary">
                Conceptos <span className="font-serif italic font-light text-brand-accent">clave</span>
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Lo que conviene entender detrás de los titulares. Revisado en {IA_REVISADO}; donde hay fuente
                oficial, la enlazamos.
              </p>
            </div>
            <IaNovedades />
          </div>
        </section>

        {/* Claude Code */}
        <section id="claude-code" className="scroll-mt-28 py-16 space-y-12">
          <div className="max-w-3xl space-y-3">
            <h2 className="text-3xl sm:text-4xl font-bold text-brand-primary">
              Claude <span className="font-serif italic font-light text-brand-accent">Code</span>
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Es el asistente de programación de Anthropic y la herramienta que más usamos en Soluciones DyS.
              Lee tu código, edita archivos, ejecuta comandos y se integra con tus herramientas de trabajo.
            </p>
          </div>
          <ClaudeCodeShowcase />
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="relative overflow-hidden rounded-3xl bg-brand-primary p-8 sm:p-16 text-center text-white shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-brand-accent/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-green/10 rounded-full blur-3xl" />
            <div className="relative z-10 mx-auto max-w-2xl space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold font-serif leading-tight">
                ¿Quieres llevar esto a tu negocio?
              </h2>
              <p className="text-lg text-gray-300 font-light leading-relaxed">
                Construimos sitios web y soluciones digitales a medida usando estas mismas herramientas.
                Cuéntanos qué necesitas.
              </p>
              <Link
                href="/contacto"
                className="inline-flex h-11 items-center justify-center rounded-md bg-brand-accent px-8 text-lg font-medium text-white hover:bg-brand-accent-dark transition-colors focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
              >
                Hablemos
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
