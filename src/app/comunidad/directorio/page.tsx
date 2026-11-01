import type { Metadata } from "next";
import Link from "next/link";
import { AtSign, Globe, MapPin, Phone } from "lucide-react";
import Button from "@/components/Button";
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
    <li className="flex flex-col border-t border-dys-border pt-6 pb-8">
      <h3 className="font-display text-xl font-semibold text-dys-text">{n.nombre}</h3>
      <p className="mt-1 flex items-center gap-1.5 text-sm text-dys-muted">
        <MapPin className="size-4" aria-hidden="true" />
        {nombreComunaDirectorio(n.comuna_slug)}
      </p>
      <p className="mt-3 grow text-dys-muted leading-relaxed">{n.descripcion}</p>
      {(n.telefono || n.sitio_web || n.instagram) && (
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 font-semibold text-dys-link">
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
    <div className="min-h-screen pt-12 pb-24 bg-dys-bg">

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav aria-label="Migas de pan" className="text-sm text-dys-muted mb-8">
          <Link href="/comunidad" className="underline underline-offset-4 hover:text-dys-text">Comunidad Puerto Varas</Link>
          <span className="mx-2">/</span>
          <span className="text-dys-text">Directorio</span>
        </nav>

        <header className="max-w-3xl mb-10 space-y-5">
          <h1 className="firma-punto text-titular-1 font-bold text-dys-text">Directorio de negocios locales</h1>
          <p className="max-w-[56ch] text-lg sm:text-xl text-dys-muted leading-relaxed">
            Negocios de Puerto Varas y alrededores, inscritos por sus propios dueños. Compra local y apoya a los
            vecinos.
          </p>
          <Button size="lg" href="/comunidad/directorio/inscribir">
            Inscribe tu negocio gratis
          </Button>
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
          <div className="border-t border-dys-border pt-8 space-y-4">
            <h2 className="text-titular-3 font-semibold text-dys-text">Estamos armando el directorio</h2>
            <p className="text-lg text-dys-muted max-w-xl">
              Sé de los primeros negocios en aparecer. Inscribirse es gratis y toma un par de minutos.
            </p>
            <Link
              href="/comunidad/directorio/inscribir"
              className="inline-block font-semibold text-dys-link underline underline-offset-4 hover:text-dys-text"
            >
              Inscribir mi negocio
            </Link>
          </div>
        ) : (
          <div className="space-y-12">
            {grupos.map((g) => (
              <section key={g.rubro} id={slugRubro(g.rubro)} aria-labelledby={`${slugRubro(g.rubro)}-titulo`} className="scroll-mt-24">
                <h2 id={`${slugRubro(g.rubro)}-titulo`} className="mb-2 text-titular-3 font-semibold text-dys-text">
                  {g.rubro}
                </h2>
                <ul className="grid gap-x-10 md:grid-cols-2">
                  {g.items.map((n) => (
                    <TarjetaNegocio key={n.id} n={n} />
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}

        <aside className="dys-light mt-16 rounded-xl bg-dys-bg text-dys-text p-8 sm:flex sm:items-center sm:justify-between sm:gap-8">
          <div className="space-y-2">
            <h2 className="text-titular-3 font-semibold">¿Tu negocio aún no tiene sitio web?</h2>
            <p className="text-dys-muted">Te armamos uno a medida, pensado para que te encuentren en Google.</p>
          </div>
          <Button size="lg" href="/contacto" className="mt-5 sm:mt-0 shrink-0">
            Cotizar mi sitio
          </Button>
        </aside>
      </div>
    </div>
  );
}
