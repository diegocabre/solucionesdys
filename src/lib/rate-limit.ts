import "server-only";
import { isIP } from "node:net";
import { Ratelimit } from "@upstash/ratelimit";
import { getRedis } from "@/lib/redis";

// Rate limit con ventana deslizante (sliding window) guardado en Upstash Redis,
// compartido entre todas las instancias serverless de Vercel.
//
// - Sin variables de Upstash en desarrollo: usa un respaldo en memoria y avisa.
// - Sin variables en producción: rechaza (falla segura) y registra el error.
// - Si Upstash no responde (caída puntual), deja pasar y registra el error: el
//   formulario sigue protegido por Turnstile y el honeypot, y así no perdemos
//   consultas reales por una falla de un tercero.

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  /** Momento (ms epoch) en que se libera el próximo cupo. */
  reset: number;
}

type Duration = `${number} s`;

const limiters = new Map<string, Ratelimit>();

function getLimiter(max: number, windowSec: number): Ratelimit | null {
  const redis = getRedis();
  if (!redis) return null;

  const id = `${max}:${windowSec}`;
  let limiter = limiters.get(id);
  if (!limiter) {
    const window: Duration = `${windowSec} s`;
    limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(max, window),
      prefix: "dys:rl",
      // Si Upstash tarda más que esto, la librería deja pasar la solicitud.
      timeout: 3000,
    });
    limiters.set(id, limiter);
  }
  return limiter;
}

// Respaldo en memoria solo para desarrollo local (se pierde al reiniciar).
const memoria = new Map<string, number[]>();
let avisoMostrado = false;

function limitarEnMemoria(key: string, max: number, windowSec: number): RateLimitResult {
  if (!avisoMostrado) {
    console.warn(
      "[rate-limit] Faltan UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN: usando límite en memoria (solo desarrollo).",
    );
    avisoMostrado = true;
  }
  const ahora = Date.now();
  const ventanaMs = windowSec * 1000;
  const recientes = (memoria.get(key) ?? []).filter((t) => ahora - t < ventanaMs);
  const success = recientes.length < max;
  if (success) recientes.push(ahora);
  memoria.set(key, recientes);
  return {
    success,
    remaining: Math.max(0, max - recientes.length),
    reset: (recientes[0] ?? ahora) + ventanaMs,
  };
}

/**
 * Cuenta un intento para `key` (p. ej. "contacto:203.0.113.7") y dice si está
 * dentro del límite de `max` intentos por cada `windowSec` segundos.
 */
export async function limitByIp(key: string, max: number, windowSec: number): Promise<RateLimitResult> {
  const limiter = getLimiter(max, windowSec);

  if (!limiter) {
    if (process.env.NODE_ENV !== "production") return limitarEnMemoria(key, max, windowSec);
    console.error("[rate-limit] Upstash Redis no está configurado en producción: se rechaza la solicitud.");
    return { success: false, remaining: 0, reset: Date.now() + windowSec * 1000 };
  }

  try {
    const { success, remaining, reset } = await limiter.limit(key);
    return { success, remaining, reset };
  } catch (error) {
    console.error("[rate-limit] Error consultando Upstash, se deja pasar la solicitud:", error);
    return { success: true, remaining: max, reset: Date.now() + windowSec * 1000 };
  }
}

/**
 * IP del visitante. En Vercel, `x-forwarded-for` la fija el propio proxy y el
 * primer valor es el cliente real. Se valida el formato para no usar basura
 * (o un valor inyectado gigante) como clave.
 */
export function getClientIp(headers: Headers): string {
  const candidatos = [
    headers.get("x-forwarded-for")?.split(",")[0],
    headers.get("x-real-ip"),
  ];
  for (const raw of candidatos) {
    const ip = raw?.trim().slice(0, 64);
    if (ip && isIP(ip) !== 0) return ip;
  }
  return "desconocida";
}
