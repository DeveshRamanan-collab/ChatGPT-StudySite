// Decision-flow graph helpers (src/lib/flow.ts): layering, routes to an end, the longest route to a 'met' end, the
// ordering exercise helpers and the layered layout. The layout invariants also run over every real flow file, so
// flows that arrive later are checked too.
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { createRequire } from 'node:module';
import {
  layers, pathsTo, longestMetPath, conditions, routeNodes, reachable, edgesOf, byId, layout, wrapText, shuffle,
  hashString, checkOrder, moveItem, flowSlug, type Flow, type FlowNode,
} from '../src/lib/flow';

// js-yaml ships no type declarations; only load() is used.
const yaml = createRequire(import.meta.url)('js-yaml') as { load(src: string): unknown };

type N = Partial<FlowNode> & Pick<FlowNode, 'id' | 'kind'>;
const node = (n: N): FlowNode => ({ text: n.id, cases: [], authorities: [], branches: [], exception: false, ...n });
const flowOf = (start: string, nodes: N[]): Flow => ({ id: 'u-w01-flow-x', unit: 'u', week: 'u-w01', title: 't', summary: 's', start, concepts: [], sources: [], verify: false, nodes: nodes.map(node) });
const yes = (to: string) => ({ label: 'Yes', to });
const no = (to: string) => ({ label: 'No', to });

// a → (Yes) b → (Yes) e1 met; a → (No) c (step) → d → (Yes) e1, (No) e2 not-met; b → (No) e2.
const diamond = flowOf('a', [
  { id: 'a', kind: 'ask', text: 'Is A?', branches: [yes('b'), no('c')] },
  { id: 'b', kind: 'ask', text: 'Is B?', branches: [yes('e1'), no('e2')] },
  { id: 'c', kind: 'step', text: 'Note C', next: 'd' },
  { id: 'd', kind: 'ask', text: 'Is D?', branches: [yes('e1'), no('e2')] },
  { id: 'e1', kind: 'end', tone: 'met', text: 'Made out' },
  { id: 'e2', kind: 'end', tone: 'not-met', text: 'Fails' },
]);

describe('graph basics', () => {
  it('edges follow branch order, steps leave by next, ends have none, dangling targets drop', () => {
    const nodes = byId(diamond);
    expect(edgesOf(nodes.get('a')!).map((e) => [e.to, e.label, e.index, e.count])).toEqual([['b', 'Yes', 0, 2], ['c', 'No', 1, 2]]);
    expect(edgesOf(nodes.get('c')!)).toEqual([{ from: 'c', to: 'd', label: undefined, index: 0, count: 1 }]);
    expect(edgesOf(nodes.get('e1')!)).toEqual([]);
    const dangling = flowOf('a', [{ id: 'a', kind: 'ask', branches: [yes('nowhere'), no('z')] }, { id: 'z', kind: 'end', tone: 'met' }]);
    expect(edgesOf(byId(dangling).get('a')!, byId(dangling)).map((e) => e.to)).toEqual(['z']);
  });

  it('reachable lists nodes breadth-first from the start and skips orphans', () => {
    const f = flowOf('a', [...diamond.nodes, node({ id: 'orphan', kind: 'end', tone: 'met' })]);
    expect(reachable(f)).toEqual(['a', 'b', 'c', 'e1', 'e2', 'd']);
  });

  it('slug drops the unit prefix only', () => {
    expect(flowSlug('laws2400-w04-flow-self-defence', 'laws2400')).toBe('w04-flow-self-defence');
    expect(flowSlug('other-id', 'laws2400')).toBe('other-id');
  });
});

