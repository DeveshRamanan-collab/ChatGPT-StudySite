// Command palette: ⌘K / Ctrl K (or the header Search button). Fuse.js over /data/search-index.json plus the
// student's annotations (Dexie) at runtime. Typed filters case: week:3 wrong: unit:; ">" lists commands.
// Native <dialog> gives the focus trap and Esc; enter scales from the search button (origin-aware) with a
// 2px blur clearing over 200ms; closing reverses in 150ms. Backdrop blur only when motion is full.
import { replayIntro } from '../lib/replay';
import { useEffect, useMemo, useRef, useState } from 'react';
import type Fuse from 'fuse.js';
import { navigate } from 'astro:transitions/client';
import { setMotion, type MotionLevel } from '../lib/motion';

type Kind = 'page' | 'week' | 'concept' | 'case' | 'authority' | 'question' | 'note' | 'command';
export interface Item { k: Kind; t: string; s?: string; h?: string; u?: string; w?: number; id?: string; run?: () => void }

const RECENT_KEY = 'studysite:palette-recent';
const SET_KEY = 'studysite:retest-set';
const SECTION: Record<Kind, string> = { page: 'Jump to', week: 'Jump to', concept: 'Jump to', case: 'Jump to', authority: 'Jump to', note: 'Your notes', question: 'Questions', command: 'Commands' };
const KIND_LABEL: Record<Kind, string> = { page: 'Page', week: 'Notes', concept: 'Concept', case: 'Case', authority: 'Authority', question: 'Question', note: 'Annotation', command: 'Command' };

const readRecent = (): Item[] => { try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); } catch { return []; } };
const pushRecent = (it: Item) => {
  if (it.k === 'command') return;
  const { run, ...plain } = it;
  const next = [plain, ...readRecent().filter((r) => r.h !== it.h || r.id !== it.id)].slice(0, 6);
  try { localStorage.setItem(RECENT_KEY, JSON.stringify(next)); } catch {}
};

/** Parse typed filters out of the query. Exported for tests. */
export function parseQuery(raw: string) {
  const f: { kind?: Kind; week?: number; wrong?: boolean; unit?: string; command: boolean; text: string } = { command: false, text: '' };
  let q = raw.trimStart();
  if (q.startsWith('>')) { f.command = true; q = q.slice(1); }
  q = q.replace(/\b(case|week|wrong|unit|concept|authority|question|q):(\S*)/gi, (_, key: string, val: string) => {
    const k = key.toLowerCase();
    if (k === 'week' && /^\d+$/.test(val)) f.week = Number(val);
    else if (k === 'wrong') f.wrong = true;
    else if (k === 'unit' && val) f.unit = val.toLowerCase();
    else if (k === 'case' || k === 'concept' || k === 'authority') { f.kind = k as Kind; if (val) q += ` ${val}`; }
    else if (k === 'question' || k === 'q') { f.kind = 'question'; if (val) q += ` ${val}`; }
    return ' ';
  });
  f.text = q.replace(/\s+/g, ' ').trim();
  return f;
}

