// Knowledge map extras (features 51–57, 59, 60, 94, 117): layers and legend, neighbourhood focus with the side panel
// (map never moves), prerequisite route, trace (selects and shift-click), most connected, week filter, rebuild a week
// from memory, SVG/PNG export, motion levels and layout at both sizes. Expectations are derived from
// /data/overview.json, so regenerated content keeps them valid.
import { readFileSync } from 'node:fs';
import { test, expect, type Page } from '@playwright/test';
import { layoutProblems, setLevel, type Level } from './helpers';

test.beforeEach(() => test.setTimeout(90_000));

interface OC { id: string; title: string; href: string; week: number; dependsOn: string[]; contrasts: string[]; related: string[] }
type Ov = { id: string; code: string; weeks: { number: number; concepts: Omit<OC, 'week'>[] }[] }[];

function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on('console', (m) => m.type() === 'error' && !/WebSocket|\[vite\]/.test(m.text()) && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(e.message));
  return errors;
}
async function unitData(page: Page, unit = 'laws2400') {
  const ov: Ov = await (await page.request.get('/data/overview.json')).json();
  const cs: OC[] = ov.find((u) => u.id === unit)!.weeks.flatMap((w) => w.concepts.map((c) => ({ ...c, week: w.number })));
  const ids = new Set(cs.map((c) => c.id));
  for (const c of cs) for (const k of ['dependsOn', 'contrasts', 'related'] as const) c[k] = c[k].filter((t) => ids.has(t) && t !== c.id);
  const by = new Map(cs.map((c) => [c.id, c]));
  const ancestors = (id: string) => {
    const seen = new Set<string>();
    const walk = (u: string) => { for (const p of by.get(u)!.dependsOn) if (!seen.has(p)) { seen.add(p); walk(p); } };
    walk(id);
    seen.delete(id);
    return seen;
  };
  return { cs, by, ancestors };
}
async function openHub(page: Page, level: Level = 'off') {
  await setLevel(page, level);
  await page.goto('/laws2400/', { waitUntil: 'domcontentloaded' });
  await page.locator('.kmap').first().scrollIntoViewIfNeeded();
  await page.waitForSelector('.kmap__node', { timeout: 45_000 });
}
/** Ids of nodes whose dot is on screen and not covered by another dot (safe to click). */
async function clickable(page: Page) {
  await page.locator('.kmap__scroll').scrollIntoViewIfNeeded();
  return page.evaluate(() => [...document.querySelectorAll<SVGAElement>('.kmap__node')].filter((a) => {
    const r = a.querySelector('circle')!.getBoundingClientRect();
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    return x > 0 && y > 80 && x < innerWidth && y < innerHeight && document.elementFromPoint(x, y)?.closest('.kmap__node') === a;
  }).map((a) => a.dataset.id!));
}
const dot = (page: Page, id: string) => page.locator(`.kmap__node[data-id="${id}"] circle`);
const panel = (page: Page) => page.locator('.mapx-panel');
const hlCount = (page: Page, state: string) => page.locator(`.kmap__node[data-hl="${state}"]`).count();

test('no layout shift while the map loads: the server-drawn frame takes the space the map will (CLS < 0.05)', async ({ page }) => {
  await page.addInitScript(() => {
    (window as any).__cls = 0;
    new PerformanceObserver((list) => {
      for (const e of list.getEntries() as any[]) if (!e.hadRecentInput) (window as any).__cls += e.value;
    }).observe({ type: 'layout-shift', buffered: true });
  });
  const height = () => page.locator('.mapx').first().evaluate((el) => Math.round(el.getBoundingClientRect().height));
  for (const route of ['/laws2400/', '/map']) {
    await page.goto(route, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => document.fonts.ready);
    const before = await height();
    await page.locator('.kmap').first().scrollIntoViewIfNeeded();
    await page.waitForSelector('.kmap__node', { timeout: 45_000 });
    await expect(page.locator('.mapx[aria-busy]')).toHaveCount(0);
    expect(Math.abs((await height()) - before), `${route}: map height before and after it loads`).toBeLessThanOrEqual(1);
    expect(await page.evaluate(() => (window as any).__cls as number), `${route}: CLS`).toBeLessThan(0.05);
  }
});

