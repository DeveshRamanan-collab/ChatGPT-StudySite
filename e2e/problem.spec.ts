// Problem questions: the index, the fact-by-fact spotting round, the prompt in layers, the element-and-evidence
// board, and the hand-off to the long-answer flow. Data-driven: expectations come from the unit's aids.json (the same
// fact annotations the page is built from), so regenerated content does not break the spec.
import { test, expect, type Page, type APIRequestContext } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { layoutProblems, setLevel, type Level } from './helpers';
import { locateFacts, problemHref, promptOrder, type Issue } from '../src/lib/problem';

const UNIT = 'laws2400';
const SELECT = '.btn, .chip, .card, .pq-layers__party';

interface Annot { question: string; parties: { name: string; role: string }[]; issues: Issue[]; facts: { text: string; weight: 'essential' | 'background'; kind: string; issues: string[]; why?: string }[] }

async function annotations(request: APIRequestContext): Promise<Annot[]> {
  const b = await (await request.get(`/data/${UNIT}/aids.json`)).json();
  return (Object.values(b.facts) as Annot[]).sort((a, z) => a.question.localeCompare(z.question));
}

async function promptOf(request: APIRequestContext, id: string): Promise<string> {
  const qs = await (await request.get(`/data/${UNIT}/questions.json`)).json();
  const list = Array.isArray(qs) ? qs : qs.questions;
  return list.find((q: { id: string }) => q.id === id).prompt;
}

function watchErrors(page: Page) {
  const errors: string[] = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(String(e)));
  return errors;
}

async function open(page: Page, a: Annot, level: Level = 'off') {
  await setLevel(page, level);
  await page.goto(problemHref(UNIT, a.question));
  await ready(page);
}

/** The island has hydrated (its buttons respond). */
async function ready(page: Page) {
  await expect(page.locator('.pq-work[data-ready]')).toBeAttached({ timeout: 15_000 });
  await expect(page.locator('.pq-spot__piece[data-state="now"]')).toBeVisible();
}

async function toFull(page: Page) {
  await page.getByRole('button', { name: 'Skip to the full view' }).click();
  await expect(page.getByRole('heading', { name: 'The facts, in layers' })).toBeVisible();
}

test('the index lists each annotated problem with its first sentence, issues and a link', async ({ page, request }) => {
  const errors = watchErrors(page);
  const all = await annotations(request);
  await page.goto(`/${UNIT}/problems/`);
  const items = page.locator('.pq-index__item');
  await expect(items).toHaveCount(all.length);
  await expect(items.first().locator('.pq-index__issues')).toContainText(all[0].issues[0].label);
  await items.first().getByRole('link', { name: /Work the facts/ }).click();
  await expect(page).toHaveURL(new RegExp(`${problemHref(UNIT, all[0].question)}$`));
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Problem 1');
  expect(await layoutProblems(page, SELECT)).toEqual([]);
  expect(errors).toEqual([]);
});

