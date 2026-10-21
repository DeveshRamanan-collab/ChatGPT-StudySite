# Dossier brief — every case and every provision, nothing missed

Devesh's words (20 Oct 2026): "nothing should be missed. Not even a single detail, name, limitation, law, legislation,
or even a tiny fact in a case … this is of the utmost importance for the exam … anything examinable has double the
explanations in different ways." A dossier is the full record of one case or one legal provision. The cases and
statutes pages show its one-liner collapsed and everything else expanded; Case Theatre and Statute Lab are driven by it.

Read first: CLAUDE.md, docs/plans/2026-10-exam-build.md (ground rules), the two gold examples —
`content-src/dossiers/cases/donoghue-v-stevenson.yaml` and `content-src/dossiers/provisions/civil-liability-act-2002-nsw-s5b.yaml`
— and the schema in `src/content/config.ts` (`dossiers`). Match the gold examples' depth and tone.

## Your job, step by step
1. **Read your weeks in full.** Every file in `.cache/raw-text/<unit-folder>/week-NN/` for your weeks (lecture
   transcripts, slides, notes, tutorial tasks, readings), plus `.cache/raw-text/<unit-folder>/unit-wide/` (Torts: the
   Casebook and the Civil Liability Act; PIL: schedule and links) and `.cache/raw-text/<unit-folder>/assessment/`. Also
   the site's existing content for those weeks: `src/content/weeks/<unit>-wNN.md`, the concepts and aids it lists, and
   the existing `src/content/cases/*.md` and `src/content/authorities/*.md` you own. If `.cache/raw-text` lacks a file
   that is in `raw/`, run `node scripts/extract.mjs raw/<unit-folder>/week-NN`.
2. **Inventory.** List every case and every legal provision (section, article, rule) named anywhere in those
   materials. Use `node scripts/dossier-coverage.mjs --unit <unit>` → `docs/audits/dossier-coverage-<unit>.md` (its
   "Case names in raw materials" section lists candidates the site has no record of; rule each one in or out).
3. **Ownership.** You own an existing case/authority when its `origin` is one of your weeks; you own a new one (not on
   the site) when its first mention in raw/ is in your weeks. dossier-tnew owns the 21 Torts law-list cases the site
   lacks; dossier-tstat owns every Torts statute provision. If something in your weeks is owned by another agent, don't
   write it — add a line to your ledger's "Hand-offs" (ref, your week, the context: what your week says about it).
4. **Write one YAML per item you own** at `content-src/dossiers/cases/<ref>.yaml` or
   `content-src/dossiers/provisions/<ref>.yaml` (file name = ref). For a new item, choose a kebab-case ref (match the
   style of existing ids) and include a `base:` block — the emitter creates the case/authority record from it.
   Immediately before creating a new file, check it doesn't already exist (another agent may have just written it).
5. **Check as you go:** `node scripts/emit-dossiers.mjs <your files> --check` after every few files; fix every error.
   When a batch is clean, emit it: `node scripts/emit-dossiers.mjs <your files>`.
6. **Ledger:** `docs/audits/dossiers/<your-agent-name>.md` — every authority found in your weeks with its status
   (written · owned by X · ruled out because …), every external URL you used, every `verify: true` and why, and the
   hand-offs. This is how the integrator proves nothing was missed.
7. **Report back** (your final message): counts (dossiers written, bases created, verify flags), the files you wrote,
   anything you could not do.

## What goes in each field (cases)
- `units`, `weeks` (where taught — from raw), `topics` (only slugs in content-src/dossiers/vocab.yaml for that unit;
  need another? say so in your report), `lists` (Torts: `laws2400-examinable` for exactly the refs on that list in
  vocab.yaml — the emitter enforces both ways), `court` (code from vocab.yaml), `year`, `judges` (all, with majority /
  dissent).
- `one-liner` ≤ 30 words: what it decided, in words you'd say aloud.
- `plain` (explanation 1): the story and the rule for a bright 12-year-old. 70–160 words. No Latin without a gloss.
- `analogy`: an everyday parallel, and where it would mislead if relevant.
- `key-facts`: EVERY material fact, one sentence each, in time order — names, places, dates, ages, amounts, injuries,
  what each party did and didn't do, what the trial judge and intermediate court decided. This is where "nothing
  missed" bites; err on the side of more. Preserve the student's wording from the existing case record where it exists.
