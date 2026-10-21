// "Replay intro" (Settings, the menu sheet, the palette): forget today's viewing and go home, where the intro plays
// again. The intro is a Motion: Full scene, so the action is only offered (enabled) when motion is full.
export const canReplayIntro = () => document.documentElement.dataset.motion === 'full' && !matchMedia('(prefers-reduced-motion: reduce)').matches;

export function replayIntro() {
  try { localStorage.removeItem('studysite:intro-day'); } catch {}
  location.assign('/?intro=1');
}
