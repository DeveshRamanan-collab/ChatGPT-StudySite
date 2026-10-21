// Motion foundation (CLAUDE.md rules 2–6).
// One RAF: Lenis runs inside gsap.ticker with lagSmoothing(0); ScrollTrigger.update on Lenis scroll.
// Initialised on astro:page-load; every ScrollTrigger killed and Lenis destroyed on astro:before-swap.
// Motion dial: data-motion="full|calm|off" on <html>, persisted; prefers-reduced-motion → off unless overridden.
//   full: everything. calm: fades and scrubs only (no parallax, tilt, pins, positional movement).
//   off: every helper jumps to its final state.
import { setPrefs } from './prefs';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { Flip } from 'gsap/Flip';
import { CustomEase } from 'gsap/CustomEase';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

// DrawSVG / MorphSVG are registered by the explainer bases that use them (kept out of every page's bundle).
gsap.registerPlugin(ScrollTrigger, SplitText, Flip, CustomEase);

// Easing tokens mirrored from tokens.css.
export const EASE = {
  out: CustomEase.create('ss-out', 'M0,0 C0.23,1 0.32,1 1,1'),
  inout: CustomEase.create('ss-inout', 'M0,0 C0.77,0 0.175,1 1,1'),
  drawer: CustomEase.create('ss-drawer', 'M0,0 C0.32,0.72 0,1 1,1'),
};
export const DUR = { press: 0.16, micro: 0.18, ui: 0.24, panel: 0.42, scene: 1.1 };
export const STAGGER = 0.04;

export type MotionLevel = 'full' | 'calm' | 'off';
const KEY = 'studysite:motion';
const LEVELS: MotionLevel[] = ['full', 'calm', 'off'];

export function storedMotion(): MotionLevel | null {
  try {
    const v = localStorage.getItem(KEY);
    return LEVELS.includes(v as MotionLevel) ? (v as MotionLevel) : null;
  } catch {
    return null;
  }
}

export function resolveMotion(): MotionLevel {
  return storedMotion() ?? (matchMedia('(prefers-reduced-motion: reduce)').matches ? 'off' : 'full');
}

export const motion = (): MotionLevel => (document.documentElement.dataset.motion as MotionLevel) || resolveMotion();

export function setMotion(level: MotionLevel) {
  setPrefs({ motion: level }); // writes the studysite:motion mirror read before paint
  applyMotion(level);
}

function applyMotion(level: MotionLevel) {
  document.documentElement.dataset.motion = level;
  destroy();
  init();
  document.dispatchEvent(new CustomEvent('motionchange', { detail: level }));
}

// ---------- Lenis + ticker ----------
let lenis: Lenis | null = null;
let tick: ((time: number) => void) | null = null;
let ctx: gsap.Context | null = null;

export const getLenis = () => lenis;

function startLenis() {
  lenis = new Lenis({ lerp: 0.1, syncTouch: false, autoRaf: false, anchors: true });
  lenis.on('scroll', ScrollTrigger.update);
  tick = (time) => lenis?.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
}

function stopLenis() {
  if (tick) gsap.ticker.remove(tick);
  tick = null;
  lenis?.destroy();
  lenis = null;
}

// ---------- Helpers (each respects the dial) ----------
const scrollStart = 'top 85%';

/** Opacity + 12px lift, staggered; calm drops the lift; off shows the final state. */
export function reveal(targets: gsap.DOMTarget, opts: { trigger?: Element; stagger?: number } = {}) {
  const level = motion();
  // Long lists: only the first 16 items lift in (the rest are already in place): quieter, and it keeps dozens of
  // simultaneous opacity repaints out of the scroll (60fps at 4× CPU throttle).
  const els = gsap.utils.toArray<HTMLElement>(targets).slice(0, 16);
  if (!els.length || level === 'off') return null;
  return gsap.from(els, {
    opacity: 0,
    y: level === 'full' ? 12 : 0,
    duration: DUR.ui,
    ease: EASE.out,
    stagger: opts.stagger ?? STAGGER,
    scrollTrigger: { trigger: opts.trigger ?? els[0], start: scrollStart, toggleActions: 'play none none none' },
  });
}

