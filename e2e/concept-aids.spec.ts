// "Ways in": a concept's study aids under its notes (src/components/aids/ConceptAids.astro, Socratic.tsx).
import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readdirSync, readFileSync } from 'node:fs';
import { layoutProblems, setLevel } from './helpers';

const PAGE = '/laws2400/concept/w04-consent-validity-and-scope';
const CONCEPT = 'laws2400-w04-consent-validity-and-scope';
const ORDER = ['In one line', 'Work it out', 'An example, then the rule', 'Rule checklist', 'Common mistakes', 'What if…', 'Edge cases and transfer', 'An analogy', 'Key terms'];
const AIDS_SELECTOR = '.btn, .chip, .ways-check__label, .ways-reveal, .ways-story__frame, .ways-analogy__from, .ways-analogy__to, .ways-mistake__wrong, .ways-mistake__right, .ways-arg';

/** A real (non-seed) concept with no aids file yet: its page must render no "Ways in" at all. */
function conceptWithoutAids() {
  const aids = new Set(readdirSync('src/content/aids').map((f) => f.replace(/\.mdx?$/, '')));
  for (const f of readdirSync('src/content/concepts').sort()) {
    const id = f.replace(/\.mdx?$/, '');
    if (aids.has(id) || /^seed:\s*true/m.test(readFileSync(`src/content/concepts/${f}`, 'utf8'))) continue;
    const unit = id.split('-')[0];
    return `/${unit}/concept/${id.slice(unit.length + 1)}`;
  }
  return null; // every concept has aids (true since 17 Oct 2026): the no-aids test skips itself
}

/** A concept whose aids are flagged verify: true (null when every aid is checked). */
function conceptToVerify() {
  for (const f of readdirSync('src/content/aids').sort()) {
    if (!/^verify:\s*true/m.test(readFileSync(`src/content/aids/${f}`, 'utf8'))) continue;
    const id = f.replace(/\.mdx?$/, '');
    const unit = id.split('-')[0];
    return `/${unit}/concept/${id.slice(unit.length + 1)}`;
  }
  return null;
}

async function errorsOn(page: Page) {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  return errors;
}

/** The Socratic island, once hydrated (client:visible: scrolled into view first). */
async function socratic(page: Page) {
  const box = page.locator('.ways-socratic');
  await box.scrollIntoViewIfNeeded();
  await expect(page.locator('astro-island:has(.ways-socratic)')).not.toHaveAttribute('ssr', '', { timeout: 20_000 });
  return box;
}

test('renders the sections in learning order, readable and uncluttered', async ({ page }) => {
  const errors = await errorsOn(page);
  await page.goto(PAGE);
  const ways = page.locator('#ways-in');
  await expect(ways.locator('h2')).toHaveText('Ways in');
  expect(await ways.locator('h3').allTextContents()).toEqual(ORDER);
  // Sits after the notes, before the page's own actions.
  expect(await page.evaluate(() => {
    const art = document.querySelector('article.prose')!, ways = document.getElementById('ways-in')!, actions = document.querySelector('.actions')!;
    return !!(art.compareDocumentPosition(ways) & Node.DOCUMENT_POSITION_FOLLOWING) && !!(ways.compareDocumentPosition(actions) & Node.DOCUMENT_POSITION_FOLLOWING);
  })).toBe(true);
  await expect(ways.locator('.ways__plain')).toContainText('Consent protects the defendant');
  await expect(ways.locator('.ways__sources')).toContainText('Built from');
  await expect(ways.locator('[data-verify]')).toHaveCount(0); // verify: false for this concept
  // Heading level stays h2 → h3 and prose keeps its measure.
  const widest = await ways.locator('.ways__plain, .ways-reveal__body p, .ways-check__test, .ways-terms dd').evaluateAll((els) => Math.max(...els.map((e) => e.getBoundingClientRect().width / parseFloat(getComputedStyle(e).fontSize))));
  expect(widest).toBeLessThanOrEqual(40); // ≈ 66ch of Fraunces at its own size
  // At most five blocks under any heading.
  const blocks = await ways.evaluate((root) => [...root.querySelectorAll('h3')].map((h) => {
    let n = 0;
    for (let el = h.nextElementSibling; el && el.tagName !== 'H3' && !el.matches('.ways__trail'); el = el.nextElementSibling) n += el.matches('.ways-group') ? el.firstElementChild!.children.length : el.matches('.ways-socratic-static') || getComputedStyle(el).display === 'none' ? 0 : 1;
    return n;
  }));
  for (const n of blocks) expect(n).toBeLessThanOrEqual(5);
  await ways.scrollIntoViewIfNeeded();
  expect(await layoutProblems(page, AIDS_SELECTOR)).toEqual([]);
  // The rail lists "Ways in" (desktop, where the rail is open).
  if ((page.viewportSize()?.width ?? 0) >= 1280) await expect(page.locator('[data-toc] a', { hasText: 'Ways in' })).toHaveCount(1);
  expect(errors).toEqual([]);
});

