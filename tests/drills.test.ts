import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Aid } from '../src/lib/aids';
import {
  buildDrills, contrastGroups, contrastRound, diagnosticMap, diagnosticSet, drillId, limitRuns, pickDrills, SELF_SCORE,
  type Drill, type SpotDrill,
} from '../src/lib/drills';
import type { ConceptMeta, Question } from '../src/components/quiz/types';

// recordAttempt runs against an in-memory stand-in for the Dexie tables.
const fake = vi.hoisted(() => {
  const attempts: unknown[] = [];
  const requeue: { itemId: string; dueAt: number; done: 0 | 1 }[] = [];
  const settings = new Map<string, unknown>();
  const criterion = new Map<string, unknown>();
  const db = {
    attempts: { add: async (a: unknown) => attempts.push(a) },
    requeue: {
      bulkAdd: async (rows: typeof requeue) => { requeue.push(...rows); },
      where: () => ({ equals: (id: string) => ({ filter: (f: (r: unknown) => boolean) => ({ first: async () => requeue.map((r, i) => ({ ...r, id: i })).filter((r) => r.itemId === id).find(f) }) }) }),
      update: async () => 1,
    },
    settings: { put: async (s: { key: string; value: unknown }) => { settings.set(s.key, s.value); } },
    sessions: { put: () => Promise.resolve() },
    criterion: { get: async (id: string) => criterion.get(id), put: async (c: { conceptId: string }) => { criterion.set(c.conceptId, c); } },
    transaction: async (_mode: string, _table: unknown, fn: () => Promise<void>) => fn(),
  };
  return { attempts, requeue, settings, criterion, db };
});
vi.mock('../src/lib/db', () => ({ db: fake.db }));
const { recordAttempt, isBankQuestion, REQUEUE_OFFSETS } = await import('../src/lib/learning');

const aid = (concept: string, week: string, extra: Partial<Aid> = {}): Aid => ({
  concept, unit: 'u1', week, plain: `${concept} plain truth.`, formal: `${concept} formal truth.`, terms: [], misconceptions: [], socratic: [], elements: [],
  'what-if': [], boundary: [], transfer: [], objections: [], storyboard: [], sources: [], verify: false, ...extra,
});
const full = (concept: string, week: string) => aid(concept, week, {
  misconceptions: [{ claim: `${concept} myth`, tempting: 'looks right', correction: 'actually not' }],
  'what-if': [{ change: `${concept} change`, effect: 'effect' }],
  boundary: [{ text: `${concept} edge`, why: 'why' }],
  transfer: [{ scenario: `${concept} scenario`, answer: 'answer' }],
});

describe('drill ids and self-rating', () => {
  it('namespaces drill attempts so they are never mistaken for bank questions', () => {
    expect(drillId('spot', 'u1-w01-a', 2)).toBe('drill:spot:u1-w01-a:2');
    expect(SELF_SCORE).toEqual({ right: 1, partly: 0.5, missed: 0 });
  });
});

describe('buildDrills', () => {
  const aids = { a: full('a', 'w1'), b: full('b', 'w1'), c: full('c', 'w2'), d: aid('d', 'w1') };

  it('builds every kind the aids support, with stable ids', () => {
    const ds = buildDrills(aids, 7);
    const count = (k: Drill['kind']) => ds.filter((d) => d.kind === k).length;
    expect([count('spot'), count('whatif'), count('edge'), count('transfer')]).toEqual([3, 3, 3, 3]);
    expect(ds.find((d) => d.kind === 'edge' && d.concept === 'c')!.id).toBe('drill:edge:c:0');
    expect(buildDrills(aids, 7)).toEqual(ds); // seeded: same set every render
  });

  it('spot the error: one claim among two true statements from two other concepts, same week first', () => {
    const spot = buildDrills(aids, 3).find((d): d is SpotDrill => d.kind === 'spot' && d.concept === 'a')!;
    expect(spot.statements).toHaveLength(3);
    expect(spot.statements.filter((s) => s.wrong)).toEqual([{ text: 'a myth', concept: 'a', wrong: true }]);
    const truths = spot.statements.filter((s) => !s.wrong);
    expect(new Set(truths.map((t) => t.concept)).size).toBe(2);
    expect(truths.map((t) => t.concept).sort()).toEqual(['b', 'd']); // both week-1 neighbours before week 2
    expect(truths.every((t) => t.text === `${t.concept} plain truth.`)).toBe(true);
  });

  it('skips spot the error when fewer than two other concepts have statements, and degrades to nothing when empty', () => {
    const two = buildDrills({ a: full('a', 'w1'), b: aid('b', 'w1') }, 1);
    expect(two.some((d) => d.kind === 'spot')).toBe(false);
    expect(two.filter((d) => d.concept === 'a')).toHaveLength(3);
    expect(buildDrills({}, 1)).toEqual([]);
  });
});

