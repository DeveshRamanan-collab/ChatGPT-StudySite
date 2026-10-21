---
source-hash: c1ab4baa6ee74a49
generator-version: aids-1
generated-at: "2026-10-16T22:38:30.972Z"
locked: false
unit: mgmt2094
week: mgmt2094-w08
title: Is it really disruptive innovation?
summary: "Walks the class activity's five questions on Christensen's definition to a defended verdict: disruptive, potentially disruptive, or not disruptive."
start: n1
concepts:
  - mgmt2094-w08-disruptive-innovation
  - mgmt2094-w08-innovation-map
sources:
  - Marketing - Week 08 - Class Activity (JE) - Is It Really Disruptive Innovation
  - Marketing - Week 08 - Lecture Materials - Innovation (slides 9)
nodes:
  - id: n1
    kind: step
    text: "Incumbent: name the established company, industry or business model potentially being disrupted."
    note: "Not every successful or radical innovation is disruptive. The Spotify row shows why this comes first: where did the disruption actually occur, CDs or downloads?"
    authorities:
      - mgmt2094-class-activity-is-it-really-disruptive
    next: n2
  - id: n2
    kind: ask
    text: "Initial customer: did it first appeal to underserved or overlooked customers, the low end, or non-consumers?"
    note: "Non-consumers can form a new market: the Canva row asks whether it created a new market of non-designers."
    branches:
      - label: "Yes"
        to: n3
      - label: No, it targeted the incumbents' best customers
        to: n8
  - id: n3
    kind: ask
    text: "Value proposition: was it cheaper, simpler, more convenient or more accessible?"
    branches:
      - label: "Yes"
        to: n4
      - label: No, it was premium and pricier
        to: n8
  - id: n4
    kind: ask
    text: "Market movement: did it start outside the mainstream and then move toward mainstream customers?"
    branches:
      - label: Yes, and incumbents are losing customers
        to: n5
      - label: "Not yet: it is still in its niche"
        to: n7
  - id: n5
    kind: step
    text: "Place it on the innovation map: strategic innovation, external and discontinuous."
    note: The map puts disruptive innovation with new markets, new offerings, channels and Blue Ocean Strategy.
    concept: mgmt2094-w08-innovation-map
    next: n6
  - id: n6
    kind: end
    tone: met
    text: "Verdict: disruptive innovation. Defend it with your four answers."
  - id: n7
    kind: end
    tone: qualified
    text: "Verdict: potentially disruptive. Say what movement toward the mainstream would settle it."
    note: "The ChatGPT row: could generative AI become disruptive, and to whom?"
  - id: n8
    kind: end
    tone: not-met
    text: "Verdict: not disruptive on Christensen's definition, though it may still be a successful or radical innovation."
    note: "The Airbnb row: disruptive innovation, or simply a new platform business model?"
verify: false
---
