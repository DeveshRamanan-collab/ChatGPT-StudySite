/*
SCENE: The design thinking process — a corridor walk through the reading's five stages
LENGTH: 5 loci; pinned 300vh on desktop (scroll walks), paced otherwise
BEATS: 5 (one per stage)
INTENT: Fix the order Empathy → Define → Ideate → Prototype → Test, the three phases they sit under (understand, create,
  deliver) and the behaviour the reading's eight steps ask for at each point — then send the walker back to the start,
  because the last step is "Repeat".
SUBJECT: the amber light standing at the current stage's frame.
BEAT 1: Empathy (understand). BEAT 2: Define (understand — "understanding ends in insight"). BEAT 3: Ideate (create —
  "creation ends in ideas"). BEAT 4: Prototype (deliver). BEAT 5: Test (deliver — "delivery ends in reality"; repeat).
CAMERA: 35mm-equivalent, dolly along the corridor, yaw ≤ 15° toward the locus, no cuts (Palace base).
LIGHT: one amber point at the current locus; paper fill. SOUND: none.
REDUCED MOTION: the five loci as a numbered list (no WebGL).
BUDGET: own chunk ≤ 120 KB gz (three is a shared vendor chunk), draw calls < 20, 60 fps at 4× throttle.
Source: concept mgmt2094-w03-design-thinking-process; the infographic and eight steps in
  mgmt2094-reading-marketers-guide-to-design-thinking (p 12). Each locus quotes the step whose wording names that
  stage's activity (defining, researching, generating ideas, prototypes, evaluating).
*/
import { Palace } from '../bases/Palace';

export default function DesignThinkingProcess() {
  return (
    <Palace
      label="A corridor with five frames: empathy, define, ideate, prototype, test"
      terms={[
        { term: 'Understand · Create · Deliver', def: 'The three phases above the stages: understanding ends in insight, creation in ideas, delivery in reality.' },
        { term: 'End users', def: 'The people the solution is for; talking to them brings the most fruitful ideas (step 2).' },
        { term: 'Iterative', def: 'Going round again: the eighth step is "Repeat", and iteration can redefine the problem.' },
      ]}
      loci={[
        { title: 'Empathy — understand', body: 'Be explorative in researching the problem: review its history and other attempts to solve it, note supporters and critics, and talk to your end users — this brings the most fruitful ideas for later design.' },
        { title: 'Define — understand', body: 'Be empathetic in defining the problem: decide the issue, agree on the audience, prioritise by urgency, decide what success looks like, and establish a glossary of terms. Understanding ends in insight.' },
        { title: 'Ideate — create', body: 'Be creative in generating ideas: serve end users’ needs and motivations with as many ideas as possible; log the session; do not judge or debate ideas; one conversation at a time. Creation ends in ideas.' },
        { title: 'Prototype — deliver', body: 'Be iterative in refining your ideas: combine and refine, make multiple drafts, seek feedback from a diverse group including end users, and create working prototypes. Then be rational in choosing: avoid consensus thinking.' },
        { title: 'Test — deliver', body: 'Be practical in delivering, then honest in evaluating performance: consumer feedback, did it meet its goals, measure success, document. Delivery ends in reality — and step 8 is "Repeat".' },
      ]}
      check={{
        question: 'A team is generating as many ideas as it can, logging them and not debating any. Where is it in the reading’s process?',
        options: [
          { text: 'Define, in the understand phase', why: 'Defining decides the issue, the audience and a glossary; generating ideas comes after the problem is defined.' },
          { text: 'Ideate, in the create phase', correct: true, why: 'Generating many ideas without judging is the creative step (3), and creation is the phase that ends in ideas.' },
          { text: 'Test, in the deliver phase', why: 'Testing evaluates a solution with consumer feedback; this team has not chosen or built anything yet.' },
        ],
      }}
    />
  );
}
