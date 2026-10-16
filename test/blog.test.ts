import { describe, expect, it } from "vitest";
import { parsePost } from "@/lib/blog";

const post = (frontmatter: string, body = "Hola mundo.") => `---\n${frontmatter}\n---\n${body}`;

const BASE = [
  'title: "Mi artículo"',
  "description: Resumen corto",
  "date: 2026-10-12",
  "slug: mi-articulo",
].join("\n");

describe("parsePost (frontmatter del blog)", () => {
  it("lee los campos, quita comillas y parsea listas", () => {
    const p = parsePost(post(`${BASE}\ntags: [SEO local, "pymes"]\nciudad: Puerto Varas`), "mi-articulo.mdx");
    expect(p).toMatchObject({
      title: "Mi artículo",
      description: "Resumen corto",
      date: "2026-10-12",
      updated: "2026-10-12",
      slug: "mi-articulo",
      tags: ["SEO local", "pymes"],
      ciudad: "Puerto Varas",
      draft: false,
    });
  });

  it("acepta finales de línea CRLF y comentarios", () => {
    const source = post(`# comentario\n${BASE}\ndraft: true`).replace(/\n/g, "\r\n");
    const p = parsePost(source, "mi-articulo.mdx");
    expect(p.draft).toBe(true);
    expect(p.title).toBe("Mi artículo");
  });

  it("extrae los títulos ## y ### y calcula el tiempo de lectura", () => {
    const body = `## Primera parte\n\n${"palabra ".repeat(400)}\n\n### Detalle **importante**\n`;
    const p = parsePost(post(BASE, body), "mi-articulo.mdx");
    expect(p.headings.map((h) => [h.level, h.text])).toEqual([
      [2, "Primera parte"],
      [3, "Detalle importante"],
    ]);
    expect(p.readingMinutes).toBe(2);
  });

  it("falla si no hay frontmatter", () => {
    expect(() => parsePost("Sin encabezado", "x.mdx")).toThrow(/no tiene frontmatter/);
  });

  it("falla si falta un campo obligatorio", () => {
    expect(() => parsePost(post("date: 2026-10-12\nslug: mi-articulo"), "mi-articulo.mdx")).toThrow(/Falta "title"/);
  });

  it("falla con una fecha mal formada", () => {
    expect(() => parsePost(post(BASE.replace("2026-10-12", "12/10/2026")), "mi-articulo.mdx")).toThrow(
      /YYYY-MM-DD/,
    );
  });

  it("falla si el slug no coincide con el archivo", () => {
    expect(() => parsePost(post(BASE), "otro-nombre.mdx")).toThrow(/debe coincidir/);
  });

  it("falla con una línea sin dos puntos", () => {
    expect(() => parsePost(post(`${BASE}\nlinea invalida`), "mi-articulo.mdx")).toThrow(/Línea de frontmatter inválida/);
  });
});
