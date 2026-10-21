---
source-hash: 6d093c5ebf062104
generator-version: aids-1
generated-at: "2026-10-16T22:38:17.714Z"
locked: false
unit: laws2000
week: laws2000-w12
title: Does this state owe a human rights obligation to this person, for this harm?
summary: Checks the source of the obligation (treaty, custom, jus cogens), its reach (territory or jurisdiction, including abroad), and whose conduct caused the harm (vertical, horizontal, or an international organisation).
start: o1
concepts:
  - laws2000-w12-core-instruments-and-sources-of-obligation
  - laws2000-w12-scope-and-extraterritoriality
  - laws2000-w12-rights-holders-and-duty-bearers
sources:
  - Week 12 - Lecture Slides - International Human Rights Law (slides 10–11, 15–18)
  - "Week 12 - Revision Slides (Topic 3: art 53 VCLT)"
nodes:
  - id: o1
    kind: ask
    text: Is the state party to a treaty protecting the right?
    note: The nine core instruments (ICERD to the 2006 Conventions) or a regional treaty such as the ECHR or ACHR.
    branches:
      - label: "Yes"
        to: o3
      - label: "No"
        to: o2
  - id: o2
    kind: ask
    text: Is the norm also customary international law — e.g. the prohibitions of torture, genocide or racial discrimination?
    note: Custom binds without ratification; some customary human rights norms are considered jus cogens.
    concept: laws2000-w12-core-instruments-and-sources-of-obligation
    authorities:
      - vclt-art-53
    branches:
      - label: "Yes"
        to: o3
      - label: "No"
        to: e-unbound
  - id: o3
    kind: ask
    text: Was the person within the state's territory?
    note: Nationality and legal status are irrelevant (ICCPR art 2(1)).
    authorities:
      - iccpr-art-2-1
    branches:
      - label: "Yes"
        to: o5
      - label: No — abroad
        to: o4
  - id: o4
    kind: ask
    text: Was the person subject to the state's jurisdiction abroad — e.g. in territory it occupies?
    note: Wall (para 109); DRC v Uganda (para 216). The slides cite Lopez Burgos (para 12.3) for application even sometimes without effective control.
    concept: laws2000-w12-scope-and-extraterritoriality
    cases:
      - construction-of-a-wall-advisory-opinion
      - armed-activities-on-the-territory-of-the-congo-democratic-republic-of-the-congo-v-uganda
      - sergio-euben-lopez-burgos-v-uruguay
    branches:
      - label: "Yes"
        to: o5
      - label: "No"
        to: e-noreach
  - id: o5
    kind: ask
    text: Whose conduct caused the harm?
    concept: laws2000-w12-rights-holders-and-duty-bearers
    branches:
      - label: The state's own agents
        to: e-vertical
      - label: A private person or group
        to: o6
      - label: An international organisation
        to: e-io
  - id: o6
    kind: ask
    text: Did the state fail to protect — e.g. a lack of vigilance, or no domestic protection against the private actor?
    note: "GC 31 para 8: obligations are fully discharged only if individuals are protected against private persons or entities too. DRC v Uganda (para 179): lack of vigilance over rebels."
    authorities:
      - hrc-general-comment-31-para-8
    cases:
      - armed-activities-on-the-territory-of-the-congo-democratic-republic-of-the-congo-v-uganda
    branches:
      - label: "Yes"
        to: e-horizontal
      - label: No — it protected adequately
        to: e-protected
  - id: e-unbound
    kind: end
    tone: not-met
    text: "No obligation established: the state is not party to the treaty and the norm is not shown to be customary."
  - id: e-noreach
    kind: end
    tone: not-met
    text: "Outside the obligation's reach: the person was neither in the state's territory nor subject to its jurisdiction."
  - id: e-vertical
    kind: end
    tone: met
    text: "Vertical obligation engaged: the state answers for its own agents' violations."
  - id: e-horizontal
    kind: end
    tone: met
    text: "Horizontal obligation breached: the state failed to protect the person from the private actor."
  - id: e-protected
    kind: end
    tone: not-met
    text: "No breach by the state: the private actor does not breach the treaty itself — the Covenant is not a substitute for domestic criminal or civil law."
  - id: e-io
    kind: end
    tone: qualified
    exception: true
    text: "The organisation may be the duty bearer: international organisations are bound by general international law, their constitutions and their agreements (WHO–Egypt, para 37)."
    cases:
      - interpretation-of-the-agreement-of-25-march-1951-between-the-who-and-egypt
verify: false
---
