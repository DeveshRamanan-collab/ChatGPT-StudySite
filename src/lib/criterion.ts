// Criterion learning loop (CLAUDE.md research rules):
//   learning → 3 correct recalls within one session → LEARNED
//   → each later session with ≥ 1 correct, ≥ 2 days after the previous milestone → one RELEARN
//   → 3 relearns → SECURED.
// Pure: apply(criterion, attempt) returns the next state; recordAttempt persists it.
import type { Attempt, Criterion } from './db';

export const LEARN_TARGET = 3;
export const RELEARN_TARGET = 3;
export const RELEARN_GAP = 2 * 86_400_000;
/** Rubric-marked answers count as a correct recall at ≥ 70%. */
export const PASS_SCORE = 0.7;

export const isCorrect = (a: Pick<Attempt, 'correct' | 'score'>) => a.correct === true || (a.correct === null && (a.score ?? 0) >= PASS_SCORE);

export function apply(prev: Criterion | undefined, a: Attempt): Criterion {
  const c: Criterion = prev
    ? { ...prev, relearnSessions: [...prev.relearnSessions] }
    : { conceptId: a.concept, correctInSession: 0, sessionId: a.sessionId, relearnSessions: [] };
  const correct = isCorrect(a);

  if (c.securedAt) {
    if (correct) c.lastCorrectAt = a.at;
    return c;
  }

  if (!c.learnedAt) {
    if (c.sessionId !== a.sessionId) {
      c.sessionId = a.sessionId;
      c.correctInSession = 0;
    }
    if (correct) {
      c.correctInSession += 1;
      c.lastCorrectAt = a.at;
      if (c.correctInSession >= LEARN_TARGET) c.learnedAt = a.at;
    }
    return c;
  }

  // Relearning phase.
  if (!correct) return c;
  const lastMilestone = c.relearnSessions.at(-1) ?? c.learnedAt;
  const newSession = a.sessionId !== c.sessionId;
  if (newSession && a.at - lastMilestone >= RELEARN_GAP) {
    c.relearnSessions.push(a.at);
    c.sessionId = a.sessionId;
    if (c.relearnSessions.length >= RELEARN_TARGET) c.securedAt = a.at;
  }
  c.lastCorrectAt = a.at;
  return c;
}

/** Concepts whose next relearn is due (learned/relearning, gap elapsed), oldest milestone first. */
export function dueRelearns(criteria: Iterable<Criterion>, now: number) {
  return [...criteria]
    .filter((c) => c.learnedAt && !c.securedAt && now - (c.relearnSessions.at(-1) ?? c.learnedAt) >= RELEARN_GAP)
    .sort((a, b) => (a.relearnSessions.at(-1) ?? a.learnedAt!) - (b.relearnSessions.at(-1) ?? b.learnedAt!));
}
