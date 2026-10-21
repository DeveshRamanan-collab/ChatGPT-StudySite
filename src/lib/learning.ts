// Learning-loop writes: attempts, study sessions, hypercorrection requeues and "watch this" marks.
// Every attempt also advances the concept's criterion state (src/lib/criterion.ts).
import { db, type Attempt, type Confidence } from './db';
import { apply as applyCriterion } from './criterion';
import { lastFormat } from './format-track';

const MIN = 60_000;
const DAY = 86_400_000;
/** Sure-and-wrong items come back at +10 min, +1 day and +4 days (hypercorrection). */
export const REQUEUE_OFFSETS = [10 * MIN, 1 * DAY, 4 * DAY];
const IDLE = 30 * MIN;
const KEY = 'studysite:session';

/** Current study session id; a new session starts after 30 minutes without activity. */
export function currentSession(now = Date.now()): string {
  let s: { id: string; lastAt: number } | null = null;
  try { s = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch {}
  if (!s || now - s.lastAt > IDLE) {
    s = { id: `s-${now.toString(36)}-${Math.random().toString(36).slice(2, 6)}`, lastAt: now };
    db.sessions.put({ id: s.id, start: now }).catch(() => {});
  }
  s.lastAt = now;
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {}
  return s.id;
}

export interface AttemptInput extends Omit<Attempt, 'id' | 'sessionId' | 'at'> {
  at?: number;
}

export type AttemptHook = (a: Attempt) => Promise<void> | void;
const hooks: AttemptHook[] = [];
/** Register a side effect for every recorded attempt (criterion tracker, picker caches…). */
export const onAttempt = (h: AttemptHook) => hooks.push(h);

/** Only real bank questions can be re-served by the quiz; drill attempts (`drill:…`) are never requeued. */
export const isBankQuestion = (questionId: string) => !questionId.startsWith('drill:');

export async function recordAttempt(input: AttemptInput): Promise<Attempt> {
  const at = input.at ?? Date.now();
  const attempt: Attempt = { ...input, at, sessionId: currentSession(at) };
  // Format comparison (src/lib/format-track.ts): stamp the representation used for this concept in the last 15 min.
  if (!attempt.via) { const f = lastFormat(attempt.concept, at); if (f) attempt.via = f; }
  attempt.id = await db.attempts.add(attempt);
  if (attempt.confidence === 'sure' && attempt.correct === false) {
    if (isBankQuestion(attempt.questionId)) await db.requeue.bulkAdd(REQUEUE_OFFSETS.map((d) => ({ itemId: attempt.questionId, dueAt: at + d, reason: 'sure-wrong' as const, done: 0 as const })));
    await db.settings.put({ key: `watch:${attempt.questionId}`, value: at });
  }
  // Answering a due requeue item clears the earliest due row for it.
  const due = await db.requeue.where('itemId').equals(attempt.questionId).filter((r) => !r.done && r.dueAt <= at).first();
  if (due?.id !== undefined) await db.requeue.update(due.id, { done: 1 });
  await db.transaction('rw', db.criterion, async () => {
    const prev = await db.criterion.get(attempt.concept);
    await db.criterion.put(applyCriterion(prev, attempt));
  });
  for (const h of hooks) await h(attempt);
  return attempt;
}

export const confidenceKeys: Record<string, Confidence> = { s: 'sure', u: 'unsure', g: 'guess' };
