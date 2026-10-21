// New practice modes: Tell apart (?mode=contrast), Drills (?mode=drills), Where am I? (?mode=diagnostic).
import { test, expect, type Page } from '@playwright/test';
import { layoutProblems, setLevel, waitForAttempts } from './helpers';

const shot = (page: Page, name: string, project: string) => page.screenshot({ path: `reports/review/drills-${project}-${name}.png`, fullPage: true });

function consoleErrors(page: Page) {
  const errors: string[] = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));
  return errors;
}

const dbRows = (page: Page, store: string) =>
  page.evaluate((s) => new Promise<Record<string, unknown>[]>((resolve) => {
    const open = indexedDB.open('studysite');
    open.onsuccess = () => {
      const r = open.result.transaction(s).objectStore(s).getAll();
      r.onsuccess = () => { open.result.close(); resolve(r.result); };
    };
  }), store);

// Three real laws2400 concepts across two weeks, each with one item of every drill kind.
const C = ['laws2400-w01-trespass-directness', 'laws2400-w01-trespass-fault-and-onus', 'laws2400-w02-battery'];
const aid = (concept: string, k: number) => ({
  concept, unit: 'laws2400', week: concept.slice(0, 12), plain: `True statement ${k}: a plain account of this idea.`, formal: `Formal statement ${k}.`,
  terms: [], misconceptions: [{ claim: `Myth ${k}: a tempting but wrong claim.`, tempting: `Tempting ${k}.`, correction: `Correction ${k}.` }],
  socratic: [], elements: [], 'what-if': [{ change: `Change ${k}: one material fact is different.`, effect: `Effect ${k}.` }],
  boundary: [{ text: `Edge ${k}: a case at the border.`, why: `Why ${k}.` }], transfer: [{ scenario: `Scenario ${k}: a new set of facts.`, answer: `Model ${k}.` }],
  objections: [], storyboard: [], sources: ['fixture'], verify: false,
});
const AIDS = { unit: 'laws2400', aids: Object.fromEntries(C.map((c, k) => [c, aid(c, k)])), flows: [], facts: {} };

test('tell apart: name the idea first (instant feedback with both titles), then answer it; a round ends in a recap', async ({ page }, info) => {
  test.setTimeout(120_000); // long walkthrough
  const errors = consoleErrors(page);
  await page.goto(`/laws2400/quiz/?mode=contrast&concept=${C[0]}`);
  const wrap = page.locator('.tell-apart');
  await expect(wrap).toBeVisible({ timeout: 15_000 });
  await expect(page.locator('.quiz-modes__bar .chip[aria-pressed="true"]')).toHaveText('Tell apart');
  expect((await wrap.getAttribute('data-group'))!.split(' ')).toContain(C[0]);
  const bank = await page.evaluate(async () => (await fetch('/data/laws2400/questions.json')).json());
  const conceptOf = (id: string) => bank.questions.find((q: { id: string }) => q.id === id).concept as string;
  const titleOf = (c: string) => bank.concepts[c].title as string;

  // Question 1: name the right idea.
  const which = page.locator('.tell-apart__which');
  await expect(which).toBeVisible();
  const q1 = (await which.getAttribute('data-question'))!;
  await expect(page.locator('.tell-apart__which .qcard__meta')).not.toContainText(titleOf(conceptOf(q1))); // no give-away
  expect(await layoutProblems(page)).toEqual([]);
  await shot(page, 'contrast-which', info.project.name);
  await which.locator(`.option[data-idea="${conceptOf(q1)}"]`).click();
  await expect(which.locator('.explain[data-named="right"]')).toContainText(titleOf(conceptOf(q1)));
  const other = (await wrap.getAttribute('data-group'))!.split(' ').find((c) => c !== conceptOf(q1))!;
  await expect(which.locator('.explain')).toContainText(titleOf(other));
  await page.getByRole('button', { name: /^Now answer it/ }).click();
  await expect(page.locator(`.qcard[data-question="${q1}"] .confidence`)).toBeVisible();
  await page.keyboard.press('g');
  await page.keyboard.press('1');
  await expect(page.locator('.qcard .explain')).toBeVisible();
  await page.getByRole('button', { name: /^Next/ }).click();

  // Question 2: name a wrong idea; both titles shown.
  await expect(page.locator('.quiz__count')).toHaveText(/^Question 2 of \d$/);
  const q2 = (await which.getAttribute('data-question'))!;
  const wrongIdea = await which.locator(`.option:not([data-idea="${conceptOf(q2)}"])`).first().getAttribute('data-idea');
  await which.locator(`.option[data-idea="${wrongIdea}"]`).click();
  await expect(which.locator(`.option[data-idea="${wrongIdea}"]`)).toHaveAttribute('data-state', 'incorrect');
  await expect(which.locator(`.option[data-idea="${conceptOf(q2)}"]`)).toHaveAttribute('data-state', 'correct');
  await expect(which.locator('.explain[data-named="wrong"]')).toContainText(titleOf(conceptOf(q2)));
  await expect(which.locator('.explain')).toContainText(titleOf(wrongIdea!));
  await shot(page, 'contrast-feedback', info.project.name);

  // The rest of the round by keyboard: 1 (idea) → Enter → G → 1 → Enter.
  await page.keyboard.press('Enter');
  const n = Number((await page.locator('.quiz__count').textContent())!.match(/of (\d)/)![1]);
  for (let k = 2; k <= n; k++) {
    if (k > 2) {
      await expect(page.locator('.quiz__count')).toHaveText(`Question ${k} of ${n}`);
      await page.keyboard.press('1');
      await expect(which.locator('.explain')).toBeVisible();
      await page.keyboard.press('Enter');
    }
    await expect(page.locator('.qcard .confidence')).toBeVisible();
    await page.keyboard.press('g');
    await page.keyboard.press('1');
    await expect(page.locator('.qcard .explain')).toBeVisible();
    await page.keyboard.press('Enter');
  }
  await expect(page.locator('.tell-apart__recap')).toContainText(`answered`);
  await expect(page.locator('.tell-apart__recap')).toContainText(`of ${n} times`);
  await waitForAttempts(page, n);
  const rows = await dbRows(page, 'attempts');
  expect(rows.every((a) => a.mode === 'contrast')).toBe(true);
  expect(await layoutProblems(page)).toEqual([]);
  await shot(page, 'contrast-recap', info.project.name);
  expect(errors).toEqual([]);
});

