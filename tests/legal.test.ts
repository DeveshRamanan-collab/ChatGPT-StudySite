// Legal-reasoning tools (src/lib/legal.ts): the authority-title parser and numeric order (run over every real title),
// cross-references within an instrument, sentence splitting and case-anatomy rounds (run over the real cases), the
// fact-comparison word overlap, and the argument-adversary items.
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import {
  parseTitle, parseNum, romanToInt, compareSpans, findRefs, sameInstrument, instrumentNames, crossRefs, buildStatuteMap,
  isProvision, matchesQuery, splitSentences, anatomyItems, buildRound, tallyAnatomy, FIELDS, compareFacts, tokenize,
  argueItems, argueId, lastArgued, type AuthorityLike, type CaseText, type Field,
} from '../src/lib/legal';
import type { Aid } from '../src/lib/aids';

// js-yaml ships no type declarations; only load() is used.
const yaml = createRequire(import.meta.url)('js-yaml') as { load(src: string): unknown };
function read<T>(dir: string): (T & { id: string })[] {
  return readdirSync(dir).filter((f) => f.endsWith('.md')).map((f) => ({ id: f.replace(/\.md$/, ''), ...(yaml.load(readFileSync(`${dir}/${f}`, 'utf8').split(/^---$/m)[1]) as T) }));
}
type RawAuthority = { title: string; kind: string; units?: string[]; text?: string; gloss?: string; cases?: string[]; verify?: boolean; seed?: boolean };
type RawCase = CaseText & { units?: string[]; verify?: boolean; seed?: boolean };
const authorities = read<RawAuthority>('src/content/authorities');
const cases = read<RawCase>('src/content/cases');
const asLike = (a: RawAuthority & { id: string }): AuthorityLike => ({ id: a.id, title: a.title, kind: a.kind, units: a.units ?? [], text: a.text ?? '', gloss: a.gloss ?? '', cases: a.cases ?? [], verify: !!a.verify });
const map = buildStatuteMap(authorities.map(asLike));
const byTitle = (t: string) => map.flatMap((i) => i.provisions.map((p) => ({ i, p }))).find(({ p }) => p.title === t);
const labelsOf = (ids: string[], inst: string) => ids.map((id) => map.find((i) => i.name === inst)!.provisions.find((p) => p.id === id)!.label);

