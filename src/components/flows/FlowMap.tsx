// Decision flow as a top-to-bottom diagram (layout: src/lib/flow.ts). Questions are hexagons, steps square boxes,
// outcomes pills carrying their tone as a glyph and a word. The walk so far is drawn as a heavier line with a
// "you are here" frame that moves to the current node as the walk advances (feature 32).
//
// variant "full": interactive. Every node is a button; choosing one opens its note inside the diagram, anchored under
// the node, so the scroll position is kept (57). Choosing an outcome traces every route that reaches it and lists
// the answers each route needs under the diagram (39). Shown 1:1 inside its own horizontal scroll box (scaled down
// to fit only when that keeps text at ≥ 80%), so the page never scrolls sideways and SVG text stays crisp.
// variant "mini": a small, text-free picture of the same map beside the walk on wide screens (aria-hidden; the
// breadcrumb trail is the accessible version).
import { useId, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { conditions, pathsTo, routeNodes, type Flow, type FlowLayout, type LaidNode } from '../../lib/flow';
import { NodeDetail, TONE, hasDetail, kindWord, toneOf, type FlowRefs } from './FlowNote';

interface Props {
  flow: Flow;
  layout: FlowLayout;
  variant: 'full' | 'mini';
  /** Edge keys taken so far on the walk, and the walk's current node. */
  walkEdges: Set<string>;
  walkNodes: Set<string>;
  current: string;
  refs?: FlowRefs;
  selected?: string | null;
  traceEnd?: string | null;
  onSelect?: (id: string | null) => void;
  onClearTrace?: () => void;
}

const NOTE_W = 320;

/** Outline of a node (grown outward by g for the focus ring): hexagon for a question, square box for a step, pill for an outcome. */
function shape(n: LaidNode, g = 0) {
  const x = n.x - n.w / 2 - g, y = n.y - g, w = n.w + g * 2, h = n.h + g * 2;
  if (n.node.kind === 'ask') {
    const p = 12, m = y + h / 2;
    return `M${x + p} ${y}H${x + w - p}L${x + w} ${m}L${x + w - p} ${y + h}H${x + p}L${x} ${m}Z`;
  }
  const r = n.node.kind === 'end' ? Math.min(h / 2, 22 + g) : 4 + g;
  return `M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h - r}A${r} ${r} 0 0 1 ${x + w - r} ${y + h}H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`;
}

function tag(n: LaidNode) {
  const parts: string[] = [];
  if (n.node.kind === 'end') {
    const t = toneOf(n.node);
    parts.push(`${t.glyph} ${t.word}`);
  }
  if (n.node.exception) parts.push('Exception');
  return parts.join(' · ');
}

export default function FlowMap({ flow, layout: L, variant, walkEdges, walkNodes, current, refs, selected = null, traceEnd = null, onSelect, onClearTrace }: Props) {
  const full = variant === 'full';
  const uid = useId().replace(/:/g, '');
  const box = useRef<HTMLDivElement>(null);
  const note = useRef<HTMLDivElement>(null);
  const [avail, setAvail] = useState(0);
  const [noteH, setNoteH] = useState(0);
  const nodes = useMemo(() => new Map(flow.nodes.map((n) => [n.id, n])), [flow]);

  // Trace back: every route to the chosen outcome (capped), the edges and nodes they use, and their conditions.
  const routes = useMemo(() => (traceEnd ? pathsTo(flow, traceEnd, 50) : []), [flow, traceEnd]);
  const traceEdges = useMemo(() => new Set(routes.flat().map((e) => `${e.from}:${e.index}`)), [routes]);
  const traceNodes = useMemo(() => new Set(routes.flatMap((r) => routeNodes(flow.start, r))), [routes, flow.start]);
  const tracing = !!traceEnd && routes.length > 0;
  const onEdges = tracing ? traceEdges : walkEdges;
  const onNodes = tracing ? traceNodes : walkNodes;

  // Fit: 1:1 by default; scaled down only when the whole map then fits at ≥ 80%.
  useLayoutEffect(() => {
    if (!full || !box.current) return;
    const el = box.current;
    const measure = () => setAvail(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [full]);
  const fit = avail > 0 && L.width > avail ? avail / L.width : 1;
  const scale = full && fit >= 0.8 ? fit : 1;
  const W = L.width * scale, H = L.height * scale;

  // On opening, bring the current node (or the chosen one) into view inside the box (instant, horizontal only).
  useLayoutEffect(() => {
    if (!full || !box.current || !avail) return;
    const n = L.byId.get(selected ?? current);
    if (n) box.current.scrollLeft = Math.max(0, n.x * scale - box.current.clientWidth / 2);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [full, avail > 0]);

  const sel = selected ? L.byId.get(selected) : undefined;
  const noteW = Math.min(NOTE_W, Math.max(240, (avail || NOTE_W) - 16));
  const noteLeft = sel ? Math.max(8, Math.min(sel.x * scale - noteW / 2, W - noteW - 8)) : 0;
  const noteTop = sel ? (sel.y + sel.h) * scale + 10 : 0;

  // Measure the open note so the canvas grows to hold it (no inner vertical scroll), keep it in the box's view, and
  // move focus into it; closing returns focus to its node.
  useLayoutEffect(() => {
    if (!sel || !note.current) { setNoteH(0); return; }
    setNoteH(note.current.offsetHeight);
    const b = box.current;
    if (b) {
      const left = noteLeft, right = noteLeft + noteW;
      if (left < b.scrollLeft || right > b.scrollLeft + b.clientWidth) b.scrollLeft = Math.max(0, left - 8);
    }
    note.current.querySelector<HTMLElement>('[data-note-title]')?.focus({ preventScroll: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, traceEnd]);

  const close = () => {
    const id = selected;
    onSelect?.(null);
    if (id) requestAnimationFrame(() => box.current?.querySelector<HTMLElement>(`[data-node="${CSS.escape(id)}"]`)?.focus({ preventScroll: true }));
  };
  const onNodeKey = (e: KeyboardEvent, id: string) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect?.(id); }
  };

  const svg = (
    <svg
      className="flow-map__svg"
      viewBox={`0 0 ${L.width} ${L.height}`}
      width={full ? W : '100%'}
      height={full ? H : undefined}
      data-trace={tracing || undefined}
      {...(full ? { role: 'group', 'aria-label': `Map of “${flow.title}”: ${L.nodes.length} steps. Choose one to read its note.` } : { 'aria-hidden': true, focusable: false })}
    >
      <defs>
        <marker id={`${uid}-a`} viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
          <path d="M0 1L9 5L0 9Z" className="flow-map__arrow" />
        </marker>
        <marker id={`${uid}-ah`} viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="11" orient="auto-start-reverse">
          <path d="M0 1L9 5L0 9Z" className="flow-map__arrow flow-map__arrow--on" />
        </marker>
      </defs>
      <g className="flow-map__edges">
        {L.edges.map((e) => (
          <path key={e.key} className="flow-map__edge" d={e.d} markerEnd={`url(#${uid}-a)`} data-on={onEdges.has(e.key) || undefined} />
        ))}
      </g>
      <g className="flow-map__edges-on">
        {L.edges.map((e) => (
          <path key={e.key} className="flow-map__edge-on" d={e.d} markerEnd={`url(#${uid}-ah)`} data-on={onEdges.has(e.key) || undefined} data-edge={e.key} />
        ))}
      </g>
      {full && (
        <g className="flow-map__labels">
          {L.edges.filter((e) => e.labelBox).map((e) => (
            <text key={e.key} className="flow-map__label" x={e.labelBox!.x} y={e.labelBox!.y} data-on={onEdges.has(e.key) || undefined}>
              {e.labelBox!.lines.map((l, i) => <tspan key={i} x={e.labelBox!.x} dy={i === 0 ? 11.5 : 15}>{l}</tspan>)}
            </text>
          ))}
        </g>
      )}
      {(() => {
        const here = L.byId.get(current);
        return here ? (
          <g className="flow-map__here" style={{ transform: `translate(${here.x - here.w / 2 - 7}px, ${here.y - 7}px)` }}>
            <rect width={here.w + 14} height={here.h + 14} rx="12" />
          </g>
        ) : null;
      })()}
      <g className="flow-map__nodes">
        {L.nodes.map((n) => {
          const t = tag(n);
          const label = `${kindWord(n.node)}${n.node.kind === 'end' ? ` (${toneOf(n.node).word})` : ''}${n.node.exception ? ', exception' : ''}: ${n.node.text}${n.id === current ? '. You are here.' : ''}`;
          return (
            <g
              key={n.id}
              className="flow-map__node"
              data-node={n.id}
              data-kind={n.node.kind}
              data-tone={n.node.tone}
              data-exception={n.node.exception || undefined}
              data-on={onNodes.has(n.id) || undefined}
              data-current={n.id === current || undefined}
              data-selected={n.id === selected || undefined}
              {...(full
                ? { role: 'button', tabIndex: 0, 'aria-label': label, 'aria-expanded': n.id === selected, 'aria-controls': n.id === selected ? `${uid}-note` : undefined, onClick: () => onSelect?.(n.id), onKeyDown: (e: KeyboardEvent) => onNodeKey(e, n.id) }
                : {})}
            >
              {full && <path className="flow-map__focus" d={shape(n, 4)} />}
              <path className="flow-map__shape" d={shape(n)} />
              {full && (
                <text className="flow-map__text" x={n.x} y={n.y + 12}>
                  {t && <tspan className="flow-map__tag" x={n.x} dy={12}>{t}</tspan>}
                  {n.lines.map((l, i) => <tspan key={i} x={n.x} dy={i === 0 && !t ? 13 : 17}>{l}</tspan>)}
                </text>
              )}
            </g>
          );
        })}
      </g>
    </svg>
  );

  if (!full) return <div className="flow-mini">{svg}</div>;

  const end = traceEnd ? nodes.get(traceEnd) : undefined;
  return (
    <div className="flow-map">
      <ul className="flow-map__legend" aria-label="Key">
        <li><svg width="26" height="16" aria-hidden="true"><path className="flow-map__key" d="M5 1H21L25 8L21 15H5L1 8Z" /></svg>Question</li>
        <li><svg width="26" height="16" aria-hidden="true"><rect className="flow-map__key" x="1" y="1" width="24" height="14" rx="2" /></svg>Step</li>
        <li><svg width="26" height="16" aria-hidden="true"><rect className="flow-map__key" x="1" y="1" width="24" height="14" rx="7" /></svg>Outcome: {TONE.met.glyph} met, {TONE['not-met'].glyph} not met, {TONE.qualified.glyph} qualified</li>
        <li><svg width="26" height="16" aria-hidden="true"><rect className="flow-map__key flow-map__key--exception" x="1" y="1" width="24" height="14" rx="2" /></svg>Exception</li>
        <li><svg width="26" height="16" aria-hidden="true"><path className="flow-map__key-line" d="M1 8H25" /></svg>{tracing ? 'Routes to the chosen outcome' : 'Your path'}</li>
      </ul>
      <div className="flow-map__scroll" ref={box} onKeyDown={(e) => { if (e.key === 'Escape' && selected) { e.stopPropagation(); close(); } }}>
        <div className="flow-map__canvas" style={{ width: W, height: Math.max(H, noteH ? noteTop + noteH + 12 : 0) }}>
          {svg}
          {sel && (
            <div
              ref={note}
              id={`${uid}-note`}
              className="flow-map__note"
              role="region"
              aria-label={`${kindWord(sel.node)} note`}
              style={{ left: noteLeft, top: noteTop, width: noteW }}
            >
              <p className="flow-map__note-kind">
                <span className="label">{kindWord(sel.node)}</span>
                {sel.node.kind === 'end' && <span className="flow-tone" data-tone={sel.node.tone}><span aria-hidden="true">{toneOf(sel.node).glyph}</span> {toneOf(sel.node).word}</span>}
                {sel.node.exception && <span className="flow-exception">Exception</span>}
              </p>
              <p className="flow-map__note-title" tabIndex={-1} data-note-title>{sel.node.text}</p>
              {refs && hasDetail(sel.node, refs) && <NodeDetail node={sel.node} refs={refs} />}
              {sel.node.kind === 'end' && traceEnd === sel.id && routes.length > 0 && (
                <p className="flow-map__note-hint">{routes.length === 1 ? 'Its route is drawn in bold; the answers it needs are listed under the map.' : `Its ${routes.length} routes are drawn in bold; the answers each needs are listed under the map.`}</p>
              )}
              <button type="button" className="btn btn--ghost flow-map__close" onClick={close}>Close</button>
            </div>
          )}
        </div>
      </div>
      {end && tracing && (
        <section className="flow-trace" aria-live="polite" aria-labelledby={`${uid}-trace`}>
          <h3 className="flow-trace__h" id={`${uid}-trace`}>
            <span className="flow-tone" data-tone={end.tone}><span aria-hidden="true">{toneOf(end).glyph}</span> {toneOf(end).word}</span>{' '}
            {end.text}
          </h3>
          {routes.length === 1 ? (
            <Route flow={flow} route={routes[0]} lede />
          ) : (
            <>
              <p className="flow-trace__lede">{routes.length >= 50 ? 'At least 50 routes' : `${routes.length} routes`} lead here. Each needs:</p>
              <ol className="flow-trace__routes">
                {routes.map((r, i) => <li key={i}><span className="label">Route {i + 1}</span><Route flow={flow} route={r} /></li>)}
              </ol>
            </>
          )}
          <button type="button" className="btn btn--secondary" onClick={onClearTrace}>Clear the route</button>
        </section>
      )}
    </div>
  );
}

function Route({ flow, route, lede = false }: { flow: Flow; route: Parameters<typeof conditions>[1]; lede?: boolean }) {
  const cs = conditions(flow, route);
  if (!cs.length) return <p className="flow-trace__lede">No questions: every walk reaches this outcome.</p>;
  return (
    <>
      {lede && <p className="flow-trace__needs">This outcome needs:</p>}
      <ol className="flow-trace__list">
        {cs.map((c) => (
          <li key={c.node}><strong className="flow-trace__answer">{c.answer}</strong> to “{c.question}”</li>
        ))}
      </ol>
    </>
  );
}