function commands(units: { id: string; t: string }[]): Item[] {
  const motion = (m: MotionLevel): Item => ({ k: 'command', t: `Motion ${m}`, s: 'Motion dial', run: () => setMotion(m) });
  return [
    { k: 'command', t: 'What next?', s: 'The one thing to do now', h: '/?next=1' },
    ...units.map((u) => ({ k: 'command' as const, t: `Start quiz ${u.t}`, s: 'Adaptive quiz', h: `/${u.id}/quiz` })),
    ...units.map((u) => ({ k: 'command' as const, t: `Review due ${u.t}`, s: 'Flashcards due today', h: `/${u.id}/cards` })),
    { k: 'command', t: 'Focus mode', s: 'Hide everything but the active card', run: () => document.dispatchEvent(new CustomEvent('studysite:focus', { detail: { toggle: true } })) },
    motion('full'), motion('calm'), motion('off'),
    ...(['light', 'white', 'dark', 'auto'] as const).map((t): Item => ({ k: 'command', t: `Theme ${t}`, s: t === 'dark' ? 'Lamp-lit' : t === 'auto' ? 'Follow the system' : t === 'white' ? 'Pure white page' : 'Paper', run: () => import('../lib/theme').then((m) => m.setTheme(t)) })),
    { k: 'command', t: 'Study plan', s: 'Open the plan', h: '/plan' },
    { k: 'command', t: 'Map', s: 'Every concept across the course', h: '/map' },
    { k: 'command', t: 'Cases explorer', s: 'Every case on a timeline, by court', h: '/cases' },
    { k: 'command', t: 'Glossary', s: 'Every term, in your course\'s sense', h: '/glossary' },
    { k: 'command', t: 'What I know', s: 'Strengths, recurring errors, what needs review, open questions', h: '/insight' },
    { k: 'command', t: 'Content health', s: 'Stale content, coverage map, things to verify', h: '/content-health' },
    { k: 'command', t: 'Statutes', s: 'Every provision, with its cases and cross-references', h: '/statutes' },
    { k: 'command', t: 'Replay intro', s: 'Plays with Motion: Full', run: replayIntro },
    { k: 'command', t: 'Make a diagram card (image occlusion)', s: 'Hide labels on a diagram', h: '/occlusion' },
    { k: 'command', t: 'Compare two cases or concepts', s: 'Side by side, scroll-synchronised', h: '/compare' },
    { k: 'command', t: 'Settings', s: 'Companion, noise, deep dive', h: '/settings' },
    { k: 'command', t: 'Low stimulation on', s: 'Quieter screen: no motion, glass, glow or noise', run: () => import('../lib/lowstim').then((m) => m.setLowStim(true)) },
    { k: 'command', t: 'Low stimulation off', s: 'Restore your previous settings', run: () => import('../lib/lowstim').then((m) => m.setLowStim(false)) },
    ...(['sm', 'md', 'lg', 'xl'] as const).map((v): Item => ({ k: 'command', t: `Text size ${({ sm: 'smaller', md: 'standard', lg: 'larger', xl: 'largest' })[v]}`, s: 'Reading text', run: () => import('../lib/prefs').then((m) => m.setPrefs({ textSize: v })) })),
    { k: 'command', t: 'Deep dive', s: 'No end; a soft note at 45 minutes', run: () => import('../lib/block').then((b) => b.startBlock({ kind: 'deep', unit: 'due', ifThen: 'Deep dive', minutes: 45 })) },
    { k: 'command', t: 'Export progress', s: 'Download your data as JSON', h: '/settings#export' },
    { k: 'command', t: 'Exam paper — all units', s: 'Interleaved exam simulation', h: '/exam' },
    { k: 'command', t: 'Keyboard shortcuts', s: 'Show the cheat-sheet (?)', run: () => document.dispatchEvent(new CustomEvent('studysite:shortcuts')) },
  ];
}

