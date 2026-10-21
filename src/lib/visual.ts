// Visual practice (features 92, 97, 98, 99): pure selection and scoring for the four exercise kinds on
// /<unit>/visual, all built from the study aids (src/lib/aids.ts). No DOM, no React.
//   label  · a rule's elements as ordered empty boxes; the element names are shuffled tiles to place.
//   match  · scenarios (transfer scenarios, boundary cases) linked to the concept they belong to.
//   sort   · terms (glosses hidden) sorted into 2–3 concepts of the same week; the gloss is the reason.
//   sketch · draw how a concept's parts fit together, then compare with its elements or the week's flow.
// Concepts without the material a kind needs are skipped; every builder returns null / [] rather than throwing.
import type { Aid, Flow, FlowNode } from './aids';
import { hashString, shuffle } from './flow';

export type VisualKind = 'label' | 'match' | 'sort' | 'sketch';
export const VISUAL_KINDS: VisualKind[] = ['label', 'match', 'sort', 'sketch'];
export const KIND_LABEL: Record<VisualKind, string> = { label: 'Label parts', match: 'Match', sort: 'Sort', sketch: 'Draw it' };

/** Names the page passes in (the aids carry ids only). */
export interface WeekRef { id: string; number: number; topic: string; concepts: string[] }
export interface ConceptRef { title: string; href: string; week: string }

/** Attempt id: `visual:<kind>:<concept>` (match and sort record one attempt per concept in the round). */
export const visualId = (kind: VisualKind, scope: string) => `visual:${kind}:${scope}`;
/** IndexedDB settings key of a concept's saved sketch. */
export const sketchKey = (concept: string) => `sketch:${concept}`;

const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ');
const has = (s: string | undefined) => !!s && s.trim().length > 0;

/** Share of true marks (0 when there are none). */
export const share = (marks: readonly boolean[]) => (marks.length ? marks.filter(Boolean).length / marks.length : 0);

/** A week's aids in the week's own concept order (concepts it does not list follow, by id). */
export function weekAids(aids: Record<string, Aid>, week: string, order: readonly string[] = []): Aid[] {
  const rank = (id: string) => { const i = order.indexOf(id); return i < 0 ? Infinity : i; };
  return Object.values(aids)
    .filter((a) => a.week === week)
    .sort((a, b) => rank(a.concept) - rank(b.concept) || a.concept.localeCompare(b.concept));
}

// ---------- Label the parts ----------

export interface Slot { name: string; test: string }
export interface LabelSet { concept: string; week: string; slots: Slot[] }
export interface Tile { id: string; name: string }

/** The rule's elements in order, or null when it has fewer than two named elements. */
export function labelSet(a: Aid): LabelSet | null {
  const slots = (a.elements ?? []).filter((e) => has(e.name)).map((e) => ({ name: e.name.trim(), test: e.test ?? '' }));
  return slots.length >= 2 ? { concept: a.concept, week: a.week, slots } : null;
}

/** One tile per element, shuffled (seeded; never in the answer order). */
export function labelTiles(set: LabelSet, seed: number): Tile[] {
  return shuffle(set.slots.map((s, i) => ({ id: `t${i}`, name: s.name })), seed ^ hashString(set.concept));
}

/** Per slot: does the tile placed there carry that slot's name? (Names, not tile ids: twin names are interchangeable.) */
export function checkSlots(placed: readonly (string | null)[], slots: readonly Slot[]): boolean[] {
  return slots.map((s, i) => placed[i] != null && norm(placed[i]!) === norm(s.name));
}

/**
 * Put `item` in `slot` (a slot holds one item). The slot's occupant moves to where the item came from (a swap) or,
 * when the item came from the tray, back to the tray. Immutable; an out-of-range slot returns a copy.
 */
export function placeInSlot<T>(slots: readonly (T | null)[], item: T, slot: number): (T | null)[] {
  const next = [...slots];
  if (slot < 0 || slot >= next.length) return next;
  const from = next.indexOf(item);
  if (from === slot) return next;
  const occupant = next[slot];
  next[slot] = item;
  if (from >= 0) next[from] = occupant;
  return next;
}

