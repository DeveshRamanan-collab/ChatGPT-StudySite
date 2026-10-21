// Mounts the explainer registered for a concept (manifest.json) above the concept text. Decides pinned vs paced
// layout from viewport and motion dial; re-decides when either changes. The module loads lazily (own chunk).
import { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { motion as currentMotion, type MotionLevel } from '../../lib/motion';
import { ExplainerContext } from './context';
import { loaderFor, MANIFEST } from './registry';
import { markFormat } from '../../lib/format-track';

function useLayout() {
  const read = () => {
    if (typeof document === 'undefined') return { motion: 'off' as MotionLevel, layout: 'paced' as const };
    const m = (document.documentElement.dataset.motion as MotionLevel) || currentMotion();
    return { motion: m, layout: (matchMedia('(min-width: 1100px)').matches && m === 'full' ? 'pinned' : 'paced') as 'pinned' | 'paced' };
  };
  const [state, setState] = useState(read);
  useEffect(() => {
    const update = () => setState(read());
    const mq = matchMedia('(min-width: 1100px)');
    mq.addEventListener('change', update);
    document.addEventListener('motionchange', update);
    return () => { mq.removeEventListener('change', update); document.removeEventListener('motionchange', update); };
  }, []);
  return state;
}

export default function ExplainerHost({ conceptId, unit, title, continuous = false }: { conceptId: string; unit: string; title: string; continuous?: boolean }) {
  const entry = MANIFEST[conceptId];
  const load = entry ? loaderFor(entry.module) : undefined;
  const Comp = useMemo(() => (load ? lazy(load) : null), [load]);
  const { layout, motion } = useLayout();
  const [mounted, setMounted] = useState(false);
  // Mounted means it scrolled into view (client:visible): count the explainer as the format used for this concept.
  useEffect(() => { setMounted(true); markFormat(conceptId, 'explainer'); }, [conceptId]);
  if (!Comp) return null;
  // Explainers are browser-only (WebGL, scroll, the dial). On the server render a placeholder of the same size:
  // it gives client:visible a box to observe and reserves the space (no layout shift).
  if (!mounted) return <div className="explainer explainer__loading" aria-busy="true">Loading the explainer…</div>;
  return (
    <ExplainerContext.Provider value={{ conceptId, unit, title, layout: continuous ? 'paced' : layout, motion }}>
      <div className="explainer" data-layout={continuous ? 'paced' : layout} data-base={entry!.base}>
        <Suspense fallback={<div className="explainer__loading" aria-busy="true">Loading the explainer…</div>}>
          <Comp key={`${layout}-${motion}`} />
        </Suspense>
      </div>
    </ExplainerContext.Provider>
  );
}
