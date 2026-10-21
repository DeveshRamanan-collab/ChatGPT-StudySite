---
name: generate-questions
description: Generate the question bank for one week (MCQ variants, short answers, pretest, cards, quick-fire) or, with week "pq", the long problem/essay questions for a unit in three tiers.
disable-model-invocation: true
argument-hint: "[unit-code] [week-number | pq]"
arguments: [unit, week]
---
Read CLAUDE.md research rules and rule 14. Unit $unit, target $week.

If $week is a number:
- Read the week, its concepts and its cases.
- Per concept: ≥ 20 questions, MCQ-heavy, difficulty spread 1–4, at least 3 that discriminate commonly confused concepts, later ones as `variant-of` earlier ones (same objective, different facts). Distractors are plausible misconceptions. Every option has a `why` (why the wrong one is tempting; why the right one is right).
- 6 short-answer prompts with model answers (120–200 words), 3–5 line rubrics, each criterion with top-band text and a margin-note.
- One 5-question pretest for the week (write its ids into the week file).
- ≥ 25 cards (basic, cloze, occlusion where a diagram exists, apply), each linking to its concept and source paragraph.
- One quick-fire true/false set of 20.
If $week is "pq":
- Read raw/<unit-folder>/exams/ (papers, rubrics, sample answers) and the unit file's answer style (problem → ILAC; essay → thesis–argument–counterargument–evaluation).
- Write 4 long questions per tier (worked, faded, full): realistic 250–400 word scenarios or essay prompts spanning multiple weeks; timer 40; rubric of 6–9 criteria with marks, top-band text, margin-note, authorities; model answer 900–1200 words; for faded, a `given:` block.
Common: stamp source-hash/generator-version/generated-at; skip unchanged or locked files; nothing invented (verify: true otherwise); run npm run validate and gate; report counts per type, tier and difficulty.

Implementation: follow docs/content-spec.md — extract with `node scripts/extract.mjs`, write the week spec `content-src/$unit-wNN.yaml` (NN two digits), emit with `node scripts/emit.mjs`. Concept ids are `<unit>-wNN-<slug>`.
