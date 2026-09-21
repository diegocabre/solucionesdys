// Noticias de IA en vivo, leídas de fuentes primarias (blogs y releases oficiales).
// Cada fuente se consulta por separado: si una falla o cambia de formato, las demás siguen.
// Lo usa el endpoint /api/ia-noticias.

const REVALIDATE_SECONDS = 3600;
const MAX_ANTIGUEDAD_DIAS = 120;
const USER_AGENT = "SolucionesDyS-NewsReader/1.0 (+https://www.solucionesdys.cl)";

type Formato = "rss" | "atom" | "anthropic-html";

interface FuenteIA {
  id: string;
  nombre: string;
  url: string;
  formato: Formato;
  /** Máximo de noticias que se toman de esta fuente (evita que una acapare la lista). */
  max: number;
  /** Solo se aceptan enlaces https hacia estos dominios. */
  hosts: string[];
  prefijoTitulo?: string;
}

export const FUENTES_IA: FuenteIA[] = [
  {
    id: "anthropic",
    nombre: "Anthropic",
    url: "https://www.anthropic.com/news",
    formato: "anthropic-html",
    max: 5,
    hosts: ["anthropic.com"],
  },
  {
    id: "claude-code",
    nombre: "Claude Code",
    url: "https://github.com/anthropics/claude-code/releases.atom",
    formato: "atom",
    max: 3,
    hosts: ["github.com"],
    prefijoTitulo: "Claude Code ",
  },
  {
    id: "openai",
    nombre: "OpenAI",
    url: "https://openai.com/news/rss.xml",
    formato: "rss",
    max: 5,
    hosts: ["openai.com"],
  },
  {
    id: "deepmind",
    nombre: "Google DeepMind",
    url: "https://deepmind.google/blog/rss.xml",
    formato: "rss",
    max: 4,
    hosts: ["deepmind.google"],
  },
  {
    id: "google",
    nombre: "Google",
    url: "https://blog.google/technology/ai/rss/",
    formato: "rss",
    max: 4,
    hosts: ["blog.google", "google.com"],
  },
  {
    id: "mit",
    nombre: "MIT Technology Review",
    url: "https://www.technologyreview.com/topic/artificial-intelligence/feed",
    formato: "rss",
    max: 4,
    hosts: ["technologyreview.com"],
  },
];

export interface NoticiaIA {
  id: string;
  fuenteId: string;
  fuente: string;
  titulo: string;
  resumen: string;
  url: string;
  /** ISO 8601. */
  fecha: string;
  /** Categoría que declara la propia fuente, si la hay. */
  etiqueta?: string;
}

export interface NoticiasResponse {
  actualizado: string;
  fuentes: { id: string; nombre: string; ok: boolean }[];
  noticias: NoticiaIA[];
}

// ── Limpieza de texto ────────────────────────────────────────────────────────

const ENTIDADES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  rsquo: "’",
  lsquo: "‘",
  rdquo: "”",
  ldquo: "“",
  hellip: "…",
  ndash: "–",
  mdash: "—",
};

function decodificar(s: string): string {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (todo, cod: string) => {
    if (cod[0] === "#") {
      const n = cod[1].toLowerCase() === "x" ? parseInt(cod.slice(2), 16) : parseInt(cod.slice(1), 10);
      return Number.isFinite(n) && n > 0 && n < 0x110000 ? String.fromCodePoint(n) : "";
    }
    return ENTIDADES[cod.toLowerCase()] ?? todo;
  });
}

const sinCdata = (s: string) => s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1");
const sinTags = (s: string) => s.replace(/<[^>]*>/g, " ");

// Sirve para texto plano, HTML dentro de CDATA y HTML escapado con entidades.
function limpiar(raw: string): string {
  const tieneCdata = raw.includes("<![CDATA[");
  const base = tieneCdata ? sinCdata(raw) : decodificar(raw);
  return decodificar(sinTags(base)).replace(/\s+/g, " ").trim();
}

const recortar = (s: string, max: number) => (s.length > max ? `${s.slice(0, max - 1).trimEnd()}…` : s);

// ── Lectura de feeds ─────────────────────────────────────────────────────────

const escapar = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function etiqueta(bloque: string, nombre: string): string | null {
  const n = escapar(nombre);
  const m = bloque.match(new RegExp(`<${n}(?:\\s[^>]*)?>([\\s\\S]*?)</${n}>`, "i"));
  return m ? m[1] : null;
}

function enlace(bloque: string): string | null {
  const atom =
    bloque.match(/<link[^>]*rel="alternate"[^>]*href="([^"]+)"/i) ?? bloque.match(/<link[^>]*href="([^"]+)"/i);
  if (atom) return decodificar(atom[1]);
  const rss = etiqueta(bloque, "link");
  return rss ? limpiar(rss) : null;
}

function urlPermitida(url: string | null, hosts: string[]): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.protocol !== "https:") return null;
    const ok = hosts.some((h) => u.hostname === h || u.hostname.endsWith(`.${h}`));
    return ok ? u.toString() : null;
  } catch {
    return null;
  }
}

function fechaISO(raw: string | null): string | null {
  if (!raw) return null;
  const t = Date.parse(limpiar(raw));
  return Number.isFinite(t) ? new Date(t).toISOString() : null;
}

