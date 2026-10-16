import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const redisMock = vi.hoisted(() => ({ value: null as object | null }));
const limitMock = vi.hoisted(() => vi.fn());

vi.mock("@/lib/redis", () => ({ getRedis: () => redisMock.value }));
vi.mock("@upstash/ratelimit", () => {
  class Ratelimit {
    static slidingWindow = () => ({});
    limit = limitMock;
  }
  return { Ratelimit };
});

// Se importa de nuevo en cada test: el módulo guarda limitadores y contadores en memoria.
const cargar = async () => {
  vi.resetModules();
  return import("@/lib/rate-limit");
};

beforeEach(() => {
  redisMock.value = null;
  limitMock.mockReset();
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("getClientIp", () => {
  it("toma el primer valor válido de x-forwarded-for", async () => {
    const { getClientIp } = await cargar();
    expect(getClientIp(new Headers({ "x-forwarded-for": "203.0.113.7, 10.0.0.1" }))).toBe("203.0.113.7");
  });

  it("usa x-real-ip si x-forwarded-for no es una IP", async () => {
    const { getClientIp } = await cargar();
    expect(getClientIp(new Headers({ "x-forwarded-for": "basura", "x-real-ip": "2001:db8::1" }))).toBe("2001:db8::1");
  });

  it("devuelve 'desconocida' sin cabeceras válidas", async () => {
    const { getClientIp } = await cargar();
    expect(getClientIp(new Headers({ "x-forwarded-for": "x".repeat(500) }))).toBe("desconocida");
  });
});

describe("limitByIp", () => {
  it("sin Upstash en desarrollo usa el límite en memoria", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const { limitByIp } = await cargar();
    const resultados = [];
    for (let i = 0; i < 3; i++) resultados.push((await limitByIp("contacto:1.1.1.1", 2, 60)).success);
    expect(resultados).toEqual([true, true, false]);
    // Otra clave tiene su propio cupo.
    expect((await limitByIp("contacto:2.2.2.2", 2, 60)).success).toBe(true);
  });

  it("sin Upstash en producción rechaza (falla segura)", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const { limitByIp } = await cargar();
    expect((await limitByIp("contacto:1.1.1.1", 5, 60)).success).toBe(false);
  });

  it("con Upstash devuelve lo que responde el limitador", async () => {
    redisMock.value = {};
    limitMock.mockResolvedValue({ success: false, remaining: 0, reset: 123 });
    const { limitByIp } = await cargar();
    expect(await limitByIp("contacto:1.1.1.1", 5, 60)).toEqual({ success: false, remaining: 0, reset: 123 });
    expect(limitMock).toHaveBeenCalledWith("contacto:1.1.1.1");
  });

  it("si Upstash falla deja pasar la solicitud y lo registra", async () => {
    redisMock.value = {};
    limitMock.mockRejectedValue(new Error("Upstash caído"));
    const { limitByIp } = await cargar();
    const r = await limitByIp("contacto:1.1.1.1", 5, 60);
    expect(r.success).toBe(true);
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining("[rate-limit]"), expect.any(Error));
  });
});
