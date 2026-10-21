import { test, expect } from '@playwright/test';

test('short answer: submit needs text + confidence; ticking criteria updates the score live; rows highlight model sentences', async ({ page }) => {
  await page.goto('/laws2400/quiz/?type=short');
  const card = page.locator('.qcard.sa');
  await expect(card).toBeVisible();
  const submit = page.getByRole('button', { name: 'Compare with the model' });
  await expect(submit).toBeDisabled();
  await page.locator('.sa__editor').fill('The risk must be foreseeable and not insignificant, then weigh the s 5B(2) factors.');
  await expect(submit).toBeDisabled();
  await page.getByRole('radio', { name: /Unsure/ }).click();
  await page.locator('.sa__editor').press('ControlOrMeta+Enter');

  await expect(page.locator('.sa__model')).toBeVisible();
  const score = page.locator('.rubric [data-score]');
  await expect(score).toHaveText('0');
  const rows = page.locator('.rubric__row');
  const n = await rows.count();
  expect(n).toBeGreaterThan(0);
  const marks = await page.locator('.rubric__marks').allTextContents();
  await rows.nth(0).locator('.rubric__tick').check();
  await expect(score).toHaveText(String(Number(marks[0])));
  if (n > 1) {
    await rows.nth(1).locator('.rubric__tick').check();
    await expect(score).toHaveText(String(Number(marks[0]) + Number(marks[1])));
    await rows.nth(1).locator('.rubric__tick').uncheck();
    await expect(score).toHaveText(String(Number(marks[0])));
  }

  // Opening a criterion reveals top band + margin note and highlights at least one model sentence somewhere in the rubric.
  let highlightedAny = false;
  for (let k = 0; k < n; k++) {
    await rows.nth(k).locator('.rubric__crit').click();
    await expect(rows.nth(k).locator('.rubric__detail')).toBeVisible();
    await expect(rows.nth(k).locator('.margin-note')).toBeVisible();
    if (await page.locator('.sa__sent[data-hl]').count()) highlightedAny = true;
  }
  expect(highlightedAny).toBe(true);

  await page.getByRole('button', { name: 'Save my mark' }).click();
  await expect(page.locator('.sa__saved')).toContainText('Saved');
});
