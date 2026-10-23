import { describe, expect, it } from "vitest";
import { mailtoBienvenida, normalizarInstagram, normalizarSitio, validarFicha } from "@/lib/directorio";

const ficha = (over: Record<string, string> = {}) => {
  const fd = new FormData();
  const base: Record<string, string> = {
    nombre: "Cabañas Los Alerces",
    rubro: "Alojamiento y turismo",
    comuna: "puerto-varas",
    descripcion: "Cabañas para 4 personas a orillas del lago.",
    contacto_nombre: "Ana",
    email: "Ana@Correo.cl",
    acepto: "on",
    ...over,
  };
  for (const [k, v] of Object.entries(base)) fd.set(k, v);
  return fd;
};

describe("normalizarSitio", () => {
  it("agrega https y acepta dominios", () => {
    expect(normalizarSitio("www.minegocio.cl")).toBe("https://www.minegocio.cl/");
    expect(normalizarSitio("http://minegocio.cl/carta")).toBe("http://minegocio.cl/carta");
  });
  it("rechaza esquemas peligrosos y basura", () => {
    expect(normalizarSitio("javascript:alert(1)")).toBeNull();
    expect(normalizarSitio("localhost")).toBeNull();
    expect(normalizarSitio("https://user:pass@evil.com")).toBeNull();
  });
});

describe("normalizarInstagram", () => {
  it("acepta @usuario, URL o usuario", () => {
    expect(normalizarInstagram("@mi.negocio")).toBe("mi.negocio");
    expect(normalizarInstagram("https://www.instagram.com/mi_negocio/?hl=es")).toBe("mi_negocio");
    expect(normalizarInstagram("minegocio")).toBe("minegocio");
  });
  it("rechaza caracteres inválidos", () => {
    expect(normalizarInstagram("mi negocio")).toBeNull();
    expect(normalizarInstagram("<script>")).toBeNull();
  });
});

describe("validarFicha", () => {
  it("acepta una ficha válida y normaliza el email", () => {
    const r = validarFicha(ficha({ instagram: "@alerces", quiere_sitio: "on" }));
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.ficha.email_contacto).toBe("ana@correo.cl");
      expect(r.ficha.instagram).toBe("alerces");
      expect(r.ficha.quiere_sitio).toBe(true);
      expect(r.ficha.sitio_web).toBeNull();
    }
  });
  it("quita saltos de línea de los textos", () => {
    const r = validarFicha(ficha({ nombre: "Café\r\nBcc: x@y.cl" }));
    expect(r.ok && r.ficha.nombre).toBe("Café Bcc: x@y.cl");
  });
  it("rechaza rubro o comuna fuera de la lista", () => {
    expect(validarFicha(ficha({ rubro: "Casino" })).ok).toBe(false);
    expect(validarFicha(ficha({ comuna: "santiago" })).ok).toBe(false);
  });
  it("exige la autorización para publicar", () => {
    const fd = ficha();
    fd.delete("acepto");
    expect(validarFicha(fd).ok).toBe(false);
  });
  it("rechaza sitio web inválido", () => {
    expect(validarFicha(ficha({ sitio_web: "javascript:alert(1)" })).ok).toBe(false);
  });
});

describe("mailtoBienvenida", () => {
  it("arma destinatario, asunto y cuerpo codificados", () => {
    const url = mailtoBienvenida({ nombre: "Café & Té", contacto_nombre: "Ana", email_contacto: "ana@correo.cl" });
    expect(url.startsWith("mailto:ana%40correo.cl?subject=")).toBe(true);
    const params = new URLSearchParams(url.split("?")[1]);
    expect(params.get("subject")).toBe("¡Café & Té ya está en el directorio de Puerto Varas! 🎉");
    expect(params.get("body")).toContain("Hola Ana:");
    expect(params.get("body")).toContain("https://www.solucionesdys.cl/comunidad/directorio");
  });
});

describe("validarFicha desde el panel", () => {
  it("no exige la casilla de autorización al editar", () => {
    const fd = ficha();
    fd.delete("acepto");
    expect(validarFicha(fd, { exigirAutorizacion: false }).ok).toBe(true);
  });
});
