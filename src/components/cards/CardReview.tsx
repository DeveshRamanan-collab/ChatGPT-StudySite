// Daily flashcard queue on FSRS: due cards first, then up to 20 new a day, interleaved by week.
// Show answer (Space) flips the card in 3D (full), fades (calm/off); grade with 1–4. Cloze, apply, occlusion
// (click a mask to reveal it) and the student's own cards (rubric gaps, sentence-to-card) share one queue.
// Suspend and edit in place; Anki CSV export; per-deck FSRS optimisation once a deck has 400 reviews.
import { useEffect, useMemo, useRef, useState } from 'react';
import { db, type CardState, type CardEdit, type CustomCard } from '../../lib/db';
import { review, previews, retentionFor, optimise, ankiCsv, renderCloze, Rating, DAY, OPTIMISE_AFTER } from '../../lib/fsrs';
import { dayKey } from '../../lib/selectors';
import type { Grade } from 'ts-fsrs';

export const NEW_PER_DAY = 20;

type Mask = { x: number; y: number; w: number; h: number; label: string };
export interface DeckCard {
  id: string; unit: string; concept: string; week?: string; type: 'basic' | 'cloze' | 'apply' | 'occlusion';
  front?: string; back?: string; text?: string; scenario?: string; answer?: string; image?: string; masks?: Mask[]; source?: string; custom?: boolean;
}
interface Deck { unit: string; code: string; examDate: number; concepts: Record<string, { title: string; href: string; week?: string }>; cards: DeckCard[] }

const GRADES: { g: Grade; label: string; key: string }[] = [
  { g: Rating.Again as Grade, label: 'Again', key: '1' },
  { g: Rating.Hard as Grade, label: 'Hard', key: '2' },
  { g: Rating.Good as Grade, label: 'Good', key: '3' },
  { g: Rating.Easy as Grade, label: 'Easy', key: '4' },
];

function fromCustom(c: CustomCard): DeckCard {
  if (c.type === 'occlusion') return { id: c.id, unit: c.unit, concept: c.concept, type: 'occlusion', image: c.image, masks: c.masks, source: c.source, custom: true };
  return c.type === 'cloze'
    ? { id: c.id, unit: c.unit, concept: c.concept, type: 'cloze', text: c.front, back: c.back, source: c.source, custom: true }
    : { id: c.id, unit: c.unit, concept: c.concept, type: 'basic', front: c.front, back: c.back, source: c.source, custom: true };
}

function faces(c: DeckCard, edit?: CardEdit) {
  if (c.type === 'cloze') { const t = edit?.front ?? c.text ?? ''; return { q: renderCloze(t, false), a: renderCloze(t, true), extra: edit?.back ?? c.back }; }
  if (c.type === 'apply') return { q: edit?.front ?? c.scenario ?? '', a: edit?.back ?? c.answer ?? '' };
  if (c.type === 'occlusion') return { q: 'Name each hidden label.', a: (c.masks ?? []).map((m) => m.label).join(' · ') };
  return { q: edit?.front ?? c.front ?? '', a: edit?.back ?? c.back ?? '' };
}

/** Build today's queue: due first (oldest first), then new cards up to the daily allowance, interleaving weeks. Exported for tests. */
export function buildQueue(cards: DeckCard[], states: Map<string, CardState>, now: number, newToday: number, concept?: string) {
  const pool = cards.filter((c) => !states.get(c.id)?.suspended && (!concept || c.concept === concept));
  const due = pool.filter((c) => states.has(c.id) && states.get(c.id)!.due <= now).sort((a, b) => states.get(a.id)!.due - states.get(b.id)!.due);
  const fresh = pool.filter((c) => !states.has(c.id));
  const byWeek = new Map<string, DeckCard[]>();
  for (const c of fresh) byWeek.set(c.week ?? '', [...(byWeek.get(c.week ?? '') ?? []), c]);
  const lanes = [...byWeek.keys()].sort().map((k) => byWeek.get(k)!);
  const interleaved: DeckCard[] = [];
  for (let i = 0; lanes.some((l) => l.length > i); i++) for (const l of lanes) if (l[i]) interleaved.push(l[i]);
  return { due, fresh: interleaved.slice(0, Math.max(0, NEW_PER_DAY - newToday)), newTotal: fresh.length };
}

