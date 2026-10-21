// Listen and Viva (/<unit>/listen), the selection toolbar on notes pages, "Leave a note for next time" on home, and
// format tracking (via on attempts). Speech is stubbed: a fake speechSynthesis records what would be said and ends
// each sentence after 30 ms, so the flow is deterministic and nothing is played aloud.
import { test, expect, type Page } from '@playwright/test';
import { layoutProblems, scrollThrough, setLevel, waitForAttempts } from './helpers';

const UNIT = 'laws2400';
const CONCEPT = 'laws2400-w02-battery';
// caret 'initial': the default 'hide' can touch inputs of islands still waiting to hydrate (client:idle) and cause a mismatch.
const shot = (page: Page, name: string, project: string) => page.screenshot({ path: `reports/review/audio-${project}-${name}.png`, caret: 'initial' });

function watchErrors(page: Page) {
  const errors: string[] = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));
  return errors;
}

async function fakeSpeech(page: Page) {
  await page.addInitScript(() => {
    const spoken: { text: string; rate: number; voice?: string }[] = [];
    (window as any).__spoken = spoken;
    (window as any).SpeechSynthesisUtterance = class {
      text: string; rate = 1; lang = ''; voice: unknown = null; onend: ((e: unknown) => void) | null = null; onerror: ((e: unknown) => void) | null = null;
      constructor(t: string) { this.text = t; }
    };
    let cur: any = null;
    let t: ReturnType<typeof setTimeout> | undefined;
    const voices = [{ name: 'Test AU', lang: 'en-AU', voiceURI: 'test-au', default: true, localService: true }, { name: 'Test GB', lang: 'en-GB', voiceURI: 'test-gb', default: false, localService: true }];
    const fake = {
      speaking: false, pending: false, paused: false,
      getVoices: () => voices,
      speak(u: any) { spoken.push({ text: u.text, rate: u.rate, voice: u.voice?.voiceURI }); cur = u; t = setTimeout(() => { if (cur === u) { cur = null; u.onend?.({}); } }, 30); },
      cancel() { clearTimeout(t); const u = cur; cur = null; u?.onerror?.({ error: 'interrupted' }); },
      pause() {}, resume() {}, addEventListener() {}, removeEventListener() {},
    };
    Object.defineProperty(window, 'speechSynthesis', { value: fake, configurable: true });
  });
}
const spoken = (page: Page) => page.evaluate(() => ((window as any).__spoken as { text: string; rate: number; voice?: string }[]));

const dbRows = (page: Page, store: string) =>
  page.evaluate((s) => new Promise<Record<string, any>[]>((resolve) => {
    const open = indexedDB.open('studysite');
    open.onsuccess = () => {
      const r = open.result.transaction(s).objectStore(s).getAll();
      r.onsuccess = () => { open.result.close(); resolve(r.result); };
    };
  }), store);

const AID = {
  concept: CONCEPT, unit: UNIT, week: 'laws2400-w02', plain: 'Battery is a direct, intentional or negligent bodily contact without lawful justification.',
  terms: [{ term: 'physical contact', gloss: 'Touching the body of the plaintiff, however slight.', example: 'A tap on the shoulder.' }],
  misconceptions: [], elements: [], 'what-if': [], transfer: [], storyboard: [], sources: ['fixture'], verify: false,
  socratic: [
    { ask: 'What kind of act does battery require?', hint: 'Think about voluntariness.', answer: 'A voluntary, positive act by the defendant.' },
    { ask: 'Must the contact be direct?', hint: 'Recall trespass.', answer: 'Yes: the interference must follow directly from the act.' },
  ],
  objections: [{ position: 'Fault', evidence: 'Cases', objection: 'Negligent contact should not be enough for a trespass.', reply: 'Australian law still allows negligent trespass.' }],
  boundary: [{ text: 'A thrown object strikes the plaintiff.', why: 'Still direct: the object is an extension of the act.' }],
};
const stubAids = (page: Page) => page.route(`**/data/${UNIT}/aids.json`, (r) => r.fulfill({ json: { unit: UNIT, aids: { [CONCEPT]: AID }, flows: [], facts: {} } }));

