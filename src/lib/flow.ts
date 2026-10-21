// Decision-flow graph helpers (pure: no DOM, no React). A flow is a small directed graph of ask / step / end nodes
// walked from `start`: an ask leaves by one of its branches, a step by `next`, an end stops. Flows are meant to be
// acyclic; every helper tolerates a stray cycle or a dangling target (ignored) so new content never crashes a page.
//
// Layout (layout()): longest-path layering, then a Sugiyama-style pass. Every edge is split so it owns a slot in each
// row it crosses: real nodes sit on even rows, and the row under each node row holds one "label slot" per leaving
// edge (the branch label, or a thin spacer for a step's `next`); long edges keep a thin spacer in every further row.
// Rows are ordered top-down by barycentre (children follow branch order, left to right) and packed so no two boxes
// overlap. Coordinates are SVG user units at 1:1 px.
import type { Flow, FlowNode } from './aids';

export type { Flow, FlowNode };
export type Tone = NonNullable<FlowNode['tone']>;

/** One way out of a node: a branch (with its label) or a step's `next` (no label). */
export interface FlowEdge {
  from: string;
  to: string;
  label?: string;
  /** Branch position (0 for `next`). */
  index: number;
  /** Number of ways out of the source node. */
  count: number;
}

export const edgeKey = (e: Pick<FlowEdge, 'from' | 'index'>) => `${e.from}:${e.index}`;

/** Flow URL slug: the id without its unit prefix (laws2400-w04-flow-self-defence → w04-flow-self-defence). */
export const flowSlug = (id: string, unit: string) => (id.startsWith(`${unit}-`) ? id.slice(unit.length + 1) : id);

export const byId = (flow: Pick<Flow, 'nodes'>) => new Map(flow.nodes.map((n) => [n.id, n]));

/** Ways out of a node, in branch order; targets that do not exist are dropped. */
export function edgesOf(node: FlowNode, nodes?: Map<string, FlowNode>): FlowEdge[] {
  const raw: { to: string; label?: string }[] =
    node.kind === 'end' ? [] : node.branches.length ? node.branches : node.next ? [{ to: node.next }] : [];
  const count = raw.length;
  return raw.map((b, index) => ({ from: node.id, to: b.to, label: b.label, index, count })).filter((e) => !nodes || nodes.has(e.to));
}

/** Node ids reachable from the start, in breadth-first (branch) order. */
export function reachable(flow: Pick<Flow, 'nodes' | 'start'>): string[] {
  const nodes = byId(flow);
  if (!nodes.has(flow.start)) return [];
  const seen = new Set([flow.start]);
  const queue = [flow.start];
  for (let i = 0; i < queue.length; i++)
    for (const e of edgesOf(nodes.get(queue[i])!, nodes))
      if (!seen.has(e.to)) { seen.add(e.to); queue.push(e.to); }
  return queue;
}

/** Edges that close a cycle (found by depth-first search from the start); layout and layering ignore them. */
function backEdges(flow: Pick<Flow, 'nodes' | 'start'>): Set<string> {
  const nodes = byId(flow);
  const back = new Set<string>();
  const state = new Map<string, 1 | 2>(); // 1 on the stack, 2 done
  const visit = (id: string) => {
    state.set(id, 1);
    for (const e of edgesOf(nodes.get(id)!, nodes)) {
      const s = state.get(e.to);
      if (s === 1) back.add(edgeKey(e));
      else if (!s) visit(e.to);
    }
    state.set(id, 2);
  };
  if (nodes.has(flow.start)) visit(flow.start);
  return back;
}

/** Forward (acyclic) edges among reachable nodes. */
export function forwardEdges(flow: Pick<Flow, 'nodes' | 'start'>): FlowEdge[] {
  const nodes = byId(flow);
  const back = backEdges(flow);
  return reachable(flow).flatMap((id) => edgesOf(nodes.get(id)!, nodes).filter((e) => !back.has(edgeKey(e))));
}