describe('pickDrills', () => {
  const aids = Object.fromEntries(['a', 'b', 'c', 'd', 'e', 'f'].map((c, i) => [c, full(c, `w${(i % 3) + 1}`)]));
  const drills = buildDrills(aids, 11);

  it('mixes all four kinds and interleaves weeks', () => {
    const set = pickDrills({ drills, attempts: [], n: 8, seed: 5 });
    expect(set).toHaveLength(8);
    expect(new Set(set.map((d) => d.kind)).size).toBe(4);
    for (let i = 1; i < set.length; i++) expect(set[i].week).not.toBe(set[i - 1].week);
  });

  it('serves never-tried drills before ones already done', () => {
    const done = drills.filter((d) => d.kind === 'edge').slice(0, 4).map((d, i) => ({ questionId: d.id, at: 1000 + i }));
    for (let seed = 1; seed < 30; seed++) {
      const edge = pickDrills({ drills, attempts: done, n: 8, seed }).filter((d) => d.kind === 'edge');
      expect(edge).toHaveLength(2); // 8 drills over 4 kinds; only 2 of the 6 edge cases are untried
      expect(edge.every((d) => !done.some((a) => a.questionId === d.id))).toBe(true);
    }
  });

  it('can be limited to one concept and never exceeds what exists', () => {
    const set = pickDrills({ drills, attempts: [], n: 8, seed: 2, concept: 'c' });
    expect(set.length).toBe(4);
    expect(set.every((d) => d.concept === 'c')).toBe(true);
    expect(pickDrills({ drills: [], attempts: [], n: 8, seed: 2 })).toEqual([]);
  });
});

describe('tell apart', () => {
  const meta = (week: string, contrastsWith: string[] = []): ConceptMeta => ({ title: week, href: '', week, contrastsWith });
  const concepts: Record<string, ConceptMeta> = {
    a: meta('w1', ['b', 'c']),
    b: meta('w1', ['a']), // {a,b} is inside {a,b,c}: dropped
    c: meta('w1', ['a', 'b']), // same set as a's: dropped
    d: meta('w2', ['e', 'zz']), // zz does not exist
    e: meta('w2', ['d']),
    f: meta('w3', ['g']), // g has no questions
    g: meta('w3'),
  };
  const eligible = (id: string) => id !== 'g';

  it('groups each concept with the ideas it is confused with, without duplicates or subsets', () => {
    const groups = contrastGroups(concepts, eligible, 1);
    expect(groups.map((g) => [...g].sort().join(''))).toEqual(expect.arrayContaining(['abc', 'de']));
    expect(groups).toHaveLength(2);
  });

  it('starts with the requested concept’s pairs', () => {
    for (let seed = 1; seed < 20; seed++) expect([...contrastGroups(concepts, eligible, seed, 'e')[0]].sort()).toEqual(['d', 'e']);
    expect(contrastGroups(concepts, eligible, 9, 'b')[0].sort()).toEqual(['a', 'b', 'c']);
  });

  it('is empty when a unit has no contrast edges', () => {
    expect(contrastGroups({ a: meta('w1'), b: meta('w1') }, () => true, 1)).toEqual([]);
  });

  it('a round draws from every concept in the group, interleaved, never three in a row from one', () => {
    const qs = [...['a', 'b'].flatMap((c) => Array.from({ length: 6 }, (_, i) => ({ id: `${c}${i}`, concept: c }))), { id: 'x0', concept: 'x' }];
    for (let seed = 1; seed < 40; seed++) {
      const round = contrastRound(['a', 'b'], qs, [], 6, seed);
      expect(round).toHaveLength(6);
      expect(round.filter((q) => q.concept === 'a')).toHaveLength(3);
      expect(round.some((q) => q.concept === 'x')).toBe(false);
      for (let i = 2; i < round.length; i++) expect(round[i].concept === round[i - 1].concept && round[i].concept === round[i - 2].concept).toBe(false);
    }
    expect(contrastRound(['a', 'b'], qs, [], 6, 3)).toEqual(contrastRound(['a', 'b'], qs, [], 6, 3));
  });

  it('limitRuns breaks long runs when another key is available', () => {
    expect(limitRuns(['a', 'a', 'a', 'b'], (x) => x, 2)).toEqual(['a', 'a', 'b', 'a']);
    expect(limitRuns(['a', 'a', 'a'], (x) => x, 2)).toEqual(['a', 'a', 'a']);
  });
});

