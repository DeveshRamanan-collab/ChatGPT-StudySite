import { test, expect, type Page } from '@playwright/test';

// Replace the bank's long questions with fixtures, so these tests don't depend on the unit's generated pq set.
const rubric = [
  { id: 'i', criterion: 'Identifies the breach issue', marks: 2, 'top-band': 'States the issue precisely.', 'margin-note': 'One sentence.', authorities: [] },
  { id: 'l', criterion: 'States the foreseeable and not insignificant threshold', marks: 3, 'top-band': 'States s 5B(1) accurately.', 'margin-note': 'Threshold first.', authorities: [] },
  { id: 'a', criterion: 'Weighs probability, seriousness and burden', marks: 5, 'top-band': 'Weighs each factor against the facts.', 'margin-note': 'Use the facts.', authorities: [] },
];
const base = { unit: 'laws2400', difficulty: 3, template: 'ilac', timer: 40, rubric, prompt: 'A council leaves a known pothole unrepaired for six months. A pedestrian trips. Advise on breach.',
  model: 'The issue is breach. The risk was foreseeable and not insignificant. Probability was high, harm moderate and the burden of repair low. Breach is likely.' };

async function withLong(page: Page, tiers: ('worked' | 'faded' | 'full')[]) {
  await page.route('**/data/laws2400/questions.json', async (route) => {
    const res = await route.fetch();
    const bank = await res.json();
    const concept = Object.keys(bank.concepts)[0];
    bank.questions = bank.questions.filter((q: { type: string }) => q.type !== 'long');
    bank.questions.push(...tiers.map((tier, i) => ({
      ...base, id: `fixture-long-${tier}-${i}`, type: 'long', tier, concept,
      steps: tier === 'worked' ? ['Identify the breach issue.', 'State the s 5B(1) threshold.', 'Weigh the s 5B(2) factors.'] : [],
      given: tier === 'faded' ? { issues: 'Breach of duty by the council', rule: 'Civil Liability Act 2002 (NSW) s 5B' } : undefined,
    })));
    await route.fulfill({ response: res, json: bank });
  });
}

async function plan(page: Page) {
  const issues = page.locator('.plan__fields input');
  await issues.nth(0).fill('Breach');
  await issues.nth(1).fill('s 5B');
  await issues.nth(2).fill('Causation');
  await page.getByRole('button', { name: 'Move point 2 up' }).click();
  await expect(issues.nth(0)).toHaveValue('Causation');
  await page.getByRole('button', { name: 'Start writing' }).click();
}

test('worked tier: each step stays hidden until a prediction is made; exam mode hides the chrome', async ({ page }) => {
  await withLong(page, ['worked']);
  await page.goto('/laws2400/quiz/?type=long');
  await plan(page);
  expect(await page.evaluate(() => document.documentElement.dataset.exam)).toBe('1');
  await expect(page.locator('.site-header nav[aria-label="Main"]')).toBeHidden();
  const reveal = page.getByRole('button', { name: 'Reveal step 1' });
  await expect(reveal).toBeDisabled();
  await expect(page.locator('.la__steps li')).toHaveCount(0);
  await expect(page.getByText('State the s 5B(1) threshold.')).toHaveCount(0);
  for (let k = 1; k <= 3; k++) {
    await page.locator('.la__pred-input').fill(`my guess ${k}`);
    await page.getByRole('button', { name: `Reveal step ${k}` }).click();
    await expect(page.locator('.la__steps li')).toHaveCount(k);
  }
  await page.getByRole('button', { name: 'Finish' }).click();
  expect(await page.evaluate(() => document.documentElement.dataset.exam)).toBeUndefined();
  await expect(page.locator('.rubric')).toBeVisible();
});

test('faded tier pre-fills the given parts', async ({ page }) => {
  await withLong(page, ['faded']);
  await page.goto('/laws2400/quiz/?type=long');
  await plan(page);
  const editor = page.locator('.la__editor');
  await expect(editor).toHaveValue(/Issues: Breach of duty by the council/);
  await expect(editor).toHaveValue(/Rule: Civil Liability Act 2002 \(NSW\) s 5B/);
});

test('two passes at ≥ 70% promote the concept from worked to faded; gaps become cards', async ({ page }) => {
  await withLong(page, ['worked', 'faded']);
  for (let pass = 1; pass <= 2; pass++) {
    await page.goto('/laws2400/quiz/?type=long');
    await expect(page.locator('.la')).toHaveAttribute('data-tier', 'worked');
    await plan(page);
    for (let k = 1; k <= 3; k++) {
      await page.locator('.la__pred-input').fill('guess');
      await page.getByRole('button', { name: `Reveal step ${k}` }).click();
    }
    await page.getByRole('button', { name: 'Finish' }).click();
    const rows = page.locator('.rubric__tick');
    await rows.nth(1).check(); // 3
    await rows.nth(2).check(); // +5 = 8/10
    await expect(page.locator('[data-band]')).toHaveText('Distinction');
    if (pass === 1) {
      await page.getByRole('button', { name: 'Gaps → cards' }).click();
      await expect(page.getByRole('button', { name: 'Cards made' })).toBeDisabled();
    }
    await page.getByRole('button', { name: 'Save my mark' }).click();
    await expect(page.locator('.la__saved')).toBeVisible(); // the attempt is stored before we navigate on
    if (pass === 1) await expect(page.locator('[data-promoted]')).toHaveCount(0);
    else await expect(page.locator('[data-promoted]')).toHaveText('faded');
  }
  await page.goto('/laws2400/quiz/?type=long');
  await expect(page.locator('.la')).toHaveAttribute('data-tier', 'faded');
  const cards = await page.evaluate(() => new Promise<number>((resolve) => {
    const open = indexedDB.open('studysite');
    open.onsuccess = () => { const r = open.result.transaction('customCards').objectStore('customCards').count(); r.onsuccess = () => resolve(r.result); };
  }));
  expect(cards).toBe(1);
});
