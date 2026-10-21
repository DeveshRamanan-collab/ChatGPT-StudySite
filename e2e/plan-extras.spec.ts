import { test, expect } from '@playwright/test';

const ICS = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'BEGIN:VEVENT', 'DTSTART;TZID=Australia/Sydney:20261020T090000', 'DTEND;TZID=Australia/Sydney:20261020T170000', 'SUMMARY:Work', 'END:VEVENT', 'END:VCALENDAR', ''].join('\r\n');

test('plan: import a calendar file, see it applied, download today\'s pack', async ({ page }) => {
  await page.goto('/plan/');
  await expect(page.getByRole('heading', { name: "Today's pack" })).toBeVisible();
  await page.locator('.plan-cal input[type=file]').setInputFiles({ name: 'work.ics', mimeType: 'text/calendar', buffer: Buffer.from(ICS) });
  await expect(page.locator('.plan-cal__status')).toContainText(/from work\.ics/);
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: /Download today's pack/ }).click();
  expect((await download).suggestedFilename()).toMatch(/^studysite-pack-\d{4}-\d{2}-\d{2}\.md$/);
  await page.getByRole('button', { name: 'Remove' }).click();
  await expect(page.locator('.plan-cal__status')).toHaveCount(0);
});