/** Heading chars revealed through a clip mask, 12ms stagger; calm fades the whole heading; off no-op. */
export function splitReveal(el: HTMLElement) {
  const level = motion();
  if (level === 'off') return null;
  if (level === 'calm')
    return gsap.from(el, { opacity: 0, duration: DUR.ui, ease: EASE.out, scrollTrigger: { trigger: el, start: scrollStart } });
  const split = SplitText.create(el, { type: 'words,chars', mask: 'words', aria: 'auto' });
  return gsap.from(split.chars, {
    yPercent: 100,
    duration: DUR.ui * 2,
    ease: EASE.out,
    stagger: 0.012,
    scrollTrigger: { trigger: el, start: scrollStart },
    onComplete: () => split.revert(),
  });
}

/** Scroll-scrubbed tween (ease: none). Off: set straight to the end state. */
export function scrub(
  target: gsap.TweenTarget,
  vars: gsap.TweenVars,
  trigger: ScrollTrigger.Vars = {},
) {
  if (motion() === 'off') return gsap.set(target, vars);
  return gsap.to(target, { ...vars, ease: 'none', scrollTrigger: { start: 'top bottom', end: 'bottom top', scrub: true, ...trigger } });
}

/** Pin a scene for `length` viewport heights. Full only; calm and off skip pins. */
export function pin(trigger: Element, length = 1, vars: ScrollTrigger.Vars = {}) {
  if (motion() !== 'full') return null;
  return ScrollTrigger.create({ trigger, start: 'top top', end: `+=${length * 100}%`, pin: true, ...vars });
}

/** Parallax by depth factor (0.85 back, 1.15 front). Full only. */
export function parallax(el: Element, factor: number) {
  if (motion() !== 'full' || factor === 1) return null;
  const shift = (factor - 1) * 100;
  return gsap.fromTo(el, { yPercent: -shift }, { yPercent: shift, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
}

/** Flip layout change: capture, mutate, animate (240ms). Off: just mutate. */
export function flipTo(targets: gsap.DOMTarget, change: () => void, vars: Flip.FromToVars = {}) {
  if (motion() === 'off') {
    change();
    return null;
  }
  const state = Flip.getState(targets);
  change();
  return Flip.from(state, { duration: DUR.ui, ease: EASE.inout, absolute: false, ...vars });
}

/** Card tilt ≤ 3° + cursor-following highlight. Full motion and fine pointers only. Returns a cleanup. */
export function tilt(el: HTMLElement) {
  if (motion() !== 'full' || !matchMedia('(hover: hover) and (pointer: fine)').matches) return () => {};
  const max = 3;
  const rx = gsap.quickTo(el, 'rotationX', { duration: DUR.ui, ease: EASE.out });
  const ry = gsap.quickTo(el, 'rotationY', { duration: DUR.ui, ease: EASE.out });
  const y = gsap.quickTo(el, 'y', { duration: DUR.micro, ease: EASE.out });
  gsap.set(el, { transformPerspective: 1200 });
  const move = (e: PointerEvent) => {
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    rx((0.5 - py) * 2 * max);
    ry((px - 0.5) * 2 * max);
    el.style.setProperty('--mx', `${px * 100}%`);
    el.style.setProperty('--my', `${py * 100}%`);
  };
  const enter = () => { el.classList.add('is-tilting'); y(-2); };
  const leave = () => { el.classList.remove('is-tilting'); rx(0); ry(0); y(0); };
  el.addEventListener('pointerenter', enter);
  el.addEventListener('pointermove', move);
  el.addEventListener('pointerleave', leave);
  return () => {
    el.removeEventListener('pointerenter', enter);
    el.removeEventListener('pointermove', move);
    el.removeEventListener('pointerleave', leave);
    el.classList.remove('is-tilting');
    gsap.set(el, { clearProps: 'transform' });
  };
}

let cleanups: (() => void)[] = [];

// ---------- Declarative hooks: data attributes scanned on every page load ----------
function scan() {
  // Sibling groups reveal together: one trigger per [data-reveal] container.
  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    // With data-split-headings, headings get the char split and everything else the lift.
    const splitHeadings = el.hasAttribute('data-split-headings');
    const kids = el.dataset.reveal === 'children' ? [...el.children].filter((k) => !(splitHeadings && /^H[23]$/.test(k.tagName))) : el;
    reveal(kids, { trigger: el });
    if (splitHeadings) el.querySelectorAll<HTMLElement>(':scope > h2, :scope > h3').forEach((h) => splitReveal(h));
  });
  document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => splitReveal(el));
  document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => parallax(el, Number(el.dataset.parallax) || 1));
  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((el) => cleanups.push(tilt(el)));
  document.querySelectorAll<HTMLElement>('[data-hscroll]').forEach((el) => hscroll(el));
}

