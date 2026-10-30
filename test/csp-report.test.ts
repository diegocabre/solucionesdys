import { describe, expect, it } from "vitest";
import { resumirReportesCsp } from "@/lib/csp-report";

describe("reportes de CSP", () => {
  it("resume el formato report-uri y quita la query string", () => {
    const r = resumirReportesCsp(
      {
        "csp-report": {
          "document-uri": "https://www.solucionesdys.cl/contacto?email=a@b.cl",
          "violated-directive": "script-src-elem",
          "blocked-uri": "https://evil.example/x.js?t=1",
        },
      },
      "UA",
    );
    expect(r).toEqual([
      { directiva: "script-src-elem", bloqueado: "https://evil.example/x.js", pagina: "https://www.solucionesdys.cl/contacto", userAgent: "UA" },
    ]);
  });

  it("resume el formato report-to e ignora otros tipos de reporte", () => {
    const r = resumirReportesCsp(
      [
        { type: "deprecation", body: {} },
        {
          type: "csp-violation",
          url: "https://www.solucionesdys.cl/",
          user_agent: "Chrome",
          body: { effectiveDirective: "connect-src", blockedURL: "https://x.clarity.ms/collect", documentURL: "https://www.solucionesdys.cl/" },
        },
      ],
      "",
    );
    expect(r).toEqual([
      { directiva: "connect-src", bloqueado: "https://x.clarity.ms/collect", pagina: "https://www.solucionesdys.cl/", userAgent: "Chrome" },
    ]);
  });

  it("no falla con cuerpos inesperados", () => {
    expect(resumirReportesCsp(null, "")).toEqual([]);
    expect(resumirReportesCsp({ foo: 1 }, "")).toEqual([]);
    expect(resumirReportesCsp([{ type: "csp-violation", body: { blockedURL: "inline" } }], "")[0].bloqueado).toBe("inline");
  });
});
