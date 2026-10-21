// Rebuild the map from memory (features 60, 94): one week's concepts placed round a ring with their links hidden.
// The learner draws links (choose a dot, then another, then say how they connect: which builds on which, often
// confused, or related) and presses Check: right, different-relation, extra and missing links are drawn in four
// distinct line styles, each with a glyph and a word (never colour alone), with a score and the list in words.
// Keyboard alternative: "Use a list instead" — every pair of the week's concepts with a select. Both edit one state.
// Scoring lives in src/lib/graph.ts (scoreRebuild, unit-tested).
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { KINDS, linkWords, pairKey, scoreRebuild, truthLinks, type EdgeKind, type Graph, type Link, type RebuildResult } from '../../lib/graph';

export interface RebuildConcept { id: string; title: string; week: number; unit: string; code: string }

interface Props {
  concepts: RebuildConcept[];
  graph: Graph;
  byUnit: boolean;
  heading: 'h2' | 'h3';
  /** `${unit}:${week}` to start on. */
  start?: string;
  onExit: () => void;
}

const W = 760, H = 520, CX = 380, CY = 262, RX = 190, RY = 186, R = 10;
type Status = 'correct' | 'wrong' | 'extra' | 'missing';
const GLYPH: Record<Status, string> = { correct: '✓', wrong: '≠', extra: '×', missing: '+' };
const STATUS_WORDS: Record<Status, string> = { correct: 'Right', wrong: 'Right pair, different relation', extra: 'Not linked in the notes', missing: 'Missing: in the notes, not drawn' };

/** Up to two lines of about 24 characters, ellipsis after. */
function wrap(text: string, max = 24): string[] {
  const lines: string[] = [];
  let cur = '';
  for (const w of text.split(/\s+/)) {
    if (!cur) cur = w;
    else if (`${cur} ${w}`.length <= max) cur = `${cur} ${w}`;
    else { lines.push(cur); cur = w; }
  }
  if (cur) lines.push(cur);
  if (lines.length > 2) lines.splice(1, lines.length - 1, `${lines[1].slice(0, max - 1)}…`);
  return lines.map((l) => (l.length > max + 2 ? `${l.slice(0, max - 1)}…` : l));
}
const short = (t: string, n = 40) => (t.length > n ? `${t.slice(0, n - 1)}…` : t);

