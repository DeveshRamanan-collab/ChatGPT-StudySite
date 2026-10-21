// Long answer / problem question: answer plan → exam-paper mode (scenario left, editor right, timer, chrome hidden,
// leaving guarded until Finish) → rubric with band score and gaps → cards. Tiers: worked (predict each step before
// it is revealed), faded (given parts pre-filled), full (blank). Two passes ≥ 70% at a tier promote the concept.
// Faded and full tiers get a hint ladder while writing (rungs opened saved as `hints`); ILAC answers get an IRAC
// self-check with the marking step.
import { useEffect, useMemo, useRef, useState } from 'react';
import { db } from '../../lib/db';
import { recordAttempt } from '../../lib/learning';
import { matchSentences, rubricScore, sentences } from '../../lib/match';
import { band, currentTier, PASS, type Tier } from '../../lib/tiers';
import { toast } from '../ui/Toaster';
import { TimerArc } from '../ui/TimerArc';
import { AnswerPlan, type PlanPoint } from './AnswerPlan';
import { HintLadder, hintsLine } from './HintLadder';
import { IracCheck } from './IracCheck';
import { RubricPanel } from './RubricPanel';
import type { CasePair, ConceptMeta, LongQ } from './types';
import { loadAids } from '../../lib/aids';
import { problemHref } from '../../lib/problem';

interface Props {
  q: LongQ;
  concept?: ConceptMeta;
  mode?: string;
  onNext?: () => void;
  /** The unit's case list (names recognised by the IRAC check); fetched lazily when not given. */
  cases?: CasePair[];
}

const HEADINGS = { ilac: ['Issue', 'Law', 'Application', 'Conclusion'], essay: ['Thesis', 'Argument', 'Counterargument', 'Evaluation'] };

function prefill(q: LongQ) {
  if (q.tier !== 'faded' || !q.given) return '';
  return Object.entries(q.given)
    .map(([k, v]) => `${k[0].toUpperCase()}${k.slice(1)}: ${Array.isArray(v) ? v.join('; ') : v}`)
    .join('\n\n') + '\n\n';
}

