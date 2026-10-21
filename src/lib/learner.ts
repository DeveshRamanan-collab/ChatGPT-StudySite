// What the site knows about the learner: the /insight model (strengths, recurring errors, recall estimates), the
// error-log misconception journal, the exam-debrief split and teach-back coverage. Pure functions over plain rows
// from the data layer; they reuse the existing measures (selectors.outcome, criterion.isCorrect, the FSRS scheduler
// and retention target) and never change them. Every estimate comes with its evidence in plain words.
import { default_w, forgetting_curve, State } from 'ts-fsrs';
import type { Attempt, CardState, Criterion } from './db';
import { isCorrect, RELEARN_TARGET } from './criterion';
import { fromStored, scheduler, retentionFor, DAY } from './fsrs';
import { outcome } from './selectors';
import { daysUntil } from './exam';
import { overlap, stems, type Aid } from './aids';

// ---------- small words ----------

export const fmtDay = (t: number) => new Date(t).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', timeZone: 'Australia/Sydney' });
export const pct = (x: number) => `${Math.round(x * 100)}%`;
const times = (n: number) => (n === 1 ? 'once' : n === 2 ? 'twice' : `${n} times`);
const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
/** "today", "yesterday", "9 days ago" — Sydney calendar days. */
export function ago(t: number, now: number) {
  const d = daysUntil(now, t);
  return d === 0 ? 'today' : d === 1 ? 'yesterday' : `${d} days ago`;
}
/** Evidence parts → one line: "Last right 9 days ago · 2 of your last 5 wrong · secured 3 Oct". */
export const sentence = (parts: (string | false | null | undefined)[]) =>
  parts.filter((p): p is string => !!p).map((p, i) => (i ? p : p[0].toUpperCase() + p.slice(1))).join(' · ');

/** Wrong as the error log counts it: marked, and under half marks. */
export const isWrong = (a: Attempt) => { const o = outcome(a); return o !== null && o < 0.5; };
/** Marked attempts, newest first. */
const markedNewestFirst = (as: Attempt[]) => as.filter((a) => outcome(a) !== null).sort((a, b) => b.at - a.at);

// ---------- recall estimate ----------

/**
 * Days for a concept's memory to fall to 90% recall, by criterion stage — used only when none of the concept's
 * flashcards has FSRS data: learning 1 day; learned 3 days, doubling with each spaced relearn (3 → 6 → 12);
 * secured 30 days.
 */
export function stageStability(c: Criterion | undefined): number {
  if (c?.securedAt) return 30;
  if (c?.learnedAt) return 3 * 2 ** Math.min(c.relearnSessions.length, RELEARN_TARGET - 1);
  return 1;
}
export const MIN_STABILITY = 0.25;

export interface Recall {
  /** Estimated probability of recalling the concept now, 0–1. */
  r: number;
  source: 'fsrs' | 'decay';
  /** FSRS: how many reviewed cards were averaged, and the weakest one. */
  cards: number;
  lowest?: number;
  /** Decay: the last right answer, the stability used (days) and wrong answers since that right one. */
  lastRight?: number;
  stability?: number;
  wrongSince: number;
}

/**
 * Recall estimate for one concept (its attempts, criterion row and FSRS card states).
 *
 * 1. FSRS, when any of the concept's cards has been reviewed (state ≠ New, not suspended):
 *      r = mean over those cards of ts-fsrs get_retrievability(card, now).
 * 2. Otherwise a decay from the last right answer, on the same FSRS forgetting curve:
 *      r = (1 + F · t / S)^−d, with d = w20 (default_w, 0.1542) and F = 0.9^(−1/d) − 1, so r = 90% when t = S;
 *      t = days since the last right answer; S = stageStability(criterion) × 0.5^k, floored at 0.25 days, where k is
 *      the number of wrong answers since that right one (each later miss halves the memory's staying power).
 *    Answered but never right → r = 0.
 * 3. Never answered and no reviewed cards → null (nothing known).
 */
