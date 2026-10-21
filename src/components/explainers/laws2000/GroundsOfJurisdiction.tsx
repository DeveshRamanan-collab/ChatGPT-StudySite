/*
SCENE: Grounds for asserting jurisdiction — five rooms, each asking one question about the link, ending in a courtyard
LENGTH: 6 loci; pinned 360vh on desktop (scroll walks), paced otherwise
BEATS: 6 (territoriality → active nationality → passive personality → protection → universality → concurring claims)
INTENT: For every foreign element, name the link to the state — place, offender, victim, security interest or the
  crime itself — and know what happens when claims concur.
SUBJECT: the amber light standing at the current room.
CAMERA: 35mm-equivalent dolly, yaw ≤ 15°, no cuts. LIGHT: one amber point at the locus. SOUND: none.
REDUCED MOTION: the six loci as a numbered list (no WebGL).
BUDGET: own chunk < 6 KB gz, draw calls < 20, 60 fps at 4× throttle.
Source: concept laws2000-w05-grounds-of-jurisdiction; Nottebohm; US v Yunis; Geneva Convention IV art 146;
  Criminal Code Div 268; Cybercrime Convention art 22(5).
*/
import { Palace } from '../bases/Palace';

export default function GroundsOfJurisdiction() {
  return (
    <Palace
      label="Five grounds of jurisdiction, each a link to the state, and the courtyard where concurring claims meet"
      terms={[
        { term: 'Foreign element', def: 'Something beyond the state’s territory or people that requires a recognised ground.' },
        { term: 'Objective / subjective territoriality', def: 'Offence completed on the territory / initiated or planned on it.' },
        { term: 'Universality', def: 'Offences so serious that any state may act, with no direct link.' },
      ]}
      loci={[
        { title: '1 · Territoriality — where?', body: 'The fundamental ground: all acts on the territory and everyone there, citizen or not. Cross-border: objective territoriality (completed here, elements abroad) and subjective territoriality (initiated or planned here).' },
        { title: '2 · Active nationality — who offended?', body: 'A state may prosecute its nationals for acts abroad; dual nationals can face both states. Nationality is “a genuine connection of existence, interests and sentiments” (Nottebohm). Ships and aircraft take their state of registration.' },
        { title: '3 · Passive personality — who was the victim?', body: 'Jurisdiction because the victim is a national (US v Yunis). Controversial; better as a subsidiary ground.' },
        { title: '4 · Protection — what vital interest?', body: 'Acts abroad by non-citizens posing a genuine threat to a vital security interest: counterfeiting currency, espionage, coups, attacks on diplomats.' },
        { title: '5 · Universality — what crime?', body: 'Piracy originally; now genocide, war crimes, crimes against humanity and torture (Geneva Convention IV art 146; Criminal Code Div 268). Without a treaty it is controversial, so states usually require the accused’s presence.' },
        { title: 'Courtyard · Concurring claims', body: 'No universally binding rule. Treaties like the Cybercrime Convention (art 22(5)) require consultation; usually the state with the closest link is best placed.' },
      ]}
      check={{
        question: 'A non-citizen abroad counterfeits State X’s currency. No X national is harmed. On which ground can X best claim jurisdiction?',
        options: [
          { text: 'Passive personality', why: 'Passive personality needs a national victim; there is none.' },
          { text: 'Protection', correct: true, why: 'Counterfeiting currency is a genuine threat to a vital state interest — the classic protective case.' },
          { text: 'Active nationality', why: 'The offender is not X’s national.' },
        ],
      }}
    />
  );
}
