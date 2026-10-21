// "Where am I?" (?mode=diagnostic; feature 131): one question per week (the week's pretest set first, else any
// multiple-choice or true/false question, never-seen first), run through the usual QuizRunner as a fixed set, then a
// starting map: every week as a row with its result and a link to the week's notes.
import { useMemo, useState, type CSSProperties } from 'react';
import { diagnosticMap, diagnosticSet } from '../../lib/drills';
import { useStudy } from '../../lib/store';
import QuizRunner from './QuizRunner';
import type { Bank } from './types';
import '../../styles/drills.css';

export default function Diagnostic({ bank, seed }: { bank: Bank; seed: number }) {
  const attempts = useStudy((s) => s.attempts);
  // Fixed when the diagnostic opens: answers recorded during it must not change the set.
  const [{ rows, since }] = useState(() => ({ rows: diagnosticSet(bank, useStudy.getState().attempts, seed), since: Date.now() }));
  const ids = useMemo(() => rows.map((r) => r.id), [rows]);
  const map = useMemo(() => diagnosticMap(rows, attempts, since), [rows, attempts, since]);
  const complete = map.length > 0 && map.every((r) => r.correct !== null);
  const right = map.filter((r) => r.correct).length;

  if (!rows.length) return <p className="quiz__empty">No questions here yet.</p>;

  return (
    <div className="diagnostic" data-diagnostic={rows.length}>
      <p className="diagnostic__lede">One question from each of the {rows.length} weeks, to see where you stand. Your starting map appears when you finish.</p>
      <QuizRunner key="diagnostic" bank={bank} mode="set" ids={ids} seed={seed} />
      {complete && (
        <section className="diagnostic__map" aria-labelledby="diagnostic-map-h" aria-live="polite">
          <h2 className="diagnostic__h" id="diagnostic-map-h">Your starting map</h2>
          <p className="diagnostic__sum">
            Right in {right} of {map.length} weeks.{right < map.length ? ' The weeks marked “Wrong” are the place to start.' : ' A strong start: keep the weeks fresh with Mixed.'}
          </p>
          <ol className="diagnostic__rows">
            {map.map((r, k) => (
              <li key={r.week.id} className="diagnostic__row" data-result={r.correct ? 'right' : 'wrong'} style={{ '--i': k } as CSSProperties}>
                <a className="diagnostic__link" href={`/${bank.unit}/week/${r.week.number}`}>
                  <span className="diagnostic__week">Week {r.week.number}</span>
                  <span className="diagnostic__topic">{r.week.topic}</span>
                  <span className="diagnostic__result"><span className="diagnostic__dot" aria-hidden="true" />{r.correct ? 'Right' : 'Wrong'}</span>
                </a>
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}
