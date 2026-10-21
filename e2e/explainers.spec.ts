import { test, expect, type Page } from '@playwright/test';
import { setLevel } from './helpers';

const SIM = '/laws2400/concept/w06-psychiatric-harm-civil-liability-act/';
const SCROLL = '/laws2400/concept/w05-neighbour-principle-and-duty-evolution/';
const PALACE = '/laws2400/concept/w05-negligence-elements-overview/';

async function shots(page: Page, name: string, tag: string) {
  const ex = page.locator('#explainer');
  await ex.scrollIntoViewIfNeeded();
  const top = await ex.evaluate((e) => e.getBoundingClientRect().top + scrollY);
  const h = await ex.evaluate((e) => e.getBoundingClientRect().height);
  const vh = await page.evaluate(() => innerHeight);
  for (const [k, f] of [['a', 0], ['b', 0.5], ['c', 1]] as const) {
    await page.evaluate((y) => scrollTo(0, y), top + Math.max(0, h - vh) * f - 60);
    await page.waitForTimeout(500);
    await page.screenshot({ path: `reports/review/5.3-${name}-${tag}-${k}.png` });
  }
}

test('simulation: controls drive the verdict via the three statutory gates; the check records an attempt', async ({ page }, info) => {
  await page.goto(SIM);
  const verdict = page.locator('[data-verdict]');
  await expect(verdict).toContainText('Barred (s 30(2))');
  await page.getByLabel('Relationship to the victim').selectOption('close-family');
  await expect(verdict).toContainText('Passes Part 3');
  await expect(page.locator('[data-changed]')).toContainText('s 30(2)(b)');
  await page.getByLabel('Harm is a recognised psychiatric illness').uncheck();
  await expect(verdict).toContainText('No damages (s 31)');
  await page.getByLabel('Type of mental harm').selectOption('consequential');
  await expect(verdict).toContainText('Consequential mental harm');
  await page.getByLabel('Court finds it foreseeable to a person of normal fortitude').uncheck();
  await expect(verdict).toContainText('No duty (s 32)');
  await page.getByRole('button', { name: 'Reset' }).click();
  await expect(verdict).toContainText('Barred (s 30(2))');
  await page.getByRole('button', { name: /Scene witnesses, or close members/ }).click();
  await expect(page.locator('.xcheck__why')).toContainText('Right.');
  await shots(page, 'simulation', `${info.project.name}-full`);
});

test('scroll explainer: pinned scrub (desktop full), paced Next (mobile), stacked captions (off)', async ({ page }, info) => {
  await page.goto(SCROLL);
  const caption = page.locator('.xs__caption');
  if (info.project.name === 'desktop') {
    await expect(page.locator('.xs[data-layout="pinned"]')).toBeVisible();
    await expect(caption).toContainText('1932');
    const top = await page.locator('.xs__pin').evaluate((e) => e.getBoundingClientRect().top + scrollY);
    await page.evaluate((y) => scrollTo(0, y + innerHeight * 3.2), top);
    await expect(caption).toContainText('Caparo');
  } else {
    await page.getByRole('button', { name: 'Start' }).click();
    await expect(caption).toContainText('1932');
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(caption).toContainText('1936');
  }
  await shots(page, 'scroll', `${info.project.name}-full`);
});

test('scroll explainer off: final frame with every caption stacked', async ({ page }, info) => {
  await setLevel(page, 'off');
  await page.goto(SCROLL);
  await expect(page.locator('.xs--off .xs__captions li')).toHaveCount(5);
  await shots(page, 'scroll', `${info.project.name}-off`);
});

test('palace: ThreeScene runs in view, pauses off-screen; arrow keys walk the loci', async ({ page }, info) => {
  await page.goto(PALACE);
  const x3d = page.locator('.x3d');
  await x3d.scrollIntoViewIfNeeded();
  const hasCanvas = await x3d.locator('canvas').count();
  test.skip(!hasCanvas && (await page.locator('[data-fallback]').count()) > 0, 'no WebGL in this browser: fallback shown');
  await expect(x3d).toHaveAttribute('data-running', 'true');
  await page.locator('.xpal__room').focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('.xpal__title')).toHaveText('Breach');
  await shots(page, 'palace', `${info.project.name}-full`);
  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
  await expect(x3d).toHaveAttribute('data-running', 'false');
});

test('palace off: loci listed, no WebGL', async ({ page }, info) => {
  await setLevel(page, 'off');
  await page.goto(PALACE);
  await expect(page.locator('[data-fallback] .xpal__list li')).toHaveCount(4);
  await expect(page.locator('.x3d canvas')).toHaveCount(0);
  await shots(page, 'palace', `${info.project.name}-off`);
});

test('simulation explore: one-fact sweep, two-fact grid, scenario pair and notebook', async ({ page }) => {
  await setLevel(page, 'off');
  await page.goto(SIM);
  await page.locator('#explainer').scrollIntoViewIfNeeded();
  const panel = page.locator('.sim-explore');
  await panel.locator('summary').click();
  await expect(panel.locator('.sim-explore__table tbody tr').first()).toBeVisible();
  const two = panel.getByRole('button', { name: 'Two facts together' });
  if (await two.count()) { await two.click(); await expect(panel.locator('.sim-explore__grid td').first()).toBeVisible(); }
  await panel.getByRole('button', { name: 'Compare two scenarios' }).click();
  await panel.getByRole('button', { name: 'Hold these facts as scenario A' }).click();
  await expect(panel.locator('.sim-explore__side')).toHaveCount(2);
  await panel.getByRole('button', { name: /^Notebook/ }).click();
  await panel.locator('textarea').fill('Expected the duty to fail');
  await panel.getByRole('button', { name: 'Save this experiment' }).click();
  await expect(panel.locator('.sim-explore__notes li')).toHaveCount(1);
});
