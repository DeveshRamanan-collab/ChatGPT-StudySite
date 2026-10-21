// Custom cursor (CLAUDE.md "Cursor system"). The cursor-following ambient glow was removed on 20 Oct 2026: plain paper.
// 8px ink dot at the pointer; a 36px ring following at lerp 0.15 (mix-blend-mode: difference).
// States: link/button → 56px ring filled accent-soft 40%; text → 2×24 I-beam; [data-cursor="drag"] → 44px
// dashed circle labelled "drag"; quiz option → soft rounded square matching the option's height.
// Buttons are magnetic (≤ 6px within 40px). Everything runs in gsap.ticker (the one RAF) and animates
// transform/opacity only. Enabled only with a fine pointer, motion = full and the Cursor setting on; otherwise the native cursor returns.
import { gsap } from 'gsap';
import { motion } from './motion';
import { prefs } from './prefs';

type State = 'default' | 'link' | 'text' | 'drag' | 'option';

const LERP = 0.15;
const RING = 56; // base size; the resting ring is scaled to 36px
const MAGNET_RADIUS = 40;
const MAGNET_MAX = 6;

let root: HTMLDivElement | null = null;
let ringEl: HTMLElement | null = null;
let dotEl: HTMLElement | null = null;
let enabled = false;
let visible = false;
const pointer = { x: -100, y: -100 };
const ring = { x: -100, y: -100 };
let state: State = 'default';
let optionSize = RING;
let magnet: { el: HTMLElement; x: number; y: number } | null = null;

const fine = () => matchMedia('(hover: hover) and (pointer: fine)').matches;
export const cursorEnabled = () => enabled;

function build() {
  root = document.createElement('div');
  root.className = 'cursor';
  root.setAttribute('aria-hidden', 'true');
  // Outer elements: translate only (written in tick). Inner children: every visual state, via custom properties.
  root.innerHTML =
    '<div class="cursor-ring"><span class="cursor-ring__shape"></span><span class="cursor-ring__square"></span><span class="cursor-ring__drag">drag</span></div>' +
    '<div class="cursor-dot"><span class="cursor-dot__shape"></span><span class="cursor-dot__beam"></span></div>';
  ringEl = root.firstElementChild as HTMLElement;
  dotEl = root.lastElementChild as HTMLElement;
}

function attach() {
  if (!root) build();
  if (!root!.isConnected) document.body.append(root!);
}

const TEXT = 'p, li, dd, dt, blockquote, td, th, h1, h2, h3, h4, figcaption, .callout';
const LINK = 'a, button, [role="button"], [role="tab"], [role="option"], label, summary, select, input[type="checkbox"], input[type="radio"]';

function classify(t: Element | null): State {
  if (!t) return 'default';
  const explicit = t.closest<HTMLElement>('[data-cursor]')?.dataset.cursor;
  if (explicit === 'drag' || explicit === 'text' || explicit === 'link' || explicit === 'default') return explicit;
  if (t.closest('[role="slider"], input[type="range"], [draggable="true"]')) return 'drag';
  const opt = t.closest<HTMLElement>('.option');
  if (opt && !(opt as HTMLButtonElement).disabled) {
    optionSize = opt.getBoundingClientRect().height;
    return 'option';
  }
  const link = t.closest(LINK);
  if (link && !(link as HTMLButtonElement).disabled) return 'link';
  if (t.closest('input, textarea, [contenteditable="true"]') || t.closest(TEXT)) return 'text';
  return 'default';
}

function setState(s: State) {
  if (!root) return;
  if (s === state && s !== 'option') return;
  state = s;
  root.dataset.state = s;
  root.style.setProperty('--ring-square', String(optionSize / RING));
}

function onMove(e: PointerEvent) {
  if (e.pointerType !== 'mouse') return;
  pointer.x = e.clientX;
  pointer.y = e.clientY;
  if (!visible) {
    visible = true;
    ring.x = pointer.x;
    ring.y = pointer.y;
    root?.classList.add('is-visible');
  }
  setState(classify(e.target as Element));
}
const onLeave = () => { visible = false; root?.classList.remove('is-visible'); };
const onDown = () => root?.classList.add('is-down');
const onUp = () => root?.classList.remove('is-down');

