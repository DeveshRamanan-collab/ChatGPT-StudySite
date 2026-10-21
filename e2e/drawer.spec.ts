import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { setLevel, openSheet } from './helpers';

// The ≡ drawer (src/components/NavSheet.tsx). Written against the October 2026 rebuild: these tests fail on the old
// sheet (Lenis swallowed the wheel, so nothing below the fold was reachable; the page behind scrolled instead).
type Week = { id: string; number: number; topic: string; href: string };
type Unit = { id: string; code: string; weeksExpected?: number; weeks: Week[] };
const VIEWPORTS = [[390, 844], [768, 1024], [1440, 900]] as const;
const sheetOf = (page: Page) => page.locator('dialog#navsheet');
const body = (page: Page) => sheetOf(page).locator('[data-drawer-scroll]');

async function wheelOver(page: Page, x: number, y: number, times = 12) {
  await page.mouse.move(x, y);
  for (let i = 0; i < times; i++) { await page.mouse.wheel(0, 300); await page.waitForTimeout(60); }
  await page.waitForTimeout(400);
}
const inView = (page: Page, sel: string) => page.locator(sel).last().evaluate((el) => {
  const r = el.getBoundingClientRect(), s = el.closest('[data-drawer-scroll]')!.getBoundingClientRect();
  return r.top >= s.top - 1 && r.bottom <= s.bottom + 1 && r.bottom <= innerHeight;
});

