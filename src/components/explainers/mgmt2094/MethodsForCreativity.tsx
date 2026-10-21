/*
SCENE: Six methods for becoming more creative — a corridor walk
LENGTH: 7 loci; pinned 420vh on desktop (scroll walks), paced otherwise (Palace base)
BEATS: 7 (one per locus)
INTENT: Fix the six methods in the slide's order, then end in the room the lecture says matters even more:
  unleashing creativity in a group or organisation.
SUBJECT: the amber light standing at the current locus.
BEAT 1: Mind mapping — also Part 1 of the creative project.
BEAT 2: Brainstorming. BEAT 3: Sketching. BEAT 4: Free writing. BEAT 5: Thinking opposites.
BEAT 6: Seeking inspiration — creative people and their biographies; Iger and Jobs at the whiteboard.
BEAT 7: The group room — relying on a group is much more effective than relying only on yourself.
CAMERA: 35mm-equivalent, dolly along the corridor, yaw ≤ 15° toward the locus, no cuts; slight breathing drift.
LIGHT: one amber point (glow sprite) at the current locus; paper fill. SOUND: none.
REDUCED MOTION: the seven loci as a numbered list (no WebGL).
BUDGET: own chunk ≤ 120 KB gz (three is a shared vendor chunk), draw calls < 20, 60 fps at 4× throttle.
Source: concept mgmt2094-w01-methods-for-creativity (Week 1 slide 13; lecture transcript; Lev-Ram 2015).
The slides name brainstorming, sketching, free writing and thinking opposites without defining them, so those rooms
say only what the materials say.
*/
import { Palace } from '../bases/Palace';

export default function MethodsForCreativity() {
  return (
    <Palace
      label="A corridor with seven frames: six creativity methods and the group room"
      terms={[
        { term: 'Progress', def: 'Needs imagination: without creativity we repeat the same experiences and patterns.' },
        { term: 'Method', def: 'One tool in an arsenal of tactics that can assist us in being creative.' },
        { term: 'More creative', def: 'The real question, since we are all somewhat creative already.' },
      ]}
      loci={[
        { title: '1 · Mind mapping', body: 'First on slide 13, and Part 1 of the Creative Project: a mind map centring on a societal issue, uploaded to Turnitin in Week 4 (10%). The tutorials cover it in detail.' },
        { title: '2 · Brainstorming', body: 'Second on the slide. Each method is one tactic in an arsenal that can assist us in being creative; the slides return to them over the weeks.' },
        { title: '3 · Sketching', body: "Third on the slide: another of the methods 'we will be looking at … over the weeks'." },
        { title: '4 · Free writing', body: 'Fourth on the slide. (The recording’s captions blur the name; the slide says free writing.)' },
        { title: '5 · Thinking opposites', body: "Fifth on the slide. Compare the unit's aim on slide 2: zig when everyone else is zagging." },
        { title: '6 · Seeking inspiration', body: 'Learn from creative people (business people, historical figures, politicians, artists, even generals), for example through their biographies. In the reading, Iger and Steve Jobs would stand at a whiteboard and "muse on business".' },
        { title: 'The group room', body: 'Even more important than any single method: how to unleash creativity in a group or an organisation. Relying on a group of people is much more effective than relying only on yourself.' },
      ]}
      check={{
        question: 'Which of these is NOT one of the six methods on slide 13?',
        options: [
          { text: 'Thinking opposites', why: 'It is the fifth method on slide 13, between free writing and seeking inspiration.' },
          { text: 'Building up willpower', correct: true, why: 'Building up willpower is an individual competency on slide 15, not one of the six creativity methods.' },
          { text: 'Free writing', why: 'It is the fourth method on slide 13, after sketching.' },
        ],
      }}
    />
  );
}
