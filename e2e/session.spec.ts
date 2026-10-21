import { test, expect } from '@playwright/test';
import { setLevel } from './helpers';

test('session ritual starts a block: timer in the corner, chrome fades, if-then saved', async ({ page }) => {
  await setLevel(page, 'off');
  await page.goto('/');
  await page.getByRole('button', { name: 'Start a session' }).first().click();
  await page.locator('.ritual__opt', { hasText: 'LAWS2400' }).click();
  await page.fill('#ritual-if', 'When I open Torts, then I answer 10 questions');
  await page.locator('.ritual__opt', { hasText: '15 min' }).click();
  await page.getByRole('button', { name: 'Start the block' }).click();
  await expect(page).not.toHaveURL(/\/$/);
  const fb = page.locator('.focus-block');
  await expect(fb).toBeVisible();
  await expect(fb).toContainText('When I open Torts');
  await expect(page.locator('html')).toHaveAttribute('data-block', 'block');
  expect(await page.locator('.site-header .bar').evaluate((e) => getComputedStyle(e).opacity)).toBe('0.3');
  await page.goto('/');
  await expect(page.locator('.home-start__ifthen').first()).toContainText('When I open Torts');
  await fb.getByRole('button', { name: 'End' }).click();
  await expect(page.locator('dialog.modal', { hasText: 'Session summary' })).toBeVisible();
});

test('2-minute start asks "keep going?" once at 2:00', async ({ page }) => {
  await setLevel(page, 'off');
  await page.clock.install();
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.getByRole('button', { name: '2-minute start' }).click();
  await expect(page).toHaveURL(/quiz/);
  const fb = page.locator('.focus-block');
  await expect(fb).toBeVisible();
  await page.clock.fastForward(121_000);
  await expect(fb).toContainText('Keep going?');
  await fb.getByRole('button', { name: /Keep going/ }).click();
  await expect(fb).not.toContainText('Keep going?');
  await page.clock.fastForward(60_000);
  await expect(fb).not.toContainText('Keep going?');
});

test('Continue returns to the same question', async ({ page }) => {
  await setLevel(page, 'off');
  await page.goto('/laws2400/quiz');
  const card = page.locator('.qcard').first();
  await expect(card).toBeVisible();
  for (let n = 0; n < 2; n++) {
    await page.keyboard.press('s');
    await page.keyboard.press('1');
    await expect(page.locator('.explain')).toBeVisible();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(400);
  }
  const stem = (await page.locator('.qcard__stem').first().textContent())!.trim();
  await page.goto('/');
  await page.locator('[data-continue]').click();
  await expect(page).toHaveURL(/resume=1/);
  await expect(page.locator('.qcard__stem').first()).toHaveText(stem);
});

test('focus mode hides everything but the active card; Esc leaves', async ({ page }) => {
  await setLevel(page, 'off');
  await page.goto('/laws2400/quiz');
  await expect(page.locator('.qcard').first()).toBeVisible();
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => document.dispatchEvent(new CustomEvent('studysite:focus', { detail: { toggle: true } })));
  await expect(page.locator('html')).toHaveAttribute('data-focus', '');
  expect(await page.locator('.site-header .bar').evaluate((e) => getComputedStyle(e).opacity)).toBe('0');
  expect(await page.locator('[data-focus-keep]').evaluate((e) => getComputedStyle(e).opacity)).toBe('1');
  await page.keyboard.press('Escape');
  await expect(page.locator('html')).not.toHaveAttribute('data-focus', '');
});
