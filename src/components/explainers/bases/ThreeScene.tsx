// ThreeScene base (plain three, tree-shaken; no r3f). Scene language (CLAUDE.md): ink line strokes, small soft
// nodes, ONE amber point light as the only colour, paper-toned fill, 35mm-ish camera, gentle moves only.
// Mounts when in view, pauses off-screen, DPR ≤ 1.5. One post pass: 3% grain + 8% vignette; the amber light gets a
// soft additive glow (the only "bloom"). Falls back to `fallback` when motion is off or WebGL is unavailable.
import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  AdditiveBlending, CanvasTexture, Color, Group, PerspectiveCamera, Scene, Sprite, SpriteMaterial, Vector2, WebGLRenderer,
} from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { useExplainer } from '../context';

export const INK = new Color('#1F1B16');
export const AMBER = new Color('#E6873F');
export const PAPER = new Color('#F4EEE3');
/** Follow the current theme (light / lamp-lit) at mount: scene colours come from the tokens. */
export function syncThemeColours() {
  const cs = getComputedStyle(document.documentElement);
  INK.set(cs.getPropertyValue('--ink').trim() || '#1F1B16');
  PAPER.set(cs.getPropertyValue('--paper-2').trim() || '#F4EEE3');
}

const GrainVignette = {
  uniforms: { tDiffuse: { value: null }, uTime: { value: 0 }, uGrain: { value: 0.03 }, uVignette: { value: 0.08 }, uRes: { value: new Vector2(1, 1) } },
  vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
  fragmentShader: `uniform sampler2D tDiffuse; uniform float uTime; uniform float uGrain; uniform float uVignette; varying vec2 vUv;
    float rand(vec2 co){ return fract(sin(dot(co, vec2(12.9898, 78.233)) + uTime) * 43758.5453); }
    void main(){ vec4 c = texture2D(tDiffuse, vUv);
      float d = distance(vUv, vec2(0.5));
      c.rgb *= 1.0 - uVignette * smoothstep(0.3, 0.75, d);
      c.rgb += (rand(vUv * 800.0) - 0.5) * uGrain;
      gl_FragColor = c; }`,
};

/** Soft radial sprite: a node (ink) or the amber light's glow. */
export function softSprite(color: Color, size: number, opacity = 1, additive = false) {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d')!;
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, `rgba(${color.r * 255},${color.g * 255},${color.b * 255},1)`);
  grad.addColorStop(1, `rgba(${color.r * 255},${color.g * 255},${color.b * 255},0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  const s = new Sprite(new SpriteMaterial({ map: new CanvasTexture(c), transparent: true, opacity, depthWrite: false, ...(additive ? { blending: AdditiveBlending } : {}) }));
  s.scale.set(size, size, 1);
  return s;
}

export interface SceneApi {
  scene: Scene;
  camera: PerspectiveCamera;
  root: Group;
  /** Called every frame while visible; dt in seconds. */
  onFrame: (fn: (dt: number, t: number) => void) => void;
}

export function webglAvailable() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

interface Props {
  /** Build the scene once; return a cleanup. */
  setup: (api: SceneApi) => void | (() => void);
  fallback: ReactNode;
  height?: string;
  label: string;
}

export function ThreeScene({ setup, fallback, height = 'min(70vh, 560px)', label }: Props) {
  const { motion } = useExplainer();
  const host = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  // Theme change → rebuild the scene with colours re-read from the tokens.
  const [themeKey, setThemeKey] = useState(0);
  useEffect(() => {
    const on = () => setThemeKey((k) => k + 1);
    document.addEventListener('studysite:theme', on);
    return () => document.removeEventListener('studysite:theme', on);
  }, []);
  const useFallback = motion === 'off' || failed;

  useEffect(() => {
    syncThemeColours();
    if (useFallback || !host.current) return;
    if (!webglAvailable()) { setFailed(true); return; }
    const el = host.current;
    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'low-power' });
    } catch {
      setFailed(true);
      return;
    }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.setClearColor(PAPER);
    el.appendChild(renderer.domElement);
    renderer.domElement.setAttribute('aria-hidden', 'true');
    const scene = new Scene();
    const camera = new PerspectiveCamera(38, 1, 0.1, 200); // ≈ 35mm-equivalent
    const root = new Group();
    scene.add(root);
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const post = new ShaderPass(GrainVignette);
    composer.addPass(post);
    const frames: ((dt: number, t: number) => void)[] = [];
    const cleanup = setup({ scene, camera, root, onFrame: (fn) => frames.push(fn) });

    const size = () => {
      const w = el.clientWidth, h = el.clientHeight;
      renderer.setSize(w, h, false);
      composer.setSize(w, h);
      camera.aspect = w / Math.max(1, h);
      camera.updateProjectionMatrix();
    };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(el);

    let raf = 0, last = performance.now(), visible = false;
    const t0 = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      for (const f of frames) f(dt, (now - t0) / 1000);
      post.uniforms.uTime.value = (now - t0) / 1000;
      composer.render();
      raf = requestAnimationFrame(loop);
    };
    // Pause off-screen: run the loop only while the canvas is in view. IntersectionObserver drives it; a scroll/resize
    // re-check covers pinned layouts, where ScrollTrigger measures the element off-screen at the observer's first read.
    const setVisible = (on: boolean) => {
      if (on && !visible) { visible = true; last = performance.now(); raf = requestAnimationFrame(loop); el.dataset.running = 'true'; }
      if (!on && visible) { visible = false; cancelAnimationFrame(raf); el.dataset.running = 'false'; }
    };
    const inView = () => { const r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight && r.height > 0; };
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(el);
    const recheck = () => { if (!visible && inView()) setVisible(true); else if (visible && !inView()) setVisible(false); };
    addEventListener('scroll', recheck, { passive: true });
    addEventListener('resize', recheck);
    requestAnimationFrame(recheck);
    return () => {
      removeEventListener('scroll', recheck);
      removeEventListener('resize', recheck);
      io.disconnect();
      ro.disconnect();
      cancelAnimationFrame(raf);
      if (typeof cleanup === 'function') cleanup();
      composer.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [useFallback, setup, themeKey]);

  if (useFallback) return <div className="x3d x3d--fallback" data-fallback>{fallback}</div>;
  return <div className="x3d" ref={host} style={{ height }} role="img" aria-label={label} data-running="false" />;
}
