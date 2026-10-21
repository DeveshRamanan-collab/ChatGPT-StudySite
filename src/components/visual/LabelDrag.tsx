// Label the parts (feature 92): a rule's requirements drawn as ordered empty boxes (the aid's `elements`, in order);
// the element names are shuffled tiles. Mouse and pen drag a tile onto a box; touch and keyboard select a tile, then
// a box (tap-tap). A box holds one part: dropping onto a full box swaps. "Check" marks every box Right / Wrong with an
// icon and a word; "Show answer" sets the rule's order. The first Check of a round is recorded
// (`visual:label:<concept>`, score = share of boxes right, mode 'visual').
import { useEffect, useMemo, useRef, useState, type PointerEvent as RPointerEvent, type RefObject } from 'react';
import { recordAttempt } from '../../lib/learning';
import { checkSlots, labelSet, labelTiles, placeInSlot, share, visualId, type ConceptRef, type LabelSet } from '../../lib/visual';
import type { PanelProps } from './VisualPractice';

// ---------- Shared by Label and Sort ----------

export interface DragInfo { id: string; dx: number; dy: number; over: string | null }

/**
 * Pointer drag for tiles (mouse and pen only: touch keeps scrolling and uses tap-tap). Drop targets are elements
 * inside `root` carrying data-drop="<target id>"; the target is found from their boxes, not from hit-testing, so the
 * dragged tile never hides it. The click the browser fires after a drag is swallowed via `consumeClick`.
 */
export function useTileDrag(root: RefObject<HTMLElement | null>, onDrop: (item: string, target: string) => void) {
  const [drag, setDrag] = useState<DragInfo | null>(null);
  const start = useRef<{ id: string; x: number; y: number; moved: boolean } | null>(null);
  const justDragged = useRef(false);
  const drop = useRef(onDrop);
  drop.current = onDrop;
  const targetAt = (x: number, y: number) => {
    for (const el of root.current?.querySelectorAll<HTMLElement>('[data-drop]') ?? []) {
      const r = el.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return el.dataset.drop ?? null;
    }
    return null;
  };
  const bind = (id: string) => ({
    onPointerDown: (e: RPointerEvent<HTMLElement>) => {
      if (e.pointerType === 'touch' || e.button !== 0) return;
      start.current = { id, x: e.clientX, y: e.clientY, moved: false };
      // Capture now: a fast first move can already be outside the tile.
      try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* capture is a nicety */ }
    },
    onPointerMove: (e: RPointerEvent<HTMLElement>) => {
      const s = start.current;
      if (!s || s.id !== id) return;
      const dx = e.clientX - s.x, dy = e.clientY - s.y;
      if (!s.moved) {
        if (Math.hypot(dx, dy) < 6) return;
        s.moved = true;
      }
      setDrag({ id, dx, dy, over: targetAt(e.clientX, e.clientY) });
    },
    onPointerUp: (e: RPointerEvent<HTMLElement>) => {
      const s = start.current;
      start.current = null;
      if (!s?.moved) return;
      justDragged.current = true;
      setTimeout(() => { justDragged.current = false; }, 0);
      setDrag(null);
      const t = targetAt(e.clientX, e.clientY);
      if (t) drop.current(s.id, t);
    },
    onPointerCancel: () => { start.current = null; setDrag(null); },
  });
  const consumeClick = () => justDragged.current;
  /** Inline style for a tile being dragged (transform only). */
  const styleFor = (id: string) => (drag?.id === id ? { transform: `translate(${drag.dx}px, ${drag.dy}px)` } : undefined);
  return { drag, bind, consumeClick, styleFor };
}

/** Concept picker (native select: good on touch) with a "Next concept" step. */
export function ConceptPicker({ ids, value, onChange, concepts, suffix }: { ids: string[]; value: string; onChange: (id: string) => void; concepts: Record<string, ConceptRef>; suffix?: (id: string) => string }) {
  const i = ids.indexOf(value);
  return (
    <div className="vis-pick">
      <label className="vis-pick__field">
        <span className="label">Concept</span>
        <select className="vis-pick__select" value={value} onChange={(e) => onChange(e.target.value)}>
          {ids.map((id) => <option key={id} value={id}>{(concepts[id]?.title ?? id) + (suffix?.(id) ?? '')}</option>)}
        </select>
      </label>
      {ids.length > 1 && (
        <button type="button" className="btn btn--ghost vis-pick__next" onClick={() => onChange(ids[(i + 1) % ids.length])}>
          Next concept <span aria-hidden="true">→</span>
        </button>
      )}
    </div>
  );
}

