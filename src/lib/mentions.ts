// Case / authority / clause popovers for every a.mention in the notes (see rehype-mentions.mjs).
// Hover (fine pointer, 120ms intent) or keyboard focus shows a brief card: 120ms in, 200ms out, growing from the
// edge nearest the mention. Click follows the link; the mention carries the case's shared-element name so the
// brief card morphs into the full case card (view transition). Never a modal.
type CaseBrief = { n: string; c: string; r: string; w: string; v: boolean };
type AuthBrief = { t: string; k: string; x: string; g: string; cs: { id: string; n: string }[]; v: boolean };
type Data = { cases: Record<string, CaseBrief>; authorities: Record<string, AuthBrief> };

let data: Promise<Data> | null = null;
const load = () => (data ??= fetch('/data/mentions.json').then((r) => r.json()));
let pop: HTMLDivElement | null = null;
let current: HTMLElement | null = null;
let showT = 0, hideT = 0;

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

function panel() {
  if (pop && document.body.contains(pop)) return pop;
  pop = document.createElement('div');
  pop.className = 'popover mention-pop glass';
  pop.setAttribute('role', 'tooltip');
  pop.id = 'mention-pop';
  pop.addEventListener('pointerenter', () => clearTimeout(hideT));
  pop.addEventListener('pointerleave', () => hide());
  document.body.append(pop);
  return pop;
}

function place(el: HTMLElement, p: HTMLElement) {
  const b = el.getBoundingClientRect();
  const w = p.offsetWidth, h = p.offsetHeight, m = 8;
  const below = b.bottom + m + h <= innerHeight || b.top - m - h < 0;
  const top = below ? b.bottom + m : b.top - m - h;
  const left = Math.max(16, Math.min(b.left, innerWidth - w - 16));
  const ox = Math.max(0, Math.min(w, b.left + b.width / 2 - left));
  p.style.top = `${top}px`;
  p.style.left = `${left}px`;
  p.style.transformOrigin = `${ox}px ${below ? 'top' : 'bottom'}`;
}

async function show(el: HTMLElement) {
  const d = await load().catch(() => null);
  if (!d || current !== el) return;
  const p = panel();
  const cs = el.dataset.case, au = el.dataset.authority;
  if (cs && d.cases[cs]) {
    const k = d.cases[cs];
    p.innerHTML = `<p class="mention-pop__title"><i>${esc(k.n)}</i> <span class="mono">${esc(k.c)}</span></p>${k.r ? `<p><span class="label">Ratio</span> ${esc(k.r)}</p>` : ''}${k.w ? `<p><span class="label">Why here</span> ${esc(k.w)}</p>` : ''}${k.v ? '<p class="mention-pop__check">Not yet verified against your materials.</p>' : ''}`;
  } else if (au && d.authorities[au]) {
    const a = d.authorities[au];
    p.innerHTML = `<p class="mention-pop__title">${esc(a.t)}</p>${a.x ? `<blockquote class="mention-pop__text">${esc(a.x)}</blockquote>` : ''}${a.g ? `<p><span class="label">In plain terms</span> ${esc(a.g)}</p>` : ''}${a.cs.length ? `<p><span class="label">Applied in</span> ${a.cs.map((c: { n: string }) => `<i>${esc(c.n)}</i>`).join(', ')}</p>` : ''}${a.v ? '<p class="mention-pop__check">Not yet verified against your materials.</p>' : ''}`;
  } else return;
  el.setAttribute('aria-describedby', 'mention-pop');
  place(el, p);
  p.dataset.open = 'true';
}

function hide(delay = 120) {
  clearTimeout(showT);
  clearTimeout(hideT);
  hideT = window.setTimeout(() => {
    current?.removeAttribute('aria-describedby');
    current = null;
    if (pop) pop.dataset.open = 'false';
  }, delay);
}

function target(e: Event) {
  return (e.target as Element | null)?.closest?.<HTMLElement>('a.mention[data-case], a.mention[data-authority]') ?? null;
}

export function wireMentions() {
  if ((window as any).__mentions) return;
  (window as any).__mentions = true;
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  document.addEventListener('pointerover', (e) => {
    const el = target(e);
    if (!el || !fine.matches) return;
    clearTimeout(hideT);
    if (current === el) return;
    current = el;
    load();
    clearTimeout(showT);
    showT = window.setTimeout(() => show(el), 120);
  });
  document.addEventListener('pointerout', (e) => {
    const el = target(e);
    if (el && el === current && !(e.relatedTarget instanceof Node && pop?.contains(e.relatedTarget))) hide(200);
  });
  document.addEventListener('focusin', (e) => {
    const el = target(e);
    if (!el) return;
    clearTimeout(hideT);
    current = el;
    show(el);
  });
  document.addEventListener('focusout', (e) => { if (target(e)) hide(0); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && current) hide(0); });
  addEventListener('scroll', () => current && current !== document.activeElement && hide(0), { passive: true });
  document.addEventListener('click', (e) => {
    const el = target(e);
    if (!el) return;
    hide(0);
    // Shared element: the mention becomes the case card title on the next page.
    if (el.dataset.case) el.style.setProperty('view-transition-name', `case-${el.dataset.case}`);
  });
  document.addEventListener('astro:before-swap', () => hide(0));
}
