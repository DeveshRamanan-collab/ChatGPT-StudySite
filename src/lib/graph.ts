// Pure graph helpers for the knowledge map (src/components/hub/KnowledgeMap.tsx, MapPanel.tsx, MapRebuild.tsx).
// Concepts carry three kinds of link from their frontmatter: depends-on (a prerequisite stated in the notes),
// contrasts-with (often confused) and related (a proposed link). Links to concepts outside the current view are
// ignored, as are self-links. Nothing here touches the DOM, so every function is unit-tested (tests/graph.test.ts).

export type EdgeKind = 'depends' | 'contrasts' | 'related';
/** Strongest first: a pair joined by more than one kind is drawn as the strongest visible one. */
export const KINDS: readonly EdgeKind[] = ['depends', 'contrasts', 'related'];

export interface GraphConcept { id: string; title: string; dependsOn: string[]; contrasts: string[]; related: string[] }

export interface Graph {
  /** Concept ids in input order. */
  ids: string[];
  title: Map<string, string>;
  /** id → the concepts it builds on (its prerequisites). */
  prereqs: Map<string, string[]>;
  /** id → the concepts that build on it. */
  dependents: Map<string, string[]>;
  /** Symmetric. */
  contrasts: Map<string, string[]>;
  /** Symmetric. */
  related: Map<string, string[]>;
}

/** One drawn line per unordered pair; s/t keep the order the pair was first met in (the force layout's link order). */
export interface Pair { s: string; t: string; kinds: EdgeKind[] }

export const pairKey = (a: string, b: string) => (a < b ? `${a}|${b}` : `${b}|${a}`);

function push(m: Map<string, string[]>, k: string, v: string) {
  const list = m.get(k)!;
  if (!list.includes(v)) list.push(v);
}

export function buildGraph(cs: GraphConcept[]): Graph {
  const ids = cs.map((c) => c.id);
  const has = new Set(ids);
  const blank = () => new Map(ids.map((id) => [id, [] as string[]]));
  const g: Graph = { ids, title: new Map(cs.map((c) => [c.id, c.title])), prereqs: blank(), dependents: blank(), contrasts: blank(), related: blank() };
  for (const c of cs) {
    for (const t of c.dependsOn) if (has.has(t) && t !== c.id) { push(g.prereqs, c.id, t); push(g.dependents, t, c.id); }
    for (const t of c.contrasts) if (has.has(t) && t !== c.id) { push(g.contrasts, c.id, t); push(g.contrasts, t, c.id); }
    for (const t of c.related) if (has.has(t) && t !== c.id) { push(g.related, c.id, t); push(g.related, t, c.id); }
  }
  return g;
}

/** Deduplicated lines for drawing and layout: one per unordered pair, with every kind that joins the pair (strongest first). */
export function pairs(cs: GraphConcept[]): Pair[] {
  const has = new Set(cs.map((c) => c.id));
  const by = new Map<string, Pair>();
  const out: Pair[] = [];
  const add = (s: string, t: string, kind: EdgeKind) => {
    if (!has.has(t) || s === t) return;
    const k = pairKey(s, t);
    let p = by.get(k);
    if (!p) { p = { s, t, kinds: [] }; by.set(k, p); out.push(p); }
    if (!p.kinds.includes(kind)) p.kinds.push(kind);
  };
  for (const c of cs) {
    c.dependsOn.forEach((t) => add(c.id, t, 'depends'));
    c.contrasts.forEach((t) => add(c.id, t, 'contrasts'));
    c.related.forEach((t) => add(c.id, t, 'related'));
  }
  for (const p of out) p.kinds.sort((a, b) => KINDS.indexOf(a) - KINDS.indexOf(b));
  return out;
}

/** The kinds joining a and b, strongest first. */
export function kindsBetween(g: Graph, a: string, b: string): EdgeKind[] {
  const out: EdgeKind[] = [];
  if (g.prereqs.get(a)?.includes(b) || g.prereqs.get(b)?.includes(a)) out.push('depends');
  if (g.contrasts.get(a)?.includes(b)) out.push('contrasts');
  if (g.related.get(a)?.includes(b)) out.push('related');
  return out;
}

export type Rel = 'needs' | 'needed-by' | 'contrasts' | 'related';
export interface Step { from: string; to: string; kind: EdgeKind; rel: Rel }

