---
source-hash: f485344b8b6ef646
generator-version: aids-1
generated-at: "2026-10-16T22:37:55.886Z"
locked: false
unit: laws2000
week: laws2000-w08
title: Will the ICJ indicate provisional measures?
summary: Runs a request through the four conditions on the slides — prima facie jurisdiction, plausible rights, link, urgency — and ends with their binding force under LaGrand.
start: p1
concepts:
  - laws2000-w08-provisional-measures
sources:
  - Week 08 - Lecture Slides - International Dispute Settlement (slides 33–34)
  - Week 08 - Tutorial Tasks - International Dispute Settlement (questions 1(b), 2(b))
nodes:
  - id: p1
    kind: ask
    text: Is the absence of jurisdiction manifest?
    note: The Court need not finally decide jurisdiction now — e.g. a treaty clause such as art IX of the Genocide Convention is enough at this stage.
    authorities:
      - icj-statute-art-41
    branches:
      - label: "No"
        to: p2
      - label: "Yes"
        to: e-no
  - id: p2
    kind: ask
    text: Are the rights for which protection is sought at least plausible?
    branches:
      - label: "Yes"
        to: p3
      - label: "No"
        to: e-no
  - id: p3
    kind: ask
    text: Are the measures requested linked to those rights — appropriate and necessary to protect them?
    branches:
      - label: "Yes"
        to: p4
      - label: "No"
        to: e-reframe
  - id: p4
    kind: ask
    text: Is there a real and imminent risk that irreparable harm will occur before the final decision?
    note: Ordinary loss that a later judgment could repair is not enough.
    branches:
      - label: "Yes"
        to: p5
      - label: "No"
        to: e-no
  - id: p5
    kind: step
    text: The Court may indicate measures to preserve the respective rights of either party (art 41).
    authorities:
      - icj-statute-art-41
    next: e-binding
  - id: e-binding
    kind: end
    tone: met
    text: Measures indicated — and binding on the parties (LaGrand, 2001, para 102).
    cases:
      - lagrand-case-germany-v-united-states-of-america
  - id: e-reframe
    kind: end
    tone: not-met
    text: "Not these measures: only measures linked to the rights claimed can be indicated."
  - id: e-no
    kind: end
    tone: not-met
    text: No provisional measures.
verify: false
---
