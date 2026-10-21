---
source-hash: 1bae668ec3891ae4
generator-version: aids-1
generated-at: "2026-10-16T22:01:01.637Z"
locked: false
unit: laws2400
week: laws2400-w07
title: Is a duty owed for pure economic loss caused by an act or a defective building?
summary: For an act, walks McHugh J's questions in Perre v Apand in order; for a latent building defect, starts with the NSW statutory duty and falls back on Bryan v Maloney and Woolcock.
start: a1
concepts:
  - laws2400-w07-pel-caused-by-acts-perre-and-caltex
  - laws2400-w07-defective-structures-and-the-dbpa
sources:
  - Topic 7 Lecture 2 (slides 3–17)
  - Topic 7 Lecture 2 Transcript - Pure Economic Loss (Acts and Defective Structures)
nodes:
  - id: a1
    kind: ask
    text: What caused the pure economic loss?
    note: Subcategories only help find the closest precedent; the salient features approach is the same throughout.
    branches:
      - label: An act, such as a sale or damage
        to: a2
      - label: A latent defect in a building
        to: b1
  - id: a2
    kind: ask
    text: Was the loss to the plaintiff, or members of its group, reasonably foreseeable?
    note: McHugh J's first question in Perre v Apand. Compare the closest precedent, such as Perre or Caltex Oil.
    concept: laws2400-w07-pel-caused-by-acts-perre-and-caltex
    cases:
      - perre-v-apand-pty-ltd
      - caltex-oil-v-dredge-willemstad
    branches:
      - label: "Yes"
        to: a3
      - label: "No"
        to: e-act-no
  - id: a3
    kind: ask
    text: Would a duty impose indeterminate liability on the defendant?
    note: In Perre, the 20 km rule defined the class of affected growers, so liability was not indeterminate.
    cases:
      - perre-v-apand-pty-ltd
    branches:
      - label: "No: the class is defined"
        to: a4
      - label: "Yes"
        to: e-act-no
  - id: a4
    kind: ask
    text: Would a duty impose an unreasonable burden on the defendant's autonomy?
    cases:
      - perre-v-apand-pty-ltd
    branches:
      - label: "No"
        to: a5
      - label: "Yes"
        to: e-act-no
  - id: a5
    kind: ask
    text: Was the plaintiff vulnerable, and did the defendant know its conduct could harm people such as the plaintiff?
    note: The Perres had no control over the seed their neighbours planted; Apand, in the potato industry, knew of the disease risk.
    cases:
      - perre-v-apand-pty-ltd
    branches:
      - label: "Yes"
        to: e-act-duty
      - label: "No"
        to: e-act-no
  - id: b1
    kind: ask
    text: In NSW, did the defendant carry out construction work on the building?
    note: "Section 36: building work, preparing designs, supplying building products, supervision, coordination or project management."
    concept: laws2400-w07-defective-structures-and-the-dbpa
    authorities:
      - design-and-building-practitioners-act-2020-nsw-s36
    branches:
      - label: "Yes"
        to: e-dbpa
      - label: No, or outside the Act
        to: b2
  - id: b2
    kind: ask
    text: At common law, was the plaintiff a vulnerable purchaser, such as a homeowner, rather than a commercial party able to protect itself?
    note: "Bryan v Maloney (house, third owner): duty. Woolcock (commercial building): no reliance or assumption of responsibility, not vulnerable, so no duty."
    exception: true
    cases:
      - bryan-v-maloney
      - woolcock-street-investments-pty-ltd-v-cdg-pty-ltd
    branches:
      - label: "Yes: vulnerable"
        to: e-bryan
      - label: "No: a commercial party"
        to: e-woolcock
  - id: e-act-no
    kind: end
    tone: not-met
    text: "The salient features point against a duty: no duty for this loss."
  - id: e-act-duty
    kind: end
    tone: met
    text: "A duty to avoid pure economic loss is owed, as in Perre v Apand: move to breach."
  - id: e-dbpa
    kind: end
    tone: met
    text: Statutory duty owed to each owner and subsequent owner (s 37); non-delegable and cannot be contracted out.
  - id: e-bryan
    kind: end
    tone: qualified
    text: A duty is arguable, as in Bryan v Maloney.
  - id: e-woolcock
    kind: end
    tone: not-met
    text: No duty likely, as in Woolcock.
verify: false
---
