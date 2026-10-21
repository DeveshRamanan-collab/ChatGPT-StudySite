import { test, expect } from '@playwright/test';
import { setLevel } from './helpers';

test('session ritual: energy sets a length, the plan fits it, the block carries the plan as a checklist', async ({ page }) => {
  await setLevel(page, 'off');
  await page.goto('/?session=1');
  const ritual = page.locator('form.ritual');
  await expect(ritual).toBeVisible();
  await ritual.getByRole('radio', { name: 'LAWS2400' }).check();
  await ritual.getByRole('radio', { name: 'Low' }).check();
  await expect(ritual.getByRole('radio', { name: '15 min' })).toBeChecked();
  const plan = page.locator('.ritual__plan-list li');
  await expect(plan.first()).toBeVisible();
  const mins = await page.locator('.ritual__plan-min').allTextContents();
  expect(mins.reduce((s, t) => s + parseInt(t, 10), 0)).toBeLessThanOrEqual(15);
  await expect(page.locator('.ritual__plan')).not.toContainText(/problem question/i);
  await ritual.getByRole('radio', { name: 'High' }).check();
  await expect(ritual.getByRole('radio', { name: '45 min deep dive' })).toBeChecked();
  await expect(page.locator('.ritual__plan')).toContainText(/problem question/i);
  await ritual.getByRole('button', { name: 'Start the block' }).click();
  await expect(page.locator('.focus-plan summary')).toContainText(/Plan · 0 of \d+ done/);
});
