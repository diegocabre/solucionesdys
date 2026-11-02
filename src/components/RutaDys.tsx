import Image from 'next/image';
import Button from '@/components/Button';
import { BUSINESS } from '@/lib/site';

// Producto propio de Soluciones DyS. Sin precios publicados: solo plan demo sin costo y planes pagados.
const RUTA_DYS_URL = 'https://rutario.solucionesdys.cl';

const PASOS = [
  'Registras tu empresa con el plan demo sin costo: 2 clientes y 1 vendedor.',
  'Importas tu cartera de clientes desde un CSV y la asignas a tus vendedores.',
  'Cada vendedor vincula la app escaneando un código QR desde el panel.',
  'La app arma la ruta del día, funciona sin señal, registra visitas y kilómetros y permite proponer prospectos.',
  'En el panel ves en un mapa el recorrido de cada vendedor, con reportes de visitas y km por día y semana descargables en CSV.',
];

export default function RutaDys() {
  return (
    <section
      id="ruta-dys"
      aria-labelledby="ruta-dys-titulo"
      className="scroll-mt-20 py-24 bg-dys-bg border-b border-dys-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-12">
        <div className="space-y-6">
          <p className="text-sm font-semibold text-dys-muted">Nuestro producto</p>
          <h2 id="ruta-dys-titulo" className="text-titular-2 font-bold text-dys-text">
            Ruta DyS: la ruta del día para tus vendedores en terreno
          </h2>
          <p className="text-lg text-dys-muted leading-relaxed">
            Un panel web y una app Android para empresas con vendedores que visitan clientes. Tú asignas la cartera,
            ellos siguen su ruta y tú ves cada visita y cada kilómetro.
          </p>

          <div>
            <h3 className="text-base font-semibold text-dys-text">Planes</h3>
            <p className="mt-2 text-dys-muted leading-relaxed">
              Partes con el plan demo sin costo y pasas a un plan pagado cuando tu equipo lo necesite.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Button size="lg" href={RUTA_DYS_URL} external>
              Probar Ruta DyS
            </Button>
            <Button size="lg" variant="outline" href={`${RUTA_DYS_URL}/descargar`} external>
              Descargar la app
            </Button>
          </div>
          <p className="text-sm text-dys-muted">
            ¿Dudas? Escríbenos a{' '}
            <a
              href={`mailto:${BUSINESS.email}`}
              className="text-dys-link underline underline-offset-4 hover:text-dys-text"
            >
              {BUSINESS.email}
            </a>
            . Cumple con las leyes 19.628 y 21.719 y solo usa cookies de sesión.
          </p>
        </div>

        <div className="space-y-10">
          {/* Espacio para capturas del panel y la app (sin datos de clientes reales); por ahora, el logo. */}
          <div className="relative aspect-[24/11] rounded-xl overflow-hidden border border-dys-border bg-black flex items-center justify-center">
            <Image
              src="/assets/img/ruta-dys/icon.webp"
              alt="Logo de Ruta DyS"
              width={200}
              height={200}
              sizes="(min-width: 640px) 200px, 128px"
              className="w-32 h-32 sm:w-[200px] sm:h-[200px]"
            />
          </div>

          <div>
            <h3 className="text-titular-3 font-semibold text-dys-text">Cómo funciona</h3>
            <ol className="mt-4 border-t border-dys-border">
              {PASOS.map((paso, i) => (
                <li key={paso} className="flex gap-4 border-b border-dys-border py-4 text-dys-text">
                  <span className="font-display font-semibold text-dys-muted tabular-nums">{i + 1}</span>
                  <span className="leading-relaxed">{paso}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
