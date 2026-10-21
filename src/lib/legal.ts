// Pure logic for the legal-reasoning tools (200-features pass, Oct 2026):
//   · statutory structure (88): an authority title split into instrument + provision ("Civil Liability Act 2002 (NSW)
//     s 5B" → "Civil Liability Act 2002 (NSW)" + "s 5B"), provisions in numeric order, and cross-references between
//     provisions of one instrument found in their text or gloss ("s 5D", "art 2(4)", "articles 4 to 9");
//   · case anatomy (154): a case's facts / issue / held / ratio split into sentences, and a round that mixes fields;
//   · fact comparison (155): word stems shared by a problem's essential facts and a case's facts (a word-overlap aid);
//   · argument adversary (158): the positions with objections in a unit's study aids, as attempt-able items.
// No DOM and no Dexie, so every rule is unit-tested (tests/legal.test.ts runs the parsers over the real content).
import { stems, type Aid } from './aids';
import { rng, shuffle, SELF_SCORE, type SelfRating } from './drills';

// ---------------------------------------------------------------------------------------------------------------
// Statutory structure
// ---------------------------------------------------------------------------------------------------------------

/** Provision families: articles, sections, divisions, parts, schedules, clauses, regulations. */
export type ProvKind = 'art' | 's' | 'div' | 'pt' | 'sch' | 'cl' | 'reg';
const KIND_ORDER: ProvKind[] = ['art', 's', 'div', 'pt', 'sch', 'cl', 'reg'];

/** One provision number: 5B(1)(a) → { n: 5, suffix: 'B', sub: ['1', 'a'] }; roman numerals become numbers. */
export interface ProvNum { n: number; suffix: string; sub: string[] }
/** A designator and its number or range: "ss 55–58" → { kind: 's', from: 55, to: 58 }. */
export interface Span { kind: ProvKind; from: ProvNum; to: ProvNum }

const SUB = String.raw`(?:\((?:\d+[A-Z]{0,2}|[a-z]{1,4})\))*`; // (1), (2A), (a), (iv)
const NUM = String.raw`(?:\d+[A-Z]{0,2}|[IVXLC]+)${SUB}`;
const ITEM = String.raw`${NUM}(?:(?:\s*[–-]\s*|\s+to\s+)${NUM})?`;
const LIST = String.raw`${ITEM}(?:(?:\s*,\s*|\s+(?:and|or)\s+)${ITEM})*`;
const TITLE_DESIG = String.raw`(?:arts?|ss?|div|pt|sch|cl|reg)`;
// Instrument (shortest prefix), optional comma, then designated numbers running to the end, then an optional heading.
const TITLE_RE = new RegExp(String.raw`^(.*?),?\s+(${TITLE_DESIG}\s+${LIST}(?:\s+${TITLE_DESIG}\s+${LIST})*)(?:\s+\(([^()]*)\))?$`);
const SPAN_RE = new RegExp(String.raw`(${TITLE_DESIG})\s+(${LIST})`, 'g');
const ITEM_RE = new RegExp(String.raw`(${NUM})(?:(?:\s*[–-]\s*|\s+to\s+)(${NUM}))?`, 'g');

/** Names the materials use for one instrument, mapped to the one the map groups under. Display grouping only. */
const ALIASES: Record<string, string> = {
  'Charter of the United Nations': 'UN Charter',
  VCLT: 'Vienna Convention on the Law of Treaties 1969',
  'International Law Commission Draft Articles on State Responsibility (2001)': 'Articles on Responsibility of States for Internationally Wrongful Acts (2001)',
};
/** Short names, used only to tell a mention of this instrument from a mention of another one. */
const SHORT: Record<string, string[]> = {
  'Vienna Convention on the Law of Treaties 1969': ['VCLT'],
  'Articles on Responsibility of States for Internationally Wrongful Acts (2001)': ['ARSIWA', 'ILC Articles', 'Draft Articles'],
  'International Covenant on Civil and Political Rights 1966': ['ICCPR'],
  'International Covenant on Economic, Social and Cultural Rights 1966': ['ICESCR'],
  'UN Convention on the Law of the Sea 1982': ['UNCLOS'],
  'Rome Statute of the International Criminal Court': ['ICC Statute'],
  'Civil Liability Act 2002 (NSW)': ['CLA'],
};

