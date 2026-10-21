---
source-hash: 2d93552e7173cf85
generator-version: aids-1
generated-at: "2026-10-16T16:00:00.623Z"
locked: false
unit: laws2100
week: laws2100-w02
title: Is this a positive law on Austin's theory?
summary: "Runs a rule through Austin's definitions: is it a command, is it general, and is it set by a sovereign of an independent political society? Ends at positive law or at one of Austin's other kinds of 'law'."
start: n1
concepts:
  - laws2100-w02-austins-command-theory
  - laws2100-w02-austins-sovereign
sources:
  - Week 02 - Lecture Slides (slides 7–12)
  - Week 02 - Lecture Transcript (first half)
nodes:
  - id: n1
    kind: ask
    text: Has someone expressed, by words or other signs, a wish that another shall do or forbear?
    note: A command starts with a wish of a rational being, intimated to another. The 'laws' of motion involve no wish at all.
    concept: laws2100-w02-austins-command-theory
    authorities:
      - austin-province-of-jurisprudence-determined
    branches:
      - label: "Yes"
        to: n2
      - label: "No"
        to: n10
  - id: n2
    kind: ask
    text: Is the wish backed by an evil (a sanction) that the person expressing it will inflict if there is no compliance?
    note: Evil means sanction, an enforcement of obedience; punishments are one class of sanctions. Disapproval by others is not a sanction from the commander.
    branches:
      - label: "Yes"
        to: n3
      - label: Only general disapproval
        to: n9
      - label: "No"
        to: n11
  - id: n3
    kind: step
    text: "It is a command, and so a duty is imposed: command and duty are correlative."
    note: Command, duty and sanction are inseparably connected for Austin. Even the gunman's order fits here.
    next: n4
  - id: n4
    kind: ask
    text: Does it oblige generally, to acts or forbearances of a class?
    note: A law is not an individual command for one act; it obliges generally.
    branches:
      - label: "Yes"
        to: n5
      - label: No, one act only
        to: n8
  - id: n5
    kind: ask
    text: Is it set by a determinate, common superior whom the bulk of the society habitually obeys?
    note: A person or a body of persons will do, such as a monarch, a parliament or a council of elders. No territory is required.
    concept: laws2100-w02-austins-sovereign
    branches:
      - label: "Yes"
        to: n6
      - label: "No"
        to: n12
  - id: n6
    kind: ask
    text: Does that superior habitually obey some other person or body?
    note: A society is political and independent only if its superior does not habitually obey another (PJD 169).
    branches:
      - label: "No"
        to: n7
      - label: "Yes"
        to: n13
  - id: n7
    kind: end
    tone: met
    text: "Positive law: set by a sovereign to a member of the independent political society in which it is sovereign (PJD 165), the matter of jurisprudence."
  - id: n8
    kind: end
    tone: qualified
    text: "A particular command, like the gunman's single order, but not a law properly so called: it does not oblige generally."
  - id: n9
    kind: end
    tone: qualified
    exception: true
    text: "Positive morality: a rule set and enforced by mere opinion, such as international law, improperly but by close analogy termed a law."
  - id: n10
    kind: end
    tone: not-met
    text: No command at all. If it is called a law, it is so only by metaphor, like the laws determining the movements of bodies.
  - id: n11
    kind: end
    tone: not-met
    text: "No sanction, so no command and no duty: for Austin command, duty and sanction are inseparable."
  - id: n12
    kind: end
    tone: qualified
    text: "A human law set by someone who is not a political superior: a command, but not positive law."
  - id: n13
    kind: end
    tone: qualified
    exception: true
    text: This superior is not sovereign, and the society is not independent. Look for the person or body they habitually obey.
verify: false
---
