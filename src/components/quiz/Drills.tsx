// "Drills" (?mode=drills; features 13, 95, 139, 140): short drills built from the unit's study aids, mixed by kind and
// interleaved by week. Spot the error (confidence first, auto-marked) · What if (one-line prediction) · Edge case
// (in or out?) · Transfer (apply it to a new scenario). The last three reveal the answer and are self-rated
// Right / Partly / Missed. Attempts use ids `drill:<kind>:<concept>:<index>` and mode 'drill'.
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { loadAids, type Aid } from '../../lib/aids';
import type { Confidence } from '../../lib/db';
import { buildDrills, DRILL_LABEL, pickDrills, SELF_SCORE, type Drill, type EdgeDrill, type SelfRating, type SpotDrill, type TransferDrill, type WhatIfDrill } from '../../lib/drills';
import { confidenceKeys, recordAttempt } from '../../lib/learning';
import { useStudy } from '../../lib/store';
import { ConfidenceGate } from './ConfidenceGate';
import type { Bank } from './types';
import '../../styles/drills.css';

const SET = 8;
const typing = (e: KeyboardEvent) => e.metaKey || e.ctrlKey || e.altKey || !!(e.target as HTMLElement)?.closest('input, textarea, [contenteditable]');

interface CardProps<D extends Drill> { d: D; bank: Bank; onResult: (score: number) => void; onNext: () => void }

export default function Drills({ bank, seed, concept }: { bank: Bank; seed: number; concept?: string }) {
  const attempts = useStudy((s) => s.attempts);
  const [aids, setAids] = useState<Record<string, Aid> | null>(null);
  useEffect(() => {
    let live = true;
    loadAids(bank.unit).then((b) => { if (live) setAids(b.aids); });
    return () => { live = false; };
  }, [bank.unit]);
  const all = useMemo(() => (aids ? buildDrills(aids, seed) : []), [aids, seed]);
  const [round, setRound] = useState(0);
  // A set is fixed once drawn: answers recorded during it must not reshuffle it.
  const items = useMemo(
    () => pickDrills({ drills: all, attempts, n: SET, seed: seed + round * 7919, concept }),
    [all, seed, round, concept], // eslint-disable-line react-hooks/exhaustive-deps
  );
  const [i, setI] = useState(0);
  const [scores, setScores] = useState<number[]>([]);

  if (!aids) return <p className="quiz__empty" aria-busy="true">Loading drills…</p>;
  if (!all.length) return <p className="quiz__empty" data-drills-empty>Drills arrive as study aids are added for this unit.</p>;
  if (!items.length) {
    return (
      <p className="quiz__empty" data-drills-empty>
        No drills for {bank.concepts[concept!]?.title ?? 'this idea'} yet. <a href={`/${bank.unit}/quiz?mode=drills`}>All drills</a>
      </p>
    );
  }

  const done = i >= items.length;
  const d = items[i];
  const onResult = (s: number) => setScores((xs) => [...xs, s]);
  const next = () => setI((n) => n + 1);
  const again = () => { setRound((r) => r + 1); setI(0); setScores([]); };
  const count = (s: number) => scores.filter((x) => x === s).length;

  return (
    <div className="quiz drill" data-focus-keep>
      <div className="quiz__progress" role="progressbar" aria-label="Drill progress" aria-valuemin={0} aria-valuemax={items.length} aria-valuenow={Math.min(i, items.length)}>
        <span style={{ transform: `scaleX(${Math.min(i, items.length) / items.length})` }} />
      </div>
      {done ? (
        <section className="drill__recap" aria-live="polite" data-recap>
          <h2 className="drill__recap-h">Set done</h2>
          <p>{items.length} drills: {count(1)} right, {count(0.5)} partly, {count(0)} missed.</p>
          <div className="drill__actions">
            <button type="button" className="btn btn--primary" onClick={again}>Another set</button>
          </div>
        </section>
      ) : (
        <div className="quiz__stage" key={`${round}-${d.id}`}>
          <p className="quiz__count">Drill {i + 1} of {items.length}</p>
          {d.kind === 'spot' ? (
            <SpotCard d={d} bank={bank} onResult={onResult} onNext={next} />
          ) : d.kind === 'edge' ? (
            <EdgeCard d={d} bank={bank} onResult={onResult} onNext={next} />
          ) : (
            <PredictCard d={d} bank={bank} onResult={onResult} onNext={next} />
          )}
        </div>
      )}
    </div>
  );
}

