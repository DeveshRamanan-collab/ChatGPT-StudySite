import { test, expect, type Page } from '@playwright/test';
import { setLevel } from './helpers';

const TIMELINE = '/laws2400/concept/w06-psychiatric-harm-common-law-development/';
const DIAGRAM = '/laws2400/concept/w01-tort-law-and-other-branches/';

async function shot(page: Page, name: string) {
  await page.locator('#explainer').scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await page.screenshot({ path: `reports/review/F5-${name}.png` });
}

test('timeline: keyboard moves between events; drag snaps to the nearest; ticks jump', async ({ page }, info) => {
  await page.goto(TIMELINE);
  const handle = page.getByRole('slider', { name: 'Development of liability for psychiatric harm' });
  const title = page.locator('.xtl__title');
  await expect(title).toHaveText('Nervous shock');
  await handle.focus();
  await page.keyboard.press('ArrowRight');
  await expect(handle).toHaveAttribute('aria-valuenow', '2');
  await expect(title).toHaveText('Tame v New South Wales');
  await page.keyboard.press('End');
  await expect(title).toHaveText('Wicks v State Rail Authority (NSW)');
  await page.keyboard.press('Home');
  await expect(handle).toHaveAttribute('aria-valuenow', '1');
  await page.waitForTimeout(700); // let smooth scrolling from focus() settle before measuring
  // Drag the handle about 60% along the track: 6 events → nearest is event 4 (index 3).
  const track = await page.locator('.xtl__track').boundingBox();
  const h = await handle.boundingBox();
  await page.mouse.move(h!.x + h!.width / 2, h!.y + h!.height / 2);
  await page.mouse.down();
  await page.mouse.move(track!.x + track!.width * 0.3, h!.y + h!.height / 2, { steps: 5 });
  await page.mouse.move(track!.x + track!.width * 0.62, h!.y + h!.height / 2, { steps: 5 });
  await page.mouse.up();
  await expect(handle).toHaveAttribute('aria-valuenow', '4');
  await expect(title).toHaveText('Civil Liability Act 2002 (NSW) s 31');
  await page.getByRole('button', { name: '2010, Wicks v State Rail Authority (NSW)' }).click();
  await expect(handle).toHaveAttribute('aria-valuenow', '6');
  await shot(page, `timeline-${info.project.name}`);
});

test('timeline off: controls still work, no glide', async ({ page }, info) => {
  await setLevel(page, 'off');
  await page.goto(TIMELINE);
  const handle = page.getByRole('slider');
  await handle.focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('.xtl__title')).toHaveText('Tame v New South Wales');
  const x = await page.locator('.xtl__track').evaluate((e) => getComputedStyle(e).getPropertyValue('--x').trim());
  expect(Number(x)).toBeCloseTo(0.2, 2); // placed at once, not tweened
  await shot(page, `timeline-${info.project.name}-off`);
});

const drawn = (page: Page, step: number) =>
  page.locator(`[data-step="${step}"] rect`).first().evaluate((e) => {
    // DrawSVG writes stroke-dasharray "<drawn> <gap>": 0 drawn = hidden; none = never animated (off mode).
    const d = getComputedStyle(e).strokeDasharray;
    return d === 'none' || parseFloat(d) > 1;
  });

test('diagram: draws step by step (pinned scrub on desktop, Next/Back on mobile)', async ({ page }, info) => {
  await page.goto(DIAGRAM);
  await page.locator('#explainer').scrollIntoViewIfNeeded();
  const caption = page.locator('.xd .xs__caption');
  await expect(caption).toBeVisible();
  if (info.project.name === 'desktop') {
    await expect(page.locator('.xd[data-layout="pinned"]')).toBeVisible();
    expect(await drawn(page, 3)).toBe(false);
    const top = await page.locator('.xd__pin').evaluate((e) => e.getBoundingClientRect().top + scrollY);
    await page.evaluate((y) => scrollTo(0, y + innerHeight * 2.2), top);
    await expect(caption).toContainText('Contract duties');
    await expect.poll(() => drawn(page, 3)).toBe(true);
    await shot(page, 'diagram-desktop');
  } else {
    await expect(caption).toContainText('Press Next');
    expect(await drawn(page, 1)).toBe(false);
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(caption).toContainText('private wrongs');
    await expect.poll(() => drawn(page, 1)).toBe(true);
    expect(await drawn(page, 2)).toBe(false);
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(caption).toContainText('Contract duties');
    await page.getByRole('button', { name: 'Back', exact: true }).click();
    await expect(caption).toContainText('public wrongs');
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('button', { name: 'Next' }).click();
    await expect.poll(() => drawn(page, 4)).toBe(true);
    await shot(page, 'diagram-mobile');
  }
});

test('diagram off: finished figure and all captions', async ({ page }, info) => {
  await setLevel(page, 'off');
  await page.goto(DIAGRAM);
  await page.locator('#explainer').scrollIntoViewIfNeeded();
  await expect(page.locator('.xd--off .xs__captions li')).toHaveCount(4);
  expect(await drawn(page, 4)).toBe(true);
  await shot(page, `diagram-${info.project.name}-off`);
});
