// Guard: text inside single-line controls (buttons, chips, tabs, keys) is vertically centred.
// Catches any stylesheet change — scoped or global — that shifts a label off-centre.
import { test, expect } from '@playwright/test';
import { builtRoutes } from './routes';
import { scrollThrough } from './helpers';

const SELECTOR = '.btn, .chip, .tabs__tab, .kbd, .dial span:not(.dial-label)';
const TOLERANCE = 2; // px

for (const route of builtRoutes()) {
  test(`labels are vertically centred on ${route}`, async ({ page }) => {
    // The long reference pages (hundreds of entries) take longer than 30 s to scroll through on the mobile profile.
    test.slow(/^\/(glossary|statutes)\/$/.test(route), 'long reference page');
    await page.goto(route);
    await scrollThrough(page); // hydrate islands so their controls are measured too
    const off = await page.evaluate(({ sel, tol }) => {
      const bad: string[] = [];
      for (const el of document.querySelectorAll<HTMLElement>(sel)) {
        if (!el.offsetParent || !el.textContent?.trim()) continue;
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        const top = r.top + parseFloat(cs.borderTopWidth) + parseFloat(cs.paddingTop);
        const bottom = r.bottom - parseFloat(cs.borderBottomWidth) - parseFloat(cs.paddingBottom);
        const range = document.createRange();
        range.selectNodeContents(el);
        const rects = [...range.getClientRects()].filter((x) => x.height > 0);
        if (!rects.length) continue;
        const t = Math.min(...rects.map((x) => x.top));
        const b = Math.max(...rects.map((x) => x.bottom));
        if (b - t > bottom - top + 12) continue; // multi-line label: not a single-line control
        const delta = (t + b) / 2 - (top + bottom) / 2;
        if (Math.abs(delta) > tol) bad.push(`"${el.textContent.trim().slice(0, 30)}" (${el.className}) off by ${delta.toFixed(1)}px`);
      }
      return bad;
    }, { sel: SELECTOR, tol: TOLERANCE });
    expect(off).toEqual([]);
  });
}