export const canonicalInstrument = (name: string) => ALIASES[name] ?? name;
/** Every name an instrument goes by (its own, the aliases grouped under it, its short names). */
export const instrumentNames = (name: string) => [name, ...Object.keys(ALIASES).filter((k) => ALIASES[k] === name), ...(SHORT[name] ?? [])];

const ROMAN: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100 };
export function romanToInt(s: string): number {
  let total = 0;
  for (let i = 0; i < s.length; i++) {
    const v = ROMAN[s[i]], next = ROMAN[s[i + 1]] ?? 0;
    total += v < next ? -v : v;
  }
  return total;
}

export function parseNum(raw: string): ProvNum | null {
  const sub = [...raw.matchAll(/\(([0-9A-Za-z]+)\)/g)].map((m) => m[1]);
  const head = raw.replace(/\(.*$/, '');
  const a = head.match(/^(\d+)([A-Z]{0,2})$/);
  if (a) return { n: Number(a[1]), suffix: a[2], sub };
  if (/^[IVXLC]+$/.test(head)) return { n: romanToInt(head), suffix: '', sub };
  return null;
}

function kindOf(designator: string): ProvKind {
  const d = designator.toLowerCase();
  if (d.startsWith('art')) return 'art';
  if (d === 's' || d === 'ss' || d.startsWith('section')) return 's';
  return d as ProvKind;
}

function parseList(kind: ProvKind, list: string): Span[] {
  const out: Span[] = [];
  for (const m of list.matchAll(ITEM_RE)) {
    const from = parseNum(m[1]);
    if (!from) continue;
    // Sections are never numbered in roman numerals ("Chapters VI" is not "s VI").
    if (kind === 's' && /^[IVXLC]/.test(m[1])) continue;
    const to = m[2] ? parseNum(m[2]) : null;
    out.push({ kind, from, to: to ?? from });
  }
  return out;
}

export function parseSpans(provision: string): Span[] {
  return [...provision.matchAll(SPAN_RE)].flatMap((m) => parseList(kindOf(m[1]), m[2]));
}

export interface ParsedTitle {
  /** The instrument, under its canonical name ("UN Charter", not "Charter of the United Nations"). */
  instrument: string;
  /** The provision as the title states it ("s 5B", "arts 13–14", "art II ss 2–4"); null for a whole instrument. */
  provision: string | null;
  /** A heading the title gives in brackets after the provision ("Guarantee of rights and freedoms"). */
  heading: string | null;
  spans: Span[];
}

/** "Civil Liability Act 2002 (NSW) s 5B" → instrument "Civil Liability Act 2002 (NSW)", provision "s 5B". */
export function parseTitle(title: string): ParsedTitle {
  const t = title.replace(/\s+/g, ' ').trim();
  const m = t.match(TITLE_RE);
  if (!m) return { instrument: canonicalInstrument(t.replace(/,$/, '')), provision: null, heading: null, spans: [] };
  const spans = parseSpans(m[2]);
  if (!spans.length) return { instrument: canonicalInstrument(t), provision: null, heading: null, spans: [] };
  return { instrument: canonicalInstrument(m[1].trim()), provision: m[2], heading: m[3]?.trim() || null, spans };
}

const cmpSub = (a: string[], b: string[]) => {
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    const x = a[i], y = b[i];
    const d = /^\d+$/.test(x) && /^\d+$/.test(y) ? Number(x) - Number(y) : x.localeCompare(y);
    if (d) return d;
  }
  return a.length - b.length;
};
const cmpNum = (a: ProvNum, b: ProvNum) => a.n - b.n || a.suffix.localeCompare(b.suffix) || cmpSub(a.sub, b.sub);

/** Numeric order of provisions: whole instruments first, then articles before sections, then 3B < 5 < 5A < 27. */
export function compareSpans(a: Span[], b: Span[]): number {
  if (!a.length || !b.length) return (a.length ? 1 : 0) - (b.length ? 1 : 0);
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    const d = KIND_ORDER.indexOf(a[i].kind) - KIND_ORDER.indexOf(b[i].kind) || cmpNum(a[i].from, b[i].from) || cmpNum(a[i].to, b[i].to);
    if (d) return d;
  }
  return a.length - b.length;
}

