// Decision flow island (features 12, 156, 45, 24, 87, 57, 32, 39, 93, 101). Three views of one flow:
//  Walk it (default): one node at a time. A question shows its branches (number keys pick), a step shows "Next", an
//    outcome shows its tone as glyph + word. The answers given so far stay above as a breadcrumb trail (the visible
//    reasoning path); any crumb goes back to that point, as does Backspace one step. "Why?" opens the node's note in
//    place with its case / authority chips and concept link. On wide screens a small map beside the walk shows where
//    you are, its highlight following each answer.
//  Map: the whole flow as a diagram (FlowMap): notes open inside it; choosing an outcome traces its routes.
//  Order the steps: FlowOrder.
// Motion: a new node enters over ≤ 240ms (--ease-out, from the side it came from); Calm fades only; Off fades ≤ 120ms.
import { markFormat } from '../../lib/format-track';
import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent as RKeyboardEvent } from 'react';
import { edgesOf, layout, type Flow, type FlowNode } from '../../lib/flow';
import FlowMap from './FlowMap';
import FlowOrder from './FlowOrder';
import { NodeDetail, hasDetail, toneOf, type FlowRefs } from './FlowNote';
import '../../styles/flows.css';

type View = 'walk' | 'map' | 'order';
const VIEWS: { id: View; label: string }[] = [
  { id: 'walk', label: 'Walk it' },
  { id: 'map', label: 'Map' },
  { id: 'order', label: 'Order the steps' },
];
/** One stop on the walk: the node and which way out of the previous node led here (-1 for the start). */
interface Stop { id: string; via: number }

