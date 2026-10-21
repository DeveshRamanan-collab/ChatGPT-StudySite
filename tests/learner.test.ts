import { describe, it, expect } from 'vitest';
import { createEmptyCard, Rating, type Grade } from 'ts-fsrs';
import type { Attempt, CardState, Criterion } from '../src/lib/db';
import type { Aid } from '../src/lib/aids';
import { review } from '../src/lib/fsrs';
import * as L from '../src/lib/learner';

const T0 = Date.UTC(2026, 9, 20, 2, 0); // 20 Oct 2026 13:00 in Sydney
const H = 3_600_000, D = 24 * H;
let n = 0;
const at = (over: Partial<Attempt>): Attempt => ({
  questionId: `q${++n}`, unit: 'laws2400', concept: 'c1', type: 'mcq', answer: 0, correct: true, durationMs: 30_000, sessionId: 's1', at: T0, ...over,
});
const crit = (over: Partial<Criterion> = {}): Criterion => ({ conceptId: 'c1', correctInSession: 0, sessionId: 's1', relearnSessions: [], ...over });
const ref = (id: string, over: Partial<L.ConceptRef> = {}): L.ConceptRef => ({ id, title: id.toUpperCase(), href: `/laws2400/concept/${id}`, unit: 'laws2400', code: 'LAWS2400', examDate: T0 + 60 * D, ...over });

describe('stageStability', () => {
  it('grows with the criterion stage', () => {
    expect(L.stageStability(undefined)).toBe(1);
    expect(L.stageStability(crit())).toBe(1);
    expect(L.stageStability(crit({ learnedAt: T0 }))).toBe(3);
    expect(L.stageStability(crit({ learnedAt: T0, relearnSessions: [T0 + 2 * D] }))).toBe(6);
    expect(L.stageStability(crit({ learnedAt: T0, relearnSessions: [1, 2] }))).toBe(12);
    expect(L.stageStability(crit({ learnedAt: T0, securedAt: T0, relearnSessions: [1, 2, 3] }))).toBe(30);
  });
});

describe('recallEstimate (decay fallback)', () => {
  it('is null with nothing to go on, 0 when never right', () => {
    expect(L.recallEstimate([], undefined, [], T0)).toBeNull();
    const r = L.recallEstimate([at({ correct: false }), at({ correct: false })], undefined, [], T0)!;
    expect(r).toMatchObject({ r: 0, source: 'decay', wrongSince: 2 });
    expect(L.recallBasis(r)).toMatch(/no right answer yet/);
  });
  it('is 90% after exactly one stability, near 100% straight after, and falls with time', () => {
    const learned = crit({ learnedAt: T0 });
    const a = [at({ at: T0 })];
    expect(L.recallEstimate(a, learned, [], T0)!.r).toBeCloseTo(1, 5);
    expect(L.recallEstimate(a, learned, [], T0 + 3 * D)!.r).toBeCloseTo(0.9, 3);
    const r10 = L.recallEstimate(a, learned, [], T0 + 10 * D)!;
    expect(r10.r).toBeLessThan(0.9);
    expect(r10).toMatchObject({ source: 'decay', stability: 3, lastRight: T0, wrongSince: 0 });
  });
  it('a secured concept fades more slowly than one still being learned', () => {
    const a = [at({ at: T0 })];
    const learning = L.recallEstimate(a, crit(), [], T0 + 7 * D)!.r;
    const secured = L.recallEstimate(a, crit({ learnedAt: T0, securedAt: T0 }), [], T0 + 7 * D)!.r;
    expect(secured).toBeGreaterThan(learning);
  });
  it('halves stability for each miss since the last right answer (floor 0.25 d)', () => {
    const r = L.recallEstimate([at({ at: T0 }), at({ at: T0 + H, correct: false }), at({ at: T0 + 2 * H, correct: false })], crit({ learnedAt: T0 }), [], T0 + D)!;
    expect(r.stability).toBe(0.75);
    expect(r.wrongSince).toBe(2);
    expect(L.recallBasis(r)).toMatch(/halved for the 2 misses since/);
    const many = L.recallEstimate([at({ at: T0 }), ...[1, 2, 3, 4, 5].map((k) => at({ at: T0 + k * H, correct: false }))], crit(), [], T0 + D)!;
    expect(many.stability).toBe(L.MIN_STABILITY);
  });
  it('counts a rubric score ≥ 70% as right', () => {
    const r = L.recallEstimate([at({ correct: null, score: 0.8, at: T0 })], crit(), [], T0 + D)!;
    expect(r.lastRight).toBe(T0);
  });
});

