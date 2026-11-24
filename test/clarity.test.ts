import { expect, it } from "vitest";
import { eventoDeEnlace, eventosDeClic } from "../src/lib/clarity";

it("clasifica los enlaces de contacto", () => {
  expect(eventoDeEnlace("https://wa.me/56947637541")).toBe("cta_whatsapp");
  expect(eventoDeEnlace("tel:+56947637541")).toBe("cta_telefono");
  expect(eventoDeEnlace("mailto:a@b.cl")).toBe("cta_correo");
  expect(eventoDeEnlace("/contacto?motivo=landing")).toBe("cta_cotizar");
  expect(eventoDeEnlace("/contactos")).toBeNull();
  expect(eventoDeEnlace("/webs")).toBeNull();
});

it("agrega la sección de origen y la demo tocada", () => {
  expect(eventosDeClic({ href: "https://wa.me/56947637541?text=x", seccion: "ruta-dys" })).toEqual([
    "cta_whatsapp",
    "cta_whatsapp_ruta_dys",
  ]);
  expect(eventosDeClic({ href: "/webs", seccion: "servicios", demo: "demo_cabanas" })).toEqual(["demo_cabanas"]);
  expect(eventosDeClic({ href: null, seccion: null, demo: null })).toEqual([]);
});