function leerFeed(xml: string, fuente: FuenteIA): NoticiaIA[] {
  const esAtom = fuente.formato === "atom";
  const bloques = xml.match(esAtom ? /<entry[\s>][\s\S]*?<\/entry>/g : /<item[\s>][\s\S]*?<\/item>/g) ?? [];
  const noticias: NoticiaIA[] = [];

  for (const b of bloques) {
    const titulo = etiqueta(b, "title");
    const url = urlPermitida(enlace(b), fuente.hosts);
    const fecha = fechaISO(etiqueta(b, esAtom ? "updated" : "pubDate") ?? etiqueta(b, "published"));
    if (!titulo || !url || !fecha) continue;

    let resumen = "";
    if (esAtom) {
      // Los releases de GitHub traen HTML: usamos el primer punto de la lista de cambios.
      const html = decodificar(etiqueta(b, "content") ?? "");
      const li = html.match(/<li>([\s\S]*?)<\/li>/);
      resumen = limpiar(li ? li[1] : html);
    } else {
      resumen = limpiar(etiqueta(b, "description") ?? "");
    }

    const categoria = etiqueta(b, "category");
    noticias.push({
      id: `${fuente.id}:${url}`,
      fuenteId: fuente.id,
      fuente: fuente.nombre,
      titulo: recortar(`${fuente.prefijoTitulo ?? ""}${limpiar(titulo)}`, 200),
      resumen: recortar(resumen, 220),
      url,
      fecha,
      etiqueta: categoria ? recortar(limpiar(categoria), 40) : undefined,
    });
  }
  return noticias;
}

// Anthropic no publica RSS: leemos su listado público (robots.txt lo permite). Se busca por
// estructura semántica (enlace /news/…, <time>, spans) y no por clases CSS, que cambian seguido.
function leerAnthropic(html: string, fuente: FuenteIA): NoticiaIA[] {
  const vistos = new Map<string, NoticiaIA>();

  for (const m of html.matchAll(/<a\s[^>]*href="(\/news\/[^"#?]+)"[^>]*>([\s\S]*?)<\/a>/g)) {
    const url = urlPermitida(`https://www.anthropic.com${m[1]}`, fuente.hosts);
    const interior = m[2];
    const tiempo = interior.match(/<time[^>]*>([^<]+)<\/time>/);
    if (!url || !tiempo) continue;

    // Las tarjetas destacadas llevan el título en un <h*> y un <p> de resumen; las filas del
    // listado son [categoría, título] en dos <span>.
    const spans = [...interior.matchAll(/<span[^>]*>([\s\S]*?)<\/span>/g)].map((s) => limpiar(s[1]));
    const encabezado = interior.match(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/);
    const parrafo = interior.match(/<p[^>]*>([\s\S]*?)<\/p>/);
    const titulo = encabezado ? limpiar(encabezado[1]) : spans.length > 1 ? spans[spans.length - 1] : "";
    const categoria = spans.length > 0 ? spans[0] : undefined;
    const resumen = parrafo ? recortar(limpiar(parrafo[1]), 220) : "";
    const t = Date.parse(`${limpiar(tiempo[1])} 12:00:00 UTC`);
    if (!titulo || !Number.isFinite(t)) continue;

    // La misma noticia aparece destacada y en el listado: nos quedamos con una y le sumamos el resumen.
    const previa = vistos.get(url);
    if (previa) {
      if (!previa.resumen && resumen) previa.resumen = resumen;
      continue;
    }

    vistos.set(url, {
      id: `${fuente.id}:${url}`,
      fuenteId: fuente.id,
      fuente: fuente.nombre,
      titulo: recortar(titulo, 200),
      resumen,
      url,
      fecha: new Date(t).toISOString(),
      etiqueta: categoria ? recortar(categoria, 40) : undefined,
    });
  }
  return [...vistos.values()];
}

async function cargarFuente(fuente: FuenteIA): Promise<NoticiaIA[]> {
  const res = await fetch(fuente.url, {
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "application/atom+xml, application/rss+xml, application/xml, text/xml, text/html;q=0.8",
    },
    next: { revalidate: REVALIDATE_SECONDS },
    signal: AbortSignal.timeout(12_000),
  });
  if (!res.ok) throw new Error(`${fuente.id}: HTTP ${res.status}`);

  const cuerpo = await res.text();
  const items = fuente.formato === "anthropic-html" ? leerAnthropic(cuerpo, fuente) : leerFeed(cuerpo, fuente);
  if (items.length === 0) throw new Error(`${fuente.id}: sin noticias (¿cambió el formato?)`);

  const limite = Date.now() - MAX_ANTIGUEDAD_DIAS * 24 * 3600 * 1000;
  return items
    .filter((n) => Date.parse(n.fecha) >= limite && Date.parse(n.fecha) <= Date.now() + 24 * 3600 * 1000)
    .sort((a, b) => b.fecha.localeCompare(a.fecha))
    .slice(0, fuente.max);
}

export async function obtenerNoticiasIA(): Promise<NoticiasResponse> {
  const resultados = await Promise.allSettled(FUENTES_IA.map(cargarFuente));

  const fuentes = FUENTES_IA.map((f, i) => {
    const r = resultados[i];
    if (r.status === "rejected") console.error("[ia-noticias]", r.reason);
    return { id: f.id, nombre: f.nombre, ok: r.status === "fulfilled" && r.value.length > 0 };
  });

  const noticias = resultados
    .flatMap((r) => (r.status === "fulfilled" ? r.value : []))
    .sort((a, b) => b.fecha.localeCompare(a.fecha));

  if (noticias.length === 0) throw new Error("Ninguna fuente de noticias respondió");

  return { actualizado: new Date().toISOString(), fuentes, noticias };
}
