// "What I know" (/insight): the site's model of the learner across all four units — strengths, recurring errors
// (misconceptions vs gaps), what is likely to need review (a recall estimate per concept) and the learner's own open
// questions. Every estimate and recommendation has a "Why?" that shows its evidence in plain words, in place.
// Pure logic lives in src/lib/learner.ts; this island only loads rows and renders.
import { useEffect, useId, useMemo, useState, type ReactNode } from 'react';
import { db, type CardState } from '../lib/db';
import { startStudySync, useStudy } from '../lib/store';
import { accuracyByFormat } from '../lib/format-track';
import {
  addQuestion, fmtDay, groupCards, learnerModel, OPEN_QUESTIONS_KEY, pct, removeQuestion, toggleResolved,
  type ConceptRef, type OpenQuestion,
} from '../lib/learner';
import type { OUnit } from './Dashboard';
import '../styles/insight.css';

const SHOW = 6;

/** Deck map (card id → concept) for the units whose content cards have FSRS states; custom cards from Dexie. */
async function loadDeckMap(unitIds: string[], cards: CardState[]) {
  const need = unitIds.filter((u) => cards.some((c) => c.cardId.startsWith(`${u}-`)));
  const decks = await Promise.all(need.map((u) => fetch(`/data/${u}/cards.json`).then((r) => (r.ok ? r.json() : { cards: [] })).catch(() => ({ cards: [] }))));
  const m = new Map<string, string>();
  for (const d of decks) for (const c of d.cards as { id: string; concept: string }[]) m.set(c.id, c.concept);
  for (const c of await db.customCards.toArray().catch(() => [])) m.set(c.id, c.concept);
  return m;
}

/** A sentence (or a row of actions) with a "Why?" button; the evidence opens in place below it. */
function WithWhy({ why, children, className, about }: { why: string; children: ReactNode; className: string; about: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <>
      <div className={className}>
        {children}
        <button type="button" className="btn btn--ghost btn--sm insight-why__btn" aria-label={`Why? ${about}`} aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)}>Why?</button>
      </div>
      <p id={id} className="insight-why" hidden={!open}>{why}</p>
    </>
  );
}

function Head({ c }: { c: ConceptRef }) {
  return (
    <p className="insight-item__head">
      <a className="insight-item__title" href={c.href}>{c.title}</a>
      <span className="insight-item__unit mono">{c.code}</span>
    </p>
  );
}

function Capped<T>({ items, render, empty, label }: { items: T[]; render: (x: T) => ReactNode; empty: string; label: string }) {
  const [all, setAll] = useState(false);
  if (!items.length) return <p className="insight-empty">{empty}</p>;
  const shown = all ? items : items.slice(0, SHOW);
  return (
    <>
      <ul className="insight-list" aria-label={label}>{shown.map(render)}</ul>
      {items.length > SHOW && (
        <button type="button" className="btn btn--ghost btn--sm insight-more" aria-expanded={all} onClick={() => setAll((a) => !a)}>
          {all ? 'Show fewer' : `Show all ${items.length}`}
        </button>
      )}
    </>
  );
}

