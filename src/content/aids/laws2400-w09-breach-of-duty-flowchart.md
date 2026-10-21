---
source-hash: 0bbc7c86ef73613a
generator-version: aids-1
generated-at: "2026-10-16T22:13:48.333Z"
locked: false
concept: laws2400-w09-breach-of-duty-flowchart
unit: laws2400
week: laws2400-w09
plain: "Breach asks two questions: was there a real, foreseeable risk of injury, and did the defendant respond to it as a reasonable person in its position would have?"
concrete: "Third parties dropped concrete from an overpass onto the F5 freeway, killing a truck driver. Campbell JA accepted it was always predictable that someone might drop an object from a bridge: not far-fetched or fanciful. But the RTA was already screening bridges systematically, and before a roads authority is negligent for not screening a bridge, it must have failed to take a step a reasonable roads authority would have taken. No breach."
formal: "Wyong Shire Council v Shirt (1980): two limbs: reasonable foreseeability of a real risk of injury, and the reasonableness of the response. CLA s 5B(1): not negligent in failing to take precautions against a risk of harm unless (a) the risk was foreseeable, and (b) not insignificant, and (c) a reasonable person in the person's position would have taken those precautions. Benic: each element separately addressed."
analogy:
  text: A lifeguard first spots the real hazards on a beach (a rip, not an imagined shark in the shallows), then chooses a sensible response (flags and a warning), not closing the ocean.
  maps:
    - from: Spotting the real hazards
      to: "Question 1: the degree of foreseeable risk (s 5B(1)(a) and (b))"
    - from: Choosing a sensible response
      to: "Question 2: the reasonableness of the response (s 5B(1)(c) and (2))"
    - from: Not closing the ocean
      to: Reasonable care, not elimination of risk
  limits:
    - "In law the hurdles are cumulative: if the risk fails (a) or (b), the response is never judged."
    - A lifeguard is judged in hindsight by the crowd; the law judges prospectively, at the time of the conduct.
terms:
  - term: Breach of duty
    gloss: "The second element of negligence: the defendant's conduct fell short of the standard of care, whether far short or just short."
  - term: Standard of care
    gloss: What a reasonable person in the defendant's position would have done about the risk; implicit in s 5B(1)(c).
  - term: Real risk
    gloss: At common law (Wyong), a risk that is not far-fetched or fanciful, and therefore foreseeable.
misconceptions:
  - claim: Section 5B decides whether a duty of care exists, because it sits under the heading "Duty of care".
    tempting: The Division heading says "Duty of care".
    correction: "The lecturer calls this a trap: s 5B is the test for breach, not for establishing a duty. Duty was settled over earlier topics."
  - claim: The three criteria in s 5B(1) are weighed together, so a strong (a) can make up for a weak (b).
    tempting: Breach involves a lot of weighing.
    correction: "They are joined by \"and\": a person is not negligent unless all three are satisfied, and each must be separately addressed (Benic). The weighing happens inside (c), under s 5B(2)."
  - claim: Once the CLA applies, the common law cases on breach are irrelevant.
    tempting: The statute now governs breach.
    correction: The CLA presupposes the common law and operates against its background (Refrigerated Roadways). The only real tweak is the "not insignificant" threshold; the cases still show how the test applies.
socratic:
  - ask: A duty of care is established. Does that make the defendant negligent?
    hint: Which element comes next?
    answer: No. Breach must still be shown by measuring the defendant's conduct against the standard of care.
  - ask: Before applying s 5B, what must you name?
    hint: "\"Precautions against a risk of harm\"."
    answer: The risk of harm (Benic step 1), described as a class of injury and specific enough to match the precautions.
  - ask: What is the first breach question, and which parts of s 5B answer it?
    hint: The degree of foreseeable risk.
    answer: Was the risk of injury reasonably foreseeable? Section 5B(1)(a) (foreseeable) and (b) (not insignificant). The higher the risk, the less reasonable it is to do nothing.
  - ask: What is the second question, and which parts of s 5B answer it?
    hint: Has the standard been met?
    answer: "Was the defendant's response reasonable? Section 5B(1)(c), guided by s 5B(2)(a)–(d): probability, seriousness, burden, social utility."
  - ask: In Refrigerated Roadways the risk was foreseeable. Why no breach?
    hint: What was the RTA already doing?
    answer: It was screening bridges systematically; it had not failed to take a step a reasonable roads authority would have taken.
elements:
  - name: Identify the risk of harm
    test: "Benic step 1: name the risk as a class of injury, specific enough to correspond to the precautions that should have been taken."
    cases:
      - benic-v-nsw
      - rta-v-dederer
    authorities:
      - civil-liability-act-2002-nsw-s5b
  - name: Foreseeable (s 5B(1)(a))
    test: Was it a risk of which the defendant knew or ought to have known, at the time? Not far-fetched or fanciful.
    cases:
      - wyong-shire-council-v-shirt
    authorities:
      - civil-liability-act-2002-nsw-s5b
  - name: Not insignificant (s 5B(1)(b))
    test: Was the probability higher than "not far-fetched or fanciful", though not necessarily substantial? Weigh obviousness, likelihood and seriousness.
    cases:
      - rail-corporation-nsw-v-donald
    authorities:
      - civil-liability-act-2002-nsw-s5b
  - name: Reasonable precautions (s 5B(1)(c))
    test: Would a reasonable person in the defendant's position have taken the precautions? Weigh s 5B(2)(a)–(d), with s 5C.
    cases:
      - rta-v-refrigerated-roadways
      - romeo-v-conservation-commission-nt
    authorities:
      - civil-liability-act-2002-nsw-s5b
      - civil-liability-act-2002-nsw-s5c
what-if:
  - change: The claim is excluded from the CLA by s 3B, for example an intentional act done with intent to injure.
    effect: "The common law test applies: Wyong's two limbs, with the \"not far-fetched or fanciful\" threshold rather than \"not insignificant\"."
  - change: In Refrigerated Roadways, the RTA had known of repeated drops from that bridge and had no plan to screen any bridges.
    effect: "The response question would look very different: a reasonable roads authority might be expected to act, so breach becomes arguable."
boundary:
  - text: Industry standards in force at the time of the accident.
    why: "The lecturer: they are information a court can consider, but they are not the legal test of what a reasonable person would have done. Standards published after the accident are irrelevant."
transfer:
  - scenario: At an aquatic centre, a staff member's job is to let riders onto an enclosed waterslide only once the previous rider has left the exit pool. She is not watching, tells a 9-year-old "it is safe to go now", and the child collides with another rider, losing teeth.
    answer: "Identify the risk: collision injury when a rider enters before the previous rider has left. It was foreseeable (the centre knew of it: industry standards and its own sign) and not insignificant (obvious, serious, likely if no one watches). Under s 5B(2), watching costs little, so a reasonable centre would ensure staff watch. Industry standards inform, but do not decide, that question."
sources:
  - Topic 9 Lecture 1 (slides 4–11, 29–30)
  - Topic 9 Flowcharts - Breach of Duty (pp 381–382)
  - Topic 9 Lecture 1 Transcript - Standard of Care and Breach of Duty
  - Topic 9 Tutorial Preparation - Breach of Duty of Care
  - Civil Liability Act 2002 (NSW) ss 3B, 5B (act-2002-022.pdf)
verify: false
---
