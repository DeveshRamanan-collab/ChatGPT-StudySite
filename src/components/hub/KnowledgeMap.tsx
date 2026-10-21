// Knowledge map: D3 force layout of concepts (computed once per view, then static — no ambient motion).
// One unit (hub): columns are weeks. Whole course (/map): columns are units, rows are weeks, with unit filter chips;
// choosing one unit switches to that unit's week layout. Nodes shaded by mastery on an ink ramp; edges: depends-on
// (solid), contrasts-with (dashed), related (dotted, faint). Every node is a link (keyboard reachable) with a title.
//
// Layered on top (Oct 2026, features 51–57, 59, 60, 94, 117; graph logic in src/lib/graph.ts):
// - Layers: toggle each link kind and the node names. A pair joined by several kinds is drawn as the strongest shown.
// - Neighbourhood: click a dot (or Alt/Option+Enter on it, or Focus in the finder) to dim all but it and its direct
//   neighbours and open MapPanel inside the map area; a second click opens the concept, and Enter always does.
//   Nothing moves or re-lays out: dimming is opacity only (instant with motion off).
// - Trace: shift-click a second dot, or choose From/To: the shortest route along any kind, highlighted and in words.
// - What do I need first?: the focused concept's prerequisite ancestors, numbered on the map in study order.
// - Most connected, week filter chips, Rebuild a week from memory (MapRebuild), Download SVG / PNG of the view.
import { Fragment, useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react';
import { useStudy, startStudySync } from '../../lib/store';
import { conceptMastery, attemptsByConcept } from '../../lib/selectors';
import { KINDS, REL_WORDS, buildGraph, describePath, mostConnected, neighbours, pairKey, pairs, prerequisiteRoute, shortestPath, type EdgeKind, type Pair } from '../../lib/graph';
import MapPanel from './MapPanel';
import MapRebuild from './MapRebuild';
import '../../styles/map-extras.css';

interface C { id: string; title: string; href: string; unit: string; code: string; week: number; dependsOn: string[]; contrasts: string[]; related: string[] }
type Node = C & { x: number; y: number };
type Layout = { nodes: Node[]; edges: Pair[]; cols: string[]; w: number; h: number; byUnit: boolean; gx: number; weeks: number };
interface UnitInfo { id: string; code: string; weeks: { number: number; concepts: Omit<C, 'unit' | 'code' | 'week'>[] }[] }
/** What the page knows at build time: enough to draw the map's frame before the data and layout arrive (no shift). */
export interface MapShape { id: string; code: string; n: number; last: number }
const shapeOf = (u: UnitInfo): MapShape => ({ id: u.id, code: u.code, n: u.weeks.length, last: Math.max(0, ...u.weeks.filter((w) => w.concepts.length).map((w) => w.number)) });

/** Columns, viewBox and gutter: one unit = week columns; whole course = unit columns with week rows. */
const frameOf = (byUnit: boolean, weeks: number, codes: string[]) => ({
  byUnit, weeks, gx: byUnit ? 48 : 0, w: byUnit ? 960 : 720, h: byUnit ? 40 + weeks * 64 : 440,
  cols: byUnit ? codes : Array.from({ length: weeks }, (_, i) => `Week ${i + 1}`),
});
/** The frame with no dots yet, from the shape: the loading state takes exactly the space the map will. */
function ghostOf(sel: string, shape: MapShape[]): Layout | null {
  const picked = shape.filter((u) => u.last > 0 && (sel === 'all' || u.id === sel));
  if (!picked.length) return null;
  return { nodes: [], edges: [], ...frameOf(sel === 'all', Math.max(...picked.map((u) => u.last)), picked.map((u) => u.code)) };
}

const idle = (f: () => void) => ('requestIdleCallback' in window ? requestIdleCallback(f, { timeout: 200 }) : setTimeout(f, 16));

function layout(cs: C[], byUnit: boolean, d3: typeof import('d3-force'), done: (l: Layout) => void) {
  // One line per pair, in the order pairs are first met (the same links, in the same order, the layout always used).
  const edges = pairs(cs);
  const { weeks, cols, w, h, gx } = frameOf(byUnit, Math.max(1, ...cs.map((c) => c.week)), [...new Set(cs.map((c) => c.code))]);
  const colOf = (c: C) => (byUnit ? cols.indexOf(c.code) : c.week - 1);
  const tx = (c: C) => gx + ((colOf(c) + 0.5) / cols.length) * (w - gx);
  const ty = (c: C) => (byUnit ? 40 + (c.week - 0.5) * 64 : h / 2);
  const nodes = cs.map((c, i) => ({ ...c, x: tx(c) + ((i % 7) - 3) * (byUnit ? 36 : 12), y: ty(c) + (byUnit ? 0 : ((i % 5) - 2) * 24) })) as Node[];
  const sim = d3.forceSimulation(nodes as any)
    .force('link', d3.forceLink(edges.map((e) => ({ source: e.s, target: e.t }))).id((d: any) => d.id).distance(byUnit ? 40 : 70).strength(byUnit ? 0.03 : 0.4))
    .force('charge', d3.forceManyBody().strength(byUnit ? -90 : -160).distanceMax(byUnit ? 120 : Infinity))
    .force('x', d3.forceX((d: any) => tx(d)).strength(byUnit ? 0.04 : 0.25))
    .force('y', d3.forceY((d: any) => ty(d)).strength(byUnit ? 0.6 : 0.08))
    .force('collide', d3.forceCollide(byUnit ? 16 : 22))
    .stop();
  // Layout in idle slices of 20 ticks so scrolling never waits on it (60fps at 4× throttle).
  let n = 0;
  const step = () => {
    for (let i = 0; i < 20 && n < 300; i++, n++) sim.tick();
    if (n < 300) { idle(step); return; }
    const band = (w - gx) / cols.length;
    for (const d of nodes) {
      const lo = byUnit ? gx + colOf(d) * band + 16 : 64, hi = byUnit ? gx + (colOf(d) + 1) * band - 16 : w - 64;
      d.x = Math.max(lo, Math.min(hi, d.x)); d.y = Math.max(byUnit ? 28 : 40, Math.min(h - 20, d.y));
    }
    done({ nodes, edges, cols, w, h, byUnit, gx, weeks });
  };
  idle(step);
}

type Layers = Record<EdgeKind | 'labels', boolean>;
const LAYER_NAME: Record<EdgeKind, string> = { depends: 'Builds on', contrasts: 'Often confused', related: 'Related' };
const NO_TRACE = { from: '', to: '' };

/** A short line in the edge's own style, for the layer chips and the legend. */
const Sample = ({ kind }: { kind: EdgeKind }) => (
  <svg width="24" height="8" aria-hidden="true"><line x1="0" y1="4" x2="24" y2="4" className={`kmap__edge kmap__edge--${kind}`} /></svg>
);

export default function KnowledgeMap({ unit, shape }: { unit?: string; shape?: MapShape[] }) {
  const attempts = useStudy((s) => s.attempts);
  const criteria = useStudy((s) => s.criterion);
  const [units, setUnits] = useState<UnitInfo[] | null>(null);
  const [sel, setSel] = useState<string>(unit ?? 'all');
  const [data, setData] = useState<Layout | null>(null);
  const [d3, setD3] = useState<typeof import('d3-force') | null>(null);
  // Extras: layers, week filter, focus + panel, prerequisite route, trace, mode.
  const [layers, setLayers] = useState<Layers>({ depends: true, contrasts: true, related: true, labels: false });
  const [weeks, setWeeks] = useState<number[]>([]);
  const [focus, setFocus] = useState<string | null>(null);
  const [route, setRoute] = useState(false);
  const [trace, setTrace] = useState(NO_TRACE);
  const [finder, setFinder] = useState(false);
  const [mode, setMode] = useState<'explore' | 'rebuild'>('explore');
  const [status, setStatus] = useState('');
  const root = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const toRef = useRef<HTMLSelectElement>(null);
  const hint = useId();

  useEffect(() => {
    startStudySync();
    Promise.all([fetch('/data/overview.json').then((r) => r.json()), import('d3-force')]).then(([ov, mod]) => { setUnits(ov); setD3(mod); });
  }, []);

  useEffect(() => {
    if (!units || !d3) return;
    const picked = sel === 'all' ? units : units.filter((u) => u.id === sel);
    const cs: C[] = picked.flatMap((u) => u.weeks.flatMap((w) => w.concepts.map((c) => ({ ...c, unit: u.id, code: u.code, week: w.number }))));
    let live = true;
    setData(null);
    setFocus(null); setRoute(false); setTrace(NO_TRACE); setWeeks([]);
    layout(cs, sel === 'all', d3, (l) => { if (live) setData(l); });
    return () => { live = false; };
  }, [units, d3, sel]);

  const mastery = useMemo(() => { const by = attemptsByConcept(attempts); return new Map((data?.nodes ?? []).map((n) => [n.id, conceptMastery(n.id, criteria, by)])); }, [data, attempts, criteria]);

  const graph = useMemo(() => (data ? buildGraph(data.nodes) : null), [data]);
  const byId = useMemo(() => new Map((data?.nodes ?? []).map((n) => [n.id, n])), [data]);
  const kindsOn = useMemo(() => KINDS.filter((k) => layers[k]), [layers]);
  const path = useMemo(() => (graph && trace.from && trace.to ? shortestPath(graph, trace.from, trace.to) : null), [graph, trace]);
  const ancestors = useMemo(() => (graph && focus && route ? prerequisiteRoute(graph, focus) : []), [graph, focus, route]);

  // What is lit: a traced route beats the prerequisite route, which beats the focused neighbourhood.
  const hl = useMemo(() => {
    if (!graph || !data) return null;
    if (trace.from && trace.to && path) {
      return { nodes: new Set([trace.from, ...path.map((s) => s.to)]), pairs: new Set(path.map((s) => pairKey(s.from, s.to))) };
    }
    if (focus && route) {
      const lit = new Set([focus, ...ancestors]);
      return { nodes: lit, pairs: new Set(data.edges.filter((e) => e.kinds.includes('depends') && lit.has(e.s) && lit.has(e.t)).map((e) => pairKey(e.s, e.t))) };
    }
    if (focus) {
      const near = neighbours(graph, focus, kindsOn);
      return { nodes: new Set([focus, ...near]), pairs: new Set([...near].map((id) => pairKey(focus, id))) };
    }
    return null;
  }, [graph, data, trace, path, focus, route, ancestors, kindsOn]);

  const weekSet = useMemo(() => new Set(weeks), [weeks]);
  const shown = (n: Node) => !weeks.length || weekSet.has(n.week) || !!hl?.nodes.has(n.id);
  const top = useMemo(() => (graph && data ? mostConnected(graph, 5, weeks.length ? new Set(data.nodes.filter((n) => weekSet.has(n.week)).map((n) => n.id)) : undefined) : []), [graph, data, weeks, weekSet]);

  const name = (id: string) => byId.get(id)?.title ?? id;
  /** Focus a concept (opens the panel). keepFrom: the finder's Focus button keeps its From choice. */
  const choose = (id: string, keepFrom = false) => {
    setFocus(id);
    setRoute(false);
    setTrace((t) => (keepFrom ? { from: t.from, to: '' } : NO_TRACE));
    const n = graph ? neighbours(graph, id, kindsOn).size : 0;
    setStatus(`${name(id)}: ${n} linked ${n === 1 ? 'concept' : 'concepts'} shown, the rest dimmed. Details are in the panel.`);
  };
  const startTrace = (from: string, to: string) => {
    setTrace({ from, to });
    setFinder(true);
    const p = graph ? shortestPath(graph, from, to) : null;
    setStatus(p ? `Route: ${describePath(graph!, from, p)}` : `No route between ${name(from)} and ${name(to)}.`);
  };
  const clearAll = () => {
    // If keyboard focus is in the panel (about to close), hand it back to the concept's dot.
    const back = focus && root.current?.querySelector('.mapx-panel')?.contains(document.activeElement) ? focus : null;
    setFocus(null); setRoute(false); setTrace(NO_TRACE);
    setStatus('Map cleared: every concept shown.');
    if (back) root.current?.querySelector<SVGAElement>(`.kmap__node[data-id="${CSS.escape(back)}"]`)?.focus({ preventScroll: true });
  };

  const onNodeClick = (e: MouseEvent<Element>, id: string) => {
    // Enter (detail 0) and new-tab clicks follow the link as before.
    if (e.detail === 0 || e.metaKey || e.ctrlKey || e.button !== 0) return;
    if (e.shiftKey) { e.preventDefault(); if (focus && focus !== id) startTrace(focus, id); else choose(id); return; }
    if (focus === id && !(trace.from && trace.to)) return; // a second click on the focused dot opens the concept
    e.preventDefault();
    choose(id);
  };
  const onNodeKey = (e: KeyboardEvent<Element>, id: string) => {
    if (e.key !== 'Enter' || !e.altKey) return;
    e.preventDefault();
    if (e.shiftKey && focus && focus !== id) startTrace(focus, id); else choose(id);
  };
  const onRootKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape' && (focus || trace.from || trace.to) && mode === 'explore') { e.stopPropagation(); clearAll(); }
  };

  const download = async (kind: 'svg' | 'png') => {
    if (!svgRef.current) return;
    const file = `knowledge-map-${unit ?? (sel === 'all' ? 'course' : sel)}`;
    try {
      await exportMap(svgRef.current, kind, file);
      setStatus(`Saved ${file}.${kind}.`);
    } catch {
      setStatus('Could not save the map. Try the other format.');
    }
  };

  const known = units ? units.map(shapeOf) : shape;
  const chips = !unit && known && (
    <div className="kmap__filters" role="group" aria-label="Show units">
      {[{ id: 'all', code: 'All units', n: 1 }, ...known].map((u) => (
        <button key={u.id} type="button" className="chip" aria-pressed={sel === u.id} disabled={!u.n} title={u.n ? undefined : 'Notes not in yet'} onClick={() => setSel(u.id)}>{u.code}</button>
      ))}
    </div>
  );
  // Until the layout lands, draw the same frame and controls with no dots (inert), so nothing below the map moves.
  const view = data ?? (known ? ghostOf(sel, known) : null);
  const empty = <>{chips}<p className="kmap-empty">The map appears once this unit has concepts.</p></>;
  if (!view) return known ? empty : <>{chips}<div className={`kmap kmap--loading${unit ? '' : ' kmap--course'}`} aria-busy="true" /></>;
  if (data && !data.nodes.length) return empty;
  const loading = !data;
  const pos = new Map(view.nodes.map((n) => [n.id, n]));
  const where = unit ? "this unit's" : sel === 'all' ? 'the whole course’s' : `${known?.find((u) => u.id === sel)?.code ?? 'this unit'}’s`;
  const heading = unit ? 'h3' : 'h2';

  if (mode === 'rebuild' && graph) {
    const start = (focus && byId.get(focus)) || view.nodes.find((n) => weekSet.has(n.week));
    return (
      <div className="mapx" ref={root}>
        {chips}
        <MapRebuild concepts={view.nodes} graph={graph} byUnit={view.byUnit} heading={heading} start={start ? `${start.unit}:${start.week}` : undefined} onExit={() => setMode('explore')} />
      </div>
    );
  }

  const r = view.byUnit ? 7 : 9;
  const tracing = !!(trace.from && trace.to && path);
  const focused = focus ? byId.get(focus) : undefined;
  const side = focused && focused.x / view.w > 0.55 ? 'left' : 'right';
  const options = [...view.nodes].sort((a, b) => a.code.localeCompare(b.code) || a.week - b.week || a.title.localeCompare(b.title));
  const opt = (n: Node) => <option key={n.id} value={n.id}>{`${view.byUnit ? `${n.code} · ` : ''}W${n.week} · ${n.title}`}</option>;
  const traceWords = !trace.from || !trace.to ? 'Choose two concepts, or choose a dot on the map and shift-click a second.'
    : trace.from === trace.to ? 'Choose two different concepts.'
    : path ? `Route, ${path.length} ${path.length === 1 ? 'step' : 'steps'}: ${describePath(graph!, trace.from, path)}`
    : `No route between ${name(trace.from)} and ${name(trace.to)} along the links in the notes.`;
  const hlOf = (id: string) => (!hl ? undefined : id === (tracing ? undefined : focus) ? 'focus' : hl.nodes.has(id) ? 'lit' : 'dim');

  return (
    <div className={`mapx${layers.labels ? ' mapx--labels' : ''}${tracing || (focus && route) ? ' mapx--named' : ''}`} ref={root} onKeyDown={onRootKey}
      aria-busy={loading || undefined}>
      {chips}
      {/* While loading, everything below the unit chips is inert; the chips stay usable (switching unit reloads). */}
      <div className="mapx__tools" inert={loading}>
        <div className="mapx__group" role="group" aria-label="Show links and names">
          <span className="mapx__group-label">Show</span>
          {KINDS.map((k) => (
            <button key={k} type="button" className="chip mapx__chip" aria-pressed={layers[k]} onClick={() => setLayers((l) => ({ ...l, [k]: !l[k] }))}>
              <Sample kind={k} />{LAYER_NAME[k]}
            </button>
          ))}
          <button type="button" className="chip mapx__chip" aria-pressed={layers.labels} onClick={() => setLayers((l) => ({ ...l, labels: !l.labels }))}>Names</button>
        </div>
        <div className="mapx__group" role="group" aria-label="Show weeks">
          <span className="mapx__group-label">Weeks</span>
          <button type="button" className="chip mapx__chip" aria-pressed={!weeks.length} onClick={() => setWeeks([])}>All weeks</button>
          {Array.from({ length: view.weeks }, (_, i) => i + 1).map((w) => (
            <button key={w} type="button" className="chip mapx__chip mapx__week" aria-pressed={weekSet.has(w)} aria-label={`Week ${w}`}
              onClick={() => setWeeks((ws) => (ws.includes(w) ? ws.filter((x) => x !== w) : [...ws, w].sort((a, b) => a - b)))}>{w}</button>
          ))}
        </div>
      </div>
      <figure className={`kmap${unit ? '' : ' kmap--course'}`} inert={loading}>
        <div className="mapx__stage">
          <div className="kmap__scroll" tabIndex={0} role="region" aria-label="Knowledge map (scroll sideways on small screens)">
            <svg ref={svgRef} viewBox={`0 0 ${view.w} ${view.h}`} role="group" aria-label={`Knowledge map of ${where} concepts`}
              onClick={(e) => { if (e.target === e.currentTarget && (focus || trace.from)) clearAll(); }}>
              {view.cols.map((c, i) => <text key={c} x={view.gx + ((i + 0.5) / view.cols.length) * (view.w - view.gx)} y={12} className="kmap__week">{c}</text>)}
              {view.byUnit && Array.from({ length: view.weeks }, (_, i) => <text key={i} x={0} y={44 + (i + 0.5) * 64} className="kmap__week kmap__row">Wk {i + 1}</text>)}
              {view.edges.map((e) => {
                const kind = e.kinds.find((k) => layers[k]);
                const a = pos.get(e.s)!, b = pos.get(e.t)!;
                if (!kind || !shown(a) || !shown(b)) return null;
                const state = hl ? (hl.pairs.has(pairKey(e.s, e.t)) && !tracing ? 'lit' : 'dim') : undefined;
                return <line key={`${e.s}-${e.t}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} className={`kmap__edge kmap__edge--${kind}`} data-hl={state} />;
              })}
              {tracing && path!.map((s) => {
                const a = pos.get(s.from)!, b = pos.get(s.to)!;
                return <line key={`p-${s.from}-${s.to}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} className={`kmap__edge kmap__edge--${s.kind} mapx__path`} />;
              })}
              {view.nodes.map((n) => {
                if (!shown(n)) return null;
                const m = mastery.get(n.id) ?? 0;
                return (
                  <a key={n.id} href={n.href} className="kmap__node" data-id={n.id} data-hl={hlOf(n.id)} aria-describedby={hint}
                    aria-label={`${n.title}, ${view.byUnit ? `${n.code} ` : ''}week ${n.week}, mastery ${Math.round(m * 100)}%`}
                    onClick={(e) => onNodeClick(e, n.id)} onKeyDown={(e) => onNodeKey(e, n.id)}>
                    <title>{`${n.title} · ${view.byUnit ? `${n.code} · ` : ''}week ${n.week} · ${Math.round(m * 100)}% mastery`}</title>
                    <circle cx={n.x} cy={n.y} r={r} style={{ fill: `color-mix(in oklab, var(--ink) ${Math.round(12 + m * 78)}%, var(--paper-2))` }} />
                    <text x={n.x} y={n.y - r - 5} className="kmap__label">{n.title.length > 22 ? `${n.title.slice(0, 21)}…` : n.title}</text>
                  </a>
                );
              })}
              {!tracing && route && ancestors.map((id, i) => {
                const n = pos.get(id)!;
                return <text key={`n-${id}`} x={n.x + r + 3} y={n.y + r + 9} className="mapx__num" aria-hidden="true">{i + 1}</text>;
              })}
            </svg>
          </div>
          {focused && graph && !tracing && (
            <MapPanel key={focused.id} c={focused} graph={graph} byId={byId} byUnit={view.byUnit} mastery={mastery.get(focused.id) ?? 0} side={side} heading={heading}
              route={route} ancestors={ancestors} onRoute={(on) => { setRoute(on); if (on) setTrace(NO_TRACE); setStatus(on ? 'Prerequisites numbered on the map in study order.' : 'Showing direct links again.'); }}
              onFocus={(id) => choose(id)} onClose={clearAll}
              onTraceFrom={() => { setTrace({ from: focused.id, to: '' }); setFinder(true); requestAnimationFrame(() => toRef.current?.focus()); }} />
          )}
        </div>
        {trace.from && trace.to && (
          <div className="mapx__route">
            <p className="mapx__route-words">
              {path && trace.from !== trace.to ? (
                <>Route, {path.length} {path.length === 1 ? 'step' : 'steps'}: <b>{name(trace.from)}</b>
                  {path.map((s) => <Fragment key={s.to}><span className="mapx__rel"> → {REL_WORDS[s.rel]} </span><b>{name(s.to)}</b></Fragment>)}</>
              ) : traceWords}
            </p>
            <button type="button" className="btn btn--ghost btn--sm mapx__action" onClick={() => { setTrace(NO_TRACE); setStatus('Route cleared.'); }}>Clear route</button>
          </div>
        )}
        <figcaption className="kmap__legend">
          <span><Sample kind="depends" /> builds on: a prerequisite stated in the notes</span>
          <span><Sample kind="contrasts" /> often confused with</span>
          <span><Sample kind="related" /> related (a proposed link)</span>
          <span>Darker node = more mastered · {view.byUnit ? 'weeks run top to bottom · ' : ''}choose a dot to see its links; choose it again, or press Enter, to open it</span>
        </figcaption>
      </figure>
      <p id={hint} className="visually-hidden">Enter opens the concept. Alt or Option with Enter shows its links in a panel; add Shift to trace a route from the concept already shown.</p>
      <p className="visually-hidden" role="status">{status}</p>

      <div className="mapx__more" inert={loading}>
        <details className="mapx-details" open={finder} onToggle={(e) => setFinder(e.currentTarget.open)}>
          <summary>Find a concept or trace a route</summary>
          <div className="mapx-trace">
            <div className="mapx-trace__row">
              <label className="mapx-field"><span id={`${hint}-from`}>From</span>
                <select aria-labelledby={`${hint}-from`} value={trace.from} onChange={(e) => { const from = e.target.value; setTrace((t) => ({ ...t, from })); if (from && trace.to) startTrace(from, trace.to); }}>
                  <option value="">Choose a concept…</option>{options.map(opt)}
                </select>
              </label>
              <button type="button" className="btn btn--secondary btn--sm mapx-trace__btn" disabled={!trace.from} onClick={() => choose(trace.from, true)}>Focus</button>
            </div>
            <div className="mapx-trace__row">
              <label className="mapx-field"><span id={`${hint}-to`}>To</span>
                <select ref={toRef} aria-labelledby={`${hint}-to`} value={trace.to} onChange={(e) => { const to = e.target.value; setTrace((t) => ({ ...t, to })); if (trace.from && to) startTrace(trace.from, to); }}>
                  <option value="">Choose a concept…</option>{options.map(opt)}
                </select>
              </label>
              <button type="button" className="btn btn--ghost btn--sm mapx-trace__btn" disabled={!trace.from && !trace.to} onClick={() => { setTrace(NO_TRACE); setStatus('Route cleared.'); }}>Clear</button>
            </div>
          </div>
          {!(trace.from && trace.to) && <p className="mapx-trace__out">{traceWords}</p>}
        </details>
        <details className="mapx-details">
          <summary>Most connected{weeks.length ? ` in week${weeks.length > 1 ? 's' : ''} ${weeks.join(', ')}` : ''}</summary>
          {top.length ? (
            <ol className="mapx-top">
              {top.map((d) => (
                <li key={d.id}>
                  <button type="button" className="mapx-top__name" onClick={() => choose(d.id)}>{d.title}</button>
                  <span className="mapx-top__why">{d.total} links. {d.why}.</span>
                </li>
              ))}
            </ol>
          ) : <p className="mapx-trace__out">No links among these concepts yet.</p>}
        </details>
        <div className="mapx__actions">
          <button type="button" className="btn btn--secondary btn--sm mapx__action" onClick={() => setMode('rebuild')}>Rebuild a week from memory</button>
          <button type="button" className="btn btn--ghost btn--sm mapx__action" onClick={() => download('svg')}>Download SVG</button>
          <button type="button" className="btn btn--ghost btn--sm mapx__action" onClick={() => download('png')}>Download PNG</button>
        </div>
      </div>
    </div>
  );
}

