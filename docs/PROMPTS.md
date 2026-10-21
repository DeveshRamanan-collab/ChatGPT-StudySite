# PART C: PHASE PROMPTS (read one phase at a time, only when the ladder points here)

Note for autonomous mode: where a prompt says "plan first", "walk me through the plan" or "wait for go", write the plan or SCENE brief to docs/plans/<task-id>.md, treat it as approved, and proceed. Where a prompt asks the user to review something, write the review request into STATE.md's Log instead. Session/model notes in headings are advisory.

# Phase prompts (paste one per session; smaller than PLAN.md)

## 8. Build phases with prompts (v2)

Eleven phases, one Claude Code session each (some run 1–3 hours mostly unattended; on Max, run independent phases in parallel worktrees). Paste each prompt verbatim. Start every session with `/clear`; for phases 2, 4, 5, 8 and 9 set `/model opus` and `/effort high` and use plan mode; for phases 3, 6 and the content runs use `/model sonnet`. After each phase run the section 9 gate before moving on. Where a prompt says "plan first", Claude Code stops and shows a plan; reply "go".

```mermaid
flowchart LR
  P1[1 Skeleton + gate] --> P2[2 Design + motion]
  P2 --> P3[3 Content machine]
  P3 --> P4[4 Learning engine]
  P4 --> P5[5 Explainer bases]
  P5 --> P6[6 Search, palette, cursor]
  P6 --> P7[7 Progress, plan, attention]
  P7 --> P8[8 Intro film + hubs]
  P8 --> P9[9 Explainers per concept]
  P9 --> P10[10 Extras]
  P10 --> P11[11 Polish + deploy]
```

Phase 3 runs once per unit; phase 9 repeats per concept and continues whenever a week is added.

### Model and effort per part

| Part | Model | Effort | Where it runs | Why |
| --- | --- | --- | --- | --- |
| Setup (section 7) | Sonnet 5 | medium | local | mechanical |
| Phase 1 skeleton + gate | Sonnet 5 | medium | local | scaffolding; the gate tests matter more than taste |
| Phase 2 design + motion | Opus 5.5 | high | local, plan mode | every later screen inherits this |
| Phase 3 content, per unit | Sonnet 5 | medium | cloud ($250 credit), unattended | high volume, rule-following |
| Phase 4 learning engine | Opus 5.5 | high | local, plan mode | logic and interaction design together |
| Phase 5 explainer bases | Opus 5.5 | high | local | the four patterns everything else copies |
| Phase 6 search, palette | Sonnet 5 | medium | local | well-trodden components |
| Phase 7 progress, attention | Opus 5.5 | medium | local | judgement on tone; rules already in CLAUDE.md |
| Phase 8 intro film + hubs | Opus 5.5 | high | local, plan mode | the cinematic centrepiece |
| Phase 9 explainers: simulations and palaces | Opus 5.5 | medium | local | variables and metaphor need taste |
| Phase 9 explainers: scroll explainers and diagrams on existing bases | Sonnet 5 | medium | cloud, batches of 3 | pattern is fixed; volume is high |
| Phase 10 extras | Sonnet 5 | medium | local or cloud | independent features |
| Phase 11 polish + deploy | Opus 5.5 | medium | local | performance judgement |
| Section 9 gate prompt | Sonnet 5 | medium | local | runs tools and reports |
| `/add-week` later | Sonnet 5 | medium | cloud | same as phase 3 |
| `/weekly-review` | Sonnet 5 | medium | cloud | analysis + generation |
| Domain + password doc | Sonnet 5 | medium | local | small |

Rule of thumb: Opus high when a decision will be copied by many later screens; Opus medium when taste matters but the rules are written; Sonnet medium for everything that follows a pattern. Never low. Check `/usage` at the end of week one and shift phase 9 further toward Sonnet if Opus is above half its weekly allowance.

### Phase 1: Walking skeleton and the regression gate (session 1, ~1 hour)