describe('parseTitle', () => {
  it.each([
    ['Civil Liability Act 2002 (NSW) s 5B', 'Civil Liability Act 2002 (NSW)', 's 5B', null],
    ['Civil Liability Act 2002 (NSW) ss 55–58', 'Civil Liability Act 2002 (NSW)', 'ss 55–58', null],
    ['Canadian Charter of Rights and Freedoms, s 1 (Guarantee of rights and freedoms)', 'Canadian Charter of Rights and Freedoms', 's 1', 'Guarantee of rights and freedoms'],
    ['Constitution of the Republic of South Africa, s 39(1)', 'Constitution of the Republic of South Africa', 's 39(1)', null],
    ['Law Enforcement (Powers and Responsibilities) Act 2002 (NSW) s 99(1)', 'Law Enforcement (Powers and Responsibilities) Act 2002 (NSW)', 's 99(1)', null],
    ['Police Administration Act 1978 (NT) s 126(2A)', 'Police Administration Act 1978 (NT)', 's 126(2A)', null],
    ['Criminal Code Act 1995 (Cth) div 268', 'Criminal Code Act 1995 (Cth)', 'div 268', null],
    ['Convention on the Privileges and Immunities of the United Nations 1946 art II ss 2–4', 'Convention on the Privileges and Immunities of the United Nations 1946', 'art II ss 2–4', null],
    ['UN Convention on Jurisdictional Immunities of States and their Property 2004 arts 11, 13–17', 'UN Convention on Jurisdictional Immunities of States and their Property 2004', 'arts 11, 13–17', null],
    ['UN Charter arts 55(c) and 56', 'UN Charter', 'arts 55(c) and 56', null],
    ['Geneva Convention (IV) art 146', 'Geneva Convention (IV)', 'art 146', null],
    ['European Convention on Human Rights, art 15 (Derogation in time of emergency)', 'European Convention on Human Rights', 'art 15', 'Derogation in time of emergency'],
    // Aliases group one instrument's names together.
    ['Charter of the United Nations art 51', 'UN Charter', 'art 51', null],
    ['VCLT art 2(1)(a)', 'Vienna Convention on the Law of Treaties 1969', 'art 2(1)(a)', null],
    ['International Law Commission Draft Articles on State Responsibility (2001) art 3', 'Articles on Responsibility of States for Internationally Wrongful Acts (2001)', 'art 3', null],
    // Whole instruments.
    ['Sex Discrimination Act 1984 (Cth)', 'Sex Discrimination Act 1984 (Cth)', null, null],
    ['Treaty of Paris 1928 (Kellogg-Briand Pact)', 'Treaty of Paris 1928 (Kellogg-Briand Pact)', null, null],
  ])('%s', (title, instrument, provision, heading) => {
    const p = parseTitle(title);
    expect(p.instrument).toBe(instrument);
    expect(p.provision).toBe(provision);
    expect(p.heading).toBe(heading);
    expect(p.spans.length > 0).toBe(provision !== null);
  });

  it('reads numbers, suffixes, paragraphs, ranges and roman numerals', () => {
    expect(parseNum('5B(1)(a)')).toEqual({ n: 5, suffix: 'B', sub: ['1', 'a'] });
    expect(parseNum('126(2A)')).toEqual({ n: 126, suffix: '', sub: ['2A'] });
    expect(parseNum('IX')).toEqual({ n: 9, suffix: '', sub: [] });
    expect([romanToInt('IV'), romanToInt('VI'), romanToInt('XII')]).toEqual([4, 6, 12]);
    expect(parseTitle('Civil Liability Act 2002 (NSW) ss 55–58').spans).toEqual([{ kind: 's', from: { n: 55, suffix: '', sub: [] }, to: { n: 58, suffix: '', sub: [] } }]);
    const cpiun = parseTitle('Convention on the Privileges and Immunities of the United Nations 1946 art II ss 2–4').spans;
    expect(cpiun.map((s) => [s.kind, s.from.n, s.to.n])).toEqual([['art', 2, 2], ['s', 2, 4]]);
    expect(parseTitle('Convention on the Prevention and Punishment of the Crime of Genocide arts I–III').spans.map((s) => [s.from.n, s.to.n])).toEqual([[1, 3]]);
    expect(parseTitle('UN Charter arts 5-6').spans.map((s) => [s.from.n, s.to.n])).toEqual([[5, 6]]);
  });

  it('every real statute and treaty title splits into an instrument and the provision it ends with', () => {
    const real = authorities.filter((a) => a.kind === 'statute' || a.kind === 'treaty');
    expect(real.length).toBeGreaterThan(100);
    for (const a of real) {
      const p = parseTitle(a.title);
      expect(p.instrument.length, a.title).toBeGreaterThan(3);
      if (p.provision) expect(a.title.replace(/\s+/g, ' ').endsWith(p.heading ? `${p.provision} (${p.heading})` : p.provision), a.title).toBe(true);
    }
  });

  it('journal articles are not provisions; Articles on State Responsibility are', () => {
    const articles = authorities.filter((a) => a.kind === 'article');
    const provisions = articles.filter((a) => isProvision(a.kind, parseTitle(a.title)));
    expect(provisions.length).toBeGreaterThan(20);
    for (const a of provisions) expect(a.title, a.title).toMatch(/\barts? [0-9IVX]/);
    for (const a of articles.filter((x) => /['‘’]|Review|\(\d{4}\),/.test(x.title) && !/\barts? \d/.test(x.title))) expect(isProvision(a.kind, parseTitle(a.title)), a.title).toBe(false);
    expect(isProvision('principle', parseTitle('Neighbour principle'))).toBe(false);
  });
});

describe('statutory map', () => {
  it('groups by instrument A–Z, each instrument in numeric order', () => {
    const names = map.map((i) => i.name);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b, 'en-AU')));
    expect(new Set(names).size).toBe(names.length);
    for (const i of map) {
      for (let k = 1; k < i.provisions.length; k++) {
        const [a, b] = [parseTitle(i.provisions[k - 1].title), parseTitle(i.provisions[k].title)];
        expect(compareSpans(a.spans, b.spans), `${i.name}: ${a.provision} before ${b.provision}`).toBeLessThanOrEqual(0);
      }
    }
    const cla = map.find((i) => i.name === 'Civil Liability Act 2002 (NSW)')!;
    const labels = cla.provisions.map((p) => p.label);
    expect(labels.indexOf('s 3B')).toBeLessThan(labels.indexOf('s 5'));
    expect(labels.indexOf('s 5')).toBeLessThan(labels.indexOf('s 5A'));
    expect(labels.indexOf('s 5I')).toBeLessThan(labels.indexOf('s 5L'));
    expect(labels.indexOf('s 5R')).toBeLessThan(labels.indexOf('s 27'));
    expect(labels.indexOf('s 43')).toBeLessThan(labels.indexOf('s 43A'));
    expect(labels.at(-1)).toBe('ss 55–58');
  });

  it('only statutes, treaties and provisions of articles; aliases merge into one instrument', () => {
    const all = map.flatMap((i) => i.provisions);
    const kinds = new Map(authorities.map((a) => [a.id, a.kind]));
    for (const p of all) expect(['statute', 'treaty', 'article']).toContain(kinds.get(p.id));
    expect(map.filter((i) => /United Nations art|^Charter of the United Nations$/.test(i.name))).toEqual([]);
    const un = map.find((i) => i.name === 'UN Charter')!;
    expect(un.provisions.some((p) => p.title.startsWith('Charter of the United Nations'))).toBe(true);
    expect(un.provisions.some((p) => p.title.startsWith('UN Charter'))).toBe(true);
  });

  it('links provisions both ways when the text or gloss names another provision of the same instrument', () => {
    const s53 = byTitle('Civil Liability Act 2002 (NSW) s 53')!;
    expect(labelsOf(s53.p.refersTo, s53.i.name)).toEqual(expect.arrayContaining(['s 3B', 's 52']));
    const s52 = byTitle('Civil Liability Act 2002 (NSW) s 52')!;
    expect(s52.p.referredBy).toContain(s53.p.id);
    // "articles 4 to 9" → each of arts 4–8 that the map has.
    const art10 = byTitle('Articles on Responsibility of States for Internationally Wrongful Acts (2001) art 10')!;
    expect(labelsOf(art10.p.refersTo, art10.i.name)).toEqual(['art 4', 'art 5', 'art 6', 'art 7', 'art 8']);
    // "articles 6, 7, 8" lands on the arts 6–13 entry.
    const iccpr4 = byTitle('International Covenant on Civil and Political Rights 1966 art 4')!;
    expect(labelsOf(iccpr4.p.refersTo, iccpr4.i.name)).toEqual(['arts 6–13']);
    // Every link is symmetric and stays inside its instrument.
    for (const i of map) for (const p of i.provisions) {
      for (const id of p.refersTo) expect(i.provisions.find((q) => q.id === id)!.referredBy).toContain(p.id);
      for (const id of p.referredBy) expect(i.provisions.find((q) => q.id === id)!.refersTo).toContain(p.id);
      expect(p.refersTo).not.toContain(p.id);
    }
  });

  it('ignores mentions of another instrument and of parts, chapters and possessives', () => {
    const arsiwa = instrumentNames('Articles on Responsibility of States for Internationally Wrongful Acts (2001)');
    expect(findRefs('Self-defence is lawful only under the UN Charter (art 51).', arsiwa)).toEqual([]);
    expect(findRefs('This is lawful under art 51 of the Charter of the United Nations.', arsiwa)).toEqual([]);
    expect(findRefs('The regional counterpart of ICCPR art 4.', instrumentNames('American Convention on Human Rights'))).toEqual([]);
    const cla = instrumentNames('Civil Liability Act 2002 (NSW)');
    expect(findRefs('Part 3 applies; see Chapters VI and VII.', cla)).toEqual([]);
    expect(findRefs("Hart's 1958 lecture.", cla)).toEqual([]);
    expect(findRefs('Law Reform (Miscellaneous Provisions) Act 1965 (NSW) s 9 applies.', cla)).toEqual([]);
    expect(findRefs('Under the Act 1965 (NSW) s 9.', instrumentNames('Law Reform (Miscellaneous Provisions) Act 1965 (NSW)')).map((r) => r.n)).toEqual([9]);
    expect(findRefs('As this Act s 5B requires.', cla).map((r) => `${r.n}${r.suffix}`)).toEqual(['5B']);
    const un = instrumentNames('UN Charter');
    expect(findRefs('measures under art 51 of the Charter', un).map((r) => r.n)).toEqual([51]);
    expect(sameInstrument('United Nations Charter', un)).toBe(true);
    expect(sameInstrument('UN Charter', arsiwa)).toBe(false);
  });

  it('reads lists, ranges, sections with suffixes and paragraphs', () => {
    const names = ['X Act'];
    const show = (t: string) => findRefs(t, names).map((r) => `${r.kind} ${r.n}${r.suffix}${r.sub.map((x) => `(${x})`).join('')}`);
    expect(show('under s 5A and ss 5B and 5C')).toEqual(['s 5A', 's 5B', 's 5C']);
    expect(show('despite section 3B(1)(a)')).toEqual(['s 3B(1)(a)']);
    expect(show('by virtue of articles 4 to 9')).toEqual(['art 4', 'art 5', 'art 6', 'art 7', 'art 8', 'art 9']);
    expect(show('in Article III and arts 13–14')).toEqual(['art 3', 'art 13', 'art 14']);
    expect(show('from articles 6, 7, 8 (paragraphs 1 and 2), 11')).toEqual(['art 6', 'art 7', 'art 8']);
  });

  it('prefers the provision that takes in the whole reference, else the parts the map has', () => {
    const P = (id: string, title: string, text = '') => ({ id, instrument: 'T', spans: parseTitle(`T ${title}`).spans, text });
    const refs = crossRefs([
      P('a12', 'art 12', 'In the case of article 13, paragraph (a), see art 2.'),
      P('a13', 'art 13'),
      P('a13b', 'art 13(b)'),
      P('a21', 'art 2(1)', 'Article 2 opens the Charter; compare art 2(4).'),
      P('a24', 'art 2(4)'),
    ]);
    expect(refs.a12.to).toEqual(['a13', 'a21', 'a24']); // art 13 (whole), and art 2 only as its parts
    expect(refs.a21.to).toEqual(['a24']); // its own article is not a cross-reference
    expect(refs.a13b.from).toEqual([]);
  });

  it('search matches every term, ignoring case and accents', () => {
    expect(matchesQuery('Civil Liability Act s 5B foreseeable risk', 'risk 5b')).toBe(true);
    expect(matchesQuery('Civil Liability Act s 5B foreseeable risk', 'risk 5c')).toBe(false);
    expect(matchesQuery('Alf Ross, Tû-Tû', 'tu-tu')).toBe(true);
    expect(matchesQuery('anything', '   ')).toBe(true);
  });
});

