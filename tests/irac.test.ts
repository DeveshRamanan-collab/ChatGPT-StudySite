import { describe, it, expect } from 'vitest';
import { contentStems, deslug, findAuthorities, iracCheck, ruleStatements, segmentByIssue, splitSentences } from '../src/lib/irac';

const rubric = [
  { id: 'i', criterion: 'Identifies the breach issue', 'top-band': 'States the issue precisely.' },
  { id: 'l', criterion: 'States the foreseeable and not insignificant threshold', 'top-band': 'States s 5B(1) accurately.' },
  { id: 'a', criterion: 'Weighs probability, seriousness and burden', 'top-band': 'Weighs each factor against the facts.' },
  { id: 'c', criterion: 'Considers causation of the injury', 'top-band': 'Applies s 5D.' },
];
const cases = ['Wyong Shire Council v Shirt', 'Adeels Palace v Moubarak', 'A v New South Wales'];

describe('splitSentences', () => {
  it('splits on sentence ends and lines but never inside a citation', () => {
    expect(splitSentences('Under s. 5B the risk matters. See Donoghue v. Stevenson. Art. 2(4) applies!\nNext line')).toEqual([
      'Under s. 5B the risk matters.',
      'See Donoghue v. Stevenson.',
      'Art. 2(4) applies!',
      'Next line',
    ]);
  });
});

describe('findAuthorities', () => {
  it('recognises sections, articles, Acts, "X v Y" and report citations', () => {
    expect(findAuthorities('Under s 5B(2)(a) the court weighs it.')).toContain('s 5B(2)(a)');
    expect(findAuthorities('Force is prohibited by art 2(4) of the UN Charter.')).toEqual(expect.arrayContaining(['art 2(4)']));
    expect(findAuthorities('The Civil Liability Act 2002 (NSW) applies.')[0]).toMatch(/Civil Liability Act 2002/);
    expect(findAuthorities('In March v Stramare the court used common sense.')).toContain('March v Stramare');
    expect(findAuthorities('Donoghue was decided in [1932] AC 562.')).toContain('[1932] AC 562');
    expect(findAuthorities('The council should have fixed the pothole.')).toEqual([]);
  });
  it('matches known case names in full or by a distinctive party, but not generic parties', () => {
    expect(findAuthorities('The Shirt calculus applies here.', cases)).toContain('Wyong Shire Council v Shirt');
    expect(findAuthorities('As Adeels Palace shows, but-for is required.', cases)).toContain('Adeels Palace v Moubarak');
    expect(findAuthorities('A shirt was torn in the struggle.', cases)).not.toContain('Wyong Shire Council v Shirt');
    expect(findAuthorities('New South Wales is the forum.', cases)).not.toContain('A v New South Wales');
    // De-slugged question cases match only in full (they carry no capitals to tell a name from a word).
    expect(findAuthorities('see wyong shire council v shirt', [deslug('wyong-shire-council-v-shirt')])).toEqual(['wyong shire council v shirt']);
    expect(findAuthorities('a shirt', [deslug('wyong-shire-council-v-shirt')])).toEqual([]);
  });
});

describe('ruleStatements', () => {
  it('finds rule statements and whether each carries an authority (own sentence or the next)', () => {
    const text = [
      'Issue: whether the council breached its duty.',
      'Law: A person is not negligent unless the risk was foreseeable and not insignificant.',
      'The court must weigh probability, seriousness, burden and social utility.',
      'This is the test in s 5B(2).',
      'The test requires a reasonable person to take precautions. That is the rule.',
      'Application: The council knew of the pothole and did nothing.',
    ].join('\n');
    const rules = ruleStatements(text, cases);
    const bySentence = Object.fromEntries(rules.map((r) => [r.sentence.slice(0, 20), r.authority]));
    expect(bySentence['A person is not negl']).toBeNull();
    expect(bySentence['The court must weigh']).toBe('s 5B(2)'); // cited in the next sentence
    expect(bySentence['This is the test in ']).toBe('s 5B(2)');
    expect(bySentence['The test requires a ']).toBeNull();
    expect(rules.some((r) => r.sentence.startsWith('The council knew'))).toBe(false); // application, not rule
  });
  it('treats a cue sentence that names a party as application', () => {
    const rules = ruleStatements('The test is whether Ann owed a duty of care.', [], ['Ann']);
    expect(rules).toEqual([]);
  });
});