describe('longest-path layering', () => {
  it('puts each node one below its deepest parent', () => {
    expect(Object.fromEntries(layers(diamond))).toEqual({ a: 0, b: 1, c: 1, d: 2, e1: 3, e2: 3 });
  });

  it('ignores an edge that closes a cycle', () => {
    const f = flowOf('a', [
      { id: 'a', kind: 'ask', branches: [yes('b'), no('e')] },
      { id: 'b', kind: 'ask', branches: [yes('a'), no('e')] },
      { id: 'e', kind: 'end', tone: 'met' },
    ]);
    expect(Object.fromEntries(layers(f))).toEqual({ a: 0, b: 1, e: 2 });
  });
});

describe('routes to an end (trace back)', () => {
  it('finds every route in branch order, with the conditions each needs', () => {
    const routes = pathsTo(diamond, 'e1');
    expect(routes.map((r) => routeNodes('a', r))).toEqual([['a', 'b', 'e1'], ['a', 'c', 'd', 'e1']]);
    expect(conditions(diamond, routes[1])).toEqual([
      { question: 'Is A?', answer: 'No', node: 'a' },
      { question: 'Is D?', answer: 'Yes', node: 'd' },
    ]);
  });

  it('caps the number of routes and handles the start as target and unknown targets', () => {
    expect(pathsTo(diamond, 'e2', 1)).toHaveLength(1);
    expect(pathsTo(diamond, 'a')).toEqual([[]]);
    expect(pathsTo(diamond, 'missing')).toEqual([]);
  });
});

describe('longest route to a met end', () => {
  it('prefers the longest route to a met end', () => {
    expect(routeNodes('a', longestMetPath(diamond))).toEqual(['a', 'c', 'd', 'e1']);
  });

  it('picks the deepest met end over a shallow one, and falls back to any end when none is met', () => {
    const f = flowOf('a', [
      { id: 'a', kind: 'ask', branches: [yes('m1'), no('b')] },
      { id: 'm1', kind: 'end', tone: 'met' },
      { id: 'b', kind: 'step', next: 'c' },
      { id: 'c', kind: 'ask', branches: [yes('m2'), no('x')] },
      { id: 'm2', kind: 'end', tone: 'met' },
      { id: 'x', kind: 'end', tone: 'not-met' },
    ]);
    expect(routeNodes('a', longestMetPath(f))).toEqual(['a', 'b', 'c', 'm2']);
    const none = flowOf('a', [{ id: 'a', kind: 'ask', branches: [yes('q'), no('r')] }, { id: 'q', kind: 'step', next: 'r' }, { id: 'r', kind: 'end', tone: 'qualified' }]);
    expect(routeNodes('a', longestMetPath(none))).toEqual(['a', 'q', 'r']);
  });
});

describe('ordering exercise helpers', () => {
  it('shuffle is deterministic, a permutation, and never the identity', () => {
    const items = ['a', 'b', 'c', 'd', 'e'];
    for (let seed = 0; seed < 50; seed++) {
      const s = shuffle(items, seed);
      expect([...s].sort()).toEqual(items);
      expect(s).not.toEqual(items);
      expect(shuffle(items, seed)).toEqual(s);
    }
    expect(shuffle(['x', 'y'], hashString('flow'))).toEqual(['y', 'x']);
  });

  it('checks each position and moves items immutably', () => {
    expect(checkOrder(['a', 'c', 'b'], ['a', 'b', 'c'])).toEqual([true, false, false]);
    const list = ['a', 'b', 'c'];
    expect(moveItem(list, 0, 2)).toEqual(['b', 'c', 'a']);
    expect(moveItem(list, 2, 3)).toEqual(list);
    expect(list).toEqual(['a', 'b', 'c']);
  });
});

describe('text wrapping', () => {
  it('wraps on words, splits long words and ends a cut-off text with an ellipsis', () => {
    expect(wrapText('one two three four', 9)).toEqual(['one two', 'three', 'four']);
    expect(wrapText('abcdefghijkl', 5)).toEqual(['abcde', 'fghij', 'kl']);
    const cut = wrapText('one two three four five six', 9, 2);
    expect(cut).toHaveLength(2);
    expect(cut[1].endsWith('…')).toBe(true);
    expect(cut[1].length).toBeLessThanOrEqual(9);
  });
});

