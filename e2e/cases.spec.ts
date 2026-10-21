import { test, expect } from '@playwright/test';
import { layoutProblems, setLevel } from './helpers';

test('case explorer: timeline lanes, filters, choosing a case shows its concepts and companions', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await setLevel(page, 'off');
  await page.goto('/cases/');
  await expect(page.locator('.case-explorer__dot').first()).toBeVisible();
  const total = await page.locator('.case-explorer__list li').count();
  expect(total).toBeGreaterThan(50);
  await page.getByRole('button', { name: 'Donoghue v Stevenson' }).first().click();
  const detail = page.locator('.case-explorer__detail');
  await expect(detail).toContainText('[1932] AC 562');
  await expect(detail.getByRole('heading', { name: 'Used in' })).toBeVisible();
  await expect(page.locator('.case-explorer__dot[data-state="sel"]')).toHaveCount(1);
  // Unit filter narrows the list; search narrows further.
  await page.getByRole('button', { name: 'LAWS2000' }).click();
  const pil = await page.locator('.case-explorer__list li').count();
  expect(pil).toBeLessThan(total);
  await page.getByLabel('Search cases').fill('Corfu');
  await expect(page.locator('.case-explorer__list li')).toHaveCount(1);
  expect(await layoutProblems(page)).toEqual([]);
  expect(errors).toEqual([]);
});

test('case page breadcrumb links back to the explorer', async ({ page }) => {
  await page.goto('/cases/donoghue-v-stevenson/');
  await page.locator('nav').getByRole('link', { name: 'Cases' }).first().click();
  await expect(page).toHaveURL(/\/cases\/?$/);
});
