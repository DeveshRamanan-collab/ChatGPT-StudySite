// Knowledge-map graph helpers (src/lib/graph.ts): building the graph, one drawn line per pair, neighbourhoods,
// shortest routes and their wording, prerequisite routes in study order, the most-connected summary and the
// rebuild-the-map scoring. Invariants also run over the real course (src/content concept frontmatter is not read
// here; the fixture below mirrors its shape).
import { describe, it, expect } from 'vitest';
import {
  buildGraph, pairs, kindsBetween, neighbours, shortestPath, describePath, prerequisiteRoute, mostConnected, degrees,
  degreeWhy, truthLinks, scoreRebuild, linkWords, pairKey, sameLink, type GraphConcept, type Link,
} from '../src/lib/graph';

const c = (id: string, rel: Partial<Omit<GraphConcept, 'id' | 'title'>> = {}): GraphConcept => ({ id, title: id.toUpperCase(), dependsOn: [], contrasts: [], related: [], ...rel });

// duty ← breach ← causation ← remoteness; breach ~ standard (confused); causation – loss (related); outside: ignored.
const course = [
  c('duty'),
  c('breach', { dependsOn: ['duty'], contrasts: ['standard'], related: ['outside'] }),
  c('standard', { dependsOn: ['duty'] }),
  c('causation', { dependsOn: ['breach'], related: ['loss'] }),
  c('remoteness', { dependsOn: ['causation', 'duty'] }),
  c('loss', { related: ['causation'] }),
  c('island'),
  c('self', { dependsOn: ['self'] }),
];
const g = buildGraph(course);

describe('buildGraph and pairs', () => {
  it('keeps prerequisites directed and confusions/related symmetric; drops outside and self links', () => {
    expect(g.prereqs.get('remoteness')).toEqual(['causation', 'duty']);
    expect(g.dependents.get('duty')).toEqual(['breach', 'standard', 'remoteness']);
    expect(g.contrasts.get('standard')).toEqual(['breach']);
    expect(g.related.get('loss')).toEqual(['causation']);
    expect(g.related.get('breach')).toEqual([]);
    expect(g.prereqs.get('self')).toEqual([]);
  });

  it('draws one line per unordered pair with every kind, strongest first, in first-met order', () => {
    const ps = pairs([c('a', { related: ['b'] }), c('b', { dependsOn: ['a'], contrasts: ['a'] })]);
    expect(ps).toEqual([{ s: 'a', t: 'b', kinds: ['depends', 'contrasts', 'related'] }]);
    const all = pairs(course);
    expect(new Set(all.map((p) => pairKey(p.s, p.t))).size).toBe(all.length);
    expect(all.find((p) => pairKey(p.s, p.t) === pairKey('causation', 'loss'))!.kinds).toEqual(['related']);
  });

  it('kindsBetween reports every kind either way round', () => {
    expect(kindsBetween(g, 'duty', 'breach')).toEqual(['depends']);
    expect(kindsBetween(g, 'standard', 'breach')).toEqual(['contrasts']);
    expect(kindsBetween(g, 'duty', 'loss')).toEqual([]);
  });
});

describe('neighbourhood', () => {
  it('lists direct neighbours along the visible kinds only', () => {
    expect([...neighbours(g, 'breach')].sort()).toEqual(['causation', 'duty', 'standard']);
    expect([...neighbours(g, 'breach', ['depends'])].sort()).toEqual(['causation', 'duty']);
    expect([...neighbours(g, 'causation', ['related'])]).toEqual(['loss']);
    expect(neighbours(g, 'island').size).toBe(0);
  });
});

describe('shortestPath', () => {
  it('finds the fewest steps along any kind and words the route', () => {
    const p = shortestPath(g, 'loss', 'standard')!;
    expect(p.map((s) => s.to)).toEqual(['causation', 'breach', 'standard']);
    expect(describePath(g, 'loss', p)).toBe('LOSS → related to CAUSATION → needs BREACH → often confused with STANDARD');
  });

  it('reports "is needed for" when walking from a prerequisite to what builds on it', () => {
    const p = shortestPath(g, 'duty', 'causation')!;
    expect(describePath(g, 'duty', p)).toBe('DUTY → is needed for BREACH → is needed for CAUSATION');
  });

  it('prefers the strongest kind on a hop with more than one', () => {
    const h = buildGraph([c('a', { related: ['b'], contrasts: ['b'] }), c('b', { dependsOn: ['a'] })]);
    expect(shortestPath(h, 'a', 'b')).toEqual([{ from: 'a', to: 'b', kind: 'depends', rel: 'needed-by' }]);
  });

  it('respects the allowed kinds, returns [] for the same concept and null when unreachable', () => {
    expect(shortestPath(g, 'loss', 'standard', ['depends'])).toBeNull();
    expect(shortestPath(g, 'duty', 'duty')).toEqual([]);
    expect(shortestPath(g, 'duty', 'island')).toBeNull();
    expect(shortestPath(g, 'duty', 'nowhere')).toBeNull();
  });
});

describe('prerequisiteRoute', () => {
  it('lists every ancestor once, each after its own prerequisites', () => {
    const r = prerequisiteRoute(g, 'remoteness');
    expect(new Set(r)).toEqual(new Set(['duty', 'breach', 'causation']));
    expect(r.length).toBe(3);
    for (const id of r) for (const p of g.prereqs.get(id)!) expect(r.indexOf(p)).toBeLessThan(r.indexOf(id));
    expect(r).toEqual(['duty', 'breach', 'causation']);
  });

  it('is empty for a concept with nothing before it, and survives a cycle in the notes', () => {
    expect(prerequisiteRoute(g, 'duty')).toEqual([]);
    const cyc = buildGraph([c('a', { dependsOn: ['b'] }), c('b', { dependsOn: ['c'] }), c('c', { dependsOn: ['a'] })]);
    expect(prerequisiteRoute(cyc, 'a').sort()).toEqual(['b', 'c']);
  });
});

