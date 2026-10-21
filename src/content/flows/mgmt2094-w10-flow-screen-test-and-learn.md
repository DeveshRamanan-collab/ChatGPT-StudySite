---
source-hash: 8bd9e09a302a3a4f
generator-version: aids-1
generated-at: "2026-10-17T05:42:52.549Z"
locked: false
unit: mgmt2094
week: mgmt2094-w10
title: Should we test this idea, and what do we do with the result?
summary: Screens an idea against the strategy (Collis), then takes one experiment through the innovation accounting report to persevere, pivot or run the next experiment.
start: n1
concepts:
  - mgmt2094-w10-lean-strategy
  - mgmt2094-w10-build-measure-learn
  - mgmt2094-w10-lean-start-up
sources:
  - Marketing - Week 10 - Reading - Lean Strategy (Collis, 2016) (pp 64–68)
  - Marketing - Week 10 - Lecture Materials - Agile Innovation and Lean Start-up (slides 9–15)
nodes:
  - id: n1
    kind: ask
    text: "Does the idea pass the strategic screen: does it fit the vision and the deliberate strategy's objective, scope and advantage?"
    note: "Collis: strategy is a screen that novel ideas must pass. The single best piece of advice for any company builder: know what not to do."
    concept: mgmt2094-w10-lean-strategy
    authorities:
      - mgmt2094-collis-2016-lean-strategy
    branches:
      - label: "Yes"
        to: n3
      - label: "No"
        to: n2
  - id: n2
    kind: end
    tone: not-met
    text: "Set it aside: strategy says what not to do."
    note: Eleet set aside its B2C use cases after analysing the target markets, before testing any of them.
    authorities:
      - mgmt2094-example-eleet
  - id: n3
    kind: ask
    text: Can the idea be judged by quick, cheap experiments?
    note: "Collis: some ideas cannot. Truly novel products may need whole ecosystems and long-term investment; Tesla's lithium ion batteries would never have got off the ground had they had to show immediate success."
    branches:
      - label: "Yes"
        to: n5
      - label: "No: it needs long-term investment"
        to: n4
  - id: n4
    kind: end
    tone: qualified
    text: Commit only after careful analysis, and only if the investment is a strategic fit.
    exception: true
    authorities:
      - mgmt2094-example-tesla
  - id: n5
    kind: step
    text: "Write a falsifiable hypothesis: quantify your goals, set the scope and timebox, and test the value and growth hypothesis first."
    note: "Begin the innovation accounting report with the background: why is this experiment relevant?"
    concept: mgmt2094-w10-build-measure-learn
    next: n6
  - id: n6
    kind: step
    text: Build the simplest thing that can measure it, the MVP, and plan how to execute the experiment.
    note: "Validated learning plans in reverse: what do we need to learn, how can we measure it, what is the simplest thing to build?"
    concept: mgmt2094-w10-lean-start-up
    next: n7
  - id: n7
    kind: step
    text: "Measure: record the results as data, against the target and the baseline."
    note: "Measure faster with split testing, actionable metrics and net promoter score. Collis: tests that capture only initial usage can mistake ephemeral traction, like Groupon's, for lasting demand."
    authorities:
      - mgmt2094-example-groupon
    next: n8
  - id: n8
    kind: ask
    text: "Learn: was the hypothesis validated, invalidated or inconclusive?"
    note: "Collis: with the strategy as yardstick, decide whether to end, continue or amend the experiment."
    branches:
      - label: Validated
        to: n9
      - label: Invalidated
        to: n10
      - label: Inconclusive
        to: n12
  - id: n9
    kind: end
    tone: met
    text: "Persevere: move to the next experiment, keeping the total time through the loop short."
  - id: n10
    kind: step
    text: "Before deciding, dig into where things went right or wrong: which hypotheses were validated or disproved?"
    note: "Collis: a simple no-go loses all the information and skills developed. Instagram's founders noticed that Burbn's users posted a lot of pictures."
    authorities:
      - mgmt2094-example-instagram-burbn
    next: n11
  - id: n11
    kind: end
    tone: qualified
    text: "Pivot: correct course on the hypotheses and run the next loop."
    note: Slide 15's one-page sheet lists pivot types such as zoom-in, zoom-out, channel, customer segment, customer need and value capture.
  - id: n12
    kind: end
    tone: qualified
    text: "Inconclusive: document it, and move to the next experiment."
verify: false
---
