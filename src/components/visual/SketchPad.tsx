// Draw it (feature 98): a sketch pad (pointer events on a canvas: pen, eraser, undo, clear) under the prompt "Draw
// how the parts of <concept> fit together". "Compare" shows the reference beside the sketch — the aid's elements as
// an ordered diagram, or the week's decision flow as an indented outline — then a self-rating (Got it / Partly /
// Missed) is recorded (`visual:sketch:<concept>`, type 'short', score 1 / 0.5 / 0, correct null, mode 'visual').
// Strokes are stored in normalised 0–1 coordinates in IndexedDB settings (`sketch:<concept>`), so a sketch comes
// back on any screen size; the pen takes the theme's ink, so it redraws when the theme changes. Clear is undoable.
import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as RPointerEvent } from 'react';
import { db } from '../../lib/db';
import { flowSlug } from '../../lib/flow';
import { recordAttempt } from '../../lib/learning';
import {
  isBlank, parseSketch, SELF_RATES, sketchItems, sketchKey, thin, visibleStrokes, visualId,
  type ConceptRef, type Pt, type SavedSketch, type SelfRate, type SketchItem, type SketchOp, type Stroke,
} from '../../lib/visual';
import { TONE } from '../flows/FlowNote';
import { ConceptPicker, leftOut } from './LabelDrag';
import type { PanelProps } from './VisualPractice';

export default function SketchPad({ unit, aids, flows, concepts }: PanelProps) {
  const items = useMemo(() => sketchItems(aids, flows), [aids, flows]);
  const [concept, setConcept] = useState(items[0]?.concept ?? '');
  const [saved, setSaved] = useState<Set<string>>(new Set());
  useEffect(() => {
    db.settings.where('key').startsWith('sketch:').primaryKeys()
      .then((keys) => setSaved(new Set(keys.map((k) => String(k).slice('sketch:'.length)))))
      .catch(() => {});
  }, []);
  const item = items.find((i) => i.concept === concept) ?? items[0];
  if (!item) return null;
  const skipped = aids.length - items.length;
  const onSaved = (c: string, has: boolean) => setSaved((s) => {
    if (s.has(c) === has) return s;
    const n = new Set(s);
    if (has) n.add(c); else n.delete(c);
    return n;
  });
  return (
    <div className="vis-sketch">
      <ConceptPicker ids={items.map((i) => i.concept)} value={item.concept} onChange={setConcept} concepts={concepts} suffix={(id) => (saved.has(id) ? ' · sketched' : '')} />
      {skipped > 0 && (
        <p className="vis__note">{leftOut(skipped, aids.length, 'neither parts nor a decision flow to compare with')}</p>
      )}
      <SketchBoard key={item.concept} item={item} unit={unit} concept={concepts[item.concept]} onSaved={onSaved} />
    </div>
  );
}

const DPR_MAX = 2;
const when = (at: number) => new Date(at).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', timeZone: 'Australia/Sydney' });
const AFTER: Record<SelfRate, string> = {
  got: 'Recorded. Sketch it again in a few days to check it has stuck.',
  partly: 'Recorded. Look at what you left out, then draw it again from memory.',
  missed: 'Recorded. Study the reference for a minute, hide it, then draw it again.',
};

function lineWidth(s: Stroke, w: number) {
  return s.tool === 'eraser' ? Math.max(16, w * 0.035) : Math.max(2, w * 0.004);
}
function paint(ctx: CanvasRenderingContext2D, s: Stroke, w: number, h: number, color: string) {
  const lw = lineWidth(s, w);
  ctx.globalCompositeOperation = s.tool === 'eraser' ? 'destination-out' : 'source-over';
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = lw;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  const p = s.points;
  if (p.length === 1) {
    ctx.beginPath();
    ctx.arc(p[0][0] * w, p[0][1] * h, lw / 2, 0, Math.PI * 2);
    ctx.fill();
  } else if (p.length > 1) {
    ctx.beginPath();
    ctx.moveTo(p[0][0] * w, p[0][1] * h);
    for (let i = 1; i < p.length; i++) ctx.lineTo(p[i][0] * w, p[i][1] * h);
    ctx.stroke();
  }
  ctx.globalCompositeOperation = 'source-over';
}

