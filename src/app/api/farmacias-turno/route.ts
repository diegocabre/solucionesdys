import type { NextRequest } from "next/server";
import { obtenerFarmaciasTurno, toSlug } from "@/lib/farmacias";
import { getClientIp, limitByIp } from "@/lib/rate-limit";

// Máx. 60 consultas por minuto por IP (solo cuentan las que llegan al servidor, no las del CDN).
const RATE_LIMIT_MAX = 60;
const RATE_LIMIT_WINDOW_SEC = 60;

// GET /api/farmacias-turno            → farmacias de turno de toda la zona de Puerto Varas
// GET /api/farmacias-turno?comuna=puerto-varas → solo una comuna
export async function GET(request: NextRequest) {
  const ip = getClientIp(request.headers);
  const limite = await limitByIp(`farmacias:${ip}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_SEC);
  if (!limite.success) {
    const segundos = Math.max(1, Math.ceil((limite.reset - Date.now()) / 1000));
    return Response.json(
      { error: "Demasiadas consultas seguidas. Intenta de nuevo en un momento." },
      { status: 429, headers: { "Retry-After": String(segundos), "Cache-Control": "no-store" } },
    );
  }

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
      {
        error: "No pudimos consultar las farmacias de turno en este momento.",
        // Motivo corto (p. ej. "MINSAL respondió 403") para diagnosticar sin abrir los logs.
        motivo: error instanceof Error ? error.message : "desconocido",
      },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
