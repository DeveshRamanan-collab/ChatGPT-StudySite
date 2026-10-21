import { expect, type Page } from '@playwright/test';

export type Level = 'full' | 'calm' | 'off';

export async function setLevel(page: Page, level: Level) {
  await page.addInitScript((l) => localStorage.setItem('studysite:motion', l), level);
}

/** Scroll the whole page so scroll-triggered reveals and client:visible islands run, then settle at the top. */
export async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    const step = innerHeight * 0.6;
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    scrollTo(0, 0);
  });
  await page.waitForTimeout(600);
}

/** Pairs of sibling UI elements whose boxes overlap, plus horizontal page overflow. */
export async function layoutProblems(page: Page, selector = '.btn, .chip, .card, .option, .ring, .timer-arc, .stamp, .tabs__tab, .kbd') {
  return page.evaluate((sel) => {
    const problems: string[] = [];
    const doc = document.documentElement;
    if (doc.scrollWidth > doc.clientWidth + 1) problems.push(`horizontal overflow: ${doc.scrollWidth} > ${doc.clientWidth}`);
    const els = [...document.querySelectorAll<HTMLElement>(sel)].filter((e) => e.offsetParent && !e.closest('.popover, dialog, .toaster'));
    const byParent = new Map<Element, HTMLElement[]>();
    for (const e of els) {
      const p = e.parentElement!;
      byParent.set(p, [...(byParent.get(p) || []), e]);
    }
    for (const group of byParent.values())
      for (let i = 0; i < group.length; i++)
        for (let j = i + 1; j < group.length; j++) {
          const a = group[i].getBoundingClientRect(), b = group[j].getBoundingClientRect();
          const ox = Math.min(a.right, b.right) - Math.max(a.left, b.left);
          const oy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
          if (ox > 2 && oy > 2) problems.push(`overlap: "${group[i].textContent?.trim().slice(0, 30)}" × "${group[j].textContent?.trim().slice(0, 30)}"`);
        }
    return problems;
  }, selector);
}

/** If the current week page is gated by its pretest, mark it done and reload so the notes show. */
export async function passPretest(page: Page) {
  const week = await page.evaluate(() => document.documentElement.dataset.pretest);
  if (!week) return;
  await page.evaluate((w) => localStorage.setItem(`studysite:pretest:${w}`, 'done'), week);
  await page.reload();
}

/** Wait until at least n attempts are stored (answers are saved asynchronously after the UI updates). */
export async function waitForAttempts(page: Page, n = 1) {
  await page.waitForFunction((min) => new Promise<boolean>((resolve) => {
    const open = indexedDB.open('studysite');
    open.onsuccess = () => {
      const db = open.result;
      if (!db.objectStoreNames.contains('attempts')) { db.close(); resolve(false); return; }
      const r = db.transaction('attempts').objectStore('attempts').count();
      r.onsuccess = () => { db.close(); resolve(r.result >= min); };
    };
    open.onerror = () => resolve(false);
  }), n);
}

/** Open the ≡ menu sheet (retries until the island has hydrated). */
export async function openSheet(page: Page) {
  const sheet = page.locator('dialog.navsheet');
  await expect(async () => {
    if (!(await sheet.isVisible())) await page.locator('.navsheet-btn').click();
    await expect(sheet).toBeVisible({ timeout: 800 });
  }).toPass({ timeout: 10_000 });
  return sheet;
}

/** Click a Theme or Motion pill: the header dial where it is shown, else the ≡ sheet's mirrored pills (phones). */
export async function pickDial(page: Page, dial: 'Theme' | 'Motion', label: string) {
  const header = page.locator(`.site-header [data-${dial.toLowerCase()}-dial] label`, { hasText: label });
  if (await header.isVisible()) return header.click();
  const sheet = await openSheet(page);
  await sheet.locator('.navsheet__dial', { has: page.locator('legend', { hasText: dial }) }).locator('label', { hasText: label }).click();
  await page.keyboard.press('Escape');
  await expect(sheet).toBeHidden();
}
