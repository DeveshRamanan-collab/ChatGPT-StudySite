import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import {
  buildBoard, cardKey, cleanBoard, factsByIssue, firstSentence, fold, locateFacts, mentions, place, problemHref, problemSlug,
  promptOrder, requirementsFor, scoreFact, scoreRound, segment, supportOf, tally, type Issue,
} from '../src/lib/problem';

// js-yaml ships no type declarations; it is only needed to read the real annotation files.
const yaml: { load: (s: string) => unknown } = createRequire(import.meta.url)('js-yaml');

const el = (name: string, test = 'A test.', cases: string[] = [], authorities: string[] = []) => ({ name, test, cases, authorities });

describe('locating excerpts in the prompt', () => {
  const prompt = 'Ann met Bob.  He said “hello” — twice.\n\nThen Ann left. Then Ann left again.';

  it('folds whitespace, quotes and dashes but keeps original offsets', () => {
    const { s, map } = fold('A  “b” — c');
    expect(s).toBe('a "b" - c');
    expect(map[2]).toBe(3);
  });

  it('finds verbatim and near-verbatim excerpts', () => {
    const [a, b] = locateFacts(prompt, [{ text: 'Ann met Bob.' }, { text: 'He said "hello" - twice.' }]);
    expect(prompt.slice(a.start, a.end)).toBe('Ann met Bob.');
    expect(prompt.slice(b.start, b.end)).toBe('He said “hello” — twice.');
  });

  it('resolves a repeated phrase to the next occurrence, never over an earlier fact', () => {
    const r = locateFacts(prompt, [{ text: 'Then Ann left' }, { text: 'Then Ann left' }]);
    expect(r[0].start).toBeLessThan(r[1].start);
    expect(r[0].end).toBeLessThanOrEqual(r[1].start);
  });

  it('tolerates stray end punctuation and reports what it cannot find', () => {
    const r = locateFacts(prompt, [{ text: 'Then Ann left again!' }, { text: 'Carol arrived.' }]);
    expect(prompt.slice(r[0].start, r[0].end)).toBe('Then Ann left again');
    expect(r[1]).toEqual({ start: -1, end: -1 });
  });

  it('orders facts by position, unfound ones last', () => {
    expect(promptOrder([{ start: 20, end: 25 }, { start: -1, end: -1 }, { start: 0, end: 5 }])).toEqual([2, 0, 1]);
  });

  it('cuts the prompt into paragraphs of plain and fact pieces that rebuild the text', () => {
    const loc = locateFacts(prompt, [{ text: 'met Bob' }, { text: 'Then Ann left again' }]);
    const paras = segment(prompt, loc);
    expect(paras).toHaveLength(2);
    expect(paras[0].map((p) => p.text).join('')).toBe('Ann met Bob.  He said “hello” — twice.');
    expect(paras[0].find((p) => p.fact === 0)?.text).toBe('met Bob');
    expect(paras[1].slice(-2)).toEqual([{ text: 'Then Ann left again', fact: 1 }, { text: '.', fact: null }]);
    expect(paras[1][0]).toEqual({ text: 'Then Ann left. ', fact: null });
  });

  it('takes the first sentence without cutting at an abbreviation', () => {
    expect(firstSentence('Dr. Lee runs a clinic. She is careful.')).toBe('Dr. Lee runs a clinic.');
    expect(firstSentence('Under s. 5B the test applies. Next.')).toBe('Under s. 5B the test applies.');
    expect(firstSentence('No full stop here')).toBe('No full stop here');
  });
});

describe('spotting round', () => {
  const facts = [
    { weight: 'essential' as const, issues: ['a', 'b'] },
    { weight: 'background' as const, issues: [] },
    { weight: 'essential' as const, issues: ['b', 'zz'] },
  ];
  const known = new Set(['a', 'b', 'c']);

  it('scores one fact: weight, issues found, missed and added', () => {
    expect(scoreFact(facts[0], { weight: 'essential', issues: ['a', 'c'] }, known)).toEqual({ weightOk: true, hits: ['a'], missed: ['b'], extra: ['c'] });
    expect(scoreFact(facts[1], { weight: 'essential', issues: [] }, known).weightOk).toBe(false);
  });

  it('ignores issue ids the question does not list', () => {
    expect(scoreFact(facts[2], { weight: 'essential', issues: ['b'] }, known)).toEqual({ weightOk: true, hits: ['b'], missed: [], extra: [] });
  });

  it('keeps a running tally over answered facts only', () => {
    const s = scoreRound(facts, [{ weight: 'essential', issues: ['a'] }, { weight: 'essential', issues: [] }], known);
    expect(s).toMatchObject({ done: 2, total: 3, matched: 1, essentialFound: 1, essentialTotal: 1, issueHits: 1, issueTotal: 2, issueExtra: 0 });
    expect(tally(s)).toBe('2 of 3 facts · 1 matched');
  });
});

