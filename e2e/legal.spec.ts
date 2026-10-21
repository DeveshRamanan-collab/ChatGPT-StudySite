// Legal-reasoning tools: the statutory map (/statutes: order, cross-references both ways, unit filter incl. a ?unit=
// link, search), case anatomy (a round of 10 with feedback, tally and recap), fact comparison (side by side, shared
// words marked in both columns, differences) and the argument adversary (stance → write → compare → self-rate, the
// attempt recorded). Content is read from the page rather than hard-coded, except the argue fixture (stubbed aids).
import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { layoutProblems, setLevel, waitForAttempts, type Level } from './helpers';

test.beforeEach(() => test.setTimeout(120_000));
const SHOTS = process.env.LEGAL_SHOTS; // optional: a directory to save review screenshots into

function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on('console', (m) => m.type() === 'error' && !/WebSocket|\[vite\]/.test(m.text()) && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(e.message));
  return errors;
}
async function open(page: Page, path: string, island: string) {
  await page.goto(path, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector(`astro-island[component-url*="${island}"]:not([ssr])`, { timeout: 60_000 });
}
async function shot(page: Page, name: string) {
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/${name}-${page.viewportSize()!.width}.png`, fullPage: false });
}
const cla = (page: Page) => page.locator('section.statute-map__inst', { has: page.locator('h2', { hasText: /^Civil Liability Act 2002 \(NSW\)$/ }) });
const prov = (page: Page, label: string) => cla(page).locator('article.statute-prov', { has: page.locator('.statute-prov__num', { hasText: new RegExp(`^${label}$`) }) });

for (const level of ['full', 'off'] as Level[]) {
  test(`statutes (${level}): instruments A–Z, provisions in numeric order, cross-references both ways`, async ({ page }) => {
    const errors = trackErrors(page);
    await setLevel(page, level);
    await open(page, '/statutes', 'StatuteMap');
    const names = await page.locator('.statute-map__inst-name').allTextContents();
    expect(names.length).toBeGreaterThan(20);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b, 'en-AU')));
    const labels = await cla(page).locator('.statute-prov__num').allTextContents();
    for (const [a, b] of [['s 3B', 's 5'], ['s 5', 's 5A'], ['s 5A', 's 5B'], ['s 5R', 's 27'], ['s 43', 's 43A'], ['s 54', 'ss 55–58']]) {
      expect(labels.indexOf(a), `${a} before ${b}`).toBeLessThan(labels.indexOf(b));
      expect(labels.indexOf(a)).toBeGreaterThanOrEqual(0);
    }
    await expect(prov(page, 's 5B').locator('.statute-prov__gloss')).not.toBeEmpty();
    await expect(prov(page, 's 5B').locator('a.chip--case').first()).toHaveAttribute('href', /^\/cases\/[a-z0-9-]+$/);

    // s 53 refers to s 52; s 52 is referred to by s 53. Following the link focuses the target.
    const to = prov(page, 's 53').locator('[data-rel="to"] a');
    await expect(to.filter({ hasText: /^s 52$/ })).toHaveCount(1);
    await expect(to.filter({ hasText: /^s 3B$/ })).toHaveCount(1);
    await to.filter({ hasText: /^s 52$/ }).click();
    await expect(page).toHaveURL(/#p-civil-liability-act-2002-nsw-s52$/);
    await expect(prov(page, 's 52')).toBeFocused();
    await expect(prov(page, 's 52').locator('[data-rel="from"] a', { hasText: /^s 53$/ })).toHaveCount(1);

    // The text opens in place.
    await prov(page, 's 5B').locator('summary', { hasText: 'Text' }).click();
    await expect(prov(page, 's 5B').locator('.statute-prov__text p')).toContainText('foreseeable');
    await shot(page, `statutes-${level}`);
    expect(await layoutProblems(page)).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test('statutes: unit filter, search, empty state, and a ?unit= link arrives filtered', async ({ page }) => {
  const errors = trackErrors(page);
  await setLevel(page, 'off');
  await open(page, '/statutes', 'StatuteMap');
  const count = page.locator('[data-statute-count]');
  const all = await page.locator('article.statute-prov').count();
  await page.locator('.statute-map__unit', { hasText: 'LAWS2000' }).click();
  await expect(page.locator('.statute-map__unit', { hasText: 'LAWS2000' })).toHaveAttribute('aria-pressed', 'true');
  await expect(cla(page)).toHaveCount(0);
  await expect(page.locator('section.statute-map__inst', { has: page.locator('h2', { hasText: /^UN Charter$/ }) })).toHaveCount(1);
  await expect(count).toContainText(/Showing \d+ of \d+ provisions/);
  expect(await page.locator('article.statute-prov').count()).toBeLessThan(all);

  await page.locator('.statute-map__unit', { hasText: 'All units' }).click();
  await page.locator('#statute-search').fill('foreseeable');
  await expect(prov(page, 's 5B')).toBeVisible();
  expect(await page.locator('article.statute-prov').count()).toBeLessThan(all);
  await page.locator('#statute-search').fill('zzqx nothing here');
  await expect(page.locator('[data-statute-empty]')).toContainText('Nothing matches');
  await page.getByRole('button', { name: 'Show everything' }).click();
  await expect(page.locator('article.statute-prov')).toHaveCount(all);
  expect(await layoutProblems(page)).toEqual([]);

  // Deep link: other units' instruments are hidden before and after hydration.
  await page.goto('/statutes?unit=laws2000', { waitUntil: 'domcontentloaded' });
  await expect(cla(page)).toBeHidden();
  await page.waitForSelector('astro-island[component-url*="StatuteMap"]:not([ssr])', { timeout: 60_000 });
  await expect(page.locator('.statute-map__unit', { hasText: 'LAWS2000' })).toHaveAttribute('aria-pressed', 'true');
  await expect(cla(page)).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.dataset.statuteUnit)).toBeUndefined();
  expect(errors).toEqual([]);
});

for (const level of ['full', 'off'] as Level[]) {
  test(`case anatomy (${level}): a round of 10 with immediate feedback, a running tally and a recap`, async ({ page }) => {
    const errors = trackErrors(page);
    await setLevel(page, level);
    await open(page, '/laws2400/case-anatomy', 'CaseAnatomy');
    await expect(page.getByRole('tab', { name: 'Sort sentences' })).toHaveAttribute('aria-selected', 'true');
    const fieldOf: Record<string, string> = { 'the facts': 'Facts', 'the issue': 'Issue', 'what was held': 'Held', 'the ratio': 'Ratio' };
    let right = 0;
    for (let n = 1; n <= 10; n++) {
      await expect(page.locator('.anatomy__status')).toContainText(`Sentence ${n} of 10`);
      const sentence = (await page.locator('[data-anatomy-sentence]').textContent())!.trim();
      expect(sentence.split(/\s+/).length).toBeGreaterThanOrEqual(5);
      // Alternate between keys and clicks; feedback is immediate and names the field.
      if (n % 2) await page.keyboard.press(String(((n - 1) % 4) + 1));
      else await page.locator('.anatomy__options .option').nth(n % 4).click();
      const fb = page.locator('#anatomy-feedback');
      await expect(fb).toBeVisible();
      await expect(fb.locator('a', { hasText: 'Open the case card' })).toHaveAttribute('href', /^\/cases\/[a-z0-9-]+$/);
      const phrase = (await fb.locator('summary').textContent())!.replace('Read all of ', '').trim();
      expect(Object.keys(fieldOf)).toContain(phrase);
      await expect(page.locator('.anatomy__options .option[data-state="correct"]')).toHaveText(new RegExp(fieldOf[phrase]));
      if ((await fb.getAttribute('data-result')) === 'right') right++;
      await fb.locator('summary').click();
      const whole = (await fb.locator('.anatomy__whole p').textContent())!.replace(/\s+/g, ' ');
      expect(whole).toContain(sentence);
      await expect(page.locator('[data-anatomy-tally]')).toHaveText(`${right} of ${n} right so far`);
      if (n === 1) {
        await shot(page, `anatomy-${level}`);
        expect(await layoutProblems(page)).toEqual([]);
        await page.locator('.anatomy__next button').press('Enter');
      } else {
        await page.keyboard.press('ArrowRight');
      }
    }
    const recap = page.locator('[data-anatomy-recap]');
    await expect(recap).toContainText(`${right} of 10 sorted right.`);
    await expect(recap.locator('.anatomy__field')).not.toHaveCount(0);
    expect(await layoutProblems(page)).toEqual([]);
    await recap.getByRole('button', { name: 'Another round' }).click();
    await expect(page.locator('.anatomy__status')).toContainText('Sentence 1 of 10');
    expect(errors).toEqual([]);
  });
}

test('fact comparison: problem and case side by side, shared words marked in both, differences listed', async ({ page }) => {
  const errors = trackErrors(page);
  await setLevel(page, 'off');
  await open(page, '/laws2400/case-anatomy', 'CaseAnatomy');
  await page.getByRole('tab', { name: 'Compare facts' }).click();
  const cmp = page.locator('[data-fact-cmp]');
  await expect(cmp).toBeVisible();
  await expect(cmp.locator('.fact-cmp__note')).toContainText('not legal analysis');
  expect(await cmp.locator('[data-fact-cmp-problem] option').count()).toBeGreaterThan(1);
  expect(await cmp.locator('[data-fact-cmp-case] option').count()).toBeGreaterThan(0);
  await expect(cmp.locator('[data-fact-cmp-side="problem"] .fact-cmp__item').first()).toBeVisible();
  await expect(cmp.locator('[data-fact-cmp-side="case"] .fact-cmp__item').first()).toBeVisible();
  await expect(cmp.locator('[data-fact-cmp-diff]')).toBeVisible();

  // Find a problem/case pair with shared words; a chosen word is marked in both columns.
  const problems = await cmp.locator('[data-fact-cmp-problem] option').evaluateAll((os) => os.map((o) => (o as HTMLOptionElement).value));
  let found = false;
  for (const p of problems.slice(0, 8)) {
    await cmp.locator('[data-fact-cmp-problem]').selectOption(p);
    if (await cmp.locator('.fact-cmp__term').count()) { found = true; break; }
  }
  expect(found).toBe(true);
  const term = cmp.locator('.fact-cmp__term').first();
  await term.click();
  await expect(term).toHaveAttribute('aria-pressed', 'true');
  await expect(cmp.locator('[data-fact-cmp-side="problem"] mark[data-on]').first()).toBeVisible();
  await expect(cmp.locator('[data-fact-cmp-side="case"] mark[data-on]').first()).toBeVisible();
  await expect(cmp.locator('[data-fact-cmp-side="case"] a', { hasText: 'Open the case card' })).toHaveAttribute('href', /^\/cases\/[a-z0-9-]+$/);
  await shot(page, 'compare');
  expect(await layoutProblems(page)).toEqual([]);
  expect(errors).toEqual([]);
});

const AIDS = {
  unit: 'laws2400',
  flows: [],
  facts: {},
  aids: {
    'laws2400-w02-battery': {
      concept: 'laws2400-w02-battery', unit: 'laws2400', week: 'laws2400-w02', plain: 'p', terms: [], misconceptions: [], socratic: [], elements: [], 'what-if': [], boundary: [], transfer: [], storyboard: [], sources: ['fixture'], verify: false,
      objections: [
        { position: 'Fixture position one.', evidence: 'Fixture evidence one.', objection: 'Fixture objection one.', reply: 'Fixture reply one.' },
        { position: 'Fixture position two.', evidence: 'Fixture evidence two.', objection: 'Fixture objection two.' },
      ],
    },
    'laws2400-w04-self-defence-common-law-and-cla': {
      concept: 'laws2400-w04-self-defence-common-law-and-cla', unit: 'laws2400', week: 'laws2400-w04', plain: 'p', terms: [], misconceptions: [], socratic: [], elements: [], 'what-if': [], boundary: [], transfer: [], storyboard: [], sources: [], verify: true,
      objections: [{ position: 'Fixture position three.', evidence: 'Fixture evidence three.', objection: 'Fixture objection three.' }],
    },
  },
};

for (const level of ['full', 'off'] as Level[]) {
  test(`argue (${level}): stance first, then write, compare with the sources, self-rate; the attempt is recorded`, async ({ page }) => {
    const errors = trackErrors(page);
    await setLevel(page, level);
    await page.route('**/data/laws2400/aids.json', (r) => r.fulfill({ json: AIDS }));
    await open(page, '/laws2400/argue', 'Adversary');
    const pick = page.locator('[data-argue-pick]');
    await expect(pick.locator('option')).toHaveCount(3);
    await expect(page.locator('.argue__position')).toHaveText('Fixture position one.');
    await expect(page.locator('.argue__evidence')).toContainText('Fixture evidence one.');
    await expect(page.locator('[data-argue-text]')).toHaveCount(0);
    await expect(page.getByText('Fixture objection one.')).toHaveCount(0);

    await page.keyboard.press('2'); // I'd attack it
    await expect(page.locator('.argue__stance .option').nth(1)).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('.argue__stance .option').first()).toBeDisabled();
    const box = page.locator('[data-argue-text]');
    await expect(box).toBeFocused();
    await expect(page.locator('.argue__label')).toHaveText('What is the strongest objection to this position?');
    const compare = page.getByRole('button', { name: 'Compare with the sources' });
    await expect(compare).toBeDisabled();
    await box.fill('It ignores the plaintiff’s consent.');
    await expect(compare).toBeEnabled();
    await shot(page, `argue-write-${level}`);
    await compare.click();
    await expect(page.locator('[data-argue-objection]')).toHaveText('Fixture objection one.');
    await expect(page.locator('[data-argue-reply]')).toHaveText('Fixture reply one.');
    await expect(box).toBeDisabled();
    await page.keyboard.press('2'); // Partly
    await expect(page.locator('[data-argue-saved]')).toHaveText('Saved as partly.');
    await waitForAttempts(page, 1);
    const attempt = await page.evaluate(() => new Promise<Record<string, unknown>>((resolve) => {
      const req = indexedDB.open('studysite');
      req.onsuccess = () => {
        const all = req.result.transaction('attempts').objectStore('attempts').getAll();
        all.onsuccess = () => resolve((all.result as Record<string, unknown>[]).find((a) => String(a.questionId).startsWith('argue:'))!);
      };
    }));
    expect(attempt).toMatchObject({ questionId: 'argue:laws2400-w02-battery:0', type: 'short', correct: null, score: 0.5, mode: 'argue', concept: 'laws2400-w02-battery', unit: 'laws2400' });
    expect(attempt.answer).toEqual({ stance: 'attack', text: 'It ignores the plaintiff’s consent.' });
    await shot(page, `argue-reveal-${level}`);
    expect(await layoutProblems(page)).toEqual([]);

    // Next: the second objection, which the sources give no reply to; the picker marks the first as argued.
    await page.getByRole('button', { name: /Next position/ }).click();
    await expect(page.locator('.argue__position')).toHaveText('Fixture position two.');
    await expect(pick.locator('option').first()).toContainText('argued: partly');
    await page.locator('.argue__stance .option').first().click(); // I'd defend it
    await expect(page.locator('.argue__label')).toHaveText('What is the strongest objection to this position, and how would you answer it?');
    await page.locator('[data-argue-text]').fill('The objection is that consent was absent; the answer is the evidence.');
    await page.locator('[data-argue-text]').press('ControlOrMeta+Enter');
    await expect(page.locator('[data-argue-noreply]')).toHaveText('Your sources give no reply to this objection.');
    expect(errors).toEqual([]);
  });
}

test('argue: a unit without objections says so quietly; ?concept= opens that concept', async ({ page }) => {
  const errors = trackErrors(page);
  await setLevel(page, 'off');
  await page.route('**/data/laws2400/aids.json', (r) => r.fulfill({ json: AIDS }));
  await open(page, '/laws2400/argue?concept=laws2400-w04-self-defence-common-law-and-cla', 'Adversary');
  await expect(page.locator('.argue__position')).toHaveText('Fixture position three.');
  await expect(page.locator('.legal-check')).toContainText('Not yet verified');
  await page.unroute('**/data/laws2400/aids.json');
  await page.route('**/data/laws2400/aids.json', (r) => r.fulfill({ json: { unit: 'laws2400', aids: {}, flows: [], facts: {} } }));
  await open(page, '/laws2400/argue', 'Adversary');
  await expect(page.locator('[data-argue-empty]')).toContainText('No positions with objections for LAWS2400 yet.');
  expect(errors).toEqual([]);
});

test('axe: the three tools have no violations in their content (light and dark)', async ({ page }) => {
  await setLevel(page, 'off');
  await page.route('**/data/laws2400/aids.json', (r) => r.fulfill({ json: AIDS }));
  const tags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];
  const axe = async (label: string) => {
    await page.waitForTimeout(400); // let enter fades finish so colours are measured at rest
    const r = await new AxeBuilder({ page }).include('#main').withTags(tags).analyze();
    return r.violations.flatMap((v) => v.nodes.map((n) => `${label}: ${v.id} ${n.target.join(' ')} ${n.failureSummary?.split('\n').slice(1, 2).join('') ?? ''}`));
  };
  for (const theme of ['light', 'dark']) {
    await page.addInitScript((t) => localStorage.setItem('studysite:theme', t), theme);
    await open(page, '/statutes', 'StatuteMap');
    expect(await axe(`${theme} statutes`)).toEqual([]);
    await open(page, '/laws2400/case-anatomy', 'CaseAnatomy');
    await page.keyboard.press('1');
    await expect(page.locator('#anatomy-feedback')).toBeVisible();
    expect(await axe(`${theme} anatomy`)).toEqual([]);
    await page.getByRole('tab', { name: 'Compare facts' }).click();
    await page.locator('.fact-cmp__term').first().click();
    expect(await axe(`${theme} compare`)).toEqual([]);
    await open(page, '/laws2400/argue', 'Adversary');
    await page.keyboard.press('1');
    await page.locator('[data-argue-text]').fill('An answer.');
    await page.getByRole('button', { name: 'Compare with the sources' }).click();
    expect(await axe(`${theme} argue`)).toEqual([]);
  }
});
