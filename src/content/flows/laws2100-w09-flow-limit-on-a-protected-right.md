---
source-hash: c580f21dc93b470a
generator-version: aids-1
generated-at: "2026-10-16T23:25:52.413Z"
locked: false
unit: laws2100
week: laws2100-w09
title: Can this limit on a protected right be justified?
summary: "Walks a measure that restricts a constitutional or Convention right through the week's two routes: emergency derogation under ECHR art 15, or a limitation clause tested by Alexy's three stages."
start: n1
concepts:
  - laws2100-w09-limitation-clauses-and-proportionality
sources:
  - Week 09 - Lecture Slides (slides 18–21)
nodes:
  - id: n1
    kind: ask
    text: "Does the state rely on an emergency derogation: war or other public emergency threatening the life of the nation (ECHR art 15(1))?"
    authorities:
      - echr-art-15
    branches:
      - label: "Yes: emergency derogation"
        to: n2
      - label: "No: an ordinary limit"
        to: n5
  - id: n2
    kind: ask
    text: Is the right one that art 15(2) puts beyond derogation?
    note: Art 2 (right to life, save deaths resulting from lawful acts of war), art 3 (prohibition of torture), art 4(1) (no one held in slavery or servitude), art 7 (no punishment without law).
    authorities:
      - echr-art-15
    branches:
      - label: "Yes"
        to: n3
      - label: "No"
        to: n4
  - id: n3
    kind: end
    tone: not-met
    exception: true
    text: No derogation may be made, even in war or public emergency. There is a debate whether these non-derogable rights are a kind of absolute right.
  - id: n4
    kind: end
    tone: qualified
    text: Derogation is possible, but only to the extent strictly required by the exigencies of the situation, consistently with other obligations under international law; the Secretary General must be kept fully informed (art 15(1), (3)).
  - id: n5
    kind: step
    text: "Find the limitation clause: a constitutional provision permitting the partial limitation of some constitutional rights."
    note: "Canadian Charter s 1: 'such reasonable limits prescribed by law as can be demonstrably justified in a free and democratic society'. Vic Charter s 7(2) adds 'based on human dignity, equality and freedom' and lists factors (a)–(e)."
    authorities:
      - canadian-charter-of-rights-and-freedoms-s1
      - charter-of-human-rights-and-responsibilities-act-2006-vic-s7
    next: n6
  - id: n6
    kind: ask
    text: Is the limit prescribed by law?
    branches:
      - label: "Yes"
        to: n8
      - label: "No"
        to: n7
  - id: n7
    kind: end
    tone: not-met
    text: "Not justified: s 1 allows only limits 'prescribed by law', and s 7(2) only limits 'under law'."
  - id: n8
    kind: ask
    text: "Suitability: is the measure capable of achieving the legitimate aim?"
    concept: laws2100-w09-limitation-clauses-and-proportionality
    authorities:
      - alexy-proportionality
    branches:
      - label: "Yes"
        to: n10
      - label: "No"
        to: n9
  - id: n9
    kind: end
    tone: not-met
    text: Fails suitability. A measure that cannot achieve its aim never reaches necessity or balancing.
  - id: n10
    kind: ask
    text: "Necessity: is there a less restrictive means to achieve the same goal?"
    note: "Victorian Charter s 7(2)(e): 'any less restrictive means reasonably available to achieve the purpose that the limitation seeks to achieve'."
    authorities:
      - alexy-proportionality
      - charter-of-human-rights-and-responsibilities-act-2006-vic-s7
    branches:
      - label: Yes, a milder means exists
        to: n11
      - label: "No"
        to: n12
  - id: n11
    kind: end
    tone: not-met
    text: "Fails necessity: the same goal can be reached with less restriction of the right."
  - id: n12
    kind: ask
    text: "Balancing (proportionality in the narrow sense): do the benefits of the measure outweigh the detriment to the right infringed?"
    note: "Alexy's weight formula formalises this step: the intensity of interference, the importance of the competing principle, and the degree of certainty about these factors."
    authorities:
      - alexy-proportionality
    branches:
      - label: "Yes"
        to: n13
      - label: "No"
        to: n14
  - id: n13
    kind: end
    tone: met
    text: "The limit is proportionate and can be justified. Remember Vic s 7(3): limits are partial; nothing permits destroying the right."
  - id: n14
    kind: end
    tone: not-met
    text: "Fails proportionality in the narrow sense: the detriment to the right outweighs the benefits."
verify: false
---
