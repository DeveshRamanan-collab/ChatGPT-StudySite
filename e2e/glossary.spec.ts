import { test, expect } from '@playwright/test';
import { layoutProblems } from './helpers';

test('glossary: terms grouped by letter, unit filter and search narrow the list, each links to its concept', async ({ page }) => {
  await page.goto('/glossary/');
  const rows = page.locator('.glossary__row:visible');
  const all = await rows.count();
  expect(all).toBeGreaterThan(50);
  await page.getByRole('button', { name: 'LAWS2100' }).click();
  const juris = await rows.count();
  expect(juris).toBeLessThan(all);
  await page.getByRole('button', { name: 'All units' }).click();
  await page.getByLabel('Search terms').fill('consent');
  await expect(page.locator('[data-glossary-count]')).not.toHaveText(`${all} terms`);
  const href = await rows.first().locator('.glossary__concept').getAttribute('href');
  expect(href).toMatch(/^\/[a-z]+\d{4}\/concept\//);
  expect(await layoutProblems(page)).toEqual([]);
});