test('listen: question read, think arc, answer read with captions; keyboard; sound and captions independent', async ({ page }, info) => {
  test.setTimeout(90_000);
  const errors = watchErrors(page);
  await fakeSpeech(page);
  await page.addInitScript(() => localStorage.setItem('studysite:listen', JSON.stringify({ think: 5, autoNext: false })));
  await page.goto(`/${UNIT}/listen/?concept=${CONCEPT}`);
  const listen = page.locator('.listen[data-ready]');
  await expect(listen).toBeVisible({ timeout: 20_000 });
  await expect(page.getByRole('tab', { name: 'Listen' })).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('.listen__scope select')).toHaveValue('concept');
  expect(await layoutProblems(page)).toEqual([]);
  await shot(page, 'ready', info.project.name);

  // Play: the question is spoken and captioned, then the think arc, then the answer.
  await page.getByRole('button', { name: 'Play', exact: true }).click();
  await expect(listen).toHaveAttribute('data-phase', 'think', { timeout: 10_000 });
  const asked = await spoken(page);
  expect(asked.length).toBeGreaterThan(0);
  await expect(page.locator('.listen__captions')).toContainText(asked[0].text);
  await expect(page.locator('.listen .timer-arc')).toHaveAttribute('aria-label', /Think time: 0:0[1-5]/);
  await shot(page, 'think', info.project.name);
  await expect(listen).toHaveAttribute('data-phase', 'heard', { timeout: 10_000 });
  await expect(page.locator('.listen__captions .listen__cap-label').nth(1)).toHaveText('Answer');
  const all = await spoken(page);
  expect(all.slice(asked.length).map((s) => s.text).join(' ')).toMatch(/^(The answer:|True\.|False\.|A good answer would say:)/);
  // Hearing the answer marks the concept's format as "listen".
  const formats = await page.evaluate(() => JSON.parse(sessionStorage.getItem('studysite:formats') || '{}'));
  expect(Object.values(formats).map((f: any) => f.f)).toContain('listen');
  expect(await layoutProblems(page)).toEqual([]);
  await shot(page, 'heard', info.project.name);

  // Keyboard: N plays the next question; Space pauses it.
  await page.locator('main h1').click();
  await page.keyboard.press('n');
  await expect(page.locator('.listen__phase')).toContainText(/^Question 2 of/);
  await expect(listen).toHaveAttribute('data-phase', 'think', { timeout: 10_000 });
  await page.keyboard.press(' ');
  await expect(listen).not.toHaveAttribute('data-playing', '');
  await expect(page.locator('.listen__phase')).toContainText('paused');
  await expect(page.getByRole('button', { name: 'Resume' })).toBeVisible();

  // Sound off: nothing more is spoken, captions still follow at reading pace.
  const before = (await spoken(page)).length;
  await page.getByRole('button', { name: 'Sound on' }).click();
  await expect(page.getByRole('button', { name: 'Sound off' })).toHaveAttribute('aria-pressed', 'false');
  await page.getByRole('button', { name: 'Repeat' }).click();
  await expect(page.locator('.listen__captions .listen__sent').first()).toBeVisible();
  await expect(listen).toHaveAttribute('data-phase', /think|answer|heard/, { timeout: 30_000 });
  expect((await spoken(page)).length).toBe(before);
  // Captions off, sound back on: the text goes, speech returns.
  await page.getByRole('button', { name: 'Captions on' }).click();
  await expect(page.locator('.listen__captions')).toContainText('Captions are off.');
  await page.getByRole('button', { name: 'Sound off' }).click();
  await page.getByRole('button', { name: 'Repeat' }).click();
  await expect.poll(async () => (await spoken(page)).length).toBeGreaterThan(before);

  // Rate and voice reach the utterances.
  await page.locator('.listen__more summary').click();
  await page.locator('.listen__range').fill('1.3');
  await page.locator('.listen__more select').selectOption('test-gb');
  await page.getByRole('button', { name: 'Repeat' }).click();
  await expect.poll(async () => (await spoken(page)).at(-1)).toMatchObject({ rate: 1.3, voice: 'test-gb' });
  expect(await layoutProblems(page)).toEqual([]);
  expect(errors).toEqual([]);
});

