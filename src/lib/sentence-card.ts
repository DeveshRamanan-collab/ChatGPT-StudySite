// Sentence-to-card: on a notes page, select words inside a sentence and press C. The sentence becomes a cloze
// card (the selection is the gap) linked back to its paragraph (#para-N), scheduled with the rest of the deck.
import { toast } from '../components/ui/Toaster';

type PageConcept = { id: string; title: string };

function numberParagraphs() {
  const ps = document.querySelectorAll<HTMLElement>('.prose.notes > p, .prose.notes li, article.prose > p, article.prose li');
  ps.forEach((p, i) => { if (!p.id) p.id = `para-${i + 1}`; });
  const h = location.hash.slice(1);
  if (h.startsWith('para-')) {
    const el = document.getElementById(h);
    if (el) { el.scrollIntoView({ block: 'center' }); el.classList.add('para-flash'); setTimeout(() => el.classList.remove('para-flash'), 1600); }
  }
}

const words = (s: string) => new Set(s.toLowerCase().match(/[a-z]{4,}/g) ?? []);

/** The sentence around the selection and the cloze text. Exported for tests. */
export function makeCloze(paragraph: string, selected: string) {
  const sel = selected.replace(/\s+/g, ' ').trim();
  const text = paragraph.replace(/\s+/g, ' ').trim();
  const at = text.indexOf(sel);
  if (!sel || at < 0) return null;
  const sentences = text.match(/[^.!?]+[.!?]+["”’)]*\s*|[^.!?]+$/g) ?? [text];
  let pos = 0;
  for (const s of sentences) {
    const end = pos + s.length;
    if (at >= pos && at + sel.length <= end + 1) {
      const sentence = s.trim();
      if (sel.length >= sentence.replace(/[.!?]+$/, '').length - 2) return null; // whole sentence: nothing left as a cue
      return { sentence, cloze: sentence.replace(sel, `{{c1::${sel}}}`) };
    }
    pos = end;
  }
  return null;
}

async function capture() {
  const selection = getSelection();
  const text = selection?.toString() ?? '';
  const node = selection?.anchorNode;
  const para = (node?.nodeType === 1 ? (node as Element) : node?.parentElement)?.closest<HTMLElement>('[id^="para-"]');
  const meta = document.querySelector<HTMLElement>('[data-page-concepts]');
  if (!para || !meta || !text.trim()) return false;
  const made = makeCloze(para.textContent ?? '', text);
  if (!made) { toast('Select the words to hide inside one sentence, then press C.'); return true; }
  const concepts: PageConcept[] = JSON.parse(meta.dataset.pageConcepts || '[]');
  const unit = meta.dataset.unit!;
  // Link it to the concept whose title shares most words with the sentence (first concept if none do).
  const w = words(made.sentence);
  const best = concepts.map((c) => ({ c, n: [...words(c.title)].filter((x) => w.has(x)).length })).sort((a, b) => b.n - a.n)[0]?.c ?? concepts[0];
  if (!best) return false;
  const id = `custom-s2c-${Date.now().toString(36)}`;
  const { db } = await import('./db');
  await db.customCards.put({ id, concept: best.id, unit, type: 'cloze', front: made.cloze, back: '', source: `${location.pathname}#${para.id}`, at: Date.now() });
  selection?.removeAllRanges();
  toast({ message: `Card made: “${text.trim().slice(0, 40)}” hidden. It joins today’s cards.`, action: { label: 'Cards', href: `/${unit}/cards` } });
  return true;
}

export function wireSentenceCards() {
  document.addEventListener('astro:page-load', numberParagraphs);
  if ((window as any).__s2c) return;
  (window as any).__s2c = true;
  document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() !== 'c' || e.metaKey || e.ctrlKey || e.altKey) return;
    if ((e.target as HTMLElement)?.closest('input, textarea, [contenteditable="true"], dialog')) return;
    if (!getSelection()?.toString().trim()) return;
    e.preventDefault();
    capture();
  });
}
