---
source-hash: 6175ad4d9cf83c59
generator-version: aids-1
generated-at: "2026-10-16T23:25:54.787Z"
locked: false
unit: laws2100
week: laws2100-w10
title: Which principle could justify coercing this conduct?
summary: "Walks a proposed prohibition or compulsory measure through the week's five justifications in turn: harm to others, serious offence (Feinberg's two tests), harm to self, immorality (popular or critical), and the general welfare."
start: n1
concepts:
  - laws2100-w10-liberty-limiting-principles
  - laws2100-w10-mills-harm-principle
  - laws2100-w10-feinbergs-offence-principle
  - laws2100-w10-legal-paternalism
  - laws2100-w10-devlins-legal-moralism
sources:
  - Week 10 - Lecture Slides (slides 3, 8–17, 19–27)
  - Week 10 - Lecture Transcript (first half)
nodes:
  - id: n1
    kind: ask
    text: "Does the conduct harm others: infringing interests we are under a duty not to infringe?"
    note: "Mill (slide 9): not just affecting another's interests, but violating a specific duty to the public or causing perceptible hurt to a specific individual. Harm only to the actor, or to others with their consent, does not count."
    concept: laws2100-w10-mills-harm-principle
    authorities:
      - mill-on-liberty
    branches:
      - label: "Yes"
        to: n2
      - label: "No"
        to: n3
  - id: n2
    kind: end
    tone: met
    text: "The harm principle supports coercion: the state may limit the actor's freedom to prevent harm to others, as in stopping A assaulting B or stealing B's property."
  - id: n3
    kind: ask
    text: Would it seriously offend almost anyone chosen at random, regardless of sex, age, race, etc (the standard of universality)?
    note: Mill's state exceeds its limits if it protects people from offence; Feinberg's offence principle is a supplement to the harm principle, protecting persons other than the actor.
    concept: laws2100-w10-feinbergs-offence-principle
    authorities:
      - feinberg-offence-principle
    branches:
      - label: "Yes"
        to: n4
      - label: No, or only some groups
        to: n6
  - id: n4
    kind: ask
    text: Is it reasonably unavoidable, or would avoiding it be inconvenient for those offended (the standard of reasonable avoidability)?
    authorities:
      - feinberg-offence-principle
    branches:
      - label: "Yes: hard to avoid"
        to: n5
      - label: "No: easily avoided"
        to: n6
  - id: n5
    kind: end
    tone: met
    text: "Both tests are met: the offence principle supports a prohibition, if it would probably be an effective and necessary means of preventing serious offence to others."
  - id: n6
    kind: ask
    text: Is the reason to protect the actor from harm to themselves, or to guide them toward their own good?
    note: "The harm and offence principles both reject paternalism (lecture). If this branch was reached from the offence questions, the offence principle failed: both tests must be met."
    concept: laws2100-w10-legal-paternalism
    branches:
      - label: "Yes"
        to: n7
      - label: "No"
        to: n8
  - id: n7
    kind: end
    tone: qualified
    text: Legal paternalism, soft or hard. Weigh the probability and seriousness of self-harm, the probability and value of the goal, and the necessity of the risk. Mill and Feinberg reject it.
  - id: n8
    kind: ask
    text: Is the only reason that the conduct is immoral, even though it harms and offends no one?
    concept: laws2100-w10-devlins-legal-moralism
    branches:
      - label: "Yes"
        to: n9
      - label: "No"
        to: n12
  - id: n9
    kind: ask
    text: Immoral by whose standard?
    note: "Popular morality: what society conventionally regards as right. Critical morality: what is objectively right (slide 21)."
    branches:
      - label: The majority condemns it (popular)
        to: n10
      - label: It is objectively wrong (critical)
        to: n11
  - id: n10
    kind: end
    tone: qualified
    text: "Devlin's popular legal moralism: a prima facie right to prohibit. Test it with Hart: is it harmful? Would tolerating it jeopardise society? Does the disgust rest on ignorance or superstition?"
    authorities:
      - devlin-morals-and-the-criminal-law
      - hart-immorality-and-treason
  - id: n11
    kind: end
    tone: qualified
    text: "George's critical legal moralism: prohibit vice even if harmless. Liberals reply that preventing immorality without harm is not a legitimate reason; Raz would allow only non-coercive means."
    authorities:
      - george-making-men-moral
  - id: n12
    kind: ask
    text: Does the measure serve the general welfare or public interest, eg compulsory taxation for public projects?
    branches:
      - label: "Yes"
        to: n13
      - label: "No"
        to: n14
  - id: n13
    kind: end
    tone: qualified
    text: The welfare principle. The slides ask whether it is an example of legal paternalism, or a matter of social justice.
  - id: n14
    kind: end
    tone: not-met
    text: None of the five principles applies. On Mill's view, we should be perfectly free to act, however 'foolish, perverse, or wrong' the conduct.
verify: false
---
