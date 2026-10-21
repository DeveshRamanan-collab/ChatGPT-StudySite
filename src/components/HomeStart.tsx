// Home: one button (Continue), "What next?", the 15-second session start ritual and "2-minute start".
import { useEffect, useMemo, useRef, useState } from 'react';
import { navigate } from 'astro:transitions/client';
import { useStudy, startStudySync } from '../lib/store';
import { readPlace, continueHref, markRestore, visitedWeeks, type Place } from '../lib/continue';
import { whatNext, twoMinuteStart, weakestConcept, type OverviewUnit, type Next } from '../lib/whatnext';
import { sessionPlan, suggestedMinutes, type Energy } from '../lib/session-plan';
import '../styles/session.css';
import { startBlock, readBlock, lastIfThen } from '../lib/block';
import '../styles/open-thought.css';

const LENGTHS = [10, 15, 25, 45];
const ENERGY: [Energy, string, string][] = [['low', 'Low', 'Recognition and short recall'], ['steady', 'Steady', 'Quizzes and contrasts'], ['high', 'High', 'Full written answers']];

export default function HomeStart() {
  const ready = useStudy((s) => s.ready);
  const attempts = useStudy((s) => s.attempts);
  const criteria = useStudy((s) => s.criterion);
  const requeue = useStudy((s) => s.requeue);
  const cards = useStudy((s) => s.cards);
  const [overview, setOverview] = useState<OverviewUnit[] | null>(null);
  const [place, setPlace] = useState<Place | null>(null);
  const [ritual, setRitual] = useState(false);
  const [unit, setUnit] = useState('due');
  const [ifThen, setIfThen] = useState('');
  const [minutes, setMinutes] = useState(25);
  const [energy, setEnergy] = useState<Energy>('steady');
  const [running, setRunning] = useState(false);

  useEffect(() => {
    startStudySync();
    setPlace(readPlace());
    setRunning(!!readBlock());
    fetch('/data/overview.json').then((r) => r.json()).then(setOverview);
    const q = new URLSearchParams(location.search);
    if (q.has('next')) setTimeout(() => document.querySelector<HTMLElement>('[data-what-next]')?.focus(), 300);
    if (q.has('session')) setRitual(true);
  }, []);

  const units = (overview ?? []).filter((u) => u.weeks.some((w) => w.concepts.length));
  const next: Next | null = useMemo(
    () => (overview && ready ? whatNext({ units: overview, attempts, criteria, requeue, cards, visited: visitedWeeks(), now: Date.now() }) : null),
    [overview, ready, attempts, criteria, requeue, cards],
  );
  const code = units.find((u) => u.id === unit)?.code;
  const suggestion = unit === 'due' ? 'When I sit down, then I clear what is due first' : `When I open ${code}, then I answer 10 questions before rereading`;

  // Time- and energy-budgeted plan (features 174, 180): what fits in the chosen minutes at this energy.
  const plan = useMemo(() => {
    if (!overview || !ready) return [];
    const now = Date.now();
    const inUnit = (id: string) => unit === 'due' || id.startsWith(`${unit}-`);
    const u = units.find((x) => x.id === unit);
    const weak = u ? weakestConcept(u, attempts, criteria) : null;
    return sessionPlan({
      minutes, energy, unit, unitCode: code,
      dueCards: cards.filter((c) => !c.suspended && c.due <= now && inUnit(c.cardId)).length,
      dueRequeues: requeue.filter((r) => !r.done && r.dueAt <= now && inUnit(r.itemId)).length,
      weakest: weak ? { id: weak.id, title: weak.title } : null,
      answerStyle: u?.answerStyle,
    });
  }, [overview, ready, unit, minutes, energy, attempts, criteria, cards, requeue]); // eslint-disable-line react-hooks/exhaustive-deps

  function go(href: string) { navigate(href); }

  function start() {
    const b = startBlock({ kind: minutes === 45 ? 'deep' : 'block', unit, ifThen: ifThen.trim() || suggestion, minutes, energy, plan: plan.map(({ label, href, minutes: m }) => ({ label, href, minutes: m })) });
    setRunning(true);
    if (plan.length) { go(plan[0].href); return; }
    const n = overview ? whatNext({ units: overview, attempts, criteria, requeue, cards, visited: visitedWeeks(), now: b.startAt, only: unit }) : null;
    go(n?.href ?? (unit === 'due' ? '/cards' : `/${unit}/quiz`));
  }

  function twoMinute() {
    if (!overview) return;
    const href = twoMinuteStart({ units: overview, attempts, criteria, requeue, cards, visited: visitedWeeks(), now: Date.now() }, startBlock);
    if (!href) return;
    setRunning(true);
    go(href);
  }

  const last = lastIfThen();
  return (
    <section className="home-start" aria-label="Start studying">
      <div className="home-start__row">
        {place ? (
          <a className={`btn ${ritual ? 'btn--secondary' : 'btn--primary'} home-start__continue`} href={continueHref(place)} onClick={() => markRestore(place)} data-continue>
            Continue <span className="home-start__where">{place.title}</span>
          </a>
        ) : (
          <button className={`btn ${ritual ? 'btn--secondary' : 'btn--primary'} home-start__continue`} type="button" onClick={() => setRitual(true)}>Start a session</button>
        )}
        <button className="btn btn--secondary glass" type="button" onClick={twoMinute} disabled={!units.length || !ready}>2-minute start</button>
        {place && !ritual && <button className="btn btn--ghost glass" type="button" onClick={() => setRitual(true)}>Start a session</button>}
      </div>
      <OpenThought />
      {next && (
        <p className="home-start__next">
          <span className="label">What next?</span>{' '}
          <a href={next.href} data-what-next>{next.label}</a> <span className="home-start__why">{next.reason}</span>
        </p>
      )}
      {last && !ritual && <p className="home-start__ifthen">Last plan: “{last.text}”</p>}
      {running && <p className="home-start__ifthen">A block is running — the timer is in the corner.</p>}
      {ritual && (
        <form className="ritual" onSubmit={(e) => { e.preventDefault(); start(); }}>
          <fieldset className="ritual__units">
            <legend className="label">What are you studying?</legend>
            {[{ id: 'due', code: 'Whatever’s due' }, ...units].map((u) => (
              <label key={u.id} className="ritual__opt"><input type="radio" name="ritual-unit" value={u.id} checked={unit === u.id} onChange={() => setUnit(u.id)} /><span>{u.code}</span></label>
            ))}
          </fieldset>
          <label className="label" htmlFor="ritual-if">Your plan, as one if-then line</label>
          <input id="ritual-if" className="ritual__if" value={ifThen} placeholder={suggestion} onChange={(e) => setIfThen(e.target.value)} autoComplete="off" />
          <fieldset className="ritual__units">
            <legend className="label">How much energy have you got?</legend>
            {ENERGY.map(([e, label, hint]) => (
              <label key={e} className="ritual__opt" title={hint}><input type="radio" name="ritual-energy" value={e} checked={energy === e} onChange={() => { setEnergy(e); setMinutes(suggestedMinutes(e)); }} /><span>{label}</span></label>
            ))}
          </fieldset>
          <fieldset className="ritual__units">
            <legend className="label">Block length</legend>
            {LENGTHS.map((m) => (
              <label key={m} className="ritual__opt"><input type="radio" name="ritual-len" value={m} checked={minutes === m} onChange={() => setMinutes(m)} /><span>{m === 45 ? '45 min deep dive' : `${m} min`}</span></label>
            ))}
          </fieldset>
          {plan.length > 0 && (
            <div className="ritual__plan" aria-live="polite">
              <p className="label">What fits in {minutes} minutes</p>
              <ol className="ritual__plan-list">
                {plan.map((x, i) => (
                  <li key={i}><span className="ritual__plan-what">{x.label}</span> <span className="mono ritual__plan-min">{x.minutes} min</span><span className="ritual__plan-why">{x.why}</span></li>
                ))}
              </ol>
            </div>
          )}
          <p className="ritual__actions">
            <button className="btn btn--primary" type="submit">Start the block</button>
            <button className="btn btn--ghost" type="button" onClick={() => setRitual(false)}>Not now</button>
          </p>
        </form>
      )}
    </section>
  );
}

