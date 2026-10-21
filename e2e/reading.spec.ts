import { test, expect, type Page } from '@playwright/test';
import { passPretest, setLevel } from './helpers';

const WEEK = '/laws2400/week/1/';

// Writes a setting once the app has created its database (retries until the store exists).
const putSetting = (page: Page, key: string, value: unknown) =>
  page.evaluate(([k, v]) => new Promise<void>((resolve) => {
    const attempt = () => {
      const open = indexedDB.open('studysite');
      open.onsuccess = () => {
        const db = open.result;
        if (!db.objectStoreNames.contains('settings')) { db.close(); setTimeout(attempt, 150); return; }
        const tx = db.transaction('settings', 'readwrite');
        tx.objectStore('settings').put({ key: k, value: v });
        tx.oncomplete = () => { db.close(); resolve(); };
      };
    };
    attempt();
  }), [key, value] as const);

test('retrieval nudge appears after 3 minutes of reading, not before', async ({ page }) => {
  test.setTimeout(90_000);
  await setLevel(page, 'off'); // no smooth-scroll animation loop, so stepping the mocked clock through 3 minutes is fast
  await page.clock.install();
  await page.goto(WEEK);
  await passPretest(page);
  await expect(page.locator('#notes')).toBeVisible();
  await page.waitForFunction(() => !!document.querySelector('astro-island[component-url*="ReadingAids"]:not([ssr])'));
  await page.clock.runFor(178_000); // every timer fires in order, as in real time
  await expect(page.locator('.toaster .toast')).toHaveCount(0);
  await page.clock.runFor(4_000);
  await expect(page.locator('.toaster .toast')).toContainText('Three minutes in');
  await expect(page.locator('.toaster .toast a')).toHaveAttribute('href', /mode=week&week=laws2400-w01/);
});

test('table of contents in the rail tracks sections; a popover on mobile', async ({ page }, info) => {
  await page.goto(WEEK);
  await passPretest(page);
  const items = page.locator('.toc__item');
  if (info.project.name === 'mobile') {
    await expect(page.locator('.rail__body')).toBeHidden();
    return;
  }
  await expect(items.first()).toBeVisible();
  expect(await items.count()).toBeGreaterThan(1);
  // Entries never overlap: a plain vertical list.
  const boxes = await items.evaluateAll((els) => els.map((e) => e.getBoundingClientRect()).map((r) => [r.top, r.bottom]));
  for (let i = 1; i < boxes.length; i++) expect(boxes[i][0]).toBeGreaterThanOrEqual(boxes[i - 1][1] - 1);
  await items.last().locator('a').click();
  await expect(items.last()).toHaveAttribute('data-active', '');
});

test('delayed judgement of learning on a later visit, stored', async ({ page }) => {
  await page.goto(WEEK);
  await passPretest(page);
  await expect(page.locator('.jol')).toHaveCount(0);
  await putSetting(page, 'read:laws2400-w01', Date.now() - 2 * 3_600_000);
  await page.reload();
  const jol = page.locator('.jol');
  await expect(jol).toBeVisible();
  await jol.getByRole('button', { name: 'Partly' }).click();
  await expect(jol).toHaveAttribute('data-answered', 'partly');
  // Feedback is immediate; the answer is written to IndexedDB just after. Reload once it is stored.
  await expect.poll(() => page.evaluate(() => new Promise((res) => { const r = indexedDB.open('studysite'); r.onsuccess = () => { const g = r.result.transaction('settings').objectStore('settings').get('jol:laws2400-w01'); g.onsuccess = () => { res(Array.isArray(g.result?.value) ? g.result.value.length : 0); r.result.close(); }; g.onerror = () => res(0); }; r.onerror = () => res(0); }))).toBeGreaterThan(0);
  await page.reload();
  await expect(page.locator('.jol')).toHaveCount(0);
});
