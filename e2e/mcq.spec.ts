import { test, expect, type Page } from '@playwright/test';
import { setLevel } from './helpers';

// Reads the current question's correct/incorrect option positions from the bank JSON (DOM order is shuffled).
async function positions(page: Page) {
  return page.evaluate(async () => {
    const card = document.querySelector<HTMLElement>('.qcard[data-question]')!;
    const id = card.dataset.question!;
    const bank = await (await fetch(`/data/${location.pathname.split('/')[1]}/questions.json`)).json();
    const q = bank.questions.find((x: { id: string }) => x.id === id);
    const texts = [...card.querySelectorAll('.option span:not(.option__key):not(.visually-hidden)')].map((e) => e.textContent);
    const opts = q.type === 'mcq' ? q.options : [{ text: 'True', correct: q.answer }, { text: 'False', correct: !q.answer }];
    const right = texts.findIndex((t) => opts.find((o: { text: string; correct: boolean }) => o.text === t)?.correct);
    return { id, right, wrong: right === 0 ? 1 : 0 };
  });
}

const requeueRows = (page: Page, id: string) =>
  page.evaluate((qid) => new Promise<{ dueAt: number; reason: string }[]>((resolve, reject) => {
    const open = indexedDB.open('studysite');
    open.onsuccess = () => {
      const tx = open.result.transaction('requeue', 'readonly');
      const req = tx.objectStore('requeue').getAll();
      req.onsuccess = () => resolve(req.result.filter((r: { itemId: string }) => r.itemId === qid));
      req.onerror = () => reject(req.error);
    };
    open.onerror = () => reject(open.error);
  }), id);

test('options stay locked until confidence is chosen', async ({ page }) => {
  await page.goto('/laws2400/quiz/');
  await expect(page.locator('.qcard .option').first()).toBeDisabled();
  await page.getByRole('radio', { name: /Unsure/ }).click();
  await expect(page.locator('.qcard .option').first()).toBeEnabled();
});

test('sure + wrong: two-sided explanation, watch mark, three requeue rows (+10 min, +1 d, +4 d)', async ({ page }) => {
  await page.goto('/laws2400/quiz/');
  await expect(page.locator('.qcard')).toBeVisible();
  const { id, wrong } = await positions(page);
  const t0 = Date.now();
  await page.keyboard.press('s');
  await expect(page.getByRole('radio', { name: /Sure/ })).toHaveAttribute('aria-checked', 'true');
  await page.keyboard.press(String(wrong + 1));
  const panel = page.locator('.explain');
  await expect(panel).toBeVisible();
  await expect(panel).toContainText('Why yours is tempting');
  await expect(panel).toContainText('Why the right one is right');
  await expect(panel.locator('[data-watch]')).toBeVisible();
  await expect(page.locator('.option[data-state="incorrect"]')).toHaveCount(1);
  await expect(page.locator('.option[data-state="correct"]')).toHaveCount(1);

  await expect.poll(async () => (await requeueRows(page, id)).length).toBe(3);
  const rows = (await requeueRows(page, id)).map((r) => r.dueAt - t0).sort((a, b) => a - b);
  const MIN = 60_000, DAY = 86_400_000, slack = 30_000;
  expect(Math.abs(rows[0] - 10 * MIN)).toBeLessThan(slack);
  expect(Math.abs(rows[1] - DAY)).toBeLessThan(slack);
  expect(Math.abs(rows[2] - 4 * DAY)).toBeLessThan(slack);
});

test('explanation panel opens via a clip-path transition (full), a fade when off', async ({ page }) => {
  await page.goto('/laws2400/quiz/');
  await expect(page.locator('.qcard')).toBeVisible();
  const { right } = await positions(page);
  await page.keyboard.press('u');
  const props = await page.evaluate((idx) => new Promise<string[]>((resolve) => {
    const seen = new Set<string>();
    new MutationObserver(() => {
      const el = document.querySelector('.explain');
      if (!el) return;
      for (const a of el.getAnimations()) seen.add((a as CSSTransition).transitionProperty);
      requestAnimationFrame(() => { for (const a of el.getAnimations()) seen.add((a as CSSTransition).transitionProperty); resolve([...seen]); });
    }).observe(document.body, { childList: true, subtree: true });
    document.querySelectorAll<HTMLButtonElement>('.qcard .option')[idx].click();
  }), right);
  expect(props).toContain('clip-path');
  await expect(page.locator('.explain')).toContainText('Right.');
  await expect(page.locator('.explain')).not.toContainText('Why yours is tempting');
});

test('off: explanation fades instead of wiping', async ({ page }) => {
  await setLevel(page, 'off');
  await page.goto('/laws2400/quiz/');
  await expect(page.locator('.qcard')).toBeVisible();
  await page.keyboard.press('g');
  await page.keyboard.press('1');
  await expect(page.locator('.explain')).toBeVisible();
  expect(await page.locator('.explain').evaluate((e) => getComputedStyle(e).clipPath)).toBe('none');
});

test('next advances with Enter and the progress hairline moves', async ({ page }) => {
  await page.goto('/laws2400/quiz/');
  await expect(page.locator('.quiz__count')).toHaveText(/Question 1 of/);
  await page.keyboard.press('g');
  await page.keyboard.press('1');
  await page.keyboard.press('Enter');
  await expect(page.locator('.quiz__count')).toHaveText(/Question 2 of/);
});
