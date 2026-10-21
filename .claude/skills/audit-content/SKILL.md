---
name: audit-content
description: Audit content completeness and quality for one unit or all units; writes reports/audit-<date>.md.
disable-model-invocation: true
argument-hint: "[unit-code | all]"
arguments: [unit]
---
Run npm run validate and read its output. For $unit (or every unit if "all") produce a table: weeks ingested vs expected (unit.yaml), concepts, concepts without an explainer in the manifest, cases, authorities, verify: true items, questions per concept vs target 20, short answers vs 6 per week, long questions per tier vs 4 per unit, cards vs 25 per week, pretests present, audio scripts present, locked files. List the 10 weakest explanations (shortest `why` fields) and any MCQ whose correct option is longest (a giveaway pattern). Write reports/audit-<date>.md and summarise in chat with the three most useful next actions.