function findMagnet(): HTMLElement | null {
  let best: HTMLElement | null = null;
  let bestD = Infinity;
  for (const el of document.querySelectorAll<HTMLElement>('.btn:not(:disabled), [data-magnetic]')) {
    const r = el.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) continue;
    const dx = Math.max(r.left - pointer.x, 0, pointer.x - r.right);
    const dy = Math.max(r.top - pointer.y, 0, pointer.y - r.bottom);
    const d = Math.hypot(dx, dy);
    if (d <= MAGNET_RADIUS && d < bestD) { best = el; bestD = d; }
  }
  return best;
}

function releaseMagnet() {
  if (magnet) magnet.el.style.translate = '';
  magnet = null;
}

let frame = 0;
function tick() {
  if (!root) return;
  ring.x += (pointer.x - ring.x) * LERP;
  ring.y += (pointer.y - ring.y) * LERP;
  ringEl!.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0)`;
  dotEl!.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0)`;

  // Magnetic buttons: pulled toward the pointer by up to 6px, eased with the same lerp. Uses the
  // independent `translate` property so the CSS hover/press `transform` still composes.
  if (++frame % 3 === 0) {
    const el = visible ? findMagnet() : null;
    if (el !== magnet?.el) {
      releaseMagnet();
      if (el) magnet = { el, x: 0, y: 0 };
    }
  }
  if (magnet) {
    const r = magnet.el.getBoundingClientRect();
    const cx = r.left + r.width / 2 - magnet.x;
    const cy = r.top + r.height / 2 - magnet.y;
    const reach = Math.max(r.width, r.height) / 2 + MAGNET_RADIUS;
    const tx = gsap.utils.clamp(-MAGNET_MAX, MAGNET_MAX, ((pointer.x - cx) / reach) * MAGNET_MAX);
    const ty = gsap.utils.clamp(-MAGNET_MAX, MAGNET_MAX, ((pointer.y - cy) / reach) * MAGNET_MAX);
    magnet.x += (tx - magnet.x) * LERP;
    magnet.y += (ty - magnet.y) * LERP;
    magnet.el.style.translate = `${magnet.x.toFixed(2)}px ${magnet.y.toFixed(2)}px`;
  }
}

function enable() {
  if (enabled) return;
  enabled = true;
  attach();
  document.documentElement.classList.add('has-cursor');
  addEventListener('pointermove', onMove, { passive: true });
  addEventListener('pointerdown', onDown, { passive: true });
  addEventListener('pointerup', onUp, { passive: true });
  document.documentElement.addEventListener('pointerleave', onLeave);
  gsap.ticker.add(tick);
}

function disable() {
  if (!enabled) return;
  enabled = false;
  visible = false;
  document.documentElement.classList.remove('has-cursor');
  removeEventListener('pointermove', onMove);
  removeEventListener('pointerdown', onDown);
  removeEventListener('pointerup', onUp);
  document.documentElement.removeEventListener('pointerleave', onLeave);
  gsap.ticker.remove(tick);
  releaseMagnet();
  root?.remove();
  root?.classList.remove('is-visible');
}

export function syncCursor() {
  if (motion() === 'full' && fine() && prefs().cursor !== 'off') enable();
  else disable();
}

let wired = false;
export function wireCursor() {
  if (wired) return;
  wired = true;
  syncCursor();
  document.addEventListener('motionchange', syncCursor);
  document.addEventListener('studysite:prefs', syncCursor);
  matchMedia('(hover: hover) and (pointer: fine)').addEventListener('change', syncCursor);
  // The body is replaced on every client-side navigation: re-attach, and never leave a button displaced.
  document.addEventListener('astro:before-swap', releaseMagnet);
  document.addEventListener('astro:after-swap', () => {
    if (enabled) {
      attach();
      document.documentElement.classList.add('has-cursor');
    }
  });
}
