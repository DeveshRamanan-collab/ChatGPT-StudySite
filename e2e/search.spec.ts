import { test, expect } from '@playwright/test';

test('search finds grouped, highlighted results and navigates', async ({ page }) => {
  await page.goto('/search?q=negligence');
  const groups = page.locator('.search-group');
  await expect(groups.first()).toBeVisible();
  await expect(page.locator('.search-hit mark').first()).toBeVisible();
  await expect(page.locator('[data-search-status]')).toContainText('result');
  const first = page.locator('.search-hit').first();
  const href = await first.getAttribute('href');
  await first.click();
  await expect(page).toHaveURL(new RegExp(href!.replace(/\/$/, '')));
});

test('search reports no match plainly', async ({ page }) => {
  await page.goto('/search');
  await page.fill('#q', 'qwxzvjk');
  await expect(page.locator('[data-search-status]')).toContainText('Nothing matches');
});
