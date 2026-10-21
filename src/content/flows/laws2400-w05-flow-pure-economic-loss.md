---
source-hash: 47c065cfcccbca0c
generator-version: aids-1
generated-at: "2026-10-16T16:00:01.983Z"
locked: false
unit: laws2400
week: laws2400-w05
title: Is a duty owed for pure economic loss from a negligent misstatement?
summary: "Follows the lecturer's pure economic loss flowchart: foreseeability, why it is not enough, the Hedley Byrne factors and vulnerability."
start: p1
concepts:
  - laws2400-w05-duty-of-care-and-pure-economic-loss
sources:
  - Topic 5 Flowcharts (p 291)
  - Topic 5 Lecture 1 (slides 17–20)
nodes:
  - id: p1
    kind: step
    text: Identify the loss as pure economic loss.
    note: Economic loss not consequent upon any physical injury to person or property. CLA s 5 includes economic loss in the definition of "harm".
    authorities:
      - civil-liability-act-2002-nsw-s5
    next: p2
  - id: p2
    kind: ask
    text: Was loss to the plaintiff reasonably foreseeable, not far-fetched or fanciful?
    note: Apply the neighbour principle (Donoghue v Stevenson) and The Wagon Mound (No 2).
    cases:
      - donoghue-v-stevenson
      - overseas-tankship-v-miller-steamship-the-wagon-mound-no-2
    branches:
      - label: "Yes"
        to: p3
      - label: "No"
        to: e-no
  - id: p3
    kind: step
    text: "Foreseeability is necessary but not sufficient: more must be shown."
    note: Perre v Apand. The limits respond to fear of liability in an indeterminate amount (Ultramares) and disproportion between blameworthiness and potential liability (San Sebastian).
    cases:
      - perre-v-apand-pty-ltd
      - san-sebastian-pty-ltd-v-minister
    next: p4
  - id: p4
    kind: ask
    text: "Known reliance: did the speaker know, or ought they to have realised, that the recipient would act on the information?"
    cases:
      - hedley-byrne-v-heller
      - tepko-pty-ltd-v-water-board
    branches:
      - label: "Yes"
        to: p5
      - label: "No"
        to: e-no
  - id: p5
    kind: ask
    text: "Assumption of responsibility: did the speaker take it upon themselves to give the advice, in a matter of business or serious consequence?"
    note: "A matter of business or serious consequence: Chew v Amanatidis. In Hedley Byrne, a reference given \"without responsibility\" defeated the claim."
    cases:
      - hedley-byrne-v-heller
      - tepko-pty-ltd-v-water-board
    branches:
      - label: "Yes"
        to: p6
      - label: Responsibility was disclaimed
        to: e-disclaimed
      - label: "No"
        to: e-no
  - id: p6
    kind: ask
    text: "Reasonable reliance: was it reasonable for the recipient to seek, accept and rely on the statement?"
    note: Consider the subject matter, the occasion of the interchange, the parties' relative knowledge and position, and their capacity to form or exercise judgement.
    cases:
      - shaddock-and-associates-pty-ltd-v-parramatta-city-council
      - mutual-life-and-citizens-assurance-co-v-evatt
    branches:
      - label: "Yes"
        to: p7
      - label: "No"
        to: e-no
  - id: p7
    kind: ask
    text: "Vulnerability: was the plaintiff unable to protect themselves from the defendant's lack of reasonable care?"
    note: Woolcock Street Investments v CDG; established by considering the Hedley Byrne factors above.
    cases:
      - woolcock-street-investments-pty-ltd-v-cdg-pty-ltd
    branches:
      - label: "Yes"
        to: e-duty
      - label: "No"
        to: e-no
  - id: e-duty
    kind: end
    tone: met
    text: "Duty of care owed for the pure economic loss: move to breach."
  - id: e-disclaimed
    kind: end
    tone: not-met
    text: "No duty: responsibility was disclaimed, as in Hedley Byrne."
    exception: true
  - id: e-no
    kind: end
    tone: not-met
    text: No duty of care for the pure economic loss.
verify: false
---
