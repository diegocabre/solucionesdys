import { expect, it } from "vitest";
import { eventoDeEnlace } from "../src/lib/clarity";

it("clasifica los enlaces de contacto", () => {
  expect(eventoDeEnlace("https://wa.me/56947637541")).toBe("cta_whatsapp");
  expect(eventoDeEnlace("tel:+56947637541")).toBe("cta_telefono");
  expect(eventoDeEnlace("mailto:a@b.cl")).toBe("cta_correo");
  expect(eventoDeEnlace("/contacto?motivo=landing")).toBe("cta_cotizar");
  expect(eventoDeEnlace("/contactos")).toBeNull();
  expect(eventoDeEnlace("/webs")).toBeNull();
});
