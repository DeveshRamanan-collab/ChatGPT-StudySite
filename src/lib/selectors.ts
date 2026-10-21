// Pure selectors over plain arrays from the data layer. No Dexie here, so they are trivially testable.
// Progress is always a count that cannot break (CLAUDE.md: never a streak chain).
import type { Attempt, CardState, Confidence, Criterion, Requeue, Session } from './db';
import { daysUntil } from './exam';

export const TZ = 'Australia/Sydney';
const DAY = 86_400_000;

/** Calendar day key (YYYY-MM-DD) in the student's time zone. */
export function dayKey(ts: number, tz = TZ) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(ts);
}

/** Correctness of an attempt as 0–1: auto-marked → 0/1, rubric-marked → score. Null when not markable. */
export function outcome(a: Attempt): number | null {
  if (a.correct === true) return 1;
  if (a.correct === false) return 0;
  return typeof a.score === 'number' ? a.score : null;
}

export interface Accuracy { n: number; correct: number; accuracy: number }

export function accuracyByConcept(attempts: Attempt[]): Map<string, Accuracy> {
  const m = new Map<string, Accuracy>();
  for (const a of attempts) {
    const o = outcome(a);
    if (o === null) continue;
    const e = m.get(a.concept) ?? { n: 0, correct: 0, accuracy: 0 };
    e.n += 1;
    e.correct += o;
    e.accuracy = e.correct / e.n;
    m.set(a.concept, e);
  }
  return m;
}

/** Calibration: how often each confidence level was actually right. Well calibrated ≈ sure > unsure > guess. */
export function calibration(attempts: Attempt[]): Record<Confidence, Accuracy> {
  const out: Record<Confidence, Accuracy> = {
    sure: { n: 0, correct: 0, accuracy: 0 },
    unsure: { n: 0, correct: 0, accuracy: 0 },
    guess: { n: 0, correct: 0, accuracy: 0 },
  };
  for (const a of attempts) {
    const o = outcome(a);
    if (!a.confidence || o === null) continue;
    const e = out[a.confidence];
    e.n += 1;
    e.correct += o;
    e.accuracy = e.correct / e.n;
  }
  return out;
}

/** Items that were answered wrongly while "sure" — the hypercorrection targets. */
export const overconfident = (attempts: Attempt[]) => attempts.filter((a) => a.confidence === 'sure' && outcome(a) === 0);

export const dueCards = (cards: CardState[], now: number) => cards.filter((c) => c.due <= now).sort((a, b) => a.due - b.due);

export const dueRequeues = (rows: Requeue[], now: number) =>
  rows.filter((r) => !r.done && r.dueAt <= now).sort((a, b) => a.dueAt - b.dueAt || (a.id ?? 0) - (b.id ?? 0));

/** "N of the last 14 days": distinct study days in the window ending today (inclusive). Never a streak. */
export function daysStudied(attempts: Attempt[], sessions: Session[], now: number, window = 14, tz = TZ) {
  const days = new Set<string>();
  for (let i = 0; i < window; i++) days.add(dayKey(now - i * DAY, tz));
  const studied = new Set<string>();
  for (const t of [...attempts.map((a) => a.at), ...sessions.map((s) => s.start)]) {
    const k = dayKey(t, tz);
    if (days.has(k)) studied.add(k);
  }
  return { studied: studied.size, window };
}

/** Minutes of active study today: attempt durations plus session time not already covered by attempts. */
export function minutesToday(attempts: Attempt[], sessions: Session[], now: number, tz = TZ) {
  const today = dayKey(now, tz);
  const attemptMs = attempts.filter((a) => dayKey(a.at, tz) === today).reduce((s, a) => s + a.durationMs, 0);
  const sessionMs = sessions
    .filter((s) => dayKey(s.start, tz) === today)
    .reduce((sum, s) => sum + Math.max(0, (s.end ?? now) - s.start), 0);
  return Math.round(Math.max(attemptMs, sessionMs) / 60000);
}

/** Criterion progress 0–1: learning (0–⅓ … toward learned), learned 0.5, +⅙ per spaced relearn, secured 1. */
export function criterionProgress(c: Criterion | undefined): number {
  if (!c) return 0;
  if (c.securedAt) return 1;
  if (c.learnedAt) return Math.min(1, 0.5 + c.relearnSessions.length / 6);
  return (Math.min(3, c.correctInSession) / 3) * (1 / 3);
}

