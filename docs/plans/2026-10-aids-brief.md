# Study-aids brief (Oct 2026, 200-features pass) — for content agents

You write ONE file per week: `content-src/aids/<unit>-wNN.yaml`. It feeds many new site features at once:
progressive explanations, the abstraction ladder, mapped analogies with their limits, the glossary and drag-and-drop
labelling, misconception cards and spot-the-error, Socratic questioning and the hint ladder, visual rule checklists
and element-and-evidence boards, what-if fact changes, counterexample and transfer exercises, argument cards and the
argument adversary, storyboards, and walkable decision trees. Read this file, then `CLAUDE.md` (rules 10, 11, 13),
then `docs/plans/2026-10-week-agent-rules.md` (its Transcripts and Content rules sections apply to you too).

## Isolation (several agents run at once)
- Write ONLY `content-src/aids/<unit>-wNN.yaml` for your weeks, and your builder script under `.cache/aids-build/`.
- Never edit `src/`, `raw/`, `scripts/`, `docs/`, other weeks' files. Never run `npm run build`, Playwright,
  `git commit`, or `emit-aids.mjs` without `--check` (the lead emits and commits).

## Inputs for a week (read in this order)
1. The week's concept notes: `src/content/concepts/<unit>-wNN-*.md` (frontmatter lists its cases/authorities). These
   are the student's notes: where an aid restates them, keep their wording (rule 11).
2. The raw text: `.cache/raw-text/<raw unit folder>/week-NN/` (if missing or empty, run
   `node scripts/extract.mjs raw/<raw unit folder>/week-NN` first). Slides are the authority on structure, case names
   and citations; transcripts give the lecturer's explanations, examples and warnings ("students often get this wrong").
3. The week's MCQs: `grep -l "concept: <concept id>" src/content/questions/*` — the `why` on each wrong option is a
   ready-made, already-sourced misconception ("why the wrong one is tempting").
4. Cases/authorities you cite must already exist: `ls src/content/cases src/content/authorities`. Use their exact ids.

## What to write per concept (`aids:` list, one entry per concept of the week, every concept covered)
| key | what | size |
| --- | --- | --- |
| concept | full concept id, e.g. `laws2400-w05-duty-of-care-novel-cases` | — |
| plain | the simplest TRUE statement of the idea, no jargon | ≤ 35 words |
| concrete | one concrete instance from the sources (a case's facts or the lecturer's example), told plainly | 40–90 words |
| formal | the rule/principle as the sources state it, naming the authority (case, section, article, author) | ≤ 70 words |
| analogy | optional: `text` (the analogy), `maps` (2–4 `{from: analogy part, to: concept part}`), `limits` (1–2 places the analogy misleads). Only where it genuinely helps. | text ≤ 50 words |
| terms | 1–4 terms this concept uses, in the course's sense: `{term, gloss, example?}` | gloss ≤ 30 words |
| misconceptions | 2–3 `{claim, tempting, correction}`: the wrong belief as a student would hold it; why it seems right; the correct position with its authority. Prefer MCQ distractor whys and lecturer warnings. | each ≤ 45 words |
| socratic | 3–5 steps leading from the facts to the rule: `{ask, hint, answer}`. Questions a tutor would ask, in order. | hint ≤ 25, answer ≤ 50 words |
| elements | ONLY for a rule/test/framework: its requirements in the order an answer takes them: `{name, test, cases?, authorities?}` (ids must exist) | test ≤ 40 words |
| what-if | 2–3 for law concepts (1–2 otherwise): `{change, effect}` — change ONE material fact; say what happens to the analysis and why | effect ≤ 50 words |
| boundary | 1–2 `{text, why}`: a case or situation at the edge of the idea, and why it falls in or out | ≤ 50 words each |
| transfer | 1 `{scenario, answer}`: an unfamiliar setting where the same idea applies (scenario invented is fine — it is an exercise; the ANSWER must rest on sourced law) | scenario ≤ 60, answer ≤ 80 words |
| objections | essay-style concepts (theories, debates, strategy frameworks): 1–3 `{position, evidence, objection, reply?}` — reply only if the sources give one | ≤ 50 words each |
| storyboard | optional, for processes, histories and case narratives: 3–6 `{caption, detail}` frames in order | caption ≤ 8 words, detail ≤ 40 |
| sources | raw file names used, with slide/page where known, e.g. `Topic 5 Lecture 1 (slides 12–14)` | — |
| verify | `true` if anything in the entry is only partly supported by the sources | — |

Omit a key rather than pad it. Never invent an authority, holding, statistic, company fact or quotation: if it is not
in the sources, leave it out, or include it with `verify: true` and name it in your report.