describe('splitSentences', () => {
  it('splits at sentence ends, not at abbreviations, initials, citations, decimals or ellipses', () => {
    expect(splitSentences('Mason J. held that the risk was real. The appeal was dismissed with costs.')).toEqual(['Mason J. held that the risk was real.', 'The appeal was dismissed with costs.']);
    expect(splitSentences('H.L.A. Hart wrote the book in 1961. It changed legal theory.')).toEqual(['H.L.A. Hart wrote the book in 1961.', 'It changed legal theory.']);
    expect(splitSentences('See Wyong v Shirt (1980) 146 CLR 40. The test has two limbs.')).toHaveLength(2);
    expect(splitSentences('The risk fell under s 5B. The court then applied it.')).toHaveLength(2);
    expect(splitSentences('The water was 3.5 feet deep there. He struck his head.')).toHaveLength(2);
    expect(splitSentences('Malice is a positive element (eg. acting for an improper purpose) and must be proved.')).toHaveLength(1);
    expect(splitSentences('He said the risks are "two different things … A risk may be foreseeable" and left it there.')).toHaveLength(1);
  });

  it('keeps quotations and brackets whole and joins short fragments to a neighbour', () => {
    expect(splitSentences('He shouted "Stop. Now." and then he walked out of the bar.')).toHaveLength(1);
    expect(splitSentences('(As summarised on the slides. The wording differs.) The duty was owed to the plaintiff.')).toEqual(['(As summarised on the slides. The wording differs.)', 'The duty was owed to the plaintiff.']);
    expect(splitSentences('Appeal dismissed. The council was liable in negligence for the injury.')).toEqual(['Appeal dismissed. The council was liable in negligence for the injury.']);
    expect(splitSentences('  ')).toEqual([]);
  });

  it('loses no text on any real case field', () => {
    for (const k of cases) for (const f of FIELDS) {
      const src = (k[f] ?? '').replace(/\s+/g, ' ').trim();
      expect(splitSentences(src).join(' '), `${k.id} ${f}`).toBe(src);
    }
  });
});

