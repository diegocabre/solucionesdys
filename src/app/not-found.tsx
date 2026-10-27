import Link from "next/link";

// Reemplaza la 404 por defecto de Next, que trae fondo blanco en línea.
export default function NotFound() {
  return (
    <section className="max-w-xl mx-auto px-4 py-32 text-center space-y-6">
      <p className="text-sm font-semibold uppercase tracking-widest text-dys-primary">Error 404</p>
      <h1 className="text-4xl font-bold text-dys-text">No encontramos esta página</h1>
      <p className="text-dys-muted">Puede que el enlace esté mal escrito o que la página ya no exista.</p>
      <Link
        href="/"
        className="inline-flex items-center rounded-md bg-dys-primary px-5 py-3 font-semibold text-dys-on-primary hover:bg-dys-primary/85 transition-colors focus:outline-none focus:ring-2 focus:ring-dys-primary focus:ring-offset-2"
      >
        Volver al inicio
      </Link>
    </section>
  );
}
