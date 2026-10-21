import { test, expect } from '@playwright/test';

test('tokens are wired: body 19px on #FBF7F0', async ({ page }) => {
  await page.goto('/');
  const s = await page.evaluate(() => {
    const cs = getComputedStyle(document.body);
    return { size: cs.fontSize, bg: cs.backgroundColor, paper: getComputedStyle(document.documentElement).getPropertyValue('--paper').trim() };
  });
  expect(s.size).toBe('19px');
  expect(s.bg).toBe('rgb(251, 247, 240)'); // #FBF7F0
  expect(s.paper.toUpperCase()).toBe('#FBF7F0');
});
