/*
 * SCENE: Intro — "four units out of one point of light" (full brief: docs/scenes/intro.md)
 * LENGTH: 450vh, sticky stage inside the section (pinned), motion = full only
 * BEATS: 4 on one GSAP timeline scrubbed by ScrollTrigger (ease: none)
 * INTENT: everything studied is one connected body of knowledge that resolves into the four exams
 * SUBJECT: the amber point of light → brightest node → the cluster of the nearest exam
 * BEAT 1 0–20%: single amber point; wordmark reveals by character (clip-path); caption 1
 * BEAT 2 20–50%: ink orbit lines draw in, ~120 nodes fade in on the orbits, slow rotation; caption 2
 * BEAT 3 50–80%: nodes drift into four clusters, camera dolly-in 15%, unit labels appear; caption 3
 * BEAT 4 80–100%: canvas fades; the cluster labels Flip into the real unit cards (900ms, ease-out)
 * CAMERA: fov 38 (≈35mm), z 12 → 10.2, pointer orbit ±3°, never cuts
 * LIGHT: one amber halo (additive sprite) 0.6 → 1.0; paper background; grain 3% + vignette 8% as a CSS overlay
 * SOUND: none
 * REDUCED MOTION: never mounted (motion ≠ full or prefers-reduced-motion): the unit cards show directly
 * BUDGET: three vendor chunk (shared) + this module; 3 draw calls; DPR ≤ 1.5; paused off-screen; ≥95% frames < 16.7ms
 */
import {
  AdditiveBlending, BufferAttribute, BufferGeometry, CanvasTexture, Color, LineBasicMaterial, LineSegments,
  PerspectiveCamera, Points, PointsMaterial, Scene, Sprite, SpriteMaterial, Vector3, WebGLRenderer,
} from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(ScrollTrigger, Flip);

export interface IntroUnit { id: string; code: string; name: string; n: number }
const N = 120;
let INK = new Color('#1F1B16');
const AMBER = new Color('#E6873F');
const DAYKEY = 'studysite:intro-day';
const sydneyDay = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Australia/Sydney' }).format(new Date());

export function shouldPlay() {
  try {
    if (document.documentElement.dataset.motion !== 'full') return false;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    if (localStorage.getItem(DAYKEY) === sydneyDay()) return false;
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch { return false; }
}

function dotTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d')!;
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.45, 'rgba(255,255,255,.55)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  return new CanvasTexture(c);
}

// Deterministic PRNG so the constellation is the same every day.
function rng(seed: number) { return () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32); }

