// "Tell apart" (?mode=contrast; features 144, 146): rounds drawn from a concept and the ideas it is confused with
// (bank.concepts[id].contrastsWith), interleaved. Before each question the learner names the idea it turns on and
// gets instant feedback with both titles; then answers the question itself through the usual Mcq card.
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { contrastGroups, contrastRound, isChoice, rng, shuffle, type ChoiceQ } from '../../lib/drills';
import { useStudy } from '../../lib/store';
import { Mcq } from './Mcq';
import { asChoice, type Bank } from './types';
import '../../styles/drills.css';

const ROUND = 6;
const hash = (s: string) => [...s].reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 16777619), 2166136261) >>> 0;
const list = (xs: string[]) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} or ${xs[xs.length - 1]}`);

interface Log { named: boolean; correct?: boolean }

export default function ContrastDrill({ bank, seed, concept, onMixed }: { bank: Bank; seed: number; concept?: string; onMixed: () => void }) {
  const attempts = useStudy((s) => s.attempts);
  const questions = useMemo(() => bank.questions.filter(isChoice), [bank]);
  const groups = useMemo(() => {
    const has = new Set(questions.map((q) => q.concept));
    return contrastGroups(bank.concepts, (id) => has.has(id), seed, concept);
  }, [bank, questions, seed, concept]);
  const [g, setG] = useState(0);
  const [round, setRound] = useState(0);
  const group = groups.length ? groups[g % groups.length] : null;
  // A round is fixed once drawn: answers recorded during it must not reshuffle it.
  const items = useMemo(
    () => (group ? contrastRound(group, questions, attempts, ROUND, seed + g * 7919 + round * 104729) : []),
    [group, questions, seed, g, round], // eslint-disable-line react-hooks/exhaustive-deps
  );
  const [i, setI] = useState(0);
  const [stage, setStage] = useState<'which' | 'answer'>('which');
  const [log, setLog] = useState<Log[]>([]);
  const title = (id: string) => bank.concepts[id]?.title ?? id;

  if (!group) {
    return (
      <div className="tell-apart tell-apart--empty">
        <p className="quiz__empty">None of this unit’s ideas are marked as easily confused yet, so there is nothing to tell apart here.</p>
        <button type="button" className="btn btn--primary" onClick={onMixed}>Practise Mixed instead</button>
      </div>
    );
  }

  const done = i >= items.length;
  const q = items[i];
  const restart = (nextGroup: number) => {
    setG(nextGroup);
    setRound((r) => r + 1);
    setI(0);
    setStage('which');
    setLog([]);
  };
  const next = () => { setI((n) => n + 1); setStage('which'); };
  const missingStart = concept && !group.includes(concept);

  return (
    <div className="quiz tell-apart" data-focus-keep data-group={group.join(' ')}>
      {missingStart && <p className="tell-apart__note">{title(concept)} has no ideas marked as easily confused yet, so this starts with another set.</p>}
      <p className="tell-apart__pair"><span className="label">Telling apart</span> {group.map(title).join(' · ')}</p>
      <div className="quiz__progress" role="progressbar" aria-label="Round progress" aria-valuemin={0} aria-valuemax={items.length} aria-valuenow={Math.min(i, items.length)}>
        <span style={{ transform: `scaleX(${Math.min(i, items.length) / items.length})` }} />
      </div>
      {done ? (
        <section className="tell-apart__recap" aria-live="polite" data-recap>
          <h2 className="tell-apart__recap-h">Round done</h2>
          <p>
            You named the idea {log.filter((l) => l.named).length} of {items.length} times and answered {log.filter((l) => l.correct).length} of {items.length} correctly.
          </p>
          <div className="tell-apart__actions">
            {groups.length > 1 ? (
              <>
                <button type="button" className="btn btn--secondary" onClick={() => restart(g)}>Same set again</button>
                <button type="button" className="btn btn--primary" onClick={() => restart(g + 1)}>Next set</button>
              </>
            ) : (
              <button type="button" className="btn btn--primary" onClick={() => restart(g)}>Same set again</button>
            )}
          </div>
        </section>
      ) : (
        <div className="quiz__stage" key={`${round}-${q.id}`}>
          <p className="quiz__count">Question {i + 1} of {items.length}</p>
          {stage === 'which' ? (
            <WhichIdea
              q={q}
              group={group}
              title={title}
              onNamed={(named) => setLog((l) => [...l, { named }])}
              onContinue={() => setStage('answer')}
            />
          ) : (
            <Mcq
              q={q}
              concept={bank.concepts[q.concept]}
              mode="contrast"
              onAnswered={(r) => setLog((l) => l.map((x, k) => (k === l.length - 1 ? { ...x, correct: r.correct } : x)))}
              onNext={next}
            />
          )}
        </div>
      )}
    </div>
  );
}

/** Step one: which idea does this question turn on? Options are the group's titles; marking is instant. */
function WhichIdea({ q, group, title, onNamed, onContinue }: { q: ChoiceQ; group: string[]; title: (id: string) => string; onNamed: (named: boolean) => void; onContinue: () => void }) {
  const { stem } = useMemo(() => asChoice(q), [q]);
  const options = useMemo(() => shuffle(group, rng(hash(q.id))), [group, q.id]);
  const [picked, setPicked] = useState<string | null>(null);
  const pickedRef = useRef<string | null>(null);
  const goRef = useRef<HTMLButtonElement>(null);
  const right = picked === q.concept;
  const others = group.filter((c) => c !== q.concept);

  const pick = (c: string) => {
    if (pickedRef.current !== null) return;
    pickedRef.current = c;
    setPicked(c);
    onNamed(c === q.concept);
  };

  useEffect(() => { if (picked) goRef.current?.focus({ preventScroll: true }); }, [picked]);

  useLayoutEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || (e.target as HTMLElement)?.closest('input, textarea, [contenteditable]')) return;
      const n = Number(e.key);
      if (pickedRef.current === null && n >= 1 && n <= options.length) { e.preventDefault(); pick(options[n - 1]); return; }
      if (pickedRef.current !== null && (e.key === 'Enter' || e.key === 'ArrowRight') && document.activeElement !== goRef.current) { e.preventDefault(); onContinue(); }
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  });

  const stateOf = (c: string) => (picked === null ? undefined : c === q.concept ? 'correct' : c === picked ? 'incorrect' : undefined);

  return (
    <article className="qcard tell-apart__which" data-question={q.id} aria-labelledby={`${q.id}-which-stem`}>
      <p className="qcard__meta">Tell apart<span aria-hidden="true"> · </span>{q.type === 'truefalse' ? 'True or false' : 'Multiple choice'}</p>
      <h2 className="qcard__stem" id={`${q.id}-which-stem`}>{stem}</h2>
      <p className="tell-apart__ask" id={`${q.id}-which-ask`}>Which idea does this turn on?</p>
      <ol className="qcard__options" aria-labelledby={`${q.id}-which-ask`}>
        {options.map((c, pos) => (
          <li key={c}>
            <button type="button" className="option" data-idea={c} data-state={stateOf(c)} disabled={picked !== null} onClick={() => pick(c)}>
              <span className="option__key" aria-hidden="true">{pos + 1}</span>
              <span>{title(c)}</span>
              {picked !== null && c === q.concept && <span className="visually-hidden"> (the idea it turns on)</span>}
              {picked !== null && c === picked && !right && <span className="visually-hidden"> (your choice)</span>}
            </button>
          </li>
        ))}
      </ol>
      {picked !== null && (
        <section className="explain" aria-live="polite" data-result={right ? 'right' : 'wrong'} data-named={right ? 'right' : 'wrong'}>
          <p className="explain__verdict">{right ? 'Right.' : 'Not this one.'}</p>
          <p>
            It turns on <strong>{title(q.concept)}</strong>, not <strong>{right ? list(others.map(title)) : title(picked)}</strong>.
          </p>
        </section>
      )}
      {picked !== null && (
        <div className="qcard__next">
          <button ref={goRef} type="button" className="btn btn--primary" onClick={onContinue}>Now answer it <kbd className="kbd" aria-hidden="true">↵</kbd></button>
        </div>
      )}
    </article>
  );
}