export default function Palette() {
  const dlg = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const [index, setIndex] = useState<Item[] | null>(null);
  const [notes, setNotes] = useState<Item[]>([]);
  const [wrong, setWrong] = useState<Set<string> | null>(null);
  const [fuseMod, setFuseMod] = useState<typeof Fuse | null>(null);
  const [recent, setRecent] = useState<Item[]>([]);

  // Open from shortcut or any [data-palette-open] trigger (the header Search link degrades to /search).
  useEffect(() => {
    const show = (from?: Element | null) => {
      const d = dlg.current;
      if (!d || d.open) return;
      const r = from?.getBoundingClientRect();
      if (r) {
        d.style.setProperty('--palette-ox', `${r.left + r.width / 2}px`);
        d.style.setProperty('--palette-oy', `${r.top + r.height / 2}px`);
      } else { d.style.removeProperty('--palette-ox'); d.style.removeProperty('--palette-oy'); }
      setRecent(readRecent());
      setQ(''); setSel(0); setClosing(false);
      d.showModal();
      setOpen(true);
      requestAnimationFrame(() => input.current?.focus());
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (dlg.current?.open) close(); else show(document.querySelector('[data-palette-open]'));
      }
    };
    const onClick = (e: MouseEvent) => {
      const t = (e.target as Element).closest?.('[data-palette-open]');
      if (!t || e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      show(t);
    };
    const onOpen = () => show(document.querySelector('[data-palette-open]'));
    const mac = /Mac|iPhone|iPad/.test(navigator.platform);
    const hint = () => document.querySelectorAll('.kbd--hint').forEach((k) => (k.textContent = mac ? '⌘K' : 'Ctrl K'));
    hint();
    document.addEventListener('astro:page-load', hint);
    addEventListener('keydown', onKey);
    document.addEventListener('click', onClick);
    document.addEventListener('studysite:palette', onOpen);
    return () => { removeEventListener('keydown', onKey); document.removeEventListener('click', onClick); document.removeEventListener('studysite:palette', onOpen); document.removeEventListener('astro:page-load', hint); };
  }, []);

  // Lazy: the index, Fuse and the student's own data load on first open only.
  useEffect(() => {
    if (!open) return;
    if (!index) fetch('/data/search-index.json').then((r) => r.json()).then(setIndex, () => setIndex([]));
    if (!fuseMod) import('fuse.js').then((m) => setFuseMod(() => m.default));
    import('../lib/db').then(async ({ db }) => {
      const anns = await db.annotations.toArray().catch(() => []);
      setNotes(anns.map((a) => ({ k: 'note' as const, t: a.note || a.quote, s: a.quote, h: `${a.route}#${a.anchor}` })));
      const attempts = await db.attempts.toArray().catch(() => []);
      const last = new Map<string, boolean | null>();
      for (const a of attempts.sort((x, y) => x.at - y.at)) last.set(a.questionId, a.correct);
      setWrong(new Set([...last].filter(([, c]) => c === false).map(([id]) => id)));
    }).catch(() => setWrong(new Set()));
  }, [open]);

  const unitList = useMemo(
    () => (index ?? []).filter((i) => i.k === 'page' && i.s === 'Unit hub').map((i) => ({ id: i.u!, t: i.t.split(' ')[0] })),
    [index],
  );
  const all = useMemo(() => [...(index ?? []), ...notes], [index, notes]);
  const fuse = useMemo(
    () => (fuseMod && all.length ? new fuseMod(all, { keys: [{ name: 't', weight: 2 }, { name: 's', weight: 1 }], threshold: 0.36, ignoreLocation: true }) : null),
    [fuseMod, all],
  );

  const results = useMemo((): Item[] => {
    const f = parseQuery(q);
    if (f.command) {
      const cmds = commands(unitList);
      if (!f.text) return cmds;
      const needle = f.text.toLowerCase();
      return cmds.filter((c) => c.t.toLowerCase().includes(needle) || needle.split(' ').every((w) => c.t.toLowerCase().includes(w)));
    }
    const filtered = f.kind || f.week || f.wrong || f.unit;
    if (!q.trim()) {
      const jump = (index ?? []).filter((i) => i.k === 'page' && (i.s === 'Unit hub' || !i.u)).slice(0, 9);
      return [...recent.map((r) => ({ ...r, s: r.s })), ...jump, ...commands(unitList).slice(0, 1)];
    }
    let pool: Item[] = all;
    if (f.kind) pool = pool.filter((i) => i.k === f.kind);
    if (f.week) pool = pool.filter((i) => i.w === f.week);
    if (f.unit) pool = pool.filter((i) => i.u?.startsWith(f.unit!) || i.t.toLowerCase().startsWith(f.unit!));
    if (f.wrong) pool = pool.filter((i) => i.k === 'question' && wrong?.has(i.id!));
    if (!f.text) return pool.slice(0, 50);
    const hits = filtered && fuseMod
      ? new fuseMod(pool, { keys: [{ name: 't', weight: 2 }, { name: 's', weight: 1 }], threshold: 0.36, ignoreLocation: true }).search(f.text, { limit: 50 })
      : fuse?.search(f.text, { limit: 50 }) ?? [];
    const items = hits.map((h) => h.item);
    // Jump-to targets first, then notes, then questions.
    const rank = (i: Item) => (i.k === 'question' ? 2 : i.k === 'note' ? 1 : 0);
    return items.map((it, n) => ({ it, n })).sort((a, b) => rank(a.it) - rank(b.it) || a.n - b.n).map((x) => x.it).slice(0, 30);
  }, [q, all, fuse, fuseMod, index, notes, wrong, recent, unitList]);

  useEffect(() => { setSel(0); }, [q]);

  function close() {
    const d = dlg.current;
    if (!d?.open) return;
    setClosing(true);
    const reduce = document.documentElement.dataset.motion === 'off';
    setTimeout(() => { d.close(); setClosing(false); setOpen(false); }, reduce ? 0 : 150);
  }

  function choose(it: Item | undefined) {
    if (!it) return;
    pushRecent(it);
    close();
    if (it.run) { it.run(); return; }
    if (it.k === 'question' && it.id) { try { sessionStorage.setItem(SET_KEY, JSON.stringify([it.id])); } catch {} }
    if (it.h) navigate(it.h);
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(results.length - 1, s + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(0, s - 1)); }
    else if (e.key === 'Enter') { e.preventDefault(); choose(results[sel]); }
    else if (e.key === 'Escape') { e.preventDefault(); close(); }
  };

  useEffect(() => {
    dlg.current?.querySelector(`[data-index="${sel}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [sel]);

  const recentKeys = new Set(q.trim() ? [] : recent.map((r) => `${r.h}|${r.id ?? ''}`));
  let lastSection = '';
  return (
    <dialog
      ref={dlg}
      className="palette glass"
      data-closing={closing || undefined}
      aria-label="Command palette"
      onCancel={(e) => { e.preventDefault(); close(); }}
      onClick={(e) => { if (e.target === dlg.current) close(); }}
    >
      {open && (
        <div className="palette__body" onKeyDown={onKeyDown}>
          <input
            ref={input}
            className="palette__input"
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-activedescendant={results[sel] ? `palette-opt-${sel}` : undefined}
            aria-label="Search or type > for commands"
            placeholder="Search, or > for commands · case: week:3 wrong:"
            autoComplete="off"
            spellCheck={false}
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <ul className="palette__list" id="palette-list" role="listbox" aria-label="Results">
            {index === null && <li className="palette__empty">Loading…</li>}
            {index !== null && results.length === 0 && <li className="palette__empty">Nothing matches. Try fewer words, or Enter on Search for full text.</li>}
            {results.map((it, i) => {
              const section = recentKeys.has(`${it.h}|${it.id ?? ''}`) && i < recent.length ? 'Recent' : SECTION[it.k];
              const head = section !== lastSection ? section : null;
              lastSection = section;
              return (
                <li key={`${it.k}-${it.h}-${it.id ?? ''}-${i}`} role="presentation">
                  {head && <p className="palette__section label" role="presentation">{head}</p>}
                  <div
                    id={`palette-opt-${i}`}
                    data-index={i}
                    role="option"
                    aria-selected={i === sel}
                    className="palette__item"
                    data-cursor="link"
                    onMouseMove={() => sel !== i && setSel(i)}
                    onClick={() => choose(it)}
                  >
                    <span className="palette__title">{it.t}</span>
                    <span className="palette__meta">{KIND_LABEL[it.k]}{it.s ? ` · ${it.s}` : ''}</span>
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="palette__foot"><kbd className="kbd">↑</kbd><kbd className="kbd">↓</kbd> move · <kbd className="kbd">Enter</kbd> open · <kbd className="kbd">Esc</kbd> close <a href={`/search?q=${encodeURIComponent(parseQuery(q).text)}`} onClick={() => close()}>Full-text search</a></p>
        </div>
      )}
    </dialog>
  );
}
