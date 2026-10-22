import { describe, expect, it } from "vitest";
import { cabecerasBaja, correoDiario, nombreComuna, urlConfirmar } from "@/lib/aviso-farmacias";
import type { FarmaciaTurno } from "@/lib/farmacias";

const TOKEN = "a".repeat(64);

const farmacia = (over: Partial<FarmaciaTurno> = {}): FarmaciaTurno => ({
  id: "1",
  nombre: "Farmacia del Lago",
  comuna: "Puerto Varas",
  comunaSlug: "puerto-varas",
  localidad: "Puerto Varas",
  direccion: "Avenida del Salvador 400",
  telefono: "2234544",
  telefonoHref: "+56652234544",
  lat: -41.31,
  lng: -72.98,
  apertura: "09:00",
  cierre: "08:59",
  cruzaMedianoche: true,
  fecha: "2026-10-15",
  ...over,
});

describe("nombreComuna", () => {
  it("solo acepta comunas de la zona", () => {
    expect(nombreComuna("puerto-varas")).toBe("Puerto Varas");
    expect(nombreComuna("cochamo")).toBe("Cochamó");
    expect(nombreComuna("santiago")).toBeNull();
  });
});

describe("enlaces", () => {
  it("el enlace de confirmación lleva token y comuna", () => {
    expect(urlConfirmar(TOKEN, "frutillar")).toContain(`accion=confirmar&token=${TOKEN}&comuna=frutillar`);
  });
  it("la baja en un clic cumple RFC 8058", () => {
    const h = cabecerasBaja(TOKEN);
    expect(h["List-Unsubscribe-Post"]).toBe("List-Unsubscribe=One-Click");
    expect(h["List-Unsubscribe"]).toMatch(/^<https:\/\/.+\/api\/aviso-farmacias\/baja\?token=a{64}>$/);
  });
});

describe("correoDiario", () => {
  it("con una farmacia en la comuna, la nombra en el asunto", () => {
    const c = correoDiario("Puerto Varas", [farmacia()], [farmacia()], TOKEN);
    expect(c.subject).toBe("Farmacia de turno hoy en Puerto Varas: Farmacia del Lago");
    expect(c.html).toContain("tel:+56652234544");
    expect(c.text).toContain("accion=baja");
  });
  it("sin farmacia en la comuna, muestra las de la zona", () => {
    const c = correoDiario("Cochamó", [], [farmacia()], TOKEN);
    expect(c.subject).toBe("Hoy no hay farmacia de turno informada en Cochamó");
    expect(c.html).toContain("Farmacia del Lago");
  });
  it("escapa el HTML de los datos del MINSAL", () => {
    const c = correoDiario("Puerto Varas", [farmacia({ nombre: '<img src=x onerror="x">' })], [], TOKEN);
    expect(c.html).not.toContain("<img src=x");
    expect(c.html).toContain("&lt;img src=x");
  });
});
