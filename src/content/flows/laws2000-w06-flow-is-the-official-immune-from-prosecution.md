---
source-hash: 77c85b5c4e20e9e2
generator-version: aids-1
generated-at: "2026-10-16T22:13:50.524Z"
locked: false
unit: laws2000
week: laws2000-w06
title: Is this state official immune from prosecution?
summary: Asks which court is acting, whether the state has waived, the official's rank and time in office, the character of the act and whether it is an international crime.
start: o1
concepts:
  - laws2000-w06-immunities-of-state-officials
  - laws2000-w06-immunity-and-serious-international-crimes
sources:
  - Week 06 - Lecture Slides - Immunities (slides 22–27)
  - Week 06 - Lecture Recording (Live) - Immunities - Full Transcript (39:00–52:00)
  - Week 06 - Supplemental Lecture - Functional Immunity and Pinochet - Full Transcript (00:00–05:00)
nodes:
  - id: o1
    kind: ask
    text: Which court wants to try the official?
    branches:
      - label: An international criminal court with jurisdiction
        to: e-intl
      - label: The official's own state's courts
        to: e-own
      - label: Another state's national courts
        to: o2
  - id: o2
    kind: ask
    text: Has the official's state waived the immunity?
    note: The immunity belongs to the state; the official cannot waive it personally.
    branches:
      - label: "Yes"
        to: e-waived
      - label: "No"
        to: o3
  - id: o3
    kind: ask
    text: Is the official a serving head of state, head of government or foreign minister?
    cases:
      - certain-questions-of-mutual-assistance-in-criminal-matters-djibouti-v-france
    branches:
      - label: Yes — still in office
        to: e-personal
      - label: No, or no longer in office
        to: o4
  - id: o4
    kind: ask
    text: Was the act done in an official capacity, with official authority?
    note: "'Under the colour of authority': e.g. a soldier killing an enemy soldier in battle. A drunken holiday drive is a private act."
    branches:
      - label: Yes — an official act
        to: o5
      - label: No — a private act
        to: e-private
  - id: o5
    kind: ask
    text: Is the act an international crime subject to a form of universal jurisdiction, such as torture?
    authorities:
      - ilc-immunity-of-state-officials-draft-art-7
    branches:
      - label: "No"
        to: e-functional
      - label: "Yes"
        to: e-pinochet
  - id: e-intl
    kind: end
    tone: not-met
    text: "No bar: international criminal courts with jurisdiction may try even incumbent officials (Arrest Warrant)."
    cases:
      - arrest-warrant-of-11-april-2000-democratic-republic-of-congo-v-belgium
  - id: e-own
    kind: end
    tone: not-met
    text: No immunity under international law in the official's own state's courts.
  - id: e-waived
    kind: end
    tone: not-met
    text: "No immunity: the state has waived it."
  - id: e-personal
    kind: end
    tone: met
    text: "Immune: personal immunity covers official and private acts, even international crimes (Arrest Warrant). It ends with the office."
    cases:
      - arrest-warrant-of-11-april-2000-democratic-republic-of-congo-v-belgium
  - id: e-private
    kind: end
    tone: not-met
    text: "Not immune: functional immunity covers only official acts."
  - id: e-functional
    kind: end
    tone: met
    text: "Immune: functional immunity for the official act, continuing after office."
  - id: e-pinochet
    kind: end
    tone: qualified
    exception: true
    text: "Possibly no immunity: Pinochet (No 3) denied it to a former head of state for torture; ILC draft art 7 would go further, but whether custom agrees is contested."
    cases:
      - r-v-bow-street-metropolitan-stipendiary-magistrate-ex-parte-pinochet-ugarte-no-3
verify: false
---