/** Horizontal scrubbed track (unit hub): pins the section and moves [data-hscroll-track] on x. Full + ≥1100px only. */
const hscrollOn = () => motion() === 'full' && innerWidth >= 1100;
export function hscroll(section: HTMLElement) {
  const track = section.querySelector<HTMLElement>('[data-hscroll-track]');
  if (!track || !hscrollOn()) return null;
  section.dataset.hscrollActive = '';
  const bar = section.querySelector<HTMLElement>('[data-hscroll-bar]');
  const length = Number(section.dataset.hscroll) || 3;
  return gsap.timeline({ scrollTrigger: { trigger: section, start: 'top top', end: `+=${length * 100}%`, pin: true, scrub: true, invalidateOnRefresh: true,
    // While the pinned scene is on screen, glass surfaces go opaque (html[data-scene]).
    onToggle: (st) => { if (st.isActive) document.documentElement.dataset.scene = 'pin'; else delete document.documentElement.dataset.scene; } } })
    .to(track, { x: () => -Math.max(0, track.scrollWidth - section.clientWidth), ease: 'none' }, 0)
    .fromTo(bar, { scaleX: 0 }, { scaleX: 1, ease: 'none' }, 0);
}

export function init() {
  document.documentElement.dataset.motion = motion();
  if (motion() === 'full') startLenis();
  ctx = gsap.context(scan);
  ScrollTrigger.refresh();
}

export function destroy() {
  delete document.documentElement.dataset.scene;
  cleanups.forEach((c) => c());
  cleanups = [];
  ctx?.revert();
  ctx = null;
  ScrollTrigger.getAll().forEach((t) => t.kill());
  stopLenis();
}

/** Expected trigger count for the current DOM and dial (used by tests). */
export function expectedTriggers() {
  const level = motion();
  if (level === 'off') return 0;
  const n = (s: string) => document.querySelectorAll(s).length;
  const parallaxN = level === 'full' ? [...document.querySelectorAll<HTMLElement>('[data-parallax]')].filter((e) => Number(e.dataset.parallax) !== 1).length : 0;
  const hscrollN = level === 'full' && innerWidth >= 1100 ? [...document.querySelectorAll('[data-hscroll]')].filter((e) => e.querySelector('[data-hscroll-track]')).length : 0;
  return n('[data-reveal]') + n('[data-split]') + n('[data-split-headings] > h2, [data-split-headings] > h3') + parallaxN + hscrollN;
}

let wired = false;
export function wire() {
  if (wired) return;
  wired = true;
  document.addEventListener('astro:page-load', init);
  document.addEventListener('astro:before-swap', (e) => {
    destroy();
    // Carry the dial across the swap so the incoming <html> never flashes the default.
    const nd = (e as unknown as { newDocument: Document }).newDocument.documentElement;
    nd.dataset.motion = motion();
    if (document.documentElement.dataset.theme) nd.dataset.theme = document.documentElement.dataset.theme;
  });
  // Header condense + reading-progress hairline: informational, so they track scroll in every dial state.
  const onScroll = () => {
    const y = scrollY;
    document.documentElement.classList.toggle('is-scrolled', y > 24);
    // Only when the "Reading progress line" setting is on (html[data-progress="on"]); off by default.
    if (document.documentElement.dataset.progress !== 'on') return;
    const max = document.documentElement.scrollHeight - innerHeight;
    const v = String(max > 0 ? Math.min(1, y / max) : 0);
    document.querySelectorAll<HTMLElement>('[data-read-progress], .toc__list').forEach((el) => el.style.setProperty('--progress', v));
  };
  addEventListener('scroll', onScroll, { passive: true });
  document.addEventListener('astro:page-load', onScroll);
  matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', () => {
    if (!storedMotion()) applyMotion(resolveMotion());
  });
  (window as unknown as { __motion: unknown }).__motion = {
    count: () => ScrollTrigger.getAll().length,
    expected: expectedTriggers,
    level: motion,
    lenis: () => !!lenis,
  };
}
