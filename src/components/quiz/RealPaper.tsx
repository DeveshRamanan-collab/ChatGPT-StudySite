// Full-length exam paper with the real timing from the unit file (raw/<unit>/unit.yaml → src/lib/exam.ts): reading,
// working and technical time as the timetable states them, or one block when only the total is given. The timetable
// does not say how many questions there are, so the paper takes long questions (full tier first) until their own
// suggested times fill the working time, and the intro says so.
// Flow: intro → sitting (one TimerArc across every phase, the phase named, each question with its own answer box,
// autosaved for this tab) → marking (each answer beside its rubric; ticks score live) → saved as attempts.
import { useEffect, useMemo, useRef, useState } from 'react';
import { TimerArc } from '../ui/TimerArc';
import { RubricPanel } from './RubricPanel';
import { rubricScore } from '../../lib/match';
import { recordAttempt } from '../../lib/learning';
import { phases, minutesLabel, examDayLabel, examTimeLabel, type ExamInfo } from '../../lib/exam';
import type { Bank, LongQ } from './types';

const TIERS: LongQ['tier'][] = ['full', 'faded', 'worked'];

function rand(seed: number) {
  let s = seed >>> 0 || 1;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
}

/** Long questions, full tier first (shuffled within a tier), until their timers fill `minutes` (at least one). */
export function pickPaper(longs: LongQ[], minutes: number, seed: number) {
  const r = rand(seed);
  const ordered = TIERS.flatMap((t) => longs.filter((q) => q.tier === t).map((q) => ({ q, k: r() })).sort((a, b) => a.k - b.k).map((x) => x.q));
  const out: LongQ[] = [];
  let used = 0;
  for (const q of ordered) {
    if (out.length && used + q.timer > minutes) continue;
    out.push(q);
    used += q.timer;
    if (used >= minutes) break;
  }
  return out;
}

