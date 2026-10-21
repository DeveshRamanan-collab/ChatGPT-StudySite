---
source-hash: 77c85b5c4e20e9e2
generator-version: aids-1
generated-at: "2026-10-16T22:13:50.524Z"
locked: false
unit: laws2000
week: laws2000-w06
title: Is the foreign state immune from this civil claim?
summary: Runs a claim against a foreign state through the definition of 'State', consent and waiver, the commercial and other exceptions, and the armed-forces rule from Germany v Italy.
start: i1
concepts:
  - laws2000-w06-state-immunity-foundations
  - laws2000-w06-restrictive-state-immunity
  - laws2000-w06-immunity-and-serious-international-crimes
sources:
  - Week 06 - Lecture Slides - Immunities (slides 5–20)
  - Week 06 - Lecture Recording (Live) - Immunities - Full Transcript (00:00–39:00)
nodes:
  - id: i1
    kind: ask
    text: Is the defendant 'the State'?
    note: "Organs of government; federal units, subdivisions and agencies entitled to exercise sovereign authority; representatives acting in that capacity (art 2(1)(b)). Apply custom: the 2004 Convention is not in force."
    authorities:
      - uncsi-2004-art-2-1-b
    branches:
      - label: "Yes"
        to: i2
      - label: "No"
        to: e-no-state
  - id: i2
    kind: ask
    text: Has the state consented — expressly, by taking part in the proceedings, or by bringing the claim now met with a counterclaim?
    authorities:
      - uncsi-2004-arts-7-9
    branches:
      - label: "Yes"
        to: e-waived
      - label: "No"
        to: i3
  - id: i3
    kind: ask
    text: Does the claim arise from a commercial transaction with a foreign natural or juridical person?
    note: Goods, services, loans or other commercial dealings, not employment (art 2(1)(c)). Judge by nature, not purpose, unless the parties agreed (art 2(2)); profit is irrelevant (Playa Largo).
    cases:
      - playa-largo-v-i-congreso-del-partido
    authorities:
      - uncsi-2004-art-2-1-c
      - uncsi-2004-art-2-2
    branches:
      - label: "Yes"
        to: i4
      - label: "No"
        to: i5
  - id: i4
    kind: ask
    text: Was it a transaction between states, or did the parties expressly agree to keep immunity?
    authorities:
      - uncsi-2004-art-10
    branches:
      - label: "Yes"
        to: e-immune
      - label: "No"
        to: e-commercial
  - id: i5
    kind: ask
    text: Is it a claim for death, injury or property damage caused in the forum state by an act attributable to the state, its author present there?
    authorities:
      - uncsi-2004-art-12
    branches:
      - label: "Yes"
        to: e-art12
      - label: Yes — but by armed forces in armed conflict
        to: e-armed
      - label: "No"
        to: i6
  - id: i6
    kind: ask
    text: Does it fall within another listed exception — employment, property, intellectual property, companies, commercial ships or arbitration?
    authorities:
      - uncsi-2004-arts-11-17
    branches:
      - label: "Yes"
        to: e-other
      - label: "No"
        to: i7
  - id: i7
    kind: step
    text: "What remains is a sovereign act (jure imperii): foreign and military affairs, legislation, police power, administration of justice."
    note: "Serious violations of human rights law or IHL do not change this: immunity is procedural, \"entirely distinct from the substantive law\" (Germany v Italy para 93)."
    cases:
      - jurisdictional-immunities-of-the-state-germany-v-italy-greece-intervening
    next: e-immune
  - id: e-no-state
    kind: end
    tone: not-met
    text: "No state immunity: the defendant is not the state or an entity exercising its sovereign authority."
  - id: e-waived
    kind: end
    tone: not-met
    text: "No immunity: the state has consented, and a waiver cannot be withdrawn once judgment goes against it."
  - id: e-immune
    kind: end
    tone: met
    text: "Immune: the court must decline jurisdiction. Immunity from enforcement against the state's property is a further, separate shield."
  - id: e-commercial
    kind: end
    tone: not-met
    text: No immunity for this commercial transaction (art 10; Trendex; Playa Largo).
    cases:
      - trendex-trading-corporation-v-central-bank-of-nigeria
      - playa-largo-v-i-congreso-del-partido
  - id: e-art12
    kind: end
    tone: not-met
    text: No immunity from a claim for pecuniary compensation under art 12.
  - id: e-armed
    kind: end
    tone: met
    exception: true
    text: "Immune: acta jure imperii by armed forces in armed conflict stay immune, even on the forum's territory (Germany v Italy para 77)."
    cases:
      - jurisdictional-immunities-of-the-state-germany-v-italy-greece-intervening
  - id: e-other
    kind: end
    tone: not-met
    text: No immunity in proceedings of this kind (arts 11, 13–17).
verify: false
---