```markdown
Read CLAUDE.md fully. Phase 1: a walking skeleton with the regression gate built in from day one.

Scaffold Astro 5 here with React, TypeScript strict, npm, and: gsap lenis three @react-three/fiber d3 zustand idb-keyval dexie ts-fsrs fuse.js pagefind @vite-pwa/astro vitest @playwright/test.

Build, committing after each numbered step:
1. src/content/config.ts: Zod schemas for units, weeks, concepts, cases, authorities, questions (discriminated union: mcq | short | long | truefalse | match; long has tier worked|faded|full, template, rubric[] with id/criterion/marks/top-band/margin-note/authorities, given{}), cards (basic | cloze | occlusion | apply), audio. Common fields on every generated file: source-hash, generator-version, generated-at, locked (boolean), verify (boolean). Every question needs a concept id; every MCQ option needs a why. Unknown fields fail the build.
2. Seed content under src/content/**/seed/: four unit files (LAWS2400 Torts, LAWS2000 Public International Law, LAWS2100 Jurisprudence, MGMT2094 Strategic Creativity and Innovation; exam dates placeholder in Nov 2026; answer-style problem for the first two, essay for the last two), one week each, two concepts, two cases, eight questions across all types and tiers, six cards, one audio script. All seed: true.
3. Routes, rendering real collection data with only a plain readable default (system serif, 66ch, 19px/1.6, #FBF7F0 on #1F1B16): /, /[unit], /[unit]/week/[n], /[unit]/concept/[slug], /[unit]/quiz, /[unit]/cards, /[unit]/errors, /cases/[slug], /authorities/[slug], /dashboard, /plan, /search, /styleguide.
4. src/styles/tokens.css with every token from CLAUDE.md, src/styles/base.css with a reset and type defaults, a shared Layout.astro with header, footer and a search placeholder.
5. scripts/validate.ts: loads all collections, checks every cross-reference (question.concept, concept.week, cases referenced by concepts, variant-of targets), checks per-concept question count ≥ 20 for non-seed content, prints a report; wired as npm run validate and as a pre-commit hook.
6. scripts/gate.ts (npm run gate): writes reports/gate.json with counts of routes, weeks, concepts, cases, questions per type, cards, explainers in the manifest, and a hash of every content file. Compares with the previous gate.json: any decrease, or any content file whose id prefix is outside the week being added (read from an ADD_WEEK env var when set) but whose hash changed, fails with a clear message. Unit-test it in Vitest with a fixture that removes a card and expects failure.
7. Playwright config plus one smoke test visiting every route and asserting no console errors; a GitHub Actions workflow running validate, gate, build and smoke on push.

Plan first. When done: npm run build, tests, screenshot home and one week page at 1440×900 via Playwright, commit "feat: walking skeleton and gate".
```

### Phase 2: Design system and motion foundation (session 2, ~2–3 hours, Opus, plan mode)

```markdown
Phase 2: design system and motion foundation. Read CLAUDE.md (design system and research rules) before anything. Use Context7 for GSAP, Lenis and Astro APIs; do not rely on memory.

Build, committing after each:
1. Typography and layout. Self-host Fraunces (variable: opsz, SOFT), Inter and JetBrains Mono as WOFF2 in public/fonts with font-display: swap and size-adjust fallbacks (no layout shift). Implement the type scale, 66ch measure, heading spacing (3× above vs below), the 12-column grid with the offset reading column and a right rail that collapses under 1100px. Make /styleguide render every token, type style, spacing step, colour, component and component state; I review from there.
2. Motion foundation, src/lib/motion.ts: one Lenis instance (lerp 0.1, smoothTouch false) whose raf runs inside gsap.ticker with lagSmoothing(0); ScrollTrigger.update on Lenis scroll; register ScrollTrigger, SplitText, Flip, DrawSVG, MorphSVG; helpers reveal(), splitReveal(), scrub(), pin(), flipTo(). Initialise on astro:page-load; kill every ScrollTrigger and destroy Lenis on astro:before-swap; prove it with a test that navigates three pages and asserts ScrollTrigger.getAll().length is correct each time. Motion dial: data-motion on <html>, persisted, prefers-reduced-motion forces off unless overridden; every helper no-ops to the final state in off and skips parallax/tilt/pins in calm. Header dial control.
3. Components with rest/hover/active/focus-visible/disabled states, tokens only, hover gated by (hover:hover) and (pointer:fine): Button (primary, secondary, ghost, icon; press scale 0.97 at 160ms), Card (3° tilt + cursor-following radial highlight; none in calm/off), Callout (rule, case, statute, definition, examtip: left rule + small-caps label, background never heavier than paper-2), ProgressRing (SVG, four-segment criterion variant), Chip, Toast, Modal and Popover (origin-aware, scale 0.96→1, 2px blur→0, 200ms), Tabs, Kbd, TimerArc (analogue shrinking arc), Stamp (milestone).
4. Page-level motion per the transition catalogue in CLAUDE.md section 5.8: header condenses on scroll via transform; reading-progress hairline; page-enter; Astro view transitions with transition:name on unit cards, week cards and case chips; paragraph and heading reveals.
5. Custom cursor per section 5.5, plus the ambient paper gradient that drifts toward the cursor at 2–3% luminance. Disabled on (pointer: coarse) and when motion ≠ full; native cursor restored cleanly.
6. Apply all of it to the skeleton pages.

After each step: Playwright screenshots of /styleguide, home, a week page at 1440×900 and 390×844 in full, calm and off; check overlap, CLS and console; fix before moving on. Lighthouse on home ≥ 90. Choose the quieter option whenever two are possible.
```

