// Exam simulation: a timed paper of choice questions, certainty-based marking (C1/C2/C3), no feedback until the end,
// then a full debrief (CBM score, accuracy, accuracy per certainty level, where the marks went — misconceptions,
// gaps, shaky and timing — and every question with both explanations).
import { useEffect, useMemo, useRef, useState } from 'react';
import { cbm, cbmTotals, certaintyToConfidence, type Certainty } from '../../lib/cbm';
import { chargeTime, conceptCounts, debriefSplit, type DebriefSplit } from '../../lib/learner';
import { recordAttempt } from '../../lib/learning';
import { pick } from '../../lib/picker';
import { useStudy } from '../../lib/store';
import { TimerArc } from '../ui/TimerArc';
import { asChoice, type Bank, type McqQ, type TrueFalseQ } from './types';
import '../../styles/insight.css';

const QUESTIONS = 20;
const SECONDS_EACH = 72;

interface Answer { chosen: number | null; certainty: Certainty | null }

type GroupId = 'misconceptions' | 'gaps' | 'shaky' | 'timing';
const GROUPS: { id: GroupId; name: string; def: (s: DebriefSplit) => string; next: string }[] = [
  { id: 'misconceptions', name: 'Misconceptions', def: () => 'C3 and wrong: sure, but the belief was off',
    next: 'Read “Why the right one is right” for each, then put it next to what you believed. These come back at 10 minutes, 1 day and 4 days.' },
  { id: 'gaps', name: 'Gaps', def: () => 'C1 and wrong: a guess',
    next: 'Read the concept card before your next quiz, then answer a few questions on it.' },
  { id: 'shaky', name: 'Shaky', def: () => 'C2 and wrong: half-known',
    next: 'A short quiz on each of these concepts will firm them up.' },
  { id: 'timing', name: 'Timing', def: (s) => `over twice your median of ${Math.max(1, Math.round(s.median / 1000))} s, or left unanswered`,
    next: 'Practise these in quick-fire so the rule comes to mind faster; in the exam, mark a slow one and come back to it.' },
];

const CONCEPTS_SHOWN = 6;

/** The concepts behind a group of questions (most first), the first six shown and the rest on request. */
function ConceptList({ ids, concepts, bank, label }: { ids: number[]; concepts: string[]; bank: Bank; label: string }) {
  const [all, setAll] = useState(false);
  const counts = conceptCounts(ids, concepts);
  return (
    <ul className="debrief-split__concepts" aria-label={label}>
      {(all ? counts : counts.slice(0, CONCEPTS_SHOWN)).map(({ concept, n }) => {
        const meta = bank.concepts[concept];
        return <li key={concept}>{meta ? <a href={meta.href}>{meta.title}</a> : concept}{n > 1 && <span className="debrief-split__times"> ×{n}</span>}</li>;
      })}
      {counts.length > CONCEPTS_SHOWN && (
        <li><button type="button" className="btn btn--ghost btn--sm debrief-split__more" aria-expanded={all} onClick={() => setAll((a) => !a)}>{all ? 'Show fewer' : `${counts.length - CONCEPTS_SHOWN} more`}</button></li>
      )}
    </ul>
  );
}

