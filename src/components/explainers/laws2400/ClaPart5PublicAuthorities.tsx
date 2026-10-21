/*
SCENE: Civil Liability Act Part 5 — a corridor of sections
LENGTH: 7 loci; pinned 420vh on desktop (scroll walks), paced otherwise
BEATS: 7 (one per section in order, then the worked case)
INTENT: Fix the order and effect of the Part 5 sections that modify the common law duty of a public authority, then
  show them working together in RTA v Refrigerated Roadways.
SUBJECT: the amber light standing at the current section.
BEAT 1: s 41 — who is a "public or other authority" (including private people with public official functions).
BEAT 2: s 42 — resources limit functions; their general allocation is not open to challenge.
BEAT 3: s 43 — the "so unreasonable" (Wednesbury) threshold for breach of statutory duty.
BEAT 4: s 43A — the same threshold for special statutory powers.
BEAT 5: s 44 — no liability for failing to regulate (licensing included) unless the plaintiff could compel it.
BEAT 6: s 46 — exercising a function does not of itself create a duty to exercise it.
BEAT 7: RTA v Refrigerated Roadways — duty, s 43A inapplicable (anyone can erect a screen), no breach.
CAMERA: 35mm-equivalent, dolly along the corridor, yaw ≤ 15° toward the locus, no cuts (Palace base).
LIGHT: one amber point at the current locus; paper fill. SOUND: none.
REDUCED MOTION: the seven loci as a numbered list (no WebGL).
BUDGET: own chunk ≤ 120 KB gz (three is a shared vendor chunk), draw calls < 20, 60 fps at 4× throttle.
Source: concept card laws2400-w08-cla-part-5-public-authorities; authorities civil-liability-act-2002-nsw-s41, s42,
  s43, s43a, s44, s46 (text quoted from the Act in unit-wide/); case rta-v-refrigerated-roadways; lecture examples of
  special statutory powers (back-burning, firearm licences) and of s 41 persons (slide 25).
*/
import { Palace } from '../bases/Palace';

export default function ClaPart5PublicAuthorities() {
  return (
    <Palace
      label="A corridor with seven frames: CLA sections 41 to 46 and RTA v Refrigerated Roadways"
      terms={[
        { term: 'Public or other authority', def: 'The s 41 class Part 5 protects — the Crown, departments, councils, statutory bodies and more.' },
        { term: 'Wednesbury unreasonableness', def: 'An administrative-law idea: so unreasonable that no reasonable authority would do it.' },
        { term: 'Special statutory power', def: 'A statutory power of a kind ordinary persons cannot exercise without statutory authority.' },
      ]}
      loci={[
        { title: 's 41 · Who is an authority', body: 'The Crown, government departments, public health organisations, local councils, bodies constituted under an Act — and any person with public official functions, as to those functions (psychiatrists under the Mental Health Act 2007, prison guards).' },
        { title: 's 42 · Resources', body: 'Functions are limited by the resources reasonably available; the general allocation of resources is not open to challenge; functions are judged by the broad range of activities. It applies to duty and to breach.' },
        { title: 's 43 · “So unreasonable”', body: 'No breach of statutory duty unless the act or omission was so unreasonable that no authority with those functions could properly consider it a reasonable exercise of them.' },
        { title: 's 43A · Special statutory powers', body: 'The same threshold for powers persons generally cannot exercise without specific statutory authority — the lecturer’s examples were back-burning and issuing firearm licences.' },
        { title: 's 44 · Regulatory functions', body: 'No liability for failing to exercise, or consider exercising, a function to prohibit or regulate an activity — licences and permits included — unless the plaintiff could have compelled it.' },
        { title: 's 46 · Exercising a function', body: 'Exercising, or deciding to exercise, a function does not of itself indicate a duty to exercise it, or to exercise it in a particular way.' },
        { title: 'RTA v Refrigerated Roadways', body: 'Concrete dropped from an overpass killed a truck driver. The RTA owed a duty; s 43A did not help, because anybody can erect a protective screen; but there was no breach.' },
      ]}
      check={{
        question: 'In RTA v Refrigerated Roadways, why could the RTA not rely on s 43A?',
        options: [
          { text: 'Section 43A applies only to police, not roads authorities', why: 'Section 43A applies to any public or other authority exercising a special statutory power.' },
          { text: 'Erecting screens is not a special statutory power — anybody can do it', correct: true, why: 'A special statutory power is one ordinary persons cannot exercise without statutory authority; putting up a screen is not.' },
          { text: 'The RTA was not a public or other authority under s 41', why: 'The Court of Appeal considered s 43A for the RTA; the problem was the kind of power, not the kind of body.' },
        ],
      }}
    />
  );
}
