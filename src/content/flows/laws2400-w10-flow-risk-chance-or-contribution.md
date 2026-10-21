---
source-hash: da7eceb72388b108
generator-version: aids-1
generated-at: "2026-10-16T22:01:02.857Z"
locked: false
unit: laws2400
week: laws2400-w10
title: Has the plaintiff proved contribution, or only a lost chance or an increased risk?
summary: "Follows the Lecture 2 slides on loss of a chance and the dust disease cases: a lost chance is not enough, increased risk is not enough, and a more than negligible contribution, proved or inferred, is."
start: r1
concepts:
  - laws2400-w10-risk-chance-and-material-contribution
  - laws2400-w10-multiple-sufficient-causes-and-material-contribution
sources:
  - Topic 10 Lecture 2 (slides 6–13, 15)
  - Topic 10 Lecture 2 Transcript - Causation
nodes:
  - id: r1
    kind: ask
    text: Is the damage claimed the loss of a chance of a better medical outcome?
    note: "In Tabet v Gett the chance of a better outcome was under 50%: possible, not probable."
    cases:
      - tabet-v-gett
    branches:
      - label: "Yes: a less than even chance"
        to: e-chance
      - label: "No: the injury or disease itself"
        to: r2
  - id: r2
    kind: ask
    text: Is the difficulty that science cannot say which exposure caused the disease?
    note: "The unifying feature of the dust disease cases: the plaintiff can show the exposure and the disease, but not that this exposure caused it."
    branches:
      - label: "Yes"
        to: r3
      - label: "No"
        to: e-ordinary
  - id: r3
    kind: step
    text: "Check s 3B(1): dust disease claims are outside the CLA, so the common law cases decide causation."
    note: Which is why Amaca v Booth never mentions the CLA; such claims go under the Dust Diseases Tribunal Act 1989 (NSW).
    authorities:
      - civil-liability-act-2002-nsw-s3b
    next: r4
  - id: r4
    kind: ask
    text: Does the evidence show, or allow the court to infer, that the exposure actually contributed to the disease?
    note: "Booth: effectively the only known cause, long heavy exposure, trivial other exposures, cumulative-mechanism evidence; Bradford Hill criteria. Ellis: limited exposure, mainly epidemiological risk evidence, and a competing cause (smoking)."
    cases:
      - amaca-v-booth
      - amaca-pty-ltd-v-ellis
    branches:
      - label: Yes, as in Amaca v Booth
        to: r5
      - label: Only that it increased the risk
        to: e-risk
  - id: r5
    kind: ask
    text: Was the negligent contribution more than negligible (more than de minimis)?
    note: "Bonnington Castings v Wardlaw: enough that the negligent dust made a more than de minimis contribution; it need not be the sole or main cause."
    cases:
      - bonnington-castings-v-wardlaw
    branches:
      - label: "Yes"
        to: e-contrib
      - label: "No: trivial"
        to: e-trivial
  - id: e-chance
    kind: end
    tone: not-met
    text: No recovery in personal injury for the loss of a chance of a better outcome (Tabet v Gett).
  - id: e-ordinary
    kind: end
    tone: qualified
    text: "Apply the ordinary test: necessary condition (s 5D(1)(a)) or 'but for', on the balance of probabilities."
  - id: e-risk
    kind: end
    tone: not-met
    exception: true
    text: "Causation not proved: increased risk alone is not enough (Amaca v Ellis). Australia has not adopted Fairchild's risk-based exception."
  - id: e-contrib
    kind: end
    tone: met
    text: "Causation established: a material, more than negligible, contribution to the disease (Bonnington; Amaca v Booth)."
  - id: e-trivial
    kind: end
    tone: not-met
    text: "Causation not established: a negligible contribution is not enough."
verify: false
---
