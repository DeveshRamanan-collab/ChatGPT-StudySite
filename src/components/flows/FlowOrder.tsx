// Order the steps (feature 93): the longest route to a 'met' outcome, its questions and steps shuffled. Reorder by
// dragging the handle (pointer) or with the ↑/↓ buttons (keyboard, touch); "Check" marks every position in place or
// not (text + shape, not colour alone); "Show answer" sets the right order. Transform-only while dragging.
import { useMemo, useRef, useState, type PointerEvent as RPointerEvent } from 'react';
import { checkOrder, hashString, longestMetPath, moveItem, shuffle, type Flow } from '../../lib/flow';
import { toneOf } from './FlowNote';

interface Item { id: string; text: string; answer?: string; kind: 'ask' | 'step' | 'end' }

export default function FlowOrder({ flow }: { flow: Flow }) {
  const nodes = useMemo(() => new Map(flow.nodes.map((n) => [n.id, n])), [flow]);
  const route = useMemo(() => longestMetPath(flow), [flow]);
  const items = useMemo(() => new Map<string, Item>(route.map((e) => {
    const n = nodes.get(e.from)!;
    return [n.id, { id: n.id, text: n.text, answer: n.kind === 'ask' ? e.label : undefined, kind: n.kind }];
  })), [route, nodes]);
  const answer = useMemo(() => route.map((e) => e.from), [route]);
  const [round, setRound] = useState(0);
  const [order, setOrder] = useState(() => shuffle(answer, hashString(flow.id)));
  const [marks, setMarks] = useState<boolean[] | null>(null);
  const [shown, setShown] = useState(false);
  const [drag, setDrag] = useState<{ id: string; dy: number } | null>(null);
  const start = useRef({ y: 0, index: 0, h: 0 });

  const end = route.length ? nodes.get(route[route.length - 1].to) : undefined;
  if (answer.length < 2 || !end) return <p className="flow-order__empty">This flow is too short to put in order.</p>;

  const move = (from: number, to: number) => {
    setOrder((o) => moveItem(o, from, to));
    setMarks(null);
    setShown(false);
  };
  const onDown = (e: RPointerEvent, id: string, index: number) => {
    const row = (e.currentTarget as HTMLElement).closest('li')!;
    start.current = { y: e.clientY, index, h: row.getBoundingClientRect().height + 8 };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setDrag({ id, dy: 0 });
  };
  const onMove = (e: RPointerEvent) => { if (drag) setDrag({ ...drag, dy: e.clientY - start.current.y }); };
  const onUp = () => {
    if (!drag) return;
    const shift = Math.round(drag.dy / start.current.h);
    if (shift) move(start.current.index, Math.max(0, Math.min(order.length - 1, start.current.index + shift)));
    setDrag(null);
  };
  const check = () => setMarks(checkOrder(order, answer));
  const reveal = () => { setOrder(answer); setMarks(answer.map(() => true)); setShown(true); };
  const again = () => { const r = round + 1; setRound(r); setOrder(shuffle(answer, hashString(flow.id) + r)); setMarks(null); setShown(false); };

  const right = marks?.filter(Boolean).length ?? 0;
  const tone = toneOf(end);
  return (
    <section className="flow-order" aria-labelledby="flow-order-h">
      <h2 className="visually-hidden" id="flow-order-h">Order the steps</h2>
      <p className="flow-order__goal">
        Put these in the order you would take them to reach this outcome:{' '}
        <span className="flow-tone" data-tone={end.tone}><span aria-hidden="true">{tone.glyph}</span> {tone.word}</span>{' '}
        <span className="flow-order__end">{end.text}</span>
      </p>
      <ol className="flow-order__list">
        {order.map((id, i) => {
          const it = items.get(id)!;
          const mark = marks ? (marks[i] ? 'right' : 'wrong') : undefined;
          return (
            <li
              key={id}
              className="flow-order__row"
              data-mark={mark}
              data-dragging={drag?.id === id || undefined}
              style={drag?.id === id ? { transform: `translateY(${drag.dy}px)` } : undefined}
            >
              <button
                type="button"
                className="flow-order__handle"
                data-cursor="drag"
                aria-label={`Drag to move: ${it.text}`}
                onPointerDown={(e) => onDown(e, id, i)}
                onPointerMove={onMove}
                onPointerUp={onUp}
                onPointerCancel={onUp}
              >
                <svg width="12" height="18" viewBox="0 0 12 18" aria-hidden="true"><g fill="currentColor"><circle cx="3" cy="3" r="1.5" /><circle cx="9" cy="3" r="1.5" /><circle cx="3" cy="9" r="1.5" /><circle cx="9" cy="9" r="1.5" /><circle cx="3" cy="15" r="1.5" /><circle cx="9" cy="15" r="1.5" /></g></svg>
              </button>
              <span className="flow-order__n mono" aria-hidden="true">{i + 1}</span>
              <span className="flow-order__text">
                <span className="label">{it.kind === 'ask' ? 'Question' : 'Step'}</span>
                <span className="flow-order__q">{it.text}</span>
                {it.answer && <span className="flow-order__ans">Answer: {it.answer}</span>}
              </span>
              {mark && (
                <span className="flow-order__mark" data-mark={mark}>
                  <span aria-hidden="true">{mark === 'right' ? '✓' : '✕'}</span> {mark === 'right' ? 'In place' : 'Not here'}
                </span>
              )}
              <span className="flow-order__moves">
                <button type="button" className="btn btn--ghost btn--icon" aria-label={`Move up: ${it.text}`} disabled={i === 0} onClick={() => move(i, i - 1)}>↑</button>
                <button type="button" className="btn btn--ghost btn--icon" aria-label={`Move down: ${it.text}`} disabled={i === order.length - 1} onClick={() => move(i, i + 1)}>↓</button>
              </span>
            </li>
          );
        })}
      </ol>
      <p className="flow-order__status" aria-live="polite">
        {shown ? 'This is the order the flow takes.' : marks ? (right === marks.length ? 'All in order.' : `${right} of ${marks.length} in place.`) : ' '}
      </p>
      <div className="flow-order__actions">
        <button type="button" className="btn btn--primary" onClick={check}>Check</button>
        <button type="button" className="btn btn--ghost" onClick={reveal}>Show answer</button>
        <button type="button" className="btn btn--ghost" onClick={again}>Shuffle again</button>
      </div>
    </section>
  );
}
