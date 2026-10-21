// Visual practice: selection and scoring for label / match / sort / sketch (src/lib/visual.ts).
import { describe, expect, it } from 'vitest';
import type { Aid, Flow } from '../src/lib/aids';
import {
  availability, byConcept, checkLinks, checkSlots, checkSorted, clearSlot, flowOutline, isBlank, labelSet, labelTiles,
  matchRound, parseSketch, pickParam, placeInSlot, scenariosOf, share, sketchItems, sortRound, thin, toggleLink,
  visibleStrokes, visualId, weekAids,
} from '../src/lib/visual';

function aid(concept: string, p: Partial<Aid> = {}): Aid {
  return {
    concept, unit: 'u1', week: 'u1-w01', plain: '', terms: [], misconceptions: [], socratic: [], elements: [], 'what-if': [],
    boundary: [], transfer: [], objections: [], storyboard: [], sources: [], verify: false, ...p,
  };
}
const el = (name: string) => ({ name, test: `${name} test`, cases: [], authorities: [] });
const term = (t: string) => ({ term: t, gloss: `${t} means…` });

describe('ids and helpers', () => {
  it('builds attempt ids per kind and scope', () => {
    expect(visualId('label', 'u1-w01-battery')).toBe('visual:label:u1-w01-battery');
    expect(visualId('sketch', 'c')).toBe('visual:sketch:c');
  });
  it('share is 0 for no marks', () => {
    expect(share([])).toBe(0);
    expect(share([true, false, true, true])).toBe(0.75);
  });
  it('orders a week by its concept list, unlisted after by id', () => {
    const aids = { b: aid('b'), a: aid('a'), z: aid('z'), other: aid('other', { week: 'u1-w02' }) };
    expect(weekAids(aids, 'u1-w01', ['z', 'b']).map((a) => a.concept)).toEqual(['z', 'b', 'a']);
  });
  it('pickParam falls back for unknown values', () => {
    expect(pickParam('sort', ['label', 'sort'] as const, 'label')).toBe('sort');
    expect(pickParam('nope', ['label', 'sort'] as const, 'label')).toBe('label');
    expect(pickParam(null, ['label'] as const, 'label')).toBe('label');
  });
});

describe('label the parts', () => {
  const a = aid('battery', { elements: [el('Voluntary act'), el('Directness'), el('Contact'), el('No consent')] });
  it('needs two named elements', () => {
    expect(labelSet(aid('x', { elements: [el('Only one')] }))).toBeNull();
    expect(labelSet(aid('x', { elements: [el('One'), el('  ')] }))).toBeNull();
    expect(labelSet(a)!.slots.map((s) => s.name)).toEqual(['Voluntary act', 'Directness', 'Contact', 'No consent']);
  });
  it('shuffles tiles deterministically and never in the answer order', () => {
    const set = labelSet(a)!;
    const t1 = labelTiles(set, 7);
    expect(labelTiles(set, 7)).toEqual(t1);
    expect(t1.map((t) => t.name).sort()).toEqual(set.slots.map((s) => s.name).sort());
    for (let s = 0; s < 20; s++) expect(labelTiles(set, s).map((t) => t.name)).not.toEqual(set.slots.map((x) => x.name));
  });
  it('checks each slot by name; empty slots are wrong', () => {
    const slots = labelSet(a)!.slots;
    expect(checkSlots(['Voluntary act', 'contact', null, 'No consent'], slots)).toEqual([true, false, false, true]);
    expect(checkSlots(['voluntary  act', 'Directness', 'Contact', 'No consent'], slots)).toEqual([true, true, true, true]);
  });
  it('placing swaps with the occupant or sends it back to the tray', () => {
    expect(placeInSlot([null, null, null], 'x', 1)).toEqual([null, 'x', null]);
    // from the tray onto an occupied slot: the occupant leaves the slots (back to the tray)
    expect(placeInSlot(['a', null], 'b', 0)).toEqual(['b', null]);
    // from another slot: swap
    expect(placeInSlot(['a', 'b', null], 'b', 0)).toEqual(['b', 'a', null]);
    expect(placeInSlot(['a', null, null], 'a', 2)).toEqual([null, null, 'a']);
    expect(placeInSlot(['a'], 'a', 0)).toEqual(['a']);
    expect(placeInSlot(['a'], 'b', 5)).toEqual(['a']);
    expect(clearSlot(['a', 'b'], 0)).toEqual([null, 'b']);
  });
});

