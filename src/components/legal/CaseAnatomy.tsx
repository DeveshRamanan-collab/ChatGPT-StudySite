// Case anatomy (/<unit>/case-anatomy, feature 154 stand-in): one sentence at a time from a verified case's facts,
// issue, held or ratio (fields mixed across a round of 10); the learner says which part it is (click or 1–4) and sees
// at once which field it came from, the whole field on request, and a link to the case card. A running tally, then a
// recap by field with the most frequent mix-up. The page's second tab is the fact comparison (FactCompare.tsx).
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Tabs } from '../ui/Tabs';
import FactCompare, { type CompareCase, type CompareProblem } from './FactCompare';
import { anatomyItems, buildRound, tallyAnatomy, FIELDS, FIELD_LABEL, type AnatomyAnswer, type CaseText, type Field } from '../../lib/legal';
import '../../styles/legal.css';

const ROUND = 10;
/** How feedback names a field in a sentence ("not the ratio", "Read all of what was held"). */
const FIELD_PHRASE: Record<Field, string> = { facts: 'the facts', issue: 'the issue', held: 'what was held', ratio: 'the ratio' };
/** "This is from the ratio of <case>." */
const FROM: Record<Field, string> = { facts: 'the facts of', issue: 'the issue in', held: 'what was held in', ratio: 'the ratio of' };
const typing = (e: KeyboardEvent) => e.metaKey || e.ctrlKey || e.altKey || !!(e.target as HTMLElement)?.closest('input, textarea, select, [contenteditable]');

interface Props { code: string; cases: CaseText[]; problems: CompareProblem[]; compareCases: Record<string, CompareCase> }

export default function CaseAnatomy({ code, cases, problems, compareCases }: Props) {
  return (
    <Tabs
      label="Case anatomy tools"
      tabs={[
        { label: 'Sort sentences', content: <AnatomyRound code={code} cases={cases} /> },
        { label: 'Compare facts', content: <FactCompare code={code} problems={problems} cases={compareCases} /> },
      ]}
    />
  );
}

