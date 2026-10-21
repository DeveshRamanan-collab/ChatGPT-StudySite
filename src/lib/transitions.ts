// Page→page transition from the catalogue (CLAUDE.md): old fades out lifting 8px over 180ms;
// new enters from scale 0.96 + opacity 0 over 240ms ease-out. Calm/off swap these for fades in CSS.
import type { TransitionDirectionalAnimations } from 'astro';

const OUT = 'cubic-bezier(.23,1,.32,1)';
const pair = {
  old: { name: 'ss-page-leave', duration: '180ms', easing: OUT, fillMode: 'both' },
  new: { name: 'ss-page-enter', duration: '240ms', easing: OUT, fillMode: 'both' },
};
export const pageTransition: TransitionDirectionalAnimations = { forwards: pair, backwards: pair };