function OpenQuestions() {
  const [list, setList] = useState<OpenQuestion[] | null>(null);
  const [draft, setDraft] = useState('');
  const [status, setStatus] = useState('');
  const [undo, setUndo] = useState<OpenQuestion[] | null>(null);

  // IndexedDB is the durable copy (backups read it); a synchronous localStorage mirror makes a change survive even a
  // reload that lands before the IndexedDB write commits. The mirror wins on load when present.
  const MIRROR = 'studysite:open-questions';
  useEffect(() => {
    let mirrored: OpenQuestion[] | null = null;
    try { const m = JSON.parse(localStorage.getItem(MIRROR) || 'null'); if (Array.isArray(m)) mirrored = m; } catch {}
    if (mirrored) { setList(mirrored); return; }
    db.settings.get(OPEN_QUESTIONS_KEY).then((r) => setList(Array.isArray(r?.value) ? (r!.value as OpenQuestion[]) : [])).catch(() => setList([]));
  }, []);

  const save = (next: OpenQuestion[], msg: string, prev?: OpenQuestion[]) => {
    setList(next);
    setStatus(msg);
    setUndo(prev ?? null);
    try { localStorage.setItem(MIRROR, JSON.stringify(next)); } catch {}
    db.settings.put({ key: OPEN_QUESTIONS_KEY, value: next }).catch(() => setStatus('Not saved: storage is unavailable in this window.'));
  };

  if (!list) return <p className="insight-empty" aria-busy="true">Loading your questions…</p>;
  const open = list.filter((q) => !q.resolvedAt);
  const resolved = list.filter((q) => q.resolvedAt);
  const row = (q: OpenQuestion) => (
    <li key={q.id} className="insight-oq__item">
      <p className="insight-oq__text">{q.text}</p>
      <p className="insight-oq__meta">
        <span>{q.resolvedAt ? `Resolved ${fmtDay(q.resolvedAt)}` : `Added ${fmtDay(q.at)}`}</span>
        <button type="button" className="btn btn--ghost btn--sm" onClick={() => save(toggleResolved(list, q.id, Date.now()), q.resolvedAt ? 'Reopened.' : 'Resolved.')}>
          {q.resolvedAt ? 'Reopen' : 'Resolve'}
        </button>
        <button type="button" className="btn btn--ghost btn--sm" onClick={() => save(removeQuestion(list, q.id), 'Deleted.', list)}>Delete</button>
      </p>
    </li>
  );

  return (
    <>
      <form
        className="insight-oq__form"
        onSubmit={(e) => {
          e.preventDefault();
          const next = addQuestion(list, draft, Date.now());
          if (next === list) return;
          setDraft('');
          save(next, 'Added.');
        }}
      >
        <label className="label" htmlFor="insight-oq-new">A question you are still holding</label>
        <div className="insight-oq__row">
          <input id="insight-oq-new" className="insight-oq__input" value={draft} maxLength={300} autoComplete="off" onChange={(e) => setDraft(e.target.value)} placeholder="e.g. Does trespass to land need damage?" />
          <button type="submit" className="btn btn--secondary" disabled={!draft.trim()}>Add</button>
        </div>
      </form>
      <p className="insight-oq__status" aria-live="polite">
        {status}
        {undo && <> <button type="button" className="btn btn--ghost btn--sm" onClick={() => save(undo, 'Restored.')}>Undo</button></>}
      </p>
      {open.length ? <ul className="insight-oq__list" aria-label="Open questions">{open.map(row)}</ul> : <p className="insight-empty">{resolved.length ? 'Nothing open: every question here is resolved.' : 'None yet. Questions you write here stay until you resolve them.'}</p>}
      {resolved.length > 0 && (
        <details className="insight-oq__resolved">
          <summary>Resolved ({resolved.length})</summary>
          <ul className="insight-oq__list" aria-label="Resolved questions">{resolved.map(row)}</ul>
        </details>
      )}
    </>
  );
}