describe('recallEstimate (FSRS)', () => {
  const reviewed = (id: string, grade: Grade, when: number): CardState => review(id, 'laws2400', undefined, grade, when).state;
  it('uses the retrievability of reviewed cards, ignoring new and suspended ones', () => {
    const a = reviewed('k1', Rating.Good as Grade, T0);
    const b = reviewed('k2', Rating.Again as Grade, T0);
    const fresh: CardState = { cardId: 'k3', fsrs: { ...createEmptyCard(new Date(T0)), due: T0 }, due: T0, reps: 0, lapses: 0 };
    const off: CardState = { ...reviewed('k4', Rating.Easy as Grade, T0), suspended: 1 };
    const r = L.recallEstimate([at({ correct: false })], undefined, [a, b, fresh, off], T0 + 2 * D)!;
    expect(r.source).toBe('fsrs');
    expect(r.cards).toBe(2);
    expect(r.r).toBeGreaterThan(0);
    expect(r.r).toBeLessThan(1);
    expect(r.lowest!).toBeLessThanOrEqual(r.r);
    expect(L.recallBasis(r)).toMatch(/^from 2 flashcards you have reviewed/);
  });
  it('falls back to the decay when every card is new', () => {
    const fresh: CardState = { cardId: 'k3', fsrs: { ...createEmptyCard(new Date(T0)), due: T0 }, due: T0, reps: 0, lapses: 0 };
    expect(L.recallEstimate([at({})], crit(), [fresh], T0)!.source).toBe('decay');
  });
});

describe('evidence and sentence', () => {
  it('reads like the brief: last right, last five, stage', () => {
    const as = [
      at({ at: T0 - 20 * D }), at({ at: T0 - 15 * D }), at({ at: T0 - 9 * D }),
      at({ at: T0 - 5 * D, correct: false }), at({ at: T0 - 2 * D, correct: false }),
    ];
    const c = crit({ learnedAt: T0 - 20 * D, securedAt: Date.UTC(2026, 9, 3, 2), relearnSessions: [1, 2, 3] });
    expect(L.sentence(L.evidence(as, c, T0))).toBe('Last right 9 days ago · 2 of your last 5 wrong · secured 3 Oct');
  });
  it('handles one answer, never right, nothing yet', () => {
    expect(L.evidence([at({ at: T0 })], undefined, T0)).toEqual(['last right today', 'last answer right']);
    expect(L.evidence([at({ correct: false }), at({ correct: false })], undefined, T0)[0]).toBe('not right yet in 2 tries');
    expect(L.evidence([], undefined, T0)).toEqual(['not answered yet']);
  });
});

describe('strength and errorPattern', () => {
  it('needs learned + ≥ 80% over the last five', () => {
    const good = [at({}), at({}), at({}), at({}), at({ correct: false, at: T0 - D })];
    expect(L.strength(good, crit())).toBeNull();
    expect(L.strength(good, crit({ learnedAt: T0 }))).toEqual({ accuracy: 0.8, n: 5 });
    expect(L.strength([at({}), at({ correct: false }), at({ correct: false })], crit({ learnedAt: T0 }))).toBeNull();
  });
  it('splits misconceptions (sure) from gaps (unsure/guess)', () => {
    expect(L.errorPattern([at({ correct: false, confidence: 'sure' })])).toBeNull();
    const m = L.errorPattern([at({ correct: false, confidence: 'sure', at: T0 }), at({ correct: false, confidence: 'guess', at: T0 + H }), at({ at: T0 + 2 * H })])!;
    expect(m).toMatchObject({ wrong: 2, sure: 1, guess: 1, kind: 'misconception', lastWrong: T0 + H, rightSince: 1 });
    const g = L.errorPattern([at({ correct: false, confidence: 'sure' }), at({ correct: false, confidence: 'unsure' }), at({ correct: false, confidence: 'guess' })])!;
    expect(g.kind).toBe('gap');
    expect(L.errorPattern([at({ correct: false }), at({ correct: null, score: 0.2 })])!.kind).toBe('gap');
    expect(L.sentence(L.errorEvidence(m))).toBe('Wrong twice · 1 while sure, 1 guessing · last wrong 20 Oct · right once since');
  });
});