## Decision flows (`flows:` list, per week)
Law weeks: 1–2 flows for the week's main doctrine (e.g. "Is a duty of care owed?", "Does the defence of necessity
apply?", "Is the ICJ's jurisdiction established?"). Torts raw folders contain lecturer flowcharts — follow them. Essay
weeks (LAWS2100, MGMT2094): 0–1 flow where the material has a real procedure or decision (e.g. a design-thinking
process, Hart's rule of recognition test); skip if none.
```yaml
flows:
  - slug: duty-novel-case            # kebab-case, unique in the week
    title: Is a duty of care owed in a novel case?
    summary: One sentence on what the flow decides.
    start: n1
    concepts: [laws2400-w05-duty-of-care-novel-cases]
    sources: [Topic 5 Flowcharts (p 290)]
    nodes:
      - id: n1
        kind: ask                    # ask (≥ 2 branches) | step (one next) | end (tone)
        text: Does the case fall within an established duty category?
        note: Established categories include ... (shown when the learner opens the node; ≤ 50 words)
        cases: [donoghue-v-stevenson]
        branches: [{label: "Yes", to: n2}, {label: "No", to: n3}]
      - id: n2
        kind: end
        tone: met                    # met | not-met | qualified
        text: Duty owed — move to breach.
      - id: n3
        kind: step
        text: Apply the salient features approach.
        concept: laws2400-w05-salient-features
        next: n4
      # ... every node reachable from start; no cycles; mark an exception/qualification node with exception: true
```
Aim for 6–14 nodes per flow; every ask's branches labelled from the learner's side ("Yes", "No", "Only partly").

## Problem-question fact annotations (`facts:` list — only in `content-src/aids/<unit>-w00.yaml`)
For each `type: long`, `template: ilac` question in `src/content/questions/<unit>-w00-q*.md`:
```yaml
unit: laws2400
week: 0
source: content-src/laws2400-pq.yaml
facts:
  - question: laws2400-w00-q001
    parties: [{name: Daniel, role: courier; Swift Parcels' employee}]
    issues:                         # the issues a full answer must take, in answer order (match the rubric rows)
      - {id: scope, label: Scope of liability (s 5D(1)(b)), concept: laws2400-w11-scope-of-liability-decision-flow}
    facts:                          # cover the WHOLE prompt, in prompt order; each text a VERBATIM excerpt
      - text: reversed his van out of a loading dock onto a busy city street without checking his mirrors
        weight: essential           # essential (drives the analysis) | background (context, colour)
        kind: conduct               # party | conduct | mental | harm | relationship | timing | statement | context
        issues: [scope]
        why: Careless conduct; breach is conceded, so this only sets up causation.   # ≤ 25 words; essential facts only
```
`text` must be copied character-for-character from the prompt (the emitter rejects anything else). Split long
sentences into clauses where parts play different roles. Mental-state facts (intention, knowledge, belief,
recklessness) are `kind: mental` even inside a conduct sentence — split them out.

## File header and finish
```yaml
unit: laws2400          # site unit id
week: 5                 # integer; 0 for the problem-question annotations
source: raw/laws2400-torts/week-05   # the raw week folder (week 0: content-src/<unit>-pq.yaml)
generator: aids-1
aids: [...]
flows: [...]
```
Build the YAML with a Node script (`.cache/aids-build/<unit>-wNN.mjs`, objects dumped with js-yaml
`{lineWidth: -1, noRefs: true}`), in chunks if long. Then run
`node scripts/emit-aids.mjs content-src/aids/<unit>-wNN.yaml --check` until it prints ✓. Australian English throughout.

Report (≤ 150 words per week): the ✓ line; counts (concepts covered, terms, misconceptions, socratic steps, elements,
what-ifs, flows/nodes); every `verify: true` entry with the source sentence it rests on; anything skipped and why.

## Regenerating a week (new material released later)
- Read the week's existing `content-src/aids/<unit>-wNN.yaml` first. Add, never replace: keep every existing entry and
  flow (the student's progress and saved states point at them) unless the new material contradicts it — then fix that
  entry in place and say so.
- New concepts (from the regenerated week spec) get full entries; enriched concepts get their entries refreshed
  (new terms, misconceptions, what-ifs, elements, sources). Update `sources` to name the new files.
- A week that was thin may now support `concrete`, `elements` and flows it lacked: add them.
- New long problem questions (template: ilac) in `content-src/<unit>-pq.yaml`: append fact annotations to
  `content-src/aids/<unit>-w00.yaml` for the NEW question ids only.
- Finish as above (`--check` until ✓); the lead runs `scripts/integrate-week.sh <week>` (emits) and
  `scripts/commit-week.sh` (stages the aids spec with the week). `npm run health` should show every concept with Aids ✓.
