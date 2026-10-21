# Agent brief: one MGMT2094 Strategic Creativity and Innovation week

Read docs/plans/2026-10-week-agent-rules.md first (isolation, transcripts, content rules, finish steps).

1. Unit id `mgmt2094`; raw folder raw/mgmt2094-sci/week-NN/ (spec `source: raw/mgmt2094-sci/week-NN`). Extract:
   `node scripts/extract.mjs raw/mgmt2094-sci/week-NN`. No personal notes exist: the lecture slides/materials are the
   spine (keep the lecturer's phrasing and order), readings and transcripts add explanation and examples. This is the
   first Marketing content on the site, so there is no finished model week for this unit: use
   content-src/laws2100-w01.yaml (an essay unit) as the format model only.
2. Every concept links to at least one real example from the readings, slides or guest lectures. Represent examples
   and readings as AUTHORITY cards (src/content/authorities/<slug>.md, `units: [mgmt2094]`):
   - a reading → `kind: article`, title "Author (Year), Title" exactly as the reading gives it, `text` = its main
     argument in 2–4 sentences from the reading itself, `gloss` = what it is used for in this unit;
   - a real-world example (company, product, person, guest lecture) → `kind: other`, title "Example: …", `text` = what
     happened per the source, `gloss` = which idea it illustrates.
   Link them from concepts via `authorities: [...]`. Never use case cards for Marketing. Slugs: prefix `mgmt2094-`.
3. Question style (the exam is a 2-hour online invigilated exam; its question format is not yet confirmed): MCQs test
   definitions, distinguishing models/frameworks (e.g. which thinking hat, which stage of a model), and applying a
   framework to a short business scenario. Short answers are applied responses with rubric rows: Concept (accurate
   definition), Example (a real example from the materials), Application (framework applied to the prompt),
   Evaluation (limits/trade-offs), each with top-band text and a margin-note.
4. Week-specific notes (the recordings were reused from earlier years; treat each transcript as the record of what was
   actually said, and build concepts where the material actually is):
   - Week 06: the lecture file is labelled "Week 7 – Reflective writing" on iLearn but belongs to Week 6. Keep it in
     Week 6. No recording. The Week 09 transcript's reflective-writing segment may be used here (read
     raw/mgmt2094-sci/week-09/*Transcript*).
   - Week 07: tutorial material only (no lecture, no recording) → likely thin.
   - Week 09: concepts come from the Week 09 slides (product development, the Dow Corning case study); the lecture on
     that case is the Week 10 transcript (guest lecture, Viken Kortian) — read raw/mgmt2094-sci/week-10/*Transcript*.
     The Week 09 transcript itself covers types/models of innovation + reflective writing (used by Weeks 11 and 06).
     You own the Dow Corning example card (`mgmt2094-example-dow-corning`). source-note must say all of this.
   - Week 10: concepts from the agile innovation / lean start-up slides, the two readings and the tutorial; the Week 10
     transcript is the Dow Corning guest lecture, used by Week 09 — do not build Dow Corning concepts here.
     source-note: built without a matching lecture transcript; its recording (Dow Corning) is used in Week 9.
   - Week 11: concepts from the innovation-models slides + BCG reading; also use the types/models-of-innovation segment
     of the Week 09 transcript. The Week 11 transcript is a guest lecture by a business founder (first name Mark):
     make it an example card (`mgmt2094-example-guest-founder-mark`) linked to the concepts it illustrates.
   - Week 12: concepts from the leading-an-innovative-culture slides + Nickless reading; the Week 12 transcript is a
     guest lecture by Shelley Simpson → example card (`mgmt2094-example-guest-shelley-simpson`). The "Final Exam
     Preparation" deck holds only guest-lecture discussion questions: use them as short-answer prompts.
   - Weeks with no transcript: 02, 06, 07 (and 10 has no matching one). Say so in source-note.
5. Targets as docs/content-spec.md (4–8 concepts, ≥ 20 questions each, 20 quick-fire T/F, 6 short answers, 5-question
   pretest, ≥ 25 cards, audio 300–450 words) unless the week is thin.
