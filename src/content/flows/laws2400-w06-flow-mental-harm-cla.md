---
source-hash: 72052d1a3c97ca34
generator-version: aids-1
generated-at: "2026-10-16T16:09:53.447Z"
locked: false
unit: laws2400
week: laws2400-w06
title: Can the plaintiff recover for mental harm under the CLA?
summary: "Walks CLA Part 3 in the order Wicks requires: classify the harm, s 32 duty, s 31 recognised illness, then the s 30 limits for pure shock claims."
start: m1
concepts:
  - laws2400-w06-psychiatric-harm-civil-liability-act
  - laws2400-w06-psychiatric-harm-common-law-development
sources:
  - Topic 6 Lecture 2 (slides 19–27)
  - Civil Liability Act 2002 (NSW) ss 27, 30–33
  - Casebook, Topic 6 — Wicks v SRA (NSW)
nodes:
  - id: m1
    kind: ask
    text: Is the mental harm pure, or a consequence of another personal injury to the plaintiff?
    note: "Section 27: mental harm is impairment of a person's mental condition; consequential mental harm follows a personal injury of any other kind; pure mental harm is everything else."
    authorities:
      - civil-liability-act-2002-nsw-s27
    branches:
      - label: Pure mental harm
        to: m2
      - label: Consequential mental harm
        to: m2c
  - id: m2
    kind: ask
    text: "Section 32: ought the defendant to have foreseen that a person of normal fortitude might suffer a recognised psychiatric illness?"
    note: Weigh sudden shock, witnessing at the scene, the relationship to the victim, and any pre-existing relationship with the defendant. None is a necessary condition (Wicks).
    cases:
      - wicks-v-state-rail-authority-nsw
      - tame-v-new-south-wales
    authorities:
      - civil-liability-act-2002-nsw-s32
    branches:
      - label: "Yes"
        to: m3
      - label: "No"
        to: e-noduty
  - id: m2c
    kind: ask
    text: "Section 32: ought the defendant to have foreseen that a person of normal fortitude might suffer a recognised psychiatric illness?"
    note: For consequential mental harm, the circumstances include the plaintiff's personal injury (s 32(3)).
    authorities:
      - civil-liability-act-2002-nsw-s32
    branches:
      - label: "Yes"
        to: e-consequential
      - label: "No"
        to: e-noduty
  - id: m3
    kind: ask
    text: "Section 31: does the harm consist of a recognised psychiatric illness?"
    authorities:
      - civil-liability-act-2002-nsw-s31
    branches:
      - label: "Yes"
        to: m4
      - label: "No"
        to: e-noillness
  - id: m4
    kind: ask
    text: Did the harm arise from shock connected with another person (the victim) being killed, injured or put in peril?
    note: Section 30(1). If not, the s 30 limits do not apply.
    authorities:
      - civil-liability-act-2002-nsw-s30
    branches:
      - label: "Yes"
        to: m5
      - label: "No"
        to: e-met
  - id: m5
    kind: ask
    text: Did the plaintiff witness, at the scene, the victim being killed, injured or put in peril, or are they a close member of the victim's family?
    note: "Wicks: peril need not begin and end in an instant; rescue survivors stayed in peril. Close family (s 30(5)): parent, spouse or partner, child or stepchild, sibling or step-sibling."
    exception: true
    cases:
      - wicks-v-state-rail-authority-nsw
    authorities:
      - civil-liability-act-2002-nsw-s30
    branches:
      - label: Witnessed at the scene
        to: e-met
      - label: Close family member
        to: e-met
      - label: Neither
        to: e-s30
  - id: e-met
    kind: end
    tone: met
    text: "Part 3 does not bar the claim: move to breach and causation."
  - id: e-consequential
    kind: end
    tone: qualified
    text: Duty owed; damages for economic loss need a recognised psychiatric illness (s 33).
  - id: e-noduty
    kind: end
    tone: not-met
    text: No duty of care to avoid mental harm (s 32).
  - id: e-noillness
    kind: end
    tone: not-met
    text: "No damages: not a recognised psychiatric illness (s 31)."
  - id: e-s30
    kind: end
    tone: not-met
    text: No damages for pure mental harm from shock (s 30(2)).
verify: false
---
