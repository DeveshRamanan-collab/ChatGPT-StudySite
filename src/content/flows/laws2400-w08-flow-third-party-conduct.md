---
source-hash: 2b196c69ae43c310
generator-version: aids-1
generated-at: "2026-10-16T22:01:02.249Z"
locked: false
unit: laws2400
week: laws2400-w08
title: Does the defendant owe a duty for harm caused by a third party?
summary: Draws the triangle, then asks about control (Dorset Yacht), creation of the risk or a protective relationship (Modbury), and the RTA distinction.
start: t1
concepts:
  - laws2400-w08-third-party-conduct-dorset-yacht-and-modbury
  - laws2400-w08-children-parents-and-the-unborn
sources:
  - Topic 8 Lecture 2 (slides 11, 17–20)
  - Topic 8 Lecture 1 (slides 30–33)
  - Topic 8 Lecture 2 Transcript - Special Parties (Other Categories)
  - Topic 8 Lecture 1 Transcript - Special Parties (Public Authorities)
nodes:
  - id: t1
    kind: ask
    text: Was the plaintiff's harm caused by a third party's conduct, rather than the defendant's own?
    note: "The triangle: the defendant owes the plaintiff a duty, but the third party's conduct causes the loss. Plaintiffs sue the defendant because third parties often cannot pay."
    branches:
      - label: "Yes"
        to: t2
      - label: "No"
        to: e-ordinary
  - id: t2
    kind: ask
    text: Did the defendant have control over the third party?
    note: "Dorset Yacht: officers controlled the detained boys. A parent may owe others a duty to control a child (Smith v Leurs)."
    cases:
      - home-office-v-dorset-yacht-co-ltd
      - smith-v-leurs
    branches:
      - label: "Yes"
        to: t3
      - label: "No"
        to: t4
  - id: t3
    kind: ask
    text: "Was the harm within the duty's scope: in the vicinity, immediately after the third party escaped control?"
    note: "Policy limited Dorset Yacht's duty: none for further damage while the escapees remained at large (indeterminate liability)."
    exception: true
    cases:
      - home-office-v-dorset-yacht-co-ltd
    branches:
      - label: "Yes"
        to: e-dorset
      - label: "No: later, while at large"
        to: e-scope
  - id: t4
    kind: ask
    text: Did the defendant create the risk, or have a protective relationship with the plaintiff?
    note: "Modbury: the centre had not created the risk of criminal attack and had no special relationship with the employee."
    cases:
      - modbury-triangle-shopping-centre-v-anzil
    branches:
      - label: "Yes"
        to: e-relationship
      - label: "No"
        to: t5
  - id: t5
    kind: ask
    text: Could the harm arise other than through crime, with the defendant in a unique role and the plaintiff vulnerable?
    note: "RTA v Refrigerated Roadways: objects can fall from overpasses for many reasons; the RTA had a unique role and knowledge; drivers below were vulnerable."
    cases:
      - rta-v-refrigerated-roadways
      - modbury-triangle-shopping-centre-v-anzil
    branches:
      - label: "Yes"
        to: e-rta
      - label: "No: only through crime"
        to: e-modbury
  - id: e-ordinary
    kind: end
    tone: qualified
    text: "Not a third-party case: use the ordinary duty analysis."
  - id: e-dorset
    kind: end
    tone: met
    text: Duty owed through control, as in Dorset Yacht.
  - id: e-scope
    kind: end
    tone: not-met
    text: Outside the duty's scope, as for later damage in Dorset Yacht.
  - id: e-relationship
    kind: end
    tone: qualified
    text: "A duty is arguable: weigh the relationship and the risk created."
  - id: e-rta
    kind: end
    tone: met
    text: Duty owed, as in RTA v Refrigerated Roadways; breach is a separate question.
  - id: e-modbury
    kind: end
    tone: not-met
    text: No duty to prevent a third party's crime (Modbury).
verify: false
---
