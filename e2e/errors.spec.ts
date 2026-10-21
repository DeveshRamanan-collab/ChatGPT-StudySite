import { test, expect } from '@playwright/test';
import { waitForAttempts } from './helpers';

test('wrong answers appear grouped by concept with both explanations; re-test in place', async ({ page }) => {
  await page.goto('/laws2400/errors/');
  await expect(page.locator('.errlog__count')).toContainText('Nothing here yet');

  // Answer one question wrongly while sure.
  await page.goto('/laws2400/quiz/');
  await expect(page.locator('.qcard')).toBeVisible();
  const wrongIdx = await page.evaluate(async () => {
    const el = document.querySelector<HTMLElement>('.qcard[data-question]')!;
    const bank = await (await fetch('/data/laws2400/questions.json')).json();
    const q = bank.questions.find((x: { id: string }) => x.id === el.dataset.question);
    const texts = [...el.querySelectorAll('.option span:not(.option__key):not(.visually-hidden)')].map((e) => e.textContent);
    const opts = q.type === 'mcq' ? q.options : [{ text: 'True', correct: q.answer }, { text: 'False', correct: !q.answer }];
    const right = texts.findIndex((t) => opts.find((o: { text: string; correct: boolean }) => o.text === t)?.correct);
    return right === 0 ? 1 : 0;
  });
  await page.keyboard.press('s');
  await page.keyboard.press(String(wrongIdx + 1));
  await expect(page.locator('.explain')).toBeVisible();
  await waitForAttempts(page, 1);

  await page.goto('/laws2400/errors/');
  await expect(page.locator('.errlog__group')).toHaveCount(1);
  const item = page.locator('.errlog__item').first();
  await expect(item).toHaveAttribute('data-watch', 'true');
  await expect(item).toContainText('You chose');
  await expect(item).toContainText('Right answer');
  await expect(page.locator('.errlog__count')).toContainText('1 to revisit');
  await expect(page.locator('.errlog__head a.btn')).toHaveAttribute('href', /\/laws2400\/quiz\?concept=/);

  await item.getByRole('button', { name: 'Re-test this one' }).click();
  await expect(item.locator('.qcard')).toBeVisible();
});