export default function RealPaper({ unit, bank, exam, seed }: { unit: string; bank: Bank; exam: ExamInfo; seed: number }) {
  const longs = useMemo(() => bank.questions.filter((q): q is LongQ => q.type === 'long'), [bank]);
  const ph = useMemo(() => phases(exam), [exam]);
  const workMin = exam.working ?? exam.duration;
  const paper = useMemo(() => pickPaper(longs, workMin, seed), [longs, workMin, seed]);
  const total = ph.reduce((s, p) => s + p.minutes, 0) * 60;
  const [stage, setStage] = useState<'intro' | 'sitting' | 'marking' | 'saved'>('intro');
  const [left, setLeft] = useState(total);
  const key = (id: string) => `studysite:paper:${unit}:${id}`;
  const [texts, setTexts] = useState<Record<string, string>>({});
  const [ticks, setTicks] = useState<Record<string, Set<string>>>({});
  const began = useRef(0);

  useEffect(() => {
    try { setTexts(Object.fromEntries(paper.map((q) => [q.id, sessionStorage.getItem(key(q.id)) ?? '']))); } catch { /* private mode */ }
  }, [paper]);
  useEffect(() => {
    if (stage !== 'sitting') return;
    const t = setInterval(() => setLeft(Math.max(0, total - Math.round((performance.now() - began.current) / 1000))), 1000);
    return () => clearInterval(t);
  }, [stage, total]);

  const elapsed = total - left;
  let acc = 0;
  const current = ph.find((p) => (acc += p.minutes * 60) > elapsed) ?? ph[ph.length - 1];
  const write = (id: string, v: string) => { setTexts((t) => ({ ...t, [id]: v })); try { sessionStorage.setItem(key(id), v); } catch { /* ignore */ } };
  const tick = (id: string, row: string, on: boolean) => setTicks((m) => { const s = new Set(m[id] ?? []); on ? s.add(row) : s.delete(row); return { ...m, [id]: s }; });

  if (!paper.length) return <p className="quiz__empty">No long questions for this unit yet, so there is no full paper to sit.</p>;

  if (stage === 'intro') return (
    <section className="paper">
      <h2 className="paper__h">Full-length paper</h2>
      <p>Your exam: {examDayLabel(exam.start)} at {examTimeLabel(exam.start)} (Sydney time) · {exam.mode}{exam.status === 'draft' ? ' · draft timetable' : ''}.</p>
      <p>Timing as the timetable states it: {ph.map((p) => `${p.label.toLowerCase()} ${minutesLabel(p.minutes)}`).join(', then ')} — {minutesLabel(total / 60)} in all.{exam.notes ? ` ${exam.notes}` : ''}</p>
      <p className="paper__note">The timetable does not say how many questions the paper has. This one gives you {paper.length} {paper.length === 1 ? 'question' : 'questions'} whose suggested times add up to the working time ({minutesLabel(workMin)}).</p>
      <ol className="paper__list">{paper.map((q) => <li key={q.id}>{q.template === 'ilac' ? 'Problem question' : 'Essay'} · {minutesLabel(q.timer)} · {bank.concepts[q.concept]?.title ?? q.concept}</li>)}</ol>
      <button type="button" className="btn btn--primary" onClick={() => { began.current = performance.now(); setLeft(total); setStage('sitting'); }}>Begin the paper</button>
    </section>
  );

  if (stage === 'sitting') return (
    <section className="paper paper--sitting">
      <div className="paper__clock">
        <TimerArc total={total} remaining={left} size={56} />
        <p className="paper__phase" aria-live="polite">{left === 0 ? 'Time. Finish your sentence.' : `${current.label}${current.kind === 'reading' || current.kind === 'technical' ? ' (working permitted)' : ''}`}</p>
      </div>
      <ol className="paper__qs">
        {paper.map((q, i) => (
          <li key={q.id} className="paper__q">
            <h3 className="paper__qh">Question {i + 1} <span className="paper__qmeta">· suggested {minutesLabel(q.timer)}</span></h3>
            <div className="la__scenario">{q.prompt.split(/\n+/).map((p, j) => <p key={j}>{p}</p>)}</div>
            <label className="visually-hidden" htmlFor={`paper-${q.id}`}>Your answer to question {i + 1}</label>
            <textarea id={`paper-${q.id}`} className="paper__answer" rows={12} value={texts[q.id] ?? ''} onChange={(e) => write(q.id, e.target.value)} />
          </li>
        ))}
      </ol>
      <div className="qcard__next"><button type="button" className="btn btn--primary" onClick={() => setStage('marking')}>Finish and mark</button></div>
    </section>
  );

  const save = async () => {
    const per = Math.round((performance.now() - began.current) / Math.max(1, paper.length));
    for (const q of paper) {
      const t = ticks[q.id] ?? new Set<string>();
      await recordAttempt({ questionId: q.id, unit: q.unit, concept: q.concept, week: q.week, type: 'long', tier: q.tier, correct: null, score: rubricScore(q.rubric, t).score, rubricTicks: [...t], answer: { text: texts[q.id] ?? '' }, mode: 'paper', durationMs: per });
    }
    try { paper.forEach((q) => sessionStorage.removeItem(key(q.id))); } catch { /* ignore */ }
    setStage('saved');
  };
  const sum = paper.reduce((s, q) => { const r = rubricScore(q.rubric, ticks[q.id] ?? new Set()); return { got: s.got + r.got, total: s.total + r.total }; }, { got: 0, total: 0 });

  return (
    <section className="paper paper--marking">
      <h2 className="paper__h">Mark your paper</h2>
      <p>Tick each criterion your answer meets; open a row to see what a top answer includes. <span className="mono">{sum.got}</span> / {sum.total} so far.</p>
      <ol className="paper__qs">
        {paper.map((q, i) => (
          <li key={q.id} className="paper__q">
            <h3 className="paper__qh">Question {i + 1}</h3>
            <details className="paper__prompt"><summary>The question</summary>{q.prompt.split(/\n+/).map((p, j) => <p key={j}>{p}</p>)}</details>
            <div className="paper__mine">{(texts[q.id] ?? '').trim() ? texts[q.id].split(/\n+/).map((p, j) => <p key={j}>{p}</p>) : <p className="paper__note">No answer written.</p>}</div>
            <RubricPanel rows={q.rubric} ticked={ticks[q.id] ?? new Set()} onTick={(row, on) => tick(q.id, row, on)} onFocusRow={() => {}} />
            <details className="paper__model"><summary>Model answer</summary>{q.model.split(/\n+/).map((p, j) => <p key={j}>{p}</p>)}</details>
          </li>
        ))}
      </ol>
      <div className="qcard__next">
        {stage === 'saved' ? <p className="paper__saved" role="status">Saved. Each answer counts towards its concept and tier.</p>
          : <button type="button" className="btn btn--primary" onClick={save}>Save the marks</button>}
      </div>
    </section>
  );
}
