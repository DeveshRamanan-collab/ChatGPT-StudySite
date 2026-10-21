---
source-hash: 59511d4de803385b
generator-version: aids-1
generated-at: "2026-10-16T22:00:55.056Z"
locked: false
unit: laws2100
week: laws2100-w04
title: Does this claim assert a necessary connection between law and morality?
summary: Sorts a claim about law and morality into the version it really makes (strong or weak lex iniusta, the moral-obligation reading, or one of Hart's concessions) and says whether it asserts a necessary connection.
start: n1
concepts:
  - laws2100-w04-natural-law-and-positivism
  - laws2100-w04-lex-iniusta-strong-and-weak
  - laws2100-w04-harts-six-claims
  - laws2100-w04-minimum-content-of-natural-law
sources:
  - Week 04 - Lecture Slides (slides 4, 7, 9–14, 17, 27–28)
  - Week 04 - Lecture Transcript (first half)
  - Week 04 - Lecture Transcript (second half)
nodes:
  - id: n1
    kind: ask
    text: Does the claim say an unjust rule is not legally valid?
    note: "Lex iniusta non est lex read as a claim about validity. Hart's Thomist version: man-made laws conflicting with principles of true morality or justice, discoverable by reason, are not valid law."
    concept: laws2100-w04-lex-iniusta-strong-and-weak
    branches:
      - label: "Yes"
        to: n2
      - label: "No"
        to: n5
  - id: n2
    kind: ask
    text: Does it say this of every unjust rule, or only of extremely unjust ones?
    branches:
      - label: Every unjust rule
        to: n3
      - label: Only extremely unjust ones
        to: n4
  - id: n3
    kind: end
    tone: met
    text: "The strong natural law thesis: moral soundness is a necessary element of legal validity. Positivists deny it: it is in no sense a necessary truth that laws satisfy morality (CL 185–186)."
  - id: n4
    kind: end
    tone: qualified
    exception: true
    text: "Still the strong thesis, in Radbruch's narrower form: a claim about the validity of each extremely unjust law. Lesser injustice leaves validity untouched."
  - id: n5
    kind: ask
    text: Does it say unjust rules are laws, but not laws in the true sense of the word?
    note: Measured against the central case of law, as a fallacious argument is measured against a sound one.
    concept: laws2100-w04-finnis-central-case-method
    authorities:
      - finnis-natural-law-and-natural-rights
    branches:
      - label: "Yes"
        to: n6
      - label: "No"
        to: n7
  - id: n6
    kind: end
    tone: qualified
    text: "The weak natural law thesis (Finnis): unjust laws are morally and legally defective and peripheral to the central case, but not thereby invalid. Attacking the strong thesis does not touch it."
  - id: n7
    kind: ask
    text: Does it say a legal system exists only where people widely recognise a moral obligation to obey the law?
    note: Hart's second reading of the NCLM, which the lecture links with Fuller. Widely diffused, not necessarily universal, and open to being overridden by a stronger obligation not to obey iniquitous laws.
    branches:
      - label: "Yes"
        to: n8
      - label: "No"
        to: n9
  - id: n8
    kind: end
    tone: met
    text: "The moral-obligation version of the NCLM. Hart resists it: a legal system needs officials' acceptance of the secondary rules, which may rest on interest, tradition or conformity rather than moral approval (CL 109, 203)."
  - id: n9
    kind: ask
    text: What does the claim tie law to instead?
    note: "Hart's lesson: never argue 'the necessary connection' in general. Name the specific claim."
    concept: laws2100-w04-harts-six-claims
    authorities:
      - hart-the-concept-of-law
    branches:
      - label: Protection of persons, property and promises
        to: n10
      - label: General, public, prospective rules
        to: n11
      - label: Morality's influence on actual laws
        to: n12
      - label: Nothing moral at all
        to: n13
  - id: n10
    kind: end
    tone: not-met
    text: "Hart's minimum content of natural law: a natural necessity given natural facts and aims, not a conceptual connection. It answers the thesis that 'law may have any content' (CL 199)."
  - id: n11
    kind: end
    tone: qualified
    text: Hart's claim (5), Fuller's inner morality of law. Hart concedes it, but it 'is unfortunately compatible with very great iniquity' (CL 207); Fuller replies that good order is more just.
  - id: n12
    kind: end
    tone: not-met
    text: "Hart's claim (2): morality influences law, sometimes expressly, as in the US. No positivist denies these facts (CL 204), but the link is contingent."
  - id: n13
    kind: end
    tone: not-met
    text: "Legal positivism: absent an express provision, a rule's immorality does not make it not law, nor its desirability make it law (Hart 1958, 599)."
    authorities:
      - hart-positivism-and-the-separation-of-law-and-morals
verify: false
---
