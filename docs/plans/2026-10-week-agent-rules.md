# Rules for every week agent (October 2026 ingest, brief v2)

Many week agents run AT THE SAME TIME, one week each. Read this file, then your unit brief, then CLAUDE.md and
docs/content-spec.md.

## Isolation (parallel safety)
- Touch ONLY `content-src/<unit>-wNN.yaml` and the files `node scripts/emit.mjs` writes for it
  (src/content/**/<unit>-wNN-*, plus genuinely NEW shared case/authority cards). Never edit another week's spec or
  files, raw/, components, scripts, docs, STATE.md, the explainer manifest. Never commit. Never run `npm run build`,
  `npm run preview`, Playwright or Lighthouse (the lead does).
- Before creating a shared case/authority card, check src/content/cases and src/content/authorities AND re-check
  just before emitting (another agent may have just created it). Reuse an existing slug rather than duplicating.
  Never rewrite a shared card whose `origin` is another week.
- `npm run validate` may show transient errors from OTHER weeks being written in parallel: fix only errors naming your
  week prefix or files you created. Same for `ADD_WEEK=<unit>-wNN npm run gate`.

## Transcripts (Echo360 machine captions, supplied by the student — never generate one)
- Files named "… Lecture Transcript …" in raw/<unit>/week-NN/. Speaker-labelled, unpunctuated in places, misheard
  names and terms. Use them for the lecturer's explanations, emphasis, worked examples and anything flagged as
  examinable. Slides remain the authority on structure, definitions, case names and citations.
- Never take a case name, statute, author, company or technical term from a transcript alone: confirm it in the
  slides, casebook, readings or statute, or mark the item verify: true. Where transcript and slides conflict, follow
  the slides, mark verify: true, and list the conflict in your report.
- Paraphrase transcript content into notes; never paste caption text as if it were polished prose.
- No transcript for a lecture or week is deliberate: do NOT stop or ask. Build from slides, readings, tutorials and
  flowcharts, and say so in `week_file.source-note` (shown on the week page), e.g. "Built from the lecture slides and
  tutorial tasks; no lecture transcript was available for this week." Weeks WITH transcripts also get a source-note
  naming what was used.
- The casebook PDF covers Torts topics 1–6 only. If a casebook extract is missing, leave that part empty; do not fill
  it from general knowledge.

## Content rules (non-negotiable)
- Nothing invented (CLAUDE.md rule 10). Anything only partly supported → verify: true.
- Thin weeks stay thin: if the sources are only a flowchart, only a tutorial sheet, or only slides with little text,
  set `week_file.thin: true` + `thin-reason` naming exactly what is missing, generate only what the sources support,
  and report the shortfall. qa-week then reports shortfalls instead of failing.
- Australian English. Every MCQ option has a two-sided `why` ≥ 60 chars (why the wrong one is tempting; why the right
  one is right); never "see notes". Correct option the unique longest in only 10–35% of MCQs and the unique shortest
  in 10–35% (draft distractors as long as the answer from the start).
- Write the spec by building JS objects in a Node script and dumping with js-yaml, in chunks.

## Finish
`node scripts/qa-week.mjs content-src/<unit>-wNN.yaml` (✓ qa ok, or only thin-week shortfalls) →
`node scripts/emit.mjs content-src/<unit>-wNN.yaml` → `npm run validate` → `ADD_WEEK=<unit>-wNN npm run gate` →
`npx astro sync`. Then report in under 200 words: qa line; validate/gate; counts (concepts with visual type, MCQ,
true/false, short answers, cards, pretest, audio words); with/without transcript; every verify: true item with the
source sentence it came from; transcript–slide conflicts; anything in the sources you could not use; thin shortfalls.

## After you: the study-aids agent (Oct 2026)
Every week you build also gets a study-aids spec (`content-src/aids/<unit>-wNN.yaml`, docs/plans/2026-10-aids-brief.md),
written by a separate agent from your concepts and the raw material. It powers the concept page "Ways in", decision
flows, the glossary, week sheets, Drills, Tell apart, hints, visual practice, listen/viva and the teach-back check. So:
- Keep `depends-on` and `contrasts-with` accurate: prerequisite repair, Tell apart and map tracing run on them.
- Write each concept's notes so its rule/test, cases and lecturer warnings are explicit — the aids agent builds the
  checklist, misconceptions and Socratic ladder from them.
- New long problem questions (template: ilac) in `<unit>-pq.yaml` each get fact annotations (`<unit>-w00` aids spec).
