import { describe, it, expect } from 'vitest';
import { tierFrom, band } from '../src/lib/tiers';

const a = (tier: 'worked' | 'faded' | 'full', score: number, at: number) => ({ type: 'long' as const, tier, score, at });

describe('tier promotion', () => {
  it('starts at worked', () => expect(tierFrom([])).toBe('worked'));
  it('two passes at ≥ 70% promote; a fail in between does not reset', () => {
    expect(tierFrom([a('worked', 0.72, 1), a('worked', 0.5, 2), a('worked', 0.8, 3)])).toBe('faded');
  });
  it('one pass is not enough; passes at other tiers do not count', () => {
    expect(tierFrom([a('worked', 0.9, 1), a('faded', 0.9, 2)])).toBe('worked');
  });
  it('promotes through to full and stays there', () => {
    expect(tierFrom([a('worked', 0.7, 1), a('worked', 0.7, 2), a('faded', 0.75, 3), a('faded', 0.9, 4), a('full', 0.9, 5), a('full', 0.9, 6)])).toBe('full');
  });
  it('bands', () => {
    expect(band(0.86)).toBe('High Distinction');
    expect(band(0.7)).toBe('Credit');
    expect(band(0.4)).toBe('Not yet a pass');
  });
});
