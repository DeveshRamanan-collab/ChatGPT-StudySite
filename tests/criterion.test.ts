import { describe, it, expect } from 'vitest';
import type { Attempt, Criterion } from '../src/lib/db';
import { apply, dueRelearns, isCorrect } from '../src/lib/criterion';
import { criterionStage } from '../src/lib/selectors';

const D = 86_400_000;
const T0 = Date.UTC(2026, 9, 1);
const att = (sessionId: string, at: number, correct: boolean | null = true, score?: number): Attempt => ({
  questionId: 'q', unit: 'u', concept: 'c', type: 'mcq', answer: 0, correct, score, durationMs: 1000, sessionId, at,
});
const run = (attempts: Attempt[], start?: Criterion) => attempts.reduce<Criterion | undefined>((c, a) => apply(c, a), start)!;

describe('criterion loop simulation', () => {
  it('3 correct recalls in one session → learned', () => {
    const c = run([att('s1', T0), att('s1', T0 + 1), att('s1', T0 + 2, false), att('s1', T0 + 3)]);
    expect(c.learnedAt).toBe(T0 + 3);
    expect(criterionStage(c).stage).toBe(2);
  });

  it('correct answers split across sessions do not count toward learned', () => {
    const c = run([att('s1', T0), att('s1', T0 + 1), att('s2', T0 + D), att('s2', T0 + D + 1)]);
    expect(c.learnedAt).toBeUndefined();
    expect(c.correctInSession).toBe(2);
  });

  it('then 3 spaced relearn sessions (≥ 2 days apart, ≥ 1 correct each) → secured', () => {
    let c = run([att('s1', T0), att('s1', T0 + 1), att('s1', T0 + 2)]);
    c = apply(c, att('s2', T0 + 1 * D)); // too soon: 1 day
    expect(c.relearnSessions).toHaveLength(0);
    c = apply(c, att('s3', T0 + 2 * D + 2)); // relearn 1 (exactly 2 days after learnedAt)
    c = apply(c, att('s3', T0 + 2 * D + 60_000)); // same session: no double count
    expect(c.relearnSessions).toHaveLength(1);
    c = apply(c, att('s4', T0 + 5 * D, false)); // wrong only: no relearn
    expect(c.relearnSessions).toHaveLength(1);
    c = apply(c, att('s4', T0 + 5 * D + 1)); // relearn 2
    c = apply(c, att('s5', T0 + 9 * D)); // relearn 3 → secured
    expect(c.relearnSessions).toEqual([T0 + 2 * D + 2, T0 + 5 * D + 1, T0 + 9 * D]);
    expect(c.securedAt).toBe(T0 + 9 * D);
    expect(criterionStage(c)).toEqual({ stage: 4, partial: 0 });
  });

  it('rubric answers count as correct at ≥ 70%', () => {
    expect(isCorrect({ correct: null, score: 0.7 })).toBe(true);
    expect(isCorrect({ correct: null, score: 0.69 })).toBe(false);
  });

  it('reports due relearns oldest first', () => {
    const a = run([att('a', T0), att('a', T0 + 1), att('a', T0 + 2)]);
    const b = run([att('b', T0 + D), att('b', T0 + D + 1), att('b', T0 + D + 2)]);
    expect(dueRelearns([{ ...b, conceptId: 'b' }, { ...a, conceptId: 'a' }], T0 + 4 * D).map((c) => c.conceptId)).toEqual(['a', 'b']);
    expect(dueRelearns([a], T0 + D)).toEqual([]);
  });
});
