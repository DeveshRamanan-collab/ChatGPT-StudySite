// Question bank browser: filter by week, concept, type and difficulty; see each question's status (never seen,
// last right, last wrong); select any subset and re-test exactly that set in the quiz (mode "set").
import { useEffect, useMemo, useState } from 'react';
import { outcome } from '../../lib/selectors';
import { startStudySync, useStudy } from '../../lib/store';
import { asChoice, loadBank, type Bank, type Question } from './types';

export const SET_KEY = 'studysite:retest-set';
const TYPES = [['mcq', 'Multiple choice'], ['truefalse', 'True/false'], ['short', 'Short answer'], ['long', 'Long'], ['match', 'Match']] as const;
const label = (q: Question) => (q.type === 'mcq' || q.type === 'truefalse' ? asChoice(q).stem : q.prompt);

export default function BankBrowser({ unit }: { unit: string }) {
  const [bank, setBank] = useState<Bank | null>(null);
  const [week, setWeek] = useState('');
  const [concept, setConcept] = useState('');
  const [types, setTypes] = useState<Set<string>>(new Set());
  const [diff, setDiff] = useState<Set<number>>(new Set());
  const [status, setStatus] = useState<'' | 'new' | 'wrong' | 'right'>('');
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const attempts = useStudy((s) => s.attempts);

  useEffect(() => {
    startStudySync();
    loadBank(unit).then(setBank).catch(() => {});
  }, [unit]);

  const last = useMemo(() => {
    const m = new Map<string, number | null>();
    for (const a of [...attempts].sort((x, y) => x.at - y.at)) m.set(a.questionId, outcome(a));
    return m;
  }, [attempts]);
  const statusOf = (id: string) => (!last.has(id) ? 'new' : (last.get(id) ?? 0) >= 0.5 ? 'right' : 'wrong');

  const concepts = useMemo(() => Object.entries(bank?.concepts ?? {}).filter(([, c]) => !week || c.week === week), [bank, week]);
  const rows = useMemo(() => (bank?.questions ?? []).filter((q) =>
    (!week || q.week === week || bank!.concepts[q.concept]?.week === week) &&
    (!concept || q.concept === concept) &&
    (!types.size || types.has(q.type)) &&
    (!diff.size || diff.has(q.difficulty)) &&
    (!status || statusOf(q.id) === status)), [bank, week, concept, types, diff, status, last]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!bank) return <p className="quiz__empty" aria-busy="true">Loading the bank…</p>;
  const toggle = <T,>(set: Set<T>, v: T) => { const n = new Set(set); n.has(v) ? n.delete(v) : n.add(v); return n; };
  const allPicked = rows.length > 0 && rows.every((q) => picked.has(q.id));
  const retest = () => {
    const ids = rows.filter((q) => picked.has(q.id)).map((q) => q.id);
    try { sessionStorage.setItem(SET_KEY, JSON.stringify(ids)); } catch {}
    location.href = `/${unit}/quiz?mode=set`;
  };
  const chosen = rows.filter((q) => picked.has(q.id)).length;

  return (
    <div className="bank">
      <form className="bank__filters" onSubmit={(e) => e.preventDefault()} aria-label="Filter questions">
        <label className="bank__field"><span className="label">Week</span>
          <select value={week} onChange={(e) => { setWeek(e.currentTarget.value); setConcept(''); }}>
            <option value="">All weeks</option>
            {bank.weeks.map((w) => <option key={w.id} value={w.id}>Week {w.number} — {w.topic}</option>)}
          </select>
        </label>
        <label className="bank__field"><span className="label">Concept</span>
          <select value={concept} onChange={(e) => setConcept(e.currentTarget.value)}>
            <option value="">All concepts</option>
            {concepts.map(([id, c]) => <option key={id} value={id}>{c.title}</option>)}
          </select>
        </label>
        <fieldset className="bank__chips"><legend className="label">Type</legend>
          {TYPES.map(([t, l]) => <button key={t} type="button" className="chip" aria-pressed={types.has(t)} onClick={() => setTypes(toggle(types, t))}>{l}</button>)}
        </fieldset>
        <fieldset className="bank__chips"><legend className="label">Difficulty</legend>
          {[1, 2, 3, 4].map((d) => <button key={d} type="button" className="chip" aria-pressed={diff.has(d)} onClick={() => setDiff(toggle(diff, d))}>{d}</button>)}
        </fieldset>
        <fieldset className="bank__chips"><legend className="label">Status</legend>
          {([['', 'Any'], ['new', 'Never seen'], ['wrong', 'Last wrong'], ['right', 'Last right']] as const).map(([v, l]) => (
            <button key={v} type="button" className="chip" aria-pressed={status === v} onClick={() => setStatus(v)}>{l}</button>
          ))}
        </fieldset>
      </form>

      <div className="bank__bar">
        <label className="bank__all"><input type="checkbox" checked={allPicked} onChange={(e) => setPicked(e.currentTarget.checked ? new Set([...picked, ...rows.map((q) => q.id)]) : new Set([...picked].filter((id) => !rows.some((q) => q.id === id))))} /> Select all {rows.length}</label>
        <button type="button" className="btn btn--primary btn--sm" disabled={!chosen} onClick={retest}>Re-test {chosen || ''} {chosen === 1 ? 'question' : 'questions'}</button>
      </div>

      <ol className="bank__list" aria-live="polite" data-count={rows.length}>
        {rows.slice(0, 300).map((q) => {
          const st = statusOf(q.id);
          return (
            <li key={q.id} className="bank__row" data-status={st}>
              <input type="checkbox" aria-label={`Select: ${label(q).slice(0, 80)}`} checked={picked.has(q.id)} onChange={() => setPicked(toggle(picked, q.id))} />
              <div>
                <p className="bank__q">{label(q)}</p>
                <p className="bank__meta">{bank.concepts[q.concept]?.title ?? q.concept} · {TYPES.find(([t]) => t === q.type)?.[1]}{q.type === 'long' && ` (${q.tier})`} · difficulty {q.difficulty} · <span className="bank__status">{st === 'new' ? 'never seen' : st === 'right' ? 'last right' : 'last wrong'}</span></p>
              </div>
            </li>
          );
        })}
      </ol>
      {rows.length > 300 && <p className="demo-caption">Showing 300 of {rows.length}. Narrow the filters to see the rest.</p>}
    </div>
  );
}