test('spotting round: one fact at a time, immediate feedback with the why, running tally, skippable', async ({ page, request }) => {
  const errors = watchErrors(page);
  const a = (await annotations(request))[0];
  const prompt = await promptOf(request, a.question);
  const order = promptOrder(locateFacts(prompt, a.facts));
  await open(page, a);
  const tally = page.locator('.pq-spot__tally');
  await expect(tally).toContainText(`0 of ${a.facts.length} facts · 0 matched`);
  await expect(page.locator('.pq-spot__piece[data-state="now"]')).toHaveText(a.facts[order[0]].text);
  // Nothing after the current fact is shown yet; the full view is hidden.
  await expect(page.locator('.pq-layers')).toHaveCount(0);

  // Fact 1: answer with the annotation's weight → matched, within 200 ms of the click.
  const f0 = a.facts[order[0]];
  const ms = await page.evaluate((label) => new Promise<number>((resolve) => {
    const b = [...document.querySelectorAll<HTMLButtonElement>('.pq-spot__weights .btn')].find((x) => x.textContent === label)!;
    const t0 = performance.now();
    b.click();
    const tick = () => (document.querySelector('.pq-spot__verdict') ? resolve(performance.now() - t0) : requestAnimationFrame(tick));
    tick();
  }), f0.weight === 'essential' ? 'Essential' : 'Background');
  expect(ms).toBeLessThan(200);
  await expect(page.locator('.pq-spot__verdict')).toContainText('Matched');
  await expect(tally).toContainText(`1 of ${a.facts.length} facts · 1 matched`);
  await expect(page.getByRole('button', { name: 'Next fact' })).toBeFocused();
  await page.keyboard.press('Enter');

  // Fact 2: by keyboard, the opposite weight and issue 1 tagged → not matched, chip states shown.
  const f1 = a.facts[order[1]];
  await expect(page.locator('.pq-spot__piece[data-state="now"]')).toHaveText(f1.text);
  await page.keyboard.press('1');
  await expect(page.locator('.pq-spot__issues .chip').first()).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press(f1.weight === 'essential' ? 'b' : 'e');
  await expect(page.locator('.pq-spot__verdict')).toContainText(`marks this ${f1.weight}`);
  await expect(page.locator('.pq-spot__verdict')).not.toHaveAttribute('data-ok', '');
  await expect(page.locator('.pq-spot__issues .chip').first()).toHaveAttribute('data-state', f1.issues.includes(a.issues[0].id) ? 'hit' : 'extra');
  await expect(tally).toContainText(`2 of ${a.facts.length} facts · 1 matched`);
  await page.keyboard.press('Enter');

  // The first essential fact with a why: its why is shown with the feedback.
  for (let i = 2; i < order.length; i++) {
    const f = a.facts[order[i]];
    await page.getByRole('button', { name: f.weight === 'essential' ? 'Essential' : 'Background', exact: true }).click();
    if (f.why) { await expect(page.locator('.pq-spot__why')).toContainText(f.why); break; }
    await page.getByRole('button', { name: 'Next fact' }).click();
  }
  expect(await layoutProblems(page, SELECT)).toEqual([]);

  await toFull(page);
  await expect(page.locator('.pq-summary__line')).toContainText('You worked');
  expect(await layoutProblems(page, SELECT)).toEqual([]);
  expect(errors).toEqual([]);
});

