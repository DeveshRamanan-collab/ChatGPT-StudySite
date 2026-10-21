// Per-device preferences: one Zustand store (`usePrefs`), persisted to IndexedDB (Dexie `settings`, key `prefs`) and
// mirrored to localStorage for the pre-paint script in Layout.astro:
//   studysite:theme (light|white|dark|auto) · studysite:motion (full|calm|off; absent = follow the system) ·
//   studysite:prefs (everything else, JSON).
// The mirror is read synchronously at start-up (it is what the page was painted with), so it wins; IndexedDB is the
// durable copy and restores the mirror when site data was partly cleared. Every write updates both and announces
// `studysite:prefs` so chrome, the cursor and open islands follow. Owners of the <html> attributes: see CLAUDE.md.
import { create } from 'zustand';

export type ThemePref = 'light' | 'white' | 'dark' | 'auto';
export type MotionPref = 'full' | 'calm' | 'off';
export interface Prefs {
  theme: ThemePref;
  /** null = follow prefers-reduced-motion (off when set, else full). */
  motion: MotionPref | null;
  companion: 'off' | 'lamp';
  noise: 'off' | 'brown' | 'pink';
  volume: number;
  /** Right rail on pages with a table of contents; null = default (open ≥ 1280px, collapsed below). */
  rail: 'open' | 'collapsed' | null;
  /** Reading progress line (top hairline + rail edge). Off by default. */
  progress: boolean;
  /** Hide the native scrollbar. Off by default. */
  hideScrollbar: boolean;
  /** Glass surfaces on/off (off under prefers-reduced-transparency regardless) and their tint strength 0.2–0.9. */
  glass: 'on' | 'off';
  glassOpacity: number;
  /** Custom cursor (dot + ring). It also needs a fine pointer and Motion: Full. */
  cursor: 'on' | 'off';
  /** On a refresh or a fresh visit, start again from the top of the home page (on by default; Settings → Start). */
  homeOnLoad: boolean;
  /** Reading customisation (200-features pass): text size, line spacing, line width, contrast, density. */
  textSize: 'sm' | 'md' | 'lg' | 'xl';
  leading: 'normal' | 'relaxed' | 'airy';
  measure: 'narrow' | 'normal' | 'wide';
  contrast: 'normal' | 'high';
  density: 'comfortable' | 'compact';
  /** Low-stimulation mode: one switch for motion, glass, cursor, companion, noise, progress line and rail, plus
   *  html[data-lowstim] for decoration. `lowStimSaved` holds the values it replaced so switching off restores them. */
  lowStim: boolean;
  lowStimSaved: Partial<Pick<Prefs, 'motion' | 'glass' | 'cursor' | 'companion' | 'noise' | 'progress' | 'rail'>> | null;
}

const KEY = 'studysite:prefs', THEME = 'studysite:theme', MOTION = 'studysite:motion';
export const DEFAULTS: Prefs = {
  theme: 'auto', motion: null, companion: 'off', noise: 'off', volume: 0.25, rail: null,
  progress: false, hideScrollbar: false, glass: 'on', glassOpacity: 0.55, cursor: 'off', homeOnLoad: true,
  textSize: 'md', leading: 'normal', measure: 'normal', contrast: 'normal', density: 'comfortable', lowStim: false, lowStimSaved: null,
};
const THEMES: ThemePref[] = ['light', 'white', 'dark', 'auto'];
const MOTIONS: MotionPref[] = ['full', 'calm', 'off'];

function clean(p: Partial<Prefs>): Prefs {
  const n = { ...DEFAULTS, ...p };
  if (!THEMES.includes(n.theme)) n.theme = 'auto';
  if (n.motion !== null && !MOTIONS.includes(n.motion)) n.motion = null;
  n.glassOpacity = Math.min(0.9, Math.max(0.2, Number(n.glassOpacity) || DEFAULTS.glassOpacity));
  const pickOne = <K extends keyof Prefs>(k: K, allowed: readonly Prefs[K][]) => { if (!allowed.includes(n[k])) n[k] = DEFAULTS[k]; };
  pickOne('textSize', ['sm', 'md', 'lg', 'xl']);
  pickOne('leading', ['normal', 'relaxed', 'airy']);
  pickOne('measure', ['narrow', 'normal', 'wide']);
  pickOne('contrast', ['normal', 'high']);
  pickOne('density', ['comfortable', 'compact']);
  n.lowStim = n.lowStim === true;
  n.homeOnLoad = n.homeOnLoad !== false;
  return n;
}

function readMirror(): Prefs {
  try {
    const rest = JSON.parse(localStorage.getItem(KEY) || '{}') || {};
    return clean({ ...rest, theme: (localStorage.getItem(THEME) as ThemePref) || 'auto', motion: (localStorage.getItem(MOTION) as MotionPref) || null });
  } catch {
    return { ...DEFAULTS };
  }
}

function writeMirror(p: Prefs) {
  try {
    const { theme, motion, ...rest } = p;
    localStorage.setItem(KEY, JSON.stringify(rest));
    localStorage.setItem(THEME, theme);
    if (motion) localStorage.setItem(MOTION, motion);
    else localStorage.removeItem(MOTION);
  } catch {}
}

export const usePrefs = create<Prefs>(() => (typeof window === 'undefined' ? { ...DEFAULTS } : readMirror()));
export const prefs = (): Prefs => usePrefs.getState();

let timer: ReturnType<typeof setTimeout> | undefined;
function persist(p: Prefs) {
  clearTimeout(timer);
  timer = setTimeout(() => { import('./db').then(({ db }) => db.settings.put({ key: 'prefs', value: p })).catch(() => {}); }, 250);
}

export function setPrefs(patch: Partial<Prefs>): Prefs {
  const next = clean({ ...prefs(), ...patch });
  usePrefs.setState(next, true);
  writeMirror(next);
  persist(next);
  document.dispatchEvent(new CustomEvent('studysite:prefs', { detail: next }));
  return next;
}

/**
 * Reconcile with IndexedDB once per load. With a mirror present it wins and is copied to IndexedDB (this also migrates
 * installs from before the store). Without one — or after an import (`preferDb`) — the IndexedDB copy is adopted and
 * theme and motion are applied at once.
 */
export async function hydratePrefs({ preferDb = false } = {}) {
  let rec: Partial<Prefs> | undefined;
  try { rec = (await (await import('./db')).db.settings.get('prefs'))?.value as Partial<Prefs> | undefined; } catch { return; }
  let hasMirror = false;
  try { hasMirror = [KEY, THEME, MOTION].some((k) => localStorage.getItem(k) !== null); } catch {}
  if (!rec || (hasMirror && !preferDb)) {
    usePrefs.setState(readMirror(), true); // someone (a test, another tab, an import) may have written the mirror
    persist(prefs());
    return;
  }
  const before = prefs();
  const next = setPrefs(rec);
  if (next.theme !== before.theme || document.documentElement.dataset.theme !== next.theme) (await import('./theme')).setTheme(next.theme);
  if (next.motion && next.motion !== document.documentElement.dataset.motion) (await import('./motion')).setMotion(next.motion);
}
