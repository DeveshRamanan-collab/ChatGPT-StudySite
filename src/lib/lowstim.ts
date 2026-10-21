// Low-stimulation mode (feature 106): one switch that turns off motion, glass, the custom cursor, the companion,
// background noise and the reading line, and collapses the contents rail; switching it off restores exactly what it
// replaced. Decoration is handled in CSS via html[data-lowstim] (src/styles/reading.css).
import { prefs, setPrefs, type Prefs } from './prefs';

type Saved = NonNullable<Prefs['lowStimSaved']>;

export async function setLowStim(on: boolean) {
  const p = prefs();
  if (on === p.lowStim) return;
  if (on) {
    const saved: Saved = { motion: p.motion, glass: p.glass, cursor: p.cursor, companion: p.companion, noise: p.noise, progress: p.progress, rail: p.rail };
    setPrefs({ lowStim: true, lowStimSaved: saved, glass: 'off', cursor: 'off', companion: 'off', noise: 'off', progress: false, rail: 'collapsed' });
    (await import('./noise')).stopNoise();
    (await import('./motion')).setMotion('off');
    (await import('./chrome')).setRail('collapsed', false);
  } else {
    const s = p.lowStimSaved ?? {};
    setPrefs({ lowStim: false, lowStimSaved: null, ...s });
    const motion = s.motion ?? (matchMedia('(prefers-reduced-motion: reduce)').matches ? 'off' : 'full');
    (await import('./motion')).setMotion(motion);
    if (s.motion === null) setPrefs({ motion: null }); // it followed the system before; keep it that way
    const chrome = await import('./chrome');
    chrome.setRail(s.rail ?? chrome.defaultRail(), false);
  }
  document.dispatchEvent(new CustomEvent('studysite:lowstim', { detail: on }));
}
