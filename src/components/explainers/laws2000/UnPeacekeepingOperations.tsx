/*
SCENE: UN peacekeeping — three rooms for the traditional principles, then an annex for how practice has evolved
LENGTH: 6 loci; pinned 360vh on desktop (scroll walks), paced otherwise
BEATS: 6 (what peacekeeping is → consent → impartiality → force only in self-defence → transitional administration
  → robust mandates and today's missions)
INTENT: Fix that peacekeeping is a consent-based UN operation, not in the Charter and created to keep rather than
  enforce the peace, and show how far practice has moved from the self-defence-only model.
SUBJECT: the amber light standing at the current room.
CAMERA: 35mm-equivalent dolly, yaw ≤ 15°, no cuts (base). LIGHT: one amber point at the locus. SOUND: none.
REDUCED MOTION: the six loci as a numbered list (no WebGL).
BUDGET: own chunk < 6 KB gz, draw calls < 20, 60 fps at 4× throttle.
Source: concept laws2000-w10-un-peacekeeping-operations; Week 10 slides 33–36, 44.
*/
import { Palace } from '../bases/Palace';

export default function UnPeacekeepingOperations() {
  return (
    <Palace
      label="UN peacekeeping: the three traditional principles, then how practice has evolved"
      terms={[
        { term: 'Peacekeeping operation', def: 'A UN-run operation, primarily created to keep the peace, not to enforce it.' },
        { term: 'Authorisation', def: 'The other option: the Council empowering states or regional bodies to use force (art 42).' },
        { term: 'Robust mandate', def: 'A mission authorised to use force to carry out its mandate.' },
      ]}
      loci={[
        { title: 'Entrance · What peacekeeping is', body: 'Not explicitly mentioned in the UN Charter. Primarily created to keep the peace, not to enforce it. Unlike an authorisation to one state or a group of states, these are UN operations.' },
        { title: 'Room 1 · Consent of the parties', body: 'The first traditional principle: the parties accept the mission.' },
        { title: 'Room 2 · Impartiality', body: 'The second traditional principle: the mission takes no side between the parties.' },
        { title: 'Room 3 · Non-use of force except in self-defence', body: 'The third traditional principle — the one practice has moved furthest from.' },
        { title: 'Annex 1 · Transitional administration', body: 'Gradually evolving: the UN has acted as a transitional administration in Kosovo and Timor-Leste.' },
        { title: 'Annex 2 · Robust mandates and today', body: 'A changing attitude to force: some missions are authorised to use force to carry out their mandate — the DRC (including targeted offensive operations) and Mali. Deployments passed 100,000 by 2015, mostly in sub-Saharan Africa; current missions include MONUSCO, MINUSCA, UNMISS, UNIFIL, UNFICYP and UNMIK.' },
      ]}
      check={{
        question: 'A government and rebels agree a ceasefire and invite a neutral UN force that may fire only in self-defence. What is it?',
        options: [
          { text: 'An art 42 enforcement action authorised to member states', why: 'Art 42 action enforces the peace through states; this force keeps a peace the parties have accepted.' },
          { text: 'A traditional UN peacekeeping operation', correct: true, why: 'Consent of the parties, impartiality and non-use of force except in self-defence are the three traditional principles.' },
          { text: 'An implied authorisation, since no resolution says “all necessary means”', why: 'Implied authorisation concerns states claiming authority to use force, not a consent-based UN mission.' },
        ],
      }}
    />
  );
}
