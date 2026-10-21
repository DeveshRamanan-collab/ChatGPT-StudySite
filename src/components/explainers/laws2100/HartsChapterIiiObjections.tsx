/*
SCENE: Hart's Chapter III — three doors cut into the coercive-orders model
LENGTH: 4 loci; pinned 240vh on desktop (scroll walks), paced otherwise
BEATS: 4
INTENT: The model of coercive orders fails on content, range and origin; each objection tests Austin on his own
  metatheoretical criterion — a descriptive theory must fit the facts.
SUBJECT: the amber light standing at the current door.
BEAT 1: content (power-conferring rules). BEAT 2: range (legislator bound). BEAT 3: origin (custom; Austin's tacit
  orders reply). BEAT 4: the strategy — change the theory, not the reality.
CAMERA: 35mm-equivalent dolly, yaw ≤ 15°, no cuts. LIGHT: one amber point at the door. SOUND: none.
REDUCED MOTION: the four loci as a numbered list (no WebGL).
BUDGET: own chunk < 6 KB gz, draw calls < 20, 60 fps at 4× throttle.
Source: concept laws2100-w02-harts-chapter-iii-objections; authority hart-the-concept-of-law.
*/
import { Palace } from '../bases/Palace';

export default function HartsChapterIiiObjections() {
  return (
    <Palace
      label="Three doors in the coercive-orders model: content, range and origin, then Hart's strategy"
      terms={[
        { term: 'Duty-imposing rule', def: 'A rule that requires or forbids conduct — this is forbidden; if you do it, you go to jail.' },
        { term: 'Power-conferring rule', def: 'A rule that gives people powers: to make a contract, write a valid will, get legally married.' },
        { term: 'Coercive orders', def: "Hart's name for orders backed by threats — the model built from Austin." },
      ]}
      loci={[
        { title: 'Door 1 · Content', body: 'Some criminal law resembles coercive orders, but the law also confers powers. There is no duty to make a will; if you want one, there is a procedure to follow. Can power-conferring rules be explained as orders backed by threats?' },
        { title: 'Door 2 · Range', body: "Legislators make laws that apply to every member of the community, including themselves. In Austin's theory the sovereign's commands are for the rest of the political community, not for the sovereign." },
        { title: 'Door 3 · Origin', body: "Customary law is not created or issued by the sovereign; customs develop in the community and are accepted. Austin's reply: customs are tacit orders of the sovereign, who by not interfering tacitly accepts them." },
        { title: "The corridor · Hart's strategy", body: 'Criticise Austin on his own metatheoretical criteria: a descriptive theory of positive law must fit the facts of real legal systems. If it does not, you change the theory, not the reality. After each objection, state the reply Austin (or Kelsen) could make, and engage it.' },
      ]}
      check={{
        question: 'Which objection do the rules for writing a valid will illustrate?',
        options: [
          { text: 'Range of application', why: 'Range concerns who is bound — the legislator bound by her own law — not the kind of rule.' },
          { text: 'Content of laws', correct: true, why: 'Wills show power-conferring rules: no duty to make one, just a procedure to follow if you want one.' },
          { text: 'Modes of origin', why: 'Origin concerns custom that no one issued; the rules on wills are enacted law of a different kind.' },
        ],
      }}
    />
  );
}
