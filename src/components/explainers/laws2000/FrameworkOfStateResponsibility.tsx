/*
SCENE: State responsibility — five rooms walked in order, with breach and attribution as the load-bearing rooms
LENGTH: 6 loci; pinned 360vh on desktop (scroll walks), paced otherwise
BEATS: 6 (secondary rules over primary rules → primary obligation → breach → attribution → precluding grounds → consequences)
INTENT: Walk the five steps of a problem in order, knowing that art 2's two elements — breach and attribution — carry
  the wrongful act, and that these are secondary rules over the primary obligations.
SUBJECT: the amber light standing at the current room.
CAMERA: 35mm-equivalent dolly, yaw ≤ 15°, no cuts. LIGHT: one amber point at the locus. SOUND: none.
REDUCED MOTION: the six loci as a numbered list (no WebGL).
BUDGET: own chunk < 6 KB gz, draw calls < 20, 60 fps at 4× throttle.
Source: concept laws2000-w07-framework-of-state-responsibility; ARSIWA arts 1, 2.
*/
import { Palace } from '../bases/Palace';

export default function FrameworkOfStateResponsibility() {
  return (
    <Palace
      label="State responsibility: the five steps, with breach and attribution (art 2) as the two elements"
      terms={[
        { term: 'Primary rules', def: 'Substantive obligations in treaty or custom, such as non-use of force.' },
        { term: 'Secondary rules', def: 'State responsibility: when breaching a primary rule triggers responsibility, and the consequences.' },
        { term: 'ARSIWA', def: 'The ILC’s Articles on Responsibility of States for Internationally Wrongful Acts (2001) — not a treaty, but many articles appear to codify custom.' },
      ]}
      loci={[
        { title: 'Roof · Secondary rules over primary rules', body: '“Every internationally wrongful act of a State entails its international responsibility” (art 1). The general regime concerns states only; it covers crime-like and tort-like wrongs alike.' },
        { title: 'Step 1 · Primary legal obligation?', body: 'Name the primary rule, in treaty law or customary international law.' },
        { title: 'Step 2 · Prima facie breach? — element (2)', body: 'Load-bearing: conduct, an act or omission, that constitutes a breach of an international obligation owed by that state (art 2).' },
        { title: 'Step 3 · Attributable to a state? — element (1)', body: 'Load-bearing: the conduct is attributable to the state under international law (art 2). Never skip it just because the breach is obvious.' },
        { title: 'Step 4 · Grounds precluding wrongfulness?', body: 'Test any ground the facts raise.' },
        { title: 'Step 5 · Consequences', body: 'Cessation, reparation — and who may invoke responsibility.' },
      ]}
      check={{
        question: 'Under art 2 ARSIWA, what makes an act internationally wrongful?',
        options: [
          { text: 'A breach of an international obligation, whoever committed it', why: 'Breach alone is not enough: the conduct must also be attributable to the state.' },
          { text: 'Conduct attributable to the state that breaches an international obligation it owes', correct: true, why: 'Those are the two elements of art 2: attribution and breach.' },
          { text: 'Conduct unlawful under the state’s own domestic law', why: 'Wrongfulness is a question of international obligations, not domestic legality.' },
        ],
      }}
    />
  );
}
