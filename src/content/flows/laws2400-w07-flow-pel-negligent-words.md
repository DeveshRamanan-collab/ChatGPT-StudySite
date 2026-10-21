---
source-hash: 1bae668ec3891ae4
generator-version: aids-1
generated-at: "2026-10-16T22:01:01.637Z"
locked: false
unit: laws2400
week: laws2400-w07
title: Is a duty owed for pure economic loss caused by negligent words?
summary: "Classifies the loss, flags the ACL s 18 route, then weighs the misstatement salient features in the order of the lecture's closing list: disclaimer, knowledge and assumption of responsibility, reasonable reliance, indeterminacy, vulnerability."
start: w1
concepts:
  - laws2400-w07-esanda-and-misstatement-salient-features
  - laws2400-w07-reliance-and-knowledge-shaddock-san-sebastian-tepko
  - laws2400-w07-disclaimers-and-vulnerability
  - laws2400-w07-acl-s18-misleading-or-deceptive-conduct
  - laws2400-w07-pure-economic-loss-and-policy
sources:
  - Topic 7 Lecture 1 (slides 5–29)
  - Topic 7 Lecture 1 Transcript - Negligent Misstatement
nodes:
  - id: w1
    kind: ask
    text: "Is the plaintiff's loss pure economic loss: no physical injury to the person or damage to its property?"
    note: Reasonable foreseeability is always required, but for pure economic loss it is never enough on its own (Dawson J in Esanda).
    concept: laws2400-w07-pure-economic-loss-and-policy
    cases:
      - esanda-finance-corp-v-pmh
    branches:
      - label: "Yes"
        to: w2
      - label: "No: it follows injury or damage"
        to: e-consequential
  - id: w2
    kind: step
    text: "If the statement was made in trade or commerce, plead ACL s 18 as well: no duty or negligence needed. Then run the common law."
    note: Section 18 covers conduct and words, negligent and intentional. A causal link is still needed. Outside trade or commerce, only the common law route is open.
    exception: true
    concept: laws2400-w07-acl-s18-misleading-or-deceptive-conduct
    authorities:
      - australian-consumer-law-s18
    next: w3
  - id: w3
    kind: ask
    text: Did the speaker disclaim responsibility for the statement?
    note: A disclaimer is one factor against a duty; in Hedley Byrne the "without responsibility" reference meant no duty arose. A mere warning that care has not been taken goes to reasonable reliance instead.
    concept: laws2400-w07-disclaimers-and-vulnerability
    cases:
      - hedley-byrne-v-heller
    branches:
      - label: "Yes"
        to: e-disclaimer
      - label: No, or only a warning
        to: w4
  - id: w4
    kind: ask
    text: Did the defendant know, or ought it to have known, of the reliance, or did it assume responsibility?
    note: "Tepko: needed known reliance, an assumption of responsibility, or both. Esanda: no request, no intention to induce, no assumption of responsibility."
    concept: laws2400-w07-reliance-and-knowledge-shaddock-san-sebastian-tepko
    cases:
      - tepko-pty-ltd-v-water-board
      - esanda-finance-corp-v-pmh
      - san-sebastian-pty-ltd-v-minister
    branches:
      - label: Yes, one or both
        to: w5
      - label: Neither
        to: e-relationship
  - id: w5
    kind: ask
    text: Was the plaintiff's reliance reasonable in the circumstances?
    note: Consider the kind of statement (fact or advice; an intention; a reluctant estimate), the occasion (social or business), any warning, and whether the defendant was the only source (Shaddock).
    cases:
      - shaddock-and-associates-pty-ltd-v-parramatta-city-council
      - san-sebastian-pty-ltd-v-minister
      - tepko-pty-ltd-v-water-board
    branches:
      - label: "Yes"
        to: w6
      - label: "No"
        to: e-relationship
  - id: w6
    kind: ask
    text: Would a duty expose the defendant to a class that cannot be narrowed or defined?
    note: A large class is not necessarily a problem; an undefinable one, such as everyone who reads public accounts or hears a radio tip, is.
    concept: laws2400-w07-pure-economic-loss-and-policy
    cases:
      - esanda-finance-corp-v-pmh
    branches:
      - label: "Yes"
        to: e-indeterminate
      - label: "No"
        to: w7
  - id: w7
    kind: ask
    text: "Was the plaintiff vulnerable: unable to protect itself by contract or its own inquiries?"
    note: "Anchorage: sophisticated commercial parties able to protect themselves by contract, who could get the information elsewhere, are not vulnerable."
    concept: laws2400-w07-disclaimers-and-vulnerability
    cases:
      - anchorage-capital-master-offshore-ltd-v-sparkes
    branches:
      - label: "Yes"
        to: e-duty
      - label: "No: it could protect itself"
        to: e-vulnerable
  - id: e-consequential
    kind: end
    tone: qualified
    text: "Not a pure economic loss problem: consequential loss rides on reasonable foreseeability."
  - id: e-disclaimer
    kind: end
    tone: not-met
    text: "No duty: responsibility was disclaimed (Hedley Byrne)."
  - id: e-relationship
    kind: end
    tone: not-met
    text: "No duty likely: no known reliance or assumed responsibility, or unreasonable reliance (Tepko, San Sebastian, Esanda)."
  - id: e-indeterminate
    kind: end
    tone: not-met
    text: "No duty likely: indeterminate liability (McHugh J in Esanda)."
  - id: e-vulnerable
    kind: end
    tone: not-met
    text: "No duty likely: the plaintiff could protect itself (Anchorage)."
  - id: e-duty
    kind: end
    tone: met
    text: "Weighing the features as a whole, a duty is likely: move to breach."
verify: false
---