export function recallEstimate(attempts: Attempt[], criterion: Criterion | undefined, cards: CardState[], now: number): Recall | null {
  const reviewed = cards.filter((c) => !c.suspended && typeof c.fsrs?.state === 'number' && c.fsrs.state !== State.New);
  if (reviewed.length) {
    const f = scheduler();
    const rs = reviewed.map((c) => f.get_retrievability(fromStored(c.fsrs, now), new Date(now), false));
    return { r: rs.reduce((s, x) => s + x, 0) / rs.length, source: 'fsrs', cards: rs.length, lowest: Math.min(...rs), wrongSince: 0 };
  }
  const marked = attempts.filter((a) => outcome(a) !== null);
  if (!marked.length) return null;
  const lastRight = Math.max(-Infinity, ...marked.filter(isCorrect).map((a) => a.at), criterion?.lastCorrectAt ?? -Infinity);
  if (!Number.isFinite(lastRight)) return { r: 0, source: 'decay', cards: 0, wrongSince: marked.filter(isWrong).length };
  const wrongSince = marked.filter((a) => a.at > lastRight && isWrong(a)).length;
  const stability = Math.max(MIN_STABILITY, stageStability(criterion) * 0.5 ** wrongSince);
  const t = Math.max(0, (now - lastRight) / DAY);
  return { r: forgetting_curve(default_w, t, stability), source: 'decay', cards: 0, lastRight, stability, wrongSince };
}

const daysWord = (d: number) => (d < 1 ? `${Math.round(d * 24)} hours` : plural(Math.round(d), 'day'));

/** How the recall number was reached, in plain words. */
export function recallBasis(rec: Recall): string {
  if (rec.source === 'fsrs') return `from ${plural(rec.cards, 'flashcard')} you have reviewed: ${pct(rec.r)} on average, weakest ${pct(rec.lowest ?? rec.r)}`;
  if (rec.lastRight === undefined) return `no right answer yet, so the estimate starts at 0%`;
  const halved = rec.wrongSince ? `, halved for the ${plural(rec.wrongSince, 'miss', 'misses')} since` : '';
  return `estimated from your last right answer: at this stage recall falls to 90% after about ${daysWord(rec.stability ?? 1)}${halved}`;
}

// ---------- evidence ----------

function recentLine(wrong: number, n: number) {
  if (n === 1) return wrong ? 'last answer wrong' : 'last answer right';
  if (!wrong) return `${n === 2 ? 'both' : 'all'} of your last ${n} right`;
  return `${wrong} of your last ${n} wrong`;
}

function stageLine(c: Criterion | undefined) {
  if (c?.securedAt) return `secured ${fmtDay(c.securedAt)}`;
  if (c?.learnedAt) return `learned ${fmtDay(c.learnedAt)}, ${c.relearnSessions.length} of ${RELEARN_TARGET} spaced relearns`;
  return null;
}

/** Plain evidence for a concept: last right, the last five answers, criterion stage. */
export function evidence(attempts: Attempt[], criterion: Criterion | undefined, now: number): string[] {
  const marked = markedNewestFirst(attempts);
  const lastRight = marked.find(isCorrect)?.at ?? criterion?.lastCorrectAt;
  const recent = marked.slice(0, 5);
  return [
    lastRight !== undefined ? `last right ${ago(lastRight, now)}` : marked.length ? `not right yet in ${plural(marked.length, 'try', 'tries')}` : 'not answered yet',
    recent.length ? recentLine(recent.filter(isWrong).length, recent.length) : '',
    stageLine(criterion) ?? '',
  ].filter(Boolean);
}

// ---------- strengths and recurring errors ----------

/** Strength: learned or secured, and at least this share right over the last five marked answers. */
export const STRONG_ACCURACY = 0.8;

export function strength(attempts: Attempt[], criterion: Criterion | undefined): { accuracy: number; n: number } | null {
  if (!criterion?.learnedAt) return null; // secured implies learned
  const recent = markedNewestFirst(attempts).slice(0, 5);
  if (!recent.length) return null;
  const accuracy = recent.reduce((s, a) => s + (outcome(a) ?? 0), 0) / recent.length;
  return accuracy >= STRONG_ACCURACY ? { accuracy, n: recent.length } : null;
}

export interface ErrorPattern {
  wrong: number;
  sure: number;
  unsure: number;
  guess: number;
  kind: 'misconception' | 'gap';
  lastWrong: number;
  /** Right answers after the last wrong one. */
  rightSince: number;
}