// ---------- Export (117): the current view with computed theme colours inlined; PNG at 2× via canvas ----------

const STYLE_PROPS = ['fill', 'fill-opacity', 'stroke', 'stroke-width', 'stroke-dasharray', 'stroke-opacity', 'stroke-linecap', 'opacity', 'font-family', 'font-size', 'font-weight', 'letter-spacing', 'text-anchor', 'paint-order'];
const COLOUR_PROPS = new Set(['fill', 'stroke']);

/** Any CSS colour (including color-mix / oklab results) as rgb()/rgba(), via a 1×1 canvas. */
function colourResolver() {
  const ctx = Object.assign(document.createElement('canvas'), { width: 1, height: 1 }).getContext('2d', { willReadFrequently: true })!;
  const cache = new Map<string, string>();
  return (c: string) => {
    if (!c || c === 'none' || /^(rgb|#)/.test(c)) return c;
    let v = cache.get(c);
    if (!v) {
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = '#000';
      ctx.fillStyle = c;
      ctx.fillRect(0, 0, 1, 1);
      const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
      v = a === 255 ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${(a / 255).toFixed(3)})`;
      cache.set(c, v);
    }
    return v;
  };
}

function serialise(svg: SVGSVGElement) {
  const box = svg.getBoundingClientRect();
  const clone = svg.cloneNode(true) as SVGSVGElement;
  const live = [svg, ...svg.querySelectorAll('*')];
  const copy = [clone, ...clone.querySelectorAll('*')];
  const rgb = colourResolver();
  live.forEach((el, i) => {
    const out = copy[i] as SVGElement;
    const cs = getComputedStyle(el);
    out.setAttribute('style', STYLE_PROPS.map((p) => { const v = cs.getPropertyValue(p); return v ? `${p}:${COLOUR_PROPS.has(p) ? rgb(v) : v}` : ''; }).filter(Boolean).join(';'));
    out.removeAttribute('class');
    if (el.tagName === 'text' && cs.textTransform === 'uppercase') out.textContent = (el.textContent ?? '').toUpperCase();
    if (el.tagName === 'a') out.setAttribute('href', new URL(el.getAttribute('href') ?? '', location.href).href);
  });
  const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  bg.setAttribute('width', '100%');
  bg.setAttribute('height', '100%');
  bg.setAttribute('fill', rgb(getComputedStyle(document.documentElement).getPropertyValue('--paper').trim() || '#FBF7F0'));
  clone.insertBefore(bg, clone.firstChild);
  clone.setAttribute('width', String(Math.round(box.width)));
  clone.setAttribute('height', String(Math.round(box.height)));
  return { text: new XMLSerializer().serializeToString(clone), w: box.width, h: box.height };
}

function save(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), { href: url, download: name });
  a.click(); // detached: no router or cursor handler sees it
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

async function exportMap(svg: SVGSVGElement, kind: 'svg' | 'png', file: string) {
  const { text, w, h } = serialise(svg);
  if (kind === 'svg') return save(new Blob([text], { type: 'image/svg+xml' }), `${file}.svg`);
  const img = new Image();
  img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(text)}`;
  await img.decode();
  const canvas = Object.assign(document.createElement('canvas'), { width: Math.round(w * 2), height: Math.round(h * 2) });
  const ctx = canvas.getContext('2d')!;
  ctx.scale(2, 2);
  ctx.drawImage(img, 0, 0, w, h);
  const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/png'));
  if (!blob) throw new Error('png');
  save(blob, `${file}.png`);
}
