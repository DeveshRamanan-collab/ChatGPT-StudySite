// Mock viva (features 181, 182 stand-in) on /<unit>/listen, tab "Viva": for a concept with a Socratic ladder in its
// study aids, the browser asks each question aloud; the learner answers out loud (or types); "Show what a tutor would
// accept" reveals the ladder's answer; then the examiner presses with a follow-up ("And what if…?") drawn from the
// concept's objections and edge cases, or simply moves to the next rung. Each turn is self-rated and recorded
// (questionId viva:<concept>:<i>, mode 'viva', scored 1 / 0.5 / 0). No speech recognition: nothing leaves the device.
import { useEffect, useMemo, useRef, useState } from 'react';
import { loadAids, type Aid, type AidsBundle } from '../../lib/aids';
import { loadBank, type Bank } from '../quiz/types';
import { recordAttempt } from '../../lib/learning';
import { speechSupported } from '../../lib/speech';
import { say, hush, readPrefs, writePrefs, DEFAULT_PREFS, type ListenPrefs } from './say';
import '../../styles/audio.css';

type Stage = 'ready' | 'ask' | 'accept' | 'done';
type Rating = 1 | 0.5 | 0;
const RATINGS: [Rating, string, string][] = [[1, 'Got it', '1'], [0.5, 'Partly', '2'], [0, 'Not yet', '3']];
interface Challenge { lead: string; text: string; reply?: string; replyLabel: string }

/** Follow-up challenges for a concept: objections first, then edge cases. */
export function challenges(a: Aid): Challenge[] {
  return [
    ...a.objections.filter((o) => o.objection?.trim()).map((o) => ({ lead: 'And what if someone objects:', text: o.objection, reply: o.reply, replyLabel: 'A strong reply' })),
    ...a.boundary.filter((b) => b.text?.trim()).map((b) => ({ lead: 'And what if…', text: b.text, reply: b.why, replyLabel: 'Why it sits where it does' })),
  ];
}

