import { test, expect } from '@playwright/test';
import { setLevel } from './helpers';

test('hub: pinned horizontal week timeline in full on desktop, stacked otherwise', async ({ page, isMobile }) => {
  await page.goto('/laws2400/');
  await page.waitForLoadState('networkidle');
  const pinned = await page.evaluate(() => (window as any).ScrollTrigger?.getAll?.().some((t: any) => t.pin) ?? document.querySelector('.pin-spacer') !== null);
  const spacer = await page.locator('.pin-spacer').count();
  if (isMobile) expect(spacer).toBe(0); else expect(spacer).toBeGreaterThan(0);
  expect(pinned || isMobile).toBeTruthy();
  await expect(page.locator('.hub-exam [data-countdown]')).toContainText(/days|Today/);
});

test('hub: calm has no pin; map nodes link to concepts; panel shows due and start', async ({ page }) => {
  await setLevel(page, 'calm');
  await page.goto('/laws2400/');
  await expect(page.locator('.pin-spacer')).toHaveCount(0);
  await expect(page.getByRole('button', { name: /Start a 25-minute block/ })).toBeVisible();
  await page.locator('.kmap').scrollIntoViewIfNeeded();
  const node = page.locator('.kmap__node').first();
  await expect(node).toBeVisible();
  const href = await node.getAttribute('href');
  expect(href).toMatch(/\/laws2400\/concept\//);
});

test('map: whole course with unit filter chips; a node opens its concept; Map is in the nav and palette', async ({ page, isMobile }) => {
  await setLevel(page, 'off');
  await page.goto('/map/');
  const nodes = page.locator('.kmap__node');
  await expect(nodes.first()).toBeVisible();
  const all = await nodes.count();
  expect(all).toBeGreaterThan(100);
  await expect(page.getByRole('button', { name: 'All units' })).toHaveAttribute('aria-pressed', 'true');
  // A unit with no concepts yet has a disabled chip; units with content are enabled (derived from the overview).
  const ov: { code: string; weeks: { concepts: unknown[] }[] }[] = await (await page.request.get('/data/overview.json')).json();
  for (const u of ov) {
    const chip = page.getByRole('button', { name: u.code });
    if (u.weeks.some((w) => w.concepts.length)) await expect(chip).toBeEnabled(); else await expect(chip).toBeDisabled();
  }
  await page.getByRole('button', { name: 'LAWS2400' }).click();
  await expect(page.getByRole('button', { name: 'LAWS2400' })).toHaveAttribute('aria-pressed', 'true');
  await expect.poll(() => nodes.count()).toBeLessThan(all);
  const href = await nodes.first().getAttribute('href');
  expect(href).toMatch(/^\/laws2400\/concept\//);
  await nodes.first().focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/laws2400\/concept\//);
  if (!isMobile) {
    await expect(page.locator('.site-header nav[aria-label="Main"] a', { hasText: 'Map' })).toHaveAttribute('href', '/map');
    await page.waitForLoadState('networkidle');
    await page.keyboard.press('Control+k');
    await expect(page.locator('dialog.palette[open]')).toBeVisible();
    await page.locator('.palette__input').fill('>map');
    await expect(page.getByRole('option').first()).toContainText('Map');
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/map\/?$/);
  }
});
