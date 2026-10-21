# Agent brief: one LAWS2100 Jurisprudence week (slide-only weeks)

**Read docs/plans/2026-10-week-agent-rules.md first; where it differs from this brief, it wins** (parallel agents,
Echo360 transcripts, source-note, thin weeks, finish steps).

Write `content-src/laws2100-wNN.yaml` from scratch, pass QA, emit. Touch ONLY that spec and the files emit.mjs
writes for it (src/content/**/laws2100-wNN-*, plus new shared cases/authorities). Never commit; never edit raw/.
Other agents may be writing other weeks at the same time: never touch their files.

1. Read CLAUDE.md (rules 10, 11, 13, 14 + research rules) and docs/content-spec.md (format; follow exactly).
   Skim content-src/laws2100-w01.yaml as the finished model for this unit (first ~250 lines + a sample only).
2. Sources: raw/laws2100-juris/week-NN/ (lecture slides PDF + transcript .txt). Extract:
   `node scripts/extract.mjs raw/laws2100-juris/week-NN`. The transcript is one unbroken line: split it first,
   e.g. `sed 's/\([.?!]\) /\1\n/g' <file> > .cache/wNN-transcript.txt`, then grep/read slices.
   Slides are the spine (keep the lecturer's phrasing and order); the transcript gives detail and examples.
   raw/laws2100-juris/unit-wide (compressed deck): use only for this week's topic and for exam tips, via grep.
   raw/laws2100-juris/assessment: essay questions/rubric — only to shape exam tips and short-answer prompts.
3. Nothing invented: every theorist's claim, case and citation from these files; partial support → verify: true.
   Check src/content/cases/ and src/content/authorities/ before adding one; reference existing slugs.
   Earlier weeks' concepts: src/content/concepts/laws2100-w0*.md — link depends-on/contrasts-with where genuine.
4. Essay unit (thesis–argument–counterargument–evaluation): short answers are mini-essay prompts with rubric rows
   for thesis, argument, counterargument, evaluation (+ top-band, margin-note). MCQs test distinctions between
   theories/thinkers, applying a theory to a scenario, and common confusions.
5. Targets (qa-week.mjs): 4–8 concepts (≤ 250 words); ≥ 20 questions per concept, MCQ-heavy, 3–4 true/false each;
   exactly 20 true/false with set: quickfire; 6 short answers; pretest of exactly 5 MCQ keys (set: pretest);
   ≥ 25 cards; audio 300–450 words. Every MCQ option has a two-sided why ≥ 60 chars; correct option the unique
   longest in only 10–35% and unique shortest in 10–35% (draft distractors as long as the answer from the start).
   ≥ 3 discriminating questions; variant-of variants; stems agree with marked answers. Australian English.
6. Write the spec by building JS objects in a Node script and dumping with js-yaml (avoids quoting errors), in chunks.
7. `node scripts/qa-week.mjs content-src/laws2100-wNN.yaml` → ✓ qa ok → `node scripts/emit.mjs …` →
   `npm run validate` → `ADD_WEEK=laws2100-wNN npm run gate` → `npx astro sync`. Fix errors naming your week.
8. Report in under 120 words: qa line, validate/gate, counts, verify: true items.
