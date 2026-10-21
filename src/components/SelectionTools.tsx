// Selection toolbar (features 7, 21): select text inside the notes (article.prose, any page) and a small toolbar
// appears just below the selection (the annotation bar keeps the space above it):
//   Explain        the selection looked up in the unit's glossary terms (study aids); the gloss shows in place
//   Make a card    the existing sentence-to-card (src/lib/sentence-card.ts): the selection becomes the cloze gap
//   Quiz me on this  the page concept's quiz
//   Read aloud     the selection, in the browser's voice (src/lib/speech.ts), highlighted while it is read
// Keyboard: after selecting, Tab moves into the toolbar; arrows move along it; Esc closes and returns focus; Tab past
// the end leaves it. On touch-only screens it never floats over the native selection menu: it is a bar at the bottom.
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { loadAids, stems, overlap } from '../lib/aids';
import { read, stop as stopReading, isReading, speechSupported } from '../lib/speech';
import { markFormat } from '../lib/format-track';
import '../styles/selection-tools.css';

interface PageConcept { id: string; title: string }
interface Snap { text: string; range: Range; unit: string | null; concepts: PageConcept[]; concept: PageConcept | null; para: HTMLElement | null; article: HTMLElement }
export interface Term { term: string; gloss: string; example?: string; concept: string }
type Gloss = { kind: 'match'; term: Term; title: string; href: string } | { kind: 'none'; waysIn: string | null } | { kind: 'loading' } | null;

const MIN = 2;
const MAX = 600;
/** Space kept free for a gloss when choosing whether the bar sits below or above the selection. */
const GLOSS_ROOM = 160;
const norm = (s: string) => s.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, ' ').trim();

/** Best glossary term for a selection (pure): exact term, then a term inside the selection (longest wins), then the
 *  selection inside a term, then most shared word stems. Terms from the page's own concepts win ties. */
export function findGloss(selection: string, terms: Term[], prefer: string[] = []): Term | null {
  const s = norm(selection);
  if (!s) return null;
  const sStems = stems(selection);
  let best: { t: Term; score: number } | null = null;
  for (const t of terms) {
    const n = norm(t.term.replace(/\([^)]*\)/g, ''));
    if (!n) continue;
    let score = 0;
    if (n === s || norm(t.term) === s) score = 10;
    else if (n.length >= 4 && ` ${s} `.includes(` ${n} `)) score = 6 + Math.min(n.length, 40) / 40;
    else if (s.length >= 4 && ` ${n} `.includes(` ${s} `)) score = 4;
    else { const o = overlap(t.term, sStems); if (o >= 0.75) score = 2 + o; }
    if (!score) continue;
    if (prefer.includes(t.concept)) score += 0.5;
    if (!best || score > best.score) best = { t, score };
  }
  return best?.t ?? null;
}

let overview: Promise<Map<string, { title: string; href: string }>> | null = null;
function conceptIndex() {
  overview ??= fetch('/data/overview.json')
    .then((r) => (r.ok ? r.json() : []))
    .then((units: { weeks: { concepts: { id: string; title: string; href: string }[] }[] }[]) => new Map(units.flatMap((u) => u.weeks.flatMap((w) => w.concepts.map((c) => [c.id, { title: c.title, href: c.href }] as const)))))
    .catch(() => new Map());
  return overview;
}

const coarse = () => matchMedia('(hover: none) and (pointer: coarse)').matches;
const elementOf = (n: Node | null) => (n ? (n.nodeType === 1 ? (n as Element) : n.parentElement) : null);