/** Direct links of one concept, strongest relation first (prerequisites, then dependents, confusions, related). */
function links(g: Graph, id: string, kinds: readonly EdgeKind[]): { to: string; kind: EdgeKind; rel: Rel }[] {
  const out: { to: string; kind: EdgeKind; rel: Rel }[] = [];
  if (kinds.includes('depends')) {
    for (const t of g.prereqs.get(id) ?? []) out.push({ to: t, kind: 'depends', rel: 'needs' });
    for (const t of g.dependents.get(id) ?? []) out.push({ to: t, kind: 'depends', rel: 'needed-by' });
  }
  if (kinds.includes('contrasts')) for (const t of g.contrasts.get(id) ?? []) out.push({ to: t, kind: 'contrasts', rel: 'contrasts' });
  if (kinds.includes('related')) for (const t of g.related.get(id) ?? []) out.push({ to: t, kind: 'related', rel: 'related' });
  return out;
}

/** Direct neighbours of a concept along the given kinds (the concept itself is not included). */
export function neighbours(g: Graph, id: string, kinds: readonly EdgeKind[] = KINDS): Set<string> {
  return new Set(links(g, id, kinds).map((l) => l.to));
}

/**
 * Shortest route between two concepts along any of the given kinds (breadth-first, so fewest steps). Where a hop could
 * use more than one kind, the strongest is reported. [] when from === to; null when no route exists.
 */
export function shortestPath(g: Graph, from: string, to: string, kinds: readonly EdgeKind[] = KINDS): Step[] | null {
  if (!g.title.has(from) || !g.title.has(to)) return null;
  if (from === to) return [];
  const prev = new Map<string, Step>();
  const seen = new Set([from]);
  let frontier = [from];
  while (frontier.length) {
    const next: string[] = [];
    for (const u of frontier) {
      for (const l of links(g, u, kinds)) {
        if (seen.has(l.to)) continue;
        seen.add(l.to);
        prev.set(l.to, { from: u, to: l.to, kind: l.kind, rel: l.rel });
        if (l.to === to) {
          const steps: Step[] = [];
          for (let at = to; at !== from; at = prev.get(at)!.from) steps.unshift(prev.get(at)!);
          return steps;
        }
        next.push(l.to);
      }
    }
    frontier = next;
  }
  return null;
}

export const REL_WORDS: Record<Rel, string> = { needs: 'needs', 'needed-by': 'is needed for', contrasts: 'often confused with', related: 'related to' };

/** "A → needs B → often confused with C". */
export function describePath(g: Graph, from: string, steps: Step[]): string {
  const name = (id: string) => g.title.get(id) ?? id;
  return [name(from), ...steps.map((s) => `${REL_WORDS[s.rel]} ${name(s.to)}`)].join(' → ');
}

/**
 * Every depends-on ancestor of a concept, prerequisites before the concepts that need them (a topological order, so
 * the list reads as a study order: 1 first). Cycles in the notes are tolerated (each concept is listed once).
 */
export function prerequisiteRoute(g: Graph, id: string): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  const visit = (u: string) => {
    if (seen.has(u)) return;
    seen.add(u);
    for (const p of g.prereqs.get(u) ?? []) visit(p);
    if (u !== id) out.push(u);
  };
  if (g.title.has(id)) visit(id);
  return out;
}

export interface Degree { id: string; title: string; needs: number; neededBy: number; contrasts: number; related: number; total: number; why: string }

const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

/** Why a concept is well connected, in words: "needed for 4 concepts, builds on 2, often confused with 1, related to 3". */
export function degreeWhy(d: Pick<Degree, 'needs' | 'neededBy' | 'contrasts' | 'related'>): string {
  const parts: string[] = [];
  if (d.neededBy) parts.push(`needed for ${plural(d.neededBy, 'concept')}`);
  if (d.needs) parts.push(`builds on ${d.needs}`);
  if (d.contrasts) parts.push(`often confused with ${d.contrasts}`);
  if (d.related) parts.push(`related to ${d.related}`);
  const s = parts.join(', ');
  return s ? s[0].toUpperCase() + s.slice(1) : 'No links yet';
}

/** Degree of every concept (distinct neighbours), plus counts per kind. */
export function degrees(g: Graph): Degree[] {
  return g.ids.map((id) => {
    const d = {
      needs: g.prereqs.get(id)!.length,
      neededBy: g.dependents.get(id)!.length,
      contrasts: g.contrasts.get(id)!.length,
      related: g.related.get(id)!.length,
    };
    return { id, title: g.title.get(id)!, ...d, total: neighbours(g, id).size, why: degreeWhy(d) };
  });
}

