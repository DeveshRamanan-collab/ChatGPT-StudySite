// What the site knows about the learner: /insight (strengths, recurring errors, recall estimates with Why?, open
// questions), the error-log misconception journal, the exam-debrief split and teach-back coverage.
import { test, expect, type Page } from '@playwright/test';
import { layoutProblems, setLevel } from './helpers';

const DAY = 86_400_000;
const shot = (page: Page, name: string, project: string) => page.screenshot({ path: `reports/review/insight-${project}-${name}.png`, fullPage: true });

type Rows = { attempts?: object[]; criterion?: object[]; cards?: object[]; settings?: object[] };
/** Write rows straight into the app's IndexedDB (the page must have opened it first), then reload. */
async function seed(page: Page, rows: Rows) {
  await page.evaluate((r) => new Promise<void>((resolve, reject) => {
    const open = indexedDB.open('studysite');
    open.onsuccess = () => {
      const db = open.result;
      const stores = Object.keys(r).filter((k) => (r as Record<string, object[]>)[k]?.length);
      const tx = db.transaction(stores, 'readwrite');
      for (const s of stores) for (const row of (r as Record<string, object[]>)[s]) tx.objectStore(s).put(row);
      tx.oncomplete = () => { db.close(); resolve(); };
      tx.onerror = () => reject(tx.error);
    };
    open.onerror = () => reject(open.error);
  }), rows);
  await page.reload();
}

const attempt = (o: Record<string, unknown>) => ({ unit: 'laws2400', type: 'mcq', answer: 0, correct: true, durationMs: 20_000, sessionId: 's-seed', ...o });
const watchErrors = (page: Page) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  return errors;
};

test.describe('/insight — what I know', () => {
  for (const level of ['full', 'off'] as const) {
    test(`strengths, errors, review with evidence, open questions (motion ${level})`, async ({ page }, info) => {
      const errors = watchErrors(page);
      await setLevel(page, level);
      await page.goto('/insight');
      await expect(page.locator('[data-insight-basis]')).toContainText('Nothing to go on yet');

      const ids: { id: string; title: string }[] = await page.evaluate(async () => {
        const o = await (await fetch('/data/overview.json')).json();
        return o.find((u: { id: string }) => u.id === 'laws2400').weeks.flatMap((w: { concepts: { id: string; title: string }[] }) => w.concepts).slice(0, 4);
      });
      const [strong, myth, hole, fading] = ids;
      const now = Date.now();
      await seed(page, {
        attempts: [
          ...[1, 2, 3, 4, 5].map((k) => attempt({ questionId: `seed-s${k}`, concept: strong.id, at: now - k * 3_600_000 })),
          attempt({ questionId: 'seed-m1', concept: myth.id, correct: false, confidence: 'sure', at: now - 2 * DAY }),
          attempt({ questionId: 'seed-m2', concept: myth.id, correct: false, confidence: 'sure', at: now - DAY }),
          attempt({ questionId: 'seed-g1', concept: hole.id, correct: false, confidence: 'guess', at: now - 2 * DAY }),
          attempt({ questionId: 'seed-g2', concept: hole.id, correct: false, confidence: 'unsure', at: now - DAY }),
          attempt({ questionId: 'seed-f1', concept: fading.id, at: now - 10 * DAY }),
        ],
        criterion: [
          { conceptId: strong.id, correctInSession: 3, sessionId: 's-seed', learnedAt: now - 20 * DAY, relearnSessions: [now - 15 * DAY, now - 10 * DAY, now - 5 * DAY], securedAt: now - 5 * DAY, lastCorrectAt: now - 3_600_000 },
          { conceptId: fading.id, correctInSession: 1, sessionId: 's-old', relearnSessions: [], lastCorrectAt: now - 10 * DAY },
        ],
      });

      await expect(page.locator('[data-insight-basis]')).toContainText('Based on 10 marked answers');
      await expect(page.locator('[data-kind="strength"]')).toHaveCount(1);
      await expect(page.locator('[data-kind="strength"]')).toContainText(strong.title);
      await expect(page.locator('[data-kind="strength"]')).toContainText('Secured');
      await expect(page.locator('[data-kind="misconception"]')).toContainText(myth.title);
      await expect(page.locator('[data-kind="misconception"]')).toContainText('2 while sure');
      await expect(page.locator('[data-kind="gap"]')).toContainText(hole.title);
      const review = page.locator('[data-kind="review"]');
      await expect(review).toHaveCount(3);
      await expect(review.first()).toContainText('Recall about 0%');

      // Every estimate has its evidence, shown in place.
      const fade = review.filter({ hasText: fading.title });
      const why = fade.locator('.insight-why');
      await expect(why).toBeHidden();
      await fade.getByRole('button', { name: /^Why\?/ }).click();
      await expect(why).toBeVisible();
      await expect(why).toContainText(/^Last right 10 days ago · last answer right · estimated from your last right answer/);
      await expect(why).toContainText('below your 90% target');
      await expect(fade.getByRole('link', { name: 'Answer a few' })).toHaveAttribute('href', `/laws2400/quiz?concept=${fading.id}`);
      await page.locator('.insight-rec').first().getByRole('button', { name: /^Why\?/ }).click();
      await expect(page.locator('.insight-why').first()).toContainText('three right in one session');

      // Open questions: add, resolve, persist, delete, undo.
      const input = page.getByLabel('A question you are still holding');
      await input.fill('Does trespass to land need damage?');
      await input.press('Enter');
      const openList = page.getByRole('list', { name: 'Open questions' });
      await expect(openList).toContainText('Does trespass to land need damage?');
      await expect(input).toHaveValue('');
      await openList.getByRole('button', { name: 'Resolve' }).click();
      await expect(page.locator('.insight-oq__resolved summary')).toHaveText('Resolved (1)');
      await page.reload();
      await page.locator('.insight-oq__resolved summary').click();
      const resolved = page.getByRole('list', { name: 'Resolved questions' });
      await expect(resolved).toContainText('Does trespass to land need damage?');
      await resolved.getByRole('button', { name: 'Delete' }).click();
      await expect(page.locator('.insight-oq__resolved')).toHaveCount(0);
      await page.locator('.insight-oq__status').getByRole('button', { name: 'Undo' }).click();
      await expect(page.locator('.insight-oq__resolved summary')).toHaveText('Resolved (1)');

      expect(await layoutProblems(page, '.btn, .chip, .insight-item__stat, .insight-item__unit, .insight-meter')).toEqual([]);
      await shot(page, `page-${level}`, info.project.name);
      expect(errors).toEqual([]);
    });
  }

  test('the dashboard links to it quietly', async ({ page }) => {
    await page.goto('/dashboard');
    const link = page.locator('[data-insight-link] a');
    await expect(link).toHaveAttribute('href', '/insight');
    await link.click();
    await expect(page).toHaveURL(/\/insight\/?$/);
    await expect(page.getByRole('heading', { level: 1, name: 'What I know' }).first()).toBeVisible();
  });
});

