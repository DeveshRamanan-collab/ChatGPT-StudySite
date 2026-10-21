---
name: add-week
description: One command to add a whole week: ingest, questions, cards, explainers, audio recap, search index, validate, gate, commit. Safe to run on existing weeks (no diff) and on new weeks added months later.
disable-model-invocation: true
argument-hint: "[unit-code] [week-number]"
arguments: [unit, week]
---
Read CLAUDE.md rule 14. Unit $unit, week $week. Set ADD_WEEK=$unit-w$week for every gate run.

1. /ingest-week $unit $week
2. /generate-questions $unit $week
3. For every concept in this week with no entry in src/components/explainers/manifest.json: /build-explainer <concept-id> go, three at a time via subagents, each confined to its own files. (Skip until the explainer bases exist — task 5.2; Phase 9 backfills.)
3b. Study aids: write content-src/aids/$unit-wNN.yaml per docs/plans/2026-10-aids-brief.md (every concept: Ways in,
   terms, misconceptions, Socratic ladder, elements, what-ifs, edge cases, transfer, objections, storyboard, sources;
   plus the week's decision flows), check with `node scripts/emit-aids.mjs content-src/aids/$unit-wNN.yaml --check`,
   then emit without --check. New long problem questions (template: ilac) also get fact annotations appended to
   content-src/aids/$unit-w00.yaml.
4. Write src/content/audio/$unit-w$week.md: a 2–3 minute recap script in the student's voice (plain, compressed, formal vocabulary), covering each concept and its key authority.
5. Rebuild the search index (npm run build:index or the project's equivalent).
6. npm run validate && ADD_WEEK=$unit-w$week npm run gate && npm run health (the week's concepts should all show Aids ✓). If the gate reports any decrease or any change outside this week's id prefix, STOP, revert nothing, and show me the report.
7. Commit "content($unit): week $week". Report: what was created, what was skipped as unchanged or locked, and every verify: true item.

Implementation: follow docs/content-spec.md — extract with `node scripts/extract.mjs`, write the week spec `content-src/$unit-wNN.yaml` (NN two digits), emit with `node scripts/emit.mjs`. Concept ids are `<unit>-wNN-<slug>`.