Review `/styleguide` yourself. Correct concretely: "halve the hover lift", "the accent is on three things; keep it on the primary button only".

### Phase 3: The content machine, then the first unit (one session per unit, Sonnet, mostly unattended)

First make the pipeline real by running it on Torts:

```markdown
Phase 3, unit LAWS2400. Read CLAUDE.md. List raw/laws2400-torts/ and tell me which weeks you can see and what each has. Then run /add-week LAWS2400 <n> for each week in order, using subagents three weeks at a time, each subagent confined to its own week's files. After all weeks: run /generate-questions LAWS2400 pq to build the long questions in all three tiers from raw/laws2400-torts/exams/. Then /audit-content laws2400. Show me the report and every verify: true item with the sentence it came from.

Then prove idempotence: run /add-week LAWS2400 3 again and show me git status; it must be clean. Then prove isolation: touch raw/laws2400-torts/week-03/notes.md with a one-word change, run /add-week LAWS2400 3, and show me that only week-03-prefixed files changed and the gate passed. Fix the pipeline if either proof fails, then commit.
```

Repeat for LAWS2000, LAWS2100 ("essay questions: thesis–argument–counterargument–evaluation template") and MGMT2094 (same essay template, real-company examples for every concept). Check the `verify: true` list yourself; that is the one place your judgement is irreplaceable. Hand-correct anything wrong; the file becomes `locked: true`.

### Phase 4: The learning engine (session, ~3 hours, Opus, plan mode)

```markdown
Phase 4: the learning engine. Read CLAUDE.md research rules. Plan first.

Data layer: Dexie db `studysite` with tables attempts (questionId, unit, concept, type, answer, correct, confidence, cbmScore, rubricTicks, tier, durationMs, at), criterion (conceptId, correctInSession, learnedAt, relearnSessions[], securedAt), cards (FSRS state), requeue (itemId, dueAt, reason), sessions, annotations, settings. Zustand store with selectors: accuracy by concept, calibration (confidence vs accuracy), due cards, due requeues, days-studied-in-last-14, minutes today, readiness per unit. Everything offline; keys are stable content ids, never positions.

Components (React islands, tokens only, all states, keyboard-operable), one commit each:
1. Confidence gate: sure / unsure / guess must be chosen before options unlock (keys S/U/G).
2. MCQ: instant marking per section 5.8; explanation panel with "why yours is tempting" and "why the right one is right" and a link to the concept; sure-and-wrong writes three requeue rows (+10 min, +1 day, +4 days) and a "watch this" mark.
3. Criterion tracker: a correct recall increments correctInSession; 3 → learned; a later session with ≥1 correct after ≥2 days adds a relearn session; 3 relearns → secured; the four-segment ring reflects it everywhere.
4. Pretest gate on week pages: on first visit show the week's 5 pretest questions before the notes (skip allowed, logged); immediate feedback.
5. Short answer: prompt, optional timer, auto-growing editor (⌘Enter submits); model answer beside mine; Marking Criteria panel with clickable rows revealing top-band text and highlighting the matching model sentences, a tick per row, live score, and the margin-note per criterion; save.
6. Long answer: answer-plan step first (issues → authorities → order, drag to reorder), then exam-paper mode (scenario left, editor right, timer, no navigation until Finish); tiers: worked shows the model answer with the next step hidden until I predict it; faded pre-fills the given{} parts; full is blank. On finish: rubric as in short answer, band score, gaps → cards. Promotion: two passes at ≥ 70% on a tier promotes the concept's tier.
7. Adaptive picker src/lib/picker.ts: weights by error rate, time since seen, overconfidence, criterion state (due relearns first), coverage; interleaves weeks; exam mode interleaves units; Vitest tests on the weighting and on requeue ordering.
8. Quiz page modes: Mixed, By week, Weakest first, Quick-fire (60s true/false), Match (60s pairing), Exam sim (timed, CBM scoring C1/2/3 → +1/+2/+3 or 0/−2/−6, debrief at the end). Session end: animated recap with ProgressRing count-ups and the one thing that improved most.
9. Error log page grouped by concept with re-test.

All motion via the helpers; nothing over 500ms; calm and off respected. Playwright screenshots of every component in every state; commit per component.
```

