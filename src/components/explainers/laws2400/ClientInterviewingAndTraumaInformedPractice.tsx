/*
SCENE: Tutorial skills — client interviewing and trauma-informed practice (a corridor walk)
LENGTH: 8 loci; pinned 480vh on desktop (scroll walks), paced otherwise
BEATS: 8 (one per locus, in interview order)
INTENT: Fix the order of a first client interview — why it matters (Roberts v Cashman), the duties at the start,
  client-focused control of process, rapport, LARS listening, the T-funnel, question hygiene, and trauma-informed
  practice.
SUBJECT: the amber light standing at the current locus.
BEAT 1: Why interview — Roberts v Cashman. BEAT 2: duties at the start. BEAT 3: process, not content. BEAT 4: rapport.
BEAT 5: LARS. BEAT 6: the T-funnel. BEAT 7: questioners beware. BEAT 8: "What happened to you?".
CAMERA: 35mm-equivalent, dolly along the corridor, yaw ≤ 15° toward the locus, no cuts (Palace base).
LIGHT: one amber point at the current locus; paper fill. SOUND: none.
REDUCED MOTION: the eight loci as a numbered list (no WebGL).
BUDGET: own chunk ≤ 120 KB gz (three is a shared vendor chunk); draw calls < 20; 60 fps at 4× throttle.
Source: concept laws2400-w11-client-interviewing-and-trauma-informed-practice; Topic 11 Tutorial Preparation Slides
  (slides 7–8, 10–12, 16–17, 19–23, 25–28, 30–36, 41–47, 52). Skills material, not tort doctrine.
*/
import { Palace } from '../bases/Palace';

export default function ClientInterviewingAndTraumaInformedPractice() {
  return (
    <Palace
      label="A corridor of eight frames: a first client interview in order"
      terms={[
        { term: 'Client-focused interviewing', def: 'The lawyer controls the process, not the content; the client decides.' },
        { term: 'Active listening', def: 'Engaged listening to obtain the client’s story: Listening, Acknowledging, Reflecting, Summarising.' },
        { term: 'T-funnel', def: 'Questions that start broad and open, then narrow to detail.' },
        { term: 'Re-traumatisation', def: 'What trauma-informed practice tries to avoid; it does not try to solve trauma.' },
      ]}
      loci={[
        { title: 'Why interview at all', body: 'Roberts v Cashman [2000] NSWSC 770: a firm relied on a questionnaire and never interviewed the client, her original injury was never explored, and her claim became time-barred. Duty breached — skipping the interview is at the solicitor’s own peril.' },
        { title: 'Duties at the start', body: 'The duty to the court is paramount (ASCR r 3.1). In the first interview: explain confidentiality, establish the limits of the retainer, and disclose costs.' },
        { title: 'Process, not content', body: 'Client-focused interviewing makes the client an actor and agent (ASCR rr 7 and 8): you control the process, the client owns the content and the decisions. Adjust your scaffolding to the client.' },
        { title: 'Rapport', body: 'It starts the moment you meet: a calm room, no phones, privacy, physical and emotional comfort. Stay non-judgmental — clients will not trust you if they think you are not on their side.' },
        { title: 'LARS', body: 'Listening (to what the client wants to say); Acknowledging (door openers, minimal encouragers); Reflecting (mirror, to confirm) and reframing (new words, new perspective); Summarising (facts and concerns).' },
        { title: 'The T-funnel', body: 'Broad open → general open → detailed → nitty-gritty, with clarification throughout. Don’t start questioning too soon, and don’t do too much of it: it is not a cross-examination.' },
        { title: 'Questioners beware', body: 'One question at a time; plain words; short questions; no compound or leading questions; no double negatives. Ask “Can you tell me more about that?”, not “What did you do that for?”.' },
        { title: '“What happened to you?”', body: 'Trauma-informed practice avoids re-traumatisation. Read fight, flight, freeze and fawn — and shame — as coping, not difficulty. Work with safety, trustworthiness, choice, collaboration and empowerment.' },
      ]}
      check={{
        question: 'In client-focused interviewing, what does the lawyer control?',
        options: [
          { text: 'Both the process and the content of the interview', why: 'Client-focused interviewing moves away from fully lawyer-controlled styles: the client owns the content.' },
          { text: 'The process, not the content', correct: true, why: 'The slides: the lawyer controls the process, not the content; clients make their own decisions (ASCR rr 7 and 8).' },
          { text: 'The content, not the process', why: 'This reverses it: the lawyer runs the process, while the client — often best informed about the facts — supplies the content.' },
        ],
      }}
    />
  );
}
