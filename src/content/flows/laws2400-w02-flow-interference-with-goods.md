---
source-hash: be6f1e829862f7f6
generator-version: aids-1
generated-at: "2026-10-16T16:00:01.237Z"
locked: false
unit: laws2400
week: laws2400-w02
title: Which action protects the goods — trespass, conversion or detinue?
summary: Sorts an interference with chattels by what the plaintiff held (possession or a right to immediate possession) and what the defendant did.
start: g1
concepts:
  - laws2400-w02-trespass-to-goods
  - laws2400-w02-conversion-and-detinue
sources:
  - Topic 2 Lecture 2 (slides 3–21)
  - "Torts Week 2 Casebook: Penfolds Wines v Elliott"
nodes:
  - id: g1
    kind: ask
    text: Is the thing a chattel — tangible, movable and transferable by delivery?
    note: Pets, livestock, cars, books, phones and artwork are chattels; fixtures attached to land are not. No property in a dead body; intangibles such as bitcoin are an open question.
    concept: laws2400-w02-trespass-to-goods
    branches:
      - label: "Yes"
        to: g2
      - label: "No"
        to: gx
  - id: g2
    kind: ask
    text: Was the plaintiff in possession when the interference happened?
    note: Possession = intention to control and exclude others + actual control. A bailee has it, not the bailor (Penfolds); a finder or occupier may have it (NCA v Flack).
    cases:
      - penfolds-wines-pty-ltd-v-elliott
      - national-crime-authority-v-flack
    branches:
      - label: "Yes"
        to: g3
      - label: "No"
        to: g4
  - id: g3
    kind: ask
    text: Did the defendant directly interfere with the chattel?
    branches:
      - label: "Yes"
        to: gt
      - label: "No"
        to: g4
  - id: gt
    kind: end
    tone: met
    text: Trespass to goods — no proof of actual damage is generally required. If the dealing was also serious, conversion may lie too.
  - id: g4
    kind: ask
    text: Does the plaintiff have at least a right to immediate possession?
    note: Enough for conversion and detinue, though not for trespass.
    concept: laws2400-w02-conversion-and-detinue
    branches:
      - label: "Yes"
        to: g5
      - label: "No"
        to: gx
  - id: g5
    kind: ask
    text: Was the defendant's dealing serious — an assertion of dominion contrary to the plaintiff's rights?
    note: Sale, taking possession, inconsistent use (Penfolds), or refusing an unconditional demand (Bunnings). Storing goods on pallets as delivered was not enough (Bunnings).
    cases:
      - penfolds-wines-pty-ltd-v-elliott
      - bunnings-group-ltd-v-chep-australia-ltd
    branches:
      - label: "Yes"
        to: g6
      - label: "No"
        to: g7
  - id: g6
    kind: ask
    text: Does the plaintiff's right rest on some proprietary title, not merely a contractual or custodial right?
    note: Hocking v Director General of the National Archives of Australia.
    cases:
      - hocking-v-director-general-of-the-national-archives-of-australia
    branches:
      - label: "Yes"
        to: gc
      - label: "No"
        to: g7
  - id: gc
    kind: end
    tone: met
    text: Conversion — strict liability, so good faith or mistake is no defence.
  - id: g7
    kind: ask
    text: Did the plaintiff make a clear demand for the goods that the defendant expressly and unreasonably refused?
    note: The demand, written or oral, must give specific, clear and unequivocal instructions. A refusal made to verify entitlement may be reasonable.
    branches:
      - label: "Yes"
        to: gd
      - label: "No"
        to: gx
  - id: gd
    kind: end
    tone: met
    text: Detinue — the court may, in its discretion, order the goods returned.
  - id: gx
    kind: end
    tone: not-met
    text: No action for interference with goods lies on these facts.
verify: false
---
