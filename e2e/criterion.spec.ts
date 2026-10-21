import { test, expect } from '@playwright/test';

const putCriterion = (page: import('@playwright/test').Page, row: object) =>
  page.evaluate((r) => new Promise<void>((resolve, reject) => {
    const open = indexedDB.open('studysite');
    open.onsuccess = () => {
      const tx = open.result.transaction('criterion', 'readwrite');
      tx.objectStore('criterion').put(r);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    };
  }), row);

test('ring follows the criterion state: learning → learned → secured', async ({ page }) => {
  // Answer one question correctly: the concept enters "learning" (stage 1).
  await page.goto('/laws2400/quiz/');
  const card = page.locator('.qcard');
  await expect(card).toBeVisible();
  const { concept, idx } = await page.evaluate(async () => {
    const el = document.querySelector<HTMLElement>('.qcard[data-question]')!;
    const bank = await (await fetch('/data/laws2400/questions.json')).json();
    const q = bank.questions.find((x: { id: string }) => x.id === el.dataset.question);
    const texts = [...el.querySelectorAll('.option span:not(.option__key):not(.visually-hidden)')].map((e) => e.textContent);
    const opts = q.type === 'mcq' ? q.options : [{ text: 'True', correct: q.answer }, { text: 'False', correct: !q.answer }];
    return { concept: q.concept as string, idx: texts.findIndex((t) => opts.find((o: { text: string; correct: boolean }) => o.text === t)?.correct) };
  });
  await page.keyboard.press('s');
  await page.keyboard.press(String(idx + 1));
  await expect(card.locator('.criterion-ring')).toHaveAttribute('data-stage', '1');

  const slug = concept.replace('laws2400-', '');
  await putCriterion(page, { conceptId: concept, correctInSession: 3, sessionId: 'x', learnedAt: Date.now(), relearnSessions: [Date.now()] });
  await page.goto(`/laws2400/concept/${slug}/`);
  const ring = page.locator('.title-row .criterion-ring');
  await expect(ring).toHaveAttribute('data-stage', '2');
  await expect(ring.locator('svg')).toHaveAttribute('aria-label', /learned, 1 of 3 spaced relearns/);

  await putCriterion(page, { conceptId: concept, correctInSession: 3, sessionId: 'x', learnedAt: 1, relearnSessions: [2, 3, 4], securedAt: 5 });
  await page.reload();
  await expect(ring).toHaveAttribute('data-stage', '4');
  await expect(ring.locator('.ring__fill--done')).toHaveCount(4);
});
