---
source-hash: 894d8aa3c7980df6
generator-version: aids-1
generated-at: "2026-10-16T22:13:49.851Z"
locked: false
unit: laws2000
week: laws2000-w05
title: Can this state exercise jurisdiction over the offence?
summary: Checks the form of jurisdiction claimed, then tests each recognised ground — territoriality, nationality, protection, universality and, last, passive personality.
start: j1
concepts:
  - laws2000-w05-forms-of-jurisdiction
  - laws2000-w05-grounds-of-jurisdiction
sources:
  - Week 05 - Lecture Slides - International and National Law and Jurisdiction (slides 32–49)
  - Week 05 - Lecture Recording (Online) - International and National Law and Jurisdiction - Full Transcript (06:00–41:00)
  - Week 05 - Tutorial Tasks - International and National Law and Jurisdiction (Q4)
nodes:
  - id: j1
    kind: ask
    text: Is the state making or applying its law (prescribing, adjudicating), or acting inside another state's territory (arresting, seizing)?
    branches:
      - label: Prescribing or adjudicating
        to: j3
      - label: Enforcing in another state's territory
        to: j2
  - id: j2
    kind: ask
    text: Has the territorial state permitted it, by treaty or agreement?
    note: "Lotus (18): \"failing the existence of a permissive rule to the contrary\", a state \"may not exercise its power in any form in the territory of another State\"."
    cases:
      - ss-lotus-france-v-turkey
    branches:
      - label: "Yes"
        to: j3
      - label: "No"
        to: e-unlawful
  - id: j3
    kind: ask
    text: Did the offence take place, at least in part, on the state's territory?
    note: "Check every ground for every state: several states may have jurisdiction at once (concurring jurisdiction)."
    branches:
      - label: Yes — wholly or partly
        to: e-territory
      - label: "No"
        to: j4
  - id: j4
    kind: ask
    text: Is the offender one of the state's nationals?
    note: "States largely decide who their nationals are (Nottebohm: \"a genuine connection\"). Ships and aircraft take the nationality of their state of registration."
    cases:
      - nottebohm-case
    branches:
      - label: "Yes"
        to: e-active
      - label: "No"
        to: j5
  - id: j5
    kind: ask
    text: Does the act threaten a vital security interest of the state?
    note: Counterfeiting currency, espionage, conspiracy to commit treason (a coup), attacks on diplomatic personnel abroad.
    branches:
      - label: "Yes"
        to: e-protective
      - label: "No"
        to: j6
  - id: j6
    kind: ask
    text: Is it piracy, genocide, a war crime, a crime against humanity or torture?
    authorities:
      - geneva-convention-iv-art-146
      - criminal-code-act-1995-cth-div-268
    branches:
      - label: "Yes"
        to: e-universal
      - label: "No"
        to: j7
  - id: j7
    kind: ask
    text: Is the victim one of the state's nationals?
    note: "Checked last: passive personality is controversial and better as a subsidiary ground (slide 44)."
    cases:
      - us-v-yunis
    branches:
      - label: "Yes"
        to: e-passive
      - label: "No"
        to: e-none
  - id: e-unlawful
    kind: end
    tone: not-met
    exception: true
    text: "Unlawful: unauthorised enforcement in another state's territory violates its sovereignty (Eichmann, 1960)."
  - id: e-territory
    kind: end
    tone: met
    text: "Territorial jurisdiction — the fundamental ground: objective (completed there) or subjective (initiated or planned there) for cross-border crimes."
  - id: e-active
    kind: end
    tone: met
    text: "Active nationality: the state may prosecute its national for acts abroad (dual nationals: both states)."
  - id: e-protective
    kind: end
    tone: met
    text: Protective jurisdiction over a foreign national's act abroad that genuinely threatens a vital security interest.
  - id: e-universal
    kind: end
    tone: qualified
    text: Universal jurisdiction, with no direct link needed — but without a treaty it is controversial, so states usually require the accused's presence.
  - id: e-passive
    kind: end
    tone: qualified
    text: "Passive personality (US v Yunis): available but controversial — best combined with another ground."
  - id: e-none
    kind: end
    tone: not-met
    text: "No recognised ground: the state cannot justify jurisdiction over this foreign element."
verify: false
---
