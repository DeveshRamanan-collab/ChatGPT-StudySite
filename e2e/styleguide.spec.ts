import { test, expect } from '@playwright/test';
import { setLevel, scrollThrough, layoutProblems, type Level } from './helpers';

for (const level of ['full', 'calm', 'off'] as Level[]) {
  test(`styleguide in ${level}: every state visible, no overlap`, async ({ page }, info) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    await setLevel(page, level);
    await page.goto('/styleguide/');
    await scrollThrough(page);
    expect(await page.evaluate(() => document.documentElement.dataset.motion)).toBe(level);
    await expect(page.locator('.tabs [role="tablist"]')).toBeVisible(); // island hydrated
    // Every documented state is present.
    for (const s of ['.btn--primary.is-hover', '.btn--primary:disabled', '.btn--ghost.is-focus', '.chip[aria-pressed="true"]', '.card.is-hover', '.option[data-state="correct"]', '.option[data-state="incorrect"]', '.ring--criterion', '.timer-arc', '.stamp'])
      expect(await page.locator(s).count(), s).toBeGreaterThan(0);
    expect(await layoutProblems(page)).toEqual([]);
    await page.screenshot({ path: `reports/screens/2.3-${info.project.name}-${level}-styleguide.png`, fullPage: true });
    expect(errors).toEqual([]);
  });
}

test('interactive components: tabs keyboard, popover, modal, toast', async ({ page }) => {
  await page.goto('/styleguide/');
  await scrollThrough(page);
  const tabs = page.getByRole('tab');
  await tabs.first().focus();
  await page.keyboard.press('ArrowRight');
  await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('End'); // skips the disabled tab
  await expect(tabs.nth(2)).toHaveAttribute('aria-selected', 'true');

  const trigger = page.locator('button.chip--case');
  await trigger.click();
  await expect(page.locator('.popover[data-open="true"]')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.popover[data-open="true"]')).toHaveCount(0);
  await expect(trigger).toBeFocused();

  await page.getByRole('button', { name: 'Open modal' }).click();
  await expect(page.locator('dialog.modal[open]')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('dialog.modal[open]')).toHaveCount(0);

  await page.getByRole('button', { name: 'Show toast' }).click();
  await expect(page.locator('.toaster .toast')).toContainText('Saved');
});
