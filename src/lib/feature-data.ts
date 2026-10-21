// Feature data (exam build, Oct 2026): authored YAML in src/data/features/<unit>/<kind>.yaml, read at build time.
// Contracts: docs/plans/2026-10-exam-build.md "Data contracts". Pages import these helpers; islands fetch
// /data/features/<unit>/<kind>.json (src/pages/data/features/[unit]/[kind].json.ts), which is always present —
// an empty shape when a file hasn't been written yet — so the client never sees a 404.
import yaml from 'js-yaml';

export const FEATURE_KINDS = ['triggers', 'modules', 'mocks', 'gems', 'ask', 'chains', 'duels'] as const;
export type FeatureKind = (typeof FEATURE_KINDS)[number];

export interface TriggerIssue {
  id: string; label: string; order: number; group?: string;
  triggers: string[]; patterns?: string[]; cases?: string[]; provisions?: string[]; concept?: string; concepts?: string[]; note?: string;
}
export interface ForgeModule {
  id: string; slot: string; text: string; issues: string[]; gem?: boolean; tags?: string[]; requires?: string[]; excludes?: string[];
}
export interface MockPart { label: string; prompt: string; weight?: number }
export interface MockQuestion {
  n: number; weight: number; kind: string; prompt: string; parts?: MockPart[]; plan?: string[]; model?: string;
  cases?: string[]; provisions?: string[]; concepts?: string[]; criteria?: string[];
}
export interface MockPaper { id: string; title: string; note?: string; questions: MockQuestion[] }
export interface GemItem { id: string; facts: string; options: string[]; answer: number; issue?: string; why: string }
export interface AskEntry { q: string; a: string; to: { kind: 'case' | 'provision' | 'concept' | 'page'; ref: string } }
export interface ChainStep { case?: string; concept?: string; provision?: string; move: string }
export interface Chain { id: string; title: string; topic?: string; steps: ChainStep[] }
export interface DuelPair {
  id: string; kind?: 'case' | 'concept'; a: string; b: string; same?: string[];
  differ?: { aspect: string; a: string; b: string }[]; decisive: string; drills?: { facts: string; closer: 'a' | 'b'; why: string }[];
}

export interface FeatureFiles {
  triggers: { unit: string; issues: TriggerIssue[] };
  modules: { unit: string; slots: string[]; names: Record<string, string[]>; modules: ForgeModule[] };
  mocks: { unit: string; papers: MockPaper[] };
  gems: { unit: string; items: GemItem[] };
  ask: { unit: string; entries: AskEntry[] };
  chains: { unit: string; chains: Chain[] };
  duels: { unit: string; pairs: DuelPair[] };
}

const EMPTY: { [K in FeatureKind]: (unit: string) => FeatureFiles[K] } = {
  triggers: (unit) => ({ unit, issues: [] }),
  modules: (unit) => ({ unit, slots: [], names: {}, modules: [] }),
  mocks: (unit) => ({ unit, papers: [] }),
  gems: (unit) => ({ unit, items: [] }),
  ask: (unit) => ({ unit, entries: [] }),
  chains: (unit) => ({ unit, chains: [] }),
  duels: (unit) => ({ unit, pairs: [] }),
};

const raw = import.meta.glob('/src/data/features/*/*.yaml', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const parsed = new Map<string, unknown>();
for (const [path, src] of Object.entries(raw)) {
  const m = path.match(/features\/([a-z]+\d{4})\/([a-z]+)\.yaml$/);
  if (!m) continue;
  try {
    parsed.set(`${m[1]}/${m[2]}`, yaml.load(src, { schema: yaml.JSON_SCHEMA }));
  } catch (e) {
    // A malformed file must fail loudly at build time rather than ship an empty feature.
    throw new Error(`${path}: ${(e as Error).message}`);
  }
}

/** One unit's file for a feature, or its empty shape when not written yet. */
export function featureData<K extends FeatureKind>(unit: string, kind: K): FeatureFiles[K] {
  const v = parsed.get(`${unit}/${kind}`) as FeatureFiles[K] | undefined;
  return v ? { ...EMPTY[kind](unit), ...v } : EMPTY[kind](unit);
}

/** Every unit's file for a feature that exists. */
export function allFeatureData<K extends FeatureKind>(kind: K): FeatureFiles[K][] {
  return [...parsed.keys()].filter((k) => k.endsWith(`/${kind}`)).sort().map((k) => featureData(k.split('/')[0], kind));
}

export const hasFeatureData = (unit: string, kind: FeatureKind) => parsed.has(`${unit}/${kind}`);