test('layers: each link kind and names toggle on their own; the legend names every line style', async ({ page }) => {
  const errors = trackErrors(page);
  await openHub(page);
  const lines = (k: string) => page.locator(`.kmap__scroll .kmap__edge--${k}`).count();
  for (const k of ['depends', 'contrasts', 'related']) expect(await lines(k)).toBeGreaterThan(0);
  const tools = page.locator('.mapx__tools');
  await tools.getByRole('button', { name: 'Related' }).click();
  await expect(tools.getByRole('button', { name: 'Related' })).toHaveAttribute('aria-pressed', 'false');
  expect(await lines('related')).toBe(0);
  expect(await lines('depends')).toBeGreaterThan(0);
  await tools.getByRole('button', { name: 'Builds on' }).click();
  expect(await lines('depends')).toBe(0);
  expect(await lines('contrasts')).toBeGreaterThan(0);
  await tools.getByRole('button', { name: 'Builds on' }).click();
  await tools.getByRole('button', { name: 'Related' }).click();
  expect(await lines('related')).toBeGreaterThan(0);
  // Related lines are dotted, confusions dashed, prerequisites solid: told apart without colour.
  const dash = (k: string) => page.locator(`.kmap__scroll .kmap__edge--${k}`).first().evaluate((e) => getComputedStyle(e).strokeDasharray);
  expect(await dash('depends')).toBe('none');
  expect(await dash('contrasts')).not.toBe('none');
  expect(await dash('related')).not.toBe(await dash('contrasts'));
  const label = page.locator('.kmap__label').first();
  expect(await label.evaluate((e) => getComputedStyle(e).opacity)).toBe('0');
  await tools.getByRole('button', { name: 'Names' }).click();
  expect(await label.evaluate((e) => getComputedStyle(e).opacity)).toBe('1');
  const legend = page.locator('.kmap__legend');
  await expect(legend).toContainText('prerequisite stated in the notes');
  await expect(legend).toContainText('often confused with');
  await expect(legend).toContainText('related (a proposed link)');
  expect(errors).toEqual([]);
});

test('focus: a click dims all but the dot and its neighbours, opens the panel, and nothing moves; Escape clears', async ({ page, isMobile }) => {
  const errors = trackErrors(page);
  const { by } = await unitData(page);
  await page.route('**/data/laws2400/aids.json', (r) => r.fulfill({ json: { unit: 'laws2400', aids: Object.fromEntries([...by.keys()].map((id) => [id, { plain: `Plain statement for ${id}.` }])), flows: [], facts: {} } }));
  await openHub(page);
  const ids = (await clickable(page)).filter((id) => { const c = by.get(id)!; return c.dependsOn.length + c.contrasts.length + c.related.length > 0; });
  expect(ids.length).toBeGreaterThan(0);
  const id = ids[0], c = by.get(id)!;
  const geometry = () => page.evaluate(() => ({
    svg: JSON.stringify(document.querySelector('.kmap__scroll svg')!.getBoundingClientRect()),
    dots: [...document.querySelectorAll('.kmap__node circle')].map((e) => `${e.getAttribute('cx')},${e.getAttribute('cy')}`).join(' '),
  }));
  const before = await geometry();
  await dot(page, id).click();
  await expect(page.locator(`.kmap__node[data-id="${id}"]`)).toHaveAttribute('data-hl', 'focus');
  expect(await hlCount(page, 'dim')).toBeGreaterThan(0);
  expect(await hlCount(page, 'lit')).toBeGreaterThan(0);
  expect(await geometry()).toEqual(before);
  await expect(page).toHaveURL(/\/laws2400\/?$/);
  await expect(panel(page)).toBeVisible();
  await expect(panel(page).locator('.mapx-panel__title')).toHaveText(c.title);
  await expect(panel(page).locator('.mapx-panel__plain')).toHaveText(`Plain statement for ${id}.`);
  await expect(panel(page).getByRole('link', { name: 'Open concept' })).toHaveAttribute('href', c.href);
  await expect(panel(page).getByRole('link', { name: 'Quiz me' })).toHaveAttribute('href', `/laws2400/quiz?concept=${id}`);
  if (c.contrasts.length) await expect(panel(page).getByRole('region', { name: 'Often confused with' })).toContainText(by.get(c.contrasts[0])!.title);
  if (isMobile) {
    // Narrow: the panel sits under the map, never over it.
    const map = await page.locator('.kmap__scroll').boundingBox(), p = await panel(page).boundingBox();
    expect(p!.y).toBeGreaterThanOrEqual(map!.y + map!.height - 1);
  }
  expect(await layoutProblems(page)).toEqual([]);
  await page.keyboard.press('Escape');
  await expect(panel(page)).toHaveCount(0);
  expect(await hlCount(page, 'dim')).toBe(0);
  // A second click on the focused dot opens the concept.
  await dot(page, id).click();
  await expect(panel(page)).toBeVisible();
  await dot(page, id).click();
  await expect(page).toHaveURL(new RegExp(`${c.href}/?$`));
  expect(errors).toEqual([]);
});

