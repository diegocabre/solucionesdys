import "server-only";
import { createHash } from "node:crypto";

// Utilidades compartidas por los formularios del sitio (contacto, aviso de farmacias, directorio).

export const EMAIL_REGEX = /^[^\s@"<>,]+@[^\s@"<>,]+\.[^\s@"<>,]+$/;
// Teléfono opcional: dígitos, espacios, guiones, paréntesis y un + inicial.
export const PHONE_REGEX = /^\+?[\d\s()-]{8,20}$/;

// Quita saltos de línea y caracteres de control para evitar inyección de
// cabeceras SMTP (CRLF injection) cuando el valor se usa en headers de email.
export function sanitizeForHeader(value: string): string {
  return value.replace(/[\r\n\t\0]/g, " ").trim();
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Hash de la IP con sal: permite detectar abuso repetido sin guardar la IP en claro.
export function hashIp(ip: string): string | null {
  const salt = process.env.LEAD_IP_HASH_SALT;
  if (!salt) {
    console.warn("[leads] Falta LEAD_IP_HASH_SALT: el registro se guarda sin ip_hash.");
    return null;
  }
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}
