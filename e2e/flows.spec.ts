// Decision flows: the unit index, walk mode (branches, number keys, Backspace, crumbs, Why?), the map (walk path,
// note inside the diagram, trace back to an outcome), ordering the steps, motion levels, and layout at both sizes.
// Assertions read the page rather than hard-coding node text, so regenerated content keeps them valid.
import { test, expect, type Page } from '@playwright/test';
import { layoutProblems, setLevel, type Level } from './helpers';

const FLOW = '/laws2400/flow/w04-flow-self-defence/';
// The shared dev server can be slow while other work recompiles: allow for it.
test.beforeEach(() => test.setTimeout(90_000));

function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on('console', (m) => m.type() === 'error' && !/WebSocket|\[vite\]/.test(m.text()) && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(e.message));
  return errors;
}
async function open(page: Page, path = FLOW) {
  await page.goto(path, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('astro-island[component-url*="FlowWalker"]:not([ssr])', { timeout: 45_000 });
}
const card = (page: Page) => page.locator('.flow-walk__card');
const crumbs = (page: Page) => page.locator('.flow-walk__crumb');

test('flows index: grouped by week in order, each flow with its summary, links to the flow', async ({ page }) => {
  const errors = trackErrors(page);
  await setLevel(page, 'off');
  await page.goto('/laws2400/flows/', { waitUntil: 'domcontentloaded' });
  const heads = await page.locator('.flows-index__week h2').allTextContents();
  expect(heads.length).toBeGreaterThan(0);
  const nums = heads.map((h) => Number(h.match(/Week (\d+)/)?.[1]));
  expect(nums).toEqual([...nums].sort((a, b) => a - b));
  const link = page.locator('.flows-index__link', { hasText: 'self-defence' });
  await expect(link.locator('.flows-index__summary')).not.toBeEmpty();
  await expect(link.locator('.flows-index__meta')).toContainText(/\d+ questions? · \d+ outcomes?/);
  expect(await layoutProblems(page)).toEqual([]);
  await link.click();
  await expect(page).toHaveURL(/\/laws2400\/flow\/w04-flow-self-defence\/?$/);
  await expect(page.locator('.flow-walk__card')).toBeVisible();
  expect(errors).toEqual([]);
});

test('walk: click and number keys choose, crumbs and Backspace go back, Why? opens notes with chips, an outcome reads as glyph + word', async ({ page }) => {
  const errors = trackErrors(page);
  await setLevel(page, 'off');
  await open(page);
  const q1 = (await card(page).locator('.flow-walk__q').textContent())!;
  expect(await card(page).locator('.option').count()).toBeGreaterThan(1);
  const firstAnswer = (await card(page).locator('.option').first().locator('span').nth(1).textContent())!;

  await card(page).locator('.option').first().click();
  await expect(crumbs(page)).toHaveCount(1);
  await expect(crumbs(page).first()).toContainText(q1);
  await expect(crumbs(page).first().locator('.flow-walk__crumb-ans')).toHaveText(firstAnswer);
  await expect(card(page).locator('.flow-walk__q')).toBeFocused();
  const q2 = (await card(page).locator('.flow-walk__q').textContent())!;

  await page.keyboard.press('1');
  await expect(crumbs(page)).toHaveCount(2);
  await page.keyboard.press('Backspace');
  await expect(crumbs(page)).toHaveCount(1);
  await expect(card(page).locator('.flow-walk__q')).toHaveText(q2);
  await crumbs(page).first().click();
  await expect(crumbs(page)).toHaveCount(0);
  await expect(card(page).locator('.flow-walk__q')).toHaveText(q1);

  // Walk to an outcome on the first branch, opening every "Why?" on the way; chips link to case / authority pages.
  let chips = 0;
  for (let i = 0; i < 25 && !(await card(page).locator('.flow-walk__tone').count()); i++) {
    const why = card(page).getByRole('button', { name: 'Why?' });
    if (await why.count()) {
      await why.click();
      await expect(card(page).getByRole('button', { name: 'Hide why' })).toHaveAttribute('aria-expanded', 'true');
      const note = card(page).locator('.flow-walk__note');
      await expect(note).toBeVisible();
      for (const href of await note.locator('a.chip').evaluateAll((as) => as.map((a) => a.getAttribute('href')))) {
        expect(href).toMatch(/^\/(cases|authorities)\/[a-z0-9-]+$/);
        chips++;
      }
    }
    await page.keyboard.press('1');
  }
  expect(chips).toBeGreaterThan(0);
  await expect(card(page).locator('.flow-walk__tone')).toContainText(/^.?\s*(Met|Not met|Qualified)$/);
  await expect(card(page).locator('.flow-walk__glyph')).toHaveText(/^[✓✕~]$/);
  await expect(card(page).getByRole('button', { name: 'Start again' })).toBeVisible();
  expect(await layoutProblems(page)).toEqual([]);

  await card(page).getByRole('button', { name: 'Start again' }).click();
  await expect(crumbs(page)).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('walk: the mini map beside the walk follows each answer (wide screens only)', async ({ page, isMobile }) => {
  await setLevel(page, 'off');
  await open(page);
  const aside = page.locator('.flow-walk__aside');
  if (isMobile) { await expect(aside).toBeHidden(); return; }
  await expect(aside).toBeVisible();
  const here = () => aside.locator('.flow-map__node[data-current]').getAttribute('data-node');
  const start = await here();
  await page.keyboard.press('1');
  await expect.poll(here).not.toBe(start);
  await expect(aside.locator('.flow-map__edge-on[data-on]')).toHaveCount(1);
});

test('map: walk path highlighted, notes open inside the diagram without moving the page, an outcome traces its routes', async ({ page }) => {
  const errors = trackErrors(page);
  await setLevel(page, 'off');
  await open(page);
  await card(page).locator('.option').first().click();
  await page.getByRole('tab', { name: 'Map' }).click();
  await expect(page).toHaveURL(/view=map/);
  const svg = page.locator('.flow-map__svg');
  await expect(svg).toBeVisible();
  await expect(page.locator('.flow-map__edge-on[data-on]')).toHaveCount(1);
  await expect(page.locator('.flow-map__node[data-current]')).toHaveCount(1);
  // Shapes: questions, steps or outcomes are told apart by data-kind; exceptions are marked and named.
  await expect(page.locator('.flow-map__node[data-kind="ask"]').first()).toBeVisible();
  const exception = page.locator('.flow-map__node[data-exception]').first();
  await expect(exception).toHaveAttribute('aria-label', /exception/);

  // Keyboard: Enter on a node opens its note in place; focus moves into it; Escape closes and returns focus.
  const ask = page.locator('.flow-map__node[data-kind="ask"]').first();
  await ask.focus();
  const y0 = await page.evaluate(() => scrollY);
  await page.keyboard.press('Enter');
  const note = page.locator('.flow-map__note');
  await expect(note).toBeVisible();
  await expect(note.locator('[data-note-title]')).toBeFocused();
  await expect(ask).toHaveAttribute('aria-expanded', 'true');
  expect(Math.abs((await page.evaluate(() => scrollY)) - y0)).toBeLessThanOrEqual(2);
  await page.keyboard.press('Escape');
  await expect(note).toBeHidden();
  await expect(ask).toBeFocused();

  // Trace back: choosing a met outcome highlights its routes and lists the answers they need.
  const end = page.locator('.flow-map__node[data-kind="end"][data-tone="met"]').first();
  await end.scrollIntoViewIfNeeded();
  await end.click();
  await expect(svg).toHaveAttribute('data-trace', /.*/);
  await expect(end).toHaveAttribute('data-on', /.*/);
  expect(await page.locator('.flow-map__edge-on[data-on]').count()).toBeGreaterThan(0);
  expect(await page.locator('.flow-map__node:not([data-on])').count()).toBeGreaterThan(0);
  const trace = page.locator('.flow-trace');
  await expect(trace).toBeVisible();
  await expect(trace).toContainText(/needs/);
  await expect(trace.locator('.flow-trace__answer').first()).not.toBeEmpty();
  await expect(note).toBeVisible();

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  expect(await layoutProblems(page)).toEqual([]);

  await trace.getByRole('button', { name: 'Clear the route' }).click();
  await expect(svg).not.toHaveAttribute('data-trace', /.*/);
  expect(errors).toEqual([]);
});

test('map: wider than the screen scrolls inside its own box, never the page', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'the phone width is the case that overflows');
  await setLevel(page, 'off');
  await open(page, `${FLOW}?view=map`);
  const box = page.locator('.flow-map__scroll');
  await expect(box).toBeVisible();
  const m = await box.evaluate((b) => ({ inner: b.scrollWidth, outer: b.clientWidth }));
  expect(m.inner).toBeGreaterThan(m.outer);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test('order the steps: up/down reorder, check marks every position, show answer orders them all', async ({ page }) => {
  const errors = trackErrors(page);
  await setLevel(page, 'off');
  await open(page, `${FLOW}?view=order`);
  const rows = page.locator('.flow-order__row');
  const n = await rows.count();
  expect(n).toBeGreaterThan(2);
  const before = await rows.locator('.flow-order__q').allTextContents();
  await rows.nth(1).getByRole('button', { name: /^Move up/ }).click();
  const after = await rows.locator('.flow-order__q').allTextContents();
  expect([after[0], after[1]]).toEqual([before[1], before[0]]);

  await page.getByRole('button', { name: 'Check', exact: true }).click();
  await expect(page.locator('.flow-order__mark')).toHaveCount(n);
  for (const t of await page.locator('.flow-order__mark').allTextContents()) expect(t).toMatch(/^[✓✕] (In place|Not here)$/);
  await expect(page.locator('.flow-order__status')).toHaveText(/^(\d+ of \d+ in place\.|All in order\.)$/);

  await page.getByRole('button', { name: 'Show answer' }).click();
  await expect(page.locator('.flow-order__mark[data-mark="right"]')).toHaveCount(n);
  expect(await layoutProblems(page)).toEqual([]);

  // The first step of the answer is the flow's first question.
  const first = await rows.first().locator('.flow-order__q').textContent();
  await page.getByRole('tab', { name: 'Walk it' }).click();
  await expect(card(page).locator('.flow-walk__q')).toHaveText(first!);
  expect(errors).toEqual([]);
});

test('order the steps: drag a row by its handle', async ({ page, isMobile }) => {
  test.skip(isMobile, 'pointer drag; touch uses the ↑/↓ buttons');
  await setLevel(page, 'off');
  await open(page, `${FLOW}?view=order`);
  const rows = page.locator('.flow-order__row');
  const before = await rows.locator('.flow-order__q').allTextContents();
  const handle = rows.first().locator('.flow-order__handle');
  const a = (await handle.boundingBox())!;
  const h = (await rows.first().boundingBox())!.height;
  await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2);
  await page.mouse.down();
  await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2 + h * 1.2, { steps: 6 });
  await page.mouse.up();
  const after = await rows.locator('.flow-order__q').allTextContents();
  expect(after[1]).toBe(before[0]);
  expect(after[0]).toBe(before[1]);
});

for (const [level, name, maxMs] of [['full', 'flow-in-fwd', 240], ['calm', 'flow-fade', 240], ['off', 'flow-fade', 200]] as [Level, string, number][]) {
  test(`motion ${level}: the next node enters with ${name} in ≤ ${maxMs}ms and settles fully visible`, async ({ page }) => {
    await setLevel(page, level);
    await open(page);
    await card(page).locator('.option').first().click();
    const anim = await card(page).evaluate((el) => {
      const cs = getComputedStyle(el);
      return { name: cs.animationName, ms: parseFloat(cs.animationDuration) * (cs.animationDuration.endsWith('ms') ? 1 : 1000) };
    });
    expect(anim.name).toBe(name);
    expect(anim.ms).toBeLessThanOrEqual(maxMs);
    await expect.poll(() => card(page).evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
  });
}