- `parties`, `timeline` (3–7 beats for Case Theatre: label + one or two sentences), `issues`.
- `reasoning` (explanation 2, formal): the court's steps, with the tests it applied and why each was or wasn't met.
- `outcome` (who won, majority, orders), `ratio`, `obiter`, `dissent`.
- `limits`: every qualification, exception, later restriction, statutory override (e.g. "in NSW now governed by
  s 5D CLA"), and how later cases confined or distinguished it.
- `exam-use`: `when` (the fact-pattern trigger), `sentence` (one model sentence obeying the unit's referencing rules —
  below), `pitfalls`.
- `what-if` (2–4 fact changes and their effect), `contrasts` (cases it's confused with or distinguished from — ids),
  `statutes` (provision ids it interprets or that now govern it), `quotes` (verbatim only; see sources).
- `sources`: raw paths first (`raw/<unit-folder>/week-NN/<file name as in raw/>`), then official URLs you fetched.

## What goes in each field (provisions)
- `instrument` (full name exactly as cited first time), `short` (the abbreviation the rules allow after that: CLA,
  LRMPA 1965, UN Charter, VCLT, ARSIWA, Rome Statute …), `part`, `section` (as cited: 5B, 3B(1)(a), 2(4), 38(1)(b)),
  `heading`.
- `text`: VERBATIM. Torts: copy from `.cache/raw-text/laws2400-torts/unit-wide/act-2002-022.pdf.txt` — the emitter
  checks every paragraph against it, so don't retype. For instruments not in raw/, fetch the official text
  (legislation.nsw.gov.au, legislation.gov.au, treaties.un.org / legal.un.org, icj-cij.org, the ILC texts) and copy it
  exactly; list the URL in `sources`. Long provisions: include the whole section unless it runs past ~600 words; then
  include every subsection the unit uses and say in `limits` which subsections are omitted.
- `one-liner`, `plain` (explanation 1), `elements` (explanation 2: each requirement in answer order with `label`
  "s 5B(1)(a) Foreseeable risk", `test` (formal), `plain`, `cases`), `logic` (all / any / custom + `logic-note`),
  `outcome` (`met` / `failed`), `factors` (weighed considerations), `exceptions`, `cases`, `related`, `examples`
  (mini fact patterns and the analysis), `limits`, `exam-use`, `what-if`.

## Referencing rules for `exam-use.sentence`
- **Torts (LAWS2400):** first mention: full case name, no citation ('Donoghue v Stevenson'); later: short name
  ('Donoghue'). Legislation: full name first ('Civil Liability Act 2002 (NSW)'), then 'CLA', with precise pinpoints
  ('s 5B(1)(a) CLA'). No pinpoints for cases.
- **PIL (LAWS2000):** treaties/ILC articles: full name first ('Charter of the United Nations'), then abbreviation
  ('UN Charter'), pinpoints 'art 2(4) UN Charter'. Decisions: court + short name first ('the ICJ's *Right of Passage*
  case'), then short name ('*Right of Passage*'). Scholars: 'Rawls (2005)'. Only things covered in the unit.
- **Jurisprudence:** case name as usually cited; scholars 'Hart (1961)'.

## Sources and verification (non-negotiable)
- raw/ is the first source. Facts beyond raw/ need an official source you actually fetched (WebFetch/WebSearch or the
  web-fetch agent): eresources.hcourt.gov.au or hcourt.gov.au (HCA), caselaw.nsw.gov.au (NSW), bailii.org (UK/PC),
  nzlii.org, icj-cij.org, legal.un.org, jade.io/austlii if reachable. Put each URL in `sources`.
- If a fact, quote or holding can't be confirmed from raw/ or a fetched official source, either leave it out or set
  `verify: true` and say exactly what is unconfirmed in `verify-notes`. Never guess a judge's name, a date, an amount
  or a vote count.
- Quotes: verbatim only. The emitter checks quotes whose source is a raw/ file. Quotes from a URL must be copied from
  the fetched page.
- Peterkin v Tadros [2026] NSWSC 1185 and Bird v DP [2024] HCA 41 are recent; rely on raw/ and the official judgment.

## YAML style
- Long text: block scalars (`>-` for prose, `|-` where line breaks matter, e.g. statute text).
- In flow mappings `{ a: …, b: … }` quote any value containing a comma, colon or `#`. When in doubt use block style.
- Ids: kebab-case, matching existing ones (`civil-liability-act-2002-nsw-s5b`, `un-charter-art-2-4`).
- No tabs. UTF-8. Curly quotes are fine.

## Don'ts
- Don't edit src/content/** by hand (only via the emitter), don't edit vocab.yaml, config.ts or the scripts (report
  needs instead), don't touch files you don't own, don't commit, don't run the build or dev server.
