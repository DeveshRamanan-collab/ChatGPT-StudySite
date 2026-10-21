---
source-hash: 0723a1ce0b7c8693
generator-version: aids-1
generated-at: "2026-10-16T22:01:00.545Z"
locked: false
unit: laws2100
week: laws2100-w05
title: Is there a legal obligation in this case, and where does it come from?
summary: "Walks Dworkin's challenge to the positivist theory of legal obligation: easy cases under a valid rule, then hard cases decided either by judicial law-making (the positivist tenets) or by weighing binding legal principles (Dworkin)."
start: n1
concepts:
  - laws2100-w05-ruling-theory-and-three-tenets
  - laws2100-w05-discretion-riggs-and-obligation
  - laws2100-w05-rules-principles-and-policies
sources:
  - Week 05 - Lecture Slides (slides 5, 8–16)
  - Week 05 - Lecture Transcript (first half)
nodes:
  - id: n1
    kind: ask
    text: Does an established, valid rule cover the case?
    note: "A rule identified by its pedigree through the rule of recognition: the positivists' first tenet."
    concept: laws2100-w05-ruling-theory-and-three-tenets
    branches:
      - label: "Yes"
        to: n2
      - label: "No"
        to: n4
  - id: n2
    kind: ask
    text: Does a principle of the law bear against applying that rule as literally read?
    note: In Riggs the will statutes, literally construed, gave Elmer the estate; but all laws 'may be controlled in their operation and effect by general, fundamental maxims of the common law'.
    cases:
      - riggs-v-palmer
    branches:
      - label: "Yes"
        to: n4
      - label: "No"
        to: n3
  - id: n3
    kind: end
    tone: met
    text: "An easy case: the rule applies all-or-nothing and imposes the obligation. Positivists and Dworkin agree here."
  - id: n4
    kind: ask
    text: Do you treat the principles in play as binding law, or as standards beyond the law?
    note: Dworkin's key move (slide 14). Treat principles as law and the master-rule tenet must go, and discretion is abandoned 'or clarified into triviality' (TRS 44).
    authorities:
      - dworkin-taking-rights-seriously
    branches:
      - label: Beyond the law (the positivist tenets)
        to: n5
      - label: Binding law (Dworkin)
        to: n6
  - id: n5
    kind: end
    tone: not-met
    text: "Strong discretion: the principle is extra-legal, so any result it supports is new law the judge makes for the future, as Raz says. Until then there is no legal obligation to that effect (TRS 44)."
  - id: n6
    kind: ask
    text: Are there principles of the law, such as maxims of the common law, that bear on the case?
    note: Principles are observed because justice or fairness requires them; policies set goals. 'No man may profit by his own wrong' is Dworkin's example of a principle (TRS 22).
    concept: laws2100-w05-rules-principles-and-policies
    branches:
      - label: "Yes"
        to: n7
      - label: "No"
        to: n11
  - id: n7
    kind: step
    text: Weigh the principles for and against the obligation.
    note: "Principles have the dimension of weight, and an outweighed principle stays valid. Weighing is judgment: weak discretion, not strong."
    concept: laws2100-w05-discretion-riggs-and-obligation
    next: n8
  - id: n8
    kind: ask
    text: Is the case supporting the obligation, in terms of binding legal principles, stronger than the case against it?
    branches:
      - label: "Yes"
        to: n9
      - label: "No"
        to: n10
  - id: n9
    kind: end
    tone: met
    text: A legal obligation exists, imposed by a constellation of principles as well as by rules (TRS 44). In Riggs, Elmer could not take the estate.
  - id: n10
    kind: end
    tone: not-met
    text: "No legal obligation: the case against it is stronger. On Dworkin's view this is still the law's answer, reached by weighing, not the judge's free choice."
  - id: n11
    kind: end
    tone: qualified
    exception: true
    text: "With no rule or principle bearing on the case, the judge would be unbound: strong discretion. Dworkin denies this happens: because of principles, even hard cases have one right answer."
verify: false
---
