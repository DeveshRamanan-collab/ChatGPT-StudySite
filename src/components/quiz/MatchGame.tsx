// Match: 60-second pairing (cases ↔ ratios, or a match question's pairs). Retrieval only: no points, no toy scoring.
// Pick a left item, then its partner on the right; right pairs lock in sage, wrong ones flash clay.
import { useEffect, useMemo, useState } from 'react';
import { recordAttempt } from '../../lib/learning';
import { TimerArc } from '../ui/TimerArc';
import type { Bank, MatchQ } from './types';

const SECONDS = 60;
const ROUND = 5;

interface Pair { left: string; right: string }

function shuffle<T>(xs: T[], seed: number) {
  let s = seed % 2147483647 || 1;
  const r = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
  return xs.map((x) => ({ x, k: r() })).sort((a, b) => a.k - b.k).map((y) => y.x);
}

export function MatchGame({ bank, seed }: { bank: Bank; seed: number }) {
  const round = useMemo(() => {
    const matches = bank.questions.filter((q): q is MatchQ => q.type === 'match' && q.pairs.length >= 3);
    const clip = (s: string) => (s.length > 140 ? `${s.slice(0, 137).replace(/\s+\S*$/, '')}…` : s);
    if (bank.cases.length >= 4) {
      const pairs = shuffle(bank.cases, seed).slice(0, ROUND).map((c) => ({ left: c.name, right: clip(c.ratio) }));
      return { title: 'Match each case to its ratio', pairs, q: null as MatchQ | null };
    }
    if (matches.length) {
      const q = shuffle(matches, seed)[0];
      return { title: q.prompt, pairs: q.pairs.slice(0, ROUND + 1), q };
    }
    return null;
  }, [bank, seed]);
  const rights = useMemo(() => (round ? shuffle(round.pairs.map((p) => p.right), seed + 1) : []), [round, seed]);
  const [state, setState] = useState<'running' | 'done'>('running');
  const [left, setLeft] = useState(SECONDS);
  const [sel, setSel] = useState<number | null>(null);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [wrong, setWrong] = useState<{ l: number; r: string } | null>(null);
  const started = useMemo(() => performance.now(), []);

  useEffect(() => {
    if (state !== 'running') return;
    const t = setInterval(() => setLeft((s) => { if (s <= 1) { setState('done'); return 0; } return s - 1; }), 1000);
    return () => clearInterval(t);
  }, [state]);

  useEffect(() => {
    if (!round || state !== 'done' || !round.q) return;
    const q = round.q;
    recordAttempt({ questionId: q.id, unit: q.unit, concept: q.concept, week: q.week, type: 'match', answer: [...matched], correct: null, score: matched.size / round.pairs.length, mode: 'match', durationMs: Math.round(performance.now() - started) }).catch(() => {});
  }, [state]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!round) return <p className="quiz__empty">Nothing to match here yet.</p>;

  const pickRight = (r: string) => {
    if (sel === null || state !== 'running') return;
    if (round.pairs[sel].right === r) {
      const m = new Set(matched).add(sel);
      setMatched(m);
      setSel(null);
      if (m.size === round.pairs.length) setState('done');
    } else {
      setWrong({ l: sel, r });
      setTimeout(() => setWrong(null), 300);
      setSel(null);
    }
  };
  const isMatchedRight = (r: string) => [...matched].some((i) => round.pairs[i].right === r);

  return (
    <section className="match qcard">
      <div className="qf__top">
        {state === 'running' ? <TimerArc total={SECONDS} remaining={left} size={56} /> : <span />}
        <p className="quiz__count" aria-live="polite" data-match-count>{matched.size} of {round.pairs.length} matched</p>
      </div>
      <h2 className="qcard__stem">{round.title}</h2>
      <div className="match__cols">
        <ul className="match__col" aria-label="Items">
          {round.pairs.map((p, i) => (
            <li key={p.left}>
              <button type="button" className="option match__item" aria-pressed={sel === i} disabled={matched.has(i) || state === 'done'}
                data-state={matched.has(i) ? 'correct' : wrong?.l === i ? 'incorrect' : undefined} onClick={() => setSel(i)}>
                {p.left}
              </button>
            </li>
          ))}
        </ul>
        <ul className="match__col" aria-label="Partners">
          {rights.map((r) => (
            <li key={r}>
              <button type="button" className="option match__item match__item--right" disabled={isMatchedRight(r) || state === 'done' || sel === null}
                data-state={isMatchedRight(r) ? 'correct' : wrong?.r === r ? 'incorrect' : undefined} onClick={() => pickRight(r)}>
                {r}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {state === 'done' && (
        <div className="match__done" aria-live="polite">
          <p>{matched.size === round.pairs.length ? 'All matched.' : `Time. ${round.pairs.length - matched.size} left unmatched:`}</p>
          {matched.size < round.pairs.length && (
            <ul>{round.pairs.map((p, i) => (matched.has(i) ? null : <li key={p.left}><strong>{p.left}</strong> — {p.right}</li>))}</ul>
          )}
        </div>
      )}
    </section>
  );
}
