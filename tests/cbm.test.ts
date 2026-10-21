import { describe, it, expect } from 'vitest';
import { cbm, cbmTotals, certaintyToConfidence } from '../src/lib/cbm';

describe('certainty-based marking', () => {
  it('scores C1/C2/C3 as +1/+2/+3 right and 0/−2/−6 wrong', () => {
    expect([cbm(1, true), cbm(2, true), cbm(3, true)]).toEqual([1, 2, 3]);
    expect([cbm(1, false), cbm(2, false), cbm(3, false)]).toEqual([0, -2, -6]);
  });
  it('totals a paper and reports accuracy per certainty level', () => {
    const t = cbmTotals([
      { certainty: 3, correct: true }, { certainty: 3, correct: false }, { certainty: 2, correct: true }, { certainty: 1, correct: false },
    ]);
    expect(t.score).toBe(3 - 6 + 2 + 0);
    expect(t.max).toBe(12);
    expect(t.accuracy).toBe(0.5);
    expect(t.byLevel.find((l) => l.level === 3)).toEqual({ level: 3, n: 2, accuracy: 0.5 });
  });
  it('rewards honest uncertainty: C1 on a coin-flip beats C3', () => {
    const coinFlip = (c: 1 | 2 | 3) => (cbm(c, true) + cbm(c, false)) / 2;
    expect(coinFlip(1)).toBeGreaterThan(coinFlip(3));
    expect(certaintyToConfidence(3)).toBe('sure');
  });
});