/** Take whatever is in `slot` back to the tray. */
export const clearSlot = <T>(slots: readonly (T | null)[], slot: number): (T | null)[] => slots.map((x, i) => (i === slot ? null : x));

// ---------- Match ----------

export interface Scenario { id: string; text: string; concept: string; source: 'transfer' | 'boundary'; explain: string }
export interface MatchRound { concepts: string[]; scenarios: Scenario[] }

/** A concept's scenarios: its transfer scenarios, then its boundary cases. */
export function scenariosOf(a: Aid): Scenario[] {
  const t = (a.transfer ?? []).flatMap((x, i) => (has(x.scenario) ? [{ id: `${a.concept}:t${i}`, text: x.scenario.trim(), concept: a.concept, source: 'transfer' as const, explain: x.answer ?? '' }] : []));
  const b = (a.boundary ?? []).flatMap((x, i) => (has(x.text) ? [{ id: `${a.concept}:b${i}`, text: x.text.trim(), concept: a.concept, source: 'boundary' as const, explain: x.why ?? '' }] : []));
  return [...t, ...b];
}

/**
 * One matching round from a week's aids: up to `concepts` concepts (column order follows the week), one scenario
 * each, plus `extra` second scenarios so elimination never hands over the last link. Null when fewer than two
 * concepts have a scenario.
 */
export function matchRound(aids: readonly Aid[], seed: number, { concepts: k = 4, extra = 1 } = {}): MatchRound | null {
  const eligible = aids.map((a) => ({ a, s: scenariosOf(a) })).filter((x) => x.s.length > 0);
  if (eligible.length < 2) return null;
  const chosen = shuffle(eligible, seed).slice(0, k);
  const pools = chosen.map((x) => shuffle(x.s, seed ^ hashString(x.a.concept)));
  const scenarios = pools.map((p) => p[0]);
  let left = extra;
  for (const p of pools) {
    if (left <= 0) break;
    if (p.length > 1) { scenarios.push(p[1]); left--; }
  }
  const order = new Map(aids.map((a, i) => [a.concept, i]));
  return {
    concepts: chosen.map((x) => x.a.concept).sort((a, b) => order.get(a)! - order.get(b)!),
    scenarios: shuffle(scenarios, seed + 1),
  };
}

/** Per scenario id: is it linked to its own concept? Unlinked scenarios are false. */
export function checkLinks(links: Readonly<Record<string, string>>, scenarios: readonly Scenario[]): Record<string, boolean> {
  return Object.fromEntries(scenarios.map((s) => [s.id, links[s.id] === s.concept]));
}

/** Link (or, when already so linked, unlink) a scenario and a concept. Immutable. */
export function toggleLink(links: Readonly<Record<string, string>>, scenario: string, concept: string): Record<string, string> {
  const next = { ...links };
  if (next[scenario] === concept) delete next[scenario];
  else next[scenario] = concept;
  return next;
}

// ---------- Sort ----------

export interface SortItem { id: string; term: string; gloss: string; concept: string }
export interface SortRound { bins: string[]; items: SortItem[] }

/**
 * One sorting round: `bins` concepts of the week (3 when the week has them, else 2) and up to `perBin` of each one's
 * terms, shuffled. A term that also appears in another bin's concept is left out (it would have two right bins).
 * Null when fewer than two concepts have two or more terms.
 */