test('error log: misconception journal saves on blur, filters, copies as Markdown', async ({ page, context }, info) => {
  const errors = watchErrors(page);
  await context.grantPermissions(['clipboard-read', 'clipboard-write']).catch(() => {});
  await page.goto('/laws2400/errors/');
  await expect(page.locator('.errlog__count')).toContainText('Nothing here yet');
  const qs: { id: string; concept: string; wrong: number }[] = await page.evaluate(async () => {
    const b = await (await fetch('/data/laws2400/questions.json')).json();
    return b.questions.filter((q: { type: string }) => q.type === 'mcq').slice(0, 2)
      .map((q: { id: string; concept: string; options: { correct: boolean }[] }) => ({ id: q.id, concept: q.concept, wrong: q.options.findIndex((o) => !o.correct) }));
  });
  const now = Date.now();
  await seed(page, { attempts: qs.map((q, k) => attempt({ questionId: q.id, concept: q.concept, answer: q.wrong, correct: false, confidence: 'sure', at: now - k * 60_000 })) });
  await expect(page.locator('.errlog__item')).toHaveCount(2);

  const item = page.locator('.errlog__item').first();
  await item.getByRole('button', { name: 'Add to journal' }).click();
  const believed = item.getByLabel('What I believed');
  await expect(believed).toBeFocused();
  await believed.fill('A kiss cannot be a battery');
  // Blur → "Saved" within 200 ms.
  const ms = await page.evaluate(async () => {
    const ta = document.querySelector<HTMLTextAreaElement>('[data-journal="believed"]')!;
    const status = ta.closest('.errlog-journal')!.querySelector('.errlog-journal__status')!;
    const t0 = performance.now();
    ta.blur();
    while (status.textContent !== 'Saved') {
      if (performance.now() - t0 > 2000) return -1;
      await new Promise((r) => requestAnimationFrame(r));
    }
    return performance.now() - t0;
  });
  expect(ms).toBeGreaterThanOrEqual(0);
  expect(ms).toBeLessThan(200);
  await item.getByLabel('What fixed it').fill('Hostility is not required');
  await item.getByLabel('What I believed').focus();
  await expect(item.locator('.errlog-journal__status')).toHaveText('Saved');

  // Journal toggle lists only items with entries.
  const toggle = page.getByRole('button', { name: /^Journal/ });
  await expect(toggle).toHaveText('Journal (1)');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.errlog__item')).toHaveCount(1);
  await toggle.click();
  await expect(page.locator('.errlog__item')).toHaveCount(2);

  // Copy as Markdown (clipboard, or a selectable fallback when the clipboard is unavailable).
  await page.getByRole('button', { name: 'Copy as Markdown' }).click();
  const status = page.locator('.errlog-tools__status');
  await expect(status).toHaveText(/Copied 1 journal entry as Markdown|Could not reach the clipboard/);
  const md = (await status.textContent())!.startsWith('Copied')
    ? await page.evaluate(() => navigator.clipboard.readText())
    : await page.getByLabel('Journal as Markdown').inputValue();
  expect(md).toContain('# LAWS2400 misconception journal');
  expect(md).toContain('- **What I believed:** A kiss cannot be a battery');
  expect(md).toContain('- **What fixed it:** Hostility is not required');

  // Persisted.
  await page.reload();
  await expect(page.locator('.errlog__item').first().getByLabel('What fixed it')).toHaveValue('Hostility is not required');
  expect(await layoutProblems(page)).toEqual([]);
  await shot(page, 'journal', info.project.name);
  expect(errors).toEqual([]);
});