export function LongAnswer({ q, concept, mode = 'long', onNext, cases }: Props) {
  const [stage, setStage] = useState<'plan' | 'write' | 'mark' | 'saved'>('plan');
  // Problem questions with fact annotations can be worked fact by fact first (/<unit>/problem/<id>).
  const [hasFacts, setHasFacts] = useState(false);
  useEffect(() => { loadAids(q.unit).then((b) => setHasFacts(!!b.facts[q.id])); }, [q.unit, q.id]);
  const [plan, setPlan] = useState<PlanPoint[]>([]);
  const [text, setText] = useState(() => prefill(q));
  const [revealed, setRevealed] = useState(0);
  const [prediction, setPrediction] = useState('');
  const [predictions, setPredictions] = useState<string[]>([]);
  const [left, setLeft] = useState(q.timer * 60);
  const [ticked, setTicked] = useState<Set<string>>(new Set());
  const [focusRow, setFocusRow] = useState<string | null>(null);
  const [promotedTo, setPromotedTo] = useState<Tier | null>(null);
  const [gapsMade, setGapsMade] = useState(false);
  const [hints, setHints] = useState(0);
  const started = useRef(performance.now());

  // Exam-paper mode: hide the chrome, guard leaving, run the clock.
  useEffect(() => {
    if (stage !== 'write') return;
    document.documentElement.dataset.exam = '1';
    const guard = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ''; };
    addEventListener('beforeunload', guard);
    const t = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    return () => { delete document.documentElement.dataset.exam; removeEventListener('beforeunload', guard); clearInterval(t); };
  }, [stage]);

  const steps = q.tier === 'worked' ? (q.steps.length ? q.steps : sentences(q.model)) : [];
  const workedDone = q.tier === 'worked' && revealed >= steps.length;
  const modelSentences = useMemo(() => sentences(q.model), [q.model]);
  const highlighted = useMemo(() => {
    const row = q.rubric.find((r) => r.id === focusRow);
    return new Set(row ? matchSentences(q.model, `${row.criterion} ${row['top-band']}`) : []);
  }, [focusRow, q]);
  const { score, got, total } = rubricScore(q.rubric, ticked);

  const reveal = () => {
    setPredictions((p) => [...p, prediction]);
    setPrediction('');
    setRevealed((n) => n + 1);
  };

  const gapsToCards = async () => {
    const gaps = q.rubric.filter((r) => !ticked.has(r.id));
    await db.customCards.bulkPut(gaps.map((r) => ({
      id: `gap-${q.id}-${r.id}`, concept: q.concept, unit: q.unit, type: 'basic' as const,
      front: `${r.criterion} — what does a top answer do?`, back: r['top-band'], source: `Rubric gap: ${q.id}`, at: Date.now(),
    })));
    setGapsMade(true);
    toast(`${gaps.length} ${gaps.length === 1 ? 'card' : 'cards'} made from the gaps.`);
  };

  const save = async () => {
    const before = await currentTier(q.concept);
    await recordAttempt({
      questionId: q.id, unit: q.unit, concept: q.concept, week: q.week, type: 'long', tier: q.tier, correct: null, score,
      rubricTicks: [...ticked], answer: { plan, text, predictions }, mode, durationMs: Math.round(performance.now() - started.current), hints,
    });
    const after = await currentTier(q.concept);
    if (after !== before) setPromotedTo(after);
    setStage('saved');
  };

  return (
    <article className="qcard la" data-question={q.id} data-stage={stage} data-tier={q.tier}>
      <p className="qcard__meta">
        {concept?.title ?? q.concept}<span aria-hidden="true"> · </span>{q.template === 'ilac' ? 'Problem question' : 'Essay'}
        <span aria-hidden="true"> · </span><span data-tier-label>{q.tier} tier</span>
      </p>

      {stage === 'plan' && (
        <>
          <div className="la__scenario la__scenario--intro">{q.prompt.split(/\n+/).map((p, i) => <p key={i}>{p}</p>)}</div>
          {hasFacts && <p className="qcard__hint"><a href={problemHref(q.unit, q.id)}>Work the facts first</a>: spot the issues fact by fact, then pin each fact to what it proves.</p>}
          <AnswerPlan template={q.template} onDone={(p) => { setPlan(p); setStage('write'); started.current = performance.now(); }} />
        </>
      )}

      {stage === 'write' && (
        <div className="la__paper">
          <section className="la__scenario" aria-label="Question">
            <div className="la__clock">
              <TimerArc total={q.timer * 60} remaining={left} size={56} />
              {left === 0 && <p className="la__timeup">Time. Finish your sentence, then mark it.</p>}
            </div>
            {q.prompt.split(/\n+/).map((p, i) => <p key={i}>{p}</p>)}
            <details className="la__plan-recap" open>
              <summary>Your plan</summary>
              <ol>{plan.map((p) => <li key={p.id}>{p.issue}{p.authorities && <span className="la__auth"> — {p.authorities}</span>}</li>)}</ol>
            </details>
            {q.tier !== 'worked' && (
              <HintLadder questionId={q.id} unit={q.unit} concept={q.concept} rubric={q.rubric} model={q.model} opened={hints} onOpen={setHints} />
            )}
          </section>
          <section className="la__answer" aria-label="Your answer">
            {q.tier === 'worked' ? (
              <div className="la__worked">
                <p className="label">Worked example: predict each step, then reveal it</p>
                <ol className="la__steps">
                  {steps.slice(0, revealed).map((s, i) => (
                    <li key={i}>
                      {predictions[i] && <p className="la__pred"><span className="label">You predicted</span> {predictions[i]}</p>}
                      <p>{s}</p>
                    </li>
                  ))}
                </ol>
                {!workedDone ? (
                  <div className="la__predict">
                    <label htmlFor={`${q.id}-pred`} className="label">What comes next? (step {revealed + 1} of {steps.length})</label>
                    <textarea id={`${q.id}-pred`} className="sa__editor la__pred-input" rows={3} value={prediction} onChange={(e) => setPrediction(e.currentTarget.value)} />
                    <button type="button" className="btn btn--secondary" disabled={!prediction.trim()} onClick={reveal}>Reveal step {revealed + 1}</button>
                  </div>
                ) : (
                  <p className="la__worked-done">All steps revealed. Finish to mark what you anticipated.</p>
                )}
              </div>
            ) : (
              <>
                <label htmlFor={`${q.id}-ans`} className="visually-hidden">Your answer</label>
                <textarea
                  id={`${q.id}-ans`}
                  className="sa__editor la__editor"
                  value={text}
                  placeholder={HEADINGS[q.template].join(' → ')}
                  onChange={(e) => setText(e.currentTarget.value)}
                />
              </>
            )}
            <div className="la__finish">
              <button type="button" className="btn btn--primary" disabled={q.tier === 'worked' ? !workedDone : !text.trim()} onClick={() => setStage('mark')}>Finish</button>
            </div>
          </section>
        </div>
      )}

      {(stage === 'mark' || stage === 'saved') && (
        <>
          <div className="sa__compare">
            <section className="sa__col" aria-label="Your answer">
              <p className="label">Yours</p>
              <div className="sa__yours">
                {q.tier === 'worked' ? predictions.map((p, i) => <p key={i}><span className="mono">{i + 1}.</span> {p}</p>) : text.split(/\n+/).map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </section>
            <section className="sa__col sa__model" aria-label="Model answer">
              <p className="label">Model answer</p>
              <p>{modelSentences.map((s, i) => <span key={i} className="sa__sent" data-hl={highlighted.has(i) || undefined}>{s} </span>)}</p>
            </section>
          </div>
          {q.template === 'ilac' && q.tier !== 'worked' && <IracCheck q={q} text={text} cases={cases} />}
          <RubricPanel rows={q.rubric} ticked={ticked} onTick={(id, on) => setTicked((t) => { const n = new Set(t); on ? n.add(id) : n.delete(id); return n; })} onFocusRow={setFocusRow} />
          <div className="la__result">
            <p className="la__band" aria-live="polite"><span className="mono">{got}/{total}</span> · <strong data-band>{band(score)}</strong>{score >= PASS && <span> · a pass at this tier</span>}</p>
            {hints > 0 && <p className="hint-ladder__used" data-hints-used={hints}>{hintsLine(hints)}</p>}
            <div className="la__result-actions">
              {ticked.size < q.rubric.length && <button type="button" className="btn btn--ghost" disabled={gapsMade} onClick={gapsToCards}>{gapsMade ? 'Cards made' : 'Gaps → cards'}</button>}
              {stage === 'mark' && <button type="button" className="btn btn--primary" onClick={save}>Save my mark</button>}
              {stage === 'saved' && onNext && <button type="button" className="btn btn--primary" onClick={onNext}>Next</button>}
            </div>
            {stage === 'saved' && <p className="la__saved" aria-live="polite">Saved.{promotedTo && <> Two passes at this tier: next time this concept comes at the <strong data-promoted>{promotedTo}</strong> tier.</>}</p>}
          </div>
        </>
      )}
    </article>
  );
}
