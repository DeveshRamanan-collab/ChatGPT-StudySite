---
source-hash: 94f70cd7548637f6
generator-version: aids-1
generated-at: "2026-10-16T16:09:38.727Z"
locked: false
unit: laws2400
week: laws2400-w03
title: Is there an actionable nuisance — public or private?
summary: Separates nuisance from trespass, then takes the elements of public or private nuisance, the defences and the remedy.
start: n1
concepts:
  - laws2400-w03-public-nuisance
  - laws2400-w03-private-nuisance-elements
  - laws2400-w03-nuisance-defences-remedies
sources:
  - Torts Topic 3 Lecture 1 (slides 19–26)
  - Topic 3 Lecture 2 (slides 2–16)
nodes:
  - id: n1
    kind: ask
    text: Is the complaint an interference with the use or enjoyment of land, rather than a direct entry onto it?
    note: "Nuisance need not be direct or physical: smell, noise, polluted water or air, water overflow, loud music, tree roots. A direct entry points to trespass to land."
    branches:
      - label: "Yes"
        to: n2
      - label: No, a direct entry
        to: nt
  - id: nt
    kind: end
    tone: qualified
    text: Consider trespass to land instead.
    concept: laws2400-w03-trespass-to-land-decision-flow
  - id: n2
    kind: ask
    text: Does it affect the public at large, or a particular occupier's land?
    branches:
      - label: "The public: a right common to all"
        to: p1
      - label: A particular occupier
        to: v1
  - id: p1
    kind: ask
    text: Did the plaintiff suffer special or particular damage, different from the public generally?
    note: "Not limited to money: substantial delay and inconvenience, dissimilar to the public's, may suffice (Walsh v Ervin). Otherwise public nuisance is for the state."
    concept: laws2400-w03-public-nuisance
    cases:
      - walsh-v-ervin
    branches:
      - label: "Yes"
        to: p2
      - label: "No"
        to: nx
  - id: p2
    kind: ask
    text: Was the interference with the public right substantial and unreasonable?
    note: Not every annoyance, discomfort or inconvenience counts; a temporary obstruction of a highway may fall short.
    branches:
      - label: "Yes"
        to: d1
      - label: "No"
        to: nx
  - id: v1
    kind: ask
    text: Does the plaintiff have a proprietary interest — owner, or tenant in actual possession?
    note: A licensee cannot sue (Oldham v Lawson (No 1)); Hunter v Canary Wharf overruled Khorasandjian v Bush.
    concept: laws2400-w03-private-nuisance-elements
    cases:
      - oldham-v-lawson-no-1
      - hunter-v-canary-wharf
    branches:
      - label: "Yes"
        to: v2
      - label: "No"
        to: nx
  - id: v2
    kind: ask
    text: Is the interference substantial and unreasonable to an ordinary person in the plaintiff's position?
    note: Weigh frequency, duration, time, locality, distance (Munro v Southern Dairies). Malice may count (Hollywood Silver Fox Farm); being overlooked or lawful competition does not (Victoria Park Racing).
    cases:
      - munro-v-southern-dairies
      - hollywood-silver-fox-farm-v-emmett
      - victoria-park-racing-and-recreation-grounds-co-v-taylor
    branches:
      - label: "Yes"
        to: v3
      - label: "No"
        to: nx
  - id: v3
    kind: ask
    text: Did the defendant create, authorise or continue the state of affairs?
    note: The creator is liable even if not the occupier; an occupier who authorises it; or one who neglects to remedy it after becoming, or when they should have become, aware of it.
    branches:
      - label: "Yes"
        to: d1
      - label: "No"
        to: nx
  - id: d1
    kind: ask
    text: Does a defence apply — prescription, the plaintiff's conduct or consent, statutory authorisation, or contributory negligence?
    note: Prescription needs more than 20 years. Statutory authorisation needs the activity to be impossible without the nuisance. Coming to the nuisance is no defence.
    concept: laws2400-w03-nuisance-defences-remedies
    exception: true
    branches:
      - label: "Yes"
        to: dq
      - label: "No"
        to: nm
  - id: dq
    kind: end
    tone: qualified
    text: "A defence is in play: the claim turns on whether it is made out on the facts."
  - id: nm
    kind: end
    tone: met
    text: "Nuisance is actionable. Remedies: damages for foreseeable harm, an injunction where damages are inadequate or recurrence is likely, or cautious abatement."
  - id: nx
    kind: end
    tone: not-met
    text: No actionable nuisance on these facts.
verify: false
---
