---
source-hash: 6d093c5ebf062104
generator-version: aids-1
generated-at: "2026-10-16T22:38:17.714Z"
locked: false
unit: laws2000
week: laws2000-w12
title: Is this restriction of a human right lawful?
summary: Separates a derogation in a public emergency (ICCPR art 4, ACHR art 27) from a limitation in normal times, then tests each against its conditions.
start: d1
concepts:
  - laws2000-w12-derogations-and-limitations
sources:
  - Week 12 - Lecture Slides - International Human Rights Law (slides 19–21)
nodes:
  - id: d1
    kind: ask
    text: Is the state derogating in a public emergency, or limiting the right in normal times?
    branches:
      - label: Derogating in an emergency
        to: d2
      - label: Limiting it in normal times
        to: l1
  - id: d2
    kind: ask
    text: Is there a public emergency threatening the life of the nation, officially proclaimed?
    note: "ICCPR art 4(1). ACHR art 27(1): war, public danger or other emergency threatening the state's independence or security."
    authorities:
      - iccpr-art-4
      - achr-art-27
    branches:
      - label: "Yes"
        to: d3
      - label: No — test it as an ordinary limitation
        to: l1
  - id: d3
    kind: ask
    text: Is the right absolute or non-derogable?
    note: "ICCPR art 4(2): arts 6, 7, 8(1)–(2), 11, 15, 16 and 18. ACHR art 27(2): e.g. life, humane treatment, freedom from slavery, conscience and religion."
    authorities:
      - iccpr-art-4
    branches:
      - label: "Yes"
        to: e-nonderog
      - label: "No"
        to: d4
  - id: d4
    kind: ask
    text: Are the measures strictly required — necessary and proportionate in nature, duration and impact?
    note: "Aksoy v Turkey (para 78): fourteen days' detention without judicial intervention was \"exceptionally long\" and not necessary."
    cases:
      - aksoy-v-turkey
    branches:
      - label: "Yes"
        to: d5
      - label: "No"
        to: e-derog-fail
  - id: d5
    kind: ask
    text: Are they consistent with the state's other international obligations (especially jus cogens), non-discriminatory, and notified?
    note: No discrimination solely on race, colour, sex, language, religion or social origin (art 4(1)).
    authorities:
      - vclt-art-53
    branches:
      - label: "Yes"
        to: e-derog-ok
      - label: "No"
        to: e-derog-fail
  - id: l1
    kind: ask
    text: Is the restriction provided by law?
    branches:
      - label: "Yes"
        to: l2
      - label: "No"
        to: e-lim-fail
  - id: l2
    kind: ask
    text: Does it serve a legitimate aim described in the limitation clause — e.g. protecting the rights and freedoms of others?
    branches:
      - label: "Yes"
        to: l3
      - label: "No"
        to: e-lim-fail
  - id: l3
    kind: ask
    text: Is it necessary in a democratic society — responding to a public need and proportionate?
    branches:
      - label: "Yes"
        to: e-lim-ok
      - label: "No"
        to: e-lim-fail
  - id: e-nonderog
    kind: end
    tone: not-met
    text: "Unlawful: no derogation is permitted from absolute or non-derogable rights, whatever the emergency."
  - id: e-derog-fail
    kind: end
    tone: not-met
    text: "Unlawful derogation: a requirement of art 4 is not met."
  - id: e-derog-ok
    kind: end
    tone: met
    text: A valid derogation — for as long, and as far, as the emergency strictly requires.
  - id: e-lim-fail
    kind: end
    tone: not-met
    text: "Unlawful restriction: a condition for limiting the right in normal times is not met."
  - id: e-lim-ok
    kind: end
    tone: met
    text: A lawful limitation of the right.
verify: false
---
