// Page chrome owned by <html> attributes (see CLAUDE.md "Chrome attributes"):
//   data-rail="open|collapsed|none" — this module (pages opt in with Layout's `toc` prop; `none` otherwise).
// The rail holds the table of contents: a plain vertical list built from the page's headings, the active entry
// tracked by IntersectionObserver (1px accent marker). Toggle: the rail tab or `]`. Below 1024px the same tab opens
// the list as a popover. The content column's move between offset and centred is a FLIP (transform only).
import { motion } from './motion';
import { prefs, setPrefs, hydratePrefs } from './prefs';

type RailState = 'open' | 'collapsed' | 'none';
const html = () => document.documentElement;

export const defaultRail = () => (innerWidth >= 1280 ? 'open' : 'collapsed');

/** The rail value a page should start with (also run on the incoming document before a client-side swap). */
export function resolveRail(doc: Document = document): RailState {
  const el = doc.documentElement;
  if (el.dataset.rail === 'none') return 'none';
  if (el.dataset.centre !== undefined) return 'collapsed'; // centred pages (Layout `centre`) start tucked away
  const p = prefs().rail;
  return p === 'open' || p === 'collapsed' ? p : defaultRail();
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'section';

let io: IntersectionObserver | null = null;
let clicked: { id: string; at: number } | null = null;

function buildToc() {
  const box = document.querySelector<HTMLElement>('[data-toc]');
  if (!box) return;
  const sel = box.dataset.toc || 'main h2';
  const heads = [...document.querySelectorAll<HTMLElement>(sel)].filter((h) => !h.closest('.visually-hidden, [hidden], dialog, .rail') && !h.classList.contains('visually-hidden') && h.textContent?.trim());
  const used = new Set<string>();
  for (const h of heads) {
    if (!h.id) { let id = slug(h.textContent!); while (used.has(id) || document.getElementById(id)) id += '-x'; h.id = id; }
    used.add(h.id);
  }
  const list = document.createElement('ol');
  list.className = 'toc__list';
  for (const h of heads) {
    const li = document.createElement('li');
    li.className = 'toc__item';
    li.dataset.level = h.tagName === 'H3' ? '3' : '2';
    const a = document.createElement('a');
    a.href = `#${h.id}`;
    a.textContent = h.textContent!.trim();
    a.addEventListener('click', () => { clicked = { id: h.id, at: Date.now() }; setActive(h.id); });
    li.append(a);
    list.append(li);
  }
  box.replaceChildren(list);
  box.closest('.rail')?.toggleAttribute('data-empty', heads.length === 0);

  // Active entry: the last heading above the 35% line; the last visible one at the very bottom; a click wins briefly.
  const pick = () => {
    if (clicked && Date.now() - clicked.at < 1500) return setActive(clicked.id);
    let cur: string | null = null;
    for (const h of heads) if (h.getBoundingClientRect().top < innerHeight * 0.35) cur = h.id;
    if (scrollY + innerHeight >= document.documentElement.scrollHeight - 4) for (const h of heads) if (h.getBoundingClientRect().top < innerHeight) cur = h.id;
    setActive(cur);
  };
  io = new IntersectionObserver(pick, { rootMargin: '0px 0px -65% 0px', threshold: [0, 1] });
  heads.forEach((h) => io!.observe(h));
  // The bottom-of-page rule needs one more signal than crossings: the end of the document entering view.
  const end = document.querySelector('.site-footer');
  if (end) io.observe(end);
  pick();
}

function setActive(id: string | null) {
  document.querySelectorAll<HTMLElement>('.toc__item').forEach((li) => {
    const on = li.firstElementChild?.getAttribute('href') === `#${id}`;
    li.toggleAttribute('data-active', on);
    li.firstElementChild?.toggleAttribute('aria-current', on);
    if (on) li.firstElementChild?.setAttribute('aria-current', 'location');
  });
}

/** FLIP the content column between offset (rail open) and centred (collapsed). Transform + opacity only. */
export function setRail(next: 'open' | 'collapsed', persist = true) {
  const el = html();
  if (el.dataset.rail === 'none' || el.dataset.rail === next) return;
  const content = document.querySelector<HTMLElement>('.content');
  const before = content?.getBoundingClientRect();
  el.dataset.rail = next;
  if (persist && el.dataset.centre === undefined) setPrefs({ rail: next });
  syncTab();
  if (!content || !before || motion() === 'off') return;
  const after = content.getBoundingClientRect();
  const dx = before.left - after.left;
  if (Math.abs(dx) < 1) return;
  const dur = parseFloat(getComputedStyle(el).getPropertyValue('--dur-panel')) || 420;
  const ease = getComputedStyle(el).getPropertyValue('--ease-drawer').trim() || 'ease-out';
  content.animate([{ transform: `translateX(${dx}px)` }, { transform: 'none' }], { duration: dur, easing: ease });
}

export const toggleRail = () => {
  if (innerWidth < 1024) return togglePopover();
  setRail(html().dataset.rail === 'open' ? 'collapsed' : 'open');
};

function togglePopover(force?: boolean) {
  const rail = document.querySelector<HTMLElement>('.rail');
  if (!rail) return;
  const open = force ?? !rail.hasAttribute('data-pop');
  rail.toggleAttribute('data-pop', open);
  syncTab();
  if (open) rail.querySelector<HTMLElement>('.toc__item[data-active] a, .toc__item a')?.focus({ preventScroll: true });
}

function syncTab() {
  const tab = document.querySelector<HTMLButtonElement>('[data-rail-tab]');
  if (!tab) return;
  const narrow = innerWidth < 1024;
  const expanded = narrow ? !!document.querySelector('.rail[data-pop]') : html().dataset.rail === 'open';
  tab.setAttribute('aria-expanded', String(expanded));
  tab.setAttribute('aria-label', expanded ? 'Hide contents' : 'Show contents');
}

/** Preference attributes that live on <html>: set before paint by Layout's inline script, re-applied on swaps. */
export function applyHtmlPrefs(doc: Document = document) {
  const p = prefs();
  doc.documentElement.dataset.progress = p.progress ? 'on' : 'off';
  doc.documentElement.dataset.scrollbar = p.hideScrollbar ? 'hidden' : 'shown';
  doc.documentElement.dataset.glass = p.glass === 'off' || matchMedia('(prefers-reduced-transparency: reduce)').matches ? 'off' : 'on';
  doc.documentElement.style.setProperty('--glass-opacity', String(Math.min(0.9, Math.max(0.2, p.glassOpacity))));
  // Reading customisation and low stimulation (src/styles/reading.css); the pre-paint script in Layout.astro sets the same.
  const d = doc.documentElement.dataset;
  d.text = p.textSize; d.leading = p.leading; d.measure = p.measure; d.contrast = p.contrast; d.density = p.density;
  d.lowstim = p.lowStim ? 'on' : 'off';
}

let wired = false;
export function wireChrome() {
  if (wired) return;
  document.addEventListener('studysite:prefs', () => {
    applyHtmlPrefs();
    // A rail preference restored from IndexedDB (or set elsewhere) applies to this page too; `]` is already in step.
    const r = html().dataset.rail;
    if (r && r !== 'none' && innerWidth >= 1024 && html().dataset.centre === undefined) { const want = resolveRail(); if (want !== 'none' && want !== r) setRail(want, false); }
  });
  wired = true;
  // Once per full load: reconcile the localStorage mirror with the IndexedDB copy (see prefs.ts).
  const idle = (f: () => void) => ('requestIdleCallback' in window ? requestIdleCallback(f, { timeout: 2000 }) : setTimeout(f, 200));
  idle(() => { hydratePrefs(); });
  document.addEventListener('astro:page-load', () => {
    buildToc();
    syncTab();
    document.querySelector('[data-rail-tab]')?.addEventListener('click', toggleRail);
  });
  document.addEventListener('astro:before-swap', (e) => {
    io?.disconnect();
    io = null;
    const nd = (e as unknown as { newDocument: Document }).newDocument;
    nd.documentElement.dataset.rail = resolveRail(nd);
    applyHtmlPrefs(nd);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.querySelector('.rail[data-pop]')) { togglePopover(false); (document.querySelector('[data-rail-tab]') as HTMLElement)?.focus(); return; }
    if (e.key !== ']' || e.metaKey || e.ctrlKey || e.altKey) return;
    if ((e.target as HTMLElement)?.closest('input, textarea, select, [contenteditable="true"], dialog')) return;
    if (html().dataset.rail === 'none') return;
    e.preventDefault();
    toggleRail();
  });
  document.addEventListener('click', (e) => {
    const pop = document.querySelector('.rail[data-pop]');
    if (pop && !(e.target as Element).closest('.rail, [data-rail-tab]')) togglePopover(false);
    if (pop && (e.target as Element).closest('.toc__item a')) togglePopover(false);
  });
  addEventListener('resize', () => { if (innerWidth >= 1024) document.querySelector('.rail[data-pop]')?.removeAttribute('data-pop'); syncTab(); });
}
