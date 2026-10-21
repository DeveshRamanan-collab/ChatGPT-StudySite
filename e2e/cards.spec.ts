import { test, expect } from '@playwright/test';
import { setLevel } from './helpers';

test('daily card queue: show answer, grade, counts move, state persists', async ({ page }) => {
  await setLevel(page, 'off');
  await page.goto('/laws2400/cards/');
  const review = page.locator('.flash-review');
  await expect(review.locator('.flash')).toBeVisible();
  const counts = review.locator('.flash-counts');
  await expect(counts).toContainText('0 reviewed');
  await review.getByRole('button', { name: /Show answer/ }).click();
  await expect(review.locator('.flash')).toHaveAttribute('data-flipped', 'true');
  await expect(review.locator('.flash-grade').nth(2)).toContainText(/Good/);
  await page.keyboard.press('3');
  await expect(counts).toContainText('1 reviewed');
  await page.keyboard.press('Space');
  await page.keyboard.press('1');
  await expect(counts).toContainText('2 reviewed');
  const stored = await page.evaluate(() => new Promise<number>((res) => {
    const r = indexedDB.open('studysite');
    r.onsuccess = () => { const t = r.result.transaction('reviews').objectStore('reviews').count(); t.onsuccess = () => res(t.result); };
  }));
  expect(stored).toBe(2);
});

test('sentence-to-card: select words in a note and press C', async ({ page, isMobile }) => {
  test.skip(isMobile, 'keyboard capture is desktop');
  await setLevel(page, 'off');
  await page.addInitScript(() => localStorage.setItem('studysite:pretest:laws2400-w05', 'skip'));
  await page.goto('/laws2400/week/5/');
  await page.waitForLoadState('networkidle');
  const p = page.locator('.prose.notes > p').filter({ hasText: /\w+ \w+ \w+ \w+ \w+\./ }).first();
  await p.scrollIntoViewIfNeeded();
  await p.evaluate((el) => {
    const t = el.firstChild!;
    const words = t.textContent!.match(/\S+/g)!;
    const start = t.textContent!.indexOf(words[1]);
    const r = document.createRange();
    r.setStart(t, start); r.setEnd(t, start + words[1].length);
    getSelection()!.removeAllRanges(); getSelection()!.addRange(r);
  });
  await page.keyboard.press('c');
  await expect(page.locator('.toast').first()).toContainText('Card made');
  await page.goto('/laws2400/cards/');
  await expect(page.locator('.flash-review')).toBeVisible();
});

test('clearing the queue shows a quiet "queue cleared" stamp once', async ({ page }) => {
  await setLevel(page, 'off');
  await page.goto('/laws2400/cards/?concept=none');
  await expect(page.locator('.flash-cleared')).toBeVisible();
  await page.evaluate(() => document.dispatchEvent(new CustomEvent('studysite:milestone', { detail: { kind: 'queue-cleared' } })));
  await expect(page.locator('.milestone .stamp')).toContainText('Clear');
  await page.reload();
  await page.evaluate(() => document.dispatchEvent(new CustomEvent('studysite:milestone', { detail: { kind: 'queue-cleared' } })));
  await page.waitForTimeout(500);
  await expect(page.locator('.milestone')).toHaveCount(0);
});
