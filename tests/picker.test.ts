import { describe, it, expect } from 'vitest';
import type { Attempt, Criterion, Requeue } from '../src/lib/db';
import { conceptWeight, interleave, pick, recentAccuracy, targetDifficulty, type PickItem } from '../src/lib/picker';

const D = 86_400_000;
const NOW = Date.UTC(2026, 9, 20);
const items: PickItem[] = [];
for (const [concept, week] of [['a', 'w1'], ['b', 'w1'], ['c', 'w2'], ['d', 'w3']] as const)
  for (let i = 1; i <= 6; i++) items.push({ id: `${concept}${i}`, concept, unit: 'u', week, type: 'mcq' });
const att = (questionId: string, concept: string, correct: boolean, daysAgo: number, confidence?: 'sure' | 'guess'): Attempt => ({
  questionId, unit: 'u', concept, type: 'mcq', answer: 0, correct, confidence, durationMs: 1, sessionId: 's', at: NOW - daysAgo * D,
});

describe('conceptWeight', () => {
  it('ranks an error-prone, overconfident concept above a mastered one', () => {
    const attempts = [
      ...[1, 2, 3, 4].map((i) => att(`a${i}`, 'a', false, 1, 'sure')),
      ...[1, 2, 3, 4].map((i) => att(`b${i}`, 'b', true, 1, 'sure')),
    ];
    const secured: Criterion = { conceptId: 'b', correctInSession: 3, sessionId: 's', learnedAt: 1, relearnSessions: [1, 2, 3], securedAt: 4 };
    expect(conceptWeight('a', attempts, undefined, NOW)).toBeGreaterThan(conceptWeight('b', attempts, secured, NOW) * 2);
  });
  it('gives never-seen concepts a coverage bonus and stale concepts more weight than fresh ones', () => {
    const attempts = [att('c1', 'c', true, 0), att('d1', 'd', true, 13)];
    expect(conceptWeight('x', attempts, undefined, NOW)).toBeGreaterThan(conceptWeight('c', attempts, undefined, NOW));
    expect(conceptWeight('d', attempts, undefined, NOW)).toBeGreaterThan(conceptWeight('c', attempts, undefined, NOW));
  });
});

