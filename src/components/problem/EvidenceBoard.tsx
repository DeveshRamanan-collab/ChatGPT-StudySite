// Element-and-evidence board (features 85, 86): a column per issue, in answer order; each column lists the issue's
// requirements (its concept's study-aid elements, or the issue itself) as rows, and the facts tagged with that issue
// as cards waiting to be placed. Drag a card onto the requirement it proves, or use "Move to…" (keyboard and touch).
// A row with nothing under it reads "No support yet": the proof is not there. Placements save on this device
// (Dexie settings, `board:<questionId>`).
import { useEffect, useMemo, useRef, useState, type DragEvent } from 'react';
import type { Fact } from '../../lib/aids';
import { db } from '../../lib/db';
import { buildBoard, cardIssue, cardKey, cleanBoard, place, supportOf, type BoardState, type Issue, type Requirement } from '../../lib/problem';

interface Props { qid: string; issues: Issue[]; facts: Fact[]; order: number[]; requirements: Record<string, Requirement[]> }

const TRAY = 'tray';

export default function EvidenceBoard({ qid, issues, facts, order, requirements }: Props) {
  const columns = useMemo(() => buildBoard(issues, facts, order, requirements), [issues, facts, order, requirements]);
  const [state, setState] = useState<BoardState>({ placed: {} });
  const [open, setOpen] = useState<string | null>(null);
  const [over, setOver] = useState<string | null>(null);
  const [fresh, setFresh] = useState<string | null>(null);
  const [focusKey, setFocusKey] = useState<string | null>(null);
  const [fine, setFine] = useState(false);
  const [note, setNote] = useState('');
  const dragging = useRef<string | null>(null);
  const touched = useRef(false);
  const rootRef = useRef<HTMLElement>(null);
  const key = `board:${qid}`;

  useEffect(() => {
    let live = true;
    db.settings.get(key).then((r) => { if (live && !touched.current) setState(cleanBoard(r?.value, columns)); }).catch(() => {});
    const m = matchMedia('(hover: hover) and (pointer: fine)');
    const sync = () => setFine(m.matches);
    sync();
    m.addEventListener('change', sync);
    return () => { live = false; m.removeEventListener('change', sync); };
  }, [key, columns]);

  // After a move, keyboard focus follows the card to its new place.
  useEffect(() => {
    if (!focusKey) return;
    rootRef.current?.querySelector<HTMLElement>(`[data-card="${CSS.escape(focusKey)}"] .pq-board__move`)?.focus();
    setFocusKey(null);
  }, [focusKey]);

  // Close an open "Move to…" list on a click elsewhere.
  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => { if (!(e.target as HTMLElement).closest?.(`[data-card="${CSS.escape(open)}"]`)) setOpen(null); };
    document.addEventListener('pointerdown', away);
    return () => document.removeEventListener('pointerdown', away);
  }, [open]);

  const move = (card: string, row: string | null, refocus = false) => {
    const next = place(state, card, row);
    if (next === state) return;
    touched.current = true;
    setState(next);
    setOpen(null);
    setFresh(card);
    if (refocus) setFocusKey(card);
    db.settings.put({ key, value: next }).then(() => setNote(''), () => setNote('Not saved: storage is unavailable in this window.'));
  };
  const clear = () => {
    touched.current = true;
    setState({ placed: {} });
    db.settings.put({ key, value: { placed: {} } }).catch(() => {});
  };

  const { rows, tray } = supportOf(columns, state);
  const placedCount = Object.keys(state.placed).length;

  const dropProps = (issueId: string, row: string) => ({
    'data-over': over === row ? '' : undefined,
    onDragOver: (e: DragEvent) => {
      if (!dragging.current || cardIssue(dragging.current) !== issueId) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      if (over !== row) setOver(row);
    },
    onDragLeave: (e: DragEvent) => { if (!(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)) setOver((o) => (o === row ? null : o)); },
    onDrop: (e: DragEvent) => {
      e.preventDefault();
      const card = dragging.current;
      dragging.current = null;
      setOver(null);
      if (card) move(card, row.startsWith(`${TRAY}:`) ? null : row);
    },
  });

  const card = (issueId: string, f: number, reqs: Requirement[], here: string | null) => {
    const k = cardKey(issueId, f);
    const isOpen = open === k;
    return (
      <li
        key={k}
        className="pq-board__fact"
        data-card={k}
        data-fresh={fresh === k ? '' : undefined}
        draggable={fine}
        onDragStart={(e) => { dragging.current = k; e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', facts[f].text); setOpen(null); }}
        onDragEnd={() => { dragging.current = null; setOver(null); }}
        onKeyDown={(e) => { if (e.key === 'Escape' && isOpen) { e.stopPropagation(); setOpen(null); setFocusKey(k); } }}
      >
        <p className="pq-board__quote">{facts[f].text}</p>
        <button type="button" className="pq-board__move" aria-expanded={isOpen} aria-controls={`pq-menu-${k}`} onClick={() => setOpen(isOpen ? null : k)}>
          Move to…
        </button>
        {isOpen && (
          <ul className="pq-board__menu" id={`pq-menu-${k}`} aria-label="Move this fact to">
            {reqs.map((r) => (
              <li key={r.key}>
                <button type="button" className="pq-board__menu-item" aria-current={here === r.key ? 'true' : undefined} disabled={here === r.key} onClick={() => move(k, r.key, true)}>{r.name}</button>
              </li>
            ))}
            {here && (
              <li><button type="button" className="pq-board__menu-item" onClick={() => move(k, null, true)}>Back to facts to place</button></li>
            )}
          </ul>
        )}
      </li>
    );
  };

  return (
    <section className="pq-board" ref={rootRef} aria-labelledby="pq-board-h">
      <h2 id="pq-board-h">Elements and evidence</h2>
      <p className="pq-board__lede">
        Each issue's requirements, in the order an answer takes them. {fine ? 'Drag' : 'Move'} each fact onto the requirement it proves{fine ? ', or use Move to…' : ' with Move to…'}.
        A requirement with nothing under it is not proved yet.
      </p>
      <div className="pq-board__cols">
        {columns.map((col, ci) => {
          const supported = col.requirements.filter((r) => rows[r.key]?.length).length;
          const waiting = tray[col.issue.id] ?? [];
          return (
            <section key={col.issue.id} className="pq-board__col" aria-labelledby={`pq-col-${col.issue.id}`}>
              <header className="pq-board__head">
                <span className="pq-board__n mono" aria-hidden="true">{ci + 1}</span>
                <h3 id={`pq-col-${col.issue.id}`} className="pq-board__title">{col.issue.label}</h3>
              </header>
              <p className="pq-board__count">{supported} of {col.requirements.length} {col.requirements.length === 1 ? 'requirement' : 'requirements'} supported</p>

              <div className="pq-board__tray" {...dropProps(col.issue.id, `${TRAY}:${col.issue.id}`)}>
                <p className="label">Facts to place · {waiting.length}</p>
                {waiting.length > 0 ? (
                  <ul className="pq-board__cards">{waiting.map((f) => card(col.issue.id, f, col.requirements, null))}</ul>
                ) : (
                  <p className="pq-board__quiet">{col.facts.length ? 'All placed.' : 'No fact is tagged with this issue.'}</p>
                )}
              </div>

              <ol className="pq-board__rows">
                {col.requirements.map((r) => {
                  const here = rows[r.key] ?? [];
                  return (
                    <li key={r.key} className="pq-board__row" data-empty={here.length ? undefined : ''} {...dropProps(col.issue.id, r.key)}>
                      <p className="pq-board__req">{r.name}</p>
                      {r.test && <p className="pq-board__test">{r.test}</p>}
                      {here.length > 0 ? (
                        <ul className="pq-board__cards">{here.map((f) => card(col.issue.id, f, col.requirements, r.key))}</ul>
                      ) : (
                        <p className="pq-board__none">No support yet</p>
                      )}
                    </li>
                  );
                })}
              </ol>
            </section>
          );
        })}
      </div>
      <div className="pq-board__foot">
        <p className="pq-board__saved" aria-live="polite">{note || 'Placements save on this device.'}</p>
        <button type="button" className="btn btn--ghost btn--sm" onClick={clear} disabled={placedCount === 0}>Clear the board</button>
      </div>
    </section>
  );
}
