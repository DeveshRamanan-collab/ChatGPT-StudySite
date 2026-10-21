import { test, expect, type Page } from '@playwright/test';
import { layoutProblems, setLevel, waitForAttempts } from './helpers';

// Practice feedback inside the quiz: kind of error + common mistakes + next steps (MCQ), the hint ladder (short and
// long answers) and the IRAC self-check (problem questions). Bank and aids are stubbed so every path is deterministic.
const DIRECT = 'laws2400-w01-trespass-directness'; // dependsOn intentional-torts-classification; contrastsWith fault-and-onus
const PLAIN = 'laws2400-w01-defining-tort-law'; // no edges

const rubric = [
  { id: 'i', criterion: 'Identifies the breach issue', marks: 2, 'top-band': 'States the issue precisely.', 'margin-note': 'One sentence.', authorities: [] },
  { id: 'l', criterion: 'States the foreseeable and not insignificant threshold', marks: 3, 'top-band': 'States s 5B(1) accurately.', 'margin-note': 'Threshold first.', authorities: [] },
  { id: 'a', criterion: 'Weighs probability, seriousness and burden', marks: 5, 'top-band': 'Weighs each factor against the facts.', 'margin-note': 'Use the facts.', authorities: [] },
];
const model = 'The issue is whether the council breached its duty. Under s 5B the risk must be foreseeable and not insignificant. Probability was high and the burden low, so breach is likely.';

const mcq = (id: string, concept: string) => ({
  id, unit: 'laws2400', concept, type: 'mcq', difficulty: 2, stem: `Fixture stem ${id}?`,
  options: [
    { text: `Right answer ${id}`, correct: true, why: 'Because the fixture says so.' },
    { text: `Wrong answer ${id}`, correct: false, why: 'Tempting because it sounds right.' },
  ],
});
const short = { id: 'fixture-short', unit: 'laws2400', concept: DIRECT, type: 'short', difficulty: 2, prompt: 'Explain the directness requirement.', model, rubric };
const long = { id: 'fixture-long', unit: 'laws2400', concept: DIRECT, type: 'long', tier: 'full', template: 'ilac', difficulty: 3, timer: 40, rubric, model, steps: [],
  prompt: 'A council leaves a known pothole unrepaired for six months. Pat trips at night and breaks her wrist. Advise Pat on breach.' };

const aid = {
  concept: DIRECT, unit: 'laws2400', week: 'laws2400-w01', plain: 'Trespass needs a direct interference.', terms: [{ term: 'Directness', gloss: 'Immediate consequence.' }],
  misconceptions: [{ claim: 'Any harm caused by the defendant is a trespass.', tempting: 'Harm feels like interference.', correction: 'Only direct, immediate interference is trespass; consequential harm is action on the case.' }],
  socratic: [{ ask: 'Did the act itself touch the plaintiff, or did harm follow later?', hint: 'Think of the log thrown versus the log left on the road.', answer: 'Direct means immediate.' }],
  elements: [{ name: 'Direct interference', test: 'Immediate', cases: [], authorities: [] }, { name: 'Voluntary act', test: 'Willed', cases: [], authorities: [] }],
  'what-if': [], boundary: [], transfer: [], objections: [], storyboard: [], sources: [], verify: false,
};
const facts = {
  question: 'fixture-long', unit: 'laws2400', verify: false,
  parties: [{ name: 'Pat', role: 'plaintiff' }],
  issues: [{ id: 'breach', label: 'Breach of duty' }],
  facts: [
    { text: 'The council knew of the pothole for six months.', weight: 'essential', kind: 'mental', issues: ['breach'] },
    { text: 'A warning sign about roadworks stood beside the pothole.', weight: 'essential', kind: 'context', issues: ['breach'] },
    { text: 'Pat was walking to the library.', weight: 'background', kind: 'context', issues: [] },
  ],
};

async function stub(page: Page, questions: object[], aids: Record<string, object> = {}, factsFor: Record<string, object> = {}) {
  let bank: { questions: object[] } | null = null;
  await page.route('**/data/laws2400/questions.json', async (route) => {
    try {
      if (!bank) {
        bank = await (await route.fetch()).json();
        bank!.questions = questions;
      }
      await route.fulfill({ json: bank });
    } catch { /* the page closed while the bank was in flight (lazy loads at the end of a test) */ }
  });
  await page.route('**/data/laws2400/aids.json', (r) => r.fulfill({ json: { unit: 'laws2400', aids, flows: [], facts: factsFor } }));
}
test.afterEach(async ({ page }) => { await page?.unrouteAll({ behavior: 'ignoreErrors' }); }); // page is null if newPage timed out