test('keyboard: Alt+Enter focuses a dot, Enter still opens it; panel falls back to the title without study aids', async ({ page }) => {
  await page.route('**/data/laws2400/aids.json', (r) => r.fulfill({ json: { unit: 'laws2400', aids: {}, flows: [], facts: {} } }));
  await openHub(page);
  const node = page.locator('.kmap__node').first();
  const title = (await node.getAttribute('aria-label'))!.split(',')[0];
  await node.focus();
  await page.keyboard.press('Alt+Enter');
  await expect(panel(page).locator('.mapx-panel__title')).toHaveText(title);
  await expect(panel(page).locator('.mapx-panel__plain')).toHaveCount(0);
  await expect(page.locator('[role="status"]', { hasText: 'Details are in the panel' })).toHaveCount(1);
  await panel(page).getByRole('button', { name: 'Close concept panel' }).click();
  await expect(panel(page)).toHaveCount(0);
  await node.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/laws2400\/concept\//);
});

test('what do I need first: every prerequisite ancestor, numbered in study order on the map and in the panel', async ({ page }) => {
  const { cs, by, ancestors } = await unitData(page);
  await openHub(page);
  const target = cs.map((c) => ({ c, a: ancestors(c.id) })).sort((x, y) => y.a.size - x.a.size)[0];
  expect(target.a.size).toBeGreaterThan(1);
  await page.locator('summary', { hasText: 'Find a concept or trace a route' }).click();
  await page.getByLabel('From', { exact: true }).selectOption(target.c.id);
  await page.getByRole('button', { name: 'Focus', exact: true }).click();
  await expect(panel(page).locator('.mapx-panel__title')).toHaveText(target.c.title);
  await panel(page).getByRole('button', { name: 'What do I need first?' }).click();
  const steps = panel(page).locator('.mapx-panel__steps li:not(.mapx-panel__here)');
  await expect(steps).toHaveCount(target.a.size);
  const order = await steps.locator('a').allTextContents();
  expect(new Set(order)).toEqual(new Set([...target.a].map((id) => by.get(id)!.title)));
  // Study order: each concept comes after everything it builds on.
  const pos = new Map(order.map((t, i) => [t, i]));
  for (const id of target.a) for (const p of by.get(id)!.dependsOn) expect(pos.get(by.get(p)!.title)!).toBeLessThan(pos.get(by.get(id)!.title)!);
  await expect(page.locator('.mapx__num')).toHaveCount(target.a.size);
  expect(await hlCount(page, 'lit')).toBe(target.a.size);
});

