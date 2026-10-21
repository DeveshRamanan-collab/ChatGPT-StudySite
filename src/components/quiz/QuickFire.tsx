// Quick-fire: 60 seconds of true/false. No confidence step (speed retrieval); keys T / F (or ← / →).
// Each answer flashes sage or clay for 300ms, then the next statement; misses are explained at the end.
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { recordAttempt } from '../../lib/learning';
import { TimerArc } from '../ui/TimerArc';
import type { Bank, TrueFalseQ } from './types';

const SECONDS = 60;

export function QuickFire({ bank, seed }: { bank: Bank; seed: number }) {
  const pool = useMemo(() => {
    const tf = bank.questions.filter((q): q is TrueFalseQ => q.type === 'truefalse');
    const quick = tf.filter((q) => q.set === 'quickfire');
    let s = seed % 2147483647 || 1;
    const r = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
    return (quick.length >= 10 ? quick : tf).map((q) => ({ q, k: r() })).sort((a, b) => a.k - b.k).map((x) => x.q);
  }, [bank, seed]);
  const [state, setState] = useState<'ready' | 'running' | 'done'>('ready');
  const [left, setLeft] = useState(SECONDS);
  const [i, setI] = useState(0);
  const [flash, setFlash] = useState<'correct' | 'incorrect' | null>(null);
  const [log, setLog] = useState<{ q: TrueFalseQ; answer: boolean; correct: boolean }[]>([]);
  const shownAt = useRef(0);
  const busy = useRef(false);

  useEffect(() => {
    if (state !== 'running') return;
    const t = setInterval(() => setLeft((s) => { if (s <= 1) { setState('done'); return 0; } return s - 1; }), 1000);
    return () => clearInterval(t);
  }, [state]);

  const answer = (value: boolean) => {
    if (state !== 'running' || busy.current || !pool[i]) return;
    busy.current = true;
    const q = pool[i];
    const correct = value === q.answer;
    setFlash(correct ? 'correct' : 'incorrect');
    setLog((l) => [...l, { q, answer: value, correct }]);
    recordAttempt({ questionId: q.id, unit: q.unit, concept: q.concept, week: q.week, type: 'truefalse', answer: value, correct, mode: 'quickfire', durationMs: Math.round(performance.now() - shownAt.current) }).catch(() => {});
    setTimeout(() => {
      setFlash(null);
      busy.current = false;
      shownAt.current = performance.now();
      if (i + 1 >= pool.length) setState('done');
      else setI(i + 1);
    }, 300);
  };

  useLayoutEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (state === 'ready' && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); start(); return; }
      const k = e.key.toLowerCase();
      if (k === 't' || e.key === 'ArrowLeft') { e.preventDefault(); answer(true); }
      if (k === 'f' || e.key === 'ArrowRight') { e.preventDefault(); answer(false); }
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  });

  const start = () => { setState('running'); setLeft(SECONDS); shownAt.current = performance.now(); };

  if (!pool.length) return <p className="quiz__empty">No true/false questions here yet.</p>;

  if (state === 'ready')
    return (
      <section className="qf qcard">
        <h2 className="qcard__stem">Sixty seconds, true or false</h2>
        <p>As many as you can. <kbd className="kbd">T</kbd> or <kbd className="kbd">←</kbd> for true, <kbd className="kbd">F</kbd> or <kbd className="kbd">→</kbd> for false.</p>
        <button type="button" className="btn btn--primary" onClick={start}>Start</button>
      </section>
    );

  if (state === 'done') {
    const right = log.filter((x) => x.correct).length;
    const misses = log.filter((x) => !x.correct);
    return (
      <section className="qf qcard" aria-live="polite">
        <h2 className="qcard__stem" data-qf-result>{right} of {log.length} in sixty seconds</h2>
        {misses.length > 0 && (
          <>
            <h3 className="explain__h">Worth a second look</h3>
            <ul className="qf__misses">{misses.map((m) => <li key={m.q.id}><strong>{m.q.statement}</strong> — {m.q.answer ? 'True' : 'False'}. {m.q.why}</li>)}</ul>
          </>
        )}
      </section>
    );
  }

  const q = pool[i];
  return (
    <section className="qf qcard" data-flash={flash ?? undefined}>
      <div className="qf__top">
        <TimerArc total={SECONDS} remaining={left} size={56} />
        <p className="quiz__count">{log.length} answered</p>
      </div>
      <h2 className="qcard__stem qf__statement" key={q.id}>{q.statement}</h2>
      <div className="qf__buttons">
        <button type="button" className="btn btn--secondary qf__btn" onClick={() => answer(true)}>True <kbd className="kbd">T</kbd></button>
        <button type="button" className="btn btn--secondary qf__btn" onClick={() => answer(false)}>False <kbd className="kbd">F</kbd></button>
      </div>
    </section>
  );
}