export function sortRound(aids: readonly Aid[], seed: number, { bins = 3, perBin = 3 } = {}): SortRound | null {
  const termsOf = (a: Aid) => (a.terms ?? []).filter((t) => has(t.term));
  const eligible = aids.filter((a) => termsOf(a).length >= 2);
  if (eligible.length < 2) return null;
  const chosen = shuffle(eligible, seed).slice(0, Math.max(2, bins));
  const owners = new Map<string, Set<string>>();
  for (const a of chosen) for (const t of termsOf(a)) owners.set(norm(t.term), new Set([...(owners.get(norm(t.term)) ?? []), a.concept]));
  const items: SortItem[] = [];
  const kept: string[] = [];
  for (const a of chosen) {
    const own = termsOf(a)
      .map((t) => ({ t, i: a.terms.indexOf(t) }))
      .filter(({ t }) => owners.get(norm(t.term))!.size === 1);
    const pick = shuffle(own, seed ^ hashString(a.concept)).slice(0, perBin);
    if (!pick.length) continue;
    kept.push(a.concept);
    for (const { t, i } of pick) items.push({ id: `${a.concept}:${i}`, term: t.term.trim(), gloss: t.gloss ?? '', concept: a.concept });
  }
  if (kept.length < 2) return null;
  const order = new Map(aids.map((a, i) => [a.concept, i]));
  return { bins: kept.sort((a, b) => order.get(a)! - order.get(b)!), items: shuffle(items, seed + 1) };
}

/** Per item id: is it in its own concept's bin? Unsorted items are false. */
export function checkSorted(placed: Readonly<Record<string, string | undefined>>, items: readonly SortItem[]): Record<string, boolean> {
  return Object.fromEntries(items.map((it) => [it.id, placed[it.id] === it.concept]));
}

/** Right / total per concept, for recording one attempt per concept in a round. */
export function byConcept(items: readonly { id: string; concept: string }[], marks: Readonly<Record<string, boolean>>): Map<string, { right: number; total: number }> {
  const out = new Map<string, { right: number; total: number }>();
  for (const it of items) {
    const r = out.get(it.concept) ?? { right: 0, total: 0 };
    r.total++;
    if (marks[it.id]) r.right++;
    out.set(it.concept, r);
  }
  return out;
}

// ---------- Sketch ----------

export interface OutlineLine { depth: number; text: string; label?: string; kind: FlowNode['kind'] | 'ref'; tone?: FlowNode['tone'] }
export type SketchRef =
  | { kind: 'elements'; elements: Slot[] }
  | { kind: 'flow'; flowId: string; title: string; outline: OutlineLine[] };
export interface SketchItem { concept: string; week: string; ref: SketchRef }

/**
 * A flow as an indented outline: an ask's branches indent one level (labelled), a step's `next` stays level, ends
 * close a branch. An ask or step reached a second time is not repeated ("ref" line); outcomes are. Missing targets
 * are skipped.
 */
export function flowOutline(flow: Pick<Flow, 'nodes' | 'start'>, maxLines = 80): OutlineLine[] {
  const nodes = new Map(flow.nodes.map((n) => [n.id, n]));
  const seen = new Set<string>();
  const out: OutlineLine[] = [];
  const walk = (id: string, depth: number, label?: string) => {
    for (let cur: string | undefined = id, lab = label; cur && out.length < maxLines; lab = undefined) {
      const n = nodes.get(cur);
      if (!n) return;
      // An outcome reached again is simply repeated (it is a leaf); any other node is referred back to.
      if (seen.has(cur) && n.kind !== 'end') { out.push({ depth, text: n.text, label: lab, kind: 'ref' }); return; }
      seen.add(cur);
      out.push({ depth, text: n.text, label: lab, kind: n.kind, tone: n.tone });
      if (n.kind === 'end') return;
      if (n.branches.length) {
        for (const b of n.branches) if (nodes.has(b.to)) walk(b.to, depth + 1, b.label);
        return;
      }
      cur = n.next && nodes.has(n.next) ? n.next : undefined;
    }
  };
  walk(flow.start, 0);
  return out;
}

