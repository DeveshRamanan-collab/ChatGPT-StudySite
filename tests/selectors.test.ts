import { describe, it, expect } from 'vitest';
import type { Attempt, Criterion } from '../src/lib/db';
import * as s from '../src/lib/selectors';

const T0 = Date.UTC(2026, 9, 20, 2, 0); // 20 Oct 2026 13:00 in Sydney (AEDT, UTC+11)
const H = 3_600_000, D = 24 * H;
let n = 0;
const at = (over: Partial<Attempt>): Attempt => ({
  questionId: `q${++n}`, unit: 'laws2400', concept: 'c1', type: 'mcq', answer: 0, correct: true, durationMs: 30_000, sessionId: 's1', at: T0, ...over,
});

describe('accuracyByConcept', () => {
  it('counts auto-marked and rubric-scored attempts', () => {
    const m = s.accuracyByConcept([
      at({ correct: true }), at({ correct: false }), at({ correct: null, score: 0.5 }), at({ concept: 'c2', correct: false }),
    ]);
    expect(m.get('c1')).toEqual({ n: 3, correct: 1.5, accuracy: 0.5 });
    expect(m.get('c2')!.accuracy).toBe(0);
  });
  it('ignores unmarked attempts', () => {
    expect(s.accuracyByConcept([at({ correct: null })]).size).toBe(0);
  });
});

describe('calibration', () => {
  it('reports accuracy per confidence level', () => {
    const c = s.calibration([
      at({ confidence: 'sure', correct: true }), at({ confidence: 'sure', correct: false }),
      at({ confidence: 'guess', correct: false }), at({ confidence: 'unsure', correct: true }), at({ correct: true }),
    ]);
    expect(c.sure).toEqual({ n: 2, correct: 1, accuracy: 0.5 });
    expect(c.unsure.accuracy).toBe(1);
    expect(c.guess.accuracy).toBe(0);
    expect(s.overconfident([at({ confidence: 'sure', correct: false }), at({ confidence: 'guess', correct: false })])).toHaveLength(1);
  });
});

describe('daysStudied (last 14, Sydney days)', () => {
  it('counts distinct days, not a streak, and ignores days outside the window', () => {
    const attempts = [at({ at: T0 }), at({ at: T0 - 1 * H }), at({ at: T0 - 2 * D }), at({ at: T0 - 13 * D }), at({ at: T0 - 14 * D }), at({ at: T0 - 30 * D })];
    expect(s.daysStudied(attempts, [], T0)).toEqual({ studied: 3, window: 14 });
  });
  it('uses the Sydney calendar day, not UTC', () => {
    // 14:30 UTC on 19 Oct = 01:30 on 20 Oct in Sydney → same day as T0.
    const late = Date.UTC(2026, 9, 19, 14, 30);
    expect(s.dayKey(late)).toBe('2026-10-20');
    expect(s.daysStudied([at({ at: late }), at({ at: T0 })], [], T0).studied).toBe(1);
  });
  it('counts a session start as a study day', () => {
    expect(s.daysStudied([], [{ id: 'x', start: T0 - 3 * D }], T0).studied).toBe(1);
  });
});

describe('minutesToday', () => {
  it('sums today only', () => {
    const m = s.minutesToday([at({ durationMs: 90_000 }), at({ durationMs: 90_000 }), at({ at: T0 - 2 * D, durationMs: 600_000 })], [], T0);
    expect(m).toBe(3);
  });
});

describe('due items', () => {
  it('orders due requeues by due time and skips done/future rows', () => {
    const rows = [
      { id: 1, itemId: 'a', dueAt: T0 - 10, reason: 'sure-wrong' as const, done: 0 as const },
      { id: 2, itemId: 'b', dueAt: T0 - 1000, reason: 'sure-wrong' as const, done: 0 as const },
      { id: 3, itemId: 'c', dueAt: T0 + 1000, reason: 'sure-wrong' as const, done: 0 as const },
      { id: 4, itemId: 'd', dueAt: T0 - 5000, reason: 'sure-wrong' as const, done: 1 as const },
    ];
    expect(s.dueRequeues(rows, T0).map((r) => r.itemId)).toEqual(['b', 'a']);
  });
  it('returns due cards soonest first', () => {
    const cards = [{ cardId: 'x', fsrs: {}, due: T0 - 1, reps: 1, lapses: 0 }, { cardId: 'y', fsrs: {}, due: T0 - 9, reps: 1, lapses: 0 }, { cardId: 'z', fsrs: {}, due: T0 + 9, reps: 1, lapses: 0 }];
    expect(s.dueCards(cards, T0).map((c) => c.cardId)).toEqual(['y', 'x']);
  });
});

describe('criterion progress and readiness', () => {
  const learned: Criterion = { conceptId: 'c1', correctInSession: 3, sessionId: 's1', learnedAt: T0, relearnSessions: [] };
  it('maps criterion states to progress and ring stages', () => {
    expect(s.criterionProgress(undefined)).toBe(0);
    expect(s.criterionProgress({ ...learned, learnedAt: undefined, correctInSession: 3 })).toBeCloseTo(1 / 3);
    expect(s.criterionProgress(learned)).toBe(0.5);
    expect(s.criterionProgress({ ...learned, relearnSessions: [1, 2] })).toBeCloseTo(0.5 + 2 / 6);
    expect(s.criterionProgress({ ...learned, securedAt: T0 })).toBe(1);
    expect(s.criterionStage({ ...learned, relearnSessions: [1] })).toEqual({ stage: 2, partial: 1 / 3 });
    expect(s.criterionStage({ ...learned, securedAt: T0 }).stage).toBe(4);
  });
  it('combines criterion (60%) and recent accuracy (40%) and compares with the exam-date target', () => {
    const crit = new Map([['c1', { ...learned, securedAt: T0 }]]);
    const r = s.readiness(['c1', 'c2'], crit, [at({ concept: 'c1', correct: true }), at({ concept: 'c2', correct: false })], T0 + 21 * D, T0);
    expect(r.readiness).toBeCloseTo(0.6 * 0.5 + 0.4 * 0.5);
    expect(r.daysToExam).toBe(21);
    expect(r.target).toBeCloseTo(0.45);
    expect(r.onTrack).toBe(true);
    expect(r.coverage).toBe(1);
  });
  it('is not on track with no work close to the exam', () => {
    const r = s.readiness(['c1'], new Map(), [], T0 + 3 * D, T0);
    expect(r.readiness).toBe(0);
    expect(r.onTrack).toBe(false);
  });
});

import { conceptMastery, attemptsByConcept, dailySeries } from '../src/lib/selectors';
describe('dashboard selectors', () => {
  it('concept mastery blends criterion and accuracy; daily series marks studied days', () => {
    const now = Date.UTC(2026, 9, 10, 2);
    const mk = (at: number, correct: boolean) => ({ questionId: 'q', unit: 'u', concept: 'k', type: 'mcq' as const, answer: 0, correct, durationMs: 1000, sessionId: 's', at });
    const atts = [mk(now - 3600e3, true), mk(now - 3600e3, false), mk(now - 3 * 86400e3, true)];
    const m = conceptMastery('k', new Map(), attemptsByConcept(atts));
    expect(m).toBeCloseTo(0.4 * (2 / 3));
    const s = dailySeries(atts, [], now, 14);
    expect(s).toHaveLength(14);
    expect(s[13].studied).toBe(true);
    expect(s[13].accuracy).toBe(0.5);
    expect(s.filter((d) => d.studied)).toHaveLength(2);
  });
});
