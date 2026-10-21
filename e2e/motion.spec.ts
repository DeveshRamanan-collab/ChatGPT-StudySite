import { test, expect, type Page } from '@playwright/test';
import { pickDial } from './helpers';

type M = { count: () => number; expected: () => number; level: () => string; lenis: () => boolean };
const state = (page: Page) =>
  page.evaluate(() => {
    const m = (window as unknown as { __motion: M }).__motion;
    return { count: m.count(), expected: m.expected(), level: m.level(), lenis: m.lenis() };
  });

async function go(page: Page, href: string) {
  await page.evaluate((h) => {
    const a = document.createElement('a');
    a.href = h;
    document.body.append(a);
    a.click();
  }, href);
  await page.waitForURL(`**${href}`);
  await page.waitForFunction(() => (window as any).__motion?.count() === (window as any).__motion?.expected());
}

test('ScrollTriggers are rebuilt, never leaked, across client-side navigation', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await page.waitForFunction(() => !!(window as any).__motion);
  let s = await state(page);
  expect(s.level).toBe('full');
  expect(s.lenis).toBe(true);
  expect(s.count).toBe(s.expected);
  expect(s.expected).toBeGreaterThan(0);

  for (const href of ['/styleguide/', '/laws2400/week/1/', '/']) {
    await go(page, href);
    s = await state(page);
    expect(s.count, href).toBe(s.expected);
  }
  // Same page visited again must not accumulate.
  await go(page, '/styleguide/');
  const again = await state(page);
  expect(again.count).toBe(again.expected);
  expect(errors).toEqual([]);
});

test('motion dial persists across navigation and reload; off kills everything', async ({ page }) => {
  await page.goto('/styleguide/');
  await page.waitForFunction(() => !!(window as any).__motion);
  await pickDial(page, 'Motion', 'Calm');
  expect(await page.evaluate(() => document.documentElement.dataset.motion)).toBe('calm');
  expect((await state(page)).lenis).toBe(false);

  await go(page, '/laws2400/week/1/');
  expect(await page.evaluate(() => document.documentElement.dataset.motion)).toBe('calm');
  await page.reload();
  expect(await page.evaluate(() => document.documentElement.dataset.motion)).toBe('calm');
  await expect(page.locator('.site-header [data-motion-dial] input[value="calm"]')).toBeChecked();

  await pickDial(page, 'Motion', 'Off');
  const s = await state(page);
  expect(s.level).toBe('off');
  expect(s.count).toBe(0);
});

test.describe('reduced motion', () => {
  test('prefers-reduced-motion forces off unless overridden', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    expect(await page.evaluate(() => document.documentElement.dataset.motion)).toBe('off');
    await pickDial(page, 'Motion', 'Full');
    await page.reload();
    expect(await page.evaluate(() => document.documentElement.dataset.motion)).toBe('full');
  });
});
