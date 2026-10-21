// Timeline base: a draggable timeline for case-law or treaty development. Events sit evenly along a track (dates
// are labels, not a scale, because the materials don't date everything); the learner drags the handle, clicks a
// tick, or uses the keyboard (← → Home End) to move between them. Events up to the handle are drawn in ink, the
// rest wait in faint line; the chosen event's detail sits beneath the track. Off: no glide, same controls.
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { gsap } from 'gsap';
import { useExplainer } from '../context';
import { ExplainerCheck, type CheckOption } from './ExplainerCheck';
import { TermsBeat, type Term } from './TermsBeat';

export interface TimelineEvent {
  /** Only where the materials give it. */
  when?: string;
  title: string;
  body: string;
  /** Optional lane tag shown with the detail, e.g. "England" or "NSW statute". */
  tag?: string;
}

interface Props {
  terms: Term[];
  events: TimelineEvent[];
  check: { question: string; options: CheckOption[] };
  label: string;
}

export function Timeline({ terms, events, check, label }: Props) {
  const { motion } = useExplainer();
  const n = events.length;
  const [i, setI] = useState(0);
  const [dragging, setDragging] = useState(false);
  const track = useRef<HTMLDivElement>(null);
  const handle = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0 }); // handle position, 0..1
  const frac = (k: number) => (n > 1 ? k / (n - 1) : 0);

  const place = (x: number) => track.current?.style.setProperty('--x', String(x)); // handle + fill follow --x
  // Glide the handle to an event (instant when off; quick when calm).
  const glide = (k: number) => {
    const to = frac(k);
    gsap.killTweensOf(pos.current);
    if (motion === 'off') { pos.current.x = to; place(to); return; }
    gsap.to(pos.current, { x: to, duration: motion === 'calm' ? 0.12 : 0.35, ease: 'power2.out', onUpdate: () => place(pos.current.x) });
  };
  const go = (k: number) => { const c = Math.max(0, Math.min(n - 1, k)); setI(c); glide(c); };
  useEffect(() => { place(pos.current.x); }, []);

  const fromPointer = (clientX: number) => {
    const r = track.current!.getBoundingClientRect();
    return Math.max(0, Math.min(1, (clientX - r.left) / Math.max(1, r.width)));
  };
  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    gsap.killTweensOf(pos.current);
    setDragging(true);
    handle.current?.focus({ preventScroll: true });
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    const x = fromPointer(e.clientX);
    pos.current.x = x;
    place(x);
    setI(Math.round(x * (n - 1)));
  };
  const onUp = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    setDragging(false);
    go(Math.round(fromPointer(e.clientX) * (n - 1))); // snap to the nearest event
  };
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const k = { ArrowRight: i + 1, ArrowUp: i + 1, ArrowLeft: i - 1, ArrowDown: i - 1, Home: 0, End: n - 1 }[e.key];
    if (k === undefined) return;
    e.preventDefault();
    go(k);
  };

  const ev = events[i];
  return (
    <div className="xtl" data-dragging={dragging || undefined}>
      <TermsBeat terms={terms} />
      <div className="xtl__body">
        <div className="xtl__rail" onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
          <div className="xtl__track" ref={track}>
            <div className="xtl__fill" />
            {events.map((e, k) => (
              <button
                key={k}
                type="button"
                className="xtl__tick"
                style={{ left: `${frac(k) * 100}%` }}
                data-on={k <= i || undefined}
                data-current={k === i || undefined}
                tabIndex={-1}
                aria-label={`${e.when ? `${e.when}, ` : ''}${e.title}`}
                onClick={() => go(k)}
              >
                <span className="xtl__when mono" aria-hidden="true">{e.when ?? '·'}</span>
              </button>
            ))}
            <div
              ref={handle}
              className="xtl__handle"
              data-cursor="drag"
              role="slider"
              tabIndex={0}
              aria-label={label}
              aria-valuemin={1}
              aria-valuemax={n}
              aria-valuenow={i + 1}
              aria-valuetext={`${i + 1} of ${n}: ${ev.when ? `${ev.when}, ` : ''}${ev.title}`}
              onPointerDown={onDown}
              onKeyDown={onKey}
            />
          </div>
          <p className="xtl__hint">Drag the handle, click a mark, or use the arrow keys.</p>
        </div>
        <article className="xtl__detail" key={i} aria-live="polite" data-event={i}>
          <p className="xtl__meta mono">{i + 1} / {n}{ev.when ? ` · ${ev.when}` : ''}{ev.tag ? ` · ${ev.tag}` : ''}</p>
          <h3 className="xtl__title">{ev.title}</h3>
          <p className="xtl__text">{ev.body}</p>
        </article>
      </div>
      <ExplainerCheck {...check} />
    </div>
  );
}
