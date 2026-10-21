import { test, expect } from '@playwright/test';

test('text size, line width and contrast apply live and survive a reload (set before paint)', async ({ page }) => {
  await page.goto('/settings/');
  const body = () => page.evaluate(() => parseFloat(getComputedStyle(document.body).fontSize));
  const before = await body();
  await page.getByRole('radio', { name: 'Larger' }).check();
  await expect.poll(body).toBeGreaterThan(before + 1);
  await page.getByRole('radio', { name: 'Narrow' }).check();
  await page.getByRole('radio', { name: 'Higher' }).check();
  await page.reload();
  const attrs = await page.evaluate(() => ({ ...document.documentElement.dataset }));
  expect(attrs.text).toBe('lg');
  expect(attrs.measure).toBe('narrow');
  expect(attrs.contrast).toBe('high');
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--measure').trim())).toBe('58ch');
});

test('low stimulation switches motion, glass and glow off, then restores them', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('studysite:motion', 'full'));
  await page.goto('/settings/');
  await page.getByRole('radiogroup', { name: 'Low stimulation' }).getByRole('radio', { name: 'On' }).check();
  const html = page.locator('html');
  await expect(html).toHaveAttribute('data-lowstim', 'on');
  await expect(html).toHaveAttribute('data-motion', 'off');
  await expect(html).toHaveAttribute('data-glass', 'off');
  await page.getByRole('radiogroup', { name: 'Low stimulation' }).getByRole('radio', { name: 'Off' }).check();
  await expect(html).toHaveAttribute('data-lowstim', 'off');
  await expect(html).toHaveAttribute('data-motion', 'full');
  await expect(html).toHaveAttribute('data-glass', 'on');
});
