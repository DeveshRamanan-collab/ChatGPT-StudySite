import { test, expect } from '@playwright/test';

test('settings: noise off by default with the warning; companion shows beside a deep dive', async ({ page }) => {
  await page.goto('/settings');
  await expect(page.getByRole('radiogroup', { name: 'Noise' }).getByRole('radio', { name: 'Off' })).toBeChecked();
  await expect(page.getByText(/hyperactive type/)).toBeVisible();
  await expect(page.getByRole('slider', { name: 'Volume' })).toBeDisabled();
  await page.locator('.settings-seg__opt', { hasText: /^Lamp$/ }).click();
  await page.getByRole('button', { name: 'Start a deep dive' }).click();
  const fb = page.locator('.focus-block');
  await expect(fb).toBeVisible();
  await expect(fb.locator('.companion')).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('data-block', 'deep');
  await page.locator('.settings-seg__opt', { hasText: 'Brown' }).click();
  await expect(page.getByRole('slider', { name: 'Volume' })).toBeEnabled();
});

test('lamp-lit theme applies before paint and survives navigation', async ({ page }) => {
  await page.goto('/settings');
  await page.locator('.settings-seg__opt', { hasText: 'Dark (lamp-lit)' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(23, 20, 15)'); // after the 240ms cross-fade
  await page.goto('/dashboard');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.locator('nav[aria-label="Main"] a', { hasText: 'Units' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('settings: every preference is here; they persist to IndexedDB and survive a cleared localStorage', async ({ page, isMobile }) => {
  await page.goto('/settings');
  await page.getByRole('radiogroup', { name: 'Motion' }).locator('.settings-seg__opt', { hasText: 'Full' }).click();
  if (!isMobile) await expect(page.locator('html')).toHaveClass(/has-cursor/);
  for (const g of ['Theme', 'Motion', 'Contents rail', 'Reading progress line', 'Scrollbar', 'Cursor', 'Companion', 'Noise']) await expect(page.getByRole('radiogroup', { name: g })).toBeVisible();
  await expect(page.locator('main').getByRole('checkbox', { name: 'Glass surfaces' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Replay intro' })).toBeVisible();
  await expect(page.getByRole('button', { name: /Export/ })).toBeVisible();

  await page.getByRole('radiogroup', { name: 'Contents rail' }).locator('.settings-seg__opt', { hasText: 'Hidden' }).click();
  await page.getByRole('radiogroup', { name: 'Cursor' }).locator('.settings-seg__opt', { hasText: 'Off (system cursor)' }).click();
  await expect(page.locator('html')).not.toHaveClass(/has-cursor/);
  await page.getByRole('radiogroup', { name: 'Theme' }).locator('.settings-seg__opt', { hasText: 'Dark (lamp-lit)' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  // IndexedDB holds the durable copy: wipe the localStorage mirror and the next load restores it.
  await expect.poll(() => page.evaluate(() => new Promise((res) => { const r = indexedDB.open('studysite'); r.onsuccess = () => { const g = r.result.transaction('settings').objectStore('settings').get('prefs'); g.onsuccess = () => { res(g.result?.value?.cursor); r.result.close(); }; }; }))).toBe('off');
  await page.evaluate(() => { for (const k of Object.keys(localStorage)) if (/^studysite:(prefs|theme|motion)$/.test(k)) localStorage.removeItem(k); });
  await page.goto('/laws2400/week/4/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  if (!isMobile) await expect(page.locator('html')).toHaveAttribute('data-rail', 'collapsed');
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('studysite:prefs') || '{}').cursor)).toBe('off');
});