test('abstraction ladder: example and rule open in place and fill their rung', async ({ page }) => {
  await page.goto(PAGE);
  const ladder = page.locator('.ways-ladder');
  const fill = (rung: string) => ladder.locator(`.ways-ladder__step[data-rung="${rung}"]`).evaluate((e) => getComputedStyle(e, '::after').transform);
  expect(await fill('plain')).toBe('none'); // the one line is always shown
  expect(await fill('example')).not.toBe('none');
  const example = ladder.locator('details[data-rung="example"]');
  await expect(example.locator('.ways-reveal__body')).toBeHidden();
  await example.locator('summary').click();
  await expect(example.locator('.ways-reveal__body')).toBeVisible();
  await expect(example).toContainText('McNamara v Duncan');
  await expect.poll(() => fill('example')).toBe('none');
  expect(await fill('rule')).not.toBe('none');
});

test('work it out: hint, answer, next, then a link to the quiz', async ({ page }) => {
  await setLevel(page, 'off'); // many steps: no smooth scroll or entrances to wait for
  await page.goto(PAGE);
  const box = await socratic(page);
  const steps = await box.locator('.ways-socratic__dots li').count();
  expect(steps).toBe(5);
  await expect(box.locator('.ways-socratic__count')).toHaveText('Step 1 of 5');
  await box.locator('textarea').fill('Only the chipping');
  const hint = box.getByRole('button', { name: 'Hint' });
  await hint.click();
  await expect(box.locator('.ways-socratic__hint')).toContainText('What act did his consent relate to?');
  await expect(hint).toBeDisabled();
  await expect(box.locator('.ways-socratic__answer')).toHaveCount(0);
  await box.getByRole('button', { name: 'Show answer' }).click();
  await expect(box.locator('.ways-socratic__answer')).toContainText('Dean v Phung');
  await box.getByRole('button', { name: 'Next question' }).click();
  await expect(box.locator('.ways-socratic__count')).toHaveText('Step 2 of 5');
  await expect(box.locator('.ways-socratic__answer')).toHaveCount(0);
  await expect(box.locator('textarea')).toHaveValue('');
  await expect(box.locator('.ways-socratic__ask')).toBeFocused();
  // Ctrl/⌘+Enter in the thought box is the main action.
  await box.locator('textarea').press('Control+Enter');
  await expect(box.locator('.ways-socratic__answer')).toBeVisible();
  for (let k = 2; k < steps; k++) {
    await box.getByRole('button', { name: 'Next question' }).click();
    await box.getByRole('button', { name: 'Show answer' }).click();
  }
  await box.getByRole('button', { name: 'Finish' }).click();
  await expect(box.locator('.ways-socratic__count')).toHaveText('All 5 steps done');
  await expect(box.getByRole('link', { name: 'Quiz me' })).toHaveAttribute('href', `/laws2400/quiz?concept=${CONCEPT}`);
  await box.getByRole('button', { name: 'Start again' }).click();
  await expect(box.locator('.ways-socratic__count')).toHaveText('Step 1 of 5');
  // One accent at a time: the island shows a single primary action.
  await expect(box.locator('.btn--primary')).toHaveCount(1);
});

