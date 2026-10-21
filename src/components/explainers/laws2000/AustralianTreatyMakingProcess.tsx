/*
SCENE: Australia's treaty-making process — a six-step chain with AUKUS pinned to its steps
LENGTH: not pinned — a draggable Timeline (learner-paced), 6 steps + 1 AUKUS illustration
BEATS: terms → drag from mandate to entry into force → AUKUS documents at steps 3 and 5 → one check
INTENT: Fix the six steps in order and where the real ENNPIA and 2024 AUKUS agreement documents sit on them.
SUBJECT: the handle; steps up to it are inked; the tag names the actor.
CAMERA: none (HTML track). LIGHT: none. SOUND: none.
REDUCED MOTION: off — the handle jumps instead of gliding (base); same controls.
BUDGET: < 5 KB gz. The track shows step numbers, not dates (the process is a sequence).
Source: concept laws2000-w03-australian-treaty-making-process; Australian Constitution s 61.
*/
import { Timeline } from '../bases/Timeline';

export default function AustralianTreatyMakingProcess() {
  return (
    <Timeline
      label="Australia’s six treaty-making steps, from mandate to entry into force, with the AUKUS documents"
      terms={[
        { term: 'NIA', def: 'National Interest Analysis: explains why Australia should take the treaty action.' },
        { term: 'ExCo', def: 'The Federal Executive Council, which approves signature.' },
        { term: 'JSCOT', def: 'The Joint Standing Committee on Treaties, which reports on whether binding treaty action should be taken.' },
      ]}
      events={[
        { when: '1', title: 'Mandate to negotiate', tag: 'Lead minister', body: 'The lead minister seeks a mandate to negotiate from the Foreign Minister.' },
        { when: '2', title: 'Negotiate and finalise the text', tag: 'Consultation', body: 'The text is negotiated and finalised, consulting other Commonwealth, state and territory bodies.' },
        { when: '3', title: 'NIA prepared; ExCo approves signature', tag: 'AUKUS: ENNPIA (2021)', body: 'The ENNPIA’s NIA says it is needed because US and UK law restricts disclosing naval nuclear propulsion information without it, and it needs no change to Australian law; it can be terminated on six months’ notice.' },
        { when: '4', title: 'Signature', tag: 'Full powers', body: 'Australia’s representative signs; a full-powers instrument is needed unless the signatory is the PM or the Foreign Minister.' },
        { when: '5', title: 'Tabled for JSCOT', tag: 'AUKUS: 2024 Agreement', body: 'JSCOT reports within 15–20 joint sitting days. The 2024 naval nuclear propulsion agreement: Report 224 (November 2024), 260 submissions, four hearings, binding action recommended.' },
        { title: 'Criticism of the 2024 terms', tag: 'Rothwell', body: 'Professor Donald Rothwell: only the UK and US can be an “Originating Party” able to withdraw over their own defence assessment, leaving Australia’s exit route comparatively narrow.' },
        { when: '6', title: 'Entry into force', tag: 'Diplomatic notes', body: 'Once any implementing legislation passes, entry into force follows — usually by an exchange of diplomatic notes.' },
      ]}
      check={{
        question: 'A treaty has been negotiated and its NIA prepared, but ExCo has not yet approved signature. Is Australia bound?',
        options: [
          { text: 'Yes — negotiation of the final text binds Australia', why: 'Negotiation is step 2; nothing binds internationally before ExCo approval and signature.' },
          { text: 'No — nothing binds Australia internationally until ExCo approval and signature', correct: true, why: 'Walk the steps in order: approval and signature come at steps 3 and 4.' },
          { text: 'Yes, once JSCOT has been told about it', why: 'JSCOT tabling is step 5 and comes after signature.' },
        ],
      }}
    />
  );
}