describe('learnerModel', () => {
  it('sorts concepts into strengths, misconceptions, gaps and review with evidence', () => {
    const now = T0 + 10 * D;
    const attempts = [
      ...[0, 1, 2, 3, 4].map((k) => at({ concept: 'strong', at: now - k * H })),
      at({ concept: 'myth', correct: false, confidence: 'sure', at: T0 }), at({ concept: 'myth', correct: false, confidence: 'sure', at: T0 + H }),
      at({ concept: 'hole', correct: false, confidence: 'guess', at: T0 }), at({ concept: 'hole', correct: false, confidence: 'unsure', at: T0 + H }),
      at({ concept: 'fading', at: T0 }),
    ];
    const criteria = new Map([['strong', crit({ conceptId: 'strong', learnedAt: now - D, lastCorrectAt: now })], ['fading', crit({ conceptId: 'fading', lastCorrectAt: T0 })]]);
    const m = L.learnerModel({ concepts: ['strong', 'myth', 'hole', 'fading', 'unseen'].map((id) => ref(id)), attempts, criteria, cards: new Map(), now });
    expect(m.strengths.map((s) => s.c.id)).toEqual(['strong']);
    expect(m.misconceptions.map((s) => s.c.id)).toEqual(['myth']);
    expect(m.gaps.map((s) => s.c.id)).toEqual(['hole']);
    expect(m.review.map((s) => s.c.id)).toEqual(['hole', 'myth', 'fading']); // 0%, 0%, then the decayed one
    const fading = m.review.find((r) => r.c.id === 'fading')!;
    expect(fading.why).toMatch(/^Last right 10 days ago · last answer right · estimated from your last right answer/);
    expect(fading.why).toMatch(/below your 90% target$/);
    expect(fading.href).toBe('/laws2400/quiz?concept=fading');
    expect(m.seen).toBe(4);
    expect(m.answers).toBe(10);
  });
  it('raises the target to 93% within 14 days of the exam', () => {
    const now = T0 + 2 * D;
    const m = L.learnerModel({ concepts: [ref('c1', { examDate: now + 5 * D })], attempts: [at({ at: T0 })], criteria: new Map([['c1', crit({ learnedAt: T0 })]]), cards: new Map(), now });
    expect(m.review[0].target).toBe(0.93);
  });
  it('links FSRS-estimated concepts to their cards', () => {
    const k = review('laws2400-w01-c001', 'laws2400', undefined, Rating.Again as Grade, T0).state;
    const cards = L.groupCards([k, { ...k, cardId: 'explain-c1' }, { ...k, cardId: 'nobody' }], new Map([['laws2400-w01-c001', 'c1']]));
    expect(cards.get('c1')).toHaveLength(2);
    expect(L.conceptOfCard('explain-laws2400-w02-battery', new Map())).toBe('laws2400-w02-battery');
    const m = L.learnerModel({ concepts: [ref('c1')], attempts: [], criteria: new Map(), cards, now: T0 + 5 * D });
    expect(m.review[0]).toMatchObject({ href: '/laws2400/cards?concept=c1', action: 'Review its cards' });
  });
});

describe('open questions', () => {
  it('adds (trimmed, never empty), resolves, reopens and removes', () => {
    let l = L.addQuestion([], '  Is   directness still required? ', T0, 'a');
    l = L.addQuestion(l, '   ', T0, 'b');
    expect(l).toEqual([{ id: 'a', text: 'Is directness still required?', at: T0 }]);
    l = L.toggleResolved(l, 'a', T0 + D);
    expect(l[0].resolvedAt).toBe(T0 + D);
    l = L.toggleResolved(l, 'a', T0 + 2 * D);
    expect(l[0].resolvedAt).toBeUndefined();
    expect(L.removeQuestion(l, 'a')).toEqual([]);
  });
});

