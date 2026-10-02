import "server-only";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { slugify } from "@/lib/slugify";

// Blog: cada artículo es content/blog/<slug>.mdx con frontmatter YAML simple
// (clave: valor, y listas como [a, b]). Aquí se leen los metadatos para el
// listado, el sitemap y el RSS; el cuerpo lo compila @next/mdx al importarlo.

export const BLOG_DIR = path.join(process.cwd(), "content", "blog");

const WORDS_PER_MINUTE = 200;

export interface PostFrontmatter {
  title: string;
  description: string;
  /** YYYY-MM-DD */
  date: string;
  /** YYYY-MM-DD; si falta, se usa `date`. */
  updated: string;
  slug: string;
  tags: string[];
  ciudad: string;
  /** Con `draft: true` el artículo no se publica en producción. */
  draft: boolean;
}

export interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface Post extends PostFrontmatter {
  readingMinutes: number;
  headings: Heading[];
}

type RawFrontmatter = Record<string, string | string[]>;

function parseValue(raw: string): string | string[] {
  const value = raw.trim();
  if (value.startsWith("[") && value.endsWith("]")) {
    return value
      .slice(1, -1)
      .split(",")
      .map((v) => unquote(v.trim()))
      .filter(Boolean);
  }
  return unquote(value);
}

const unquote = (v: string) => v.replace(/^(["'])(.*)\1$/, "$2");

function splitFrontmatter(source: string, file: string): { data: RawFrontmatter; body: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(source);
  if (!match) throw new Error(`[blog] ${file} no tiene frontmatter.`);
  const data: RawFrontmatter = {};
  for (const line of match[1].split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const idx = line.indexOf(":");
    if (idx === -1) throw new Error(`[blog] Línea de frontmatter inválida en ${file}: "${line}"`);
    data[line.slice(0, idx).trim()] = parseValue(line.slice(idx + 1));
  }
  return { data, body: source.slice(match[0].length) };
}

function requireString(data: RawFrontmatter, key: string, file: string): string {
  const value = data[key];
  if (typeof value !== "string" || !value) throw new Error(`[blog] Falta "${key}" en ${file}.`);
  return value;
}

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function toFrontmatter(data: RawFrontmatter, file: string): PostFrontmatter {
  const date = requireString(data, "date", file);
  const updated = typeof data.updated === "string" && data.updated ? data.updated : date;
  if (!DATE_REGEX.test(date) || !DATE_REGEX.test(updated)) {
    throw new Error(`[blog] Fechas en formato YYYY-MM-DD en ${file}.`);
  }
  const slug = requireString(data, "slug", file);
  if (`${slug}.mdx` !== file) throw new Error(`[blog] El slug "${slug}" debe coincidir con el archivo ${file}.`);
  return {
    title: requireString(data, "title", file),
    description: requireString(data, "description", file),
    date,
    updated,
    slug,
    tags: Array.isArray(data.tags) ? data.tags : [],
    ciudad: typeof data.ciudad === "string" ? data.ciudad : "",
    draft: data.draft === "true",
  };
}

// Quita sintaxis markdown/JSX para contar palabras y armar el índice.
const plainText = (md: string) =>
  md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*_`#>|]/g, " ");

function extractHeadings(body: string): Heading[] {
  const headings: Heading[] = [];
  for (const line of body.split(/\r?\n/)) {
    const m = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!m) continue;
    const text = plainText(m[2]).replace(/\s+/g, " ").trim();
    headings.push({ id: slugify(text), text, level: m[1].length as 2 | 3 });
  }
  return headings;
}

function readPost(file: string): Post {
  const source = readFileSync(path.join(BLOG_DIR, file), "utf8");
  const { data, body } = splitFrontmatter(source, file);
  const words = plainText(body).split(/\s+/).filter(Boolean).length;
  return {
    ...toFrontmatter(data, file),
    readingMinutes: Math.max(1, Math.round(words / WORDS_PER_MINUTE)),
    headings: extractHeadings(body),
  };
}

const showDrafts = process.env.NODE_ENV !== "production";

/** Artículos visibles, del más nuevo al más antiguo. */
export function getPosts(): Post[] {
  return readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map(readPost)
    .filter((p) => !p.draft || showDrafts)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string): Post | undefined {
  return getPosts().find((p) => p.slug === slug);
}

/** Relacionados: más etiquetas en común (y misma ciudad) primero. */
export function getRelatedPosts(post: Post, limit = 3): Post[] {
  return getPosts()
    .filter((p) => p.slug !== post.slug)
    .map((p) => ({
      p,
      score: p.tags.filter((t) => post.tags.includes(t)).length + (p.ciudad === post.ciudad ? 0.5 : 0),
    }))
    .sort((a, b) => b.score - a.score || b.p.date.localeCompare(a.p.date))
    .slice(0, limit)
    .map(({ p }) => p);
}

export const formatPostDate = (date: string) =>
  new Intl.DateTimeFormat("es-CL", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${date}T12:00:00Z`),
  );