/**
 * A recurring error: wrong at least twice. Misconception when "sure" accounts for at least half of the wrong answers
 * that carry a confidence (sure and wrong: a belief to replace); otherwise a gap (unsure or guessing and wrong, or no
 * confidence recorded: something not learned yet).
 */
export function errorPattern(attempts: Attempt[]): ErrorPattern | null {
  const wrongs = attempts.filter(isWrong);
  if (wrongs.length < 2) return null;
  const count = (c: string) => wrongs.filter((a) => a.confidence === c).length;
  const sure = count('sure'), unsure = count('unsure'), guess = count('guess');
  const lastWrong = Math.max(...wrongs.map((a) => a.at));
  return {
    wrong: wrongs.length, sure, unsure, guess,
    kind: sure > 0 && sure >= unsure + guess ? 'misconception' : 'gap',
    lastWrong,
    rightSince: attempts.filter((a) => a.at > lastWrong && isCorrect(a)).length,
  };
}

export function errorEvidence(p: ErrorPattern): string[] {
  const how = [p.sure && `${p.sure} while sure`, p.unsure && `${p.unsure} unsure`, p.guess && `${p.guess} guessing`].filter(Boolean).join(', ');
  return [`wrong ${times(p.wrong)}`, how, `last wrong ${fmtDay(p.lastWrong)}`, p.rightSince ? `right ${times(p.rightSince)} since` : ''].filter(Boolean);
}

// ---------- the whole model ----------

export interface ConceptRef { id: string; title: string; href: string; unit: string; code: string; examDate: number }

export interface ModelInput {
  concepts: ConceptRef[];
  attempts: Attempt[];
  criteria: Map<string, Criterion>;
  /** FSRS card states grouped by concept (see conceptOfCard). */
  cards: Map<string, CardState[]>;
  now: number;
}

export interface StrengthItem { c: ConceptRef; accuracy: number; n: number; secured: boolean; why: string }
export interface ErrorItem { c: ConceptRef; p: ErrorPattern; why: string }
export interface ReviewItem { c: ConceptRef; recall: Recall; target: number; why: string; href: string; action: string }
export interface LearnerModel {
  strengths: StrengthItem[];
  misconceptions: ErrorItem[];
  gaps: ErrorItem[];
  review: ReviewItem[];
  /** Concepts with any answer or reviewed card; marked answers counted. */
  seen: number;
  answers: number;
}

export function learnerModel({ concepts, attempts, criteria, cards, now }: ModelInput): LearnerModel {
  const byConcept = new Map<string, Attempt[]>();
  for (const a of attempts) byConcept.set(a.concept, [...(byConcept.get(a.concept) ?? []), a]);
  const out: LearnerModel = { strengths: [], misconceptions: [], gaps: [], review: [], seen: 0, answers: 0 };
  for (const c of concepts) {
    const as = byConcept.get(c.id) ?? [];
    const crit = criteria.get(c.id);
    const cs = cards.get(c.id) ?? [];
    out.answers += as.filter((a) => outcome(a) !== null).length;
    const recall = recallEstimate(as, crit, cs, now);
    if (!recall) continue;
    out.seen += 1;
    const ev = evidence(as, crit, now);

    const s = strength(as, crit);
    if (s) out.strengths.push({ c, ...s, secured: !!crit?.securedAt, why: sentence(ev) });

    const p = errorPattern(as);
    if (p) (p.kind === 'misconception' ? out.misconceptions : out.gaps).push({ c, p, why: sentence(errorEvidence(p)) });

    const target = retentionFor(c.examDate, now);
    if (recall.r < target) {
      const fsrs = recall.source === 'fsrs';
      out.review.push({
        c, recall, target,
        why: sentence([...ev, recallBasis(recall), `below your ${pct(target)} target`]),
        href: fsrs ? `/${c.unit}/cards?concept=${c.id}` : `/${c.unit}/quiz?concept=${c.id}`,
        action: fsrs ? 'Review its cards' : 'Answer a few',
      });
    }
  }
  out.strengths.sort((a, b) => Number(b.secured) - Number(a.secured) || b.accuracy - a.accuracy || a.c.title.localeCompare(b.c.title));
  const byErr = (a: ErrorItem, b: ErrorItem) => b.p.wrong - a.p.wrong || b.p.lastWrong - a.p.lastWrong;
  out.misconceptions.sort(byErr);
  out.gaps.sort(byErr);
  out.review.sort((a, b) => a.recall.r - b.recall.r || a.c.title.localeCompare(b.c.title));
  return out;
}

