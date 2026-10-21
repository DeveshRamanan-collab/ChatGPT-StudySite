---
source-hash: 792e3999fedfdc08
generator-version: aids-1
generated-at: "2026-10-16T22:20:27.117Z"
locked: false
unit: laws2400
week: laws2400-w11
title: Does a later event take the harm outside the scope of liability?
summary: "Follows the textbook flowcharts Causation 4 and 5: s 5D(1)(b) and s 5D(4), then later negligence (fact and degree, the very risk) or other later events (The Oropesa, volition, coincidence)."
start: n1
concepts:
  - laws2400-w11-scope-of-liability-decision-flow
  - laws2400-w11-novus-actus-volitional-acts-and-coincidences
  - laws2400-w11-subsequent-negligent-acts
sources:
  - Topic 11 Flowcharts (pp 436–437)
  - Topic 10 Lecture 1 (slides 24–26)
nodes:
  - id: n1
    kind: step
    text: Factual causation is established. Ask whether it is appropriate for the scope of the negligent person's liability to extend to the harm so caused (s 5D(1)(b)).
    note: "Consider whether and why responsibility should be imposed (s 5D(4)). The court must articulate the policy (Wallace v Kam); the question is normative: ought the defendant be held liable (Ruddock v Taylor)?"
    concept: laws2400-w11-scope-of-liability-decision-flow
    cases:
      - wallace-v-kam
      - ruddock-v-taylor
    authorities:
      - civil-liability-act-2002-nsw-s5d
    next: n2
  - id: n2
    kind: ask
    text: Did a later event have some effect on the situation the defendant's negligence created?
    note: A later act of the plaintiff, a third party's act, or a natural event that exacerbates the original harm or causes new harm.
    branches:
      - label: "Yes"
        to: n3
      - label: "No"
        to: e-remoteness
  - id: n3
    kind: ask
    text: Was the later event itself negligence, by a third party or the plaintiff?
    branches:
      - label: "Yes: careless conduct"
        to: n4
      - label: "No: a deliberate act, a reaction or a natural event"
        to: n6
  - id: n4
    kind: step
    text: "Weigh it as a matter of fact and degree: later negligence does not necessarily sever the chain."
    note: Mahony v J Kruschich (Demolitions) Pty Ltd; Burns v Pearce. The same holds whether the later negligence is a third party's or the plaintiff's own.
    concept: laws2400-w11-subsequent-negligent-acts
    cases:
      - mahony-v-j-kruschich-demolitions-pty-ltd
      - burns-v-pearce
    next: n5
  - id: n5
    kind: ask
    text: Did the defendant's wrongful conduct generate the very risk of injury that the later negligence realised, with the injury occurring in the ordinary course of things?
    note: "March v Stramare: the parked truck generated the very risk realised by the drunk driver. See, eg, Club Italia v Ritchie; Jausnik v Nominal Defendant (No 5); Gittani Stone v Pavkovic."
    cases:
      - march-v-stramare
      - club-italia-geelong-inc-v-ritchie
      - jausnik-v-nominal-defendant-no-5
      - gittani-stone-pty-ltd-v-pavkovic
    branches:
      - label: "Yes"
        to: e-intact
      - label: "No"
        to: e-arguable
  - id: n6
    kind: step
    text: "Ask whether the later event breaks the chain: is it ultroneous, unwarrantable, a new cause disturbing the sequence of events, unreasonable, extraneous or extrinsic (The Oropesa)?"
    concept: laws2400-w11-novus-actus-volitional-acts-and-coincidences
    cases:
      - the-oropesa
    next: n7
  - id: n7
    kind: ask
    text: To sever the connection, the act must ordinarily be one of two things. Which, if either, is it?
    note: "Volitional conduct severed the chain in Rickards v Lothian, Yates v Jones and CES v Superclinics; non-volitional conduct did not in Urbanski v Patel, Haynes v Harwood, Medlin and Hirst. Coincidence: Haber v Walker."
    cases:
      - rickards-v-lothian
      - yates-v-jones
      - ces-v-superclinics-aust-pty-ltd
      - haber-v-walker
      - urbanski-v-patel
      - haynes-v-g-harwood-and-son
    branches:
      - label: Voluntary, volitional human action
        to: e-broken
      - label: A causally independent, extremely unlikely coincidence
        to: e-broken
      - label: Neither, eg a non-volitional reaction
        to: e-intact
  - id: e-broken
    kind: end
    tone: not-met
    text: "Chain broken: the defendant is not liable for harm after the break, though still liable for the harm before it."
  - id: e-intact
    kind: end
    tone: met
    text: "Chain intact: the later harm stays within the scope of liability. Go on to remoteness."
  - id: e-arguable
    kind: end
    tone: qualified
    text: "Arguable both ways as a matter of fact and degree: without the very-risk point, the later negligence may sever the chain."
  - id: e-remoteness
    kind: end
    tone: qualified
    text: "No intervening act: take the remoteness branch."
verify: false
---
