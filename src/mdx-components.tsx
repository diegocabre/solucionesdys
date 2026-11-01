import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import type { ReactNode } from "react";
import { slugify } from "@/lib/slugify";

// Estilos de los artículos del blog (content/blog/*.mdx). Requerido por @next/mdx.

function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (node && typeof node === "object" && "props" in node) {
    return textOf((node.props as { children?: ReactNode }).children);
  }
  return "";
}

const components: MDXComponents = {
  h2: ({ children }) => (
    <h2 id={slugify(textOf(children))} className="scroll-mt-28 text-titular-3 font-semibold text-dys-text mt-14 mb-4">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 id={slugify(textOf(children))} className="scroll-mt-28 text-xl font-bold text-dys-text mt-8 mb-3">
      {children}
    </h3>
  ),
  p: ({ children }) => <p className="text-lg text-dys-text leading-relaxed my-5">{children}</p>,
  ul: ({ children }) => <ul className="list-disc pl-6 space-y-2 my-5 text-lg text-dys-text">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-6 space-y-2 my-5 text-lg text-dys-text">{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold text-dys-text">{children}</strong>,
  blockquote: ({ children }) => (
    // Cita destacada: tipografía de titulares y un filete superior, sin barra lateral de color.
    <blockquote className="my-10 border-l-4 border-dys-text/30 pl-6 font-display [&_p]:my-0 [&_p]:text-xl sm:[&_p]:text-2xl [&_p]:font-medium [&_p]:leading-snug [&_p]:text-dys-text">
      {children}
    </blockquote>
  ),
  a: ({ href = "", children }) =>
    href.startsWith("/") ? (
      <Link href={href} className="text-dys-link underline underline-offset-2 hover:text-dys-text">
        {children}
      </Link>
    ) : (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-dys-link underline underline-offset-2 hover:text-dys-text"
      >
        {children}
      </a>
    ),
  table: ({ children }) => (
    <div className="overflow-x-auto my-6 rounded-xl border border-dys-border">
      <table className="w-full text-sm border-collapse">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="bg-dys-surface text-left font-semibold text-dys-text px-4 py-3 border-b border-dys-border">{children}</th>
  ),
  td: ({ children }) => <td className="px-4 py-3 border-b border-dys-border align-top text-dys-text">{children}</td>,
  hr: () => <hr className="my-10 border-dys-border" />,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
