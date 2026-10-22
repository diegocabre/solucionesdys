"use server";

import { randomBytes } from "node:crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { getRedis } from "@/lib/redis";
import { getClientIp, limitByIp } from "@/lib/rate-limit";
import { SITE_URL } from "@/lib/site";
import {
  ADMIN_EMAIL,
  COOKIE_SESION,
  DURACION_ENLACE_SEG,
  DURACION_SESION_SEG,
  exigirAdmin,
  firmarSesion,
  secretoSesion,
} from "@/lib/admin";
import { actualizarEstadoNegocio, type EstadoNegocio } from "@/lib/supabase/server";

const clave = (token: string) => `dys:admin:enlace:${token}`;
const TOKEN_REGEX = /^[0-9a-f]{64}$/;

// Respaldo en memoria solo para desarrollo local (sin Upstash).
const enlacesDev = new Map<string, number>();

async function guardarEnlace(token: string): Promise<boolean> {
  const redis = getRedis();
  if (redis) {
    await redis.set(clave(token), "1", { ex: DURACION_ENLACE_SEG });
    return true;
  }
  if (process.env.NODE_ENV === "production") {
    console.error("[admin] Upstash Redis no está configurado: no se pueden emitir enlaces de acceso.");
    return false;
  }
  enlacesDev.set(token, Date.now() + DURACION_ENLACE_SEG * 1000);
  return true;
}

/** Consume el enlace: sirve una sola vez. */
async function usarEnlace(token: string): Promise<boolean> {
  if (!TOKEN_REGEX.test(token)) return false;
  const redis = getRedis();
  if (redis) return (await redis.getdel(clave(token))) !== null;
  const expira = enlacesDev.get(token);
  enlacesDev.delete(token);
  return expira !== undefined && expira > Date.now();
}

export type LoginState = { enviado: boolean; error: string };

// Mismo mensaje sea o no el correo del administrador: no revela cuál es.
const ENVIADO: LoginState = { enviado: true, error: "" };

export async function pedirEnlace(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = (formData.get("email")?.toString() || "").trim().toLowerCase().slice(0, 254);

  const ip = getClientIp(await headers());
  const { success } = await limitByIp(`admin-login:${ip}`, 5, 10 * 60);
  if (!success) return { enviado: false, error: "Demasiados intentos. Espera unos minutos." };

  if (email !== ADMIN_EMAIL || !secretoSesion()) return ENVIADO;

  try {
    const token = randomBytes(32).toString("hex");
    if (!(await guardarEnlace(token))) return { enviado: false, error: "El acceso no está disponible ahora." };
    const enlace = `${SITE_URL}/admin/entrar?token=${token}`;
    const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send({
      from: "Panel Soluciones DyS <formulario@solucionesdys.cl>",
      to: ADMIN_EMAIL,
      subject: "Tu enlace para entrar al panel",
      text: `Entra al panel con este enlace (vale ${DURACION_ENLACE_SEG / 60} minutos y sirve una sola vez):\n${enlace}\n\nSi no lo pediste, ignora este correo.`,
    });
    if (error) throw new Error(error.message);
  } catch (error) {
    console.error("[admin] Error enviando el enlace de acceso:", error);
    return { enviado: false, error: "No pudimos enviar el enlace. Intenta de nuevo." };
  }
  return ENVIADO;
}

/** Botón de /admin/entrar: un POST, así los antivirus que abren el enlace no lo gastan. */
export async function entrar(formData: FormData): Promise<void> {
  const secreto = secretoSesion();
  const token = formData.get("token")?.toString() || "";
  if (!secreto || !(await usarEnlace(token))) redirect("/admin/login?error=enlace");

  const expira = Math.floor(Date.now() / 1000) + DURACION_SESION_SEG;
  (await cookies()).set(COOKIE_SESION, firmarSesion(expira, secreto), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: DURACION_SESION_SEG,
  });
  redirect("/admin/directorio");
}

export async function salir(): Promise<void> {
  (await cookies()).delete({ name: COOKIE_SESION, path: "/admin" });
  redirect("/admin/login");
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ESTADOS: EstadoNegocio[] = ["pendiente", "aprobado", "rechazado"];

/** Aprobar, rechazar, desactivar (aprobado → rechazado) o reactivar una ficha. */
export async function cambiarEstado(formData: FormData): Promise<void> {
  await exigirAdmin();
  const id = formData.get("id")?.toString() || "";
  const estado = formData.get("estado")?.toString() as EstadoNegocio;
  if (!UUID_REGEX.test(id) || !ESTADOS.includes(estado)) return;
  try {
    await actualizarEstadoNegocio(id, estado);
  } catch (error) {
    console.error("[admin] Error cambiando el estado del negocio:", error);
  }
  revalidatePath("/admin/directorio");
  revalidatePath("/comunidad/directorio");
}