test('rule checklist: numbered elements tick and clear (no JS needed), chips link to cases', async ({ page }) => {
  await page.goto(PAGE);
  const check = page.locator('.ways-check');
  await expect(check.locator('.ways-check__item')).toHaveCount(5);
  await expect(check.locator('.ways-check__n').first()).toHaveText('1');
  await expect(check.locator('a.chip[href="/cases/mcnamara-v-duncan"]')).toHaveCount(1);
  const reset = check.locator('.ways-check__reset');
  await expect(reset).toHaveCSS('visibility', 'hidden');
  await check.locator('.ways-check__label').nth(1).click();
  await expect(check.locator('.ways-check__box').nth(1)).toBeChecked();
  await expect(reset).toHaveCSS('visibility', 'visible');
  await expect.poll(() => check.locator('.ways-check__mark').nth(1).evaluate((e) => getComputedStyle(e, '::before').transform)).toBe('none');
  await reset.click();
  await expect(check.locator('.ways-check__box').nth(1)).not.toBeChecked();
});

test('mistakes: struck claim beside the correction on wide screens, stacked on phones', async ({ page }) => {
  await page.goto(PAGE);
  const card = page.locator('.ways-mistake').first();
  await expect(card.locator('.ways-mistake__claim s')).toBeVisible();
  await expect(card.locator('.ways-mistake__tag').first()).toHaveText('Mistake');
  await expect(card.locator('.ways-mistake__wrong')).toContainText('Why it is tempting');
  const [w, r] = await Promise.all([card.locator('.ways-mistake__wrong').boundingBox(), card.locator('.ways-mistake__right').boundingBox()]);
  if ((page.viewportSize()?.width ?? 0) >= 1000) expect(Math.abs(w!.y - r!.y)).toBeLessThan(2);
  else expect(r!.y).toBeGreaterThanOrEqual(w!.y + w!.height - 1);
});

test('what-ifs and edge cases: predict first, then the answer opens in place', async ({ page }) => {
  await page.goto(PAGE);
  const first = page.locator('#ways-what-if ~ .ways-group .ways-reveal').first();
  await expect(first.locator('.ways-reveal__cta')).toHaveText('Predict the effect, then open');
  await expect(first.locator('.ways-reveal__body')).toBeHidden();
  await first.locator('summary').click();
  await expect(first.locator('.ways-reveal__body')).toContainText('Effect');
  await expect(first.locator('.ways-reveal__cta')).toBeHidden();
  const transfer = page.locator('.ways-reveal', { hasText: 'New situation' });
  await transfer.locator('summary').click();
  await expect(transfer.locator('.ways-reveal__body')).toContainText('2 cm trim');
});

test('analogy: mapped parts with connectors and labelled break markers', async ({ page }) => {
  await page.goto(PAGE);
  await expect(page.locator('.ways-analogy__row')).toHaveCount(4);
  await expect(page.locator('.ways-analogy__link')).toHaveCount(4);
  const breaks = page.locator('.ways-analogy__breaks');
  await expect(breaks.locator('.ways-analogy__breaks-h')).toHaveText('Where it breaks');
  await expect(breaks.locator('.ways-analogy__breaks-h svg')).toHaveCount(1);
  await expect(breaks.locator('li')).toHaveCount(2);
  await expect(breaks).toHaveCSS('border-top-style', 'dashed');
  await expect(page.locator('.ways-terms dt')).toHaveCount(4);
});

