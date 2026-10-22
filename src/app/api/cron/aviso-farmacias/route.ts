import { Resend } from "resend";
import { getRedis } from "@/lib/redis";
import { filtrarPorComuna } from "@/lib/farmacias";
import { obtenerFarmaciasTurno } from "@/lib/farmacias-server";
import { AVISO_FROM, cabecerasBaja, correoDiario, nombreComuna } from "@/lib/aviso-farmacias";
import { isSupabaseConfigured, listarSuscripcionesActivas } from "@/lib/supabase/server";

// GET /api/cron/aviso-farmacias → lo llama el Cron de Vercel cada mañana (ver vercel.json).
// "0 14 * * *" es UTC: 11:00 en Chile con horario de verano y 10:00 en invierno, ya
// pasado el cambio de turno de las 09:00 (en el plan Hobby puede correr dentro de esa hora).
// Envía a cada suscripción confirmada la farmacia de turno de su comuna.
//
// shortcut: si a esa hora el MINSAL aún no publica el turno del día, ese día no se envía;
// si pasa seguido, agregar un segundo cron más tarde (el candado de Redis evita duplicados).

export const maxDuration = 300;

/** Máximo de correos por llamada a la API batch de Resend. */
const LOTE = 100;

export async function GET(request: Request) {
  // Vercel firma las llamadas del cron con CRON_SECRET; sin él, nadie más puede dispararlo.
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "No autorizado" }, { status: 401 });
  }
  if (!isSupabaseConfigured()) {
    console.error("[aviso-farmacias] Supabase no está configurado.");
    return Response.json({ error: "Supabase no configurado" }, { status: 500 });
  }

  const data = await obtenerFarmaciasTurno();
  if (data.farmacias.length === 0) {
    console.warn("[aviso-farmacias] El MINSAL aún no publica el turno del", data.fecha, "- no se envía.");
    return Response.json({ enviados: 0, motivo: "sin-turno-publicado", fecha: data.fecha });
  }

  // Un solo envío por turno aunque el cron se dispare dos veces.
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
