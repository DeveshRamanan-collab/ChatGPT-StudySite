---
source-hash: a3a9f429578f800b
generator-version: aids-1
generated-at: "2026-10-16T22:13:52.063Z"
locked: false
unit: mgmt2094
week: mgmt2094-w06
title: Should this go in my reflective paper, and how?
summary: Takes one personal detail through the slides’ disclosure tests, then the tone, evidence and analysis checks, to decide whether and how to include it.
start: n1
concepts:
  - mgmt2094-w06-revealing-information-wisely
  - mgmt2094-w06-writing-a-reflective-paper
  - mgmt2094-w06-describe-analyse-reflect
sources:
  - Marketing - Week 06 - Lecture Materials - Reflective Writing (file labelled Week 7 on iLearn) (slides 5–8)
  - Marketing - Week 09 - Lecture Transcript - Types and Models of Innovation, Reflective Writing (reflective-writing segment, reused recording)
nodes:
  - id: n1
    kind: ask
    text: Is it appropriate to include?
    note: Instead of revealing everything about yourself, carefully ask yourself this before including anything.
    concept: mgmt2094-w06-revealing-information-wisely
    branches:
      - label: "Yes"
        to: n2
      - label: "No"
        to: n3
  - id: n2
    kind: ask
    text: Do you feel uncomfortable about including it?
    branches:
      - label: "No"
        to: n6
      - label: "Yes"
        to: n4
  - id: n3
    kind: end
    tone: not-met
    text: Leave it out.
  - id: n4
    kind: ask
    text: Did it change the final outcome of your experience?
    branches:
      - label: "Yes"
        to: n5
      - label: "No"
        to: n12
  - id: n5
    kind: step
    text: Include it, and indicate in your writing the concerns you have about revealing it.
    exception: true
    next: n6
  - id: n6
    kind: ask
    text: Does it involve someone who made things difficult for you?
    branches:
      - label: "Yes"
        to: n7
      - label: "No"
        to: n8
  - id: n7
    kind: step
    text: Describe their influence with detachment; don't drag them down.
    note: "The lecturer: avoid badmouthing or accusing other people."
    next: n8
  - id: n8
    kind: step
    text: Support the feeling with specific evidence, in a professional, academic tone.
    note: No slang or jargon, focused sentences, paragraphs; it is not a diary entry. Feelings should not come 'out of the blue'.
    concept: mgmt2094-w06-writing-a-reflective-paper
    next: n9
  - id: n9
    kind: ask
    text: "Does it go beyond describing: what you learnt, or would do differently?"
    branches:
      - label: "Yes"
        to: n11
      - label: No, it only tells what happened
        to: n10
  - id: n10
    kind: step
    text: "Add the analysis: answer one of the 'questions to ask myself'."
    note: What have I learnt? What do I now know? What insights have I gained? How well did we handle the challenges? What would I do differently? 'Do not just describe; you must analyse and reflect.'
    concept: mgmt2094-w06-describe-analyse-reflect
    next: n11
  - id: n11
    kind: end
    tone: met
    text: Include it, linked to your conclusion with a transitional phrase and to theory where you can.
  - id: n12
    kind: end
    tone: not-met
    text: Leave it out; the lecturer says it's fine not to share an uncomfortable personal feeling.
verify: false
---
