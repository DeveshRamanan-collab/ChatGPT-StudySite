import { test, expect } from '@playwright/test';
import { passPretest, setLevel } from './helpers';

test('concept card expands in place (Flip + clip-path) and every action routes correctly', async ({ page }) => {
  await page.goto('/laws2400/week/5/');
  await passPretest(page);
  const card = page.locator('[data-concept-card]').first();
  const id = await card.getAttribute('data-concept');
  const toggle = card.locator('.concept-card__toggle');
  await expect(card.locator('.concept-card__body')).toBeHidden();
  const next = page.locator('[data-concept-card]').nth(1);
  const before = (await next.boundingBox())!.y;
  const sawFlip = page.evaluate(() => new Promise<boolean>((resolve) => {
    const t0 = performance.now();
    const loop = () => {
      const moving = [...document.querySelectorAll<HTMLElement>('[data-concept-card]')].some((c) => /matrix|translate/.test(c.style.transform));
      if (moving) return resolve(true);
      if (performance.now() - t0 > 1500) return resolve(false);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }));
  await toggle.click();
  expect(await sawFlip).toBe(true);
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(card.locator('.concept-card__body')).toBeVisible();
  await expect.poll(async () => (await next.boundingBox())!.y).toBeGreaterThan(before + 20);

  const href = (a: string) => card.locator(`[data-action="${a}"]`).getAttribute('href');
  expect(await href('quiz')).toBe(`/laws2400/quiz?concept=${id}`);
  expect(await href('cards')).toBe(`/laws2400/cards?concept=${id}`);
  expect(await href('simulate')).toMatch(new RegExp(`/laws2400/concept/${id!.replace('laws2400-', '')}#explainer$`));
  expect(await href('explain')).toMatch(/\?explain=1$/);
  const later = card.locator('[data-action="later"]');
  await later.click();
  await expect(later).toHaveAttribute('aria-pressed', 'true');
  await page.reload();
  await card.locator('.concept-card__toggle').click();
  await expect(card.locator('[data-action="later"]')).toHaveAttribute('aria-pressed', 'true');

  await card.locator('[data-action="quiz"]').click();
  await expect(page).toHaveURL(new RegExp(`/laws2400/quiz\\?concept=${id}`));
  await expect(page.locator('.quiz-modes__filter')).toBeVisible();
});

test('off: expands instantly, no Flip transforms', async ({ page }) => {
  await setLevel(page, 'off');
  await page.goto('/laws2400/week/5/');
  await passPretest(page);
  const card = page.locator('[data-concept-card]').first();
  await card.locator('.concept-card__toggle').click();
  await expect(card.locator('.concept-card__body')).toBeVisible();
  const transforms = await page.locator('[data-concept-card]').evaluateAll((els) => els.map((e) => (e as HTMLElement).style.transform).filter(Boolean));
  expect(transforms).toEqual([]);
});
