// "What next?": one function, one answer. Due re-tests first (hypercorrection), then due cards, then the weakest
// concept of the unit that most needs time (nearest exam, least ready), then the next unread week.
import type { Attempt, CardState, Criterion, Requeue } from './db';
import { readiness, conceptMastery, attemptsByConcept } from './selectors';

import type { ExamInfo } from './exam';
export interface OverviewUnit { id: string; code: string; name?: string; /** exam start (ms) */ examDate: number; exam?: ExamInfo; weeksExpected?: number; answerStyle?: 'problem' | 'essay'; weeks: { id: string; number: number; topic: string; href: string; concepts: { id: string; title: string; href: string }[] }[] }
export interface Next { label: string; href: string; reason: string; unit?: string; concept?: string }

const unitOf = (id: string) => id.match(/^([a-z]+\d{4})-/)?.[1] ?? '';

export function whatNext(o: {
  units: OverviewUnit[]; attempts: Attempt[]; criteria: Map<string, Criterion>; requeue: Requeue[]; cards: CardState[];
  visited: Set<string>; now: number; only?: string;
}): Next | null {
  const units = o.units.filter((u) => u.weeks.some((w) => w.concepts.length) && (!o.only || o.only === 'due' || u.id === o.only));
  if (!units.length) return null;
  const inScope = (id: string) => units.some((u) => u.id === unitOf(id));
  const req = o.requeue.filter((r) => !r.done && r.dueAt <= o.now && inScope(r.itemId));
  if (req.length) {
    const u = unitOf(req[0].itemId);
    return { label: `Re-test ${req.length} ${req.length === 1 ? 'question' : 'questions'} due`, href: `/${u}/quiz`, reason: 'Items you were sure about and got wrong come back first.', unit: u };
  }
  const due = o.cards.filter((c) => !c.suspended && c.due <= o.now && inScope(c.cardId));
  if (due.length) {
    const us = [...new Set(due.map((c) => unitOf(c.cardId)))];
    return { label: `Review ${due.length} due ${due.length === 1 ? 'card' : 'cards'}`, href: us.length === 1 ? `/${us[0]}/cards` : '/cards', reason: 'Due cards are cheapest to keep today.', unit: us.length === 1 ? us[0] : undefined };
  }
  const by = attemptsByConcept(o.attempts);
  const ranked = units
    .map((u) => { const ids = u.weeks.flatMap((w) => w.concepts.map((c) => c.id)); return { u, r: readiness(ids, o.criteria, o.attempts, u.examDate, o.now) }; })
    .filter((x) => x.r.daysToExam > 0 || x.u.examDate > o.now)
    .sort((a, b) => (a.r.onTrack === b.r.onTrack ? a.u.examDate - b.u.examDate : a.r.onTrack ? 1 : -1));
  const pickU = (ranked[0] ?? { u: units[0] }).u;
  const unread = pickU.weeks.find((w) => w.concepts.length && !o.visited.has(w.id));
  const seen = pickU.weeks.flatMap((w) => w.concepts).filter((c) => by.has(c.id));
  if (seen.length) {
    const weakest = seen.map((c) => ({ c, m: conceptMastery(c.id, o.criteria, by) })).sort((a, b) => a.m - b.m)[0];
    if (weakest.m < 0.8 || !unread) return { label: `Quiz: ${weakest.c.title}`, href: `/${pickU.id}/quiz?concept=${weakest.c.id}`, reason: `Your weakest ${pickU.code} concept right now.`, unit: pickU.id, concept: weakest.c.id };
  }
  if (unread) return { label: `Read ${pickU.code} week ${unread.number}: ${unread.topic}`, href: unread.href, reason: 'Next week you have not opened yet; read the full visual week or switch to continuous text.', unit: pickU.id };
  return { label: `Quiz ${pickU.code}`, href: `/${pickU.id}/quiz`, reason: 'Mixed questions across the weeks.', unit: pickU.id };
}

/** Weakest concept for a unit (lowest mastery among seen; else the first concept). */
export function weakestConcept(u: OverviewUnit, attempts: Attempt[], criteria: Map<string, Criterion>) {
  const by = attemptsByConcept(attempts);
  const all = u.weeks.flatMap((w) => w.concepts);
  const seen = all.filter((c) => by.has(c.id));
  if (!seen.length) return all[0];
  return seen.map((c) => ({ c, m: conceptMastery(c.id, criteria, by) })).sort((a, b) => a.m - b.m)[0].c;
}

/** "2-minute start": the weakest concept of the unit What next? points at (else the nearest exam). Starts the block. */
export function twoMinuteStart(o: Parameters<typeof whatNext>[0], startBlock: (b: { kind: 'two-minute'; unit: string; ifThen: string; minutes: number }) => unknown): string | null {
  const units = o.units.filter((u) => u.weeks.some((w) => w.concepts.length));
  const next = whatNext(o);
  const u = units.find((x) => x.id === next?.unit) ?? [...units].sort((a, b) => a.examDate - b.examDate)[0];
  if (!u) return null;
  const c = weakestConcept(u, o.attempts, o.criteria);
  startBlock({ kind: 'two-minute', unit: u.id, ifThen: `Two minutes on ${c?.title ?? u.code}`, minutes: 2 });
  return c ? `/${u.id}/quiz?concept=${c.id}` : `/${u.id}/quiz`;
}