test('fact layers: weight, conduct vs mental state, parties and the timing sequence', async ({ page, request }) => {
  const errors = watchErrors(page);
  const all = await annotations(request);
  const a = all.find((x) => x.facts.some((f) => f.kind === 'timing') && x.facts.some((f) => f.kind === 'conduct') && x.parties.length) ?? all[0];
  await open(page, a);
  await toFull(page);
  const prompt = page.locator('.pq-layers__prompt');
  await expect(prompt).toHaveAttribute('data-weight', '');
  expect(await page.locator('.pq-layers__x').count()).toBeGreaterThanOrEqual(a.facts.length);

  await page.getByRole('button', { name: /^Conduct vs mental state/ }).click();
  await expect(prompt).toHaveAttribute('data-act', '');
  await expect(page.locator('.pq-layers__x[data-k="conduct"] .pq-layers__tag').first()).toHaveText('act');
  // Not colour alone: conduct and mental state use different underline styles.
  const style = (k: string) => page.locator(`.pq-layers__x[data-k="${k}"]`).first().evaluate((e) => getComputedStyle(e).textDecorationStyle);
  expect(await style('conduct')).toBe('solid');
  if (a.facts.some((f) => f.kind === 'mental')) expect(await style('mental')).toBe('wavy');

  const timing = a.facts.filter((f) => f.kind === 'timing');
  if (timing.length) {
    await page.getByRole('button', { name: /^Timing/ }).click();
    await expect(page.locator('.pq-layers__seq-list li')).toHaveCount(timing.length);
  } else {
    await expect(page.getByRole('button', { name: /^Timing/ })).toBeDisabled();
  }

  // Parties: focusing a party picks out the excerpts that mention them.
  const party = page.locator('.pq-layers__party').first();
  await party.focus();
  await expect(prompt).toHaveAttribute('data-party', '');
  await expect(page.locator('.pq-layers__status')).toContainText(a.parties[0].name);
  expect(await page.locator('.pq-layers__x[data-hit]').count()).toBeGreaterThan(0);
  await party.blur();

  // Choosing an excerpt opens its annotation in place.
  const withWhy = a.facts.find((f) => f.why)!;
  await page.locator('.pq-layers__x', { hasText: withWhy.text.slice(0, 30) }).first().click();
  await expect(page.locator('.pq-layers__detail')).toContainText(withWhy.why!);
  await page.locator('.pq-layers__detail').evaluate((e) => Promise.all(e.getAnimations({ subtree: true }).map((x) => x.finished)));
  expect(await layoutProblems(page, SELECT)).toEqual([]);
  const axe = await new AxeBuilder({ page }).include('.pq-work').analyze();
  expect(axe.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([]);
  expect(errors).toEqual([]);
});

test('evidence board: move a fact onto a requirement, it persists, unsupported rows say so', async ({ page, request }, info) => {
  const errors = watchErrors(page);
  const a = (await annotations(request))[0];
  await open(page, a);
  await toFull(page);
  const col = page.locator('.pq-board__col').filter({ has: page.locator('.pq-board__tray .pq-board__fact') }).first();
  const count = col.locator('.pq-board__count');
  await expect(count).toContainText(/^0 of \d+ requirements? supported$/);
  await expect(col.locator('.pq-board__row[data-empty] .pq-board__none').first()).toHaveText('No support yet');

  // Keyboard / touch route: Move to… → the first requirement.
  const card = col.locator('.pq-board__tray .pq-board__fact').first();
  const quote = (await card.locator('.pq-board__quote').textContent())!;
  await card.getByRole('button', { name: 'Move to…' }).click();
  const target = (await card.locator('.pq-board__menu-item').first().textContent())!;
  await card.locator('.pq-board__menu-item').first().click();
  const row = col.locator('.pq-board__row').filter({ has: page.locator('.pq-board__req', { hasText: target }) }).first();
  await expect(row.locator('.pq-board__quote')).toHaveText(quote);
  await expect(row.locator('.pq-board__move')).toBeFocused();
  await expect(count).toContainText(/^1 of /);

  // Mouse route (desktop only): drag the next waiting card onto the first row that still has no support.
  if (info.project.name === 'desktop') {
    const next = col.locator('.pq-board__tray .pq-board__fact').first();
    const empty = col.locator('.pq-board__row[data-empty]').first();
    if (await next.count() && await empty.count()) {
      const text = (await next.locator('.pq-board__quote').textContent())!;
      const name = (await empty.locator('.pq-board__req').textContent())!;
      // The drag events themselves (a real mouse drag was checked by hand; under a busy shared dev server a pointer
      // drag across a scrolling page is timing-sensitive).
      const dt = await page.evaluateHandle(() => new DataTransfer());
      await next.dispatchEvent('dragstart', { dataTransfer: dt });
      await empty.dispatchEvent('dragover', { dataTransfer: dt });
      await expect(empty).toHaveAttribute('data-over', '');
      await empty.dispatchEvent('drop', { dataTransfer: dt });
      const dropped = col.locator('.pq-board__row').filter({ has: page.locator('.pq-board__req', { hasText: name }) }).first();
      await expect(dropped.locator('.pq-board__quote', { hasText: text })).toHaveCount(1);
    }
  }

  // Saved on this device: still placed after a reload.
  await page.waitForTimeout(300);
  await page.reload();
  await ready(page);
  await toFull(page);
  await expect(page.locator('.pq-board__row .pq-board__quote', { hasText: quote }).first()).toBeVisible();
  expect(await layoutProblems(page, SELECT)).toEqual([]);

  // Back to the tray, then clear.
  await page.getByRole('button', { name: 'Clear the board' }).click();
  await expect(page.locator('.pq-board__row .pq-board__fact')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('closing checklist lists the rubric criteria and opens this question in the long-answer flow', async ({ page, request }) => {
  test.setTimeout(60_000);
  const errors = watchErrors(page);
  const a = (await annotations(request))[0];
  await open(page, a);
  await toFull(page);
  const items = page.locator('.pq-write__item');
  expect(await items.count()).toBeGreaterThan(0);
  await items.first().click();
  await expect(items.first().locator('input')).toBeChecked();
  const link = page.getByRole('link', { name: 'Write the answer' });
  await expect(link).toHaveAttribute('href', `/${UNIT}/quiz?mode=long`);
  await link.click();
  await expect(page).toHaveURL(/\/quiz\?mode=set/);
  await expect(page.locator(`[data-question="${a.question}"]`)).toBeVisible({ timeout: 30_000 });
  expect(errors).toEqual([]);
});

for (const level of ['full', 'calm', 'off'] as const) {
  test(`no overlap or console errors in motion ${level}`, async ({ page, request }) => {
    const errors = watchErrors(page);
    const a = (await annotations(request))[0];
    await open(page, a, level);
    expect(await layoutProblems(page, SELECT)).toEqual([]);
    await page.getByRole('button', { name: 'Essential', exact: true }).click();
    await page.waitForTimeout(500);
    expect(await layoutProblems(page, SELECT)).toEqual([]);
    await toFull(page);
    await page.waitForTimeout(400);
    expect(await layoutProblems(page, SELECT)).toEqual([]);
    expect(errors).toEqual([]);
  });
}