describe('issues, requirements and the board', () => {
  const issues: Issue[] = [
    { id: 'battery', label: 'Battery: elements', concept: 'battery' },
    { id: 'punch', label: 'Self-defence at common law (Zecevic): the punch', concept: 'sd' },
    { id: 'stool', label: 'The stool strike: proportionality (Fontin v Katapodis)', concept: 'sd' },
    { id: 's53', label: 'CLA ss 53 and 54', concept: 'sd' },
    { id: 'remedies', label: 'Remedies' },
  ];
  const sd = [
    el('Reasonable apprehension (common law)', 'Did the defendant reasonably apprehend force?', ['zecevic-v-dpp']),
    el('Proportionate force (common law)', 'Was the force proportionate?', ['zecevic-v-dpp', 'fontin-v-katapodis']),
    el('Unreasonable response (s 53)', 'Exceptional circumstances only.', [], ['civil-liability-act-2002-nsw-s53']),
  ];
  const reqs = requirementsFor(issues, { battery: [el('Direct act'), el('Contact')], sd, unused: [el('x')] });

  it('gives a single-issue concept all its elements, in order', () => {
    expect(reqs.battery.map((r) => r.name)).toEqual(['Direct act', 'Contact']);
    expect(reqs.battery[0].key).toBe('battery:e0');
  });

  it('states a shared test in full once, then gives later issues only what their label names', () => {
    expect(reqs.punch).toHaveLength(3);
    expect(reqs.stool.map((r) => r.name)).toEqual(['Proportionate force (common law)']);
    expect(reqs.s53.map((r) => r.name)).toEqual(['Unreasonable response (s 53)']);
    expect(reqs.s53[0].key).toBe('s53:e2');
  });

  it('falls back to the issue itself when no elements apply', () => {
    expect(reqs.remedies).toEqual([{ key: 'remedies:issue', name: 'Remedies', cases: [], authorities: [] }]);
    const lone = requirementsFor([{ id: 'x', label: 'Lone', concept: 'empty' }], { empty: [] });
    expect(lone.x[0].key).toBe('x:issue');
  });

  const facts = [{ issues: ['punch'] }, { issues: ['battery', 'punch'] }, { issues: [] }, { issues: ['battery'] }];
  const order = [3, 0, 1, 2];
  const cols = buildBoard(issues, facts, order, reqs);

  it('groups facts by issue in answer order and prompt order', () => {
    expect(factsByIssue(issues, facts, order).map((g) => [g.issue.id, g.facts])).toEqual([
      ['battery', [3, 1]], ['punch', [0, 1]], ['stool', []], ['s53', []], ['remedies', []],
    ]);
    expect(cols.map((c) => c.issue.id)).toEqual(['battery', 'punch', 'stool', 's53', 'remedies']);
  });

  it('places a card on a row of its own issue only, and back to the tray', () => {
    let s = place({ placed: {} }, cardKey('punch', 1), 'punch:e1');
    expect(s.placed).toEqual({ 'punch#1': 'punch:e1' });
    expect(place(s, cardKey('punch', 1), 'battery:e0')).toBe(s);
    const sup = supportOf(cols, s);
    expect(sup.rows['punch:e1']).toEqual([1]);
    expect(sup.rows['punch:e0']).toEqual([]);
    expect(sup.tray.punch).toEqual([0]);
    expect(sup.tray.battery).toEqual([3, 1]);
    s = place(s, cardKey('punch', 1), null);
    expect(s.placed).toEqual({});
  });

  it('drops stale or malformed saved placements', () => {
    const raw = { placed: { 'punch#1': 'punch:e1', 'punch#9': 'punch:e0', 'battery#3': 'punch:e0', 'stool#0': 'stool:e1', bad: 3 } };
    expect(cleanBoard(raw, cols)).toEqual({ placed: { 'punch#1': 'punch:e1' } });
    expect(cleanBoard(null, cols)).toEqual({ placed: {} });
    expect(cleanBoard('nonsense', cols)).toEqual({ placed: {} });
  });
});

describe('parties and routes', () => {
  it('finds a party by name, possessive or distinctive word, never inside another word', () => {
    expect(mentions("Levi's grip loosened", 'Levi')).toBe(true);
    expect(mentions('Levin arrived', 'Levi')).toBe(false);
    expect(mentions('the Council closed the road', 'Riverside Shire Council')).toBe(true);
    expect(mentions('the council closed the road', 'Riverside Shire Council')).toBe(false);
    expect(mentions('Dr Smith operated', 'Dr Jane Smith')).toBe(true);
  });

  it('slugs a question id without its unit prefix', () => {
    expect(problemSlug('laws2400', 'laws2400-w00-q001')).toBe('w00-q001');
    expect(problemHref('laws2400', 'laws2400-w00-q001')).toBe('/laws2400/problem/w00-q001/');
    expect(problemSlug('laws2400', 'other-q1')).toBe('other-q1');
  });
});

// Real annotations: every excerpt is found in its prompt, in order, and the pieces rebuild the prompt exactly.
describe('real fact annotations', () => {
  const dir = 'src/content/facts';
  const files = existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.md')) : [];
  const fm = (p: string) => yaml.load(readFileSync(p, 'utf8').split(/^---$/m)[1]) as Record<string, any>;
  for (const f of files) {
    it(f, () => {
      const a = fm(`${dir}/${f}`);
      const qp = `src/content/questions/${a.question}.md`;
      if (!existsSync(qp)) return;
      const prompt: string = fm(qp).prompt;
      const loc = locateFacts(prompt, a.facts);
      expect(loc.filter((r) => r.start < 0).map((_, i) => a.facts[i].text)).toEqual([]);
      const rebuilt = segment(prompt, loc).map((p) => p.map((x) => x.text).join('')).join(' ');
      expect(rebuilt.replace(/\s+/g, ' ').trim()).toBe(prompt.replace(/\s+/g, ' ').trim());
      const known = new Set<string>(a.issues.map((i: Issue) => i.id));
      for (const fact of a.facts) for (const i of fact.issues ?? []) expect(known.has(i), `${f}: unknown issue ${i}`).toBe(true);
    });
  }
});