function SketchBoard({ item, unit, concept, onSaved }: { item: SketchItem; unit: string; concept?: ConceptRef; onSaved: (c: string, has: boolean) => void }) {
  const key = sketchKey(item.concept);
  const title = concept?.title ?? item.concept;
  const [ops, setOps] = useState<SketchOp[]>([]);
  const [tool, setTool] = useState<Stroke['tool']>('pen');
  const [compare, setCompare] = useState(false);
  const [rated, setRated] = useState<SelfRate | null>(null);
  const [status, setStatus] = useState('');
  const canvas = useRef<HTMLCanvasElement>(null);
  const live = useRef<Stroke | null>(null);
  const opsRef = useRef(ops);
  opsRef.current = ops;
  const started = useRef(0);
  const refHead = useRef<HTMLHeadingElement>(null);
  const pending = useRef<{ ops: SketchOp[]; timer: number } | null>(null);
  const savedRef = useRef(onSaved);
  savedRef.current = onSaved;

  // Persist: debounced; a pending write is flushed when the board unmounts (switching concept or week).
  const write = useCallback((next: SketchOp[]) => {
    pending.current = null;
    const blank = isBlank(next);
    const value: SavedSketch = { v: 1, ops: visibleStrokes(next), at: Date.now() };
    (blank ? db.settings.delete(key) : db.settings.put({ key, value }))
      .then(() => savedRef.current(item.concept, !blank))
      .catch(() => setStatus('Not saved: storage is unavailable in this window.'));
  }, [key, item.concept]);
  const commit = (next: SketchOp[]) => {
    opsRef.current = next; // strokes that end before the next render still build on this one
    setOps(next);
    if (pending.current) clearTimeout(pending.current.timer);
    pending.current = { ops: next, timer: window.setTimeout(() => write(next), 400) };
  };
  useEffect(() => () => {
    const p = pending.current;
    if (p) { clearTimeout(p.timer); write(p.ops); }
  }, [write]);

  useEffect(() => {
    let alive = true;
    started.current = performance.now();
    db.settings.get(key).then((r) => {
      const s = parseSketch(r?.value);
      if (!alive || !s || !s.ops.length) return;
      setOps(s.ops);
      setStatus(`Your sketch${s.at ? ` from ${when(s.at)}` : ''} is back. Add to it, or Clear to start again.`);
    }).catch(() => {});
    return () => { alive = false; };
  }, [key]);

  // Drawing surface: sized to its box at DPR ≤ 2; redrawn on resize, on change and when the theme changes.
  const redraw = useCallback(() => {
    const c = canvas.current;
    const ctx = c?.getContext('2d');
    if (!c || !ctx || !c.clientWidth) return;
    const w = c.clientWidth, h = c.clientHeight;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.setTransform(c.width / w, 0, 0, c.height / h, 0, 0);
    const color = getComputedStyle(c).getPropertyValue('--ink').trim() || '#1F1B16';
    for (const s of visibleStrokes(opsRef.current)) paint(ctx, s, w, h, color);
    if (live.current) paint(ctx, live.current, w, h, color);
  }, []);
  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const fit = () => {
      const dpr = Math.min(DPR_MAX, devicePixelRatio || 1);
      c.width = Math.round(c.clientWidth * dpr);
      c.height = Math.round(c.clientHeight * dpr);
      redraw();
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(c);
    const mo = new MutationObserver(redraw);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    const mq = matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', redraw);
    return () => { ro.disconnect(); mo.disconnect(); mq.removeEventListener('change', redraw); };
  }, [redraw]);
  useEffect(redraw, [ops, redraw]);

  const pt = (e: { clientX: number; clientY: number }): Pt => {
    const r = canvas.current!.getBoundingClientRect();
    const clamp = (n: number) => Math.min(1, Math.max(0, n));
    return [clamp((e.clientX - r.left) / r.width), clamp((e.clientY - r.top) / r.height)];
  };
  const segment = (a: Pt, b: Pt, s: Stroke) => {
    const c = canvas.current;
    const ctx = c?.getContext('2d');
    if (!c || !ctx) return;
    paint(ctx, { tool: s.tool, points: [a, b] }, c.clientWidth, c.clientHeight, getComputedStyle(c).getPropertyValue('--ink').trim() || '#1F1B16');
  };
  const down = (e: RPointerEvent<HTMLCanvasElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    e.preventDefault();
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* capture is a nicety */ }
    live.current = { tool, points: [pt(e)] };
    redraw();
  };
  const move = (e: RPointerEvent<HTMLCanvasElement>) => {
    const s = live.current;
    if (!s) return;
    const events = e.nativeEvent.getCoalescedEvents?.() ?? [];
    for (const ev of events.length ? events : [e.nativeEvent]) {
      const p = pt(ev);
      segment(s.points[s.points.length - 1], p, s);
      s.points.push(p);
    }
  };
  const up = () => {
    const s = live.current;
    if (!s) return;
    live.current = null;
    commit([...opsRef.current, { tool: s.tool, points: thin(s.points) }]);
    if (status) setStatus('');
  };

  const strokes = visibleStrokes(ops);
  const undo = () => { commit(ops.slice(0, -1)); setStatus(ops[ops.length - 1]?.tool === 'clear' ? 'Sketch brought back.' : 'Last stroke undone.'); };
  const clear = () => { commit([...ops, { tool: 'clear' }]); setStatus('Cleared. Undo brings it back.'); };
  const openCompare = () => {
    setCompare(true);
    setStatus('');
    requestAnimationFrame(() => refHead.current?.focus({ preventScroll: true }));
  };
  const rate = (id: SelfRate) => {
    if (rated) return;
    setRated(id);
    setStatus(AFTER[id]);
    recordAttempt({
      questionId: visualId('sketch', item.concept), unit, concept: item.concept, week: item.week, type: 'short',
      answer: { strokes: strokes.length, reference: item.ref.kind }, correct: null, score: SELF_RATES.find((r) => r.id === id)!.score,
      mode: 'visual', durationMs: Math.round(performance.now() - started.current),
    }).catch((e) => console.warn(e));
  };
  const again = () => {
    if (strokes.length) commit([...ops, { tool: 'clear' }]);
    setCompare(false);
    setRated(null);
    started.current = performance.now();
    setStatus(strokes.length ? 'A fresh page. Undo brings your last sketch back.' : 'A fresh page.');
  };

  return (
    <div className="vis-sketch__board">
      <h2 className="vis-sketch__prompt">
        <span className="label">Draw from memory</span>
        <span>Draw how the parts of {concept ? <a href={concept.href}>{title}</a> : title} fit together</span>
      </h2>
      <div className="vis-sketch__stage" data-compare={compare || undefined}>
        <div className="vis-sketch__pad">
          <div className="vis-sketch__tools" role="group" aria-label="Drawing tools">
            <button type="button" className="vis-sketch__tool" aria-pressed={tool === 'pen'} onClick={() => setTool('pen')}>
              <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true"><path d="M4 16l1-4 8-8 3 3-8 8-4 1z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>
              Pen
            </button>
            <button type="button" className="vis-sketch__tool" aria-pressed={tool === 'eraser'} onClick={() => setTool('eraser')}>
              <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true"><path d="M8 16h8M3.5 12.5l7-7 5 5-5.5 5.5h-3z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>
              Eraser
            </button>
            <span className="vis-sketch__sep" aria-hidden="true" />
            <button type="button" className="vis-sketch__tool" onClick={undo} disabled={!ops.length}>Undo</button>
            <button type="button" className="vis-sketch__tool" onClick={clear} disabled={!strokes.length}>Clear</button>
          </div>
          <div className="vis-sketch__surface" data-tool={tool}>
            <canvas
              ref={canvas}
              className="vis-sketch__canvas"
              role="img"
              aria-label={`Your sketch of ${title}${strokes.length ? '' : ' (blank)'}`}
              data-cursor="default"
              data-strokes={strokes.length}
              onPointerDown={down}
              onPointerMove={move}
              onPointerUp={up}
              onPointerCancel={up}
              onLostPointerCapture={up}
            />
          </div>
          <p className="vis-sketch__hint">Boxes, arrows and a few words are plenty. Your sketch stays on this device. Drawing needs a mouse, pen or finger; you can still compare and rate from memory.</p>
        </div>

        {compare && (
          <section className="vis-sketch__ref" aria-labelledby={`ref-${item.concept}`}>
            <h3 className="vis-sketch__ref-h" id={`ref-${item.concept}`} ref={refHead} tabIndex={-1}>
              {item.ref.kind === 'elements' ? 'The parts, in order' : 'The decision flow'}
            </h3>
            <Reference item={item} unit={unit} />
          </section>
        )}
      </div>

      <p className="vis__status" aria-live="polite">{status || ' '}</p>
      {!compare ? (
        <div className="vis__actions">
          <button type="button" className="btn btn--primary" onClick={openCompare}>Compare</button>
          {!strokes.length && <span className="vis-sketch__nudge">Sketch first, then compare: recalling before you look is what makes it stick.</span>}
        </div>
      ) : (
        <>
          <div className="vis-sketch__rate" role="group" aria-label="How close was your sketch?" data-rated={rated ?? undefined}>
            <span className="vis-sketch__rate-label">How close was your sketch?</span>
            <span className="vis-sketch__rate-opts">
              {SELF_RATES.map((r) => (
                <button key={r.id} type="button" className="btn btn--secondary vis-sketch__rate-btn" aria-pressed={rated === r.id} disabled={rated !== null} onClick={() => rate(r.id)}>
                  {r.label}
                </button>
              ))}
            </span>
          </div>
          <div className="vis__actions">
            <button type="button" className="btn btn--ghost" onClick={() => setCompare(false)}>Hide the reference</button>
            <button type="button" className="btn btn--ghost" onClick={again}>Draw it again</button>
          </div>
        </>
      )}
    </div>
  );
}

