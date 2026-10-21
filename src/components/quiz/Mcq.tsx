// MCQ / true-false card: confidence gate → options unlock → instant marking → two-sided explanation.
// Sure-and-wrong answers are re-queued (+10 min, +1 d, +4 d) by recordAttempt and marked "watch this".
// A wrong answer also names the kind of error (by confidence), offers the concept's common mistakes and the next
// practice step (AfterWrong.tsx).
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { recordAttempt, confidenceKeys } from '../../lib/learning';
import type { Confidence } from '../../lib/db';
import { ConfidenceGate } from './ConfidenceGate';
import CriterionRing from '../CriterionRing';
import { AfterWrong, CommonMistakes, ErrorKind } from './AfterWrong';
import { asChoice, type ConceptMeta, type McqQ, type TrueFalseQ } from './types';

export interface McqResult { questionId: string; correct: boolean; confidence: Confidence; chosen: number }

interface Props {
  q: McqQ | TrueFalseQ;
  concept?: ConceptMeta;
  /** The unit's concept map (titles for contrast and prerequisite links); fetched lazily when not given. */
  concepts?: Record<string, ConceptMeta>;
  mode?: string;
  /** Exam simulation hides feedback until the end. */
  feedback?: boolean;
  active?: boolean;
  onAnswered?: (r: McqResult) => void;
  onNext?: () => void;
}

/** Deterministic shuffle so options move between questions but not between renders. */
function order(n: number, seed: string) {
  let h = 2166136261;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  const idx = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    const j = Math.abs(h) % (i + 1);
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx;
}

export function Mcq({ q, concept, concepts, mode = 'mixed', feedback = true, active = true, onAnswered, onNext }: Props) {
  const { stem, options } = useMemo(() => asChoice(q), [q]);
  const perm = useMemo(() => (q.type === 'truefalse' ? [0, 1] : order(options.length, q.id)), [q, options.length]);
  const [confidence, setConfidence] = useState<Confidence | null>(null);
  const [chosen, setChosen] = useState<number | null>(null);
  const unlockedAt = useRef(0);
  // Refs mirror state synchronously so rapid key presses (G then 1) never hit a stale closure.
  const confRef = useRef<Confidence | null>(null);
  const chosenRef = useRef<number | null>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const correctIdx = options.findIndex((o) => o.correct);
  const marked = chosen !== null;
  const right = marked && chosen === correctIdx;

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
    const correct = i === correctIdx;
    recordAttempt({
      questionId: q.id, unit: q.unit, concept: q.concept, week: q.week, type: q.type, answer: i, correct, confidence: conf, mode,
      durationMs: Math.round(performance.now() - unlockedAt.current),
    }).catch((e) => console.warn(e));
    onAnswered?.({ questionId: q.id, correct, confidence: conf, chosen: i });
  };

  useEffect(() => {
    if (marked) nextRef.current?.focus({ preventScroll: true });
  }, [marked]);

  // Layout effect: the listener exists before the card is painted, so no key press can arrive first.
  useLayoutEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || (e.target as HTMLElement)?.closest('input, textarea, [contenteditable]')) return;
      const k = e.key.toLowerCase();
      if (!confRef.current && confidenceKeys[k]) { e.preventDefault(); choose(confidenceKeys[k]); return; }
      const n = Number(e.key);
      if (confRef.current && chosenRef.current === null && n >= 1 && n <= perm.length) { e.preventDefault(); answer(perm[n - 1]); return; }
      if (chosenRef.current !== null && (e.key === 'Enter' || e.key === 'ArrowRight') && onNext && document.activeElement !== nextRef.current) { e.preventDefault(); onNext(); }
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  });

  const stateOf = (i: number) => {
    if (!marked || !feedback) return marked && i === chosen ? 'chosen' : undefined;
    if (i === correctIdx) return 'correct';
    if (i === chosen) return 'incorrect';
    return undefined;
  };

  return (
    <article className="qcard" data-question={q.id} aria-labelledby={`${q.id}-stem`}>
      <p className="qcard__meta">
        <CriterionRing conceptId={q.concept} title={concept?.title} size={16} />
        {concept?.title ?? q.concept}
        <span aria-hidden="true"> · </span>
        {q.type === 'truefalse' ? 'True or false' : 'Multiple choice'}
      </p>
      <h2 className="qcard__stem" id={`${q.id}-stem`}>{stem}</h2>

      <ConfidenceGate value={confidence} onChange={choose} disabled={marked} />

      <ol className="qcard__options" aria-label="Options">
        {perm.map((i, pos) => (
          <li key={i}>
            <button
              type="button"
              className="option"
              data-state={stateOf(i)}
              disabled={!confidence || marked}
              aria-describedby={marked && feedback ? `${q.id}-explain` : undefined}
              onClick={() => answer(i)}
            >
              <span className="option__key" aria-hidden="true">{pos + 1}</span>
              <span>{options[i].text}</span>
              {marked && feedback && i === correctIdx && <span className="visually-hidden"> (correct answer)</span>}
              {marked && feedback && i === chosen && i !== correctIdx && <span className="visually-hidden"> (your answer, incorrect)</span>}
            </button>
          </li>
        ))}
      </ol>
      {!confidence && <p className="qcard__hint">Choose how sure you are to unlock the options.</p>}

      {marked && feedback && (
        <section className="explain" id={`${q.id}-explain`} aria-live="polite" data-result={right ? 'right' : 'wrong'}>
          <p className="explain__verdict">{right ? 'Right.' : 'Not quite.'}</p>
          {!right && confidence && <ErrorKind confidence={confidence} />}
          {!right && (
            <>
              <h3 className="explain__h">Why yours is tempting</h3>
              <p>{options[chosen!].why}</p>
            </>
          )}
          <h3 className="explain__h">Why the right one is right</h3>
          <p>{options[correctIdx].why}</p>
          {right && options.length > 2 && (
            <details className="explain__others">
              <summary>Why the others are tempting</summary>
              <ul>{options.map((o, i) => (i === correctIdx ? null : <li key={i}><strong>{o.text}</strong> — {o.why}</li>))}</ul>
            </details>
          )}
          {!right && confidence === 'sure' && (
            <p className="explain__watch" data-watch>Watch this one: it comes back in 10 minutes, tomorrow and in four days.</p>
          )}
          {!right && <CommonMistakes unit={q.unit} concept={q.concept} />}
          {!right && mode !== 'pretest' && <AfterWrong unit={q.unit} conceptId={q.concept} concept={concept} concepts={concepts} />}
          {concept && <p className="explain__link"><a href={concept.href}>Revisit {concept.title}</a></p>}
        </section>
      )}

      {marked && onNext && (
        <div className="qcard__next">
          <button ref={nextRef} type="button" className="btn btn--primary" onClick={onNext}>Next <kbd className="kbd" aria-hidden="true">↵</kbd></button>
        </div>
      )}
    </article>
  );
}
