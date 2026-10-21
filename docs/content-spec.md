# Week spec format and content rules

Every week of every unit is generated as ONE YAML file, `content-src/<unit>-wNN.yaml` (e.g. `content-src/laws2400-w03.yaml`),
then turned into content files by `node scripts/emit.mjs content-src/<unit>-wNN.yaml`. Never hand-write files in
`src/content/` for a week; edit the spec and re-emit. A hand-corrected content file gets `locked: true` and is never
overwritten again.

Read CLAUDE.md rules 10, 11, 13 and 14 and the research rules before writing anything.

## 0. Pipeline for one week

1. `node scripts/extract.mjs raw/<unit-folder>/week-NN raw/<unit-folder>/unit-wide` → plain text in
   `.cache/raw-text/<unit-folder>/…` (and prints the week's source-hash). Images: open them with the Read tool.
2. Read **every** extracted file for the week in full. Use `unit-wide/` (casebook, statute, schedule) for the cases and
   provisions this week names — search it (grep) rather than reading it all.
3. If `content-src/<unit>-wNN.yaml` exists and its `source:` folder hash equals the `source-hash` stamped in
   `src/content/weeks/<unit>-wNN.md`, and `generator` is unchanged → report "unchanged" and stop.
4. Write the spec (below). 5. `node scripts/qa-week.mjs content-src/<unit>-wNN.yaml` must print `✓ qa ok`
   (correct option the unique longest in 10–35% of MCQs and the unique shortest in 10–35% — near chance; every `why` ≥ 60 characters; quick-fire 20; 6 short answers;
   pretest 5; ≥ 25 cards; ≥ 20 questions per concept; concept bodies ≤ 250 words). 6. `node scripts/emit.mjs
   content-src/<unit>-wNN.yaml`. 7. `npm run validate` and `npx astro sync` (the real, strict schema: unknown keys fail) and fix every error that
   names a file with your week prefix.

## 1. Spec skeleton

```yaml
unit: laws2400                 # lowercase unit id
week: 3                        # integer
source: raw/laws2400-torts/week-03
generator: ingest-1            # bump only when the generator rules change

week_file:
  topic: Trespass to land and goods          # short, from the materials
  summary: Three plain sentences on what this week covers and why it matters for the exam.
  notes: |
    ## First heading from the materials
    Prose/bullets built from the materials, preserving the student's (or lecturer's) wording and order.

    :::rule
    One-sentence rule statement.
    :::

    :::case
    *Case Name* [year] citation — one line on what it decided.
    :::

concepts:
  - slug: trespass-to-land               # kebab-case, unique in the week; file id becomes <unit>-wNN-<slug>
    title: Trespass to land
    visual: explainer                    # explainer | simulation | diagram | timeline | palace
    visual-brief: One line: the structure the visual exposes (limbs as gates, a balance, a chain…).
    related: [intentional-torts-overview]      # slugs in this week, or full ids of other weeks' concepts
    depends-on: [laws2400-w02-directness]      # prerequisites (full id for other weeks)
    contrasts-with: [trespass-to-goods]        # concepts students confuse with this one
    cases: [plenty-v-dillon]             # case slugs (see §3)
    authorities: []                      # authority slugs (see §3)
    verify: false
    body: |
      ≤ 250 words, one idea. Definition → elements → one authority → one exam-use line.

cases:
  - slug: plenty-v-dillon
    name: Plenty v Dillon
    citation: "(1991) 171 CLR 635"
    aglc: "Plenty v Dillon (1991) 171 CLR 635"
    facts: …
    issue: …
    held: …
    ratio: …
    significance: …
    why-here: One sentence on what this case is used for in this unit's answers.
    verify: false

authorities:
  - slug: civil-liability-act-2002-nsw-s5b
    title: Civil Liability Act 2002 (NSW) s 5B
    kind: statute                        # statute | treaty | principle | article | other
    text: The provision's words (quote from the Act in unit-wide/ where possible).
    gloss: One plain sentence.
    cases: [wyong-shire-council-v-shirt]
    verify: false

questions:                               # ≥ 20 per concept (all types count); see §4
  - key: q001                            # local key, unique in this spec
    type: mcq
    concept: trespass-to-land
    difficulty: 2                        # 1–4
    stem: …
    options:
      - text: …
        correct: true
        why: Why this is right.
      - text: …
        why: Why this is tempting, and why it is wrong.
  - key: q002
    type: mcq
    concept: trespass-to-land
    variant-of: q001                     # same objective, different facts
    …
  - key: q040
    type: truefalse
    set: quickfire                       # 20 per week carry set: quickfire
    concept: …
    statement: …
    answer: false
    why: …
  - key: q060
    type: short
    concept: …
    difficulty: 3
    prompt: …
    model: 120–200 word model answer.
    rubric:
      - id: r1
        criterion: …
        marks: 2
        top-band: What a top answer does for this criterion.
        margin-note: What a marker would write in the margin.
        authorities: []
  - key: q070
    type: match
    concept: …
    prompt: Match each case to its principle.
    pairs:
      - { left: …, right: … }

pretest: [q001, q011, q021, q031, q041]  # exactly 5 keys; give those questions `set: pretest`

cards:                                   # ≥ 25 per week
  - type: basic
    concept: trespass-to-land
    front: …
    back: …
    source: "Topic 3 Lecture 1, slide 7"
  - type: cloze
    concept: …
    text: "Trespass to land requires a {{c1::direct}} interference with land in the plaintiff's {{c2::possession}}."
    source: …
  - type: apply
    concept: …
    scenario: A two-line fact pattern.
    answer: The issue, the rule and the likely conclusion in two lines.
    source: …

audio:
  title: Week 3 recap — trespass to land and goods
  minutes: 3
  script: |
    300–450 words, spoken, plain and compressed, in the student's voice (first person plural is fine),
    covering each concept and its key authority. No headings, no bullet points.
```

## 2. Notes and concepts

- **Nothing is invented** (rule 10). Every rule, case, holding, citation and provision must come from this week's files
  or `unit-wide/`. If you need something that is not there, leave it out; if you include a detail only partly
  supported, set `verify: true` on that item.
- **Preserve wording** (rule 11). Where the student has written notes (LAWS2000 Weekly Notes), keep their sentences
  and order; restructure only. For slide-only weeks, build the notes from the slides, keeping the lecturer's phrasing.
  Transcripts are for detail and examples, not the spine.
- Callouts: `:::rule`, `:::case`, `:::statute`, `:::definition`, `:::examtip` — only where the material warrants.
- ≤ 5 paragraphs per heading. Australian English. No "see notes".
- **Concepts**: 4–8 per week, one idea each, body ≤ 250 words. `visual: simulation` for anything with variables,
  `palace` for ordered lists (elements, limbs, sources), `timeline` for developments over time, otherwise
  `explainer` or `diagram`.
- Link `depends-on` only to concepts that exist (this spec, or an earlier week's emitted concept id).

## 3. Cases and authorities (shared across weeks)

- Slugs: lowercase, words joined by `-`, `v` kept, punctuation dropped, `&` → `and`, no citation, no year.
  `Wyong Shire Council v Shirt` → `wyong-shire-council-v-shirt`; `Re Polemis` → `re-polemis`.
  Authorities: short title + year + jurisdiction + provision, e.g. `civil-liability-act-2002-nsw-s5b`.
- Before adding one, check `src/content/cases/<slug>.md` / `src/content/authorities/<slug>.md`: if it exists, just
  reference the slug (the emitter adds your unit to its `units`). Do not redefine it.
- Citation and AGLC4 string exactly as in the materials. Facts/issue/held/ratio from the casebook or slides.
  If any field is not fully supported by the materials, `verify: true`.

## 4. Questions (per concept ≥ 20, MCQ-heavy)

- Per concept, roughly: 12–14 MCQs, 3–4 true/false, 1 short answer (the week has 6 short answers in total), and
  the rest variants. Difficulty spread 1–4. At least 3 per week that **discriminate commonly confused concepts**
  (use `contrasts-with`). Later questions as `variant-of` earlier ones: same objective, different facts.
- MCQ: 3–4 options, exactly one correct. Distractors are plausible misconceptions. Every option has a `why`
  (why the wrong one is tempting; why the right one is right), each at least 60 characters. **The correct option must not
  be the longest more often than chance**: write distractors as long and as specific as the answer, and keep the answer
  tight — but not always the shortest, and not always the middle either. `qa-week.mjs` enforces 10–35% for each.
- Application questions use short fact patterns in the style of the unit (ILAC problems for law units).
- Quick-fire: exactly 20 true/false per week with `set: quickfire`.
- Pretest: 5 MCQs across the week's concepts with `set: pretest`, listed in `pretest:`.
- Short answers: 6 per week; 120–200 word model; 3–5 rubric rows each with `top-band` and `margin-note`.
- Every question must be answerable from this week's materials.

## 5. Cards (≥ 25 per week)

Mostly `basic`, `cloze` and `apply`; `occlusion` only when a real diagram image exists. Each links to its concept and
gives `source` (file + slide/page).

## 6. Long questions (`/generate-questions <unit> pq`)

Written separately as `content-src/<unit>-pq.yaml` with `week: 0` (ids `<unit>-w00-q…`), from `exams/` or
`assessment/` materials and all weeks: 4 per tier (worked, faded, full); 250–400 word scenario or essay prompt spanning
weeks; `timer: 40`; rubric of 6–9 rows (marks, top-band, margin-note, authorities); model answer 900–1200 words;
`template: ilac` (problem units) or `essay`; faded tier has `given:` (issues, rule); worked tier has `steps:` (the model
answer's steps in order). `concept:` is the main concept tested (full id).
