// Shared explainer context: layout (pinned desktop scroll vs learner-paced), motion level, and the check reporter.
import { createContext, useContext } from 'react';
import type { MotionLevel } from '../../lib/motion';

export interface ExplainerCtx {
  conceptId: string;
  unit: string;
  title: string;
  /** pinned: desktop ≥ 1100px with full motion (scroll-scrubbed); paced: Next/Back, one beat at a time. */
  layout: 'pinned' | 'paced';
  motion: MotionLevel;
}

export const ExplainerContext = createContext<ExplainerCtx>({ conceptId: '', unit: '', title: '', layout: 'paced', motion: 'off' });
export const useExplainer = () => useContext(ExplainerContext);

/** Height of the sticky site header once scrolled: pinned scenes start below it rather than under it. */
export const pinTop = () => {
  const h = document.querySelector('.site-header');
  return h ? Math.round(h.getBoundingClientRect().height - 8) : 0; // header lifts 8px when scrolled
};