test('tell apart: a unit without contrast edges says so and offers Mixed', async ({ page }) => {
  await page.route('**/data/laws2400/questions.json', async (route) => {
    const json = await (await route.fetch()).json();
    for (const c of Object.values(json.concepts) as { contrastsWith?: string[] }[]) delete c.contrastsWith;
    await route.fulfill({ json });
  });
  await page.goto('/laws2400/quiz/?mode=contrast');
  await expect(page.locator('.tell-apart--empty')).toContainText('nothing to tell apart', { timeout: 15_000 });
  await page.getByRole('button', { name: 'Practise Mixed instead' }).click();
  await expect(page).toHaveURL(/mode=mixed/);
  await expect(page.locator('.qcard')).toBeVisible();
});

test('drills: a unit without study aids says so plainly', async ({ page }) => {
  await page.route('**/data/laws2400/aids.json', (r) => r.fulfill({ json: { unit: 'laws2400', aids: {}, flows: [], facts: {} } }));
  await page.goto('/laws2400/quiz/?mode=drills');
  await expect(page.locator('[data-drills-empty]')).toHaveText('Drills arrive as study aids are added for this unit.', { timeout: 15_000 });
  await expect(page.locator('.quiz-modes__bar .chip[aria-pressed="true"]')).toHaveText('Drills');
});

