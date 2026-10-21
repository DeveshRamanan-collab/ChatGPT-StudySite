// Match (feature 97): scenarios (aid `transfer` scenarios and `boundary` cases) in one column, the week's concepts
// in the other. Choose one from each column to link them (either order); the link is drawn as a line in an SVG
// overlay and also written on the scenario as the concept's letter, so it reads without the line too. Choosing the
// same pair again unlinks. "Check" marks every scenario Right / Not this one; "Show answer" draws the right links;
// each scenario then offers a "Why?" in place. The first Check records one attempt per concept in the round
// (`visual:match:<concept>`, score = share of that concept's scenarios linked right, mode 'visual').
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { hashString } from '../../lib/flow';
import { recordAttempt } from '../../lib/learning';
import { byConcept, checkLinks, matchRound, toggleLink, visualId, type MatchRound } from '../../lib/visual';
import { Mark } from './LabelDrag';
import type { PanelProps } from './VisualPractice';

const LETTERS = 'ABCDEFGH';
type Pick = { side: 'scenario' | 'concept'; id: string } | null;
interface Line { id: string; to: string; d: string; x1: number; y1: number; x2: number; y2: number; mark?: 'right' | 'wrong' }

export default function MatchUp(p: PanelProps) {
  const [round, setRound] = useState(0);
  const r = useMemo(() => matchRound(p.aids, hashString(p.week.id) + round * 7919), [p.aids, p.week.id, round]);
  if (!r) return null;
  return <MatchBoard key={round} r={r} {...p} onAgain={() => setRound((n) => n + 1)} />;
}

