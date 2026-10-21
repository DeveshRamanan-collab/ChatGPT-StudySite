---
source-hash: 3819d681ed582d96
generator-version: aids-1
generated-at: "2026-10-16T16:10:22.331Z"
locked: false
unit: laws2000
week: laws2000-w03
title: Does a reservation change this state's treaty obligations?
summary: Runs a state's statement through the definition, the art 19 gates and art 20's acceptance and objection rules, and the three unresolved views on invalid reservations — Tutorial Hypothetical 2.
start: r1
concepts:
  - laws2000-w03-reservations-to-treaties
sources:
  - Week 03 - Lecture Slides - The Law of Treaties (slides 28–32)
  - Week 03 - Lecture Recording (Online) - The Law of Treaties - Full Transcript (03:36–24:34)
  - Week 03 - Tutorial Task - The Law of Treaties (Hypothetical 2)
nodes:
  - id: r1
    kind: ask
    text: Does the statement purport to exclude or modify a provision's legal effect for the state, however it is named?
    note: Art 2(1)(d). An interpretative declaration only explains a state's view of the meaning and is not a condition of being bound.
    authorities:
      - vclt-art-2-1-d
    branches:
      - label: "Yes"
        to: r2
      - label: No — it only explains meaning
        to: r10
  - id: r2
    kind: ask
    text: Does the treaty prohibit reservations, or this reservation, or allow only specified ones that exclude it?
    note: "Art 19(a)–(b): read the whole treaty, beginning to end."
    authorities:
      - vclt-art-19
    branches:
      - label: "Yes"
        to: r5
      - label: "No"
        to: r3
  - id: r3
    kind: ask
    text: Is the reservation compatible with the treaty's object and purpose?
    note: Art 19(c). Reserving against the core duty to cut ozone-depleting emissions in an ozone treaty would fail (lecture example).
    authorities:
      - vclt-art-19
    branches:
      - label: "Yes"
        to: r4
      - label: "No"
        to: r5
  - id: r4
    kind: ask
    text: How do the other states respond?
    note: "Special cases: few parties with full application essential — all must accept (20(2)); constituent instrument — the competent organ accepts (20(3))."
    authorities:
      - vclt-art-20
    branches:
      - label: The treaty expressly authorises it
        to: r14
      - label: Another state accepts it
        to: r15
      - label: A state objects
        to: r16
  - id: r5
    kind: step
    exception: true
    text: "Impermissible: the reservation is void from the start, and no state needs to object."
    next: r6
  - id: r6
    kind: ask
    text: Which view of invalid reservations do you apply? (Unresolved — discuss all three.)
    branches:
      - label: Solution 1
        to: r12
      - label: Solution 2 (severance)
        to: r13
      - label: Solution 3
        to: r7
  - id: r7
    kind: ask
    text: Did the state expressly make the reservation a condition of its consent?
    branches:
      - label: "Yes"
        to: r12
      - label: "No"
        to: r13
  - id: r10
    kind: end
    tone: not-met
    text: "Interpretative declaration, not a reservation: the state's obligations are unchanged."
  - id: r12
    kind: end
    tone: not-met
    exception: true
    text: The reserving state does not become a party to the treaty.
  - id: r13
    kind: end
    tone: qualified
    exception: true
    text: The state is a party bound by the whole treaty, without the benefit of the reservation.
  - id: r14
    kind: end
    tone: met
    text: "Effective without acceptance (art 20(1)): the state's obligations are modified by the reservation."
    authorities:
      - vclt-art-20
  - id: r15
    kind: end
    tone: met
    text: "Effective once at least one state accepts: the two are parties on the modified terms."
    authorities:
      - vclt-art-20
  - id: r16
    kind: end
    tone: qualified
    text: The treaty does not enter into force between the reserving and objecting states.
    authorities:
      - vclt-art-20
verify: false
---
