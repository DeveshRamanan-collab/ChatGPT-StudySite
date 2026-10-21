// Argument adversary (/<unit>/argue, feature 158 stand-in): for each concept whose study aid has `objections`, the
// learner reads a position and its evidence, commits to a stance ("I'd defend it" / "I'd attack it"), and only then
// writes: the strongest objection and an answer to it (defending), or the strongest objection itself (attacking).
// Comparing reveals the sources' objection and their reply (if any) beside the learner's words; a self-rating
// (Right / Partly / Missed, keys 1–3) is recorded as attempt `argue:<concept>:<i>` (type 'short', mode 'argue').
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { loadAids, type Aid } from '../../lib/aids';
import { recordAttempt } from '../../lib/learning';
import { startStudySync, useStudy } from '../../lib/store';
import { argueItems, lastArgued, ARGUE_SCORE, type Stance } from '../../lib/legal';
import type { SelfRating } from '../../lib/drills';
import '../../styles/legal.css';

interface ConceptMeta { title: string; week: number; href: string }
interface Props { unit: string; code: string; concepts: Record<string, ConceptMeta>; order: string[] }

const STANCES: { id: Stance; label: string }[] = [
  { id: 'defend', label: 'I’d defend it' },
  { id: 'attack', label: 'I’d attack it' },
];
const PROMPT: Record<Stance, string> = {
  defend: 'What is the strongest objection to this position, and how would you answer it?',
  attack: 'What is the strongest objection to this position?',
};
const RATES: { id: SelfRating; label: string }[] = [
  { id: 'right', label: 'Right' },
  { id: 'partly', label: 'Partly' },
  { id: 'missed', label: 'Missed' },
];
const RATED: Record<string, string> = { 1: 'right', 0.5: 'partly', 0: 'missed' };
const typing = (e: KeyboardEvent) => e.metaKey || e.ctrlKey || e.altKey || !!(e.target as HTMLElement)?.closest('input, textarea, select, [contenteditable]');

export default function Adversary({ unit, code, concepts, order }: Props) {
  const [aids, setAids] = useState<Record<string, Aid> | null>(null);
  useEffect(() => {
    startStudySync();
    let live = true;
    loadAids(unit).then((b) => { if (live) setAids(b.aids); });
    return () => { live = false; };
  }, [unit]);
  const items = useMemo(() => (aids ? argueItems(aids, order).filter((x) => concepts[x.concept]) : []), [aids, order, concepts]);
  const attempts = useStudy((s) => s.attempts);
  const last = useMemo(() => lastArgued(attempts), [attempts]);

  const [idx, setIdx] = useState(0);
  // ?concept=<id> opens that concept's first position once the aids are in.
  useEffect(() => {
    if (!items.length) return;
    const c = new URLSearchParams(location.search).get('concept');
    const k = c ? items.findIndex((x) => x.concept === c) : -1;
    if (k > 0) setIdx(k);
  }, [items]);

  if (!aids) return <p className="argue__empty" aria-busy="true">Loading positions…</p>;
  if (!items.length) return <p className="argue__empty" data-argue-empty>No positions with objections for {code} yet. They appear here as study aids are added.</p>;

  const item = items[Math.min(idx, items.length - 1)];
  const weeks = [...new Set(items.map((x) => concepts[x.concept].week))].sort((a, b) => a - b);
  const label = (x: (typeof items)[number]) =>
    `${concepts[x.concept].title}${x.of > 1 ? ` (${x.index + 1} of ${x.of})` : ''}${last.has(x.id) ? ` · argued: ${RATES.find((r) => r.id === RATED[String(last.get(x.id))])?.label.toLowerCase() ?? 'done'}` : ''}`;

  return (
    <div className="argue" data-focus-keep>
      <label className="argue__pick">
        <span className="label">Position</span>
        <select className="legal-select" value={item.id} onChange={(e) => setIdx(items.findIndex((x) => x.id === e.target.value))} data-argue-pick>
          {weeks.map((w) => (
            <optgroup key={w} label={`Week ${w}`}>
              {items.filter((x) => concepts[x.concept].week === w).map((x) => <option key={x.id} value={x.id}>{label(x)}</option>)}
            </optgroup>
          ))}
        </select>
      </label>
      <ArgueCard
        key={item.id}
        item={item}
        unit={unit}
        concept={concepts[item.concept]}
        hasNext={items.length > 1}
        onNext={() => setIdx((k) => (k + 1) % items.length)}
      />
    </div>
  );
}

type Item = ReturnType<typeof argueItems>[number];

