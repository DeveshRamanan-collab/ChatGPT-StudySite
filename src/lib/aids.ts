// Client-side shapes and loader for /data/<unit>/aids.json (study aids per concept, decision flows, problem-fact
// annotations). One fetch per unit per page, cached; every consumer degrades to nothing when a unit has no aids yet.
export interface Analogy { text: string; maps: { from: string; to: string }[]; limits: string[] }
export interface Element { name: string; test: string; cases: string[]; authorities: string[] }
export interface Aid {
  concept: string;
  unit: string;
  week: string;
  plain: string;
  concrete?: string;
  formal?: string;
  analogy?: Analogy;
  terms: { term: string; gloss: string; example?: string }[];
  misconceptions: { claim: string; tempting: string; correction: string }[];
  socratic: { ask: string; hint: string; answer: string }[];
  elements: Element[];
  'what-if': { change: string; effect: string }[];
  boundary: { text: string; why: string }[];
  transfer: { scenario: string; answer: string }[];
  objections: { position: string; evidence: string; objection: string; reply?: string }[];
  storyboard: { caption: string; detail: string }[];
  sources: string[];
  verify: boolean;
}
export interface FlowNode {
  id: string;
  kind: 'ask' | 'step' | 'end';
  text: string;
  note?: string;
  concept?: string;
  cases: string[];
  authorities: string[];
  branches: { label: string; to: string }[];
  next?: string;
  tone?: 'met' | 'not-met' | 'qualified';
  exception: boolean;
}
export interface Flow { id: string; unit: string; week: string; title: string; summary: string; start: string; concepts: string[]; nodes: FlowNode[]; sources: string[]; verify: boolean }
export type FactKind = 'party' | 'conduct' | 'mental' | 'harm' | 'relationship' | 'timing' | 'statement' | 'context';
export interface Fact { text: string; weight: 'essential' | 'background'; kind: FactKind; issues: string[]; why?: string }
export interface Facts { question: string; unit: string; parties: { name: string; role: string }[]; issues: { id: string; label: string; concept?: string }[]; facts: Fact[]; verify: boolean }
export interface AidsBundle { unit: string; aids: Record<string, Aid>; flows: Flow[]; facts: Record<string, Facts> }

const cache = new Map<string, Promise<AidsBundle>>();
const EMPTY = (unit: string): AidsBundle => ({ unit, aids: {}, flows: [], facts: {} });

/** The unit's aids bundle (cached per page); resolves to an empty bundle on any failure. */
export function loadAids(unit: string): Promise<AidsBundle> {
  let p = cache.get(unit);
  if (!p) {
    p = fetch(`/data/${unit}/aids.json`).then((r) => (r.ok ? r.json() : EMPTY(unit))).catch(() => EMPTY(unit));
    cache.set(unit, p);
  }
  return p;
}

/** Normalised word stems for loose matching (teach-back coverage, fact use in answers). */
export function stems(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[’']/g, '')
      .split(/[^a-z0-9]+/)
      .filter((w) => w.length > 3 && !STOP.has(w))
      .map((w) => w.replace(/(ies|ied)$/, 'y').replace(/(ing|ed|es|s|ly)$/, '')),
  );
}
const STOP = new Set(['that', 'this', 'with', 'from', 'have', 'there', 'their', 'which', 'were', 'would', 'could', 'should', 'when', 'what', 'into', 'than', 'then', 'they', 'them', 'been', 'being', 'also', 'only', 'does', 'such', 'some', 'more', 'most', 'other', 'about', 'after', 'before', 'because', 'where', 'while', 'under']);

/** Share of a phrase's stems found in a text's stems (0–1). */
export function overlap(phrase: string, text: Set<string>): number {
  const p = [...stems(phrase)];
  if (!p.length) return 0;
  return p.filter((w) => text.has(w)).length / p.length;
}
