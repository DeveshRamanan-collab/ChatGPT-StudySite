import { test, expect } from '@playwright/test';
import { setLevel } from './helpers';

const bodyCursor = (page: import('@playwright/test').Page) => page.evaluate(() => getComputedStyle(document.body).cursor);

test('custom cursor: on for fine pointer in full; native cursor restored when dial ≠ full', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', 'fine-pointer test');
  await page.goto('/styleguide/');
  await page.waitForFunction(() => !!(window as any).__motion);
  await expect(page.locator('html')).toHaveClass(/has-cursor/);
  expect(await bodyCursor(page)).toBe('none');

  // States follow the target.
  await page.locator('a.card').first().scrollIntoViewIfNeeded();
  const box = (await page.locator('.site-header nav[aria-label="Main"] a[href="/dashboard"]').boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await expect(page.locator('.cursor')).toHaveAttribute('data-state', 'link');
  await expect(page.locator('.cursor > .cursor-dot')).toHaveCSS('opacity', '1');
  const para = page.locator('main p:not(.label)').first();
  await para.scrollIntoViewIfNeeded();
  const p = (await para.boundingBox())!;
  await page.mouse.move(p.x + 10, p.y + p.height / 2);
  await expect(page.locator('.cursor')).toHaveAttribute('data-state', 'text');

  // Survives client-side navigation.
  await page.locator('.site-header nav[aria-label="Main"] a[href="/plan"]').click();
  await page.waitForURL('**/plan');
  await expect(page.locator('html')).toHaveClass(/has-cursor/);
  await expect(page.locator('.cursor')).toHaveCount(1);

  for (const level of ['Calm', 'Off']) {
    await page.locator('.site-header [data-motion-dial] label', { hasText: level }).click();
    await expect(page.locator('html')).not.toHaveClass(/has-cursor/);
    await expect(page.locator('.cursor')).toHaveCount(0);
    await expect(page.locator('.ambient')).toHaveCount(0);
    expect(await bodyCursor(page)).toBe('auto');
    await page.locator('.site-header [data-motion-dial] label', { hasText: 'Full' }).click();
    await expect(page.locator('html')).toHaveClass(/has-cursor/);
  }
});

test('custom cursor disabled on a touch viewport', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile', 'touch test');
  await setLevel(page, 'full');
  await page.goto('/');
  await page.waitForFunction(() => !!(window as any).__motion);
  expect(await page.evaluate(() => matchMedia('(pointer: coarse)').matches)).toBe(true);
  await expect(page.locator('html')).not.toHaveClass(/has-cursor/);
  await expect(page.locator('.cursor')).toHaveCount(0);
  expect(await bodyCursor(page)).toBe('auto');
});

test('magnetic button moves at most 6px toward the pointer', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', 'fine-pointer test');
  await page.goto('/styleguide/');
  await page.waitForFunction(() => !!(window as any).__motion);
  const btn = page.getByRole('button', { name: 'Open modal' });
  await btn.scrollIntoViewIfNeeded();
  const b = (await btn.boundingBox())!;
  await page.mouse.move(b.x + b.width / 2, b.y - 30, { steps: 5 }); // 30px above: within the 40px radius
  await page.waitForTimeout(800);
  const t = await btn.evaluate((el) => el.style.translate);
  const [x, y] = t.split(' ').map(parseFloat);
  expect(y).toBeLessThan(-0.5); // pulled up toward the pointer
  expect(Math.hypot(x || 0, y)).toBeLessThanOrEqual(6 * Math.SQRT2);
  expect(Math.abs(y)).toBeLessThanOrEqual(6);
});

test('press never moves the ring: translate stays within 2px of its pre-click value for 300ms', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', 'fine-pointer test');
  await page.goto('/dashboard/');
  await page.waitForFunction(() => !!(window as any).__motion);
  await page.mouse.move(600, 400);
  await expect(page.locator('html')).toHaveClass(/has-cursor/);
  await page.waitForTimeout(1200); // lerp settles on the pointer
  const drift = await page.evaluate(async () => {
    const ring = document.querySelector<HTMLElement>('.cursor > .cursor-ring')!;
    const pos = () => { const r = ring.getBoundingClientRect(); return [r.left, r.top]; };
    const [x0, y0] = pos();
    ring.ownerDocument.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: 600, clientY: 400, pointerType: 'mouse' }));
    window.dispatchEvent(new PointerEvent('pointerdown', { clientX: 600, clientY: 400, pointerType: 'mouse' }));
    let worst = 0;
    const t0 = performance.now();
    while (performance.now() - t0 < 300) {
      await new Promise((r) => requestAnimationFrame(r));
      const [x, y] = pos();
      worst = Math.max(worst, Math.abs(x - x0), Math.abs(y - y0));
    }
    return { worst, pressed: document.querySelector('.cursor')!.classList.contains('is-down') };
  });
  expect(drift.pressed).toBe(true);
  expect(drift.worst).toBeLessThanOrEqual(2);
  // And the inner shape did shrink (the press is visible).
  const scale = await page.locator('.cursor-ring__shape').evaluate((e) => new DOMMatrix(getComputedStyle(e).transform).a);
  expect(scale).toBeLessThan(36 / 56);
});
