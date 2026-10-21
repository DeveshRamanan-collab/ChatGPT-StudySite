// Explain it back: 60 seconds to type the idea in your own words, then your text beside the card, then a
// self-rating (Again / Hard / Good / Easy) that schedules this concept's "explain" card with FSRS and counts as
// a recall attempt. Opens from the concept card's "Explain it back" (?explain=1).
// After submitting, a word-match check against the concept's aid (terms, element names, plain statement) lists the
// key ideas covered and not yet mentioned; nothing shows when the concept has no aid yet.
import { useEffect, useMemo, useRef, useState } from 'react';
import { TimerArc } from './ui/TimerArc';
import { db } from '../lib/db';
import { loadAids, type Aid } from '../lib/aids';
import { teachBackCoverage, type KeyIdea } from '../lib/learner';
import { review, retentionFor, Rating } from '../lib/fsrs';
import { recordAttempt } from '../lib/learning';
import type { Grade } from 'ts-fsrs';
import '../styles/insight.css';

const SECONDS = 60;
const RATINGS: { g: Grade; label: string }[] = [
  { g: Rating.Again as Grade, label: 'Again' }, { g: Rating.Hard as Grade, label: 'Hard' },
  { g: Rating.Good as Grade, label: 'Good' }, { g: Rating.Easy as Grade, label: 'Easy' },
];

const list = (xs: KeyIdea[]) => xs.map((i) => i.label).join(', ');

function Coverage({ covered, missing, plain }: { covered: KeyIdea[]; missing: KeyIdea[]; plain: string }) {
  const coreMissing = missing.some((i) => i.kind === 'core');
  return (
    <div className="teachback" data-teachback>
      <p className="teachback__head"><span className="label">Key ideas</span><span className="teachback__note">A word-match check, not a mark</span></p>
      <p className="teachback__line" data-covered><span className="teachback__k">You covered:</span>{covered.length ? list(covered) : 'none of them yet'}</p>
      <p className="teachback__line" data-missing><span className="teachback__k">Not yet mentioned:</span>{missing.length ? list(missing) : 'nothing: every key idea is there'}</p>
      {coreMissing && plain && <p className="teachback__core"><span className="label">The core idea</span><br />{plain}</p>}
    </div>
  );
}

export default function ExplainBack({ conceptId, unit, title, examDate }: { conceptId: string; unit: string; title: string; examDate: number }) {
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState<'write' | 'compare' | 'done'>('write');
  const [left, setLeft] = useState(SECONDS);
  const [text, setText] = useState('');
  const [card, setCard] = useState('');
  const [aid, setAid] = useState<Aid | null>(null);
  const started = useRef(0);
  const box = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const go = () => { setOpen(true); setStage('write'); setText(''); setLeft(SECONDS); started.current = Date.now(); setTimeout(() => box.current?.focus(), 50); };
    if (new URLSearchParams(location.search).has('explain')) go();
    document.addEventListener('studysite:explain', go);
    return () => document.removeEventListener('studysite:explain', go);
  }, []);
  useEffect(() => {
    if (!open) return;
    let live = true;
    loadAids(unit).then((b) => { if (live) setAid(b.aids?.[conceptId] ?? null); }).catch(() => {});
    return () => { live = false; };
  }, [open, unit, conceptId]);
  const coverage = useMemo(() => (stage === 'write' ? null : teachBackCoverage(aid, text)), [stage, aid, text]);
  useEffect(() => {
    if (!open || stage !== 'write') return;
    const t = setInterval(() => {
      const l = Math.max(0, SECONDS - (Date.now() - started.current) / 1000);
      setLeft(l);
      if (l <= 0) finish();
    }, 250);
    return () => clearInterval(t);
  }, [open, stage]);

  function finish() {
    setCard(document.querySelector('article.prose')?.textContent?.trim() ?? '');
    setStage('compare');
  }

  async function rate(g: Grade) {
    const now = Date.now();
    const id = `explain-${conceptId}`;
    const prev = await db.cards.get(id);
    const { state, log } = review(id, unit, prev, g, now, { retention: retentionFor(examDate, now), examDate });
    await db.cards.put(state);
    await db.reviews.add(log);
    await recordAttempt({ questionId: id, unit, concept: conceptId, type: 'short', answer: text, correct: g >= Rating.Good, score: [0, 0, 0.5, 0.8, 1][g], durationMs: now - started.current, mode: 'explain-back' });
    setStage('done');
  }

  if (!open) return null;
  return (
    <section className="xback" aria-label={`Explain ${title} back`} data-focus-keep>
      {stage === 'write' && (
        <>
          <div className="xback__head">
            <p className="xback__prompt">Explain <b>{title}</b> in your own words, as if to a friend who missed the lecture.</p>
            <TimerArc total={SECONDS} remaining={left} size={48} label="Time left" />
          </div>
          <textarea ref={box} className="xback__text" rows={6} value={text} onChange={(e) => setText(e.target.value)} aria-label="Your explanation" />
          <p className="xback__actions">
            <button className="btn btn--primary" type="button" onClick={finish}>Done, compare</button>
            <button className="btn btn--ghost" type="button" onClick={() => setOpen(false)}>Not now</button>
          </p>
        </>
      )}
      {stage !== 'write' && (
        <>
          <div className="xback__compare">
            <div><h3 className="label">Yours</h3><p className="xback__yours">{text || 'Nothing written. That is useful to know too.'}</p></div>
            <div><h3 className="label">The card</h3><p className="xback__card">{card}</p></div>
          </div>
          {coverage && <Coverage covered={coverage.covered} missing={coverage.missing} plain={aid?.plain ?? ''} />}
          {stage === 'compare' ? (
            <div className="xback__rate" role="group" aria-label="How well did you explain it?">
              <p className="xback__q">How close was yours?</p>
              {RATINGS.map((r) => <button key={r.g} className={`btn ${r.g === Rating.Good ? 'btn--primary' : 'btn--secondary'} btn--sm`} type="button" onClick={() => rate(r.g)}>{r.label}</button>)}
            </div>
          ) : <p className="xback__done">Saved. This concept comes back for another explanation when it is due.</p>}
        </>
      )}
    </section>
  );
}