/** Longest-path layering: the start is layer 0; every node sits one below its deepest parent. */
export function layers(flow: Pick<Flow, 'nodes' | 'start'>): Map<string, number> {
  const ids = reachable(flow);
  const edges = forwardEdges(flow);
  const indeg = new Map(ids.map((id) => [id, 0]));
  for (const e of edges) indeg.set(e.to, indeg.get(e.to)! + 1);
  const out = new Map<string, FlowEdge[]>();
  for (const e of edges) out.set(e.from, [...(out.get(e.from) ?? []), e]);
  const layer = new Map(ids.map((id) => [id, 0]));
  const ready = ids.filter((id) => indeg.get(id) === 0);
  for (let i = 0; i < ready.length; i++) {
    const u = ready[i];
    for (const e of out.get(u) ?? []) {
      layer.set(e.to, Math.max(layer.get(e.to)!, layer.get(u)! + 1));
      indeg.set(e.to, indeg.get(e.to)! - 1);
      if (indeg.get(e.to) === 0) ready.push(e.to);
    }
  }
  return layer;
}

/** Every route from the start to `target` (each a list of edges), in branch order; at most `limit` routes. */
export function pathsTo(flow: Pick<Flow, 'nodes' | 'start'>, target: string, limit = 50): FlowEdge[][] {
  const nodes = byId(flow);
  const out: FlowEdge[][] = [];
  if (!nodes.has(flow.start) || !nodes.has(target)) return out;
  if (flow.start === target) return [[]];
  const onPath = new Set<string>([flow.start]);
  const route: FlowEdge[] = [];
  const walk = (id: string) => {
    for (const e of edgesOf(nodes.get(id)!, nodes)) {
      if (out.length >= limit) return;
      if (onPath.has(e.to)) continue;
      route.push(e);
      if (e.to === target) out.push([...route]);
      else { onPath.add(e.to); walk(e.to); onPath.delete(e.to); }
      route.pop();
    }
  };
  walk(flow.start);
  return out;
}

/** Node ids along a route (start first). */
export const routeNodes = (start: string, route: FlowEdge[]) => [start, ...route.map((e) => e.to)];

/** The conditions a route needs, in order: the answer given at each question (steps carry no condition). */
export function conditions(flow: Pick<Flow, 'nodes'>, route: FlowEdge[]): { question: string; answer: string; node: string }[] {
  const nodes = byId(flow);
  return route
    .filter((e) => e.label && nodes.get(e.from)?.kind === 'ask')
    .map((e) => ({ question: nodes.get(e.from)!.text, answer: e.label!, node: e.from }));
}

/**
 * The longest route from the start to an end whose tone is `met` (ties: the end listed first, then the earliest
 * branches). Falls back to the deepest end of any tone, then the deepest node. Used by the ordering exercise.
 */
export function longestMetPath(flow: Pick<Flow, 'nodes' | 'start'>): FlowEdge[] {
  const layer = layers(flow);
  const nodes = byId(flow);
  const ids = [...layer.keys()];
  if (!ids.length) return [];
  const order = new Map(flow.nodes.map((n, i) => [n.id, i]));
  const deepest = (pool: string[]) => pool.reduce((a, b) => (layer.get(b)! > layer.get(a)! ? b : a));
  const met = ids.filter((id) => nodes.get(id)!.kind === 'end' && nodes.get(id)!.tone === 'met').sort((a, b) => order.get(a)! - order.get(b)!);
  const ends = ids.filter((id) => nodes.get(id)!.kind === 'end').sort((a, b) => order.get(a)! - order.get(b)!);
  const target = met.length ? deepest(met) : ends.length ? deepest(ends) : deepest(ids);
  // Walk back: each step to a parent exactly one layer up (one always exists under longest-path layering). Prefer
  // the parent reached first in breadth-first order, then its earliest branch.
  const bfs = new Map(ids.map((id, i) => [id, i]));
  const into = new Map<string, FlowEdge[]>();
  for (const e of forwardEdges(flow)) into.set(e.to, [...(into.get(e.to) ?? []), e]);
  const route: FlowEdge[] = [];
  let at = target;
  while (at !== flow.start) {
    const e = (into.get(at) ?? [])
      .filter((x) => layer.get(x.from) === layer.get(at)! - 1)
      .sort((a, b) => bfs.get(a.from)! - bfs.get(b.from)! || a.index - b.index)[0];
    if (!e) break;
    route.unshift(e);
    at = e.from;
  }
  return route;
}

