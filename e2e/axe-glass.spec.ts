import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Glass at its thinnest setting (0.2) must keep text at WCAG AA (4.5:1) in both themes: nav, rail, a popover, the palette.
const WEEK = '/laws2400/week/4/';

async function contrast(page: Page) {
  let ab = new AxeBuilder({ page }).withRules(['color-contrast']);
  for (const s of ['.site-header', '.rail__body', '.popover[data-open="true"]', 'dialog.palette[open]']) if (await page.locator(s).count()) ab = ab.include(s);
  const r = await ab.analyze();
  return r.violations.flatMap((v) => v.nodes.map((n) => `${n.target.join(' ')}: ${n.any.map((a) => a.message).join('; ')}`));
}

/** Wait until an overlay's enter transition has finished (opacity 1, no running animations inside it). */
async function settle(page: Page, sel: string) {
  await expect.poll(() => page.locator(sel).evaluate((e) => getComputedStyle(e).opacity)).toBe('1');
  await page.locator(sel).evaluate((e) => Promise.all(e.getAnimations({ subtree: true }).map((a) => a.finished)));
}

for (const theme of ['light', 'dark'] as const) {
  test.describe(`glass at 0.2, ${theme}`, () => {
    test.use({ colorScheme: theme });
    test.beforeEach(async ({ page }) => {
      await page.addInitScript((t) => {
        localStorage.setItem('studysite:motion', 'off');
        localStorage.setItem('studysite:theme', t);
        localStorage.setItem('studysite:pretest:laws2400-w04', 'skip');
        localStorage.setItem('studysite:prefs', JSON.stringify({ glass: 'on', glassOpacity: 0.2 }));
      }, theme);
    });

    test('nav, rail, popover and palette pass colour contrast', async ({ page, isMobile }) => {
      test.skip(isMobile, 'the desktop chrome carries the rail and the glass popover');
      await page.goto(WEEK);
      await expect(page.locator('html')).toHaveAttribute('data-glass', 'on');
      await page.evaluate(() => scrollTo(0, 1390));
      expect(await contrast(page)).toEqual([]);
      await page.locator('.dial-more').click();
      await expect(page.locator('.popover[data-open="true"]')).toBeVisible();
      await settle(page, '.popover[data-open="true"]');
      expect(await contrast(page)).toEqual([]);
      await page.keyboard.press('Escape');
      await page.keyboard.press('Control+k');
      await expect(page.locator('dialog.palette[open]')).toBeVisible();
      await settle(page, 'dialog.palette[open]'); // measure the palette, not its entrance fade
      expect(await contrast(page)).toEqual([]);
    });

    test('below the floor a paper backing tops the surface up to --glass-text-backing', async ({ page }) => {
      await page.goto(WEEK);
      const alpha = await page.locator('.site-header').evaluate((e) => {
        const m = getComputedStyle(e).backgroundColor.match(/\/\s*([\d.]+)\)/);
        return m ? Number(m[1]) : 1;
      });
      // 1 - (1 - 0.2)(1 - backing) = 0.5  →  backing = 0.375
      expect(alpha).toBeCloseTo(0.375, 2);
    });
  });
}
