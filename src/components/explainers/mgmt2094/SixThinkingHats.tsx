/*
SCENE: The six thinking hats — a corridor walk
LENGTH: 6 loci; pinned ≈ 360vh on desktop (scroll walks), paced otherwise (Palace base)
BEATS: 6 (one per hat, in the order of the Week 4 slides)
INTENT: Fix each hat to its direction of thinking, its colour reason and one signature question, so a question can be
  placed in the right hat by what kind of thinking it asks for.
SUBJECT: the amber light standing at the current frame.
BEAT 1: Blue — control: the sky over us, a wider, higher perspective. BEAT 2: White — information, facts: colourless.
BEAT 3: Yellow — benefits, harmony. BEAT 4: Green — growth, creativity, no judgement. BEAT 5: Red — emotion,
  intuition, no justification. BEAT 6: Black — problems, caution; can be over-used.
CAMERA: 35mm-equivalent, dolly along the corridor, yaw ≤ 15° toward the frame, no cuts (base).
LIGHT: one amber point at the current locus; paper fill. SOUND: none.
REDUCED MOTION: the six loci as a numbered list (no WebGL).
BUDGET: own chunk ≤ 120 KB gz (three is a shared vendor chunk), draw calls < 20, 60 fps at 4× throttle.
Colour is semantic only: the hats are named, not painted.
Source: concept mgmt2094-w04-six-thinking-hats (Week 4 slides 7–29; Kivunja 2015 on yellow evidence and black judges).
*/
import { Palace } from '../bases/Palace';

export default function SixThinkingHats() {
  return (
    <Palace
      label="A corridor with six frames, one per thinking hat: blue, white, yellow, green, red, black"
      terms={[
        { term: 'Thinking hat', def: 'One of six distinct modes of thinking — a direction you put on and take off.' },
        { term: 'Signature question', def: "The question that tells you which hat you are in." },
        { term: 'Colour reason', def: "De Bono's image for each hat (the sky, a tree, fire); the direction matters more than the colour." },
      ]}
      loci={[
        { title: 'Blue — control thinking', body: 'Process, control, taking an overview. Think of the blue sky over us: a wider, higher perspective to make sure you are addressing the right issue. Ask: What is our focus? What do we do next?' },
        { title: 'White — information, facts', body: 'Neutral, objective, non-emotional — white is effectively colourless. Facts and figures, trends from historical data, gaps in the knowledge. Ask: What information do we have? What do we need?' },
        { title: 'Yellow — benefits, harmony', body: 'Sunny and optimistic: see all the benefits and the value in the decision — on supporting evidence, Kivunja adds. Ask: What are the strengths and pluses? Why will it work?' },
        { title: 'Green — growth, creativity', body: 'A tree branching out: creating ideas, concepts and perceptions, escaping old ideas to find better ones. No criticism or judgement. Ask: What is possible? What would happen if?' },
        { title: 'Red — emotion, intuition', body: 'Gut reaction, instinct and feelings, offered without explanation or justification. Ask: What is your gut reaction? How do you feel about this right now?' },
        { title: 'Black — problems, caution', body: 'The risks, and why a proposed solution will fail. It makes plans tougher and spots fatal flaws — but it can be over-used. Judges wear black. Ask: What might go wrong?' },
      ]}
      check={{
        question: '"Customers will hate this new layout — I just know it," says a manager, offering no evidence. Which hat is she wearing?',
        options: [
          { text: 'White — she is stating a fact about customers', why: 'White needs information — data such as complaints or sales; she offers none.' },
          { text: 'Red — a gut feeling offered without justification', correct: true, why: 'The red hat presents views based on intuition and feeling, without explanation or justification.' },
          { text: 'Black — she is pointing out a risk', why: 'Black looks for risks with reasons; a feeling with no reasons is red-hat thinking.' },
        ],
      }}
    />
  );
}