### Phase 5: Explainer bases (session, ~2 hours, Opus)

```markdown
Phase 5: explainer infrastructure. Read CLAUDE.md sections 5.7 and 5.9. Plan first.
1. src/components/explainers/manifest.json (append-only) and a loader that renders the registered island above the concept text; on desktop pinned in a 100vh section, on mobile unpinned and learner-paced with Next buttons.
2. Four bases: ScrollExplainer (GSAP timeline scrubbed over N screens; captions fade at beats; opens with a 20-second terms beat; ends with a one-question check; off mode = final frame + stacked captions), Simulation (controls bound to a pure state→view function; Reset; "what changed" caption; shown before the card text), Palace (Three.js room walk for ordered lists; each locus holds one element; arrow keys or scroll to advance), ThreeScene (renderer mounts in view, pauses off-screen, DPR ≤ 1.5, shared post-process: 3% grain, 8% vignette, bloom on the amber light only; PNG fallback for off mode and failed WebGL).
3. Byte budget check: a script that fails if any explainer chunk exceeds 120 KB gz.
4. Prove each base with one Torts concept: the Wyong v Shirt calculus as a Simulation, the Caparo limbs as a ScrollExplainer, the elements of negligence as a Palace. Write the SCENE brief for each first. Screenshot, iterate, commit.
```

### Phase 6: Search, palette, popovers, cursor targets (session, ~1.5 hours)

```markdown
Phase 6. Read CLAUDE.md. 1) Pagefind at build over all pages; /search with grouped, highlighted results. 2) Palette island (⌘K/Ctrl K; Fuse.js over a build-generated src/data/search-index.json including annotations at runtime): sections Recent, Jump to, Questions, Commands; typed filters case: week: wrong:; ">" for commands (start quiz <unit>, review due, what next, focus mode, motion full/calm/off, theme, plan, export); Flip from the search button; backdrop blur in full only; focus trap; Esc. 3) Case, authority and clause popovers on [data-case], [data-authority]: 120ms in, 200ms out, origin-aware; click → Flip into the full card; three densities on case cards; AGLC4 copy button; read-aloud button. 4) Backlinks section on every concept and case. 5) data-cursor attributes everywhere. 6) "?" cheat-sheet. Playwright: open palette, type, filter, navigate; commit.
```

### Phase 7: Progress, plan and attention tools (session, ~2–3 hours)

```markdown
Phase 7. Read CLAUDE.md research rules. 1) Flashcards with ts-fsrs: /cards and /[unit]/cards; daily queue; 3D flip; grade keys 1–4; cloze, occlusion (mask regions on an image; recall on click), apply cards; suspend/edit; sentence-to-card capture on note pages (select, press C, cloze card linked to the paragraph); Anki-compatible CSV export; per-deck parameter optimisation after 400 reviews; desired retention 0.90, 0.93 within 14 days of that unit's exam. 2) Dashboard: mastery per unit/week/concept, criterion counts, days-studied-in-last-14 (never a chain), minutes, accuracy trend, calibration curve, readiness vs exam date with a plain-language line; count-ups; hand-rolled SVG only. 3) Session start ritual (unit or due, one if-then line, block length) and "2-minute start"; "What next?" and "Continue" (route + scroll + index). 4) TimerArc focus block 25/5 default; chrome fades to 30%; one soft synthesised tone at end (Web Audio, no files); session summary. 5) Study companion panel: optional, a quiet animated presence (a small ink figure or lamp) whose progress bar advances beside mine, one plain sentence at milestones, configurable presence/off. 6) Brown/pink noise generator (Web Audio), volume dial, off by default, the settings copy notes it can hurt for hyperactive-type ADHD. 7) Focus mode; deep-dive mode with a soft 45-minute toast. 8) Study plan page: day-by-day to each exam from remaining weak and unsecured concepts, written as if-then lines, interleaving units; .ics export. 9) Milestone stamps at 50/80/95% and "queue cleared"; quiet, once. Vitest: a 30-day FSRS simulation and the readiness formula. Commit per feature.
```

