// Visual practice (/<unit>/visual): label the parts (drag + tap-tap), match (links drawn as lines), sort (gloss as the
// reason), draw it (pen, undo, clear, compare, self-rating, kept in IndexedDB), plus the plain "nothing here yet"
// states. Data-driven: right answers come from the unit's aids.json, so regenerated content keeps the spec valid.
import { test, expect, type Page, type APIRequestContext } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { layoutProblems, setLevel, type Level } from './helpers';
import type { Aid, AidsBundle } from '../src/lib/aids';
import { scenariosOf } from '../src/lib/visual';

const UNIT = 'laws2400';
const SELECT = '.btn, .chip, .tabs__tab, .vis-tile, .vis-match__item, .vis-label__slot, .vis-sort__bin, .vis-sketch__tool';
test.beforeEach(() => test.setTimeout(90_000));

function watchErrors(page: Page) {
  const errors: string[] = [];
  page.on('console', (m) => m.type() === 'error' && !/WebSocket|\[vite\]/.test(m.text()) && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(String(e)));
  return errors;
}
const exact = (t: string) => new RegExp(`^${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`);
const bundle = async (request: APIRequestContext): Promise<AidsBundle> => (await request.get(`/data/${UNIT}/aids.json`)).json();

async function open(page: Page, query: string, level: Level = 'off') {
  await setLevel(page, level);
  await page.goto(`/${UNIT}/visual/?${query}`, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.vis')).toBeVisible({ timeout: 45_000 });
}

interface Row { questionId: string; concept: string; week?: string; type: string; correct: boolean | null; score?: number; mode?: string }
const attempts = (page: Page) => page.evaluate(() => new Promise<Row[]>((resolve) => {
  const req = indexedDB.open('studysite');
  req.onsuccess = () => {
    const db = req.result;
    if (!db.objectStoreNames.contains('attempts')) { db.close(); resolve([]); return; }
    const all = db.transaction('attempts').objectStore('attempts').getAll();
    all.onsuccess = () => { db.close(); resolve(all.result as Row[]); };
  };
  req.onerror = () => resolve([]);
}));
const setting = (page: Page, key: string) => page.evaluate((k) => new Promise<unknown>((resolve) => {
  const req = indexedDB.open('studysite');
  req.onsuccess = () => {
    const db = req.result;
    const g = db.transaction('settings').objectStore('settings').get(k);
    g.onsuccess = () => { db.close(); resolve(g.result?.value); };
  };
}), key);

test('label: tap a part then a box, Check marks every box with icon and word, Show answer, attempt recorded', async ({ page, request }) => {
  const errors = watchErrors(page);
  const b = await bundle(request);
  await open(page, 'kind=label&week=2');
  await expect(page.getByRole('tab', { name: 'Label parts' })).toHaveAttribute('aria-selected', 'true');
  const concept = await page.locator('.vis-pick__select').inputValue();
  const names = b.aids[concept].elements.map((e) => e.name.trim());
  await expect(page.locator('.vis-label__slot')).toHaveCount(names.length);
  await expect(page.locator('.vis-label__tray .vis-tile')).toHaveCount(names.length);
  await expect(page.getByRole('button', { name: 'Check' })).toBeDisabled();

  // All but the last in the right box (touch on phones, click on desktop: both are tap-tap).
  const isMobile = test.info().project.name === 'mobile';
  for (let i = 0; i < names.length - 1; i++) {
    const tile = page.locator('.vis-label__tray .vis-tile').filter({ hasText: exact(names[i]) }).first();
    if (isMobile) await tile.tap(); else await tile.click();
    await expect(tile).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('.vis__status')).toContainText('Now choose its box');
    await page.locator('.vis-label__slot').nth(i).locator('.vis-label__empty').click();
    await expect(page.locator('.vis-label__slot').nth(i)).toContainText(names[i]);
  }
  await page.getByRole('button', { name: 'Check' }).click();
  const marks = page.locator('.vis-label__mark');
  await expect(marks).toHaveCount(names.length);
  await expect(marks.first()).toHaveText(/^✓\s*Right$/);
  await expect(marks.last()).toHaveText(/^✕\s*Empty$/);
  await expect(page.locator('.vis__status')).toHaveText(`${names.length - 1} of ${names.length} in place.`);
  await expect(page.locator('.vis-label__tests summary')).toHaveText('What each part asks');

  await expect.poll(async () => (await attempts(page)).length).toBe(1);
  const [a] = await attempts(page);
  expect(a).toMatchObject({ questionId: `visual:label:${concept}`, concept, type: 'match', correct: null, mode: 'visual' });
  expect(a.score).toBeCloseTo((names.length - 1) / names.length);

  // A second Check in the same round is not recorded again; Show answer fills every box.
  await page.getByRole('button', { name: 'Show answer' }).click();
  await expect(page.locator('.vis-label__mark[data-mark="right"]')).toHaveCount(names.length);
  for (let i = 0; i < names.length; i++) await expect(page.locator('.vis-label__slot').nth(i)).toContainText(names[i]);
  await page.getByRole('button', { name: 'Check' }).click();
  await page.waitForTimeout(300);
  expect(await attempts(page)).toHaveLength(1);

  expect(await layoutProblems(page, SELECT)).toEqual([]);
  const axe = await new AxeBuilder({ page }).include('.vis').analyze();
  expect(axe.violations.map((v) => v.id)).toEqual([]);
  expect(errors).toEqual([]);
});