function watchErrors(page: Page) {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
    if (/\[vite\] (page reload|hot updated)/.test(m.text())) console.log(`dev server: ${m.text()}`); // other agents' edits
  });
  return errors;
}

/** Hints saved on the question's first stored attempt (polled: tolerant of a dev-server reload mid-read). */
const savedHints = (page: Page, id: string) =>
  expect.poll(async () => {
    try {
      return await page.evaluate((qid) => new Promise<number | undefined>((resolve) => {
        const open = indexedDB.open('studysite');
        open.onsuccess = () => {
          const r = open.result.transaction('attempts').objectStore('attempts').getAll();
          r.onsuccess = () => { open.result.close(); resolve(r.result.find((a: { questionId: string }) => a.questionId === qid)?.hints); };
        };
        open.onerror = () => resolve(undefined);
      }), id);
    } catch { return undefined; }
  });

test('wrong + sure: misconception line, common mistakes on request, practise / contrast / prerequisite links', async ({ page }) => {
  const errors = watchErrors(page);
  await stub(page, [mcq('fx-1', DIRECT)], { [DIRECT]: aid });
  await page.goto('/laws2400/quiz/');
  await expect(page.locator('.qcard')).toBeVisible();
  await page.keyboard.press('s');
  await page.getByRole('button', { name: /Wrong answer fx-1/ }).click();

  const panel = page.locator('.explain');
  await expect(panel.locator('.practice-diag')).toHaveAttribute('data-kind', 'misconception');
  await expect(panel.locator('.practice-diag')).toContainText('A misconception.');

  const mistakes = panel.locator('details.practice-mistakes');
  await expect(mistakes).toBeVisible();
  await expect(mistakes.locator('.practice-mistakes__claim')).toBeHidden(); // disclosed only when asked
  await mistakes.locator('summary').click();
  await expect(mistakes.locator('.practice-mistakes__claim')).toHaveText('Any harm caused by the defendant is a trespass.');
  await expect(mistakes).toContainText('Why it’s tempting');
  await expect(mistakes).toContainText('Only direct, immediate interference is trespass');

  const after = panel.locator('.after-wrong');
  await expect(after.locator('[data-after="practise"]')).toHaveAttribute('href', `/laws2400/quiz?concept=${DIRECT}`);
  await expect(after.locator('[data-after="contrast"]')).toHaveText('Tell it apart from Trespass — fault and the onus of proof');
  await expect(after.locator('[data-after="contrast"]')).toHaveAttribute('href', `/laws2400/quiz?mode=contrast&concept=${DIRECT}`);
  // The prerequisite is unseen, so it is offered as the foundation to repair.
  await expect(after.locator('[data-after="prereq"]')).toHaveText('Shaky foundation? Classifying intentional torts — trespass and action on the case comes first');
  await expect(after.locator('[data-after="prereq"]')).toHaveAttribute('href', '/laws2400/concept/w01-intentional-torts-classification');

  expect(await layoutProblems(page, '.btn, .chip, .option, .after-wrong__link, .practice-mistakes__summary')).toEqual([]);
  expect(errors).toEqual([]);
});

test('wrong + unsure is half-known, a guess is a gap; no aid → no common mistakes; no edges → practise only', async ({ page }) => {
  await stub(page, [mcq('fx-a', PLAIN), mcq('fx-b', PLAIN)]);
  await page.goto('/laws2400/quiz/');
  for (const [key, kind] of [['u', 'half-known'], ['g', 'gap']] as const) {
    const card = page.locator('.qcard[data-question]');
    await expect(card).toBeVisible();
    const id = await card.getAttribute('data-question');
    await page.keyboard.press(key);
    await page.getByRole('button', { name: new RegExp(`Wrong answer ${id}`) }).click();
    await expect(page.locator('.practice-diag')).toHaveAttribute('data-kind', kind);
    await expect(page.locator('.after-wrong__link')).toHaveCount(1);
    await expect(page.locator('.practice-mistakes')).toHaveCount(0);
    await page.getByRole('button', { name: /^Next/ }).click();
  }
});

