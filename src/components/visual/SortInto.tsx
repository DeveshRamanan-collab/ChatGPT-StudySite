// Sort (feature 99): key terms (glosses hidden) sorted into the concept they belong to, with 2–3 concepts of the
// same week as labelled bins. Mouse and pen drag a term onto a bin; touch and keyboard choose a term, then a bin's
// "Put here" button. "Check" marks every term Right / Not this one and shows its gloss as the reason; "Show answer"
// moves every term to its own bin. The first Check records one attempt per concept in the round
// (`visual:sort:<concept>`, score = share of that concept's terms sorted right, mode 'visual').
import { useEffect, useMemo, useRef, useState } from 'react';
import { hashString } from '../../lib/flow';
import { recordAttempt } from '../../lib/learning';
import { byConcept, checkSorted, sortRound, visualId, type SortItem, type SortRound } from '../../lib/visual';
import { Mark, useTileDrag } from './LabelDrag';
import type { PanelProps } from './VisualPractice';

export default function SortInto(p: PanelProps) {
  const [round, setRound] = useState(0);
  const r = useMemo(() => sortRound(p.aids, hashString(p.week.id) + round * 7919), [p.aids, p.week.id, round]);
  if (!r) return null;
  return <SortBoard key={round} r={r} {...p} onAgain={() => setRound((n) => n + 1)} />;
}

function SortBoard({ r, unit, week, concepts, onAgain }: PanelProps & { r: SortRound; onAgain: () => void }) {
  const [placed, setPlaced] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [marks, setMarks] = useState<Record<string, boolean> | null>(null);
  const [shown, setShown] = useState(false);
  const [status, setStatus] = useState('');
  const recorded = useRef(false);
  const started = useRef(0);
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => { started.current = performance.now(); }, []);

  const byId = useMemo(() => new Map(r.items.map((it) => [it.id, it])), [r.items]);
  const title = (c: string) => concepts[c]?.title ?? c;
  const term = (id: string) => `“${byId.get(id)?.term ?? ''}”`;

  const put = (item: string, target: string) => {
    if (target === 'tray') {
      setPlaced((p) => { const n = { ...p }; delete n[item]; return n; });
      setStatus(`${term(item)} is back with the terms.`);
    } else {
      const c = target.replace('bin:', '');
      setPlaced((p) => ({ ...p, [item]: c }));
      setStatus(`${term(item)} sorted into ${title(c)}.`);
    }
    setSelected(null);
    setMarks(null);
    setShown(false);
  };
  const { drag, bind, consumeClick, styleFor } = useTileDrag(root, put);

  const choose = (id: string) => {
    if (consumeClick()) return;
    if (selected === id) { setSelected(null); setStatus(''); return; }
    setSelected(id);
    setStatus(`${term(id)} chosen. Now choose its concept.`);
  };
  const intoBin = (c: string) => {
    if (selected) put(selected, `bin:${c}`);
    else setStatus('Choose a term first, then its concept.');
  };

  const check = () => {
    const m = checkSorted(placed, r.items);
    setMarks(m);
    setShown(false);
    setSelected(null);
    const right = Object.values(m).filter(Boolean).length;
    setStatus(right === r.items.length ? 'All sorted right.' : `${right} of ${r.items.length} sorted right.`);
    if (recorded.current) return;
    recorded.current = true;
    const ms = Math.round(performance.now() - started.current);
    for (const [c, { right: ok, total }] of byConcept(r.items, m)) {
      recordAttempt({
        questionId: visualId('sort', c), unit, concept: c, week: week.id, type: 'match',
        answer: r.items.filter((it) => it.concept === c).map((it) => ({ term: it.term, placed: placed[it.id] ?? null })),
        correct: null, score: ok / total, mode: 'visual', durationMs: ms,
      }).catch((e) => console.warn(e));
    }
  };
  const reveal = () => {
    setPlaced(Object.fromEntries(r.items.map((it) => [it.id, it.concept])));
    setMarks(Object.fromEntries(r.items.map((it) => [it.id, true])));
    setShown(true);
    setSelected(null);
    setStatus('Every term is in its own concept.');
  };

  const tray = r.items.filter((it) => !placed[it.id]);
  const placedSelected = !!selected && !!placed[selected];
  const item = (it: SortItem) => {
    const mark = marks?.[it.id];
    return (
      <li key={it.id} className="vis-sort__entry" data-mark={mark === undefined ? undefined : mark ? 'right' : 'wrong'}>
        <button
          type="button"
          className="vis-tile"
          data-cursor="drag"
          data-dragging={drag?.id === it.id || undefined}
          aria-pressed={selected === it.id}
          style={styleFor(it.id)}
          onClick={() => choose(it.id)}
          {...bind(it.id)}
        >
          {it.term}
        </button>
        {mark !== undefined && (
          <span className="vis-sort__reason">
            <Mark ok={mark} wrongWord={placed[it.id] ? 'Not this one' : 'Not sorted'} className="vis-sort__mark" />
            {it.gloss && <span className="vis-sort__gloss">{it.gloss}</span>}
          </span>
        )}
      </li>
    );
  };

  return (
    <div className="vis-sort" ref={root} data-selecting={selected ? '' : undefined} onKeyDown={(e) => { if (e.key === 'Escape' && selected) { setSelected(null); setStatus(''); } }}>
      <section className="vis-sort__tray" aria-label="Terms to sort" data-drop="tray" data-over={drag?.over === 'tray' || undefined}>
        <div className="vis-label__tray-head">
          <span className="vis-label__tray-label">Terms <span className="mono">{tray.length}</span></span>
          {placedSelected && <button type="button" className="btn btn--ghost btn--sm" onClick={() => put(selected!, 'tray')}>Back to the terms</button>}
        </div>
        {tray.length ? <ul className="vis-sort__items">{tray.map(item)}</ul> : <p className="vis-label__done">Every term is sorted.</p>}
      </section>

      <div className="vis-sort__bins" data-n={r.bins.length}>
        {r.bins.map((c) => {
          const inBin = r.items.filter((it) => placed[it.id] === c);
          return (
            <section key={c} className="vis-sort__bin" aria-label={title(c)} data-drop={`bin:${c}`} data-over={drag?.over === `bin:${c}` || undefined}>
              <button type="button" className="vis-sort__bin-head" onClick={() => intoBin(c)} aria-label={selected ? `Put ${term(selected)} in ${title(c)}` : `${title(c)}: choose a term first`}>
                <span className="vis-sort__bin-title">{title(c)}</span>
                <span className="vis-sort__bin-hint" aria-hidden="true">{selected ? 'Put here' : <span className="mono">{inBin.length}</span>}</span>
              </button>
              {inBin.length ? <ul className="vis-sort__items">{inBin.map(item)}</ul> : <p className="vis-sort__empty">Nothing here yet.</p>}
            </section>
          );
        })}
      </div>

      <p className="vis__status" aria-live="polite">{status || ' '}</p>
      <div className="vis__actions">
        <button type="button" className="btn btn--primary" onClick={check} disabled={tray.length === r.items.length}>Check</button>
        <button type="button" className="btn btn--ghost" onClick={reveal}>Show answer</button>
        <button type="button" className="btn btn--ghost" onClick={onAgain}>New round</button>
      </div>
      {shown && (
        <p className="vis__note">
          Revisit:{' '}
          {r.bins.map((c, i) => <span key={c}>{i > 0 && ' · '}{concepts[c] ? <a href={concepts[c].href}>{title(c)}</a> : title(c)}</span>)}
        </p>
      )}
    </div>
  );
}