function Meta({ d, bank, showConcept = true }: { d: Drill; bank: Bank; showConcept?: boolean }) {
  const week = bank.weeks.find((w) => w.id === d.week);
  return (
    <p className="qcard__meta">
      {DRILL_LABEL[d.kind]}
      {week && <><span aria-hidden="true"> · </span>Week {week.number}</>}
      {showConcept && <><span aria-hidden="true"> · </span>{bank.concepts[d.concept]?.title ?? d.concept}</>}
    </p>
  );
}

function Next({ onNext, show }: { onNext: () => void; show: boolean }) {
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (show) ref.current?.focus({ preventScroll: true }); }, [show]);
  useLayoutEffect(() => {
    if (!show) return;
    const onKey = (e: KeyboardEvent) => {
      if (typing(e) || document.activeElement === ref.current) return;
      if (e.key === 'Enter' || e.key === 'ArrowRight') { e.preventDefault(); onNext(); }
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  });
  if (!show) return null;
  return (
    <div className="qcard__next">
      <button ref={ref} type="button" className="btn btn--primary" onClick={onNext}>Next <kbd className="kbd" aria-hidden="true">↵</kbd></button>
    </div>
  );
}

const RATES: { id: SelfRating; label: string }[] = [
  { id: 'right', label: 'Right' },
  { id: 'partly', label: 'Partly' },
  { id: 'missed', label: 'Missed' },
];

/** Self-rating after a reveal (keys 1 / 2 / 3). Records the attempt as type 'short' with score 1 / 0.5 / 0. */
function SelfRate({ d, answer, started, question, onResult }: { d: Drill; answer: unknown; started: number; question: string; onResult: (s: number) => void }) {
  const [rated, setRated] = useState<SelfRating | null>(null);
  const ratedRef = useRef<SelfRating | null>(null);
  const rate = (r: SelfRating) => {
    if (ratedRef.current) return;
    ratedRef.current = r;
    setRated(r);
    recordAttempt({
      questionId: d.id, unit: d.unit, concept: d.concept, week: d.week, type: 'short', answer, correct: null, score: SELF_SCORE[r], mode: 'drill',
      durationMs: Math.round(performance.now() - started),
    }).catch((e) => console.warn(e));
    onResult(SELF_SCORE[r]);
  };
  useLayoutEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (typing(e) || ratedRef.current) return;
      const n = Number(e.key);
      if (n >= 1 && n <= RATES.length) { e.preventDefault(); rate(RATES[n - 1].id); }
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  });
  return (
    <div className="drill__rate" role="group" aria-label={question} data-rated={rated ?? undefined}>
      <span className="drill__rate-label">{question}</span>
      <span className="drill__rate-opts">
        {RATES.map((r, k) => (
          <button key={r.id} type="button" className="btn btn--secondary drill__rate-btn" aria-pressed={rated === r.id} disabled={rated !== null} onClick={() => rate(r.id)}>
            {r.label} <kbd className="kbd" aria-hidden="true">{k + 1}</kbd>
          </button>
        ))}
      </span>
    </div>
  );
}

