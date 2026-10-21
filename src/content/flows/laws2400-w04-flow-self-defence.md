---
source-hash: 3c10a41cffc6713f
generator-version: aids-1
generated-at: "2026-10-16T15:54:29.954Z"
locked: false
unit: laws2400
week: laws2400-w04
title: Does self-defence excuse the force used?
summary: Runs the common law test (Zecevic v DPP), then the parallel statutory test in s 52 CLA, with s 53 for unreasonable responses.
start: s1
concepts:
  - laws2400-w04-self-defence-common-law-and-cla
sources:
  - Topic 4 Lecture 1 (slides 21–30)
  - Civil Liability Act 2002 (NSW) ss 3A, 52–53
nodes:
  - id: s1
    kind: ask
    text: What was the force used to protect?
    note: Self-defence covers the defendant, third parties (family or even strangers) and property, both land and chattels, against unlawful interference.
    branches:
      - label: A person, or chattels
        to: s3
      - label: Land
        to: s2
  - id: s2
    kind: ask
    text: Was the defendant in possession, and was a request to leave made with a chance to comply?
    note: At common law, defending land is generally only available to the person in possession, after a request to leave.
    branches:
      - label: "Yes"
        to: s3
      - label: "No"
        to: s6
  - id: s3
    kind: ask
    text: "Common law: was there a reasonable apprehension of physical force to the defendant or others?"
    cases:
      - zecevic-v-dpp
    branches:
      - label: "Yes"
        to: s4
      - label: "No"
        to: s6
  - id: s4
    kind: ask
    text: "Common law: was the force used proportionate to the threat?"
    note: In Fontin v Katapodis, throwing glass at the face after a blow with a T-square was "out of all reasonable proportion to the emergency".
    cases:
      - zecevic-v-dpp
      - fontin-v-katapodis
    branches:
      - label: "Yes"
        to: e-cl
      - label: "No"
        to: s6
  - id: s6
    kind: ask
    text: "Statute: was the conduct responded to unlawful, or would it have been but for a mental health or cognitive impairment?"
    note: Section 52(1) CLA. "Unlawful conduct" is undefined but held to include criminal and tortious conduct. The common law test has no such requirement; the regimes run in parallel.
    authorities:
      - civil-liability-act-2002-nsw-s52
    cases:
      - nsw-v-mcmaster
    branches:
      - label: "Yes"
        to: s7
      - label: "No"
        to: e-fail
  - id: s7
    kind: ask
    text: Did the defendant believe the conduct was necessary for a purpose in s 52(2)?
    note: To defend self or another, prevent or end unlawful deprivation of liberty, protect property from unlawful interference, or prevent or remove a criminal trespass.
    authorities:
      - civil-liability-act-2002-nsw-s52
    branches:
      - label: "Yes"
        to: s8
      - label: "No"
        to: e-fail
  - id: s8
    kind: ask
    text: Was the conduct a reasonable response in the circumstances as the defendant perceived them?
    cases:
      - nsw-v-mcmaster
    authorities:
      - civil-liability-act-2002-nsw-s52
    branches:
      - label: "Yes"
        to: s9
      - label: "No"
        to: e-s53
  - id: s9
    kind: ask
    text: Did the force intentionally or recklessly inflict death only to protect property or deal with a criminal trespass?
    note: "Section 52(3) CLA: s 52 does not apply to such force."
    exception: true
    authorities:
      - civil-liability-act-2002-nsw-s52
    branches:
      - label: "No"
        to: e-s52
      - label: "Yes"
        to: e-fail
  - id: e-cl
    kind: end
    tone: met
    text: "Common law self-defence made out: no liability for the force."
  - id: e-s52
    kind: end
    tone: met
    text: "Section 52 CLA applies: no liability for the conduct."
  - id: e-s53
    kind: end
    tone: qualified
    text: "Section 53: no damages unless exceptional and harsh and unjust; never for non-economic loss."
    exception: true
  - id: e-fail
    kind: end
    tone: not-met
    text: Self-defence fails under both tests.
verify: false
---
