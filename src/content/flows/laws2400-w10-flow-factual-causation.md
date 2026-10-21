---
source-hash: da7eceb72388b108
generator-version: aids-1
generated-at: "2026-10-16T22:01:02.857Z"
locked: false
unit: laws2400
week: laws2400-w10
title: Is factual causation established?
summary: "Follows the textbook causation flowcharts (Causation 1–3): damage, the common law and statutory columns, the gap cases and the s 5D(2) route, ending at scope of liability."
start: c1
concepts:
  - laws2400-w10-causation-flowchart
  - laws2400-w10-factual-causation-necessary-condition
  - laws2400-w10-multiple-sufficient-causes-and-material-contribution
  - laws2400-w10-s5d2-exceptional-cases
sources:
  - Topic 10 Flowcharts (pp 433–435)
  - Topic 10 Lecture 1 (slides 4, 13–21)
  - Topic 10 Lecture 2 (slides 14–15)
nodes:
  - id: c1
    kind: ask
    text: Has the plaintiff suffered damage?
    note: "Damage, not damages: some harm to the plaintiff. Damage is the gist of the negligence action: no damage, no action."
    branches:
      - label: "Yes"
        to: c2
      - label: "No"
        to: e-nodamage
  - id: c2
    kind: ask
    text: Does the Civil Liability Act govern the claim?
    note: Usually yes for negligence. Section 3B(1) excludes some claims, eg dust disease and tobacco claims, which go under special statutes such as the Dust Diseases Tribunal Act 1989 (NSW).
    authorities:
      - civil-liability-act-2002-nsw-s3b
    branches:
      - label: "Yes: legislation column"
        to: c3
      - label: "No: common law column"
        to: c4
  - id: c3
    kind: ask
    text: Was the defendant's fault a necessary condition of the occurrence of the plaintiff's harm (s 5D(1)(a))?
    note: A statutory statement of the 'but for' test (Strong v Woolworths). The plaintiff proves it on the balance of probabilities (s 5E); 'might have' made a difference is not enough (Adeels Palace).
    concept: laws2400-w10-factual-causation-necessary-condition
    cases:
      - strong-v-woolworths-ltd-tas-big-w
      - adeels-palace-v-moubarak
    authorities:
      - civil-liability-act-2002-nsw-s5d
      - civil-liability-act-2002-nsw-s5e
    branches:
      - label: "Yes"
        to: e-sat
      - label: "No"
        to: e-not
      - label: It cannot be established either way
        to: c5
  - id: c4
    kind: ask
    text: Would the plaintiff's injuries have been suffered but for the defendant's negligence?
    note: "Mind the mirror image: here 'No' means satisfied. In Barnett the deceased would have died even with timely treatment, so the answer was 'Yes' and causation failed."
    concept: laws2400-w10-factual-causation-necessary-condition
    cases:
      - barnett-v-chelsea-and-kensington-hospital
    branches:
      - label: "No"
        to: e-sat
      - label: "Yes"
        to: e-not
      - label: The test gives an unsatisfactory result
        to: e-common
  - id: c5
    kind: ask
    text: "Is it an appropriate kind of case: multiple sufficient causes, or material contribution to harm?"
    note: "Multiple sufficient causes: cumulative factors whose individual contributions are unascertainable (Bonnington; March). Material contribution: negligence materially increasing the risk where science cannot prove the cause (Fairchild; McGee; Amaca v Ellis; Henville)."
    concept: laws2400-w10-multiple-sufficient-causes-and-material-contribution
    cases:
      - bonnington-castings-v-wardlaw
      - fairchild-v-glenhaven-funeral-services-ltd
      - mcgee-v-national-coal-board
    branches:
      - label: "Yes"
        to: c6
      - label: "No"
        to: e-not
  - id: c6
    kind: ask
    text: Is there both a clear breach and an evidentiary gap?
    note: The flowchart requires both for the s 5D(2) route. The gap must be in the evidence of causation; s 5D(2) does not help prove breach.
    branches:
      - label: Yes, both
        to: c7
      - label: Not both
        to: e-not
  - id: c7
    kind: step
    text: Consider whether and why responsibility for the harm should be imposed on the negligent party (s 5D(2)).
    note: Amongst other relevant things, and in accordance with established principles. The flowchart also asks whether the harm should be left to lie where it fell; that limb is not in the NSW text.
    concept: laws2400-w10-s5d2-exceptional-cases
    authorities:
      - civil-liability-act-2002-nsw-s5d
    next: c8
  - id: c8
    kind: ask
    text: Is this an exceptional case in which factual causation should be accepted?
    note: Rarely applied, so its operation is uncertain. In Adeels Palace it would have been 'contrary to established principles' to hold the club responsible where security only 'might have' prevented the harm.
    exception: true
    cases:
      - adeels-palace-v-moubarak
    branches:
      - label: "Yes"
        to: e-5d2
      - label: "No"
        to: e-not
  - id: e-nodamage
    kind: end
    tone: not-met
    text: "No action in negligence: there is no damage."
  - id: e-sat
    kind: end
    tone: met
    text: "Factual causation satisfied: move to scope of liability (s 5D(1)(b)), new intervening acts and remoteness."
  - id: e-not
    kind: end
    tone: not-met
    text: "Factual causation not satisfied: the claim fails on causation."
  - id: e-5d2
    kind: end
    tone: qualified
    exception: true
    text: Factual causation accepted under s 5D(2) as an exceptional case; scope of liability must still be satisfied.
  - id: e-common
    kind: end
    tone: qualified
    text: "A common law gap case: use the cases (Cook v Lewis, market share liability; Bonnington, Amaca v Booth). Walk the risk-or-contribution flow for dust disease claims."
verify: false
---