test('exam debrief: misconceptions, gaps, shaky and timing, existing debrief kept', async ({ page }, info) => {
  const errors = watchErrors(page);
  await setLevel(page, 'off');
  await page.goto('/laws2400/quiz/?mode=exam');
  await page.getByRole('button', { name: 'Begin the paper' }).click();
  const items = page.locator('.exam__paper .exam__item');
  const total = await items.count();
  const b = await page.evaluate(async () => (await fetch('/data/laws2400/questions.json')).json());
  // Q1 C3 wrong · Q2 C1 wrong · Q3 C2 wrong · Q4 C3 right · the rest unanswered.
  for (const [k, certainty, right] of [[0, 3, false], [1, 1, false], [2, 2, false], [3, 3, true]] as const) {
    const item = items.nth(k);
    const id = await item.getAttribute('data-question');
    const q = b.questions.find((x: { id: string }) => x.id === id);
    const opts = q.type === 'mcq' ? q.options : [{ correct: q.answer }, { correct: !q.answer }];
    const ok = opts.findIndex((o: { correct: boolean }) => o.correct);
    await item.getByRole('radio', { name: `C${certainty}` }).click();
    await item.locator('.option').nth(right ? ok : (ok + 1) % opts.length).click();
  }
  await page.getByRole('button', { name: 'Finish the paper' }).click();
  await expect(page.locator('[data-cbm]')).toHaveText(String(3 - 6 - 2 + 0));
  await expect(page.locator('.exam__levels')).toBeVisible();
  await expect(page.locator('.exam__review .exam__item')).toHaveCount(total);
  const split = page.locator('[data-debrief-split]');
  await expect(split.locator('[data-group="misconceptions"]')).toHaveAttribute('data-count', '1');
  await expect(split.locator('[data-group="gaps"]')).toHaveAttribute('data-count', '1');
  await expect(split.locator('[data-group="shaky"]')).toHaveAttribute('data-count', '1');
  await expect(split.locator('[data-group="timing"]')).toContainText(`${total - 4} unanswered`);
  await expect(split.locator('[data-group="misconceptions"] .debrief-split__concepts a')).toHaveCount(1);
  await expect(split.locator('[data-group="misconceptions"] .debrief-split__next')).toContainText('10 minutes, 1 day and 4 days');
  expect(await layoutProblems(page)).toEqual([]);
  await shot(page, 'debrief', info.project.name);
  expect(errors).toEqual([]);
});

const AID = {
  concept: 'laws2400-w02-battery', unit: 'laws2400', week: 'laws2400-w02',
  plain: 'Battery is a direct and intentional (or negligent) act that brings about contact with another person without lawful justification.',
  terms: [{ term: 'Directness', gloss: 'g' }, { term: 'Intentional', gloss: 'g' }],
  misconceptions: [], socratic: [], 'what-if': [], boundary: [], transfer: [], objections: [], storyboard: [], sources: [], verify: false,
  elements: [{ name: 'Contact with the body', test: 't', cases: [], authorities: [] }],
};

test('explain it back: teach-back coverage from the aid, nothing without one', async ({ page }, info) => {
  const errors = watchErrors(page);
  await page.route('**/data/laws2400/aids.json', (r) => r.fulfill({ json: { unit: 'laws2400', aids: { [AID.concept]: AID }, flows: [], facts: {} } }));
  await page.goto('/laws2400/concept/w02-battery/?explain=1');
  const x = page.locator('.xback');
  await x.locator('textarea').fill('Battery needs a direct and intentional act.');
  await x.getByRole('button', { name: 'Done, compare' }).click();
  const tb = x.locator('[data-teachback]');
  await expect(tb).toContainText('A word-match check, not a mark');
  await expect(tb.locator('[data-covered]')).toHaveText('You covered:Directness, Intentional');
  await expect(tb.locator('[data-missing]')).toHaveText('Not yet mentioned:Contact with the body, the core idea');
  await expect(tb.locator('.teachback__core')).toContainText('without lawful justification');
  await expect(x.getByRole('button', { name: 'Good' })).toBeVisible(); // the self-rating is unchanged
  await shot(page, 'teachback', info.project.name);
  expect(errors).toEqual([]);
});

test('explain it back: no coverage block when the concept has no aid', async ({ page }) => {
  await page.route('**/data/laws2400/aids.json', (r) => r.fulfill({ json: { unit: 'laws2400', aids: {}, flows: [], facts: {} } }));
  await page.goto('/laws2400/concept/w02-battery/?explain=1');
  const x = page.locator('.xback');
  await x.locator('textarea').fill('Battery is a direct, intentional contact.');
  await x.getByRole('button', { name: 'Done, compare' }).click();
  await expect(x.locator('.xback__yours')).toContainText('direct, intentional');
  await expect(x.locator('[data-teachback]')).toHaveCount(0);
});