test('trace: From/To selects and shift-click highlight the shortest route and say it in words', async ({ page }) => {
  const { cs, by } = await unitData(page);
  await openHub(page);
  const a = cs.find((c) => c.dependsOn.length)!, b = by.get(a.dependsOn[0])!;
  await page.locator('summary', { hasText: 'Find a concept or trace a route' }).click();
  await page.getByLabel('From', { exact: true }).selectOption(a.id);
  await page.getByLabel('To', { exact: true }).selectOption(b.id);
  await expect(page.locator('.mapx__path')).toHaveCount(1);
  await expect(page.locator('.mapx__route-words')).toHaveText(`Route, 1 step: ${a.title} → needs ${b.title}`);
  await page.getByRole('button', { name: 'Clear route' }).click();
  await expect(page.locator('.mapx__path')).toHaveCount(0);
  await expect(page.locator('.mapx__route')).toHaveCount(0);

  const x = (await clickable(page))[0];
  await dot(page, x).click();
  await expect(panel(page)).toBeVisible();
  // The panel covers part of the map on wide screens: shift-click a dot it leaves exposed.
  const rest = (await clickable(page)).filter((id) => id !== x);
  const y = rest[rest.length - 1];
  await dot(page, y).click({ modifiers: ['Shift'] });
  await expect(page).toHaveURL(/\/laws2400\/?$/);
  // While a route is shown the panel steps aside, so the whole route is visible.
  await expect(panel(page)).toHaveCount(0);
  const out = (await page.locator('.mapx__route-words').textContent())!;
  if (/No route/.test(out)) await expect(page.locator('.mapx__path')).toHaveCount(0);
  else {
    const n = Number(out.match(/^Route, (\d+) steps?/)![1]);
    await expect(page.locator('.mapx__path')).toHaveCount(n);
    expect(out.split(' → ').length).toBe(n + 1);
    expect(out).toContain(by.get(x)!.title);
    expect(out).toContain(by.get(y)!.title);
  }
});

test('most connected and the week filter', async ({ page }) => {
  const { cs, by } = await unitData(page);
  await openHub(page);
  await page.locator('summary', { hasText: 'Most connected' }).click();
  const items = page.locator('.mapx-top li');
  await expect(items).toHaveCount(5);
  await expect(items.first().locator('.mapx-top__why')).toContainText(/^\d+ links\. /);
  const first = (await items.first().locator('.mapx-top__name').textContent())!;
  await items.first().locator('.mapx-top__name').click();
  await expect(panel(page).locator('.mapx-panel__title')).toHaveText(first);
  await page.keyboard.press('Escape');

  const all = await page.locator('.kmap__node').count();
  const week = cs.find((c) => c.week === 3) ? 3 : cs[0].week;
  await page.locator('.mapx__tools').getByRole('button', { name: `Week ${week}`, exact: true }).click();
  const labels = await page.locator('.kmap__node').evaluateAll((ns) => ns.map((n) => n.getAttribute('aria-label')!));
  expect(labels.length).toBe(cs.filter((c) => c.week === week).length);
  for (const l of labels) expect(l).toContain(`week ${week},`);
  await expect(page.locator('summary', { hasText: 'Most connected' })).toContainText(`week ${week}`);
  for (const t of await page.locator('.mapx-top__name').allTextContents()) expect(cs.find((c) => c.title === t)!.week).toBe(week);
  await page.locator('.mapx__tools').getByRole('button', { name: 'All weeks' }).click();
  await expect(page.locator('.kmap__node')).toHaveCount(all);
  expect(by.size).toBe(all);
});

