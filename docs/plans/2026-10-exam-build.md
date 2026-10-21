# Exam build (20 Oct 2026) — master plan

Progress is reported in chat (the live progress page was deleted at the student's request).
Asked by Devesh on 20 Oct 2026: exam pages from the new exam documents; every case and every piece of legislation in
one place with one-liners that expand, filters (week, topic, court, Torts examinable list…), nothing missed; interactive
case/statute learning with plain-language explanations and two explanations of anything examinable; exam notes on the
exam pages; navigation where any page is a few clicks away and a far better ≡ drawer; calendar study blocks driving the
plan; 20 cutting-edge features; a calm scroll-linked background (renders come from Devesh via Google Flow/Firefly —
docs/plans/background-prompts.md).

## Ground rules for every agent (read CLAUDE.md too — it overrides anything here)
- Stay inside the files you own (table below). Need a change elsewhere? Write it in your report; the integrator does it.
- Never commit, push, or run `npm run build`, `astro build`, `astro check`, `npm run dev` or `preview`. Never start or
  stop servers. The integrator keeps `npm run dev` on http://localhost:4321; use it (curl, Playwright) to look at pages.
- Type-check with `npx tsc --noEmit -p .` and test with `npx vitest run <your test files>`. Content agents validate with
  `node scripts/emit-dossiers.mjs <files> --check` and emit with `node scripts/emit-dossiers.mjs <files>`.
- Australian English. Preserve the student's wording where the site already has it (CLAUDE.md rule 11). Never invent
  law: anything not in raw/ is backed by a fetched official source URL, or flagged `verify: true` with `verify-notes`.
- UI: tokens from src/styles/tokens.css only; animate only transform/opacity/filter/clip-path; every animation has calm
  and off states; hover gated by `@media (hover:hover) and (pointer:fine)`; keyboard-complete; 44px targets; no local
  element named like a shared component class (.chip, .btn, .card …) — prefix with the page/feature name.
  Scrollable overlays carry `data-lenis-prevent`. Islands default to `client:visible`. Re-init on `astro:page-load`.
- Every new page passes axe (no violations), has no console errors and works at 390×844 and 1440×900.

## Workstreams and owners
| Stream | Agent | Owns (create/edit only these) |
| --- | --- | --- |
| Exam facts in raw/ + unit.yaml | integrator | raw/**/assessment, raw/*/unit.yaml (done) |
| Dossier tooling | integrator | src/content/config.ts (dossiers), scripts/emit-dossiers.mjs, scripts/dossier-coverage.mjs, content-src/dossiers/vocab.yaml |
| Dossiers — Torts w1–4 | dossier-t14 | content-src/dossiers/{cases,provisions}/* for the refs it owns (see brief) |
| Dossiers — Torts w5–6 | dossier-t56 | 〃 |
| Dossiers — Torts w7–8 | dossier-t78 | 〃 |
| Dossiers — Torts w9–10 | dossier-t910 | 〃 |
| Dossiers — Torts w11–12 | dossier-t1112 | 〃 |
| Dossiers — Torts law-list cases not yet on the site | dossier-tnew | 〃 (21 cases, `base:` blocks) |
| Dossiers — Torts legislation | dossier-tstat | provisions/civil-liability-act-*, law-reform-*, other Torts statutes |
| Dossiers — PIL w1–3 / w4–6 / w7–9 / w10–12 | dossier-p13, -p46, -p79, -p1012 | 〃 |
| Dossiers — Jurisprudence | dossier-j | 〃 |
| Verification (after each unit's dossiers land) | verify-* | docs/audits/verify-*.md + fixes to the dossier YAML it checks |
| Navigation | ui-nav | src/components/NavSheet.tsx (+ its CSS), src/components/nav/**, src/components/Breadcrumbs.astro, src/layouts/Layout.astro (header/nav only), src/pages/index.astro (jump index section), src/lib/nav-index.ts, src/pages/data/nav.json.ts, src/styles/components.css (.ambient only: remove the cursor-following radial glow) , src/lib/cursor.ts (ambient only) |
| Case and statute library | ui-lib | src/pages/cases/**, src/pages/statutes.astro, src/pages/statutes/**, src/components/library/**, src/components/cases/**, src/components/legal/StatuteMap.tsx, src/lib/library.ts, src/pages/data/library/** |
| Labs: Case Theatre + Statute Lab | ui-lab | src/components/labs/**, src/pages/lab/**, src/lib/labs.ts |
| Exam hub, exam pages, Ten-Sheet Composer, Examiner Lens, Citation Coach, Exam Day | ui-exam | src/data/exams/**, src/pages/exams/**, src/pages/[unit]/exam.astro, src/pages/[unit]/exam/**, src/components/exam/**, src/lib/exam-info.ts, src/lib/citation-coach.ts, src/lib/standards.ts |
| Practice: Mock Exams, Problem Forge, Issue X-ray, Answer Architect, Hidden-Gem Trainer | ui-practice | src/pages/[unit]/mock/**, src/pages/[unit]/forge.astro, src/pages/xray.astro, src/pages/[unit]/gems.astro, src/components/practice/**, src/lib/forge.ts, src/lib/xray.ts |
| Plan: calendar Now panel, Mark Forecast, on-device tutor + viva | ui-plan | src/data/study-blocks.json (read), src/lib/calendar.ts, src/components/plan/**, src/pages/plan.astro, src/components/StudyPlan.tsx, src/lib/forecast.ts, src/components/tutor/**, src/lib/tutor.ts |
| Feature data — Torts / PIL / MGMT+Juris | feat-torts, feat-pil, feat-essay | src/data/features/<unit>/*.yaml for their unit |
| Background + startup film | integrator | public/bg/**, src/components/ScrollBackground.tsx, src/lib/scroll-bg.ts, intro changes |

## The 20 new features (owner)
1. Exam Command Centre — /exams and /<unit>/exam: countdown, format, time plan from the real weights and reading time, materials checklist, key dates (ui-exam)
2. Ten-Sheet Composer — builds the 10 A4 double-sided sheets (Torts, PIL) in the tips video's 3-column table, colour-coded, live fit meter, print-ready A4 (ui-exam)
3. Paper-faithful mock exams — each unit's real format, reading-time lock, pacing by weight, thumbnail-plan pane (ui-practice + feat-*)
4. Examiner Lens — self-mark against the official HD–Fail standards, band estimate and "to move up a band" checklist (ui-exam)
5. Citation Coach — live lint of the unit's referencing rules in any answer box (ui-exam; used by ui-practice)
6. Law-List Lock — Torts mode that restricts library, search and practice to the examinable list; "On the law list" badge (ui-lib)
7. Case Theatre — step through each case: parties, beats, issue → reasoning → outcome, pause-and-predict (ui-lab)
8. Statute Lab — toggle each provision's elements, live outcome, factor weighing, apportionment and proportionate-liability calculators (ui-lab)
9. Problem Forge — unlimited new hypotheticals from authored fact modules, with answer keys and hidden gems (ui-practice + feat-*)
10. Issue X-ray — paste any hypothetical; facts highlighted and mapped to issues and authorities in answer order (ui-practice + feat-*)
11. Answer Architect — drag-and-drop ILAC/essay plan with a time budget from weight and writing speed (ui-practice)
12. Precedent Pathways — animated chains showing how doctrine moved case by case (ui-lib + feat-*)
13. Distinguish Duel — two cases side by side, decisive difference, then "which is this closer to?" drills (ui-lib + feat-*)
14. Mark Forecast — projected exam-day band per unit from recall × examinability × weight; highest-yield next 45 minutes (ui-plan)
15. Now Panel — your calendar blocks: "Now: Torts W7 · 47 min left" opens a session sized to the block; exam-period slots (ui-plan)
16. Everything Index — every page in two clicks from home and from ⌘J, typeahead, recent and pinned (ui-nav)
17. Ask the Library — plain-question search over authored questions for every case, provision and concept (ui-lib + feat-*)
18. Exam Day Mode — day-of checklist, last-hour deck from weakest examinable items, calm start timer, post-exam dump (ui-exam)
19. Hidden-Gem Trainer — spot the subtle fact the examiner planted, and what it triggers (ui-practice + feat-*)
20. On-device Tutor and Viva — uses the browser's built-in on-device model when present (Chrome Prompt API) to re-explain a case or quiz you, grounded in its dossier; speak your answer (Web Speech) and see which elements you hit; falls back to authored content (ui-plan)

## Data contracts (src/data/features/<unit>/<kind>.yaml; loaded by src/lib/feature-data.ts → /data/features/<unit>/<kind>.json)
All ids kebab-case. `cases` are ids in src/content/cases; `provisions` are ids in src/content/authorities; `concept`
is an id in src/content/concepts. Text is Australian English. Every file starts with `unit: <unit id>`.

### triggers.yaml (Issue X-ray, Problem Forge answer keys, Hidden-Gem issues)
```yaml
unit: laws2400
issues:
  - id: duty-public-authority          # unique in the file
    label: Duty of care — public authority
    order: 120                         # position in a model answer (lower first)
    group: Duty of care                # heading the answer plan groups it under
    triggers: [council, "roads authority", "statutory power", "failed to inspect"]   # lowercase phrases, whole-word match
    patterns: ["\\bshire\\b"]          # optional extra regexes (case-insensitive)
    cases: [crimmins-v-stevedoring-industry-finance-committee, graham-barclay-oysters-v-ryan]
    provisions: [civil-liability-act-2002-nsw-s42]
    concept: laws2400-w08-...          # optional
    note: One line on what to argue when this fires.
```
### modules.yaml (Problem Forge)
```yaml
unit: laws2400
slots: [setting, parties, conduct, harm, twist]
names: { P: [Priya, Tom, Mei], D: [Harbourside Council, Coastline Pty Ltd], W: [Aunty Joan] }
modules:
  - id: rock-pool                      # unique
    slot: setting
    text: "{D} manages a rock pool beside a busy beach ..."   # {P} {D} {W} are replaced with names
    issues: [duty-public-authority, obvious-risk]             # ids from triggers.yaml
    gem: false                          # true = a subtle fact the examiner plants
    tags: [water]                       # optional; `requires`/`excludes` refer to tags or module ids
    requires: []
    excludes: []
```
### mocks.yaml (paper-faithful mocks; real format from src/data/exams/<unit>.yaml)
```yaml
unit: laws2000
papers:
  - id: mock-1
    title: Mock paper 1
    questions:
      - n: 1
        weight: 40
        kind: hypothetical            # hypothetical | short-essay | discursive | essay | short-answer
        prompt: |-
          ...
        parts: [{ label: "(a)", prompt: "...", weight: 15 }]   # optional sub-questions
        plan: [Issue 1 …, Issue 2 …]                          # model thumbnail plan
        model: |-                                              # model answer, Markdown
          ...
        cases: []
        provisions: []
```
### gems.yaml (Hidden-Gem Trainer)
```yaml
unit: laws2400
items:
  - id: gem-01
    facts: |-
      Short hypothetical paragraph.
    options: ["verbatim excerpt A", "verbatim excerpt B", "verbatim excerpt C", "verbatim excerpt D"]
    answer: 2                         # index into options
    issue: intoxication               # id from triggers.yaml
    why: Why this fact is the planted one and what it triggers; why the others are background.
```
### ask.yaml (Ask the Library)
```yaml
unit: laws2400
entries:
  - q: When is a roads authority not liable for failing to repair a road?
    a: One-sentence answer.
    to: { kind: provision, ref: civil-liability-act-2002-nsw-s45 }   # kind: case | provision | concept | page (ref = path)
```
### chains.yaml (Precedent Pathways)
```yaml
unit: laws2400
chains:
  - id: duty-evolution
    title: From neighbour to salient features
    topic: duty-of-care               # vocab topic
    steps:
      - { case: donoghue-v-stevenson, move: "Neighbour principle: reasonable foreseeability founds the duty." }
```
### duels.yaml (Distinguish Duel)
```yaml
unit: laws2400
pairs:
  - id: wagon-mound-1-v-2
    a: overseas-tankship-v-morts-dock-the-wagon-mound-no-1
    b: overseas-tankship-v-miller-steamship-the-wagon-mound-no-2
    same: [Same oil spill in Sydney Harbour, Same defendant]
    differ: [{ aspect: Evidence of foreseeability, a: "...", b: "..." }]
    decisive: The decisive difference in one sentence.
    drills: [{ facts: "...", closer: a, why: "..." }]
```
### src/data/exams/<unit>.yaml (ui-exam authors from raw/<unit>/assessment, verbatim where quoted)
```yaml
unit: laws2400
status: final
weight-of-unit: 50
format: Two hypothetical questions…           # one paragraph, verbatim where possible
reading-rule: no-writing | working-permitted | not-stated
materials: { notes: "10 A4 sheets, double-sided", list-provided: true, dictionary: false, calculator: false, confirmed-by: "student, 20 Oct 2026" }
questions: [{ n: 1, weight: 50, kind: hypothetical, note: "Assess the merits of a negligence claim in NSW" }]
topics: [{ label: "Topic 5", weeks: [5], vocab: [duty-of-care] }]
referencing: [{ label: Case law, rule: "verbatim rule", example: "Donoghue v Stevenson → Donoghue" }]
standards: [{ band: HD, text: "verbatim descriptor" }]
criteria: [{ id: structure, label: Structure and clarity, bands: { HD: "phrase", D: "…", C: "…", P: "…", F: "…" } }]
tips: [{ source: "raw/…/Exam - UG Exam Prep video - Transcript.txt", speaker: "Speaker 1", quote: "≤ 40 verbatim words", takeaway: "plain instruction" }]
dates: [{ label: Room and seat numbers released, at: "2026-11-04T13:00:00+11:00" }]
special-consideration: "verbatim paragraph"
sources: [raw/…]
```

## Order of work
1. Integrator: dossier tooling, vocab, gold examples, calendar snapshot (done 20 Oct). Agents launched in parallel.
2. Content agents write dossiers; verification agents re-check each unit; integrator merges handoffs, emits, runs gate.
3. UI agents build against the gold dossiers first and the growing set as it lands (UI must render a case with no dossier
   from its base case record).
4. Integrator wires Layout, runs build + validate + gate + tests + Playwright at 1440×900 and 390×844 in full/calm/off,
   commits with scripts/commit-push.sh.

## Agent roster (wave 1, launched 20 Oct 2026 ~14:45 AEDT; resume with SendMessage to the id)
| Agent | id | Status |
| --- | --- | --- |
| dossier-t14 | a182bf5357a4f7257 | running |
| dossier-t56 | a0eec1e5ad8124408 | running |
| dossier-t78 | a1e9827086e3eaf54 | running |
| dossier-t910 | a76f4032968ee2c4e | running |
| dossier-t1112 | a76d4d6a8f71c5418 | running |
| dossier-tnew | ac2db53d1cb769b6a | running |
| dossier-tstat | af45e7da08da2f1c0 | running |
| dossier-p13 | abee7c2d672f59a8b | running |
| dossier-p46 | a6f5f2c0f52f7956b | running |
| dossier-p79 | a1c4ed48dbcd8b86a | running |
| dossier-p1012 | a18adf23e88a6bfe4 | running |
| dossier-j | ad01263e799cac17a | running |
| ui-nav | ae656c4ce1c43209e | running |
| ui-lib | a6e2d55455625e6eb | running |
| ui-exam | aed35a26fdf0fd081 | running |
| ui-plan | a168d316474941682 | running |
| feat-torts | aa66ab763a4850fed | running |
| feat-pil | ab5f3e8a90286fe2c | running |
| feat-essay | ab08cc3b12f5e7e46 | running |
Wave 2 (after content lands): ui-lab, ui-practice, verify-torts ×3, verify-pil ×2, verify-juris.

## Wave 1 resumed (20 Oct 2026 ~18:00 AEDT, after the usage limit cut wave 1 off; files on disk were kept)
| Agent | id | Status |
| --- | --- | --- |
| dossier-t14 | a3fed8fe1421a2d8d | running |
| dossier-t56 | a654fdfca8e06f507 | running |
| dossier-t78 | a409e3b4ad25d66f6 | running |
| dossier-t910 | a27d9312782898222 | running |
| dossier-t1112 | ab4ce2b23bf72e1b8 | running |
| dossier-tnew | a65a68d74c2b507f6 | running |
| dossier-tstat | abd532aa5b4761c90 | running |
| dossier-p13 | ab9cf72209d8d10e9 | running |
| dossier-p46 | a3c96c5515be435e8 | running |
| dossier-p79 | ac0cfb51bde1b31fc | running |
| dossier-p1012 | ab979bd1ec0a3f0cd | running |
| dossier-j | a115245babdeff45f | running |
| ui-week (new: week page Visual · Text · By topic) | a6d60dba12a4eeb3a | running |
| ui-nav | aa5f56eada568f1f1 | running |
| ui-lib | af616b2eb4dd18d6c | running |
| ui-exam | a535a0fc6ad0e53e3 | running |
| ui-plan | a3a41c2aef4111626 | running |
| feat-torts | afc60d4cbfab2c4ac | running |
| feat-pil | a7ac8c841587d5cb6 | running |
| feat-essay | a536c871acac7a022 | running |
Integrator (done this session): Motor Accidents Act 1988 filed in raw/laws2400-torts/unit-wide and s 76 authority given its
verbatim text; background clips and Film A encoded (public/bg, public/intro) and wired; home-on-load + Settings → Start;
cursor above every overlay and the system cursor inside top-layer dialogs; drawer in the site's reading face; Layout `centre`.
Next: ui-lab, ui-practice when a UI slot frees; verify-* per unit after its dossiers land.
