// Annotated statutory structure (/statutes, feature 88): every statute, treaty and article provision in the
// authorities collection, grouped by instrument with its provisions in numeric order. Each provision shows its plain
// gloss (text on request), the cases that applied it, the concepts that cite it, and the provisions of the same
// instrument it refers to or is referred to by (links within the page). Filter by unit and search; a ?unit= link
// arrives pre-filtered (the page's inline script hides other units before paint, so nothing shifts on hydration).
import { useEffect, useMemo, useState, type MouseEvent } from 'react';
import { matchesQuery } from '../../lib/legal';
import '../../styles/legal.css';

export interface StatuteProvision {
  id: string;
  label: string | null;
  heading: string | null;
  gloss: string;
  text: string;
  units: string[];
  verify: boolean;
  cases: { id: string; name: string }[];
  concepts: { title: string; href: string }[];
  refersTo: string[];
  referredBy: string[];
}
export interface StatuteInstrument { name: string; slug: string; units: string[]; provisions: StatuteProvision[] }
interface Props { instruments: StatuteInstrument[]; units: { id: string; code: string }[] }

const WHOLE = 'Whole instrument';
const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

export default function StatuteMap({ instruments, units }: Props) {
  const [unit, setUnit] = useState('all');
  const [q, setQ] = useState('');
  const [arrived, setArrived] = useState<string | null>(null);
  const [jumpTo, setJumpTo] = useState<{ id: string; at: number } | null>(null);

  // A ?unit= link: take over from the pre-paint filter (same result, so nothing moves), then drop the page attribute.
  useEffect(() => {
    const u = new URLSearchParams(location.search).get('unit');
    if (u && units.some((x) => x.id === u)) setUnit(u);
    delete document.documentElement.dataset.statuteUnit;
  }, [units]);

  const labelOf = useMemo(() => {
    const m = new Map<string, string>();
    for (const i of instruments) for (const p of i.provisions) m.set(p.id, p.label ?? WHOLE);
    return m;
  }, [instruments]);
  const haystack = useMemo(() => {
    const m = new Map<string, string>();
    for (const i of instruments) for (const p of i.provisions) {
      m.set(p.id, [i.name, p.label, p.heading, p.gloss, p.text, ...p.cases.map((c) => c.name), ...p.concepts.map((c) => c.title)].filter(Boolean).join(' \n '));
    }
    return m;
  }, [instruments]);

  const total = useMemo(() => instruments.reduce((n, i) => n + i.provisions.length, 0), [instruments]);
  const shown = useMemo(
    () => instruments
      .map((i) => ({ ...i, provisions: i.provisions.filter((p) => (unit === 'all' || p.units.includes(unit)) && matchesQuery(haystack.get(p.id)!, q)) }))
      .filter((i) => i.provisions.length),
    [instruments, unit, q, haystack],
  );
  const visible = useMemo(() => new Set(shown.flatMap((i) => i.provisions.map((p) => p.id))), [shown]);
  const count = shown.reduce((n, i) => n + i.provisions.length, 0);
  const filtered = unit !== 'all' || q.trim() !== '';

  // After a cross-reference click (and any filter reset it needed), bring the provision into view and focus it.
  useEffect(() => {
    if (!jumpTo) return;
    const el = document.getElementById(`p-${jumpTo.id}`);
    if (!el) return;
    el.scrollIntoView({ block: 'start' });
    el.focus({ preventScroll: true });
    history.replaceState(history.state, '', `${location.pathname}${location.search}#p-${jumpTo.id}`);
    setArrived(null);
    const raf = requestAnimationFrame(() => setArrived(jumpTo.id));
    return () => cancelAnimationFrame(raf);
  }, [jumpTo]);

  const go = (e: MouseEvent, id: string) => {
    e.preventDefault();
    if (!visible.has(id)) { setQ(''); setUnit('all'); }
    setJumpTo({ id, at: performance.now() });
  };
  const clear = () => { setQ(''); setUnit('all'); };

  return (
    <div className="statute-map">
      <div className="statute-map__bar">
        <ul className="statute-map__units" aria-label="Filter by unit">
          {[{ id: 'all', code: 'All units' }, ...units].map((u) => (
            <li key={u.id}>
              <button type="button" className="chip statute-map__unit" aria-pressed={unit === u.id} onClick={() => setUnit(u.id)}>{u.code}</button>
            </li>
          ))}
        </ul>
        <label className="visually-hidden" htmlFor="statute-search">Search provisions</label>
        <input
          id="statute-search"
          className="statute-map__search"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search provisions, glosses, cases"
          autoComplete="off"
          spellCheck={false}
        />
        <p className="statute-map__count" aria-live="polite" data-statute-count>
          {filtered ? `Showing ${count} of ${plural(total, 'provision')}, in ${plural(shown.length, 'instrument')}.` : `${plural(total, 'provision')} in ${plural(instruments.length, 'instrument')}.`}
        </p>
      </div>

      {shown.length > 1 && (
        <details className="statute-map__index">
          <summary>Jump to an instrument</summary>
          <ol>{shown.map((i) => <li key={i.slug}><a href={`#i-${i.slug}`}>{i.name}</a></li>)}</ol>
        </details>
      )}

      {!shown.length && (
        <div className="statute-map__empty" data-statute-empty>
          <p>Nothing matches{q.trim() ? ` “${q.trim()}”` : ''}{unit !== 'all' ? ` in ${units.find((u) => u.id === unit)?.code ?? unit}` : ''}.</p>
          <button type="button" className="btn btn--secondary btn--sm" onClick={clear}>Show everything</button>
        </div>
      )}

      {shown.map((inst) => (
        <section key={inst.slug} id={`i-${inst.slug}`} className="statute-map__inst" aria-labelledby={`h-${inst.slug}`} data-statute-units={inst.units.join(' ')}>
          <h2 id={`h-${inst.slug}`} className="statute-map__inst-name">{inst.name}</h2>
          <p className="statute-map__inst-meta">
            {plural(inst.provisions.length, 'provision')}
            {inst.units.length > 0 && <> · {inst.units.map((u) => units.find((x) => x.id === u)?.code ?? u.toUpperCase()).join(' · ')}</>}
          </p>
          {inst.provisions.length > 1 && (
            <ol className="statute-map__strip" aria-label={`Provisions of ${inst.name}, in order`}>
              {inst.provisions.map((p) => (
                <li key={p.id} data-statute-units={p.units.join(' ')}>
                  <a className="statute-map__strip-link" href={`#p-${p.id}`} onClick={(e) => go(e, p.id)} data-linked={p.refersTo.length || p.referredBy.length ? '' : undefined}>
                    {p.label ?? WHOLE}
                  </a>
                </li>
              ))}
            </ol>
          )}
          <ol className="statute-map__provs">
            {inst.provisions.map((p) => (
              <li key={p.id} data-statute-units={p.units.join(' ')}>
                <ProvisionCard p={p} labelOf={labelOf} go={go} arrived={arrived === p.id} />
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}

function ProvisionCard({ p, labelOf, go, arrived }: { p: StatuteProvision; labelOf: Map<string, string>; go: (e: MouseEvent, id: string) => void; arrived: boolean }) {
  const refs = (ids: string[]) => ids.map((id) => (
    <a key={id} className="chip statute-prov__ref" href={`#p-${id}`} onClick={(e) => go(e, id)}>{labelOf.get(id)}</a>
  ));
  return (
    <article id={`p-${p.id}`} className="statute-prov" tabIndex={-1} aria-labelledby={`ph-${p.id}`} data-arrived={arrived ? '' : undefined}>
      <h3 id={`ph-${p.id}`} className="statute-prov__head">
        <span className="statute-prov__num">{p.label ?? WHOLE}</span>
        {p.heading && <span className="statute-prov__heading">{p.heading}</span>}
      </h3>
      {p.verify && <p className="legal-check">Not yet verified against your materials.</p>}
      <p className="statute-prov__gloss">{p.gloss}</p>
      {p.text && <ProvisionText text={p.text} />}
      {(p.cases.length > 0 || p.concepts.length > 0 || p.refersTo.length > 0 || p.referredBy.length > 0) && (
        <dl className="statute-prov__rel">
          {p.cases.length > 0 && (
            <div><dt>Applied in</dt><dd>{p.cases.map((c) => <a key={c.id} className="chip chip--case" href={`/cases/${c.id}`}>{c.name}</a>)}</dd></div>
          )}
          {p.concepts.length > 0 && (
            <div><dt>Cited by</dt><dd>{p.concepts.map((c) => <a key={c.href} className="statute-prov__concept" href={c.href}>{c.title}</a>)}</dd></div>
          )}
          {p.refersTo.length > 0 && <div data-rel="to"><dt>Refers to</dt><dd>{refs(p.refersTo)}</dd></div>}
          {p.referredBy.length > 0 && <div data-rel="from"><dt>Referred to by</dt><dd>{refs(p.referredBy)}</dd></div>}
        </dl>
      )}
      <p className="statute-prov__more"><a href={`/authorities/${p.id}`}>Full entry</a></p>
    </article>
  );
}

/** The provision's text, rendered only once opened (keeps the page's HTML to the glosses). */
function ProvisionText({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <details className="statute-prov__text" onToggle={(e) => setOpen(e.currentTarget.open)}>
      <summary>Text</summary>
      {open && <p>{text}</p>}
    </details>
  );
}