test('a right answer shows none of it', async ({ page }) => {
  await stub(page, [mcq('fx-r', DIRECT)], { [DIRECT]: aid });
  await page.goto('/laws2400/quiz/');
  await expect(page.locator('.qcard')).toBeVisible();
  await page.keyboard.press('u');
  await page.getByRole('button', { name: /Right answer fx-r/ }).click();
  await expect(page.locator('.explain')).toContainText('Right.');
  await expect(page.locator('.practice-diag, .practice-mistakes, .after-wrong')).toHaveCount(0);
});

test('short answer: hint ladder opens four rungs one at a time; hints are saved and reported', async ({ page }) => {
  const errors = watchErrors(page);
  await stub(page, [short], { [DIRECT]: aid });
  await page.goto('/laws2400/quiz/?type=short');
  const ladder = page.locator('.hint-ladder');
  const btn = ladder.getByRole('button', { name: 'Hint' });
  await expect(btn).toBeEnabled();
  await expect(btn).not.toHaveAttribute('aria-disabled', 'true');
  await expect(ladder.locator('.hint-ladder__rung')).toHaveCount(0);

  await btn.click();
  await expect(ladder.locator('.hint-ladder__count')).toHaveText('Hint 1 of 4');
  await expect(ladder.locator('[data-rung="socratic"]')).toContainText('Did the act itself touch the plaintiff');
  await expect(ladder.locator('[data-rung="socratic"]')).toContainText('the log thrown versus the log left');
  await ladder.getByRole('button', { name: 'Next hint' }).click();
  await expect(ladder.locator('.hint-ladder__count')).toHaveText('Hint 2 of 4');
  await expect(ladder.locator('[data-rung="cover"]')).toContainText('Direct interference');
  await expect(ladder.locator('[data-rung="cover"]')).toContainText('Voluntary act');
  await ladder.getByRole('button', { name: 'Next hint' }).click();
  await expect(ladder.locator('[data-rung="rubric"]')).toContainText('Weighs probability, seriousness and burden');
  await ladder.getByRole('button', { name: 'Next hint' }).click();
  await expect(ladder.locator('.hint-ladder__count')).toHaveText('Hint 4 of 4');
  await expect(ladder.locator('[data-rung="opening"] .hint-ladder__opening')).toHaveText('The issue is whether the council breached its duty.');
  const done = ladder.getByRole('button', { name: 'No more hints' });
  await expect(done).toHaveAttribute('aria-disabled', 'true');
  await done.click({ force: true });
  await expect(ladder.locator('.hint-ladder__rung')).toHaveCount(4);
  expect(await layoutProblems(page)).toEqual([]);

  await page.locator('.sa__editor').fill('Trespass needs a direct interference, so the act itself must cause the contact.');
  await page.getByRole('radio', { name: /Unsure/ }).click();
  await page.getByRole('button', { name: 'Compare with the model' }).click();
  await page.getByRole('button', { name: 'Save my mark' }).click();
  await expect(page.locator('.sa__saved')).toContainText('Answered with 4 hints.');
  await waitForAttempts(page, 1);
  await savedHints(page, 'fixture-short').toBe(4);
  expect(errors).toEqual([]);
});

test('short answer without an aid: the ladder skips to the marking criteria and the opening sentence', async ({ page }) => {
  await stub(page, [short]);
  await page.goto('/laws2400/quiz/?type=short');
  const ladder = page.locator('.hint-ladder');
  await ladder.getByRole('button', { name: 'Hint' }).click();
  await expect(ladder.locator('.hint-ladder__count')).toHaveText('Hint 1 of 2');
  await expect(ladder.locator('.hint-ladder__rung').first()).toHaveAttribute('data-rung', 'rubric');
  // One hint used → the result says so (singular).
  await page.locator('.sa__editor').fill('An answer.');
  await page.getByRole('radio', { name: /Sure/ }).click();
  await page.getByRole('button', { name: 'Compare with the model' }).click();
  await page.getByRole('button', { name: 'Save my mark' }).click();
  await expect(page.locator('.sa__saved')).toContainText('Answered with 1 hint.');
});

