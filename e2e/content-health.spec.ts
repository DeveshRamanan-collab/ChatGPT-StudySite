import { test, expect } from '@playwright/test';
import { layoutProblems } from './helpers';

test('content health: coverage table, verify list, coverage map per unit', async ({ page }) => {
  await page.goto('/content-health/');
  await expect(page.getByRole('heading', { name: 'Coverage by unit' })).toBeVisible();
  await expect(page.locator('.health-table').first().locator('tbody tr')).toHaveCount(4);
  await expect(page.getByRole('heading', { name: 'Still to verify' })).toBeVisible();
  await page.locator('.health-unit summary').first().click();
  await expect(page.locator('.health-unit[open] tbody tr').first()).toBeVisible();
  expect(await layoutProblems(page)).toEqual([]);
});
