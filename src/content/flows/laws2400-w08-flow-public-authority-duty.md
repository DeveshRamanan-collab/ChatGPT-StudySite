---
source-hash: 2b196c69ae43c310
generator-version: aids-1
generated-at: "2026-10-16T22:01:02.249Z"
locked: false
unit: laws2400
week: laws2400-w08
title: Does a public authority owe a duty of care, and does CLA Part 5 bar the claim?
summary: "Common law first (McHugh J's six questions in Crimmins), then how CLA Part 5 modifies it: regulatory functions (s 44) and the unreasonableness threshold (ss 43, 43A)."
start: p1
concepts:
  - laws2400-w08-crimmins-and-mchugh-six-questions
  - laws2400-w08-control-and-vulnerability-graham-barclay-and-amaca
  - laws2400-w08-cla-part-5-public-authorities
  - laws2400-w08-public-authorities-as-defendants
sources:
  - Topic 8 Lecture 1 (slides 8–33)
  - Topic 8 Lecture 1 Transcript - Special Parties (Public Authorities)
  - Civil Liability Act 2002 (NSW) ss 40–46 (act-2002-022.pdf)
nodes:
  - id: p1
    kind: ask
    text: Was injury to the plaintiff from the authority's act or omission, including a failure to exercise its powers, reasonably foreseeable?
    note: "Always needed, never enough. Weigh the six questions: a \"no\" to questions 1–4, or a \"yes\" to 5 or 6, points against a duty."
    concept: laws2400-w08-crimmins-and-mchugh-six-questions
    cases:
      - crimmins-v-stevedoring-industry-finance-committee
    branches:
      - label: "Yes"
        to: p2
      - label: "No"
        to: e-noduty
  - id: p2
    kind: ask
    text: Did its statutory powers let it protect a specific class including the plaintiff, rather than the public at large?
    note: "Graham Barclay: the Council's powers were for the public generally, not a specific class."
    cases:
      - crimmins-v-stevedoring-industry-finance-committee
      - graham-barclay-oysters-v-ryan
    branches:
      - label: "Yes"
        to: p3
      - label: "No: the public at large"
        to: e-noduty
  - id: p3
    kind: ask
    text: "Was the plaintiff vulnerable: unable reasonably to safeguard herself from the harm?"
    note: "Crimmins: casual work and an obligation to obey directions. Amaca: workers could rely on employer, supplier and site owner, so were not vulnerable to the State."
    concept: laws2400-w08-control-and-vulnerability-graham-barclay-and-amaca
    cases:
      - crimmins-v-stevedoring-industry-finance-committee
      - amaca-v-nsw
    branches:
      - label: "Yes"
        to: p4
      - label: "No"
        to: e-noduty
  - id: p4
    kind: ask
    text: Did the authority know, or ought it to have known, of the risk to that class if it did not act?
    note: Knowledge alone is not enough (Amaca), but without it a duty fails.
    cases:
      - crimmins-v-stevedoring-industry-finance-committee
      - amaca-v-nsw
    branches:
      - label: "Yes"
        to: p5
      - label: "No"
        to: e-noduty
  - id: p5
    kind: ask
    text: Would a duty impose liability for core policy making or quasi-legislative functions, or are there other supervening policy reasons?
    note: "Graham Barclay: letting an industry self-regulate is policy. Hayne J in Crimmins: ordering respirators was quasi-legislative. Other reasons include indeterminacy and resources."
    cases:
      - graham-barclay-oysters-v-ryan
      - crimmins-v-stevedoring-industry-finance-committee
    branches:
      - label: "No: operational, no other reason"
        to: p6
      - label: "Yes"
        to: e-policy
  - id: p6
    kind: ask
    text: Is the claim that the authority failed to prohibit or regulate an activity, such as licensing?
    note: A common law duty is arguable; now see how CLA Part 5 modifies it. Section 41 decides who is an authority; s 42 (resources) applies to duty and breach.
    concept: laws2400-w08-cla-part-5-public-authorities
    authorities:
      - civil-liability-act-2002-nsw-s41
      - civil-liability-act-2002-nsw-s42
    branches:
      - label: "Yes"
        to: p7
      - label: "No"
        to: p8
  - id: p7
    kind: ask
    text: Could the plaintiff have required the authority to exercise that function in proceedings?
    note: "Section 44: otherwise the authority is not liable for failing to exercise or consider exercising a regulatory function."
    exception: true
    authorities:
      - civil-liability-act-2002-nsw-s44
    branches:
      - label: "Yes"
        to: p8
      - label: "No"
        to: e-s44
  - id: p8
    kind: ask
    text: Does the claim rest on a special statutory power (s 43A) or a breach of statutory duty (s 43)? If so, was the conduct so unreasonable that no authority with those functions could properly consider it reasonable?
    note: "RTA v Refrigerated Roadways: erecting screens is not a special statutory power, since anybody can erect one, so s 43A did not apply."
    exception: true
    cases:
      - rta-v-refrigerated-roadways
    authorities:
      - civil-liability-act-2002-nsw-s43
      - civil-liability-act-2002-nsw-s43a
    branches:
      - label: Neither applies
        to: e-met
      - label: Yes, that unreasonable
        to: e-met
      - label: "No"
        to: e-s43
  - id: e-noduty
    kind: end
    tone: not-met
    text: The relationship points against a duty, as for the Council and State in Graham Barclay.
  - id: e-policy
    kind: end
    tone: not-met
    text: "No duty: core policy or other supervening policy reasons."
  - id: e-s44
    kind: end
    tone: not-met
    text: "Not liable: s 44 (failure to exercise a regulatory function)."
  - id: e-s43
    kind: end
    tone: not-met
    text: "No liability: below the ss 43/43A unreasonableness threshold."
  - id: e-met
    kind: end
    tone: met
    text: "Duty arguable as in Crimmins: move to breach, applying s 42 (resources)."
verify: false
---
