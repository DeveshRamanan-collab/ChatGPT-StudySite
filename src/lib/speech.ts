// Read-aloud with the browser's voice: 1.2×, Australian English when available, the sentence being read is
// highlighted with the CSS Custom Highlight API (no DOM changes), Space pauses and resumes. One reader at a time.
type Seg = { text: string; range: Range | null };

const RATE = 1.2;
let current: { segs: Seg[]; i: number; onEnd?: () => void; onProgress?: (i: number, n: number) => void } | null = null;
let paused = false;

export const speechSupported = () => typeof window !== 'undefined' && 'speechSynthesis' in window;

function voice() {
  const vs = speechSynthesis.getVoices();
  return vs.find((v) => v.lang === 'en-AU') ?? vs.find((v) => v.lang.startsWith('en-GB')) ?? vs.find((v) => v.lang.startsWith('en'));
}

/** Sentence segments of an element's visible text, each with a DOM Range for highlighting. */
export function segmentsOf(root: Element): Seg[] {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => ((!n.parentElement || n.parentElement.offsetParent === null || n.parentElement.closest('button, [aria-hidden="true"], .visually-hidden, script, style, [data-no-read]') || !n.textContent?.trim()) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
  });
  const nodes: Text[] = [];
  for (let n = walker.nextNode(); n; n = walker.nextNode()) nodes.push(n as Text);
  const segs: Seg[] = [];
  let start: { node: Text; off: number } | null = null, buf = '';
  const close = (node: Text, off: number) => {
    if (start && buf.trim()) {
      let range: Range | null = null;
      try { range = document.createRange(); range.setStart(start.node, start.off); range.setEnd(node, off); } catch { range = null; }
      segs.push({ text: buf.replace(/\s+/g, ' ').trim(), range });
    }
    start = null; buf = '';
  };
  for (const node of nodes) {
    const t = node.textContent!;
    for (let i = 0; i < t.length; i++) {
      if (!start && /\S/.test(t[i])) start = { node, off: i };
      if (start) buf += t[i];
      if (start && /[.!?]/.test(t[i]) && (i + 1 >= t.length || /\s/.test(t[i + 1]))) close(node, i + 1);
    }
    if (start) { buf += ' '; const parentBlock = node.parentElement?.closest('p, li, dd, dt, h1, h2, h3, h4, blockquote'); const next = nodes[nodes.indexOf(node) + 1]; if (!next || next.parentElement?.closest('p, li, dd, dt, h1, h2, h3, h4, blockquote') !== parentBlock) close(node, t.length); }
  }
  return segs;
}

export function segmentsOfText(text: string): Seg[] {
  return (text.match(/[^.!?]+[.!?]+["”’)]*|[^.!?]+$/g) ?? []).map((s) => ({ text: s.trim(), range: null })).filter((s) => s.text);
}

function highlight(r: Range | null) {
  const h = (CSS as any).highlights;
  if (!h) return;
  if (r) h.set('reading', new (window as any).Highlight(r)); else h.delete('reading');
}

function speakAt(i: number) {
  if (!current) return;
  if (i >= current.segs.length) { const done = current.onEnd; stop(); done?.(); return; }
  current.i = i;
  const seg = current.segs[i];
  highlight(seg.range);
  current.onProgress?.(i, current.segs.length);
  const u = new SpeechSynthesisUtterance(seg.text);
  u.rate = RATE;
  u.lang = 'en-AU';
  const v = voice(); if (v) u.voice = v;
  u.onend = () => { if (current && current.segs[i] === seg && !paused) speakAt(i + 1); };
  speechSynthesis.speak(u);
}

export function read(segs: Seg[], opts: { onEnd?: () => void; onProgress?: (i: number, n: number) => void; from?: number } = {}) {
  stop();
  if (!speechSupported() || !segs.length) return;
  current = { segs, i: 0, ...opts };
  paused = false;
  speakAt(opts.from ?? 0);
}

export function togglePause() {
  if (!current) return false;
  if (paused) { paused = false; speechSynthesis.cancel(); speakAt(current.i); }
  else { paused = true; speechSynthesis.cancel(); }
  return paused;
}
export const isReading = () => !!current;
export const isPaused = () => paused;

export function stop() {
  const was = current;
  current = null;
  paused = false;
  if (speechSupported()) speechSynthesis.cancel();
  highlight(null);
  return !!was;
}

/** Wires every [data-read-aloud="<selector>"] button on the page, plus Space to pause/resume. */
export function wireReadAloud() {
  document.addEventListener('astro:page-load', () => {
    document.querySelectorAll<HTMLButtonElement>('[data-read-aloud]').forEach((b) => {
      if (!speechSupported()) { b.disabled = true; b.title = 'This browser has no speech voice.'; return; }
      if (b.dataset.wired) return;
      b.dataset.wired = '1';
      const label = b.textContent;
      b.addEventListener('click', () => {
        if (isReading() && b.getAttribute('aria-pressed') === 'true') { stop(); b.setAttribute('aria-pressed', 'false'); b.textContent = label; return; }
        const target = document.querySelector(b.dataset.readAloud || 'main');
        if (!target) return;
        document.querySelectorAll('[data-read-aloud][aria-pressed="true"]').forEach((o) => { o.setAttribute('aria-pressed', 'false'); o.textContent = (o as HTMLElement).dataset.label ?? o.textContent; });
        b.dataset.label = label ?? '';
        b.setAttribute('aria-pressed', 'true');
        b.textContent = 'Stop reading';
        read(segmentsOf(target), { onEnd: () => { b.setAttribute('aria-pressed', 'false'); b.textContent = label; } });
      });
    });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== ' ' || !isReading() || (e.target as HTMLElement)?.closest('input, textarea, button, select, [contenteditable="true"], a')) return;
    e.preventDefault();
    togglePause();
  });
  document.addEventListener('astro:before-swap', () => stop());
}
