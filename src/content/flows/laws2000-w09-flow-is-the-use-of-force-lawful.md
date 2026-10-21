---
source-hash: 94d5436be54c8216
generator-version: aids-1
generated-at: "2026-10-16T22:37:56.707Z"
locked: false
unit: laws2000
week: laws2000-w09
title: Is this use of force lawful under the UN Charter?
summary: Tests the facts against art 2(4), then consent and the two Charter exceptions, and sorts the contested justifications — humanitarian necessity and rescue of nationals — from plain breaches.
start: f1
concepts:
  - laws2000-w09-prohibition-on-the-use-of-force
  - laws2000-w09-exceptions-to-the-prohibition
  - laws2000-w09-humanitarian-intervention-and-r2p
sources:
  - Week 09 - Lecture Slides - The Use of Force (slides 6–17, 29–36)
  - Week 09 - Lecture Transcript (Live) - The Use of Force (Part A)
  - Week 09 - Lecture Transcript (Online) - The Use of Force (Part B)
nodes:
  - id: f1
    kind: ask
    text: Is it force by one state in its international relations, rather than force used inside its own territory?
    note: Force against one's own population or rebels is, in principle, for human rights and humanitarian law — though the line can blur (Korea, Vietnam, the former Yugoslavia).
    authorities:
      - un-charter-art-2-4
    branches:
      - label: "Yes"
        to: f2
      - label: "No"
        to: e-not-engaged
  - id: f2
    kind: ask
    text: Is it a threat or use of force — armed force, or a cyber operation of comparable scale and effects?
    note: Economic coercion is contested. A threat must be specific and credible, and is unlawful only if the force threatened would be (Nuclear Weapons).
    concept: laws2000-w09-prohibition-on-the-use-of-force
    cases:
      - legality-of-the-threat-or-use-of-nuclear-weapons
    authorities:
      - ila-2018-report
    branches:
      - label: "Yes"
        to: f3
      - label: "No"
        to: e-not-engaged
  - id: f3
    kind: ask
    text: Did the territorial state's government invite or consent to the force?
    note: A request from an opposition group does not count (Nicaragua).
    cases:
      - nicaragua-v-united-states-of-america
    branches:
      - label: "Yes"
        to: e-consent
      - label: "No"
        to: f4
  - id: f4
    kind: ask
    text: Has the Security Council authorised the force (art 42)?
    authorities:
      - un-charter-art-42
      - un-charter-art-24
    branches:
      - label: "Yes"
        to: e-authorised
      - label: "No"
        to: f5
  - id: f5
    kind: ask
    text: What justification does the state claim?
    branches:
      - label: Self-defence
        to: f6
      - label: Overwhelming humanitarian necessity
        to: e-humanitarian
      - label: Rescuing its own nationals
        to: e-rescue
      - label: The force was limited and took no territory
        to: e-breach
      - label: None of these
        to: e-breach
  - id: f6
    kind: step
    text: "Test self-defence: an armed attack, necessity and proportionality, and reporting to the Security Council (art 51)."
    concept: laws2000-w09-armed-attack
    authorities:
      - un-charter-art-51
    next: e-self-defence
  - id: e-not-engaged
    kind: end
    tone: qualified
    text: Art 2(4) is not engaged — internal force, or pressure not counted as force. Other law, such as human rights law, may still apply.
  - id: e-consent
    kind: end
    tone: met
    text: "Lawful: with the government's consent there is no violation of art 2(4) at all."
  - id: e-authorised
    kind: end
    tone: met
    text: "Lawful: force authorised by the Security Council under art 42, within the terms of the authorisation."
  - id: e-self-defence
    kind: end
    tone: qualified
    text: Lawful only if every condition of self-defence is met — use the self-defence flow.
  - id: e-humanitarian
    kind: end
    tone: qualified
    exception: true
    text: "No Charter basis: unilateral humanitarian intervention appears to breach art 2(4) and remains a legal grey area (Kosovo; ILA 2018)."
    authorities:
      - ila-2018-report
  - id: e-rescue
    kind: end
    tone: qualified
    exception: true
    text: "Contested: rescue of nationals is frequently practised by powerful states, but whether art 2(4) permits it is debated."
  - id: e-breach
    kind: end
    tone: not-met
    text: "A breach of art 2(4): the restrictive reading is rejected, and no exception applies (Corfu Channel; Nicaragua)."
    cases:
      - corfu-channel-case-united-kingdom-v-albania
      - nicaragua-v-united-states-of-america
verify: false
---
