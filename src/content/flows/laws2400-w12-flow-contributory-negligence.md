---
source-hash: 05a2ab1c9024a0be
generator-version: aids-1
generated-at: "2026-10-16T22:20:27.944Z"
locked: false
unit: laws2400
week: laws2400-w12
title: Are the plaintiff's damages reduced for contributory negligence?
summary: "Follows the textbook flowchart Defences to Negligence 2: the s 50 intoxication presumption first, then the s 5R standard, the agony of the moment, the causal requirement and the just and equitable reduction."
start: k1
concepts:
  - laws2400-w12-defences-to-negligence-flowchart
  - laws2400-w12-intoxicated-plaintiff-cla-s50
  - laws2400-w12-contributory-negligence-apportionment-and-standard
  - laws2400-w12-contributory-negligence-employees-emergencies-rescuers
sources:
  - Topic 12 Flowcharts (p 478)
  - Civil Liability Act 2002 (NSW) ss 5R, 50
nodes:
  - id: k1
    kind: ask
    text: Was the plaintiff intoxicated, so that their capacity to exercise reasonable care and skill was impaired?
    note: Intoxicated means under the influence of alcohol or a drug, whether or not taken medicinally or lawfully (s 48). This is the trigger for s 50(1).
    concept: laws2400-w12-intoxicated-plaintiff-cla-s50
    authorities:
      - civil-liability-act-2002-nsw-s50
    branches:
      - label: "Yes"
        to: k2
      - label: "No"
        to: k5
  - id: k2
    kind: ask
    text: Was the intoxication self-induced?
    note: Section 50 does not apply where the court is satisfied the intoxication was not self-induced (s 50(5)).
    authorities:
      - civil-liability-act-2002-nsw-s50
    branches:
      - label: "Yes"
        to: k3
      - label: "No: not self-induced"
        to: k5
  - id: k3
    kind: ask
    text: Is the harm likely to have occurred even if the plaintiff had not been intoxicated?
    note: "Section 50(2): a court is not to award damages unless satisfied of this (the same harm or some other harm)."
    authorities:
      - civil-liability-act-2002-nsw-s50
    branches:
      - label: "Yes"
        to: k4
      - label: "No"
        to: e-nodamages
  - id: k4
    kind: ask
    text: Is the court satisfied that the intoxication did not contribute in any way to the cause?
    note: If not, contributory negligence is presumed (s 50(3)).
    authorities:
      - civil-liability-act-2002-nsw-s50
    branches:
      - label: "No"
        to: e-presumed
      - label: "Yes"
        to: k5
  - id: k5
    kind: ask
    text: Did the plaintiff fail to take precautions that a reasonable person in their position would have taken, on what they knew or ought to have known (s 5R)?
    note: At work, inattention bred of familiarity and repetition, urgency and preoccupation with the task may be taken into account (McLean v Tedman; Staveley Iron v Jones).
    concept: laws2400-w12-contributory-negligence-apportionment-and-standard
    cases:
      - mclean-v-tedman
      - staveley-iron-and-chemical-co-v-jones
    authorities:
      - civil-liability-act-2002-nsw-s5r
    branches:
      - label: "Yes"
        to: k6
      - label: "No"
        to: e-none
  - id: k6
    kind: ask
    text: Can the plaintiff's action be justified in a situation of perceived emergency?
    note: "The agony of the moment: conduct that looks careless for one's own safety may not amount to contributory negligence (Avram v Gusakoski; Caterson v Commissioner for Railways)."
    exception: true
    concept: laws2400-w12-contributory-negligence-employees-emergencies-rescuers
    cases:
      - avram-v-gusakoski
      - caterson-v-commissioner-for-railways
    branches:
      - label: "No"
        to: k7
      - label: "Yes"
        to: e-none
  - id: k7
    kind: ask
    text: Is there a causal link between the plaintiff's lack of care for their own safety and their injury?
    note: Caswell v Powell Duffryn Associated Collieries; ordinary principles of causation apply.
    cases:
      - caswell-v-powell-duffryn-associated-collieries
    branches:
      - label: "Yes"
        to: k8
      - label: "No"
        to: e-none
  - id: k8
    kind: step
    text: Examine the whole conduct of each negligent party and their relative blameworthiness, and set the reduction that is just and equitable.
    note: "Pennington v Norris; Law Reform (Miscellaneous Provisions) Act 1965 (NSW) s 9(1): 'just and equitable having regard to [their] share in the responsibility for the damage'. In NSW the reduction can be 100% (CLA s 5S)."
    cases:
      - pennington-v-norris
    authorities:
      - law-reform-miscellaneous-provisions-act-1965-nsw-s9
    next: e-reduced
  - id: e-nodamages
    kind: end
    tone: qualified
    exception: true
    text: "No damages at all: s 50(2) is not satisfied."
  - id: e-presumed
    kind: end
    tone: met
    text: "Contributory negligence presumed: damages reduced by 25% or a greater percentage the court thinks appropriate (s 50(4))."
  - id: e-reduced
    kind: end
    tone: met
    text: "Contributory negligence established: damages reduced by the just and equitable share."
  - id: e-none
    kind: end
    tone: not-met
    text: No reduction for contributory negligence.
verify: false
---
