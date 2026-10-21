---
source-hash: 126ca43d73105a0d
generator-version: aids-1
generated-at: "2026-10-16T15:54:29.280Z"
locked: false
unit: laws2400
week: laws2400-w01
title: Is a trespass made out on the common elements?
summary: Walks the four elements every trespass shares — voluntary act, directness, actionable per se and fault — including who must prove fault.
start: n1
concepts:
  - laws2400-w01-intentional-torts-classification
  - laws2400-w01-trespass-voluntary-act-and-damage
  - laws2400-w01-trespass-directness
  - laws2400-w01-trespass-fault-and-onus
sources:
  - Topic 1 Lecture 2 (slides 16–24)
  - "Week 1.pdf (casebook): Hutchins v Maughan"
nodes:
  - id: n1
    kind: ask
    text: Was the defendant's conduct a positive, voluntary act?
    note: "Not positive acts (text p 45): an act during an epileptic fit, an act caused by the force of a third party, and a mere omission to act."
    concept: laws2400-w01-trespass-voluntary-act-and-damage
    branches:
      - label: "Yes"
        to: n2
      - label: "No"
        to: e1
  - id: e1
    kind: end
    tone: not-met
    text: "No trespass: the voluntary act element fails."
  - id: n2
    kind: ask
    text: Did the interference follow immediately from that act?
    note: Directness is often an issue of time. If the plaintiff or someone else had to intervene before harm resulted — the dogs brought to the baits in Hutchins v Maughan — the injury is consequential.
    concept: laws2400-w01-trespass-directness
    cases:
      - hutchins-v-maughan
    branches:
      - label: Yes, immediately
        to: n3
      - label: No, only after an intervening event
        to: e2
  - id: e2
    kind: end
    tone: not-met
    text: Not trespass. Consider an action on the case (e.g. negligence), where the plaintiff must prove damage and fault.
  - id: n3
    kind: step
    text: "No proof of damage is needed: trespass is actionable per se."
    note: The rationale is protecting bodily integrity, liberty and property. An action on the case, by contrast, requires proof of damage.
    concept: laws2400-w01-trespass-voluntary-act-and-damage
    next: n4
  - id: n4
    kind: ask
    text: Did the harm arise out of use of the highway (injury on it, or damage to property adjoining it)?
    note: The public has a right to use the highway, so road users and adjoining owners accept a risk and bear the onus of proof (text p 43).
    concept: laws2400-w01-trespass-fault-and-onus
    exception: true
    branches:
      - label: "Yes"
        to: n5
      - label: "No"
        to: n6
  - id: n5
    kind: step
    exception: true
    text: "Highway exception: the plaintiff must prove the defendant's fault."
    next: n7
  - id: n6
    kind: step
    text: The plaintiff has proved the direct interference; the onus shifts to the defendant to disprove fault.
    next: n8
  - id: n7
    kind: ask
    text: Can the plaintiff prove intention, recklessness or negligence?
    note: Intention and recklessness are subjective; negligence is objective — a reasonable person in the defendant's position. Intention need only go to the act itself.
    branches:
      - label: "Yes"
        to: e3
      - label: "No"
        to: e4
  - id: n8
    kind: ask
    text: Can the defendant prove the interference was an inevitable accident?
    note: "Intention need only go to the act: touching someone mistakenly thought to be your partner is still intentional, and the mistake is no defence (text p 46)."
    branches:
      - label: "Yes"
        to: e4
      - label: "No"
        to: e3
  - id: e3
    kind: end
    tone: met
    text: The common elements of trespass are made out. Now apply the particular trespass (person, land or goods) and any defences.
  - id: e4
    kind: end
    tone: not-met
    text: Fault is not established, so the trespass claim fails.
verify: false
---
