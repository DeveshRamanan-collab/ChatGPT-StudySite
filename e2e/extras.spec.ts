import { test, expect } from '@playwright/test';
import { setLevel } from './helpers';

test.beforeEach(async ({ page }) => { await setLevel(page, 'off'); });

test('read aloud: button toggles and highlights the sentence being read', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('studysite:pretest:laws2400-w05', 'skip'));
  await page.goto('/cases/donoghue-v-stevenson/');
  const b = page.locator('[data-read-aloud]');
  await expect(b).toBeEnabled();
  await b.click();
  await expect(b).toHaveAttribute('aria-pressed', 'true');
  expect(await page.evaluate(() => (CSS as any).highlights?.has('reading') ?? true)).toBe(true);
  await b.click();
  await expect(b).toHaveAttribute('aria-pressed', 'false');
});

test('week page has the audio recap player', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('studysite:pretest:laws2400-w01', 'skip'));
  await page.goto('/laws2400/week/1/');
  const p = page.locator('.recap-player');
  await expect(p).toBeVisible();
  await p.locator('summary').click();
  await expect(p.locator('.prose p').first()).not.toBeEmpty();
});

test('annotations: highlight a phrase, it appears in Your notes and survives reload', async ({ page, isMobile }) => {
  test.skip(isMobile, 'selection toolbar is pointer-driven');
  await page.addInitScript(() => localStorage.setItem('studysite:pretest:laws2400-w05', 'skip'));
  await page.goto('/laws2400/week/5/');
  await page.waitForLoadState('networkidle');
  const para = page.locator('.prose.notes > p[id^="para-"]').first();
  await para.evaluate((el) => { const t = el.firstChild!; const r = document.createRange(); r.setStart(t, 0); r.setEnd(t, Math.min(20, t.textContent!.length)); getSelection()!.removeAllRanges(); getSelection()!.addRange(r); });
  await expect(page.locator('.ann-bar')).toHaveAttribute('data-open', 'true');
  await page.keyboard.press('h');
  await expect(page.locator('[data-ann-list] li')).toHaveCount(1);
  await page.reload();
  await expect(page.locator('[data-ann-list] li')).toHaveCount(1);
  expect(await page.evaluate(() => (CSS as any).highlights?.has('annotation') ?? true)).toBe(true);
});

test('compare: two cases side by side, scroll-synchronised', async ({ page, isMobile }) => {
  await page.goto('/compare?a=%2Fcases%2Fdonoghue-v-stevenson%2F&b=%2Fcases%2Fchapman-v-hearse%2F');
  const titles = page.locator('.cmp-title');
  await expect(titles.nth(0)).toContainText('Donoghue');
  await expect(titles.nth(1)).not.toHaveText(/Loading|—/);
  if (isMobile) return;
  const [a, b] = [page.locator('.cmp-pane').nth(0), page.locator('.cmp-pane').nth(1)];
  await a.evaluate((el) => { el.scrollTop = (el.scrollHeight - el.clientHeight) / 2; el.dispatchEvent(new Event('scroll')); });
  await page.waitForTimeout(100);
  expect(await b.evaluate((el) => el.scrollTop)).toBeGreaterThan(0);
});

test('explain it back: 60 s box → compare → self-rating schedules it', async ({ page }) => {
  await page.goto('/laws2400/concept/w02-battery/?explain=1');
  const x = page.locator('.xback');
  await expect(x.locator('textarea')).toBeFocused();
  await x.locator('textarea').fill('Battery is a direct, intentional contact without lawful justification.');
  await x.getByRole('button', { name: 'Done, compare' }).click();
  await expect(x.locator('.xback__yours')).toContainText('direct, intentional');
  await x.getByRole('button', { name: 'Good' }).click();
  await expect(x.locator('.xback__done')).toBeVisible();
});

test('image occlusion: draw a box, name it, save a card', async ({ page, isMobile }) => {
  test.skip(isMobile, 'drawing uses a mouse');
  await page.goto('/occlusion');
  const stage = page.locator('.occ__stage');
  await expect(stage.locator('img')).toBeVisible();
  const b = (await stage.boundingBox())!;
  await page.mouse.move(b.x + 40, b.y + 40); await page.mouse.down(); await page.mouse.move(b.x + 160, b.y + 90, { steps: 5 }); await page.mouse.up();
  await expect(page.locator('.occ-mask')).toHaveCount(1);
  await page.fill('#occ-l-0', 'State practice');
  await page.getByRole('button', { name: 'Save card' }).click();
  await expect(page.locator('.occ__msg')).toContainText('Saved a card with 1 hidden label');
});

test('export JSON downloads everything; import rejects a foreign file', async ({ page, isMobile }) => {
  test.skip(isMobile, 'download');
  await page.goto('/settings');
  const dl = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export JSON' }).click();
  const f = await dl;
  expect(f.suggestedFilename()).toMatch(/^studysite-export-\d{4}-\d\d-\d\d\.json$/);
  await page.locator('.data-tools input[type=file]').setInputFiles({ name: 'x.json', mimeType: 'application/json', buffer: Buffer.from('{"app":"other"}') });
  await expect(page.locator('.data-tools__msg')).toContainText('not a StudySite export');
});

test.describe('PWA', () => {
  test.use({ serviceWorkers: 'allow' });
  test('manifest linked, service worker registers, a visited page works offline', async ({ page, context, isMobile }) => {
  test.skip(isMobile, 'one run is enough');
  await page.goto('/dashboard/');
  await expect(page.locator('link[rel="manifest"]')).toHaveCount(1);
  await page.waitForFunction(async () => !!(await navigator.serviceWorker.getRegistration())?.active, null, { timeout: 15000 });
  await page.reload();
  await page.waitForFunction(() => !!navigator.serviceWorker.controller);
  await page.reload();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(500);
  await context.setOffline(true);
  await page.reload();
  await expect(page.locator('h1')).toContainText('Dashboard');
  await page.goto('/laws2400/concept/w03-public-nuisance/').catch(() => {});
  await expect(page.locator('h1')).toBeVisible();
  await context.setOffline(false);
});
});
