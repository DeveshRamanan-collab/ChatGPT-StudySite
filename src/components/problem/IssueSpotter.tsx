// Fact-by-fact issue spotting (features 157, 38): the prompt is revealed one annotated fact at a time, in prompt
// order. For each, tag the issues it bears on (optional), then mark it Essential or Background; feedback against the
// annotation (weight, issue links found / missed / added, and the annotator's why) shows at once, then the next fact.
// Keys: 1–9 tag an issue, E essential, B background, Enter next. Skippable to the full view at any point.
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Fact } from '../../lib/aids';
import { scoreFact, scoreRound, tally, type Issue, type Located, type Piece, type RoundScore, type SpotAnswer, type Weight } from '../../lib/problem';

interface Props {
  paras: Piece[][];
  order: number[];
  located: Located[];
  facts: Fact[];
  issues: Issue[];
  previous?: RoundScore | null;
  onDone: (answers: (SpotAnswer | undefined)[]) => void;
  onSkip: (answers: (SpotAnswer | undefined)[]) => void;
}

const STATE_TEXT = {
  hit: 'you tagged it, and so does the annotation',
  missed: 'the annotation tags it; you did not',
  extra: 'you tagged it; the annotation does not',
} as const;
const MARK = { hit: '✓', missed: '+', extra: '×' } as const;

