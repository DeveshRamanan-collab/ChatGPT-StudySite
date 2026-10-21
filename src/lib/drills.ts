// Pure selection logic for the new practice modes (features 13, 95, 131, 139, 140, 144, 146):
//   · drills built from study aids (spot the error, what if, edge case, transfer), mixed by kind, interleaved by week;
//   · "tell apart" rounds from contrastsWith edges (a concept and the ideas it is confused with, interleaved);
//   · the "where am I?" diagnostic (one question per week, pretest set first) and its starting map.
// Seeded and free of Dexie/DOM, so a set never reshuffles under the student and every rule is unit-tested.
import type { Aid } from './aids';
import type { Attempt } from './db';
import { interleave } from './picker';
import type { ConceptMeta, McqQ, Question, TrueFalseQ, WeekMeta } from '../components/quiz/types';

export type DrillKind = 'spot' | 'whatif' | 'edge' | 'transfer';
export const DRILL_KINDS: DrillKind[] = ['spot', 'whatif', 'edge', 'transfer'];
export const DRILL_LABEL: Record<DrillKind, string> = { spot: 'Spot the error', whatif: 'What if', edge: 'Edge case', transfer: 'Transfer' };

interface DrillBase { id: string; kind: DrillKind; concept: string; unit: string; week: string; index: number }
export interface Statement { text: string; concept: string; wrong: boolean }
export interface SpotDrill extends DrillBase { kind: 'spot'; statements: Statement[]; tempting: string; correction: string }
export interface WhatIfDrill extends DrillBase { kind: 'whatif'; change: string; effect: string }
export interface EdgeDrill extends DrillBase { kind: 'edge'; text: string; why: string }
export interface TransferDrill extends DrillBase { kind: 'transfer'; scenario: string; answer: string }
export type Drill = SpotDrill | WhatIfDrill | EdgeDrill | TransferDrill;

/** Attempt ids for drills. They are not bank questions, so learning.ts never requeues them. */
export const drillId = (kind: DrillKind, concept: string, index: number) => `drill:${kind}:${concept}:${index}`;

export type SelfRating = 'right' | 'partly' | 'missed';
/** Self-rated drills are recorded as type 'short' with this score (correct: null). */
export const SELF_SCORE: Record<SelfRating, number> = { right: 1, partly: 0.5, missed: 0 };

