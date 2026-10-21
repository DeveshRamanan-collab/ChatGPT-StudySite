# FEATURES.md — the full feature catalogue (acceptance list)

Every item here must exist in the finished site. Check against this at tasks 2.6, 4.8, 8.3, 9.2 and 11.2, and list anything missing in STATE.md as a new task.

## 3. Feature catalogue (v2)

Everything the finished site does, grouped by area. **Core** items are built in phases 1–7; the rest in phases 8–10. Items marked ★ are new in v2. Nothing needs a server, an account or a paid service, and every feature is generated per concept so a week added later gets all of it automatically.

### 3.1 Entry, navigation and orientation

- **Cinematic intro** (core): a Three.js scene rendered in code, in your theme (cream paper, ink line geometry, one amber light, 3% grain). Four scroll-scrubbed beats: a single point of light → orbit lines draw a constellation of ~120 nodes → nodes resolve into four glowing clusters labelled with your units → the clusters Flip into the four real unit cards. Skippable with any key; plays once a day; off under reduced motion.
- **Home: one button** (core): *Continue* resumes exactly where you were (route + scroll + question index). Beneath it: four unit tiles with progress rings, days-to-exam per unit, today's due count, and the ★ *if-then line* you wrote at your last session start.
- **★ Session start ritual** (core): a 15-second screen: choose a unit (or "whatever's due"), write one if-then ("When I open Torts, then I clear 10 cards"), pick a block length; the timer arc starts and the chrome fades.
- **★ 2-minute start**: a button that commits you to two minutes on the weakest concept; at two minutes it asks "keep going?" once and never again.
- **Universal search / command palette** (core): `⌘K`/`Ctrl K`; fuzzy search across notes, concepts, cases, statutes, questions, cards and your annotations; `>` for commands; recent items; ★ typed filters (`case:`, `week:3`, `wrong:`).
- **Unit hub** (core): a pinned, scroll-scrubbed horizontal week timeline; each week card shows topic, concept count, mastery ring, criterion state (learned/secured counts) and last visit; the exam date closes the timeline with a live countdown.
- **Knowledge map**: D3 force graph of concepts; nodes coloured by mastery; edges for depends-on and contrasts-with; ★ backlinks ("referenced in") on every concept and case.
- **Minimap + reading progress** on note pages; **breadcrumbs** everywhere; **keyboard-first** with `?` cheat-sheet.
- **Cursor system** (core): dot + lerped ring, state changes over links/text/drag handles/options, magnetic buttons, 3° card tilt with cursor-following highlight, constellation attraction on the hero; disabled on touch and under Calm/Off.
- **★ Ambient state**: the paper background carries a barely-visible warm gradient that drifts toward the cursor (2–3% luminance), so the page feels alive without any element moving.

### 3.2 Notes, explainers and cases

- **Week pages** (core): your notes as typed prose (66ch, callouts for rule/case/statute/definition/examtip); headings split-reveal; paragraphs lift in; ★ *pretest gate*: five questions appear before the notes on first visit (skippable, but the skip is logged).
- **Concept cards** (core): one idea, ≤ 250 words, one visual; expand in place with Flip; buttons for *Quiz me*, *Cards*, *Simulate*, *Explain it back*, *Mark for later*; ★ criterion ring in four segments (learned + 3 relearns).
- **Animated explainers** (core): a purpose-built animation per concept, learner-paced, opening with a 20-second terms beat; ★ every explainer ends with a one-question check that feeds the loop.
- **Interactive simulations** (core): controls bound to a pure state→view function (breach calculus, causation branches, attribution under ARSIWA, ratio/obiter spectrum, Osborn brainstorming constraints, S-curve disruption); ★ "interact first": the simulation is shown before the card text.
- **★ Palace view**: for any ordered list (elements of a tort, limbs of a test, art 38 sources) an optional 3D room walk where each locus holds one element; built from the explainer base.
- **Case cards** (core): IRAC-shaped fields (citation, facts, issue, held, ratio, significance, "why it matters here"); ★ three densities (full / brief / one-line) switchable in place; ★ AGLC4 citation copy button; hover popovers on every mention; ★ read-aloud.
- **★ Clause explainer popovers** for treaty articles and statutory provisions: the text, a plain-language gloss, and the cases that applied it.
- **Compare mode**: two cases or two theories side by side, scroll-synchronised.
- **Self-drawing diagrams** (DrawSVG) and **draggable timelines** for case-law and treaty development.
- **★ Image occlusion**: mask any label on a diagram to make a card.
- **★ Sentence-to-card**: select any sentence in a note, press `C`, and it becomes a cloze card linked back to that paragraph.
- **Annotations and highlights**: local, searchable, exportable; ★ shown as a margin rail on the reading page.
- **Audio**: read-aloud at 1.2× with sentence highlighting; ★ per-week audio recap script (2–3 minutes) generated by Claude Code and spoken by the browser.

