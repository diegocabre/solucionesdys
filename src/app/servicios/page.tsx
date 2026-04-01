import { Truck, Sparkles } from 'lucide-react';
import Button from '@/components/Button';
import Link from 'next/link';

export default function ServiciosPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 pt-12 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <h1 className="text-4xl lg:text-6xl font-bold text-brand-primary mb-6 flex items-center gap-4">
              <Truck className="w-12 h-12 text-brand-accent hidden sm:block" />
              Servicios Generales
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed">
              En Soluciones DyS ofrecemos servicios profesionales de limpieza profunda y traslados VIP, garantizando siempre la máxima calidad, seguridad y puntualidad para ti o tu empresa.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Servicio 1 */}
            <div className="bg-white dark:bg-gray-800 p-8 sm:p-12 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-shadow flex flex-col h-full">
              <div className="w-16 h-16 bg-brand-accent/10 rounded-2xl flex items-center justify-center mb-8">
                <Sparkles className="w-8 h-8 text-brand-accent" />
              </div>
              <h2 className="text-3xl font-bold mb-4 text-foreground">Limpieza de Tapicería</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed grow">
                Sistema especializado de extracción e inyección profunda. Devolvemos la vida a los sillones y alfombras de tu hogar, así como al interior de tu vehículo eliminando manchas, ácaros y malos olores.
              </p>
              <ul className="space-y-3 mb-8 text-gray-600 dark:text-gray-400">
                <li className="flex items-center gap-2">✓ Tapicería de autos (asientos, alfombras, techo)</li>
                <li className="flex items-center gap-2">✓ Sillones de tela y cuero</li>
                <li className="flex items-center gap-2">✓ Sillas de comedor y oficina</li>
                <li className="flex items-center gap-2">✓ Alfombras y colchones</li>
              </ul>
              <Link href="/contacto">
                <Button variant="primary" className="w-full sm:w-auto">Cotizar Limpieza</Button>
              </Link>
            </div>

            {/* Servicio 2 */}
            <div className="bg-white dark:bg-gray-800 p-8 sm:p-12 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-shadow flex flex-col h-full">
              <div className="w-16 h-16 bg-brand-accent/10 rounded-2xl flex items-center justify-center mb-8">
                <Truck className="w-8 h-8 text-brand-accent" />
              </div>
              <h2 className="text-3xl font-bold mb-4 text-foreground">Transporte VIP Empresas</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed grow">
                Servicio exclusivo de traslados ejecutivos y corporativos. Ya sea que necesites llevar a tu equipo de trabajo, clientes importantes, o directivos, lo hacemos con la mayor discreción y profesionalismo.
              </p>
              <ul className="space-y-3 mb-8 text-gray-600 dark:text-gray-400">
                <li className="flex items-center gap-2">✓ Vehículos modernos y confortables</li>
                <li className="flex items-center gap-2">✓ Capacidad máxima de 4 pasajeros VIP</li>
                <li className="flex items-center gap-2">✓ Conductores profesionales y puntuales</li>
                <li className="flex items-center gap-2">✓ Discreción y seguridad garantizada</li>
              </ul>
              <Link href="/contacto">
                <Button variant="outline" className="w-full sm:w-auto">Reservar Vehículo</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
