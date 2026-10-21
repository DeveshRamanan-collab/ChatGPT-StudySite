// Short answer: write (optional timer, auto-growing editor, ⌘/Ctrl+Enter) → confidence → model answer slides in
// beside yours with the Marking Criteria panel; ticking rows self-marks with a live score; save records the attempt.
// A hint ladder sits under the editor before marking; the rungs opened are saved on the attempt as `hints`.
import { useEffect, useMemo, useRef, useState } from 'react';
import { recordAttempt } from '../../lib/learning';
import { matchSentences, rubricScore, sentences } from '../../lib/match';
import type { Confidence } from '../../lib/db';
import { ConfidenceGate } from './ConfidenceGate';
import { HintLadder, hintsLine } from './HintLadder';
import { RubricPanel } from './RubricPanel';
import { TimerArc } from '../ui/TimerArc';
import type { ConceptMeta, ShortQ } from './types';

interface Props { q: ShortQ; concept?: ConceptMeta; mode?: string; onNext?: () => void; timerMinutes?: number }

export function ShortAnswer({ q, concept, mode = 'mixed', onNext, timerMinutes = 8 }: Props) {
  const [text, setText] = useState('');
  const [confidence, setConfidence] = useState<Confidence | null>(null);
  const [stage, setStage] = useState<'write' | 'mark' | 'saved'>('write');
  const [ticked, setTicked] = useState<Set<string>>(new Set());
  const [focusRow, setFocusRow] = useState<string | null>(null);
  const [timed, setTimed] = useState(false);
  const [left, setLeft] = useState(timerMinutes * 60);
  const [hints, setHints] = useState(0);
  const started = useRef(performance.now());
  const area = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!timed || stage !== 'write') return;
    const t = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [timed, stage]);

  // Auto-grow (fallback where field-sizing is unsupported).
  useEffect(() => {
    const el = area.current;
    if (!el || CSS.supports('field-sizing', 'content')) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight + 2}px`;
  }, [text]);

  const modelSentences = useMemo(() => sentences(q.model), [q.model]);
  const highlighted = useMemo(() => {
    const row = q.rubric.find((r) => r.id === focusRow);
    return new Set(row ? matchSentences(q.model, `${row.criterion} ${row['top-band']}`) : []);
  }, [focusRow, q]);

  const canSubmit = text.trim().length > 0 && confidence !== null;
  const submit = () => { if (canSubmit) setStage('mark'); };
  const save = () => {
    const { score } = rubricScore(q.rubric, ticked);
    recordAttempt({
      questionId: q.id, unit: q.unit, concept: q.concept, week: q.week, type: 'short', answer: text, correct: null, score,
      confidence: confidence!, rubricTicks: [...ticked], mode, durationMs: Math.round(performance.now() - started.current), hints,
    }).catch((e) => console.warn(e));
    setStage('saved');
  };

  return (
    <article className="qcard sa" data-question={q.id} data-stage={stage}>
      <p className="qcard__meta">{concept?.title ?? q.concept}<span aria-hidden="true"> · </span>Short answer</p>
      <h2 className="qcard__stem">{q.prompt}</h2>

      {stage === 'write' ? (
        <div className="sa__write">
          <div className="sa__tools">
            <label className="sa__timer-toggle"><input type="checkbox" checked={timed} onChange={(e) => setTimed(e.currentTarget.checked)} /> Time me ({timerMinutes} min)</label>
            {timed && <TimerArc total={timerMinutes * 60} remaining={left} size={48} />}
          </div>
          <label className="visually-hidden" htmlFor={`${q.id}-ans`}>Your answer</label>
          <textarea
            id={`${q.id}-ans`}
            ref={area}
            className="sa__editor"
            rows={6}
            value={text}
            placeholder="Write your answer. ⌘ Enter to submit."
            onChange={(e) => setText(e.currentTarget.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); submit(); } }}
          />
          <HintLadder questionId={q.id} unit={q.unit} concept={q.concept} rubric={q.rubric} model={q.model} opened={hints} onOpen={setHints} />
          <div className="sa__submit">
            <ConfidenceGate value={confidence} onChange={setConfidence} />
            <button type="button" className="btn btn--primary" disabled={!canSubmit} onClick={submit}>Compare with the model</button>
          </div>
        </div>
      ) : (
        <>
          <div className="sa__compare">
            <section className="sa__col" aria-label="Your answer">
              <p className="label">Yours</p>
              <div className="sa__yours">{text.split(/\n+/).map((p, i) => <p key={i}>{p}</p>)}</div>
            </section>
            <section className="sa__col sa__model" aria-label="Model answer">
              <p className="label">Model answer</p>
              <p>
                {modelSentences.map((s, i) => (
                  <span key={i} className="sa__sent" data-hl={highlighted.has(i) || undefined}>{s} </span>
                ))}
              </p>
            </section>
          </div>
          <RubricPanel
            rows={q.rubric}
            ticked={ticked}
            onTick={(id, on) => setTicked((t) => { const n = new Set(t); on ? n.add(id) : n.delete(id); return n; })}
            onFocusRow={setFocusRow}
          />
          <div className="qcard__next">
            {stage === 'mark' && <button type="button" className="btn btn--primary" onClick={save}>Save my mark</button>}
            {stage === 'saved' && (
              <>
                <p className="sa__saved" aria-live="polite">
                  Saved: {Math.round(rubricScore(q.rubric, ticked).score * 100)}%.
                  {hints > 0 && <span className="hint-ladder__used" data-hints-used={hints}> {hintsLine(hints)}</span>}
                </p>
                {onNext && <button type="button" className="btn btn--primary" onClick={onNext}>Next</button>}
              </>
            )}
          </div>
        </>
      )}
    </article>
  );
}
