import { test, expect } from '@playwright/test';
import { builtRoutes } from './routes';

const routes = builtRoutes();

test('every route family is built', () => {
  const families = ['/', '/dashboard/', '/plan/', '/search/', '/styleguide/'];
  for (const f of families) expect(routes).toContain(f);
  for (const re of [/^\/[a-z]+\d{4}\/$/, /\/week\/\d+\/$/, /\/concept\/[a-z0-9-]+\/$/, /\/quiz\/$/, /\/cards\/$/, /\/errors\/$/, /^\/cases\//, /^\/authorities\//])
    expect(routes.some((r) => re.test(r)), String(re)).toBe(true);
});

for (const route of routes) {
  test(`renders ${route} without console errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', (e) => errors.push(e.message));
    const res = await page.goto(route);
    expect(res?.status()).toBe(200);
    await expect(page.locator('h1').first()).toBeVisible();
    expect(errors).toEqual([]);
  });
}
