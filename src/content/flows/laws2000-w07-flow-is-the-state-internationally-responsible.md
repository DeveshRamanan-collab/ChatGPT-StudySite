---
source-hash: 4363fab6326c5536
generator-version: aids-1
generated-at: "2026-10-16T22:37:52.764Z"
locked: false
unit: laws2000
week: laws2000-w07
title: Is the state internationally responsible, and who can invoke it?
summary: Walks the slides' five steps — primary obligation, breach, attribution, grounds precluding wrongfulness, consequences — and ends with who may invoke responsibility.
start: r1
concepts:
  - laws2000-w07-framework-of-state-responsibility
  - laws2000-w07-breach-of-an-international-obligation
  - laws2000-w07-circumstances-precluding-wrongfulness
  - laws2000-w07-cessation-and-reparation
  - laws2000-w07-invocation-of-responsibility
sources:
  - Week 07 - Lecture Slides - State Responsibility (slide 37)
  - Week 07 - Lecture Recording (Online) - State Responsibility - Full Transcript (37:00–40:00)
  - Week 07 - Tutorial Task - State Responsibility
nodes:
  - id: r1
    kind: ask
    text: Is there a primary international obligation — treaty or custom — that bound the state when it acted?
    note: The source does not matter (art 12), but a purely domestic obligation does not count, and there is no retroactivity (arts 13–14; Chagos).
    cases:
      - chagos-islands-case
    authorities:
      - arsiwa-art-12
      - arsiwa-arts-13-14
    branches:
      - label: "Yes"
        to: r2
      - label: "No"
        to: e-none
  - id: r2
    kind: ask
    text: On the facts, is there a prima facie breach — an act, an omission, or a composite of acts?
    note: "Omissions count: Iran's failure to protect the embassy (Tehran); Albania's failure to warn of mines (Corfu Channel). Several acts may add up (art 15)."
    concept: laws2000-w07-breach-of-an-international-obligation
    cases:
      - united-states-diplomatic-and-consular-staff-in-tehran-united-states-of-america-v-iran
      - corfu-channel-case-united-kingdom-v-albania
    authorities:
      - arsiwa-art-2
      - arsiwa-art-15
    branches:
      - label: "Yes"
        to: r3
      - label: "No"
        to: e-none
  - id: r3
    kind: ask
    text: Is the conduct attributable to the state (arts 4–11)?
    note: Organ, empowered entity, lent organ, ultra vires conduct, instructions or effective control, a successful insurgency, or adoption. Use the attribution flow.
    concept: laws2000-w07-attribution-to-the-state
    branches:
      - label: "Yes"
        to: r4
      - label: "No"
        to: e-not-attributable
  - id: r4
    kind: ask
    text: Do the facts raise a circumstance precluding wrongfulness — consent, self-defence, countermeasures, force majeure, distress or necessity?
    concept: laws2000-w07-circumstances-precluding-wrongfulness
    branches:
      - label: "Yes"
        to: r5
      - label: "No"
        to: r6
  - id: r5
    kind: ask
    text: Is every condition of that ground met, and does the act respect peremptory norms (art 26)?
    note: E.g. countermeasures must be proportional (Gabčíkovo-Nagymaros); force majeure needs absolute and material impossibility (Rainbow Warrior); necessity is read narrowly (the Wall).
    cases:
      - gabcikovo-nagymaros-project-hungary-v-slovakia
      - rainbow-warrior-case
      - construction-of-a-wall-advisory-opinion
    authorities:
      - arsiwa-art-26
    branches:
      - label: "Yes"
        to: e-precluded
      - label: "No"
        to: r6
  - id: r6
    kind: step
    text: An internationally wrongful act is established (art 2), and the state is responsible for it (art 1).
    authorities:
      - arsiwa-art-1
      - arsiwa-art-2
    next: r7
  - id: r7
    kind: step
    text: "Consequences: cease a continuing act and give assurances of non-repetition if required (art 30); make full reparation by restitution, compensation or satisfaction (arts 31, 35–37)."
    note: Reparation must, as far as possible, wipe out all the consequences of the illegal act (Factory at Chorzów).
    concept: laws2000-w07-cessation-and-reparation
    cases:
      - factory-at-chorzow
    authorities:
      - arsiwa-art-30
      - arsiwa-art-31
      - arsiwa-arts-35-37
    next: r8
  - id: r8
    kind: ask
    text: Was the obligation owed to the state that wants to invoke responsibility?
    concept: laws2000-w07-invocation-of-responsibility
    branches:
      - label: "Yes"
        to: e-injured
      - label: No — but it was owed to a group with a collective interest, or to all states
        to: e-art48
      - label: No — it was owed only to another state
        to: e-no-standing
  - id: e-none
    kind: end
    tone: not-met
    text: "No internationally wrongful act: no binding international obligation has been breached."
  - id: e-not-attributable
    kind: end
    tone: not-met
    text: "No state responsibility for this conduct: it is not the state's. Check whether the state itself breached a duty by omission, such as failing to protect or to warn."
  - id: e-precluded
    kind: end
    tone: not-met
    text: "Wrongfulness is precluded: the breach is excused, so cessation and reparation do not follow."
  - id: e-injured
    kind: end
    tone: met
    text: The injured state may invoke responsibility (art 42) and demand cessation, reparation and so on.
    authorities:
      - arsiwa-art-42
  - id: e-art48
    kind: end
    tone: qualified
    exception: true
    text: A non-injured state may invoke responsibility — but only in these very limited circumstances (art 48; Barcelona Traction).
    cases:
      - barcelona-traction-case-belgium-v-spain
    authorities:
      - arsiwa-art-48
  - id: e-no-standing
    kind: end
    tone: not-met
    text: This state cannot invoke responsibility; the state to which the obligation was owed can.
verify: false
---
