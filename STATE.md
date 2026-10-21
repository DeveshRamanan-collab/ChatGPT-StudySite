# STATE — StudySite

Working state for AUTOPILOT.md. Tick tasks as they complete; BLOCKED/FAILED marks go at the end of the line.

## User directives (2026-09-26)
- raw/ is the user's: never overwrite anything in raw/ (README.md and unit.yaml included). Law notes for weeks 1–7 are present for LAWS2400, LAWS2000 and LAWS2100.
- MGMT2094 has no notes yet: task 3.4 stays BLOCKED until the user adds them.
- PAUSE for user review after tasks 2.6, 4.8 and 8.3: tell the user what to open and what to look at, then wait for go-ahead or corrections.
- FEATURES.md is the acceptance checklist: at 2.6, 4.8, 8.3, 9.2 and 11.2 compare the site against it and add every missing feature to this ladder as a new task before continuing.

## Ladder
- [x] 1.1 [S] · Content schemas (src/content/config.ts) · needs: — · check: `npm run build` passes with seed content · see: Phase 1 step 1
- [x] 1.2 [S] · Seed content under src/content/**/seed/ · needs: 1.1 · check: build passes; `seed: true` on every file · see: Phase 1 step 2
- [x] 1.3 [S] · All routes rendering collection data with plain defaults · needs: 1.2 · check: Playwright visits every route, no console errors · see: Phase 1 step 3
- [x] 1.4 [S] · tokens.css wired via base.css and Layout.astro · needs: 1.3 · check: computed body font-size 19px, background #FBF7F0 in a Playwright assertion · see: Phase 1 step 4
- [x] 1.5 [S] · scripts/validate.mjs (cross-refs, ≥20 questions per non-seed concept) · needs: 1.2 · check: `npm run validate` passes; a fixture with a dangling concept id fails · see: Phase 1 step 5
- [x] 1.6 [S] · Wire scripts/gate.mjs; Vitest fixture proving a removed card fails the gate · needs: 1.5 · check: `npm run gate` and `npm test` pass · see: Phase 1 step 6
- [x] 1.7 [S] · Playwright smoke test + CI workflow green locally · needs: 1.3 · check: `npm run e2e` passes · see: Phase 1 step 7
- [x] 2.1 · Typography, fonts (no CLS), grid, right rail, /styleguide · needs: 1.4 · check: CLS < 0.05 on /styleguide and home at both viewports · see: Phase 2 step 1
- [x] 2.2 · src/lib/motion.ts (Lenis+GSAP one RAF, page-load/before-swap lifecycle, motion dial) · needs: 2.1 · check: Playwright test navigates three pages and asserts ScrollTrigger count is correct each time; dial persists · see: Phase 2 step 2
- [x] 2.3 · Components with all states (Button, Card, Callout, ProgressRing, Chip, Toast, Modal, Popover, Tabs, Kbd, TimerArc, Stamp) · needs: 2.2 · check: /styleguide screenshots at both viewports in full/calm/off show every state without overlap · see: Phase 2 step 3
- [x] 2.4 · Page-level motion and view transitions per the transition catalogue · needs: 2.3 · check: unit card → hub shared-element transition visible in a Playwright trace; reduced motion shows fades only · see: Phase 2 step 4
- [x] 2.5 · Custom cursor + ambient paper gradient · needs: 2.4 · check: disabled on a touch viewport; native cursor restored when dial ≠ full · see: Phase 2 step 5
- [x] 2.6 · Apply the system to skeleton pages; Lighthouse ≥ 90 · needs: 2.5 · check: Lighthouse home perf ≥ 90, a11y 100 · see: Phase 2 step 6 · PAUSE after: user review · FEATURES.md check
- [x] F2 [S] · Schema additions before ingest: concept `depends-on` / `contrasts-with` edges (knowledge map) and case `why-here` ("why it matters here"); validator checks the new refs; ingest-week skill writes them · needs: 1.5 · check: `npm run validate` fails on a dangling depends-on fixture · see: FEATURES.md 3.1 knowledge map, 3.2 case cards
- [x] F7 [S] · Validator runs inside `npm run build` so content gaps fail the build · needs: 1.5 · check: build fails on the dangling-id fixture copied into src/content, passes after removal · see: FEATURES.md 3.5
- [x] 3.1 [S] · Ingest + questions for LAWS2400 (all weeks in raw/laws2400-torts) · needs: 1.6, F2 · BLOCK if raw/laws2400-torts has no week folders with files · check: audit table; idempotence (second run → clean git status); isolation (one-word change touches only that week) · see: Phase 3
- [x] 3.2 [S] · Same for LAWS2000 · needs: 3.1 · see: Phase 3 · IN PROGRESS: w01 done (emitted, qa/validate/gate ok); content-src/laws2000-w02.yaml and -w03.yaml are UNFINISHED agent drafts (not emitted, not QA'd) — re-run those weeks (prompt template: see Log 2026-09-26 3.2 note); w04–w07 and pq not started
- [x] 3.3 [S] · Same for LAWS2100 (essay template) · needs: 3.1 · see: Phase 3
- [ ] 3.4 [S] · Same for MGMT2094 (essay template, real-company examples) · needs: 3.1 · see: Phase 3 · BLOCKED: add MGMT2094 notes to raw/mgmt2094-sci/week-NN/, then say unblock 3.4
- [x] 4.1 · Dexie data layer + Zustand selectors · needs: 2.3 · check: Vitest on selectors (accuracy, calibration, days-in-14, readiness) · see: Phase 4 data layer
- [x] 4.2 · Confidence gate + MCQ with two-sided explanations + requeue rows · needs: 4.1 · check: Playwright: sure+wrong creates three requeue rows; explanation panel opens via clip-path · see: Phase 4 steps 1–2
- [x] 4.3 · Criterion tracker + four-segment ring · needs: 4.2 · check: Vitest simulation: 3 correct → learned; 3 spaced sessions → secured · see: Phase 4 step 3
- [x] 4.4 · Pretest gate on week pages · needs: 4.2 · check: first visit shows 5 questions before notes; skip is logged · see: Phase 4 step 4
- [x] 4.5 · Short answer with clickable marking criteria + margin notes · needs: 4.1 · check: ticking rows updates score live; highlights matching model sentences · see: Phase 4 step 5
- [x] 4.6 · Long answer: answer-plan step, exam-paper mode, three tiers, promotion · needs: 4.5 · check: worked tier hides next step until predicted; faded pre-fills given{}; two passes ≥70% promotes · see: Phase 4 step 6 · + FEATURES: rubric gaps → cards in one click
- [x] 4.7 · Adaptive picker with tests · needs: 4.3 · check: Vitest on weighting and requeue ordering · see: Phase 4 step 7
- [x] 4.8 · Quiz modes incl. Match, Quick-fire, Exam sim with CBM; session recap · needs: 4.7 · check: each mode screenshot; CBM scoring test · see: Phase 4 step 8 · PAUSE after: user review · FEATURES.md check
- [x] 4.9 [S] · Error log page · needs: 4.2 · see: Phase 4 step 9
- [x] F1 · Home: Continue (route + scroll + question index) above four unit tiles with progress rings, days-to-exam, today's due count and the last if-then line · needs: 7.3 · check: Playwright: answer 2 questions, go home, Continue returns to the same question · see: FEATURES.md 3.1
- [x] F3 · Reading page: minimap in the rail, split-reveal on note headings, 3-minute retrieval nudge, delayed judgement-of-learning prompt · needs: 4.2 · check: Playwright with a mocked clock shows the nudge at 3:00 · see: FEATURES.md 3.1/3.2, CLAUDE.md research rules
- [x] F4 · Concept card component: Flip expand in place; Quiz me / Cards / Simulate / Explain it back / Mark for later; four-segment criterion ring · needs: 4.3 · check: expand/collapse via Flip in full, instant in off; each action routes correctly · see: FEATURES.md 3.2
- [x] F5 · Diagram base (self-drawing DrawSVG) + draggable Timeline base for case-law/treaty development · needs: 5.2 · check: budget script passes; timeline drag works with keyboard too · see: FEATURES.md 3.2
- [x] F6 [S] · Question bank browser: filter by concept/type/difficulty/week, re-test any subset · needs: 4.7 · see: FEATURES.md 3.3
- [x] F8 · All-units exam simulation (interleaves units, CBM, debrief) reachable from home/dashboard · needs: 4.8 · check: a paper mixes ≥ 2 units with no two consecutive from the same unit where avoidable · see: FEATURES.md 3.3, CLAUDE.md research rules
- [x] 5.1 · Explainer manifest + loader (pinned desktop, paced mobile) · needs: 2.4 · see: Phase 5 step 1
- [x] 5.2 · Bases: ScrollExplainer, Simulation, Palace, ThreeScene (+ byte budget script) · needs: 5.1 · check: budget script passes; ThreeScene pauses off-screen (test) · see: Phase 5 steps 2–3
- [x] 5.3 · Prove bases with three Torts concepts (calculus simulation, Caparo scroll, negligence palace) · needs: 5.2 · check: screenshots at 3 scroll positions, both viewports, full/off · see: Phase 5 step 4
- [x] 6.1 [S] · Pagefind + /search · needs: 1.3 · see: Phase 6 item 1
- [x] 6.2 [S] · Command palette with typed filters and commands · needs: 2.3 · check: Playwright opens, types, filters, navigates · see: Phase 6 item 2
- [x] 6.3 [S] · Case/authority/clause popovers, three-density case cards, AGLC4 copy, read-aloud · needs: 2.3 · see: Phase 6 item 3
- [x] 6.4 [S] · Backlinks, data-cursor attributes, ? cheat-sheet · needs: 6.3 · see: Phase 6 items 4–6
- [x] 7.1 · Flashcards with ts-fsrs (cloze, occlusion, apply, sentence-to-card, Anki CSV export, optimisation) · needs: 4.1 · check: 30-day FSRS simulation test · see: Phase 7 item 1 · + FEATURES: schedule customCards (rubric gaps, sentence-to-card) alongside content cards
- [x] 7.2 · Dashboard (mastery, criterion counts, days-in-14, calibration curve, readiness) · needs: 4.3 · see: Phase 7 item 2
- [x] 7.3 · Session start ritual, 2-minute start, What next?, Continue · needs: 7.2 · see: Phase 7 item 3 · + FEATURES: 2-minute start asks \"keep going?\" once only
- [x] 7.4 · TimerArc focus block, chime, session summary · needs: 2.3 · see: Phase 7 item 4
- [x] 7.5 · Study companion panel (optional, configurable) · needs: 7.4 · see: Phase 7 item 5
- [x] 7.6 [S] · Brown/pink noise generator, off by default, warning copy · needs: 7.4 · see: Phase 7 item 6
- [x] 7.7 [S] · Focus mode, deep-dive mode with 45-min toast · needs: 7.4 · see: Phase 7 item 7
- [x] 7.8 · Study plan page with if-then lines and .ics export · needs: 7.2 · see: Phase 7 item 8
- [x] 7.9 [S] · Milestone stamps · needs: 7.2 · see: Phase 7 item 9 · + FEATURES: 50/80/95% mastery, queue cleared, personal bests
- [x] 8.1 · SCENE briefs for intro and unit hub (write to docs/scenes/) · needs: 5.2 · check: both briefs exist in the 5.7 format · see: Phase 8
- [x] 8.2 · Intro film (four beats, cursor attraction, ≤ 480 KB gz, skip, once per day) · needs: 8.1 · check: CDP trace at 4× throttle ≥ 95% frames < 16.7 ms; bundle size printed · see: Phase 8
- [x] 8.3 · Unit hub (pinned week timeline, knowledge map, due, weakest, start button) · needs: 8.1, 7.2 · check: 6 desktop + 3 mobile screenshots in all modes · see: Phase 8 · PAUSE after: user review · FEATURES.md check
- [x] 9.1 · Explainers for every concept with variables (Simulation) across all units · needs: 5.3, 3.x for that unit · uses subagents ×3 · see: Phase 9
- [x] 9.2 [S] · Explainers for every remaining concept (ScrollExplainer/Palace) across all units · needs: 9.1, F5 · uses subagents ×3 · check: manifest covers 100% of non-seed concepts · see: Phase 9 · FEATURES.md check
- [x] 10.1 [S] · Read-aloud + audio recap player · needs: 6.3 · see: Phase 10 item 1
- [x] 10.2 [S] · Annotations with margin rail · needs: 6.2 · see: Phase 10 item 2
- [x] 10.3 [S] · Compare mode · needs: 6.3 · see: Phase 10 item 3
- [x] 10.4 [S] · Explain-it-back · needs: 7.1 · see: Phase 10 item 4
- [x] 10.5 [S] · PWA offline + install prompt · needs: 2.6 · see: Phase 10 item 5
- [x] 10.6 [S] · Dark lamp-lit theme · needs: 2.6 · see: Phase 10 item 6
- [x] 10.7 [S] · Export/import JSON (+ optional Gist sync) · needs: 4.1 · see: Phase 10 item 7
- [x] 10.8 [S] · Image-occlusion authoring · needs: 7.1 · see: Phase 10 item 8
- [x] 11.1 [S] · Purge seed content; gate still passes · needs: 3.1 (else BLOCK: "needs at least one real unit ingested before seed purge") · see: Phase 11 item 1
- [x] 11.2 [S] · /audit-content all; fix everything flagged · needs: 11.1 · see: Phase 11 item 2 · FEATURES.md check
- [x] 11.3 · Performance pass (code-split, lazy Three/D3, CLS, CDP traces, Lighthouse) · needs: 9.2, 8.3 · check: budgets in CLAUDE.md rule 12 all met · see: Phase 11 item 3
- [x] 11.4 [S] · Accessibility pass · needs: 11.3 · check: Lighthouse a11y 100 on five routes · see: Phase 11 item 4
- [ ] 11.5 [S] · Deploy to Cloudflare Pages via Git integration · needs: 11.4 · make sure `npm run build` outputs to dist/ and pushes cleanly; then BLOCK: "In Cloudflare: Workers & Pages → Create → Pages → Connect to Git → studysite; build command `npm run build`, output `dist`; then say unblock 11.5 with the .pages.dev URL" · check: that URL returns 200 and renders home · see: Phase 11 item 5 (ignore its wrangler instructions) · BLOCKED: in Cloudflare: Workers & Pages → Create → Pages → Connect to Git → DeveshRamanan-collab/study-site; build command `npm run build`, output `dist`, Node 22 (.node-version); then say "unblock 11.5" with the .pages.dev URL
- [x] 11.6 [S] · README.md (add a week, regenerate, audit, deploy) · needs: 11.5 · see: Phase 11 item 6

## October 2026 — new material + drawer (plan: docs/plans/2026-10-ingest-and-drawer.md)
- [x] O1 · Drawer rebuild (diagnose, replace NavSheet, Playwright + axe tests, before/after shots) + White theme · check: new drawer tests fail on old NavSheet, pass on new; axe clean
- [x] O2 [S] · Copy new material into raw/ (no video; big pptx gitignored + text sidecar); raw/README.md updated
- [x] O3 [S] · Copy the user's transcripts into raw/ (17 supplied; never generated)
- [x] O4 · Pilot: Torts w07 via /add-week · PAUSE after: show the user · WAITING for the user's review
- [x] O5 · Torts w08 · then w09–w12 (thin: flowchart only)
- [x] O6 · International w08–w12 + unit-wide revision set (tutorial stems kept)
- [x] O7 · Jurisprudence w08–w09
- [x] O8 · Marketing w01–w12 (+ long questions once the user gives exam dates/format)
- [x] O9 · Regenerate International w06, Torts w03, w05 (append only, ids kept)
- [ ] O10 · Audit all, validate, gate, full Playwright, Lighthouse; push; live check; strip tags from ingested originals

- [x] O11 · Exam timetable (draft) from one source: raw/<unit>/unit.yaml → scripts/units.mjs → everything (c9d2a10)
- [x] O12 · Unit-wide International revision set (from w12 revision slides + tutorial revision quiz) · after O6
- [x] O13 · Marketing long questions (essays on a statement, 4 per tier) + Torts/International pq for new weeks · after O5/O6/O8

- [ ] O14 · Newly released material (law weeks 8–12 still coming) — run /new-material each time; pending list docs/pending-material.md · BLOCKED until the user uploads

## Log
- 2026-09-26 bootstrap done — starter files, Astro 5 hand-scaffolded (template host unreachable), deps installed
- 2026-09-26 1.1 done — strict schemas for 8 collections; build passes with seed
- 2026-09-26 1.2 done — 4 units, 4 weeks, 2 concepts, 2 cases, 1 authority, 8 questions, 6 cards, 1 audio; all seed: true
- 2026-09-26 1.3 done — 13 route families (30 pages); Playwright 62/62 no console errors; pinned @playwright/test 1.56.1 to match preinstalled Chromium
- 2026-09-26 1.4 done — base.css reset/type on tokens; Playwright asserts 19px on #FBF7F0
- 2026-09-26 1.5 done — validate.mjs checks all cross-refs + ≥20 q/concept (non-seed); dangling-id fixture fails (Vitest)
- 2026-09-26 1.6 done — Vitest 7/7 (removed card fails, ADD_WEEK isolation); gate now counts .astro routes (was 0)
- 2026-09-26 1.7 done — npm ci, validate, gate, test, build, e2e (64) all green locally; CI on node 22
- 2026-09-26 2.1 done — WOFF2 in public/fonts + capsize fallbacks; CLS < 0.05 on /, /styleguide, week (both viewports); styleguide renders tokens from tokens.css
- 2026-09-26 2.2 done — motion.ts (reveal/splitReveal/scrub/pin/parallax/flipTo), ClientRouter lifecycle; Playwright: trigger count == expected across 4 navigations, dial persists, reduced motion → off; astro check clean
- 2026-09-26 merged main: raw notes for three law units (weeks 1–7); 3.4 blocked (no MGMT2094 notes); review pauses after 2.6, 4.8, 8.3
- 2026-09-26 2.3 done — Button/Card/Chip/Callout/ProgressRing(criterion)/Toast/Modal/Popover/Tabs/Kbd/TimerArc/Stamp + quiz option feedback; styleguide full/calm/off × desktop/mobile: no overlap, no overflow, no console errors
- 2026-09-26 merged FEATURES.md from main; acceptance check added at 2.6, 4.8, 8.3, 9.2, 11.2
- 2026-09-26 2.4 done — page enter/leave per catalogue; shared unit/week/case names; trace saved (reports/traces); reduced motion → fades only, no group morph; header condenses via transform; progress hairline
- 2026-09-26 2.5 done — dot+lerped ring (link/text/drag/option states), magnetic ≤6px via translate, ambient glow; off on touch and when dial ≠ full (Playwright)
- 2026-09-26 2.6 done — breadcrumbs, cards, chips, buttons on all pages; Lighthouse desktop perf 100 / a11y 100 on 5 routes (lighthouserc.cjs, CHROME_PATH=/opt/pw-browsers/chromium); added --accent-fill/--on-accent for 4.8:1 button contrast; stamp text now ink. Note for 11.3: mobile home LCP 2.4 s on simulated slow 4G (perf 98)
- 2026-09-26 FEATURES.md check at 2.6 — added F1–F7 (home tiles/Continue, schema edges + why-here, reading minimap/nudges, concept card, diagram+timeline bases, question bank browser, validate-in-build); details appended to 4.6, 7.3, 7.9
- 2026-09-26 PAUSE for user review after 2.6
- 2026-09-26 review 2.6: user approved; fixed off-centre case chip (swatch class collided with .chip); added class-collision lint + label-centring e2e on all routes; resuming
- 2026-09-26 F2 done — schema + validator + ingest skill updated; dangling depends-on fixture fails; why-here shown on case cards
- 2026-09-26 F7 done — npm run build = validate && astro build; dangling-id file in src/content fails the build (exit 1), clean passes
- 2026-09-26 4.1 done — db.ts (7 tables), selectors.ts (accuracy, calibration, days-in-14 on Sydney days, minutes, due, criterion, readiness), store.ts (liveQuery); Vitest 12/12 (run in parallel with 3.1 content agents)
- 2026-09-26 4.2 done — S/U/G gate locks options; instant marking; explanation panel (clip-path wipe; fade when off); sure+wrong → 3 requeue rows at +10m/+1d/+4d + watch mark (Playwright 10/10); bank served as /data/<unit>/questions.json
- 2026-09-26 4.3 done — criterion.ts (3 correct/session → learned; 3 spaced ≥2-day relearns → secured); ring on concept page, hub list, question cards; Vitest simulation 5/5; Playwright ring stages 1→2→4
- 2026-09-26 4.4 done — inline gate hides notes before paint on first visit; 5 pretest MCQs with feedback; done/skip logged in Dexie settings + localStorage; Playwright: gate, completion, skip, second visit
- 2026-09-26 4.5 done — ShortAnswer (auto-grow editor, ⌘Enter, optional TimerArc, confidence at submit), model slides in beside, RubricPanel (expand → top band + margin note, tick → live score), keyword sentence highlighting (match.ts, Vitest); Playwright on real week-3 content
- 2026-09-26 4.6 done — AnswerPlan (drag + ↑/↓), exam-paper mode (chrome hidden, beforeunload, TimerArc), worked/faded/full, rubric + HD/D/Cr/P band, gaps → customCards (Dexie v2), tier promotion (tiers.ts, Vitest); Playwright 6/6 with injected long fixtures (real long questions come with 3.1 pq)
- 2026-09-26 4.7 done — picker.ts: due requeues → due relearns → weighted concepts (error, staleness, overconfidence, criterion, coverage) → least-recently-seen question → interleave by week/unit; seeded; Vitest 7/7; runner waits for bank + progress before picking
- 2026-09-26 4.8 done — QuizModes (?mode=): Mixed/By week/Weakest/Quick-fire 60s T-F/Match 60s (cases↔ratios, verified only)/Exam sim (paper, C1–3 CBM, debrief)/Short/Problem-or-essay; SessionRecap (count-up ring, most improved); Vitest CBM 3/3; Playwright modes 12/12, full suite 423 green (built in a worktree on committed content)
- 2026-09-26 FEATURES.md check at 4.8 — added F8 (all-units exam sim); 7.1 must schedule customCards
- 2026-09-26 PAUSE for user review after 4.8 (content agents for LAWS2400 w1/w3 revision, w4, w5 still running)
- 2026-09-26 review 4.8: user said go; resuming (3.1 content agents still running: w05 rebalance, w06)
- 2026-09-26 4.9 done — ErrorLog: wrong answers by concept (most open first), your choice + right answer with both whys, confidence, watch mark (sure+wrong), now-right items sink; re-test in place or by concept; Playwright 2/2
- 2026-09-26 F3 done — Minimap (rail ≥1100px, labels ≥18px apart), note headings split-reveal, nudge at 3:00 visible reading (Playwright mocked clock), delayed JOL on return ≥1h (Dexie settings); full suite 725 green on all six Torts weeks
- 2026-09-26 F4 done — ConceptCard on week pages: Flip (transform-only) + clip-path reveal, instant when off; Quiz me/Cards/Simulate(#explainer)/Explain it back(?explain=1)/Mark for later (Dexie); full suite 731 green
- 2026-09-26 F6 done — /[unit]/questions: filter by week/concept/type/difficulty/status, select any subset → quiz mode=set re-tests exactly that set; Playwright + smoke/alignment on the new route
- 2026-09-26 F8 done — /exam merges all banks; exam picker draws a fair weighted share per unit then strictly alternates; linked from home + dashboard; Vitest + Playwright (injected second bank)
- 2026-09-26 5.1 done — explainer manifest (concept id → module + base), lazy registry, ExplainerHost: pinned ≥1100px + full motion, paced otherwise, SSR-safe placeholder; validator checks manifest keys and module files
- 2026-09-26 5.2 done — bases ScrollExplainer, Simulation, ThreeScene (DPR ≤1.5, grain/vignette pass, pauses off-screen), Palace; scripts/budget.mjs (explainers ≤120 KB gz, three vendor ≤180 KB) — budget ok (2.7–3.8 KB each, three 129 KB)
- 2026-09-26 5.3 done — proofs: CLA mental-harm gates Simulation (no breach week yet; see docs/plans/5.md), duty-evolution timeline ScrollExplainer, negligence-elements Palace; screenshots 3 positions × desktop/mobile × full/off; full suite 767 green
- 2026-09-26 3.1 done — LAWS2400 weeks 1–6 + 12 long questions (4 worked/4 faded/4 full); idempotence and isolation proofs in docs/plans/3.1-proofs.md; scripts/audit.mjs → reports/audit-2026-09-26.md: 42 concepts all ≥20 q, 6 short/week, cards 29–41/week, 27 verify:true items (unit exam date, 22 cases, 4 statutes) listed for review; longest-correct 25%
- 2026-09-26 F5 done — Diagram base (DrawSVG, per-step draw; pinned scrub / paced Next-Back / off finished + captions) and Timeline base (drag with snap, click a mark, ← → Home End; slider role); proofs: Torts w01 branches diagram, w06 psychiatric-harm timeline; budget ok (2.4–2.7 KB gz); full suite 769 green + long.spec fixed (fixtures replace the bank's real long questions)
- 2026-09-26 3.2 partial — LAWS2000 w01 committed (7 concepts, 140 q, 28 cards; qa ok: longest 32%, shortest 19%; verify: Lotus citation, UN Charter arts 2(1), 5–6). w02/w03 agents stopped mid-write for the switch to a local session; their specs are drafts. Agent brief: Weekly Notes are the spine (keep the student's sentences; drop amber incidental text), transcripts grepped for detail, one agent per week, three at a time
- 2026-09-26 6.1 done — Pagefind runs in npm run build over week/concept/case/authority pages (kind + unit filters); /search groups results with highlighted excerpts, live as you type, ?q= kept; Playwright 4/4
- 2026-09-26 6.2 done — Palette island (⌘K/Ctrl K or header Search): Fuse over /data/search-index.json (pages, weeks, concepts, cases, authorities, questions) + annotations; Recent/Jump to/Questions/Commands; case: week: wrong: unit: filters; > commands (quiz, due, what next, focus, motion, theme, plan, export, shortcuts); origin-aware scale+blur 200ms, Esc 150ms; Playwright 3/3
- 2026-09-26 6.3 done — rehype-mentions links every case/authority name in notes (a.mention[data-case|data-authority]); hover/focus popover 120ms in/200ms out, origin-aware, brief ratio + why-here or clause text + gloss + applying cases; click morphs into case title; case cards: full/brief/one-line in place (persisted), AGLC4 copy, read-aloud 1.2× en-AU; Playwright 4/4
- 2026-09-26 6.4 done — Backlinks (Referenced in) on every concept (depends-on/contrasts/related) and case (concepts, week notes, authorities); cursor: sliders/draggables → drag, options → link, timeline handle data-cursor; ? cheat-sheet (also footer + palette); smoke+alignment 914 green
- 2026-09-26 7.1 done — ts-fsrs scheduler (retention 0.90 → 0.93 within 14 days of the unit exam), /cards and /[unit]/cards daily queue (due → ≤20 new/day interleaved by week), 3D flip (fade in calm/off), 1–4 grades with interval previews, cloze/apply/occlusion/custom cards, suspend + edit in place, Anki CSV export, per-deck optimisation after 400 reviews (Dexie v3 reviews/cardEdits), sentence-to-card (select + C → cloze linked to #para-N); Vitest 30-day simulation + optimiser + queue 6/6; Playwright 3/3
- 2026-09-26 7.2 done — Dashboard island: days studied as a count (14 squares, no chain), minutes/answers/cards, readiness vs target per unit with a plain line, learned/secured counts, 14-day accuracy trend, calibration vs well-calibrated ticks, mastery by week→concept, table view, count-ups (instant when off); /data/overview.json; Vitest + Playwright
- 2026-09-26 7.3 done — Session start ritual on home (unit or whatever's due, one if-then line, 15/25/45 min), 2-minute start on the weakest concept (asks keep going? once at 2:00), What next? (due re-tests → due cards → weakest concept of the most pressing unit → next unread week), Continue (route + scroll + quiz question via ?resume=1); Vitest + Playwright
- 2026-09-26 7.4 done — FocusBlock: corner TimerArc, chrome fades to 30% (restored on hover), one soft 440 Hz sine at the end, session summary with the most-improved concept, 5-minute break
- 2026-09-26 7.5 done — Companion lamp (off by default, settings): own progress bar beside the timer, one plain sentence at 25/50/100%
- 2026-09-26 7.6 done — Brown/pink noise (Web Audio, looped generated buffer, volume dial), off by default, hyperactive-type warning copy on /settings
- 2026-09-26 7.7 done — Focus mode (palette, block, settings; Esc leaves) hides all but [data-focus-keep]; deep dive with one soft toast at 45 min
- 2026-09-26 F1 done — Home: Continue first, 2-minute start, What next?, ritual, unit tiles with mastery ring, days to exam, due today, last if-then line; Playwright Continue returns to the same question
- 2026-09-26 7.8 done — Study plan: day by day to each exam from weak/unsecured concepts (weak ones twice), two blocks a day interleaving units, exam paper the day before, as if-then lines linking to the right quiz; regenerates live; .ics export with Sydney VTIMEZONE; Vitest + Playwright
- 2026-09-26 7.9 done — Milestones island: 50/80/95% unit mastery, queue cleared (once a day), personal best answers in a day; one quiet stamp at a time (scale .9→1 + blur 600ms, fade when off), shown once, first-run history recorded silently; Vitest + Playwright
- 2026-09-26 8.1 done — SCENE briefs written in the 5.7 format: docs/scenes/intro.md, docs/scenes/unit-hub.md (self-approved)
- 2026-09-26 8.2 done — Intro film (src/lib/intro.ts, vanilla three, lazy): 450vh sticky stage, one scrubbed GSAP timeline (point of light + wordmark → ~120-node orbit constellation → four unit clusters with labels + 15% dolly → Flip into the real unit cards), pointer spring 0.08/0.85 with nearest node amber, adaptive resolution, paused off-screen; once per Sydney day, any key/skip, never in calm/off or reduced motion; CDP 4× throttle (SwiftShader): 95–97% frames < 16.7ms (scripts/intro-perf.mjs); budget: intro 185.7 KB gz incl. three ≤ 480; Playwright 5/5
- 2026-09-26 3.2 done — LAWS2000 weeks 1–7 (w02 draft finished and emitted; w03 rebalanced + pretest/cards/audio; w04–w07 new) + 12 long questions (4 worked/4 faded/4 full); qa ok every week; re-emit of all specs → clean git status; audit: 7/12 weeks, 51 concepts, 0 under 20 q, 63 verify:true (reports/audit-2026-09-26.md)
- 2026-09-26 8.3 done — Unit hub: 300vh pinned horizontal week track (full, ≥1100px; CSS layout from first paint, so no CLS) with week cards (topic, concept count, criterion ring, learned/secured, last visit) closing on an exam card with live countdown; stacked grid in calm/off/mobile; HubPanel (start a 25-min block via what-next, due cards + re-tests, three weakest concepts); D3-force knowledge map (static layout, week columns, mastery shading, depends/contrasts/related edges, names on hover/focus, sideways scroll on mobile); screenshots 6 desktop + 3 mobile × full/calm/off, no overflow, no console errors; full suite 1738/1742 (4 stale test assumptions fixed)
- 2026-09-26 10.1 done — Read-aloud (lib/speech.ts): 1.2× en-AU, sentence highlighting via CSS Custom Highlight API, Space pauses; on concept pages, concept cards and case briefs; per-week AudioRecap player (progress, transcript)
- 2026-09-26 10.2 done — Annotations: select → toolbar Highlight (H) / Note (N, inline field), stored with #para anchor, drawn as highlights, margin rail on wide screens, Your notes list with remove; palette searches them; exported
- 2026-09-26 10.3 done — Compare mode (/compare?a=&b=): two cases or concepts side by side, proportional scroll sync; Compare with… on case and concept pages; palette command
- 2026-09-26 10.4 done — Explain it back (?explain=1 or button): 60 s TimerArc + textarea → side by side with the card → Again/Hard/Good/Easy schedules an FSRS explain card and records an attempt
- 2026-09-26 10.5 done — PWA (@vite-pwa/astro): manifest + PNG icons, precached shell (90 entries, 1.9 MB), pages network-first with offline fallback page, data stale-while-revalidate, clientsClaim; install prompt on dashboard; Settings → Save for offline fills the page cache; Playwright offline reload passes
- 2026-09-26 10.6 done — Lamp-lit dark theme: applied before paint (stored or system), carried across swaps, Settings segment + palette toggle, theme-color meta, Three.js scene colours follow tokens
- 2026-09-26 10.7 done — Export/import all Dexie tables + studysite:* settings as JSON (merge or replace, validated), optional private Gist sync with a pasted token (never exported)
- 2026-09-26 10.8 done — Image-occlusion authoring (/occlusion): pick a diagram (public/diagrams, from week study aids) or upload one, drag boxes, name labels, choose concept; saved as custom occlusion cards in the FSRS queue
- 2026-09-26 FEATURES.md check at 8.3 — every 3.1–3.5 item is built or ladder-tracked (explainers for all concepts in 9.1/9.2); nothing new to add
- 2026-09-26 11.1 done — Deleted src/content/**/seed and public/seed; gate ok, build ok, Vitest 86/86, smoke 409/409 desktop (MGMT2094 hub renders empty-state)
- 2026-09-26 progress note — 9.1: 18 simulation explainers merged (laws2100-w05-discretion-riggs-and-obligation still to do, plus any in w06/w07). 11.3 so far: desktop Lighthouse 1.0/1.0 on 5 routes, CLS ≤ 0.003; mobile (slow 4G, 4× CPU) home 0.82, week 0.84, hub 0.97 — TBT ~550ms from hydration. Agents running: LAWS2100 w06, w07.
- 2026-09-26 3.3 done — LAWS2100 weeks 1–7 (slide + transcript weeks; essay-style short answers) + 12 essay long questions (4 worked/4 faded/4 full); qa ok every week; re-emit idempotent; audit in reports/
- 2026-09-26 9.1 done — Simulation explainers for every simulation concept (22 across LAWS2400/LAWS2000/LAWS2100), each with terms beat, pure state→view, one check question
- 2026-09-26 9.2 done — Explainers for every remaining concept (ScrollExplainer/Palace/Diagram/Timeline); manifest covers 138/138 non-seed concepts; budget ok (all ≤ 120 KB gz); render check 1440/390 × full/off: no overflow or console errors. FEATURES.md check: all catalogue items built; MGMT2094 content blocked (3.4)
- 2026-09-26 11.2 done — audit all: every concept ≥ 20 q, 6 short answers/week, 4/4/4 long per unit, ≥ 25 cards/week, pretest + audio every week, 100% explainers, longest-correct 23–25%; fixed the flagged weakest explanations (82 whys rewritten); 102 verify:true items remain for the user's judgement (listed in reports/audit-2026-09-26.md); FEATURES.md check: complete except MGMT2094 content (3.4 blocked)
- 2026-09-26 11.3 done — Code-split islands (Dexie/three/d3/fuse lazy; motion bundle 121→80 KB gz; per-unit pretest JSON; intro deferred to idle), CLS ≤ 0.003 on all Lighthouse routes (island stages reserve height), desktop Lighthouse perf 1.0 / a11y 1.0 on home, hub, week, concept, quiz; CDP 4× throttle: hub 99%, week 98–99%, explainers 99–100%, intro 87–96% (software WebGL in this container; one-way adaptive resolution); budgets: intro 185.7 KB gz ≤ 480, explainers ≤ 120. Caveat: mobile-lab Lighthouse (slow 4G, 4× CPU) home ~0.8, week ~0.84, LCP 2.1–2.7 s; full e2e 2031/2032 then fixed the minimap race
- 2026-09-26 11.4 done — Lighthouse a11y 100 on home, hub, week, concept, quiz and four explainer concept pages plus 12 other routes; native <dialog> focus traps; body text 16:1 (light) / 15:1 (lamp-lit), secondary text moved off ink-3; every explainer SVG labelled or aria-hidden with a text caption; heading order fixed under explainers
- 2026-09-26 11.5 blocked — build verified from clean (dist/, 22 MB, Pagefind + service worker); waiting for the Cloudflare Pages Git connection
- 2026-09-26 11.6 done — README.md: run, add a week (/add-week), long questions, explainers, audit, deploy
- 2026-09-27 chrome pass (branch chrome-pass, plan docs/plans/chrome-pass.md) — items 1–9 committed: cursor ring translate-only (27f94af), centred column + sticky collapsible rail/TOC (b06c71d), scroll indicator + themed scrollbar (1f579da), light/dark/auto (e467b34), glass (833822c), /map + Replay intro (8cf8ca7), ≡ menu sheet, any week in 2 clicks (f312e1f), prefs store + /settings (3192cc9), styleguide + CLAUDE.md (663d82f). Next: section-9 gate + extras (Lighthouse ≥ 95 both themes with glass, crawl, rail diff), then PR chrome-pass → main. Note: backdrop blur does not render on scrolled page content in headless Chromium (renderer quirk; CSS verified, blur shows in the top-layer sheet).
- 2026-10-07 new brief: ingest 75 tagged files + Torts w07 + all Marketing, rebuild the ≡ drawer, add a White theme. Plan approved (explainers pre-approved, thin flag allowed, exam dates to come from the user). Baseline reports/baseline-2026-10-07.json. node_modules reinstalled (damaged by the folder move); tests 89/89, build 469 pages.
- 2026-10-07 O1 done — drawer cause: Lenis swallowed wheel over the sheet (Full motion); rebuilt NavSheet (own scroll body + data-lenis-prevent, page held, collapsible units with titled rows, ≥44 px, body-size text, ≤180 ms); White theme; e2e/drawer.spec.ts (6 fail on old, all pass), full suite 2076 + 4 selector fixes green; pushed (3057abf)
- 2026-10-07 O2 done — 66 files into raw/ (no video), >95 MB deck local + text extract, README; thin-week flag (ca58923). Disk: ~0.35–0.6 GB free, transcription (O3) waits for space. Pilot Torts w07 agent running (content-src/laws2400-w07.yaml).
- 2026-10-07 O4 done — Torts w07 pilot (58532e9): 8 concepts + 8 explainers, 160 q, 32 cards, pretest, audio; qa/validate/gate ok; re-emit → clean tree; 48 explainer renders clean. PAUSED for the user's review of the pilot. Transcripts: the user will supply them (20 recordings listed in chat); O3 changes from 'transcribe' to 'copy the user's transcripts into raw/'.
- 2026-10-07 brief v2 (transcripts supplied, timetable image). Timetable applied as DRAFT (c9d2a10): MGMT 10 Nov 9:00, Torts 11 Nov 17:30, Juris 14 Nov 14:00, Intl 19 Nov 13:30 (all changed; exam order MGMT, Torts, Juris, Intl); Marketing = essays on a statement; raw folder stays mgmt2094-sci. 17 transcripts in raw/ (cc3c5b8). 20 parallel week agents launched; session rate limit cut 19 at ~17:50, resumed 18:10 via SendMessage. MGMT w07 committed (d923eba, thin). Running: MGMT w01–06, w08–12; Torts w08–12; Juris w08–09; Intl w08–09. Queued: Intl w10–12. Next per finished week: merge-manifest <part>, qa/validate/ADD_WEEK gate, build, xshots render check, commit, push.
- 2026-10-07 late: all weeks built and committed — Torts w07–w12 (w09–12 thin), International w08–w12 (+ w06 Part B, w11 image slides read from the deck), Jurisprudence w08–w09, Marketing w01–w12; long questions: Marketing 12 essays, Torts +9 (w07–12), Jurisprudence +6 (w08–09). Torts w03 flowchart concept added; Torts w05 has no new source (clip only, no transcript). REPAIR: per-week commits 769da77..0386f4b staged the full explainer manifest and missed weeks/<id>.md + audio/<id>.md (glob '<week>-*'); 0386f4b was pushed broken (Cloudflare build would fail validate). 201acf9 commits every built week; validate passes on a clean checkout of the index; 315/315 manifest modules committed. scripts/_tmp_commitweek.sh now stages '<week>*', a manifest of HEAD + that week only, and validates the staged tree before committing. Running: International long questions + revision set (laws2000-pq). Next: render checks Intl w10–12 + Torts w03 → commit any fixes; O10 audit/validate/gate/full e2e/Lighthouse; live check; tag rename.
- 2026-10-08 prepared for later releases: /new-material skill; scripts/inbox.mjs (plan/copy/status/untag), integrate-week.sh, render-check.mjs, commit-week.sh (validated, per-week manifest), explainer-briefs.mjs; docs/plans/regenerate-week-brief.md (add, never replace; thin weeks lose thin only when supported); docs/pending-material.md; tests/inbox.test.ts. Tags removed from 71 ingested files (21 left: 20 videos + web-links PDF).


## 21 October 2026 — isolated ChatGPT exam rebuild

Work is confined to `DeveshRamanan-collab/ChatGPT-StudySite`. The original `study-site` and live site remain untouched; no deployment was performed.

Added sourced exam hubs and revision notes; case and legislation filters and visual stories; twenty learning tools; preferred calendar blocks; global direct navigation; rebuilt drawer styling; quiet scroll-linked paper; continuous visual/text week views and the refresh-home preference.

Validation: 441 tests passed, zero type errors, 1,265 static pages built, bundle budgets passed, and 56,097 HTML targets checked with zero missing app targets. All 9,939 original content files and all 11 supplied originals remain exact. Case verification: 41 entries checked through primary judgments, including identified later judicial accounts; 35 teaching-source; one partially unresolved Stephenson record. All 45 provision entries have complete operative text with currency qualifications visible.

Evidence: `reports/rebuild-qa.json`, `reports/rebuild-source-audit.json`, `reports/rebuild-links.json` and `docs/audits/`.
