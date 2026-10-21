// "Continue": remembers the last place studied (route + scroll; quizzes also store the question position via
// QuizRunner) so the home button returns exactly there.
const KEY = 'studysite:continue';
const RESTORE = 'studysite:restore-scroll';
export interface Place { href: string; title: string; scroll: number; at: number }

const skip = (p: string) => p === '/' || p === '/search' || p === '/styleguide' || p.startsWith('/data/');

export function readPlace(): Place | null {
  try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { return null; }
}
export function savePlace(extra: Partial<Place> = {}) {
  if (skip(location.pathname)) return;
  const u = new URL(location.href); u.searchParams.delete('resume');
  const place: Place = { href: u.pathname + u.search, title: document.title.replace(/ · StudySite$/, ''), scroll: Math.round(scrollY), at: Date.now(), ...extra };
  try { localStorage.setItem(KEY, JSON.stringify(place)); } catch {}
}
/** Called by the Continue button before navigating. */
export function markRestore(p: Place) { try { sessionStorage.setItem(RESTORE, JSON.stringify({ href: p.href, scroll: p.scroll })); } catch {} }

const VISITED = 'studysite:visited-weeks';
/** Week id → last visit time. */
export function weekVisits(): Record<string, number> {
  try { const v = JSON.parse(localStorage.getItem(VISITED) || '{}'); return Array.isArray(v) ? Object.fromEntries(v.map((k: string) => [k, 0])) : v; } catch { return {}; }
}
export const visitedWeeks = () => new Set(Object.keys(weekVisits()));
function markVisited() {
  const m = location.pathname.match(/^\/([a-z]+\d{4})\/week\/(\d+)/);
  if (!m) return;
  const v = { ...weekVisits(), [`${m[1]}-w${m[2].padStart(2, '0')}`]: Date.now() };
  try { localStorage.setItem(VISITED, JSON.stringify(v)); } catch {}
}

const QPOS = 'studysite:quiz-pos';
export interface QuizPos { path: string; ids: string[]; i: number; at: number }
const quizPath = () => { const u = new URL(location.href); u.searchParams.delete('resume'); return u.pathname + u.search; };
export function saveQuizPos(ids: string[], i: number) {
  try { localStorage.setItem(QPOS, JSON.stringify({ path: quizPath(), ids, i, at: Date.now() })); } catch {}
}
/** The saved position when this page was opened with ?resume=1 for the same quiz. */
export function resumeQuizPos(): QuizPos | null {
  if (!new URLSearchParams(location.search).has('resume')) return null;
  try { const p = JSON.parse(localStorage.getItem(QPOS) || 'null') as QuizPos | null; return p && p.path === quizPath() ? p : null; } catch { return null; }
}
/** The Continue target: a quiz route resumes at its saved question. */
export function continueHref(p: Place) {
  let q: QuizPos | null = null;
  try { q = JSON.parse(localStorage.getItem(QPOS) || 'null'); } catch {}
  if (q && q.path === p.href && /\/quiz(\?|$)/.test(p.href)) return p.href + (p.href.includes('?') ? '&' : '?') + 'resume=1';
  return p.href;
}

export function wireContinue() {
  if ((window as any).__continue) return;
  (window as any).__continue = true;
  let t = 0;
  addEventListener('scroll', () => { clearTimeout(t); t = window.setTimeout(() => savePlace(), 400); }, { passive: true });
  document.addEventListener('astro:before-preparation', () => savePlace());
  addEventListener('pagehide', () => savePlace());
  document.addEventListener('astro:page-load', () => {
    let r: { href: string; scroll: number } | null = null;
    try { r = JSON.parse(sessionStorage.getItem(RESTORE) || 'null'); sessionStorage.removeItem(RESTORE); } catch {}
    markVisited();
    const here = location.pathname + location.search;
    if (r && r.href.split('?')[0] === here.split('?')[0] && r.scroll > 0) setTimeout(() => scrollTo({ top: r!.scroll, behavior: 'instant' as ScrollBehavior }), 60);
    else savePlace();
  });
}
