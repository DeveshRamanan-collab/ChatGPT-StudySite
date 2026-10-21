# StudySite — CLAUDE.md

## What this is
A personal, static exam-revision website for four Macquarie University units:
LAWS2400 Torts, LAWS2000 Public International Law, LAWS2100 Jurisprudence,
MGMT2094 Strategic Creativity and Innovation. Exams 10–19 November 2026 (draft timetable; see raw/<unit>/unit.yaml).
One user (Devesh, ADHD, visual learner). No accounts, no server, no paid services. Ever.
The full build plan with per-phase prompts is in docs/PLAN.md (read the relevant phase when asked; do not load it whole).

## Stack (do not substitute)
Astro 5 + React islands (client:visible default) · Markdown/MDX in src/content with Zod
collections · vanilla CSS + tokens in src/styles/tokens.css (no Tailwind) · GSAP 3.13+
(ScrollTrigger, SplitText, Flip, DrawSVG, MorphSVG; all free, public npm, no licence key) + Lenis ·
Three.js (r3f only inside islands) · D3 for the map/timelines · Pagefind + Fuse.js · Zustand +
idb-keyval, Dexie · ts-fsrs · @vite-pwa/astro · Vitest, Playwright, Lighthouse CI · Cloudflare Pages.

## Non-negotiable rules
1. Content first. Every animation directs attention to meaning or is cut.
2. Animate only transform, opacity, filter, clip-path. Never layout properties.
3. Scroll-linked motion is scrubbed (ScrollTrigger scrub). Never animate scroll position. Never hijack the wheel.
4. One RAF: Lenis raf inside gsap.ticker with lagSmoothing(0); ScrollTrigger.update on Lenis scroll.
5. Re-initialise motion on astro:page-load; kill all ScrollTriggers and destroy Lenis on astro:before-swap.
6. data-motion="full|calm|off" on <html>; every animation has calm and off states; prefers-reduced-motion forces off.
7. Prose in 66ch, left-aligned, never justified. One accent-coloured element per viewport.
8. Every interactive element has hover, active, focus-visible, disabled states; hover gated by @media (hover:hover) and (pointer:fine).
9. Keyboard-complete; ⌘K/Ctrl K palette; ? shows shortcuts.
10. Content is never invented: an authority not in raw/ materials → verify: true and listed in the audit.
11. Preserve the student's wording in notes. Restructure; do not rewrite.
12. Budgets: LCP < 1.5 s, CLS < 0.05, 60 fps at 4× CPU throttle, Lighthouse ≥ 90 perf / 100 a11y, intro chunk ≤ 480 KB gz, any explainer ≤ 120 KB gz.
13. Australian English in all UI copy and content.
14. INCREMENTAL: every generator is idempotent, content-addressed (source-hash of the raw week folder, generator-version, generated-at) and isolated to its week's id prefix. Files with locked: true are never regenerated. Re-running on unchanged input produces no diff. npm run gate must pass before any commit that touches content. Seed content lives under src/content/**/seed/ and is excluded from gate counts.
15. Commit after each completed task with a conventional message; never leave the build broken.
16. Use Context7 before writing any GSAP, Lenis, Astro, Three.js or ts-fsrs API call. Do not rely on memory for API names.

## Commands
npm run dev (localhost:4321) · build · preview · test (Vitest) · e2e (Playwright) · lh (Lighthouse CI) · validate (content checks) · gate (regression counts)

## Definition of done for any task
Builds clean; validate and gate pass; tests pass; Playwright screenshots at 1440×900 and 390×844 in
motion full, calm and off checked for overlap, console errors and CLS; committed.

## Working style
Never give a local element a shared component class name (.chip, .btn, .card …) in a scoped <style>; name it for the page (tests/component-classes.test.ts and e2e/alignment.spec.ts enforce this).
Plan first for anything touching more than three files. Prefer editing existing files over creating new ones.
When a design choice is open, choose the quieter, more restrained option. Use subagents for parallel,
file-isolated work (e.g. three weeks or three explainers at a time, each confined to its own files).
Show evidence (test output, screenshots, gate output), not claims. When compacting, preserve the list of
modified files, the current phase, and any failing check.