test.describe('drawer', () => {
  test.beforeEach(async ({ page }) => { await setLevel(page, 'full'); });

  test('the last item can be scrolled to with the wheel and clicked, at 390, 768 and 1440 wide', async ({ page, isMobile }) => {
    test.skip(isMobile, 'mouse wheel; touch is covered by native overflow scrolling');
    for (const [w, h] of VIEWPORTS) {
      await page.setViewportSize({ width: w, height: h });
      await page.goto('/laws2400/week/3');
      await page.evaluate(() => scrollTo(0, 400));
      const sheet = await openSheet(page);
      const last = '[data-drawer-scroll] a[href]';
      const box = (await body(page).boundingBox())!;
      expect(await inView(page, `dialog#navsheet ${last}`), `${w}: last item starts below the fold`).toBe(false);
      await wheelOver(page, box.x + box.width / 2, box.y + box.height / 2);
      expect(await inView(page, `dialog#navsheet ${last}`), `${w}: wheel reaches the last item`).toBe(true);
      const href = await sheet.locator(last).last().getAttribute('href');
      await sheet.locator(last).last().click();
      await expect(page).toHaveURL(new RegExp(`${href!.replace(/[?]/g, '\\?')}/?$`));
      await expect(sheet).toBeHidden();
    }
  });

  test('touch: a swipe scrolls the drawer, not the page (phone)', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'touch');
    await page.goto('/laws2400/week/3');
    await page.evaluate(() => scrollTo(0, 400));
    await openSheet(page);
    await page.waitForTimeout(300);
    const y = await page.evaluate(() => scrollY);
    const box = (await body(page).boundingBox())!;
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Input.synthesizeScrollGesture', { x: Math.round(box.x + box.width / 2), y: Math.round(box.y + box.height * 0.7), yDistance: -900, gestureSourceType: 'touch', speed: 1600 });
    await page.waitForTimeout(400);
    expect(await body(page).evaluate((el) => el.scrollTop)).toBeGreaterThan(200);
    expect(await page.evaluate(() => scrollY)).toBe(y);
    // The thumb-reach Close bar closes it.
    await sheetOf(page).getByRole('button', { name: 'Close menu' }).last().click();
    await expect(sheetOf(page)).toBeHidden();
  });

  test('keyboard: End reaches the last item, arrows move between items', async ({ page, isMobile }) => {
    test.skip(isMobile, 'keyboard');
    await page.goto('/laws2400/week/3');
    await openSheet(page);
    await page.keyboard.press('End');
    const lastLink = body(page).locator('a[href], button').last();
    await expect(lastLink).toBeFocused();
    expect(await inView(page, 'dialog#navsheet [data-drawer-scroll] :is(a[href], button)')).toBe(true);
    await page.keyboard.press('Home');
    const first = await page.evaluate(() => document.activeElement?.textContent);
    await page.keyboard.press('ArrowDown');
    expect(await page.evaluate(() => document.activeElement?.textContent)).not.toBe(first);
    expect(await page.evaluate(() => !!document.activeElement?.closest('dialog#navsheet'))).toBe(true);
  });

  test('the page behind does not scroll while the drawer is open', async ({ page, isMobile }) => {
    test.skip(isMobile, 'mouse wheel');
    await page.goto('/laws2400/week/3');
    await page.evaluate(() => scrollTo(0, 400));
    await page.waitForTimeout(300);
    const y = await page.evaluate(() => scrollY);
    await openSheet(page);
    const box = (await body(page).boundingBox())!;
    await wheelOver(page, box.x + 40, box.y + box.height / 2, 8); // over the drawer
    await wheelOver(page, 1300, 450, 6); // over the backdrop
    expect(await page.evaluate(() => scrollY)).toBe(y);
    await page.keyboard.press('Escape');
    await expect(sheetOf(page)).toBeHidden();
    await wheelOver(page, 700, 450, 4); // and the page scrolls again once it closes
    expect(await page.evaluate(() => scrollY)).toBeGreaterThan(y);
  });

  test('Escape, the backdrop and navigation each close it; focus returns to ≡', async ({ page, isMobile }) => {
    test.skip(isMobile, 'keyboard + backdrop at desktop width');
    const btn = page.locator('.navsheet-btn');
    await page.goto('/dashboard/');
    await openSheet(page);
    await expect(btn).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Escape');
    await expect(sheetOf(page)).toBeHidden();
    await expect(btn).toBeFocused();
    await expect(btn).toHaveAttribute('aria-expanded', 'false');

    await openSheet(page);
    await page.mouse.click(1300, 450);
    await expect(sheetOf(page)).toBeHidden();
    await expect(btn).toBeFocused();

    await page.keyboard.press('m');
    await expect(sheetOf(page)).toBeVisible();
    await sheetOf(page).getByRole('link', { name: /^Study plan/ }).click();
    await expect(page).toHaveURL(/\/plan\/?$/);
    await expect(sheetOf(page)).toBeHidden();
    await expect(btn).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.classList.contains('is-drawer-open'))).toBe(false);
    // Typing in a field never opens it.
    await page.goto('/search/');
    await page.locator('#q').pressSequentially('mm');
    await expect(sheetOf(page)).toBeHidden();
  });

  test('every week of every unit is present; ingested weeks are links; the current week carries aria-current', async ({ page, request }) => {
    const units: Unit[] = await (await request.get('/data/overview.json')).json();
    await page.goto('/laws2400/concept/w03-trespass-to-land-elements');
    const sheet = await openSheet(page);
    await expect(sheet.getByRole('navigation', { name: 'Site' })).toBeVisible();
    for (const u of units) {
      const group = sheet.locator(`[data-unit="${u.id}"]`);
      const n = Math.max(u.weeksExpected ?? 12, ...u.weeks.map((w) => w.number));
      expect(await group.locator('[data-week]').evaluateAll((els) => new Set(els.map((e) => e.getAttribute('data-week'))).size), `${u.code} weeks`).toBe(n);
      for (const w of u.weeks) expect(await group.locator(`a[href="${w.href}"]`).count(), `${w.id} link`).toBeGreaterThan(0);
    }
    // The current unit is expanded with titled rows; the current week is marked and scrolled into view.
    const torts = sheet.locator('[data-unit="laws2400"]');
    await expect(torts.locator('button[aria-expanded]')).toHaveAttribute('aria-expanded', 'true');
    const cur = torts.locator('a[href="/laws2400/week/3"][aria-current]');
    await expect(cur).toBeVisible();
    await expect(cur).toContainText(units.find((u) => u.id === 'laws2400')!.weeks[2].topic.slice(0, 20));
    await expect(sheet.locator('[data-unit="laws2100"] button[aria-expanded]')).toHaveAttribute('aria-expanded', 'false');
  });

  test('two clicks to any week from a collapsed unit; expanded state is remembered', async ({ page }) => {
    await setLevel(page, 'off');
    await page.goto('/settings/');
    let sheet = await openSheet(page);
    await sheet.locator('[data-unit="laws2100"]').getByRole('link', { name: /^Week 2\b/ }).click(); // click 2
    await expect(page).toHaveURL(/\/laws2100\/week\/2\/?$/);
    sheet = await openSheet(page);
    const toggle = sheet.locator('[data-unit="laws2000"] button[aria-expanded]');
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await page.reload();
    sheet = await openSheet(page);
    await expect(sheet.locator('[data-unit="laws2000"] button[aria-expanded]')).toHaveAttribute('aria-expanded', 'true');
  });

  test('readable: rows ≥ 44 px, no text under the body size', async ({ page }) => {
    await page.goto('/laws2400/week/3');
    const sheet = await openSheet(page);
    const m = await sheet.evaluate((d) => {
      const els = [...d.querySelectorAll<HTMLElement>('a[href], button, input')].filter((e) => e.getClientRects().length);
      const boxes = els.map((e) => (e.tagName === 'INPUT' ? e.parentElement! : e).getBoundingClientRect().height);
      const text = [...d.querySelectorAll<HTMLElement>('*')].filter((e) => e.getClientRects().length && [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent!.trim()));
      const body = parseFloat(getComputedStyle(document.body).fontSize);
      return { minRow: Math.min(...boxes), minFont: Math.min(...text.map((e) => parseFloat(getComputedStyle(e).fontSize))), body };
    });
    expect(m.minRow).toBeGreaterThanOrEqual(44);
    expect(m.minFont).toBeGreaterThanOrEqual(m.body);
  });

  for (const theme of ['light', 'white', 'dark'] as const) {
    test(`axe: the open drawer has no violations (${theme})`, async ({ page }) => {
      await page.addInitScript((t) => localStorage.setItem('studysite:theme', t), theme);
      await setLevel(page, 'off');
      await page.goto('/laws2400/week/3');
      await openSheet(page);
      const r = await new AxeBuilder({ page }).include('dialog#navsheet').withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
      expect(r.violations.map((v) => `${v.id}: ${v.nodes.length} × ${v.nodes[0]?.target}`)).toEqual([]);
    });
  }
});