// ---------- Ordering exercise ----------

/** Small deterministic 32-bit hash (seeds the shuffle so server and client render the same order). */
export function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

/** Seeded Fisher–Yates; never returns the original order when there are two or more distinct items. */
export function shuffle<T>(items: readonly T[], seed: number): T[] {
  const a = [...items];
  let t = seed >>> 0 || 1;
  const rand = () => {
    // mulberry32
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  if (a.length > 1 && a.every((x, i) => x === items[i])) a.push(a.shift()!);
  return a;
}

/** Per position: is the item where the answer has it? */
export const checkOrder = <T>(current: readonly T[], answer: readonly T[]) => current.map((x, i) => x === answer[i]);

/** Move one item (immutably); out-of-range moves return the list unchanged. */
export function moveItem<T>(list: readonly T[], from: number, to: number): T[] {
  if (from < 0 || from >= list.length || to < 0 || to >= list.length || from === to) return [...list];
  const next = [...list];
  const [x] = next.splice(from, 1);
  next.splice(to, 0, x);
  return next;
}

// ---------- Text ----------

/** Greedy word wrap to `maxChars` per line; long words are split; beyond `maxLines` the last line ends in "…". */
export function wrapText(text: string, maxChars: number, maxLines = Infinity): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean).flatMap((w) => (w.length <= maxChars ? [w] : w.match(new RegExp(`.{1,${maxChars}}`, 'g'))!));
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    if (!line) line = w;
    else if (line.length + 1 + w.length <= maxChars) line += ` ${w}`;
    else { lines.push(line); line = w; }
  }
  if (line) lines.push(line);
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    let last = kept[maxLines - 1];
    while (last.length + 1 > maxChars && last.includes(' ')) last = last.slice(0, last.lastIndexOf(' '));
    kept[maxLines - 1] = `${last.replace(/[,;:.]$/, '')}…`;
    return kept;
  }
  return lines;
}

// ---------- Layout ----------

export interface LayoutOpts {
  nodeW: number;
  /** Characters per line inside a node box, lines kept at most. */
  chars: number;
  maxLines: number;
  lineH: number;
  padY: number;
  /** Branch labels: characters per line, lines kept, line height, width per character (estimate), side padding. */
  labelChars: number;
  labelLines: number;
  labelLineH: number;
  labelCharW: number;
  labelPadX: number;
  /** Width of a spacer slot (a long edge passing a row, or a step's unlabelled `next`). */
  spacerW: number;
  rowGap: number;
  colGap: number;
  margin: number;
}

export const DEFAULT_LAYOUT: LayoutOpts = {
  nodeW: 216, chars: 26, maxLines: 6, lineH: 17, padY: 12,
  labelChars: 22, labelLines: 3, labelLineH: 15, labelCharW: 6.9, labelPadX: 8,
  spacerW: 12, rowGap: 10, colGap: 28, margin: 16,
};

export interface LaidNode {
  id: string;
  node: FlowNode;
  layer: number;
  /** Centre x, top y, size. */
  x: number;
  y: number;
  w: number;
  h: number;
  /** Wrapped text lines. */
  lines: string[];
  /** Height of the tag line above the text (exception marker / outcome), 0 when none. */
  tagH: number;
}

export interface LaidEdge extends FlowEdge {
  key: string;
  /** SVG path data (may contain several sub-paths: the line breaks around its label). */
  d: string;
  /** Label box (centre x, top y) and its wrapped lines; absent for an unlabelled `next`. */
  labelBox?: { x: number; y: number; w: number; h: number; lines: string[] };
}

export interface FlowLayout { nodes: LaidNode[]; edges: LaidEdge[]; width: number; height: number; byId: Map<string, LaidNode> }

interface Slot { key: string; row: number; w: number; h: number; x: number; want: number; tie: number; edge?: string; node?: string }

