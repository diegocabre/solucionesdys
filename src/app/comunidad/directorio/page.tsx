import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, AtSign, Globe, MapPin, Phone, Plus, Store } from "lucide-react";
import { RUBROS, nombreComunaDirectorio } from "@/lib/directorio";
import { isSupabaseConfigured, listarNegociosAprobados, type NegocioPublico } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Directorio de negocios de Puerto Varas y alrededores",
  description:
    "Negocios locales de Puerto Varas, Llanquihue, Frutillar y Puerto Montt: alojamiento, gastronomía, comercio, oficios y más. Inscribe el tuyo gratis.",
  alternates: { canonical: "/comunidad/directorio" },
  openGraph: {
    title: "Directorio de negocios locales | Soluciones DyS",
    description: "Negocios de Puerto Varas y alrededores. Inscribe el tuyo gratis.",
    url: "/comunidad/directorio",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Soluciones DyS" }],
  },
};

// shortcut: consulta Supabase en cada visita (sin caché); con mucho tráfico, cachear la lista.
export const dynamic = "force-dynamic";

async function cargarNegocios(): Promise<NegocioPublico[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    return await listarNegociosAprobados();
  } catch (error) {
    console.error("[directorio] Error leyendo los negocios:", error);
    return [];
  }
}

const slugRubro = (rubro: string) =>
  rubro.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/\s+/g, "-");

function TarjetaNegocio({ n }: { n: NegocioPublico }) {
  return (
    <li className="flex flex-col rounded-3xl bg-dys-surface border border-dys-border p-6 shadow-sm">
      <h3 className="text-xl font-bold text-dys-text">{n.nombre}</h3>
      <p className="mt-1 flex items-center gap-1.5 text-sm text-dys-muted">
        <MapPin className="size-4" aria-hidden="true" />
        {nombreComunaDirectorio(n.comuna_slug)}
      </p>
      <p className="mt-3 grow text-dys-muted leading-relaxed">{n.descripcion}</p>
      {(n.telefono || n.sitio_web || n.instagram) && (
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-dys-primary">
          {n.telefono && (
            <a href={`tel:${n.telefono.replace(/[^\d+]/g, "")}`} className="inline-flex items-center gap-1.5 hover:text-dys-text">
              <Phone className="size-4" aria-hidden="true" />
              {n.telefono}
            </a>
          )}
          {n.sitio_web && (
            <a href={n.sitio_web} target="_blank" rel="nofollow ugc noopener" className="inline-flex items-center gap-1.5 hover:text-dys-text">
              <Globe className="size-4" aria-hidden="true" />
              Sitio web
              <span className="sr-only">de {n.nombre} (se abre en una pestaña nueva)</span>
            </a>
          )}
          {n.instagram && (
            <a
              href={`https://www.instagram.com/${n.instagram}/`}
              target="_blank"
              rel="nofollow ugc noopener"
              className="inline-flex items-center gap-1.5 hover:text-dys-text"
            >
              <AtSign className="size-4" aria-hidden="true" />
              {n.instagram}
              <span className="sr-only">en Instagram (se abre en una pestaña nueva)</span>
            </a>
          )}
        </div>
      )}
    </li>
  );
}

export default async function DirectorioPage() {
  const negocios = await cargarNegocios();
  const grupos = RUBROS.map((rubro) => ({ rubro, items: negocios.filter((n) => n.rubro === rubro) })).filter(
    (g) => g.items.length > 0,
  );

  return (
    <div className="min-h-screen py-16 bg-dys-bg relative overflow-hidden">
      <div className="absolute bottom-10 right-1/4 w-[600px] h-[600px] bg-dys-primary/5 rounded-full blur-3xl -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav aria-label="Migas de pan" className="text-sm text-dys-muted mb-8">
          <Link href="/comunidad" className="hover:text-dys-primary">Comunidad Puerto Varas</Link>
          <span className="mx-2">/</span>
          <span className="text-dys-text">Directorio</span>
        </nav>

        <header className="max-w-3xl mb-10 space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-dys-primary/10 border border-dys-primary/20">
            <Store className="w-4 h-4 text-dys-primary" aria-hidden="true" />
            <span className="text-sm font-semibold tracking-wider text-dys-primary uppercase">Hecho en el sur</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-dys-text">
            Directorio de negocios <span className="text-dys-primary">locales</span>
          </h1>
          <p className="text-lg text-dys-muted font-light leading-relaxed">
            Negocios de Puerto Varas y alrededores, inscritos por sus propios dueños. Compra local y apoya a los
            vecinos.
          </p>
          <Link
            href="/comunidad/directorio/inscribir"
            className="inline-flex items-center gap-2 rounded-md bg-dys-primary px-5 py-3 font-semibold text-dys-on-primary hover:bg-dys-primary/85 transition-colors focus:outline-none focus:ring-2 focus:ring-dys-primary focus:ring-offset-2"
          >
            <Plus className="size-4" aria-hidden="true" />
            Inscribe tu negocio gratis
          </Link>
        </header>

        {grupos.length > 1 && (
          <nav aria-label="Rubros" className="mb-10 flex flex-wrap gap-2">
            {grupos.map((g) => (
              <a
                key={g.rubro}
                href={`#${slugRubro(g.rubro)}`}
                className="rounded-full border border-dys-border bg-dys-surface px-4 py-1.5 text-sm text-dys-text hover:border-dys-primary hover:text-dys-text"
              >
                {g.rubro} <span className="text-dys-muted">({g.items.length})</span>
              </a>
            ))}
          </nav>
        )}

        {grupos.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-dys-primary/50 bg-dys-primary/5 p-8 sm:p-12 text-center space-y-4">
            <h2 className="text-2xl font-bold text-dys-text">Estamos armando el directorio</h2>
            <p className="text-dys-muted max-w-xl mx-auto">
              Sé de los primeros negocios en aparecer. Inscribirse es gratis y toma un par de minutos.
            </p>
            <Link
              href="/comunidad/directorio/inscribir"
              className="inline-flex items-center gap-2 font-semibold text-dys-primary hover:text-dys-text"
            >
              Inscribir mi negocio
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        ) : (
          <div className="space-y-12">
            {grupos.map((g) => (
              <section key={g.rubro} id={slugRubro(g.rubro)} aria-labelledby={`${slugRubro(g.rubro)}-titulo`} className="scroll-mt-24">
                <h2 id={`${slugRubro(g.rubro)}-titulo`} className="mb-5 text-2xl font-bold text-dys-text">
                  {g.rubro}
                </h2>
                <ul className="grid gap-6 md:grid-cols-2">
                  {g.items.map((n) => (
                    <TarjetaNegocio key={n.id} n={n} />
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}

        <aside className="dys-light mt-16 rounded-3xl bg-dys-bg text-dys-text p-8 sm:flex sm:items-center sm:justify-between sm:gap-8">
          <div className="space-y-2">
            <h2 className="text-xl font-bold">¿Tu negocio aún no tiene sitio web?</h2>
            <p className="text-dys-muted">Te armamos uno a medida, pensado para que te encuentren en Google.</p>
          </div>
          <Link
            href="/contacto"
            className="mt-5 sm:mt-0 inline-flex shrink-0 items-center gap-2 rounded-md bg-dys-primary px-5 py-3 font-semibold text-dys-on-primary hover:bg-dys-primary/85 transition-colors"
          >
            Cotizar mi sitio
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </aside>
      </div>
    </div>
  );
}
