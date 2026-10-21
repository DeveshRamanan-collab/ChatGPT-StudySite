// Fact comparison (feature 155), the second tab of /<unit>/case-anatomy: a problem question with fact annotations
// and one of the cases its issues' concepts cite, side by side. Words that share a stem (src/lib/aids.ts `stems`) are
// marked in both columns and listed as possible material similarities; facts with no shared word on the other side
// are listed as differences to argue. Explicitly a word-overlap aid: it never says two facts are legally alike.
import { useMemo, useState } from 'react';
import { compareFacts, splitSentences, tokenize } from '../../lib/legal';
import '../../styles/legal.css';

export interface CompareProblem { id: string; n: number; first: string; essential: string[]; cases: string[] }
export interface CompareCase { name: string; facts: string; verify: boolean }
interface Props { code: string; problems: CompareProblem[]; cases: Record<string, CompareCase> }

export default function FactCompare({ code, problems, cases }: Props) {
  const [pid, setPid] = useState(problems[0]?.id ?? '');
  const problem = problems.find((p) => p.id === pid) ?? problems[0];
  // The problem's cited cases, those sharing the most words first (each labelled with its count).
  const ranked = useMemo(
    () => (problem ? problem.cases.filter((id) => cases[id]) : [])
      .map((id) => ({ id, shared: compareFacts(problem.essential, splitSentences(cases[id].facts)).shared.length }))
      .sort((a, b) => b.shared - a.shared || cases[a.id].name.localeCompare(cases[b.id].name)),
    [problem, cases],
  );
  const options = ranked.map((o) => o.id);
  const [cid, setCid] = useState('');
  const caseId = options.includes(cid) ? cid : options[0];
  const kase = caseId ? cases[caseId] : undefined;
  const [focus, setFocus] = useState<string | null>(null);

  const caseFacts = useMemo(() => (kase ? splitSentences(kase.facts) : []), [kase]);
  const overlap = useMemo(() => (problem && kase ? compareFacts(problem.essential, caseFacts) : null), [problem, kase, caseFacts]);
  const shared = useMemo(() => new Set(overlap?.shared.map((s) => s.stem)), [overlap]);

  if (!problem || !kase || !overlap) {
    return <p className="fact-cmp__none" data-fact-cmp-empty>No annotated problem questions with cited cases for {code} yet. They appear here as fact annotations are added.</p>;
  }

  const pick = (id: string) => { setPid(id); setCid(''); setFocus(null); };
  const marked = (text: string) => tokenize(text).map((t, k) =>
    t.stem && shared.has(t.stem)
      ? <mark key={k} className="fact-cmp__mark" data-stem={t.stem} data-on={focus === t.stem ? '' : undefined}>{t.text}</mark>
      : t.text,
  );

  return (
    <div className="fact-cmp" data-fact-cmp>
      <p className="fact-cmp__note">
        <span className="label">Word-overlap aid</span>
        Shared words hint at where the facts line up. This is not legal analysis: you decide which similarities are material and which differences matter.
      </p>
      <div className="fact-cmp__pickers">
        <label className="fact-cmp__field">
          <span className="label">Problem</span>
          <select className="legal-select" value={problem.id} onChange={(e) => pick(e.target.value)} data-fact-cmp-problem>
            {problems.map((p) => <option key={p.id} value={p.id}>Problem {p.n}: {p.first}</option>)}
          </select>
        </label>
        <label className="fact-cmp__field">
          <span className="label">Case its issues cite</span>
          <select className="legal-select" value={caseId} onChange={(e) => { setCid(e.target.value); setFocus(null); }} data-fact-cmp-case>
            {ranked.map(({ id, shared: n }) => <option key={id} value={id}>{cases[id].name} · {n === 1 ? '1 shared word' : `${n} shared words`}</option>)}
          </select>
        </label>
      </div>

      <div className="fact-cmp__cols">
        <section className="fact-cmp__col" aria-labelledby="fact-cmp-p" data-fact-cmp-side="problem">
          <h2 className="fact-cmp__h" id="fact-cmp-p">Problem {problem.n}: essential facts</h2>
          <ul className="fact-cmp__list">
            {problem.essential.map((f, k) => <li key={k} className="fact-cmp__item" data-alone={overlap.problemOnly.includes(k) ? '' : undefined}>{marked(f)}</li>)}
          </ul>
        </section>
        <section className="fact-cmp__col" aria-labelledby="fact-cmp-c" data-fact-cmp-side="case">
          <h2 className="fact-cmp__h" id="fact-cmp-c"><cite>{kase.name}</cite>: facts</h2>
          {kase.verify && <p className="legal-check">Not yet verified against your materials.</p>}
          <ul className="fact-cmp__list">
            {caseFacts.map((f, k) => <li key={k} className="fact-cmp__item" data-alone={overlap.caseOnly.includes(k) ? '' : undefined}>{marked(f)}</li>)}
          </ul>
          <p className="fact-cmp__link"><a href={`/cases/${caseId}`}>Open the case card</a></p>
        </section>
      </div>

      <section className="fact-cmp__section" aria-labelledby="fact-cmp-sim" data-fact-cmp-shared>
        <h2 className="fact-cmp__h" id="fact-cmp-sim">Material similarities?</h2>
        {overlap.shared.length ? (
          <>
            <p>{overlap.shared.length === 1 ? 'One word appears' : `${overlap.shared.length} words appear`} on both sides. Choose one to find it in both columns.</p>
            <ul className="fact-cmp__terms">
              {overlap.shared.map((s) => (
                <li key={s.stem}>
                  <button type="button" className="chip fact-cmp__term" aria-pressed={focus === s.stem} onClick={() => setFocus((f) => (f === s.stem ? null : s.stem))}>{s.word}</button>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="fact-cmp__none">No words in common. Any similarity here is one you will have to argue from the substance.</p>
        )}
      </section>

      <section className="fact-cmp__section" aria-labelledby="fact-cmp-diff" data-fact-cmp-diff>
        <h2 className="fact-cmp__h" id="fact-cmp-diff">Differences to argue</h2>
        <p>Facts that share no word with the other side.</p>
        <div className="fact-cmp__diff">
          <div>
            <h3 className="fact-cmp__sub">In the problem, not the case</h3>
            {overlap.problemOnly.length
              ? <ul className="fact-cmp__list">{overlap.problemOnly.map((k) => <li key={k} className="fact-cmp__item">{problem.essential[k]}</li>)}</ul>
              : <p className="fact-cmp__none">None: every essential fact shares a word with the case.</p>}
          </div>
          <div>
            <h3 className="fact-cmp__sub">In the case, not the problem</h3>
            {overlap.caseOnly.length
              ? <ul className="fact-cmp__list">{overlap.caseOnly.map((k) => <li key={k} className="fact-cmp__item">{caseFacts[k]}</li>)}</ul>
              : <p className="fact-cmp__none">None: every fact of the case shares a word with the problem.</p>}
          </div>
        </div>
      </section>
    </div>
  );
}
