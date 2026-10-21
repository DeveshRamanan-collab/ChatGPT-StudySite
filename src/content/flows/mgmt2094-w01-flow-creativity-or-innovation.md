---
source-hash: f73fd6f9cfbc1002
generator-version: aids-1
generated-at: "2026-10-16T15:54:30.564Z"
locked: false
unit: mgmt2094
week: mgmt2094-w01
title: Creativity, innovation or neither? (Levitt's test)
summary: Classifies an example by asking whether something new was thought up and whether it was actually done.
start: n1
concepts:
  - mgmt2094-w01-creativity-and-innovation
  - mgmt2094-w01-defining-creativity
sources:
  - Marketing - Week 01 - Introduction Lecture Slides (MGMT2094) (slides 12–13, 17)
  - Marketing - Week 01 - Lecture Transcript - Introduction and Overview
  - Marketing - Week 01 - Reading - Empire of Tech (Lev-Ram 2015) (pp 2, 8)
nodes:
  - id: n1
    kind: ask
    text: "Is anything new involved: a new thought, idea, method or product?"
    note: Creative thinking is the ability to think, imagine or invent something new (slide 12). The lecture counts even small things, such as a new route to campus.
    concept: mgmt2094-w01-defining-creativity
    branches:
      - label: "Yes"
        to: n3
      - label: No, the same as before
        to: n2
  - id: n2
    kind: end
    tone: not-met
    text: "Neither creativity nor innovation: it is repeating the same patterns."
    note: "Slide 13: without creativity we would have no progress and would be forever repeating the same experiences/patterns. Doing the usual thing efficiently is still not innovation."
  - id: n3
    kind: step
    text: "Creativity is present: a new thing has been thought up."
    note: "Levitt (slide 17): 'Creativity is thinking up new things.'"
    concept: mgmt2094-w01-creativity-and-innovation
    next: n4
  - id: n4
    kind: ask
    text: "Has the new thing actually been done: implemented, rolled out or used, not just designed or tested?"
    branches:
      - label: Yes, it is done
        to: n6
      - label: No, only thought up or tested
        to: n5
  - id: n5
    kind: end
    tone: qualified
    text: Creativity, not yet innovation.
    note: Imagineering's Dish is tested in the lab, but its technology is still too expensive and cumbersome to work in a park (Lev-Ram 2015).
    authorities:
      - mgmt2094-example-disney-imagineering
  - id: n6
    kind: step
    text: Say what value it brings.
    note: The lecture asks whether creative thinking can be leveraged into something practical and useful that brings value. Dropshipping 'brings value'; MagicBand users spend more on average.
    next: n7
  - id: n7
    kind: end
    tone: met
    text: "Innovation: a new thing actually done."
    note: "Levitt (slide 17): 'Innovation is doing new things.' Examples: MagicBands rolled out at Disney World; dropshipping, a simple idea someone was able to implement."
    authorities:
      - mgmt2094-example-disney-magicbands
      - mgmt2094-example-dropshipping
verify: false
---
