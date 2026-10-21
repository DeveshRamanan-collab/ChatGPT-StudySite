import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { builtRoutes } from './routes';

// A week page that has a pretest (the gate markup is in its HTML).
const weekWithPretest = builtRoutes().filter((r) => /\/week\/\d+\/$/.test(r)).find((r) => readFileSync(`dist${r}index.html`, 'utf8').includes('studysite:pretest:'))!;

const pretestSetting = (page: import('@playwright/test').Page) =>
  page.evaluate(() => new Promise<unknown[]>((resolve) => {
    const open = indexedDB.open('studysite');
    open.onsuccess = () => {
      const req = open.result.transaction('settings').objectStore('settings').getAll();
      req.onsuccess = () => resolve(req.result.filter((r: { key: string }) => r.key.startsWith('pretest:')));
    };
  }));

test('first visit: pretest questions come before the notes; completing reveals them; second visit goes straight in', async ({ page }) => {
  expect(weekWithPretest).toBeTruthy();
  await page.goto(weekWithPretest);
  await expect(page.locator('#notes')).toBeHidden();
  const gate = page.locator('.pretest');
  await expect(gate).toBeVisible();
  await expect(page.locator('.quiz__count')).toBeVisible(); // bank loaded
  const n = Number(await gate.getAttribute('data-pretest-count'));
  expect(n).toBeGreaterThan(0);
  expect(n).toBeLessThanOrEqual(5);
  for (let k = 0; k < n; k++) {
    await expect(page.locator('.quiz__count')).toHaveText(`Pretest ${k + 1} of ${n}`);
    await page.keyboard.press('g');
    await page.keyboard.press('1');
    await page.getByRole('button', { name: /^Next/ }).click();
  }
  await page.getByRole('button', { name: 'Read the notes' }).click();
  await expect(page.locator('#notes')).toBeVisible();
  await expect.poll(async () => JSON.stringify(await pretestSetting(page))).toContain('"status":"done"');
  await page.reload();
  await expect(page.locator('#notes')).toBeVisible();
  await expect(page.locator('.pretest')).toHaveCount(0);
});

test('skip reveals the notes and is logged', async ({ page }) => {
  await page.goto(weekWithPretest);
  await page.getByRole('button', { name: 'Skip to the notes' }).click();
  await expect(page.locator('#notes')).toBeVisible();
  await expect.poll(async () => JSON.stringify(await pretestSetting(page))).toContain('"status":"skipped"');
});