### Phase 8: The intro film and unit hubs (session, ~3 hours, Opus, effort high, plan mode)

```markdown
Phase 8. Read CLAUDE.md sections 5.7–5.9. Write the SCENE brief for the intro and for the unit hub first and wait for go.

Intro (/ on first visit each day; any key skips; never shown in off mode): a ThreeScene in the site theme (paper background, ink Line2 geometry, one amber point light, grain 3%, vignette 8%), pinned for 450vh, scrubbed by scroll on one GSAP timeline that tweens camera position, light intensity, particle targets and HTML caption opacity together, in four beats: (1) a single point of light; the site name assembles from particles via SplitText-style character reveal; (2) thin orbit lines draw in, forming a slowly rotating constellation of ~120 nodes; (3) nodes drift into four clusters that brighten to the unit labels while the camera dollies in 15%; (4) the scene fades and the four clusters Flip into the four real DOM unit cards over 900ms. Cursor: nodes within 200px are attracted with a spring (stiffness 0.08, damping 0.85); nearest brightens. DPR ≤ 1.5, pauses off-screen, lazy bundle ≤ 480 KB gz measured in the build.

Unit hub /[unit]: a horizontal week timeline pinned for 300vh; week cards enter with a 40ms stagger showing topic, concept count, four-segment criterion ring, last visit; the exam date closes it with a countdown. Below: knowledge map (D3 force; nodes by mastery; edges from `related`; backlinks), due cards, weakest concepts, and the session start button. Mobile: vertical, unpinned.

Screenshot at 6 desktop and 3 mobile scroll positions in all motion modes; Playwright CDP trace at 4× CPU throttle: ≥ 95% of frames under 16.7ms or fix it; Lighthouse home ≥ 90 with the intro; commit.
```

### Phase 9: Explainers for every concept (many short sessions, Opus; continues forever)

Per concept, or per week once you trust the pattern:

```markdown
/build-explainer laws2400-remoteness-wagon-mound
```

```markdown
For every concept in LAWS2000 week 4 with no explainer in the manifest, run /build-explainer with go pre-approved, three at a time via subagents, each confined to its own files. Simulation for anything with variables, Palace for ordered lists, ScrollExplainer otherwise. Show me a contact sheet of all screenshots at the end.
```

Push on metaphors that expose *structure*: limbs as gates, a calculus as a balance, sources as a stack, a spectrum as a slider, attribution as a chain of links that either close or don't. Reject anything decorative.

### Phase 10: Extras (one session)

```markdown
Phase 10. Read CLAUDE.md. Build and commit each: (1) read-aloud on concept cards and case briefs (Web Speech, 1.2×, sentence highlighting, Space to pause) and the per-week audio recap player; (2) annotations and highlights with a margin rail, searchable in the palette, exportable; (3) compare mode for two cases or theories, scroll-synchronised; (4) explain-it-back with a 60-second timer and a self-rating feeding FSRS; (5) PWA offline with an install prompt on the dashboard; (6) dark lamp-lit theme per section 5.11; (7) export/import of all Dexie data as JSON to exports/, plus optional Gist sync behind a pasted token; (8) image-occlusion authoring on any diagram.
```

### Phase 11: Polish and deploy (session, ~2 hours)