describe('case anatomy rounds', () => {
  const verified = cases.filter((k) => (k.units ?? []).includes('laws2400') && !k.verify && !k.seed);
  const items = anatomyItems(verified);

  it('draws sentences from the four fields of verified cases, each found verbatim in its field', () => {
    expect(verified.length).toBeGreaterThan(20);
    expect(new Set(items.map((x) => x.id)).size).toBe(items.length);
    for (const f of FIELDS) expect(items.some((x) => x.field === f), f).toBe(true);
    for (const x of items) {
      const k = verified.find((c) => c.id === x.caseId)!;
      expect(k[x.field].replace(/\s+/g, ' ')).toContain(x.text);
      expect(x.text.split(/\s+/).length).toBeGreaterThanOrEqual(5);
    }
  });

  it('drops a sentence that two fields of one case share', () => {
    const k: CaseText = { id: 'k', name: 'K v L', facts: 'The defendant drove into the plaintiff at speed.', issue: 'Whether the defendant owed the plaintiff a duty of care.', held: 'The defendant owed the plaintiff a duty of care. Judgment for the plaintiff was entered below.', ratio: 'The defendant owed the plaintiff a duty of care.' };
    const xs = anatomyItems([k]);
    expect(xs.map((x) => x.field)).toEqual(['facts', 'issue', 'held']);
    expect(xs.find((x) => x.field === 'held')!.text).toBe('Judgment for the plaintiff was entered below.');
  });

  it('a round of 10 mixes the fields evenly, one sentence per case, and is seeded', () => {
    const r = buildRound(items, 10, 7);
    expect(r).toHaveLength(10);
    expect(new Set(r.map((x) => x.caseId)).size).toBe(10);
    const counts = FIELDS.map((f) => r.filter((x) => x.field === f).length);
    for (const c of counts) expect(c === 2 || c === 3).toBe(true);
    expect(buildRound(items, 10, 7).map((x) => x.id)).toEqual(r.map((x) => x.id));
    expect(buildRound(items, 10, 8).map((x) => x.id)).not.toEqual(r.map((x) => x.id));
    // Field order is shuffled: not facts, issue, held, ratio, facts …
    expect(r.map((x) => x.field).join()).not.toBe(FIELDS.concat(FIELDS, FIELDS).slice(0, 10).join());
  });

  it('a small pool gives what it has, reusing cases only when it must', () => {
    const two = items.filter((x) => x.caseId === items[0].caseId || x.caseId === items.at(-1)!.caseId);
    const r = buildRound(two, 10, 3);
    expect(r.length).toBe(Math.min(10, two.length));
    expect(buildRound([], 10, 1)).toEqual([]);
  });

  it('tallies right answers, per field, and the most frequent mix-up', () => {
    const a = (field: Field, chosen: Field) => ({ field, chosen });
    const t = tallyAnatomy([a('ratio', 'held'), a('ratio', 'held'), a('facts', 'facts'), a('issue', 'ratio'), a('held', 'held')]);
    expect([t.right, t.total]).toEqual([2, 5]);
    expect(t.byField.ratio).toEqual({ right: 0, total: 2 });
    expect(t.byField.held).toEqual({ right: 1, total: 1 });
    expect(t.confusion).toEqual({ field: 'ratio', chosen: 'held', times: 2 });
    expect(tallyAnatomy([a('facts', 'facts')]).confusion).toBeNull();
  });
});

