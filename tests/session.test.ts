import { describe, it, expect } from 'vitest';
import { remaining } from '../src/lib/block';
import { whatNext } from '../src/lib/whatnext';
import { mostImproved } from '../src/components/FocusBlock';

const now = Date.UTC(2026, 9, 1);
const units = [
  { id: 'laws2400', code: 'LAWS2400', examDate: now + 40 * 864e5, weeks: [{ id: 'laws2400-w01', number: 1, topic: 'T', href: '/laws2400/week/1', concepts: [{ id: 'laws2400-w01-a', title: 'A', href: '' }, { id: 'laws2400-w01-b', title: 'B', href: '' }] }] },
  { id: 'laws2000', code: 'LAWS2000', examDate: now + 50 * 864e5, weeks: [{ id: 'laws2000-w01', number: 1, topic: 'P', href: '/laws2000/week/1', concepts: [{ id: 'laws2000-w01-x', title: 'X', href: '' }] }] },
];
const att = (concept: string, correct: boolean, at = now - 1000) => ({ questionId: 'q', unit: concept.slice(0, 8), concept, type: 'mcq' as const, answer: 0, correct, durationMs: 1, sessionId: 's', at });

describe('block timing', () => {
  it('counts down blocks and never ends a deep dive', () => {
    expect(remaining({ kind: 'block', unit: 'u', ifThen: '', minutes: 25, startAt: now }, now + 60_000).left).toBe(24 * 60);
    expect(remaining({ kind: 'deep', unit: 'u', ifThen: '', minutes: 45, startAt: now }, now + 60_000).left).toBe(Infinity);
  });
});

describe('what next', () => {
  const base = { units, attempts: [], criteria: new Map(), requeue: [], cards: [], visited: new Set<string>(), now };
  it('due re-tests beat due cards beat reading', () => {
    const r = whatNext({ ...base, requeue: [{ itemId: 'laws2000-w01-q001', dueAt: now - 1, reason: 'sure-wrong', done: 0 }], cards: [{ cardId: 'laws2400-w01-c001', fsrs: {}, due: now - 1, reps: 1, lapses: 0 }] });
    expect(r!.href).toBe('/laws2000/quiz');
    expect(whatNext({ ...base, cards: [{ cardId: 'laws2400-w01-c001', fsrs: {}, due: now - 1, reps: 1, lapses: 0 }] })!.href).toBe('/laws2400/cards');
    expect(whatNext(base)!.href).toBe('/laws2400/week/1');
  });
  it('then the weakest seen concept of the most pressing unit', () => {
    const r = whatNext({ ...base, visited: new Set(['laws2400-w01']), attempts: [att('laws2400-w01-a', true), att('laws2400-w01-b', false)] });
    expect(r!.href).toBe('/laws2400/quiz?concept=laws2400-w01-b');
  });
});

describe('session summary', () => {
  it('finds the concept that improved most in the block', () => {
    const before = [att('k1', false), att('k1', false), att('k2', true)];
    const during = [att('k1', true), att('k1', true), att('k2', true), att('k2', false)];
    expect(mostImproved(before, during)).toEqual({ concept: 'k1', from: 0, to: 1 });
    expect(mostImproved([], [att('k1', true)])).toBeNull();
  });
});

import { detect } from '../src/lib/milestones';
describe('milestones', () => {
  it('fires 50% mastery once and a personal best for answers in a day', () => {
    const crit = new Map([['k1', { conceptId: 'k1', correctInSession: 0, sessionId: 's', relearnSessions: [], securedAt: 1 }]]);
    const units2 = [{ id: 'laws2400', code: 'LAWS2400', concepts: ['k1', 'k2'] }];
    const atts = [...Array.from({ length: 5 }, () => att('k1', true, now - 2 * 864e5)), ...Array.from({ length: 25 }, () => att('k1', true, now - 1000))];
    const m = detect({ units: units2, attempts: atts, criteria: crit as any, seen: new Set(), now });
    expect(m.map((x) => x.key)).toContain('mastery:laws2400:0.5');
    expect(m.some((x) => x.key.startsWith('best-answers:'))).toBe(true);
    const again = detect({ units: units2, attempts: atts, criteria: crit as any, seen: new Set(m.map((x) => x.key)), now });
    expect(again).toEqual([]);
  });
});

import { parseBackup } from '../src/lib/backup';
describe('backup', () => {
  it('accepts a StudySite export and rejects anything else', () => {
    expect(parseBackup(JSON.stringify({ app: 'studysite', version: 1, exportedAt: 'x', tables: {}, local: {} })).version).toBe(1);
    expect(() => parseBackup('nope')).toThrow('not JSON');
    expect(() => parseBackup('{"app":"other"}')).toThrow('not a StudySite export');
    expect(() => parseBackup(JSON.stringify({ app: 'studysite', version: 99, tables: {} }))).toThrow('newer');
  });
});
