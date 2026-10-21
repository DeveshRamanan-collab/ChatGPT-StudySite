---
source-hash: da7eceb72388b108
generator-version: aids-1
generated-at: "2026-10-16T22:01:02.857Z"
locked: false
concept: laws2400-w10-causation-flowchart
unit: laws2400
week: laws2400-w10
plain: "Causation has two parts, and the plaintiff must prove both: the breach in fact caused the harm (factual causation), and liability ought to extend to that harm (scope of liability)."
concrete: "On New Year's Eve, after a fight at Adeels Palace, a patron left, re-entered with a gun and shot Moubarak. The club, an occupier, had no security: duty and breach were there. The claim still failed at the first branch of causation. The evidence did not show that security staff would have deterred or prevented the gunman's re-entry, so factual causation was not proved and scope of liability was never reached."
formal: "CLA s 5D(1): a determination that negligence caused particular harm comprises (a) factual causation — the negligence was a necessary condition of the harm — and (b) scope of liability. The plaintiff always bears the onus on causation, on the balance of probabilities (s 5E). The flowchart joins the branches with AND, and scope of liability covers new intervening acts AND remoteness."
analogy:
  text: "A door with two locks. The plaintiff needs both keys: the first is cut from evidence (did the breach in fact cause the harm?), the second from policy (ought the defendant to answer for it?)."
  maps:
    - from: First lock
      to: "Factual causation: necessary condition, s 5D(1)(a)"
    - from: Key cut from evidence
      to: Proof on the balance of probabilities (s 5E)
    - from: Second lock
      to: "Scope of liability, s 5D(1)(b): new intervening acts and remoteness"
    - from: Key cut from policy
      to: "s 5D(4): whether and why responsibility should be imposed"
  limits:
    - A real lock has no exception, but s 5D(2) can accept factual causation without the first key in an exceptional case.
    - The second lock is really two (new intervening acts and remoteness), and both must open.
terms:
  - term: Damage
    gloss: "Harm suffered by the plaintiff: the gist of the negligence action (no damage, no action). Not \"damages\", the money awarded as compensation."
  - term: Factual causation
    gloss: Whether the act or omission in fact caused the harm. Decided on the evidence, on the balance of probabilities; s 5D(1)(a).
  - term: Scope of liability
    gloss: "Whether it is appropriate for liability to extend to the harm so caused: a legal question involving policy (s 5D(1)(b)). Also called remoteness or legal causation."
  - term: Onus of proof (s 5E)
    gloss: The plaintiff always bears the onus of proving, on the balance of probabilities, any fact relevant to causation.
misconceptions:
  - claim: Once the breach is shown to be a necessary condition of the harm, causation is established.
    tempting: Necessary condition is usually the hard part, and "causation" sounds like a single question.
    correction: Section 5D(1) makes causation two elements. Scope of liability (s 5D(1)(b)) — new intervening acts and remoteness — must also be satisfied.
  - claim: Like battery, negligence succeeds without damage; damage only affects how much is awarded.
    tempting: The intentional torts in Topics 1–4 are actionable per se.
    correction: "Negligence is an action on the case: damage is the gist of the action. No damage, no action."
  - claim: The CLA replaced the common law on causation, so cases decided before 2002 no longer matter.
    tempting: Section 5D states the elements in statutory words.
    correction: The CLA restructured and codified the common law; its principles still apply and the cases are still important.
socratic:
  - ask: A duty doctor carelessly refuses to see a patient, who later dies. Duty and breach are clear. What else must the estate prove?
    hint: Is breach the end of a negligence claim?
    answer: Damage causally connected to the breach and not too remote, proved on the balance of probabilities (s 5E).
  - ask: What are the two elements of causation under s 5D(1)?
    hint: One rests on evidence, one on policy.
    answer: "(a) Factual causation: the negligence was a necessary condition of the harm. (b) Scope of liability: it is appropriate for liability to extend to the harm so caused."
  - ask: Which element is a question of fact, and which a legal question?
    hint: What can be proved, versus what ought to follow.
    answer: "Factual causation asks whether the act in fact caused the harm. Scope of liability (remoteness) is a legal question involving policy: should the defendant be held responsible?"
  - ask: If the factual causation test gives an unsatisfactory result, where does the flowchart send you?
    hint: Two kinds of case, then one subsection.
    answer: Multiple sufficient causes or material contribution to harm, and then s 5D(2), which can establish factual causation in an appropriate (in NSW, exceptional) case.
  - ask: Factual causation is satisfied. What does scope of liability then ask about?
    hint: The flowchart joins two boxes with AND.
    answer: "New intervening acts and remoteness: both, taken in Topic 11."
elements:
  - name: Damage
    test: "Has the plaintiff suffered damage? Damage is the gist of the action: no damage, no action."
  - name: Factual causation
    test: Was the negligence a necessary condition of the harm (s 5D(1)(a); 'but for' at common law)? There must be a connection between breach and injury, proved on the balance of probabilities.
    cases:
      - adeels-palace-v-moubarak
      - strong-v-woolworths-ltd-tas-big-w
    authorities:
      - civil-liability-act-2002-nsw-s5d
      - civil-liability-act-2002-nsw-s5e
  - name: Gap route, only if needed
    test: If necessary condition cannot be established (multiple sufficient causes, material contribution to harm), consider s 5D(2) in an exceptional case.
    authorities:
      - civil-liability-act-2002-nsw-s5d
  - name: Scope of liability
    test: Is it appropriate for liability to extend to the harm so caused (s 5D(1)(b), s 5D(4))? Deal with new intervening acts and remoteness.
    authorities:
      - civil-liability-act-2002-nsw-s5d
what-if:
  - change: In Adeels Palace, the evidence had shown that door staff would probably have kept the gunman out.
    effect: The necessary condition question would be answered "yes" on the balance of probabilities, so factual causation would be satisfied and the analysis would move on to scope of liability.
  - change: The plaintiff suffered no harm at all from the careless conduct.
    effect: "The claim fails before causation is reached: negligence is an action on the case, and damage is the gist of the action."
  - change: The harm followed a later unreasonable act by the injured plaintiff, as in McKew.
    effect: "Factual causation may still be met, but the other branch is engaged: whether a new intervening act takes the later harm outside the scope of liability."
boundary:
  - text: A breach that only 'might have' made a difference to the harm.
    why: "Outside: in Adeels Palace that was not proof of factual causation, and there was no reason to treat the case as exceptional under s 5D(2)."
  - text: A dust disease claim, such as Amaca v Booth.
    why: "Outside the statutory column: s 3B(1) excludes dust disease proceedings from the CLA, so the common law cases decide causation."
transfer:
  - scenario: A gym negligently fails to service a treadmill. A member collapses on it from a heart condition unrelated to the machine and is hurt in the fall.
    answer: "Ask s 5D(1)(a): was the failure to service a necessary condition of the harm? If the evidence shows the collapse and the fall would have happened on a well-serviced machine, the answer is no: breach without causation, as in Barnett. The member bears the onus on the balance of probabilities (s 5E). Only if factual causation is met does scope of liability arise."
sources:
  - Topic 10 Flowcharts (pp 433–434)
  - Topic 10 Lecture 1 (slides 4–5, 13, 16–18, 23–24)
  - Topic 10 Lecture 1 Transcript - Causation
  - Civil Liability Act 2002 (NSW) ss 5D, 5E (act-2002-022.pdf)
verify: false
---
