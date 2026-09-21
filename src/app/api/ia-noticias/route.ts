import { obtenerNoticiasIA } from "@/lib/ia-noticias";

// GET /api/ia-noticias → últimas noticias de IA de fuentes oficiales, mezcladas y ordenadas por fecha.
export async function GET() {
  try {
    const data = await obtenerNoticiasIA();
    return Response.json(data, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
    });
  } catch (error) {
    console.error("[ia-noticias]", error);
    return Response.json(
      { error: "No pudimos cargar las noticias de IA en este momento." },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
