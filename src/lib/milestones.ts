// Milestones: 50/80/95% mastery per unit, "queue cleared" (once a day) and personal bests. Informational only,
// each shown once. Pure detection so it can be tested; the Milestones island shows the stamp.
import type { Attempt, Criterion } from './db';
import { conceptMastery, attemptsByConcept, dayKey } from './selectors';

export interface Milestone { key: string; big: string; label: string }
export const THRESHOLDS = [0.5, 0.8, 0.95];

export function detect(o: { units: { id: string; code: string; concepts: string[] }[]; attempts: Attempt[]; criteria: Map<string, Criterion>; seen: Set<string>; now: number }): Milestone[] {
  const out: Milestone[] = [];
  const by = attemptsByConcept(o.attempts);
  for (const u of o.units) {
    if (!u.concepts.length) continue;
    const m = u.concepts.reduce((s, id) => s + conceptMastery(id, o.criteria, by), 0) / u.concepts.length;
    for (const t of THRESHOLDS) {
      const key = `mastery:${u.id}:${t}`;
      if (m >= t && !o.seen.has(key)) out.push({ key, big: `${Math.round(t * 100)}%`, label: `${u.code} mastery` });
    }
  }
  // Personal bests (from the second day of study on, so the first day is not a "best").
  const days = new Map<string, Attempt[]>();
  for (const a of o.attempts) { const k = dayKey(a.at); days.set(k, [...(days.get(k) ?? []), a]); }
  if (days.size >= 2) {
    const today = dayKey(o.now);
    const t = days.get(today) ?? [];
    const prevMax = Math.max(0, ...[...days].filter(([k]) => k !== today).map(([, v]) => v.length));
    const key = `best-answers:${today}`;
    if (t.length >= 20 && t.length > prevMax && !o.seen.has(key)) out.push({ key, big: String(t.length), label: 'answers today, your most in a day' });
  }
  return out;
}
