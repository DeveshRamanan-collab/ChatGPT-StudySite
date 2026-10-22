// ≡ drawer (rebuilt Oct 2026; plan docs/plans/2026-10-ingest-and-drawer.md). A native modal <dialog> from the left:
// fixed head (name, Search, close) → a scroll body holding a labelled <nav> (four collapsible units, every week) →
// tools → display dials; on phones a thumb-reach Close bar. Rules it keeps:
// - The body scrolls on its own: data-lenis-prevent (Lenis otherwise swallows the wheel) + overscroll containment;
//   while open the page is held (Lenis stopped, html.is-drawer-open { overflow: hidden }; scrollbar-gutter is stable).
// - Two clicks to any week (CLAUDE.md "Navigation"): a collapsed unit shows a row of week numbers; expanded, it shows
//   titled rows with a mastery mark. The current unit opens expanded with the current week centred; the rest
//   remember their own state (localStorage studysite:drawer-units).
// - Esc, backdrop, ≡, `M` and any navigation close it; focus returns to ≡. Never left half-open across a swap.
// - Motion: Full slide + fade, Calm fade, Off instant — all ≤ 180 ms (--dur-micro).
import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { useStudy, startStudySync } from '../lib/store';
import type { OverviewUnit } from '../lib/whatnext';
import { getLenis, setMotion } from '../lib/motion';
import { byExam, daysLabel, daysUntil, examDayLabel } from '../lib/exam';

type Unit = OverviewUnit & { name?: string; weeksExpected?: number };
type Theme = 'light' | 'white' | 'dark' | 'auto';
type Motion = 'full' | 'calm' | 'off';

const OPEN_KEY = 'studysite:drawer-units';
const html = () => document.documentElement;
const typing = (t: EventTarget | null) => !!(t as HTMLElement | null)?.closest?.('input, textarea, select, [contenteditable="true"]');
const readOpen = (): string[] => { try { const v = JSON.parse(localStorage.getItem(OPEN_KEY) || '[]'); return Array.isArray(v) ? v : []; } catch { return []; } };
const writeOpen = (ids: string[]) => { try { localStorage.setItem(OPEN_KEY, JSON.stringify(ids)); } catch { /* private mode */ } };
const trim = (p: string) => p.replace(/\/$/, '') || '/';

/** Which unit and week a path belongs to: /u/week/N, or /u/concept/wNN-… (the concept's week). */
function locate(path: string) {
  const m = path.match(/^\/([a-z]+\d{4})(?:\/(?:week\/(\d+)|concept\/w(\d{2})-))?/);
  return { unit: m?.[1], week: m?.[2] ? +m[2] : m?.[3] ? +m[3] : undefined, exact: !!m?.[2] };
}