/**
 * The n most connected concepts (optionally only among `among`): most distinct neighbours first, then most
 * prerequisite links, then title. Concepts with no links are left out.
 */
export function mostConnected(g: Graph, n = 5, among?: Set<string>): Degree[] {
  return degrees(g)
    .filter((d) => d.total > 0 && (!among || among.has(d.id)))
    .sort((a, b) => b.total - a.total || b.needs + b.neededBy - (a.needs + a.neededBy) || a.title.localeCompare(b.title))
    .slice(0, n);
}

// ---------- Rebuild the map (exercise) ----------

/** A link between two concepts. For 'depends', a builds on b (b is the prerequisite). */
export interface Link { a: string; b: string; kind: EdgeKind }

export const sameLink = (x: Link, y: Link) =>
  x.kind === y.kind && (x.kind === 'depends' ? x.a === y.a && x.b === y.b : pairKey(x.a, x.b) === pairKey(y.a, y.b));

/** Every link the notes state among a set of concepts (one per kind per pair; depends keeps its direction). */
export function truthLinks(g: Graph, ids: string[]): Link[] {
  const inSet = new Set(ids);
  const out: Link[] = [];
  const seen = new Set<string>();
  for (const a of ids) {
    for (const b of g.prereqs.get(a) ?? []) if (inSet.has(b)) out.push({ a, b, kind: 'depends' });
    for (const kind of ['contrasts', 'related'] as const)
      for (const b of g[kind].get(a) ?? []) {
        const k = `${kind}:${pairKey(a, b)}`;
        if (inSet.has(b) && !seen.has(k)) { seen.add(k); out.push({ a, b, kind }); }
      }
  }
  return out;
}

export interface RebuildResult {
  /** Drawn and stated in the notes, same relation (and direction, for depends). */
  correct: Link[];
  /** Drawn between a pair the notes do link, but as a different relation (or the prerequisite the wrong way round). */
  wrongKind: { drawn: Link; truth: Link[] }[];
  /** Drawn, but the notes do not link this pair. */
  extra: Link[];
  /** Stated in the notes (in the scored kinds) but not drawn. */
  missing: Link[];
  /** Pairs the notes link in the scored kinds. */
  total: number;
  /** Correct links among those pairs. */
  score: number;
}

/**
 * Compare drawn links with the notes. Only `kinds` count towards the score and the missing list; a drawn link on a
 * pair the notes join only in an unscored kind is reported as a different relation, never as extra.
 */
export function scoreRebuild(truth: Link[], drawn: Link[], kinds: readonly EdgeKind[] = KINDS): RebuildResult {
  const byPair = new Map<string, Link[]>();
  for (const t of truth) byPair.set(pairKey(t.a, t.b), [...(byPair.get(pairKey(t.a, t.b)) ?? []), t]);
  const scoredPairs = new Set([...byPair].filter(([, ts]) => ts.some((t) => kinds.includes(t.kind))).map(([k]) => k));
  const mine = new Map<string, Link>();
  for (const d of drawn) if (d.a !== d.b) mine.set(pairKey(d.a, d.b), d); // one drawn link per pair: the last wins
  const r: RebuildResult = { correct: [], wrongKind: [], extra: [], missing: [], total: scoredPairs.size, score: 0 };
  for (const [k, d] of mine) {
    const ts = byPair.get(k);
    if (!ts) r.extra.push(d);
    else if (ts.some((t) => sameLink(t, d))) { r.correct.push(d); if (scoredPairs.has(k)) r.score++; }
    else r.wrongKind.push({ drawn: d, truth: ts });
  }
  for (const k of scoredPairs) {
    if (mine.has(k)) continue;
    const ts = byPair.get(k)!.filter((t) => kinds.includes(t.kind)).sort((x, y) => KINDS.indexOf(x.kind) - KINDS.indexOf(y.kind));
    r.missing.push(ts[0]);
  }
  return r;
}

/** A link in words, e.g. "Breach builds on Duty of care", "Duty of care and Breach are often confused". */
export function linkWords(g: Pick<Graph, 'title'>, l: Link): string {
  const a = g.title.get(l.a) ?? l.a, b = g.title.get(l.b) ?? l.b;
  if (l.kind === 'depends') return `${a} builds on ${b}`;
  if (l.kind === 'contrasts') return `${a} and ${b} are often confused`;
  return `${a} and ${b} are related`;
}