export function rng(seed: number) {
  let s = Math.abs(Math.floor(seed)) % 2147483647 || 1;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

export function shuffle<T>(xs: T[], rand: () => number): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Latest attempt time per question id. */
export function lastSeenMap(attempts: Pick<Attempt, 'questionId' | 'at'>[]) {
  const m = new Map<string, number>();
  for (const a of attempts) m.set(a.questionId, Math.max(m.get(a.questionId) ?? 0, a.at));
  return m;
}

/** Never-seen first, then least recently seen; ties broken by the seeded draw. */
function freshestFirst<T extends { id: string }>(items: T[], seen: Map<string, number>, rand: () => number): T[] {
  return items.map((x) => ({ x, t: seen.get(x.id) ?? -1, r: rand() })).sort((a, b) => a.t - b.t || a.r - b.r).map((e) => e.x);
}

// ---------- Drills from study aids ----------

/**
 * Every drill the aids support. Spot-the-error puts one misconception claim among two true statements (`plain`, or
 * `formal` when there is no plain) from two other concepts, same week first; it is skipped when fewer than two other
 * concepts exist. Concepts without aids simply contribute nothing.
 */
export function buildDrills(aids: Record<string, Aid>, seed: number): Drill[] {
  const rand = rng(seed);
  const list = Object.values(aids).sort((a, b) => a.concept.localeCompare(b.concept));
  const out: Drill[] = [];
  for (const a of list) {
    const base = (kind: DrillKind, index: number) => ({ id: drillId(kind, a.concept, index), kind, concept: a.concept, unit: a.unit, week: a.week, index });
    const others = list.filter((o) => o.concept !== a.concept && (o.plain || o.formal));
    (a.misconceptions ?? []).forEach((m, i) => {
      const sameWeek = shuffle(others.filter((o) => o.week === a.week), rand);
      const rest = shuffle(others.filter((o) => o.week !== a.week), rand);
      const truths = [...sameWeek, ...rest].slice(0, 2);
      if (truths.length < 2) return;
      const statements = shuffle(
        [{ text: m.claim, concept: a.concept, wrong: true }, ...truths.map((o) => ({ text: (o.plain || o.formal)!, concept: o.concept, wrong: false }))],
        rand,
      );
      out.push({ ...base('spot', i), kind: 'spot', statements, tempting: m.tempting, correction: m.correction });
    });
    (a['what-if'] ?? []).forEach((w, i) => out.push({ ...base('whatif', i), kind: 'whatif', change: w.change, effect: w.effect }));
    (a.boundary ?? []).forEach((b, i) => out.push({ ...base('edge', i), kind: 'edge', text: b.text, why: b.why }));
    (a.transfer ?? []).forEach((t, i) => out.push({ ...base('transfer', i), kind: 'transfer', scenario: t.scenario, answer: t.answer }));
  }
  return out;
}

export interface PickDrillsInput { drills: Drill[]; attempts: Pick<Attempt, 'questionId' | 'at'>[]; n: number; seed: number; concept?: string }

/**
 * A mixed set: kinds taken in turn (so all four appear when the aids allow), each kind's queue freshest-first and
 * spread across weeks; the final order is interleaved so consecutive drills come from different weeks.
 */
export function pickDrills({ drills, attempts, n, seed, concept }: PickDrillsInput): Drill[] {
  const rand = rng(seed);
  const seen = lastSeenMap(attempts);
  const pool = concept ? drills.filter((d) => d.concept === concept) : drills;
  const byWeek = (d: Drill) => d.week;
  // Never-tried drills always come before tried ones; within each tier the queue is spread across weeks.
  const queues = shuffle(DRILL_KINDS, rand)
    .map((k) => freshestFirst(pool.filter((d) => d.kind === k), seen, rand))
    .map((q) => [...interleave(q.filter((d) => !seen.has(d.id)), byWeek), ...interleave(q.filter((d) => seen.has(d.id)), byWeek)])
    .filter((q) => q.length);
  const chosen: Drill[] = [];
  while (chosen.length < n && queues.some((q) => q.length)) for (const q of queues) if (q.length && chosen.length < n) chosen.push(q.shift()!);
  return interleave(chosen, byWeek);
}

// ---------- Tell apart (contrast) ----------

export type ChoiceQ = McqQ | TrueFalseQ;
export const isChoice = (q: Question): q is ChoiceQ => q.type === 'mcq' || q.type === 'truefalse';

/**
 * Groups of easily confused ideas: each concept with up to two of its contrastsWith partners (only concepts that have
 * questions). Identical sets and strict subsets are dropped. Groups containing `first` come first, the one anchored
 * on it at the front; the rest are in a seeded order.
 */
export function contrastGroups(concepts: Record<string, ConceptMeta>, eligible: (id: string) => boolean, seed: number, first?: string): string[][] {
  const raw: string[][] = [];
  for (const id of Object.keys(concepts).sort()) {
    if (!eligible(id)) continue;
    const partners = [...new Set(concepts[id].contrastsWith ?? [])].filter((x) => x !== id && concepts[x] && eligible(x)).slice(0, 2);
    if (partners.length) raw.push([id, ...partners]);
  }
  const keyOf = (g: string[]) => [...g].sort().join('|');
  const unique = raw.filter((g, i) => raw.findIndex((h) => keyOf(h) === keyOf(g)) === i);
  const kept = unique.filter((g) => !unique.some((h) => h.length > g.length && g.every((x) => h.includes(x))));
  const rand = rng(seed);
  const ordered = shuffle(kept, rand);
  if (!first) return ordered;
  const rank = (g: string[]) => (g[0] === first ? 0 : g.includes(first) ? 1 : 2);
  return ordered.map((g, i) => ({ g, i })).sort((a, b) => rank(a.g) - rank(b.g) || a.i - b.i).map((e) => e.g);
}

/**
 * One round: about n/len questions from each concept of the group (freshest first), shuffled so the order does not
 * give the concept away, with no more than two in a row from the same concept.
 */
export function contrastRound<T extends { id: string; concept: string }>(group: string[], questions: T[], attempts: Pick<Attempt, 'questionId' | 'at'>[], n: number, seed: number): T[] {
  const rand = rng(seed);
  const seen = lastSeenMap(attempts);
  const per = Math.ceil(n / group.length);
  const picked = group.flatMap((c) => freshestFirst(questions.filter((q) => q.concept === c), seen, rand).slice(0, per));
  return limitRuns(shuffle(picked, rand), (q) => q.concept, 2).slice(0, n);
}

/** Reorders so no more than `max` consecutive items share a key, when another key is available later. */
export function limitRuns<T>(items: T[], key: (t: T) => string, max: number): T[] {
  const out = [...items];
  for (let i = max; i < out.length; i++) {
    const k = key(out[i]);
    if (!out.slice(i - max, i).every((x) => key(x) === k)) continue;
    const j = out.findIndex((x, idx) => idx > i && key(x) !== k);
    if (j !== -1) [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// ---------- Where am I? (diagnostic) ----------

export interface DiagnosticRow { week: WeekMeta; id: string }

/** One multiple-choice or true/false question per week: the week's pretest set first, never-seen first. */
export function diagnosticSet(bank: { weeks: WeekMeta[]; concepts: Record<string, ConceptMeta>; questions: Question[] }, attempts: Pick<Attempt, 'questionId' | 'at'>[], seed: number): DiagnosticRow[] {
  const rand = rng(seed);
  const seen = lastSeenMap(attempts);
  const weekOf = (q: Question) => q.week ?? bank.concepts[q.concept]?.week;
  return [...bank.weeks]
    .sort((a, b) => a.number - b.number)
    .flatMap((week) => {
      const all = bank.questions.filter((q) => isChoice(q) && weekOf(q) === week.id);
      const pretest = all.filter((q) => q.set === 'pretest');
      const best = freshestFirst(pretest.length ? pretest : all, seen, rand)[0];
      return best ? [{ week, id: best.id }] : [];
    });
}

export interface MapRow extends DiagnosticRow { correct: boolean | null }

/** Each week's latest result for its diagnostic question since `since` (null = not answered yet). */
export function diagnosticMap(rows: DiagnosticRow[], attempts: Pick<Attempt, 'questionId' | 'at' | 'correct'>[], since: number): MapRow[] {
  return rows.map((r) => {
    const latest = attempts.filter((a) => a.questionId === r.id && a.at >= since).sort((a, b) => b.at - a.at)[0];
    return { ...r, correct: latest ? latest.correct === true : null };
  });
}
