import { test, expect } from '@playwright/test';

test('plan lists if-then blocks and exports .ics', async ({ page, isMobile }) => {
  await page.goto('/plan');
  await expect(page.locator('.plan-block').first()).toContainText(/^\d\d:\d\d(When|If)/);
  if (isMobile) return;
  const dl = page.waitForEvent('download');
  await page.getByRole('button', { name: /Export to calendar/ }).click();
  const f = await dl;
  expect(f.suggestedFilename()).toBe('studysite-plan.ics');
});
