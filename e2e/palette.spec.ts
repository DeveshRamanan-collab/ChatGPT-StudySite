import { test, expect } from '@playwright/test';

test.describe('command palette', () => {
  test('opens with Ctrl K, types, filters and navigates', async ({ page, isMobile }) => {
    test.skip(isMobile, 'keyboard shortcut is desktop');
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.keyboard.press('Control+k');
    const pal = page.locator('dialog.palette');
    await expect(pal).toBeVisible();
    const input = pal.locator('.palette__input');
    await expect(input).toBeFocused();
    await input.fill('case: donoghue');
    const first = pal.locator('.palette__item').first();
    await expect(first).toContainText(/Donoghue/i);
    await expect(pal.locator('.palette__meta').first()).toContainText('Case');
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/cases\//);
    await expect(pal).toBeHidden();
    // Recent shows it next time.
    await page.keyboard.press('Control+k');
    await expect(pal.locator('.palette__section').first()).toHaveText('Recent');
    await page.keyboard.press('Escape');
    await expect(pal).toBeHidden();
    expect(errors).toEqual([]);
  });

  test('week filter, commands and search button', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.locator('[data-palette-open]').click();
    const pal = page.locator('dialog.palette');
    const input = pal.locator('.palette__input');
    await input.fill('week:2 ');
    await expect(pal.locator('.palette__item').first()).toBeVisible();
    await input.fill('>motion calm');
    await expect(pal.locator('.palette__item').first()).toContainText('Motion calm');
    await input.press('Enter');
    await expect(page.locator('html')).toHaveAttribute('data-motion', 'calm');
    await page.locator('[data-palette-open]').click();
    await input.fill('>start quiz laws2400');
    await input.press('Enter');
    await expect(page).toHaveURL(/\/laws2400\/quiz/);
  });
});
