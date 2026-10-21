---
source-hash: 8309f60de5b166e5
generator-version: aids-1
generated-at: "2026-10-16T22:20:28.579Z"
locked: false
unit: laws2100
week: laws2100-w07
title: Must the court uphold the conviction under § 12-A?
summary: "Walks the five options in Fuller's Speluncean Explorers from the questions each judge answers differently: does positive law apply, is this a matter for legal reasoning, words or purpose, clemency, and how far purpose goes."
start: n1
concepts:
  - laws2100-w07-speluncean-explorers-five-options
  - laws2100-w07-rules-standards-and-defeasibility
sources:
  - Week 07 - Lecture Slides (slides 11–22)
  - Week 07 - Lecture Transcript (first half)
nodes:
  - id: n1
    kind: ask
    text: Did Newgarth's positive law govern what the men did in the cave?
    note: "Foster J's first argument: positive law is predicated on the possibility of a human society. Cessante ratione legis, cessat et ipsa lex: when the reason for a law ceases, the law itself ceases."
    concept: laws2100-w07-speluncean-explorers-five-options
    authorities:
      - fuller-the-case-of-the-speluncean-explorers
    branches:
      - label: "Yes: positive law applied"
        to: n3
      - label: "No: they were in a state of nature"
        to: n2
  - id: n2
    kind: end
    tone: not-met
    text: "Foster J (first argument): the statutes and precedents of the Commonwealth do not apply; the defendants are innocent. Tatting J rejects this 'code of nature' and its 'odious and perverted rules'."
  - id: n3
    kind: ask
    text: Is the case to be settled by legal argument about § 12-A, or as a question of practical wisdom?
    branches:
      - label: Legal argument about § 12-A
        to: n5
      - label: Practical wisdom
        to: n4
  - id: n4
    kind: end
    tone: qualified
    text: "Handy J: treat forms and abstract concepts as instruments; decide by common sense, public opinion, clemency and gossip. The lecture calls him the personification of legal realism."
  - id: n5
    kind: ask
    text: Should § 12-A be read by its plain words, or in the light of its evident purpose?
    note: "Keen J: if we do not know the purpose of § 12-A, how can we possibly say there is a 'gap' in it?"
    branches:
      - label: Plain words
        to: n6
      - label: Evident purpose
        to: n9
  - id: n6
    kind: step
    text: "'Whoever shall willfully take the life of another shall be punished by death.' On its words the statute covers the killing and permits of no exception applicable to this case."
    next: n7
  - id: n7
    kind: ask
    text: May the court count on executive clemency to mitigate the rigours of the law?
    branches:
      - label: "Yes"
        to: n8
      - label: "No: irrelevant to the judicial office"
        to: n12
  - id: n8
    kind: end
    tone: met
    text: "Truepenny CJ: apply § 12-A regardless of the results. If clemency follows, justice is done without impairing the letter or spirit of the statutes."
  - id: n12
    kind: end
    tone: met
    text: "Keen J: set aside clemency and whether the act was right or wrong. Legislative supremacy requires the plain meaning: the question is not the rule's conjectural purpose but its scope."
  - id: n9
    kind: ask
    text: Does the purpose clearly support an exception for the explorers, as for killing in self-defence?
    note: "'A man may break the letter of the law without breaking the law itself' (p 624). Tatting J: there is more than one purpose, and self-defence may have a different explanation."
    concept: laws2100-w07-rules-standards-and-defeasibility
    branches:
      - label: "Yes"
        to: n10
      - label: Not clearly
        to: n11
  - id: n10
    kind: end
    tone: not-met
    exception: true
    text: "Foster J (second argument): an implicit exception to an explicit rule, by analogy with self-defence. No question of fidelity to enacted law, only of 'intelligent and unintelligent fidelity'."
  - id: n11
    kind: end
    tone: qualified
    text: "Tatting J: with competing purposes and an exception of uncertain scope, he can accept neither side and withdraws from the decision of the case."
verify: false
---