function download(name: string, text: string) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type: 'text/csv;charset=utf-8' }));
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

export default function CardReview({ units }: { units: string[] }) {
  const [decks, setDecks] = useState<Deck[] | null>(null);
  const [states, setStates] = useState<Map<string, CardState>>(new Map());
  const [edits, setEdits] = useState<Map<string, CardEdit>>(new Map());
  const [custom, setCustom] = useState<DeckCard[]>([]);
  const [weights, setWeights] = useState<Record<string, number[]>>({});
  const [newToday, setNewToday] = useState(0);
  const [queue, setQueue] = useState<DeckCard[] | null>(null);
  const [done, setDone] = useState(0);
  const [shown, setShown] = useState(false);
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [editing, setEditing] = useState(false);
  const [concept, setConcept] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);
  const showBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const c = new URLSearchParams(location.search).get('concept') ?? undefined;
    setConcept(c);
    Promise.all(units.map((u) => fetch(`/data/${u}/cards.json`).then((r) => r.json() as Promise<Deck>)))
      .then(async (ds) => {
        const [st, ed, cc, sets, revs] = await Promise.all([
          db.cards.toArray(), db.cardEdits.toArray(), db.customCards.where('unit').anyOf(units).toArray(),
          db.settings.bulkGet(units.map((u) => `fsrs:w:${u}`)), db.reviews.where('at').aboveOrEqual(Date.now() - 2 * DAY).toArray(),
        ]);
        const today = dayKey(Date.now());
        setStates(new Map(st.map((s) => [s.cardId, s])));
        setEdits(new Map(ed.map((e) => [e.cardId, e])));
        setCustom(cc.map(fromCustom));
        setWeights(Object.fromEntries(units.map((u, i) => [u, sets[i]?.value as number[]]).filter(([, w]) => w)));
        setNewToday(revs.filter((r) => r.state === 0 && dayKey(r.at) === today && units.includes(r.deck)).length);
        setDecks(ds);
      })
      .catch((e) => setError(String(e)));
  }, [units.join(',')]);

  const all = useMemo(() => [...(decks ?? []).flatMap((d) => d.cards), ...custom], [decks, custom]);
  const deckOf = useMemo(() => new Map((decks ?? []).map((d) => [d.unit, d])), [decks]);

  // Queue is fixed at load so grading does not reshuffle what is on screen; Again cards return at the end.
  useEffect(() => {
    if (!decks || queue) return;
    const q = buildQueue(all, states, Date.now(), newToday, concept);
    setQueue([...q.due, ...q.fresh]);
  }, [decks, all, states, newToday, concept, queue]);

  const card = queue?.[0];
  const deck = card ? deckOf.get(card.unit) : undefined;
  const now = Date.now();
  const opts = card ? { retention: retentionFor(deck?.examDate, now), w: weights[card.unit], examDate: deck?.examDate } : {};
  const pv = card && shown ? previews(states.get(card.id), now, opts) : null;

  async function grade(g: Grade) {
    if (!card || !shown) return;
    const t = Date.now();
    const prev = states.get(card.id);
    const { state, log } = review(card.id, card.unit, prev, g, t, opts);
    setStates((m) => new Map(m).set(card.id, state));
    if (!prev) setNewToday((n) => n + 1);
    setShown(false); setRevealed(new Set()); setEditing(false);
    setDone((n) => n + 1);
    // Again (or anything due again within this sitting) goes to the back of today's queue.
    setQueue((q) => { const rest = (q ?? []).slice(1); return state.due - t < 30 * 60_000 ? [...rest, card] : rest; });
    await db.transaction('rw', db.cards, db.reviews, db.settings, async () => {
      await db.cards.put(state);
      await db.reviews.add(log);
      const n = await db.reviews.where('deck').equals(card.unit).count();
      if (n >= OPTIMISE_AFTER && n % 100 === 0) {
        const o = optimise(await db.reviews.where('deck').equals(card.unit).toArray());
        if (o) { await db.settings.put({ key: `fsrs:w:${card.unit}`, value: o.w }); setWeights((w) => ({ ...w, [card.unit]: o.w })); }
      }
    });
    requestAnimationFrame(() => showBtn.current?.focus({ preventScroll: true }));
  }

  async function suspend() {
    if (!card) return;
    const s: CardState = { ...(states.get(card.id) ?? { cardId: card.id, fsrs: {}, due: Number.MAX_SAFE_INTEGER, reps: 0, lapses: 0 }), suspended: 1 };
    setStates((m) => new Map(m).set(card.id, s));
    setQueue((q) => (q ?? []).slice(1));
    setShown(false);
    await db.cards.put(s);
  }

  async function saveEdit(front: string, back: string) {
    if (!card) return;
    if (card.custom) await db.customCards.update(card.id, { front, back });
    const e: CardEdit = { cardId: card.id, front, back, at: Date.now() };
    await db.cardEdits.put(e);
    setEdits((m) => new Map(m).set(card.id, e));
    setEditing(false);
  }

  function exportCsv() {
    const rows = all.map((c) => { const f = faces(c, edits.get(c.id)); return { front: c.type === 'cloze' ? (edits.get(c.id)?.front ?? c.text ?? '') : f.q, back: f.a, tags: [c.unit, c.week ?? '', c.concept].filter(Boolean) }; });
    download(`studysite-${units.length === 1 ? units[0] : 'all'}-cards.csv`, ankiCsv(rows));
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (editing || e.metaKey || e.ctrlKey || e.altKey || (e.target as HTMLElement)?.closest('input, textarea, [contenteditable], dialog')) return;
      if (!shown && (e.key === ' ' || e.key === 'Enter') && card) { e.preventDefault(); setShown(true); return; }
      const g = GRADES.find((x) => x.key === e.key);
      if (g && shown) { e.preventDefault(); grade(g.g); }
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  });

  // Queue cleared: a quiet, once-per-day milestone.
  useEffect(() => {
    if (queue && queue.length === 0 && done > 0) document.dispatchEvent(new CustomEvent('studysite:milestone', { detail: { kind: 'queue-cleared', units } }));
  }, [queue?.length, done]);

  if (error) return <p className="flash-empty">Could not load cards: {error}</p>;
  if (!queue) return <p className="flash-empty" aria-busy="true">Loading today’s cards…</p>;
  const dueLeft = queue.filter((c) => states.has(c.id)).length;
  const newLeft = queue.length - dueLeft;
  const f = card ? faces(card, edits.get(card.id)) : null;
  const cmeta = card ? deck?.concepts[card.concept] : undefined;

  return (
    <section className="flash-review" aria-label="Today’s cards" data-focus-keep>
      <p className="flash-counts" aria-live="polite">
        <span><b>{dueLeft}</b> due</span> · <span><b>{newLeft}</b> new</span> · <span><b>{done}</b> reviewed</span>
        {concept && <> · <a href={location.pathname}>all concepts</a></>}
      </p>
      {!card ? (
        <div className="flash-cleared">
          <p className="flash-cleared__title">Queue cleared.</p>
          <p>{done ? `${done} reviewed this sitting.` : 'Nothing is due right now.'} New cards open again tomorrow (up to {NEW_PER_DAY} a day).</p>
        </div>
      ) : (
        <>
          <div className="flash" data-flipped={shown || undefined} data-type={card.type}>
            <div className="flash__inner">
              <div className="flash__face flash__face--front" aria-hidden={shown}>
                <p className="label">{card.type === 'apply' ? 'Apply' : card.type === 'cloze' ? 'Fill the gap' : card.type === 'occlusion' ? 'Diagram' : 'Recall'}{cmeta ? ` · ${cmeta.title}` : ''}</p>
                {card.type === 'occlusion' ? <Occlusion card={card} revealed={revealed} onReveal={(i) => setRevealed((s) => new Set(s).add(i))} all={false} /> : <p className="flash__text">{f!.q}</p>}
              </div>
              <div className="flash__face flash__face--back" aria-hidden={!shown}>
                <p className="label">Answer{cmeta ? ` · ${cmeta.title}` : ''}</p>
                {card.type === 'occlusion' ? <Occlusion card={card} revealed={revealed} onReveal={() => {}} all /> : <p className="flash__text">{f!.a}</p>}
                {f!.extra && <p className="flash__extra">{f!.extra}</p>}
                {card.source && <p className="flash__source mono">{card.source.startsWith('/') ? <a href={card.source}>from your notes</a> : card.source}</p>}
              </div>
            </div>
          </div>
          {editing ? (
            <EditCard key={card.id} front={card.type === 'cloze' ? (edits.get(card.id)?.front ?? card.text ?? '') : f!.q} back={card.type === 'cloze' ? (f!.extra ?? '') : f!.a} cloze={card.type === 'cloze'} onSave={saveEdit} onCancel={() => setEditing(false)} />
          ) : (
            <div className="flash-actions">
              {!shown ? (
                <button ref={showBtn} className="btn btn--primary" type="button" onClick={() => setShown(true)}>Show answer <kbd className="kbd" aria-hidden="true">Space</kbd></button>
              ) : (
                <div className="flash-grades" role="group" aria-label="How well did you recall it?">
                  {GRADES.map((x) => (
                    <button key={x.g} className={`btn ${x.g === Rating.Good ? 'btn--primary' : 'btn--secondary'} flash-grade`} type="button" onClick={() => grade(x.g)}>
                      <span>{x.label}</span><span className="flash-grade__iv mono">{pv?.[x.g]}</span><kbd className="kbd" aria-hidden="true">{x.key}</kbd>
                    </button>
                  ))}
                </div>
              )}
              <div className="flash-tools">
                {cmeta && <a className="btn btn--ghost btn--sm" href={cmeta.href}>Concept</a>}
                {card.type !== 'occlusion' && <button className="btn btn--ghost btn--sm" type="button" onClick={() => setEditing(true)}>Edit</button>}
                <button className="btn btn--ghost btn--sm" type="button" onClick={suspend}>Suspend</button>
              </div>
            </div>
          )}
        </>
      )}
      <p className="flash-foot">
        <button className="btn btn--ghost btn--sm" type="button" onClick={exportCsv}>Export for Anki (CSV)</button>
        <span className="flash-foot__note">Retention target {Math.round((card ? opts.retention! : retentionFor(decks?.[0]?.examDate, now)) * 100)}%{Object.keys(weights).length ? ' · tuned to your reviews' : ''}</span>
      </p>
    </section>
  );
}