describe('match', () => {
  const mk = (c: string, n: number, b = 0) =>
    aid(c, {
      transfer: Array.from({ length: n }, (_, i) => ({ scenario: `${c} scenario ${i}`, answer: `${c} answer ${i}` })),
      boundary: Array.from({ length: b }, (_, i) => ({ text: `${c} edge ${i}`, why: `${c} why ${i}` })),
    });
  it('collects transfer scenarios then boundary cases, skipping blanks', () => {
    const s = scenariosOf(aid('c', { transfer: [{ scenario: 'S', answer: 'A' }, { scenario: ' ', answer: '' }], boundary: [{ text: 'B', why: 'W' }] }));
    expect(s.map((x) => [x.id, x.source, x.explain])).toEqual([['c:t0', 'transfer', 'A'], ['c:b0', 'boundary', 'W']]);
  });
  it('needs two concepts with scenarios', () => {
    expect(matchRound([mk('a', 1), aid('b')], 1)).toBeNull();
  });
  it('takes up to four concepts in week order, one scenario each plus one extra', () => {
    const aids = ['a', 'b', 'c', 'd', 'e', 'f'].map((c) => mk(c, 1, 2));
    const r = matchRound(aids, 3)!;
    expect(r.concepts).toHaveLength(4);
    expect(r.concepts).toEqual([...r.concepts].sort());
    expect(r.scenarios).toHaveLength(5);
    for (const c of r.concepts) expect(r.scenarios.filter((s) => s.concept === c).length).toBeGreaterThan(0);
    expect(r.scenarios.every((s) => r.concepts.includes(s.concept))).toBe(true);
    expect(new Set(r.scenarios.map((s) => s.id)).size).toBe(5);
    expect(matchRound(aids, 3)).toEqual(r);
  });
  it('gives no extra when no chosen concept has a second scenario', () => {
    const r = matchRound([mk('a', 1), mk('b', 1)], 9)!;
    expect(r.scenarios).toHaveLength(2);
  });
  it('checks and toggles links', () => {
    const r = matchRound([mk('a', 1), mk('b', 1)], 2)!;
    const [s1, s2] = r.scenarios;
    let links = toggleLink({}, s1.id, s1.concept);
    links = toggleLink(links, s2.id, s1.concept);
    expect(checkLinks(links, r.scenarios)).toEqual({ [s1.id]: true, [s2.id]: false });
    expect(toggleLink(links, s1.id, s1.concept)).toEqual({ [s2.id]: s1.concept });
    expect(checkLinks({}, r.scenarios)).toEqual({ [s1.id]: false, [s2.id]: false });
  });
  it('scores per concept', () => {
    const items = [{ id: '1', concept: 'a' }, { id: '2', concept: 'a' }, { id: '3', concept: 'b' }];
    expect(Object.fromEntries(byConcept(items, { 1: true, 2: false, 3: true }))).toEqual({ a: { right: 1, total: 2 }, b: { right: 1, total: 1 } });
  });
});

describe('sort', () => {
  it('needs two concepts with two or more terms', () => {
    expect(sortRound([aid('a', { terms: [term('x'), term('y')] }), aid('b', { terms: [term('z')] })], 1)).toBeNull();
  });
  it('uses three bins when it can, up to three terms each, glosses kept for the reason', () => {
    const aids = ['a', 'b', 'c', 'd'].map((c) => aid(c, { terms: [1, 2, 3, 4].map((i) => term(`${c}${i}`)) }));
    const r = sortRound(aids, 5)!;
    expect(r.bins).toHaveLength(3);
    expect(r.items).toHaveLength(9);
    for (const it of r.items) {
      expect(r.bins).toContain(it.concept);
      expect(it.term.startsWith(it.concept)).toBe(true);
      expect(it.gloss).toBe(`${it.term} means…`);
    }
    expect(sortRound(aids, 5)).toEqual(r);
  });
  it('falls back to two bins', () => {
    const r = sortRound([aid('a', { terms: [term('x'), term('y')] }), aid('b', { terms: [term('p'), term('q')] })], 1)!;
    expect(r.bins).toEqual(['a', 'b']);
    expect(r.items).toHaveLength(4);
  });
  it('leaves out a term two bins share', () => {
    const r = sortRound([aid('a', { terms: [term('Omission'), term('x')] }), aid('b', { terms: [term('omission '), term('y')] })], 1)!;
    expect(r.items.map((i) => i.term).sort()).toEqual(['x', 'y']);
  });
  it('drops a bin left with nothing to sort', () => {
    expect(sortRound([aid('a', { terms: [term('s'), term('t')] }), aid('b', { terms: [term('S'), term('T')] })], 1)).toBeNull();
  });
  it('checks placements; unsorted is wrong', () => {
    const items = [{ id: 'a:0', term: 'x', gloss: '', concept: 'a' }, { id: 'b:0', term: 'y', gloss: '', concept: 'b' }];
    expect(checkSorted({ 'a:0': 'a', 'b:0': 'a' }, items)).toEqual({ 'a:0': true, 'b:0': false });
    expect(checkSorted({}, items)).toEqual({ 'a:0': false, 'b:0': false });
  });
});

