// Annotations and highlights on notes pages. Select text inside a paragraph → a small toolbar offers Highlight
// (H) and Note (N); saved to Dexie with the paragraph anchor (#para-N) and the quoted text. Highlights are drawn
// with the CSS Custom Highlight API (no DOM changes). On wide screens a margin rail shows a marker beside each
// annotated paragraph; everywhere, "Your notes" lists them at the end. Searchable in the palette; exported.
import type { Annotation } from './db';
// Dexie loads only on pages with notes (keeps it out of every page's first script).
const dbp = () => import('./db').then((m) => m.db);

const HL = 'annotation';
let bar: HTMLDivElement | null = null;
let pending: { para: HTMLElement; quote: string } | null = null;

const article = () => document.querySelector<HTMLElement>('.prose.notes, article.prose');

function findRange(para: HTMLElement, quote: string): Range | null {
  const walker = document.createTreeWalker(para, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  let all = '';
  for (let n = walker.nextNode(); n; n = walker.nextNode()) { nodes.push(n as Text); all += n.textContent; }
  const at = all.indexOf(quote);
  if (at < 0) return null;
  const r = document.createRange();
  let pos = 0, started = false;
  for (const n of nodes) {
    const len = n.textContent!.length;
    if (!started && at < pos + len) { r.setStart(n, at - pos); started = true; }
    if (started && at + quote.length <= pos + len) { r.setEnd(n, at + quote.length - pos); return r; }
    pos += len;
  }
  return null;
}

async function render() {
  const art = article();
  const h = (CSS as any).highlights;
  if (!art) return;
  const db = await dbp();
  const rows = await db.annotations.where('route').equals(location.pathname).toArray().catch(() => [] as Annotation[]);
  const ranges = rows.map((a) => { const p = document.getElementById(a.anchor); return p ? findRange(p, a.quote) : null; }).filter((r): r is Range => !!r);
  if (h) { if (ranges.length) h.set(HL, new (window as any).Highlight(...ranges)); else h.delete(HL); }
  renderRail(art, rows);
  renderList(art, rows);
}

function renderRail(art: HTMLElement, rows: Annotation[]) {
  let rail = art.querySelector<HTMLElement>(':scope > .ann-rail');
  if (!rail) { rail = document.createElement('div'); rail.className = 'ann-rail'; rail.setAttribute('aria-hidden', 'true'); art.prepend(rail); }
  art.classList.add('has-ann-rail');
  rail.replaceChildren(...rows.filter((a) => a.note).map((a) => {
    const p = document.getElementById(a.anchor);
    const m = document.createElement('div');
    m.className = 'ann-rail__note';
    m.textContent = a.note;
    if (p) m.style.top = `${p.offsetTop}px`;
    return m;
  }));
}

function renderList(art: HTMLElement, rows: Annotation[]) {
  let box = document.querySelector<HTMLElement>('[data-ann-list]');
  if (!rows.length) { box?.remove(); return; }
  if (!box) { box = document.createElement('section'); box.dataset.annList = ''; box.className = 'ann-list'; box.setAttribute('aria-label', 'Your notes'); art.after(box); }
  box.innerHTML = '<h2>Your notes</h2><ul></ul>';
  const ul = box.querySelector('ul')!;
  for (const a of rows) {
    const li = document.createElement('li');
    const link = document.createElement('a'); link.href = `#${a.anchor}`; link.textContent = `“${a.quote.length > 90 ? `${a.quote.slice(0, 89)}…` : a.quote}”`;
    li.append(link);
    if (a.note) { const n = document.createElement('p'); n.textContent = a.note; li.append(n); }
    const del = document.createElement('button'); del.type = 'button'; del.className = 'btn btn--ghost btn--sm'; del.textContent = 'Remove';
    del.addEventListener('click', async () => { await (await dbp()).annotations.delete(a.id!); render(); });
    li.append(del);
    ul.append(li);
  }
}

function toolbar() {
  if (bar?.isConnected) return bar;
  bar = document.createElement('div');
  bar.className = 'ann-bar';
  bar.setAttribute('role', 'toolbar');
  bar.setAttribute('aria-label', 'Annotate selection');
  bar.innerHTML = '<button type="button" class="btn btn--secondary btn--sm" data-ann="hl">Highlight <kbd class="kbd">H</kbd></button><button type="button" class="btn btn--ghost btn--sm" data-ann="note">Note <kbd class="kbd">N</kbd></button><span class="ann-bar__hint">or <kbd class="kbd">C</kbd> for a card</span>';
  bar.addEventListener('mousedown', (e) => e.preventDefault());
  bar.addEventListener('click', (e) => { const k = (e.target as HTMLElement).closest<HTMLElement>('[data-ann]')?.dataset.ann; if (k) save(k === 'note'); });
  document.body.append(bar);
  return bar;
}

function hideBar() { if (bar) bar.dataset.open = 'false'; pending = null; }

function onSelect() {
  if (document.activeElement?.classList.contains('ann-bar__input')) return;
  const sel = getSelection();
  const text = sel?.toString().trim() ?? '';
  const node = sel?.anchorNode;
  const para = (node?.nodeType === 1 ? (node as Element) : node?.parentElement)?.closest<HTMLElement>('[id^="para-"]');
  if (!text || !para || !article()?.contains(para) || text.length > 600) { hideBar(); return; }
  pending = { para, quote: text.replace(/\s+/g, ' ') };
  const r = sel!.getRangeAt(0).getBoundingClientRect();
  const b = toolbar();
  b.style.left = `${Math.max(16, Math.min(innerWidth - 300, r.left))}px`;
  b.style.top = `${Math.max(72, r.top - 48)}px`;
  b.dataset.open = 'true';
}

async function save(withNote: boolean) {
  if (!pending) return;
  let note = '';
  if (withNote) {
    // Inline note field in the toolbar (never a blocking dialog); Enter saves, Esc cancels.
    const b = toolbar();
    const saved = { ...pending };
    b.innerHTML = '<label class="visually-hidden" for="ann-note">Your note</label><input id="ann-note" class="ann-bar__input" autocomplete="off" placeholder="Your note, then Enter" />';
    const input = b.querySelector<HTMLInputElement>('input')!;
    input.focus();
    await new Promise<void>((res) => input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { note = input.value.trim(); res(); } if (e.key === 'Escape') { note = ''; res(); } }));
    bar?.remove(); bar = null;
    if (!note) { hideBar(); return; }
    pending = saved;
  }
  const { para: p2, quote: q2 } = pending!;
  await (await dbp()).annotations.add({ route: location.pathname, anchor: p2.id, quote: q2, note, at: Date.now() });
  getSelection()?.removeAllRanges();
  hideBar();
  render();
}

export function wireAnnotations() {
  document.addEventListener('astro:page-load', () => { hideBar(); if (article()) setTimeout(render, 50); });
  if ((window as any).__ann) return;
  (window as any).__ann = true;
  document.addEventListener('selectionchange', () => { clearTimeout((window as any).__annT); (window as any).__annT = setTimeout(onSelect, 150); });
  document.addEventListener('keydown', (e) => {
    if (!pending || e.metaKey || e.ctrlKey || e.altKey || (e.target as HTMLElement)?.closest('input, textarea, [contenteditable="true"], dialog')) return;
    const k = e.key.toLowerCase();
    if (k === 'h' || k === 'n') { e.preventDefault(); save(k === 'n'); }
    if (e.key === 'Escape') hideBar();
  });
  addEventListener('resize', () => { const a = article(); if (a) render(); });
}
