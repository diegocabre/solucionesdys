import "server-only";

// Verificación server-side de Cloudflare Turnstile.
// https://developers.cloudflare.com/turnstile/get-started/server-side-validation/

const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

interface SiteverifyResponse {
  success: boolean;
  "error-codes"?: string[];
  hostname?: string;
}

export type TurnstileResult = { ok: true } | { ok: false; reason: string };

export async function verifyTurnstile(token: string, ip: string | null): Promise<TurnstileResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[turnstile] Falta TURNSTILE_SECRET_KEY: se omite la verificación (solo desarrollo).");
      return { ok: true };
    }
    console.error("[turnstile] Falta TURNSTILE_SECRET_KEY en producción: se rechaza el envío.");
    return { ok: false, reason: "sin-configurar" };
  }

  if (!token || token.length > 2048) return { ok: false, reason: "sin-token" };

  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set("remoteip", ip);

  try {
    const res = await fetch(SITEVERIFY_URL, {
      method: "POST",
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    const data = (await res.json()) as SiteverifyResponse;
    if (data.success) return { ok: true };
    return { ok: false, reason: data["error-codes"]?.join(",") || "rechazado" };
  } catch (error) {
    console.error("[turnstile] Error verificando el token:", error);
    return { ok: false, reason: "error-red" };
  }
}
