---
source-hash: b1bfd73fd09a4389
generator-version: aids-1
generated-at: "2026-10-16T22:38:35.427Z"
locked: false
unit: mgmt2094
week: mgmt2094-w09
title: Which Six Sigma method, and where are we in DMEDI?
summary: Chooses between DMAIC and DFSS, then walks a new product through the five DMEDI steps to the scale-up decision.
start: n1
concepts:
  - mgmt2094-w09-six-sigma-methods
  - mgmt2094-w09-dmedi-design-process
sources:
  - Marketing - Week 09 - Lecture Materials - Product Development, A Case Study at Dow Corning (slides 11–12)
  - Marketing - Week 10 - Lecture Transcript - Product Development, Dow Corning Case (Guest Lecture, Viken Kortian) (recording of the Week 9 guest lecture)
nodes:
  - id: n1
    kind: ask
    text: Is the aim to improve a process that already exists, or to create a new process, product, service or plant?
    note: "Slide 11: DMAIC improves existing process performance; DFSS generates new processes, products, services and/or plants. Leaders drive and align both."
    concept: mgmt2094-w09-six-sigma-methods
    branches:
      - label: Improve an existing process
        to: n2
      - label: Create something new
        to: n3
  - id: n2
    kind: end
    tone: qualified
    text: Use DMAIC, the Improvement Process, then Process Management to sustain the gains.
  - id: n3
    kind: step
    text: "Define: develop a charter, a multi-generational product/service plan and a project plan."
    note: "Running alongside every step: change management, customer alignment, strategy alignment, project management, project case development and process management."
    concept: mgmt2094-w09-dmedi-design-process
    authorities:
      - mgmt2094-example-dow-corning
    next: n4
  - id: n4
    kind: step
    text: "Measure: research customers, capture the voice of the customer and translate needs into CCRs with QFD."
    note: "Also benchmark competitor performance and set target sigma. ArmorAll's requirement: meet or exceed Thompson's WaterSeal on waterproofing, at the right price."
    authorities:
      - mgmt2094-example-armorall-deck-protector
    next: n5
  - id: n5
    kind: step
    text: "Explore: translate CCRs into functions, generate alternative concepts with creative techniques, and select the best fit."
    note: Tools include creativity tools and a Pugh matrix. Assess the risk of the high-level design.
    next: n6
  - id: n6
    kind: step
    text: "Develop: detailed designs, capability assessments, FMEA, design of experiments, process control and pilot plans."
    note: The Deck Protector's six-factor, two-level design of experiment on silane, wax and surfactant belongs here.
    next: n7
  - id: n7
    kind: step
    text: "Implement: execute the pilot and validation plans, and analyse the results."
    next: n8
  - id: n8
    kind: ask
    text: Do the pilot and validation results confirm the design?
    branches:
      - label: "Yes"
        to: n9
      - label: "No"
        to: n10
  - id: n9
    kind: end
    tone: met
    text: "Scale up: transition to process owners, document lessons learned, reward and recognise."
    note: "Business risk management continues: the Deck Protector stopped after 12 months because of its customer's lost court case."
  - id: n10
    kind: end
    tone: qualified
    text: Revise the design (gap analysis and redesign) before any scale-up decision.
    exception: true
verify: false
---
