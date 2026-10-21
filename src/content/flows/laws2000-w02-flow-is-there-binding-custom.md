---
source-hash: b4dcc6fc80157eae
generator-version: aids-1
generated-at: "2026-10-16T15:59:58.212Z"
locked: false
unit: laws2000
week: laws2000-w02
title: Is this state bound by a rule of customary international law?
summary: "Follows the lecturer's flowchart: test practice (uniformity, generality, duration) and opinio juris, then ask whom the custom binds and whether the state persistently objected."
start: n1
concepts:
  - laws2000-w02-customary-international-law-elements
  - laws2000-w02-persistent-objector-and-particular-custom
sources:
  - Week 02 - Study Aid - Customary International Law Flowchart
  - Week 02 - Lecture Slides - Sources of International Law (slides 6–13)
  - Week 02 - Lecture Recording (Live) - Sources of International Law - Full Transcript (18:00–45:00)
nodes:
  - id: n1
    kind: ask
    text: Is there state practice that is uniform and consistent?
    note: States facing the same facts act the same way. Perfection is not required (Nicaragua [186]); 'so much uncertainty and contradiction' defeats it (Asylum).
    cases:
      - nicaragua-v-united-states-of-america
      - asylum-case-colombia-v-peru
    branches:
      - label: "Yes"
        to: n2
      - label: "No"
        to: n10
  - id: n2
    kind: ask
    text: Is the practice general — extensive, including specially affected states?
    note: Not every state must take part; the practice of states whose interests are specially affected (e.g. coastal states for sea rules) weighs heavily (North Sea [74]).
    cases:
      - north-sea-continental-shelf-cases
    branches:
      - label: "Yes"
        to: n3
      - label: "No"
        to: n10
  - id: n3
    kind: ask
    text: Has the practice lasted a significant period?
    note: There is no fixed period. A short time is not of itself a bar (North Sea [74]).
    branches:
      - label: "Yes"
        to: n4
      - label: No, it is very recent
        to: n3b
  - id: n3b
    kind: step
    exception: true
    text: "Possible 'instant custom' (flowchart): accept only if practice within the short period is extensive and virtually uniform."
    cases:
      - north-sea-continental-shelf-cases
    next: n4
  - id: n4
    kind: ask
    text: Is there opinio juris — do states act from a belief that the law requires it?
    note: "Not courtesy, convenience or tradition (North Sea [77]). Evidence: public statements, legal opinions, national court decisions, treaty provisions, failure to react (ILC Conclusion 10)."
    cases:
      - north-sea-continental-shelf-cases
    branches:
      - label: "Yes"
        to: n5
      - label: "No"
        to: n11
  - id: n5
    kind: step
    text: Customary international law is established.
    next: n6
  - id: n6
    kind: ask
    text: To whom does the custom apply?
    note: "Universal relevance: the entire international community. Specific regional significance or a specialised area: a regional or special custom (flowchart)."
    concept: laws2000-w02-persistent-objector-and-particular-custom
    branches:
      - label: Universal relevance
        to: n7
      - label: Only a region, or two states
        to: n12
  - id: n7
    kind: ask
    text: Did this state object from the very beginning of the rule's formation?
    note: Objecting midway, once the rule proves inconvenient, does not work.
    branches:
      - label: "Yes"
        to: n8
      - label: "No"
        to: n13
  - id: n8
    kind: ask
    text: Has it objected consistently and made its objection known to other states?
    note: Norway always rejected the UK's 10-mile rule and used its own baselines (Fisheries).
    cases:
      - fisheries-case-united-kingdom-v-norway
    branches:
      - label: "Yes"
        to: n9
      - label: "No"
        to: n13
  - id: n9
    kind: end
    tone: qualified
    exception: true
    text: "Not bound: a persistent objector (Fisheries). The rule still binds every other state."
    cases:
      - fisheries-case-united-kingdom-v-norway
  - id: n10
    kind: end
    tone: not-met
    text: "No customary rule: the practice is not uniform, consistent or general enough (Asylum)."
    cases:
      - asylum-case-colombia-v-peru
  - id: n11
    kind: end
    tone: not-met
    text: "No customary rule: practice without opinio juris is mere usage or courtesy (North Sea [77])."
    cases:
      - north-sea-continental-shelf-cases
  - id: n12
    kind: end
    tone: met
    text: "Particular custom: it binds only the states of that region or relationship (Right of Passage)."
    cases:
      - right-of-passage-over-indian-territory-portugal-v-india
  - id: n13
    kind: end
    tone: met
    text: The state is bound by the customary rule.
verify: false
---
