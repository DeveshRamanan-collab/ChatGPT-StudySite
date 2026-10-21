import { test, expect } from '@playwright/test';

// CLS < 0.05 (CLAUDE.md rule 12), measured after fonts have swapped in.
for (const route of ['/', '/styleguide/', '/laws2400/week/1/']) {
  test(`CLS < 0.05 on ${route}`, async ({ page }, info) => {
    await page.addInitScript(() => {
      (window as any).__cls = 0;
      new PerformanceObserver((list) => {
        for (const e of list.getEntries() as any[]) if (!e.hadRecentInput) (window as any).__cls += e.value;
      }).observe({ type: 'layout-shift', buffered: true });
    });
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(500);
    const cls = await page.evaluate(() => (window as any).__cls as number);
    const fonts = await page.evaluate(() => [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family));
    expect(fonts).toContain('Fraunces');
    await page.screenshot({ path: `reports/screens/2.1-${info.project.name}${route.replace(/\//g, '_')}.png`, fullPage: true });
    expect(cls).toBeLessThan(0.05);
  });
}
