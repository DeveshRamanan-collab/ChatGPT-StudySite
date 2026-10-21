---
source-hash: 4b7ee09ab3bfeb7e
generator-version: aids-1
generated-at: "2026-10-16T22:38:01.664Z"
locked: false
unit: laws2000
week: laws2000-w10
title: Does this Security Council resolution bind the state — or authorise its use of force?
summary: "Reads a resolution paragraph by paragraph: decision or recommendation, art 25 and art 103, then whether any use of force rests on an express Chapter VII authorisation rather than a revived or implied one."
start: r1
concepts:
  - laws2000-w10-decisions-and-recommendations
  - laws2000-w10-security-council-composition-and-powers
  - laws2000-w10-authorisation-of-force-under-article-42
sources:
  - Week 10 - Lecture Slides - Collective Security and International Organisations (slides 10, 15–16, 25–31)
  - Week 10 - Lecture Transcript (Live) - Collective Security (Part A.1) (decisions and recommendations; art 103)
nodes:
  - id: r1
    kind: ask
    text: Is the paragraph relied on a decision, or only a recommendation?
    note: Read the wording, usually the verbs. One resolution often mixes both; art 39 itself says the Council "shall make recommendations, or decide". Borderline wording is debated.
    concept: laws2000-w10-decisions-and-recommendations
    branches:
      - label: A decision
        to: r2
      - label: Only a recommendation
        to: e-rec
  - id: r2
    kind: step
    text: It binds every UN member, however it voted and whether or not it sits on the Council (art 25).
    authorities:
      - un-charter-art-25
    next: r3
  - id: r3
    kind: ask
    text: Does carrying it out conflict with the state's obligations under another treaty?
    branches:
      - label: "Yes"
        to: r4
      - label: "No"
        to: r5
  - id: r4
    kind: step
    text: The Charter obligation prevails over the conflicting treaty obligation (art 103), whatever the treaty's date.
    authorities:
      - un-charter-art-103
    next: r5
  - id: r5
    kind: ask
    text: Is the state relying on the resolution to use force?
    branches:
      - label: "Yes"
        to: r6
      - label: "No"
        to: e-bound
  - id: r6
    kind: ask
    text: Does the resolution, acting under Chapter VII, expressly authorise force — e.g. "all necessary means" — for this purpose?
    note: "Art 42 is an exception to art 2(4) and a last resort. Authorisations name a purpose: restoring Kuwait's sovereignty (Res 678), humanitarian relief (Res 794), protecting civilians (Res 1973)."
    authorities:
      - un-charter-art-42
      - unsc-resolution-678
      - unsc-resolution-794
    branches:
      - label: "Yes"
        to: e-auth
      - label: No — only vaguer words, or an older resolution
        to: e-noauth
  - id: e-rec
    kind: end
    tone: not-met
    text: "Not binding: a recommendation is advice. The state breaks no Charter obligation by not following it, and art 103 does not apply."
  - id: e-bound
    kind: end
    tone: met
    text: The state must carry out the decision.
  - id: e-auth
    kind: end
    tone: met
    text: Force is authorised under art 42, within the stated purpose; outside it, art 2(4) applies.
  - id: e-noauth
    kind: end
    tone: not-met
    exception: true
    text: "No authorisation. Do not imply one from words like \"serious consequences\": the 2003 claim that Res 687 and 1441 revived Res 678 was rejected by most states and scholars."
    authorities:
      - un-charter-art-2-4
verify: false
---