/** Where the marks went: wrong answers by certainty, plus slow and unanswered questions, each with its concepts. */
function DebriefGroups({ split, paper, bank }: { split: DebriefSplit; paper: (McqQ | TrueFalseQ)[]; bank: Bank }) {
  const concepts = paper.map((q) => q.concept);
  return (
    <div className="qcard debrief-split" data-debrief-split>
      <h3 className="debrief-split__title">Where the marks went</h3>
      <ul className="debrief-split__groups">
        {GROUPS.map((g) => {
          const ids = split[g.id];
          const n = g.id === 'timing' ? `${split.slow.length} slow · ${split.blank.length} unanswered` : String(ids.length);
          return (
            <li key={g.id} className="debrief-split__group" data-group={g.id} data-count={ids.length}>
              <p className="debrief-split__head">
                <span className="debrief-split__name">{g.name}</span>
                <span className="debrief-split__n">{n}</span>
                <span className="debrief-split__def">{g.def(split)}</span>
              </p>
              {!ids.length ? <p className="debrief-split__none">None this time.</p> : (
                <>
                  {g.id !== 'timing' ? <ConceptList ids={ids} concepts={concepts} bank={bank} label={`${g.name}: concepts`} /> : (
                    ([['Slow', split.slow], ['Unanswered', split.blank]] as const).filter(([, xs]) => xs.length).map(([part, xs]) => (
                      <div key={part} className="debrief-split__part">
                        <p className="debrief-split__label">{part}</p>
                        <ConceptList ids={[...xs]} concepts={concepts} bank={bank} label={`${part}: concepts`} />
                      </div>
                    ))
                  )}
                  <p className="debrief-split__next">{g.next}</p>
                </>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function ExamSim({ bank, seed }: { bank: Bank; seed: number }) {
  const attempts = useStudy((s) => s.attempts);
  const criteria = useStudy((s) => s.criterion);
  const paper = useMemo(() => {
    const pool = bank.questions.filter((q): q is McqQ | TrueFalseQ => q.type === 'mcq' || q.type === 'truefalse');
    return pick({ items: pool, attempts, criteria, requeue: [], now: Date.now(), n: QUESTIONS, mode: 'exam', seed });
  }, [bank, seed]); // eslint-disable-line react-hooks/exhaustive-deps
  const total = paper.length * SECONDS_EACH;
  const [state, setState] = useState<'ready' | 'sitting' | 'debrief'>('ready');
  const [left, setLeft] = useState(total);
  const [answers, setAnswers] = useState<Answer[]>(() => paper.map(() => ({ chosen: null, certainty: null })));
  const began = useRef(0);

  useEffect(() => {
    if (state !== 'sitting') return;
    document.documentElement.dataset.exam = '1';
    const guard = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ''; };
    addEventListener('beforeunload', guard);
    const t = setInterval(() => setLeft((s) => { if (s <= 1) { finish(); return 0; } return s - 1; }), 1000);
    return () => { delete document.documentElement.dataset.exam; removeEventListener('beforeunload', guard); clearInterval(t); };
  }, [state]); // eslint-disable-line react-hooks/exhaustive-deps

  // Every click is timed so the debrief can find the slow questions (see chargeTime in src/lib/learner.ts).
  const events = useRef<{ i: number; t: number }[]>([]);
  const set = (i: number, patch: Partial<Answer>) => {
    events.current.push({ i, t: performance.now() });
    setAnswers((as) => as.map((a, j) => (j === i ? { ...a, ...patch } : a)));
  };

  const answersRef = useRef(answers);
  answersRef.current = answers;
  const finished = useRef(false);
  const finish = () => {
    if (finished.current) return;
    finished.current = true;
    {
      const as = answersRef.current;
      const per = Math.round((performance.now() - began.current) / Math.max(1, paper.length));
      as.forEach((a, i) => {
        if (a.chosen === null) return;
        const q = paper[i];
        const correct = asChoice(q).options[a.chosen].correct;
        const c = a.certainty ?? 1;
        recordAttempt({ questionId: q.id, unit: q.unit, concept: q.concept, week: q.week, type: q.type, answer: a.chosen, correct, confidence: certaintyToConfidence(c), cbmScore: cbm(c, correct), mode: 'exam', durationMs: per }).catch(() => {});
      });
    }
    setState('debrief');
    scrollTo({ top: 0 });
  };

  if (!paper.length) return <p className="quiz__empty">No questions for a paper yet.</p>;

  if (state === 'ready')
    return (
      <section className="qcard exam">
        <h2 className="qcard__stem">Exam simulation</h2>
        <p>{paper.length} questions, {Math.round(total / 60)} minutes, no feedback until you finish.</p>
        <p>For each answer choose your certainty. <strong>C1</strong> +1 if right, 0 if wrong. <strong>C2</strong> +2 or −2. <strong>C3</strong> +3 or −6. Being honest about doubt scores best.</p>
        <button type="button" className="btn btn--primary" onClick={() => { began.current = performance.now(); setState('sitting'); }}>Begin the paper</button>
      </section>
    );

  if (state === 'debrief') {
    const marked = answers.map((a, i) => ({ a, q: paper[i], opts: asChoice(paper[i]).options })).filter((x) => x.a.chosen !== null);
    const t = cbmTotals(marked.map((x) => ({ certainty: x.a.certainty ?? 1, correct: x.opts[x.a.chosen!].correct })));
    const ms = chargeTime(events.current, began.current, paper.length);
    const split = debriefSplit(paper.map((q, i) => {
      const a = answers[i];
      return { concept: q.concept, answered: a.chosen !== null, correct: a.chosen !== null && asChoice(q).options[a.chosen].correct, certainty: a.certainty, ms: ms[i] };
    }));
    return (
      <section className="exam exam--debrief" aria-live="polite">
        <div className="qcard">
          <h2 className="qcard__stem">Debrief</h2>
          <p className="exam__score"><span className="mono" data-cbm>{t.score}</span> of {t.max} certainty-marked · {Math.round(t.accuracy * 100)}% right · {paper.length - marked.length} unanswered</p>
          <table className="exam__levels">
            <thead><tr><th>Certainty</th><th>Answers</th><th>Right</th></tr></thead>
            <tbody>{t.byLevel.map((l) => <tr key={l.level}><td>C{l.level}</td><td>{l.n}</td><td>{l.n ? `${Math.round(l.accuracy * 100)}%` : '—'}</td></tr>)}</tbody>
          </table>
          <p className="demo-caption">Well calibrated means C3 answers are nearly always right and C1 answers often aren't.</p>
        </div>
        <DebriefGroups split={split} paper={paper} bank={bank} />
        <ol className="exam__review">
          {paper.map((q, i) => {
            const { stem, options } = asChoice(q);
            const a = answers[i];
            const right = options.findIndex((o) => o.correct);
            const ok = a.chosen === right;
            return (
              <li key={q.id} className="exam__item" data-result={a.chosen === null ? 'blank' : ok ? 'right' : 'wrong'}>
                <p className="exam__q"><span className="mono">{i + 1}.</span> {stem}</p>
                <p className="exam__a">{a.chosen === null ? 'Not answered.' : <>You: {options[a.chosen].text} (C{a.certainty ?? 1}, {cbm(a.certainty ?? 1, ok) >= 0 ? '+' : ''}{cbm(a.certainty ?? 1, ok)})</>}</p>
                {!ok && <p className="exam__a">Answer: {options[right].text}</p>}
                <details><summary>Why</summary>{a.chosen !== null && !ok && <p><em>Why yours is tempting:</em> {options[a.chosen].why}</p>}<p><em>Why the right one is right:</em> {options[right].why}</p></details>
              </li>
            );
          })}
        </ol>
      </section>
    );
  }

  const answered = answers.filter((a) => a.chosen !== null).length;
  return (
    <section className="exam exam--paper">
      <div className="exam__bar">
        <TimerArc total={total} remaining={left} size={56} />
        <p className="quiz__count">{answered} of {paper.length} answered</p>
        <button type="button" className="btn btn--primary" onClick={finish}>Finish</button>
      </div>
      <ol className="exam__paper">
        {paper.map((q, i) => {
          const { stem, options } = asChoice(q);
          return (
            <li key={q.id} className="exam__item" data-question={q.id}>
              <p className="exam__q"><span className="mono">{i + 1}.</span> {stem}</p>
              <div className="confidence" role="radiogroup" aria-label={`Certainty for question ${i + 1}`}>
                {([1, 2, 3] as Certainty[]).map((c) => (
                  <button key={c} type="button" role="radio" aria-checked={answers[i].certainty === c} className="chip confidence__opt" onClick={() => set(i, { certainty: c })}>C{c}</button>
                ))}
              </div>
              <ul className="exam__options" role="radiogroup" aria-label={`Options for question ${i + 1}`}>
                {options.map((o, k) => (
                  <li key={k}>
                    <button type="button" role="radio" aria-checked={answers[i].chosen === k} className="option" data-state={answers[i].chosen === k ? 'chosen' : undefined} onClick={() => set(i, { chosen: k })}>
                      <span className="option__key" aria-hidden="true">{String.fromCharCode(65 + k)}</span><span>{o.text}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ol>
      <div className="qcard__next"><button type="button" className="btn btn--primary" onClick={finish}>Finish the paper</button></div>
    </section>
  );
}
