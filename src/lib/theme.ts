// Theme owner: <html data-theme="light|white|dark|auto">. The inline script in Layout.astro applies the stored value
// before first paint; this module changes it, persists it, colours the browser chrome (theme-color) and
// announces `studysite:theme` so canvas/WebGL scenes re-read their colours from the tokens.
import { setPrefs } from './prefs';

export type Theme = 'light' | 'white' | 'dark' | 'auto';
const KEY = 'studysite:theme';
const PAPER = { light: '#FBF7F0', white: '#FFFFFF', dark: '#17140F' };

export function storedTheme(): Theme {
  try { const t = localStorage.getItem(KEY); return t === 'light' || t === 'white' || t === 'dark' ? t : 'auto'; } catch { return 'auto'; }
}
export const theme = (): Theme => (document.documentElement.dataset.theme as Theme) || storedTheme();
/** light or dark for scenes and charts (White is a light theme). */
export const resolvedTheme = (t: Theme = theme()): 'light' | 'dark' =>
  t === 'auto' ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : t === 'dark' ? 'dark' : 'light';

function announce() {
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme() === 'white' ? PAPER.white : PAPER[resolvedTheme()]);
  document.dispatchEvent(new CustomEvent('studysite:theme', { detail: { theme: theme(), resolved: resolvedTheme() } }));
}

export function setTheme(t: Theme) {
  const html = document.documentElement;
  if (html.dataset.theme === t) return;
  // Colours cross-fade over --dur-ui while switching only (no permanent colour transitions); off = instant.
  if (html.dataset.motion !== 'off') {
    html.classList.add('theme-switching');
    setTimeout(() => html.classList.remove('theme-switching'), 300);
  }
  html.dataset.theme = t;
  setPrefs({ theme: t }); // writes the studysite:theme mirror read before paint
  syncDials();
  announce();
}

export function syncDials() {
  document.querySelectorAll<HTMLInputElement>('[data-theme-dial] input').forEach((i) => (i.checked = i.value === theme()));
}

let wired = false;
export function wireTheme() {
  if (wired) return;
  wired = true;
  document.addEventListener('astro:page-load', () => { syncDials(); announce(); });
  document.addEventListener('change', (e) => {
    const i = (e.target as HTMLElement).closest?.('[data-theme-dial] input') as HTMLInputElement | null;
    if (i) setTheme(i.value as Theme);
  });
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { if (theme() === 'auto') announce(); });
}
