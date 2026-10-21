import { test, expect } from '@playwright/test';

test('? opens the cheat-sheet, Esc closes it; footer link opens it too', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.keyboard.press('?');
  const sheet = page.locator('dialog.modal', { hasText: 'Keyboard shortcuts' });
  await expect(sheet).toBeVisible();
  await expect(sheet).toContainText('Command palette');
  await page.keyboard.press('Escape');
  await expect(sheet).toBeHidden();
  await page.locator('.shortcut-link').click();
  await expect(sheet).toBeVisible();
});

test('backlinks list where a case is referenced', async ({ page }) => {
  await page.goto('/cases/donoghue-v-stevenson/');
  const bl = page.locator('.backlinks');
  await expect(bl.getByRole('heading', { name: 'Referenced in' })).toBeVisible();
  expect(await bl.locator('li').count()).toBeGreaterThan(0);
});