/** Mounts the film into section[data-intro]. Returns a cleanup. */
export function mountIntro(section: HTMLElement, units: IntroUnit[], onDone: () => void) {
  try { localStorage.setItem(DAYKEY, sydneyDay()); } catch {}
  const readInk = () => new Color(getComputedStyle(document.documentElement).getPropertyValue('--ink').trim() || '#1F1B16');
  INK = readInk();
  // Scenes run without glass (html[data-scene] makes every glass surface opaque; see CLAUDE.md "Glass").
  document.documentElement.dataset.scene = 'intro';
  const stage = section.querySelector<HTMLElement>('[data-intro-stage]')!;
  const canvas = section.querySelector<HTMLCanvasElement>('canvas')!;
  const labels = [...section.querySelectorAll<HTMLElement>('[data-intro-label]')];
  const captions = [...section.querySelectorAll<HTMLElement>('[data-intro-caption]')];
  const chars = [...section.querySelectorAll<HTMLElement>('[data-intro-char]')];

  const renderer = new WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(1.5, devicePixelRatio));
  const scene = new Scene();
  const camera = new PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 0, 12);

  // Node targets: origin (beat 1), orbits (beat 2), clusters (beat 3).
  const rand = rng(11);
  const orbit = new Float32Array(N * 3), cluster = new Float32Array(N * 3), pos = new Float32Array(N * 3), col = new Float32Array(N * 3);
  const rings = 5;
  const raw = units.reduce((s, u) => s + u.n, 0) || 1;
  const weight = (u: IntroUnit) => Math.max(u.n, raw * 0.15);
  const total = units.reduce((s, u) => s + weight(u), 0);
  const owner: number[] = [];
  let acc = 0;
  units.forEach((u, i) => { const k = i === units.length - 1 ? N - acc : Math.round((weight(u) / total) * N); for (let j = 0; j < k && owner.length < N; j++) owner.push(i); acc += k; });
  while (owner.length < N) owner.push(units.length - 1);
  const centres = units.map((_, i) => { const a = (i / units.length) * Math.PI * 2 + Math.PI / 4; return new Vector3(Math.cos(a) * 3.2, Math.sin(a) * 1.9, 0); });
  for (let i = 0; i < N; i++) {
    const ring = i % rings, a = (i / N) * Math.PI * 2 * 3 + ring;
    const r = 1.6 + ring * 0.75;
    orbit.set([Math.cos(a) * r, Math.sin(a) * r * 0.62, (rand() - 0.5) * 1.2], i * 3);
    const c = centres[owner[i]] ?? new Vector3();
    const cr = 0.25 + rand() * 0.75, ca = rand() * Math.PI * 2;
    cluster.set([c.x + Math.cos(ca) * cr, c.y + Math.sin(ca) * cr * 0.8, (rand() - 0.5) * 0.6], i * 3);
  }
  const geo = new BufferGeometry();
  geo.setAttribute('position', new BufferAttribute(pos, 3));
  geo.setAttribute('color', new BufferAttribute(col, 3));
  const mat = new PointsMaterial({ size: 0.11, map: dotTexture(), vertexColors: true, transparent: true, depthWrite: false, opacity: 0 });
  const points = new Points(geo, mat);
  scene.add(points);

  // Orbit lines: each node joined to the next node on its ring (thin ink at 60%).
  const pairs: [number, number][] = [];
  for (let i = 0; i < N; i++) { const j = i + rings; if (j < N) pairs.push([i, j]); }
  const lpos = new Float32Array(pairs.length * 6);
  const lgeo = new BufferGeometry();
  lgeo.setAttribute('position', new BufferAttribute(lpos, 3));
  lgeo.setDrawRange(0, 0);
  const lines = new LineSegments(lgeo, new LineBasicMaterial({ color: INK, transparent: true, opacity: 0.6 * 0.5, depthWrite: false }));
  scene.add(lines);

  const halo = new Sprite(new SpriteMaterial({ map: dotTexture(), color: AMBER, transparent: true, blending: AdditiveBlending, depthWrite: false, opacity: 0.6 }));
  halo.scale.set(1.2, 1.2, 1);
  scene.add(halo);

  // One state object, tweened by the scrubbed timeline.
  const st = { b1: 0, b2: 0, b3: 0, b4: 0 };
  const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: section, start: 'top top', end: 'bottom bottom', scrub: true } });
  tl.to(st, { b1: 1, duration: 20 }, 0)
    .to(chars, { yPercent: 0, opacity: 1, stagger: 0.6, duration: 4 }, 1)
    .to(captions[0], { opacity: 1, duration: 4 }, 3).to(captions[0], { opacity: 0, duration: 4 }, 17)
    .to(st, { b2: 1, duration: 30 }, 20)
    .to(captions[1], { opacity: 1, duration: 4 }, 24).to(captions[1], { opacity: 0, duration: 4 }, 46)
    .to(st, { b3: 1, duration: 30 }, 50)
    .to(camera.position, { z: 10.2, duration: 30 }, 50)
    .to(halo.material, { opacity: 1, duration: 30 }, 50)
    .to(captions[2], { opacity: 1, duration: 4 }, 56).to(captions[2], { opacity: 0, duration: 4 }, 76)
    .to(labels, { opacity: 1, duration: 6, stagger: 1 }, 60)
    .to(st, { b4: 1, duration: 18 }, 80)
    .to(section.querySelector('[data-intro-title]'), { opacity: 0, duration: 8 }, 70);

  // Pointer spring (screen space): nodes within 200px are pulled; the nearest brightens.
  const fine = matchMedia('(pointer: fine)').matches;
  const off = new Float32Array(N * 2), vel = new Float32Array(N * 2);
  let px = -1e4, py = -1e4, rx = 0, ry = 0;
  const onMove = (e: PointerEvent) => { const r = canvas.getBoundingClientRect(); px = e.clientX - r.left; py = e.clientY - r.top; rx = (px / r.width - 0.5); ry = (py / r.height - 0.5); };
  if (fine) addEventListener('pointermove', onMove, { passive: true });

  let w = 1, h = 1;
  const resize = () => { w = stage.clientWidth; h = stage.clientHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); };
  resize();
  addEventListener('resize', resize);

  const v = new Vector3();
  const mix = (a: number, b: number, t: number) => a + (b - a) * t;
  const smooth = (t: number) => t * t * (3 - 2 * t);
  let time = 0;
  // Adaptive resolution: if frames run long, render fewer pixels (down to 0.5×) rather than drop frames. One-way:
  // stepping back up would oscillate on slow machines.
  let dpr = Math.min(1.5, devicePixelRatio), slow = 0, fast = 0;
  const adapt = (dtMs: number) => {
    if (dtMs > 18) { slow++; fast = 0; } else { fast++; slow = Math.max(0, slow - 1); }
    if (slow > 3 && dpr > 0.5) { dpr = Math.max(0.5, dpr - 0.25); renderer.setPixelRatio(dpr); renderer.setSize(w, h, false); slow = 0; }
  };
  const frame = (_t: number, dtMs: number) => {
    time += dtMs / 1000;
    adapt(dtMs);
    const b2 = smooth(st.b2), b3 = smooth(st.b3);
    const worldPerPx = (2 * camera.position.z * Math.tan((camera.fov * Math.PI) / 360)) / h;
    let nearest = -1, nd = 200;
    const rot = time * 0.05 * (1 - b3);
    const cr = Math.cos(rot), sr = Math.sin(rot);
    for (let i = 0; i < N; i++) {
      const ox = orbit[i * 3] * cr - orbit[i * 3 + 1] * sr, oy = orbit[i * 3] * sr + orbit[i * 3 + 1] * cr;
      const drift = Math.sin(time * 0.4 + i) * 0.04;
      const kx = Math.min(1, camera.aspect / 1.5), ky = camera.aspect < 1 ? 1.5 : 1;
      let x = mix(mix(0, ox * (camera.aspect < 1 ? 0.7 : 1), b2), cluster[i * 3] * kx, b3) + drift;
      let y = mix(mix(0, oy, b2), cluster[i * 3 + 1] * ky, b3) + Math.cos(time * 0.3 + i) * 0.04;
      const z = mix(mix(0, orbit[i * 3 + 2], b2), cluster[i * 3 + 2], b3);
      // Screen position for the spring.
      v.set(x, y, z).project(camera);
      const sx = (v.x * 0.5 + 0.5) * w, sy = (-v.y * 0.5 + 0.5) * h;
      const dx = px - sx, dy = py - sy, d = Math.hypot(dx, dy);
      const tx = d < 200 && b2 > 0.5 ? dx * 0.18 : 0, ty = d < 200 && b2 > 0.5 ? dy * 0.18 : 0;
      vel[i * 2] = vel[i * 2] * 0.85 + (tx - off[i * 2]) * 0.08;
      vel[i * 2 + 1] = vel[i * 2 + 1] * 0.85 + (ty - off[i * 2 + 1]) * 0.08;
      off[i * 2] += vel[i * 2]; off[i * 2 + 1] += vel[i * 2 + 1];
      x += off[i * 2] * worldPerPx; y -= off[i * 2 + 1] * worldPerPx;
      pos.set([x, y, z], i * 3);
      if (d < nd) { nd = d; nearest = i; }
    }
    for (let i = 0; i < N; i++) {
      const c = i === nearest ? AMBER : INK;
      col.set([c.r, c.g, c.b], i * 3);
    }
    for (let k = 0; k < pairs.length; k++) { const [a, b] = pairs[k]; lpos.set(pos.subarray(a * 3, a * 3 + 3), k * 6); lpos.set(pos.subarray(b * 3, b * 3 + 3), k * 6 + 3); }
    geo.attributes.position.needsUpdate = true;
    geo.attributes.color.needsUpdate = true;
    lgeo.attributes.position.needsUpdate = true;
    lgeo.setDrawRange(0, Math.floor(pairs.length * 2 * Math.min(1, st.b2 * 1.4)) & ~1);
    (lines.material as LineBasicMaterial).opacity = 0.3 * (1 - b3);
    mat.opacity = Math.min(1, st.b2 * 2) * 0.6 * (1 - st.b4);
    halo.scale.setScalar(mix(0.6, 1.4, st.b1) * (1 - b3 * 0.4));
    canvas.style.opacity = String(1 - st.b4);
    camera.position.x = rx * 0.6; camera.position.y = -ry * 0.4; camera.lookAt(0, 0, 0);
    // Cluster labels follow their projected centres.
    const lkx = Math.min(1, camera.aspect / 1.5), lky = camera.aspect < 1 ? 1.5 : 1;
    labels.forEach((el, i) => { const c = centres[i]; if (!c) return; v.set(c.x * lkx, c.y * lky, c.z).project(camera); el.style.transform = `translate(${(v.x * 0.5 + 0.5) * w}px, ${(-v.y * 0.5 + 0.5) * h}px) translate(-50%, -50%)`; });
    renderer.render(scene, camera);
    if (tl.scrollTrigger && tl.scrollTrigger.progress >= 0.995 && !done) finish(true);
  };

  let running = false;
  const io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !running) { gsap.ticker.add(frame); running = true; }
    else if (!e.isIntersecting && running) { gsap.ticker.remove(frame); running = false; }
  });
  io.observe(stage);

  let done = false;
  function finish(flip: boolean) {
    if (done) return;
    done = true;
    const showLabels = flip && Number(getComputedStyle(labels[0] ?? section).opacity) > 0.5;
    const state = showLabels ? Flip.getState(labels) : null;
    cleanup();
    section.hidden = true;
    ScrollTrigger.refresh();
    scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    const cards = [...document.querySelectorAll<HTMLElement>('[data-flip-id^="unit-"]')];
    if (state && cards.length) Flip.from(state, { targets: cards, duration: 0.9, ease: 'power3.out', absolute: true, scale: true });
    else gsap.from(cards, { opacity: 0, y: 12, duration: 0.24, stagger: 0.04, ease: 'power3.out' });
    onDone();
  }
  const onKey = (e: KeyboardEvent) => { if (!e.metaKey && !e.ctrlKey) finish(false); };
  addEventListener('keydown', onKey);
  section.querySelector('[data-intro-skip]')?.addEventListener('click', () => finish(false));

  function cleanup() {
    delete document.documentElement.dataset.scene;
    io.disconnect();
    if (running) gsap.ticker.remove(frame);
    running = false;
    tl.scrollTrigger?.kill();
    tl.kill();
    removeEventListener('pointermove', onMove);
    removeEventListener('resize', resize);
    removeEventListener('keydown', onKey);
    document.removeEventListener('studysite:theme', onTheme);
    geo.dispose(); lgeo.dispose(); mat.map?.dispose(); mat.dispose(); (lines.material as LineBasicMaterial).dispose();
    (halo.material as SpriteMaterial).map?.dispose(); (halo.material as SpriteMaterial).dispose();
    renderer.dispose();
  }
  // Theme switch: node and line colours re-read from the tokens (the grain/vignette overlay is CSS and follows itself).
  const onTheme = () => { INK = readInk(); (lines.material as LineBasicMaterial).color.copy(INK); };
  document.addEventListener('studysite:theme', onTheme);
  document.addEventListener('astro:before-swap', cleanup, { once: true });
  return cleanup;
}
