// Fact layers on the full prompt (features 44, 81, 82, 89): every annotated excerpt is marked; independent toggles
// add layers — essential vs background (shaded vs faded), conduct vs mental state (solid vs wavy underline, each with
// a small "act" / "mind" label, so never colour alone), harm, timing (also laid out as a small horizontal sequence)
// and parties (chips with roles; pointing at or focusing a party picks out the excerpts that mention them). Choosing
// an excerpt opens its annotation in place. Unannotated text stays plain.
import { Fragment, useMemo, useState } from 'react';
import type { Fact, FactKind } from '../../lib/aids';
import { mentions, type Issue, type Party, type Piece } from '../../lib/problem';

type Layer = 'weight' | 'act' | 'harm' | 'timing' | 'parties';

interface Props { paras: Piece[][]; facts: Fact[]; order: number[]; parties: Party[]; issues: Issue[] }

const KIND: Record<FactKind, string> = {
  party: 'party', conduct: 'conduct', mental: 'mental state', harm: 'harm', relationship: 'relationship',
  timing: 'timing', statement: 'statement', context: 'context',
};

export default function FactLayers({ paras, facts, order, parties, issues }: Props) {
  const [on, setOn] = useState<Set<Layer>>(() => new Set<Layer>(['weight', 'parties']));
  const [pinned, setPinned] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const active = hover ?? pinned;
  const has = (l: Layer) => on.has(l);

  const count = (kinds: FactKind[]) => facts.filter((f) => kinds.includes(f.kind)).length;
  const LAYERS: { id: Layer; label: string; n: number }[] = [
    { id: 'weight', label: 'Essential vs background', n: facts.length },
    { id: 'act', label: 'Conduct vs mental state', n: count(['conduct', 'mental']) },
    { id: 'harm', label: 'Harm', n: count(['harm']) },
    { id: 'timing', label: 'Timing', n: count(['timing']) },
    { id: 'parties', label: 'Parties', n: parties.length },
  ];
  const byParty = useMemo(() => new Map(parties.map((p) => [p.name, new Set(facts.map((f, i) => (mentions(f.text, p.name) ? i : -1)).filter((i) => i >= 0))])), [parties, facts]);
  const timing = order.filter((i) => facts[i]?.kind === 'timing');
  const label = (id: string) => issues.find((i) => i.id === id)?.label ?? id;

  // The paragraph that holds the chosen excerpt's last piece gets its annotation underneath.
  const paraOf = useMemo(() => {
    const m = new Map<number, number>();
    paras.forEach((p, pi) => p.forEach((x) => { if (x.fact !== null) m.set(x.fact, pi); }));
    return m;
  }, [paras]);
  const firstPiece = useMemo(() => {
    const seen = new Set<number>();
    return paras.map((p) => p.map((x) => (x.fact !== null && !seen.has(x.fact) ? (seen.add(x.fact), true) : false)));
  }, [paras]);

  const toggle = (l: Layer) => setOn((s) => { const n = new Set(s); if (n.has(l)) n.delete(l); else n.add(l); return n; });
  const tagOf = (f: Fact) =>
    has('act') && f.kind === 'conduct' ? 'act'
      : has('act') && f.kind === 'mental' ? 'mind'
      : has('harm') && f.kind === 'harm' ? 'harm'
      : has('timing') && f.kind === 'timing' ? 'time' : null;
  const srOf = (f: Fact) => [has('weight') && f.weight, (has('act') && (f.kind === 'conduct' || f.kind === 'mental')) || (has('harm') && f.kind === 'harm') || (has('timing') && f.kind === 'timing') ? KIND[f.kind] : null].filter(Boolean).join(', ');
  const hits = active ? byParty.get(active) : undefined;

  return (
    <section className="pq-layers" aria-labelledby="pq-layers-h">
      <h2 id="pq-layers-h" className="pq-layers__h" tabIndex={-1}>The facts, in layers</h2>
      <div className="pq-layers__toggles" role="group" aria-label="Layers">
        {LAYERS.map((l) => (
          <button key={l.id} type="button" className="chip" aria-pressed={has(l.id) && l.n > 0} disabled={l.n === 0} onClick={() => toggle(l.id)}>
            {l.id === 'weight' ? l.label : `${l.label} · ${l.n}`}
          </button>
        ))}
      </div>

      {(has('weight') || has('act') || has('harm') || has('timing')) && (
        <ul className="pq-layers__legend" aria-label="Key">
          {has('weight') && <><li><span className="pq-layers__sample" data-w="essential">essential</span> shaded</li><li><span className="pq-layers__sample" data-w="background">background</span> faded</li></>}
          {has('act') && <><li><span className="pq-layers__sample" data-k="conduct"><span className="pq-layers__tag">act</span>conduct</span> solid underline</li><li><span className="pq-layers__sample" data-k="mental"><span className="pq-layers__tag">mind</span>mental state</span> wavy underline</li></>}
          {has('harm') && <li><span className="pq-layers__sample" data-k="harm"><span className="pq-layers__tag">harm</span>harm</span> double underline</li>}
          {has('timing') && <li><span className="pq-layers__sample" data-k="timing"><span className="pq-layers__tag">time</span>timing</span> dotted underline</li>}
        </ul>
      )}

      {has('parties') && parties.length > 0 && (
        <div className="pq-layers__cast">
          <ul className="pq-layers__parties" aria-label="Parties">
            {parties.map((p) => (
              <li key={p.name}>
                <button
                  type="button"
                  className="pq-layers__party"
                  aria-pressed={pinned === p.name}
                  onClick={() => setPinned((x) => (x === p.name ? null : p.name))}
                  onPointerEnter={(e) => e.pointerType === 'mouse' && setHover(p.name)}
                  onPointerLeave={() => setHover(null)}
                  onFocus={() => setHover(p.name)}
                  onBlur={() => setHover(null)}
                >
                  <span className="pq-layers__party-name">{p.name}</span>
                  <span className="pq-layers__party-role">{p.role}</span>
                </button>
              </li>
            ))}
          </ul>
          <p className="pq-layers__status" aria-live="polite">
            {active ? `${hits?.size ?? 0} ${hits?.size === 1 ? 'fact mentions' : 'facts mention'} ${active}.` : 'Point to or choose a party to pick out the facts that mention them.'}
          </p>
        </div>
      )}

      <div
        className="pq-layers__prompt"
        data-weight={has('weight') ? '' : undefined}
        data-act={has('act') ? '' : undefined}
        data-harm={has('harm') ? '' : undefined}
        data-timing={has('timing') ? '' : undefined}
        data-party={active && has('parties') ? '' : undefined}
      >
        {paras.map((p, pi) => (
          <Fragment key={pi}>
            <p>
              {p.map((piece, k) => {
                if (piece.fact === null) return <span key={k} className="pq-layers__plain">{piece.text}</span>;
                const i = piece.fact;
                const f = facts[i];
                const tag = firstPiece[pi][k] ? tagOf(f) : null;
                const sr = firstPiece[pi][k] ? srOf(f) : '';
                return (
                  <span
                    key={k}
                    className="pq-layers__x"
                    data-w={f.weight}
                    data-k={f.kind}
                    data-hit={hits?.has(i) ? '' : undefined}
                    data-sel={selected === i ? '' : undefined}
                    role="button"
                    tabIndex={0}
                    aria-expanded={selected === i}
                    onClick={() => setSelected((s) => (s === i ? null : i))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelected((s) => (s === i ? null : i)); }
                      else if (e.key === 'Escape') setSelected(null);
                    }}
                  >
                    {tag && <span className="pq-layers__tag" aria-hidden="true">{tag}</span>}
                    {piece.text}
                    {sr && <span className="visually-hidden"> ({sr})</span>}
                  </span>
                );
              })}
            </p>
            {selected !== null && paraOf.get(selected) === pi && (
              <div className="pq-layers__detail" role="region" aria-label="About this fact">
                <p className="label">{facts[selected].weight} · {KIND[facts[selected].kind]}</p>
                {facts[selected].issues.length > 0 && <p className="pq-layers__detail-issues">Bears on: {facts[selected].issues.map(label).join('; ')}</p>}
                {facts[selected].why && <p>{facts[selected].why}</p>}
                {!facts[selected].why && !facts[selected].issues.length && <p>No issue turns on this fact: it sets the scene.</p>}
                <button type="button" className="btn btn--ghost btn--sm" onClick={() => setSelected(null)}>Close</button>
              </div>
            )}
          </Fragment>
        ))}
      </div>

      {has('timing') && timing.length > 0 && (
        <figure className="pq-layers__seq">
          <figcaption className="label">Sequence</figcaption>
          <ol className="pq-layers__seq-list" tabIndex={0} aria-label="Timing facts, in order">
            {timing.map((i, n) => (
              <li key={i}>
                <span className="pq-layers__seq-n mono" aria-hidden="true">{n + 1}</span>
                <span className="pq-layers__seq-text">{facts[i].text}</span>
              </li>
            ))}
          </ol>
        </figure>
      )}
    </section>
  );
}
