import type { NextRequest } from "next/server";
import { obtenerFarmaciasTurno, toSlug } from "@/lib/farmacias";

// GET /api/farmacias-turno            → farmacias de turno de toda la zona de Puerto Varas
// GET /api/farmacias-turno?comuna=puerto-varas → solo una comuna
export async function GET(request: NextRequest) {
  const comuna = request.nextUrl.searchParams.get("comuna");

  try {
    const data = await obtenerFarmaciasTurno(comuna ? toSlug(comuna) : undefined);
    return Response.json(data, {
      headers: {
        // El turno cambia una vez al día: 15 min de caché en CDN es más que suficiente.
        "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600",
      },
    });
  } catch (error) {
    console.error("[farmacias-turno]", error);
    return Response.json(
      { error: "No pudimos consultar las farmacias de turno en este momento." },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
