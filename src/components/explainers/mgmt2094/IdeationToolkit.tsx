/*
SCENE: The Ideation Tool Kit (Mattimore, 2012) — seven rooms
LENGTH: 7 loci; pinned 420vh on desktop (scroll walks), paced otherwise (Palace base)
BEATS: 7 (one per locus)
INTENT: Fix Mattimore's seven ideation tools in the slide's order, each recognisable by its mechanism and anchored to
  the slide's own example, so a scenario can be matched to the right tool.
SUBJECT: the amber light standing at the current locus.
BEAT 1: Questioning assumptions — 20–30 assumptions; the women's razor example (teenage girls, an inexpensive razor).
BEAT 2: Opportunity redefinition — three words, 8–10 alternatives each; the insurance-for-Catholics statement.
BEAT 3: Wishing — 20–30 impossible wishes; maybe Uber came from wishing for more convenient transport.
BEAT 4: Triggered brainwalking — everyone contributes; vanilla ice cream with toppings.
BEAT 5: Semantic intuition — keyword categories combined into a name: "upgrade information exchange".
BEAT 6: Picture prompts — customised and random images; personnel and management challenges.
BEAT 7: Worst idea — terrible ideas turned into good ones; the creative pressure comes off.
CAMERA: 35mm-equivalent, dolly along the corridor, yaw ≤ 15° toward the locus, no cuts (base).
LIGHT: one amber point at the current locus; paper fill. SOUND: none.
REDUCED MOTION: the seven loci as a numbered list (no WebGL).
BUDGET: own chunk < 6 KB gz (three is a shared vendor chunk), draw calls < 20, 60 fps at 4× throttle.
Source: concept mgmt2094-w08-ideation-toolkit (Week 8 slides 18–25; tutorial activity); authorities
  mgmt2094-example-uber-and-airbnb, mgmt2094-mattimore-2012-brainwalking.
*/
import { Palace } from '../bases/Palace';

export default function IdeationToolkit() {
  return (
    <Palace
      label="A corridor with seven frames, one for each tool in Mattimore's Ideation Tool Kit"
      terms={[
        { term: 'Ideation', def: 'Generating ideas — here, with seven structured tools (Mattimore, 2012).' },
        { term: 'Opportunity statement', def: 'The creative challenge written as a question, eg "How do we sell more insurance to Catholics?"' },
        { term: 'Creative trigger', def: 'A prompt — an assumption, a wish, a word, a picture — used to spark new ideas.' },
      ]}
      loci={[
        { title: '1. Questioning assumptions', body: 'Frame the challenge, list 20–30 assumptions (true or false), use several as thought starters. Selling more women\'s razors: what if we targeted teenage girls with an inexpensive razor?' },
        { title: '2. Opportunity redefinition', body: 'Pick the three most interesting words of the opportunity statement, generate 8–10 alternatives for each, combine them: "How do we get practising young Catholics incentivised to sell life insurance to Catholic grandparents?"' },
        { title: '3. Wishing', body: 'Wish for the impossible — money, energy and time are no object — then use the most fantastic of 20–30 wishes to spark novel but realistic ideas. Maybe Uber came from wishing for more convenient transport.' },
        { title: '4. Triggered brainwalking', body: 'Ensures everyone gets the chance to contribute, and combines with other techniques — like vanilla ice cream, delicious alone and special with toppings.' },
        { title: '5. Semantic intuition', body: 'Combine categories of key words to name a new idea before you know what it is. Improve + teamwork → "upgrade information exchange" → upgrade information software.' },
        { title: '6. Picture prompts', body: 'Visuals bring intuitions, emotions and feelings to the surface — good for personnel and management challenges. Customise them to the challenge, and add some random pictures.' },
        { title: '7. Worst idea', body: 'List really terrible ideas together, then turn them into good ones by thinking of the opposite or finding something of value. It takes the creative pressure off.' },
      ]}
      check={{
        question: "A team picks the three most interesting words of its challenge, lists 8–10 alternatives for each and recombines them into a new question. Which tool is it using?",
        options: [
          { text: 'Semantic intuition', why: 'Semantic intuition combines key words to name a new idea; it does not rewrite the opportunity statement.' },
          { text: 'Opportunity redefinition', correct: true, why: 'Three words, 8–10 alternatives each, recombined into a new opportunity statement: that is opportunity redefinition.' },
          { text: 'Questioning assumptions', why: 'Questioning assumptions lists 20–30 assumptions about the challenge and uses some as triggers.' },
        ],
      }}
    />
  );
}
