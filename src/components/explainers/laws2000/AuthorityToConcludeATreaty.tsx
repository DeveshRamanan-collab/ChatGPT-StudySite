/*
SCENE: Authority to conclude a treaty — three national chambers, then the art 7 anteroom at the negotiating table
LENGTH: 5 loci; pinned 300vh on desktop (scroll walks), paced otherwise
BEATS: 5 (domestic law decides → UK → USA → Australia → art 7 VCLT full powers and the three exempt officials)
INTENT: Fix the two-step analysis: the state's constitutional arrangement first, then whether the negotiator needed full powers.
SUBJECT: the amber light standing at the current chamber.
CAMERA: 35mm-equivalent dolly, yaw ≤ 15°, no cuts. LIGHT: one amber point at the locus. SOUND: none.
REDUCED MOTION: the five loci as a numbered list (no WebGL).
BUDGET: own chunk < 6 KB gz, draw calls < 20, 60 fps at 4× throttle.
Source: concept laws2000-w03-authority-to-conclude-a-treaty; VCLT art 7; Constitutional Reform and Governance Act 2010
  (UK) s 20; Australian Constitution s 61.
*/
import { Palace } from '../bases/Palace';

export default function AuthorityToConcludeATreaty() {
  return (
    <Palace
      label="Who may bind a state: the UK, US and Australian arrangements, then art 7 VCLT full powers"
      terms={[
        { term: 'Full powers', def: 'A document showing a person represents the state for negotiating or concluding a treaty (art 7 VCLT).' },
        { term: 'Executive agreement', def: 'A US agreement the President makes binding without two-thirds Senate consent.' },
        { term: 'Prerogative', def: 'The Crown’s “foreign relations” power under which the UK government concludes treaties.' },
      ]}
      loci={[
        { title: 'Entry · Domestic law decides', body: 'Who can bind a state internationally is not settled by international law: look at each state’s own domestic law.' },
        { title: 'Chamber 1 · United Kingdom', body: 'The Crown concludes treaties under the foreign relations prerogative, but s 20 Constitutional Reform and Governance Act 2010 requires the treaty to be laid before Parliament before ratification.' },
        { title: 'Chamber 2 · United States', body: 'A “treaty” needs two-thirds Senate consent, but the President can bind by executive agreement — the Paris Agreement was joined and left by executive order (Obama 2016, Trump 2017, Biden 2021, Trump 2025).' },
        { title: 'Chamber 3 · Australia', body: 'Section 61 of the Constitution gives the executive the power to conclude treaties, exercised by the Foreign Minister, DFAT and the Attorney-General’s Office of International Law.' },
        { title: 'Anteroom · Article 7 VCLT', body: 'A person who produces full powers is taken to represent the state. A head of state, a head of government and a minister for foreign affairs need not produce anything; everyone else should.' },
      ]}
      check={{
        question: 'Australia’s trade minister signs a treaty without producing full powers. What is the issue?',
        options: [
          { text: 'None: every minister is exempt under art 7', why: 'Only the head of state, head of government and foreign minister are exempt.' },
          { text: 'The trade minister is not one of the three exempt officials, so should have produced full powers', correct: true, why: 'Art 7 presumes authority only for those three; everyone else should produce a letter of full powers.' },
          { text: 'The treaty is invalid because s 61 gives treaty power to Parliament', why: 'Section 61 gives the power to the executive, not Parliament.' },
        ],
      }}
    />
  );
}
