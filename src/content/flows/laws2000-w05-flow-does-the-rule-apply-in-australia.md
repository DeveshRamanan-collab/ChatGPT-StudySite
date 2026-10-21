---
source-hash: 894d8aa3c7980df6
generator-version: aids-1
generated-at: "2026-10-16T22:13:49.851Z"
locked: false
unit: laws2000
week: laws2000-w05
title: Can an Australian court give effect to this rule of international law?
summary: Routes a treaty or customary rule through transformation, the interpretive aids and the limits on custom, to show whether and how it operates in Australian law.
start: a1
concepts:
  - laws2000-w05-treaties-in-australian-law
  - laws2000-w05-international-law-in-australian-interpretation
  - laws2000-w05-customary-international-law-in-australian-law
sources:
  - Week 05 - Lecture Slides - International and National Law and Jurisdiction (slides 12–25)
  - Week 05 - Lecture Recording (Live) - International and National Law and Jurisdiction - Full Transcript (20:00–51:00)
nodes:
  - id: a1
    kind: ask
    text: Is the rule found in a treaty or in customary international law?
    branches:
      - label: A treaty
        to: a2
      - label: Customary international law
        to: a5
  - id: a2
    kind: ask
    text: Has Parliament transformed the treaty into Australian law?
    note: New legislation, amending an Act, existing legislation already giving effect, or giving force of law (DPIA 1967 s 7). Scheduling alone is not full incorporation.
    authorities:
      - australian-constitution-cth-s51-xxix
      - diplomatic-privileges-and-immunities-act-1967-cth-s7
    branches:
      - label: "Yes"
        to: e-applies
      - label: No — it is only ratified
        to: a3
  - id: a3
    kind: ask
    text: Is the question the meaning of an Australian statute?
    branches:
      - label: Yes — a statute must be interpreted
        to: a4
      - label: No — the claimant relies on the treaty itself
        to: e-no-direct
  - id: a4
    kind: ask
    text: Are the statute's words ambiguous or obscure, and did Australia join (or contemplate joining) the treaty before the Act was passed?
    note: Section 15AB also allows a treaty to confirm ordinary meaning or avoid a manifestly absurd result. Obligations are identified as they exist when the question arises.
    authorities:
      - acts-interpretation-act-1901-cth-s15ab
    branches:
      - label: "Yes"
        to: e-interpret
      - label: No — the words are clear
        to: e-clear
      - label: No — Australia joined only after the Act
        to: e-presumption
  - id: a5
    kind: ask
    text: Is the customary rule inconsistent with a statute or essential common law doctrine?
    note: Australia has not settled between transformation and incorporation; either way, this limit applies.
    branches:
      - label: "Yes"
        to: e-custom-blocked
      - label: "No"
        to: a6
  - id: a6
    kind: ask
    text: Would applying the rule mean trying and punishing someone for a crime?
    cases:
      - nulyarimma-v-thompson
    branches:
      - label: Yes — a criminal norm
        to: e-crime
      - label: No — a civil rule
        to: e-custom-maybe
  - id: e-applies
    kind: end
    tone: met
    text: It applies as Australian law through the legislation. Where the Act reproduces treaty text, read it in line with the treaty (Applicant A).
    cases:
      - applicant-a-v-minister-for-immigration-and-ethnic-affairs
  - id: e-no-direct
    kind: end
    tone: not-met
    text: "No direct effect: ratification creates no rights in Australian law until legislation implements it (Dietrich)."
    cases:
      - dietrich-v-the-queen
  - id: e-interpret
    kind: end
    tone: qualified
    text: The treaty may assist interpretation (s 15AB), and the court favours the reading consistent with international law (Jumbunna).
    cases:
      - jumbunna-coal-mine-nl-v-victoria-coal-miners-association
  - id: e-clear
    kind: end
    tone: not-met
    text: "Clear words prevail: a treaty cannot modify them (Yager), and the presumption yields to clear legislation (Polites). Australia may still be in breach internationally."
    cases:
      - yager-v-the-queen
      - polites-v-commonwealth
  - id: e-presumption
    kind: end
    tone: qualified
    exception: true
    text: Section 15AB is unavailable, but the common law presumptions may still favour a reading consistent with international law (Jumbunna; Coco for fundamental rights).
    cases:
      - jumbunna-coal-mine-nl-v-victoria-coal-miners-association
      - coco-v-the-queen
  - id: e-custom-blocked
    kind: end
    tone: not-met
    text: "Not adopted: custom yields to inconsistent legislation or essential common law doctrine."
  - id: e-crime
    kind: end
    tone: not-met
    text: Not triable without legislation making it an offence — even a jus cogens norm such as genocide (Nulyarimma).
    cases:
      - nulyarimma-v-thompson
  - id: e-custom-maybe
    kind: end
    tone: qualified
    text: It may be received into the common law (Merkel J's criteria) — but the doctrine is unsettled, and Teoh forbids back-door importation of treaties.
    cases:
      - nulyarimma-v-thompson
      - minister-for-immigration-and-ethnic-affairs-v-teoh
verify: false
---
