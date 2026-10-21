---
name: ingest-week
description: Convert one week's raw materials into typed content (week notes, concept cards, case and authority cards). Idempotent and isolated to that week.
disable-model-invocation: true
argument-hint: "[unit-code] [week-number]"
arguments: [unit, week]
---
Ingest week $week of unit $unit. Read CLAUDE.md rules 10, 11 and 14 first.

1. Locate the raw folder: raw/<unit-folder>/week-$week/ (unit folders: laws2400-torts, laws2000-pil, laws2100-juris, mgmt2094-sci). Read every file in it fully (slides, notes, tutorial). Compute source-hash = sha256 of the folder's contents.
2. If src/content/weeks/$unit-w$week.md exists with the same source-hash and generator-version, stop and report "unchanged". Never touch files with locked: true.
3. Write src/content/weeks/$unit-w$week.md: topic, 3-sentence summary, ordered concept list, pretest question ids (to be filled by generate-questions), and the full notes body preserving the student's wording and structure, adding :::rule :::case :::statute :::definition :::examtip callouts where the material warrants.
4. For each concept write src/content/concepts/$unit-w<NN>-<slug>.md: one idea, < 250 words, `visual:` explainer | simulation | diagram | timeline | palace (simulation for anything with variables; palace for ordered lists), a one-line `visual-brief:`, `related: []`, `depends-on: []` (concepts this one builds on, any week) and `contrasts-with: []` (concepts students commonly confuse with this one) — both feed the knowledge map; only link concepts that exist.
5. Create or update case cards (src/content/cases/<slug>.md: citation, AGLC4 citation string, facts, issue, held, ratio, significance, and `why-here`: one sentence on what this case is used for in this unit's answers) and authority cards (src/content/authorities/<slug>.md: text, plain gloss, applying cases). Mark verify: true if not fully present in the materials. Never invent a holding or citation.
6. Stamp every file with source-hash, generator-version and generated-at.
7. Run npm run validate and ADD_WEEK=$unit-w$week npm run gate. Fix errors. Report: concepts, cases, authorities created/updated, items needing verification with the sentence each came from.

Implementation: follow docs/content-spec.md — extract with `node scripts/extract.mjs`, write the week spec `content-src/$unit-wNN.yaml` (NN two digits), emit with `node scripts/emit.mjs`. Concept ids are `<unit>-wNN-<slug>`.
