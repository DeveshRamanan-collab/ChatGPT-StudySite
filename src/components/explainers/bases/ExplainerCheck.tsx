// The one-question check that ends every explainer. Recorded as an attempt so it feeds the criterion tracker.
import { useState } from 'react';
import { recordAttempt } from '../../../lib/learning';
import { useExplainer } from '../context';

export interface CheckOption { text: string; correct?: boolean; why: string }

export function ExplainerCheck({ question, options }: { question: string; options: CheckOption[] }) {
  const { conceptId, unit } = useExplainer();
  const [chosen, setChosen] = useState<number | null>(null);
  const right = options.findIndex((o) => o.correct);
  const answer = (i: number) => {
    if (chosen !== null) return;
    setChosen(i);
    recordAttempt({ questionId: `explainer:${conceptId}`, unit, concept: conceptId, type: 'mcq', answer: i, correct: i === right, mode: 'explainer', durationMs: 0 }).catch(() => {});
  };
  return (
    <section className="xcheck" aria-labelledby={`xcheck-${conceptId}`}>
      <p className="label">Check</p>
      <h3 className="xcheck__q" id={`xcheck-${conceptId}`}>{question}</h3>
      <div className="xcheck__opts">
        {options.map((o, i) => (
          <button key={i} type="button" className="option" disabled={chosen !== null}
            data-state={chosen === null ? undefined : i === right ? 'correct' : i === chosen ? 'incorrect' : undefined} onClick={() => answer(i)}>
            {o.text}
          </button>
        ))}
      </div>
      {chosen !== null && <p className="xcheck__why" aria-live="polite">{chosen === right ? 'Right. ' : 'Not quite. '}{options[chosen === right ? right : chosen].why}{chosen !== right && ` ${options[right].why}`}</p>}
    </section>
  );
}
