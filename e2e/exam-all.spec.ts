import { test, expect } from '@playwright/test';

test('all-units exam paper interleaves units', async ({ page }) => {
  await page.goto('/exam/');
  await expect(page.locator('[data-units]')).toHaveAttribute('data-units', /laws2400/);
  await expect(page.locator('[data-units]')).toHaveAttribute('data-units', /laws2000/);
  await page.getByRole('button', { name: 'Begin the paper' }).click();
  const ids = await page.locator('.exam__paper .exam__item').evaluateAll((els) => els.map((e) => (e as HTMLElement).dataset.question!));
  const units = ids.map((id) => id.split('-')[0]);
  expect(new Set(units).size).toBeGreaterThanOrEqual(2);
  const repeats = units.slice(1).filter((u, i) => u === units[i]).length;
  expect(repeats).toBe(0); // no two consecutive from the same unit when several have questions
});

test('home and dashboard link to the all-units paper', async ({ page }) => {
  for (const r of ['/', '/dashboard/']) {
    await page.goto(r);
    await expect(page.getByRole('link', { name: 'Exam paper across all units' })).toHaveAttribute('href', '/exam');
  }
});