/** Spot the error: confidence first, then pick the one wrong statement; reveal why it tempts and the correction. */
function SpotCard({ d, bank, onResult, onNext }: CardProps<SpotDrill>) {
  const [confidence, setConfidence] = useState<Confidence | null>(null);
  const [chosen, setChosen] = useState<number | null>(null);
  const confRef = useRef<Confidence | null>(null);
  const chosenRef = useRef<number | null>(null);
  const unlockedAt = useRef(0);
  const wrongIdx = d.statements.findIndex((s) => s.wrong);
  const marked = chosen !== null;
  const right = chosen === wrongIdx;
  const concept = bank.concepts[d.concept];

  const choose = (c: Confidence) => {
    if (chosenRef.current !== null) return;
    confRef.current = c;
    setConfidence(c);
    unlockedAt.current = performance.now();
  };
  const answer = (i: number) => {
    const conf = confRef.current;
    if (!conf || chosenRef.current !== null) return;
    chosenRef.current = i;
    setChosen(i);
    const correct = i === wrongIdx;
    recordAttempt({
      questionId: d.id, unit: d.unit, concept: d.concept, week: d.week, type: 'mcq', answer: i, correct, confidence: conf, mode: 'drill',
      durationMs: Math.round(performance.now() - unlockedAt.current),
    }).catch((e) => console.warn(e));
    onResult(correct ? 1 : 0);
  };

  useLayoutEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (typing(e)) return;
      const k = e.key.toLowerCase();
      if (!confRef.current && confidenceKeys[k]) { e.preventDefault(); choose(confidenceKeys[k]); return; }
      const n = Number(e.key);
      if (confRef.current && chosenRef.current === null && n >= 1 && n <= d.statements.length) { e.preventDefault(); answer(n - 1); }
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  });

  const stateOf = (i: number) => (!marked ? undefined : i === wrongIdx ? 'correct' : i === chosen ? 'incorrect' : undefined);

  return (
    <article className="qcard drill__card" data-drill={d.id} data-kind="spot" aria-labelledby={`${d.id}-stem`}>
      {/* The concept is named only after answering: it would give away which statement is the wrong one. */}
      <Meta d={d} bank={bank} showConcept={marked} />
      <h2 className="qcard__stem" id={`${d.id}-stem`}>One of these is wrong. Which?</h2>
      <ConfidenceGate value={confidence} onChange={choose} disabled={marked} />
      <ol className="qcard__options" aria-label="Statements">
        {d.statements.map((s, i) => (
          <li key={i}>
            <button type="button" className="option" data-state={stateOf(i)} disabled={!confidence || marked} aria-describedby={marked ? `${d.id}-explain` : undefined} onClick={() => answer(i)}>
              <span className="option__key" aria-hidden="true">{i + 1}</span>
              <span>{s.text}</span>
              {marked && i === wrongIdx && <span className="visually-hidden"> (the wrong statement)</span>}
              {marked && i === chosen && i !== wrongIdx && <span className="visually-hidden"> (your choice: this one is true)</span>}
            </button>
          </li>
        ))}
      </ol>
      {!confidence && <p className="qcard__hint">Choose how sure you are to unlock the statements.</p>}
      {marked && (
        <section className="explain" id={`${d.id}-explain`} aria-live="polite" data-result={right ? 'right' : 'wrong'}>
          <p className="explain__verdict">{right ? 'Right: that one is wrong.' : `Not quite: statement ${chosen! + 1} is true. Statement ${wrongIdx + 1} is the wrong one.`}</p>
          <h3 className="explain__h">Why it is tempting</h3>
          <p>{d.tempting}</p>
          <h3 className="explain__h">The correction</h3>
          <p>{d.correction}</p>
          {concept && <p className="explain__link"><a href={concept.href}>Revisit {concept.title}</a></p>}
        </section>
      )}
      <Next onNext={onNext} show={marked} />
    </article>
  );
}