describe('where am I? diagnostic', () => {
  const q = (id: string, week: string | undefined, concept: string, type: Question['type'], set?: 'pretest'): Question =>
    ({ id, unit: 'u1', concept, week, difficulty: 1, type, set, stem: '', options: [], statement: '', answer: true, why: '' }) as unknown as Question;
  const bank = {
    weeks: [{ id: 'w2', number: 2, topic: 'Two' }, { id: 'w1', number: 1, topic: 'One' }, { id: 'w3', number: 3, topic: 'Three' }, { id: 'w4', number: 4, topic: 'Four' }],
    concepts: { k1: { title: '', href: '', week: 'w1' }, k2: { title: '', href: '', week: 'w2' }, k3: { title: '', href: '', week: 'w3' } } as Record<string, ConceptMeta>,
    questions: [
      q('w1-q1', 'w1', 'k1', 'mcq'), q('w1-p1', 'w1', 'k1', 'mcq', 'pretest'), q('w1-p2', 'w1', 'k1', 'truefalse', 'pretest'),
      q('w2-s', 'w2', 'k2', 'short'), q('w2-t', undefined, 'k2', 'truefalse'), // week from its concept
      q('w3-l', 'w3', 'k3', 'long'), // no choice question: week 3 left out
    ],
  };

  it('one question per week in week order, pretest set first, choice questions only', () => {
    const rows = diagnosticSet(bank, [], 4);
    expect(rows.map((r) => r.week.number)).toEqual([1, 2]);
    expect(['w1-p1', 'w1-p2']).toContain(rows[0].id);
    expect(rows[1].id).toBe('w2-t');
  });

  it('prefers a pretest question not yet seen', () => {
    for (let seed = 1; seed < 20; seed++) expect(diagnosticSet(bank, [{ questionId: 'w1-p1', at: 5 }], seed)[0].id).toBe('w1-p2');
  });

  it('the starting map shows each week’s latest result since the diagnostic began', () => {
    const rows = diagnosticSet(bank, [{ questionId: 'w1-p1', at: 5 }], 1);
    const map = diagnosticMap(rows, [
      { questionId: 'w1-p2', at: 50, correct: true }, // before this run: ignored
      { questionId: 'w1-p2', at: 150, correct: false },
      { questionId: 'w1-p2', at: 200, correct: true },
    ], 100);
    expect(map.map((r) => r.correct)).toEqual([true, null]);
  });
});

describe('learning: sure-and-wrong requeues only for bank questions', () => {
  beforeEach(() => { fake.attempts.length = 0; fake.requeue.length = 0; fake.settings.clear(); });
  const base = { unit: 'u1', concept: 'u1-w01-a', week: 'u1-w01', answer: 0, correct: false, confidence: 'sure' as const, durationMs: 1, at: 1_000_000 };

  it('recognises drill ids', () => {
    expect(isBankQuestion('laws2400-w01-q001')).toBe(true);
    expect(isBankQuestion('drill:spot:laws2400-w01-a:0')).toBe(false);
  });

  it('a sure-and-wrong drill answer is recorded but creates no requeue rows', async () => {
    await recordAttempt({ ...base, questionId: drillId('spot', 'u1-w01-a', 0), type: 'mcq', mode: 'drill' });
    expect(fake.attempts).toHaveLength(1);
    expect(fake.requeue).toHaveLength(0);
    expect(fake.criterion.has('u1-w01-a')).toBe(true);
  });

  it('a sure-and-wrong bank question still comes back at +10 min, +1 day and +4 days', async () => {
    await recordAttempt({ ...base, questionId: 'u1-w01-q001', type: 'mcq' });
    expect(fake.requeue.map((r) => r.dueAt - base.at)).toEqual(REQUEUE_OFFSETS);
    expect(fake.settings.has('watch:u1-w01-q001')).toBe(true);
  });
});