/** Lay a flow out top-to-bottom. Pure and deterministic; unreachable nodes are left out. */
export function layout(flow: Pick<Flow, 'nodes' | 'start'>, opts: Partial<LayoutOpts> = {}): FlowLayout {
  const o = { ...DEFAULT_LAYOUT, ...opts };
  const nodes = byId(flow);
  const layer = layers(flow);
  const ids = [...layer.keys()];
  if (!ids.length) return { nodes: [], edges: [], width: 0, height: 0, byId: new Map() };
  const bfs = new Map(ids.map((id, i) => [id, i]));
  const edges = forwardEdges(flow);
  const maxLayer = Math.max(...layer.values());
  const rows: Slot[][] = Array.from({ length: maxLayer * 2 + 1 }, () => []);

  // Node slots.
  const laid = new Map<string, LaidNode>();
  for (const id of ids) {
    const node = nodes.get(id)!;
    const lines = wrapText(node.text, o.chars, o.maxLines);
    const tagH = node.kind === 'end' || node.exception ? o.lineH : 0;
    const h = o.padY * 2 + tagH + lines.length * o.lineH;
    const L = layer.get(id)!;
    laid.set(id, { id, node, layer: L, x: 0, y: 0, w: o.nodeW, h, lines, tagH });
    rows[L * 2].push({ key: `n:${id}`, row: L * 2, w: o.nodeW, h, x: 0, want: 0, tie: bfs.get(id)!, node: id });
  }
  // Edge slots: one per crossed row (the first carries the label).
  const chains = new Map<string, Slot[]>();
  for (const e of edges) {
    const k = edgeKey(e);
    const a = layer.get(e.from)! * 2, b = layer.get(e.to)! * 2;
    const chain: Slot[] = [];
    for (let r = a + 1; r < b; r++) {
      const first = r === a + 1;
      const lines = first && e.label ? wrapText(e.label, o.labelChars, o.labelLines) : [];
      const w = lines.length ? Math.max(...lines.map((l) => l.length)) * o.labelCharW + o.labelPadX * 2 : o.spacerW;
      const slot: Slot = { key: `e:${k}:${r}`, row: r, w, h: lines.length * o.labelLineH, x: 0, want: 0, tie: bfs.get(e.from)! * 100 + e.index, edge: k };
      chain.push(slot);
      rows[r].push(slot);
    }
    chains.set(k, chain);
  }

  // Top-down placement: each slot wants to sit under what feeds it; branches fan out around their parent.
  const pos = new Map<string, number>(); // slot key → x
  const feeds = new Map<string, string[]>(); // slot key → slot keys above it
  for (const e of edges) {
    const chain = chains.get(edgeKey(e))!;
    const above = [`n:${e.from}`, ...chain.map((s) => s.key)];
    chain.forEach((s, i) => feeds.set(s.key, [above[i]]));
    const last = above[above.length - 1];
    feeds.set(`n:${e.to}`, [...(feeds.get(`n:${e.to}`) ?? []), last]);
  }
  const fan = o.nodeW + o.colGap;
  const edgeOf = new Map(edges.map((e) => [edgeKey(e), e]));
  rows.forEach((row, r) => {
    for (const s of row) {
      if (r === 0) { s.want = 0; continue; }
      const up = feeds.get(s.key) ?? [];
      if (s.edge && rows[r - 1].some((x) => x.key === up[0] && x.node)) {
        // First slot of an edge: fan out by branch position around the parent.
        const e = edgeOf.get(s.edge)!;
        s.want = (pos.get(up[0]) ?? 0) + (e.index - (e.count - 1) / 2) * fan;
      } else {
        const xs = up.map((k) => pos.get(k)).filter((x): x is number => x !== undefined);
        s.want = xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0;
      }
    }
    row.sort((a, b) => a.want - b.want || a.tie - b.tie);
    pack(row, o.colGap);
    for (const s of row) pos.set(s.key, s.x);
  });

  // Rows: heights and tops.
  const rowH = rows.map((row, r) => Math.max(r % 2 ? 0 : 1, ...row.map((s) => s.h)));
  const rowTop: number[] = [];
  let y = o.margin;
  rows.forEach((_, r) => {
    rowTop[r] = y;
    y += rowH[r] + o.rowGap;
  });
  const height = y - o.rowGap + o.margin;
  const all = rows.flat();
  const minX = Math.min(...all.map((s) => s.x - s.w / 2));
  const maxX = Math.max(...all.map((s) => s.x + s.w / 2));
  const dx = o.margin - minX;
  const width = maxX - minX + o.margin * 2;
  const X = (k: string) => pos.get(k)! + dx;

  for (const n of laid.values()) {
    const r = n.layer * 2;
    n.x = X(`n:${n.id}`);
    n.y = rowTop[r];
  }

  // Edge paths: down from the parent, through each slot (breaking around the label), into the child's top.
  const outEdges: LaidEdge[] = edges.map((e) => {
    const k = edgeKey(e);
    const from = laid.get(e.from)!, to = laid.get(e.to)!;
    const chain = chains.get(k)!;
    const parts: string[] = [];
    let cur = { x: from.x, y: from.y + from.h };
    let d = `M${f(cur.x)} ${f(cur.y)}`;
    const rowBottom = (r: number) => rowTop[r] + rowH[r];
    if (rowBottom(from.layer * 2) > cur.y) { cur = { x: cur.x, y: rowBottom(from.layer * 2) }; d += ` L${f(cur.x)} ${f(cur.y)}`; }
    let labelBox: LaidEdge['labelBox'];
    for (const s of chain) {
      const sx = X(s.key);
      if (s.h > 0) {
        // Label slot: the line stops at the label's top and starts again under it.
        const ly = rowTop[s.row] + (rowH[s.row] - s.h) / 2;
        d += curve(cur, { x: sx, y: ly });
        parts.push(d);
        const lines = wrapText(e.label!, o.labelChars, o.labelLines);
        labelBox = { x: sx, y: ly, w: s.w, h: s.h, lines };
        cur = { x: sx, y: ly + s.h };
        d = `M${f(cur.x)} ${f(cur.y)}`;
        if (rowBottom(s.row) > cur.y) { cur = { x: sx, y: rowBottom(s.row) }; d += ` L${f(sx)} ${f(cur.y)}`; }
      } else {
        d += curve(cur, { x: sx, y: rowTop[s.row] });
        cur = { x: sx, y: rowBottom(s.row) };
        d += ` L${f(sx)} ${f(cur.y)}`;
      }
    }
    d += curve(cur, { x: to.x, y: to.y });
    parts.push(d);
    return { ...e, key: k, d: parts.join(' '), labelBox };
  });

  return { nodes: [...laid.values()], edges: outEdges, width, height, byId: laid };
}

