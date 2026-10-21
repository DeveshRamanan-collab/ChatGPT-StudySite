---
source-hash: f1e02e5b45c9dfb5
generator-version: aids-1
generated-at: "2026-10-16T22:00:44.197Z"
locked: false
unit: laws2000
week: laws2000-w04
title: Is this entity a state?
summary: Runs an entity through the four Montevideo criteria, the presumption of continuity, the illegality bar and the two theories of recognition.
start: s1
concepts:
  - laws2000-w04-montevideo-criteria-for-statehood
  - laws2000-w04-recognition-of-states
sources:
  - Week 04 - Lecture Slides - Subjects of International Law and Statehood (slides 19–30)
  - Week 04 - Lecture Recording (Live) - Subjects of International Law and Statehood - Full Transcript (29:00–48:00)
  - Week 04 - Tutorial Task - Subjects of International Law and Statehood (Q2–Q3)
nodes:
  - id: s1
    kind: ask
    text: Does a permanent population live in the territory?
    note: "No minimum number (Nauru about 12,000) and no nationality requirement: a core population living there permanently is enough."
    authorities:
      - montevideo-convention-1933-art-1
    branches:
      - label: "Yes"
        to: s2
      - label: "No"
        to: e1
  - id: s2
    kind: ask
    text: Is there a defined territory?
    note: "Any size (the Vatican is about 0.5 sq km). Borders need not be fully delimited: \"no rule that the land frontiers of a State must be fully delimited\" (North Sea Continental Shelf [46])."
    cases:
      - north-sea-continental-shelf-cases
    branches:
      - label: "Yes"
        to: s3
      - label: "No"
        to: e1
  - id: s3
    kind: ask
    text: Is there an effective government?
    note: A coherent, effective exercise of public power over territory and population, to the exclusion of others; any form of government. The "most tricky" criterion.
    branches:
      - label: "Yes"
        to: s4
      - label: No — but it is an established state
        to: e2
      - label: No — it is a new entity
        to: e1
  - id: s4
    kind: ask
    text: Can it enter into relations with other states on its own?
    note: Capacity arises from independence. Scotland and Greenland have population, territory and government, but not this.
    branches:
      - label: "Yes"
        to: s5
      - label: "No"
        to: e1
  - id: s5
    kind: ask
    text: Were the criteria achieved lawfully?
    note: Non-recognition may prevent statehood where the criteria were achieved by "the unlawful use of force or other egregious violations" of general international law, especially jus cogens (Kosovo Advisory Opinion; Friendly Relations Declaration).
    cases:
      - declaration-of-independence-in-respect-of-kosovo
    authorities:
      - friendly-relations-declaration-1970
    branches:
      - label: "Yes"
        to: s6
      - label: No — by unlawful force or egregious violations
        to: e3
  - id: s6
    kind: step
    text: "Consider recognition: state both theories, noting that the declaratory theory is the most widely held today."
    concept: laws2000-w04-recognition-of-states
    next: s7
  - id: s7
    kind: ask
    text: Which theory of recognition are you applying?
    branches:
      - label: Declaratory (prevailing)
        to: e4
      - label: Constitutive
        to: s8
  - id: s8
    kind: ask
    text: Have other states recognised it, individually or collectively?
    note: "Collective recognition: UN admission needs a Security Council recommendation (vetoable) and two-thirds of the General Assembly. No diplomatic relations does not mean no recognition."
    authorities:
      - un-charter-art-4
    branches:
      - label: "Yes"
        to: e5
      - label: "No"
        to: e6
  - id: e1
    kind: end
    tone: not-met
    text: "Not a state: a Montevideo criterion is missing."
    authorities:
      - montevideo-convention-1933-art-1
  - id: e2
    kind: end
    tone: met
    exception: true
    text: "Still a state: the presumption of continuity means ineffective government does not end established statehood (Somalia, Syria, Yemen)."
  - id: e3
    kind: end
    tone: not-met
    exception: true
    text: "Not recognised as a state: illegality blocks statehood through non-recognition (TRNC — Security Council resolutions 541 and 550)."
    authorities:
      - unsc-resolutions-541-and-550
  - id: e4
    kind: end
    tone: met
    text: "A state. Recognition only acknowledges it: symbolic, though it signals that the criteria and legitimacy are met."
  - id: e5
    kind: end
    tone: met
    text: "A state on the constitutive theory too: recognition has constituted it."
  - id: e6
    kind: end
    tone: qualified
    text: Not a state on the constitutive theory ("no recognition, no existence") — though on the prevailing declaratory view it is.
verify: false
---