export default function IssueSpotter({ paras, order, located, facts, issues, previous, onDone, onSkip }: Props) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<(SpotAnswer | undefined)[]>(() => facts.map(() => undefined));
  const [tags, setTags] = useState<Set<string>>(() => new Set());
  const known = useMemo(() => new Set(issues.map((i) => i.id)), [issues]);
  const rootRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLParagraphElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  const current = order[step];
  const fact = facts[current];
  const answer = answers[current];
  const result = answer ? scoreFact(fact, answer, known) : null;
  const score = scoreRound(facts, answers, known);
  const last = step >= order.length - 1;
  const label = (id: string) => issues.find((i) => i.id === id)?.label ?? id;

  // Text is shown up to the end of the current fact (or the last located fact before it).
  const flat = useMemo(() => paras.flatMap((p, pi) => p.map((piece, k) => ({ pi, k, fact: piece.fact }))), [paras]);
  const until = useMemo(() => {
    const shown = new Set(order.slice(0, step + 1));
    let end = -1;
    flat.forEach((x, n) => { if (x.fact !== null && shown.has(x.fact)) end = n; });
    return end;
  }, [flat, order, step]);
  const unlocated = located[current]?.start < 0;

  const commit = (weight: Weight) => {
    if (answers[current]) return;
    setAnswers((a) => { const n = [...a]; n[current] = { weight, issues: [...tags] }; return n; });
  };
  const toggle = (id: string) => {
    if (answers[current]) return;
    setTags((t) => { const n = new Set(t); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  };
  const next = () => {
    if (!answers[current]) return;
    if (last) { onDone(answers); return; }
    started.current = true;
    setTags(new Set());
    setStep((s) => s + 1);
  };

  // After marking: focus Next. After moving on: focus the new fact's label; keep the card in view (no animated scroll).
  useEffect(() => {
    if (!answer) return;
    nextRef.current?.focus({ preventScroll: true });
    cardRef.current?.scrollIntoView({ block: 'nearest' });
  }, [answer]);
  useEffect(() => {
    if (!started.current) return;
    headRef.current?.focus({ preventScroll: true });
    cardRef.current?.scrollIntoView({ block: 'nearest' });
  }, [step]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.defaultPrevented) return;
      const t = e.target as HTMLElement | null;
      if (t?.closest?.('input, textarea, select, [contenteditable="true"], dialog') || document.querySelector('dialog[open]')) return;
      const a = document.activeElement;
      if (a && a !== document.body && !rootRef.current?.contains(a)) return;
      const k = e.key.toLowerCase();
      if (!answers[current]) {
        if (k === 'e') { e.preventDefault(); commit('essential'); }
        else if (k === 'b') { e.preventDefault(); commit('background'); }
        else if (/^[1-9]$/.test(k) && Number(k) <= issues.length) { e.preventDefault(); toggle(issues[Number(k) - 1].id); }
      } else if ((e.key === 'Enter' || e.key === 'ArrowRight') && a !== nextRef.current) { e.preventDefault(); next(); }
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  });

  const chipState = (id: string) => (!result ? undefined : result.hits.includes(id) ? 'hit' : result.missed.includes(id) ? 'missed' : result.extra.includes(id) ? 'extra' : undefined);
  const weightState = (w: Weight) => (!answer ? undefined : w === answer.weight ? (w === fact.weight ? 'correct' : 'incorrect') : w === fact.weight ? 'answer' : undefined);
  const linked = result ? result.hits.length + result.missed.length : 0;

  return (
    <section className="pq-spot" ref={rootRef} aria-labelledby="pq-spot-h">
      <div className="pq-spot__head">
        <h2 id="pq-spot-h" tabIndex={-1}>Spot the facts</h2>
        <button type="button" className="btn btn--ghost btn--sm" onClick={() => onSkip(answers)}>Skip to the full view</button>
      </div>
      <p className="pq-spot__tally" aria-live="polite">
        <span>{tally(score)}</span>
        {previous && <span className="pq-spot__prev">Last time: {previous.matched} of {previous.total} matched</span>}
      </p>
      <div className="pq-spot__bar" aria-hidden="true"><span style={{ transform: `scaleX(${score.done / Math.max(1, order.length)})` }} /></div>

      <div className="pq-spot__prompt">
        {paras.map((p, pi) => {
          const pieces = p.map((piece, k) => ({ piece, k, n: flat.findIndex((x) => x.pi === pi && x.k === k) })).filter((x) => x.n <= until);
          if (!pieces.length) return null;
          return (
            <p key={pi}>
              {pieces.map(({ piece, k }) => (
                <span
                  key={k}
                  className="pq-spot__piece"
                  data-fact={piece.fact ?? undefined}
                  data-state={piece.fact === null ? undefined : piece.fact === current ? 'now' : 'past'}
                >{piece.text}</span>
              ))}
            </p>
          );
        })}
      </div>

      <div className="pq-spot__card" ref={cardRef}>
        <p className="label pq-spot__which" ref={headRef} tabIndex={-1}>Fact {step + 1} of {order.length}{unlocated ? '' : ': the highlighted words'}</p>
        {unlocated ? <blockquote className="pq-spot__quote">{fact.text}</blockquote> : <p className="visually-hidden">{fact.text}</p>}

        <p className="pq-spot__ask" id="pq-spot-issues">Which issues does it bear on? <span className="pq-spot__opt">Optional</span></p>
        <div className="pq-spot__issues" role="group" aria-labelledby="pq-spot-issues">
          {issues.map((iss) => {
            const st = chipState(iss.id);
            return (
              <button key={iss.id} type="button" className="chip" aria-pressed={tags.has(iss.id)} disabled={!!answer} data-state={st} onClick={() => toggle(iss.id)}>
                {st && <span aria-hidden="true">{MARK[st]}</span>}
                <span>{iss.label}</span>
                {st && <span className="visually-hidden"> ({STATE_TEXT[st]})</span>}
              </button>
            );
          })}
        </div>

        <p className="pq-spot__ask" id="pq-spot-weight">Essential to the answer, or background?</p>
        <div className="pq-spot__weights" role="group" aria-labelledby="pq-spot-weight">
          {(['essential', 'background'] as const).map((w) => (
            <button key={w} type="button" className="btn btn--secondary" disabled={!!answer} data-state={weightState(w)} onClick={() => commit(w)}>
              {w === 'essential' ? 'Essential' : 'Background'}
            </button>
          ))}
        </div>
        {!answer && <p className="pq-spot__keys">Keys: 1–{Math.min(9, issues.length)} tag an issue · E essential · B background</p>}

        {answer && result && (
          <div className="pq-spot__feedback" role="status">
            <p className="pq-spot__verdict" data-ok={result.weightOk ? '' : undefined}>
              {result.weightOk
                ? <><span aria-hidden="true">✓ </span>Matched: the annotation marks this {fact.weight}.</>
                : <>The annotation marks this {fact.weight}; you chose {answer.weight}.</>}
            </p>
            {(linked > 0 || result.extra.length > 0) && (
              <p className="pq-spot__links">
                {linked > 0 ? `You found ${result.hits.length} of ${linked} issue ${linked === 1 ? 'link' : 'links'}` : 'The annotation links no issue to this fact'}
                {result.missed.length > 0 && `; also bears on ${result.missed.map(label).join('; ')}`}
                {result.extra.length > 0 && `; not linked in the annotation: ${result.extra.map(label).join('; ')}`}.
              </p>
            )}
            {fact.why
              ? <p className="pq-spot__why"><span className="label">Why</span> {fact.why}</p>
              : !fact.issues.length && <p className="pq-spot__why">No issue turns on this fact: it sets the scene.</p>}
            <div className="pq-spot__next">
              <button ref={nextRef} type="button" className="btn btn--primary" onClick={next}>{last ? 'See the full view' : 'Next fact'}</button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
