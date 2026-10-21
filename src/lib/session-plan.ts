// Time- and energy-budgeted sessions (features 174, 180): given the minutes available and how much energy the student
// reports, prepare an ordered list of activities that fits. Low energy favours recognition and short retrieval
// (due cards, quick-fire, a worked example); high energy spends the time on production (problem or essay questions).
// Pure, so it is unit-tested; the home ritual renders it and the focus block keeps it as a checklist.
export type Energy = 'low' | 'steady' | 'high';
export interface PlanItem { label: string; href: string; minutes: number; why: string }
export interface PlanInput {
  minutes: number;
  energy: Energy;
  /** Unit id, or 'due' for whatever is due across units. */
  unit: string;
  unitCode?: string;
  dueCards: number;
  dueRequeues: number;
  weakest?: { id: string; title: string } | null;
  answerStyle?: 'problem' | 'essay';
}

export function sessionPlan(i: PlanInput): PlanItem[] {
  const out: PlanItem[] = [];
  let left = i.minutes;
  const add = (item: PlanItem) => {
    if (left <= 0) return;
    const m = Math.min(item.minutes, left);
    if (m < 2) return;
    out.push({ ...item, minutes: m });
    left -= m;
  };
  const u = i.unit === 'due' ? '' : `/${i.unit}`;
  const quizHref = i.unit === 'due' ? '/exam' : `${u}/quiz`;
  const cardsHref = i.unit === 'due' ? '/cards' : `${u}/cards`;

  // 1. Anything already due comes first, whatever the energy: it is the cheapest progress available.
  if (i.dueRequeues > 0) add({ label: `Re-test ${i.dueRequeues} ${i.dueRequeues === 1 ? 'question' : 'questions'} you were sure about and got wrong`, href: quizHref, minutes: Math.max(2, Math.ceil(i.dueRequeues * 1.2)), why: 'Hypercorrection: confident mistakes are fixed fastest while they still sting.' });
  if (i.dueCards > 0) add({ label: `Review ${Math.min(i.dueCards, i.energy === 'low' ? 15 : 30)} due cards`, href: cardsHref, minutes: Math.max(3, Math.ceil(Math.min(i.dueCards, i.energy === 'low' ? 15 : 30) / 2.5)), why: 'Due cards are cheapest to keep today.' });

  const weak = i.weakest;
  if (i.energy === 'low') {
    add({ label: 'Quick-fire: 60 seconds of true or false', href: i.unit === 'due' ? quizHref : `${u}/quiz?mode=quickfire`, minutes: 3, why: 'Short, low-effort retrieval that still counts.' });
    if (weak) add({ label: `Read the one-line version and work it out: ${weak.title}`, href: `${u}/concept/${weak.id.replace(`${i.unit}-`, '')}#ways-in`, minutes: 6, why: 'A guided walk-through asks less of you than a blank page.' });
    add({ label: 'Drills: spot the error, edge cases', href: i.unit === 'due' ? quizHref : `${u}/quiz?mode=drills`, minutes: 6, why: 'Recognising mistakes builds the same knowledge with less effort.' });
  } else if (i.energy === 'steady') {
    if (weak) add({ label: `Quiz: ${weak.title}`, href: `${u}/quiz?concept=${weak.id}`, minutes: 8, why: 'Your weakest concept right now.' });
    add({ label: 'Mixed questions across the weeks', href: quizHref, minutes: 10, why: 'Interleaving: choosing the right idea is part of the exam.' });
    add({ label: 'Tell apart: concepts you might confuse', href: i.unit === 'due' ? quizHref : `${u}/quiz?mode=contrast`, minutes: 6, why: 'Contrast practice targets the errors that cost marks.' });
  } else {
    const long = i.answerStyle === 'essay' ? 'An essay question (plan first)' : 'A problem question (spot the issues, then write)';
    if (i.unit !== 'due' && left >= 20) add({ label: long, href: `${u}/quiz?mode=long`, minutes: Math.min(40, left - (left > 30 ? 8 : 0)), why: 'Full answers are the exam skill; high energy is the time to practise them.' });
    if (weak) add({ label: `Quiz: ${weak.title}`, href: `${u}/quiz?concept=${weak.id}`, minutes: 8, why: 'Your weakest concept right now.' });
    add({ label: 'Mixed questions across the weeks', href: quizHref, minutes: 10, why: 'Interleaving: choosing the right idea is part of the exam.' });
  }
  if (left >= 3) add({ label: 'Close: explain one idea back in your own words', href: weak ? `${u}/concept/${weak.id.replace(`${i.unit}-`, '')}?explain=1` : quizHref, minutes: Math.min(left, 4), why: 'Ending on recall makes the session stick.' });
  return out;
}

/** The block length that suits an energy level by default (the student can change it). */
export const suggestedMinutes = (e: Energy) => (e === 'low' ? 15 : e === 'steady' ? 25 : 45);
