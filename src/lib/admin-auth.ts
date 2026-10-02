import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Sesión simple para el panel /admin: un token `payload.firma` (HMAC-SHA256)
// en una cookie httpOnly. Credenciales y secreto vienen de variables de entorno:
// ADMIN_EMAIL, ADMIN_PASSWORD y ADMIN_AUTH_SECRET (mínimo 32 caracteres).

export const ADMIN_COOKIE = "dys_admin";
export const SESSION_SECONDS = 8 * 60 * 60;

interface SessionPayload {
  sub: string;
  exp: number;
}

function getSecret(): string | null {
  const secret = process.env.ADMIN_AUTH_SECRET;
  if (!secret || secret.length < 32) return null;
  return secret;
}

export const isAdminConfigured = () =>
  Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD && getSecret());

const sign = (payload: string, secret: string) =>
  createHmac("sha256", secret).update(payload).digest("base64url");

// Compara en tiempo constante. Se comparan los hash para que el largo de los
// textos tampoco se filtre por el tiempo de respuesta.
function safeEqual(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function checkCredentials(email: string, password: string): boolean {
  const expectedEmail = process.env.ADMIN_EMAIL;
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedEmail || !expectedPassword || !getSecret()) return false;
  // Se evalúan ambas comparaciones siempre, sin cortocircuito.
  const emailOk = safeEqual(email.trim().toLowerCase(), expectedEmail.trim().toLowerCase());
  const passwordOk = safeEqual(password, expectedPassword);
  return emailOk && passwordOk;
}

export function createSessionToken(email: string): string {
  const secret = getSecret();
  if (!secret) throw new Error("ADMIN_AUTH_SECRET no está configurado o es muy corto.");
  const payload: SessionPayload = { sub: email, exp: Date.now() + SESSION_SECONDS * 1000 };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encoded}.${sign(encoded, secret)}`;
}

export function verifySessionToken(token: string): SessionPayload | null {
  const secret = getSecret();
  if (!secret) return null;
  const [encoded, signature, ...rest] = token.split(".");
  if (!encoded || !signature || rest.length > 0) return null;
  if (!safeEqual(signature, sign(encoded, secret))) return null;
  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as Partial<SessionPayload>;
    if (typeof payload.sub !== "string" || typeof payload.exp !== "number") return null;
    if (payload.exp < Date.now()) return null;
    return { sub: payload.sub, exp: payload.exp };
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<SessionPayload | null> {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  return token ? verifySessionToken(token) : null;
}

/** Para páginas y acciones del panel: sin sesión válida, al login. */
export async function requireAdmin(): Promise<SessionPayload> {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}
