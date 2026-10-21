# Rules for every UI agent (200-features pass, Oct 2026)

Several agents build features AT THE SAME TIME in this one checkout. Read this, then `CLAUDE.md` (design system,
motion, states, ADHD rules — they are binding), then the files your brief names.

## Ownership (parallel safety)
- Edit ONLY the files your brief lists as yours, and create new files only under the names it gives (or clearly
  namespaced new files: `src/components/<area>/<Name>.tsx`, `src/styles/<feature>.css`, `e2e/<feature>.spec.ts`,
  `tests/<feature>.test.ts`). If you need a change in a file you do not own, do not make it: put it in your report
  under "Integration needed" with the exact edit.
- Never touch: `src/styles/components.css`, `src/layouts/Layout.astro`, `src/content/**`, `content-src/**`, `raw/**`,
  `scripts/**`, `docs/**` (except your report), `STATE.md`, `CLAUDE.md`, `package.json`.
- NEVER delete or replace existing behaviour (user's rule for this pass): extend, wrap, add alongside. Existing tests
  must keep passing; you may update an existing e2e test only where your feature changes behaviour on purpose.
- Never commit, never `npm run build` / `preview` / `lh` (the lead does). Never install packages.

## Styling
- New styles go in your own `src/styles/<feature>.css`, imported from your island (`import '../../styles/x.css'`)
  or from your page. Tokens only (src/styles/tokens.css). Use shared classes (`btn btn--primary|secondary|ghost`,
  `chip`, `card`, `kbd`, `label`, `mono`, `visually-hidden`) but never define a rule whose selector STARTS with a
  shared class (tests/component-classes.test.ts). Name your classes for the feature (`.hint-ladder__rung`).
- Every interactive element: hover (gated by `@media (hover:hover) and (pointer:fine)`), active (scale .97, 160ms),
  focus-visible (2px accent ring, offset 3px), disabled. Rows/targets ≥ 44px on touch.
- One accent-coloured element per viewport (the primary action). Sage/clay only for feedback. Prose ≤ 66ch.
- Progressive disclosure: explanations hidden until asked, shown in place (`<details>` or a button with
  aria-expanded). Never a hard modal.
- Motion: transform/opacity/clip-path/filter only, ≤ 300ms, `--ease-out` for enter; respect
  `html[data-motion="off"]` (fades ≤ 200ms only) and `calm` (no positional movement). Every input shows a visible
  consequence within 200ms.
- Australian English. No streaks, confetti, guilt copy. Plain, kind, specific sentences.

## Data
- Question bank: `loadBank(unit)` (src/components/quiz/types.ts). Concept meta now carries `dependsOn` and
  `contrastsWith`. Study aids, decision flows and problem facts: `loadAids(unit)` (src/lib/aids.ts) — may be EMPTY
  for many concepts while content is being generated; every feature must degrade gracefully (render nothing, or a
  quiet "not available for this concept yet").
- Progress: `useStudy` / `startStudySync` (src/lib/store.ts), `recordAttempt` (src/lib/learning.ts), Dexie tables in
  src/lib/db.ts (`settings` table is a free key/value store: namespace your keys, e.g. `journal:<qid>`). Attempt has
  new optional fields `hints` (number) and `via` (string).

## Checking your work
- A dev server is running at http://localhost:4321 (do not start another; Playwright reuses it).
- Write a focused spec `e2e/<feature>.spec.ts`; run ONLY it: `npx playwright test e2e/<feature>.spec.ts`. To give a
  feature aids data in tests, stub the fetch: `page.route('**/data/laws2400/aids.json', r => r.fulfill({json: …}))`.
  Check 1440×900 and 390×844 (both projects run by default), no console errors, no overlap (`layoutProblems` in
  e2e/helpers.ts), and motion off (`setLevel(page, 'off')`).
- Unit-test pure logic in `tests/<feature>.test.ts` (`npx vitest run tests/<feature>.test.ts`), then `npx vitest run`.
- `npx astro check 2>&1 | tail -20` must show no errors in your files.

## Report (≤ 250 words)
Files changed/created; what each feature does and where it appears (route + how to reach it); test commands and
results (paste the pass/fail summary lines); "Integration needed" (exact edits in files you do not own); anything
you could not finish.

## Learned the hard way (Oct 17)
- Before any e2e run, check the LIVE dev server is up: `curl -s localhost:4321/@vite/client -o /dev/null -w '%{http_code}'`
  must print 200. If 4321 is down, Playwright silently starts `npm run preview` of an OLD build — tell the lead instead.
- Never run `npx astro check` while the dev server runs (it overwrote the dev server's dependency cache once). Use
  `npx tsc --noEmit -p .` for type checks.
- Under load, run e2e with `--workers=1` (or 2) and rerun a failing test alone before treating it as real.
- The disk is nearly full: no large temporary files; delete screenshots you no longer need.