## Research rules (distilled; evidence in docs/PLAN.md section 2 and the Research notes)
### Learning
- Core loop is criterion learning: pretest → learn → recall correctly 3× in a session (learned) → 3 spaced relearn sessions with ≥1 correct, days apart (secured). Four-segment ring shows this everywhere.
- Confidence (sure/unsure/guess) captured before every answer; sure-and-wrong items re-queued at +10 min, +1 day, +4 days (hypercorrection).
- Every week opens with a 5-question pretest before its notes on first visit (skippable, logged); feedback immediate.
- Long questions in three tiers: worked (model shown, predict next step) → faded (issues + rule given) → full; promote after two passes ≥ 70%.
- Quizzes interleave weeks by default; exam mode interleaves units.
- No concept without a visual; explainers learner-paced, open with a 20-second terms beat, end with one check question. Simulation shown before the card text.
- Notes pages nudge to retrieval after 3 minutes; judgements of learning asked after a delay.
- FSRS (ts-fsrs), desired retention 0.90, 0.93 within 14 days of that unit's exam; per-deck optimisation after 400 reviews.
- Certainty-based marking (C1/2/3 → +1/+2/+3 correct, 0/−2/−6 wrong) in exam sim only.
- Every MCQ option has a why: why the wrong one is tempting, why the right one is right. Never "see notes".
### ADHD / attention
- Every input has a visible consequence within 200 ms; no submit-and-wait.
- Progress is a count that cannot break ("9 of the last 14 days"); never a streak chain or fire icon; rewards informational; no guilt notifications; no leaderboards, loot, confetti, fireworks, or brain-training mini-games.
- Session start ritual: unit or "due", one if-then line, block length; analogue shrinking-arc timer; "2-minute start" button; deep-dive mode with a soft 45-minute toast.
- Optional study-companion panel (quiet presence with its own progress bar, one plain sentence at milestones); optional brown/pink noise (Web Audio), off by default, settings copy notes it can hurt for hyperactive-type ADHD.
- Identical chrome everywhere; novelty only inside the content area; motion dial Full/Calm/Off; focus mode hides all but the active card.
- No bionic/bold-prefix text.
### Reading
- 19 px body, line-height 1.6, 66ch measure (tables 80ch); concept cards ≤ 250 words; ≤ 5 paragraphs per heading; heading space above 3× below.
- Progressive disclosure: popovers, top-band rubric text and explanations hidden until asked, shown in place.
- Colour is semantic or absent: accent for the one action, sage/clay for feedback, everything else ink on paper. No decorative imagery.
### Motion
- UI: ≤ 300 ms; ease-out for enter/exit, ease-in-out for on-screen moves, ease for hover, never ease-in; press = scale(0.97) 160 ms; enter from scale 0.96 + opacity 0, never scale 0; stagger 30–80 ms; 2 px blur as polish.
- Cinematic: scroll is the camera; pinned scenes scrubbed by scroll; z-depth not sliding layers; transitions carry meaning (shared elements); every scene has a written SCENE brief (docs/PLAN.md 5.7) before code.
- One shared post-process on Three.js scenes: 3% grain, 8% vignette, bloom on the amber light only; DPR ≤ 1.5; pause off-screen; PNG fallback for off mode / no WebGL.
- Reduced motion and Calm keep opacity fades, drop positional movement, skip pins.

## Design system
### Colour tokens
| Token | Light | Dark (lamp-lit) | Use |
| --- | --- | --- | --- |
| --paper | #FBF7F0 | #17140F | page background |
| --paper-2 | #F4EEE3 | #1F1B15 | cards, panels |
| --paper-3 | #EAE2D3 | #2A241C | hover, dividers |
| --ink | #1F1B16 | #F1EAE0 | body text |
| --ink-2 | #5C554B | #B8AE9F | secondary text |
| --ink-3 | #9C9385 | #7A7163 | placeholders, disabled |
| --accent | #C2611E | #E6873F | the one accent: primary action, correct glow |
| --accent-soft | #F3DCC7 | #3A2716 | accent backgrounds, selected |
| --sage | #5F7F5A | #8FB088 | correct / mastered |
| --clay | #B5453E | #D96C64 | incorrect / due |
| --gold | #C9A227 | #E1C15A | milestones |
| --line | rgba(31,27,22,.10) | rgba(241,234,224,.10) | hairlines |
| --shadow | 0 1px 2px rgba(31,27,22,.04), 0 12px 32px -12px rgba(31,27,22,.12) | deeper | resting card shadow |
Rule: one accent-coloured element per viewport. Sage and clay only in feedback states.

