// IRAC self-check (feature 159): pure heuristics over a written problem answer, shown with the marking step as a
// prompt to look again (never a mark). Four checks:
//   Issue        — which rubric rows the answer's words overlap (stems/overlap from aids.ts, rubric verbs ignored);
//   Rule         — rule statements, and whether each carries an authority (a case name, "X v Y", a section or article);
//   Application  — essential facts from the problem-fact annotation that the answer never mentions;
//   Conclusion   — the answer split into issue segments; does each segment reach a conclusion?
import { stems } from './aids';

export interface IracRow { id: string; criterion: string; 'top-band'?: string }
export interface IracIssue { id: string; label: string }
export interface IracFact { text: string; weight: 'essential' | 'background' }

export interface IracInput {
  text: string;
  rubric: IracRow[];
  /** Case names the unit knows (bank.cases[].name, de-slugged question cases). */
  caseNames?: string[];
  /** Problem facts (aids facts[q.id].facts); the application check is skipped when absent. */
  facts?: IracFact[];
  /** Issues from the problem-fact annotation; rubric rows stand in when absent. */
  issues?: IracIssue[];
  /** Party names: left out of fact matching (every fact names them). */
  parties?: string[];
}

export interface IracReport {
  issues: { id: string; label: string; addressed: boolean }[];
  rules: { sentence: string; authority: string | null }[];
  facts: { checked: boolean; missed: string[] };
  conclusions: { id: string; label: string; concluded: boolean }[];
}

// Words that say what a marker wants rather than what the answer is about.
const GENERIC = stems(
  'identify identifies identified identifying state states stated stating explain explains explained explaining apply applies applied applying ' +
    'discuss discusses discussed discussing conclude concludes concluded concluding consider considers considered considering weigh weighs weighed ' +
    'weighing analyse analyses analysed analysing analyze evaluate evaluates evaluated outline outlines outlined recognise recognises recognised ' +
    'recognize address addresses addressed refer refers referred cite cites cited correctly accurately clearly relevant relevantly appropriate ' +
    'appropriately demonstrate demonstrates uses using reach reaches reasoned reasoning support supports supported answer issue issues rule rules ' +
    'application conclusion conclusions facts plaintiff defendant whether each',
);

/** Content stems of a phrase, minus marker vocabulary (and any extra stems to ignore). */
export function contentStems(phrase: string, ignore: Set<string> = new Set()): Set<string> {
  return new Set([...stems(phrase)].filter((w) => !GENERIC.has(w) && !ignore.has(w)));
}

const share = (want: Set<string>, have: Set<string>) => {
  if (!want.size) return 0;
  let hit = 0;
  for (const w of want) if (have.has(w)) hit++;
  return hit / want.size;
};

