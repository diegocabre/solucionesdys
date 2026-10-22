import { describe, expect, it, vi } from "vitest";

// lib/admin importa next/headers y next/navigation; aquí solo se prueban las funciones puras.
vi.mock("next/headers", () => ({ cookies: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));

const { firmarSesion, verificarSesion } = await import("@/lib/admin");

const SECRETO = "s".repeat(40);
const AHORA = 1_800_000_000;

describe("sesión del panel", () => {
  it("acepta una cookie firmada y vigente", () => {
    expect(verificarSesion(firmarSesion(AHORA + 60, SECRETO), SECRETO, AHORA)).toBe(true);
  });
  it("rechaza una cookie expirada", () => {
    expect(verificarSesion(firmarSesion(AHORA - 1, SECRETO), SECRETO, AHORA)).toBe(false);
  });
  it("rechaza si se altera la expiración o la firma", () => {
    const [, firma] = firmarSesion(AHORA + 60, SECRETO).split(".");
    expect(verificarSesion(`${AHORA + 999999}.${firma}`, SECRETO, AHORA)).toBe(false);
    expect(verificarSesion(`${AHORA + 60}.${"0".repeat(64)}`, SECRETO, AHORA)).toBe(false);
  });
  it("rechaza con otro secreto, un secreto corto o sin cookie", () => {
    const valor = firmarSesion(AHORA + 60, SECRETO);
    expect(verificarSesion(valor, "o".repeat(40), AHORA)).toBe(false);
    expect(verificarSesion(valor, "corto", AHORA)).toBe(false);
    expect(verificarSesion(undefined, SECRETO, AHORA)).toBe(false);
    expect(verificarSesion("basura", SECRETO, AHORA)).toBe(false);
  });
});