describe('fact comparison', () => {
  it('finds shared stems, problem facts with no counterpart and case facts with no counterpart', () => {
    const problem = ['Marco punched Levi in the hotel bar.', 'Levi suffered a fractured cheekbone.'];
    const kase = ['The plaintiff was punched outside a hotel.', 'The council erected a deep water sign.'];
    const o = compareFacts(problem, kase);
    expect(o.shared.map((s) => s.word)).toEqual(['punched', 'hotel']);
    expect(o.problemOnly).toEqual([1]);
    expect(o.caseOnly).toEqual([1]);
  });

  it('ignores words too common in fact patterns to suggest a similarity', () => {
    const o = compareFacts(['He left without a word and went home.'], ['She stood there without moving, then went home.']);
    expect(o.shared.map((s) => s.word)).toEqual(['home']);
  });

  it('tokens rebuild the text and carry the stems used for matching', () => {
    const t = 'Levi’s injuries — he was punched twice.';
    const toks = tokenize(t);
    expect(toks.map((x) => x.text).join('')).toBe(t);
    expect(toks.find((x) => x.text === 'punched')!.stem).toBe('punch');
    expect(toks.find((x) => x.text === 'he')!.stem).toBeNull();
    expect(toks.find((x) => x.text === ' — ')!.stem).toBeNull();
  });
});

