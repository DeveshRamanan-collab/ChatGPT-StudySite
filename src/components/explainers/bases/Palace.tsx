// Palace base: a room walk for ordered lists (elements of a tort, limbs of a test). Each locus is a line-drawn
// frame on alternating walls of a corridor; the camera dollies to one locus at a time (yaw ≤ 15°), the amber light
// sits at the current locus, and its element is captioned beside the scene. Advance with Next/Back or ← →;
// when pinned, scroll walks the corridor. Off / no WebGL: the loci as a numbered list.
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BufferGeometry, Float32BufferAttribute, LineBasicMaterial, LineSegments, Vector3 } from 'three';
import { pinTop, useExplainer } from '../context';
import { ExplainerCheck, type CheckOption } from './ExplainerCheck';
import { TermsBeat, type Term } from './TermsBeat';
import { AMBER, INK, ThreeScene, softSprite, type SceneApi } from './ThreeScene';

gsap.registerPlugin(ScrollTrigger);

export interface Locus { title: string; body: string }

const SPACING = 6;

function corridor(n: number) {
  const pts: number[] = [];
  const seg = (a: number[], b: number[]) => pts.push(...a, ...b);
  const len = n * SPACING + 6;
  for (const x of [-3, 3]) { seg([x, 0, 2], [x, 0, -len]); seg([x, 4, 2], [x, 4, -len]); }
  for (let z = 2; z > -len; z -= SPACING / 2) { seg([-3, 0, z], [3, 0, z]); }
  // A frame per locus on alternating walls.
  for (let i = 0; i < n; i++) {
    const z = -i * SPACING - 3, x = i % 2 ? 2.95 : -2.95;
    seg([x, 1, z - 1.2], [x, 3, z - 1.2]); seg([x, 3, z - 1.2], [x, 3, z + 1.2]);
    seg([x, 3, z + 1.2], [x, 1, z + 1.2]); seg([x, 1, z + 1.2], [x, 1, z - 1.2]);
  }
  const g = new BufferGeometry();
  g.setAttribute('position', new Float32BufferAttribute(pts, 3));
  return new LineSegments(g, new LineBasicMaterial({ color: INK, transparent: true, opacity: 0.6 }));
}

export function Palace({ terms, loci, check, label }: { terms: Term[]; loci: Locus[]; check: { question: string; options: CheckOption[] }; label: string }) {
  const { layout, motion } = useExplainer();
  const [i, setI] = useState(0);
  const target = useRef(0);
  const wrap = useRef<HTMLDivElement>(null);
  const n = loci.length;
  const go = (k: number) => setI(Math.max(0, Math.min(n - 1, k)));
  useEffect(() => { target.current = i; }, [i]);

  // Keys.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); setI((k) => Math.min(n - 1, k + 1)); }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); setI((k) => Math.max(0, k - 1)); }
    };
    el.addEventListener('keydown', onKey);
    return () => el.removeEventListener('keydown', onKey);
  }, [n]);

  // Pinned: scroll walks the corridor.
  useLayoutEffect(() => {
    if (layout !== 'pinned' || motion === 'off' || !wrap.current) return;
    const top = pinTop();
    wrap.current.style.setProperty('--pin-top', `${top}px`);
    const st = ScrollTrigger.create({
      trigger: wrap.current, start: `top top+=${top}`, end: `+=${n * 60}%`, pin: true, scrub: true,
      onUpdate: (self) => setI(Math.min(n - 1, Math.floor(self.progress * n))),
    });
    return () => st.kill();
  }, [layout, motion, n]);

  const setup = useCallback(({ scene, camera, root, onFrame }: SceneApi) => {
    root.add(corridor(n));
    const glow = softSprite(AMBER, 1.6, 0.55, true);
    const core = softSprite(AMBER, 0.35, 1, true);
    scene.add(glow, core);
    const nodes = loci.map((_, k) => {
      const s = softSprite(INK, 0.28, 0.8);
      s.position.set(k % 2 ? 2.9 : -2.9, 2, -k * SPACING - 3);
      root.add(s);
      return s;
    });
    const cam = { z: 6, x: 0, yaw: 0 };
    const look = new Vector3();
    camera.position.set(0, 2, 6);
    onFrame((dt, t) => {
      const k = target.current;
      const side = k % 2 ? 1 : -1;
      const ease = 1 - Math.pow(0.001, dt); // frame-rate independent smoothing
      cam.z += (-k * SPACING + 2.5 - cam.z) * ease;
      cam.x += (side * 1.2 - cam.x) * ease; // step toward the locus wall so a ≤ 15° turn frames it
      cam.yaw += ((side * 15 * Math.PI) / 180 - cam.yaw) * ease;
      camera.position.set(cam.x, 2 + Math.sin(t * 0.4) * 0.03, cam.z);
      look.set(cam.x + Math.sin(cam.yaw) * 4, 2, cam.z - Math.cos(cam.yaw) * 4);
      camera.lookAt(look);
      const p = nodes[k].position;
      glow.position.set(p.x * 0.9, p.y, p.z);
      core.position.copy(glow.position);
      nodes.forEach((s, j) => { (s.material as { opacity: number }).opacity = j === k ? 0 : 0.8; });
    });
  }, [loci, n]);

  const fallback = (
    <ol className="xpal__list">
      {loci.map((l, k) => <li key={k}><strong>{l.title}</strong> — {l.body}</li>)}
    </ol>
  );

  return (
    <div className="xpal" data-layout={layout}>
      <TermsBeat terms={terms} />
      <div className="xpal__room" ref={wrap} tabIndex={0} aria-label={`${label}. Use the arrow keys to walk.`}>
        <ThreeScene setup={setup} fallback={fallback} label={label} />
        {motion !== 'off' && (
          <div className="xpal__panel" aria-live="polite">
            <p className="xpal__n mono">{i + 1} / {n}</p>
            <p className="xpal__title" data-locus={i}>{loci[i].title}</p>
            <p className="xpal__body">{loci[i].body}</p>
            <div className="xs__nav">
              <button type="button" className="btn btn--ghost btn--sm" disabled={i === 0} onClick={() => go(i - 1)}>Back</button>
              <button type="button" className="btn btn--secondary btn--sm" disabled={i === n - 1} onClick={() => go(i + 1)}>Next</button>
            </div>
          </div>
        )}
      </div>
      <ExplainerCheck {...check} />
    </div>
  );
}
