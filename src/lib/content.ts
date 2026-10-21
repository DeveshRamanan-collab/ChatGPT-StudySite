// Shared helpers for reading collections. Ids are file basenames; units are lowercase codes (laws2400).
import { getCollection, type CollectionEntry } from 'astro:content';

export type Unit = CollectionEntry<'units'>;
export type Week = CollectionEntry<'weeks'>;
export type Concept = CollectionEntry<'concepts'>;
export type Question = CollectionEntry<'questions'>;
export type Card = CollectionEntry<'cards'>;

export const units = async () =>
  (await getCollection('units')).sort((a, b) => +a.data['exam-start'] - +b.data['exam-start'] || a.id.localeCompare(b.id)); // exam order

/** Units that have real (non-seed) weeks: their seed content is hidden everywhere. */
let realUnits: Promise<Set<string>> | null = null;
const unitsWithRealContent = () =>
  (realUnits ??= getCollection('weeks', (w) => !w.data.seed).then((ws) => new Set(ws.map((w) => w.data.unit))));

export const weeksOf = async (unit: string) => {
  const hideSeed = (await unitsWithRealContent()).has(unit);
  return (await getCollection('weeks', (w) => w.data.unit === unit && !(hideSeed && w.data.seed))).sort((a, b) => a.data.number - b.data.number);
};

export const conceptsOf = async (unit: string) => {
  const hideSeed = (await unitsWithRealContent()).has(unit);
  return getCollection('concepts', (c) => c.data.unit === unit && !(hideSeed && c.data.seed));
};

/** A unit's shape for the knowledge map's frame, counted as /data/overview.json counts it: weeks in, last week with concepts. */
export const mapShape = async (unit: Unit) => {
  const ids = new Set((await conceptsOf(unit.id)).map((c) => c.id));
  const weeks = await weeksOf(unit.id);
  const filled = weeks.filter((w) => w.data.concepts.some((id) => ids.has(id))).map((w) => w.data.number);
  return { id: unit.id, code: unit.data.code, n: weeks.length, last: Math.max(0, ...filled) };
};

/** Concept URL slug: the id without its unit prefix (e.g. w05-duty-of-care). */
export const conceptSlug = (c: Concept) => c.id.replace(`${c.data.unit}-`, '');

export async function questionsOf(unit: string) {
  const ids = new Set((await conceptsOf(unit)).map((c) => c.id));
  return getCollection('questions', (q) => ids.has(q.data.concept));
}

export async function cardsOf(unit: string) {
  const ids = new Set((await conceptsOf(unit)).map((c) => c.id));
  return getCollection('cards', (c) => ids.has(c.data.concept));
}

export const formatDate = (d: Date) =>
  d.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Australia/Sydney' });
