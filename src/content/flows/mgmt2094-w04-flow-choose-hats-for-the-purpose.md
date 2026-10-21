---
source-hash: 28719ba608dc7489
generator-version: aids-1
generated-at: "2026-10-16T22:01:03.501Z"
locked: false
unit: mgmt2094
week: mgmt2094-w04
title: Which hats, in which order, for this purpose?
summary: Runs a six hats session from the blue-hat opening, through the single hat or slide sequence that fits what the group needs, to the blue-hat close.
start: n1
concepts:
  - mgmt2094-w04-hat-sequences
  - mgmt2094-w04-running-a-hats-session
  - mgmt2094-w04-six-thinking-hats
sources:
  - Marketing - Week 04 - Lecture Materials - The Six Thinking Hats of Edward de Bono (slides 30–34)
  - Marketing - Week 04 - Lecture Transcript - Six Thinking Hats
  - Marketing - Week 04 - Reading - Using De Bono's Six Thinking Hats in Critical Thinking and Problem Solving (Kivunja 2015, p 389)
nodes:
  - id: n1
    kind: step
    text: "Open in the blue hat: what is our focus, and what thinking is needed?"
    note: The facilitator wears blue throughout; it need not be the team’s manager (lecturer).
    concept: mgmt2094-w04-running-a-hats-session
    next: n2
  - id: n2
    kind: ask
    text: What does the group need from this round of thinking?
    branches:
      - label: Just one kind of thinking
        to: n3
      - label: Weigh an idea's pluses and minuses
        to: n4
      - label: Fix a design that has faults
        to: n5
      - label: New ideas, products or design improvements
        to: n6
      - label: Check feelings against the facts
        to: n7
      - label: New ideas from what we already know
        to: n8
      - label: Move from the facts to a plan
        to: n9
  - id: n3
    kind: step
    text: Use that single hat.
    note: "The slides: the hats can be used singly at any point in thinking, and in general this is the major use."
    concept: mgmt2094-w04-six-thinking-hats
    next: n10
  - id: n4
    kind: step
    text: Yellow, then black; follow with green, then red, if needed.
    note: Benefits before risks. Green then finds ways round the risks; red checks how the group feels about it now.
    next: n10
  - id: n5
    kind: step
    text: Black, then green.
    note: Black finds the design's weaknesses; green generates ways to improve it. The slide's example is an All Weather bike.
    authorities:
      - mgmt2094-example-all-weather-bike
    next: n10
  - id: n6
    kind: step
    text: "Blue, green and red: the design sequence."
    note: Encourages new ideas, products or improvements to existing designs (slide 34).
    next: n10
  - id: n7
    kind: step
    text: "Red, then white: compare opinion with fact."
    note: "The lecturer's example: staff fear air freight because planes crash (red); the data show crashes are very rare (white)."
    next: n10
  - id: n8
    kind: step
    text: "Black, then yellow, then green: compare and synthesise."
    note: Assess the situation critically, find what is still good, then come up with new ideas from the known.
    next: n10
  - id: n9
    kind: step
    text: White, then blue.
    note: What do we know in facts, and where do we plan to go with that information?
    next: n10
  - id: n10
    kind: ask
    text: Did the round give the group what it needed?
    branches:
      - label: "Yes"
        to: n11
      - label: Not yet
        to: n12
  - id: n11
    kind: end
    tone: met
    text: "Close in the blue hat: what we achieved, outcome, conclusion, next steps."
  - id: n12
    kind: end
    tone: qualified
    text: Close in blue for now, and rerun the problem with a different sequence next time.
    note: "The lecturer: sequences are not set in stone; come back next week with a different sequence and see if it works better."
    exception: true
verify: false
---
