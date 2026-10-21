---
source-hash: f485344b8b6ef646
generator-version: aids-1
generated-at: "2026-10-16T22:37:55.886Z"
locked: false
unit: laws2000
week: laws2000-w08
title: Can the ICJ decide this contentious case?
summary: "Follows the slides' route from dispute to judgment: access, the existence of a dispute at filing, a consent route under art 36, urgent protection, and what the judgment binds."
start: j1
concepts:
  - laws2000-w08-icj-jurisdiction-and-consent
  - laws2000-w08-existence-of-a-dispute
  - laws2000-w08-provisional-measures
  - laws2000-w08-icj-cases-and-effect-of-decisions
sources:
  - Week 08 - Lecture Slides - International Dispute Settlement (slides 9–12, 30–36)
  - Week 08 - Tutorial Tasks - International Dispute Settlement (questions 1–2)
nodes:
  - id: j1
    kind: ask
    text: Are both parties states?
    note: Only states may be parties (art 34). International organisations, including the UN, may only request advisory opinions; NGOs and individuals have no access.
    authorities:
      - icj-statute-art-34
    branches:
      - label: "Yes"
        to: j2
      - label: "No"
        to: e-no-access
  - id: j2
    kind: ask
    text: Did a legal dispute exist on the date proceedings were instituted?
    note: The applicant's claim positively opposed by the respondent, which was aware or could not have been unaware of it — judged objectively from the facts.
    concept: laws2000-w08-existence-of-a-dispute
    cases:
      - south-west-africa-ethiopia-v-south-africa-liberia-v-south-africa
      - interpretation-of-peace-treaties-with-bulgaria-hungary-and-romania
    branches:
      - label: "Yes"
        to: j3
      - label: "No"
        to: e-no-dispute
  - id: j3
    kind: ask
    text: Which consent route do the facts supply?
    note: The ICJ has no compulsory jurisdiction; consent may cover the specific case or a category of disputes it falls within.
    concept: laws2000-w08-icj-jurisdiction-and-consent
    authorities:
      - icj-statute-art-36
    branches:
      - label: A special agreement (compromis)
        to: j5
      - label: A treaty clause referring disputes to the Court
        to: j4
      - label: Art 36(2) declarations by both states
        to: j5
      - label: The respondent accepted after the application was filed
        to: j5
      - label: None of these
        to: e-no-consent
  - id: j4
    kind: ask
    text: Does the clause cover this dispute, and are its conditions met — for example, that other means have failed?
    note: "E.g. art IX of the Genocide Convention: disputes on its interpretation, application or fulfilment go to the ICJ at the request of any party."
    authorities:
      - genocide-convention-art-ix
    branches:
      - label: "Yes"
        to: j5
      - label: "No"
        to: e-no-consent
  - id: j5
    kind: step
    text: Jurisdiction is established — if the parties disagree, the Court decides (art 36(6)). Written and oral proceedings follow.
    authorities:
      - icj-statute-art-36
    next: j6
  - id: j6
    kind: ask
    text: Is there a real and imminent risk of irreparable harm to the rights in dispute before judgment?
    concept: laws2000-w08-provisional-measures
    branches:
      - label: "Yes"
        to: j7
      - label: "No"
        to: e-judgment
  - id: j7
    kind: step
    text: Seek provisional measures under art 41 — binding if indicated (LaGrand).
    cases:
      - lagrand-case-germany-v-united-states-of-america
    authorities:
      - icj-statute-art-41
    next: e-judgment
  - id: e-no-access
    kind: end
    tone: not-met
    text: "No contentious case: only states may be parties before the ICJ."
  - id: e-no-dispute
    kind: end
    tone: not-met
    text: "No jurisdiction: no dispute existed at the date proceedings were instituted."
  - id: e-no-consent
    kind: end
    tone: not-met
    text: "No jurisdiction: the respondent has not consented to this dispute. The parties remain bound to seek peaceful settlement by other means."
  - id: e-judgment
    kind: end
    tone: met
    text: "Judgment on the merits: final and without appeal (art 60), binding on the parties only (art 59); non-compliance can be taken to the Security Council (art 94)."
    authorities:
      - icj-statute-art-60
      - icj-statute-art-59
      - un-charter-art-94
verify: false
---
