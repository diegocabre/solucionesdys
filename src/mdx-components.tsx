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
    <h2 id={slugify(textOf(children))} className="scroll-mt-28 text-2xl sm:text-3xl font-bold text-brand-primary mt-12 mb-4">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 id={slugify(textOf(children))} className="scroll-mt-28 text-xl font-bold text-brand-primary mt-8 mb-3">
      {children}
    </h3>
  ),
  p: ({ children }) => <p className="text-gray-700 leading-relaxed my-4">{children}</p>,
  ul: ({ children }) => <ul className="list-disc pl-6 space-y-2 my-4 text-gray-700">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-6 space-y-2 my-4 text-gray-700">{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold text-brand-primary">{children}</strong>,
  blockquote: ({ children }) => (
    // Cita destacada: tipografía de titulares y un filete superior, sin barra lateral de color.
    <blockquote className="my-10 border-t border-brand-accent/40 pt-6 font-display [&_p]:my-0 [&_p]:text-xl sm:[&_p]:text-2xl [&_p]:font-medium [&_p]:leading-snug [&_p]:text-brand-primary">
      {children}
    </blockquote>
  ),
  a: ({ href = "", children }) =>
    href.startsWith("/") ? (
      <Link href={href} className="text-brand-accent-dark underline underline-offset-2 hover:text-brand-primary">
        {children}
      </Link>
    ) : (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-brand-accent-dark underline underline-offset-2 hover:text-brand-primary"
      >
        {children}
      </a>
    ),
  table: ({ children }) => (
    <div className="overflow-x-auto my-6 rounded-2xl border border-gray-200">
      <table className="w-full text-sm border-collapse">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="bg-gray-50 text-left font-semibold text-brand-primary px-4 py-3 border-b border-gray-200">{children}</th>
  ),
  td: ({ children }) => <td className="px-4 py-3 border-b border-gray-100 align-top text-gray-700">{children}</td>,
  hr: () => <hr className="my-10 border-gray-200" />,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