const f = (n: number) => String(Math.round(n * 10) / 10);
function curve(a: { x: number; y: number }, b: { x: number; y: number }) {
  if (Math.abs(a.x - b.x) < 0.5) return ` L${f(b.x)} ${f(b.y)}`;
  const m = (a.y + b.y) / 2;
  return ` C${f(a.x)} ${f(m)} ${f(b.x)} ${f(m)} ${f(b.x)} ${f(b.y)}`;
}

/** Place a sorted row as close to its wanted positions as possible with no overlaps (cluster merging). */
function pack(row: Slot[], gap: number) {
  // Each cluster is a run of touching slots; its offset is the mean of what its members want.
  type Cluster = { start: number; end: number; x: number };
  const width = (i: number, j: number) => {
    // distance from the centre of slot i to the centre of slot j (i ≤ j) when packed tightly
    let d = 0;
    for (let k = i; k < j; k++) d += row[k].w / 2 + gap + row[k + 1].w / 2;
    return d;
  };
  const clusters: Cluster[] = [];
  const place = (c: Cluster) => {
    // c.x is the centre of the first slot; choose it to minimise squared displacement
    let sum = 0;
    for (let k = c.start; k <= c.end; k++) sum += row[k].want - width(c.start, k);
    c.x = sum / (c.end - c.start + 1);
  };
  row.forEach((_, i) => {
    let c: Cluster = { start: i, end: i, x: 0 };
    place(c);
    while (clusters.length) {
      const prev = clusters[clusters.length - 1];
      const prevRight = prev.x + width(prev.start, prev.end) + row[prev.end].w / 2;
      if (prevRight + gap <= c.x - row[c.start].w / 2) break;
      clusters.pop();
      c = { start: prev.start, end: c.end, x: 0 };
      place(c);
    }
    clusters.push(c);
  });
  for (const c of clusters) for (let k = c.start; k <= c.end; k++) row[k].x = c.x + width(c.start, k);
}