describe('argument adversary', () => {
  const aid = (concept: string, week: string, objections: Aid['objections']): Aid => ({
    concept, unit: 'u', week, plain: 'p', terms: [], misconceptions: [], socratic: [], elements: [], 'what-if': [], boundary: [], transfer: [],
    objections, storyboard: [], sources: ['slides 3'], verify: false,
  });
  const aids = {
    'u-w02-b': aid('u-w02-b', 'u-w02', [{ position: 'P2', evidence: 'E2', objection: 'O2' }]),
    'u-w01-a': aid('u-w01-a', 'u-w01', [{ position: 'P1', evidence: 'E1', objection: 'O1', reply: 'R1' }, { position: 'P1b', evidence: 'E1b', objection: 'O1b' }]),
    'u-w01-c': aid('u-w01-c', 'u-w01', []),
  };

  it('lists every objection in the given concept order, with stable attempt ids', () => {
    const xs = argueItems(aids, ['u-w01-a', 'u-w02-b']);
    expect(xs.map((x) => x.id)).toEqual(['argue:u-w01-a:0', 'argue:u-w01-a:1', 'argue:u-w02-b:0']);
    expect(xs[0]).toMatchObject({ position: 'P1', reply: 'R1', of: 2, index: 0, week: 'u-w01' });
    expect(xs[1].reply).toBeUndefined();
    expect(argueItems(aids).map((x) => x.concept)).toEqual(['u-w01-a', 'u-w01-a', 'u-w02-b']);
    expect(argueId('c', 2)).toBe('argue:c:2');
  });

  it('remembers the latest self-rating per item', () => {
    const last = lastArgued([
      { questionId: 'argue:a:0', at: 1, score: 0 },
      { questionId: 'argue:a:0', at: 3, score: 1 },
      { questionId: 'argue:a:0', at: 2, score: 0.5 },
      { questionId: 'drill:spot:a:0', at: 4, score: 1 },
    ]);
    expect([...last]).toEqual([['argue:a:0', 1]]);
  });
});
