/*
SCENE: Why innovate — the goals, then the four sources of innovation — a corridor walk
LENGTH: 6 loci; pinned 360vh on desktop (scroll walks), paced otherwise (Palace base)
BEATS: 6 (one per locus)
INTENT: Fix why organisations innovate (survival in a turbulent economy), what innovation aims at (the ten goals) and
  the four sources that make it possible — with the two sources the lecture called double-edged (tenure, slack).
SUBJECT: the amber light standing at the current locus.
BEAT 1: Why innovate — turbulent, rapidly changing economy; survival; the slide's example, Apple.
BEAT 2: The ten goals — from improving quality to conformance to regulations; Lego's environmental goals (Reed, 2018).
BEAT 3: Organisational structure — organic: lower vertical differentiation, formalisation, centralisation.
BEAT 4: Long tenure in management — legitimacy and know-how; the other face, complacency.
BEAT 5: Slack resources — afford innovations, absorb failures; the other face, feeling unbeatable.
BEAT 6: Intra-communications — committees, task forces, cross-functional teams across departmental lines.
CAMERA: 35mm-equivalent, dolly along the corridor, yaw ≤ 15° toward the locus, no cuts (base).
LIGHT: one amber point at the current locus; paper fill. SOUND: none.
REDUCED MOTION: the six loci as a numbered list (no WebGL).
BUDGET: own chunk < 6 KB gz (three is a shared vendor chunk), draw calls < 20, 60 fps at 4× throttle.
Source: concept mgmt2094-w08-why-innovate-goals-and-sources (Week 8 slides 6–8; lecture recording on the double
  edges); authorities mgmt2094-example-apple-and-nokia (verify: the iPhone/Nokia detail is from the recording only,
  so it is not used here), mgmt2094-reed-2018-lego-plastic-free-brick.
*/
import { Palace } from '../bases/Palace';

export default function WhyInnovateGoalsAndSources() {
  return (
    <Palace
      label="A corridor with six frames: why innovate, the goals of innovation, and the four sources of innovation"
      terms={[
        { term: 'Goal of innovation', def: 'What the innovation aims to achieve, such as new markets or reduced environmental damage.' },
        { term: 'Source of innovation', def: 'A condition in the organisation that makes innovation possible.' },
        { term: 'Organic structure', def: 'A flatter, less formal, less centralised organisation.' },
        { term: 'Slack resources', def: 'An abundance of resources beyond what day-to-day work needs.' },
      ]}
      loci={[
        { title: 'Why innovate?', body: 'In a turbulent, rapidly changing economy, organisations must prepare to innovate on a continuing basis, otherwise their survival chances are seriously threatened — the slide\'s example is Apple. Innovation is hard, so it usually happens under pressure.' },
        { title: 'The ten goals', body: 'Improving quality · new markets · extending the product range · reducing labour costs · improving the production process · reducing materials · reducing environmental damage · replacing products/services · reducing energy consumption · conformance to regulations. Lego\'s plant-based or recycled brick (Reed, 2018) pursues reduced environmental damage while keeping the product the same.' },
        { title: 'Source 1: organisational structure', body: 'Organic structures positively influence innovation: lower vertical differentiation, formalisation and centralisation facilitate flexibility, adaptation and cross-fertilisation.' },
        { title: 'Source 2: long tenure in management', body: 'Managerial tenure provides legitimacy and knowledge of how to accomplish a task and obtain desired outcomes. The other face: a leader who has been there forever may be complacent, content with things as they are.' },
        { title: 'Source 3: slack resources', body: 'An abundance of resources lets an organisation afford to purchase innovations, bear the cost of instituting them and absorb failures. The other face: plenty can make a firm feel unthreatened, so it stops innovating.' },
        { title: 'Source 4: intra-communications', body: 'Innovative organisations are high users of committees, task forces and cross-functional teams that facilitate interaction across departmental lines.' },
      ]}
      check={{
        question: 'Which item is a SOURCE of innovation rather than a GOAL of innovation?',
        options: [
          { text: 'Creation of new markets', why: 'Creating new markets is the second goal on the slide — something innovation aims at.' },
          { text: 'Reducing energy consumption', why: 'Reducing energy consumption is a goal, listed with reducing materials and environmental damage.' },
          { text: 'Slack resources', correct: true, why: 'Slack resources are one of the four sources (with structure, tenure and intra-communications): they make innovation possible.' },
        ],
      }}
    />
  );
}
