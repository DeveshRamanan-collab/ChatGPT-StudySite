---
source-hash: e701a194aa238c02
generator-version: aids-1
generated-at: "2026-10-17T05:42:56.018Z"
locked: false
unit: mgmt2094
week: mgmt2094-w11
title: "Applying the four actions framework: what happens to each factor?"
summary: Takes an industry's strategy canvas through Kim and Mauborgne's four questions, factor by factor, to a new curve that either stands apart or still ticks the industry's boxes.
start: n1
concepts:
  - mgmt2094-w11-four-actions-framework
  - mgmt2094-w11-value-innovation
sources:
  - Marketing - Week 11 - Lecture Materials - Innovation Models (slides 9–14)
  - Marketing - Week 09 - Lecture Transcript - Types and Models of Innovation, Reflective Writing (first half, the Week 11 material)
nodes:
  - id: n1
    kind: step
    text: "Plot the industry's strategy canvas: the factors it competes on, and each group's level on each factor."
    note: Before Yellow Tail, premium and budget wines competed on price, terminology, marketing, ageing, vineyard, complexity and range, at different levels.
    authorities:
      - mgmt2094-example-yellow-tail
    next: n2
  - id: n2
    kind: step
    text: Reorient your strategic focus from competitors to alternatives, and from customers to non-customers.
    note: "Kim and Mauborgne: you must begin here to fundamentally shift the strategy canvas of an industry."
    concept: mgmt2094-w11-value-innovation
    next: n3
  - id: n3
    kind: ask
    text: Take one factor. Does the industry already compete on it?
    branches:
      - label: Yes, it is on the canvas
        to: n4
      - label: No, the industry has never offered it
        to: n10
  - id: n4
    kind: ask
    text: Is it a factor the industry takes for granted that should be eliminated?
    branches:
      - label: "Yes"
        to: n5
      - label: "No"
        to: n6
  - id: n5
    kind: step
    text: Eliminate it.
    note: Yellow Tail eliminated enological terminology, ageing qualities and above-the-line marketing.
    next: n11
  - id: n6
    kind: ask
    text: Should it be reduced well below the industry's standards?
    branches:
      - label: "Yes"
        to: n7
      - label: "No"
        to: n8
  - id: n7
    kind: step
    text: Reduce it.
    note: Yellow Tail reduced wine complexity, wine range and vineyard prestige.
    next: n11
  - id: n8
    kind: ask
    text: Should it be raised well above the industry's standard?
    branches:
      - label: "Yes"
        to: n9
      - label: "No: leave it as it is"
        to: n11
  - id: n9
    kind: step
    text: Raise it.
    note: Yellow Tail raised its price versus budget wine, and its retail store involvement.
    next: n11
  - id: n10
    kind: step
    text: "Create it: a factor the industry has never offered."
    note: Yellow Tail created easy drinking, ease of selection, and fun and adventure.
    next: n11
  - id: n11
    kind: step
    text: Ask the four questions of every factor, then plot your new curve on the canvas.
    next: n12
  - id: n12
    kind: ask
    text: Does the new curve stand apart from the rivals' curves, focused on a few factors rather than ticking all the boxes?
    note: "Key lessons: focus is more important than ticking all the boxes; challenge existing business models, since the historic norm is not necessarily right."
    branches:
      - label: "Yes"
        to: n13
      - label: "No"
        to: n14
  - id: n13
    kind: end
    tone: met
    text: "The canvas has shifted: like Yellow Tail's, the curve sits apart from both premium and budget rivals."
  - id: n14
    kind: end
    tone: not-met
    text: "Still competing on the industry's terms: revisit the four questions with non-customers in mind."
verify: false
---
