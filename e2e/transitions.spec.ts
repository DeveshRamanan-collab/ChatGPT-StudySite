import { test, expect, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { builtRoutes } from './routes';
import { passPretest } from './helpers';

type Seen = { pseudo: string; name: string };

// Records the animations on view-transition pseudo-elements once the next view transition is ready
// (hooks document.startViewTransition, so it cannot miss a transition however long the click takes).
async function recordTransition(page: Page, click: () => Promise<void>) {
  await page.evaluate(() => {
    const w = window as any;
    w.__vt = null;
    const orig = w.__origSVT ?? document.startViewTransition.bind(document);
    w.__origSVT = orig;
    (document as any).startViewTransition = (arg: unknown) => {
      const t = orig(arg);
      t.ready.then(() => {
        w.__vt = document.documentElement.getAnimations({ subtree: true })
          .map((a) => ({ pseudo: (a.effect as KeyframeEffect | null)?.pseudoElement ?? '', name: (a as CSSAnimation).animationName ?? '' }))
          .filter((a) => a.pseudo.startsWith('::view-transition'));
      }, () => { w.__vt = []; });
      return t;
    };
  });
  await click();
  await page.waitForFunction(() => (window as any).__vt !== null, null, { timeout: 5000 });
  return page.evaluate(() => (window as any).__vt) as Promise<Seen[]>;
}

test('unit card → hub: shared-element transition (full)', async ({ page, context }, info) => {
  await context.tracing.start({ screenshots: true, snapshots: true });
  await page.goto('/');
  await page.waitForFunction(() => !!(window as any).__motion);
  const seen = await recordTransition(page, () => page.locator('a.unit-card[href="/laws2400"]').click());
  await context.tracing.stop({ path: `reports/traces/unit-to-hub-${info.project.name}.zip` });
  await expect(page).toHaveURL(/\/laws2400\/?$/);
  const pseudos = seen.map((s) => s.pseudo);
  expect(pseudos).toContain('::view-transition-group(unit-laws2400)');
  expect(seen.some((s) => s.name === 'ss-page-enter')).toBe(true);
  expect(seen.some((s) => s.name === 'ss-page-leave')).toBe(true);
});

test('reduced motion: fades only, no morph or movement', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.waitForFunction(() => !!(window as any).__motion);
  expect(await page.evaluate(() => document.documentElement.dataset.motion)).toBe('off');
  const seen = await recordTransition(page, () => page.locator('a.unit-card[href="/laws2400"]').click());
  await expect(page).toHaveURL(/\/laws2400\/?$/);
  expect(seen.filter((s) => s.pseudo.startsWith('::view-transition-group'))).toEqual([]);
  const names = [...new Set(seen.map((s) => s.name))];
  for (const n of names) expect(['ss-fade-in', 'ss-fade-out']).toContain(n);
});

// A concept page that links at least one case (read from the built HTML).
function conceptWithCase() {
  const r = builtRoutes().filter((x) => x.includes('/concept/')).find((x) => readFileSync(`dist${x}index.html`, 'utf8').includes('chip--case'));
  if (!r) throw new Error('no concept page with a case chip');
  return r;
}

test('week card → week header and case chip → case card carry shared names', async ({ page }) => {
  await page.goto('/laws2400/');
  await page.waitForFunction(() => !!(window as any).__motion);
  const weekCard = page.locator('.hub-weeks__track a.card').first();
  const vtName = await weekCard.locator('.card__title').evaluate((e) => getComputedStyle(e).viewTransitionName);
  expect(vtName).toMatch(/^week-/);
  let seen = await recordTransition(page, () => weekCard.click());
  expect(seen.map((s) => s.pseudo)).toContain(`::view-transition-group(${vtName})`);
  await page.goto(conceptWithCase());
  await page.waitForFunction(() => !!(window as any).__motion);
  const caseId = (await page.locator('a.chip--case').first().getAttribute('href'))!.split('/').filter(Boolean).pop();
  seen = await recordTransition(page, () => page.locator('a.chip--case').first().click());
  expect(seen.map((s) => s.pseudo)).toContain(`::view-transition-group(case-${caseId})`);
});

test('header condenses on scroll; reading progress (when switched on) tracks scroll', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('studysite:prefs', JSON.stringify({ progress: true })));
  await page.goto('/laws2400/week/1/');
  await passPretest(page);
  await page.waitForFunction(() => !!(window as any).__motion);
  expect(await page.evaluate(() => document.documentElement.classList.contains('is-scrolled'))).toBe(false);
  await page.mouse.wheel(0, 600);
  await page.waitForFunction(() => document.documentElement.classList.contains('is-scrolled'));
  const p = await page.evaluate(() => Number(getComputedStyle(document.querySelector('[data-read-progress]')!).getPropertyValue('--progress')));
  expect(p).toBeGreaterThan(0);
});