test('course map: unit chips still switch layouts and week chips filter across units', async ({ page }) => {
  await setLevel(page, 'off');
  await page.goto('/map/');
  const nodes = page.locator('.kmap__node');
  await expect(nodes.first()).toBeVisible();
  const all = await nodes.count();
  await page.locator('.mapx__tools').getByRole('button', { name: 'Week 1', exact: true }).click();
  const w1 = await nodes.count();
  expect(w1).toBeLessThan(all);
  for (const l of await nodes.evaluateAll((ns) => ns.map((n) => n.getAttribute('aria-label')!))) expect(l).toMatch(/week 1,/);
  await page.getByRole('button', { name: 'LAWS2400' }).click();
  const { cs } = await unitData(page);
  await expect.poll(() => nodes.count()).toBe(cs.length);
  await expect(page.locator('.mapx__tools').getByRole('button', { name: 'All weeks' })).toHaveAttribute('aria-pressed', 'true');
  // From the keyboard: the chip keeps focus while the new layout loads (only the map below it is inert meanwhile).
  const allUnits = page.getByRole('button', { name: 'All units' });
  await allUnits.focus();
  await page.keyboard.press('Enter');
  await expect(allUnits).toHaveAttribute('aria-pressed', 'true');
  await expect(allUnits).toBeFocused();
  await expect.poll(() => nodes.count()).toBe(all);
  expect(await layoutProblems(page)).toEqual([]);
});

test('rebuild a week: draw links by clicking, check, see right / missing / extra in distinct styles and words', async ({ page }) => {
  const errors = trackErrors(page);
  const { cs, by } = await unitData(page);
  await openHub(page);
  // A week with a stated prerequisite between two of its own concepts.
  const a = cs.find((c) => c.dependsOn.some((p) => by.get(p)!.week === c.week))!;
  const b = by.get(a.dependsOn.find((p) => by.get(p)!.week === a.week)!)!;
  const week = cs.filter((c) => c.week === a.week);
  const linked = (x: OC, y: OC) => [...x.dependsOn, ...x.contrasts, ...x.related].includes(y.id) || [...y.dependsOn, ...y.contrasts, ...y.related].includes(x.id);
  const scored = new Set<string>();
  for (const x of week) for (const y of week) if (x.id < y.id && (x.dependsOn.includes(y.id) || y.dependsOn.includes(x.id) || x.contrasts.includes(y.id) || y.contrasts.includes(x.id))) scored.add(`${x.id}|${y.id}`);
  const pair = week.flatMap((x) => week.map((y) => [x, y] as const)).find(([x, y]) => x.id < y.id && !linked(x, y));

  await page.getByRole('button', { name: 'Rebuild a week from memory' }).click();
  const rb = page.locator('.mapx-rb');
  await rb.getByRole('button', { name: `Week ${a.week}`, exact: true }).click();
  await expect(rb.locator('.mapx-rb__node')).toHaveCount(week.length);
  await expect(rb.locator('.mapx-rb__scroll .mapx-rb__line')).toHaveCount(0);
  await expect(rb.locator('.mapx-rb__intro')).toContainText(`The notes link ${scored.size} pair`);

  const ring = (id: string) => rb.locator(`.mapx-rb__node[data-id="${id}"] .mapx-rb__dot`);
  await ring(a.id).click();
  await expect(rb.locator(`.mapx-rb__node[data-id="${a.id}"]`)).toHaveAttribute('aria-pressed', 'true');
  await ring(b.id).click();
  await rb.locator('.mapx-rb__kind').first().click();
  await expect(rb.locator('.mapx-rb__scroll .mapx-rb__line--depends')).toHaveCount(1);
  if (pair) {
    await ring(pair[0].id).click();
    await ring(pair[1].id).click();
    await rb.getByRole('button', { name: 'Often confused' }).click();
  }
  await expect(rb.locator('.mapx-rb__mine li')).toHaveCount(pair ? 2 : 1);
  expect(await layoutProblems(page)).toEqual([]);

  await rb.getByRole('button', { name: 'Check my links' }).click();
  await expect(rb.locator('.mapx-rb__score')).toContainText(`1 of ${scored.size} ${scored.size === 1 ? 'link' : 'links'} right.`);
  await expect(rb.locator('.mapx-rb__scroll .mapx-rb__line--correct')).toHaveCount(1);
  await expect(rb.locator('.mapx-rb__scroll .mapx-rb__line--extra')).toHaveCount(pair ? 1 : 0);
  await expect(rb.locator('.mapx-rb__scroll .mapx-rb__line--missing')).toHaveCount(scored.size - 1);
  await expect(rb.getByRole('region', { name: /^Right/ })).toContainText(`${a.title} builds on ${b.title}`);
  const style = (cls: string) => rb.locator(`.mapx-rb__key .mapx-rb__line--${cls}`).evaluate((e) => getComputedStyle(e).strokeDasharray);
  const styles = await Promise.all(['correct', 'wrong', 'extra', 'missing'].map(style));
  expect(new Set(styles).size).toBe(4);

  // Keyboard alternative: the same state as a list of pairs.
  await rb.getByRole('button', { name: 'Try again' }).click();
  await rb.locator('summary', { hasText: 'Use a list instead' }).click();
  const select = rb.getByLabel(new RegExp(`^Link between (${escape(a.title)} and ${escape(b.title)}|${escape(b.title)} and ${escape(a.title)})$`));
  await expect(select).not.toHaveValue('');
  await select.selectOption('');
  await expect(rb.locator('.mapx-rb__scroll .mapx-rb__line--depends')).toHaveCount(0);
  await rb.getByRole('button', { name: 'Back to the map' }).click();
  await expect(page.locator('.kmap__node').first()).toBeVisible();
  expect(errors).toEqual([]);
});
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