export default function MapRebuild({ concepts, graph, byUnit, heading: H2, start, onExit }: Props) {
  const uid = useId().replace(/:/g, '');
  const groups = useMemo(() => {
    const m = new Map<string, RebuildConcept[]>();
    for (const c of concepts) m.set(`${c.unit}:${c.week}`, [...(m.get(`${c.unit}:${c.week}`) ?? []), c]);
    return [...m].filter(([, cs]) => cs.length > 1).map(([key, cs]) => ({ key, cs, code: cs[0].code, week: cs[0].week }))
      .sort((a, b) => a.code.localeCompare(b.code) || a.week - b.week);
  }, [concepts]);
  const [key, setKey] = useState(() => (groups.some((g) => g.key === start) ? start! : groups[0]?.key ?? ''));
  const group = groups.find((g) => g.key === key);
  const ids = useMemo(() => group?.cs.map((c) => c.id) ?? [], [group]);
  const title = (id: string) => graph.title.get(id) ?? id;

  const [drawn, setDrawn] = useState<Map<string, Link>>(new Map());
  const [pick, setPick] = useState<string | null>(null);
  const [pending, setPending] = useState<{ a: string; b: string; key: boolean } | null>(null);
  const [withRelated, setWithRelated] = useState(false);
  const [result, setResult] = useState<RebuildResult | null>(null);
  const firstKind = useRef<HTMLButtonElement>(null);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => { setDrawn(new Map()); setPick(null); setPending(null); setResult(null); }, [key]);
  useEffect(() => { if (pending?.key) firstKind.current?.focus(); }, [pending]);

  const kinds: EdgeKind[] = withRelated ? [...KINDS] : ['depends', 'contrasts'];
  const truth = useMemo(() => truthLinks(graph, ids), [graph, ids]);
  const target = new Set(truth.filter((t) => kinds.includes(t.kind)).map((t) => pairKey(t.a, t.b))).size;

  const pts = useMemo(() => new Map(ids.map((id, i) => {
    const t = -Math.PI / 2 + (i / ids.length) * Math.PI * 2;
    return [id, { x: CX + RX * Math.cos(t), y: CY + RY * Math.sin(t), cos: Math.cos(t), sin: Math.sin(t) }];
  })), [ids]);

  const edit = (f: (m: Map<string, Link>) => void) => {
    setDrawn((d) => { const m = new Map(d); f(m); return m; });
    setResult(null);
  };
  const setLink = (a: string, b: string, kind: EdgeKind | null, depA = true) => edit((m) => {
    if (!kind) m.delete(pairKey(a, b));
    else m.set(pairKey(a, b), kind === 'depends' ? (depA ? { a, b, kind } : { a: b, b: a, kind }) : { a, b, kind });
  });
  const tap = (id: string, viaKey = false) => {
    if (pending) { setPending(null); }
    if (!pick) { setPick(id); return; }
    if (pick === id) { setPick(null); return; }
    setPending({ a: pick, b: id, key: viaKey });
    setPick(null);
  };
  const choose = (kind: EdgeKind | null, depA = true) => {
    if (!pending) return;
    setLink(pending.a, pending.b, kind, depA);
    const back = pending;
    setPending(null);
    if (back.key) requestAnimationFrame(() => box.current?.querySelector<SVGGElement>(`[data-id="${CSS.escape(back.b)}"]`)?.focus());
  };

  if (!group) {
    return (
      <section className="mapx-rb" aria-label="Rebuild a week from memory">
        <p className="mapx-rb__intro">No week has two or more concepts yet, so there is nothing to rebuild.</p>
        <button type="button" className="btn btn--ghost btn--sm" onClick={onExit}>Back to the map</button>
      </section>
    );
  }

  const line = (l: Link, cls: string, k: string, glyph?: string) => {
    // Depends: the arrow runs from the prerequisite (b) to the concept that builds on it (a).
    const [p, q] = l.kind === 'depends' ? [pts.get(l.b)!, pts.get(l.a)!] : [pts.get(l.a)!, pts.get(l.b)!];
    const dx = q.x - p.x, dy = q.y - p.y, len = Math.hypot(dx, dy) || 1;
    const ux = dx / len, uy = dy / len, gap = R + 4;
    const x1 = p.x + ux * gap, y1 = p.y + uy * gap, x2 = q.x - ux * (gap + (l.kind === 'depends' ? 2 : 0)), y2 = q.y - uy * (gap + (l.kind === 'depends' ? 2 : 0));
    const tone = cls.includes('correct') ? 'sage' : cls.includes('extra') ? 'clay' : 'ink';
    return (
      <g key={k}>
        <line x1={x1} y1={y1} x2={x2} y2={y2} className={cls} markerEnd={l.kind === 'depends' ? `url(#${uid}-${tone})` : undefined} />
        {glyph && (
          <g className="mapx-rb__mark" data-tone={tone} transform={`translate(${(p.x + q.x) / 2} ${(p.y + q.y) / 2})`}>
            <circle r="9" />
            <text y="4">{glyph}</text>
          </g>
        )}
      </g>
    );
  };

  const shown: { l: Link; s?: Status }[] = result
    ? [...result.correct.map((l) => ({ l, s: 'correct' as const })), ...result.wrongKind.map((w) => ({ l: w.drawn, s: 'wrong' as const })),
       ...result.extra.map((l) => ({ l, s: 'extra' as const })), ...result.missing.map((l) => ({ l, s: 'missing' as const }))]
    : [...drawn.values()].map((l) => ({ l }));
  const pairsList = ids.flatMap((a, i) => ids.slice(i + 1).map((b) => [a, b] as const));
  const valueOf = (a: string, b: string) => {
    const l = drawn.get(pairKey(a, b));
    if (!l) return '';
    if (l.kind === 'depends') return l.a === a ? 'ab' : 'ba';
    return l.kind;
  };
  const weekName = (g: { code: string; week: number }) => `${byUnit ? `${g.code} · ` : ''}Week ${g.week}`;
  const pend = pending ? drawn.get(pairKey(pending.a, pending.b)) ?? null : null;

  return (
    <section className="mapx-rb" aria-labelledby={`${uid}-h`}>
      <div className="mapx-rb__top">
        <H2 id={`${uid}-h`} className="mapx-rb__title">Rebuild {weekName(group)} from memory</H2>
        <button type="button" className="btn btn--ghost btn--sm mapx__action" onClick={onExit}>Back to the map</button>
      </div>
      <p className="mapx-rb__intro">
        Choose a dot, then another, then say how they connect. The notes link {target} {target === 1 ? 'pair' : 'pairs'} here{withRelated ? '' : ' as prerequisites or common confusions'}. Check when you are ready.
      </p>
      <div className="mapx-rb__opts">
        {byUnit ? (
          <label className="mapx-field"><span>Week</span>
            <select value={key} onChange={(e) => setKey(e.target.value)}>
              {groups.map((g) => <option key={g.key} value={g.key}>{weekName(g)}</option>)}
            </select>
          </label>
        ) : (
          <div className="mapx__group" role="group" aria-label="Week to rebuild">
            <span className="mapx__group-label">Week</span>
            {groups.map((g) => (
              <button key={g.key} type="button" className="chip mapx__chip mapx__week" aria-pressed={g.key === key} aria-label={`Week ${g.week}`} onClick={() => setKey(g.key)}>{g.week}</button>
            ))}
          </div>
        )}
        <label className="mapx-rb__check"><input type="checkbox" checked={withRelated} onChange={(e) => { setWithRelated(e.target.checked); setResult(null); }} /> Count related links too</label>
      </div>

      <div className="mapx-rb__scroll" ref={box} role="region" aria-label="Concepts to link (scroll sideways on small screens)">
        <svg viewBox={`0 0 ${W} ${H}`} role="group" aria-label={`${group.cs.length} concepts from ${weekName(group)}`}>
          <defs>
            {(['ink', 'sage', 'clay'] as const).map((t) => (
              <marker key={t} id={`${uid}-${t}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0 0L10 5L0 10z" className="mapx-rb__arrow" data-tone={t} />
              </marker>
            ))}
          </defs>
          {shown.map(({ l, s }) => line(l, `mapx-rb__line mapx-rb__line--${s ?? l.kind}`, `${s ?? 'd'}-${pairKey(l.a, l.b)}`, s && GLYPH[s]))}
          {ids.map((id) => {
            const p = pts.get(id)!;
            const lines = wrap(title(id));
            const side = p.cos > 0.3 ? 'start' : p.cos < -0.3 ? 'end' : 'middle';
            const tx = side === 'start' ? p.x + R + 8 : side === 'end' ? p.x - R - 8 : p.x;
            const ty = side !== 'middle' ? p.y + 5 - (lines.length - 1) * 8 : p.sin < 0 ? p.y - R - 10 - (lines.length - 1) * 16 : p.y + R + 20;
            const chosen = pick === id || pending?.a === id || pending?.b === id;
            return (
              <g key={id} data-id={id} className="mapx-rb__node" role="button" tabIndex={0} aria-pressed={chosen}
                aria-label={`${title(id)}${pick === id ? ', chosen: now choose the concept to link it to' : ''}`}
                onClick={(e) => tap(id, e.detail === 0)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tap(id, true); } }}>
                <circle cx={p.x} cy={p.y} r={22} className="mapx-rb__hit" />
                <circle cx={p.x} cy={p.y} r={R} className="mapx-rb__dot" />
                <text x={tx} y={ty} textAnchor={side} className="mapx-rb__label">
                  {lines.map((t, i) => <tspan key={i} x={tx} dy={i ? 16 : 0}>{t}</tspan>)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {pending && (
        <div className="mapx-rb__choose" role="group" aria-label="How do these connect?">
          <p className="mapx-rb__ask">How do <strong>{title(pending.a)}</strong> and <strong>{title(pending.b)}</strong> connect?</p>
          <div className="mapx-rb__kinds">
            <button ref={firstKind} type="button" className="mapx-rb__kind" onClick={() => choose('depends', true)}>{short(title(pending.a))} builds on {short(title(pending.b))}</button>
            <button type="button" className="mapx-rb__kind" onClick={() => choose('depends', false)}>{short(title(pending.b))} builds on {short(title(pending.a))}</button>
            <button type="button" className="mapx-rb__kind" onClick={() => choose('contrasts')}>Often confused</button>
            {withRelated && <button type="button" className="mapx-rb__kind" onClick={() => choose('related')}>Related</button>}
            {pend && <button type="button" className="mapx-rb__kind" onClick={() => choose(null)}>Remove this link</button>}
            <button type="button" className="btn btn--ghost btn--sm mapx__action" onClick={() => setPending(null)}>Cancel</button>
          </div>
        </div>
      )}

      <ul className="mapx-rb__key" aria-label="Key">
        {result ? (['correct', 'wrong', 'extra', 'missing'] as const).map((s) => (
          <li key={s}><svg width="28" height="10" aria-hidden="true"><line x1="0" y1="5" x2="28" y2="5" className={`mapx-rb__line mapx-rb__line--${s}`} /></svg><span aria-hidden="true" className="mapx-rb__glyph" data-tone={s === 'correct' ? 'sage' : s === 'extra' ? 'clay' : 'ink'}>{GLYPH[s]}</span> {STATUS_WORDS[s]}</li>
        )) : (
          <>
            <li><svg width="28" height="10" aria-hidden="true"><line x1="0" y1="5" x2="28" y2="5" className="mapx-rb__line mapx-rb__line--depends" /></svg> builds on (the arrow leaves the prerequisite)</li>
            <li><svg width="28" height="10" aria-hidden="true"><line x1="0" y1="5" x2="28" y2="5" className="mapx-rb__line mapx-rb__line--contrasts" /></svg> often confused</li>
            {withRelated && <li><svg width="28" height="10" aria-hidden="true"><line x1="0" y1="5" x2="28" y2="5" className="mapx-rb__line mapx-rb__line--related" /></svg> related</li>}
          </>
        )}
      </ul>

      <div className="mapx-rb__actions">
        {result
          ? <button type="button" className="btn btn--secondary btn--sm mapx__action" onClick={() => setResult(null)}>Try again</button>
          : <button type="button" className="btn btn--primary btn--sm mapx__action" onClick={() => { setPending(null); setPick(null); setResult(scoreRebuild(truth, [...drawn.values()], kinds)); }}>Check my links</button>}
        <button type="button" className="btn btn--ghost btn--sm mapx__action" disabled={!drawn.size && !result} onClick={() => { setDrawn(new Map()); setResult(null); setPending(null); setPick(null); }}>Start over</button>
      </div>

      <div aria-live="polite">
        {result && (
          <div className="mapx-rb__result">
            <p className="mapx-rb__score">
              {result.total ? `${result.score} of ${result.total} ${result.total === 1 ? 'link' : 'links'} right.` : 'The notes state no links of these kinds inside this week.'}
              {result.wrongKind.length > 0 && ` ${result.wrongKind.length} with a different relation.`}
              {result.extra.length > 0 && ` ${result.extra.length} not in the notes.`}
              {result.missing.length > 0 && ' The dotted lines show what is missing.'}
              {!result.total && !withRelated && ' Tick "Count related links too" to practise those.'}
            </p>
            <div className="mapx-rb__lists">
              {result.correct.length > 0 && <Words label={`${GLYPH.correct} Right (${result.correct.length})`} items={result.correct.map((l) => linkWords(graph, l))} />}
              {result.wrongKind.length > 0 && <Words label={`${GLYPH.wrong} Different relation (${result.wrongKind.length})`} items={result.wrongKind.map((w) => `You drew: ${linkWords(graph, w.drawn)}. The notes: ${w.truth.map((t) => linkWords(graph, t)).join('; ')}.`)} />}
              {result.missing.length > 0 && <Words label={`${GLYPH.missing} Missing (${result.missing.length})`} items={result.missing.map((l) => linkWords(graph, l))} />}
              {result.extra.length > 0 && <Words label={`${GLYPH.extra} Not in the notes (${result.extra.length})`} items={result.extra.map((l) => linkWords(graph, l))} />}
            </div>
          </div>
        )}
      </div>

      {drawn.size > 0 && !result && (
        <div className="mapx-rb__drawn">
          <p className="mapx-panel__label">Your links ({drawn.size})</p>
          <ul className="mapx-rb__mine">
            {[...drawn.values()].map((l) => (
              <li key={pairKey(l.a, l.b)}>
                <span>{linkWords(graph, l)}</span>
                <button type="button" className="btn btn--ghost btn--sm mapx__action" aria-label={`Remove: ${linkWords(graph, l)}`} onClick={() => setLink(l.a, l.b, null)}>Remove</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <details className="mapx-details">
        <summary>Use a list instead</summary>
        <ul className="mapx-rb__pairs">
          {pairsList.map(([a, b]) => {
            const v = valueOf(a, b);
            return (
              <li key={pairKey(a, b)}>
                <span className="mapx-rb__pair">{title(a)} <span aria-hidden="true">·</span> {title(b)}</span>
                <select className="mapx-rb__select" aria-label={`Link between ${title(a)} and ${title(b)}`} value={v}
                  onChange={(e) => {
                    const x = e.target.value;
                    setLink(a, b, x === 'ab' || x === 'ba' ? 'depends' : x ? (x as EdgeKind) : null, x !== 'ba');
                  }}>
                  <option value="">No link</option>
                  <option value="ab">{short(title(a))} builds on {short(title(b))}</option>
                  <option value="ba">{short(title(b))} builds on {short(title(a))}</option>
                  <option value="contrasts">Often confused</option>
                  {(withRelated || v === 'related') && <option value="related">Related</option>}
                </select>
              </li>
            );
          })}
        </ul>
      </details>
    </section>
  );
}

function Words({ label, items }: { label: string; items: string[] }) {
  return (
    <section className="mapx-rb__words" aria-label={label.replace(/^\S+\s/, '')}>
      <p className="mapx-panel__label">{label}</p>
      <ul>{items.map((t, i) => <li key={i}>{t}</li>)}</ul>
    </section>
  );
}
