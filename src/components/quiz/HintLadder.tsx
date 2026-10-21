// Hint ladder (feature 136): before marking, a "Hint" button opens one rung at a time, from a nudge to a near-give-away:
// 1 a Socratic question from the concept's aid (with its hint), 2 the elements or terms to cover, 3 the marking
// criteria, 4 the model answer's opening sentence. Rungs 1–2 are skipped when the concept has no aid yet.
// The parent owns the count (it is saved on the attempt as `hints`).
import { useId, useMemo, type ReactNode } from 'react';
import { sentences } from '../../lib/match';
import { useAid } from './AfterWrong';
import type { RubricRow } from './types';
import '../../styles/practice.css';

interface Props {
  questionId: string;
  unit: string;
  concept: string;
  rubric: RubricRow[];
  model: string;
  /** Rungs opened so far (controlled). */
  opened: number;
  onOpen: (n: number) => void;
}

interface Rung { kind: 'socratic' | 'cover' | 'rubric' | 'opening'; label: string; body: ReactNode }

/** Stable pick among several Socratic questions, so each question on a concept nudges differently. */
function pickIndex(seed: string, n: number) {
  let h = 2166136261;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return Math.abs(h) % n;
}

/** "Answered with 2 hints." (nothing for none). */
export const hintsLine = (n: number) => (n > 0 ? `Answered with ${n} ${n === 1 ? 'hint' : 'hints'}.` : '');

export function HintLadder({ questionId, unit, concept, rubric, model, opened, onOpen }: Props) {
  const aid = useAid(unit, concept);
  const uid = useId();

  const rungs = useMemo<Rung[]>(() => {
    const out: Rung[] = [];
    const soc = aid?.socratic ?? [];
    if (soc.length) {
      const s = soc[pickIndex(questionId, soc.length)];
      out.push({
        kind: 'socratic',
        label: 'Ask yourself',
        body: (
          <>
            <p className="hint-ladder__ask">{s.ask}</p>
            {s.hint && <p className="hint-ladder__nudge">{s.hint}</p>}
          </>
        ),
      });
    }
    const cover = aid?.elements?.length ? aid.elements.map((e) => e.name) : (aid?.terms ?? []).map((t) => t.term);
    if (cover.length) {
      out.push({
        kind: 'cover',
        label: aid?.elements?.length ? 'Elements to cover' : 'Terms to use',
        body: <ul className="hint-ladder__items">{cover.map((c, i) => <li key={i}>{c}</li>)}</ul>,
      });
    }
    if (rubric.length) {
      out.push({
        kind: 'rubric',
        label: 'What the marker looks for',
        body: <ul className="hint-ladder__items">{rubric.map((r) => <li key={r.id}>{r.criterion}</li>)}</ul>,
      });
    }
    const opening = sentences(model)[0];
    if (opening) out.push({ kind: 'opening', label: 'How the model answer opens', body: <p className="hint-ladder__opening">{opening}</p> });
    return out;
  }, [aid, questionId, rubric, model]);

  const total = rungs.length;
  const loading = aid === undefined;
  const done = opened >= total;
  // aria-disabled (not disabled) once every rung is open, so keyboard focus stays on the button.
  const unavailable = loading || done || total === 0;
  const open = () => { if (!unavailable) onOpen(opened + 1); };

  return (
    <section className="hint-ladder" aria-label="Hints" data-hints={opened}>
      <div className="hint-ladder__bar">
        <button
          type="button"
          className="btn btn--ghost hint-ladder__btn"
          aria-disabled={unavailable || undefined}
          aria-controls={`${uid}-rungs`}
          aria-busy={loading || undefined}
          onClick={open}
        >
          {opened === 0 ? 'Hint' : done ? 'No more hints' : 'Next hint'}
        </button>
        <p className="hint-ladder__count" aria-live="polite">{opened > 0 && total > 0 ? `Hint ${Math.min(opened, total)} of ${total}` : ''}</p>
      </div>
      <ol className="hint-ladder__rungs" id={`${uid}-rungs`} hidden={opened === 0}>
        {rungs.slice(0, opened).map((r) => (
          <li key={r.kind} className="hint-ladder__rung" data-rung={r.kind}>
            <p className="label hint-ladder__label">{r.label}</p>
            {r.body}
          </li>
        ))}
      </ol>
    </section>
  );
}