export default function FlowWalker({ flow, refs }: { flow: Flow; refs: FlowRefs }) {
  useEffect(() => { for (const c of flow.concepts) markFormat(c, 'flow'); }, [flow]);
  const nodes = useMemo(() => new Map(flow.nodes.map((n) => [n.id, n])), [flow]);
  const L = useMemo(() => layout(flow), [flow]);
  const [view, setView] = useState<View>('walk');
  const [trail, setTrail] = useState<Stop[]>([{ id: flow.start, via: -1 }]);
  const [dir, setDir] = useState<'fwd' | 'back' | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [traceEnd, setTraceEnd] = useState<string | null>(null);
  const uid = useId().replace(/:/g, '');

  const cur = nodes.get(trail[trail.length - 1].id);
  const outs = cur ? edgesOf(cur, nodes) : [];
  const walkEdges = useMemo(() => new Set(trail.slice(1).map((s, i) => `${trail[i].id}:${s.via}`)), [trail]);
  const walkNodes = useMemo(() => new Set(trail.map((s) => s.id)), [trail]);

  const choose = (i: number) => {
    const e = outs[i];
    if (!e) return;
    setDir('fwd');
    setTrail((t) => [...t, { id: e.to, via: e.index }]);
  };
  const goTo = (k: number) => {
    if (k < 0 || k >= trail.length - 1) return;
    setDir('back');
    setTrail((t) => t.slice(0, k + 1));
  };
  const restart = () => { setDir('back'); setTrail([{ id: flow.start, via: -1 }]); };
  const showRoutes = (end: string) => { setSelected(end); setTraceEnd(end); setView('map'); };
  const select = (id: string | null) => {
    setSelected(id);
    if (id && nodes.get(id)?.kind === 'end') setTraceEnd(id);
  };

  // ?view=map|order opens that view (and the choice is kept in the address for a reload).
  useEffect(() => {
    const v = new URLSearchParams(location.search).get('view');
    if (v === 'map' || v === 'order') setView(v);
  }, []);
  const pick = (v: View) => {
    setView(v);
    try {
      const u = new URL(location.href);
      if (v === 'walk') u.searchParams.delete('view');
      else u.searchParams.set('view', v);
      history.replaceState(history.state, '', u);
    } catch { /* address bar is a convenience only */ }
  };

  // Keyboard (walk view): 1–9 pick a branch (1 is "Next" on a step), Backspace steps back.
  const keys = useRef({ choose, goTo, trail, outs });
  keys.current = { choose, goTo, trail, outs };
  useEffect(() => {
    if (view !== 'walk') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.defaultPrevented) return;
      const t = e.target as HTMLElement | null;
      if (t?.closest('input, textarea, select, [contenteditable="true"]') || document.querySelector('dialog[open]')) return;
      const k = keys.current;
      if (/^[1-9]$/.test(e.key) && Number(e.key) <= k.outs.length) { e.preventDefault(); k.choose(Number(e.key) - 1); }
      else if (e.key === 'Backspace' && k.trail.length > 1) { e.preventDefault(); k.goTo(k.trail.length - 2); }
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [view]);

  // Tabs: roving tabindex, arrows / Home / End; the indicator moves by transform only.
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [bar, setBar] = useState({ x: 0, w: 0 });
  const active = VIEWS.findIndex((v) => v.id === view);
  useLayoutEffect(() => {
    const el = tabRefs.current[active];
    if (el) setBar({ x: el.offsetLeft, w: el.offsetWidth });
  }, [active]);
  const tabKey = (e: RKeyboardEvent, i: number) => {
    const n = VIEWS.length;
    const next = e.key === 'ArrowRight' ? (i + 1) % n : e.key === 'ArrowLeft' ? (i - 1 + n) % n : e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : -1;
    if (next < 0) return;
    e.preventDefault();
    pick(VIEWS[next].id);
    tabRefs.current[next]?.focus();
  };

  // Questions asked so far, for "Question 3".
  const asked = trail.filter((s) => nodes.get(s.id)?.kind === 'ask').length;

  return (
    <div className="flow" data-view={view}>
      <div className="tabs__list flow__tabs" role="tablist" aria-label="Ways to study this flow">
        {VIEWS.map((v, i) => (
          <button
            key={v.id}
            ref={(el) => { tabRefs.current[i] = el; }}
            type="button"
            className="tabs__tab"
            role="tab"
            id={`${uid}-tab-${v.id}`}
            aria-selected={view === v.id}
            aria-controls={`${uid}-panel-${v.id}`}
            tabIndex={view === v.id ? 0 : -1}
            onClick={() => pick(v.id)}
            onKeyDown={(e) => tabKey(e, i)}
          >
            {v.label}
          </button>
        ))}
        <span className="tabs__indicator" aria-hidden="true" style={{ transform: `translateX(${bar.x}px) scaleX(${bar.w / 100})`, opacity: bar.w ? 1 : 0 }} />
      </div>

      {view === 'walk' && (
        <div className="flow__panel flow-walk" role="tabpanel" id={`${uid}-panel-walk`} aria-labelledby={`${uid}-tab-walk`}>
          <div className="flow-walk__main">
            {trail.length > 1 && (
              <nav className="flow-walk__trail" aria-label="Your reasoning so far">
                <ol>
                  {trail.slice(0, -1).map((s, k) => {
                    const n = nodes.get(s.id)!;
                    const e = edgesOf(n, nodes).find((x) => x.index === trail[k + 1].via);
                    const answer = n.kind === 'ask' ? e?.label ?? '' : 'Next';
                    return (
                      <li key={`${k}:${s.id}`}>
                        <button type="button" className="flow-walk__crumb" onClick={() => goTo(k)} aria-label={`Go back to: ${n.text} (you answered ${answer})`}>
                          <span className="flow-walk__crumb-n mono" aria-hidden="true">{k + 1}</span>
                          <span className="flow-walk__crumb-text">{n.text}</span>
                          <span className="flow-walk__crumb-ans">{answer}</span>
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </nav>
            )}
            {cur ? (
              <WalkCard
                key={`${trail.length}:${cur.id}`}
                node={cur}
                outs={outs.map((e) => e.label ?? 'Next')}
                refs={refs}
                dir={dir}
                number={asked}
                onChoose={choose}
                onBack={trail.length > 1 ? () => goTo(trail.length - 2) : undefined}
                onRestart={restart}
                onRoutes={() => showRoutes(cur.id)}
              />
            ) : (
              <p className="flow-walk__stuck">This flow has no starting point yet.</p>
            )}
          </div>
          <aside className="flow-walk__aside" aria-hidden="true">
            <p className="label">Where you are</p>
            <FlowMap flow={flow} layout={L} variant="mini" walkEdges={walkEdges} walkNodes={walkNodes} current={cur?.id ?? flow.start} />
          </aside>
        </div>
      )}

      {view === 'map' && (
        <div className="flow__panel" role="tabpanel" id={`${uid}-panel-map`} aria-labelledby={`${uid}-tab-map`}>
          <FlowMap
            flow={flow}
            layout={L}
            variant="full"
            walkEdges={walkEdges}
            walkNodes={walkNodes}
            current={cur?.id ?? flow.start}
            refs={refs}
            selected={selected}
            traceEnd={traceEnd}
            onSelect={select}
            onClearTrace={() => { setTraceEnd(null); setSelected(null); }}
          />
        </div>
      )}

      {view === 'order' && (
        <div className="flow__panel" role="tabpanel" id={`${uid}-panel-order`} aria-labelledby={`${uid}-tab-order`}>
          <FlowOrder flow={flow} />
        </div>
      )}
    </div>
  );
}

interface CardProps {
  node: FlowNode;
  outs: string[];
  refs: FlowRefs;
  dir: 'fwd' | 'back' | null;
  number: number;
  onChoose: (i: number) => void;
  onBack?: () => void;
  onRestart: () => void;
  onRoutes: () => void;
}

/** The current node. Remounted per stop, so "Why?" starts closed and the entrance plays once. */
function WalkCard({ node, outs, refs, dir, number, onChoose, onBack, onRestart, onRoutes }: CardProps) {
  const [why, setWhy] = useState(false);
  const head = useRef<HTMLHeadingElement>(null);
  const noteId = useId();
  // After a move, the new node takes focus (instantly, so keyboard and screen-reader users land on it).
  useEffect(() => { if (dir) head.current?.focus(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const detail = hasDetail(node, refs);
  const tone = toneOf(node);

  return (
    <article className="flow-walk__card" data-kind={node.kind} data-dir={dir ?? undefined}>
      <p className="flow-walk__meta">
        <span className="label">{node.kind === 'ask' ? `Question ${number}` : node.kind === 'step' ? 'Step' : 'Outcome'}</span>
        {node.exception && <span className="flow-exception">Exception</span>}
      </p>
      {node.kind === 'end' && (
        <p className="flow-walk__tone flow-tone" data-tone={node.tone}>
          <span className="flow-walk__glyph" aria-hidden="true">{tone.glyph}</span>
          {tone.word}
        </p>
      )}
      <h2 className="flow-walk__q" tabIndex={-1} ref={head}>{node.text}</h2>

      {detail && (
        <div className="flow-walk__why">
          <button type="button" className="btn btn--ghost flow-walk__why-btn" aria-expanded={why} aria-controls={noteId} onClick={() => setWhy((w) => !w)}>
            {why ? 'Hide why' : 'Why?'}
          </button>
          <div id={noteId} className="flow-walk__note" hidden={!why}>
            {why && <NodeDetail node={node} refs={refs} />}
          </div>
        </div>
      )}

      {node.kind === 'ask' && outs.length > 0 && (
        <ol className="flow-walk__choices">
          {outs.map((label, i) => (
            <li key={i}>
              <button type="button" className="option" aria-keyshortcuts={i < 9 ? String(i + 1) : undefined} onClick={() => onChoose(i)}>
                <span className="option__key" aria-hidden="true">{i + 1}</span>
                <span>{label}</span>
              </button>
            </li>
          ))}
        </ol>
      )}

      <div className="flow-walk__actions">
        {node.kind === 'step' && outs.length > 0 && (
          <button type="button" className="btn btn--primary" aria-keyshortcuts="1" onClick={() => onChoose(0)}>
            Next <kbd className="kbd kbd--hint" aria-hidden="true">1</kbd>
          </button>
        )}
        {node.kind === 'end' && (
          <>
            <button type="button" className="btn btn--primary" onClick={onRestart}>Start again</button>
            <button type="button" className="btn btn--secondary" onClick={onRoutes}>Every route to this outcome</button>
          </>
        )}
        {node.kind !== 'end' && outs.length === 0 && (
          <>
            <p className="flow-walk__stuck">The flow stops here.</p>
            <button type="button" className="btn btn--secondary" onClick={onRestart}>Start again</button>
          </>
        )}
        {onBack && (
          <button type="button" className="btn btn--ghost" aria-keyshortcuts="Backspace" onClick={onBack}>
            Back <kbd className="kbd kbd--hint" aria-hidden="true">⌫</kbd>
          </button>
        )}
      </div>
    </article>
  );
}