function AnatomyRound({ code, cases }: { code: string; cases: CaseText[] }) {
  const items = useMemo(() => anatomyItems(cases), [cases]);
  const byId = useMemo(() => new Map(cases.map((k) => [k.id, k])), [cases]);
  // The seed is drawn after hydration so the server markup and the first client render agree.
  const [seed, setSeed] = useState<number | null>(null);
  useEffect(() => setSeed(Date.now() % 2147483647), []);
  const [round, setRound] = useState(0);
  const set = useMemo(() => (seed === null ? [] : buildRound(items, ROUND, seed + round * 7919)), [items, seed, round]);
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<AnatomyAnswer[]>([]);
  const [chosen, setChosen] = useState<Field | null>(null);
  const chosenRef = useRef<Field | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const sentence = useRef<HTMLQuoteElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const moved = useRef(false);

  const item = set[i];
  const done = set.length > 0 && i >= set.length;
  const tally = tallyAnatomy(answers);

  const answer = (f: Field) => {
    if (!item || chosenRef.current) return;
    chosenRef.current = f;
    setChosen(f);
    setAnswers((xs) => [...xs, { field: item.field, chosen: f }]);
  };
  const next = () => {
    chosenRef.current = null;
    setChosen(null);
    moved.current = true;
    setI((n) => n + 1);
  };
  const again = () => {
    chosenRef.current = null;
    setChosen(null);
    setAnswers([]);
    setI(0);
    moved.current = true;
    setRound((r) => r + 1);
  };

  // Focus follows the work: Next after answering, the new sentence after moving on.
  useEffect(() => { if (chosen) nextRef.current?.focus({ preventScroll: true }); }, [chosen]);
  useEffect(() => {
    if (!moved.current) return;
    moved.current = false;
    (done ? root.current?.querySelector<HTMLElement>('.anatomy__recap-h') : sentence.current)?.focus({ preventScroll: true });
  }, [i, round, done]);

  // Keys 1–4 answer; → (or Enter outside a link, button or summary) moves on; only while this tab's panel shows.
  useLayoutEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (typing(e) || !root.current || root.current.closest('[hidden]') || t?.closest?.('[role="tablist"]')) return;
      const n = Number(e.key);
      if (!chosenRef.current && item && n >= 1 && n <= FIELDS.length) { e.preventDefault(); answer(FIELDS[n - 1]); return; }
      if (!chosenRef.current) return;
      if (e.key === 'ArrowRight' || (e.key === 'Enter' && !t?.closest?.('a, button, summary'))) { e.preventDefault(); next(); }
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  });

  if (!items.length) {
    return <p className="anatomy__empty" data-anatomy-empty>No checked cases for {code} yet. Sentences appear here once the unit's case cards are verified.</p>;
  }
  if (seed === null) return <p className="anatomy__empty" aria-busy="true">Drawing a round…</p>;

  const stateOf = (f: Field) => {
    if (!chosen || !item) return undefined;
    if (f === item.field) return 'correct';
    if (f === chosen) return 'incorrect';
    return undefined;
  };

  return (
    <div className="anatomy" ref={root} data-focus-keep>
      <div className="quiz__progress" role="progressbar" aria-label="Round progress" aria-valuemin={0} aria-valuemax={set.length} aria-valuenow={Math.min(i + (chosen ? 1 : 0), set.length)}>
        <span style={{ transform: `scaleX(${Math.min(i + (chosen ? 1 : 0), set.length) / set.length})` }} />
      </div>
      {done ? (
        <section className="anatomy__recap" aria-labelledby="anatomy-recap-h" data-anatomy-recap>
          <h2 className="anatomy__recap-h" id="anatomy-recap-h" tabIndex={-1}>Round done</h2>
          <p>{tally.right} of {tally.total} sorted right.</p>
          <ul className="anatomy__fields">
            {FIELDS.filter((f) => tally.byField[f].total).map((f) => (
              <li key={f} className="anatomy__field">
                <span>{FIELD_LABEL[f]}</span>
                <span className="anatomy__dots" aria-hidden="true">
                  {answers.filter((a) => a.field === f).map((a, k) => <span key={k} className="anatomy__dot" data-right={a.chosen === f ? '' : undefined} />)}
                </span>
                <span className="anatomy__field-n">{tally.byField[f].right} of {tally.byField[f].total}</span>
              </li>
            ))}
          </ul>
          {tally.confusion && (
            <p data-anatomy-confusion>Most often mixed up: {FIELD_PHRASE[tally.confusion.field]} read as {FIELD_PHRASE[tally.confusion.chosen]} ({tally.confusion.times === 1 ? 'once' : `${tally.confusion.times} times`}).</p>
          )}
          <div className="anatomy__actions">
            <button type="button" className="btn btn--primary" onClick={again}>Another round</button>
          </div>
        </section>
      ) : item ? (
        <>
          <p className="anatomy__status">
            <span>Sentence {i + 1} of {set.length}</span>
            <span aria-live="polite" data-anatomy-tally>{answers.length ? `${tally.right} of ${answers.length} right so far` : 'Answer with 1–4'}</span>
          </p>
          <figure className="anatomy__card" key={item.id}>
            <figcaption className="anatomy__case">From <cite>{item.caseName}</cite></figcaption>
            <blockquote className="anatomy__sentence" ref={sentence} tabIndex={-1} data-anatomy-sentence>
              <p>{item.text}</p>
            </blockquote>
          </figure>
          <p className="anatomy__ask" id="anatomy-ask">Which part of the case is this?</p>
          <ol className="anatomy__options" aria-labelledby="anatomy-ask">
            {FIELDS.map((f, k) => (
              <li key={f}>
                <button type="button" className="option" data-state={stateOf(f)} disabled={chosen !== null} onClick={() => answer(f)} aria-describedby={chosen ? 'anatomy-feedback' : undefined}>
                  <span className="option__key" aria-hidden="true">{k + 1}</span>
                  <span>{FIELD_LABEL[f]}</span>
                  {chosen && f === item.field && <span className="visually-hidden"> (right answer)</span>}
                  {chosen && f === chosen && f !== item.field && <span className="visually-hidden"> (your answer)</span>}
                </button>
              </li>
            ))}
          </ol>
          {chosen && (
            <section className="anatomy__feedback" id="anatomy-feedback" aria-live="polite" data-result={chosen === item.field ? 'right' : 'wrong'}>
              <p className="anatomy__verdict">
                {chosen === item.field ? 'Right. ' : 'Not quite. '}
                This is from {FROM[item.field]} <cite>{item.caseName}</cite>{chosen !== item.field && `, not ${FIELD_PHRASE[chosen]}`}.
              </p>
              <details className="anatomy__whole">
                <summary>Read all of {FIELD_PHRASE[item.field]}</summary>
                <p>{byId.get(item.caseId)?.[item.field]}</p>
              </details>
              <p className="anatomy__link"><a href={`/cases/${item.caseId}`}>Open the case card</a></p>
              <div className="anatomy__next">
                <button ref={nextRef} type="button" className="btn btn--primary" onClick={next}>
                  {i + 1 < set.length ? 'Next sentence' : 'See the round'} <kbd className="kbd" aria-hidden="true">↵</kbd>
                </button>
              </div>
            </section>
          )}
        </>
      ) : null}
    </div>
  );
}
