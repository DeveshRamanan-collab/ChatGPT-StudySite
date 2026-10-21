/*
SCENE: The ad hoc tribunals — ICTY and ICTR on one track from their Chapter VII creation to their closure
LENGTH: 9 events, learner-dragged (Timeline base)
BEATS: 1993 ICTY created → 1994 ICTR created → 1995 Tadić → 1998 Kambanda (May) → 1998 Akayesu (September) →
  1999 Milošević → 2010 MICT → 2015 ICTR closes → 2017 ICTY closes (tick labels are years only, to fit 390px)
INTENT: Both tribunals were created by the Security Council under Chapter VII, not by treaty — so every state had to
  cooperate — and each left milestones (and criticisms) before handing over to the Residual Mechanism.
SUBJECT: the handle; each event is tagged ICTY, ICTR or both.
BEAT 1–4: the learner drags or steps along the track; the detail beneath changes. Ease: power2.out glide (base).
CAMERA: none (HTML). LIGHT: none. SOUND: none.
REDUCED MOTION: same controls, no glide (base).
BUDGET: < 6 KB gz, no WebGL. Dates only where the slides give them.
Source: concept laws2000-w11-ad-hoc-tribunals-icty-and-ictr; unsc-resolution-827, icty-statute-art-1,
  ictr-statute-arts-1-4, un-charter-art-25; Akayesu (Week 11 Lecture Slides, slides 17–23, 51). The ICTR
  resolution number on the slide ("855") is flagged verify on the concept card, so the event shows it as such.
*/
import { Timeline } from '../bases/Timeline';

export default function AdHocTribunalsIctyAndIctr() {
  return (
    <Timeline
      label="The ad hoc tribunals for the former Yugoslavia and Rwanda, 1993 to 2017"
      terms={[
        { term: 'Chapter VII', def: 'UN Charter: “Action with respect to Threats to the Peace, Breaches of the Peace, and Acts of Aggression”.' },
        { term: 'Ad hoc tribunal', def: 'A tribunal created for one situation — here by Security Council resolution, not by treaty.' },
        { term: 'Art 25, UN Charter', def: 'Members “agree to accept and carry out the decisions of the Security Council”.' },
        { term: 'MICT', def: 'The International Residual Mechanism for Criminal Tribunals, established in 2010.' },
      ]}
      events={[
        { when: '1993', title: 'ICTY created — Resolution 827', tag: 'ICTY · Chapter VII', body: 'On 25 May 1993 the Security Council, acting under Chapter VII, established the ICTY and decided that “all States shall cooperate fully” with it and take any measures necessary under their domestic law. Art 1: serious violations of international humanitarian law in the former Yugoslavia since 1991.' },
        { when: '1994', title: 'ICTR created', tag: 'ICTR · Chapter VII', body: 'On 8 November 1994, again under Chapter VII (the slide gives “Resolution 855” — verify the number), seated in Arusha, Tanzania (Resolution 977). Art 1: Rwanda, and Rwandan citizens in neighbouring states, 1 January to 31 December 1994; arts 2–4: genocide, crimes against humanity, Common Article 3 and Additional Protocol II.' },
        { when: '1995', title: 'Tadić Interlocutory Appeal Decision', tag: 'ICTY', body: 'Addressed the legality of the creation of the ICTY.' },
        { when: '1998', title: 'Kambanda pleads guilty (May 1998)', tag: 'ICTR', body: 'Jean Kambanda pleaded guilty to genocide.' },
        { when: '1998', title: 'Akayesu convicted of genocide (September 1998)', tag: 'ICTR', body: 'Jean-Paul Akayesu was convicted of genocide; sexual violence was found to constitute the actus reus — part of the ICTR’s contribution to ICL on sexual offences and incitement.' },
        { when: '1999', title: 'Milošević indicted', tag: 'ICTY', body: 'Slobodan Milošević, then President of the Federal Republic of Yugoslavia, was indicted.' },
        { when: '2010', title: 'Residual Mechanism established', tag: 'both', body: 'The International Residual Mechanism for Criminal Tribunals (MICT) was established to carry on after both tribunals.' },
        { when: '2015', title: 'ICTR closes (December 2015)', tag: 'ICTR', body: 'Appellate work completed. Successes: arresting and convicting high-profile accused, and establishing that genocide had occurred. Criticisms: delays, treatment of victims, selective prosecutions, distance from affected communities.' },
        { when: '2017', title: 'ICTY closes (31 December 2017)', tag: 'ICTY', body: '161 charged, 90 convictions, 19 acquittals. It contributed to ICL, the historical record and combating denial; criticised for cost, delays, lack of victim participation and distance from affected communities.' },
      ]}
      check={{
        question: 'Why were all states — not only consenting ones — obliged to cooperate with the ICTY?',
        options: [
          { text: 'It was created by a Chapter VII decision, and members carry out Council decisions (art 25)', correct: true, why: 'Resolution 827 was adopted under Chapter VII and decided that “all States shall cooperate fully”; art 25 binds UN members to carry out such decisions.' },
          { text: 'Every state ratified the ICTY Statute as a treaty', why: 'The ICTY Statute came with a Security Council resolution; it was never a treaty open to ratification.' },
          { text: 'The General Assembly endorsed the tribunal, and its resolutions bind members', why: 'The ICTY was created by the Security Council, whose decisions bind members under art 25.' },
        ],
      }}
    />
  );
}
