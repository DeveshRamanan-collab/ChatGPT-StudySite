import { test, expect } from '@playwright/test';

test('dashboard shows counts, readiness, calibration and a table view', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/dashboard');
  await expect(page.locator('.dash-stat').first()).toContainText('of the last 14');
  await expect(page.locator('.dash-days li')).toHaveCount(14);
  await expect(page.locator('.dash-unit').first()).toBeVisible();
  await expect(page.locator('.dash-cal li')).toHaveCount(3);
  await page.getByRole('button', { name: /numbers as a table/ }).click();
  await expect(page.locator('.dash-table tbody tr')).toHaveCount(14);
  expect(errors).toEqual([]);
});
