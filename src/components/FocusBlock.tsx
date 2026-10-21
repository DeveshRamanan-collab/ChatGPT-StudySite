// The running study block (started from the session ritual or "2-minute start"): a small shrinking-arc timer,
// chrome faded to 30%, one soft tone at the end and a session summary with the one thing that improved most.
// 2-minute start asks "keep going?" once at 2:00. Deep-dive has no end, only one soft toast at 45 minutes.
// Focus mode (html[data-focus]) hides everything but the active card. Persisted island: survives navigation.
import { useEffect, useRef, useState } from 'react';
import { readBlock, remaining, endBlock, updateBlock, startBlock, chime, EVENT, type Block } from '../lib/block';
import { TimerArc, formatClock } from './ui/TimerArc';
import { Modal } from './ui/Modal';
import { toast } from './ui/Toaster';
import { db, type Attempt } from '../lib/db';
import Companion from './Companion';
import '../styles/session.css';

interface Summary { minutes: number; answers: number; accuracy: number | null; improved: { concept: string; title: string; from: number; to: number } | null; ifThen: string }

/** The concept whose accuracy rose most in this block vs before it (≥ 2 answers in the block). Exported for tests. */
export function mostImproved(before: Attempt[], during: Attempt[]) {
  const acc = (xs: Attempt[]) => { const m = xs.filter((a) => a.correct !== null || a.score !== undefined); return m.length ? m.reduce((s, a) => s + (a.correct === null ? a.score ?? 0 : a.correct ? 1 : 0), 0) / m.length : null; };
  let best: { concept: string; from: number; to: number } | null = null;
  for (const c of new Set(during.map((a) => a.concept))) {
    const d = during.filter((a) => a.concept === c);
    if (d.length < 2) continue;
    const to = acc(d), from = acc(before.filter((a) => a.concept === c)) ?? 0;
    if (to === null) continue;
    if (!best || to - from > best.to - best.from) best = { concept: c, from, to };
  }
  return best && best.to > best.from ? best : null;
}