### 3.3 Retrieval and assessment

- **Criterion loop** (core, ★): every concept tracks recall attempts; *learned* at 3 correct in a session, *secured* after 3 spaced relearn sessions; the picker feeds due relearns first.
- **MCQ** (core): confidence (sure/unsure/guess) before options unlock; instant marking; explanation panel with *why yours is tempting* and *why the right one is right*; ★ sure-and-wrong items re-queued at +10 min/+1 d/+4 d and flagged in the error log.
- **Short answer** (core): prompt, optional timer, auto-growing editor; model answer slides in beside yours; clickable **marking criteria** with top-band text and highlighted matching sentences; tick-box self-marking with live score; ★ "what a marker would write in the margin" line per criterion.
- **Long answer / problem question** (core): exam-paper mode with timer, no navigation, IRAC/ILAC or essay template; ★ *answer-plan step* first (issues → authorities → order) before the editor opens; ★ three tiers (worked / faded / full) with automatic promotion; full rubric with top-band text per criterion; band score; gaps → cards in one click.
- **Flashcards with FSRS** (core): daily queue, four-button grading, cloze, image occlusion, images; ★ Anki-compatible CSV export; ★ per-deck parameter optimisation once 400 reviews exist.
- **★ Match mode**: 60-second pairing of cases↔ratios or terms↔definitions; retrieval-only, no toy scoring.
- **Adaptive picker** (core): weights concepts by error rate, time since seen, overconfidence, criterion state and week coverage; interleaves.
- **Exam simulator**: full-length, timed, paper-like, no feedback until the end, ★ certainty-based marking scoring, full debrief.
- **Quick-fire**: 60-second true/false bursts.
- **Explain-it-back**: 60-second typed explanation, then side-by-side with the card and a self-rating that feeds FSRS.
- **Question bank browser** and **error log** grouped by concept with re-test.
- **★ Question variants**: each concept targets 20 questions; the generator writes variants (same objective, different facts) so re-testing does not become memorising the stem.

### 3.4 Progress, motivation and attention

- **Dashboard** (core): mastery per unit/week/concept; criterion counts; ★ "days studied in the last 14" (never a breakable chain); minutes; accuracy trend; calibration curve (confidence vs accuracy); readiness per unit vs exam date.
- **What next?** (core): one function, one button.
- **Focus timer** (core): analogue shrinking-arc, 25/5 default, chrome fades during a block, gentle single-tone chime; ★ session summary with the one thing that improved most.
- **★ Study companion**: optional panel with a quiet animated presence whose progress bar advances beside yours and who says one plain sentence at milestones; configurable or off.
- **★ Noise**: brown/pink noise generator in Web Audio with a volume dial; off by default; the settings text says it can hurt if you are the hyperactive type.
- **Focus mode** and **deep-dive mode** (soft 45-minute fence).
- **Study plan**: day-by-day to exam week from remaining weak concepts, written as if-then lines, regenerates as you progress; ★ exports to `.ics` so it lands in Google Calendar.
- **Milestones**: quiet illustrated stamps at 50/80/95% mastery and "queue cleared"; personal bests; no fireworks.
- **Motion dial, light/dark "lamp-lit" theme, PWA offline, export/import, ★ optional Gist sync.**

### 3.5 Content tooling (for you, not the exam)

- **Typed content schema** in `src/content/` (section 6); **content validator** that fails the build on gaps.
- **★ Incremental generator**: `/add-week` runs ingest → questions → cards → explainers → audio script → search index for one week, content-addressed by hash so re-running never duplicates and never touches other weeks.
- **★ Regression gate**: a snapshot test of every existing route and a count of every existing question/card before and after any content run; a decrease fails the run.
- **Authoring skills**: `/add-week`, `/ingest-week`, `/generate-questions`, `/build-explainer`, `/audit-content`, `/weekly-review`.