export default function LearnerModel() {
  useEffect(() => startStudySync(), []);
  const ready = useStudy((s) => s.ready);
  const attempts = useStudy((s) => s.attempts);
  const criteria = useStudy((s) => s.criterion);
  const cards = useStudy((s) => s.cards);
  const [overview, setOverview] = useState<OUnit[] | null>(null);
  const [deck, setDeck] = useState<Map<string, string> | null>(null);
  const now = useMemo(() => Date.now(), [ready]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetch('/data/overview.json').then((r) => r.json()).then(setOverview).catch(() => setOverview([]));
  }, []);
  const withCards = cards.length > 0;
  useEffect(() => {
    if (!overview || !ready) return;
    loadDeckMap(overview.map((u) => u.id), cards).then(setDeck).catch(() => setDeck(new Map()));
  }, [overview, ready, withCards]); // eslint-disable-line react-hooks/exhaustive-deps

  const concepts = useMemo<ConceptRef[]>(
    () => (overview ?? []).flatMap((u) => u.weeks.flatMap((w) => w.concepts.map((c) => ({ id: c.id, title: c.title, href: c.href, unit: u.id, code: u.code, examDate: u.examDate })))),
    [overview],
  );
  const model = useMemo(
    () => (deck ? learnerModel({ concepts, attempts, criteria, cards: groupCards(cards, deck), now }) : null),
    [concepts, attempts, criteria, cards, deck, now],
  );

  if (!overview || !ready || !model) return <p className="insight-empty" aria-busy="true">Reading your answers…</p>;

  return (
    <div className="insight">
      <p className="insight-basis" data-insight-basis>
        {model.seen
          ? `Based on ${model.answers} marked ${model.answers === 1 ? 'answer' : 'answers'} and your flashcard reviews, across ${model.seen} of ${concepts.length} concepts in ${overview.length} units.`
          : 'Nothing to go on yet. Answer some questions or review some cards and this page fills in.'}
      </p>

      <section className="insight-section" aria-labelledby="insight-strong">
        <h2 id="insight-strong">Strengths</h2>
        <WithWhy className="insight-rec" about="strengths" why="Learned means three right in one session; secured adds three spaced sessions with a right answer, days apart. High recent accuracy shows it has held since. A question every few days keeps it there.">
          <p>Learned or secured, and right on at least four of your last five answers. Keep these warm with the odd question.</p>
        </WithWhy>
        <Capped
          label="Strengths"
          items={model.strengths}
          empty="None yet. A concept shows here once you have learned it and keep getting it right."
          render={(s) => (
            <li key={s.c.id} className="insight-item" data-kind="strength">
              <Head c={s.c} />
              <WithWhy className="insight-item__row" about={s.c.title} why={s.why}>
                <span className="insight-item__stat">{s.secured ? 'Secured' : 'Learned'} · {pct(s.accuracy)} of your last {s.n}</span>
              </WithWhy>
            </li>
          )}
        />
      </section>

      <section className="insight-section" aria-labelledby="insight-errors">
        <h2 id="insight-errors">Recurring errors</h2>
        <p className="insight-note">Concepts you have got wrong twice or more, split by how sure you were when you answered.</p>

        <h3 className="insight-sub" id="insight-myths">Misconceptions <span>sure and wrong</span></h3>
        <WithWhy className="insight-rec" about="misconceptions" why="Being sure and wrong means a belief has to be replaced, not just a fact added. Seeing why the right answer is right straight after the mistake, then again days later, is what corrects it. Sure-and-wrong answers already come back at 10 minutes, 1 day and 4 days.">
          <p>Read why the right answer is right, put it next to what you believed, then re-test.</p>
        </WithWhy>
        <Capped
          label="Misconceptions"
          items={model.misconceptions}
          empty="None. Nothing you were sure about has been wrong twice."
          render={(e) => (
            <li key={e.c.id} className="insight-item" data-kind="misconception">
              <Head c={e.c} />
              <WithWhy className="insight-item__row" about={e.c.title} why={e.why}>
                <span className="insight-item__stat">Wrong {e.p.wrong} times, {e.p.sure} while sure</span>
                <a className="btn btn--ghost btn--sm" href={`/${e.c.unit}/errors`}>Error log</a>
                <a className="btn btn--ghost btn--sm" href={`/${e.c.unit}/quiz?concept=${e.c.id}`}>Re-test</a>
              </WithWhy>
            </li>
          )}
        />

        <h3 className="insight-sub" id="insight-gaps">Gaps <span>unsure or guessing and wrong</span></h3>
        <WithWhy className="insight-rec" about="gaps" why="Wrong while unsure or guessing means the idea has not been learned yet, so another quiz alone will not fix it. Reading the card first and then recalling it a few times is the quickest way to close the gap.">
          <p>Read the concept card first, then answer a few questions on it.</p>
        </WithWhy>
        <Capped
          label="Gaps"
          items={model.gaps}
          empty="None. No concept has been wrong twice while you were unsure."
          render={(e) => (
            <li key={e.c.id} className="insight-item" data-kind="gap">
              <Head c={e.c} />
              <WithWhy className="insight-item__row" about={e.c.title} why={e.why}>
                <span className="insight-item__stat">Wrong {e.p.wrong} times</span>
                <a className="btn btn--ghost btn--sm" href={e.c.href}>Read the card</a>
                <a className="btn btn--ghost btn--sm" href={`/${e.c.unit}/quiz?concept=${e.c.id}`}>Re-test</a>
              </WithWhy>
            </li>
          )}
        />
      </section>

      <section className="insight-section" aria-labelledby="insight-review">
        <h2 id="insight-review">Likely to need review</h2>
        <WithWhy className="insight-rec" about="the review list" why="Recall is estimated per concept. When you have reviewed its flashcards, it is their FSRS recall today. Otherwise it fades from your last right answer, more slowly the further the concept has got (learning, learned, secured), and faster after each miss since. Your target is 90%, rising to 93% in the last 14 days before that unit's exam.">
          <p>Concepts whose estimated recall today is below your target, lowest first.</p>
        </WithWhy>
        <Capped
          label="Likely to need review"
          items={model.review}
          empty={model.seen ? 'Nothing below your target today.' : 'Nothing yet. Estimates start after your first answers.'}
          render={(r) => (
            <li key={r.c.id} className="insight-item" data-kind="review">
              <Head c={r.c} />
              <WithWhy className="insight-item__row" about={r.c.title} why={r.why}>
                <span className="insight-item__stat">
                  <span className="insight-meter" aria-hidden="true"><span style={{ transform: `scaleX(${Math.max(0, Math.min(1, r.recall.r))})` }} /></span>
                  Recall about {pct(r.recall.r)}
                </span>
                <a className="btn btn--ghost btn--sm" href={r.href}>{r.action}</a>
              </WithWhy>
            </li>
          )}
        />
      </section>

      <section className="insight-section" aria-labelledby="insight-open">
        <h2 id="insight-open">Open questions</h2>
        <p className="insight-note">Things you are not sure about yet, in your own words. Bring them to a tutorial, or resolve them as you go.</p>
        <OpenQuestions />
      </section>

      <FormatsSection attempts={attempts} />
    </div>
  );
}