/** Concepts that can be sketched: those with elements (ordered diagram), else those a week flow covers (outline). */
export function sketchItems(aids: readonly Aid[], flows: readonly Flow[]): SketchItem[] {
  return aids.flatMap((a): SketchItem[] => {
    const set = labelSet(a);
    if (set) return [{ concept: a.concept, week: a.week, ref: { kind: 'elements', elements: set.slots } }];
    const f = flows.find((x) => x.week === a.week && (x.concepts ?? []).includes(a.concept));
    if (!f) return [];
    const outline = flowOutline(f);
    return outline.length >= 2 ? [{ concept: a.concept, week: a.week, ref: { kind: 'flow', flowId: f.id, title: f.title, outline } }] : [];
  });
}

export type Pt = [number, number];
export interface Stroke { tool: 'pen' | 'eraser'; points: Pt[] }
export type SketchOp = Stroke | { tool: 'clear' };
export interface SavedSketch { v: 1; ops: Stroke[]; at: number }

/** Strokes still on the page: everything after the last clear. */
export function visibleStrokes(ops: readonly SketchOp[]): Stroke[] {
  let from = 0;
  ops.forEach((o, i) => { if (o.tool === 'clear') from = i + 1; });
  return ops.slice(from).filter((o): o is Stroke => o.tool !== 'clear');
}
/** Nothing drawn (eraser strokes alone leave the page blank). */
export const isBlank = (ops: readonly SketchOp[]) => !visibleStrokes(ops).some((s) => s.tool === 'pen' && s.points.length > 0);

/** Drop points closer than `min` (normalised units) to the last kept one and round to 4 places; keeps the end point. */
export function thin(points: readonly Pt[], min = 0.002): Pt[] {
  const r = (p: Pt): Pt => [Math.round(p[0] * 1e4) / 1e4, Math.round(p[1] * 1e4) / 1e4];
  const out: Pt[] = [];
  for (const p of points) {
    const last = out[out.length - 1];
    if (!last || Math.hypot(p[0] - last[0], p[1] - last[1]) >= min) out.push(r(p));
  }
  const end = points[points.length - 1];
  if (end && out.length > 1) { const l = out[out.length - 1]; const e = r(end); if (l[0] !== e[0] || l[1] !== e[1]) out.push(e); }
  return out;
}

const isPt = (p: unknown): p is Pt => Array.isArray(p) && p.length === 2 && p.every((n) => typeof n === 'number' && Number.isFinite(n));
/** A stored sketch, or null when the value is missing or malformed. */
export function parseSketch(value: unknown): SavedSketch | null {
  const v = value as Partial<SavedSketch> | null;
  if (!v || v.v !== 1 || !Array.isArray(v.ops)) return null;
  const ops = v.ops.filter((o): o is Stroke => !!o && (o.tool === 'pen' || o.tool === 'eraser') && Array.isArray(o.points) && o.points.every(isPt));
  return { v: 1, ops, at: typeof v.at === 'number' ? v.at : 0 };
}

export type SelfRate = 'got' | 'partly' | 'missed';
export const SELF_RATES: { id: SelfRate; label: string; score: number }[] = [
  { id: 'got', label: 'Got it', score: 1 },
  { id: 'partly', label: 'Partly', score: 0.5 },
  { id: 'missed', label: 'Missed', score: 0 },
];

// ---------- Availability ----------

/** How many concepts in these aids each kind can use (match and sort need at least two, else 0). */
export function availability(aids: readonly Aid[], flows: readonly Flow[]): Record<VisualKind, number> {
  const match = aids.filter((a) => scenariosOf(a).length > 0).length;
  const sort = aids.filter((a) => (a.terms ?? []).filter((t) => has(t.term)).length >= 2).length;
  return {
    label: aids.filter((a) => labelSet(a)).length,
    match: match >= 2 ? match : 0,
    sort: sort >= 2 ? sort : 0,
    sketch: sketchItems(aids, flows).length,
  };
}

/** Pick a stored URL value if it names one of `allowed`, else the fallback. */
export const pickParam = <T extends string>(value: string | null, allowed: readonly T[], fallback: T): T =>
  (allowed as readonly string[]).includes(value ?? '') ? (value as T) : fallback;
