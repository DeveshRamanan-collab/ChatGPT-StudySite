---
source-hash: be6f1e829862f7f6
generator-version: aids-1
generated-at: "2026-10-16T16:00:01.237Z"
locked: false
unit: laws2400
week: laws2400-w02
title: Is there a trespass to the person — battery, assault or false imprisonment?
summary: Takes the general principles common to all three torts, then the elements of whichever tort the interference points to.
start: p1
concepts:
  - laws2400-w02-battery
  - laws2400-w02-assault
  - laws2400-w02-false-imprisonment
  - laws2400-w02-action-on-the-case-intentional-harm
sources:
  - Topic 2 Flowcharts - Trespass to the Person (Tort Law Principles 3e, pp 76-79) (pp 76–79)
  - Torts Topic 2 Lecture 1 (slides 6–24)
nodes:
  - id: p1
    kind: ask
    text: Did the defendant do a voluntary, positive act?
    note: Standing passively is no battery (Innes v Wylie). A failure to undo an earlier positive act can be one continuous act (Fagan). Words or a gesture can be the act in assault.
    cases:
      - innes-v-wylie
      - fagan-v-metropolitan-police-commissioner
    branches:
      - label: "Yes"
        to: p2
      - label: "No"
        to: px
  - id: p2
    kind: ask
    text: Did the interference follow directly from the act?
    note: Setting in motion a chain of events can be direct (Scott v Shepherd); so can directing or causing another person to detain the plaintiff (Coles Myer v Webster).
    cases:
      - scott-v-shepherd
    branches:
      - label: "Yes"
        to: p3
      - label: No, the harm was indirect
        to: pc
  - id: pc
    kind: end
    tone: qualified
    text: Not trespass. Consider an action on the case — malicious prosecution or intentional infliction of personal injury — where damage must be proved.
    concept: laws2400-w02-action-on-the-case-intentional-harm
  - id: p3
    kind: ask
    text: What did the act do to the plaintiff?
    note: "All three torts are actionable per se: no damage need be proved. Fault: except in highway cases the defendant must disprove intention or negligence."
    branches:
      - label: Touched her body
        to: b1
      - label: Made her expect imminent contact
        to: a1
      - label: Totally restrained her movement
        to: f1
  - id: b1
    kind: ask
    text: Was the contact unlawful — without consent or other lawful excuse, and beyond what is generally acceptable in everyday life?
    note: "Hostility is not required (Rixon v Star City). Contact through an object or substance counts (Binsaris: tear gas). Jostling in a crowd or a tap for attention is not unlawful."
    concept: laws2400-w02-battery
    cases:
      - rixon-v-star-city-pty-ltd
      - binsaris-v-northern-territory
    branches:
      - label: "Yes"
        to: bm
      - label: "No"
        to: px
  - id: bm
    kind: end
    tone: met
    text: Battery, unless the defendant proves the contact was neither intentional nor negligent.
  - id: a1
    kind: ask
    text: Would a reasonable person in the plaintiff's position have apprehended imminent harmful or offensive contact?
    note: Fear is not necessary; words alone can suffice. Imminent need not mean immediate (Zanker v Vartzokas), but there must be at least the possibility of contact.
    concept: laws2400-w02-assault
    cases:
      - zanker-v-vartzokas
    branches:
      - label: "Yes"
        to: a2
      - label: "No"
        to: px
  - id: a2
    kind: ask
    text: Did the defendant intend to create that apprehension?
    note: Intention to cause apprehension, not to carry out the battery (Rixon v Star City). The weight of Australian authority requires intention (but see dicta in NSW v McMaster).
    cases:
      - rixon-v-star-city-pty-ltd
      - nsw-v-mcmaster
    branches:
      - label: "Yes"
        to: am
      - label: "No"
        to: px
  - id: am
    kind: end
    tone: met
    text: Assault, unless there is a lawful justification.
  - id: f1
    kind: ask
    text: Was the restraint total — with no reasonable means of escape?
    note: "No walls needed: mental coercion or an assertion of authority can restrain (Symes v Mahon), even without the plaintiff knowing (Meering). Partial obstruction is not enough (Bird v Jones)."
    concept: laws2400-w02-false-imprisonment
    branches:
      - label: "Yes"
        to: f2
      - label: "No"
        to: px
  - id: f2
    kind: ask
    text: Was there a lawful justification, such as lawful authority or an accepted condition of entry?
    note: "Balmain New Ferry v Robertson: paying to leave the wharf was a condition of entry. A reasonable but mistaken belief in a right to detain is not a justification."
    cases:
      - balmain-new-ferry-v-robertson
      - ruddock-v-taylor
    exception: true
    branches:
      - label: "Yes"
        to: px
      - label: "No"
        to: fm
  - id: fm
    kind: end
    tone: met
    text: False imprisonment, unless the defendant proves the restraint was neither intentional nor negligent.
  - id: px
    kind: end
    tone: not-met
    text: This trespass to the person is not made out on these facts.
verify: false
---
