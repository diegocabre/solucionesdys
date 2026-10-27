"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { getClientIp, limitByIp } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";
import { escapeHtml, hashIp } from "@/lib/form-utils";
import { ADMIN_EMAIL } from "@/lib/admin";
import { SITE_URL } from "@/lib/site";
import { mailtoBienvenida, nombreComunaDirectorio, validarFicha } from "@/lib/directorio";
import { insertNegocio, isSupabaseConfigured } from "@/lib/supabase/server";

export type FichaState = { ok: boolean; mensaje: string };

const RECIBIDA: FichaState = {
  ok: true,
  mensaje: "¡Gracias! Recibimos tu ficha. La revisamos y te avisamos por correo cuando esté publicada.",
};

const ERROR: FichaState = {
  ok: false,
  mensaje: "No pudimos guardar tu ficha. Intenta nuevamente o escríbenos por WhatsApp al +56 9 4763 7541.",
};

export async function inscribirNegocio(_prev: FichaState, formData: FormData): Promise<FichaState> {
  // Honeypot: los bots lo rellenan; fingimos éxito sin guardar nada.
  if ((formData.get("hp_check_x9")?.toString() || "").trim() !== "") return RECIBIDA;

  const validacion = validarFicha(formData);
  if (!validacion.ok) return { ok: false, mensaje: validacion.error };
  const ficha = validacion.ficha;

  const headersList = await headers();
  const ip = getClientIp(headersList);
  const knownIp = ip === "desconocida" ? null : ip;

  const captcha = await verifyTurnstile(formData.get("cf-turnstile-response")?.toString() || "", knownIp);
  if (!captcha.ok) {
    console.warn("[directorio] Turnstile rechazado:", captcha.reason);
    return {
      ok: false,
      mensaje: "No pudimos confirmar que no eres un robot. Espera el check de verificación e intenta de nuevo.",
    };
  }

  const { success } = await limitByIp(`directorio:${ip}`, 3, 60 * 60);
  if (!success) return { ok: false, mensaje: "Ya enviaste varias fichas. Intenta de nuevo en una hora." };

  // Igual que el formulario de contacto: guardar primero y avisar por correo; solo si
  // fallan las dos cosas la ficha se pierde y hay que decírselo a la persona.
  let guardada = false;
  if (isSupabaseConfigured()) {
    try {
      await insertNegocio({ ...ficha, ip_hash: knownIp ? hashIp(knownIp) : null });
      guardada = true;
    } catch (error) {
      console.error("[directorio] Error guardando la ficha en Supabase:", error);
    }
  } else {
    console.warn("[directorio] Supabase no está configurado: la ficha solo se envía por correo.");
  }

  const texto =
    `Negocio: ${ficha.nombre}\nRubro: ${ficha.rubro}\nComuna: ${nombreComunaDirectorio(ficha.comuna_slug)}\n` +
    `Descripción: ${ficha.descripcion}\nTeléfono: ${ficha.telefono || "—"}\nSitio web: ${ficha.sitio_web || "—"}\n` +
    `Instagram: ${ficha.instagram ? `@${ficha.instagram}` : "—"}\n\nContacto: ${ficha.contacto_nombre} <${ficha.email_contacto}>\n` +
    `¿Le interesa un sitio web?: ${ficha.quiere_sitio ? "SÍ" : "no"}\n\n` +
    (guardada
      ? `Para publicarla: ${SITE_URL}/admin/directorio`
      : "(Esta ficha NO quedó guardada en la base de datos.)");
  // El botón abre el correo de bienvenida ya escrito, para enviarlo tras aprobar la ficha.
  // Hex de la paleta clara del kit: sin marco propio, el correo se ve sobre el blanco del cliente.
  const html =
    `<pre style="font-family:Arial,Helvetica,sans-serif; font-size:14px; line-height:1.5; white-space:pre-wrap;">${escapeHtml(texto)}</pre>` +
    `<p style="margin:24px 0 8px;"><a href="${escapeHtml(mailtoBienvenida(ficha))}" style="display:inline-block; padding:12px 22px; background:#05694A; color:#FFFFFF; border-radius:8px; font-family:Arial,Helvetica,sans-serif; font-weight:bold; text-decoration:none;">Preparar correo de bienvenida</a></p>` +
    `<p style="font-family:Arial,Helvetica,sans-serif; font-size:12px; color:#4B5560;">Úsalo después de aprobar la ficha: abre el correo ya escrito para que lo revises y lo envíes.</p>`;

  let notificada = false;
  try {
    const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send({
      from: "Directorio Web <formulario@solucionesdys.cl>",
      replyTo: ficha.email_contacto,
      to: ADMIN_EMAIL,
      subject: `${ficha.quiere_sitio ? "[Quiere sitio web] " : ""}Nueva ficha en el directorio: ${ficha.nombre}`,
      text: texto,
      html,
    });
    if (error) console.error("[directorio] Error enviando el aviso:", error);
    else notificada = true;
  } catch (error) {
    console.error("[directorio] Error enviando el aviso:", error);
  }

  return guardada || notificada ? RECIBIDA : ERROR;
}
