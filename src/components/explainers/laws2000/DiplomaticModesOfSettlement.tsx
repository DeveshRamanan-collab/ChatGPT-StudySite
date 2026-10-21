/*
SCENE: The diplomatic modes — a corridor of five rooms, the third party stepping further in at each door
LENGTH: 5 loci; pinned 300vh on desktop (scroll walks), paced otherwise
BEATS: 5 (one per locus)
INTENT: Fix the five diplomatic modes in order of the third party's growing role — none, facilitating, proposing,
  finding facts, reporting recommendations — and that none of them produces a binding outcome.
SUBJECT: the amber light standing at the current locus.
BEAT 1: Negotiation — no third party; good faith (GA Res 53/101); a genuine attempt (North Sea, para 85).
BEAT 2: Good offices — a neutral third party helps the parties into direct talks (UN mission in Lebanon).
BEAT 3: Mediation — the third party suggests a framework of settlement (Holbrooke, Bosnian War); not binding.
BEAT 4: Inquiry — establishes disputed facts in a non-binding report (Syria commission; MH17 team).
BEAT 5: Conciliation — a report on facts and positions with non-binding recommendations (Timor Sea).
CAMERA: 35mm-equivalent, dolly along the corridor, yaw ≤ 15° toward the locus, no cuts; slight breathing drift.
LIGHT: one amber point (glow sprite) at the current locus; paper fill. SOUND: none.
REDUCED MOTION: the five loci as a numbered list (no WebGL).
BUDGET: own chunk ≤ 120 KB gz (three is a shared vendor chunk), draw calls < 20, 60 fps at 4× throttle.
Source: concept laws2000-w08-diplomatic-modes-of-settlement; Week 8 slides 18–21 and the live lecture (Part A).
*/
import { Palace } from '../bases/Palace';

export default function DiplomaticModesOfSettlement() {
  return (
    <Palace
      label="A corridor with five frames: negotiation, good offices, mediation, inquiry, conciliation"
      terms={[
        { term: 'Diplomatic modes', def: 'The non-adjudicatory means in art 33(1): the outcome is never binding.' },
        { term: 'Third party', def: 'A neutral person, group or state trusted by both sides.' },
        { term: 'Good faith', def: 'A genuine attempt to resolve the dispute — no unjustified walk-outs (GA Res 53/101).' },
      ]}
      loci={[
        { title: 'Negotiation', body: 'No third party: the states keep control of the dispute, its timing and its publicity. The most common mode and usually the first step. It must be in good faith, in a constructive atmosphere (GA Res 53/101), and presupposes a genuine attempt to resolve the dispute (North Sea Continental Shelf, para 85).' },
        { title: 'Good offices', body: 'A neutral third party, trusted by both, offers to facilitate and support efforts to enter direct negotiations — an individual, a group, one state or several (e.g. the UN good offices mission in Lebanon). It opens the door; it does not propose terms.' },
        { title: 'Mediation', body: 'The third party takes a more direct role and suggests a framework of settlement or possible solutions (Richard Holbrooke, Bosnian War). Usually confidential; the parties keep control, and the mediator’s solutions are not binding.' },
        { title: 'Inquiry or fact-finding', body: 'For disputes over the facts. Usually agreed by consent and ending in a non-binding report the parties can use — e.g. the UN Commission of Inquiry in Syria; the Joint Investigation Team on the 2014 downing of a Malaysian Airlines plane, which held Russia responsible (Russia rejected it).' },
        { title: 'Conciliation', body: 'A third party, such as a group of experts, reports on all the facts and the parties’ positions and suggests a way forward. The recommendations are not binding, but the parties may negotiate on them — e.g. Timor-Leste and Australia’s Timor Sea boundary, under UNCLOS.' },
      ]}
      check={{
        question: 'A panel of experts studies two states’ dispute, sets out the facts and each side’s position, and proposes a solution they may use. Which mode is it, and does it bind?',
        options: [
          { text: 'Arbitration — the panel’s proposal is a binding award', why: 'Arbitration ends in a final and binding award; a proposal the states “may use” is not an award.' },
          { text: 'Conciliation — its recommendations are not binding', correct: true, why: 'A report on facts and positions with a suggested solution is conciliation, and the parties are not bound by it.' },
          { text: 'Good offices — the panel only helps the parties start talking', why: 'Good offices facilitate direct negotiations without proposing solutions; this panel proposes one.' },
        ],
      }}
    />
  );
}
