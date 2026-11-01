import Button from "@/components/Button";

// Reemplaza la 404 por defecto de Next, que trae fondo blanco en línea.
export default function NotFound() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32 space-y-8">
      <h1 className="firma-punto max-w-[16ch] text-titular-1 font-bold text-dys-text">No encontramos esta página</h1>
      <p className="max-w-[52ch] text-lg sm:text-xl text-dys-muted leading-relaxed">
        Puede que el enlace esté mal escrito o que la página ya no exista. Error 404.
      </p>
      <Button size="lg" href="/">
        Volver al inicio
      </Button>
    </section>
  );
}