test('viva: asks aloud, reveals what a tutor would accept, presses with a follow-up, records each turn', async ({ page }, info) => {
  test.setTimeout(60_000);
  const errors = watchErrors(page);
  await fakeSpeech(page);
  await stubAids(page);
  await setLevel(page, 'off');
  await page.goto(`/${UNIT}/listen/?tab=viva&concept=${CONCEPT}`);
  const viva = page.locator(`.viva[data-concept="${CONCEPT}"]`);
  await expect(viva).toBeVisible({ timeout: 20_000 });
  await expect(page.getByRole('tab', { name: 'Viva' })).toHaveAttribute('aria-selected', 'true');
  // A format used just before (here: a flow, 1 minute ago) is stamped on the attempt as `via`.
  await page.evaluate((c) => sessionStorage.setItem('studysite:formats', JSON.stringify({ [c]: { f: 'flow', at: Date.now() - 60_000 } })), CONCEPT);

  await page.getByRole('button', { name: 'Start the viva' }).click();
  await expect(page.locator('.viva__ask')).toHaveText(AID.socratic[0].ask);
  await expect.poll(async () => (await spoken(page)).map((s) => s.text)).toContain(AID.socratic[0].ask);
  await page.locator('#viva-answer').fill('A voluntary act');
  expect(await layoutProblems(page)).toEqual([]);
  await shot(page, 'viva-ask', info.project.name);
  await page.getByRole('button', { name: 'Show what a tutor would accept' }).click();
  await expect(page.locator('.viva__accept')).toContainText(AID.socratic[0].answer);
  await expect(page.locator('.viva__follow')).toContainText(AID.objections[0].objection);
  await expect.poll(async () => (await spoken(page)).map((s) => s.text).join(' ')).toContain('And what if someone objects:');
  await page.getByRole('button', { name: /Show a strong reply/ }).click();
  await expect(page.locator('.viva__reply')).toHaveText(AID.objections[0].reply);
  expect(await layoutProblems(page)).toEqual([]);
  await shot(page, 'viva-accept', info.project.name);
  await page.getByRole('button', { name: /^Partly/ }).click();

  // Turn 2: the edge case is the follow-up; rate with the keyboard.
  await expect(page.locator('.viva__count')).toHaveText('Question 2 of 2');
  await page.getByRole('button', { name: 'Show what a tutor would accept' }).click();
  await expect(page.locator('.viva__follow')).toContainText(AID.boundary[0].text);
  await page.locator('.viva__accept').click();
  await page.keyboard.press('1');
  await expect(page.locator('.viva [role="status"]')).toContainText('You rated 1 “Got it”, 1 “Partly” and 0 “Not yet”.');

  await waitForAttempts(page, 2);
  const rows = (await dbRows(page, 'attempts')).filter((a) => a.mode === 'viva');
  expect(rows.map((a) => [a.questionId, a.score, a.correct, a.type, a.via])).toEqual([
    [`viva:${CONCEPT}:0`, 0.5, null, 'short', 'flow'],
    [`viva:${CONCEPT}:1`, 1, null, 'short', 'flow'],
  ]);
  expect(rows[0].answer).toBe('A voluntary act');
  await shot(page, 'viva-done', info.project.name);
  expect(errors).toEqual([]);
});