describe('journal', () => {
  it('knows an entry and exports Markdown grouped by concept', () => {
    expect(L.hasJournal({ believed: ' ', fixed: '', at: T0 })).toBe(false);
    expect(L.journalKey('q1')).toBe('journal:q1');
    const md = L.journalMarkdown('LAWS2400 misconception journal', [
      { concept: 'Battery', stem: 'Is   a kiss\na battery?', entry: { believed: 'Needs hostility', fixed: 'Rixon v Star City', at: T0 } },
      { concept: 'Battery', stem: 'Empty', entry: { believed: '', fixed: '', at: T0 } },
      { concept: 'Assault', stem: 'Words alone?', entry: { believed: '', fixed: 'Barton v Armstrong', at: T0 } },
    ]);
    expect(md).toBe([
      '# LAWS2400 misconception journal', '',
      '## Battery', '', '### Is a kiss a battery?', '', '- **What I believed:** Needs hostility', '- **What fixed it:** Rixon v Star City', '- _Written 20 Oct_', '',
      '## Assault', '', '### Words alone?', '', '- **What I believed:** —', '- **What fixed it:** Barton v Armstrong', '- _Written 20 Oct_', '',
    ].join('\n'));
    expect(L.journalMarkdown('X', [])).toContain('_No entries yet._');
  });
});

describe('exam debrief split', () => {
  it('charges time to the question clicked since the previous click', () => {
    expect(L.chargeTime([{ i: 0, t: 10 }, { i: 0, t: 15 }, { i: 2, t: 40 }, { i: 1, t: 45 }], 0, 3)).toEqual([15, 5, 25]);
  });
  it('groups wrong answers by certainty and flags slow and blank questions', () => {
    const x = (o: Partial<L.PaperAnswer>): L.PaperAnswer => ({ concept: 'a', answered: true, correct: true, certainty: 2, ms: 10, ...o });
    const s = L.debriefSplit([
      x({ correct: false, certainty: 3 }), x({ correct: false, certainty: 1, concept: 'b' }), x({ correct: false, certainty: null, concept: 'b' }),
      x({ correct: false, certainty: 2 }), x({ ms: 50 }), x({}), x({ answered: false, correct: false, ms: 0 }),
    ]);
    expect(s).toEqual({ misconceptions: [0], gaps: [1, 2], shaky: [3], slow: [4], blank: [6], timing: [4, 6], median: 10 });
    expect(L.conceptCounts(s.gaps.concat(s.misconceptions), ['a', 'b', 'b', 'a', 'a', 'a', 'a'])).toEqual([{ concept: 'b', n: 2 }, { concept: 'a', n: 1 }]);
  });
  it('flags nothing as slow when nothing was answered', () => {
    expect(L.debriefSplit([{ concept: 'a', answered: false, correct: false, certainty: null, ms: 0 }])).toMatchObject({ slow: [], blank: [0], median: 0 });
  });
});

describe('teachBackCoverage', () => {
  const aid = {
    concept: 'c1', unit: 'laws2400', week: 'w02',
    plain: 'Battery is a direct and intentional (or negligent) act that brings about contact with another person without lawful justification.',
    terms: [{ term: 'Directness', gloss: '' }, { term: 'Reasonable foreseeability', gloss: '' }, { term: 'act', gloss: '' }],
    elements: [{ name: 'Intention', test: '', cases: [], authorities: [] }, { name: 'directness', test: '', cases: [], authorities: [] }, { name: 'Contact with the body', test: '', cases: [], authorities: [] }],
  } as unknown as Aid;
  it('is null without an aid or key ideas', () => {
    expect(L.teachBackCoverage(undefined, 'anything')).toBeNull();
    expect(L.teachBackCoverage({ ...aid, plain: '', terms: [], elements: [] }, 'anything')).toBeNull();
  });
  it('lists covered and missing ideas, deduped, with loose stems', () => {
    const c = L.teachBackCoverage(aid, 'Battery needs a direct, intentional act, and harm must be reasonably foreseeable.')!;
    expect(c.covered.map((i) => i.label)).toEqual(['Directness', 'Reasonable foreseeability', 'act', 'Intention']);
    expect(c.missing.map((i) => i.label)).toEqual(['Contact with the body', 'the core idea']);
    const full = L.teachBackCoverage(aid, 'A battery is direct, intentional contact with another person, without lawful justification.')!;
    expect(full.covered.map((i) => i.label)).toContain('the core idea');
    expect(full.covered.map((i) => i.label)).toContain('Contact with the body');
  });
  it('says nothing is covered for an empty answer', () => {
    const c = L.teachBackCoverage(aid, '')!;
    expect(c.covered).toEqual([]);
    expect(c.missing).toHaveLength(6);
  });
});
