// Format tracking (features 111, 112): which representation the student used for a concept just before answering
// (explainer, decision flow, Ways in, glossary, listening, a visual, the one-page sheet). The latest use per concept
// is kept in sessionStorage with a timestamp; recordAttempt stamps `via` on an attempt when one was used in the
// last 15 minutes, and accuracyByFormat compares how answers went after each format.
import type { Attempt } from './db';

export const FORMATS = ['explainer', 'flow', 'ways-in', 'glossary', 'listen', 'visual', 'sheet'] as const;
export type Format = (typeof FORMATS)[number];

const KEY = 'studysite:formats';
/** A format counts as "used before answering" for 15 minutes. */
export const FORMAT_WINDOW = 15 * 60_000;

type Store = Record<string, { f: Format; at: number }>;

function storage(): Storage | null {
  try { return (globalThis as { sessionStorage?: Storage }).sessionStorage ?? null; } catch { return null; }
}

function read(): Store {
  try { return JSON.parse(storage()?.getItem(KEY) || '{}') || {}; } catch { return {}; }
}

/** Record that `format` was used for `conceptId` (call when the student actually sees or hears it). */
export function markFormat(conceptId: string, format: Format, now = Date.now()) {
  if (!conceptId || !FORMATS.includes(format)) return;
  const s = read();
  s[conceptId] = { f: format, at: now };
  try { storage()?.setItem(KEY, JSON.stringify(s)); } catch {}
}

/** The format used for a concept within the last 15 minutes, if any. */
export function lastFormat(conceptId: string, now = Date.now()): Format | undefined {
  const e = read()[conceptId];
  return e && now - e.at >= 0 && now - e.at <= FORMAT_WINDOW ? e.f : undefined;
}

export interface FormatAccuracy {
  /** The `via` recorded on the attempts (a Format, or another component's label), or 'none' when there was none. */
  format: string;
  /** Marked attempts counted. */
  attempts: number;
  /** Sum of marks (1 per correct, the rubric score for self-marked answers). */
  score: number;
  /** score / attempts, 0–1. */
  accuracy: number;
}

/** Mark of one attempt (0–1), or null when it carries no mark (an unmarked rubric answer). */
function mark(a: Pick<Attempt, 'correct' | 'score'>): number | null {
  if (a.correct === true) return 1;
  if (a.correct === false) return 0;
  return typeof a.score === 'number' ? Math.max(0, Math.min(1, a.score)) : null;
}

/** Accuracy of attempts grouped by the format used first (pure). Most-used format first; ties by name. */
export function accuracyByFormat(attempts: Pick<Attempt, 'via' | 'correct' | 'score'>[], opts: { includeNone?: boolean } = {}): FormatAccuracy[] {
  const { includeNone = true } = opts;
  const by = new Map<string, { n: number; s: number }>();
  for (const a of attempts) {
    const m = mark(a);
    if (m === null) continue;
    const f = a.via?.trim() || 'none';
    if (f === 'none' && !includeNone) continue;
    const g = by.get(f) ?? { n: 0, s: 0 };
    g.n += 1;
    g.s += m;
    by.set(f, g);
  }
  return [...by.entries()]
    .map(([format, g]) => ({ format, attempts: g.n, score: g.s, accuracy: g.s / g.n }))
    .sort((a, b) => b.attempts - a.attempts || a.format.localeCompare(b.format));
}