/** The concept a card state belongs to: explain-back cards carry it in the id; others come from the deck map. */
export const conceptOfCard = (cardId: string, deck: Map<string, string>) => (cardId.startsWith('explain-') ? cardId.slice(8) : deck.get(cardId));

export function groupCards(cards: CardState[], deck: Map<string, string>) {
  const m = new Map<string, CardState[]>();
  for (const c of cards) {
    const k = conceptOfCard(c.cardId, deck);
    if (k) m.set(k, [...(m.get(k) ?? []), c]);
  }
  return m;
}

// ---------- open questions (settings: 'open-questions') ----------

export const OPEN_QUESTIONS_KEY = 'open-questions';
export interface OpenQuestion { id: string; text: string; at: number; resolvedAt?: number }

export function addQuestion(list: OpenQuestion[], text: string, now: number, id = `oq-${now.toString(36)}-${list.length}`): OpenQuestion[] {
  const t = text.trim().replace(/\s+/g, ' ');
  return t ? [...list, { id, text: t, at: now }] : list;
}
export const toggleResolved = (list: OpenQuestion[], id: string, now: number): OpenQuestion[] =>
  list.map((q) => (q.id !== id ? q : q.resolvedAt ? { id: q.id, text: q.text, at: q.at } : { ...q, resolvedAt: now }));
export const removeQuestion = (list: OpenQuestion[], id: string) => list.filter((q) => q.id !== id);

// ---------- misconception journal (settings: 'journal:<questionId>') ----------

export interface JournalEntry { believed: string; fixed: string; at: number }
export const JOURNAL_PREFIX = 'journal:';
export const journalKey = (questionId: string) => `${JOURNAL_PREFIX}${questionId}`;
export const hasJournal = (e: JournalEntry | null | undefined): e is JournalEntry => !!e && !!(e.believed?.trim() || e.fixed?.trim());

const oneLine = (s: string) => s.replace(/\s+/g, ' ').trim();

/** The journal as Markdown, grouped by concept in the order given (for Notion, Drive or a plain notes file). */
export function journalMarkdown(title: string, rows: { concept: string; stem: string; entry: JournalEntry }[]): string {
  const lines = [`# ${title}`, ''];
  const groups = new Map<string, typeof rows>();
  for (const r of rows) if (hasJournal(r.entry)) groups.set(r.concept, [...(groups.get(r.concept) ?? []), r]);
  if (!groups.size) lines.push('_No entries yet._', '');
  for (const [concept, rs] of groups) {
    lines.push(`## ${oneLine(concept)}`, '');
    for (const r of rs) {
      lines.push(`### ${oneLine(r.stem)}`, '');
      lines.push(`- **What I believed:** ${oneLine(r.entry.believed) || '—'}`);
      lines.push(`- **What fixed it:** ${oneLine(r.entry.fixed) || '—'}`);
      lines.push(`- _Written ${fmtDay(r.entry.at)}_`, '');
    }
  }
  return lines.join('\n');
}

// ---------- exam debrief split ----------

/**
 * Time per question from the order of interactions: each click (certainty or option) is charged the time since the
 * previous click anywhere on the paper (or since the start), to the question it was on. Time after the last click is
 * not charged (reviewing before Finish).
 */
export function chargeTime(events: { i: number; t: number }[], start: number, n: number): number[] {
  const out = Array<number>(n).fill(0);
  let prev = start;
  for (const e of [...events].sort((a, b) => a.t - b.t)) {
    if (e.i >= 0 && e.i < n) out[e.i] += Math.max(0, e.t - prev);
    prev = e.t;
  }
  return out;
}