// ---------- Layout invariants (fixture + every real flow) ----------

function checkLayout(f: Flow) {
  const L = layout(f);
  const ids = reachable(f);
  expect(L.nodes.map((n) => n.id).sort()).toEqual([...ids].sort());
  // Everything inside the canvas.
  for (const n of L.nodes) {
    expect(n.x - n.w / 2).toBeGreaterThanOrEqual(0);
    expect(n.x + n.w / 2).toBeLessThanOrEqual(L.width + 0.01);
    expect(n.y + n.h).toBeLessThanOrEqual(L.height + 0.01);
  }
  // No two boxes (nodes or labels) overlap.
  const boxes = [
    ...L.nodes.map((n) => ({ id: n.id, l: n.x - n.w / 2, r: n.x + n.w / 2, t: n.y, b: n.y + n.h })),
    ...L.edges.filter((e) => e.labelBox).map((e) => ({ id: `label ${e.key}`, l: e.labelBox!.x - e.labelBox!.w / 2, r: e.labelBox!.x + e.labelBox!.w / 2, t: e.labelBox!.y, b: e.labelBox!.y + e.labelBox!.h })),
  ];
  for (let i = 0; i < boxes.length; i++)
    for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i], b = boxes[j];
      const overlap = Math.min(a.r, b.r) - Math.max(a.l, b.l) > 0.5 && Math.min(a.b, b.b) - Math.max(a.t, b.t) > 0.5;
      expect(overlap, `${a.id} overlaps ${b.id}`).toBe(false);
    }
  // Edges run downwards (child below parent) and every labelled branch has its label placed.
  for (const e of L.edges) {
    expect(L.byId.get(e.to)!.y).toBeGreaterThan(L.byId.get(e.from)!.y);
    if (e.label) expect(e.labelBox?.lines.join(' ').replace('…', '')).toBeTruthy();
    expect(e.d).toMatch(/^M/);
  }
  return L;
}

describe('layout', () => {
  it('lays the fixture out in layers with children in branch order', () => {
    const L = checkLayout(diamond);
    const at = (id: string) => L.byId.get(id)!;
    expect(at('a').y).toBeLessThan(at('b').y);
    expect(at('b').y).toBe(at('c').y);
    expect(at('b').x).toBeLessThan(at('c').x); // Yes branch left of No
    expect(at('e1').x).toBeLessThan(at('e2').x);
    expect(L.edges.find((e) => e.key === 'a:0')!.labelBox!.lines).toEqual(['Yes']);
    expect(L.edges.find((e) => e.key === 'c:0')!.labelBox).toBeUndefined();
  });

  it('is deterministic', () => {
    expect(layout(diamond)).toEqual(layout(diamond));
  });

  const dir = 'src/content/flows';
  const files = readdirSync(dir).filter((f) => f.endsWith('.md'));
  for (const file of files) {
    it(`real flow ${file}: valid layout, routes and a longest met path`, () => {
      const front = readFileSync(join(dir, file), 'utf8').split(/^---$/m)[1];
      const data = yaml.load(front) as Omit<Flow, 'id'>;
      const f = flowOf(data.start, data.nodes as N[]);
      checkLayout(f);
      const ends = f.nodes.filter((n) => n.kind === 'end' && reachable(f).includes(n.id));
      expect(ends.length).toBeGreaterThan(0);
      for (const e of ends) expect(pathsTo(f, e.id).length, `no route to ${e.id}`).toBeGreaterThan(0);
      const route = longestMetPath(f);
      expect(route[0]?.from).toBe(f.start);
      const last = byId(f).get(route.at(-1)!.to)!;
      expect(last.kind).toBe('end');
      if (ends.some((e) => e.tone === 'met')) expect(last.tone).toBe('met');
    });
  }
});
