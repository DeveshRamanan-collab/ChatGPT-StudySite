import { test, expect } from '@playwright/test';
import { setLevel } from './helpers';

test('case mention shows a brief popover on hover and focus, click opens the case', async ({ page, isMobile }) => {
  await setLevel(page, 'off');
  await page.addInitScript(() => localStorage.setItem('studysite:pretest:laws2400-w05', 'skip'));
  await page.goto('/laws2400/week/5/');
  const m = page.locator('a.mention[data-case]:visible').first();
  await m.scrollIntoViewIfNeeded();
  const pop = page.locator('.mention-pop');
  if (!isMobile) {
    await m.hover();
    await expect(pop).toHaveAttribute('data-open', 'true');
    await expect(pop.locator('.mention-pop__title')).not.toBeEmpty();
    await page.mouse.move(0, 0);
    await expect(pop).toHaveAttribute('data-open', 'false');
  }
  await m.focus();
  await expect(pop).toHaveAttribute('data-open', 'true');
  const slug = await m.getAttribute('data-case');
  await m.click();
  await expect(page).toHaveURL(new RegExp(`/cases/${slug}`));
});

test('case card switches density in place and copies AGLC4', async ({ page, context, isMobile }) => {
  if (!isMobile) await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/cases/donoghue-v-stevenson/');
  await expect(page.locator('dt', { hasText: 'Facts' })).toBeVisible();
  await page.locator('[data-density-picker] label', { hasText: 'Brief' }).click();
  await expect(page.locator('dt', { hasText: 'Facts' })).toBeHidden();
  await expect(page.locator('dt', { hasText: 'Ratio' })).toBeVisible();
  await page.locator('[data-density-picker] label', { hasText: 'One line' }).click();
  await expect(page.locator('.case-line')).toBeVisible();
  await page.reload();
  await expect(page.locator('.case-line')).toBeVisible();
  if (!isMobile) {
    await page.locator('[data-copy-aglc]').click();
    await expect(page.locator('[data-copy-aglc]')).toHaveText('Copied');
    expect(await page.evaluate(() => navigator.clipboard.readText())).toContain('Donoghue v Stevenson');
  }
});
