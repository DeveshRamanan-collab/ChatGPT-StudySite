import { test, expect, type Page } from '@playwright/test';
import { setLevel } from './helpers';

const shot = (page: Page, name: string, project: string) => page.screenshot({ path: `reports/review/4.8-${project}-${name}.png`, fullPage: true });
const bank = (page: Page) => page.evaluate(async () => (await fetch('/data/laws2400/questions.json')).json());

test('mode bar: every mode renders and is addressable', async ({ page }, info) => {
  for (const [mode, sel] of [['mixed', '.qcard'], ['week', '.quiz-modes__weeks'], ['weakest', '.qcard'], ['quickfire', '.qf'], ['match', '.match'], ['exam', '.exam'], ['short', '.sa']] as const) {
    await page.goto(`/laws2400/quiz/?mode=${mode}`);
    await expect(page.locator(sel).first()).toBeVisible();
    await expect(page.locator('.quiz-modes__bar .chip[aria-pressed="true"]')).toHaveCount(1);
    await shot(page, mode, info.project.name);
  }
});

test('by week: only that week’s questions', async ({ page }) => {
  await page.goto('/laws2400/quiz/?mode=week');
  const chip = page.locator('.quiz-modes__weeks .chip').first();
  await chip.click();
  await expect(page.locator('.qcard')).toBeVisible();
  const { id, weekId } = await page.evaluate(async () => {
    const id = document.querySelector<HTMLElement>('.qcard[data-question]')!.dataset.question!;
    return { id, weekId: new URL(location.href).searchParams.get('week') };
  });
  expect(id.startsWith(weekId!) || id.includes(weekId!)).toBe(true);
});

test('quick-fire: 60s true/false with keyboard, flash feedback, recap', async ({ page }) => {
  await setLevel(page, 'off'); // no animation loops while stepping the mocked clock
  await page.clock.install();
  await page.goto('/laws2400/quiz/?mode=quickfire');
  await page.getByRole('button', { name: 'Start' }).click();
  await expect(page.locator('.qf__statement')).toBeVisible(); // running state committed
  await page.keyboard.press('t');
  await expect(page.locator('.qf[data-flash]')).toHaveCount(1);
  await page.clock.runFor(400);
  await page.keyboard.press('f');
  await page.clock.runFor(400);
  await expect(page.locator('.quiz__count')).toHaveText('2 answered');
  await page.clock.runFor(61_000);
  await expect(page.locator('[data-qf-result]')).toHaveText(/of 2 in sixty seconds/);
});

test('match: correct pairs lock, wrong ones flash, no points', async ({ page }) => {
  await page.goto('/laws2400/quiz/?mode=match');
  const b = await bank(page);
  const lefts = page.locator('.match__col').first().locator('.match__item');
  const n = await lefts.count();
  expect(n).toBeGreaterThanOrEqual(3);
  // Resolve the correct right-hand item for the first left item from the bank.
  const leftText = (await lefts.first().textContent())!.trim();
  const pair = b.cases.find((c: { name: string }) => c.name === leftText);
  await lefts.first().click();
  const rightItems = page.locator('.match__item--right');
  const texts = (await rightItems.allTextContents()).map((t) => t.trim());
  const good = texts.findIndex((t) => pair ? pair.ratio.startsWith(t.replace(/…$/, '')) : false);
  const bad = good === 0 ? 1 : 0;
  await rightItems.nth(bad).click();
  await expect(lefts.first()).not.toHaveAttribute('data-state', 'correct');
  await lefts.first().click();
  await rightItems.nth(good).click();
  await expect(lefts.first()).toHaveAttribute('data-state', 'correct');
  await expect(page.locator('[data-match-count]')).toHaveText(`1 of ${n} matched`);
  await expect(page.locator('.match')).not.toContainText(/points|score/i);
});

test('exam sim: no feedback while sitting; CBM debrief matches the rules', async ({ page }, info) => {
  await page.goto('/laws2400/quiz/?mode=exam');
  await page.getByRole('button', { name: 'Begin the paper' }).click();
  expect(await page.evaluate(() => document.documentElement.dataset.exam)).toBe('1');
  const items = page.locator('.exam__paper .exam__item');
  const b = await bank(page);
  let expected = 0;
  for (let k = 0; k < 4; k++) {
    const item = items.nth(k);
    const id = await item.getAttribute('data-question');
    const q = b.questions.find((x: { id: string }) => x.id === id);
    const opts = q.type === 'mcq' ? q.options : [{ correct: q.answer }, { correct: !q.answer }];
    const right = opts.findIndex((o: { correct: boolean }) => o.correct);
    const choice = k % 2 === 0 ? right : (right + 1) % opts.length;
    const certainty = (k % 3) + 1;
    await item.getByRole('radio', { name: `C${certainty}` }).click();
    await item.locator('.option').nth(choice).click();
    await expect(item.locator('.option[data-state="correct"], .option[data-state="incorrect"]')).toHaveCount(0);
    expected += choice === right ? certainty : [0, 0, -2, -6][certainty];
  }
  await page.getByRole('button', { name: 'Finish the paper' }).click();
  await expect(page.locator('[data-cbm]')).toHaveText(String(expected));
  await shot(page, 'exam-debrief', info.project.name);
});

test('session recap after a round: rings, most improved', async ({ page }, info) => {
  await page.goto('/laws2400/quiz/?mode=mixed');
  for (let k = 0; k < 10; k++) {
    await expect(page.locator('.quiz__count')).toHaveText(`Question ${k + 1} of 10`);
    await page.keyboard.press('g');
    await page.keyboard.press('1');
    await expect(page.getByRole('button', { name: /^Next/ })).toBeVisible();
    await page.keyboard.press('Enter'); // keyboard path: no waiting on a magnetic button to settle
  }
  await expect(page.locator('.recap')).toBeVisible();
  await expect(page.locator('.recap [data-most-improved]')).toBeVisible();
  await expect(page.locator('.recap .recap__concepts li').first()).toBeVisible();
  await shot(page, 'recap', info.project.name);
});