/** What if (one-line prediction) and Transfer (a short answer): write first, then reveal and self-rate. */
function PredictCard({ d, bank, onResult, onNext }: CardProps<WhatIfDrill | TransferDrill>) {
  const whatIf = d.kind === 'whatif';
  const [text, setText] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [rated, setRated] = useState(false);
  const started = useRef(performance.now());
  const panel = useRef<HTMLElement>(null);
  const canReveal = text.trim().length > 0;
  const reveal = () => { if (canReveal) setRevealed(true); };
  useEffect(() => { if (revealed) panel.current?.focus({ preventScroll: true }); }, [revealed]);
  const inputId = `${d.id}-input`;

  return (
    <article className="qcard drill__card" data-drill={d.id} data-kind={d.kind} aria-labelledby={`${d.id}-stem`}>
      <Meta d={d} bank={bank} />
      {whatIf && <p className="drill__lead">What if…</p>}
      <h2 className="qcard__stem" id={`${d.id}-stem`}>{whatIf ? d.change : d.scenario}</h2>
      {!revealed ? (
        <div className="drill__write">
          <label className="drill__label" htmlFor={inputId}>{whatIf ? 'What changes? One line is enough.' : 'Apply the idea. A few lines is plenty.'}</label>
          {whatIf ? (
            <input
              id={inputId}
              className="drill__input"
              type="text"
              autoComplete="off"
              value={text}
              onChange={(e) => setText(e.currentTarget.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); reveal(); } }}
            />
          ) : (
            <textarea
              id={inputId}
              className="drill__input drill__input--long"
              rows={4}
              value={text}
              placeholder="⌘ Enter to reveal"
              onChange={(e) => setText(e.currentTarget.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); reveal(); } }}
            />
          )}
          <div className="drill__submit">
            {!canReveal && <span className="drill__hint">Write {whatIf ? 'a prediction' : 'an answer'} first.</span>}
            <button type="button" className="btn btn--primary" disabled={!canReveal} onClick={reveal}>{whatIf ? 'Reveal' : 'Show the model answer'}</button>
          </div>
        </div>
      ) : (
        <>
          <section className="explain drill__reveal" ref={panel} tabIndex={-1} aria-live="polite">
            <h3 className="explain__h">{whatIf ? 'Your prediction' : 'Yours'}</h3>
            <p className="drill__yours">{text}</p>
            <h3 className="explain__h">{whatIf ? 'What happens' : 'Model answer'}</h3>
            <p>{whatIf ? d.effect : d.answer}</p>
          </section>
          <SelfRate d={d} answer={text} started={started.current} question="How close were you?" onResult={(s) => { setRated(true); onResult(s); }} />
        </>
      )}
      <Next onNext={onNext} show={rated} />
    </article>
  );
}

/** Edge case: the boundary text; decide "in or out?" before revealing why; self-rate. */
function EdgeCard({ d, bank, onResult, onNext }: CardProps<EdgeDrill>) {
  const [revealed, setRevealed] = useState(false);
  const [rated, setRated] = useState(false);
  const started = useRef(performance.now());
  const panel = useRef<HTMLElement>(null);
  const showRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (revealed) panel.current?.focus({ preventScroll: true }); }, [revealed]);
  useLayoutEffect(() => {
    if (revealed) return;
    const onKey = (e: KeyboardEvent) => {
      if (typing(e) || document.activeElement === showRef.current) return;
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setRevealed(true); }
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  });

  return (
    <article className="qcard drill__card" data-drill={d.id} data-kind="edge" aria-labelledby={`${d.id}-stem`}>
      <Meta d={d} bank={bank} />
      <h2 className="qcard__stem" id={`${d.id}-stem`}>{d.text}</h2>
      {!revealed ? (
        <div className="drill__submit">
          <span className="drill__think">In or out? Decide before you look.</span>
          <button ref={showRef} type="button" className="btn btn--primary" onClick={() => setRevealed(true)}>Show why <kbd className="kbd" aria-hidden="true">↵</kbd></button>
        </div>
      ) : (
        <>
          <section className="explain drill__reveal" ref={panel} tabIndex={-1} aria-live="polite">
            <h3 className="explain__h">Why</h3>
            <p>{d.why}</p>
          </section>
          <SelfRate d={d} answer={null} started={started.current} question="Did you call it?" onResult={(s) => { setRated(true); onResult(s); }} />
        </>
      )}
      <Next onNext={onNext} show={rated} />
    </article>
  );
}
