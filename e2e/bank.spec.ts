import { test, expect } from '@playwright/test';

test('bank: filters narrow the list; a chosen subset is re-tested exactly', async ({ page }) => {
  await page.goto('/laws2400/questions/');
  const list = page.locator('.bank__list');
  await expect(list).toBeVisible();
  const all = Number(await list.getAttribute('data-count'));
  expect(all).toBeGreaterThan(500);
  await page.locator('.bank__field select').first().selectOption({ index: 2 }); // week 2
  const wk = Number(await list.getAttribute('data-count'));
  expect(wk).toBeLessThan(all);
  await page.getByRole('button', { name: 'True/false' }).click();
  await page.getByRole('button', { name: '1', exact: true }).click();
  const narrowed = Number(await list.getAttribute('data-count'));
  expect(narrowed).toBeLessThanOrEqual(wk);
  await page.getByRole('button', { name: 'True/false' }).click();
  await page.getByRole('button', { name: '1', exact: true }).click();
  // Pick three and re-test them.
  const boxes = page.locator('.bank__row input');
  for (let k = 0; k < 3; k++) await boxes.nth(k).check();
  await page.getByRole('button', { name: /Re-test 3 questions/ }).click();
  await expect(page).toHaveURL(/mode=set/);
  await expect(page.locator('.quiz-modes__filter')).toContainText('Re-testing 3 chosen questions');
  await expect(page.locator('.quiz__count')).toHaveText('Question 1 of 3');
});
