# raw/ — source materials for the study site

Layout: raw/<unit>/week-NN/ holds that week's materials. Extra folders per unit:
- unit-wide/  : material that spans weeks (casebook, schedule, statute, combined slides). Use as context for every week of that unit.
- assessment/ : assessment briefs, rubrics and assessment-specific sources. Use rubrics as marking criteria when generating long questions (treat like exams/).

Notes for ingestion:
- LAWS2400 Torts: week folders contain lecture slides (Topic N = Week N) and flowcharts; there are no personal written notes, so build concept cards from the slides and the casebook in unit-wide/. act-2002-022.pdf is the Civil Liability Act 2002 (NSW). Weeks 9–12 each have a flowchart (from Tort Law Principles 3e). Weeks 9–10 also have both lecture decks (Topic N Lecture 1/2.pptx, from Echo360), both lecture transcripts and the iLearn tutorial preparation questions captured as .md (16 Oct 2026); weeks 11–12 lectures are on 22 and 29 Oct (not released yet). Casebook topics 7+ exist only on iLearn (not downloaded). The casebook PDF covers topics 1–6. Week 11 also has tutorial slides on communication and trauma-informed practice.
- LAWS2000 PIL: weeks 1–7 have the student's own Weekly Notes (.md, preserve their wording), lecture slides, tutorial tasks and full lecture transcripts (live and online). Prefer the Weekly Notes as the spine; use transcripts for detail and examples. Weeks 8–12 have NO personal notes: build them from slides, tutorial tasks and transcripts, and do not imitate the student's note-taking voice. Recordings exist for weeks 8–10; week 10 has a transcript for Part A.1 only (Echo360 has none for Parts A.2 and B); 11–12 not released. Week 11 slides are 104.6 MB: kept locally, gitignored; read the committed "(text extract).md". Week 12 has revision slides and tutorial revision quiz questions (spine for a unit-wide revision set; keep the tutor's wording in question stems).
- LAWS2100 Jurisprudence: each week has lecture slides and a lecture transcript; no personal notes. Answer style is essay. Weeks 8–10 are in (w10 is a 2025 recording, like w09); weeks 11–12 not released yet.
- MGMT2094 Strategic Creativity and Innovation (folder mgmt2094-sci): weeks 1–12 of lecture materials, tutorial materials and readings; recordings for weeks 1–5 and 8–12 (none for 6–7). No personal notes. Every concept links to a real example from the readings or lectures. Final task (Week 1 slides): a 750-word Writing Task in the Week 13 lecture (30%) on a statement released beforehand; the Week 12 "Final Exam Preparation" deck holds only guest-lecture discussion questions.

Recordings and transcripts:
- Transcripts are SUPPLIED by the student (Echo360 machine captions: speaker-labelled, unpunctuated in places, misheard
  names) and are never generated here. Video is never copied here or committed (.gitignore).
- In raw/ they are named "… Lecture Transcript …" (the working-folder "for Code" and tag are dropped). Use them for
  explanations, emphasis and worked examples; slides are the authority on structure, definitions, names and citations.
  Never take a name or term from a transcript alone; where they conflict, follow the slides and flag it (verify: true).
- No transcript = none exists; build from slides/readings/tutorials/flowcharts and say so on the week page.
  Without transcripts: International w08 Parts B–C, w10 Parts A.2 and B, w11–w12; Torts w01–w06 (recordings exist but were not pulled), w11–w12 and the w05 Donoghue clip; Marketing w02,
  w06, w07 (w10's recording is the Dow Corning guest lecture, used in w09).
- Marketing recordings are reused from earlier years and from w09 on do not match the iLearn topics: w09 transcript =
  types/models of innovation + reflective writing; w10 = Dow Corning case (guest, Viken Kortian); w11 = guest founder
  (Mark); w12 = guest Shelley Simpson. Concepts are built where the material is and the weeks cross-linked.
- Jurisprudence w09 and w10 are 2025 recordings: anything said about the exam, dates or assessment refers to last year.
- Any file over 95 MB stays local and gitignored with a committed "<name> (text extract).md" beside it; the source hash
  and extractor skip the large original (scripts/source-hash.mjs MAX_RAW_BYTES).

Adding newly released material (weeks 8–12 of the law units are still being released):
- Download into the working folder ("University Semester 2 (Working Folder)/<Unit>/Week NN/" or "Unit-wide/"), named
  "Unit - Week NN - Type - Title.ext" and ending in " [NOT YET IN STUDY SITE]" — transcripts as "… Lecture Transcript
  for Code …". Then, in Claude Code: /new-material.
- `node scripts/inbox.mjs` shows what would be copied and whether each week is new or a regeneration (thin weeks are
  rebuilt around the new slides and lose "thin" once the material supports the targets; nothing on the site is
  removed). `node scripts/inbox.mjs --status` writes docs/pending-material.md: per week, what it was built from and
  what is still missing.
