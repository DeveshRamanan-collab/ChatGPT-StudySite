import { test, expect } from '@playwright/test';
import { layoutProblems } from './helpers';

test('week sheet: concepts with one-liners, checklists and flows; linked from the week page', async ({ page }) => {
  await page.goto('/laws2400/week/5/');
  await page.getByRole('link', { name: 'One-page sheet' }).click();
  await expect(page).toHaveURL(/\/laws2400\/week\/5\/sheet\/?$/);
  await expect(page.locator('.sheet-concept')).not.toHaveCount(0);
  await expect(page.locator('.sheet-flow').first()).toBeVisible();
  await expect(page.getByRole('button', { name: 'Print or save as PDF' })).toBeVisible();
  expect(await layoutProblems(page)).toEqual([]);
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('.site-header')).toBeHidden();
});

test('unit overview: every week with its concepts, linking to the week sheets', async ({ page }) => {
  await page.goto('/laws2400/sheet/');
  const weeks = page.locator('.poster-week');
  expect(await weeks.count()).toBeGreaterThanOrEqual(10);
  await expect(weeks.first().locator('.poster-week__concepts li').first()).toBeVisible();
  expect(await layoutProblems(page)).toEqual([]);
});