describe('pick', () => {
  it('serves due requeues first, in due order, then due relearns; skips undue requeues', () => {
    const requeue: Requeue[] = [
      { id: 1, itemId: 'c3', dueAt: NOW - 1000, reason: 'sure-wrong', done: 0 },
      { id: 2, itemId: 'a2', dueAt: NOW - 5000, reason: 'sure-wrong', done: 0 },
      { id: 3, itemId: 'd4', dueAt: NOW + 5000, reason: 'sure-wrong', done: 0 },
      { id: 4, itemId: 'b1', dueAt: NOW - 9000, reason: 'sure-wrong', done: 1 },
    ];
    const criteria = new Map<string, Criterion>([['d', { conceptId: 'd', correctInSession: 3, sessionId: 's', learnedAt: NOW - 3 * D, relearnSessions: [] }]]);
    const out = pick({ items, attempts: [], criteria, requeue, now: NOW, n: 8, seed: 7 });
    expect(out.slice(0, 2).map((q) => q.id)).toEqual(['a2', 'c3']);
    expect(out.slice(2).some((q) => q.concept === 'd')).toBe(true);
    expect(out.map((q) => q.id)).not.toContain('d4');
    expect(out.map((q) => q.id)).not.toContain('b1');
    expect(new Set(out.map((q) => q.id)).size).toBe(out.length);
    expect(out).toHaveLength(8);
  });

  it('weights toward the weak concept over many seeded sessions', () => {
    const attempts = [...[1, 2, 3].map((i) => att(`a${i}`, 'a', false, 2, 'sure')), ...[1, 2, 3].map((i) => att(`b${i}`, 'b', true, 0))];
    const count = { a: 0, b: 0 };
    for (let seed = 1; seed <= 60; seed++)
      for (const q of pick({ items, attempts, criteria: new Map(), requeue: [], now: NOW, n: 4, seed })) if (q.concept === 'a' || q.concept === 'b') count[q.concept]++;
    expect(count.a).toBeGreaterThan(count.b * 1.5);
  });

  it('prefers never-seen questions within a concept', () => {
    const attempts = [1, 2, 3, 4, 5].map((i) => att(`c${i}`, 'c', true, 1));
    const out = pick({ items: items.filter((q) => q.concept === 'c'), attempts, criteria: new Map(), requeue: [], now: NOW, n: 1, seed: 3 });
    expect(out[0].id).toBe('c6');
  });

  it('interleaves weeks (unit mode) and units (exam mode)', () => {
    const out = pick({ items, attempts: [], criteria: new Map(), requeue: [], now: NOW, n: 12, seed: 11 });
    for (let i = 1; i < out.length - 1; i++) if (out[i].week === out[i - 1].week) {
      // only allowed when no other week remains later in the list
      expect(out.slice(i).every((q) => q.week === out[i].week)).toBe(true);
    }
    const multi = items.map((q) => ({ ...q, unit: q.concept < 'c' ? 'u1' : 'u2' }));
    const ex = pick({ items: multi, attempts: [], criteria: new Map(), requeue: [], now: NOW, n: 10, mode: 'exam', seed: 5 });
    const switches = ex.slice(1).filter((q, i) => q.unit !== ex[i].unit).length;
    expect(switches).toBe(ex.length - 1); // strictly alternating units
    expect(ex.filter((q) => q.unit === 'u1')).toHaveLength(5);
  });

  it('interleave keeps every item', () => {
    expect(interleave([1, 1, 1, 2, 2, 3], String)).toEqual([1, 2, 1, 2, 1, 3]);
  });

  it('chooses within a concept by a target difficulty from recent accuracy, keeping never-seen first', () => {
    // Concept e: one question per difficulty 1–4; attempts on retired ids set the accuracy without "seeing" these.
    const graded: PickItem[] = [1, 2, 3, 4].map((d) => ({ id: `e-d${d}`, concept: 'e', unit: 'u', week: 'w4', type: 'mcq', difficulty: d }));
    const history = (rightOutOf10: number) => Array.from({ length: 10 }, (_, i) => att(`old${i}`, 'e', i < rightOutOf10, 1 + i / 10));
    const first = (attempts: Attempt[], seed: number, pool = graded) =>
      pick({ items: pool, attempts, criteria: new Map(), requeue: [], now: NOW, n: 1, seed })[0].difficulty;
    for (let seed = 1; seed <= 20; seed++) {
      expect([1, 2]).toContain(first(history(3), seed)); // accuracy 0.3 → 1–2
      expect([2, 3]).toContain(first(history(6), seed)); // 0.6 → 2–3
      expect([3, 4]).toContain(first(history(9), seed)); // 0.9 → 3–4
    }
    // Never-seen still outranks the target band: the in-band hard questions were seen, so the easy unseen one comes first.
    const seenHard = [att('e-d3', 'e', true, 2), att('e-d4', 'e', true, 2), ...history(9)];
    expect(first(seenHard, 4)).toBeLessThan(3);
    // With every question seen, the band decides before recency.
    const allSeen = [att('e-d1', 'e', true, 5), att('e-d2', 'e', true, 4), att('e-d3', 'e', true, 0.5), att('e-d4', 'e', true, 0.2), ...history(9)];
    expect([3, 4]).toContain(first(allSeen, 9));
    // No scored attempt yet: no band (least recently seen order is untouched).
    expect(targetDifficulty(recentAccuracy('e', []))).toBeNull();
    expect(targetDifficulty(0.5)).toEqual([2, 3]);
    expect(targetDifficulty(0.8)).toEqual([2, 3]);
    expect(targetDifficulty(0.81)).toEqual([3, 4]);
  });
});
