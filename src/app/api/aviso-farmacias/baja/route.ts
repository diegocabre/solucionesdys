import type { NextRequest } from "next/server";
import { darDeBajaSuscripcion } from "@/lib/supabase/server";

// POST /api/aviso-farmacias/baja?token=…  → baja en un clic desde Gmail/Outlook (RFC 8058).
// El cliente de correo la llama sola al pulsar "Anular suscripción" junto al remitente.
// Solo POST: un GET (antivirus que abren enlaces) nunca da de baja a nadie.
export async function POST(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token") || "";
  try {
    const ok = await darDeBajaSuscripcion(token);
    return new Response(null, { status: ok ? 200 : 404 });
  } catch (error) {
    console.error("[aviso-farmacias] Error en la baja en un clic:", error);
    return new Response(null, { status: 500 });
  }
}
