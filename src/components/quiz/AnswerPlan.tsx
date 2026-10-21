// Answer-plan step before a long answer: issues → authorities → order. Each point is an issue with its authorities;
// reorder by dragging the handle (pointer) or with the ↑/↓ buttons (keyboard). Transform-only while dragging.
import { useRef, useState, type PointerEvent as RPointerEvent } from 'react';

export interface PlanPoint { id: string; issue: string; authorities: string }

let seq = 0;
const blank = (): PlanPoint => ({ id: `p${++seq}`, issue: '', authorities: '' });

export function AnswerPlan({ onDone, template }: { onDone: (plan: PlanPoint[]) => void; template: 'ilac' | 'essay' }) {
  const [points, setPoints] = useState<PlanPoint[]>([blank(), blank()]);
  const [drag, setDrag] = useState<{ id: string; dy: number } | null>(null);
  const list = useRef<HTMLOListElement>(null);
  const start = useRef({ y: 0, index: 0, h: 0 });

  const update = (id: string, patch: Partial<PlanPoint>) => setPoints((ps) => ps.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  const move = (from: number, to: number) =>
    setPoints((ps) => {
      if (to < 0 || to >= ps.length) return ps;
      const next = [...ps];
      const [x] = next.splice(from, 1);
      next.splice(to, 0, x);
      return next;
    });

  const onDown = (e: RPointerEvent, id: string, index: number) => {
    const row = (e.currentTarget as HTMLElement).closest('li')!;
    start.current = { y: e.clientY, index, h: row.getBoundingClientRect().height + 8 };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setDrag({ id, dy: 0 });
  };
  const onMove = (e: RPointerEvent) => {
    if (!drag) return;
    setDrag({ ...drag, dy: e.clientY - start.current.y });
  };
  const onUp = () => {
    if (!drag) return;
    const shift = Math.round(drag.dy / start.current.h);
    move(start.current.index, Math.max(0, Math.min(points.length - 1, start.current.index + shift)));
    setDrag(null);
  };

  const filled = points.filter((p) => p.issue.trim());
  const labels = template === 'ilac' ? { issue: 'Issue', auth: 'Authorities' } : { issue: 'Argument', auth: 'Support (theorists, cases, examples)' };

  return (
    <section className="plan" aria-labelledby="plan-h">
      <h3 id="plan-h" className="plan__title">Plan first</h3>
      <p className="plan__lede">{template === 'ilac' ? 'List the issues, the authority for each, then put them in the order you will answer them.' : 'List your arguments and support, then order them into a line of argument.'}</p>
      <ol className="plan__list" ref={list}>
        {points.map((p, i) => (
          <li key={p.id} className="plan__row" data-dragging={drag?.id === p.id || undefined}
              style={drag?.id === p.id ? { transform: `translateY(${drag.dy}px)` } : undefined}>
            <button type="button" className="plan__handle" data-cursor="drag" aria-label={`Drag to reorder point ${i + 1}`}
                    onPointerDown={(e) => onDown(e, p.id, i)} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>⋮⋮</button>
            <span className="plan__n mono" aria-hidden="true">{i + 1}</span>
            <div className="plan__fields">
              <label>
                <span className="label">{labels.issue}</span>
                <input value={p.issue} onChange={(e) => update(p.id, { issue: e.currentTarget.value })} />
              </label>
              <label>
                <span className="label">{labels.auth}</span>
                <input value={p.authorities} onChange={(e) => update(p.id, { authorities: e.currentTarget.value })} />
              </label>
            </div>
            <span className="plan__moves">
              <button type="button" className="btn btn--ghost btn--icon btn--sm" aria-label={`Move point ${i + 1} up`} disabled={i === 0} onClick={() => move(i, i - 1)}>↑</button>
              <button type="button" className="btn btn--ghost btn--icon btn--sm" aria-label={`Move point ${i + 1} down`} disabled={i === points.length - 1} onClick={() => move(i, i + 1)}>↓</button>
            </span>
          </li>
        ))}
      </ol>
      <div className="plan__actions">
        <button type="button" className="btn btn--ghost btn--sm" onClick={() => setPoints((ps) => [...ps, blank()])}>Add a point</button>
        <button type="button" className="btn btn--primary" disabled={!filled.length} onClick={() => onDone(filled)}>Start writing</button>
      </div>
    </section>
  );
}