export default function FocusBlock() {
  const [block, setBlock] = useState<Block | null>(null);
  const [now, setNow] = useState(Date.now());
  const [summary, setSummary] = useState<Summary | null>(null);
  const [focus, setFocus] = useState(false);
  const ended = useRef(false);

  useEffect(() => {
    const sync = () => { const b = readBlock(); setBlock(b); ended.current = false; };
    sync();
    const onFocus = (e: Event) => setFocus((f) => ((e as CustomEvent).detail?.toggle ? !f : !!(e as CustomEvent).detail?.on));
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && document.documentElement.hasAttribute('data-focus') && !document.querySelector('dialog[open]')) setFocus(false); };
    document.addEventListener(EVENT, sync);
    document.addEventListener('studysite:focus', onFocus);
    addEventListener('keydown', onKey);
    addEventListener('storage', sync);
    return () => { document.removeEventListener(EVENT, sync); document.removeEventListener('studysite:focus', onFocus); removeEventListener('keydown', onKey); removeEventListener('storage', sync); };
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    if (block) html.dataset.block = block.kind; else delete html.dataset.block;
    if (!block) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [block]);

  useEffect(() => {
    const html = document.documentElement;
    if (focus) html.dataset.focus = ''; else delete html.dataset.focus;
    const keep = () => { if (focus) html.dataset.focus = ''; };
    document.addEventListener('astro:after-swap', keep);
    return () => document.removeEventListener('astro:after-swap', keep);
  }, [focus]);

  useEffect(() => {
    const keep = () => { const b = readBlock(); if (b) document.documentElement.dataset.block = b.kind; };
    document.addEventListener('astro:after-swap', keep);
    return () => document.removeEventListener('astro:after-swap', keep);
  }, []);

  const r = block ? remaining(block, now) : null;

  // Milestones inside a block.
  useEffect(() => {
    if (!block || !r) return;
    if (block.kind === 'two-minute' && r.elapsed >= 120 && !block.askedKeepGoing) { updateBlock({ askedKeepGoing: true }); chime(); }
    if (block.kind === 'deep' && r.elapsed >= 45 * 60 && !block.toastedDeep) {
      updateBlock({ toastedDeep: true });
      toast({ message: '45 minutes in. A short break keeps recall sharp; carry on if you are in flow.', duration: 8000 });
    }
    if (block.kind === 'block' && r.left <= 0 && !ended.current) { ended.current = true; finish(true); }
  }, [block, now]);

  async function finish(natural: boolean) {
    const b = readBlock();
    if (!b) return;
    if (natural) chime();
    endBlock();
    setFocus(false);
    const all = await db.attempts.toArray().catch(() => [] as Attempt[]);
    const during = all.filter((a) => a.at >= b.startAt);
    const before = all.filter((a) => a.at < b.startAt);
    const marked = during.filter((a) => a.correct !== null);
    const imp = mostImproved(before, during);
    let title = imp?.concept ?? '';
    if (imp) { try { const u = imp.concept.match(/^([a-z]+\d{4})/)?.[1]; const bank = await (await fetch(`/data/${u}/questions.json`)).json(); title = bank.concepts[imp.concept]?.title ?? title; } catch {} }
    setSummary({
      minutes: Math.max(1, Math.round((Date.now() - b.startAt) / 60_000)),
      answers: during.length,
      accuracy: marked.length ? marked.filter((a) => a.correct).length / marked.length : null,
      improved: imp ? { ...imp, title } : null,
      ifThen: b.ifThen,
    });
  }

  const keepGoing = () => { if (block) updateBlock({ kind: 'block', minutes: 25, startAt: Date.now() }); };

  return (
    <>
      {block && r && (
        <aside className="focus-block" aria-label="Study block">
          {block.kind === 'deep'
            ? <p className="focus-block__deep mono" role="timer" aria-label={`Deep dive: ${formatClock(r.elapsed)} elapsed`}>{formatClock(r.elapsed)}</p>
            : <TimerArc total={block.kind === 'two-minute' ? 120 : block.minutes * 60} remaining={block.kind === 'two-minute' ? Math.max(0, 120 - r.elapsed) : r.left} size={56} label="Block time left" />}
          <div className="focus-block__body">
            {block.kind === 'two-minute' && block.askedKeepGoing ? (
              <>
                <p className="focus-block__line">Two minutes done. Keep going?</p>
                <p className="focus-block__actions">
                  <button className="btn btn--primary btn--sm" type="button" onClick={keepGoing}>Keep going (25 min)</button>
                  <button className="btn btn--ghost btn--sm" type="button" onClick={() => finish(false)}>Stop here</button>
                </p>
              </>
            ) : (
              <>
                <p className="focus-block__line">{block.ifThen || (block.kind === 'deep' ? 'Deep dive' : 'Study block')}</p>
                {block.plan && block.plan.length > 0 && (
                  <details className="focus-plan">
                    <summary>Plan · {block.plan.filter((x) => x.done).length} of {block.plan.length} done</summary>
                    <ol className="focus-plan__list">
                      {block.plan.map((x, i) => (
                        <li key={i} data-done={x.done || undefined}>
                          <label className="focus-plan__tick"><input type="checkbox" checked={!!x.done} onChange={(e) => updateBlock({ plan: block.plan!.map((y, j) => (j === i ? { ...y, done: e.target.checked } : y)) })} /><span className="visually-hidden">Done: {x.label}</span></label>
                          <a href={x.href}>{x.label}</a> <span className="mono focus-plan__min">{x.minutes}′</span>
                        </li>
                      ))}
                    </ol>
                  </details>
                )}
                <p className="focus-block__actions">
                  <button className="btn btn--ghost btn--sm" type="button" aria-pressed={focus} onClick={() => setFocus((f) => !f)}>{focus ? 'Exit focus' : 'Focus mode'}</button>
                  <button className="btn btn--ghost btn--sm" type="button" onClick={() => finish(false)}>End</button>
                </p>
              </>
            )}
            <Companion elapsed={r.elapsed} total={block.kind === 'deep' ? 45 * 60 : block.kind === 'two-minute' ? 120 : block.minutes * 60} />
          </div>
        </aside>
      )}
      {!block && focus && (
        <button className="btn btn--secondary btn--sm focus-exit" type="button" onClick={() => setFocus(false)}>Exit focus <kbd className="kbd">Esc</kbd></button>
      )}
      <Modal open={!!summary} onClose={() => setSummary(null)} title="Session summary"
        actions={<>
          <button className="btn btn--secondary" type="button" onClick={() => { setSummary(null); startBlock({ kind: 'block', unit: 'break', ifThen: 'Break: stand up, look away from the screen', minutes: 5 }); }}>5-minute break</button>
          <button className="btn btn--primary" type="button" onClick={() => setSummary(null)}>Done</button>
        </>}>
        {summary && (
          <div className="focus-summary">
            <p><b>{summary.minutes}</b> {summary.minutes === 1 ? 'minute' : 'minutes'} · <b>{summary.answers}</b> {summary.answers === 1 ? 'answer' : 'answers'}{summary.accuracy !== null && <> · <b>{Math.round(summary.accuracy * 100)}%</b> right</>}</p>
            {summary.improved
              ? <p>Most improved: <b>{summary.improved.title}</b>, {Math.round(summary.improved.from * 100)}% → {Math.round(summary.improved.to * 100)}%.</p>
              : <p>{summary.answers ? 'Answer a concept a few times in one block to see what improved most.' : 'Reading counts too; the next block can start with a quiz.'}</p>}
            {summary.ifThen && <p className="focus-summary__plan">Your plan: “{summary.ifThen}”</p>}
          </div>
        )}
      </Modal>
    </>
  );
}