/** Criterion stage 0–4 and partial fill of the next segment, for the four-segment ring. */
export function criterionStage(c: Criterion | undefined, pretested = false): { stage: number; partial: number } {
  if (!c) return { stage: pretested ? 1 : 0, partial: 0 };
  if (c.securedAt) return { stage: 4, partial: 0 };
  if (c.learnedAt) return { stage: 2, partial: Math.min(1, c.relearnSessions.length / 3) };
  return { stage: 1, partial: Math.min(1, c.correctInSession / 3) };
}

export interface Readiness { readiness: number; target: number; onTrack: boolean; daysToExam: number; coverage: number }

/** Readiness for a unit: criterion progress (60%) and recent accuracy (40%), vs a target that ramps to 0.9 by exam day. */
export function readiness(
  conceptIds: string[],
  criteria: Map<string, Criterion>,
  attempts: Attempt[],
  examDate: number,
  now: number,
): Readiness {
  const daysToExam = daysUntil(examDate, now); // Sydney calendar days to the exam (examDate = exam start)
  const target = Math.max(0, Math.min(0.9, 0.9 * (1 - daysToExam / 42)));
  if (!conceptIds.length) return { readiness: 0, target, onTrack: target === 0, daysToExam, coverage: 0 };
  const byConcept = new Map<string, Attempt[]>();
  for (const a of attempts) byConcept.set(a.concept, [...(byConcept.get(a.concept) ?? []), a]);
  let crit = 0, acc = 0, seen = 0;
  for (const id of conceptIds) {
    crit += criterionProgress(criteria.get(id));
    const recent = (byConcept.get(id) ?? []).sort((a, b) => b.at - a.at).slice(0, 10).map(outcome).filter((o): o is number => o !== null);
    if (recent.length) seen += 1;
    acc += recent.length ? recent.reduce((s, o) => s + o, 0) / recent.length : 0;
  }
  const r = 0.6 * (crit / conceptIds.length) + 0.4 * (acc / conceptIds.length);
  return { readiness: r, target, onTrack: r >= target, daysToExam, coverage: seen / conceptIds.length };
}

/** Mastery of one concept, 0–1: criterion progress (60%) and accuracy over its last 10 answers (40%). */
export function conceptMastery(id: string, criteria: Map<string, Criterion>, byConcept: Map<string, Attempt[]>) {
  const recent = (byConcept.get(id) ?? []).slice(-10).map(outcome).filter((o): o is number => o !== null);
  const acc = recent.length ? recent.reduce((s, o) => s + o, 0) / recent.length : 0;
  return 0.6 * criterionProgress(criteria.get(id)) + 0.4 * acc;
}

/** Group attempts by concept, oldest first. */
export function attemptsByConcept(attempts: Attempt[]) {
  const m = new Map<string, Attempt[]>();
  for (const a of [...attempts].sort((x, y) => x.at - y.at)) m.set(a.concept, [...(m.get(a.concept) ?? []), a]);
  return m;
}

/** The last `window` days, oldest first: whether studied and that day's accuracy (null when nothing marked). */
export function dailySeries(attempts: Attempt[], activity: number[], now: number, window = 14, tz = TZ) {
  const days = Array.from({ length: window }, (_, i) => dayKey(now - (window - 1 - i) * DAY, tz));
  const idx = new Map(days.map((d, i) => [d, i]));
  const out = days.map((day) => ({ day, studied: false, n: 0, correct: 0, accuracy: null as number | null }));
  for (const t of activity) { const i = idx.get(dayKey(t, tz)); if (i !== undefined) out[i].studied = true; }
  for (const a of attempts) {
    const i = idx.get(dayKey(a.at, tz));
    if (i === undefined) continue;
    out[i].studied = true;
    const o = outcome(a);
    if (o === null) continue;
    out[i].n++; out[i].correct += o;
  }
  for (const d of out) d.accuracy = d.n ? d.correct / d.n : null;
  return out;
}

/** Minutes studied in the last `days` days (attempt durations, capped at 5 min each). */
export function minutesRecent(attempts: Attempt[], now: number, days = 7) {
  const from = now - days * DAY;
  return Math.round(attempts.filter((a) => a.at >= from).reduce((s, a) => s + Math.min(a.durationMs, 5 * 60_000), 0) / 60_000);
}
