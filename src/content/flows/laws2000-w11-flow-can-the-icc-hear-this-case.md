---
source-hash: ddf128651f7cd2ec
generator-version: aids-1
generated-at: "2026-10-16T22:38:11.849Z"
locked: false
unit: laws2000
week: laws2000-w11
title: Can the ICC hear this case?
summary: "Follows the slides' flowchart: subject matter (art 5), time (art 11), trigger (art 13), preconditions (art 12, skipped for a Security Council referral), then admissibility (art 17)."
start: j1
concepts:
  - laws2000-w11-icc-jurisdiction
  - laws2000-w11-icc-admissibility-and-complementarity
sources:
  - Week 11 - Lecture Slides - International Criminal Law (image slides transcribed) (slides 38, 47)
  - Week 11 - Lecture Slides - International Criminal Law (text extract) (slides 39, 42, 45, 48–49)
  - Week 11 - Tutorial Tasks - International Criminal Law (Q4)
nodes:
  - id: j1
    kind: ask
    text: Is the conduct genocide, a crime against humanity, a war crime or the crime of aggression?
    note: "Art 5: only \"the most serious crimes of concern to the international community as a whole\". Piracy is not on the list. Aggression is a leadership crime (art 8 bis)."
    authorities:
      - rome-statute-art-5
    branches:
      - label: "Yes"
        to: j2
      - label: "No"
        to: e-crime
  - id: j2
    kind: ask
    text: Was it committed after the Statute entered into force — for that state, if it joined later?
    note: Art 11. A state that joins later can reach back to earlier crimes only by an art 12(3) declaration.
    authorities:
      - rome-statute-art-11
    branches:
      - label: "Yes"
        to: j3
      - label: No — but the state lodged an art 12(3) declaration
        to: j3
      - label: "No"
        to: e-time
  - id: j3
    kind: ask
    text: How did the situation reach the Court?
    authorities:
      - rome-statute-art-13
    branches:
      - label: A State Party referred it
        to: j5
      - label: The Prosecutor acted proprio motu
        to: j4
      - label: The Security Council referred it under Chapter VII
        to: j6
  - id: j4
    kind: step
    text: The Pre-Trial Chamber must authorise the Prosecutor's investigation (art 15).
    note: "E.g. the Philippines: requested May 2021, authorised by Pre-Trial Chamber I in September 2021."
    next: j5
  - id: j5
    kind: ask
    text: Is the territorial state (or the flag state of the vessel or aircraft), or the accused's state of nationality, a Party — or has it accepted jurisdiction by declaration?
    note: Art 12(2)–(3). A declaring non-party must co-operate without delay or exception (e.g. Ukraine, 2014).
    authorities:
      - rome-statute-art-12
    branches:
      - label: "Yes"
        to: j6
      - label: "No"
        to: e-precond
  - id: j6
    kind: ask
    text: Is a state with jurisdiction investigating or prosecuting the case, or has it decided not to prosecute, or tried the person already?
    note: "Complementarity: the ICC is \"complementary to national criminal jurisdictions\" (art 1). A Security Council referral (art 13(b)) needs no art 12(2) link but is still subject to admissibility."
    concept: laws2000-w11-icc-admissibility-and-complementarity
    authorities:
      - rome-statute-art-17
    branches:
      - label: "Yes"
        to: j7
      - label: "No"
        to: j8
  - id: j7
    kind: ask
    text: Is that state unwilling or unable genuinely to carry out the proceedings?
    note: "Unwilling: shielding, unjustified delay, lack of independence or impartiality. Unable: total or substantial collapse or unavailability of the judicial system. For a prior trial, art 20(3) governs."
    branches:
      - label: "Yes"
        to: j8
      - label: No — the proceedings are genuine
        to: e-inadmissible
  - id: j8
    kind: ask
    text: Is the case of sufficient gravity to justify further action by the Court?
    authorities:
      - rome-statute-art-17
    branches:
      - label: "Yes"
        to: e-proceed
      - label: "No"
        to: e-gravity
  - id: e-crime
    kind: end
    tone: not-met
    text: "No subject-matter jurisdiction: not an art 5 crime (e.g. piracy), whatever the links to Parties."
  - id: e-time
    kind: end
    tone: not-met
    text: No temporal jurisdiction (art 11).
  - id: e-precond
    kind: end
    tone: not-met
    text: "Preconditions not met: neither the territorial nor the nationality state is a Party or has accepted jurisdiction (art 12). Only a Security Council referral could open the case."
  - id: e-inadmissible
    kind: end
    tone: not-met
    text: "Inadmissible: genuine national proceedings take priority (art 17)."
  - id: e-gravity
    kind: end
    tone: not-met
    text: "Inadmissible: not of sufficient gravity (art 17(1)(d))."
  - id: e-proceed
    kind: end
    tone: met
    text: Jurisdiction and admissibility established — proceed to the ICC.
verify: false
---