export default function Viva({ unit }: { unit: string }) {
  const [aids, setAids] = useState<AidsBundle | null>(null);
  const [bank, setBank] = useState<Bank | null>(null);
  const [concept, setConcept] = useState('');
  const [stage, setStage] = useState<Stage>('ready');
  const [i, setI] = useState(0);
  const [typed, setTyped] = useState('');
  const [hint, setHint] = useState(false);
  const [reply, setReply] = useState(false);
  const [showAsk, setShowAsk] = useState(false);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [prefs, setPrefs] = useState<ListenPrefs>(DEFAULT_PREFS);
  const [canSpeak, setCanSpeak] = useState(true);
  const startedAt = useRef(0);
  const askRef = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);
  const acceptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPrefs(readPrefs());
    setCanSpeak(speechSupported());
    loadAids(unit).then(setAids);
    loadBank(unit).then(setBank).catch(() => setBank(null));
    const onSwap = () => hush();
    document.addEventListener('astro:before-swap', onSwap);
    return () => { document.removeEventListener('astro:before-swap', onSwap); hush(); };
  }, [unit]);

  // Concepts with a question ladder, grouped by week.
  const groups = useMemo(() => {
    if (!aids) return [];
    const withLadder = Object.values(aids.aids).filter((a) => a.socratic.length > 0);
    const weeks = new Map<string, Aid[]>();
    for (const a of withLadder) weeks.set(a.week, [...(weeks.get(a.week) ?? []), a]);
    const meta = (w: string) => bank?.weeks.find((x) => x.id === w);
    return [...weeks.entries()]
      .map(([w, list]) => ({ id: w, number: meta(w)?.number ?? Number(w.match(/w(\d+)$/)?.[1] ?? 0), topic: meta(w)?.topic, list }))
      .sort((a, b) => a.number - b.number);
  }, [aids, bank]);
  const title = (id: string) => bank?.concepts[id]?.title ?? id.replace(/^[a-z]+\d+-w\d+-/, '').replace(/-/g, ' ');

  useEffect(() => {
    if (!groups.length || concept) return;
    const want = new URLSearchParams(location.search).get('concept');
    const all = groups.flatMap((g) => g.list);
    setConcept(all.find((a) => a.concept === want)?.concept ?? all[0].concept);
  }, [groups, concept]);

  const aid = aids?.aids[concept];
  const steps = aid?.socratic ?? [];
  const pool = useMemo(() => (aid ? challenges(aid) : []), [aid]);
  const step = steps[i];
  const follow = pool[i];
  const n = steps.length;

  useEffect(() => {
    if (moved.current && stage === 'ask') askRef.current?.focus({ preventScroll: false });
  }, [i, stage]);

  const speak = (text: string) => { if (prefs.sound) say(text, { rate: prefs.rate, voice: prefs.voice, sound: true }); };
  const ask = (k: number) => {
    const s = steps[k];
    if (!s) return;
    setI(k);
    setStage('ask');
    setTyped('');
    setHint(false);
    setReply(false);
    setShowAsk(false);
    startedAt.current = Date.now();
    speak(s.ask);
  };
  const start = () => { moved.current = true; setRatings([]); ask(0); };
  const reveal = () => {
    setStage('accept');
    setTimeout(() => acceptRef.current?.focus(), 0); // the answer appears in place; focus follows it (and brings it into view)
    if (follow) speak(`${follow.lead} ${follow.text}`);
    else hush();
  };
  const rate = (r: Rating) => {
    if (!aid || stage !== 'accept') return;
    hush();
    recordAttempt({
      questionId: `viva:${aid.concept}:${i}`, unit, concept: aid.concept, week: aid.week, type: 'short',
      answer: typed.trim() || null, correct: null, score: r, mode: 'viva', durationMs: Date.now() - startedAt.current,
    }).catch(() => {});
    setRatings((xs) => [...xs, r]);
    if (i + 1 < n) ask(i + 1);
    else setStage('done');
  };
  const choose = (id: string) => { hush(); setConcept(id); setStage('ready'); setI(0); setRatings([]); moved.current = false; };
  const toggleSound = () => {
    const p = { ...readPrefs(), sound: !prefs.sound };
    setPrefs(p);
    writePrefs(p);
    if (!p.sound) hush();
  };

  // 1 / 2 / 3 rate the turn once the tutor's answer is showing.
  useEffect(() => {
    if (stage !== 'accept') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || (e.target as HTMLElement | null)?.closest('input, textarea, select, [contenteditable="true"]')) return;
      const r = RATINGS.find(([, , k]) => k === e.key);
      if (r) { e.preventDefault(); rate(r[0]); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  });

  if (!aids) return <section className="viva" aria-label="Mock viva"><p className="viva__note">Loading the questions…</p></section>;
  if (!groups.length) return <section className="viva" aria-label="Mock viva"><p className="viva__note">No concept in this unit has a question ladder yet. The viva opens here as study aids arrive.</p></section>;

  const got = ratings.filter((r) => r === 1).length;
  const partly = ratings.filter((r) => r === 0.5).length;
  const href = bank?.concepts[concept]?.href;

  return (
    <section className="viva" aria-label="Mock viva" data-stage={stage} data-concept={concept}>
      <div className="viva__head">
        <label className="listen__field">
          <span className="label">Concept</span>
          <select className="listen__select" value={concept} onChange={(e) => choose(e.target.value)}>
            {groups.map((g) => (
              <optgroup key={g.id} label={`Week ${g.number}${g.topic ? ` · ${g.topic}` : ''}`}>
                {g.list.map((a) => <option key={a.concept} value={a.concept}>{title(a.concept)}</option>)}
              </optgroup>
            ))}
          </select>
        </label>
        <button className="btn btn--ghost btn--sm listen__toggle" type="button" aria-pressed={prefs.sound} disabled={!canSpeak} onClick={toggleSound}>Sound {prefs.sound ? 'on' : 'off'}</button>
      </div>

      {stage === 'ready' && (
        <div className="viva__panel">
          <p className="viva__lede">The examiner asks {n} question{n === 1 ? '' : 's'} on “{title(concept)}”, one at a time, and presses you with a follow-up. Answer out loud, as you would in a viva, or type a few words.</p>
          <p className="viva__actions"><button className="btn btn--primary" type="button" onClick={start}>Start the viva</button></p>
          {!canSpeak && <p className="viva__note">This browser has no speech voice, so the questions appear as text.</p>}
        </div>
      )}

      {(stage === 'ask' || stage === 'accept') && step && (
        <div className="viva__panel" key={i}>
          <p className="label viva__count">Question {i + 1} of {n}</p>
          {prefs.captions || showAsk || !prefs.sound ? (
            <h3 className="viva__ask" ref={askRef} tabIndex={-1}>{step.ask}</h3>
          ) : (
            <h3 className="viva__ask viva__ask--hidden" ref={askRef} tabIndex={-1}>
              <span>The examiner is asking.</span>{' '}
              <button className="btn btn--ghost btn--sm" type="button" onClick={() => setShowAsk(true)}>Show the question</button>
            </h3>
          )}
          <label className="viva__answer-label label" htmlFor="viva-answer">Your answer <span className="viva__opt">(optional: saying it out loud counts)</span></label>
          <textarea id="viva-answer" className="viva__answer" rows={3} value={typed} onChange={(e) => setTyped(e.target.value)} readOnly={stage === 'accept'} />
          {stage === 'ask' && (
            <p className="viva__actions">
              <button className="btn btn--primary" type="button" onClick={reveal}>Show what a tutor would accept</button>
              {step.hint && <button className="btn btn--ghost" type="button" aria-expanded={hint} onClick={() => setHint(true)} disabled={hint}>A nudge</button>}
              {canSpeak && prefs.sound && <button className="btn btn--ghost" type="button" onClick={() => speak(step.ask)}>Ask again</button>}
            </p>
          )}
          {hint && stage === 'ask' && <p className="viva__hint"><span className="label">Nudge</span> {step.hint}</p>}

          {stage === 'accept' && (
            <>
              <div className="viva__accept" role="region" aria-label="What a tutor would accept" ref={acceptRef} tabIndex={-1}>
                <p className="label">What a tutor would accept</p>
                <p>{step.answer}</p>
              </div>
              {follow ? (
                <div className="viva__follow" role="region" aria-label="Follow-up">
                  <p className="label">Follow-up</p>
                  <p className="viva__follow-q"><em>{follow.lead}</em> {follow.text}</p>
                  {follow.reply && (
                    <>
                      <button className="btn btn--ghost btn--sm" type="button" aria-expanded={reply} onClick={() => setReply((x) => !x)}>{reply ? 'Hide' : 'Show'} {follow.replyLabel.toLowerCase()}</button>
                      {reply && <p className="viva__reply">{follow.reply}</p>}
                    </>
                  )}
                </div>
              ) : i + 1 < n ? (
                <p className="viva__note">The examiner follows up with the next question.</p>
              ) : null}
              <fieldset className="viva__rate">
                <legend className="label">How did that turn go?</legend>
                {RATINGS.map(([r, label, k]) => (
                  <button key={label} className="btn btn--secondary" type="button" onClick={() => rate(r)} aria-keyshortcuts={k}>
                    {label} <kbd className="kbd" aria-hidden="true">{k}</kbd>
                  </button>
                ))}
              </fieldset>
            </>
          )}
        </div>
      )}

      {stage === 'done' && (
        <div className="viva__panel" role="status">
          <p className="viva__lede">Done: {n} question{n === 1 ? '' : 's'} on “{title(concept)}”. You rated {got} “Got it”{partly ? `, ${partly} “Partly”` : ''} and {n - got - partly} “Not yet”.</p>
          <p className="viva__actions">
            <button className="btn btn--primary" type="button" onClick={start}>Run it again</button>
            {href && <a className="btn btn--secondary" href={href}>Read the concept</a>}
            <a className="btn btn--ghost" href={`/${unit}/quiz?concept=${concept}`}>Quiz me on this</a>
          </p>
        </div>
      )}
    </section>
  );
}