test('problem question: hint while writing, IRAC self-check before marking, hints saved', async ({ page }) => {
  const errors = watchErrors(page);
  await stub(page, [long], { [DIRECT]: aid }, { 'fixture-long': facts });
  await page.goto('/laws2400/quiz/?type=long');
  await page.locator('.plan__fields input').first().fill('Breach');
  await page.getByRole('button', { name: 'Start writing' }).click();

  const ladder = page.locator('.la__scenario .hint-ladder');
  await ladder.getByRole('button', { name: 'Hint' }).click();
  await expect(ladder.locator('.hint-ladder__count')).toHaveText('Hint 1 of 4');

  await page.locator('.la__editor').fill([
    'Issue: whether the council breached its duty to Pat.',
    'Law: Under s 5B a person is not negligent unless the risk was foreseeable and not insignificant (Wyong Shire Council v Shirt).',
    'Application: the council knew of the pothole for six months. The probability of a trip was high, the seriousness moderate and the burden of repair low.',
    'Conclusion: the council is likely to have breached its duty.',
  ].join('\n'));
  await page.getByRole('button', { name: 'Finish' }).click();

  const check = page.locator('.irac-check');
  await expect(check.getByRole('heading', { name: 'Before you mark: a quick look' })).toBeVisible();
  await expect(check).toContainText('This is a prompt to look again, not a mark.');
  await expect(check.locator('[data-check="issue"]')).toHaveAttribute('data-ok', 'true');
  await expect(check.locator('[data-check="rule"]')).toHaveAttribute('data-ok', 'true');
  await expect(check.locator('[data-check="conclusion"]')).toHaveAttribute('data-ok', 'true');
  const app = check.locator('[data-check="application"]');
  await expect(app).not.toHaveAttribute('data-ok', 'true');
  await expect(app).toContainText('1 essential fact never appears in your answer.');
  await app.locator('summary').click();
  await expect(app.locator('.irac-check__items')).toHaveText('A warning sign about roadworks stood beside the pothole.');
  // The check sits before the marking criteria.
  const [checkBox, rubricBox] = await Promise.all([check.boundingBox(), page.locator('.rubric').boundingBox()]);
  expect(checkBox!.y).toBeLessThan(rubricBox!.y);
  expect(await layoutProblems(page, '.btn, .irac-check__summary, .rubric__crit')).toEqual([]);

  await expect(page.locator('.la__result [data-hints-used]')).toHaveText('Answered with 1 hint.');
  await page.getByRole('button', { name: 'Save my mark' }).click();
  await expect(page.locator('.la__saved')).toBeVisible();
  await waitForAttempts(page, 1);
  await savedHints(page, 'fixture-long').toBe(1);
  expect(errors).toEqual([]);
});

test('IRAC check without a fact annotation: no application row, no errors', async ({ page }) => {
  await stub(page, [long]);
  await page.goto('/laws2400/quiz/?type=long');
  await page.locator('.plan__fields input').first().fill('Breach');
  await page.getByRole('button', { name: 'Start writing' }).click();
  await page.locator('.la__editor').fill('The council should fix roads.');
  await page.getByRole('button', { name: 'Finish' }).click();
  const check = page.locator('.irac-check');
  await expect(check).toBeVisible();
  await expect(check.locator('[data-check="application"]')).toHaveCount(0);
  await expect(check.locator('[data-check="rule"]')).toContainText('No rule statements spotted');
  await expect(check.locator('[data-check="issue"]')).toContainText('marking points show up in your answer');
});

for (const level of ['full', 'calm', 'off'] as const) {
  test(`motion ${level}: hint rungs ${level === 'full' ? 'rise' : 'only fade'}`, async ({ page }) => {
    await setLevel(page, level);
    await stub(page, [short], { [DIRECT]: aid });
    await page.goto('/laws2400/quiz/?type=short');
    await page.locator('.hint-ladder').getByRole('button', { name: 'Hint' }).click();
    const name = await page.locator('.hint-ladder__rung').first().evaluate((el) => getComputedStyle(el).animationName);
    expect(name).toBe(level === 'full' ? 'practice-rise' : 'practice-fade');
    expect(await layoutProblems(page)).toEqual([]);
  });
}
