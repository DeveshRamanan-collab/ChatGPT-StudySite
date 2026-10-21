---
source-hash: 47c065cfcccbca0c
generator-version: aids-1
generated-at: "2026-10-16T16:00:01.983Z"
locked: false
unit: laws2400
week: laws2400-w05
title: Is a duty of care owed?
summary: "Follows the lecturer's duty roadmap and the novel-duty flowchart: compensable harm, foreseeability, established category, then salient features and policy."
start: d1
concepts:
  - laws2400-w05-negligence-elements-overview
  - laws2400-w05-reasonable-foreseeability-meaning
  - laws2400-w05-established-categories-of-duty
  - laws2400-w05-novel-duty-and-salient-features
sources:
  - Topic 5 Flowcharts (pp 195, 290)
  - Topic 5 Lecture 2 (slides 10, 19)
nodes:
  - id: d1
    kind: ask
    text: "Step 1: what kind of harm did the plaintiff suffer?"
    note: "Physical injury: a duty will ordinarily be found. Psychiatric injury is compensable within further limits; economic loss only in specific circumstances."
    branches:
      - label: Physical injury or property damage
        to: d2
      - label: Psychiatric injury
        to: e-mental
      - label: Pure economic loss
        to: e-pel
  - id: d2
    kind: ask
    text: "Step 2: was injury to the plaintiff, or a class of persons to which they belonged, reasonably foreseeable?"
    note: The neighbour principle is the starting point. The precise manner of injury need not be foreseeable (Chapman v Hearse).
    concept: laws2400-w05-reasonable-foreseeability-meaning
    cases:
      - donoghue-v-stevenson
      - chapman-v-hearse
      - caterson-v-commissioner-for-railways
    branches:
      - label: "Yes"
        to: d3
      - label: "No"
        to: e-none
  - id: d3
    kind: ask
    text: Was the type of injury the plaintiff suffered also reasonably foreseeable?
    note: A risk that is extremely unlikely may still be foreseeable if it is not far-fetched or fanciful (Wyong Shire Council v Shirt).
    cases:
      - mount-isa-mines-ltd-v-pusey
      - wyong-shire-council-v-shirt
    branches:
      - label: "Yes"
        to: d4
      - label: "No"
        to: e-none
  - id: d4
    kind: ask
    text: Does the relationship fall within an established category?
    note: Manufacturer–consumer, road users, employer–employee, school–pupil, doctor–patient, solicitor–client. Unusual facts can still put duty in issue (Chapman v Hearse).
    concept: laws2400-w05-established-categories-of-duty
    cases:
      - donoghue-v-stevenson
      - grant-v-australian-knitting-mills
    branches:
      - label: "Yes"
        to: e-established
      - label: "No: the case is novel"
        to: d5
  - id: d5
    kind: step
    text: "Step 3: weigh the salient features of the relationship."
    note: Control of the risk, the plaintiff's vulnerability, reliance, assumption of responsibility, proximity, category of relationship, the defendant's knowledge of harm. Non-exhaustive; not all need be met.
    concept: laws2400-w05-novel-duty-and-salient-features
    cases:
      - caltex-refineries-pty-ltd-v-stavar
    next: d6
  - id: d6
    kind: ask
    text: Weighed together, do the salient features support a duty?
    branches:
      - label: "Yes"
        to: d7
      - label: "No"
        to: e-none
  - id: d7
    kind: ask
    text: "Step 4: would reasons of policy negate the duty?"
    note: Indeterminate liability (Ultramares); imposing on autonomy (Tame v NSW); conflict with other duties in law or statute, or threat to the structure of the common law (Sullivan v Moody).
    exception: true
    cases:
      - sullivan-v-moody
      - tame-v-new-south-wales
    branches:
      - label: "No"
        to: e-novel
      - label: "Yes"
        to: e-negated
  - id: e-established
    kind: end
    tone: met
    text: "Duty owed: cite the established category and move to breach."
  - id: e-novel
    kind: end
    tone: met
    text: "Duty owed in a novel case: move to breach."
  - id: e-negated
    kind: end
    tone: not-met
    text: "No duty: policy negates it despite foreseeability."
  - id: e-none
    kind: end
    tone: not-met
    text: No duty of care is owed.
  - id: e-mental
    kind: end
    tone: qualified
    text: Compensable, but apply the further limits for psychiatric injury (Tame v NSW; CLA s 5S) — Topic 6.
  - id: e-pel
    kind: end
    tone: qualified
    text: "Compensable only in specific circumstances: walk the pure economic loss flow."
verify: false
---
