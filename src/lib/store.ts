// Zustand store mirroring the Dexie tables (live), plus hooks that apply the pure selectors.
// Islands call `useStudy(selector)`; the store hydrates once per page from IndexedDB and stays live via liveQuery.
import { create } from 'zustand';
import { liveQuery } from 'dexie';
import { db, type Attempt, type CardState, type Criterion, type Requeue, type Session } from './db';
import * as sel from './selectors';

interface StudyState {
  ready: boolean;
  attempts: Attempt[];
  criterion: Map<string, Criterion>;
  cards: CardState[];
  requeue: Requeue[];
  sessions: Session[];
}

export const useStudy = create<StudyState>(() => ({
  ready: false,
  attempts: [],
  criterion: new Map(),
  cards: [],
  requeue: [],
  sessions: [],
}));

let started = false;
/** Start mirroring IndexedDB into the store (idempotent; safe to call from every island). */
export function startStudySync() {
  if (started || typeof indexedDB === 'undefined') return;
  started = true;
  liveQuery(async () => ({
    attempts: await db.attempts.toArray(),
    criterion: await db.criterion.toArray(),
    cards: await db.cards.toArray(),
    requeue: await db.requeue.toArray(),
    sessions: await db.sessions.toArray(),
  })).subscribe({
    next: (v) =>
      useStudy.setState({
        ready: true,
        attempts: v.attempts,
        criterion: new Map(v.criterion.map((c) => [c.conceptId, c])),
        cards: v.cards,
        requeue: v.requeue,
        sessions: v.sessions,
      }),
    error: (e) => console.warn('study sync failed', e),
  });
}

// Selector hooks (components re-render only when the underlying arrays change).
export const useAccuracyByConcept = () => sel.accuracyByConcept(useStudy((s) => s.attempts));
export const useCalibration = () => sel.calibration(useStudy((s) => s.attempts));
export const useDueCards = (now = Date.now()) => sel.dueCards(useStudy((s) => s.cards), now);
export const useDueRequeues = (now = Date.now()) => sel.dueRequeues(useStudy((s) => s.requeue), now);
export function useDaysStudied(now = Date.now()) {
  const attempts = useStudy((s) => s.attempts);
  const sessions = useStudy((s) => s.sessions);
  return sel.daysStudied(attempts, sessions, now);
}
export function useMinutesToday(now = Date.now()) {
  const attempts = useStudy((s) => s.attempts);
  const sessions = useStudy((s) => s.sessions);
  return sel.minutesToday(attempts, sessions, now);
}
export function useReadiness(conceptIds: string[], examDate: number, now = Date.now()) {
  const criteria = useStudy((s) => s.criterion);
  const attempts = useStudy((s) => s.attempts);
  return sel.readiness(conceptIds, criteria, attempts, examDate, now);
}
export const useCriterion = (conceptId: string) => useStudy((s) => s.criterion.get(conceptId));
