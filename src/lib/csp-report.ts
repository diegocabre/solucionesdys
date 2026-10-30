// Resume los reportes de violación de CSP que mandan los navegadores a /api/csp-report.
// Llegan en dos formatos: el antiguo (report-uri, application/csp-report) y el de la
// Reporting API (report-to, application/reports+json, un arreglo de reportes).

export type ResumenCsp = {
  directiva: string;
  bloqueado: string;
  pagina: string;
  userAgent: string;
};

// Solo origen y ruta: la query string puede traer datos personales (correos, tokens, UTM).
function sinQuery(uri: unknown): string {
  if (typeof uri !== "string" || !uri) return "";
  try {
    const u = new URL(uri);
    return u.origin === "null" ? u.protocol.replace(":", "") : `${u.origin}${u.pathname}`;
  } catch {
    // "inline", "eval", "data", etc.
    return uri.slice(0, 100);
  }
}

function texto(v: unknown): string {
  return typeof v === "string" ? v.slice(0, 200) : "";
}

export function resumirReportesCsp(cuerpo: unknown, userAgent: string): ResumenCsp[] {
  // Formato report-uri: { "csp-report": { "violated-directive", "blocked-uri", "document-uri" } }
  if (cuerpo && typeof cuerpo === "object" && "csp-report" in cuerpo) {
    const r = (cuerpo as { "csp-report": Record<string, unknown> })["csp-report"] ?? {};
    return [
      {
        directiva: texto(r["effective-directive"] || r["violated-directive"]),
        bloqueado: sinQuery(r["blocked-uri"]),
        pagina: sinQuery(r["document-uri"]),
        userAgent: texto(userAgent),
      },
    ];
  }

  // Formato report-to: [{ type: "csp-violation", user_agent, body: { effectiveDirective, blockedURL, documentURL } }]
  if (Array.isArray(cuerpo)) {
    return cuerpo
      .filter((r) => r && typeof r === "object" && r.type === "csp-violation" && r.body)
      .slice(0, 20)
      .map((r) => ({
        directiva: texto(r.body.effectiveDirective),
        bloqueado: sinQuery(r.body.blockedURL),
        pagina: sinQuery(r.body.documentURL ?? r.url),
        userAgent: texto(r.user_agent || userAgent),
      }));
  }

  return [];
}
