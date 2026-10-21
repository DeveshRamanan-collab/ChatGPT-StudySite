// Quiz session runner for the adaptive modes: one question at a time, progress hairline, catalogue transitions
// (next: in from +24px over 240ms). The picker chooses the set once per round (requeues, relearns, weighted draw,
// interleaving); a round ends with the session recap.
import { useEffect, useMemo, useRef, useState } from 'react';
import { resumeQuizPos, saveQuizPos } from '../../lib/continue';
import type { Criterion } from '../../lib/db';
import { pick } from '../../lib/picker';
import { accuracyByConcept } from '../../lib/selectors';
import { useStudy } from '../../lib/store';
import { tierFrom } from '../../lib/tiers';
import { LongAnswer } from './LongAnswer';
import { Mcq } from './Mcq';
import { SessionRecap, type RecapResult } from './SessionRecap';
import { ShortAnswer } from './ShortAnswer';
import type { Bank, LongQ, McqQ, Question, ShortQ, TrueFalseQ } from './types';

export type RunnerMode = 'mixed' | 'week' | 'weakest' | 'short' | 'long' | 'set';
type Item = McqQ | TrueFalseQ | ShortQ | LongQ;

const SESSION_LENGTH = 10;

export default function QuizRunner({ bank, mode, week, concept, ids, seed: seed0 }: { bank: Bank; mode: RunnerMode; week?: string; concept?: string; ids?: string[]; seed: number }) {
  const attempts = useStudy((s) => s.attempts);
  const criteria = useStudy((s) => s.criterion);
  const requeue = useStudy((s) => s.requeue);
  // Continue: a quiz opened with ?resume=1 re-creates the saved set and returns to the same question.
  const resume = useRef(typeof window === 'undefined' ? null : resumeQuizPos());
  const [i, setI] = useState(() => resume.current?.i ?? 0);
  const [results, setResults] = useState<RecapResult[]>([]);
  const [round, setRound] = useState(0);
  const seed = useRef(seed0);
  const before = useRef<Map<string, Criterion>>(new Map(criteria));

  const items = useMemo(() => {
    if (resume.current && round === 0) {
      const byId = new Map(bank.questions.map((q) => [q.id, q]));
      const saved = resume.current.ids.map((id) => byId.get(id)).filter((q): q is Item => !!q && q.type !== 'match');
      if (saved.length) return saved;
    }
    if (mode === 'set') {
      // An exact set chosen in the question bank, in the order chosen.
      const byId = new Map(bank.questions.map((q) => [q.id, q]));
      return (ids ?? []).map((id) => byId.get(id)).filter((q): q is Item => !!q && q.type !== 'match');
    }
    const want = (q: Question): q is Item =>
      mode === 'short' ? q.type === 'short' : mode === 'long' ? q.type === 'long' : q.type === 'mcq' || q.type === 'truefalse';
    let pool = bank.questions.filter((q): q is Item => want(q) && (!concept || q.concept === concept) && (mode !== 'week' || !week || q.week === week));
    if (mode === 'long') {
      const atTier = pool.filter((q) => q.type === 'long' && q.tier === tierFrom(attempts.filter((a) => a.concept === q.concept)));
      if (atTier.length) pool = atTier;
    }
    if (mode === 'weakest') {
      // The three weakest concepts by accuracy (only concepts with attempts); none yet → the whole bank.
      const acc = accuracyByConcept(attempts);
      const weakest = [...acc].filter(([c]) => bank.concepts[c]).sort((a, b) => a[1].accuracy - b[1].accuracy).slice(0, 3).map(([c]) => c);
      if (weakest.length) pool = pool.filter((q) => weakest.includes(q.concept));
    }
    const n = mode === 'short' ? 3 : mode === 'long' ? 1 : SESSION_LENGTH;
    return pick({ items: pool, attempts, criteria, requeue, now: Date.now(), n, seed: seed.current });
  }, [bank, mode, week, concept, round]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { if (items.length) saveQuizPos(items.map((q) => q.id), i); }, [items, i]);

  const again = () => {
    resume.current = null;
    seed.current = Date.now();
    before.current = new Map(criteria);
    setRound((r) => r + 1);
    setI(0);
    setResults([]);
  };

  if (!items.length) return <p className="quiz__empty">No questions here yet.</p>;
  const done = i >= items.length;
  const next = () => setI((n) => n + 1);
  const q = items[i];

  return (
    <div className="quiz" data-focus-keep>
      <div className="quiz__progress" role="progressbar" aria-label="Quiz progress" aria-valuemin={0} aria-valuemax={items.length} aria-valuenow={Math.min(i, items.length)}>
        <span style={{ transform: `scaleX(${Math.min(i, items.length) / items.length})` }} />
      </div>
      {done ? (
        <SessionRecap results={results} before={before.current} concepts={bank.concepts} onAgain={again} unit={bank.unit} />
      ) : (
        <div className="quiz__stage" key={`${round}-${q.id}`}>
          <p className="quiz__count">Question {i + 1} of {items.length}</p>
          {q.type === 'long' ? (
            <LongAnswer q={q} concept={bank.concepts[q.concept]} onNext={() => { setResults((r) => [...r, { concept: q.concept, correct: true }]); next(); }} />
          ) : q.type === 'short' ? (
            <ShortAnswer q={q} concept={bank.concepts[q.concept]} onNext={() => { setResults((r) => [...r, { concept: q.concept, correct: true }]); next(); }} />
          ) : (
            <Mcq q={q} concept={bank.concepts[q.concept]} mode={mode} onAnswered={(r) => setResults((rs) => [...rs, { concept: q.concept, correct: r.correct }])} onNext={next} />
          )}
        </div>
      )}
    </div>
  );
}
