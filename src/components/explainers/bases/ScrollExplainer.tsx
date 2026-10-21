// ScrollExplainer base. A pure scene function draws the idea at time t ∈ [0, beats]; the learner moves t:
//   pinned (desktop, full motion): scroll scrubs t across N screens (ScrollTrigger pin + scrub, ease none);
//   paced (mobile / calm): Next and Back tween t one beat at a time;
//   off: final frame with every caption stacked beneath it.
// Opens with a 20-second terms beat; ends with a one-question check.
// 200-features pass: paced playback controls (play/pause, speed, replay this step — 101, 35), every step as still
// frames (109), a link to the current step (?step=N, 115) and a prediction pause before the last step (33, 96).
// Scroll is never animated: in the pinned layout only the stills view is added.
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import '../../../styles/explainer-extras.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { pinTop, useExplainer } from '../context';
import { ExplainerCheck, type CheckOption } from './ExplainerCheck';
import { TermsBeat, type Term } from './TermsBeat';

gsap.registerPlugin(ScrollTrigger);

export interface Beat { caption: string }

interface Props {
  terms: Term[];
  beats: Beat[];
  /** Pure: draw the scene at time t (0 = start of beat 1, beats.length = end). */
  scene: (t: number) => ReactNode;
  check: { question: string; options: CheckOption[] };
  label: string;
}