/** Select `phrase` inside the first notes paragraph (as a mouse or keyboard selection would). */
async function select(page: Page, phrase: string) {
  await page.evaluate((p) => {
    const para = document.querySelector('article.prose p')!;
    const walker = document.createTreeWalker(para, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      const at = n.textContent!.indexOf(p);
      if (at < 0) continue;
      const r = document.createRange();
      r.setStart(n, at);
      r.setEnd(n, at + p.length);
      const s = getSelection()!;
      s.removeAllRanges();
      s.addRange(r);
      return;
    }
    throw new Error(`phrase not found: ${p}`);
  }, phrase);
}

test('selection toolbar: explain from the glossary, make a card, quiz link, read aloud; keyboard and Esc', async ({ page }, info) => {
  test.setTimeout(60_000);
  const errors = watchErrors(page);
  await fakeSpeech(page);
  await stubAids(page);
  await setLevel(page, 'off');
  await page.goto(`/${UNIT}/concept/w02-battery/`);
  await page.addStyleTag({ content: 'astro-dev-toolbar { display: none !important; }' }); // dev server only: it sits where the touch bar goes
  await page.waitForFunction(() => [...document.querySelectorAll('astro-island')].some((i) => i.getAttribute('component-url')?.includes('SelectionTools') && !i.hasAttribute('ssr')), null, { timeout: 20_000 });
  await scrollThrough(page); // let every client:visible island above the notes hydrate first, so the text stays put
  await page.locator('article.prose p').first().scrollIntoViewIfNeeded();

  await select(page, 'physical contact');
  const tools = page.locator('.selection-tools');
  await expect(tools).toBeVisible();
  await expect(tools).toHaveAttribute('data-mode', info.project.name === 'mobile' ? 'bar' : 'float');
  if (info.project.name === 'desktop') {
    // Floats beside the selection (below, or above when the bottom of the screen is near), never over it.
    const sel = await page.evaluate(() => { const r = getSelection()!.getRangeAt(0).getBoundingClientRect(); return { top: r.top, bottom: r.bottom }; });
    const bar = (await tools.locator('[role="toolbar"]').boundingBox())!;
    expect(bar.y >= sel.bottom || bar.y + bar.height <= sel.top).toBe(true);
  } else {
    const box = (await tools.boundingBox())!;
    expect(Math.round(box.y + box.height)).toBe(844);
  }
  await expect(tools.getByRole('link', { name: 'Quiz me on this' })).toHaveAttribute('href', `/${UNIT}/quiz?concept=${CONCEPT}`);

  // Tab moves into the toolbar; Enter on Explain shows the gloss in place.
  await page.keyboard.press('Tab');
  await expect(tools.getByRole('button', { name: 'Explain' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('.selection-tools__gloss')).toContainText('Touching the body of the plaintiff, however slight.');
  await expect(page.locator('.selection-tools__gloss')).toContainText('For example: A tap on the shoulder.');
  expect(await page.evaluate(() => JSON.parse(sessionStorage.getItem('studysite:formats') || '{}')))
    .toMatchObject({ [CONCEPT]: { f: 'glossary' } });
  await page.keyboard.press('ArrowRight');
  await expect(tools.getByRole('button', { name: 'Make a card' })).toBeFocused();
  expect(await layoutProblems(page)).toEqual([]);
  await shot(page, 'selection-explain', info.project.name);
  await page.keyboard.press('Escape');
  await expect(tools).toHaveCount(0);

  // No match: points to Ways in.
  await select(page, 'the defendant');
  await expect(tools).toBeVisible();
  await tools.getByRole('button', { name: 'Explain' }).click();
  await expect(page.locator('.selection-tools__gloss')).toContainText('No glossary match — try the concept’s Ways in');

  // Read aloud speaks the selection.
  await tools.getByRole('button', { name: 'Read aloud' }).click();
  await expect.poll(async () => (await spoken(page)).map((s) => s.text)).toContain('the defendant');

  // Make a card: the existing sentence-to-card flow stores a cloze card.
  const cards = (await dbRows(page, 'customCards').catch(() => [])).length;
  await tools.getByRole('button', { name: 'Make a card' }).click();
  await expect(tools).toHaveCount(0);
  await expect.poll(async () => (await dbRows(page, 'customCards')).length).toBe(cards + 1);
  const card = (await dbRows(page, 'customCards')).at(-1)!;
  expect(card.front).toContain('{{c1::the defendant}}');
  expect(card.concept).toBe(CONCEPT);
  expect(errors).toEqual([]);
});

test('home: leave a note for next time, see it next visit, dismiss it', async ({ page }, info) => {
  const errors = watchErrors(page);
  await setLevel(page, 'off');
  await page.goto('/');
  const link = page.getByRole('button', { name: 'Leave a note for next time' });
  await expect(link).toBeVisible({ timeout: 20_000 });
  await link.click();
  const input = page.getByLabel('A note for next time');
  await expect(input).toBeFocused();
  await input.fill('Does consent cover a surgeon exceeding the procedure?');
  await page.keyboard.press('Enter');
  await expect(page.locator('.open-thought')).toContainText('Saved for next time: “Does consent cover a surgeon exceeding the procedure?”');
  expect(JSON.parse((await page.evaluate(() => localStorage.getItem('studysite:open-thought')))!).text).toBe('Does consent cover a surgeon exceeding the procedure?');

  await page.reload();
  await expect(page.locator('.open-thought')).toContainText('You were thinking: “Does consent cover a surgeon exceeding the procedure?”', { timeout: 20_000 });
  expect(await layoutProblems(page)).toEqual([]);
  await shot(page, 'home-thought', info.project.name);
  await page.getByRole('button', { name: 'Dismiss' }).click();
  await expect(page.getByRole('button', { name: 'Leave a note for next time' })).toBeFocused();
  expect(await page.evaluate(() => localStorage.getItem('studysite:open-thought'))).toBeNull();
  expect(errors).toEqual([]);
});

for (const level of ['full', 'calm', 'off'] as const) {
  test(`motion ${level}: listen, viva and the selection toolbar lay out cleanly with no console errors`, async ({ page }, info) => {
    test.setTimeout(60_000);
    const errors = watchErrors(page);
    await fakeSpeech(page);
    await stubAids(page);
    await setLevel(page, level);
    await page.goto(`/${UNIT}/listen/?concept=${CONCEPT}`);
    await expect(page.locator('.listen[data-ready]')).toBeVisible({ timeout: 20_000 });
    await page.getByRole('button', { name: 'Play', exact: true }).click();
    await expect(page.locator('.listen')).toHaveAttribute('data-phase', 'think', { timeout: 10_000 });
    expect(await layoutProblems(page)).toEqual([]);
    await page.getByRole('tab', { name: 'Viva' }).click();
    await page.getByRole('button', { name: 'Start the viva' }).click();
    await page.getByRole('button', { name: 'Show what a tutor would accept' }).click();
    await expect(page.locator('.viva__follow')).toBeVisible();
    await page.waitForTimeout(400);
    expect(await layoutProblems(page)).toEqual([]);
    await shot(page, `viva-${level}`, info.project.name);
    await page.goto(`/${UNIT}/concept/w02-battery/`);
    await page.addStyleTag({ content: 'astro-dev-toolbar { display: none !important; }' });
    await page.waitForFunction(() => [...document.querySelectorAll('astro-island')].some((i) => i.getAttribute('component-url')?.includes('SelectionTools') && !i.hasAttribute('ssr')), null, { timeout: 20_000 });
    await scrollThrough(page); // let every client:visible island above the notes hydrate first, so the text stays put
    await page.locator('article.prose p').first().scrollIntoViewIfNeeded();
    await select(page, 'physical contact');
    await page.locator('.selection-tools').getByRole('button', { name: 'Explain' }).click();
    await expect(page.locator('.selection-tools__gloss')).toBeVisible();
    await page.waitForTimeout(300);
    expect(await layoutProblems(page)).toEqual([]);
    await shot(page, `selection-${level}`, info.project.name);
    expect(errors).toEqual([]);
  });
}
