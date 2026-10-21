// Listening practice (features 186, 102) on /<unit>/listen, tab "Listen": the browser reads a question (an MCQ stem,
// a true/false statement or a short-answer prompt), leaves a chosen think time (a shrinking arc shows it), then reads
// the answer (the right option and why it is right, or the model answer's first two sentences). Captions follow the
// speech sentence by sentence and are independent of sound: either can be off. Keyboard: Space plays/pauses, N next,
// R repeat. Questions from all weeks are interleaved; ?week= or ?concept= narrows the set.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { loadBank, asChoice, type Bank, type Question } from '../quiz/types';
import { TimerArc } from '../ui/TimerArc';
import { speechSupported } from '../../lib/speech';
import { markFormat } from '../../lib/format-track';
import { say, hush, wait, sentences, plain, readPrefs, writePrefs, englishVoices, DEFAULT_PREFS, RATE_MIN, RATE_MAX, THINK_TIMES, type ListenPrefs } from './say';
import '../../styles/audio.css';

export interface ListenItem { id: string; concept: string; week?: string; kind: 'mcq' | 'truefalse' | 'short'; ask: string; answer: string }

/** Stems that cannot be answered without hearing the choices ("Which of the following…"). */
const NEEDS_CHOICES = /\b(following|which (one|statement|option|of these|is (the )?(most|least|best|correct|incorrect))|best (describes|states|captures|explains|reflects)|most (accurate|likely|consistent)|correct statement|incorrect|not true|except)\b/i;
const end = (s: string) => { const t = plain(s); return !t || /[.!?]["”’)]*$/.test(t) ? t : `${t}.`; };

/** The spoken question and answer for a bank item (null for types that do not work by ear). */
export function listenItem(q: Question): ListenItem | null {
  if (q.type === 'mcq' || q.type === 'truefalse') {
    const { stem, options } = asChoice(q);
    const right = options.find((o) => o.correct);
    if (!right || !stem.trim()) return null;
    let ask = q.type === 'truefalse' ? `True or false? ${end(stem)}` : end(stem);
    if (q.type === 'mcq' && NEEDS_CHOICES.test(stem)) ask += ` ${options.map((o, i) => `${'ABCDEFGH'[i]}: ${end(o.text)}`).join(' ')}`;
    const answer = q.type === 'truefalse' ? `${right.text}. ${end(right.why)}` : `The answer: ${end(right.text)} ${end(right.why)}`;
    return { id: q.id, concept: q.concept, week: q.week, kind: q.type, ask, answer };
  }
  if (q.type === 'short' && q.prompt.trim() && q.model.trim()) {
    return { id: q.id, concept: q.concept, week: q.week, kind: 'short', ask: end(q.prompt), answer: `A good answer would say: ${sentences(q.model).slice(0, 2).join(' ')}` };
  }
  return null;
}

function shuffle<T>(xs: T[]): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

type Phase = 'idle' | 'question' | 'think' | 'answer' | 'heard' | 'done';
const PHASE: Record<Phase, string> = {
  idle: 'Ready when you are',
  question: 'Listen to the question',
  think: 'Think of your answer',
  answer: 'The answer',
  heard: 'Heard the answer',
  done: 'End of the set',
};

function Caption({ text, upTo, current }: { text: string; upTo: number; current: number }) {
  const list = useMemo(() => sentences(text), [text]);
  return (
    <p className="listen__cap" data-live={current >= 0 || undefined}>
      {list.slice(0, upTo + 1).map((s, i) => (
        <span key={i} className="listen__sent" data-current={i === current || undefined} data-choice={/^[A-H]: /.test(s) || undefined}>{s} </span>
      ))}
    </p>
  );
}

export default function ListenQuiz({ unit }: { unit: string }) {
  const [bank, setBank] = useState<Bank | null>(null);
  const [failed, setFailed] = useState(false);
  const [scope, setScope] = useState('all');
  const [concept, setConcept] = useState<string | null>(null);
  const [items, setItems] = useState<ListenItem[]>([]);
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>('idle');
  const [playing, setPlaying] = useState(false);
  const [cap, setCap] = useState({ q: -1, a: -1, part: 'q' as 'q' | 'a' });
  const [thinkLeft, setThinkLeft] = useState(DEFAULT_PREFS.think * 1000);
  const [prefs, setPrefsState] = useState<ListenPrefs>(DEFAULT_PREFS);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [canSpeak, setCanSpeak] = useState(true);

  const run = useRef(0);
  const pos = useRef({ idx: 0, phase: 'idle' as Phase, sentence: 0, thinkLeft: 0 });
  const itemsRef = useRef<ListenItem[]>([]);
  const prefsRef = useRef(prefs);
  itemsRef.current = items;
  prefsRef.current = prefs;

  useEffect(() => {
    const p = readPrefs();
    setPrefsState(p);
    setThinkLeft(p.think * 1000);
    setCanSpeak(speechSupported());
    const q = new URLSearchParams(location.search);
    if (q.get('week')) setScope(q.get('week')!);
    if (q.get('concept')) setConcept(q.get('concept'));
    loadBank(unit).then(setBank).catch(() => setFailed(true));
    if (speechSupported()) {
      const v = () => setVoices(englishVoices());
      v();
      speechSynthesis.addEventListener('voiceschanged', v);
      return () => { speechSynthesis.removeEventListener('voiceschanged', v); run.current++; hush(); };
    }
    return () => { run.current++; hush(); };
  }, [unit]);

  // The set: every question that works by ear, narrowed by week or concept, interleaved.
  const pool = useMemo(() => (bank ? bank.questions.map(listenItem).filter((x): x is ListenItem => !!x) : []), [bank]);
  const weeks = useMemo(() => (bank ? bank.weeks.filter((w) => pool.some((it) => it.week === w.id)).sort((a, b) => a.number - b.number) : []), [bank, pool]);
  useEffect(() => {
    if (!bank) return;
    run.current++;
    hush();
    const inConcept = concept ? pool.filter((it) => it.concept === concept) : [];
    const set = inConcept.length ? inConcept : pool.filter((it) => scope === 'all' || it.week === scope);
    setItems(shuffle(set));
    setIdx(0);
    setPhase('idle');
    setPlaying(false);
    setCap({ q: -1, a: -1, part: 'q' });
    pos.current = { idx: 0, phase: 'idle', sentence: 0, thinkLeft: 0 };
  }, [bank, pool, scope, concept]);

  const setP = (ph: Phase) => { pos.current.phase = ph; setPhase(ph); };

  const play = useCallback(async (start: number, from: 'question' | 'think' | 'answer', resume?: { sentence?: number; thinkLeft?: number }) => {
    const my = ++run.current;
    const list = itemsRef.current;
    let i = start;
    let ph: 'question' | 'think' | 'answer' = from;
    let r = resume;
    setPlaying(true);
    for (;;) {
      if (i >= list.length) { hush(); setP('done'); setPlaying(false); return; }
      const it = list[i];
      setIdx(i);
      pos.current.idx = i;
      const voice = () => ({ rate: prefsRef.current.rate, voice: prefsRef.current.voice, sound: prefsRef.current.sound });
      if (ph === 'question') {
        setP('question');
        if (!r?.sentence) setCap({ q: 0, a: -1, part: 'q' });
        const ok = await say(it.ask, { ...voice(), from: r?.sentence, onSentence: (k) => { pos.current.sentence = k; setCap({ q: k, a: -1, part: 'q' }); } });
        if (!ok || my !== run.current) return;
        ph = 'think';
        r = undefined;
      }
      if (ph === 'think') {
        setP('think');
        setCap((c) => ({ ...c, q: sentences(it.ask).length - 1, part: 'q' }));
        const total = prefsRef.current.think * 1000;
        const ok = await wait(r?.thinkLeft ?? total, (left) => { pos.current.thinkLeft = left; setThinkLeft(left); });
        if (!ok || my !== run.current) return;
        ph = 'answer';
        r = undefined;
      }
      setP('answer');
      markFormat(it.concept, 'listen');
      if (!r?.sentence) setCap((c) => ({ ...c, a: 0, part: 'a' }));
      const ok = await say(it.answer, { ...voice(), from: r?.sentence, onSentence: (k) => { pos.current.sentence = k; setCap((c) => ({ ...c, a: k, part: 'a' })); } });
      if (!ok || my !== run.current) return;
      setP('heard');
      if (!prefsRef.current.autoNext) { setPlaying(false); return; }
      const next = await wait(1500);
      if (!next || my !== run.current) return;
      i += 1;
      ph = 'question';
      r = undefined;
      setThinkLeft(prefsRef.current.think * 1000);
    }
  }, []);

  const pause = useCallback(() => { run.current++; hush(); setPlaying(false); }, []);
  const resume = useCallback(() => {
    const { idx: i, phase: ph, sentence, thinkLeft: left } = pos.current;
    if (ph === 'question' || ph === 'answer') play(i, ph, { sentence });
    else if (ph === 'think') play(i, 'think', { thinkLeft: left });
    else if (ph === 'heard') { setThinkLeft(prefsRef.current.think * 1000); play(i + 1, 'question'); }
    else if (ph === 'done') { setThinkLeft(prefsRef.current.think * 1000); play(0, 'question'); }
    else play(i, 'question');
  }, [play]);
  const toggle = useCallback(() => (playing ? pause() : resume()), [playing, pause, resume]);
  const again = useCallback(() => { setThinkLeft(prefsRef.current.think * 1000); play(pos.current.idx, 'question'); }, [play]);
  const next = useCallback(() => {
    const n = Math.min(pos.current.idx + 1, itemsRef.current.length);
    setThinkLeft(prefsRef.current.think * 1000);
    play(n, 'question');
  }, [play]);

  // Space plays/pauses, N next, R repeat (never while typing; a focused button keeps its own Space).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || !itemsRef.current.length) return;
      const t = e.target as HTMLElement | null;
      if (t?.closest('input, textarea, select, [contenteditable="true"], dialog')) return;
      if (e.key === ' ' && !t?.closest('button, a, summary')) { e.preventDefault(); toggle(); }
      else if (e.key.toLowerCase() === 'n') { e.preventDefault(); next(); }
      else if (e.key.toLowerCase() === 'r') { e.preventDefault(); again(); }
    };
    const onSwap = () => { run.current++; hush(); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('astro:before-swap', onSwap);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('astro:before-swap', onSwap); };
  }, [toggle, next, again]);

  // Preference changes apply at once: while speaking, the current sentence starts again with the new voice or rate.
  const restartTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  function setPrefs(patch: Partial<ListenPrefs>, restart = false) {
    const p = { ...prefsRef.current, ...patch };
    prefsRef.current = p;
    setPrefsState(p);
    writePrefs(p);
    if (patch.think && (pos.current.phase === 'idle' || pos.current.phase === 'heard' || pos.current.phase === 'done' || pos.current.phase === 'question')) setThinkLeft(p.think * 1000);
    if (restart && playing && (pos.current.phase === 'question' || pos.current.phase === 'answer')) {
      clearTimeout(restartTimer.current);
      restartTimer.current = setTimeout(() => { if (pos.current.phase === 'question' || pos.current.phase === 'answer') play(pos.current.idx, pos.current.phase, { sentence: pos.current.sentence }); }, 250);
    }
  }

  const it = items[idx];
  const n = items.length;
  const conceptTitle = concept ? bank?.concepts[concept]?.title : undefined;
  const narrowed = !!concept && items.length > 0 && items.every((x) => x.concept === concept);
  const showAnswer = phase === 'answer' || phase === 'heard';
  const label = !bank && !failed ? 'Loading questions…' : failed ? 'The questions could not be loaded.' : !n ? 'No questions to listen to here yet.' : phase === 'done' ? PHASE.done : `Question ${idx + 1} of ${n} · ${PHASE[phase]}${!playing && phase !== 'idle' && phase !== 'heard' ? ' · paused' : ''}`;
  const playLabel = playing ? 'Pause' : phase === 'idle' ? 'Play' : phase === 'done' ? 'Play again' : phase === 'heard' ? 'Continue' : 'Resume';

  return (
    <section className="listen" aria-label="Listening practice" data-phase={phase} data-playing={playing || undefined} data-ready={bank && items.length ? '' : undefined}>
      <div className="listen__scope">
        <label className="listen__field">
          <span className="label">Questions from</span>
          <select className="listen__select" value={narrowed ? 'concept' : scope} disabled={!bank} onChange={(e) => { setConcept(null); setScope(e.target.value); }}>
            {narrowed && <option value="concept">Just “{conceptTitle ?? 'this concept'}”</option>}
            <option value="all">All weeks, mixed</option>
            {weeks.map((w) => <option key={w.id} value={w.id}>Week {w.number} · {w.topic}</option>)}
          </select>
        </label>
        <span className="listen__count mono" aria-live="polite">{n ? `${n} question${n === 1 ? '' : 's'}` : ''}</span>
      </div>

      <div className="listen__stage">
        <div className="listen__status" data-thinking={phase === 'think' || undefined}>
          <TimerArc total={prefs.think} remaining={phase === 'think' ? thinkLeft / 1000 : prefs.think} size={64} label="Think time" />
          <p className="listen__phase" aria-live="polite">{label}</p>
        </div>
        <div className="listen__captions" aria-live={prefs.sound ? 'off' : 'polite'} data-captions={prefs.captions ? 'on' : 'off'}>
          {!prefs.captions ? (
            <p className="listen__note">Captions are off.{!prefs.sound ? ' Sound is off too: turn one of them on to follow along.' : ''}</p>
          ) : it && phase !== 'idle' && phase !== 'done' ? (
            <>
              <p className="label listen__cap-label">Question</p>
              <Caption text={it.ask} upTo={cap.q} current={cap.part === 'q' && phase === 'question' ? cap.q : -1} />
              {showAnswer && cap.a >= 0 && (
                <>
                  <p className="label listen__cap-label">Answer</p>
                  <Caption text={it.answer} upTo={cap.a} current={phase === 'answer' ? cap.a : -1} />
                </>
              )}
            </>
          ) : (
            <p className="listen__note">
              {phase === 'done'
                ? `That was all ${n} question${n === 1 ? '' : 's'} in this set. Play again, or choose another week above.`
                : 'Press Play. Each question is read aloud, then you get time to think, then the answer is read.'}
            </p>
          )}
        </div>
      </div>

      <div className="listen__controls">
        <button className="btn btn--primary listen__play" type="button" onClick={toggle} disabled={!n} aria-pressed={playing} aria-keyshortcuts="Space">{playLabel}</button>
        <button className="btn btn--secondary" type="button" onClick={again} disabled={!n || phase === 'done'} aria-keyshortcuts="R">Repeat</button>
        <button className="btn btn--secondary" type="button" onClick={next} disabled={!n || phase === 'done'} aria-keyshortcuts="N">Next</button>
        <span className="listen__keys" aria-hidden="true"><kbd className="kbd">Space</kbd> play · <kbd className="kbd">N</kbd> next · <kbd className="kbd">R</kbd> repeat</span>
      </div>

      <div className="listen__prefs">
        <fieldset className="listen__think">
          <legend className="label">Think time</legend>
          {THINK_TIMES.map((t) => (
            <label key={t} className="listen__opt">
              <input type="radio" name="listen-think" value={t} checked={prefs.think === t} onChange={() => setPrefs({ think: t })} />
              <span>{t} s</span>
            </label>
          ))}
        </fieldset>
        <div className="listen__toggles" role="group" aria-label="Sound and captions">
          <button className="btn btn--ghost btn--sm listen__toggle" type="button" aria-pressed={prefs.sound} disabled={!canSpeak} onClick={() => setPrefs({ sound: !prefs.sound }, true)}>
            Sound {prefs.sound ? 'on' : 'off'}
          </button>
          <button className="btn btn--ghost btn--sm listen__toggle" type="button" aria-pressed={prefs.captions} onClick={() => setPrefs({ captions: !prefs.captions })}>
            Captions {prefs.captions ? 'on' : 'off'}
          </button>
        </div>
      </div>
      {!canSpeak && <p className="listen__note listen__note--quiet">This browser has no speech voice, so the questions run as captions only.</p>}

      <details className="listen__more">
        <summary>Voice and pace</summary>
        <div className="listen__more-body">
          <label className="listen__field">
            <span className="label">Speed <span className="mono listen__rate">{prefs.rate.toFixed(1)}×</span></span>
            <input className="listen__range" type="range" min={RATE_MIN} max={RATE_MAX} step={0.1} value={prefs.rate} onChange={(e) => setPrefs({ rate: Number(e.target.value) }, true)} aria-valuetext={`${prefs.rate.toFixed(1)} times`} />
          </label>
          <label className="listen__field">
            <span className="label">Voice</span>
            <select className="listen__select" value={prefs.voice} disabled={!voices.length} onChange={(e) => setPrefs({ voice: e.target.value }, true)}>
              <option value="">Default{voices[0] ? ` (${voices[0].name})` : ''}</option>
              {voices.map((v) => <option key={v.voiceURI} value={v.voiceURI}>{v.name} · {v.lang}</option>)}
            </select>
          </label>
          <label className="listen__check">
            <input type="checkbox" checked={prefs.autoNext} onChange={(e) => setPrefs({ autoNext: e.target.checked })} />
            <span>Go on to the next question by itself</span>
          </label>
          <p className="listen__note listen__note--quiet">Speech uses your browser’s own voices; nothing is sent anywhere. It stops if the screen locks.</p>
        </div>
      </details>
    </section>
  );
}
