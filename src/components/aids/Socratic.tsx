// "Work it out": a concept's Socratic ladder, one question at a time. The learner may jot a thought (optional), then
// ask for the hint, then the answer, then move on; the last step ends with a link to the quiz. State is local to the
// page (nothing is saved). The server renders step 1 exactly as it first hydrates, so hydration never shifts layout.
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { markFormat } from '../../lib/format-track';

export interface SocraticStep { ask: string; hint: string; answer: string }

export default function Socratic({ steps, quizHref, title }: { steps: SocraticStep[]; quizHref: string; title: string }) {
  // Visible (client:visible) means the learner reached Ways in: count it as the format used for this concept.
  useEffect(() => { const id = new URL(quizHref, 'http://x').searchParams.get('concept'); if (id) markFormat(id, 'ways-in'); }, [quizHref]);
  const [i, setI] = useState(0);
  const [hint, setHint] = useState(false);
  const [shown, setShown] = useState(false);
  const [done, setDone] = useState(false);
  const [notes, setNotes] = useState<string[]>(() => steps.map(() => ''));
  const moved = useRef(false); // true once the learner has moved past step 1: only then do steps animate in and take focus
  const main = useRef<HTMLButtonElement>(null);
  const ask = useRef<HTMLParagraphElement>(null);
  const end = useRef<HTMLParagraphElement>(null);

  const n = steps.length;
  const s = steps[i];
  const last = i === n - 1;

  useEffect(() => {
    if (moved.current) (done ? end : ask).current?.focus(); // scrolls only if the new step's first line is off-screen
  }, [i, done]);

  if (!n) return null;

  const showHint = () => {
    setHint(true);
    main.current?.focus({ preventScroll: true }); // the Hint button disables itself; keep the keyboard on the next action
  };
  const next = () => {
    moved.current = true;
    if (last) return setDone(true);
    setI(i + 1);
    setHint(false);
    setShown(false);
  };
  const act = () => (shown ? next() : setShown(true));
  const restart = () => {
    moved.current = true;
    setI(0);
    setHint(false);
    setShown(false);
    setDone(false);
    setNotes(steps.map(() => ''));
  };
  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      act();
    }
  };

  return (
    <div className="ways-socratic" aria-label={`Work out ${title}, step by step`} role="group">
      <div className="ways-socratic__top">
        <p className="ways-socratic__count">{done ? `All ${n} steps done` : `Step ${i + 1} of ${n}`}</p>
        <ol className="ways-socratic__dots" aria-hidden="true">
          {steps.map((_, k) => <li key={k} data-state={done || k < i ? 'done' : k === i ? 'now' : 'todo'} />)}
        </ol>
      </div>

      {!done ? (
        <div className={`ways-socratic__step${moved.current ? ' ways-socratic__step--in' : ''}`} key={i}>
          <p className="ways-socratic__ask" ref={ask} tabIndex={-1}>{s.ask}</p>
          <label className="ways-socratic__think">
            <span className="ways-socratic__think-label">Your thought <span className="ways-socratic__opt">(optional)</span></span>
            <textarea
              rows={2}
              value={notes[i]}
              onChange={(e) => setNotes(notes.map((x, k) => (k === i ? e.target.value : x)))}
              onKeyDown={onKey}
              aria-keyshortcuts="Control+Enter Meta+Enter"
            />
          </label>
          <div className="ways-socratic__reveals" aria-live="polite">
            {hint && <p className="ways-socratic__hint"><span className="ways-socratic__label">Hint</span>{s.hint}</p>}
            {shown && <p className="ways-socratic__answer"><span className="ways-socratic__label">Answer</span>{s.answer}</p>}
          </div>
          <div className="ways-socratic__actions">
            <button className="btn btn--ghost" type="button" onClick={showHint} disabled={hint || shown}>Hint</button>
            <button className="btn btn--primary" type="button" ref={main} onClick={act}>
              {!shown ? 'Show answer' : last ? 'Finish' : 'Next question'}
            </button>
          </div>
        </div>
      ) : (
        <div className="ways-socratic__step ways-socratic__step--in ways-socratic__end">
          <p className="ways-socratic__ask" ref={end} tabIndex={-1}>That is every step. Now try it without the hints.</p>
          <div className="ways-socratic__actions">
            <a className="btn btn--primary" href={quizHref}>Quiz me</a>
            <button className="btn btn--ghost" type="button" onClick={restart}>Start again</button>
          </div>
        </div>
      )}
    </div>
  );
}