function MatchBoard({ r, unit, week, concepts, onAgain }: PanelProps & { r: MatchRound; onAgain: () => void }) {
  const [links, setLinks] = useState<Record<string, string>>({});
  const [pick, setPick] = useState<Pick>(null);
  const [marks, setMarks] = useState<Record<string, boolean> | null>(null);
  const [shown, setShown] = useState(false);
  const [open, setOpen] = useState<Set<string>>(new Set());
  const [status, setStatus] = useState('');
  const [lines, setLines] = useState<Line[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const recorded = useRef(false);
  const started = useRef(0);
  const grid = useRef<HTMLDivElement>(null);
  useEffect(() => { started.current = performance.now(); }, []);

  const letter = (c: string) => LETTERS[r.concepts.indexOf(c)] ?? '?';
  const title = (c: string) => concepts[c]?.title ?? c;
  const number = (sid: string) => r.scenarios.findIndex((s) => s.id === sid) + 1;

  const link = (sid: string, cid: string) => {
    const was = links[sid];
    setLinks((l) => toggleLink(l, sid, cid));
    setPick(null);
    setMarks(null);
    setShown(false);
    setStatus(was === cid ? `Scenario ${number(sid)} unlinked.` : `Scenario ${number(sid)} linked to ${letter(cid)}: ${title(cid)}.`);
  };
  const chooseScenario = (sid: string) => {
    if (pick?.side === 'concept') return link(sid, pick.id);
    if (pick?.id === sid) { setPick(null); setStatus(''); return; }
    setPick({ side: 'scenario', id: sid });
    setStatus(`Scenario ${number(sid)} chosen. Now choose the concept it tests.`);
  };
  const chooseConcept = (cid: string) => {
    if (pick?.side === 'scenario') return link(pick.id, cid);
    if (pick?.id === cid) { setPick(null); setStatus(''); return; }
    setPick({ side: 'concept', id: cid });
    setStatus(`${letter(cid)}: ${title(cid)} chosen. Now choose a scenario it fits.`);
  };

  // Lines: from the right edge of a scenario to the left edge of its concept, re-measured on any layout change.
  useLayoutEffect(() => {
    const g = grid.current;
    if (!g) return;
    const measure = () => {
      const box = g.getBoundingClientRect();
      setSize({ w: box.width, h: box.height });
      const next: Line[] = [];
      for (const [sid, cid] of Object.entries(links)) {
        const a = g.querySelector<HTMLElement>(`[data-sid="${CSS.escape(sid)}"]`)?.getBoundingClientRect();
        const b = g.querySelector<HTMLElement>(`[data-cid="${CSS.escape(cid)}"]`)?.getBoundingClientRect();
        if (!a || !b) continue;
        const x1 = a.right - box.left, y1 = a.top + a.height / 2 - box.top;
        const x2 = b.left - box.left, y2 = b.top + b.height / 2 - box.top;
        const dx = Math.max(12, (x2 - x1) / 2);
        next.push({ id: sid, to: cid, x1, y1, x2, y2, d: `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`, mark: marks ? (marks[sid] ? 'right' : 'wrong') : undefined });
      }
      setLines(next);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(g);
    return () => ro.disconnect();
  }, [links, marks, open]);

  const check = () => {
    const m = checkLinks(links, r.scenarios);
    setMarks(m);
    setShown(false);
    setPick(null);
    const right = Object.values(m).filter(Boolean).length;
    setStatus(right === r.scenarios.length ? 'All linked right.' : `${right} of ${r.scenarios.length} linked right.`);
    if (recorded.current) return;
    recorded.current = true;
    const ms = Math.round(performance.now() - started.current);
    for (const [c, { right: ok, total }] of byConcept(r.scenarios, m)) {
      recordAttempt({
        questionId: visualId('match', c), unit, concept: c, week: week.id, type: 'match',
        answer: r.scenarios.filter((s) => s.concept === c).map((s) => ({ scenario: s.id, linked: links[s.id] ?? null })),
        correct: null, score: ok / total, mode: 'visual', durationMs: ms,
      }).catch((e) => console.warn(e));
    }
  };
  const reveal = () => {
    setLinks(Object.fromEntries(r.scenarios.map((s) => [s.id, s.concept])));
    setMarks(Object.fromEntries(r.scenarios.map((s) => [s.id, true])));
    setShown(true);
    setPick(null);
    setStatus('These are the right links.');
  };
  const toggleWhy = (sid: string) => setOpen((o) => { const n = new Set(o); if (n.has(sid)) n.delete(sid); else n.add(sid); return n; });
  const linked = Object.keys(links).length;

  return (
    <div className="vis-match" data-picking={pick?.side} onKeyDown={(e) => { if (e.key === 'Escape' && pick) { setPick(null); setStatus(''); } }}>
      <div className="vis-match__grid" ref={grid}>
        <svg className="vis-match__lines" width={size.w} height={size.h} viewBox={`0 0 ${size.w || 1} ${size.h || 1}`} aria-hidden="true">
          {lines.map((l) => (
            <g key={`${l.id}>${l.to}`} className="vis-match__line" data-mark={l.mark}>
              <path d={l.d} />
              <circle cx={l.x1} cy={l.y1} r="3.5" />
              <circle cx={l.x2} cy={l.y2} r="3.5" />
            </g>
          ))}
        </svg>

        <ol className="vis-match__col vis-match__col--scenarios" aria-label="Scenarios">
          {r.scenarios.map((s, i) => {
            const c = links[s.id];
            const mark = marks?.[s.id];
            const whyId = `why-${s.id.replace(/[^a-z0-9-]/gi, '-')}`;
            return (
              <li key={s.id} className="vis-match__cell" data-mark={mark === undefined ? undefined : mark ? 'right' : 'wrong'}>
                <button
                  type="button"
                  className="vis-match__item vis-match__item--scenario"
                  data-sid={s.id}
                  data-linked={c ? '' : undefined}
                  aria-pressed={pick?.side === 'scenario' && pick.id === s.id}
                  onClick={() => chooseScenario(s.id)}
                >
                  <span className="vis-match__n mono" aria-hidden="true">{i + 1}</span>
                  <span className="vis-match__text">
                    <span className="visually-hidden">Scenario {i + 1}: </span>
                    {s.text}
                    <span className="vis-match__tag" data-on={c ? '' : undefined}>
                      {c ? <><span aria-hidden="true">→ </span><span className="mono" aria-hidden="true">{letter(c)}</span><span className="visually-hidden">Linked to {title(c)}</span></> : <span className="visually-hidden">Not linked yet</span>}
                    </span>
                  </span>
                </button>
                {mark !== undefined && (
                  <span className="vis-match__after">
                    <Mark ok={mark} wrongWord="Not this one" className="vis-match__mark" />
                    {s.explain && (
                      <button type="button" className="btn btn--ghost btn--sm vis-match__why-btn" aria-expanded={open.has(s.id)} aria-controls={whyId} onClick={() => toggleWhy(s.id)}>
                        {open.has(s.id) ? 'Hide why' : 'Why?'}
                      </button>
                    )}
                  </span>
                )}
                {mark !== undefined && s.explain && open.has(s.id) && (
                  <p className="vis-match__why" id={whyId}>
                    <span className="label">{s.source === 'transfer' ? 'How it applies' : 'Why it sits at the edge'}</span> {s.explain}
                  </p>
                )}
              </li>
            );
          })}
        </ol>

        <ol className="vis-match__col vis-match__col--concepts" aria-label="Concepts">
          {r.concepts.map((c, i) => (
            <li key={c} className="vis-match__cell">
              <button
                type="button"
                className="vis-match__item vis-match__item--concept"
                data-cid={c}
                aria-pressed={pick?.side === 'concept' && pick.id === c}
                onClick={() => chooseConcept(c)}
              >
                <span className="vis-match__letter mono" aria-hidden="true">{LETTERS[i]}</span>
                <span className="vis-match__text">{title(c)}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>

      <p className="vis__status" aria-live="polite">{status || ' '}</p>
      <div className="vis__actions">
        <button type="button" className="btn btn--primary" onClick={check} disabled={!linked}>Check</button>
        <button type="button" className="btn btn--ghost" onClick={reveal}>Show answer</button>
        <button type="button" className="btn btn--ghost" onClick={onAgain}>New round</button>
      </div>
      {shown && (
        <p className="vis__note">
          Revisit:{' '}
          {r.concepts.map((c, i) => <span key={c}>{i > 0 && ' · '}{concepts[c] ? <a href={concepts[c].href}>{title(c)}</a> : title(c)}</span>)}
        </p>
      )}
    </div>
  );
}
