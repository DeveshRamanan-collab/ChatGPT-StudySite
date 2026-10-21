import { test, expect, type Page } from '@playwright/test';
import { setLevel, pickDial } from './helpers';

const WEEK = '/laws2400/week/4/';
const skipPretest = (page: Page) => page.addInitScript(() => localStorage.setItem('studysite:pretest:laws2400-w04', 'skip'));
const centre = (page: Page) => page.locator('.content').evaluate((e) => { const r = e.getBoundingClientRect(); return r.left + r.width / 2; });

test.describe('rail and layout', () => {
  test('TOC is a plain vertical list with increasing y, active entry tracked', async ({ page, isMobile }) => {
    test.skip(isMobile, 'desktop rail');
    await setLevel(page, 'off');
    await skipPretest(page);
    await page.goto(WEEK);
    const items = page.locator('.toc__item');
    await expect(items.first()).toBeVisible();
    const ys = await items.evaluateAll((els) => els.map((e) => e.getBoundingClientRect().top));
    expect(ys.length).toBeGreaterThan(3);
    for (let i = 1; i < ys.length; i++) expect(ys[i]).toBeGreaterThan(ys[i - 1]);
    await items.nth(3).locator('a').click();
    await expect(items.nth(3)).toHaveAttribute('data-active', '');
    await expect(page.locator('.toc__item[data-active]')).toHaveCount(1);
  });

  test('] collapses the rail and recentres the column; the choice persists', async ({ page, isMobile }) => {
    test.skip(isMobile, 'desktop rail');
    await setLevel(page, 'off');
    await skipPretest(page);
    await page.goto(WEEK);
    await expect(page.locator('html')).toHaveAttribute('data-rail', 'open');
    const openCentre = await centre(page);
    await page.keyboard.press(']');
    await expect(page.locator('html')).toHaveAttribute('data-rail', 'collapsed');
    const shell = await page.locator('.shell').evaluate((e) => { const r = e.getBoundingClientRect(); return r.left + r.width / 2; });
    expect(Math.abs((await centre(page)) - shell)).toBeLessThan(2);
    expect(Math.abs((await centre(page)) - openCentre)).toBeGreaterThan(40);
    await expect(page.locator('.rail__body')).toBeHidden();
    await expect(page.locator('[data-rail-tab]')).toBeVisible();
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-rail', 'collapsed');
    await page.locator('[data-rail-tab]').click();
    await expect(page.locator('html')).toHaveAttribute('data-rail', 'open');
  });

  test('pages without headings have no rail and a centred column', async ({ page }) => {
    for (const r of ['/', '/dashboard/', '/plan/', '/settings/']) {
      await page.goto(r);
      await expect(page.locator('html')).toHaveAttribute('data-rail', 'none');
      await expect(page.locator('.rail')).toHaveCount(0);
      const shell = await page.locator('.shell').evaluate((e) => { const r = e.getBoundingClientRect(); return r.left + r.width / 2; });
      expect(Math.abs((await centre(page)) - shell), r).toBeLessThan(2);
    }
  });

  test('below 1024px the tab opens the contents as a popover', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'narrow');
    await setLevel(page, 'off');
    await skipPretest(page);
    await page.goto(WEEK);
    await expect(page.locator('.rail__body')).toBeHidden();
    await page.locator('[data-rail-tab]').click();
    await expect(page.locator('.rail__body')).toBeVisible();
    await page.locator('.toc__item a').nth(2).click();
    await expect(page.locator('.rail__body')).toBeHidden();
  });
});

test.describe('scroll indicator', () => {
  test('progress line is off by default and comes back from Settings; the scrollbar can be hidden', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('studysite:pretest:laws2400-w04', 'skip'));
    await page.goto(WEEK);
    await expect(page.locator('html')).toHaveAttribute('data-progress', 'off');
    await expect(page.locator('.read-progress')).toBeHidden();
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollbarGutter)).toBe('stable');
    await page.goto('/settings/');
    await page.locator('.settings-seg__opt', { hasText: /^On$/ }).first().click();
    await page.locator('.settings-seg__opt', { hasText: 'Hide scrollbar' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-scrollbar', 'hidden');
    await page.goto(WEEK);
    await expect(page.locator('html')).toHaveAttribute('data-progress', 'on');
    await expect(page.locator('.read-progress')).toBeAttached();
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollbarWidth)).toBe('none');
  });
});

test.describe('theme', () => {
  test('auto follows the system before first paint; the header dial switches and persists', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/dashboard/');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'auto');
    expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe('rgb(23, 20, 15)');
    await page.emulateMedia({ colorScheme: 'light' });
    expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe('rgb(251, 247, 240)');
    await pickDial(page, 'Theme', 'Dark');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#17140F');
    await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(23, 20, 15)');
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe('rgb(23, 20, 15)');
    await expect(page.locator('.site-header [data-theme-dial] input[value="dark"]')).toBeChecked();
  });

  test('no flash: the stored theme is on <html> before any stylesheet applies', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('studysite:theme', 'dark');
      document.addEventListener('DOMContentLoaded', () => { (window as any).__themeAtDCL = document.documentElement.dataset.theme; });
    });
    await page.goto('/');
    expect(await page.evaluate(() => (window as any).__themeAtDCL)).toBe('dark');
  });

  test('palette > theme', async ({ page, isMobile }) => {
    test.skip(isMobile, 'keyboard');
    await page.goto('/dashboard/');
    await page.waitForLoadState('networkidle');
    await page.keyboard.press('Control+k');
    await page.locator('.palette__input').fill('>theme light');
    await page.keyboard.press('Enter');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });
});
