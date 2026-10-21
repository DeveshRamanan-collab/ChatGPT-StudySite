---
source-hash: 94d5436be54c8216
generator-version: aids-1
generated-at: "2026-10-16T22:37:56.707Z"
locked: false
unit: laws2000
week: laws2000-w09
title: Can the state rely on self-defence under art 51?
summary: Runs a claim of self-defence through armed attack, imminence, attribution and non-state actors, then necessity, proportionality and reporting.
start: s1
concepts:
  - laws2000-w09-armed-attack
  - laws2000-w09-anticipatory-self-defence
  - laws2000-w09-self-defence-against-non-state-actors
  - laws2000-w09-necessity-proportionality-and-reporting
sources:
  - Week 09 - Lecture Slides - The Use of Force (slides 17–27)
  - Week 09 - Lecture Transcript (Live) - The Use of Force (Part A)
  - Week 09 - Lecture Transcript (Online) - The Use of Force (Part B)
  - Week 09 - Tutorial Task - The Use of Force (question 2)
nodes:
  - id: s1
    kind: ask
    text: Has an armed attack occurred against the state?
    note: The gravest forms of force, by scale and effects; against territory or military vessels, not private ships. Frontier incidents and supplying arms fall short (Nicaragua; Oil Platforms).
    concept: laws2000-w09-armed-attack
    cases:
      - nicaragua-v-united-states-of-america
      - oil-platforms-islamic-republic-of-iran-v-united-states-of-america
    authorities:
      - un-charter-art-51
    branches:
      - label: "Yes"
        to: s3
      - label: Not yet — an attack is said to be coming
        to: s2
      - label: No — only lesser force, or support to rebels
        to: e-no-attack
  - id: s2
    kind: ask
    text: Is a specific attack manifestly imminent?
    note: A "sufficient threat" of uncertain time and place (US National Security Strategy 2002) has little support; striking too early can itself be aggression.
    concept: laws2000-w09-anticipatory-self-defence
    authorities:
      - us-national-security-strategy-2002
    branches:
      - label: "Yes"
        to: e-anticipatory
      - label: "No"
        to: e-no-attack
  - id: s3
    kind: ask
    text: Who carried out the attack?
    concept: laws2000-w09-self-defence-against-non-state-actors
    branches:
      - label: The state against which force will be used
        to: s5
      - label: A group sent by, or under the effective control of, that state
        to: s5
      - label: A non-state group acting on its own from another state
        to: s4
  - id: s4
    kind: ask
    text: Has the host state consented to action on its territory?
    note: The ICJ treats attribution to the host state as important (Wall; Armed Activities).
    cases:
      - construction-of-a-wall-advisory-opinion
      - armed-activities-on-the-territory-of-the-congo-democratic-republic-of-the-congo-v-uganda
    branches:
      - label: "Yes"
        to: s5
      - label: No — and it is unwilling or unable to act
        to: e-unwilling
      - label: No — and it is acting against the group itself
        to: e-no-basis
  - id: s5
    kind: ask
    text: Is force the only means of halting the attack (necessity)?
    note: "Indicator: the temporal link — measures taking effect months later were not necessary (Nicaragua [237])."
    concept: laws2000-w09-necessity-proportionality-and-reporting
    cases:
      - nicaragua-v-united-states-of-america
    branches:
      - label: "Yes"
        to: s6
      - label: "No"
        to: e-unlawful
  - id: s6
    kind: ask
    text: Is the response proportionate in its destructive and geographical scope?
    note: Judge the scale of the whole operation (Oil Platforms [77]); taking airports and towns hundreds of kilometres away was not proportionate (Armed Activities [147]).
    cases:
      - oil-platforms-islamic-republic-of-iran-v-united-states-of-america
      - armed-activities-on-the-territory-of-the-congo-democratic-republic-of-the-congo-v-uganda
    branches:
      - label: "Yes"
        to: s7
      - label: "No"
        to: e-unlawful
  - id: s7
    kind: step
    text: Report the measures immediately to the Security Council; the right lasts only until the Council has taken the measures necessary.
    authorities:
      - un-charter-art-51
    next: e-lawful
  - id: e-no-attack
    kind: end
    tone: not-met
    text: No armed attack, so no right of self-defence. Lesser force may still breach art 2(4), and striking early risks being aggression.
  - id: e-anticipatory
    kind: end
    tone: qualified
    exception: true
    text: Arguable anticipatory self-defence — a contested grey area. Necessity, proportionality and reporting still apply.
  - id: e-unwilling
    kind: end
    tone: qualified
    exception: true
    text: Only the controversial "unwilling or unable" argument (e.g. Turkey v PKK in Iraq); the ICJ stresses attribution to the host state.
  - id: e-no-basis
    kind: end
    tone: not-met
    text: No clear basis for force on the host state's territory without its consent; cooperation with the host is the lawful route.
  - id: e-unlawful
    kind: end
    tone: not-met
    text: "Not lawful self-defence: the response fails necessity or proportionality."
  - id: e-lawful
    kind: end
    tone: met
    text: Lawful self-defence under art 51 and customary law.
verify: false
---
