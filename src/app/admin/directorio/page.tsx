import Link from "next/link";
import { exigirAdmin } from "@/lib/admin";
import { mailtoBienvenida, nombreComunaDirectorio } from "@/lib/directorio";
import { listarNegociosAdmin, type EstadoNegocio, type NegocioAdmin } from "@/lib/supabase/server";
import { cambiarEstado, salir } from "../actions";

export const dynamic = "force-dynamic";

const boton =
  "inline-flex items-center rounded-md px-4 py-2 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-dys-primary focus:ring-offset-2";

function BotonEstado({ id, estado, texto, estilo }: { id: string; estado: EstadoNegocio; texto: string; estilo: string }) {
  return (
    <form action={cambiarEstado}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="estado" value={estado} />
      <button type="submit" className={`${boton} ${estilo}`}>
        {texto}
      </button>
    </form>
  );
}

const fecha = (iso: string) =>
  new Intl.DateTimeFormat("es-CL", { dateStyle: "medium", timeZone: "America/Santiago" }).format(new Date(iso));

function Ficha({ n }: { n: NegocioAdmin }) {
  return (
    <li className="rounded-2xl bg-dys-surface border border-dys-border p-5 shadow-sm space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-lg font-bold text-dys-text">{n.nombre}</h3>
          <p className="text-sm text-dys-muted">
            {n.rubro} · {nombreComunaDirectorio(n.comuna_slug)} · {fecha(n.created_at)}
          </p>
        </div>
        {n.quiere_sitio && (
          <span className="rounded-full bg-dys-accent/10 px-3 py-1 text-xs font-semibold text-dys-accent">Quiere sitio web</span>
        )}
      </div>
      <p className="text-dys-text">{n.descripcion}</p>
      <dl className="grid gap-x-6 gap-y-1 text-sm text-dys-muted sm:grid-cols-2">
        <div><dt className="inline font-semibold">Contacto: </dt><dd className="inline">{n.contacto_nombre} · {n.email_contacto}</dd></div>
        {n.telefono && <div><dt className="inline font-semibold">Teléfono: </dt><dd className="inline">{n.telefono}</dd></div>}
        {n.sitio_web && (
          <div>
            <dt className="inline font-semibold">Sitio: </dt>
            <dd className="inline"><a href={n.sitio_web} target="_blank" rel="noopener noreferrer nofollow" className="underline">{n.sitio_web}</a></dd>
          </div>
        )}
        {n.instagram && <div><dt className="inline font-semibold">Instagram: </dt><dd className="inline">@{n.instagram}</dd></div>}
      </dl>
      <div className="flex flex-wrap gap-2 pt-1">
        <Link href={`/admin/directorio/${n.id}`} className={`${boton} border border-dys-border text-dys-text hover:bg-dys-text/10`}>
          Editar
        </Link>
        {n.estado === "pendiente" && (
          <>
            <BotonEstado id={n.id} estado="aprobado" texto="Aprobar" estilo="bg-dys-primary text-dys-on-primary hover:bg-dys-primary/85" />
            <BotonEstado id={n.id} estado="rechazado" texto="Rechazar" estilo="border border-dys-border text-dys-text hover:bg-dys-text/10" />
          </>
        )}
        {n.estado === "aprobado" && (
          <>
            <a href={mailtoBienvenida(n)} className={`${boton} bg-dys-primary text-dys-on-primary hover:bg-dys-primary/85`}>
              Correo de bienvenida
            </a>
            <BotonEstado id={n.id} estado="rechazado" texto="Desactivar" estilo="border border-red-500/40 text-red-300 hover:bg-red-500/10" />
          </>
        )}
        {n.estado === "rechazado" && (
          <BotonEstado id={n.id} estado="aprobado" texto="Publicar" estilo="border border-dys-border text-dys-text hover:bg-dys-text/10" />
        )}
      </div>
    </li>
  );
}

const SECCIONES: { estado: EstadoNegocio; titulo: string; vacio: string }[] = [
  { estado: "pendiente", titulo: "Pendientes de revisión", vacio: "No hay fichas por revisar." },
  { estado: "aprobado", titulo: "Publicados", vacio: "Aún no hay negocios publicados." },
  { estado: "rechazado", titulo: "Ocultos (rechazados o desactivados)", vacio: "No hay fichas ocultas." },
];

export default async function PanelDirectorioPage() {
  await exigirAdmin();

  let negocios: NegocioAdmin[] = [];
  let error = false;
  try {
    negocios = await listarNegociosAdmin();
  } catch (e) {
    console.error("[admin] Error leyendo los negocios:", e);
    error = true;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-dys-text">Directorio de negocios</h1>
          <Link href="/comunidad/directorio" className="text-sm text-dys-link underline underline-offset-2">
            Ver el directorio público
          </Link>
        </div>
        <form action={salir}>
          <button type="submit" className={`${boton} border border-dys-border text-dys-text hover:bg-dys-text/10`}>
            Salir
          </button>
        </form>
      </header>

      {error && (
        <p role="alert" className="p-4 bg-red-500/10 text-red-300 rounded-md text-sm border border-red-500/40">
          No pudimos leer las fichas desde Supabase. Revisa los logs de Vercel.
        </p>
      )}

      {SECCIONES.map(({ estado, titulo, vacio }) => {
        const items = negocios.filter((n) => n.estado === estado);
        return (
          <section key={estado} aria-labelledby={`sec-${estado}`} className="space-y-4">
            <h2 id={`sec-${estado}`} className="text-xl font-bold text-dys-text">
              {titulo} <span className="text-dys-muted font-normal">({items.length})</span>
            </h2>
            {items.length === 0 ? (
              <p className="text-sm text-dys-muted">{vacio}</p>
            ) : (
              <ul className="grid gap-4">
                {items.map((n) => (
                  <Ficha key={n.id} n={n} />
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}
