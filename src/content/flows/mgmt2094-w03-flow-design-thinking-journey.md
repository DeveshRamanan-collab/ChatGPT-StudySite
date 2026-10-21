---
source-hash: 21c0a0d1e11cc80c
generator-version: aids-1
generated-at: "2026-10-16T16:10:58.884Z"
locked: false
unit: mgmt2094
week: mgmt2094-w03
title: "Walking an idea through design thinking: keep going, pivot or kill?"
summary: Takes a project from defining the problem to testing a prototype, then decides whether to develop, iterate, pivot or kill the idea.
start: n1
concepts:
  - mgmt2094-w03-design-thinking-process
  - mgmt2094-w03-discovering-needs-and-insights
  - mgmt2094-w03-prototyping-and-experimentation
  - mgmt2094-w03-desirability-feasibility-viability
sources:
  - Marketing - Week 03 - Reading - Design Thinking (Dunner ed. 2015) (p 12)
  - Marketing - Week 03 - Lecture Transcript - Design Thinking (Guest Lecture, Nathan Baird)
nodes:
  - id: n1
    kind: step
    text: Be empathetic in defining the problem.
    note: Decide the issue, agree on the audience, prioritise by urgency, decide what success looks like, and establish a glossary of terms (reading, step 1).
    concept: mgmt2094-w03-design-thinking-process
    next: n2
  - id: n2
    kind: ask
    text: Do you know the customer needs from research with real users, not from the office?
    branches:
      - label: Yes, from real research
        to: n4
      - label: No, we assumed them
        to: n3
  - id: n3
    kind: step
    text: "Get out of the building: discover, then distil needs and insights."
    note: Be the customer, be with the customer, learn about them, talk to extreme users; then an empathy map and a narrative with a need as a verb and a root-cause insight.
    concept: mgmt2094-w03-discovering-needs-and-insights
    authorities:
      - mgmt2094-example-nepal-infant-warmer
    next: n4
  - id: n4
    kind: step
    text: "Generate ideas: as many as possible, without judging or debating them."
    note: Log the session and hold one conversation at a time (reading, step 3). Exercises such as think in threes or speed thinking help.
    concept: mgmt2094-w03-divergent-thinking-and-idea-generation
    next: n5
  - id: n5
    kind: step
    text: "Choose rationally: set aside emotion and ownership, avoid consensus thinking."
    note: Review the objective; remember the most practical solution isn't always the best; select the powerful ideas (reading, step 5).
    next: n6
  - id: n6
    kind: step
    text: Build a simple, cheap prototype and test it with customers.
    note: Scrap materials, a mock-up or a storyboard. The early question is not "can we make it?" but "if we made it, would it matter to the customer?"
    concept: mgmt2094-w03-prototyping-and-experimentation
    authorities:
      - mgmt2094-example-zappos
    next: n7
  - id: n7
    kind: ask
    text: Do customers want it (is it desirable)?
    branches:
      - label: "Yes"
        to: n8
      - label: "Partly: promising, but not there yet"
        to: n9
      - label: "No"
        to: n10
  - id: n8
    kind: ask
    text: Can it be made (feasible) and make money or impact (viable)?
    note: Test with more finished prototypes and tools such as the business model canvas.
    concept: mgmt2094-w03-desirability-feasibility-viability
    branches:
      - label: Yes, both
        to: n11
      - label: "No"
        to: n10
  - id: n9
    kind: end
    tone: qualified
    text: Iterate or pivot, then test again.
    note: Get feedback, refine and take it back to customers; or pivot by changing one key element, such as the product, the customer group or the channel.
  - id: n10
    kind: ask
    text: Is there a viable pivot, with time and money left?
    branches:
      - label: "Yes"
        to: n9
      - label: "No"
        to: n12
  - id: n11
    kind: end
    tone: met
    text: "In the sweet spot: deliver it, evaluate honestly, repeat."
    note: Be practical in delivering (plan, resource, assign, execute) and honest in evaluating (did it meet its goals? measure success); then repeat (reading, steps 6–8).
  - id: n12
    kind: end
    tone: not-met
    text: Kill the idea and move on to the next project.
    note: "The guest lecturer: you do not perish, your idea does. Failing now, before a costly launch, is the cheap way to fail."
verify: true
---