/** "1 of 7 concepts this week has …, so it is left out." (plural-aware) */
export const leftOut = (n: number, total: number, what: string) =>
  `${n} of ${total} concepts this week ${n === 1 ? 'has' : 'have'} ${what}, so ${n === 1 ? 'it is' : 'they are'} left out.`;

export const MARK = {
  right: { glyph: '✓', word: 'Right' },
  wrong: { glyph: '✕', word: 'Wrong' },
} as const;

export function Mark({ ok, wrongWord = 'Wrong', className }: { ok: boolean; wrongWord?: string; className: string }) {
  return (
    <span className={className} data-mark={ok ? 'right' : 'wrong'}>
      <span aria-hidden="true">{ok ? MARK.right.glyph : MARK.wrong.glyph}</span> {ok ? MARK.right.word : wrongWord}
    </span>
  );
}

// ---------- Label the parts ----------

export default function LabelDrag({ unit, aids, concepts }: PanelProps) {
  const sets = useMemo(() => aids.map(labelSet).filter((s): s is LabelSet => !!s), [aids]);
  const [concept, setConcept] = useState(sets[0]?.concept ?? '');
  const set = sets.find((s) => s.concept === concept) ?? sets[0];
  if (!set) return null;
  const skipped = aids.length - sets.length;
  return (
    <div className="vis-label">
      <ConceptPicker ids={sets.map((s) => s.concept)} value={set.concept} onChange={setConcept} concepts={concepts} />
      {skipped > 0 && (
        <p className="vis__note">{leftOut(skipped, aids.length, 'no parts listed yet')}</p>
      )}
      <LabelBoard key={set.concept} set={set} unit={unit} concept={concepts[set.concept]} />
    </div>
  );
}

