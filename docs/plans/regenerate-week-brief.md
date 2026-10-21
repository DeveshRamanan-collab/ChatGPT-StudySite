# Agent brief: regenerate a week that is already on the site (new material released)

Read first: docs/plans/2026-10-week-agent-rules.md (isolation, transcripts, content rules, finish steps), the unit's
week brief (docs/plans/<unit>-week-brief.md), docs/content-spec.md, and the week's existing spec content-src/<id>.yaml.
Extract everything: `node scripts/extract.mjs raw/<unit-folder>/week-NN raw/<unit-folder>/unit-wide`; read the NEW
files fully (they are the reason for this run) and the old ones as needed.

## The one rule: add, never replace
- Every existing concept, question, card, pretest and audio id stays, with its key. Never delete or renumber anything.
  Files with `locked: true` are never touched. The ADD_WEEK gate must pass: no count may go down.
- New questions and cards take NEW keys after the last existing key; new concepts take new slugs.
- The student's own wording (International weeks 1–7 Weekly Notes) is never rewritten.

## What you may change
- Notes: add sections for the new material, in the lecturer's order and phrasing (slides are the spine). Where the old
  notes were built from thinner sources (a flowchart, a tutorial sheet), you may restructure and enrich them around
  the new slides — but keep any existing heading anchors that questions or cards point to.
- Concept bodies (≤ 250 words) may be enriched with what the new material adds; `visual-brief`, `related`,
  `depends-on`, `contrasts-with`, `cases`, `authorities` may be extended. Do not change a concept's slug or title
  meaning.
- Case/authority cards your week created (`origin: <this week>`) may be filled in from the new material: replace
  "not in the materials" placeholders with what the slides/casebook now say, and clear `verify: true` only when the
  new material fully supports the card. Never rewrite a card another week owns.
- Questions marked verify: true because a fact was missing may be corrected if the new material settles it; say which.
- `week_file.source-note`: say what the week is now built from. If the week was `thin: true` and the new material now
  supports the targets (≥ 20 questions per concept, 6 short answers, ≥ 25 cards, 20 quick-fire, 5 pretest), remove
  `thin` and `thin-reason` and fill the gaps honestly from the new material; if it is still short, keep `thin: true`
  and rewrite `thin-reason` to name exactly what is still missing.

## Explainers
- New concepts: build their explainers per docs/plans/explainer-brief.md (manifest part
  src/components/explainers/manifest-parts/<id>.json with ONLY the new concepts).
- Existing explainers stay. If an existing explainer now states something the new material contradicts, fix that
  component in place (same file, same manifest entry) and say so in the report.

## Study aids (separate agent, after this one)
The week's `content-src/aids/<id>.yaml` must follow the regenerated week (docs/plans/2026-10-aids-brief.md, section
"Regenerating a week"): new concepts get full entries, changed concepts get refreshed entries, every other entry and
every decision flow stays unless the new material contradicts it. Name the concepts you added or changed in your
report so the aids agent knows where to look.

## Report (under 200 words)
qa line; validate/gate; ids added (concepts, question keys, card keys); concepts enriched; verify: true items added or
cleared (with the sentence that settles each); thin status before → after; transcript–slide conflicts; explainers
built or fixed; anything in the new material you could not use.