describe('sketch', () => {
  const flow: Flow = {
    id: 'u1-w01-flow-x', unit: 'u1', week: 'u1-w01', title: 'Flow X', summary: '', start: 'n1', concepts: ['flowy'], sources: [], verify: false,
    nodes: [
      { id: 'n1', kind: 'ask', text: 'Q1?', cases: [], authorities: [], branches: [{ label: 'Yes', to: 's1' }, { label: 'No', to: 'e1' }, { label: 'Ghost', to: 'zz' }], exception: false },
      { id: 's1', kind: 'step', text: 'Step', cases: [], authorities: [], branches: [], next: 'n2', exception: false },
      { id: 'n2', kind: 'ask', text: 'Q2?', cases: [], authorities: [], branches: [{ label: 'Yes', to: 'e2' }, { label: 'No', to: 'e1' }], exception: false },
      { id: 'e1', kind: 'end', text: 'Not met', cases: [], authorities: [], branches: [], tone: 'not-met', exception: false },
      { id: 'e2', kind: 'end', text: 'Met', cases: [], authorities: [], branches: [], tone: 'met', exception: false },
    ],
  };
  it('outlines a flow: branches indent, steps stay level, repeated outcomes repeat, missing targets skipped', () => {
    expect(flowOutline(flow)).toEqual([
      { depth: 0, text: 'Q1?', label: undefined, kind: 'ask', tone: undefined },
      { depth: 1, text: 'Step', label: 'Yes', kind: 'step', tone: undefined },
      { depth: 1, text: 'Q2?', label: undefined, kind: 'ask', tone: undefined },
      { depth: 2, text: 'Met', label: 'Yes', kind: 'end', tone: 'met' },
      { depth: 2, text: 'Not met', label: 'No', kind: 'end', tone: 'not-met' },
      { depth: 1, text: 'Not met', label: 'No', kind: 'end', tone: 'not-met' },
    ]);
  });
  it('refers back to an ask or step reached twice', () => {
    const shared: Flow = { ...flow, nodes: [
      { ...flow.nodes[0], branches: [{ label: 'Yes', to: 'n2' }, { label: 'No', to: 'n2' }] },
      ...flow.nodes.slice(2),
    ] };
    expect(flowOutline(shared).map((l) => [l.depth, l.kind, l.label])).toEqual([
      [0, 'ask', undefined], [1, 'ask', 'Yes'], [2, 'end', 'Yes'], [2, 'end', 'No'], [1, 'ref', 'No'],
    ]);
  });
  it('survives a cycle and caps its length', () => {
    const loop: Flow = { ...flow, nodes: [{ ...flow.nodes[1], id: 's1', next: 's2' }, { ...flow.nodes[1], id: 's2', next: 's1' }], start: 's1' };
    expect(flowOutline(loop).map((l) => l.kind)).toEqual(['step', 'step', 'ref']);
    expect(flowOutline(flow, 2)).toHaveLength(2);
  });
  it('prefers elements, then a flow that covers the concept, else skips', () => {
    const items = sketchItems([
      aid('withEls', { elements: [el('A'), el('B')] }),
      aid('flowy'),
      aid('nothing'),
      aid('flowy-other-week', { week: 'u1-w02' }),
    ], [flow]);
    expect(items.map((i) => [i.concept, i.ref.kind])).toEqual([['withEls', 'elements'], ['flowy', 'flow']]);
  });
  it('visible strokes start after the last clear; blank means no pen ink', () => {
    const pen = { tool: 'pen' as const, points: [[0, 0], [1, 1]] as [number, number][] };
    const er = { tool: 'eraser' as const, points: [[0, 0]] as [number, number][] };
    expect(visibleStrokes([pen, { tool: 'clear' }, er])).toEqual([er]);
    expect(isBlank([pen, { tool: 'clear' }, er])).toBe(true);
    expect(isBlank([pen])).toBe(false);
    expect(isBlank([])).toBe(true);
  });
  it('thins close points, rounds, keeps the end', () => {
    expect(thin([[0, 0], [0.0005, 0], [0.01, 0.01], [0.0101, 0.0101]])).toEqual([[0, 0], [0.01, 0.01], [0.0101, 0.0101]]);
    expect(thin([[0.123456, 0.5]])).toEqual([[0.1235, 0.5]]);
    expect(thin([])).toEqual([]);
  });
  it('parses stored sketches defensively', () => {
    expect(parseSketch(undefined)).toBeNull();
    expect(parseSketch({ v: 2, ops: [] })).toBeNull();
    expect(parseSketch({ v: 1, ops: [{ tool: 'pen', points: [[0, 1]] }, { tool: 'pen', points: [[NaN, 1]] }, { tool: 'clear' }], at: 5 }))
      .toEqual({ v: 1, ops: [{ tool: 'pen', points: [[0, 1]] }], at: 5 });
  });
});

describe('availability', () => {
  it('counts what each kind can use; match and sort need two concepts', () => {
    const aids = [
      aid('a', { elements: [el('x'), el('y')], terms: [term('t1'), term('t2')], transfer: [{ scenario: 's', answer: '' }] }),
      aid('b', { terms: [term('t3')] }),
    ];
    expect(availability(aids, [])).toEqual({ label: 1, match: 0, sort: 0, sketch: 1 });
    expect(availability([], [])).toEqual({ label: 0, match: 0, sort: 0, sketch: 0 });
  });
});