test('export: SVG with theme colours inlined, PNG at 2×', async ({ page, isMobile }) => {
  test.skip(isMobile, 'downloads are the same on both sizes');
  await openHub(page);
  await page.locator('.mapx__tools').getByRole('button', { name: 'Names' }).click();
  const [svg] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Download SVG' }).click()]);
  expect(svg.suggestedFilename()).toBe('knowledge-map-laws2400.svg');
  const text = readFileSync((await svg.path())!, 'utf8');
  expect(text).toMatch(/^<svg[^>]+xmlns="http:\/\/www.w3.org\/2000\/svg"/);
  expect(text).not.toContain('var(--');
  expect(text).not.toContain('color-mix');
  expect(text).toMatch(/stroke:rgb\(/);
  expect(text).toContain('WEEK 1');
  const [png] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Download PNG' }).click()]);
  expect(png.suggestedFilename()).toBe('knowledge-map-laws2400.png');
  const buf = readFileSync((await png.path())!);
  expect(buf.subarray(1, 4).toString()).toBe('PNG');
  const width = buf.readUInt32BE(16);
  const shown = await page.locator('.kmap__scroll svg').evaluate((e) => e.getBoundingClientRect().width);
  expect(width).toBe(Math.round(shown * 2));
});

for (const level of ['full', 'calm', 'off'] as const) {
  test(`motion ${level}: dimming is opacity only (instant when off); panel enters by level`, async ({ page }) => {
    const errors = trackErrors(page);
    await setLevel(page, level);
    await page.goto('/map/');
    await page.getByRole('button', { name: 'LAWS2400' }).click();
    await expect(page.locator('.kmap__node').first()).toBeVisible();
    await page.locator('summary', { hasText: 'Find a concept or trace a route' }).click();
    await page.getByLabel('From', { exact: true }).selectOption({ index: 1 });
    await page.getByRole('button', { name: 'Focus', exact: true }).click();
    await expect(panel(page)).toBeVisible();
    const node = page.locator('.kmap__node[data-hl="dim"]').first();
    const t = await node.evaluate((e) => ({ prop: getComputedStyle(e).transitionProperty, dur: getComputedStyle(e).transitionDuration }));
    expect(t.prop).toBe('opacity');
    expect(t.dur).toBe(level === 'off' ? '0s' : '0.24s');
    const anim = await panel(page).evaluate((e) => getComputedStyle(e).animationName);
    expect(anim).toBe(level === 'full' ? 'mapx-in' : 'mapx-fade');
    await expect.poll(() => node.evaluate((e) => getComputedStyle(e).opacity)).toBe('0.22');
    expect(await layoutProblems(page)).toEqual([]);
    expect(errors).toEqual([]);
  });
}