### Type
- --font-display and --font-body: "Fraunces", Georgia, serif (variable; opsz axis on; SOFT 50, WONK 0); body weight 400 at opsz 14.
- --font-ui: "Inter", system-ui, sans-serif. --font-mono: "JetBrains Mono" for citations, section numbers, timers.
- Scale (rem): --t-xs .8125 · --t-sm .9375 · --t-body 1.1875 · --t-lg 1.375 · --t-xl 1.75 · --t-2xl 2.25 · --t-3xl 3 · --t-hero clamp(3rem, 8vw, 7rem).
- Line height: body 1.6; headings 1.1; UI 1.4. Measure: max-width 66ch prose, 80ch tables.
- Tracking: display −0.02em; small-caps labels +0.08em. Paragraph spacing 1.25em, no indents.
- Headings: Fraunces 600, 3rem above, 0.75rem below.
- Self-host WOFF2 in public/fonts with font-display: swap and size-adjust fallbacks (no CLS).

### Space, radius, layers
- Spacing --s-1…--s-10: 4 8 12 16 24 32 48 64 96 128 px. Gutters 24/48/96 px (mobile/tablet/desktop). Sections ≥ --s-9 apart.
- Radius: --r-sm 6px · --r-md 12px · --r-lg 20px (cards) · --r-pill 999px.
- Layout: 12-column grid; 66ch reading column offset left of centre; right rail for minimap, annotations, related chips; rail collapses under 1100px.
- Z: content 0 · sticky 10 · palette 50 · toast 60 · cursor 100 (above every overlay; inside top-layer dialogs/popovers the system cursor returns).

### Motion tokens
- --ease-out cubic-bezier(0.23,1,0.32,1) (enter/exit) · --ease-inout cubic-bezier(0.77,0,0.175,1) (on-screen moves) · --ease-drawer cubic-bezier(0.32,0.72,0,1) (panels, palette) · --ease-hover ease. Never ease-in on UI.
- --dur-press 160ms · --dur-micro 180ms · --dur-ui 240ms · --dur-panel 420ms · --dur-scene 1100ms.
- --enter-scale 0.96 · --stagger 40ms · --blur-polish 2px · --lerp-cursor 0.15 · --tilt-max 3deg · --parallax 0.85/1/1.15. Scrubbed motion uses ease: none.
- Motion dial: data-motion="full|calm|off" on <html>, persisted; Calm = no parallax, tilt, cursor trail, pins (fades and scrubs remain); Off = opacity fades ≤ 200ms only.

### Cursor system
- 8px ink dot at pointer + 36px ring following at lerp 0.15, mix-blend-mode: difference.
- Over links/buttons: ring 56px, fills --accent-soft at 40%; buttons magnetic up to 6px within a 40px radius.
- Over text: 2×24px I-beam. Over drag handles: 44px dashed circle labelled "drag". Over quiz options: soft rounded square matching option height.
- Cards: perspective(1200px) rotateX/rotateY ≤ 3°, radial highlight follows cursor. Hero: nodes within 200px attracted by a spring (stiffness 0.08, damping 0.85), nearest brightens.
- Paper background: barely visible warm gradient (2–3% luminance) drifts toward the cursor.
- Disabled on (pointer: coarse) and when motion ≠ full; native cursor restored.

### Component states
rest → hover (lift 2px, shadow grows, 180ms) → active (scale .97, 160ms) → focus-visible (2px accent ring, offset 3px) → disabled (ink-3, no motion).
Correct: sage fill sweeps left→right 420ms with 1px sage border. Incorrect: 6px shake 300ms, then clay hairline; correct option pulses once in sage.

### Transition catalogue (the only transitions used)
- Page→page: old fades to 0 lifting 8px over 180ms; new from scale 0.96 + opacity 0 over 240ms --ease-out. Shared elements: unit card→hub title (transition:name="unit-{code}"), week card→week header ("week-{id}"), case chip→case card.
- Concept card expand: GSAP Flip 240ms; siblings drift 12px.
- Case popover: 120ms in, 200ms out, origin-aware; click → Flip into full card; never a hard modal.
- Quiz next: outgoing −24px + fade 180ms; incoming from +24px 240ms; progress hairline 300ms --ease-inout; reverses on back.
- Palette: from the search button, scale 0.96→1, blur 2px→0, 200ms; backdrop blur 8px in full only; Esc reverses in 150ms.
- Milestone stamp: scale 0.9→1, blur clearing, 600ms, once. Focus block: chrome fades to 30% over 420ms.
- Reading reveals: paragraphs opacity + 12px lift 240ms stagger 40ms at 85% viewport; headings SplitText chars 12ms stagger clip-path. Once per load.
- Intro→home: 3D clusters Flip into DOM unit cards over 900ms (the only transition > 500ms outside explainers).