test('label: mouse drag moves a part into a box and between boxes; Escape clears a selection', async ({ page, request }) => {
  test.skip(test.info().project.name === 'mobile', 'touch uses tap-tap (covered above)');
  const errors = watchErrors(page);
  const b = await bundle(request);
  await open(page, 'kind=label&week=2', 'full');
  const concept = await page.locator('.vis-pick__select').inputValue();
  const name = b.aids[concept].elements[0].name.trim();
  const drag = async (from: string, to: string) => {
    const s = (await page.locator(from).boundingBox())!;
    const t = (await page.locator(to).boundingBox())!;
    await page.mouse.move(s.x + s.width / 2, s.y + s.height / 2);
    await page.mouse.down();
    await page.mouse.move(t.x + t.width / 2, t.y + t.height / 2, { steps: 8 });
    await page.mouse.up();
  };
  await drag(`.vis-label__tray .vis-tile:text-is("${name}")`, '.vis-label__slot >> nth=0');
  await expect(page.locator('.vis-label__slot').first()).toContainText(name);
  await expect(page.locator('.vis__status')).toHaveText(`“${name}” placed in box 1.`);
  await drag('.vis-label__slot >> nth=0 >> .vis-tile', '.vis-label__slot >> nth=1');
  await expect(page.locator('.vis-label__slot').nth(1)).toContainText(name);
  await expect(page.locator('.vis-label__slot').first()).toContainText('Empty');
  // A click after a drag is not a selection.
  await expect(page.locator('.vis-tile[aria-pressed="true"]')).toHaveCount(0);
  await page.locator('.vis-label__tray .vis-tile').first().click();
  await expect(page.locator('.vis-tile[aria-pressed="true"]')).toHaveCount(1);
  await page.keyboard.press('Escape');
  await expect(page.locator('.vis-tile[aria-pressed="true"]')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('match: choose a scenario then a concept, lines drawn, Check, Why? in place, one attempt per concept', async ({ page, request }) => {
  const errors = watchErrors(page);
  const b = await bundle(request);
  await open(page, 'kind=match&week=2');
  const scenarios = Object.values(b.aids).flatMap((a: Aid) => scenariosOf(a));
  const items = page.locator('.vis-match__item--scenario');
  const n = await items.count();
  expect(n).toBeGreaterThanOrEqual(2);
  const owners = new Set<string>();
  for (let i = 0; i < n; i++) {
    const text = (await items.nth(i).locator('.vis-match__text').textContent())!;
    const s = scenarios.find((x) => text.includes(x.text))!;
    expect(s, text).toBeTruthy();
    owners.add(s.concept);
    await items.nth(i).click();
    await expect(items.nth(i)).toHaveAttribute('aria-pressed', 'true');
    await page.locator(`.vis-match__item--concept[data-cid="${s.concept}"]`).click();
    await expect(items.nth(i).locator('.vis-match__tag')).toContainText('→');
  }
  await expect(page.locator('.vis-match__line')).toHaveCount(n);
  await page.getByRole('button', { name: 'Check' }).click();
  await expect(page.locator('.vis__status')).toHaveText('All linked right.');
  await expect(page.locator('.vis-match__mark[data-mark="right"]')).toHaveCount(n);
  await expect(page.locator('.vis-match__line[data-mark="right"]')).toHaveCount(n);
  const why = page.getByRole('button', { name: 'Why?' }).first();
  await why.click();
  await expect(page.getByRole('button', { name: 'Hide why' }).first()).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('.vis-match__why')).toHaveCount(1);

  await expect.poll(async () => (await attempts(page)).length).toBe(owners.size);
  const rows = await attempts(page);
  for (const r of rows) expect(r).toMatchObject({ type: 'match', correct: null, score: 1, mode: 'visual', questionId: `visual:match:${r.concept}` });

  // Choosing the same pair again unlinks.
  const first = items.first();
  const text = (await first.locator('.vis-match__text').textContent())!;
  const s = scenarios.find((x) => text.includes(x.text))!;
  await first.click();
  await page.locator(`.vis-match__item--concept[data-cid="${s.concept}"]`).click();
  await expect(page.locator('.vis-match__line')).toHaveCount(n - 1);
  await expect(page.locator('.vis__status')).toHaveText('Scenario 1 unlinked.');

  expect(await layoutProblems(page, SELECT)).toEqual([]);
  const axe = await new AxeBuilder({ page }).include('.vis').analyze();
  expect(axe.violations.map((v) => v.id)).toEqual([]);
  expect(errors).toEqual([]);
});

test('sort: terms into concepts, Check shows each gloss as the reason, Show answer, attempts per bin', async ({ page, request }) => {
  const errors = watchErrors(page);
  const b = await bundle(request);
  await open(page, 'kind=sort&week=2');
  const bins = await page.locator('.vis-sort__bin').evaluateAll((els) => els.map((e) => e.getAttribute('data-drop')!.replace('bin:', '')));
  expect(bins.length).toBeGreaterThanOrEqual(2);
  const tiles = page.locator('.vis-sort__tray .vis-tile');
  const total = await tiles.count();
  const terms = await tiles.allTextContents();
  // Sort every term but the last correctly; leave the last unsorted.
  for (const t of terms.slice(0, -1)) {
    const owner = bins.find((c) => b.aids[c].terms.some((x) => x.term.trim() === t))!;
    await page.locator('.vis-sort__tray .vis-tile').filter({ hasText: exact(t) }).first().click();
    await page.locator(`.vis-sort__bin[data-drop="bin:${owner}"] .vis-sort__bin-head`).click();
    await expect(page.locator(`.vis-sort__bin[data-drop="bin:${owner}"]`)).toContainText(t);
  }
  await page.getByRole('button', { name: 'Check' }).click();
  await expect(page.locator('.vis__status')).toHaveText(`${total - 1} of ${total} sorted right.`);
  await expect(page.locator('.vis-sort__mark[data-mark="right"]')).toHaveCount(total - 1);
  await expect(page.locator('.vis-sort__mark[data-mark="wrong"]')).toHaveText(/✕\s*Not sorted/);
  const gloss = b.aids[bins[0]].terms.find((x) => terms.includes(x.term.trim()))?.gloss;
  if (gloss) await expect(page.locator('.vis-sort__gloss', { hasText: gloss.slice(0, 30) }).first()).toBeVisible();
  await expect.poll(async () => (await attempts(page)).length).toBe(bins.length);
  for (const r of await attempts(page)) expect(r).toMatchObject({ type: 'match', correct: null, mode: 'visual', questionId: `visual:sort:${r.concept}` });

  await page.getByRole('button', { name: 'Show answer' }).click();
  await expect(page.locator('.vis-sort__tray .vis-tile')).toHaveCount(0);
  await expect(page.locator('.vis-sort__mark[data-mark="right"]')).toHaveCount(total);
  expect(await layoutProblems(page, SELECT)).toEqual([]);
  expect(errors).toEqual([]);
});

test('draw it: pen, undo, clear (undoable), compare beside, self-rate recorded, sketch kept across a reload', async ({ page }) => {
  const errors = watchErrors(page);
  await open(page, 'kind=sketch&week=3');
  const canvas = page.locator('.vis-sketch__canvas');
  const concept = await page.locator('.vis-pick__select').inputValue();
  const stroke = async (y: number) => {
    await canvas.scrollIntoViewIfNeeded();
    const box = (await canvas.boundingBox())!;
    await page.mouse.move(box.x + box.width * 0.2, box.y + box.height * y);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.7, box.y + box.height * (y + 0.1), { steps: 10 });
    await page.mouse.up();
  };
  await expect(page.getByRole('button', { name: 'Undo' })).toBeDisabled();
  await stroke(0.3);
  await expect(canvas).toHaveAttribute('data-strokes', '1');
  await stroke(0.6);
  await expect(canvas).toHaveAttribute('data-strokes', '2');
  await page.getByRole('button', { name: 'Undo' }).click();
  await expect(canvas).toHaveAttribute('data-strokes', '1');
  await page.getByRole('button', { name: 'Clear' }).click();
  await expect(canvas).toHaveAttribute('data-strokes', '0');
  await expect(page.locator('.vis__status')).toHaveText('Cleared. Undo brings it back.');
  await page.getByRole('button', { name: 'Undo' }).click();
  await expect(canvas).toHaveAttribute('data-strokes', '1');
  // Ink really reached the canvas.
  expect(await canvas.evaluate((c: HTMLCanvasElement) => {
    const d = c.getContext('2d')!.getImageData(0, 0, c.width, c.height).data;
    for (let i = 3; i < d.length; i += 4) if (d[i] > 0) return true;
    return false;
  })).toBe(true);

  await page.getByRole('button', { name: 'Compare' }).click();
  const ref = page.locator('.vis-sketch__ref');
  await expect(ref).toBeVisible();
  await expect(ref.locator('.vis-ref__step, .vis-ref__line').first()).toBeVisible();
  await expect(canvas).toBeVisible();
  await page.getByRole('button', { name: 'Partly' }).click();
  await expect(page.getByRole('button', { name: 'Partly' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('button', { name: 'Got it' })).toBeDisabled();
  await expect.poll(async () => (await attempts(page)).length).toBe(1);
  expect((await attempts(page))[0]).toMatchObject({ questionId: `visual:sketch:${concept}`, concept, type: 'short', score: 0.5, correct: null, mode: 'visual' });
  expect(await layoutProblems(page, SELECT)).toEqual([]);

  await expect.poll(async () => ((await setting(page, `sketch:${concept}`)) as { ops?: unknown[] } | undefined)?.ops?.length ?? 0).toBe(1);
  await page.reload();
  await expect(page.locator('.vis-sketch__canvas')).toHaveAttribute('data-strokes', '1', { timeout: 45_000 });
  await expect(page.locator('.vis__status')).toContainText('is back');
  await expect(page.locator('.vis-pick__select option:checked')).toContainText('· sketched');
  expect(errors).toEqual([]);
});

test('tabs and weeks: arrows move between kinds, the address keeps kind and week', async ({ page }) => {
  const errors = watchErrors(page);
  await open(page, 'kind=label&week=3');
  await page.getByRole('tab', { name: 'Label parts' }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'Match' })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('tab', { name: 'Match' })).toBeFocused();
  await expect(page).toHaveURL(/kind=match/);
  await page.keyboard.press('End');
  await expect(page.getByRole('tab', { name: 'Draw it' })).toHaveAttribute('aria-selected', 'true');
  const week = page.locator('.vis__weeks .chip').first();
  const n = (await week.textContent())!.trim();
  await week.click();
  await expect(week).toHaveAttribute('aria-pressed', 'true');
  await expect(page).toHaveURL(new RegExp(`kind=sketch&week=${n}`));
  await expect(page.locator('.vis__scope')).toContainText(`Week ${n}`);
  expect(errors).toEqual([]);
});

test('plain states: a unit with no aids, and a week without material for a kind', async ({ page }) => {
  await page.route(`**/data/${UNIT}/aids.json`, (r) => r.fulfill({ json: { unit: UNIT, aids: {}, flows: [], facts: {} } }));
  await setLevel(page, 'off');
  await page.goto(`/${UNIT}/visual/?kind=label`, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-vis-empty]')).toHaveText(/No study aids for LAWS2400 yet/, { timeout: 45_000 });

  const only: Aid = {
    concept: 'laws2400-w02-battery', unit: UNIT, week: 'laws2400-w02', plain: '', terms: [{ term: 'Contact', gloss: 'Touching' }],
    misconceptions: [], socratic: [], elements: [], 'what-if': [], boundary: [], transfer: [], objections: [], storyboard: [], sources: [], verify: false,
  };
  await page.unroute(`**/data/${UNIT}/aids.json`);
  await page.route(`**/data/${UNIT}/aids.json`, (r) => r.fulfill({ json: { unit: UNIT, aids: { [only.concept]: only }, flows: [], facts: {} } }));
  await page.goto(`/${UNIT}/visual/?kind=label`, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-vis-none]')).toHaveText(/No rule in Week 2 has its parts listed yet\. Try another week or another exercise\./, { timeout: 45_000 });
  await expect(page.locator('.vis__weeks .chip')).toHaveCount(1);
  await expect(page.locator('.vis__note').first()).toContainText('no study aids yet');
  await page.getByRole('tab', { name: 'Sort' }).click();
  await expect(page.locator('[data-vis-none]')).toContainText('nothing to sort');
  expect(await layoutProblems(page, SELECT)).toEqual([]);
});

test('motion: calm and full render every kind without errors or overlap', async ({ page }) => {
  const errors = watchErrors(page);
  for (const level of ['calm', 'full'] as const) {
    await open(page, 'kind=match&week=2', level);
    for (const tab of ['Label parts', 'Match', 'Sort', 'Draw it']) {
      await page.getByRole('tab', { name: tab }).click();
      await expect(page.locator('.vis__panel')).toBeVisible();
      await page.waitForTimeout(350);
      expect(await layoutProblems(page, SELECT), `${level} ${tab}`).toEqual([]);
    }
  }
  expect(errors).toEqual([]);
});

test('every unit: each kind renders an exercise or a plain sentence, never an error', async ({ page }) => {
  test.skip(test.info().project.name === 'mobile', 'content sweep: once is enough');
  const errors = watchErrors(page);
  const body = { label: '.vis-label__board', match: '.vis-match', sort: '.vis-sort', sketch: '.vis-sketch__board' } as const;
  for (const unit of ['laws2400', 'laws2000', 'laws2100', 'mgmt2094']) {
    await setLevel(page, 'off');
    await page.goto(`/${unit}/visual/`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.vis, [data-vis-empty]').first()).toBeVisible({ timeout: 45_000 });
    if (await page.locator('[data-vis-empty]').count()) continue;
    for (const [kind, sel] of Object.entries(body)) {
      await page.getByRole('tab', { name: { label: 'Label parts', match: 'Match', sort: 'Sort', sketch: 'Draw it' }[kind as keyof typeof body] }).click();
      await expect(page.locator(`${sel}, [data-vis-none]`).first(), `${unit} ${kind}`).toBeVisible();
    }
    expect(await layoutProblems(page, SELECT), unit).toEqual([]);
  }
  expect(errors).toEqual([]);
});