/** The current selection, when it sits inside one notes article and is a sensible length. */
function snapshot(): Snap | null {
  const sel = getSelection();
  if (!sel || sel.isCollapsed || !sel.rangeCount) return null;
  const text = sel.toString().replace(/\s+/g, ' ').trim();
  if (text.length < MIN || text.length > MAX) return null;
  const a = elementOf(sel.anchorNode)?.closest<HTMLElement>('article.prose');
  const f = elementOf(sel.focusNode)?.closest<HTMLElement>('article.prose');
  if (!a || a !== f) return null;
  const meta = document.querySelector<HTMLElement>('[data-page-concepts]');
  let concepts: PageConcept[] = [];
  try { concepts = JSON.parse(meta?.dataset.pageConcepts || '[]'); } catch {}
  const unit = meta?.dataset.unit ?? location.pathname.match(/^\/([a-z]+\d{4})\//)?.[1] ?? null;
  const para = elementOf(sel.anchorNode)?.closest<HTMLElement>('[id^="para-"]') ?? null;
  // The page concept closest to the selected passage (a week page has several).
  const context = stems(`${para?.textContent ?? ''} ${text}`);
  const ranked = concepts.map((c) => ({ c, o: overlap(c.title, context) })).sort((x, y) => y.o - x.o);
  const concept = concepts.length === 1 ? concepts[0] : ranked[0]?.o ? ranked[0].c : null;
  return { text, range: sel.getRangeAt(0).cloneRange(), unit, concepts, concept, para, article: a };
}

export default function SelectionTools() {
  const [snap, setSnap] = useState<Snap | null>(null);
  const [gloss, setGloss] = useState<Gloss>(null);
  const [status, setStatus] = useState('');
  const [reading, setReading] = useState(false);
  const [bottom, setBottom] = useState(false);
  const [shown, setShown] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const snapRef = useRef<Snap | null>(null);
  const returnTo = useRef<HTMLElement | null>(null);
  const dismissed = useRef('');
  const pointerDown = useRef(false);
  const touchedAt = useRef(0);
  const sideFor = useRef<{ snap: Snap | null; side: 'top' | 'bottom' }>({ snap: null, side: 'bottom' });
  snapRef.current = snap;

  const close = useCallback((restore = false) => {
    setSnap(null);
    setGloss(null);
    setStatus('');
    setShown(false);
    if (restore) {
      const back = returnTo.current;
      if (back?.isConnected && back !== document.body) back.focus({ preventScroll: true });
      else { const art = snapRef.current?.article; if (art) { if (!art.hasAttribute('tabindex')) art.setAttribute('tabindex', '-1'); art.focus({ preventScroll: true }); } }
    }
    returnTo.current = null;
  }, []);

  const inside = (n: EventTarget | Node | null) => !!(n instanceof Node && wrap.current?.contains(n));

  // Watch the selection (after the pointer lifts, or ~120 ms after a keyboard selection settles).
  useEffect(() => {
    let t: ReturnType<typeof setTimeout> | undefined;
    const check = () => {
      if (pointerDown.current || inside(document.activeElement)) return;
      const s = snapshot();
      // A tap on the bar can clear the selection on touch screens: keep the bar for the action that tap started.
      if (!s && Date.now() - touchedAt.current < 600) return;
      if (!s) { if (snapRef.current) close(); dismissed.current = ''; return; }
      if (s.text === dismissed.current) return;
      if (snapRef.current?.text === s.text && snapRef.current.range.compareBoundaryPoints(Range.START_TO_START, s.range) === 0) return;
      setBottom(coarse());
      setSnap(s);
      setGloss(null);
      setStatus('');
    };
    const onSel = () => { clearTimeout(t); t = setTimeout(check, 120); };
    const onDown = (e: PointerEvent) => { if (inside(e.target)) touchedAt.current = Date.now(); else pointerDown.current = true; };
    const onUp = () => { if (!pointerDown.current) return; pointerDown.current = false; clearTimeout(t); t = setTimeout(check, 10); };
    const onSwap = () => { stopReading(); close(); };
    document.addEventListener('selectionchange', onSel);
    document.addEventListener('pointerdown', onDown, true);
    document.addEventListener('pointerup', onUp, true);
    document.addEventListener('pointercancel', onUp, true);
    document.addEventListener('astro:before-swap', onSwap);
    return () => {
      clearTimeout(t);
      document.removeEventListener('selectionchange', onSel);
      document.removeEventListener('pointerdown', onDown, true);
      document.removeEventListener('pointerup', onUp, true);
      document.removeEventListener('pointercancel', onUp, true);
      document.removeEventListener('astro:before-swap', onSwap);
    };
  }, [close]);

  // Keyboard: Tab into the toolbar, arrows along it, Tab past either end leaves it, Esc closes.
  useEffect(() => {
    if (!snap) return;
    const focusables = () => [...(wrap.current?.querySelectorAll<HTMLElement>('button:not(:disabled), a[href]') ?? [])];
    const onKey = (e: KeyboardEvent) => {
      const within = inside(document.activeElement);
      if (!within && (e.target as HTMLElement | null)?.closest?.('dialog, [role="dialog"]')) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        dismissed.current = snap.text;
        close(within);
        return;
      }
      if (e.key === 'Tab' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const items = focusables();
        if (!items.length) return;
        if (!within) {
          if (e.shiftKey || (e.target as HTMLElement | null)?.closest('input, textarea, select, [contenteditable="true"], dialog')) return;
          e.preventDefault();
          returnTo.current = document.activeElement as HTMLElement | null;
          items[0].focus();
          return;
        }
        const at = items.indexOf(document.activeElement as HTMLElement);
        if ((!e.shiftKey && at === items.length - 1) || (e.shiftKey && at === 0)) { e.preventDefault(); dismissed.current = snap.text; close(true); }
        return;
      }
      if (within && (e.key === 'ArrowRight' || e.key === 'ArrowLeft') && (document.activeElement as HTMLElement)?.closest('[role="toolbar"]')) {
        const items = [...(wrap.current?.querySelectorAll<HTMLElement>('[role="toolbar"] button:not(:disabled), [role="toolbar"] a[href]') ?? [])];
        const at = items.indexOf(document.activeElement as HTMLElement);
        if (at < 0) return;
        e.preventDefault();
        items[(at + (e.key === 'ArrowRight' ? 1 : -1) + items.length) % items.length].focus();
      }
    };
    document.addEventListener('keydown', onKey, true);
    return () => document.removeEventListener('keydown', onKey, true);
  }, [snap, close]);

  // Place it just below the selection (above it when there is no room), clamped to the viewport; follow scrolling.
  useLayoutEffect(() => {
    const el = wrap.current;
    if (!snap || !el) return;
    const place = () => {
      if (bottom) { el.style.left = ''; el.style.top = ''; el.dataset.side = 'top'; return; }
      const r = snap.range.getBoundingClientRect();
      const w = el.offsetWidth, h = el.querySelector<HTMLElement>('[role="toolbar"]')?.offsetHeight ?? el.offsetHeight, m = 8;
      const nav = 72;
      // Scrolled out of view: step aside until the selection is back (never pinned to an edge, away from its text).
      el.toggleAttribute('data-away', r.bottom < nav || r.top > innerHeight);
      // The side is chosen once per selection (with room below for a gloss), so the bar never jumps after a click.
      if (sideFor.current.snap !== snap) sideFor.current = { snap, side: r.bottom + m + h + GLOSS_ROOM <= innerHeight - m || r.top - 56 - h - GLOSS_ROOM < nav ? 'bottom' : 'top' };
      const side = sideFor.current.side;
      const top = Math.max(nav, Math.min(side === 'bottom' ? r.bottom + m : r.top - 56 - h, innerHeight - h - m));
      const left = Math.max(16, Math.min(r.left + r.width / 2 - w / 2, innerWidth - w - 16));
      el.style.left = `${Math.round(left)}px`;
      el.style.top = `${Math.round(top)}px`;
      el.dataset.side = side;
    };
    place();
    const raf = requestAnimationFrame(() => setShown(true));
    let pending = 0;
    const onMove = () => { cancelAnimationFrame(pending); pending = requestAnimationFrame(place); };
    addEventListener('scroll', onMove, { passive: true, capture: true });
    addEventListener('resize', onMove);
    // Content that loads above the selection moves it without a scroll event.
    const ro = new ResizeObserver(onMove);
    ro.observe(document.body);
    return () => { cancelAnimationFrame(raf); cancelAnimationFrame(pending); ro.disconnect(); removeEventListener('scroll', onMove, true); removeEventListener('resize', onMove); };
  }, [snap, bottom, gloss]);

  useEffect(() => {
    if (!reading) return;
    const t = setInterval(() => { if (!isReading()) setReading(false); }, 400);
    return () => clearInterval(t);
  }, [reading]);

  if (!snap) return null;

  const href = (id: string) => (snap.unit ? `/${snap.unit}/concept/${id.replace(`${snap.unit}-`, '')}` : '#');
  const quizHref = snap.unit
    ? snap.concept
      ? `/${snap.unit}/quiz?concept=${snap.concept.id}`
      : snap.concepts[0]
        ? `/${snap.unit}/quiz?mode=week&week=${snap.concepts[0].id.split('-').slice(0, 2).join('-')}`
        : `/${snap.unit}/quiz`
    : null;

  async function explain() {
    const s = snapRef.current;
    if (!s) return;
    if (gloss && gloss.kind !== 'loading') { setGloss(null); return; }
    setGloss({ kind: 'loading' });
    const waysIn = document.getElementById('ways-in') ? '#ways-in' : s.concept ? `${href(s.concept.id)}#ways-in` : null;
    if (!s.unit) { setGloss({ kind: 'none', waysIn }); return; }
    const [bundle, index] = await Promise.all([loadAids(s.unit), conceptIndex()]);
    if (snapRef.current !== s) return;
    const terms: Term[] = Object.values(bundle.aids).flatMap((a) => a.terms.map((t) => ({ ...t, concept: a.concept })));
    const t = findGloss(s.text, terms, s.concepts.map((c) => c.id));
    if (!t) { setGloss({ kind: 'none', waysIn }); return; }
    const meta = index.get(t.concept);
    markFormat(t.concept, 'glossary');
    setGloss({ kind: 'match', term: t, title: s.concepts.find((c) => c.id === t.concept)?.title ?? meta?.title ?? t.concept.replace(/^[a-z]+\d+-w\d+-/, '').replace(/-/g, ' '), href: meta?.href ?? href(t.concept) });
  }

  function card() {
    const s = snapRef.current;
    if (!s) return;
    if (!s.para) { setStatus('Cards come from sentences in the notes: select a few words inside one paragraph.'); return; }
    // Reuse the sentence-to-card flow as is: it reads the live selection and listens for C (src/lib/sentence-card.ts).
    const sel = getSelection();
    sel?.removeAllRanges();
    sel?.addRange(s.range);
    s.para.dispatchEvent(new KeyboardEvent('keydown', { key: 'c', bubbles: true, cancelable: true }));
    dismissed.current = s.text;
    close(inside(document.activeElement));
  }

  function readAloud() {
    const s = snapRef.current;
    if (!s) return;
    if (reading) { stopReading(); setReading(false); return; }
    if (s.concept) markFormat(s.concept.id, 'listen');
    setReading(true);
    read([{ text: s.text, range: s.range }], { onEnd: () => setReading(false) });
  }

  return (
    <div ref={wrap} className="selection-tools" data-mode={bottom ? 'bar' : 'float'} data-shown={shown || undefined} onMouseDown={(e) => e.preventDefault()}>
      <div className="selection-tools__bar" role="toolbar" aria-label="Selected text" aria-orientation="horizontal">
        <button className="btn btn--ghost btn--sm selection-tools__btn" type="button" aria-expanded={!!gloss && gloss.kind !== 'loading'} onClick={explain}>Explain</button>
        <button className="btn btn--ghost btn--sm selection-tools__btn" type="button" onClick={card}>Make a card</button>
        {quizHref && <a className="btn btn--ghost btn--sm selection-tools__btn" href={quizHref}>Quiz me on this</a>}
        <button className="btn btn--ghost btn--sm selection-tools__btn" type="button" onClick={readAloud} disabled={!speechSupported()} aria-pressed={reading}>{reading ? 'Stop reading' : 'Read aloud'}</button>
      </div>
      {status && <p className="selection-tools__status" role="status">{status}</p>}
      {gloss && (
        <div className="popover selection-tools__gloss" data-open="true" role="region" aria-label="Glossary" aria-live="polite">
          {gloss.kind === 'loading' && <p className="selection-tools__muted">Looking it up…</p>}
          {gloss.kind === 'match' && (
            <>
              <p className="label">Glossary</p>
              <p className="selection-tools__term"><strong>{gloss.term.term}</strong>: {gloss.term.gloss}</p>
              {gloss.term.example && <p className="selection-tools__muted">For example: {gloss.term.example}</p>}
              <p><a href={gloss.href}>From “{gloss.title}”</a></p>
            </>
          )}
          {gloss.kind === 'none' && (
            <p>No glossary match — {gloss.waysIn ? <a href={gloss.waysIn}>try the concept’s Ways in</a> : 'try the concept’s Ways in'}.</p>
          )}
        </div>
      )}
    </div>
  );
}