function ArgueCard({ item, unit, concept, hasNext, onNext }: { item: Item; unit: string; concept: ConceptMeta; hasNext: boolean; onNext: () => void }) {
  const [stance, setStance] = useState<Stance | null>(null);
  const [text, setText] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [rated, setRated] = useState<SelfRating | null>(null);
  const ratedRef = useRef<SelfRating | null>(null);
  const started = useRef(0);
  const input = useRef<HTMLTextAreaElement>(null);
  const reveal = useRef<HTMLElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  const commit = (s: Stance) => {
    if (stance) return;
    setStance(s);
    started.current = performance.now();
  };
  const compare = () => { if (text.trim()) setRevealed(true); };
  const rate = (r: SelfRating) => {
    if (ratedRef.current || !stance) return;
    ratedRef.current = r;
    setRated(r);
    recordAttempt({
      questionId: item.id, unit, concept: item.concept, week: item.week, type: 'short', answer: { stance, text: text.trim() },
      correct: null, score: ARGUE_SCORE[r], mode: 'argue', durationMs: Math.round(performance.now() - started.current),
    }).catch((e) => console.warn(e));
  };

  useEffect(() => { if (stance) input.current?.focus({ preventScroll: true }); }, [stance]);
  useEffect(() => { if (revealed) reveal.current?.focus({ preventScroll: true }); }, [revealed]);
  useEffect(() => { if (rated) nextRef.current?.focus({ preventScroll: true }); }, [rated]);

  // 1 / 2 choose a stance; after the reveal 1–3 rate; Enter after rating moves on. ⌘/Ctrl+Enter in the box compares.
  useLayoutEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (typing(e)) return;
      const n = Number(e.key);
      if (!stance && (n === 1 || n === 2)) { e.preventDefault(); commit(STANCES[n - 1].id); return; }
      if (revealed && !ratedRef.current && n >= 1 && n <= RATES.length) { e.preventDefault(); rate(RATES[n - 1].id); return; }
      if (ratedRef.current && hasNext && e.key === 'Enter' && document.activeElement !== nextRef.current) { e.preventDefault(); onNext(); }
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  });

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <article className="argue__card" aria-labelledby={`argue-pos-${item.id}`} data-argue-item={item.id}>
      <p className="argue__meta">Week {concept.week} · <a href={concept.href}>{concept.title}</a>{item.of > 1 && ` · ${item.index + 1} of ${item.of}`}</p>
      <h2 className="argue__position" id={`argue-pos-${item.id}`}>{item.position}</h2>
      <p className="argue__evidence"><span className="label">Evidence</span>{item.evidence}</p>
      {item.verify && <p className="legal-check">Not yet verified against your materials.</p>}

      <p className="argue__ask" id={`argue-stance-${item.id}`}>Where do you stand?</p>
      <ul className="argue__stance" aria-labelledby={`argue-stance-${item.id}`}>
        {STANCES.map((s, k) => (
          <li key={s.id}>
            <button type="button" className="option" aria-pressed={stance === s.id} data-state={stance === s.id ? 'chosen' : undefined} disabled={stance !== null} onClick={() => commit(s.id)}>
              <span className="option__key" aria-hidden="true">{k + 1}</span>
              <span>{s.label}</span>
            </button>
          </li>
        ))}
      </ul>

      {stance && (
        <div className="argue__write">
          <label className="argue__label" htmlFor={`argue-text-${item.id}`}>{PROMPT[stance]}</label>
          <textarea
            ref={input}
            id={`argue-text-${item.id}`}
            className="argue__input"
            value={text}
            disabled={revealed}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); compare(); } }}
            data-argue-text
          />
          {!revealed && (
            <div className="argue__submit">
              <span className="argue__hint" aria-live="polite">{words ? `${words} word${words === 1 ? '' : 's'}` : 'Write at least a line, then compare.'}</span>
              <button type="button" className="btn btn--primary" disabled={!words} onClick={compare}>Compare with the sources</button>
            </div>
          )}
        </div>
      )}

      {revealed && stance && (
        <section className="argue__reveal" ref={reveal} tabIndex={-1} aria-label="The sources" data-argue-reveal>
          <div className="argue__block">
            <h3 className="argue__h">The strongest objection</h3>
            <p data-argue-objection>{item.objection}</p>
          </div>
          <div className="argue__block">
            <h3 className="argue__h">The sources’ reply</h3>
            {item.reply ? <p data-argue-reply>{item.reply}</p> : <p className="argue__none" data-argue-noreply>Your sources give no reply to this objection.</p>}
          </div>
          <div className="argue__rate" role="group" aria-label={stance === 'attack' ? 'How close was your objection?' : 'How close was your answer?'}>
            <span className="argue__rate-label">{stance === 'attack' ? 'How close was your objection?' : 'How close was your answer?'}</span>
            <span className="argue__rate-opts">
              {RATES.map((r, k) => (
                <button key={r.id} type="button" className="btn btn--secondary argue__rate-btn" aria-pressed={rated === r.id} disabled={rated !== null} onClick={() => rate(r.id)}>
                  {r.label} <kbd className="kbd" aria-hidden="true">{k + 1}</kbd>
                </button>
              ))}
            </span>
          </div>
          {rated && (
            <div className="argue__done">
              <p className="argue__saved" aria-live="polite" data-argue-saved>Saved as {rated}.</p>
              {hasNext && <button ref={nextRef} type="button" className="btn btn--primary" onClick={onNext}>Next position <kbd className="kbd" aria-hidden="true">↵</kbd></button>}
            </div>
          )}
        </section>
      )}
    </article>
  );
}
