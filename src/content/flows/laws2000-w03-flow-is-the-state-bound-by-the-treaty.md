---
source-hash: 3819d681ed582d96
generator-version: aids-1
generated-at: "2026-10-16T16:10:22.331Z"
locked: false
unit: laws2000
week: laws2000-w03
title: Is the state bound by this treaty?
summary: Takes a document through the treaty definition, authority, consent, entry into force and invalidity — the order Tutorial Hypothetical 1 asks for.
start: t1
concepts:
  - laws2000-w03-treaty-definition-and-form
  - laws2000-w03-authority-to-conclude-a-treaty
  - laws2000-w03-consent-to-be-bound-and-entry-into-force
  - laws2000-w03-invalidity-of-treaties
sources:
  - Week 03 - Lecture Slides - The Law of Treaties (slides 6–26)
  - Week 03 - Lecture Recording (Live) - The Law of Treaties - Full Transcript (03:57–53:56)
  - Week 03 - Tutorial Task - The Law of Treaties (Hypothetical 1)
nodes:
  - id: t1
    kind: ask
    text: Is it an international agreement between states, in written form and governed by international law, whatever its label?
    note: Art 2(1)(a) VCLT. A press communiqué, meeting minutes or an MoU can qualify (Aegean Sea; Qatar v Bahrain; Somalia v Kenya).
    concept: laws2000-w03-treaty-definition-and-form
    cases:
      - aegean-sea-continental-shelf-greece-v-turkey
      - maritime-delimitation-and-territorial-questions-qatar-v-bahrain
      - maritime-delimitation-in-the-indian-ocean-somalia-v-kenya
    authorities:
      - vclt-art-2-1-a
    branches:
      - label: "Yes"
        to: t2
      - label: No — oral, or under domestic law
        to: t11
      - label: Only one state commits itself
        to: t12
  - id: t2
    kind: ask
    text: Did the person who signed have authority to represent the state?
    note: Heads of state, heads of government and foreign ministers need no full powers; anyone else should produce them (art 7).
    concept: laws2000-w03-authority-to-conclude-a-treaty
    authorities:
      - vclt-art-7
    branches:
      - label: "Yes"
        to: t3
      - label: "No"
        to: t13
  - id: t3
    kind: ask
    text: Does signature express consent, or is ratification required?
    note: Ratification is required if the treaty says so, negotiators agreed, signature was subject to ratification, or full powers or negotiations showed it (art 14).
    authorities:
      - vclt-art-11
      - vclt-art-14
    branches:
      - label: Signature is enough
        to: t5
      - label: Ratification is required
        to: t4
  - id: t4
    kind: ask
    text: Has the state ratified?
    branches:
      - label: "Yes"
        to: t5
      - label: No, only signed
        to: t14
  - id: t5
    kind: ask
    text: Has the treaty entered into force?
    note: In such manner and upon such date as the treaty provides or the negotiating states agree (art 24) — UNCLOS took until 1994.
    authorities:
      - vclt-art-24
    branches:
      - label: "Yes"
        to: t6
      - label: No, not yet
        to: t15
  - id: t6
    kind: ask
    text: Is there a ground of invalidity?
    note: "Relative: error, fraud, corruption; internal law only if manifest and fundamental (arts 46–50). Absolute: coercion, force, jus cogens (arts 51–53)."
    concept: laws2000-w03-invalidity-of-treaties
    authorities:
      - vclt-art-46
      - vclt-arts-48-50
      - vclt-art-53
    branches:
      - label: "Yes"
        to: t16
      - label: "No"
        to: t10
  - id: t10
    kind: end
    tone: met
    text: "Bound: pacta sunt servanda. Check any reservation the state made (arts 19–20)."
  - id: t11
    kind: end
    tone: not-met
    text: Not a treaty under the VCLT definition.
    authorities:
      - vclt-art-2-1-a
  - id: t12
    kind: end
    tone: qualified
    exception: true
    text: Not a treaty, but possibly a binding unilateral statement (Eastern Greenland; Nuclear Tests).
    concept: laws2000-w03-unilateral-statements
    cases:
      - legal-status-of-eastern-greenland-denmark-v-norway
      - nuclear-tests-cases-australia-v-france-new-zealand-v-france
  - id: t13
    kind: end
    tone: not-met
    text: The signatory is not considered to represent the state (art 7), so that act does not bind it.
    authorities:
      - vclt-art-7
  - id: t14
    kind: end
    tone: qualified
    text: Not bound by the treaty's terms; until it makes clear it will not become a party, it must not defeat the object and purpose (art 18(a)).
    authorities:
      - vclt-art-18
  - id: t15
    kind: end
    tone: qualified
    text: "Not yet bound in full: art 18(b) duty not to defeat object and purpose, plus provisional application if agreed (art 25)."
    authorities:
      - vclt-art-18
      - vclt-art-25
  - id: t16
    kind: end
    tone: not-met
    exception: true
    text: "Invalid: relative grounds may be invoked by the affected state; absolute grounds make the treaty void."
    cases:
      - land-and-maritime-boundary-cameroon-v-nigeria
    authorities:
      - vclt-art-53
verify: false
---