test('drills: four kinds mixed, recorded as drill attempts, never requeued (motion off)', async ({ page }, info) => {
  test.setTimeout(120_000); // long walkthrough
  await setLevel(page, 'off');
  const errors = consoleErrors(page);
  await page.route('**/data/laws2400/aids.json', (r) => r.fulfill({ json: AIDS }));
  await page.goto('/laws2400/quiz/?mode=drills');
  await expect(page.locator('.drill__card')).toBeVisible({ timeout: 15_000 });
  const kinds = new Set<string>();
  const weeks: string[] = [];
  for (let k = 1; k <= 8; k++) {
    await expect(page.locator('.quiz__count')).toHaveText(`Drill ${k} of 8`);
    const card = page.locator('.drill__card');
    const kind = (await card.getAttribute('data-kind'))!;
    kinds.add(kind);
    weeks.push((await card.getAttribute('data-drill'))!.split(':')[2].slice(0, 12));
    if (kind === 'spot') {
      await expect(card.locator('.qcard__meta')).not.toContainText('Trespass'); // concept withheld until answered
      await page.keyboard.press('s');
      await card.locator('.option', { hasText: 'True statement' }).first().click(); // deliberately wrong while sure
      await expect(card.locator('.explain[data-result="wrong"]')).toContainText('Correction');
      await expect(card.locator('.explain')).toContainText('Tempting');
      await expect(card.locator('.option[data-state="correct"]')).toContainText('Myth');
    } else if (kind === 'whatif') {
      await expect(card.getByRole('button', { name: 'Reveal' })).toBeDisabled();
      await card.locator('.drill__input').fill('The outcome flips.');
      await card.locator('.drill__input').press('Enter');
      await expect(card.locator('.drill__reveal')).toContainText('Effect');
      await expect(card.locator('.drill__reveal')).toContainText('The outcome flips.');
      await page.keyboard.press('2');
    } else if (kind === 'edge') {
      await expect(card.locator('.drill__think')).toHaveText('In or out? Decide before you look.');
      await card.getByRole('button', { name: /^Show why/ }).click();
      await expect(card.locator('.drill__reveal')).toContainText('Why');
      await card.getByRole('button', { name: /^Right/ }).click();
    } else {
      await card.locator('.drill__input').fill('Apply the rule to the new facts.');
      await card.getByRole('button', { name: 'Show the model answer' }).click();
      await expect(card.locator('.drill__reveal')).toContainText('Model');
      await page.keyboard.press('3');
    }
    if (k === 1 || kind !== 'spot') expect(await layoutProblems(page)).toEqual([]);
    if (k <= 4) { await page.waitForTimeout(250); await shot(page, `drill-${kind}`, info.project.name); } // let the reveal fade settle
    await card.getByRole('button', { name: /^Next/ }).click();
  }
  expect([...kinds].sort()).toEqual(['edge', 'spot', 'transfer', 'whatif']);
  for (let k = 1; k < weeks.length; k++) expect(weeks[k]).not.toBe(weeks[k - 1]); // interleaved by week
  await expect(page.locator('.drill__recap')).toContainText('8 drills:');

  await waitForAttempts(page, 8);
  const attempts = await dbRows(page, 'attempts');
  expect(attempts).toHaveLength(8);
  expect(attempts.every((a) => /^drill:(spot|whatif|edge|transfer):laws2400-w0[12]-[a-z-]+:\d+$/.test(a.questionId as string) && a.mode === 'drill')).toBe(true);
  const spot = attempts.filter((a) => (a.questionId as string).startsWith('drill:spot:'));
  expect(spot.every((a) => a.type === 'mcq' && a.correct === false && a.confidence === 'sure')).toBe(true);
  const rated = attempts.filter((a) => !(a.questionId as string).startsWith('drill:spot:'));
  expect(rated.every((a) => a.type === 'short' && a.correct === null && [0, 0.5, 1].includes(a.score as number))).toBe(true);
  expect((await dbRows(page, 'requeue')).filter((r) => (r.itemId as string).startsWith('drill:'))).toEqual([]);
  expect(errors).toEqual([]);
});

test('where am I: one question per week, then a starting map linking every week', async ({ page }, info) => {
  test.setTimeout(120_000); // long walkthrough
  const errors = consoleErrors(page);
  await page.goto('/laws2400/quiz/?mode=diagnostic');
  const diag = page.locator('.diagnostic');
  await expect(diag).toBeVisible({ timeout: 15_000 });
  const n = Number(await diag.getAttribute('data-diagnostic'));
  const bank = await page.evaluate(async () => (await fetch('/data/laws2400/questions.json')).json());
  expect(n).toBe(bank.weeks.length);
  const seenWeeks: string[] = [];
  for (let k = 1; k <= n; k++) {
    await expect(page.locator('.quiz__count')).toHaveText(`Question ${k} of ${n}`);
    const id = (await page.locator('.qcard[data-question]').getAttribute('data-question'))!;
    const q = bank.questions.find((x: { id: string }) => x.id === id);
    expect(['mcq', 'truefalse']).toContain(q.type);
    seenWeeks.push(q.week ?? bank.concepts[q.concept].week);
    await page.keyboard.press('g');
    await page.keyboard.press('1');
    await expect(page.locator('.qcard .explain')).toBeVisible();
    if (k === 1) await shot(page, 'diagnostic-question', info.project.name);
    await page.getByRole('button', { name: /^Next/ }).click();
  }
  expect(seenWeeks).toEqual(bank.weeks.map((w: { id: string }) => w.id));
  const map = page.locator('.diagnostic__map');
  await expect(map).toBeVisible();
  await expect(map.locator('.diagnostic__row')).toHaveCount(n);
  for (let k = 0; k < n; k++) {
    const row = map.locator('.diagnostic__row').nth(k);
    await expect(row).toHaveAttribute('data-result', /^(right|wrong)$/);
    await expect(row.locator('a')).toHaveAttribute('href', `/laws2400/week/${bank.weeks[k].number}`);
  }
  await expect(map.locator('.diagnostic__sum')).toContainText(`of ${n} weeks`);
  expect(await layoutProblems(page)).toEqual([]);
  await map.scrollIntoViewIfNeeded();
  await shot(page, 'diagnostic-map', info.project.name);
  expect(errors).toEqual([]);
});
