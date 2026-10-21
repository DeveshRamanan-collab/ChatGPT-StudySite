import { describe, it, expect, beforeEach } from 'vitest';
import { markFormat, lastFormat, accuracyByFormat, FORMAT_WINDOW } from '../src/lib/format-track';

// Node has no sessionStorage: a minimal in-memory one.
class MemoryStorage {
  private m = new Map<string, string>();
  get length() { return this.m.size; }
  clear() { this.m.clear(); }
  getItem(k: string) { return this.m.has(k) ? this.m.get(k)! : null; }
  key(i: number) { return [...this.m.keys()][i] ?? null; }
  removeItem(k: string) { this.m.delete(k); }
  setItem(k: string, v: string) { this.m.set(k, String(v)); }
}

beforeEach(() => {
  (globalThis as { sessionStorage?: unknown }).sessionStorage = new MemoryStorage();
});

describe('markFormat / lastFormat', () => {
  const T = 1_800_000_000_000;

  it('returns the format used for a concept within 15 minutes', () => {
    markFormat('c1', 'flow', T);
    expect(lastFormat('c1', T + 60_000)).toBe('flow');
    expect(lastFormat('c1', T + FORMAT_WINDOW)).toBe('flow');
  });

  it('forgets it after 15 minutes', () => {
    markFormat('c1', 'flow', T);
    expect(lastFormat('c1', T + FORMAT_WINDOW + 1)).toBeUndefined();
  });

  it('keeps one entry per concept, latest wins', () => {
    markFormat('c1', 'flow', T);
    markFormat('c1', 'listen', T + 1000);
    markFormat('c2', 'sheet', T + 2000);
    expect(lastFormat('c1', T + 5000)).toBe('listen');
    expect(lastFormat('c2', T + 5000)).toBe('sheet');
    expect(lastFormat('c3', T + 5000)).toBeUndefined();
  });

  it('ignores unknown formats and empty concepts', () => {
    markFormat('c1', 'podcast' as never, T);
    markFormat('', 'flow', T);
    expect(lastFormat('c1', T)).toBeUndefined();
    expect(sessionStorage.getItem('studysite:formats') ?? '{}').not.toContain('""');
  });

  it('survives corrupt storage and a missing sessionStorage', () => {
    sessionStorage.setItem('studysite:formats', '{not json');
    expect(lastFormat('c1', T)).toBeUndefined();
    markFormat('c1', 'visual', T);
    expect(lastFormat('c1', T)).toBe('visual');
    delete (globalThis as { sessionStorage?: unknown }).sessionStorage;
    expect(() => markFormat('c1', 'flow', T)).not.toThrow();
    expect(lastFormat('c1', T)).toBeUndefined();
  });
});

describe('accuracyByFormat', () => {
  it('groups by via, counts auto-marked and rubric scores, most-used first', () => {
    const rows = accuracyByFormat([
      { via: 'flow', correct: true },
      { via: 'flow', correct: false },
      { via: 'flow', correct: null, score: 0.5 },
      { via: 'listen', correct: true },
      { correct: false },
      { correct: true },
    ]);
    expect(rows).toEqual([
      { format: 'flow', attempts: 3, score: 1.5, accuracy: 0.5 },
      { format: 'none', attempts: 2, score: 1, accuracy: 0.5 },
      { format: 'listen', attempts: 1, score: 1, accuracy: 1 },
    ]);
  });

  it('skips unmarked rubric answers and can leave out attempts without a format', () => {
    const rows = accuracyByFormat([
      { via: 'sheet', correct: null },
      { via: 'sheet', correct: null, score: 1 },
      { correct: true },
    ], { includeNone: false });
    expect(rows).toEqual([{ format: 'sheet', attempts: 1, score: 1, accuracy: 1 }]);
  });

  it('clamps scores to 0–1 and breaks ties by name', () => {
    const rows = accuracyByFormat([
      { via: 'visual', correct: null, score: 1.4 },
      { via: 'explainer', correct: null, score: -1 },
    ]);
    expect(rows.map((r) => [r.format, r.score])).toEqual([['explainer', 0], ['visual', 1]]);
  });

  it('is empty for no attempts', () => {
    expect(accuracyByFormat([])).toEqual([]);
  });
});