function Occlusion({ card, revealed, onReveal, all }: { card: DeckCard; revealed: Set<number>; onReveal: (i: number) => void; all: boolean }) {
  return (
    <div className="flash-occ">
      <img src={card.image} alt="" />
      {(card.masks ?? []).map((m, i) => (
        <button key={i} type="button" className="flash-occ__mask" data-open={all || revealed.has(i) || undefined}
          style={{ left: `${m.x * 100}%`, top: `${m.y * 100}%`, width: `${m.w * 100}%`, height: `${m.h * 100}%` }}
          aria-label={all || revealed.has(i) ? m.label : `Hidden label ${i + 1}: click to reveal`} onClick={() => onReveal(i)} tabIndex={all ? -1 : 0}>
          <span>{m.label}</span>
        </button>
      ))}
    </div>
  );
}

function EditCard({ front, back, cloze, onSave, onCancel }: { front: string; back: string; cloze: boolean; onSave: (f: string, b: string) => void; onCancel: () => void }) {
  const [f, setF] = useState(front);
  const [b, setB] = useState(back);
  return (
    <form className="flash-edit" onSubmit={(e) => { e.preventDefault(); onSave(f, b); }}>
      <label className="label" htmlFor="flash-edit-f">{cloze ? 'Cloze text ({{c1::hidden}})' : 'Front'}</label>
      <textarea id="flash-edit-f" value={f} onChange={(e) => setF(e.target.value)} rows={3} />
      <label className="label" htmlFor="flash-edit-b">{cloze ? 'Extra (optional)' : 'Back'}</label>
      <textarea id="flash-edit-b" value={b} onChange={(e) => setB(e.target.value)} rows={3} />
      <div className="flash-edit__actions">
        <button className="btn btn--primary btn--sm" type="submit" disabled={cloze && !/\{\{c\d+::/.test(f)}>Save</button>
        <button className="btn btn--secondary btn--sm" type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
