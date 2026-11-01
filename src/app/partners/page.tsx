import Button from "@/components/Button";
import PartnersShowcase from "@/components/PartnersShowcase";

export default function PartnersPage() {
  return (
    <div className="bg-dys-bg">
      {/* Encabezado alineado a la izquierda, como el resto del sitio */}
      <section className="pt-16 pb-16 sm:pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <h1 className="firma-punto text-titular-1 font-bold text-dys-text">Nuestros partners</h1>
          <p className="max-w-[56ch] text-lg sm:text-xl text-dys-muted leading-relaxed">
            Los sitios web que hemos diseñado y desarrollado para nuestros clientes y aliados. Proyectos activos que puedes
            visitar y recorrer.
          </p>
        </div>
      </section>

      <section aria-label="Proyectos" className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PartnersShowcase />
        </div>
      </section>

      {/* Cierre en franja marfil, sin fondos decorativos */}
      <section aria-labelledby="partners-cierre" className="dys-light bg-dys-bg py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[7fr_5fr] gap-10 items-end">
          <div className="space-y-6">
            <h2 id="partners-cierre" className="max-w-2xl text-titular-2 font-bold text-dys-text">
              ¿Listo para dar el salto digital?
            </h2>
            <p className="max-w-2xl text-lg text-dys-muted leading-relaxed">
              Hacemos tu sitio corporativo, catálogo o tienda online a medida, para que tus clientes te encuentren y te
              escriban.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row lg:justify-end gap-4">
            <Button size="lg" href="/contacto">
              Cotizar mi sitio
            </Button>
            <Button size="lg" variant="outline" href="/contacto">
              Convertirme en partner
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