describe('mostConnected', () => {
  it('ranks by distinct neighbours, then prerequisite links, then title, and explains the count', () => {
    const top = mostConnected(g, 3);
    // duty, breach and causation each have 3 neighbours; duty has the most prerequisite links; breach < causation.
    expect(top.map((d) => d.id)).toEqual(['duty', 'breach', 'causation']);
    expect(top[1]).toMatchObject({ needs: 1, neededBy: 1, contrasts: 1, related: 0, total: 3 });
    expect(top[1].why).toBe('Needed for 1 concept, builds on 1, often confused with 1');
    expect(top[0].why).toBe('Needed for 3 concepts');
  });

  it('leaves out unlinked concepts and can be limited to a subset', () => {
    expect(mostConnected(g, 20).some((d) => d.id === 'island')).toBe(false);
    expect(mostConnected(g, 5, new Set(['loss', 'standard'])).map((d) => d.id)).toEqual(['standard', 'loss']);
    expect(degreeWhy({ needs: 0, neededBy: 0, contrasts: 0, related: 0 })).toBe('No links yet');
    expect(degrees(g).find((d) => d.id === 'island')!.total).toBe(0);
  });
});

describe('rebuild scoring', () => {
  const week = buildGraph([
    c('a'),
    c('b', { dependsOn: ['a'], contrasts: ['c'] }),
    c('c', { related: ['d', 'b'] }),
    c('d'),
  ]);
  const truth = truthLinks(week, ['a', 'b', 'c', 'd']);

  it('collects the stated links once per kind per pair, keeping prerequisite direction', () => {
    expect(truth).toEqual([
      { a: 'b', b: 'a', kind: 'depends' },
      { a: 'b', b: 'c', kind: 'contrasts' },
      { a: 'b', b: 'c', kind: 'related' },
      { a: 'c', b: 'd', kind: 'related' },
    ]);
    expect(truthLinks(week, ['a', 'c'])).toEqual([]);
  });

  it('marks correct, reversed prerequisites, different relations, extra and missing links', () => {
    const drawn: Link[] = [
      { a: 'c', b: 'b', kind: 'contrasts' }, // correct (symmetric kinds ignore order)
      { a: 'a', b: 'b', kind: 'depends' }, // reversed: the notes say b builds on a
      { a: 'a', b: 'd', kind: 'related' }, // extra
    ];
    const r = scoreRebuild(truth, drawn, ['depends', 'contrasts']);
    expect(r.correct).toEqual([drawn[0]]);
    expect(r.wrongKind.map((w) => w.drawn)).toEqual([drawn[1]]);
    expect(r.wrongKind[0].truth).toEqual([{ a: 'b', b: 'a', kind: 'depends' }]);
    expect(r.extra).toEqual([drawn[2]]);
    expect(r.missing).toEqual([]); // the b–c pair was drawn; c–d is related only (not scored)
    expect(r.total).toBe(2);
    expect(r.score).toBe(1);
  });

  it('counts related links only when asked, and never calls a related-only pair extra', () => {
    const drawn: Link[] = [{ a: 'c', b: 'd', kind: 'contrasts' }];
    const off = scoreRebuild(truth, drawn, ['depends', 'contrasts']);
    expect(off.extra).toEqual([]);
    expect(off.wrongKind.map((w) => w.truth[0].kind)).toEqual(['related']);
    expect(off.missing.map((l) => l.kind).sort()).toEqual(['contrasts', 'depends']);
    const on = scoreRebuild(truth, [{ a: 'd', b: 'c', kind: 'related' }], ['depends', 'contrasts', 'related']);
    expect(on.total).toBe(3);
    expect(on.score).toBe(1);
    expect(on.missing.length).toBe(2);
    // The b–c pair is both contrasts and related: missing reports the strongest.
    expect(on.missing.find((l) => pairKey(l.a, l.b) === pairKey('b', 'c'))!.kind).toBe('contrasts');
  });

  it('scores a perfect drawing as total of total, and nothing drawn as zero with everything missing', () => {
    const perfect = scoreRebuild(truth, truth, ['depends', 'contrasts', 'related']);
    expect(perfect.score).toBe(perfect.total);
    expect(perfect.missing).toEqual([]);
    const none = scoreRebuild(truth, [], ['depends', 'contrasts']);
    expect(none).toMatchObject({ score: 0, total: 2, correct: [], extra: [] });
    expect(none.missing.length).toBe(2);
  });

  it('keeps the last drawn link per pair and ignores self-links', () => {
    const r = scoreRebuild(truth, [{ a: 'b', b: 'a', kind: 'related' }, { a: 'b', b: 'a', kind: 'depends' }, { a: 'a', b: 'a', kind: 'depends' }], ['depends']);
    expect(r.correct).toEqual([{ a: 'b', b: 'a', kind: 'depends' }]);
    expect(r.extra).toEqual([]);
  });

  it('words links and compares them', () => {
    expect(linkWords(week, { a: 'b', b: 'a', kind: 'depends' })).toBe('B builds on A');
    expect(linkWords(week, { a: 'b', b: 'c', kind: 'contrasts' })).toBe('B and C are often confused');
    expect(sameLink({ a: 'x', b: 'y', kind: 'related' }, { a: 'y', b: 'x', kind: 'related' })).toBe(true);
    expect(sameLink({ a: 'x', b: 'y', kind: 'depends' }, { a: 'y', b: 'x', kind: 'depends' })).toBe(false);
  });
});
