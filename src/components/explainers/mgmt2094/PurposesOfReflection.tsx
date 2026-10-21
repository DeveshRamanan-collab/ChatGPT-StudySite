/*
SCENE: The five purposes of reflection — a corridor walk
LENGTH: 5 loci; pinned on desktop (scroll walks), paced otherwise
BEATS: 5 (one per locus, in the slide's order)
INTENT: Fix the five purposes in order, each with what it looks like in a group-project reflection.
SUBJECT: the amber light standing at the current locus.
BEAT 1: Consider the process of our own learning — a process of recognition (the lecturer's "step number one").
BEAT 2: Critically review something — our own behaviour, that of others (with detachment).
BEAT 3: Build on theory from observation — observe, then explain what you observed.
BEAT 4: Engage in personal or self development.
BEAT 5: Make decisions or resolve uncertainty.
CAMERA: 35mm-equivalent, dolly along the corridor, yaw ≤ 15° toward the locus, no cuts.
LIGHT: one amber point (glow sprite) at the current locus; paper fill. SOUND: none.
REDUCED MOTION: the five loci as a numbered list (no WebGL).
BUDGET: own chunk ≤ 120 KB gz (three is a shared vendor chunk), draw calls < 20, 60 fps at 4× throttle.
Source: concept mgmt2094-w06-purposes-of-reflection (Week 6 lecture slide 4; Week 9 transcript, reflective-writing
  segment); example sentences from the week spec's questions (q203, q204, q205, q206, q207).
*/
import { Palace } from '../bases/Palace';

export default function PurposesOfReflection() {
  return (
    <Palace
      label="A corridor with five frames: the five purposes of reflection, in order"
      terms={[
        { term: 'Reflection', def: '"A form of mental processing with a purpose" (Moon, 1999).' },
        { term: 'Recognition', def: 'Noticing how you learn: the first purpose, and the lecturer\'s "step number one".' },
        { term: 'Theory from observation', def: 'Observe first, then come up with an explanation for what you observed.' },
      ]}
      loci={[
        { title: '1. Consider the process of our own learning', body: 'A process of recognition: we sit down and recognise that we want to learn something from this experience. "I learnt more from our failed first prototype than from anything I read."' },
        { title: '2. Critically review something', body: 'Our own behaviour, that of others, etc. "I interrupted the others in our first two meetings, and that slowed the team down." Review others with detachment.' },
        { title: '3. Build on theory from observation', body: 'We observe, then come up with an explanation for what we observe. "We agreed quickly once someone sketched the idea, so a quick sketch may help a group settle."' },
        { title: '4. Engage in personal or self development', body: 'Use what you found to develop yourself. "I avoid speaking up in groups, so I am working on presenting once in every tutorial."' },
        { title: '5. Make decisions or resolve uncertainty', body: 'Based on our reflection, we can make decisions. "Weighing the panel\'s feedback, I will pitch the bolder concept next round."' },
      ]}
      check={{
        question: 'A student writes: "Our ideas improved once we stopped judging them in the first round, which suggests holding back criticism early helps a team." Which purpose is this?',
        options: [
          { text: 'Engage in personal or self development', why: 'The sentence explains a pattern in the team; it sets no goal for the writer\'s own development.' },
          { text: 'Build on theory from observation', correct: true, why: 'The writer observes a change and proposes an explanation for it — the lecturer\'s gloss of building theory from observation.' },
          { text: 'Make decisions or resolve uncertainty', why: 'The explanation might guide later choices, but no decision is made here.' },
        ],
      }}
    />
  );
}
