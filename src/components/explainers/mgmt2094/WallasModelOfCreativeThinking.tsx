/*
SCENE: Wallas' model of creative thinking — a corridor of five stages
LENGTH: 5 loci; pinned 300vh on desktop (scroll walks), paced otherwise
BEATS: 5 (one per locus)
INTENT: Fix the order of the five stages and how conscious each one is: the walk starts in conscious Preparation,
  dips below awareness in Incubation, rises through the fringe in Intimation, flashes in Illumination, and ends in a
  conscious (and social) Verification.
SUBJECT: the amber light standing at the current locus.
BEAT 1: Preparation · conscious — explore the problem's dimensions (Helmholtz: "in all directions").
BEAT 2: Incubation · nonconscious — subconscious mulling; distraction or mental relaxation.
BEAT 3: Intimation · fringe of consciousness — the inkling that a solution is coming.
BEAT 4: Illumination · the conscious flash — "eureka", the idea bursts through.
BEAT 5: Verification · conscious — practicality, effectiveness, appropriateness; Poincaré's warning.
CAMERA: 35mm-equivalent, dolly along the corridor, yaw ≤ 15° toward the locus, no cuts; slight breathing drift.
LIGHT: one amber point (glow sprite) at the current locus; paper fill. SOUND: none.
REDUCED MOTION: the five loci as a numbered list (no WebGL).
BUDGET: own chunk ≤ 120 KB gz (three is a shared vendor chunk), draw calls < 20, 60 fps at 4× throttle.
Source: concept mgmt2094-w05-wallas-model-of-creative-thinking (Week 5 lecture slide 5; lecture transcript);
  authorities mgmt2094-sadler-smith-2015-wallas-four-stage-model, mgmt2094-example-helmholtz-happy-ideas,
  mgmt2094-example-poincare-mathematical-discovery.
*/
import { Palace } from '../bases/Palace';

export default function WallasModelOfCreativeThinking() {
  return (
    <Palace
      label="A corridor with five frames: preparation, incubation, intimation, illumination, verification"
      terms={[
        { term: 'Fringe consciousness', def: 'The edge of awareness, between nonconscious and fully conscious thought — where Intimation sits.' },
        { term: 'Incubation', def: 'Subconscious mulling: by distraction (other work) or by mental relaxation from all mental work.' },
        { term: 'Verification', def: 'The conscious check of an idea’s practicality, effectiveness and appropriateness.' },
      ]}
      loci={[
        { title: 'Preparation · conscious', body: 'Focuses on the problem and explores the problem’s dimensions. Voluntary, effortful work — Helmholtz investigated his problems “in all directions”. Chance favours the prepared mind.' },
        { title: 'Incubation · nonconscious', body: 'Subconscious mulling of the problem, involuntary and not open to introspection. Distraction suits easier problems; mental relaxation suits hard ones. Helmholtz’s ideas came on slow walks up wooded hills.' },
        { title: 'Intimation · fringe of consciousness', body: 'An inkling that a solution may well be on its way: “I often know that the solution is coming, though I don’t know what the solution will be.” Wallas gave it 12 pages; the usual four-stage summary leaves it out.' },
        { title: 'Illumination · the flash', body: 'Discovery, “eureka”: the idea bursts through — Wallas’ instantaneous “flash” or “click”. Poincaré’s idea came as he put his foot on the step of a bus.' },
        { title: 'Verification · conscious', body: 'Focus on practicality, effectiveness and appropriateness. Conscious and logical again — and social, as investors and other gatekeepers judge it. An idea felt with certainty can still fail “the test of verification”.' },
      ]}
      check={{
        question: 'A designer senses she is about to crack a problem but cannot yet say how. Which stage is she in?',
        options: [
          { text: 'Incubation', why: 'Incubation is nonconscious and not open to introspection; she is aware of something, so she has moved past it.' },
          { text: 'Intimation', correct: true, why: 'Knowing a solution is coming without knowing what it is, in the fringe of consciousness, is Intimation.' },
          { text: 'Illumination', why: 'Illumination is the flash when the idea itself arrives; she does not have the idea yet.' },
        ],
      }}
    />
  );
}
