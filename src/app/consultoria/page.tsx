import { Briefcase, Users, Target, ShieldCheck } from 'lucide-react';
import Button from '@/components/Button';
import Link from 'next/link';

export default function ConsultoriaPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 pt-12 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-6xl font-bold text-brand-primary mb-6 flex justify-center items-center gap-4">
              <Briefcase className="w-12 h-12 text-brand-accent hidden sm:block" />
              Consultoría y Partners
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              Trabajamos junto a empresas partners especializadas para brindarte asesoramiento profesional y estratégico que impulse el crecimiento de tus proyectos y negocios.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl text-center border border-gray-100 dark:border-gray-700 shadow-sm grow-0 transition-transform hover:-translate-y-2">
              <Users className="w-10 h-10 text-brand-accent mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Red de Aliados</h3>
              <p className="text-gray-500">Conectamos tu negocio con profesionales y empresas verificadas.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl text-center border border-gray-100 dark:border-gray-700 shadow-sm grow-0 transition-transform hover:-translate-y-2">
              <Target className="w-10 h-10 text-brand-accent mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Enfoque a Resultados</h3>
              <p className="text-gray-500">Estrategias claras y medibles para optimizar procesos comerciales.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl text-center border border-gray-100 dark:border-gray-700 shadow-sm grow-0 transition-transform hover:-translate-y-2">
              <ShieldCheck className="w-10 h-10 text-brand-accent mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Soporte Continuo</h3>
              <p className="text-gray-500">Acompañamiento a largo plazo durante todo el ciclo del proyecto.</p>
            </div>
          </div>

          <div className="bg-brand-primary rounded-3xl p-8 sm:p-16 text-center text-white relative overflow-hidden">
            {/* Background design elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-accent/20 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <h2 className="text-3xl lg:text-5xl font-serif mb-6">¿Quieres potenciar tu marca?</h2>
              <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8 font-light">
                Ponte en contacto con nosotros hoy mismo para agendar una reunión y descubrir cómo podemos colaborar para alcanzar tus metas empresariales.
              </p>
              <Link href="/contacto">
                <Button size="lg" className="bg-white! text-brand-primary! hover:bg-gray-100! shadow-lg shadow-white/20 hover:scale-105 transition-transform duration-300">
                  Agenda una Asesoría
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
