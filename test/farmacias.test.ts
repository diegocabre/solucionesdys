import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { normalizarRespuesta, turnoVigente } from "@/lib/farmacias";

// 2026-10-15 15:00 en Santiago (UTC-3): el turno vigente es el del 2026-10-15.
const AHORA = new Date("2026-10-15T18:00:00Z");

const local = (over: Record<string, string> = {}) => ({
  fecha: "2026-10-15",
  local_id: "1",
  local_nombre: "FARMACIA  DEL   LAGO",
  comuna_nombre: "PUERTO VARAS",
  localidad_nombre: "PUERTO VARAS",
  local_direccion: "AVENIDA DEL SALVADOR  400",
  funcionamiento_hora_apertura: "09:00:00",
  funcionamiento_hora_cierre: "08:59:00",
  local_telefono: "2234544",
  local_lat: "-41.31",
  local_lng: "-72.98",
  ...over,
});

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(AHORA);
});

afterEach(() => {
  vi.useRealTimers();
});

describe("turnoVigente", () => {
  it("antes de las 09:00 de Santiago sigue el turno del día anterior", () => {
    expect(turnoVigente(new Date("2026-10-15T11:00:00Z")).fechaVigente).toBe("2026-10-14");
    expect(turnoVigente(AHORA)).toMatchObject({ fechaVigente: "2026-10-15", fechaAnterior: "2026-10-14" });
  });
});

describe("normalizarRespuesta", () => {
  it("limpia textos, normaliza teléfono y coordenadas", () => {
    const r = normalizarRespuesta([local()]);
    expect(r.fecha).toBe("2026-10-15");
    expect(r.total).toBe(1);
    expect(r.farmacias[0]).toMatchObject({
      nombre: "Farmacia del Lago",
      comuna: "Puerto Varas",
      comunaSlug: "puerto-varas",
      direccion: "Avenida del Salvador 400",
      telefonoHref: "+56652234544",
      lat: -41.31,
      lng: -72.98,
      apertura: "09:00",
      cierre: "08:59",
      cruzaMedianoche: true,
    });
  });

  it("descarta comunas fuera de la zona y ordena por comuna", () => {
    const r = normalizarRespuesta([
      local({ local_id: "2", comuna_nombre: "FRUTILLAR" }),
      local({ local_id: "3", comuna_nombre: "SANTIAGO" }),
      local({ local_id: "1" }),
    ]);
    expect(r.farmacias.map((f) => f.id)).toEqual(["1", "2"]);
  });

  it("separa otras fechas y descarta registros viejos", () => {
    const r = normalizarRespuesta([
      local({ local_id: "hoy" }),
      local({ local_id: "ayer", fecha: "2026-10-14" }),
      local({ local_id: "viejo", fecha: "2026-09-01" }),
    ]);
    expect(r.farmacias.map((f) => f.id)).toEqual(["hoy"]);
    expect(r.otrasFechas.map((f) => f.id)).toEqual(["ayer"]);
  });

  it("filtra por comuna cuando se pide", () => {
    const r = normalizarRespuesta([local(), local({ local_id: "2", comuna_nombre: "LLANQUIHUE" })], "llanquihue");
    expect(r.farmacias.map((f) => f.id)).toEqual(["2"]);
    expect(r.total).toBe(1);
  });

  it("no genera enlace tel: con teléfonos inválidos", () => {
    expect(normalizarRespuesta([local({ local_telefono: "123" })]).farmacias[0].telefonoHref).toBeNull();
  });

  it("lanza error si la respuesta no es una lista, viene vacía o está malformada", () => {
    expect(() => normalizarRespuesta({ error: true })).toThrow(/no es una lista/);
    expect(() => normalizarRespuesta([])).toThrow(/lista vacía/);
    expect(() => normalizarRespuesta([local(), { basura: 1 }])).toThrow(/malformada/);
  });
});
