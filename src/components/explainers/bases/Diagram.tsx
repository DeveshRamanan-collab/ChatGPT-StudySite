// Diagram base: a self-drawing SVG. The module draws its figure with groups marked `data-step="1..N"`; each step's
// strokes draw on (DrawSVG) and its text fades in, in order, with one caption per step.
//   pinned (desktop, full motion): scroll scrubs the drawing (ScrollTrigger pin + scrub);
//   paced (mobile / calm): Next and Back play one step at a time (calm: quicker, no stagger);
//   off: the finished figure with every caption stacked beneath it.
// Labels marked `data-label="<id>"` can be masked later for image-occlusion cards.
import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { pinTop, useExplainer } from '../context';
import { ExplainerCheck, type CheckOption } from './ExplainerCheck';
import { TermsBeat, type Term } from './TermsBeat';

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

export interface DiagramStep { caption: string }

interface Props {
  terms: Term[];
  steps: DiagramStep[];
  /** The full figure: an <svg> whose groups carry data-step (1-based). */
  figure: ReactNode;
  check: { question: string; options: CheckOption[] };
  label: string;
}

const STROKES = 'path, line, circle, ellipse, rect, polyline, polygon';

export function Diagram({ terms, steps, figure, check, label }: Props) {
  const { layout, motion } = useExplainer();
  const n = steps.length;
  const [step, setStep] = useState(motion === 'off' ? n : layout === 'pinned' ? 1 : 0);
  const stage = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  // Build one timeline: a label per step, then that step's strokes drawing on and its text fading in.
  useLayoutEffect(() => {
    if (motion === 'off' || !stage.current) return;
    const el = stage.current;
    const t = gsap.timeline({ paused: true });
    t.addLabel('s0');
    for (let k = 1; k <= n; k++) {
      const g = el.querySelector(`[data-step="${k}"]`);
      if (g) {
        const strokes = g.querySelectorAll(STROKES);
        const text = g.querySelectorAll('text, foreignObject');
        if (strokes.length) t.fromTo(strokes, { drawSVG: '0%' }, { drawSVG: '100%', duration: 1, ease: 'none', stagger: motion === 'calm' ? 0 : 0.15 });
        if (text.length) t.fromTo(text, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'none' }, strokes.length ? '-=0.3' : undefined);
      }
      t.addLabel(`s${k}`);
    }
    tl.current = t;
    let st: ScrollTrigger | undefined;
    if (layout === 'pinned') {
      const top = pinTop();
      el.style.setProperty('--pin-top', `${top}px`);
      st = ScrollTrigger.create({
        trigger: el, start: `top top+=${top}`, end: `+=${n * 80}%`, pin: true, scrub: true, animation: t,
        onUpdate: (self) => setStep(Math.max(1, Math.min(n, Math.ceil(self.progress * n - 1e-6)))),
      });
    }
    return () => { st?.kill(); t.kill(); tl.current = null; };
  }, [layout, motion, n]);

  // Paced: play to the chosen step.
  const go = (k: number) => {
    const to = Math.max(0, Math.min(n, k));
    setStep(to);
    const t = tl.current;
    if (!t) return;
    t.tweenTo(`s${to}`, { duration: motion === 'calm' ? 0.25 : Math.min(1.6, Math.abs(t.labels[`s${to}`] - t.time()) || 0.4), ease: 'power1.inOut' });
  };

  if (motion === 'off')
    return (
      <div className="xd xd--off">
        <TermsBeat terms={terms} />
        <figure className="xd__stage" aria-label={label}>{figure}</figure>
        <ol className="xs__captions">{steps.map((s, i) => <li key={i}>{s.caption}</li>)}</ol>
        <ExplainerCheck {...check} />
      </div>
    );

  const shown = Math.max(1, step);
  return (
    <div className="xd" data-layout={layout}>
      <TermsBeat terms={terms} />
      <div className="xd__pin" ref={stage}>
        <figure className="xd__stage" aria-label={label} data-step-now={step}>{figure}</figure>
        <p className="xs__caption" key={shown} aria-live="polite">
          {step === 0 ? 'Press Next to draw the diagram.' : <><span className="xs__beat mono">{shown}/{n}</span> {steps[shown - 1].caption}</>}
        </p>
        {layout === 'paced' && (
          <div className="xs__nav">
            <button type="button" className="btn btn--ghost btn--sm" disabled={step <= 0} onClick={() => go(step - 1)}>Back</button>
            <button type="button" className="btn btn--secondary btn--sm" disabled={step >= n} onClick={() => go(step + 1)}>Next</button>
          </div>
        )}
      </div>
      <ExplainerCheck {...check} />
    </div>
  );
}