/** A provision mentioned in text: a kind and one number (ranges in the text are expanded). */
export interface ProvRef { kind: ProvKind; n: number; suffix: string; sub: string[] }

const REF_DESIG = String.raw`(?:articles?|Articles?|arts?|Arts?|sections?|Sections?|ss?)`;
const REF_RE = new RegExp(String.raw`(?<![A-Za-z'’.])(${REF_DESIG})\s+(${LIST})(?![A-Za-z0-9])`, 'g');
// An instrument named right before the reference ("ICCPR art 4", "the UN Charter (art 51)", "Act 1965 (NSW) s 9") …
const BEFORE_RE = /((?:[A-Z][\w’'-]*\s+){0,6}(?:Charter|Covenant|Convention|Statute|Act|Protocol|Treaty|Agreement|Code|Constitution)(?:\s+\d{4})?(?:\s+\([A-Za-z]+\))?|\b[A-Z]{3,}[a-z]?)\s*[(,]?\s*$/;
// … or right after it ("art 51 of the Charter").
const AFTER_RE = /^\s*(?:\([^)]*\)\s*)?,?\s*of\s+(?:the\s+)?([A-Z][\w’'-]*(?:\s+[A-Z][\w’'-]*)*)/;
const NAME_STOP = new Set(['the', 'of', 'and', 'on', 'for', 'to', 'in']);
const words = (s: string) => new Set(s.toLowerCase().replace(/[()’',]/g, ' ').split(/\s+/).filter((w) => w && !NAME_STOP.has(w)));

/** Whether a mentioned instrument ("UN Charter", "Act 1965 (NSW)") is one of these names. */
export function sameInstrument(mention: string, names: string[]): boolean {
  const m = [...words(mention)];
  return m.length > 0 && names.some((n) => { const w = words(n); return m.every((x) => w.has(x)); });
}

/** Provisions of the given instrument that a text refers to; mentions tied to another instrument are left out. */
export function findRefs(text: string, names: string[]): ProvRef[] {
  const out: ProvRef[] = [];
  for (const m of text.matchAll(REF_RE)) {
    const at = m.index ?? 0;
    const before = text.slice(Math.max(0, at - 80), at).match(BEFORE_RE);
    if (before && !sameInstrument(before[1], names)) continue;
    const after = text.slice(at + m[0].length, at + m[0].length + 80).match(AFTER_RE);
    if (after && !sameInstrument(after[1], names)) continue;
    for (const s of parseList(kindOf(m[1]), m[2])) {
      const plain = !s.from.suffix && !s.to.suffix && !s.from.sub.length && !s.to.sub.length;
      if (plain && s.to.n > s.from.n && s.to.n - s.from.n <= 50) {
        for (let n = s.from.n; n <= s.to.n; n++) out.push({ kind: s.kind, n, suffix: '', sub: [] });
      } else {
        out.push({ kind: s.kind, ...s.from });
        if (cmpNum(s.to, s.from)) out.push({ kind: s.kind, ...s.to });
      }
    }
  }
  return out;
}

const prefixOf = (a: string[], b: string[]) => a.every((x, i) => b[i] === x);
/** How a provision's spans take in a reference: 2 = exactly or more widely (s 5B takes in s 5B(1)(a); arts 13–14 takes
 *  in art 13), 1 = only part of it (art 12(1) for a mention of art 12), 0 = not at all. */
export function coverage(spans: Span[], r: ProvRef): 0 | 1 | 2 {
  let best: 0 | 1 | 2 = 0;
  for (const s of spans) {
    if (s.kind !== r.kind) continue;
    const single = s.from.n === s.to.n && s.from.suffix === s.to.suffix;
    if (single) {
      if (s.from.n !== r.n || s.from.suffix !== r.suffix) continue;
      if (prefixOf(s.from.sub, r.sub)) return 2;
      if (prefixOf(r.sub, s.from.sub)) best = 1;
      continue;
    }
    const x = { n: r.n, suffix: r.suffix, sub: [] };
    if (cmpNum(x, { ...s.from, sub: [] }) >= 0 && cmpNum(x, { ...s.to, sub: [] }) <= 0) return 2;
  }
  return best;
}

export interface RefInput { id: string; instrument: string; spans: Span[]; text: string }
export type CrossRefs = Record<string, { to: string[]; from: string[] }>;

/** "Refers to" / "Referred to by" between provisions of the same instrument, in the order the items are given. */
export function crossRefs(items: RefInput[]): CrossRefs {
  const out: CrossRefs = Object.fromEntries(items.map((p) => [p.id, { to: [], from: [] }]));
  const groups = new Map<string, RefInput[]>();
  for (const p of items) groups.set(p.instrument, [...(groups.get(p.instrument) ?? []), p]);
  for (const [instrument, group] of groups) {
    const names = instrumentNames(instrument);
    for (const p of group) {
      const to = new Set<string>();
      for (const r of findRefs(p.text, names)) {
        if (coverage(p.spans, r)) continue; // itself, or the article it belongs to
        // The provision that takes in the whole reference; failing that, the parts of it the map has (art 12(1)).
        const others = group.filter((q) => q !== p);
        const whole = others.filter((q) => coverage(q.spans, r) === 2);
        for (const q of whole.length ? whole : others.filter((q) => coverage(q.spans, r) === 1)) to.add(q.id);
      }
      for (const q of group) if (to.has(q.id)) { out[p.id].to.push(q.id); out[q.id].from.push(p.id); }
    }
  }
  return out;
}

export interface AuthorityLike { id: string; title: string; kind: string; units: string[]; text: string; gloss: string; cases: string[]; verify: boolean }
export interface Provision {
  id: string;
  title: string;
  label: string | null;
  heading: string | null;
  gloss: string;
  text: string;
  units: string[];
  cases: string[];
  verify: boolean;
  refersTo: string[];
  referredBy: string[];
}
export interface Instrument { name: string; slug: string; units: string[]; provisions: Provision[] }

/** Statutes and treaties always; 'article' entries only when the title names a provision (else it is a journal article). */
export function isProvision(kind: string, parsed: ParsedTitle): boolean {
  return kind === 'statute' || kind === 'treaty' || (kind === 'article' && parsed.provision !== null);
}

export const slugify = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** The statutory map: instruments A–Z, each with its provisions in numeric order and their cross-references. */
export function buildStatuteMap(auths: AuthorityLike[]): Instrument[] {
  const parsed = auths
    .map((a) => ({ a, p: parseTitle(a.title) }))
    .filter(({ a, p }) => isProvision(a.kind, p));
  const groups = new Map<string, typeof parsed>();
  for (const x of parsed) groups.set(x.p.instrument, [...(groups.get(x.p.instrument) ?? []), x]);
  for (const g of groups.values()) g.sort((x, y) => compareSpans(x.p.spans, y.p.spans) || x.a.title.localeCompare(y.a.title));
  const refs = crossRefs([...groups.values()].flat().map(({ a, p }) => ({ id: a.id, instrument: p.instrument, spans: p.spans, text: `${a.text}\n${a.gloss}` })));
  return [...groups.entries()]
    .map(([name, g]) => ({
      name,
      slug: slugify(name),
      units: [...new Set(g.flatMap((x) => x.a.units))].sort(),
      provisions: g.map(({ a, p }) => ({
        id: a.id, title: a.title, label: p.provision, heading: p.heading, gloss: a.gloss.trim(), text: a.text.trim(), units: a.units,
        cases: a.cases, verify: a.verify, refersTo: refs[a.id].to, referredBy: refs[a.id].from,
      })),
    }))
    .sort((x, y) => x.name.localeCompare(y.name, 'en-AU'));
}

const fold = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
/** Every whitespace-separated term of the query appears in the text (case- and accent-insensitive). */
export function matchesQuery(text: string, query: string): boolean {
  const terms = fold(query).split(/\s+/).filter(Boolean);
  if (!terms.length) return true;
  const hay = fold(text);
  return terms.every((t) => hay.includes(t));
}

// ---------------------------------------------------------------------------------------------------------------
// Case anatomy
// ---------------------------------------------------------------------------------------------------------------

export type Field = 'facts' | 'issue' | 'held' | 'ratio';
export const FIELDS: Field[] = ['facts', 'issue', 'held', 'ratio'];
export const FIELD_LABEL: Record<Field, string> = { facts: 'Facts', issue: 'Issue', held: 'Held', ratio: 'Ratio' };

// Words that end in a full stop without ending a sentence (case names, citations, judges, Latin).
const ABBREV = new Set([
  'v', 'vs', 'cf', 'eg', 'ie', 'etc', 'al', 'no', 'nos', 'co', 'ltd', 'pty', 'inc', 'st', 'mr', 'mrs', 'ms', 'dr', 'prof', 'hon',
  'art', 'arts', 's', 'ss', 'para', 'paras', 'p', 'pp', 'ch', 'cl', 'reg', 'ed', 'eds', 'vol', 'j', 'jj', 'cj', 'lj', 'ljj', 'sch',
  'pt', 'div', 'approx', 'viz', 'ibid', 'op', 'cit', 'jan', 'feb', 'mar', 'apr', 'jun', 'jul', 'aug', 'sep', 'sept', 'oct', 'nov', 'dec',
]);
const MIN_WORDS = 4;
const wordCount = (s: string) => s.split(/\s+/).filter(Boolean).length;

/** Sentences of a passage. Never splits inside brackets or double quotes, after an abbreviation or initial
 *  ("Mason J.", "H.L.A. Hart", "e.g."), at an ellipsis or a decimal; fragments under four words join a neighbour. */
export function splitSentences(text: string): string[] {
  const t = text.replace(/\s+/g, ' ').trim();
  if (!t) return [];
  const parts: string[] = [];
  let start = 0, depth = 0, quoted = false;
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (c === '(' || c === '[') depth++;
    else if ((c === ')' || c === ']') && depth > 0) depth--;
    else if (c === '"') quoted = !quoted;
    else if (c === '“') quoted = true;
    else if (c === '”') quoted = false;
    if (c !== '.' && c !== '?' && c !== '!') continue;
    if (c === '.' && (t[i + 1] === '.' || t[i - 1] === '.')) continue; // ellipsis
    let j = i + 1;
    while (j < t.length && /["'”’)\]]/.test(t[j])) {
      if (t[j] === '"') quoted = !quoted;
      else if (t[j] === '”') quoted = false;
      else if ((t[j] === ')' || t[j] === ']') && depth > 0) depth--;
      j++;
    }
    i = j - 1;
    if (t[j] !== ' ' || !/^["“‘'(]?[A-Z]/.test(t.slice(j + 1, j + 3))) continue;
    if (quoted || depth > 0) continue;
    if (c === '.') {
      const token = (t.slice(start, i + 1).match(/(\S+)$/)?.[1] ?? '').replace(/^[("“‘'[]+/, '').replace(/["'”’)\]]+$/, '').replace(/\.$/, '');
      if (/^[A-Za-z.]+$/.test(token) && (ABBREV.has(token.replace(/\./g, '').toLowerCase()) || /^(?:[A-Z]\.)*[A-Z]$/.test(token))) continue;
    }
    parts.push(t.slice(start, j).trim());
    start = j + 1;
  }
  if (start < t.length) parts.push(t.slice(start).trim());
  const out: string[] = [];
  for (const p of parts.filter(Boolean)) {
    if (out.length && wordCount(p) < MIN_WORDS) out[out.length - 1] += ` ${p}`;
    else out.push(p);
  }
  if (out.length > 1 && wordCount(out[0]) < MIN_WORDS) out.splice(0, 2, `${out[0]} ${out[1]}`);
  return out;
}

export interface CaseText { id: string; name: string; facts: string; issue: string; held: string; ratio: string }
export interface AnatomyItem { id: string; caseId: string; caseName: string; field: Field; text: string }

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

/** Every classifiable sentence of the cases. A sentence that recurs in two fields of one case is dropped (ambiguous). */
export function anatomyItems(cases: CaseText[], minWords = 5): AnatomyItem[] {
  const out: AnatomyItem[] = [];
  for (const k of cases) {
    const per = FIELDS.map((f) => ({ f, ss: splitSentences(k[f] ?? '') }));
    const seen = new Map<string, Set<Field>>();
    for (const { f, ss } of per) for (const s of ss) seen.set(norm(s), new Set([...(seen.get(norm(s)) ?? []), f]));
    for (const { f, ss } of per) {
      ss.forEach((text, i) => {
        if (wordCount(text) < minWords || seen.get(norm(text))!.size > 1) return;
        out.push({ id: `${k.id}:${f}:${i}`, caseId: k.id, caseName: k.name, field: f, text });
      });
    }
  }
  return out;
}

/** A round of n sentences: fields taken in turn (so each appears ⌊n/4⌋ or ⌈n/4⌉ times), one sentence per case while
 *  cases last, then shuffled so the order gives nothing away. Seeded, so a round never reshuffles under the learner. */
export function buildRound(items: AnatomyItem[], n = 10, seed = 1): AnatomyItem[] {
  const rand = rng(seed);
  const pools = new Map(FIELDS.map((f) => [f, shuffle(items.filter((x) => x.field === f), rand)]));
  const order = shuffle(FIELDS, rand);
  const picked: AnatomyItem[] = [];
  const used = new Set<string>();
  for (const strict of [true, false]) {
    let moved = true;
    while (picked.length < n && moved) {
      moved = false;
      for (const f of order) {
        if (picked.length >= n) break;
        const pool = pools.get(f)!;
        const k = pool.findIndex((x) => !strict || !used.has(x.caseId));
        if (k < 0) continue;
        const [x] = pool.splice(k, 1);
        picked.push(x);
        used.add(x.caseId);
        moved = true;
      }
    }
  }
  return shuffle(picked, rand);
}

export interface AnatomyAnswer { field: Field; chosen: Field }
export interface AnatomyTally { right: number; total: number; byField: Record<Field, { right: number; total: number }>; confusion: { field: Field; chosen: Field; times: number } | null }

/** Running tally, per field, and the most frequent mix-up (e.g. ratio read as held). */
export function tallyAnatomy(answers: AnatomyAnswer[]): AnatomyTally {
  const byField = Object.fromEntries(FIELDS.map((f) => [f, { right: 0, total: 0 }])) as AnatomyTally['byField'];
  const mix = new Map<string, number>();
  for (const a of answers) {
    byField[a.field].total++;
    if (a.chosen === a.field) byField[a.field].right++;
    else mix.set(`${a.field}>${a.chosen}`, (mix.get(`${a.field}>${a.chosen}`) ?? 0) + 1);
  }
  let confusion: AnatomyTally['confusion'] = null;
  for (const [k, times] of mix) {
    if (!confusion || times > confusion.times) { const [field, chosen] = k.split('>') as Field[]; confusion = { field, chosen, times }; }
  }
  return { right: answers.filter((a) => a.chosen === a.field).length, total: answers.length, byField, confusion };
}

// ---------------------------------------------------------------------------------------------------------------
// Fact comparison (a word-overlap aid, not legal analysis)
// ---------------------------------------------------------------------------------------------------------------

/** The stem of one word, as src/lib/aids.ts `stems` normalises it; null for short and stop words. */
export function stemOf(word: string): string | null {
  const s = [...stems(word)];
  return s.length === 1 ? s[0] : null;
}

export interface Token { text: string; stem: string | null }
/** Words and the text between them, each word with its stem (for highlighting shared terms in place). */
export function tokenize(text: string): Token[] {
  return text.split(/([A-Za-z0-9’']+)/).filter(Boolean).map((t) => ({ text: t, stem: /^[A-Za-z0-9’']+$/.test(t) ? stemOf(t) : null }));
}

// Words too common in fact patterns to suggest a similarity (in addition to aids.ts's own stop words).
const COMMON = [
  'without', 'within', 'another', 'against', 'again', 'still', 'very', 'just', 'even', 'upon', 'those', 'these', 'each', 'every',
  'himself', 'herself', 'themselves', 'itself', 'said', 'says', 'made', 'make', 'took', 'take', 'went', 'came', 'come', 'while',
  'during', 'having', 'onto', 'towards', 'whose', 'will', 'shall', 'must', 'might', 'your', 'here', 'over', 'both', 'either',
  'once', 'until', 'away', 'back', 'down', 'much', 'many', 'several', 'same', 'time', 'later', 'other', 'there', 'know', 'known',
];
const COMMON_STEMS = new Set(COMMON.map(stemOf).filter((x): x is string => !!x));
const keyStems = (text: string) => new Set([...stems(text)].filter((x) => !COMMON_STEMS.has(x)));

export interface FactOverlap {
  /** Stems found on both sides, in the order they first appear in the problem, with the problem's word for each. */
  shared: { stem: string; word: string }[];
  /** Problem facts (indices) that share no stem with the case's facts. */
  problemOnly: number[];
  /** Case-fact sentences (indices) that share no stem with the problem's facts. */
  caseOnly: number[];
}

export function compareFacts(problem: string[], kase: string[]): FactOverlap {
  const p = problem.map(keyStems);
  const c = kase.map(keyStems);
  const allP = new Set(p.flatMap((s) => [...s]));
  const allC = new Set(c.flatMap((s) => [...s]));
  const shared: FactOverlap['shared'] = [];
  const seen = new Set<string>();
  for (const fact of problem) {
    for (const tk of tokenize(fact)) {
      if (tk.stem && allC.has(tk.stem) && !seen.has(tk.stem)) { seen.add(tk.stem); shared.push({ stem: tk.stem, word: tk.text.toLowerCase() }); }
    }
  }
  const none = (s: Set<string>, other: Set<string>) => ![...s].some((x) => other.has(x));
  return {
    shared,
    problemOnly: p.flatMap((s, i) => (none(s, allC) ? [i] : [])),
    caseOnly: c.flatMap((s, i) => (none(s, allP) ? [i] : [])),
  };
}

// ---------------------------------------------------------------------------------------------------------------
// Argument adversary
// ---------------------------------------------------------------------------------------------------------------

export type Stance = 'defend' | 'attack';
export interface ArgueItem {
  id: string;
  concept: string;
  week: string;
  index: number;
  /** How many objections this concept has (for "1 of 2"). */
  of: number;
  position: string;
  evidence: string;
  objection: string;
  reply?: string;
  verify: boolean;
  sources: string[];
}

/** Attempt id for one objection of a concept. */
export const argueId = (concept: string, index: number) => `argue:${concept}:${index}`;
export const ARGUE_SCORE: Record<SelfRating, number> = SELF_SCORE;

/** Every position with an objection, in the order the given concept ids list (falling back to week, then id). */
export function argueItems(aids: Record<string, Aid>, order: string[] = []): ArgueItem[] {
  const rank = new Map(order.map((id, i) => [id, i]));
  return Object.values(aids)
    .filter((a) => a.objections?.length)
    .sort((a, b) => (rank.get(a.concept) ?? 1e9) - (rank.get(b.concept) ?? 1e9) || a.week.localeCompare(b.week) || a.concept.localeCompare(b.concept))
    .flatMap((a) => a.objections.map((o, index) => ({
      id: argueId(a.concept, index), concept: a.concept, week: a.week, index, of: a.objections.length,
      position: o.position, evidence: o.evidence, objection: o.objection, reply: o.reply, verify: !!a.verify, sources: a.sources ?? [],
    })));
}

/** The latest self-rating score per argue item (attempts in any order). */
export function lastArgued(attempts: { questionId: string; at: number; score?: number }[]): Map<string, number> {
  const out = new Map<string, { at: number; score: number }>();
  for (const a of attempts) {
    if (!a.questionId.startsWith('argue:')) continue;
    const prev = out.get(a.questionId);
    if (!prev || a.at > prev.at) out.set(a.questionId, { at: a.at, score: a.score ?? 0 });
  }
  return new Map([...out].map(([k, v]) => [k, v.score]));
}
