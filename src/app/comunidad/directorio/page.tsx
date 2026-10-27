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
    <li className="flex flex-col rounded-3xl bg-white border border-gray-100 p-6 shadow-sm">
      <h3 className="text-xl font-bold text-brand-primary">{n.nombre}</h3>
      <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
        <MapPin className="size-4" aria-hidden="true" />
        {nombreComunaDirectorio(n.comuna_slug)}
      </p>
      <p className="mt-3 grow text-gray-600 leading-relaxed">{n.descripcion}</p>
      {(n.telefono || n.sitio_web || n.instagram) && (
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-brand-accent-dark">
          {n.telefono && (
            <a href={`tel:${n.telefono.replace(/[^\d+]/g, "")}`} className="inline-flex items-center gap-1.5 hover:text-brand-primary">
              <Phone className="size-4" aria-hidden="true" />
              {n.telefono}
            </a>
          )}
          {n.sitio_web && (
            <a href={n.sitio_web} target="_blank" rel="nofollow ugc noopener" className="inline-flex items-center gap-1.5 hover:text-brand-primary">
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
              className="inline-flex items-center gap-1.5 hover:text-brand-primary"
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
    <div className="min-h-screen py-16 bg-background relative overflow-hidden">
      <div className="absolute bottom-10 right-1/4 w-[600px] h-[600px] bg-brand-accent/5 rounded-full blur-3xl -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav aria-label="Migas de pan" className="text-sm text-gray-500 mb-8">
          <Link href="/comunidad" className="hover:text-brand-accent-dark">Comunidad Puerto Varas</Link>
          <span className="mx-2">/</span>
          <span className="text-brand-primary">Directorio</span>
        </nav>

        <header className="max-w-3xl mb-10 space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-accent/10 border border-brand-accent/20">
            <Store className="w-4 h-4 text-brand-accent-dark" aria-hidden="true" />
            <span className="text-sm font-semibold tracking-wider text-brand-accent-dark uppercase">Hecho en el sur</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-brand-primary">
            Directorio de negocios <span className="text-brand-accent-dark">locales</span>
          </h1>
          <p className="text-lg text-gray-600 font-light leading-relaxed">
            Negocios de Puerto Varas y alrededores, inscritos por sus propios dueños. Compra local y apoya a los
            vecinos.
          </p>
          <Link
            href="/comunidad/directorio/inscribir"
            className="inline-flex items-center gap-2 rounded-md bg-brand-accent-dark px-5 py-3 font-semibold text-white hover:bg-brand-primary transition-colors focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
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
                className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm text-gray-700 hover:border-brand-accent hover:text-brand-primary"
              >
                {g.rubro} <span className="text-gray-400">({g.items.length})</span>
              </a>
            ))}
          </nav>
        )}

        {grupos.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-brand-accent/50 bg-brand-accent/5 p-8 sm:p-12 text-center space-y-4">
            <h2 className="text-2xl font-bold text-brand-primary">Estamos armando el directorio</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Sé de los primeros negocios en aparecer. Inscribirse es gratis y toma un par de minutos.
            </p>
            <Link
              href="/comunidad/directorio/inscribir"
              className="inline-flex items-center gap-2 font-semibold text-brand-accent-dark hover:text-brand-primary"
            >
              Inscribir mi negocio
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        ) : (
          <div className="space-y-12">
            {grupos.map((g) => (
              <section key={g.rubro} id={slugRubro(g.rubro)} aria-labelledby={`${slugRubro(g.rubro)}-titulo`} className="scroll-mt-24">
                <h2 id={`${slugRubro(g.rubro)}-titulo`} className="mb-5 text-2xl font-bold text-brand-primary">
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

        <aside className="mt-16 rounded-3xl bg-brand-primary text-white p-8 sm:flex sm:items-center sm:justify-between sm:gap-8">
          <div className="space-y-2">
            <h2 className="text-xl font-bold">¿Tu negocio aún no tiene sitio web?</h2>
            <p className="text-gray-300">Te armamos uno a medida, pensado para que te encuentren en Google.</p>
          </div>
          <Link
            href="/contacto"
            className="mt-5 sm:mt-0 inline-flex shrink-0 items-center gap-2 rounded-md bg-white px-5 py-3 font-semibold text-brand-primary hover:bg-brand-accent-light transition-colors"
          >
            Cotizar mi sitio
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </aside>
      </div>
    </div>
  );
}
