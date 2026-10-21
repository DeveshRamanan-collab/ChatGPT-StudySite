---
source-hash: 969ee0b92be3635f
generator-version: aids-1
generated-at: "2026-10-16T22:38:25.958Z"
locked: false
unit: mgmt2094
week: mgmt2094-w07
title: Creativity, invention or innovation? (the Week 7 charts)
summary: Places a scenario in one column of the two Week 7 charts, and names the economic value when it is innovation.
start: n1
concepts:
  - mgmt2094-w07-invention-vs-innovation-economic-value
  - mgmt2094-w07-creativity-precedes-innovation
sources:
  - Marketing - Week 07 - Tutorial Materials - Invention, Innovation, Creativity (slide 2–3, chart image)
  - Marketing - Week 08 - Lecture Materials - Innovation (slides 3, 10)
nodes:
  - id: n1
    kind: ask
    text: What is there so far?
    note: "The charts use different words. Creativity: the use of imagination or original ideas. Invention: a novel product, device, process, or concept. Innovation: an introduction."
    branches:
      - label: Original ideas being imagined
        to: n2
      - label: A novel product, device, process or concept, not yet offered to anyone
        to: n3
      - label: Something introduced to customers or users
        to: n4
  - id: n2
    kind: end
    tone: qualified
    text: "Creativity: it precedes innovation."
    note: "Related to imagination; cannot be measured. Example: hotel staff imagining ideas for a new guest service."
    concept: mgmt2094-w07-creativity-precedes-innovation
  - id: n3
    kind: end
    tone: qualified
    text: "Invention: not yet innovation."
    note: "Requires knowledge, competence, and financial aid. Examples: the printing press, electricity, the telephone. Week 8: it may not be commercialised and is usually restricted to the R&D centre."
    concept: mgmt2094-w07-invention-vs-innovation-economic-value
    authorities:
      - mgmt2094-example-printing-press-electricity-telephone
  - id: n4
    kind: ask
    text: Is it a newer, better (new or improved) solution that meets new requirements or existing market needs?
    branches:
      - label: "Yes"
        to: n6
      - label: No, it meets no requirement or need
        to: n5
  - id: n5
    kind: end
    tone: not-met
    text: "Not innovation on the chart: the introduction must meet requirements or market needs."
    note: "Week 8: if you cannot commercialise it, it is not innovation."
  - id: n6
    kind: step
    text: "Name the economic value: the need it meets, and the knowledge of market needs and trends behind it."
    note: Slide 2's cue. Week 8 adds that innovation results in commercialisation, has an economic motive, and brings organisational change.
    next: n7
  - id: n7
    kind: end
    tone: met
    text: "Innovation: it follows creativity and succeeds invention."
    note: "Related to implementation; can be measured. Examples: the introduction of the iPhone, the tablet, the flat-screen TV."
    authorities:
      - mgmt2094-example-iphone-tablet-flat-screen-tv
verify: false
---