### Three.js scene language
Thin Line2 strokes in --ink at 60%; nodes as 2–4px sprites with soft radial alpha; no textured or photoreal materials. One amber point light (#E6873F, 0.6) is the only colour; faint paper-toned hemisphere fill. Camera 35mm-equivalent, gentle dolly only, orbit ≤ ±15°, never cuts. Slow noise-field drift. Sound: none, or one soft 440Hz sine (300ms decay, −24dB) at block end / milestones; never autoplay.

### SCENE brief format (write as a comment at the top of every pinned/scrubbed component before code)
SCENE / LENGTH (vh pinned) / BEATS / INTENT (one sentence) / SUBJECT (the one thing the eye follows) / BEAT 1–4 with % ranges, what enters, ease, caption / CAMERA / LIGHT / SOUND / REDUCED MOTION (final state + stacked captions) / BUDGET (kb gz, draw calls, 60fps at 4× throttle).

## Where to look
New material (released later): the /new-material skill (scripts/inbox.mjs → week agents → scripts/integrate-week.sh,
scripts/render-check.mjs, scripts/commit-week.sh); briefs in docs/plans/ (2026-10-week-agent-rules.md, <unit>-week-brief.md,
regenerate-week-brief.md); what is still missing: docs/pending-material.md (`node scripts/inbox.mjs --status`).
docs/PROMPTS.md holds the per-phase prompts and the gate prompt (read only the phase asked for). docs/PLAN.md is the full plan; read a section only when a prompt cites it.
Pre-built files (use, do not recreate): src/styles/tokens.css (tokens), scripts/gate.mjs (wire as `npm run gate`; cases/authorities are shared across weeks and exempt from the isolation check), playwright.config.ts, .github/workflows/ci.yml, .claude/settings.json (pre-approved commands + a commit hook running validate and gate).

## Chrome: attributes, glass, navigation, cursor (chrome pass, docs/plans/chrome-pass.md)
### <html> attributes and their owners (set before paint by the inline script in Layout.astro; carried across swaps)
| Attribute | Values | Owner |
| --- | --- | --- |
| data-theme | light · white · dark · auto | src/lib/theme.ts (Theme pill, Settings, `>theme`, ≡ menu). White = the light theme on a pure white page |
| data-motion | full · calm · off | src/lib/motion.ts (Motion pill, Settings, palette, ≡ menu) |
| data-glass (+ --glass-opacity inline) | on · off | src/lib/chrome.ts `applyHtmlPrefs` (off under prefers-reduced-transparency) |
| data-rail | open · collapsed · none | src/lib/chrome.ts (`none` unless the page passes Layout's `toc` prop; `]` toggles) |
| data-progress · data-scrollbar | on/off · shown/hidden | src/lib/chrome.ts `applyHtmlPrefs` |
| data-scene | intro · pin | src/lib/intro.ts and the hub pin in src/lib/motion.ts (glass goes opaque while set) |
| data-block · data-focus | block kind while a timer runs · set in focus mode | src/components/FocusBlock.tsx |
Preferences live in one Zustand store (src/lib/prefs.ts, `usePrefs`), persisted to IndexedDB (settings/prefs) and
mirrored to localStorage (studysite:theme, studysite:motion, studysite:prefs) for the pre-paint script. Write through
`setPrefs` (or setTheme / setMotion), never localStorage directly.
### Glass
- Tokens: --glass-opacity .55 (Settings slider 0.2–0.9) · --glass-blur 18px · --glass-saturate 140% · --glass-edge ·
  --glass-specular · --glass-text-backing .5 (a paper layer tops the surface up to this alpha, so glass text keeps
  4.5:1; checked by e2e/axe-glass.spec.ts at 0.2 in both themes).
- Apply with the `.glass` class (+ `.glass--flat` for the header, `.glass--still` where nothing scrolls behind, e.g. the
  desktop rail: tint without blur). Warm paper-2 tint, never blue-white.
- Rules: at most three glass layers in any viewport (nav + rail + one overlay); off in scenes (html[data-scene]) and
  the intro; body prose always on opaque paper; @supports and prefers-reduced-transparency fall back to opaque.
### Exam details (single source)
- raw/<unit>/unit.yaml `exam:` block (start with offset, duration and its reading/working/technical parts, mode, venue,
  notes, draft|final) → `node scripts/units.mjs` → src/content/units/*.md (validate/build fail if stale). Everything
  else derives from it via src/lib/exam.ts: unit order (exam order), home tiles, hub countdown + "Your exam" panel,
  drawer, plan (real start/length; urgency per day left), readiness, FSRS (retention 0.93 within 14 days; due capped
  24 h before the exam), the full-length paper (?mode=paper), palette/search entries, footer. Never hard-code a date.
  Countdowns are Sydney calendar days (tests/exam.test.ts covers midnight and the DST switch).
### Navigation
- From any page, any week's notes are reachable in two clicks: ≡ → week. The ≡ drawer (NavSheet.tsx, rebuilt Oct 2026)
  lists all four units: the current one expanded (titled week rows + mastery ring + due cards), the others collapsed to
  a row of week numbers (weeks not in yet are dashed, not links); expanded state is remembered. Solid paper, rows ≥ 44 px,
  no text under body size, own scroll body (data-lenis-prevent; page held while open), ≤ 180 ms open.
  e2e/navsheet.spec.ts walks every ingested week and e2e/drawer.spec.ts covers scroll, keyboard, closing and axe;
  keep both green. Any scrollable overlay must carry data-lenis-prevent, or Lenis swallows its wheel events.
### Cursor
- The outer .cursor-ring / .cursor-dot carry ONLY translate3d(x, y, 0), written by the one RAF. Every state (size,
  press scale, radius, fill) lives on inner shapes via --ring-size, --ring-scale, --ring-radius, --ring-fill. Never
  put `scale`, `transform` or size on the outer element (it composes with translate and makes the ring jump).
- Settings → Cursor off restores the system cursor; it also needs a fine pointer and Motion: Full.

## Study aids and the 200-features pass (Oct 2026; tracker docs/plans/2026-10-200-features.md, coverage docs/FEATURE-COVERAGE.md)
### Content layer — every week MUST have it, or it gets none of the features below
- Collections `aids` (one per concept: plain / concrete / formal, analogy + maps + limits, terms, misconceptions,
  socratic, elements, what-if, boundary, transfer, objections, storyboard, sources), `flows` (walkable decision trees
  per week) and `facts` (verbatim, classified facts of each long ilac problem question). Schemas in
  src/content/config.ts; specs in content-src/aids/<unit>-wNN.yaml (w00 = problem facts); brief
  docs/plans/2026-10-aids-brief.md (incl. "Regenerating a week"); emitter `node scripts/emit-aids.mjs <spec> [--check]`
  (checks refs, flow graphs, verbatim facts); /data/<unit>/aids.json + src/lib/aids.ts (`loadAids`) on the client.
- New material: /new-material and /add-week now include a study-aids agent per week and fact annotations for new ilac
  questions; scripts/integrate-week.sh emits the aids and refreshes content health; scripts/commit-week.sh stages them.
- `npm run health` (also run by the build) → /content-health: stale-vs-raw weeks, coverage map (every concept should
  show Aids ✓), self-disagreements, verify list.
### Where the features live
Concept page "Ways in" (src/components/aids) · /<unit>/flows + /<unit>/flow/<slug> (src/components/flows) ·
/<unit>/problems + /<unit>/problem/<id> (src/components/problem) · /<unit>/visual · /<unit>/listen (listen + viva) ·
/<unit>/argue · /<unit>/case-anatomy · /statutes · /cases · /glossary · /insight · /<unit>/sheet and
/<unit>/week/N/sheet (printable) · quiz modes contrast / drills / diagnostic · hint ladder, IRAC check, after-wrong
panel in the quiz · explainer playback + stills (ScrollExplainer) · Explore panel on every Simulation · reading
settings + low stimulation (src/lib/lowstim.ts, src/styles/reading.css) · session plans (src/lib/session-plan.ts) ·
.ics import, replanning, today's pack (/plan) · selection toolbar (SelectionTools in Layout) · format tracking
(src/lib/format-track.ts → Attempt.via → /insight "What works for you").
### Working notes learned in this pass
- Test against a production preview when the dev server is busy: `npm run build` then
  `npx playwright test -c playwright.prod.config.ts <specs>` (port 4322). If port 4321 is down, the default config
  silently starts `npm run preview` of an old build — check `curl localhost:4321/@vite/client` first.
- Never run `npx astro check` while `astro dev` runs (it corrupted the dev dependency cache); use `npx tsc --noEmit -p .`.
- The Agentic SDLC plugin asks on every `git commit`/`push`; `scripts/commit-push.sh "subject" ["body"]` runs validate +
  gate, commits what is staged and pushes, without that prompt.