function LabelBoard({ set, unit, concept }: { set: LabelSet; unit: string; concept?: ConceptRef }) {
  const [round, setRound] = useState(0);
  const tiles = useMemo(() => labelTiles(set, 1 + round * 7919), [set, round]);
  const names = useMemo(() => new Map(tiles.map((t) => [t.id, t.name])), [tiles]);
  const [slots, setSlots] = useState<(string | null)[]>(() => set.slots.map(() => null));
  const [selected, setSelected] = useState<string | null>(null);
  const [marks, setMarks] = useState<boolean[] | null>(null);
  const [shown, setShown] = useState(false);
  const [status, setStatus] = useState('');
  const recorded = useRef(false);
  const started = useRef(0);
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => { started.current = performance.now(); }, [round]);

  const title = concept?.title ?? set.concept;
  const name = (id: string) => `“${names.get(id) ?? ''}”`;
  const dirty = () => { setMarks(null); setShown(false); };
  const place = (item: string, target: string) => {
    if (target === 'tray') {
      setSlots((s) => s.map((x) => (x === item ? null : x)));
      setStatus(`${name(item)} is back with the parts.`);
    } else {
      const i = Number(target.replace('slot-', ''));
      setSlots((s) => placeInSlot(s, item, i));
      setStatus(`${name(item)} placed in box ${i + 1}.`);
    }
    setSelected(null);
    dirty();
  };
  const { drag, bind, consumeClick, styleFor } = useTileDrag(root, place);

  const tray = tiles.filter((t) => !slots.includes(t.id));
  const selectTile = (id: string) => {
    if (consumeClick()) return;
    if (selected === id) { setSelected(null); setStatus(''); return; }
    setSelected(id);
    setStatus(`${name(id)} chosen. Now choose its box.`);
  };
  const tapSlot = (i: number) => {
    if (consumeClick()) return;
    const occupant = slots[i];
    if (selected && selected !== occupant) return place(selected, `slot-${i}`);
    if (occupant) return selectTile(occupant);
    setStatus('Choose a part first, then its box.');
  };
  const toTray = () => { if (selected) place(selected, 'tray'); };

  const check = () => {
    const m = checkSlots(slots.map((id) => (id ? names.get(id)! : null)), set.slots);
    setMarks(m);
    setShown(false);
    setSelected(null);
    const right = m.filter(Boolean).length;
    setStatus(right === m.length ? 'All in place.' : `${right} of ${m.length} in place.`);
    if (!recorded.current) {
      recorded.current = true;
      recordAttempt({
        questionId: visualId('label', set.concept), unit, concept: set.concept, week: set.week, type: 'match',
        answer: slots.map((id) => (id ? names.get(id) : null)), correct: null, score: share(m), mode: 'visual',
        durationMs: Math.round(performance.now() - started.current),
      }).catch((e) => console.warn(e));
    }
  };
  const reveal = () => {
    const pool = [...tiles];
    setSlots(set.slots.map((s) => {
      const k = pool.findIndex((t) => t.name === s.name);
      return k < 0 ? null : pool.splice(k, 1)[0].id;
    }));
    setMarks(set.slots.map(() => true));
    setShown(true);
    setSelected(null);
    setStatus("This is the rule's order.");
  };
  const again = () => {
    setRound((r) => r + 1);
    setSlots(set.slots.map(() => null));
    setSelected(null);
    setMarks(null);
    setShown(false);
    recorded.current = false;
    setStatus('Shuffled. A fresh try.');
  };

  const placedSelected = !!selected && slots.includes(selected);
  const tile = (id: string, where: 'tray' | 'slot') => (
    <button
      key={id}
      type="button"
      className="vis-tile"
      data-cursor="drag"
      data-where={where}
      data-dragging={drag?.id === id || undefined}
      aria-pressed={selected === id}
      style={styleFor(id)}
      onClick={() => (where === 'slot' ? tapSlot(slots.indexOf(id)) : selectTile(id))}
      {...bind(id)}
    >
      {names.get(id)}
    </button>
  );

  return (
    <div className="vis-label__board" ref={root} data-selecting={selected ? '' : undefined} onKeyDown={(e) => { if (e.key === 'Escape' && selected) { setSelected(null); setStatus(''); } }}>
      <h2 className="vis-label__title">
        <span className="label">Put the parts in order</span>
        {concept ? <a href={concept.href}>{title}</a> : title}
      </h2>

      <section className="vis-label__tray" aria-label="Parts to place" data-drop="tray" data-over={drag?.over === 'tray' || undefined}>
        <div className="vis-label__tray-head">
          <span className="vis-label__tray-label">Parts <span className="mono">{tray.length}</span></span>
          {placedSelected && <button type="button" className="btn btn--ghost btn--sm" onClick={toTray}>Back to the parts</button>}
        </div>
        {tray.length ? (
          <div className="vis-label__tiles">{tray.map((t) => tile(t.id, 'tray'))}</div>
        ) : (
          <p className="vis-label__done">Every part is placed.</p>
        )}
      </section>

      <ol className="vis-label__slots" aria-label={`Requirements of ${title}, in order`}>
        {set.slots.map((s, i) => {
          const id = slots[i];
          const mark = marks ? marks[i] : undefined;
          return (
            <li
              key={i}
              className="vis-label__slot"
              data-drop={`slot-${i}`}
              data-over={drag?.over === `slot-${i}` || undefined}
              data-filled={id ? '' : undefined}
              data-mark={mark === undefined ? undefined : mark ? 'right' : 'wrong'}
            >
              <span className="vis-label__n mono" aria-hidden="true">{i + 1}</span>
              <span className="vis-label__box">
                {id ? tile(id, 'slot') : (
                  <button type="button" className="vis-label__empty" onClick={() => tapSlot(i)} aria-label={`Box ${i + 1}, empty${selected ? `: place ${name(selected)} here` : ''}`}>
                    {selected ? 'Place here' : 'Empty'}
                  </button>
                )}
              </span>
              {mark !== undefined && <Mark ok={mark} wrongWord={id ? 'Wrong' : 'Empty'} className="vis-label__mark" />}
            </li>
          );
        })}
      </ol>

      <p className="vis__status" aria-live="polite">{status || ' '}</p>
      <div className="vis__actions">
        <button type="button" className="btn btn--primary" onClick={check} disabled={tray.length === tiles.length}>Check</button>
        <button type="button" className="btn btn--ghost" onClick={reveal}>Show answer</button>
        <button type="button" className="btn btn--ghost" onClick={again}>Shuffle again</button>
      </div>

      {(marks || shown) && set.slots.some((s) => s.test) && (
        <details className="vis-label__tests">
          <summary>What each part asks</summary>
          <ol>{set.slots.map((s, i) => <li key={i}><strong>{s.name}</strong>{s.test && <> · {s.test}</>}</li>)}</ol>
        </details>
      )}
    </div>
  );
}

