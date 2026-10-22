"use server";

import { randomBytes } from "node:crypto";
import { headers } from "next/headers";
import { Resend } from "resend";
import { getClientIp, limitByIp } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";
import { EMAIL_REGEX, hashIp, sanitizeForHeader } from "@/lib/form-utils";
import { AVISO_FROM, correoConfirmacion, nombreComuna, urlConfirmar } from "@/lib/aviso-farmacias";
import {
  confirmarSuscripcion,
  darDeBajaSuscripcion,
  isSupabaseConfigured,
  registrarSuscripcion,
} from "@/lib/supabase/server";

export type AvisoState = { ok: boolean; mensaje: string };

// Siempre el mismo mensaje, exista o no el email: no revela quién está suscrito.
const ENVIADO: AvisoState = {
  ok: true,
  mensaje: "¡Listo! Te enviamos un correo para confirmar. Revisa tu bandeja de entrada (y la de spam).",
};

const ERROR: AvisoState = {
  ok: false,
  mensaje: "No pudimos registrar tu aviso. Intenta nuevamente en unos minutos.",
};

export async function suscribirAviso(_prev: AvisoState, formData: FormData): Promise<AvisoState> {
  // Honeypot: los bots lo rellenan; fingimos éxito sin hacer nada.
  if ((formData.get("hp_check_x9")?.toString() || "").trim() !== "") return ENVIADO;

  const email = sanitizeForHeader(formData.get("email")?.toString() || "").toLowerCase().slice(0, 254);
  const comunaSlug = formData.get("comuna")?.toString() || "";
  const comuna = nombreComuna(comunaSlug);

  if (!EMAIL_REGEX.test(email)) return { ok: false, mensaje: "Ingresa un correo electrónico válido." };
  if (!comuna) return { ok: false, mensaje: "Elige una comuna de la lista." };

  const headersList = await headers();
  const ip = getClientIp(headersList);
  const knownIp = ip === "desconocida" ? null : ip;

  const captcha = await verifyTurnstile(formData.get("cf-turnstile-response")?.toString() || "", knownIp);
  if (!captcha.ok) {
    console.warn("[aviso-farmacias] Turnstile rechazado:", captcha.reason);
    return {
      ok: false,
      mensaje: "No pudimos confirmar que no eres un robot. Espera el check de verificación e intenta de nuevo.",
    };
  }

  // Por IP (abuso del formulario) y por email (no inundar un buzón ajeno con confirmaciones).
  const [porIp, porEmail] = await Promise.all([
    limitByIp(`aviso:${ip}`, 5, 10 * 60),
    limitByIp(`aviso-email:${email}`, 3, 24 * 60 * 60),
  ]);
  if (!porIp.success) return { ok: false, mensaje: "Demasiados intentos. Intenta de nuevo en unos minutos." };
  if (!porEmail.success) return ENVIADO;

  if (!isSupabaseConfigured()) {
    console.error("[aviso-farmacias] Supabase no está configurado.");
    return ERROR;
  }

  try {
    const token = await registrarSuscripcion(
      email,
      comunaSlug,
      randomBytes(32).toString("hex"),
      knownIp ? hashIp(knownIp) : null,
    );
    const correo = correoConfirmacion(comuna, urlConfirmar(token, comunaSlug));
    const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send({
      from: AVISO_FROM,
      to: email,
      replyTo: "contacto@solucionesdys.cl",
      ...correo,
    });
    if (error) throw new Error(error.message);
    return ENVIADO;
  } catch (error) {
    console.error("[aviso-farmacias] Error registrando la suscripción:", error);
    return ERROR;
  }
}

export type ResultadoAviso = "confirmado" | "baja" | "invalido" | "error" | null;

/** Botón de la página /comunidad/farmacias-de-turno/aviso (confirmar o dar de baja). */
export async function gestionarAviso(_prev: ResultadoAviso, formData: FormData): Promise<ResultadoAviso> {
  const accion = formData.get("accion")?.toString();
  const token = formData.get("token")?.toString() || "";
  const comunaSlug = formData.get("comuna")?.toString() || "";

  try {
    if (accion === "confirmar" && nombreComuna(comunaSlug)) {
      return (await confirmarSuscripcion(token, comunaSlug)) ? "confirmado" : "invalido";
    }
    if (accion === "baja") {
      return (await darDeBajaSuscripcion(token)) ? "baja" : "invalido";
    }
    return "invalido";
  } catch (error) {
    console.error("[aviso-farmacias] Error gestionando la suscripción:", error);
    return "error";
  }
}
