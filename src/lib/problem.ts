// Pure logic for working a problem question's facts before writing (features 157, 38, 44, 81, 82, 85, 86, 89):
// locating each annotated excerpt inside the prompt, cutting the prompt into paragraphs of plain and fact pieces,
// scoring the fact-by-fact spotting round, grouping facts by issue, finding each issue's requirements from its
// concept's study-aid elements, and the element-and-evidence board's placements. No DOM, no Dexie, no astro:content.
import type { Element, Fact } from './aids';

export type Weight = 'essential' | 'background';
export interface Issue { id: string; label: string; concept?: string }
export interface Party { name: string; role: string }

// ---------- Locating excerpts ----------

/** Lower-cased, quote- and dash-folded, whitespace-collapsed text, with each character's index in the original. */
export function fold(text: string): { s: string; map: number[] } {
  let s = '';
  const map: number[] = [];
  let space = false;
  for (let i = 0; i < text.length; i++) {
    let c = text[i];
    if (/\s/.test(c)) {
      if (space) continue;
      space = true;
      s += ' ';
      map.push(i);
      continue;
    }
    space = false;
    if (c === '‘' || c === '’' || c === '`') c = "'";
    else if (c === '“' || c === '”') c = '"';
    else if (c === '–' || c === '—') c = '-';
    s += c.toLowerCase();
    map.push(i);
  }
  return { s, map };
}

export interface Located { start: number; end: number }

/** Where each fact sits in the prompt ([start, end) in the original text; -1 when it cannot be found). Facts are
 *  searched in file order from the end of the previous match, so repeated phrases resolve to the right occurrence;
 *  a fact is never placed over another. Tolerates whitespace, quote and dash differences, and stray end punctuation. */
