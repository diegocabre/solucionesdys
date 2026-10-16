import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FUENTES_IA, obtenerNoticiasIA } from "@/lib/ia-noticias";

const AHORA = new Date("2026-10-15T12:00:00Z");

const RSS = `<?xml version="1.0"?><rss><channel>
  <item>
    <title><![CDATA[Nuevo modelo &amp; más]]></title>
    <link>https://openai.com/news/nuevo-modelo</link>
    <description><![CDATA[<p>Resumen con <b>HTML</b>.</p>]]></description>
    <pubDate>Mon, 12 Oct 2026 10:00:00 GMT</pubDate>
    <category>Producto</category>
  </item>
  <item>
    <title>Enlace a otro dominio</title>
    <link>https://malicioso.example/phishing</link>
    <pubDate>Mon, 12 Oct 2026 10:00:00 GMT</pubDate>
  </item>
  <item>
    <title>Demasiado antigua</title>
    <link>https://openai.com/news/vieja</link>
    <pubDate>Mon, 01 Jan 2024 10:00:00 GMT</pubDate>
  </item>
</channel></rss>`;

const ATOM = `<feed>
  <entry>
    <title>v2.1.0</title>
    <link rel="alternate" href="https://github.com/anthropics/claude-code/releases/tag/v2.1.0"/>
    <updated>2026-10-14T08:00:00Z</updated>
    <content type="html">&lt;ul&gt;&lt;li&gt;Primer cambio&lt;/li&gt;&lt;li&gt;Segundo&lt;/li&gt;&lt;/ul&gt;</content>
  </entry>
</feed>`;

const ANTHROPIC_HTML = `<html><body>
  <a href="/news/claude-nuevo"><span>Producto</span><h3>Claude nuevo</h3><p>Resumen destacado</p><time>Oct 13, 2026</time></a>
  <a href="/news/claude-nuevo"><span>Producto</span><span>Claude nuevo</span><time>Oct 13, 2026</time></a>
</body></html>`;

// La fuente "cambió": ya no hay enlaces /news/ ni <time>.
const ANTHROPIC_CAMBIADO = `<html><body><div class="grid"><div class="card">Claude nuevo</div></div></body></html>`;

function mockFetch(respuestas: Record<string, string | number>) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string) => {
      const r = respuestas[url] ?? 404;
      return typeof r === "number" ? new Response("", { status: r }) : new Response(r, { status: 200 });
    }),
  );
}

const url = (id: string) => FUENTES_IA.find((f) => f.id === id)!.url;

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(AHORA);
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("obtenerNoticiasIA", () => {
  it("lee RSS, Atom y el HTML de Anthropic, y las ordena por fecha", async () => {
    mockFetch({ [url("openai")]: RSS, [url("claude-code")]: ATOM, [url("anthropic")]: ANTHROPIC_HTML });
    const r = await obtenerNoticiasIA();

    expect(r.noticias.map((n) => n.titulo)).toEqual(["Claude Code v2.1.0", "Claude nuevo", "Nuevo modelo & más"]);

    const openai = r.noticias.find((n) => n.fuenteId === "openai")!;
    expect(openai).toMatchObject({
      url: "https://openai.com/news/nuevo-modelo",
      resumen: "Resumen con HTML .",
      etiqueta: "Producto",
    });
    expect(r.noticias.find((n) => n.fuenteId === "claude-code")!.resumen).toBe("Primer cambio");
    // Duplicada en la página: queda una sola, con el resumen de la tarjeta destacada.
    expect(r.noticias.filter((n) => n.fuenteId === "anthropic")).toHaveLength(1);
    expect(r.noticias.find((n) => n.fuenteId === "anthropic")!.resumen).toBe("Resumen destacado");
  });

  it("descarta enlaces fuera de los dominios permitidos y noticias antiguas", async () => {
    mockFetch({ [url("openai")]: RSS });
    const r = await obtenerNoticiasIA();
    expect(r.noticias.map((n) => n.url)).toEqual(["https://openai.com/news/nuevo-modelo"]);
  });

  it("si una fuente cambia de formato, la marca caída, lo registra y sigue con las demás", async () => {
    mockFetch({ [url("openai")]: RSS, [url("anthropic")]: ANTHROPIC_CAMBIADO });
    const r = await obtenerNoticiasIA();

    expect(r.fuentes.find((f) => f.id === "anthropic")).toMatchObject({ ok: false });
    expect(r.fuentes.find((f) => f.id === "openai")).toMatchObject({ ok: true });
    expect(r.noticias).toHaveLength(1);
    expect(console.error).toHaveBeenCalledWith(
      "[ia-noticias]",
      expect.objectContaining({ message: "anthropic: sin noticias (¿cambió el formato?)" }),
    );
  });

  it("registra el código HTTP de una fuente que responde error", async () => {
    mockFetch({ [url("openai")]: RSS, [url("deepmind")]: 503 });
    await obtenerNoticiasIA();
    expect(console.error).toHaveBeenCalledWith(
      "[ia-noticias]",
      expect.objectContaining({ message: "deepmind: HTTP 503" }),
    );
  });

  it("lanza un error claro si ninguna fuente responde", async () => {
    mockFetch({});
    await expect(obtenerNoticiasIA()).rejects.toThrow("Ninguna fuente de noticias respondió");
  });
});
