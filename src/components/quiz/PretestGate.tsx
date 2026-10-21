// Pretest gate: on the first visit to a week, its 5 pretest questions come before the notes (skippable; the skip is
// logged). Feedback is immediate. Completion or skip is stored in Dexie (settings `pretest:<week>`) and mirrored in
// localStorage so the inline gate script can decide before first paint on later visits.
import { useEffect, useState } from 'react';
import { db } from '../../lib/db';
import { startStudySync } from '../../lib/store';
import { Mcq, type McqResult } from './Mcq';
import { type Bank, type McqQ, type TrueFalseQ } from './types';

export const pretestKey = (week: string) => `studysite:pretest:${week}`;

function reveal(week: string, status: 'done' | 'skipped', results: McqResult[]) {
  try { localStorage.setItem(pretestKey(week), status); } catch {}
  db.settings.put({ key: `pretest:${week}`, value: { status, at: Date.now(), correct: results.filter((r) => r.correct).length, answered: results.length } }).catch(() => {});
  delete document.documentElement.dataset.pretest;
  document.getElementById('notes')?.focus({ preventScroll: true });
}

export default function PretestGate({ unit, week, ids }: { unit: string; week: string; ids: string[] }) {
  const [pending, setPending] = useState(false);
  const [bank, setBank] = useState<Bank | null>(null);
  const [i, setI] = useState(0);
  const [results, setResults] = useState<McqResult[]>([]);

  useEffect(() => {
    const p = document.documentElement.dataset.pretest === week;
    setPending(p);
    if (!p) return; // Later visits: nothing to load.
    startStudySync();
    fetch(`/data/${unit}/pretest.json`).then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json() as Promise<Bank>; }).then(setBank).catch(() => reveal(week, 'skipped', []));
  }, [unit, week]);

  if (!pending) return null;
  const items = (bank?.questions.filter((q): q is McqQ | TrueFalseQ => ids.includes(q.id) && (q.type === 'mcq' || q.type === 'truefalse')) ?? [])
    .sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));
  const finish = (status: 'done' | 'skipped') => { reveal(week, status, results); setPending(false); };
  const done = bank !== null && i >= items.length;

  return (
    <section className="pretest" aria-labelledby="pretest-title" data-pretest-count={items.length}>
      <div className="pretest__head">
        <div>
          <p className="label">Before you read</p>
          <h2 id="pretest-title" className="pretest__title">{ids.length} quick questions first</h2>
          <p className="pretest__lede">Guessing is fine. Trying first makes the notes stick.</p>
        </div>
        {!done && <button type="button" className="btn btn--ghost btn--sm" onClick={() => finish('skipped')}>Skip to the notes</button>}
      </div>
      {!bank && <p aria-busy="true">Loading…</p>}
      {bank && !done && items[i] && (
        <div className="quiz__stage" key={items[i].id}>
          <p className="quiz__count">Pretest {i + 1} of {items.length}</p>
          <Mcq q={items[i]} concept={bank.concepts[items[i].concept]} mode="pretest" onAnswered={(r) => setResults((rs) => [...rs, r])} onNext={() => setI((n) => n + 1)} />
        </div>
      )}
      {done && (
        <div className="pretest__done" aria-live="polite">
          <p>{results.filter((r) => r.correct).length} of {items.length} before reading. Now the notes.</p>
          <button type="button" className="btn btn--primary" onClick={() => finish('done')}>Read the notes</button>
        </div>
      )}
    </section>
  );
}