export function ScrollExplainer({ terms, beats, scene, check, label }: Props) {
  const { layout, motion } = useExplainer();
  const n = beats.length;
  const [t, setT] = useState(motion === 'off' ? n : 0);
  const [started, setStarted] = useState(motion === 'off' || layout === 'pinned');
  const stage = useRef<HTMLDivElement>(null);
  const proxy = useRef({ t: 0 });
  const beat = Math.min(n - 1, Math.floor(t + 1e-6));

  // Pinned: scroll scrubs time.
  useLayoutEffect(() => {
    if (layout !== 'pinned' || motion === 'off' || !stage.current) return;
    const top = pinTop();
    stage.current.style.setProperty('--pin-top', `${top}px`);
    const st = ScrollTrigger.create({
      trigger: stage.current,
      start: `top top+=${top}`,
      end: `+=${n * 100}%`,
      pin: true,
      scrub: true,
      onUpdate: (self) => setT(self.progress * n),
    });
    return () => st.kill();
  }, [layout, motion, n]);

  // Paced: tween between beats.
  const go = (to: number) => {
    const target = Math.max(0, Math.min(n, to));
    if (motion === 'off') return setT(target);
    gsap.to(proxy.current, { t: target, duration: motion === 'calm' ? 0.2 : 0.6, ease: 'power2.inOut', onUpdate: () => setT(proxy.current.t) });
  };
  useEffect(() => { proxy.current.t = t; }, [t]);

  const done = t >= n - 1e-3;

  // Playback (paced only): auto-advance one beat at a time while playing; speed scales the dwell on each beat.
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [frames, setFrames] = useState(false);
  const [predict, setPredict] = useState<'none' | 'ask' | 'done'>('none');
  const [guess, setGuess] = useState('');
  const settled = Math.abs(t - Math.round(t)) < 1e-3;
  const next = () => {
    const to = Math.floor(t + 1e-3) + 1;
    // Prediction pause: before the last step, ask once what the learner expects to happen.
    if (n > 2 && to === n - 1 && predict === 'none') { setPlaying(false); setPredict('ask'); return; }
    go(to);
  };
  useEffect(() => {
    if (!playing || layout !== 'paced' || !settled) return;
    if (done) { setPlaying(false); return; }
    const id = setTimeout(next, 2600 / speed);
    return () => clearTimeout(id);
  }); // re-armed each render while playing
  // Saved state: the current step lives in ?step=N so a link (or a reload) returns to it.
  useEffect(() => {
    const q = new URLSearchParams(location.search).get('step');
    const k = q ? Math.max(1, Math.min(n, parseInt(q, 10) || 1)) : 0;
    if (k && layout === 'paced') { setStarted(true); setT(k - 1); proxy.current.t = k - 1; setPredict('done'); }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (layout !== 'paced' || !started || !settled) return;
    const u = new URL(location.href);
    u.searchParams.set('step', String(beat + 1));
    history.replaceState(history.state, '', u);
  }, [beat, settled, started, layout]);
  // Replay the transition into the current step only (not the whole explainer).
  const replay = () => { const k = Math.round(t); if (k < 1) return; setPlaying(false); setT(k - 1); proxy.current.t = k - 1; requestAnimationFrame(() => go(k)); };
  const copyLink = () => { try { navigator.clipboard?.writeText(location.href); } catch {} };
  const stills = (
    <ol className="xs-frames" aria-label={`${label}: every step`}>
      {beats.map((b, i) => (
        <li key={i} className="xs-frames__frame">
          <figure className="xs-frames__stage" aria-hidden="true">{scene(i + 1)}</figure>
          <p className="xs-frames__caption"><span className="mono">{i + 1}/{n}</span> {b.caption}</p>
        </li>
      ))}
    </ol>
  );

  if (motion === 'off')
    return (
      <div className="xs xs--off">
        <TermsBeat terms={terms} />
        <figure className="xs__stage" aria-label={label}>{scene(n)}</figure>
        <ol className="xs__captions">{beats.map((b, i) => <li key={i}>{b.caption}</li>)}</ol>
        <p className="xs-tools"><button type="button" className="btn btn--ghost btn--sm" aria-pressed={frames} onClick={() => setFrames((f) => !f)}>{frames ? 'Hide the steps' : 'See every step'}</button></p>
        {frames && stills}
        <ExplainerCheck {...check} />
      </div>
    );

  return (
    <div className="xs" data-layout={layout}>
      {layout === 'paced' && !started ? (
        <TermsBeat terms={terms} onStart={() => setStarted(true)} />
      ) : (
        <>
          {layout === 'pinned' && <TermsBeat terms={terms} />}
          <div className="xs__pin" ref={stage}>
            <figure className="xs__stage" aria-label={label}>{scene(t)}</figure>
            <p className="xs__caption" key={beat} aria-live="polite">
              <span className="xs__beat mono">{beat + 1}/{n}</span> {beats[beat].caption}
            </p>
            {layout === 'paced' && predict === 'ask' && (
              <div className="xs-predict" role="group" aria-label="Predict the last step">
                <label className="xs-predict__label" htmlFor={`xs-guess-${label}`}>Before the last step: what do you think happens?</label>
                <input id={`xs-guess-${label}`} className="xs-predict__input" value={guess} onChange={(e) => setGuess(e.target.value)} placeholder="One line is enough (optional)" autoComplete="off" />
                <button type="button" className="btn btn--secondary btn--sm" onClick={() => { setPredict('done'); go(n - 1); }}>Show me</button>
              </div>
            )}
            {layout === 'paced' && predict === 'done' && guess && done && <p className="xs-predict__yours">You predicted: “{guess}”</p>}
            {layout === 'paced' && (
              <div className="xs__nav">
                <button type="button" className="btn btn--ghost btn--sm" disabled={t <= 0} onClick={() => { setPlaying(false); go(Math.ceil(t - 1e-3) - 1); }}>Back</button>
                <button type="button" className="btn btn--secondary btn--sm" disabled={done || predict === 'ask'} onClick={next}>Next</button>
                <span className="xs-play" role="group" aria-label="Playback">
                  <button type="button" className="btn btn--ghost btn--sm" aria-pressed={playing} disabled={done || predict === 'ask'} onClick={() => setPlaying((p) => !p)}>{playing ? 'Pause' : 'Play'}</button>
                  <label className="xs-play__speed"><span className="visually-hidden">Speed</span>
                    <select value={speed} onChange={(e) => setSpeed(Number(e.target.value))}>
                      <option value={0.5}>0.5×</option><option value={1}>1×</option><option value={1.5}>1.5×</option>
                    </select>
                  </label>
                  <button type="button" className="btn btn--ghost btn--sm" disabled={t <= 0} onClick={replay}>Replay step</button>
                  <button type="button" className="btn btn--ghost btn--sm" onClick={() => { setPlaying(false); setPredict('none'); go(0); }}>Restart</button>
                  <button type="button" className="btn btn--ghost btn--sm" onClick={copyLink} title="Copies a link that opens this step">Link to step</button>
                </span>
              </div>
            )}
          </div>
          <p className="xs-tools"><button type="button" className="btn btn--ghost btn--sm" aria-pressed={frames} onClick={() => setFrames((f) => !f)}>{frames ? 'Hide the steps' : 'See every step'}</button></p>
          {frames && stills}
          {(done || layout === 'pinned') && <ExplainerCheck {...check} />}
        </>
      )}
    </div>
  );
}
