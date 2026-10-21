/*
SCENE: Learning to manage innovation — eight components, then the conclusion
LENGTH: 9 loci; pinned 540vh on desktop (scroll walks), paced otherwise
BEATS: 9 (one per locus)
INTENT: Fix the eight components for overcoming barriers in the slides' order, then the three things enterprises
  should emphasise, so each component can be matched to a barrier in an answer.
SUBJECT: the amber light standing at the current locus.
BEAT 1: Shared vision, leadership and the will to innovate.
BEAT 2: Appropriate culture.
BEAT 3: Key individuals.
BEAT 4: Effective team working.
BEAT 5: Continuing and stretching individual development.
BEAT 6: Extensive communication.
BEAT 7: Creative climate.
BEAT 8: Learning organisation.
BEAT 9: Conclusion — flexibility, respect for individual initiative, tolerance for mistakes.
CAMERA: 35mm-equivalent, dolly along the corridor, yaw ≤ 15° toward the locus, no cuts; slight breathing drift.
LIGHT: one amber point (glow sprite) at the current locus; paper fill. SOUND: none.
REDUCED MOTION: the nine loci as a numbered list (no WebGL).
BUDGET: own chunk ≤ 120 KB gz (three is a shared vendor chunk), draw calls < 20, 60 fps at 4× throttle.
Source: concept mgmt2094-w12-overcoming-barriers (Week 12 slides 12–15); examples
  mgmt2094-example-guest-shelley-simpson, mgmt2094-example-gilbert-tobin-legalvision.
*/
import { Palace } from '../bases/Palace';

export default function OvercomingBarriers() {
  return (
    <Palace
      label="A corridor with nine frames: eight components for overcoming barriers, then the conclusion"
      terms={[
        { term: 'Shared vision', def: 'A clearly articulated and shared sense of purpose, a stretching strategic intent and top management commitment.' },
        { term: 'Key individuals', def: 'Promoters, champions and other roles which facilitate innovation.' },
        { term: 'Creative climate', def: 'A positive approach to creative ideas, supported by relevant motivation systems.' },
        { term: 'Learning organisation', def: 'High involvement in proactive experimentation, with knowledge captured and disseminated.' },
      ]}
      loci={[
        { title: '1 · Shared vision, leadership and the will to innovate', body: 'A clearly articulated and shared sense of purpose; stretching strategic intent; top management commitment.' },
        { title: '2 · Appropriate culture', body: 'Encouraging creativity; enabling learning and interaction; balancing between "organic and mechanistic".' },
        { title: '3 · Key individuals', body: 'Promoters, champions and other roles which facilitate innovation.' },
        { title: '4 · Effective team working', body: 'Teams at cross-functional and inter-organisational level; investment in team selection and building.' },
        { title: '5 · Continuing and stretching individual development', body: 'Education and training of employees to ensure a high level of skills and competence.' },
        { title: '6 · Extensive communication', body: 'Within and between the organisation and outside.' },
        { title: '7 · Creative climate', body: 'A positive approach to creative ideas, supported by relevant motivation systems. Shelley Simpson\'s team is expected to "lean in", and is rewarded for it.' },
        { title: '8 · Learning organisation', body: 'High involvement within and outside the firm in proactive experimentation; knowledge capture and dissemination. Gilbert + Tobin\'s stake in LegalVision lets it learn from disruption.' },
        { title: 'Conclusion · What to emphasise', body: 'Planning and controlling systems with a high degree of flexibility; respect for individual initiative and personal growth; tolerance for mistakes and room for failure.' },
      ]}
      check={{
        question: 'A council has good ideas, but nobody owns them and each dies when the meeting ends. Which component is missing?',
        options: [
          { text: 'Key individuals', correct: true, why: 'Ideas with no owner need promoters and champions: the key individuals who facilitate innovation.' },
          { text: 'Extensive communication', why: 'The ideas are heard in the meeting; what is missing is someone to carry them forward.' },
          { text: 'Learning organisation', why: 'Capturing knowledge would record the ideas but would not give anyone the role of pushing them on.' },
        ],
      }}
    />
  );
}