// Which way into an idea works best for you (features 111, 112): answers grouped by the representation used for that
// concept in the 15 minutes before (explainer, decision flow, Ways in…). Shown once there is enough to compare.
const FORMAT_NAMES: Record<string, string> = { explainer: 'After the explainer', flow: 'After a decision flow', 'ways-in': 'After Ways in', glossary: 'After the glossary', listen: 'After listening', visual: 'After visual practice', sheet: 'After a topic sheet', none: 'Straight in' };
function FormatsSection({ attempts }: { attempts: Parameters<typeof accuracyByFormat>[0] }) {
  const rows = accuracyByFormat(attempts).filter((r) => r.attempts >= 5);
  if (rows.length < 2) return null;
  return (
    <section className="insight-section" aria-labelledby="insight-formats">
      <h2 id="insight-formats">What works for you</h2>
      <p className="insight-note">Your answers grouped by what you used just before them. Only groups with five or more answers are shown; a difference is a hint, not proof.</p>
      <table className="insight-formats">
        <thead><tr><th scope="col">Before answering</th><th scope="col">Answers</th><th scope="col">Right</th></tr></thead>
        <tbody>{rows.map((r) => <tr key={r.format}><th scope="row">{FORMAT_NAMES[r.format] ?? r.format}</th><td>{r.attempts}</td><td>{Math.round(r.accuracy * 100)}%</td></tr>)}</tbody>
      </table>
    </section>
  );
}
