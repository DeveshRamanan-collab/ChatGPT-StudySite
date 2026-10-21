// Concept-card behaviour (see ConceptCard.astro): expand/collapse in place and "mark for later".
// Siblings move with Flip (transform only); the opening body wipes in by clip-path. Off → instant.
import { gsap } from 'gsap';
const dbp = () => import('./db').then((m) => m.db);
import { DUR, EASE, flipTo, motion } from './motion';
import { toast } from '../components/ui/Toaster';

function setExpanded(card: HTMLElement, open: boolean) {
  const list = card.parentElement?.closest('[data-concept-cards]') ?? card.parentElement;
  const siblings = list ? [...list.querySelectorAll<HTMLElement>('[data-concept-card]')] : [card];
  const body = card.querySelector<HTMLElement>('.concept-card__body')!;
  const toggle = card.querySelector<HTMLButtonElement>('.concept-card__toggle')!;
  flipTo(siblings, () => {
    card.toggleAttribute('data-expanded', open);
    body.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
  }, { duration: DUR.ui, ease: EASE.inout, nested: true, scale: false, simple: true });
  if (open && motion() !== 'off') {
    gsap.fromTo(body, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: DUR.ui, ease: EASE.out, clearProps: 'clipPath' });
  }
}

async function syncLater(root: ParentNode) {
  const buttons = [...root.querySelectorAll<HTMLButtonElement>('[data-concept-card] [data-action="later"]')];
  for (const b of buttons) {
    const id = b.closest<HTMLElement>('[data-concept-card]')!.dataset.concept!;
    const on = !!(await (await dbp()).settings.get(`later:${id}`))?.value;
    b.setAttribute('aria-pressed', String(on));
    b.textContent = on ? 'Marked for later' : 'Mark for later';
  }
}

export function wireConceptCards() {
  const root = document;
  root.querySelectorAll<HTMLElement>('[data-concept-card]').forEach((card) => {
    if (card.dataset.wired) return;
    card.dataset.wired = '1';
    card.querySelector('.concept-card__toggle')!.addEventListener('click', () => setExpanded(card, !card.hasAttribute('data-expanded')));
    card.querySelector('[data-action="later"]')!.addEventListener('click', async (e) => {
      const b = e.currentTarget as HTMLButtonElement;
      const id = card.dataset.concept!;
      const on = b.getAttribute('aria-pressed') !== 'true';
      if (on) await (await dbp()).settings.put({ key: `later:${id}`, value: Date.now() });
      else await (await dbp()).settings.delete(`later:${id}`);
      b.setAttribute('aria-pressed', String(on));
      b.textContent = on ? 'Marked for later' : 'Mark for later';
      toast(on ? 'Marked for later. It will come up in What next.' : 'Unmarked.');
    });
  });
  syncLater(root).catch(() => {});
}
