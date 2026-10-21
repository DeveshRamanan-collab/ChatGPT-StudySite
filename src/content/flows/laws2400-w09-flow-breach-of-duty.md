---
source-hash: 0bbc7c86ef73613a
generator-version: aids-1
generated-at: "2026-10-16T22:13:48.333Z"
locked: false
unit: laws2400
week: laws2400-w09
title: Did the defendant breach its duty of care?
summary: Follows the lecturer's breach flowchart (risk, then response) through CLA s 5B, with Benic step 1 first and the s 5O defence for professionals ahead of s 5B (Peterkin v Tadros).
start: b1
concepts:
  - laws2400-w09-breach-of-duty-flowchart
  - laws2400-w09-identifying-the-risk-of-harm
  - laws2400-w09-foreseeable-risk-s5b-1a
  - laws2400-w09-not-insignificant-risk-s5b-1b
  - laws2400-w09-reasonable-response-s5b-1c-and-2
  - laws2400-w09-professional-standard-s5o
sources:
  - Topic 9 Flowcharts - Breach of Duty (pp 381–382)
  - Topic 9 Lecture 1 (slides 7–30)
  - Topic 9 Lecture 2 (slides 3–34)
  - Topic 9 Lecture 1 Transcript - Standard of Care and Breach of Duty
  - Topic 9 Lecture 2 Transcript - Standard of Care and Breach of Duty
  - Civil Liability Act 2002 (NSW) ss 5B, 5C, 5O, 5P (act-2002-022.pdf)
nodes:
  - id: b1
    kind: ask
    text: Is the defendant a professional who pleads s 5O for a professional service?
    note: Section 5O does not apply to liability for warnings about the risk of death or injury from a professional service (s 5P).
    concept: laws2400-w09-professional-standard-s5o
    authorities:
      - civil-liability-act-2002-nsw-s5o
    branches:
      - label: "Yes"
        to: b2
      - label: "No"
        to: b3
  - id: b2
    kind: ask
    text: Has the defendant shown it acted as was widely accepted in Australia by peer professional opinion as competent practice, and is that opinion rational?
    note: "Peterkin v Tadros: s 5O is a defence; the defendant bears the onus; acceptance need be wide, not universal (s 5O(4))."
    exception: true
    cases:
      - peterkin-v-tadros
    authorities:
      - civil-liability-act-2002-nsw-s5o
    branches:
      - label: "Yes"
        to: e-5o
      - label: "No"
        to: b3
  - id: b3
    kind: step
    text: "Identify the risk of harm (Benic step 1): a class of injury, named by its source, specific enough to match the precautions."
    note: "Dederer: \"spinal injury from diving off the bridge\" obscured the true source, shallow water over shifting sands."
    concept: laws2400-w09-identifying-the-risk-of-harm
    cases:
      - benic-v-nsw
      - rta-v-dederer
    next: b4
  - id: b4
    kind: ask
    text: "Question 1, s 5B(1)(a): was it a risk the defendant knew or ought to have known of, at the time?"
    note: Not far-fetched or fanciful (Wyong); an unlikely risk can still be foreseeable. The precise manner of injury need not be foreseen.
    concept: laws2400-w09-foreseeable-risk-s5b-1a
    cases:
      - wyong-shire-council-v-shirt
    authorities:
      - civil-liability-act-2002-nsw-s5b
    branches:
      - label: "Yes"
        to: b5
      - label: "No"
        to: e-nobreach
  - id: b5
    kind: ask
    text: "Question 1, s 5B(1)(b): was the risk not insignificant?"
    note: Higher than "not far-fetched", below "substantial" (Ipp Report). Weigh obviousness, likelihood and seriousness (Rail Corporation NSW v Donald).
    concept: laws2400-w09-not-insignificant-risk-s5b-1b
    cases:
      - rail-corporation-nsw-v-donald
    authorities:
      - civil-liability-act-2002-nsw-s5b
    branches:
      - label: "Yes"
        to: b6
      - label: "No"
        to: e-nobreach
  - id: b6
    kind: step
    text: "Question 2: weigh s 5B(2) for the precaution claimed: probability, seriousness, burden and social utility, with s 5C."
    note: "Judge prospectively, against a reasonable person in the defendant's position (a child: a normal child of that age). Not a checklist."
    concept: laws2400-w09-reasonable-response-s5b-1c-and-2
    cases:
      - rta-v-dederer
      - paris-v-stepney-borough-council
      - woods-v-multi-sport-holdings
      - e-v-australian-red-cross-society
    authorities:
      - civil-liability-act-2002-nsw-s5b
      - civil-liability-act-2002-nsw-s5c
    next: b7
  - id: b7
    kind: ask
    text: "Question 2, s 5B(1)(c): would a reasonable person in the defendant's position have taken that precaution, and did the defendant fail to?"
    note: "Refrigerated Roadways: no breach unless the defendant failed to take a step a reasonable defendant would have taken. Falling just short is still breach."
    cases:
      - rta-v-refrigerated-roadways
      - romeo-v-conservation-commission-nt
    authorities:
      - civil-liability-act-2002-nsw-s5b
    branches:
      - label: "Yes"
        to: e-breach
      - label: "No: the response was reasonable"
        to: e-reasonable
  - id: e-5o
    kind: end
    tone: not-met
    text: "No breach: the s 5O defence is made out and supplants s 5B."
  - id: e-nobreach
    kind: end
    tone: not-met
    text: "No breach: the risk fails s 5B(1)(a) or (b)."
  - id: e-reasonable
    kind: end
    tone: not-met
    text: "No breach: the response was reasonable, as in Dederer and Refrigerated Roadways."
  - id: e-breach
    kind: end
    tone: met
    text: "Breach established: move to causation."
verify: false
---