// Resume with an unresolved thought (feature 176): one line kept in localStorage and shown beside Continue next visit.
const THOUGHT = 'studysite:open-thought';
type Thought = { text: string; at: number };
function readThought(): Thought | null {
  let raw: string | null = null;
  try { raw = localStorage.getItem(THOUGHT); } catch {}
  if (!raw?.trim()) return null;
  try {
    const v = JSON.parse(raw);
    if (v && typeof v.text === 'string' && v.text.trim()) return { text: v.text.trim(), at: Number(v.at) || 0 };
  } catch {}
  return { text: raw.trim(), at: 0 };
}

function OpenThought() {
  const [thought, setThought] = useState<Thought | null>(null);
  const [fresh, setFresh] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  useEffect(() => setThought(readThought()), []);
  useEffect(() => { if (editing) input.current?.focus(); }, [editing]);
  const close = () => { setEditing(false); setTimeout(() => opener.current?.focus(), 0); };
  const save = () => {
    const text = draft.replace(/\s+/g, ' ').trim().slice(0, 200);
    if (!text) { close(); return; }
    const v = { text, at: Date.now() };
    try { localStorage.setItem(THOUGHT, JSON.stringify(v)); } catch {}
    setThought(v);
    setFresh(true);
    close();
  };
  const dismiss = () => {
    try { localStorage.removeItem(THOUGHT); } catch {}
    setThought(null);
    setFresh(false);
    setTimeout(() => opener.current?.focus(), 0);
  };
  if (editing) {
    return (
      <form className="open-thought open-thought__form" onSubmit={(e) => { e.preventDefault(); save(); }}>
        <label className="visually-hidden" htmlFor="open-thought-input">A note for next time</label>
        <input
          id="open-thought-input" ref={input} className="open-thought__input" value={draft} maxLength={200} autoComplete="off"
          placeholder="The thought you were in the middle of…" onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Escape') { e.preventDefault(); close(); } }}
        />
        <button className="btn btn--secondary btn--sm" type="submit">Save</button>
        <button className="btn btn--ghost btn--sm" type="button" onClick={close}>Cancel</button>
      </form>
    );
  }
  return (
    <p className="open-thought" data-open-thought={thought ? '' : undefined}>
      {thought && (
        <>
          <span className="open-thought__lead">{fresh ? 'Saved for next time:' : 'You were thinking:'}</span>{' '}
          <span className="open-thought__text">“{thought.text}”</span>{' '}
        </>
      )}
      <button ref={opener} type="button" className="open-thought__link" onClick={() => { setDraft(thought?.text ?? ''); setEditing(true); }}>
        {thought ? 'Change' : 'Leave a note for next time'}
      </button>
      {thought && <>{' · '}<button type="button" className="open-thought__link" onClick={dismiss}>Dismiss</button></>}
    </p>
  );
}