/** Sentences, paragraph by paragraph; citations ("s 5B(2)", "v.", "art. 2") never split a sentence. */
export function splitSentences(text: string): string[] {
  return text
    .split(/\n+/)
    .flatMap((line) => line.trim().split(/(?<!\b(?:v|vs|s|ss|art|arts|cf|eg|ie|e\.g|i\.e|No|para|paras|Co|Ltd|Pty|J|CJ|JJ|[A-Z])\.)(?<=[.!?])\s+(?=[A-Z(“"‘'])/))
    .map((s) => s.trim())
    .filter(Boolean);
}

const PARTY_SKIP = /^(?:R|The Queen|Regina|The King|Rex|New South Wales|NSW|The Commonwealth|Commonwealth|Australia|State of .+|Attorney[- ]General.*|Minister.*|Council|The State)$/;
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const AUTHORITY_PATTERNS: RegExp[] = [
  // Statute sections: s 5B, s5B(2)(a), ss 5B–5C, section 5D
  /\b(?:ss?|sections?)\.?\s?\d+[A-Z]{0,2}(?:\(\d+[A-Za-z]?\))*(?:\([a-z]{1,4}\))*(?:\s?[–-]\s?\d+[A-Z]{0,2})?/,
  // Treaty articles: art 2(4), arts 31–32, Article 51
  /\b(?:arts?|[Aa]rticles?)\.?\s?\d+(?:\(\d+\))*(?:\([a-z]{1,4}\))*/,
  /\b(?:regs?|[Rr]egulations?)\.?\s?\d+/,
  // Named instruments: Civil Liability Act 2002 (NSW), the UN Charter, Vienna Convention, CLA / ACL
  /\b(?:[A-Z][\w'’-]*\s)+(?:Act|Charter|Convention|Covenant|Treaty|Protocol|Statute)\b(?:\s\d{4})?/,
  /\b(?:CLA|ACL|VCLT|ICJ Statute|UNCLOS|ICCPR|ICESCR)\b/,
  // Case names: Wyong Shire Council v Shirt, R v Smith, Re Polemis
  /\b[A-Z][\w'’&.-]*(?:\s+(?:[A-Z][\w'’&.-]*|of|and|&|the|for|de))*\s+v\.?\s+[A-Z][\w'’&-]*(?:\s+[A-Z][\w'’&-]*)*/,
  /\bRe\s+[A-Z][\w'’-]+/,
  // Report citations: (1980) 146 CLR 40, [1932] AC 562
  /[([]\d{4}[)\]]\s+\d*\s*[A-Z][A-Za-z]*\s+\d+/,
];

interface CaseMatcher { full: string; lower: string; short: RegExp[] }
const compiled = new WeakMap<string[], CaseMatcher[]>();
function caseMatchers(caseNames: string[]): CaseMatcher[] {
  let m = compiled.get(caseNames);
  if (m) return m;
  m = caseNames
    .map((n) => n.trim())
    .filter(Boolean)
    .map((full) => {
      // Short forms ("Shirt", "Wyong Shire Council", "Amaca"): capitalised whole words, only for properly cased names.
      const short: RegExp[] = [];
      if (full !== full.toLowerCase()) {
        const [first, second] = full.split(/\s+v\.?\s+/);
        for (const [part, min] of [[first, 4], [second, 5]] as const) {
          const p = part?.replace(/\s+(?:Pty\s+)?(?:Ltd|Limited|Inc|plc)\.?$/, '').trim();
          if (p && p.length >= min && !PARTY_SKIP.test(p)) short.push(new RegExp(`(?:^|[^\\w])${escape(p)}(?![\\w])`));
        }
      }
      return { full, lower: full.toLowerCase(), short };
    });
  compiled.set(caseNames, m);
  return m;
}

/** Authorities named in a piece of text (known case names first, then any generic citation pattern). */
export function findAuthorities(text: string, caseNames: string[] = []): string[] {
  const found: string[] = [];
  const lower = text.toLowerCase();
  for (const c of caseMatchers(caseNames)) if (lower.includes(c.lower) || c.short.some((re) => re.test(text))) found.push(c.full);
  for (const re of AUTHORITY_PATTERNS) {
    const m = text.match(re);
    if (m) found.push(m[0].replace(/^(?:In|As in|See|Following|Per|Under|Applying)\s+/, '').trim());
  }
  return [...new Set(found)];
}

const RULE_HEADING = /^(?:law|rules?|the law|legal (?:rule|principle)s?)\s*(?:[:—–-]|$)/i;
const OTHER_HEADING = /^(?:issues?|application|apply|analysis|conclusion|facts?)\s*(?:[:—–-]|$)/i;
const BARE_HEADING = /^(?:issues?|law|rules?|the law|application|analysis|conclusion|facts?)\s*[:—–-]?\s*$/i;
const RULE_CUE =
  /\b(?:test|rules?|principles?|elements?|requires?|required|requirement|established|held|holds|provides?|pursuant to|according to|the law|standard of care|threshold|owes? (?:a|the) duty|duty of care (?:is|arises)|(?:is|are) (?:not )?liable (?:if|where|when|unless)|a (?:person|defendant|plaintiff|state|court|party) (?:must|need|is not|will))\b/i;
const CONCLUSION_HEADING = /^(?:conclusion|in conclusion|overall)\s*[:—–-]?/i;
const CONCLUSION_CUE =
  /\b(?:therefore|thus|accordingly|hence|consequently|in conclusion|to conclude|it follows|likely|unlikely|probably|will (?:likely |probably )?(?:be|succeed|fail|have|not)|would (?:likely |probably )?(?:be|succeed|fail|not)|(?:is|are) (?:liable|entitled|responsible|made out|satisfied|met|established)|succeeds?|fails?|can(?:not|'t)? (?:recover|sue|claim|rely)|(?:has|have) (?:been )?breached)\b/i;

/** Rule statements (law/rule-headed sentences, rule cues, or anything citing an authority) and their authority.
 *  A cue-only sentence that names a party is application, not a rule statement. */
export function ruleStatements(text: string, caseNames: string[] = [], parties: string[] = []): IracReport['rules'] {
  const all: { s: string; law: boolean }[] = [];
  let inLaw = false;
  for (const line of text.split(/\n+/)) {
    const t = line.trim();
    if (!t) continue;
    if (OTHER_HEADING.test(t)) inLaw = false;
    if (RULE_HEADING.test(t)) inLaw = true;
    if (BARE_HEADING.test(t)) continue;
    for (const s of splitSentences(t)) all.push({ s, law: inLaw });
  }
  const party = parties.filter((p) => p.trim().length > 1).map((p) => new RegExp(`(?:^|[^\\w])${escape(p.trim())}(?![\\w])`));
  const out: IracReport['rules'] = [];
  all.forEach(({ s, law }, i) => {
    const own = findAuthorities(s, caseNames);
    if (!own.length && !law && (!RULE_CUE.test(s) || party.some((re) => re.test(s)))) return;
    // A rule stated in one sentence and cited in the next still carries its authority.
    const next = !own.length && all[i + 1] ? findAuthorities(all[i + 1].s, caseNames) : [];
    out.push({ sentence: s.replace(RULE_HEADING, '').trim(), authority: own[0] ?? next[0] ?? null });
  });
  return out;
}

/** Split the answer into issue segments: each sentence goes to the issue it best matches, else the current one. */
export function segmentByIssue(text: string, issues: IracIssue[]): Map<string, string[]> {
  const keys = issues.map((i) => ({ id: i.id, want: contentStems(i.label) }));
  const seg = new Map<string, string[]>(issues.map((i) => [i.id, []]));
  let current: string | null = null;
  for (const s of splitSentences(text)) {
    if (BARE_HEADING.test(s)) continue;
    const have = stems(s);
    let best: { id: string; score: number } | null = null;
    for (const k of keys) {
      const score = share(k.want, have);
      if (score >= 0.25 && (!best || score > best.score || (score === best.score && k.id === current))) best = { id: k.id, score };
    }
    if (best) current = best.id;
    if (current) seg.get(current)!.push(s);
  }
  return seg;
}

export function iracCheck({ text, rubric, caseNames = [], facts, issues, parties = [] }: IracInput): IracReport {
  const have = stems(text);
  const addressed = rubric.map((r) => {
    const crit = contentStems(r.criterion);
    const top = contentStems(r['top-band'] ?? '');
    // Nothing to match on (a criterion made only of marker words): not judged, so not flagged.
    const judged = crit.size > 0 || top.size > 0;
    return { id: r.id, label: r.criterion, addressed: !judged || share(crit, have) >= 0.5 || share(top, have) >= 0.5 };
  });

  const partyStems = new Set(parties.flatMap((p) => [...stems(p)]));
  const essential = (facts ?? []).filter((f) => f.weight === 'essential');
  const missed = essential
    .filter((f) => {
      const want = contentStems(f.text, partyStems);
      return want.size > 0 && share(want, have) < 0.4;
    })
    .map((f) => f.text);

  const issueList: IracIssue[] = issues?.length ? issues : rubric.map((r) => ({ id: r.id, label: r.criterion }));
  const seg = segmentByIssue(text, issueList);
  const conclusions = issueList
    .filter((i) => seg.get(i.id)!.length)
    .map((i) => ({
      id: i.id,
      label: i.label,
      concluded: seg.get(i.id)!.some((s) => CONCLUSION_CUE.test(s) || CONCLUSION_HEADING.test(s)),
    }));

  return {
    issues: addressed,
    rules: ruleStatements(text, caseNames, parties),
    facts: { checked: !!facts?.length && essential.length > 0, missed },
    conclusions,
  };
}

/** "wyong-shire-council-v-shirt" → "wyong shire council v shirt" (matched case-insensitively as a full name). */
export const deslug = (id: string) => id.replace(/-/g, ' ');
