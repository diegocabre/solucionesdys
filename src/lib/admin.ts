import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Acceso al panel /admin: un solo administrador, que entra con un enlace mágico enviado a
// su correo (ver src/app/admin/actions.ts). La sesión es una cookie httpOnly firmada con
// HMAC-SHA256 usando ADMIN_SESSION_SECRET; sin ese secreto nadie puede entrar.

export const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "desarrollador@solucionesdys.cl").toLowerCase();

export const COOKIE_SESION = "dys_admin";
export const DURACION_SESION_SEG = 7 * 24 * 60 * 60;
/** Vigencia del enlace mágico. */
export const DURACION_ENLACE_SEG = 15 * 60;

const firma = (expira: number, secreto: string) =>
  createHmac("sha256", secreto).update(`admin:${expira}`).digest("hex");

/** Valor de la cookie: "<expira en segundos epoch>.<firma>". */
export function firmarSesion(expira: number, secreto: string): string {
  return `${expira}.${firma(expira, secreto)}`;
}

/** true si la cookie tiene una firma válida y no ha expirado. */
export function verificarSesion(valor: string | undefined, secreto: string, ahoraSeg = Math.floor(Date.now() / 1000)): boolean {
  if (!valor || secreto.length < 32) return false;
  const [expiraTxt, recibida = ""] = valor.split(".");
  const expira = Number(expiraTxt);
  if (!Number.isInteger(expira) || expira <= ahoraSeg) return false;
  const esperada = Buffer.from(firma(expira, secreto), "hex");
  const dada = Buffer.from(recibida, "hex");
  return dada.length === esperada.length && timingSafeEqual(dada, esperada);
}

export function secretoSesion(): string | null {
  const secreto = process.env.ADMIN_SESSION_SECRET;
  if (!secreto || secreto.length < 32) {
    console.error("[admin] Falta ADMIN_SESSION_SECRET (mínimo 32 caracteres): el panel queda cerrado.");
    return null;
  }
  return secreto;
}

export async function esAdmin(): Promise<boolean> {
  const secreto = secretoSesion();
  if (!secreto) return false;
  return verificarSesion((await cookies()).get(COOKIE_SESION)?.value, secreto);
}

/** Para páginas y server actions del panel: sin sesión válida, al login. */
export async function exigirAdmin(): Promise<void> {
  if (!(await esAdmin())) redirect("/admin/login");
}