```markdown
Phase 11. Read CLAUDE.md. 1) Delete src/content/**/seed/ and prove the gate still passes (seed is excluded from counts). 2) /audit-content for every unit; fix everything flagged. 3) Performance: analyse the build; code-split every island; lazy-load Three and D3; preload fonts; CLS < 0.05 on every route (Playwright); CDP trace the intro, a hub and one explainer at 4× throttle; Lighthouse ≥ 90 performance and 100 accessibility on home, hub, week, concept, quiz. 4) Accessibility: labels, focus traps, 7:1 body contrast, text alternatives for every explainer. 5) Deploy: npx wrangler pages project create studysite; build npm run build, output dist; connect the GitHub repo so main auto-deploys; give me the URL (Vercel if Cloudflare fails). 6) README: adding a week (/add-week), regenerating questions, running the audit, deploying. Commit and push.
```

### After launch: the only two commands you will use

- New materials: drop them in `raw/<unit>/week-NN/`, run `/add-week <unit> <NN>`, check the verify list, push.
- Every Sunday: export from the dashboard, run `/weekly-review`.



## 9. Quality gates

Run this checklist at the end of every phase; do not start the next phase with a red item. Most of it Claude Code runs itself; the last group is your eyes.

**Automated (paste into Claude Code at the end of each phase)**

```markdown
Run the phase gate: npm run validate, npm run gate, npm run build, npm run test, npm run e2e. Then with Playwright: screenshot home, one unit hub, one week page, one concept page (with its explainer at three scroll positions) and the quiz page at 1440×900 and 390×844 in motion full, calm and off; measure CLS and LCP on each; CDP-trace the intro and the hub at 4× CPU throttle and report the share of frames over 16.7ms; check the console; run Lighthouse on home and one concept page; report every chunk over its byte budget. Give me a table and fix anything under: LCP 1.5s, CLS 0.05, 95% frames under 16.7ms, Lighthouse performance 90 and accessibility 100, zero console errors, zero budget breaches. Then commit.
```

**Motion review (you, five minutes)**

- [ ] Scroll a pinned section slowly and quickly: no jumps, no frames where text overlaps, reversing scroll reverses the animation smoothly
- [ ] Nothing moves that the eye wasn't sent to; if you notice an animation before you notice its content, it's too loud
- [ ] Hover a card, a button and a quiz option: lift, fill and cursor change all feel immediate (<200ms)
- [ ] Switch to Calm: parallax, tilt and cursor trail gone, everything still legible. Switch to Off: instant states, nothing broken
- [ ] On your phone: no custom cursor, no pinned horizontal timeline, everything reachable with a thumb

**Reading review (you, five minutes on one week page)**

- [ ] Lines are 60–70 characters; you never lose your place returning to the next line
- [ ] Headings bind to their paragraphs (more space above than below)
- [ ] Only one thing on screen is accent-coloured
- [ ] Callouts are distinguishable by their labels without reading the body
- [ ] Your own phrasing survived ingestion

**Learning review (you, after phase 4)**

- [ ] A wrong MCQ answer tells you *why yours was tempting*, not just what's right
- [ ] Clicking a rubric criterion shows what a top answer includes for that line
- [ ] Starting a session takes one click and shows something you can finish in 30 seconds
- [ ] The adaptive picker actually serves your weak topics (check the error log after 20 questions)

**Content review (you, after each unit ingest)**

- [ ] Every `verify: true` item checked against the source
- [ ] Spot-check five MCQs per week for accuracy; if more than one is wrong, re-run `/generate-questions` for that week with the correction as context

**Incremental-content gate (Claude Code, after phase 3 and after every later content run)**

```markdown
Prove the content pipeline is safe: (1) run /add-week on an already-ingested week and show git status is clean; (2) make a one-word change in that week's raw notes, re-run, and show only files with that week's id prefix changed and the gate passed; (3) create a throwaway raw/laws2400-torts/week-99/ with a two-paragraph note, run /add-week LAWS2400 99, and show the new week appears in the hub timeline, search, the card queue and the picker with every other count unchanged; then delete week-99 from raw and content and show the gate passes again. Report all four results with evidence.
```

**Performance budgets (enforced in Lighthouse CI config)**

| Metric | Budget |
| --- | --- |
| LCP | ≤ 1.5 s |
| CLS | ≤ 0.05 |
| INP | ≤ 200 ms |
| JS per route (gzipped) | ≤ 180 KB, intro route ≤ 480 KB |
| Fonts | ≤ 4 files, WOFF2, preloaded |
| Frame time during scrub | ≤ 16.7 ms on 95% of frames |

