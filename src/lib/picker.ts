// Adaptive picker. Order of service:
//   1. due hypercorrection requeues (oldest due first),
//   2. due criterion relearns (one question per concept, oldest milestone first),
//   3. a weighted draw over concepts: error rate, time since seen, overconfidence, criterion state, coverage;
// within a concept: never-seen first, then the question nearest a target difficulty set by recent accuracy
// (< 0.5 → 1–2, 0.5–0.8 → 2–3, > 0.8 → 3–4), then least recently seen;
// then interleaved so consecutive questions come from different weeks (or different units in exam mode).
// Pure and seeded, so it is testable and a session never reshuffles under the student.
import type { Attempt, Criterion, Requeue } from './db';
import { dueRelearns } from './criterion';
import { dueRequeues, outcome } from './selectors';

export interface PickItem { id: string; concept: string; unit: string; week?: string; type: string; difficulty?: number }

export interface PickInput<T extends PickItem> {
  items: T[];
  attempts: Attempt[];
  criteria: Map<string, Criterion>;
  requeue: Requeue[];
  now: number;
  n: number;
  mode?: 'unit' | 'exam';
  seed?: number;
}

const DAY = 86_400_000;

function rng(seed: number) {
  let s = seed % 2147483647 || 1;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

/** Weight of a concept: higher = more in need of practice. Exposed for tests and the dashboard. */
export function conceptWeight(concept: string, attempts: Attempt[], c: Criterion | undefined, now: number) {
  const mine = attempts.filter((a) => a.concept === concept).sort((a, b) => b.at - a.at);
  const recent = mine.slice(0, 10);
  const scored = recent.map(outcome).filter((o): o is number => o !== null);
  const errorRate = scored.length ? 1 - scored.reduce((s, o) => s + o, 0) / scored.length : 0;
  const confident = recent.filter((a) => a.confidence === 'sure');
  const overconfidence = confident.length ? confident.filter((a) => outcome(a) === 0).length / confident.length : 0;
  const days = mine.length ? (now - mine[0].at) / DAY : 14;
  const staleness = Math.min(1, days / 14);
  const criterion = !c ? 1 : c.securedAt ? 0.1 : c.learnedAt ? 0.3 : 0.7;
  const coverage = mine.length ? 0 : 1;
  return 1 + 3 * errorRate + 2 * overconfidence + 2 * staleness + 2 * criterion + coverage;
}

/** Target difficulty band (1–4) for a concept's recent accuracy; null when there is no scored attempt yet. */
export function targetDifficulty(accuracy: number | null): [number, number] | null {
  if (accuracy === null) return null;
  if (accuracy < 0.5) return [1, 2];
  if (accuracy <= 0.8) return [2, 3];
  return [3, 4];
}

/** Recent accuracy on a concept (last 10 scored attempts), or null when none. */
export function recentAccuracy(concept: string, attempts: Attempt[]): number | null {
  const scored = attempts
    .filter((a) => a.concept === concept)
    .sort((a, b) => b.at - a.at)
    .map(outcome)
    .filter((o): o is number => o !== null)
    .slice(0, 10);
  return scored.length ? scored.reduce((s, o) => s + o, 0) / scored.length : null;
}

/** How far a difficulty sits outside the band (0 inside it, or when either is unknown). */
const bandGap = (d: number | undefined, band: [number, number] | null) =>
  d === undefined || !band ? 0 : d < band[0] ? band[0] - d : d > band[1] ? d - band[1] : 0;

/** Greedy interleave: never the same group twice in a row when another group is available. */
export function interleave<T>(items: T[], group: (t: T) => string): T[] {
  const rest = [...items];
  const out: T[] = [];
  while (rest.length) {
    const last = out.length ? group(out[out.length - 1]) : null;
    const i = rest.findIndex((x) => group(x) !== last);
    out.push(rest.splice(i === -1 ? 0 : i, 1)[0]);
  }
  return out;
}

export function pick<T extends PickItem>({ items, attempts, criteria, requeue, now, n, mode = 'unit', seed = now }: PickInput<T>): T[] {
  // Exam mode across units: draw a fair share from each unit (weighted within it), then interleave units.
  const unitIds = [...new Set(items.map((q) => q.unit))];
  if (mode === 'exam' && unitIds.length > 1) {
    const share = Math.ceil(n / unitIds.length);
    const parts = unitIds.map((u, i) => pick({ items: items.filter((q) => q.unit === u), attempts, criteria, requeue, now, n: share, mode: 'unit', seed: seed + i }));
    const out: T[] = [];
    for (let k = 0; out.length < n && parts.some((p) => p.length); k++) for (const p of parts) if (p.length && out.length < n) out.push(p.shift()!);
    return out;
  }
  const rand = rng(seed);
  const byId = new Map(items.map((q) => [q.id, q]));
  const lastSeen = new Map<string, number>();
  for (const a of attempts) lastSeen.set(a.questionId, Math.max(lastSeen.get(a.questionId) ?? 0, a.at));
  const chosen: T[] = [];
  const taken = new Set<string>();
  const take = (q: T | undefined) => {
    if (!q || taken.has(q.id) || chosen.length >= n) return;
    taken.add(q.id);
    chosen.push(q);
  };
  // Target difficulty per concept from its recent accuracy (computed once per concept per pick).
  const bands = new Map<string, [number, number] | null>();
  const bandOf = (concept: string) => {
    if (!bands.has(concept)) bands.set(concept, targetDifficulty(recentAccuracy(concept, attempts)));
    return bands.get(concept)!;
  };
  // Within a concept: never-seen first, then nearest the target difficulty, then least recently seen, then random.
  const freshest = (concept: string) => {
    const band = bandOf(concept);
    return items
      .filter((q) => q.concept === concept && !taken.has(q.id))
      .map((q) => {
        const t = lastSeen.get(q.id) ?? -1;
        return { q, seen: t < 0 ? 0 : 1, gap: bandGap(q.difficulty, band), t, r: rand() };
      })
      .sort((a, b) => a.seen - b.seen || a.gap - b.gap || a.t - b.t || a.r - b.r)[0]?.q;
  };

  // 1. Due requeues.
  for (const r of dueRequeues(requeue, now)) take(byId.get(r.itemId));
  const priority = chosen.length;

  // 2. Due relearns.
  const concepts = new Set(items.map((q) => q.concept));
  for (const c of dueRelearns(criteria.values(), now)) if (concepts.has(c.conceptId)) take(freshest(c.conceptId));

  // 3. Weighted draw.
  const weights = new Map([...concepts].map((c) => [c, conceptWeight(c, attempts, criteria.get(c), now)]));
  let guard = 0;
  while (chosen.length < n && taken.size < items.length && guard++ < n * 20) {
    const live = [...weights].filter(([c]) => items.some((q) => q.concept === c && !taken.has(q.id)));
    if (!live.length) break;
    const total = live.reduce((s, [, w]) => s + w, 0);
    let x = rand() * total;
    const [concept] = live.find(([, w]) => (x -= w) <= 0) ?? live[live.length - 1];
    take(freshest(concept));
    weights.set(concept, (weights.get(concept) ?? 1) * 0.6); // spread within a session
  }

  // Requeues keep their front position; the rest is interleaved by week (unit mode) or unit (exam mode).
  const key = (q: T) => (mode === 'exam' ? q.unit : (q.week ?? q.unit));
  return [...chosen.slice(0, priority), ...interleave(chosen.slice(priority), key)];
}
