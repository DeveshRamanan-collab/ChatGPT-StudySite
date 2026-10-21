---
source-hash: 72052d1a3c97ca34
generator-version: aids-1
generated-at: "2026-10-16T16:09:53.447Z"
locked: false
unit: laws2400
week: laws2400-w06
title: Does the CLA remove the duty or liability for this risk?
summary: Checks the recreational-activity rules (ss 5L, 5M), then obvious risk (ss 5F–5H), then the common law scope of an occupier's duty (Romeo).
start: o1
concepts:
  - laws2400-w06-occupiers-liability-and-obvious-risk
  - laws2400-w06-sport-and-recreational-injury
sources:
  - Topic 6 Lecture 1 (slides 11–17)
  - Topic 6 Lecture 2 (slides 9–10)
  - Civil Liability Act 2002 (NSW) ss 5F–5H, 5K–5M
nodes:
  - id: o1
    kind: ask
    text: Was the plaintiff engaged in a recreational activity?
    note: "Section 5K: any sport, any pursuit for enjoyment, relaxation or leisure, or activity at a place such as a beach or park where people ordinarily do so."
    branches:
      - label: "Yes"
        to: o2
      - label: "No"
        to: o4
  - id: o2
    kind: ask
    text: Was the risk the subject of a risk warning to the plaintiff?
    note: "Section 5M: oral or written, general or specific, given in a way reasonably likely to warn people beforehand; it need not be received or understood."
    authorities:
      - civil-liability-act-2002-nsw-s5m
    branches:
      - label: "Yes"
        to: e-5m
      - label: "No"
        to: o3
  - id: o3
    kind: ask
    text: Did the harm result from an obvious risk of a dangerous recreational activity?
    note: "Dangerous: involving a significant risk of physical harm (s 5K). Section 5L applies whether or not the plaintiff was aware of the risk."
    authorities:
      - civil-liability-act-2002-nsw-s5l
    branches:
      - label: "Yes"
        to: e-5l
      - label: "No"
        to: o4
  - id: o4
    kind: ask
    text: Would the risk have been obvious to a reasonable person in the plaintiff's position?
    note: "Section 5F: includes patent risks and matters of common knowledge, even if unlikely or not conspicuous. Section 5G presumes the plaintiff was aware of an obvious risk."
    authorities:
      - civil-liability-act-2002-nsw-s5f
      - civil-liability-act-2002-nsw-s5g
    branches:
      - label: "Yes"
        to: o5
      - label: "No"
        to: o7
  - id: o5
    kind: ask
    text: Is the complaint a failure to warn of that obvious risk?
    branches:
      - label: "Yes"
        to: o6
      - label: "No: a failure to guard against it"
        to: o7
  - id: o6
    kind: ask
    text: Does a s 5H(2) exception apply?
    note: The plaintiff requested advice or information about the risk; a written law requires a warning; or a professional's service carries a risk of death or personal injury.
    exception: true
    authorities:
      - civil-liability-act-2002-nsw-s5h
    branches:
      - label: "No"
        to: e-5h
      - label: "Yes"
        to: o7
  - id: o7
    kind: ask
    text: At common law, does the occupier's duty extend to the precaution claimed?
    note: "Romeo: the duty is not owed in the abstract; assess the danger before the event by its obviousness and the care ordinarily exercised by the public. No duty to warn of an obvious, as opposed to a concealed, risk."
    cases:
      - romeo-v-conservation-commission-nt
      - rootes-v-shelton
    branches:
      - label: "Yes"
        to: e-duty
      - label: "No"
        to: e-scope
  - id: e-5m
    kind: end
    tone: not-met
    text: No duty of care for a risk that was warned of (s 5M).
  - id: e-5l
    kind: end
    tone: not-met
    text: "No liability: obvious risk of a dangerous recreational activity (s 5L)."
  - id: e-5h
    kind: end
    tone: not-met
    text: No duty to warn of an obvious risk (s 5H).
  - id: e-scope
    kind: end
    tone: not-met
    text: The duty does not extend that far, as with the fence in Romeo.
  - id: e-duty
    kind: end
    tone: met
    text: "The duty covers the precaution: move to breach."
verify: false
---
