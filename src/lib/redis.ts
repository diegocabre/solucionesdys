import "server-only";
import { Redis } from "@upstash/redis";

// Cliente compartido de Upstash Redis (rate limit, caché de farmacias).
// Acepta los nombres de Upstash y también los que crea la integración de
// Upstash en Vercel Marketplace (KV_REST_API_*), así sirve cualquiera de los dos.

let client: Redis | null | undefined;

export function getRedis(): Redis | null {
  if (client !== undefined) return client;

  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

  client = url && token ? new Redis({ url, token }) : null;
  return client;
}
