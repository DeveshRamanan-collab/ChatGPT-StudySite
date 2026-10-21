import { test, expect } from '@playwright/test';
import { setLevel } from './helpers';

test.use({ storageState: { cookies: [], origins: [] } });

test('intro plays once a day in full motion, any key skips to the unit cards', async ({ page }) => {
  await page.goto('/');
  const intro = page.locator('[data-intro]');
  await expect(intro).toBeVisible();
  await page.waitForLoadState('networkidle');
  await expect(page.locator('.intro-canvas')).toBeVisible();
  await page.keyboard.press('x');
  await expect(intro).toBeHidden();
  await expect(page.locator('.unit-card').first()).toBeInViewport();
  await page.reload();
  await expect(intro).toBeHidden();
});

test('intro never shows when motion is off', async ({ page }) => {
  await setLevel(page, 'off');
  await page.goto('/');
  await expect(page.locator('[data-intro]')).toBeHidden();
  await expect(page.locator('.unit-card').first()).toBeVisible();
});

test('scrolling to the end hands over to the real unit cards', async ({ page, isMobile }) => {
  test.skip(isMobile, 'desktop scrub');
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  const h = await page.locator('[data-intro]').evaluate((e) => (e as HTMLElement).offsetHeight);
  for (let y = 0; y <= h; y += h / 20) { await page.evaluate((v) => scrollTo(0, v), y); await page.waitForTimeout(40); }
  await expect(page.locator('[data-intro]')).toBeHidden();
  await expect(page.locator('.unit-card').first()).toBeInViewport();
});