function Ring({ value }: { value: number }) {
  const c = 2 * Math.PI * 8;
  return (
    <svg className="navsheet__ring" width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
      <circle cx="11" cy="11" r="8" fill="none" stroke="var(--line-strong, var(--ink-3))" strokeWidth="2" />
      {value > 0 && <circle cx="11" cy="11" r="8" fill="none" stroke="var(--sage)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray={`${c * value} ${c}`} transform="rotate(-90 11 11)" />}
    </svg>
  );
}

function Pills<T extends string>({ name, value, options, onChange }: { name: string; value: T; options: [T, string][]; onChange: (v: T) => void }) {
  return (
    <fieldset className="navsheet__dial">
      <legend className="navsheet__dial-label">{name}</legend>
      <div className="navsheet__dial-options">
        {options.map(([v, label]) => (
          <label key={v}><input type="radio" name={`navsheet-${name.toLowerCase()}`} value={v} checked={value === v} onChange={() => onChange(v)} /><span>{label}</span></label>
        ))}
      </div>
    </fieldset>
  );
}

export default function NavSheet() {
  const dlg = useRef<HTMLDialogElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const navClosed = useRef(false);
  const userMoved = useRef(false); // a key or pointer used inside the open drawer: never steal focus after that
  const [open, setOpen] = useState(false);
  const [units, setUnits] = useState<Unit[] | null>(null);
  const [path, setPath] = useState('/');
  const [expanded, setExpanded] = useState<string[]>([]);
  const [themeV, setThemeV] = useState<Theme>('auto');
  const [motionV, setMotionV] = useState<Motion>('full');
  const cards = useStudy((s) => s.cards);
  const criteria = useStudy((s) => s.criterion);

  const load = useCallback(() => {
    if (!units) fetch('/data/overview.json').then((r) => r.json()).then((us: Unit[]) => setUnits([...us].sort(byExam))).catch(() => {});
    startStudySync();
  }, [units]);

  const hold = (on: boolean) => {
    html().classList.toggle('is-drawer-open', on);
    const l = getLenis();
    if (l) on ? l.stop() : l.start();
  };

  const show = useCallback(() => {
    const d = dlg.current;
    if (!d || d.open) return;
    load();
    const p = location.pathname;
    const here = locate(p).unit;
    setPath(p);
    setExpanded(() => { const s = new Set(readOpen()); if (here) s.add(here); return [...s]; });
    setThemeV((html().dataset.theme as Theme) || 'auto');
    setMotionV((html().dataset.motion as Motion) || 'full');
    hold(true);
    userMoved.current = false;
    d.showModal();
    d.dataset.state = 'opening';
    requestAnimationFrame(() => { if (d.dataset.state === 'opening') d.dataset.state = 'open'; });
    setOpen(true);
  }, [load]);

  const hide = useCallback((instant = false) => {
    const d = dlg.current;
    if (!d || !d.open || d.dataset.state === 'closing') return;
    const done = () => { d.close(); d.dataset.state = ''; };
    if (instant || html().dataset.motion === 'off') return done();
    d.dataset.state = 'closing';
    setTimeout(done, parseFloat(getComputedStyle(html()).getPropertyValue('--dur-micro')) || 180);
  }, []);

  // Once open and the units are in, put focus on the current week (or the current unit, or the first unit) and
  // centre it in the scroll body.
  const focused = useRef(false);
  useEffect(() => {
    if (!open) { focused.current = false; return; }
    if (focused.current || !units) return;
    focused.current = true;
    if (userMoved.current) return;
    requestAnimationFrame(() => {
      const d = dlg.current, s = scroller.current;
      if (!d || !s || userMoved.current) return;
      const target = d.querySelector<HTMLElement>('.navsheet__row[aria-current]') ?? d.querySelector<HTMLElement>('[data-current-unit] .navsheet__toggle') ?? d.querySelector<HTMLElement>('.navsheet__toggle');
      target?.focus({ preventScroll: true });
      if (target && target.classList.contains('navsheet__row')) {
        const r = target.getBoundingClientRect(), b = s.getBoundingClientRect();
        s.scrollTop += r.top - b.top - (b.height - r.height) / 2;
      }
    });
  }, [open, units]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== 'm' || e.metaKey || e.ctrlKey || e.altKey || typing(e.target)) return;
      if (document.querySelector('dialog[open]:not(.navsheet)')) return;
      e.preventDefault();
      dlg.current?.open ? hide() : show();
    };
    // A swap must never leave the sheet open (or the page held). The persisted island survives the swap, so close
    // synchronously before it and hand focus back to ≡ once the new page is in.
    const onSwap = () => { if (dlg.current?.open) { navClosed.current = true; hide(true); } hold(false); };
    const onPage = () => {
      setPath(location.pathname);
      if (navClosed.current) { navClosed.current = false; btn.current?.focus({ preventScroll: true }); }
    };
    const onTheme = () => setThemeV((html().dataset.theme as Theme) || 'auto');
    const onMotion = () => setMotionV((html().dataset.motion as Motion) || 'full');
    addEventListener('keydown', onKey);
    document.addEventListener('astro:before-swap', onSwap);
    document.addEventListener('astro:page-load', onPage);
    document.addEventListener('studysite:theme', onTheme);
    document.addEventListener('motionchange', onMotion);
    return () => {
      removeEventListener('keydown', onKey);
      document.removeEventListener('astro:before-swap', onSwap);
      document.removeEventListener('astro:page-load', onPage);
      document.removeEventListener('studysite:theme', onTheme);
      document.removeEventListener('motionchange', onMotion);
    };
  }, [show, hide]);

  // Due cards per week (card ids start with the week id, e.g. laws2400-w04-c012).
  const due = useMemo(() => {
    const now = Date.now(), m = new Map<string, number>();
    for (const c of cards) if (c.due <= now && !c.suspended) { const k = c.cardId.match(/^([a-z]+\d{4}-w\d{2})-/)?.[1]; if (k) m.set(k, (m.get(k) ?? 0) + 1); }
    return m;
  }, [cards]);
  const dueTotal = useMemo(() => [...due.values()].reduce((a, b) => a + b, 0), [due]);

  // Mastery per week: learned counts 1, secured counts 2, over 2 × concepts.
  const mastery = (w: Unit['weeks'][number]) => {
    if (!w.concepts.length) return { v: 0, learned: 0, secured: 0 };
    let learned = 0, secured = 0;
    for (const c of w.concepts) { const k = criteria.get(c.id); if (k?.securedAt) secured++; else if (k?.learnedAt) learned++; }
    return { v: (learned + 2 * secured) / (2 * w.concepts.length), learned: learned + secured, secured };
  };

  const loc = locate(path);
  const toggle = (id: string) => setExpanded((prev) => {
    const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
    writeOpen(next);
    return next;
  });
  const cur = (href: string) => (trim(path) === trim(href) ? 'page' : undefined);
  const setThemeChoice = (t: Theme) => { setThemeV(t); import('../lib/theme').then((m) => m.setTheme(t)); };
  const setMotionChoice = (m: Motion) => { setMotionV(m); setMotion(m); };

  // Arrow keys move between the drawer's items; Home/End jump; ←/→ collapse/expand a unit from its header.
  const onKeyDown = (e: ReactKeyboardEvent<HTMLDialogElement>) => {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End', 'ArrowLeft', 'ArrowRight'].includes(e.key) || typing(e.target) && (e.target as HTMLInputElement).type !== 'radio') return;
    const t = e.target as HTMLElement;
    if (t.matches('input[type="radio"]') && e.key !== 'Home' && e.key !== 'End') return; // radios keep their own arrows
    if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && t.classList.contains('navsheet__toggle')) {
      const unit = t.closest<HTMLElement>('[data-unit]')?.dataset.unit;
      const isOpen = t.getAttribute('aria-expanded') === 'true';
      if (unit && (e.key === 'ArrowRight') !== isOpen) toggle(unit);
      e.preventDefault();
      return;
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') return;
    const items = [...(dlg.current?.querySelectorAll<HTMLElement>('[data-drawer-scroll] :is(a[href], button:not(:disabled))') ?? [])].filter((el) => el.getClientRects().length);
    if (!items.length) return;
    const i = items.indexOf(t);
    const n = e.key === 'Home' ? 0 : e.key === 'End' ? items.length - 1 : e.key === 'ArrowDown' ? (i + 1) % items.length : (i - 1 + items.length) % items.length;
    items[n].focus();
    items[n].scrollIntoView({ block: 'nearest' });
    e.preventDefault();
  };

  return (
    <>
      <button ref={btn} type="button" className="navsheet-btn" aria-label="Menu" aria-haspopup="dialog" aria-expanded={open} aria-controls="navsheet" aria-keyshortcuts="M" onClick={() => (dlg.current?.open ? hide() : show())}>
        <svg width="20" height="20" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 4.5h14M2 9h14M2 13.5h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
      </button>
      <dialog
        ref={dlg}
        id="navsheet"
        className="navsheet"
        aria-labelledby="navsheet-title"
        onKeyDown={(e) => { userMoved.current = true; onKeyDown(e); }}
        onPointerDown={() => { userMoved.current = true; }}
        onCancel={(e) => { e.preventDefault(); hide(); }}
        onClose={() => {
          setOpen(false);
          hold(false);
          if (!navClosed.current) btn.current?.focus({ preventScroll: true });
        }}
        onClick={(e) => {
          if (e.target === dlg.current) return hide(); // the ::backdrop
          const a = (e.target as Element).closest('a[href]');
          if (a && !(e.metaKey || e.ctrlKey || e.shiftKey)) { navClosed.current = true; hide(true); }
        }}
      >
        <div className="navsheet__frame">
          <header className="navsheet__head">
            <a className="navsheet__brand" id="navsheet-title" href="/">StudySite</a>
            <button type="button" className="navsheet__search" onClick={() => { hide(true); document.dispatchEvent(new CustomEvent('studysite:palette')); }}>
              Search <kbd className="kbd kbd--hint" aria-hidden="true" suppressHydrationWarning>⌘K</kbd>
            </button>
            <button type="button" className="navsheet__close" aria-label="Close menu" onClick={() => hide()}>
              <svg width="18" height="18" viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </button>
          </header>

          <div className="navsheet__body" ref={scroller} data-drawer-scroll data-lenis-prevent>
            <nav aria-label="Site">
              <h2 className="navsheet__label">Go straight to</h2><ul className="navsheet__list"><li><a href="/everything/">Everything index · every page</a></li><li><a href="/sources/">Source library · original materials</a></li><li><a href="/exams/">Exam command centre</a></li><li><a href="/cases/">Case library</a></li><li><a href="/statutes/">Legislation and treaties</a></li><li><a href="/studio/">Interactive learning studio</a></li></ul><h2 className="navsheet__label">Units and weeks</h2>
              {!units && <p className="navsheet__muted">Loading units…</p>}
              <ul className="navsheet__units">
                {units?.map((u) => {
                  const n = Math.max(u.weeksExpected ?? 12, ...u.weeks.map((w) => w.number));
                  const byNum = new Map(u.weeks.map((w) => [w.number, w]));
                  const isOpen = expanded.includes(u.id);
                  const isHere = loc.unit === u.id;
                  const listId = `navsheet-${u.id}`;
                  return (
                    <li key={u.id} className="navsheet__unit" data-unit={u.id} data-current-unit={isHere ? '' : undefined}>
                      <button type="button" className="navsheet__toggle" aria-expanded={isOpen} aria-controls={listId} onClick={() => toggle(u.id)}>
                        <span className="navsheet__unit-title"><span className="navsheet__code">{u.code}</span> {u.name}</span>
                        <span className="navsheet__muted navsheet__exam">Exam {examDayLabel(u.examDate)} · {daysLabel(daysUntil(u.examDate, Date.now()))}{u.exam?.status === 'draft' ? ' (draft)' : ''}</span>
                        <span className="navsheet__muted">{u.weeks.length} of {n} weeks in</span>
                        <svg className="navsheet__chev" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M4 5.5l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </button>
                      {!isOpen && (
                        <ol className="navsheet__chips" aria-label={`${u.code} weeks`}>
                          {Array.from({ length: n }, (_, i) => {
                            const w = byNum.get(i + 1);
                            return (
                              <li key={i} data-week={i + 1}>
                                {w ? (
                                  <a className="navsheet__chip" href={w.href} aria-label={`Week ${i + 1}: ${w.topic}`} aria-current={isHere && loc.week === i + 1 ? (loc.exact ? 'page' : 'true') : undefined}>{i + 1}</a>
                                ) : (
                                  <span className="navsheet__chip navsheet__chip--off" aria-label={`Week ${i + 1}, not in yet`}>{i + 1}</span>
                                )}
                              </li>
                            );
                          })}
                        </ol>
                      )}
                      <div id={listId} className="navsheet__panel" hidden={!isOpen}>
                        <ol className="navsheet__rows" aria-label={`${u.code} weeks`}>
                          {Array.from({ length: n }, (_, i) => {
                            const w = byNum.get(i + 1);
                            if (!w) return (
                              <li key={i} data-week={i + 1}><span className="navsheet__row navsheet__row--off"><span className="navsheet__num" aria-hidden="true">{i + 1}</span><span>Week {i + 1} · not in yet</span></span></li>
                            );
                            const d = due.get(w.id) ?? 0;
                            const m = mastery(w);
                            const current = isHere && loc.week === i + 1 ? (loc.exact ? 'page' : 'true') : undefined;
                            return (
                              <li key={i} data-week={i + 1}>
                                <a className="navsheet__row" href={w.href} aria-current={current}>
                                  <span className="navsheet__num" aria-hidden="true">{i + 1}</span>
                                  <span className="navsheet__row-text">
                                    <span className="visually-hidden">Week {i + 1}: </span>{w.topic}
                                    {d > 0 && <span className="navsheet__due">{d} {d === 1 ? 'card' : 'cards'} due</span>}
                                    <span className="visually-hidden">, {m.learned} of {w.concepts.length} concepts learned{m.secured ? `, ${m.secured} secured` : ''}</span>
                                  </span>
                                  <Ring value={m.v} />
                                </a>
                              </li>
                            );
                          })}
                        </ol>
                        <p className="navsheet__unit-links">
                          <a href={`/${u.id}/`} aria-current={cur(`/${u.id}/`)}>Hub</a>
                          <a href={`/${u.id}/quiz`} aria-current={cur(`/${u.id}/quiz`)}>Quiz me</a>
                          <a href={`/${u.id}/cards`} aria-current={cur(`/${u.id}/cards`)}>Cards</a>
                          <a href={`/${u.id}/questions`} aria-current={cur(`/${u.id}/questions`)}>Questions</a><a href={`/${u.id}/exam/`}>Exam</a><a href={`/cases/?unit=${u.id}`}>Cases</a><a href={`/statutes/?unit=${u.id}`}>Legislation</a>
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <h2 className="navsheet__label">Study</h2>
              <ul className="navsheet__list">
                <li><a href="/dashboard" aria-current={cur('/dashboard')}>Dashboard</a></li>
                <li><a href="/plan" aria-current={cur('/plan')}>Study plan</a></li>
                <li><a href="/map" aria-current={cur('/map')}>Knowledge map</a></li>
                <li><a href="/exam" aria-current={cur('/exam')}>Exam paper · all units</a></li>
                <li><a href="/cards" aria-current={cur('/cards')}>Due cards{dueTotal > 0 && <span className="navsheet__count"> {dueTotal}</span>}</a></li>
                <li><a href="/settings" aria-current={cur('/settings')}>Settings</a></li>
                <li><button type="button" onClick={() => { hide(true); document.dispatchEvent(new CustomEvent('studysite:shortcuts')); }}>Keyboard shortcuts</button></li>
              </ul>
            </nav>

            <div className="navsheet__dials">
              <Pills name="Theme" value={themeV} options={[['light', 'Light'], ['white', 'White'], ['dark', 'Dark'], ['auto', 'Auto']]} onChange={setThemeChoice} />
              <Pills name="Motion" value={motionV} options={[['full', 'Full'], ['calm', 'Calm'], ['off', 'Off']]} onChange={setMotionChoice} />
            </div>
          </div>

          <div className="navsheet__thumb">
            <button type="button" onClick={() => hide()}>Close menu</button>
          </div>
        </div>
      </dialog>
    </>
  );
}
