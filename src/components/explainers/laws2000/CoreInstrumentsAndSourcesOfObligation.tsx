/*
SCENE: Core human rights treaties in date order, then the sources of human rights obligations
LENGTH: 10 loci; pinned ≈ 600vh on desktop (scroll walks the corridor), paced otherwise
BEATS: 10 — seven treaty rooms (1965 → 2006, the two 1966 Covenants and the two 2006 Conventions sharing a room),
  then three landings: treaty law, customary international law, jus cogens.
INTENT: Fix the nine core instruments in date order, then show that obligations also come from custom — some of it
  jus cogens — so a state outside a treaty can still be bound.
SUBJECT: the amber light standing at the current room.
BEAT 1–7 (0–70%): treaty rooms, one per locus. BEAT 8–10 (70–100%): treaty law, custom, jus cogens. Scrub: ease none.
CAMERA: 35mm-equivalent dolly, yaw ≤ 15°, no cuts (base). LIGHT: one amber point at the locus. SOUND: none.
REDUCED MOTION: the ten loci as a numbered list (no WebGL).
BUDGET: own chunk < 6 KB gz; Palace base draw calls < 20; 60 fps at 4× throttle.
Source: concept laws2000-w12-core-instruments-and-sources-of-obligation; authority vclt-art-53; Week 12 lecture
  slides 10–11 (dates as the slides give them).
*/
import { Palace } from '../bases/Palace';

export default function CoreInstrumentsAndSourcesOfObligation() {
  return (
    <Palace
      label="Nine core human rights treaties in date order, then treaty law, customary law and jus cogens as sources of obligation"
      terms={[
        { term: 'Core instrument', def: 'One of the nine UN human rights treaties the lecture lists, from ICERD (1965) to the two 2006 Conventions.' },
        { term: 'Customary international law', def: 'Binding law from state practice accepted as law — for human rights, e.g. torture, genocide, racial discrimination.' },
        { term: 'Jus cogens', def: 'A peremptory norm “from which no derogation is permitted” (VCLT art 53).' },
      ]}
      loci={[
        { title: 'Room 1 · ICERD — 21 Dec 1965', body: 'The International Convention on the Elimination of All Forms of Racial Discrimination: the earliest of the nine core instruments, a year before the Covenants.' },
        { title: 'Room 2 · ICCPR and ICESCR — 16 Dec 1966', body: 'The two Covenants share a date. With the UDHR they also make up the International Bill of Rights.' },
        { title: 'Room 3 · CEDAW — 18 Dec 1979', body: 'The Convention on the Elimination of All Forms of Discrimination against Women.' },
        { title: 'Room 4 · CAT — 10 Dec 1984', body: 'The Convention against Torture and Other Cruel, Inhuman or Degrading Treatment or Punishment.' },
        { title: 'Room 5 · Rights of the Child — 20 Nov 1989', body: 'The Convention on the Rights of the Child.' },
        { title: 'Room 6 · Migrant Workers — 18 Dec 1990', body: 'The International Convention on the Protection of the Rights of All Migrant Workers and Members of Their Families.' },
        { title: 'Room 7 · CRPD and Enforced Disappearance — Dec 2006', body: 'The Convention on the Rights of Persons with Disabilities (13 Dec 2006) and the International Convention for the Protection of All Persons from Enforced Disappearance (20 Dec 2006) close the list.' },
        { title: 'Landing 1 · Treaty law', body: 'The core instruments, plus regional treaties: the European Convention on Human Rights and the American Convention on Human Rights. A treaty binds its parties.' },
        { title: 'Landing 2 · Customary international law', body: 'Human rights norms also exist as custom — the lecture’s examples are torture, genocide and racial discrimination — so a state can be bound without ratifying the treaty.' },
        { title: 'Landing 3 · Jus cogens', body: 'Some of these customary norms are considered jus cogens: no derogation is permitted, and they can be modified only by a later norm of the same character (VCLT art 53).' },
      ]}
      check={{
        question: 'State X never ratified the Convention against Torture, and its police torture a detainee. Is X bound not to torture?',
        options: [
          { text: 'No — a treaty binds only its parties, so X owes nothing', why: 'True of CAT itself, but the prohibition of torture is also customary international law, which binds X without ratification.' },
          { text: 'Yes — the prohibition is customary and considered jus cogens', correct: true, why: 'The lecture gives torture as a customary human rights norm, and some such norms are jus cogens: X is bound and cannot derogate.' },
          { text: 'Only if X later ratifies the European Convention on Human Rights', why: 'The ECHR is a regional treaty source; X’s obligation does not depend on joining it, because custom already binds X.' },
        ],
      }}
    />
  );
}
