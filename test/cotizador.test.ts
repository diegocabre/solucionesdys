import { describe, expect, it } from 'vitest';
import { cotizar } from '@/lib/cotizador';

describe('cotizar', () => {
  it('sin extras devuelve el rango base', () => {
    expect(cotizar('landing', [], false)).toEqual({ min: 350_000, max: 500_000 });
  });

  it('suma montos fijos y porcentajes sobre la base', () => {
    // 650k–1.1M + blog 15 % (97.5k–165k) + textos (100k–200k)
    expect(cotizar('corporativo', ['blog', 'textos'], false)).toEqual({ min: 850_000, max: 1_470_000 });
  });

  it('la urgencia se aplica sobre el total y redondea a 10.000', () => {
    // (350k + 400k) × 1,3 = 975k ; (500k + 800k) × 1,3 = 1.69M
    expect(cotizar('landing', ['reservas'], true)).toEqual({ min: 980_000, max: 1_690_000 });
  });
});
