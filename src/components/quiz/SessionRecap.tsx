// End-of-session recap: rings count up (600ms in full/calm, instant when off), concepts touched with their criterion
// rings, and the one thing that improved most. Informational only — no confetti, no streaks.
import { useEffect, useState } from 'react';
import type { Criterion } from '../../lib/db';
import { criterionProgress } from '../../lib/selectors';
import { useStudy } from '../../lib/store';
import { ProgressRing } from '../ui/ProgressRing';
import CriterionRing from '../CriterionRing';
import type { ConceptMeta } from './types';

export interface RecapResult { concept: string; correct: boolean }

function useCountUp(target: number, ms = 600) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (document.documentElement.dataset.motion === 'off') { setV(target); return; }
    let raf = 0;
    const t0 = performance.now();
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / ms);
      setV(target * (1 - Math.pow(1 - k, 3)));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return v;
}

export function SessionRecap({ results, before, concepts, onAgain, unit }: { results: RecapResult[]; before: Map<string, Criterion>; concepts: Record<string, ConceptMeta>; onAgain: () => void; unit: string }) {
  const after = useStudy((s) => s.criterion);
  const right = results.filter((r) => r.correct).length;
  const acc = results.length ? right / results.length : 0;
  const shown = useCountUp(acc);
  const touched = [...new Set(results.map((r) => r.concept))];
  const gains = touched
    .map((c) => ({ c, gain: criterionProgress(after.get(c)) - criterionProgress(before.get(c)), acc: results.filter((r) => r.concept === c && r.correct).length / Math.max(1, results.filter((r) => r.concept === c).length) }))
    .sort((a, b) => b.gain - a.gain || b.acc - a.acc);
  const best = gains[0];
  const words = (c: Criterion | undefined) => (!c ? 'started' : c.securedAt ? 'secured' : c.learnedAt ? 'learned' : `${c.correctInSession} of 3 toward learned`);

  return (
    <section className="recap qcard" aria-live="polite">
      <h2 className="qcard__stem">Session done</h2>
      <div className="recap__top">
        <ProgressRing value={shown} size={88} stroke={6} showValue label={`${right} of ${results.length} right`} />
        <p className="recap__line"><strong>{right} of {results.length}</strong> right across {touched.length} {touched.length === 1 ? 'concept' : 'concepts'}.</p>
      </div>
      {best && (
        <p className="recap__best" data-most-improved={best.c}>
          <span className="label">Most improved</span> {concepts[best.c]?.title ?? best.c} — now {words(after.get(best.c))}.
        </p>
      )}
      <ul className="recap__concepts">
        {touched.map((c) => (
          <li key={c}><CriterionRing conceptId={c} title={concepts[c]?.title} size={20} /> <a href={concepts[c]?.href}>{concepts[c]?.title ?? c}</a></li>
        ))}
      </ul>
      <div className="qcard__next recap__actions">
        <a className="btn btn--ghost" href={`/${unit}/errors`}>Error log</a>
        <button type="button" className="btn btn--primary" onClick={onAgain}>Another round</button>
      </div>
    </section>
  );
}
