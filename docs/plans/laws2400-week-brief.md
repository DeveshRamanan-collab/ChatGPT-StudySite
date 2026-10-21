# Agent brief: one LAWS2400 Torts week (slides + transcripts, or flowchart-only)

**Read docs/plans/2026-10-week-agent-rules.md first; where it differs from this brief, it wins** (parallel agents,
Echo360 transcripts, source-note, thin weeks, finish steps).

Write `content-src/laws2400-wNN.yaml` from scratch, pass QA, emit. Touch ONLY that spec and the files emit.mjs writes
for it (src/content/**/laws2400-wNN-*, plus new shared cases/authorities). Never commit; never edit raw/ or another
week's files. Another agent may be writing another week at the same time.

1. Read CLAUDE.md (rules 10, 11, 13, 14 + research rules), docs/content-spec.md (format; follow exactly) and
   raw/README.md. Skim content-src/laws2400-w06.yaml as the finished model for this unit (first ~250 lines + a sample).
2. Sources: raw/laws2400-torts/week-NN/ (lecture slides .pptx with speaker notes; lecture transcripts .txt where
   present; flowchart PDFs) and raw/laws2400-torts/unit-wide/ (act-2002-022.pdf = Civil Liability Act 2002 (NSW);
   the casebook covers topics 1–6 only — grep it, never read it whole). Extract:
   `node scripts/extract.mjs raw/laws2400-torts/week-NN raw/laws2400-torts/unit-wide`. Transcripts are long single
   lines: split first, e.g. `sed 's/\([.?!]\) /\1\n/g' <file> > .cache/wNN-tN.txt`, then grep/read slices.
   Slides are the spine (keep the lecturer's phrasing and order — no personal notes exist for Torts); transcripts
   add detail and examples. Machine-generated transcripts (first line says so) are lower trust: where they conflict
   with slides, follow the slides and mark the item verify: true.
3. Nothing invented. Every case, section and holding must appear in these files. A case named in the slides but
   whose facts/holding are not in the materials → case card with only what the materials say + verify: true.
   CLA sections: quote/gloss only from act-2002-022.pdf. Check src/content/cases/ and src/content/authorities/
   before adding; reference existing slugs (e.g. CLA sections, Donoghue v Stevenson, Caparo, Sullivan v Moody).
   Link depends-on/contrasts-with to earlier weeks' concepts (src/content/concepts/laws2400-w0*.md) where genuine —
   week 5 (duty overview/novel cases) and week 6 (categories of harm) especially.
4. Problem unit (ILAC): MCQs test elements, the right test for the fact pattern, which authority applies, CLA
   overlays, and common confusions (e.g. negligent misstatement vs pure economic loss by acts). Short answers are
   mini problem questions with rubric rows: Issue, Law (authority), Application, Conclusion (+ top-band, margin-note).
   Every MCQ option has a two-sided why: why the wrong one is tempting, why the right one is right. Never "see notes".
5. Targets (scripts/qa-week.mjs): 4–8 concepts (≤ 250 words; one idea each; visual chosen per content-spec:
   simulation for anything with variables, palace for ordered lists, diagram/timeline/explainer otherwise);
   ≥ 20 questions per concept, MCQ-heavy, 3–4 true/false each; exactly 20 true/false with set: quickfire;
   6 short answers; pretest of exactly 5 MCQ keys (set: pretest); ≥ 25 cards; audio 300–450 words (recap in plain,
   compressed, formal vocabulary covering each concept and its key authority). Correct option the unique longest in
   only 10–35% of MCQs and the unique shortest in 10–35% (draft distractors as long as the answer from the start).
   ≥ 3 discriminating questions per concept; variant-of variants; stems agree with marked answers. Australian English.
6. THIN weeks (flowchart only, e.g. weeks 9–12): set `thin: true` and `thin-reason:` on week_file naming exactly what is
   missing (lecture slides, recordings, casebook topic N). Generate only what the flowchart + CLA text honestly
   support — no padding from general knowledge; fewer, broader concepts; report the shortfall per concept.
7. Write the spec by building JS objects in a Node script and dumping with js-yaml (avoids quoting errors), in chunks.
8. `node scripts/qa-week.mjs content-src/laws2400-wNN.yaml` → ✓ qa ok → `node scripts/emit.mjs …` →
   `npm run validate` → `ADD_WEEK=laws2400-wNN npm run gate` → `npx astro sync`. Fix errors naming your week.
9. Report in under 150 words: qa line, validate/gate, counts (concepts, MCQ, TF, short, cards), every verify: true
   item with the source sentence it came from, and anything in the sources you could not use.
