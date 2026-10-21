---
source-hash: d4b51e5ac6d7bb6c
generator-version: aids-1
generated-at: "2026-10-17T05:42:59.172Z"
locked: false
unit: mgmt2094
week: mgmt2094-w12
title: How should an established firm respond to a disruptor?
summary: "Walks Gilbert + Tobin's response to NewLaw (Nickless, 2017): from the industry review and the threat moving up the market, through the options, to choosing and checking a disruptor to partner with."
start: n1
concepts:
  - mgmt2094-w12-responding-to-disruption
  - mgmt2094-w12-innovative-leader
  - mgmt2094-w12-challenges-managing-innovation
sources:
  - Marketing - Week 12 - Reading - Tackling Disruption (Nickless, 2017) (scanned, pp 27–29)
nodes:
  - id: n1
    kind: step
    text: "Review the industry: what is going on, and what are the challenges and opportunities?"
    note: Nickless's first task as G+T's chief operating officer in 2015 was a strategic review of the legal industry.
    concept: mgmt2094-w12-innovative-leader
    authorities:
      - mgmt2094-nickless-2017
    next: n2
  - id: n2
    kind: step
    text: "Identify the threat: new players doing lower-value, higher-volume work faster and cheaper, with standard processes and digital automation."
    note: NewLaw firms such as LegalVision prepared wills, reviewed loan documents and ran first-round document reviews, with lower cost, better service and a better marketing machine.
    next: n3
  - id: n3
    kind: ask
    text: Could the disruption move up the market, towards the higher-value work where the bulk of your business lies?
    note: "Nickless: a provider competent at simple document review might later ask to run 'the A$5 million bolt-on acquisition'."
    branches:
      - label: "Yes"
        to: n4
      - label: "No: 'it won't happen to us'"
        to: n13
  - id: n4
    kind: step
    text: "List the possible responses: change the business model, retreat into a specialist niche, build online platforms to automate simple work, outsource, or partner with a disruptor."
    concept: mgmt2094-w12-responding-to-disruption
    next: n5
  - id: n5
    kind: ask
    text: Could you launch your own version, with the incentives and culture it needs, beside your traditional model?
    note: G+T judged that getting the incentives right to motivate people and create the right culture would be very hard alongside a traditional legal model.
    branches:
      - label: "Yes"
        to: n6
      - label: No, it would be very hard
        to: n7
  - id: n6
    kind: end
    tone: qualified
    text: "Launch your own version: the option G+T considered first and set aside."
  - id: n7
    kind: step
    text: "Look for a disruptor to partner with: aim for exposure to the higher-growth market and the ability to learn from the disruption as it arrives."
    note: "Managing connections: operating in relationship with others rather than in splendid isolation."
    concept: mgmt2094-w12-challenges-managing-innovation
    next: n8
  - id: n8
    kind: ask
    text: Is the candidate a firm that owns its customer experience end to end, with real momentum?
    branches:
      - label: "Yes"
        to: n10
      - label: "No: a marketplace that refers customers out"
        to: n9
  - id: n9
    kind: end
    tone: not-met
    text: "Pass it over: G+T rejected marketplace start-ups because there was no quality control on the practitioners they referred customers to."
  - id: n10
    kind: ask
    text: "Does it pass due diligence: mystery shoppers testing its service, and a review of its work by your top lawyers?"
    note: "Realistic and informed: taking the risk only after checking quality."
    branches:
      - label: "Yes"
        to: n11
      - label: "No"
        to: n12
  - id: n11
    kind: end
    tone: met
    text: "Take a stake and work with it: G+T bought 20 per cent of LegalVision for about A$4 million, opening the small-to-medium enterprise market and combined solutions."
    authorities:
      - mgmt2094-example-gilbert-tobin-legalvision
  - id: n12
    kind: end
    tone: not-met
    text: "Do not invest: the partner has not shown the quality your clients need."
    exception: true
  - id: n13
    kind: end
    tone: not-met
    text: "Reconsider: Nickless says nobody argues any more that top-tier law is different; the same forces will apply, and disruption has only just begun."
verify: false
---