test('storyboard and argument cards render for essay concepts', async ({ page }) => {
  await page.goto('/laws2100/concept/w01-conceptual-analysis');
  const frames = page.locator('.ways-story__frame');
  expect(await frames.count()).toBeGreaterThan(1);
  await expect(frames.first().locator('.ways-story__n')).toHaveText('01');
  await expect(page.locator('.ways-arg dt')).toContainText(['Position', 'Evidence', 'Strongest objection', 'Reply']);
  await page.locator('.ways-story').scrollIntoViewIfNeeded();
  expect(await layoutProblems(page, AIDS_SELECTOR)).toEqual([]);
});

test('evidence trail: unchecked aids say so', async ({ page }) => {
  const url = conceptToVerify();
  test.skip(!url, 'no aids are flagged verify: true');
  await page.goto(url!);
  await expect(page.locator('#ways-in [data-verify]')).toHaveText('Some of this is not yet checked against your materials.');
  await expect(page.locator('#ways-in [data-verify] svg')).toHaveCount(1);
});

test('a concept with no aids renders no Ways in section', async ({ page }) => {
  const bare = conceptWithoutAids();
  test.skip(!bare, 'every concept now has study aids');
  await page.goto(bare!);
  await expect(page.locator('article.prose')).toBeVisible();
  await expect(page.locator('#ways-in')).toHaveCount(0);
});

test('accessible: no axe violations in the section, opened and ticked', async ({ page }) => {
  await setLevel(page, 'off');
  await page.goto(PAGE);
  await socratic(page);
  for (const s of await page.locator('#ways-in details.ways-reveal:visible > summary').all()) await s.click();
  await page.locator('.ways-check__label').first().click();
  await page.locator('.ways-socratic').getByRole('button', { name: 'Hint' }).click();
  const r = await new AxeBuilder({ page }).include('#ways-in').analyze();
  expect(r.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([]);
});

test.describe('motion', () => {
  test('full slides the next step in; calm only fades', async ({ page }) => {
    await setLevel(page, 'full');
    await page.goto(PAGE);
    const box = await socratic(page);
    await box.getByRole('button', { name: 'Show answer' }).click();
    await box.getByRole('button', { name: 'Next question' }).click();
    expect(await box.locator('.ways-socratic__step').evaluate((e) => getComputedStyle(e).animationName)).toBe('ways-slide');
  });

  test('calm keeps fades and drops positional movement', async ({ page }) => {
    await setLevel(page, 'calm');
    await page.goto(PAGE);
    const box = await socratic(page);
    await box.getByRole('button', { name: 'Show answer' }).click();
    expect(await box.locator('.ways-socratic__answer').evaluate((e) => getComputedStyle(e).animationName)).toBe('ways-fade');
    await box.getByRole('button', { name: 'Next question' }).click();
    expect(await box.locator('.ways-socratic__step').evaluate((e) => getComputedStyle(e).animationName)).toBe('ways-fade');
  });

  test('off: disclosures open with no animation', async ({ page }) => {
    await setLevel(page, 'off');
    await page.goto(PAGE);
    const d = page.locator('.ways-ladder details[data-rung="rule"]');
    await d.locator('summary').click();
    expect(await d.locator('.ways-reveal__body').evaluate((e) => getComputedStyle(e).animationName)).toBe('none');
    expect(await page.locator('#ways-in').evaluate((e) => e.getAnimations({ subtree: true }).filter((a) => a.playState === 'running').length)).toBe(0);
  });
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('every part is readable: the steps show as a list, disclosures still open', async ({ page }) => {
    await page.goto(PAGE);
    await expect(page.locator('.ways-socratic-live')).toBeHidden();
    const steps = page.locator('.ways-socratic-static > li');
    await expect(steps).toHaveCount(5);
    await steps.first().locator('summary', { hasText: 'Answer' }).click();
    await expect(steps.first()).toContainText('Dean v Phung');
    await page.locator('.ways-check__label').first().click();
    await expect(page.locator('.ways-check__box').first()).toBeChecked();
  });
});
