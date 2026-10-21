// Case explorer: a timeline whose rows are court lanes (international at the top, then the Australian hierarchy from
// the High Court down, then other systems), a filtered list that is the keyboard and screen-reader route to every
// case, and a detail panel for the chosen case: its concepts and the cases it is most often taught with (shared
// concepts), which the timeline links with hairlines. The timeline is a picture of the list, so it is aria-hidden.
import { useEffect, useMemo, useState } from 'react';
import { LANES, type Lane } from '../../lib/courts';
import '../../styles/case-explorer.css';

interface CaseRow { id: string; name: string; citation: string; lane: Lane; year: number | null; units: string[]; line: string; concepts: string[]; verify: boolean }
interface ConceptRef { title: string; href: string; unit: string }
interface Props { cases: CaseRow[]; concepts: Record<string, ConceptRef>; units: { id: string; code: string }[] }

const W = 960, LANE_H = 34, PAD_L = 112, PAD_R = 16, PAD_T = 22;

export default function CaseExplorer({ cases, concepts, units }: Props) {
  const [unit, setUnit] = useState<string>('all');
  const [hidden, setHidden] = useState<Set<Lane>>(new Set());
  const [q, setQ] = useState('');
  const [sel, setSel] = useState<string | null>(null);

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return cases.filter((k) => (unit === 'all' || k.units.includes(unit)) && !hidden.has(k.lane) && (!needle || `${k.name} ${k.citation} ${k.line}`.toLowerCase().includes(needle)));
  }, [cases, unit, hidden, q]);

  const lanes = LANES.filter((l) => cases.some((k) => k.lane === l.id && (unit === 'all' || k.units.includes(unit))));
  const dated = shown.filter((k) => k.year !== null);
  const years = dated.map((k) => k.year!);
  const y0 = years.length ? Math.floor(Math.min(...years) / 10) * 10 : 1900;
  const y1 = years.length ? Math.ceil((Math.max(...years) + 1) / 10) * 10 : 2030;
  // Piecewise time axis: most cases are modern, so years before 1900 share the first fifth of the width.
  const SPLIT = 1900;
  const split = y0 < SPLIT && y1 > SPLIT + 20;
  const span = W - PAD_L - PAD_R;
  const x = (y: number) =>
    !split ? PAD_L + ((y - y0) / Math.max(1, y1 - y0)) * span
      : y < SPLIT ? PAD_L + ((y - y0) / (SPLIT - y0)) * span * 0.2
      : PAD_L + span * 0.2 + ((y - SPLIT) / (y1 - SPLIT)) * span * 0.8;
  const laneY = (l: Lane) => PAD_T + lanes.findIndex((x) => x.id === l) * LANE_H + LANE_H / 2;
  const H = PAD_T + lanes.length * LANE_H + 26;
  const from = split ? SPLIT : y0;
  const stepY = y1 - from > 120 ? 50 : y1 - from > 50 ? 20 : 10;
  const ticks = [...(split ? [y0] : []), ...Array.from({ length: Math.floor((y1 - from) / stepY) + 1 }, (_, i) => from + i * stepY)];

  // Jitter dots that share a lane and year so each stays visible.
  const pos = useMemo(() => {
    const seen = new Map<string, number>();
    const out = new Map<string, { cx: number; cy: number }>();
    for (const k of dated) {
      const key = `${k.lane}:${k.year}`;
      const n = seen.get(key) ?? 0;
      seen.set(key, n + 1);
      out.set(k.id, { cx: x(k.year!) + (n % 2 ? 3 : -3) * Math.ceil(n / 2), cy: laneY(k.lane) + ((n % 3) - 1) * 6 });
    }
    return out;
  }, [dated, y0, y1, lanes.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const chosen = sel ? cases.find((k) => k.id === sel) ?? null : null;
  const companions = useMemo(() => {
    if (!chosen) return [];
    const mine = new Set(chosen.concepts);
    return cases
      .filter((k) => k.id !== chosen.id)
      .map((k) => ({ k, shared: k.concepts.filter((c) => mine.has(c)).length }))
      .filter((x) => x.shared > 0)
      .sort((a, b) => b.shared - a.shared || (a.k.year ?? 0) - (b.k.year ?? 0))
      .slice(0, 8);
  }, [chosen, cases]);
  const near = new Set(companions.map((c) => c.k.id));

  // Wide screens: the chosen case sits in a sticky column beside the list; narrow: in place under its row.
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const m = matchMedia('(min-width: 1100px)');
    const on = () => setWide(m.matches);
    on();
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, []);
  const detail = () => chosen && (
    <section className="case-explorer__detail" aria-labelledby="ce-detail" aria-live="polite">
      <p className="label">{laneLabel(chosen.lane)}{chosen.year ? ` · ${chosen.year}` : ''}</p>
      <h2 id="ce-detail" className="case-explorer__name"><a href={`/cases/${chosen.id}`}><i>{chosen.name}</i></a></h2>
      <p className="mono case-explorer__cite">{chosen.citation}</p>
      {chosen.verify && <p className="case-explorer__verify">Not yet verified against your materials.</p>}
      <p>{chosen.line}</p>
      {chosen.concepts.length > 0 && (
        <>
          <h3 className="case-explorer__h">Used in</h3>
          <ul className="case-explorer__links">
            {chosen.concepts.map((c) => concepts[c] && <li key={c}><a href={concepts[c].href}>{concepts[c].title}</a></li>)}
          </ul>
        </>
      )}
      {companions.length > 0 && (
        <>
          <h3 className="case-explorer__h">Taught alongside</h3>
          <ul className="case-explorer__links">
            {companions.map(({ k, shared }) => (
              <li key={k.id}>
                <button type="button" className="case-explorer__pick" onClick={() => setSel(k.id)}><i>{k.name}</i></button>
                <span className="case-explorer__meta"> · {k.year ?? 'year not given'} · {shared} shared {shared === 1 ? 'concept' : 'concepts'}</span>
              </li>
            ))}
          </ul>
        </>
      )}
      <button type="button" className="btn btn--ghost btn--sm" onClick={() => setSel(null)}>Close</button>
    </section>
  );

  const toggleLane = (l: Lane) => setHidden((h) => { const n = new Set(h); n.has(l) ? n.delete(l) : n.add(l); return n; });
  const laneLabel = (l: Lane) => LANES.find((x) => x.id === l)!.label;

  return (
    <div className="case-explorer">
      <div className="case-explorer__controls">
        <div className="case-explorer__chips" role="group" aria-label="Unit">
          <button type="button" className="chip" aria-pressed={unit === 'all'} onClick={() => setUnit('all')}>All units</button>
          {units.map((u) => (
            <button key={u.id} type="button" className="chip" aria-pressed={unit === u.id} onClick={() => setUnit(u.id)}>{u.code}</button>
          ))}
        </div>
        <label className="case-explorer__search">
          <span className="visually-hidden">Search cases</span>
          <input type="search" placeholder="Search names, citations, ratios" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
      </div>
      <div className="case-explorer__chips" role="group" aria-label="Courts shown">
        {lanes.map((l) => (
          <button key={l.id} type="button" className="chip" aria-pressed={!hidden.has(l.id)} onClick={() => toggleLane(l.id)} title={l.label}>{l.short}</button>
        ))}
      </div>

      <p className="case-explorer__count" aria-live="polite">{shown.length} {shown.length === 1 ? 'case' : 'cases'}{dated.length < shown.length ? ` · ${shown.length - dated.length} without a year in the materials` : ''}</p>

      <div className="case-explorer__scroll">
        <svg className="case-explorer__svg" viewBox={`0 0 ${W} ${H}`} aria-hidden="true" data-has-sel={chosen ? '' : undefined}>
          {lanes.map((l, i) => (
            <g key={l.id} className="case-explorer__lane" data-off={hidden.has(l.id) || undefined}>
              <line x1={PAD_L} x2={W - PAD_R} y1={PAD_T + i * LANE_H + LANE_H / 2} y2={PAD_T + i * LANE_H + LANE_H / 2} />
              <text x={PAD_L - 10} y={PAD_T + i * LANE_H + LANE_H / 2 + 4} textAnchor="end">{l.short}</text>
            </g>
          ))}
          {ticks.map((t) => (
            <text key={t} className="case-explorer__tick" x={x(t)} y={H - 6} textAnchor="middle">{t}</text>
          ))}
          {split && <line className="case-explorer__break" x1={x(SPLIT)} x2={x(SPLIT)} y1={PAD_T - 8} y2={H - 20} />}
          {chosen && pos.get(chosen.id) && companions.filter((c) => pos.get(c.k.id)).map((c) => {
            const a = pos.get(chosen.id)!, b = pos.get(c.k.id)!;
            return <line key={c.k.id} className="case-explorer__link" x1={a.cx} y1={a.cy} x2={b.cx} y2={b.cy} />;
          })}
          {dated.map((k) => {
            const p = pos.get(k.id)!;
            const state = k.id === sel ? 'sel' : near.has(k.id) ? 'near' : undefined;
            return (
              <circle key={k.id} className="case-explorer__dot" data-state={state} cx={p.cx} cy={p.cy} r={state === 'sel' ? 6 : 4} onClick={() => setSel(k.id === sel ? null : k.id)}>
                <title>{`${k.name} (${k.year})`}</title>
              </circle>
            );
          })}
        </svg>
      </div>


      <div className="case-explorer__body">
        <div className="case-explorer__groups">
          {lanes.filter((l) => !hidden.has(l.id)).map((l) => {
            const rows = shown.filter((k) => k.lane === l.id);
            if (!rows.length) return null;
            return (
              <section key={l.id} className="case-explorer__group" aria-labelledby={`ce-${l.id}`}>
                <h2 id={`ce-${l.id}`} className="case-explorer__lane-h">{l.label} <span className="mono case-explorer__n">{rows.length}</span></h2>
                <ol className="case-explorer__list">
                  {rows.map((k) => (
                    <li key={k.id} data-sel={k.id === sel || undefined}>
                      <span className="mono case-explorer__year">{k.year ?? '—'}</span>
                      <button type="button" className="case-explorer__pick" aria-pressed={k.id === sel} onClick={() => setSel(k.id === sel ? null : k.id)}><i>{k.name}</i></button>
                      <a className="case-explorer__open" href={`/cases/${k.id}`} aria-label={`Open ${k.name}`}>Open</a>
                      {!wide && k.id === sel && <div className="case-explorer__inline">{detail()}</div>}
                    </li>
                  ))}
                </ol>
              </section>
            );
          })}
        </div>
        {wide && chosen && <aside className="case-explorer__aside">{detail()}</aside>}
      </div>
    </div>
  );
}
