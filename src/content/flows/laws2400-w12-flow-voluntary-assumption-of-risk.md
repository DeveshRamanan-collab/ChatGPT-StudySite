---
source-hash: 05a2ab1c9024a0be
generator-version: aids-1
generated-at: "2026-10-16T22:20:27.944Z"
locked: false
unit: laws2400
week: laws2400-w12
title: Does the plaintiff's acceptance of risk, or a joint crime, defeat the claim?
summary: "Follows the textbook flowchart Defences to Negligence 3: illegality, s 5L, intoxicated drivers and passengers, then the common law knowledge-and-acceptance test for volenti."
start: v1
concepts:
  - laws2400-w12-defences-to-negligence-flowchart
  - laws2400-w12-illegality-defence
  - laws2400-w12-volenti-and-legislation
  - laws2400-w12-voluntary-assumption-of-risk
sources:
  - Topic 12 Flowcharts (p 479)
  - Civil Liability Act 2002 (NSW) ss 5F, 5K, 5L
nodes:
  - id: v1
    kind: ask
    text: Were the plaintiff and the defendant involved in a criminal enterprise when the plaintiff was injured?
    concept: laws2400-w12-illegality-defence
    branches:
      - label: "Yes"
        to: v2
      - label: "No"
        to: v3
  - id: v2
    kind: ask
    text: On the facts, can the court determine the relevant standard of care?
    note: Where it is not possible or feasible, illegality is available (Gala v Preston). Where it can be determined, it is not (Progress & Properties Ltd v Craft).
    cases:
      - gala-v-preston
      - progress-and-properties-ltd-v-craft
    branches:
      - label: "No"
        to: e-illegality
      - label: "Yes: illegality is not available"
        to: v3
  - id: v3
    kind: ask
    text: Did the harm result from the materialisation of an obvious risk of a dangerous recreational activity the plaintiff engaged in?
    note: "CLA s 5L expands the defence: it applies whether or not the plaintiff was aware of the risk (s 5L(2)). Dangerous: a significant risk of physical harm (s 5K). Guidance: Tapp (2022)."
    concept: laws2400-w12-volenti-and-legislation
    cases:
      - tapp-v-australian-bushmens-campdraft-and-rodeo-association-ltd
    authorities:
      - civil-liability-act-2002-nsw-s5l
      - civil-liability-act-2002-nsw-s5f
    branches:
      - label: "Yes"
        to: e-5l
      - label: "No"
        to: v4
  - id: v4
    kind: ask
    text: Is the plaintiff a passenger who relied on an intoxicated driver?
    authorities:
      - motor-accidents-act-1988-nsw-s76
    branches:
      - label: "Yes"
        to: e-passenger
      - label: "No"
        to: v5
  - id: v5
    kind: ask
    text: Can the defendant show that the plaintiff perceived the existence of the risk that materialised?
    concept: laws2400-w12-voluntary-assumption-of-risk
    branches:
      - label: "Yes"
        to: v6
      - label: "No"
        to: e-no
  - id: v6
    kind: ask
    text: Did the plaintiff fully appreciate the nature and extent of that specific risk, not just its general nature?
    note: The plaintiff must fully appreciate the nature and likely manifestation of the risk (Banovic v Perkovic; Carey v Lake Macquarie City Council).
    cases:
      - banovic-v-perkovic
      - carey-v-lake-macquarie-city-council
    branches:
      - label: "Yes"
        to: v7
      - label: "No"
        to: e-no
  - id: v7
    kind: ask
    text: Did the plaintiff voluntarily accept that specific risk, including its materialisation?
    note: Effective knowledge extends beyond the mere existence of a risk to an acceptance of materialisation of that risk (Carey; ICI v Shatwell).
    cases:
      - carey-v-lake-macquarie-city-council
      - ici-v-shatwell
    branches:
      - label: "Yes"
        to: e-volenti
      - label: "No"
        to: e-no
  - id: e-illegality
    kind: end
    tone: met
    exception: true
    text: "Illegality defence available: no appropriate standard of care can be determined in the joint criminal enterprise."
  - id: e-5l
    kind: end
    tone: met
    text: "Not liable under CLA s 5L: the obvious risk of a dangerous recreational activity materialised."
  - id: e-passenger
    kind: end
    tone: not-met
    text: "Volenti unlikely: courts are generally reluctant, and legislation such as Motor Accidents Act 1988 (NSW) s 76 excludes it. Consider contributory negligence."
  - id: e-volenti
    kind: end
    tone: met
    text: "Volenti established: a complete defence, and the claim fails."
  - id: e-no
    kind: end
    tone: not-met
    text: Volenti fails. Consider contributory negligence instead.
verify: false
---
