---
source-hash: db55e7ba8830869b
generator-version: aids-1
generated-at: "2026-10-16T15:54:25.784Z"
locked: false
unit: laws2000
week: laws2000-w01
title: Is a state bound by this rule of international law?
summary: "Walks the Lotus test: a rule binds a state only if the state's own will is expressed in a treaty or an accepted usage; otherwise no restriction is presumed."
start: n1
concepts:
  - laws2000-w01-defining-international-law
  - laws2000-w01-sovereign-equality-and-consent
  - laws2000-w01-compliance-and-enforcement
sources:
  - Week 01 - Lecture Slides - What Is Public International Law (slides 10, 19–20)
  - Week 01 - Lecture Recording (Online) - Introduction to International Law - Full Transcript (05:41–06:06, 19:51–21:30)
  - Week 01 - Lecture Recording (Live) - What Is Public International Law - Full Transcript (21:17–23:38, 44:00–45:30)
nodes:
  - id: n1
    kind: ask
    text: Is the rule set out in a treaty (a 'convention' in Lotus terms)?
    note: "Lotus: binding rules emanate from states' free will \"as expressed in conventions or by usages generally accepted as expressing principles of law\"."
    cases:
      - ss-lotus-france-v-turkey
    branches:
      - label: "Yes"
        to: n2
      - label: "No"
        to: n4
  - id: n2
    kind: ask
    text: Has this state consented to the treaty, for example by ratifying it?
    note: No state can compel another to sign up to a treaty. Consent is given state by state, so states end up with different obligations.
    concept: laws2000-w01-sovereign-equality-and-consent
    branches:
      - label: "Yes"
        to: n3
      - label: No, it never ratified
        to: n4
  - id: n3
    kind: step
    text: "The treaty binds the state: its express consent supplies the binding force."
    next: n9
  - id: n4
    kind: ask
    text: Is there a general practice of states, followed in the belief that it is legally binding (a 'usage')?
    note: "Customary international law: general state practice plus a belief that the practice is law — consent given implicitly. Its two elements are tested in Week 2."
    concept: laws2000-w01-international-law-as-living-process
    branches:
      - label: "Yes"
        to: n5
      - label: "No"
        to: n6
  - id: n5
    kind: step
    text: The customary rule binds the state through implicit consent (test both elements in Week 2).
    next: n9
  - id: n6
    kind: ask
    text: Is the claimed rule only a General Assembly declaration or resolution?
    note: The General Assembly has only a consultative role and cannot create binding obligations; its declarations can build momentum that states later turn into treaties.
    branches:
      - label: "Yes"
        to: n7
      - label: No, there is simply no rule
        to: n8
  - id: n7
    kind: end
    tone: not-met
    exception: true
    text: Not binding as such — unless states later turn it into a treaty or it comes to reflect accepted custom.
  - id: n8
    kind: end
    tone: not-met
    text: "No restriction: under Lotus, restrictions upon a state's independence \"cannot therefore be presumed\", so the state is free to act."
    cases:
      - ss-lotus-france-v-turkey
  - id: n9
    kind: end
    tone: met
    text: "Bound — whether or not the rule can be enforced: enforcement is irrelevant to binding quality; compliance rests on reputation and quasi-enforcement."
    concept: laws2000-w01-compliance-and-enforcement
    authorities:
      - un-charter-arts-5-6
verify: false
---
