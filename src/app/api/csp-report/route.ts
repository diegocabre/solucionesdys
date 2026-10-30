import type { NextRequest } from "next/server";
import { resumirReportesCsp } from "@/lib/csp-report";

// Un reporte real pesa ~1 KB; la Reporting API puede agrupar varios en un envío.
const MAX_BYTES = 64 * 1024;

const TIPOS = ["application/csp-report", "application/reports+json", "application/json"];

// Lee el cuerpo cortando en MAX_BYTES aunque no venga Content-Length (envío chunked).
async function leerConLimite(request: NextRequest): Promise<string | null> {
  if (Number(request.headers.get("content-length") ?? 0) > MAX_BYTES) return null;
  if (!request.body) return "";
  const reader = request.body.getReader();
  const partes: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_BYTES) {
      await reader.cancel();
      return null;
    }
    partes.push(value);
  }
  return Buffer.concat(partes).toString("utf8");
}

// POST /api/csp-report: registra en los logs de Vercel un resumen de cada violación de CSP.
// No guarda nada ni registra IP, cookies ni query strings.
export async function POST(request: NextRequest) {
  const vacio = new Response(null, { status: 204 });

  const tipo = (request.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
  if (!TIPOS.includes(tipo)) return vacio;

  const texto = await leerConLimite(request);
  if (texto === null) return new Response(null, { status: 413 });

  let cuerpo: unknown;
  try {
    cuerpo = JSON.parse(texto);
  } catch {
    return vacio;
  }

  for (const r of resumirReportesCsp(cuerpo, request.headers.get("user-agent") ?? "")) {
    console.log(JSON.stringify({ csp: r }));
  }
  return vacio;
}
