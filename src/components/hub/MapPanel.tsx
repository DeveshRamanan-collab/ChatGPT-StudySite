// The knowledge map's side panel (features 53, 56, 57): opens inside the map area when a concept is focused, docked
// on the side away from it (beside the map's sticky edge on wide maps; under the map on narrow ones), so the map
// never moves. Shows the concept's one-line statement (study aid `plain`, else just its title), what it builds on,
// what needs it, what it is often confused with, related concepts, links to the concept and a quiz, and
// "What do I need first?": every prerequisite ancestor in study order (numbered to match the map).
import { useEffect, useId, useState } from 'react';
import { loadAids } from '../../lib/aids';
import type { Graph } from '../../lib/graph';

export interface MapConcept { id: string; title: string; href: string; unit: string; code: string; week: number }

interface Props {
  c: MapConcept;
  graph: Graph;
  byId: Map<string, MapConcept>;
  byUnit: boolean;
  mastery: number;
  side: 'left' | 'right';
  heading: 'h2' | 'h3';
  route: boolean;
  ancestors: string[];
  onRoute: (on: boolean) => void;
  onFocus: (id: string) => void;
  onTraceFrom: () => void;
  onClose: () => void;
}

export default function MapPanel({ c, graph, byId, byUnit, mastery, side, heading: H, route, ancestors, onRoute, onFocus, onTraceFrom, onClose }: Props) {
  const [plain, setPlain] = useState<string | null>(null);
  const hid = useId();
  useEffect(() => {
    let live = true;
    loadAids(c.unit).then((b) => { if (live) setPlain(b.aids[c.id]?.plain?.trim() || ''); });
    return () => { live = false; };
  }, [c.unit, c.id]);

  const prereqs = graph.prereqs.get(c.id) ?? [];
  const dependents = graph.dependents.get(c.id) ?? [];
  const contrasts = graph.contrasts.get(c.id) ?? [];
  const related = graph.related.get(c.id) ?? [];

  const list = (ids: string[]) => (
    <ul className="mapx-panel__list">
      {ids.map((id) => {
        const n = byId.get(id);
        return (
          <li key={id}>
            <button type="button" className="mapx-panel__link" onClick={() => onFocus(id)}>{n?.title ?? id}</button>
            {n && <span className="mapx-panel__week mono">W{n.week}</span>}
          </li>
        );
      })}
    </ul>
  );
  const section = (label: string, ids: string[]) => ids.length > 0 && (
    <section className="mapx-panel__sec" aria-label={label}>
      <p className="mapx-panel__label">{label}</p>
      {list(ids)}
    </section>
  );

  return (
    <div className="mapx__dock" data-side={side}>
      <aside className="mapx-panel" aria-labelledby={hid} data-lenis-prevent>
        <div className="mapx-panel__head">
          <p className="mapx-panel__meta mono">{byUnit ? `${c.code} · ` : ''}Week {c.week} · {Math.round(mastery * 100)}% mastery</p>
          <button type="button" className="btn btn--ghost btn--icon mapx-panel__close" aria-label="Close concept panel" onClick={onClose}>
            <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" /></svg>
          </button>
        </div>
        <H id={hid} className="mapx-panel__title">{c.title}</H>
        {plain && <p className="mapx-panel__plain">{plain}</p>}
        <div className="mapx-panel__go">
          <a className="btn btn--primary btn--sm mapx-panel__btn" href={c.href}>Open concept</a>
          <a className="btn btn--secondary btn--sm mapx-panel__btn" href={`/${c.unit}/quiz?concept=${c.id}`}>Quiz me</a>
        </div>

        <section className="mapx-panel__sec" aria-label="What do I need first?">
          {prereqs.length ? (
            <>
              <button type="button" className="chip mapx__chip" aria-pressed={route} onClick={() => onRoute(!route)}>What do I need first?</button>
              {route && (
                <ol className="mapx-panel__steps">
                  {ancestors.map((id) => {
                    const n = byId.get(id);
                    return <li key={id}><a href={n?.href}>{n?.title ?? id}</a> <span className="mapx-panel__week mono">W{n?.week}</span></li>;
                  })}
                  <li className="mapx-panel__here">{c.title} <span className="mapx-panel__week">(this one)</span></li>
                </ol>
              )}
            </>
          ) : <p className="mapx-panel__note">Nothing in the notes comes before this one.</p>}
        </section>

        {section('Builds on', prereqs)}
        {section('Needed for', dependents)}
        {section('Often confused with', contrasts)}
        {related.length > 0 && (
          <details className="mapx-panel__more">
            <summary>Related ({related.length})</summary>
            {list(related)}
          </details>
        )}
        {!prereqs.length && !dependents.length && !contrasts.length && !related.length && <p className="mapx-panel__note">No links to other concepts in the notes yet.</p>}

        <p className="mapx-panel__trace">
          <button type="button" className="btn btn--ghost btn--sm mapx-panel__btn" onClick={onTraceFrom}>Trace a route from here</button>
        </p>
      </aside>
    </div>
  );
}
