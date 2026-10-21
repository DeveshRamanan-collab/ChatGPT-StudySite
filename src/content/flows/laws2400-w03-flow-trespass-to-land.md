---
source-hash: 94f70cd7548637f6
generator-version: aids-1
generated-at: "2026-10-16T16:09:38.727Z"
locked: false
unit: laws2400
week: laws2400-w03
title: Is a trespass to land made out, and what remedy follows?
summary: Walks the flowchart's general principles in order — possession, land, direct invasion, fault, lawful authority — then chooses a remedy.
start: t1
concepts:
  - laws2400-w03-trespass-to-land-decision-flow
  - laws2400-w03-trespass-to-land-elements
  - laws2400-w03-trespass-to-land-scope
  - laws2400-w03-implied-licence
  - laws2400-w03-remedies-trespass-to-land
sources:
  - Topic 3 Flowcharts - Trespass to Land (Tort Law Principles 3e, p 142)
  - Torts Topic 3 Lecture 1 (slides 5–18)
nodes:
  - id: t1
    kind: ask
    text: Did the plaintiff have exclusive possession when the interference happened?
    note: By title with actual possession, by lease, or by adverse possession. Licences typically do not confer it. Ownership is not needed (Newington v Windeyer).
    concept: laws2400-w03-trespass-to-land-scope
    cases:
      - newington-v-windeyer
    branches:
      - label: "Yes"
        to: t2
      - label: "No"
        to: tx
  - id: t2
    kind: ask
    text: Was it land — soil, fixtures, subsoil, or airspace within the height needed for ordinary use?
    note: An aircraft several hundred feet up is no trespass (Bernstein v Skyviews); a sign 24 cm into the airspace is (Kelsen); so is encroaching scaffolding (LJP Investments).
    cases:
      - bernstein-v-skyviews
      - kelsen-v-imperial-tobacco-co
      - ljp-investments-v-howard-chia-investments
    branches:
      - label: "Yes"
        to: t3
      - label: "No"
        to: tx
  - id: t3
    kind: ask
    text: Was the invasion or interference direct?
    note: Entering, driving on, throwing objects or animals onto land, encroaching structures, exceeding a licence or staying after its revocation. Indirect interference (noise, smell) is not trespass.
    concept: laws2400-w03-trespass-to-land-elements
    branches:
      - label: "Yes"
        to: t4
      - label: No, it was indirect
        to: tn
  - id: tn
    kind: end
    tone: qualified
    text: Not trespass. An indirect interference may be private nuisance.
    concept: laws2400-w03-private-nuisance-elements
  - id: t4
    kind: ask
    text: Was the act intentional or negligent?
    note: The defendant need not intend to trespass; mistake is generally no defence. Outside highway cases the defendant must disprove fault. Involuntary conduct utterly without fault is not actionable.
    branches:
      - label: "Yes"
        to: t5
      - label: No, utterly without fault
        to: tx
  - id: t5
    kind: ask
    text: Did the defendant have consent, an implied licence or other lawful authority to be there?
    note: An open path to the front door carries an implied licence for lawful communication unless a locked gate or sign negates it (Halliday v Nevill).
    concept: laws2400-w03-implied-licence
    cases:
      - halliday-v-nevill
    branches:
      - label: "Yes"
        to: t6
      - label: "No"
        to: tm
  - id: t6
    kind: ask
    text: Did the defendant stay within it — a licensed purpose, not revoked, not exceeded?
    note: "Outside: a sole purpose of breath-testing (Munnings) or serving a summons (Plenty); entering to steal (Barker). An extra alien purpose does not defeat the licence (Roy v O'Neill)."
    exception: true
    cases:
      - munnings-v-barrett
      - plenty-v-dillon
      - barker-v-the-queen
      - roy-v-oneill
    branches:
      - label: Yes, within it
        to: tx
      - label: "No: outside, revoked or exceeded"
        to: tm
  - id: tm
    kind: step
    text: Trespass to land is made out. It is actionable per se, so no damage need be proved.
    next: tr
  - id: tr
    kind: ask
    text: Is the trespass continuing or threatened, so that damages would be inadequate?
    concept: laws2400-w03-remedies-trespass-to-land
    branches:
      - label: "Yes"
        to: ti
      - label: "No"
        to: td
  - id: ti
    kind: end
    tone: met
    text: "Seek an injunction (prohibitory or mandatory), with damages for any loss so far. Self-help: reasonable force only."
  - id: td
    kind: end
    tone: met
    text: "Damages: nominal if no loss; otherwise diminution in value or, in suitable cases, reinstatement, plus consequential injury. A \"user fee\" basis is an alternative."
  - id: tx
    kind: end
    tone: not-met
    text: Trespass to land is not made out on these facts.
verify: false
---