export function locateFacts(prompt: string, facts: { text: string }[]): Located[] {
  const { s, map } = fold(prompt);
  const taken: [number, number][] = [];
  const free = (a: number, b: number) => taken.every(([x, y]) => b <= x || a >= y);
  let cursor = 0;
  return facts.map((f) => {
    const tries = [fold(f.text).s.trim()];
    const bare = tries[0].replace(/^["'(\s]+|["'.,;:!?)\s]+$/g, '');
    if (bare && bare !== tries[0]) tries.push(bare);
    for (const needle of tries) {
      if (!needle) continue;
      for (const from of [cursor, 0]) {
        let i = s.indexOf(needle, from);
        while (i >= 0 && !free(i, i + needle.length)) i = s.indexOf(needle, i + 1);
        if (i >= 0) {
          taken.push([i, i + needle.length]);
          cursor = i + needle.length;
          return { start: map[i], end: map[i + needle.length - 1] + 1 };
        }
      }
    }
    return { start: -1, end: -1 };
  });
}

/** Fact indices in the order they appear in the prompt; facts that could not be found follow, in file order. */
export function promptOrder(located: Located[]): number[] {
  const idx = located.map((_, i) => i);
  const found = idx.filter((i) => located[i].start >= 0).sort((a, b) => located[a].start - located[b].start);
  return [...found, ...idx.filter((i) => located[i].start < 0)];
}

export interface Piece { text: string; fact: number | null }

/** The prompt as paragraphs of pieces: plain text, or (part of) an annotated fact. Paragraphs break at blank lines. */
export function segment(prompt: string, located: Located[]): Piece[][] {
  const paras: [number, number][] = [];
  const re = /\n[ \t]*\n\s*/g;
  let at = 0;
  for (let m = re.exec(prompt); m; m = re.exec(prompt)) {
    paras.push([at, m.index]);
    at = m.index + m[0].length;
  }
  paras.push([at, prompt.length]);
  const ranges = located.map((r, i) => ({ ...r, i })).filter((r) => r.start >= 0).sort((a, b) => a.start - b.start);
  const out: Piece[][] = [];
  for (const [ps, pe0] of paras) {
    const pe = ps + prompt.slice(ps, pe0).trimEnd().length;
    if (pe <= ps) continue;
    const pieces: Piece[] = [];
    let pos = ps;
    for (const r of ranges) {
      if (r.end <= ps || r.start >= pe) continue;
      const a = Math.max(r.start, ps), b = Math.min(r.end, pe);
      if (a > pos) pieces.push({ text: prompt.slice(pos, a), fact: null });
      if (b > Math.max(a, pos)) pieces.push({ text: prompt.slice(Math.max(a, pos), b), fact: r.i });
      pos = Math.max(pos, b);
    }
    if (pos < pe) pieces.push({ text: prompt.slice(pos, pe), fact: null });
    out.push(pieces);
  }
  return out;
}

/** First sentence of a prompt (index lists), never cut at an abbreviation such as "Pty Ltd." or "s." */
export function firstSentence(text: string): string {
  const t = text.replace(/\s+/g, ' ').trim();
  const re = /[.?!]["'”’)]?(?=\s+["'“‘(]?[A-Z]|$)/g;
  for (let m = re.exec(t); m; m = re.exec(t)) {
    const before = t.slice(0, m.index).split(' ').pop() ?? '';
    if (/^(Mr|Mrs|Ms|Dr|St|Pty|Co|No|s|ss|v|cf|eg|ie|[A-Z])$/i.test(before) && m.index < t.length - 1) continue;
    return t.slice(0, m.index + m[0].length);
  }
  return t;
}

// ---------- Spotting round ----------

export interface SpotAnswer { weight: Weight; issues: string[] }
export interface FactResult { weightOk: boolean; hits: string[]; missed: string[]; extra: string[] }

/** One fact's feedback: the weight against the annotation, and the issue tags found, missed and added. Issue ids the
 *  question does not list (when `known` is given) are ignored on both sides. */
export function scoreFact(fact: Pick<Fact, 'weight' | 'issues'>, a: SpotAnswer, known?: Set<string>): FactResult {
  const keep = (id: string) => !known || known.has(id);
  const want = new Set(fact.issues.filter(keep));
  const got = new Set(a.issues.filter(keep));
  return {
    weightOk: a.weight === fact.weight,
    hits: [...want].filter((i) => got.has(i)),
    missed: [...want].filter((i) => !got.has(i)),
    extra: [...got].filter((i) => !want.has(i)),
  };
}

export interface RoundScore {
  done: number; total: number; matched: number;
  essentialFound: number; essentialTotal: number;
  issueHits: number; issueTotal: number; issueExtra: number;
}

/** Running score over the facts answered so far (`answers[i]` belongs to `facts[i]`; unanswered entries are skipped). */
export function scoreRound(facts: Pick<Fact, 'weight' | 'issues'>[], answers: (SpotAnswer | undefined | null)[], known?: Set<string>): RoundScore {
  const s: RoundScore = { done: 0, total: facts.length, matched: 0, essentialFound: 0, essentialTotal: 0, issueHits: 0, issueTotal: 0, issueExtra: 0 };
  facts.forEach((f, i) => {
    const a = answers[i];
    if (!a) return;
    const r = scoreFact(f, a, known);
    s.done++;
    if (r.weightOk) s.matched++;
    if (f.weight === 'essential') { s.essentialTotal++; if (a.weight === 'essential') s.essentialFound++; }
    s.issueHits += r.hits.length;
    s.issueTotal += r.hits.length + r.missed.length;
    s.issueExtra += r.extra.length;
  });
  return s;
}

/** "8 of 14 facts · 6 matched" */
export const tally = (s: Pick<RoundScore, 'done' | 'total' | 'matched'>) => `${s.done} of ${s.total} ${s.total === 1 ? 'fact' : 'facts'} · ${s.matched} matched`;

// ---------- Grouping, requirements, board ----------

/** Each issue (answer order) with the facts tagged to it, in prompt order. */
export function factsByIssue(issues: Issue[], facts: Pick<Fact, 'issues'>[], order: number[] = facts.map((_, i) => i)): { issue: Issue; facts: number[] }[] {
  return issues.map((issue) => ({ issue, facts: order.filter((i) => facts[i]?.issues.includes(issue.id)) }));
}

export interface Requirement { key: string; name: string; test?: string; cases: string[]; authorities: string[] }

const STOP = new Set(['the', 'and', 'for', 'with', 'that', 'this', 'from', 'was', 'were', 'are', 'did', 'does', 'any', 'all', 'its', 'not', 'but', 'out', 'who', 'how', 'what', 'when', 'into', 'than', 'then', 'them', 'they', 'each', 'two', 'has', 'have', 'had', 'whether', 'only', 'other', 'more', 'such', 'under', 'including']);

/** Weighted terms for matching an issue label to an element: section numbers (≤ 3 digits) weigh 3, words 1. */
export function terms(text: string): Map<string, number> {
  const out = new Map<string, number>();
  const words = text.toLowerCase().replace(/[’']/g, '').replace(/\bss?(\d)/g, ' $1').split(/[^a-z0-9]+/);
  for (let w of words) {
    if (!w) continue;
    if (/^\d+$/.test(w)) { out.set(w, w.length <= 3 ? 3 : 1); continue; }
    if (w.length < 3 || STOP.has(w)) continue;
    if (w.length > 4 && w.endsWith('s') && !w.endsWith('ss')) w = w.slice(0, -1);
    out.set(w, 1);
  }
  return out;
}

function affinity(label: string, e: Element): number {
  const t = terms(`${e.name} ${e.test} ${e.cases.join(' ')} ${e.authorities.join(' ')}`);
  let n = 0;
  for (const [w, wt] of terms(label)) if (t.has(w)) n += wt;
  return n;
}

/** A later issue takes a shared concept's element only on a clear match (a section number, a case, or two words). */
export const CLEAR_MATCH = 2;

/** Requirement rows per issue. An issue whose concept has study-aid elements gets those elements (name + test). When
 *  several issues share one concept, the first of them (answer order) states the whole test, and each later one
 *  takes only the elements its label clearly names (e.g. "The stool strike: proportionality (Fontin v Katapodis)" →
 *  the proportionality element), so no issue is given a requirement that is not its own. An issue left with no
 *  elements gets a single row: the issue itself. */
export function requirementsFor(issues: Issue[], elementsByConcept: Record<string, Element[] | undefined>): Record<string, Requirement[]> {
  const out: Record<string, Requirement[]> = {};
  const row = (issue: Issue, e: Element, i: number): Requirement => ({ key: `${issue.id}:e${i}`, name: e.name, test: e.test, cases: e.cases, authorities: e.authorities });
  const seen = new Set<string>();
  for (const issue of issues) {
    const els = issue.concept ? elementsByConcept[issue.concept] : undefined;
    if (!issue.concept || !els?.length) continue;
    const first = !seen.has(issue.concept);
    seen.add(issue.concept);
    const rows = els.map((e, i) => (first || affinity(issue.label, e) >= CLEAR_MATCH ? row(issue, e, i) : null)).filter((r): r is Requirement => r !== null);
    if (rows.length) out[issue.id] = rows;
  }
  for (const issue of issues) out[issue.id] ??= [{ key: `${issue.id}:issue`, name: issue.label, cases: [], authorities: [] }];
  return out;
}

export interface Column { issue: Issue; requirements: Requirement[]; facts: number[] }

export const cardKey = (issueId: string, fact: number) => `${issueId}#${fact}`;
export const cardIssue = (key: string) => key.slice(0, key.lastIndexOf('#'));
export const cardFact = (key: string) => Number(key.slice(key.lastIndexOf('#') + 1));

/** Board columns: issues in answer order, each with its requirement rows and its tagged facts (prompt order). */
export function buildBoard(issues: Issue[], facts: Pick<Fact, 'issues'>[], order: number[], reqs: Record<string, Requirement[]>): Column[] {
  return factsByIssue(issues, facts, order).map(({ issue, facts: f }) => ({ issue, requirements: reqs[issue.id] ?? [], facts: f }));
}

/** Placements: fact card → requirement row. Cards not listed sit in their issue's tray. */
export interface BoardState { placed: Record<string, string> }

/** Drops placements whose card or row no longer exists, or whose row belongs to another issue (content changed). */
export function cleanBoard(raw: unknown, columns: Column[]): BoardState {
  const placed: Record<string, string> = {};
  const p = (raw && typeof raw === 'object' && 'placed' in raw ? (raw as BoardState).placed : null) ?? {};
  for (const col of columns) {
    const rows = new Set(col.requirements.map((r) => r.key));
    for (const f of col.facts) {
      const k = cardKey(col.issue.id, f);
      const r = p[k];
      if (typeof r === 'string' && rows.has(r)) placed[k] = r;
    }
  }
  return { placed };
}

/** Moves a card onto a row of its own issue (or back to the tray with `row = null`). Rows of other issues are refused. */
export function place(state: BoardState, card: string, row: string | null): BoardState {
  const placed = { ...state.placed };
  if (row === null) delete placed[card];
  else if (row.startsWith(`${cardIssue(card)}:`)) placed[card] = row;
  else return state;
  return { placed };
}

/** Fact indices supporting each row, and each column's unplaced facts (both in prompt order). */
export function supportOf(columns: Column[], state: BoardState): { rows: Record<string, number[]>; tray: Record<string, number[]> } {
  const rows: Record<string, number[]> = {};
  const tray: Record<string, number[]> = {};
  for (const col of columns) {
    tray[col.issue.id] = [];
    for (const r of col.requirements) rows[r.key] = [];
    for (const f of col.facts) {
      const at = state.placed[cardKey(col.issue.id, f)];
      if (at && rows[at]) rows[at].push(f);
      else tray[col.issue.id].push(f);
    }
  }
  return { rows, tray };
}

// ---------- Parties, timing, routes ----------

const TITLES = new Set(['mr', 'mrs', 'ms', 'dr', 'the', 'pty', 'ltd', 'inc', 'and', 'of']);

/** Whether a passage mentions a party: the full name, or any distinctive capitalised word of it, as a whole word. */
export function mentions(text: string, name: string): boolean {
  const esc = (w: string) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  if (new RegExp(`(^|[^\\p{L}])${esc(name)}($|[^\\p{L}])`, 'iu').test(text)) return true;
  return name
    .split(/\s+/)
    .filter((w) => w.length >= 3 && /^\p{Lu}/u.test(w) && !TITLES.has(w.toLowerCase().replace(/\.$/, '')))
    .some((w) => new RegExp(`(^|[^\\p{L}])${esc(w)}(['’]s)?($|[^\\p{L}])`, 'u').test(text));
}

/** URL slug for a problem page: the question id without its unit prefix (laws2400-w00-q001 → w00-q001). */
export const problemSlug = (unit: string, questionId: string) => (questionId.startsWith(`${unit}-`) ? questionId.slice(unit.length + 1) : questionId);
export const problemHref = (unit: string, questionId: string) => `/${unit}/problem/${problemSlug(unit, questionId)}/`;
