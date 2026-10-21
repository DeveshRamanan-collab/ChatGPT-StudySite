// Flashcard scheduling on ts-fsrs (FSRS). Pure functions: the islands persist the results in Dexie.
// Desired retention 0.90, raised to 0.93 within 14 days of that unit's exam. Each deck (unit) may carry its own
// optimised parameters once it has ≥ 400 reviews (see optimise()).
import { createEmptyCard, fsrs, generatorParameters, forgetting_curve, default_w, Rating, State, type Card, type Grade } from 'ts-fsrs';
import type { CardState } from './db';

export const DAY = 86_400_000;
export const OPTIMISE_AFTER = 400;
export { Rating };

export interface ReviewLogRow {
  id?: number;
  cardId: string;
  deck: string;
  grade: Grade;
  /** State before this review (0 new, 1 learning, 2 review, 3 relearning). */
  state: number;
  /** Days since the previous review (0 for the first). */
  elapsed: number;
  /** Stability before this review (days). */
  stability: number;
  at: number;
}

/** Cap a due time at 24 h before the exam start when the interval would otherwise skip past it. */
export function beforeExam(due: number, now: number, examDate?: number) {
  if (!examDate) return due;
  const lastChance = examDate - DAY;
  return now < lastChance && due > lastChance ? lastChance : due;
}

export function retentionFor(examDate: number | undefined, now: number) {
  if (!examDate) return 0.9;
  const days = (examDate - now) / DAY;
  return days >= 0 && days <= 14 ? 0.93 : 0.9;
}

export function scheduler(retention = 0.9, w?: number[]) {
  return fsrs(generatorParameters({ request_retention: retention, enable_fuzz: false, ...(w ? { w } : {}) }));
}

type Stored = Omit<Card, 'due' | 'last_review'> & { due: number; last_review?: number };

export function toStored(c: Card): Record<string, unknown> {
  const { due, last_review, ...rest } = c;
  return { ...rest, due: +new Date(due), ...(last_review ? { last_review: +new Date(last_review) } : {}) };
}

export function fromStored(s: Record<string, unknown> | undefined, now: number): Card {
  if (!s || typeof s.due !== 'number') return createEmptyCard(new Date(now));
  const st = s as unknown as Stored;
  return { ...st, due: new Date(st.due), last_review: st.last_review ? new Date(st.last_review) : undefined };
}

/** One review: returns the next CardState row and the log row. */
export function review(cardId: string, deck: string, prev: CardState | undefined, grade: Grade, now: number, opts: { retention?: number; w?: number[]; examDate?: number } = {}) {
  const f = scheduler(opts.retention ?? 0.9, opts.w);
  const card = fromStored(prev?.fsrs, now);
  const elapsed = card.last_review ? Math.max(0, (now - +card.last_review) / DAY) : 0;
  const { card: next } = f.next(card, new Date(now), grade);
  const state: CardState = {
    ...(prev ?? {}),
    cardId,
    fsrs: toStored(next),
    // Relearn before the exam, not after it: an interval that would jump past the day before the exam is cut to then.
    due: beforeExam(+next.due, now, opts.examDate),
    reps: next.reps,
    lapses: next.lapses,
    lastReview: now,
  };
  const log: ReviewLogRow = { cardId, deck, grade, state: card.state, elapsed, stability: card.stability, at: now };
  return { state, log };
}

/** Interval previews for the four buttons, e.g. { 1: '10m', 3: '3d' }. */
export function previews(prev: CardState | undefined, now: number, opts: { retention?: number; w?: number[] } = {}) {
  const f = scheduler(opts.retention ?? 0.9, opts.w);
  const rec = f.repeat(fromStored(prev?.fsrs, now), new Date(now));
  const out: Record<number, string> = {};
  for (const g of [Rating.Again, Rating.Hard, Rating.Good, Rating.Easy] as Grade[]) out[g] = humanInterval(+rec[g].card.due - now);
  return out;
}

export function humanInterval(ms: number) {
  const m = Math.max(1, Math.round(ms / 60_000));
  if (m < 60) return `${m}m`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.round(ms / DAY);
  if (d < 31) return `${d}d`;
  const mo = Math.round(d / 30);
  return mo < 12 ? `${mo}mo` : `${(d / 365).toFixed(1)}y`;
}

/**
 * Per-deck optimisation (light): searches a scale on the four initial-stability weights and on the
 * stability-growth weight that best predict this deck's own recall (log-loss of the forgetting curve on every
 * review of a card already in review). Returns undefined below OPTIMISE_AFTER reviews or when defaults fit best.
 */
export function optimise(logs: ReviewLogRow[]): { w: number[]; loss: number; baseline: number; n: number } | undefined {
  const graded = logs.filter((l) => l.state === State.Review && l.stability > 0 && l.elapsed > 0);
  if (logs.length < OPTIMISE_AFTER || graded.length < 50) return undefined;
  const base = [...default_w];
  const lossWith = (sScale: number) => {
    let loss = 0;
    for (const l of graded) {
      const p = Math.min(0.999, Math.max(0.001, forgetting_curve(base[20] ?? 0.5, l.elapsed, l.stability * sScale)));
      const y = l.grade === Rating.Again ? 0 : 1;
      loss -= y * Math.log(p) + (1 - y) * Math.log(1 - p);
    }
    return loss / graded.length;
  };
  const baseline = lossWith(1);
  let best = { s: 1, loss: baseline };
  for (let s = 0.5; s <= 2.001; s += 0.05) {
    const loss = lossWith(s);
    if (loss < best.loss - 1e-6) best = { s, loss };
  }
  if (best.s === 1) return undefined;
  const w = base.map((x, i) => (i <= 3 ? x * best.s : i === 8 ? x + Math.log(best.s) : x));
  return { w, loss: best.loss, baseline, n: graded.length };
}

/** Anki-compatible CSV (front;back;tags), one row per card, semicolon-separated, quotes doubled. */
export function ankiCsv(rows: { front: string; back: string; tags: string[] }[]) {
  const q = (s: string) => `"${s.replace(/"/g, '""').replace(/\r?\n/g, '<br>')}"`;
  return ['#separator:semicolon', '#html:true', '#tags column:3', ...rows.map((r) => [q(r.front), q(r.back), q(r.tags.join(' '))].join(';'))].join('\n') + '\n';
}

/** Cloze text → Anki cloze stays as is; for display: hide or reveal every deletion. */
export function renderCloze(text: string, reveal: boolean) {
  return text.replace(/\{\{c\d+::(.*?)(?:::(.*?))?\}\}/g, (_, ans: string, hint?: string) => (reveal ? `⟦${ans}⟧` : `⟦${hint ? `${hint}…` : '…'}⟧`));
}
