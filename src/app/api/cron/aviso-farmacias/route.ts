import { Resend } from "resend";
import { getRedis } from "@/lib/redis";
import { filtrarPorComuna, type FarmaciasResponse } from "@/lib/farmacias";
import { obtenerFarmaciasTurno, registrarRespuestaExterna } from "@/lib/farmacias-server";
import { AVISO_FROM, cabecerasBaja, correoDiario, nombreComuna } from "@/lib/aviso-farmacias";
import { isSupabaseConfigured, listarSuscripcionesActivas } from "@/lib/supabase/server";

// Aviso diario de farmacia de turno. Envía a cada suscripción confirmada la farmacia de
// turno de su comuna. Ambos métodos exigen "Authorization: Bearer <CRON_SECRET>".
//
// POST /api/cron/aviso-farmacias  (cuerpo: la respuesta cruda del MINSAL, JSON)
//   Lo llama cada mañana una tarea programada en el PC de Diego (scripts/aviso-farmacias.ps1):
//   el Cloudflare del MINSAL bloquea a Vercel y a GitHub Actions (403), pero no a una IP
//   residencial chilena. Los datos se validan aquí igual que si los pidiera el servidor.
// GET /api/cron/aviso-farmacias
//   Pide los datos al MINSAL desde el servidor. Hoy falla por ese bloqueo; queda para cuando
//   el MINSAL vuelva a permitirlo.
//
// shortcut: si el PC está apagado ese día, no sale el aviso (la tarea se pone al día al encenderlo).

export const maxDuration = 300;

/** Máximo de correos por llamada a la API batch de Resend. */
const LOTE = 100;
/** La respuesta del MINSAL pesa ~150 KB; más que esto no es una respuesta válida. */
const MAX_CUERPO = 3 * 1024 * 1024;

function autorizado(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  return Boolean(secret) && request.headers.get("authorization") === `Bearer ${secret}`;
}

async function enviarAvisos(data: FarmaciasResponse): Promise<Response> {
  if (data.farmacias.length === 0) {
    console.warn("[aviso-farmacias] El MINSAL aún no publica el turno del", data.fecha, "- no se envía.");
    return Response.json({ enviados: 0, motivo: "sin-turno-publicado", fecha: data.fecha });
  }

  // Un solo envío por turno aunque se llame dos veces.
  const redis = getRedis();
  if (redis) {
    const candado = await redis.set(`dys:aviso-farmacias:${data.fecha}`, "1", { nx: true, ex: 36 * 60 * 60 });
    if (candado !== "OK") return Response.json({ enviados: 0, motivo: "ya-enviado", fecha: data.fecha });
  }

  const suscripciones = await listarSuscripcionesActivas();
  const correos = suscripciones.flatMap((s) => {
    const comuna = nombreComuna(s.comuna_slug);
    if (!comuna) return [];
    const correo = correoDiario(comuna, filtrarPorComuna(data, s.comuna_slug).farmacias, data.farmacias, s.token);
    return [{ from: AVISO_FROM, to: s.email, replyTo: "contacto@solucionesdys.cl", headers: cabecerasBaja(s.token), ...correo }];
  });

  const resend = new Resend(process.env.RESEND_API_KEY);
  let enviados = 0;
  let fallidos = 0;
  for (let i = 0; i < correos.length; i += LOTE) {
    const lote = correos.slice(i, i + LOTE);
    try {
      const { error } = await resend.batch.send(lote);
      if (error) throw new Error(error.message);
      enviados += lote.length;
    } catch (error) {
      fallidos += lote.length;
      console.error("[aviso-farmacias] Error enviando un lote:", error);
    }
  }

  console.info(`[aviso-farmacias] Turno ${data.fecha}: ${enviados} enviados, ${fallidos} fallidos.`);
  return Response.json({ enviados, fallidos, fecha: data.fecha }, { status: fallidos > 0 && enviados === 0 ? 502 : 200 });
}

function sinSupabase(): Response | null {
  if (isSupabaseConfigured()) return null;
  console.error("[aviso-farmacias] Supabase no está configurado.");
  return Response.json({ error: "Supabase no configurado" }, { status: 500 });
}

export async function GET(request: Request) {
  if (!autorizado(request)) return Response.json({ error: "No autorizado" }, { status: 401 });
  const error = sinSupabase();
  if (error) return error;

  let data: FarmaciasResponse;
  try {
    data = await obtenerFarmaciasTurno();
  } catch (e) {
    console.error("[aviso-farmacias] No se pudo consultar al MINSAL:", e);
    return Response.json({ error: "MINSAL no disponible" }, { status: 502 });
  }
  return enviarAvisos(data);
}

export async function POST(request: Request) {
  if (!autorizado(request)) return Response.json({ error: "No autorizado" }, { status: 401 });
  const error = sinSupabase();
  if (error) return error;

  const cuerpo = await request.text();
  if (cuerpo.length > MAX_CUERPO) return Response.json({ error: "Cuerpo demasiado grande" }, { status: 413 });

  let data: FarmaciasResponse;
  try {
    data = await registrarRespuestaExterna(JSON.parse(cuerpo));
  } catch (e) {
    console.error("[aviso-farmacias] Datos del MINSAL no válidos:", e);
    return Response.json({ error: "Datos del MINSAL no válidos" }, { status: 400 });
  }
  return enviarAvisos(data);
}