describe('segmentByIssue', () => {
  it('assigns each sentence to the best-matching issue, carrying the current one forward', () => {
    const seg = segmentByIssue(
      'Breach: the council breached its duty. It knew for months. Causation: the fall caused the injury. Therefore causation is made out.',
      [{ id: 'b', label: 'Breach of duty' }, { id: 'c', label: 'Causation' }],
    );
    expect(seg.get('b')).toEqual(['Breach: the council breached its duty.', 'It knew for months.']);
    expect(seg.get('c')).toHaveLength(2);
  });
});

describe('iracCheck', () => {
  const facts = [
    { text: 'The council knew of the pothole for six months.', weight: 'essential' as const },
    { text: 'Pat tripped in the pothole at night and broke her wrist.', weight: 'essential' as const },
    { text: 'A sign warning of roadworks stood nearby.', weight: 'essential' as const },
    { text: 'Pat was walking to the library.', weight: 'background' as const },
  ];
  const answer = [
    'Issue: whether the council breached its duty to Pat.',
    'Law: Under s 5B a person is not negligent unless the risk was foreseeable and not insignificant (Wyong Shire Council v Shirt).',
    'Application: the council knew of the pothole for six months. The probability of a trip was high, the seriousness moderate and the burden of repair low.',
    'Conclusion: the council is likely to have breached its duty.',
  ].join('\n');

  it('reports issues addressed, authorities, missed essential facts and conclusions', () => {
    const r = iracCheck({ text: answer, rubric, caseNames: cases, facts, parties: ['Pat'] });
    expect(r.issues.filter((i) => i.addressed).map((i) => i.id)).toEqual(['i', 'l', 'a']);
    expect(r.issues.find((i) => i.id === 'c')!.addressed).toBe(false);
    expect(r.rules.length).toBeGreaterThan(0);
    expect(r.rules.every((x) => x.authority)).toBe(true);
    expect(r.facts.checked).toBe(true);
    expect(r.facts.missed).toEqual(['Pat tripped in the pothole at night and broke her wrist.', 'A sign warning of roadworks stood nearby.']);
    // Background facts are never required.
    expect(r.facts.missed).not.toContain('Pat was walking to the library.');
    expect(r.conclusions.find((c) => c.id === 'i')?.concluded).toBe(true);
  });

  it('uses the fact annotation issues for conclusions when present, and flags an issue left open', () => {
    const text = 'Breach: the council breached its duty, so breach is likely made out.\nCausation: the pothole caused the fall.';
    const r = iracCheck({ text, rubric, issues: [{ id: 'b', label: 'Breach' }, { id: 'c', label: 'Causation' }] });
    expect(r.conclusions).toEqual([
      { id: 'b', label: 'Breach', concluded: true },
      { id: 'c', label: 'Causation', concluded: false },
    ]);
  });

  it('degrades without facts or cases: no fact check, generic citations still count', () => {
    const r = iracCheck({ text: 'The test in s 5D requires but-for causation.', rubric });
    expect(r.facts).toEqual({ checked: false, missed: [] });
    expect(r.rules).toEqual([{ sentence: 'The test in s 5D requires but-for causation.', authority: 's 5D' }]);
  });

  it('flags nothing it cannot judge (a criterion made only of marker words)', () => {
    expect(contentStems('Identifies the relevant issues and applies the law').size).toBe(0);
    const r = iracCheck({ text: 'Anything at all.', rubric: [{ id: 'x', criterion: 'Identifies the relevant issues and applies the law' }] });
    expect(r.issues[0].addressed).toBe(true);
  });
});
