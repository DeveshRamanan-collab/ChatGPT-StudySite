---
source-hash: f1e02e5b45c9dfb5
generator-version: aids-1
generated-at: "2026-10-16T22:00:44.197Z"
locked: false
unit: laws2000
week: laws2000-w04
title: Has a state acquired title to this territory?
summary: Sorts a territorial claim into the five modes of acquisition — accretion, terra nullius, cession, prescription and the prohibited conquest — and tests each.
start: t1
concepts:
  - laws2000-w04-modes-of-territorial-acquisition
sources:
  - Week 04 - Lecture Slides - Subjects of International Law and Statehood (slides 34–42)
  - Week 04 - Lecture Recording (Online) - Subjects of International Law and Statehood - Full Transcript (00:00–15:00)
nodes:
  - id: t1
    kind: ask
    text: Is the land newly formed?
    branches:
      - label: Yes — new land
        to: t2
      - label: No — it already existed
        to: t3
  - id: t2
    kind: ask
    text: Was it naturally formed, and is it above water at high tide?
    note: UNCLOS art 121(1). Artificial islands are not islands and have no territorial sea (art 60(8)); building on a feature does not change its status (South China Sea arbitration).
    cases:
      - south-china-sea-arbitration-philippines-v-china
    authorities:
      - unclos-art-121-1
      - unclos-art-60
    branches:
      - label: "Yes"
        to: e-accretion
      - label: No — artificial, or submerged at high tide
        to: e-no-island
  - id: t3
    kind: ask
    text: Was the land ever under any state's sovereignty?
    branches:
      - label: No — terra nullius
        to: t4
      - label: Yes — another state's territory
        to: t5
  - id: t4
    kind: ask
    text: Did the claimant exercise effective control with an intention to obtain title?
    note: Barely applicable today, since almost all land has been claimed, but central to colonial expansion.
    branches:
      - label: "Yes"
        to: e-terra
      - label: "No"
        to: e-none
  - id: t5
    kind: ask
    text: How did the claimant come to control it?
    branches:
      - label: By agreement with the sovereign
        to: e-cession
      - label: By force
        to: e-conquest
      - label: By peaceful control over time
        to: t6
  - id: t6
    kind: ask
    text: Did the claimant control it peacefully, acting as sovereign?
    note: No force or aggression; it must take over the territory and act as if it were its own.
    branches:
      - label: "Yes"
        to: t7
      - label: "No"
        to: e-none
  - id: t7
    kind: ask
    text: Did the original sovereign protest and object?
    note: Prescription rests on implied consent. How much control, and what form protest must take, remain unresolved.
    branches:
      - label: Sustained protests
        to: e-none
      - label: No protest
        to: e-prescription
  - id: e-accretion
    kind: end
    tone: met
    text: Title by accretion where the new land forms within the state's territory or territorial sea (Japan's 1986 volcanic island).
  - id: e-no-island
    kind: end
    tone: not-met
    text: "No title: an artificial island or low-tide elevation cannot ground a sovereignty claim."
    authorities:
      - unclos-art-121-1
      - unclos-art-60
  - id: e-terra
    kind: end
    tone: met
    text: Title by occupation of terra nullius.
  - id: e-cession
    kind: end
    tone: qualified
    text: Title by cession — but no more rights than the ceding state had, subject to third states' and indigenous rights (Alaska 1867).
  - id: e-conquest
    kind: end
    tone: not-met
    exception: true
    text: "No title: conquest is prohibited since 1945 (art 2(4)). Belligerent occupation applies — temporary, no transfer of sovereignty."
    authorities:
      - un-charter-art-2-4
  - id: e-prescription
    kind: end
    tone: qualified
    text: Title by prescription, on the old sovereign's implied consent — a controversial mode with unresolved questions.
  - id: e-none
    kind: end
    tone: not-met
    text: No title passes on these facts.
verify: false
---
