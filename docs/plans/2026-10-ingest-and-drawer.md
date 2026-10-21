# Plan — new course material + left drawer rebuild (7 Oct 2026)

Brief: the user's "StudySite: ingest the new material and rebuild the left drawer" (7 Oct 2026).
Baseline: reports/baseline-2026-10-07.json (counts + 468 built routes at 0290c78).

## Decisions (user-approved 7 Oct)
- Explainer briefs are pre-approved: write each brief to docs/plans/explainers-2026-10.md, build, list in the report.
- Thin weeks: a week may carry `thin: true` (with `thin-reason`). Its concepts get only the questions the sources
  honestly support; validate/qa report the shortfall instead of failing; the week page says it is thin; the audit
  names the missing source material.
- Exam dates: the site's dates are wrong; the user will supply them. Marketing answer format waits for that too
  (Week 1 slides: final task is a 750-word Writing Task in the Week 13 lecture, 30%, statement released beforehand).
  Marketing long questions are built after the user answers.

## Deviations from the brief (stated in the plan, not objected to)
- Video is not copied into raw/ (≈ 4 GB vs ≈ 1–3 GB free disk; never committed anyway). Recordings are transcribed
  straight from the working folder (read-only) and only the transcript lands in raw/.
- International Week 11 slides (104.6 MB) exceed GitHub's 100 MB file limit: copied into raw/ but gitignored; a text
  extract is committed beside it.
- Marketing raw folder stays raw/mgmt2094-sci (already wired into skills, scripts and the unit registration).
- Copies follow each unit's existing raw/ naming (Torts `Topic N Lecture M.pptx`, Juris `Week NN - Lecture Slides.pdf`,
  International `Week NN - <Type> - <Title>.pdf`); originals are untouched until the final tag rename.

## Transcription
whisper.cpp (Homebrew `whisper-cpp`, ggml small.en, Metal) — free, local. Audio via macOS `afconvert` to 16 kHz mono
WAV in the scratchpad, one recording at a time, WAV deleted after. First line of each transcript:
"Machine-generated transcript (whisper.cpp small.en, <date>). Lower trust than the slides." Slides win on conflict;
conflicts flagged as verify: true.
Recordings (20): International w06 Part B, w08 ×2, w09 ×2; Juris w08, w09; Torts w05 clip, w08 ×2; Marketing w01–05, w08–12.

## Drawer
Diagnose first (live + local, 390×844 / 768×1024 / 1440×900, home / hub / week / quiz), then replace NavSheet:
fixed header (name, close, search shortcut) · four collapsible unit groups (current open, others closed, state
remembered) listing all 12 weeks with topic title + small mastery mark · Dashboard, Plan, Map, Exam paper, Due cards.
Scrolls independently (data-lenis-prevent, overscroll-behavior: contain, 100dvh, safe-area), page behind locked,
rows ≥ 44 px, text ≥ body size, AA in all themes, native <dialog> focus trap, Escape / backdrop / shortcut close,
focus returns to ≡, closes on navigation and never persists half-open across swaps, Full slide+fade / Calm fade /
Off instant, opens < 200 ms, no CLS. Playwright tests (fail on old, pass on new) + axe scan. Before/after screenshots.
Also: a fully white background theme ("White") alongside Light / Lamp-lit / Auto.

## Order
1 baseline ✓ · 2 drawer + white theme · 3 raw copies + README · 4 transcription (needs disk) · 5 pilot Torts w07 →
pause for the user · 6 Torts w08–w12 · International w08–w12 (+ unit-wide revision set) · Juris w08–w09 ·
Marketing w01–w12 · 7 regenerate International w06, Torts w03, w05 (ids kept, append only) · 8 audit, validate, gate,
Playwright, Lighthouse · 9 push, check live · 10 strip tags from ingested originals only.
