import { test, expect } from '@playwright/test';
import { setLevel, openSheet } from './helpers';

// Rule (CLAUDE.md "Navigation"): from any page, any week's notes are two clicks away: ≡ → week.
test('every ingested week is two clicks from any page (≡ → week)', async ({ page, request }) => {
  test.setTimeout(120_000);
  const units: { id: string; code: string; weeks: { id: string; number: number; href: string }[] }[] = await (await request.get('/data/overview.json')).json();
  const weeks = units.flatMap((u) => u.weeks.map((w) => ({ ...w, code: u.code })));
  expect(weeks.length).toBeGreaterThan(10);
  await setLevel(page, 'off');
  await page.addInitScript((ids) => ids.forEach((id) => localStorage.setItem(`studysite:pretest:${id}`, 'skip')), weeks.map((w) => w.id));
  const starts = ['/', '/settings/', '/map/', '/laws2100/', '/dashboard/'];
  for (const [i, w] of weeks.entries()) {
    // Every fourth week starts from a fresh non-week page; the rest start from the week page just reached.
    if (i % 4 === 0) await page.goto(starts[(i / 4) % starts.length]);
    const sheet = await openSheet(page); // click 1
    await sheet.locator(`[data-unit="${w.id.split('-')[0]}"]`).getByRole('link', { name: new RegExp(`^Week ${w.number}:`) }).first().click(); // click 2 (chip, or the titled row when expanded)
    await expect(page).toHaveURL(new RegExp(`${w.href}/?$`));
    await expect(page.locator('h1')).toBeVisible();
    await expect(sheet).toBeHidden();
  }
});

test('sheet: M opens, focus stays inside, Esc closes and returns focus to ≡; weeks not in yet are not links', async ({ page, isMobile }) => {
  test.skip(isMobile, 'keyboard');
  await setLevel(page, 'off');
  await page.goto('/dashboard/');
  await openSheet(page);
  await page.keyboard.press('Escape');
  const sheet = page.locator('dialog.navsheet');
  await expect(sheet).toBeHidden();
  await expect(page.locator('.navsheet-btn')).toBeFocused();
  await page.locator('body').click({ position: { x: 700, y: 600 } });
  await page.keyboard.press('m');
  await expect(sheet).toBeVisible();
  for (let i = 0; i < 12; i++) await page.keyboard.press('Tab');
  expect(await page.evaluate(() => !!document.activeElement?.closest('dialog.navsheet'))).toBe(true);
  const off = sheet.locator('.navsheet__chip--off');
  expect(await off.count()).toBeGreaterThan(0);
  expect(await off.evaluateAll((els) => els.every((e) => e.tagName === 'SPAN' && !e.closest('a')))).toBe(true);
  // The scrim (the dialog's ::backdrop) closes it.
  await page.mouse.click(1300, 450);
  await expect(sheet).toBeHidden();
  // Typing in a field never opens it.
  await page.goto('/search/');
  await page.locator('#q').pressSequentially('mm');
  await expect(sheet).toBeHidden();
});

test('sheet: due counts show on their week with a clay marker', async ({ page }) => {
  await setLevel(page, 'off');
  await page.goto('/settings/');
  // Opening the sheet starts the study store, which creates the database; seed one due card, then reload.
  await openSheet(page);
  await page.waitForFunction(() => new Promise((res) => { const r = indexedDB.open('studysite'); r.onsuccess = () => { const ok = r.result.objectStoreNames.contains('cards'); r.result.close(); res(ok); }; r.onerror = () => res(false); }));
  await page.evaluate(() => new Promise<void>((res, rej) => {
    const r = indexedDB.open('studysite');
    r.onsuccess = () => {
      const tx = r.result.transaction('cards', 'readwrite');
      tx.objectStore('cards').put({ cardId: 'laws2400-w04-c001', fsrs: {}, due: 0, reps: 1, lapses: 0 });
      tx.oncomplete = () => { r.result.close(); res(); };
      tx.onerror = () => rej(tx.error);
    };
    r.onerror = () => rej(r.error);
  }));
  await page.reload();
  const sheet = await openSheet(page);
  const toggle = sheet.locator('[data-unit="laws2400"] button[aria-expanded]');
  if ((await toggle.getAttribute('aria-expanded')) !== 'true') await toggle.click();
  const wk4 = sheet.locator('[data-unit="laws2400"] .navsheet__row[href="/laws2400/week/4"]');
  await expect(wk4.locator('.navsheet__due')).toHaveText('1 card due');
  // The due marker is a clay dot; the words stay ink-2 so they keep 4.5:1 on any row background.
  const clay = await page.evaluate(() => { const d = document.createElement('i'); d.style.color = 'var(--clay)'; document.body.append(d); const c = getComputedStyle(d).color; d.remove(); return c; });
  expect(await wk4.locator('.navsheet__due').evaluate((e) => getComputedStyle(e, '::before').backgroundColor)).toBe(clay);
});
