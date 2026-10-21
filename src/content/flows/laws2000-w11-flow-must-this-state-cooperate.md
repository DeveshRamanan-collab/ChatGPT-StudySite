---
source-hash: ddf128651f7cd2ec
generator-version: aids-1
generated-at: "2026-10-16T22:38:11.849Z"
locked: false
unit: laws2000
week: laws2000-w11
title: Must this state co-operate with the international criminal court?
summary: "Sorts the sources of a state's duty to co-operate: the Chapter VII basis of the ad hoc tribunals, Rome Statute party status, an art 12(3) declaration, or a Security Council decision."
start: k1
concepts:
  - laws2000-w11-icc-applicable-law-and-cooperation
  - laws2000-w11-ad-hoc-tribunals-icty-and-ictr
sources:
  - Week 11 - Lecture Slides - International Criminal Law (text extract) (slides 17, 45, 51)
  - Week 11 - Lecture Slides - International Criminal Law (image slides transcribed) (slides 43, 46)
  - Week 11 - Tutorial Tasks - International Criminal Law (Q2–3)
nodes:
  - id: k1
    kind: ask
    text: Which court is asking for co-operation?
    branches:
      - label: The ICTY or ICTR
        to: e-adhoc
      - label: The ICC
        to: k2
  - id: k2
    kind: ask
    text: Is the state a Party to the Rome Statute?
    branches:
      - label: "Yes"
        to: e-party
      - label: "No"
        to: k3
  - id: k3
    kind: ask
    text: Has it accepted the Court's jurisdiction by an art 12(3) declaration?
    authorities:
      - rome-statute-art-12
    branches:
      - label: "Yes"
        to: e-declarant
      - label: "No"
        to: k4
  - id: k4
    kind: ask
    text: Has the Security Council, acting under Chapter VII, decided that this state shall co-operate?
    note: "Check the verb: Res 1970 \"decides\" that the Libyan authorities shall co-operate, but only \"urges\" other states, recognising non-parties have no obligation under the Statute."
    branches:
      - label: Yes — it decides
        to: e-sc
      - label: No — at most it urges
        to: e-none
  - id: e-adhoc
    kind: end
    tone: met
    text: "Yes — every state: the tribunals were created under Chapter VII, Res 827 decided \"all States shall cooperate fully\", and art 25 binds all members."
    authorities:
      - unsc-resolution-827
      - un-charter-art-25
  - id: e-party
    kind: end
    tone: met
    text: "Yes: States Parties must co-operate fully (art 86) and have procedures under national law for all forms of co-operation (art 88)."
    authorities:
      - rome-statute-arts-86-88
  - id: e-declarant
    kind: end
    tone: met
    text: "Yes: an accepting state must co-operate \"without any delay or exception\" under Part 9 (e.g. Ukraine, 2014)."
  - id: e-sc
    kind: end
    tone: met
    exception: true
    text: "Yes, though not a Party: Chapter VII decisions bind UN members under art 25 of the Charter."
    authorities:
      - un-charter-art-25
  - id: e-none
    kind: end
    tone: not-met
    text: No obligation under the Statute — and the Court, which relies on states to arrest suspects, may be unable to act.
verify: false
---