export interface PaperAnswer { concept: string; answered: boolean; correct: boolean; certainty: 1 | 2 | 3 | null; ms: number }
export interface DebriefSplit {
  /** Indices into the paper. Certainty defaults to C1 when none was chosen, as in the marking. */
  misconceptions: number[]; // C3 (sure) and wrong
  gaps: number[]; // C1 (guess) and wrong
  shaky: number[]; // C2 (unsure) and wrong
  slow: number[]; // answered, over twice the median time
  blank: number[]; // left unanswered
  timing: number[]; // slow ∪ blank, in paper order
  median: number;
}

const median = (xs: number[]) => {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b), m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

export function debriefSplit(xs: PaperAnswer[]): DebriefSplit {
  const idx = (f: (x: PaperAnswer) => boolean) => xs.flatMap((x, i) => (f(x) ? [i] : []));
  const wrongAt = (c: number) => idx((x) => x.answered && !x.correct && (x.certainty ?? 1) === c);
  const med = median(xs.filter((x) => x.answered).map((x) => x.ms));
  const slow = med > 0 ? idx((x) => x.answered && x.ms > 2 * med) : [];
  const blank = idx((x) => !x.answered);
  return { misconceptions: wrongAt(3), gaps: wrongAt(1), shaky: wrongAt(2), slow, blank, timing: [...slow, ...blank].sort((a, b) => a - b), median: med };
}

/** Concepts behind a group of questions with how many each, most first (ties in paper order). */
export function conceptCounts(indices: number[], concepts: string[]): { concept: string; n: number }[] {
  const m = new Map<string, number>();
  for (const i of indices) m.set(concepts[i], (m.get(concepts[i]) ?? 0) + 1);
  return [...m].map(([concept, n]) => ({ concept, n })).sort((a, b) => b.n - a.n);
}

// ---------- teach-back coverage ----------

export interface KeyIdea { label: string; kind: 'term' | 'element' | 'core'; covered: boolean }
export const CORE_LABEL = 'the core idea';
/** Share of a phrase's word stems that must appear: terms and element names half, the plain statement 40%. */
export const IDEA_SHARE = 0.5;
export const CORE_SHARE = 0.4;

/** Loose stem equality on top of stems(): "reasonably foreseeable" meets "reasonable foreseeability". */
const near = (a: string, b: string) => {
  let k = 0;
  while (k < a.length && k < b.length && a[k] === b[k]) k++;
  return k >= 6 && k >= 0.8 * Math.min(a.length, b.length);
};
const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Which of the concept's key ideas (aid terms, element names, plain statement) the learner's explanation mentions.
 * A word-match check, not a mark. Null when there is no aid or it has no key ideas.
 */
export function teachBackCoverage(aid: Aid | null | undefined, text: string): { covered: KeyIdea[]; missing: KeyIdea[] } | null {
  if (!aid) return null;
  const ideas: { label: string; kind: KeyIdea['kind']; phrase: string }[] = [];
  const seen = new Set<string>();
  const push = (label: string, kind: KeyIdea['kind'], phrase = label) => {
    const k = label?.trim().toLowerCase();
    if (!k || seen.has(k)) return;
    seen.add(k);
    ideas.push({ label: label.trim(), kind, phrase });
  };
  for (const t of aid.terms ?? []) push(t.term, 'term');
  for (const e of aid.elements ?? []) push(e.name, 'element');
  if (aid.plain?.trim()) push(CORE_LABEL, 'core', aid.plain);
  if (!ideas.length) return null;

  const written = stems(text);
  const has = (phrase: string, kind: KeyIdea['kind']) => {
    const p = [...stems(phrase)];
    if (!p.length) return new RegExp(`(^|\\W)${escapeRe(phrase.trim())}(\\W|$)`, 'i').test(text);
    const words = new Set(written);
    for (const w of p) if (!words.has(w) && [...written].some((x) => near(w, x))) words.add(w);
    return overlap(phrase, words) >= (kind === 'core' ? CORE_SHARE : IDEA_SHARE);
  };
  const all = ideas.map((i) => ({ label: i.label, kind: i.kind, covered: has(i.phrase, i.kind) }));
  return { covered: all.filter((i) => i.covered), missing: all.filter((i) => !i.covered) };
}
