---
name: new-material
description: Bring newly released course material (tagged "[NOT YET IN STUDY SITE]" in the working folder) onto the site — copy into raw/, build new weeks, regenerate existing (often thin) weeks, explainers, long questions, checks, commit, push, verify live, untag.
disable-model-invocation: true
argument-hint: "[optional: unit or week ids to limit the run]"
---
New material has been released and dropped into the working folder (default
"/Users/deveshramanan/University Semester 2 (Working Folder)", override with $STUDY_INBOX), each file ending in
" [NOT YET IN STUDY SITE]". Read CLAUDE.md, raw/README.md and docs/plans/2026-10-week-agent-rules.md first.
Never transcribe, never copy or commit video, never invent content. Budget $0.

1. Inventory: `node scripts/inbox.mjs` (dry run). It groups files by week and labels each NEW WEEK or REGENERATE
   (and "currently thin"). Show the user the plan in one short table if anything looks off (a file outside a
   "Week NN"/"Unit-wide" folder, an unexpected unit); otherwise carry on.
2. Copy: `node scripts/inbox.mjs --copy` (never overwrites; files > 95 MB are gitignored automatically and need a
   committed "(text extract).md" beside them — the week's builder writes it). Commit raw/ ("chore(raw): …").
3. Build, one agent per week, in exam order (raw/<unit>/unit.yaml; `node scripts/units.mjs` keeps the site in sync):
   - NEW WEEK → prompt from docs/plans/2026-10-week-agent-rules.md + the unit brief (docs/plans/<unit>-week-brief.md),
     content then explainers (manifest part manifest-parts/<week>.json), exactly as the October agents were briefed.
   - REGENERATE → docs/plans/regenerate-week-brief.md (add, never replace; a thin week loses `thin` only when the new
     material supports the targets).
   Run as many in parallel as the session allows; each agent is confined to its week's files and never commits.
   - STUDY AIDS (every new or regenerated week, after its content agent finishes): one more agent per week, briefed
     with docs/plans/2026-10-aids-brief.md, writes `content-src/aids/<week>.yaml` — Ways in (plain / example / rule,
     analogy + limits, terms, misconceptions, Socratic ladder, elements, what-if, edge cases, transfer, objections,
     storyboard, sources) for EVERY concept of the week, plus the week's decision flows. For a regenerated week: add
     entries for new concepts and refresh entries whose concept changed; keep every other entry as it is (add, never
     replace). These aids drive the concept page "Ways in", the glossary, decision flows, week sheets, Drills, Tell
     apart, hints, visual practice, listen/viva and the teach-back check — a week without aids gets none of them.
4. Per finished week: `scripts/integrate-week.sh <week>` → `npm run build` → preview running →
   `node scripts/render-check.mjs <week> <week>` (fix any clipped label or overflow in that week's components and
   re-check) → `scripts/commit-week.sh <week> "content(<unit>): week N — <topic>"` (it validates the staged tree and
   stages only that week's manifest entries, so every commit builds on its own). Push after each commit.
5. Long questions: once a unit's new weeks are in, extend content-src/<unit>-pq.yaml by appending (new keys only) at
   least one question per tier covering the new weeks, in the unit's answer style. Then, for problem-style units
   (template: ilac), append fact annotations for every NEW ilac question to `content-src/aids/<unit>-w00.yaml`
   (aids brief, "Problem-question fact annotations"; never change existing entries) — they drive "Work the facts",
   the evidence board and the IRAC check. `scripts/integrate-week.sh <unit>-w00` emits them;
   `scripts/commit-week.sh <unit>-pq`.
6. Exam timetable: if the final timetable has been released (due 14 Oct 2026) and the user supplies it, update the
   `exam:` block in each raw/<unit>/unit.yaml (status: final), run `node scripts/units.mjs`, `npm test`, commit.
7. Checks: `npm run audit` (reports/audit-<date>.md), `npm run health` (/content-health: stale weeks, coverage map —
   every concept should show Aids ✓ — and disagreements), `npm test`, `npm run build`, the e2e specs touched by the
   change (smoke, alignment, navsheet, drawer, hub, concept-aids, flows, sheets at least; run them against the
   production preview with `npx playwright test -c playwright.prod.config.ts …` to avoid dev-server churn), `node scripts/inbox.mjs --status` (refreshes
   docs/pending-material.md). Commit, push.
8. Live: confirm https://study-site.deveshramanan.workers.dev/data/overview.json lists the new weeks, then
   `node scripts/inbox.mjs --untag <week-id> …` for each week now live (rename only; video keeps its tag).
9. Report: weeks created / regenerated with counts (concepts, explainers, MCQ, short, cards, aids, flows, fact
   annotations), thin status before →
   after, every verify: true item added or cleared, transcript–slide conflicts, what is still pending
   (docs/pending-material.md), files untagged and any left tagged with why.
