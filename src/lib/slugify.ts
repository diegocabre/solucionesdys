// Convierte un título en un id de ancla: "¿Cuánto cuesta?" → "cuanto-cuesta".
// Se usa igual en el índice del artículo y en los <h2>/<h3> del MDX.
export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