function Reference({ item, unit }: { item: SketchItem; unit: string }) {
  const ref = item.ref;
  if (ref.kind === 'elements') {
    return (
      <ol className="vis-ref__steps">
        {ref.elements.map((e, i) => (
          <li key={i} className="vis-ref__step">
            <span className="vis-label__n mono" aria-hidden="true">{i + 1}</span>
            <span className="vis-ref__box">
              <strong className="vis-ref__name">{e.name}</strong>
              {e.test && <span className="vis-ref__test">{e.test}</span>}
            </span>
          </li>
        ))}
      </ol>
    );
  }
  return (
    <>
      <p className="vis-ref__flow">{ref.title} · <a href={`/${unit}/flow/${flowSlug(ref.flowId, unit)}`}>Walk this flow</a></p>
      <ul className="vis-ref__outline">
        {ref.outline.map((l, i) => (
          <li key={i} className="vis-ref__line" data-kind={l.kind} style={{ ['--depth' as string]: l.depth }}>
            {l.label && <span className="vis-ref__branch">{l.label}</span>}
            {l.kind === 'end' && l.tone ? (
              <span className="vis-ref__end" data-tone={l.tone}><span aria-hidden="true">{TONE[l.tone].glyph}</span> {TONE[l.tone].word}: {l.text}</span>
            ) : l.kind === 'ref' ? (
              <span className="vis-ref__again">Continues as above: {l.text}</span>
            ) : (
              <span>{l.text}</span>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
