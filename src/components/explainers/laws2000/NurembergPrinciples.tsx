/*
SCENE: The Nuremberg Principles — an entrance hall and four rooms, each closing one escape route from liability,
  ending in a courtyard that separates responsibility from immunity
LENGTH: 6 loci; pinned 360vh on desktop (scroll walks), paced otherwise (Palace base)
BEATS: 6 (Resolution 95(I) → I any person → II internal law → III official position → IV superior orders → courtyard)
INTENT: Principle I fixes individual responsibility; II, III and IV each deny an excuse — internal law, office,
  orders (the last only where a moral choice was in fact possible); immunity is a separate, procedural question.
SUBJECT: the amber light standing at the current room.
BEAT 1–6: one locus per step; caption beside the scene. Ease: frame-rate independent smoothing (base).
CAMERA: 35mm-equivalent dolly, yaw ≤ 15°, no cuts. LIGHT: one amber point at the locus. SOUND: none.
REDUCED MOTION: the six loci as a numbered list (no WebGL).
BUDGET: own chunk < 6 KB gz, draw calls < 20, 60 fps at 4× throttle.
Source: concept laws2000-w11-nuremberg-principles; unga-resolution-95-i (Week 11 Lecture Slides, slide 12); the
  courtyard draws on laws2000-w06-immunity-and-serious-international-crimes ("immunity does not mean impunity").
*/
import { Palace } from '../bases/Palace';

export default function NurembergPrinciples() {
  return (
    <Palace
      label="The four Nuremberg Principles, each closing an escape route from responsibility"
      terms={[
        { term: 'Resolution 95(I)', def: 'The General Assembly’s affirmation of the Nuremberg principles, 11 December 1946.' },
        { term: 'Internal law', def: 'A state’s own domestic law.' },
        { term: 'Superior orders', def: 'Acting pursuant to an order of one’s government or of a superior.' },
        { term: 'Moral choice', def: 'Principle IV’s qualifier: orders are no excuse where a moral choice was in fact possible.' },
      ]}
      loci={[
        { title: 'Entrance · Resolution 95(I)', body: 'On 11 December 1946 the UN General Assembly affirmed the “Principles of International Law Recognized in the Charter of the Nürnberg Tribunal and in the Judgment of the Tribunal”.' },
        { title: 'I · Any person', body: '“Any person who commits an act which constitutes a crime under international law is responsible therefor and liable to punishment.” Individuals, not only states, answer.' },
        { title: 'II · Internal law is no shield', body: 'That internal law imposes no penalty for an international crime “does not relieve the person who committed the act from responsibility under international law”. Answers: “my country’s law allowed it”.' },
        { title: 'III · Office is no shield', body: 'Acting “as Head of State or responsible Government official does not relieve him from responsibility under international law”. Answers: “I was head of state” — and covers officials too.' },
        { title: 'IV · Orders are no shield — with a qualifier', body: 'Acting “pursuant to order of his Government or of a superior does not relieve him from responsibility under international law, provided a moral choice was in fact possible to him”.' },
        { title: 'Courtyard · Responsibility, not immunity', body: 'Principle III is about responsibility, which is substantive. Week 6’s immunities are procedural: they may stop a particular foreign court proceeding while an official serves, but immunity does not mean impunity.' },
      ]}
      check={{
        question: 'A general obeyed an order to kill prisoners, though he could have refused. Under Principle IV, is he relieved of responsibility?',
        options: [
          { text: 'No — a moral choice was in fact possible to him', correct: true, why: 'Principle IV denies relief from responsibility “provided a moral choice was in fact possible”; he could have refused.' },
          { text: 'Yes — superior orders relieve a subordinate of responsibility', why: 'Principle IV says the opposite: orders do not relieve responsibility where a moral choice was possible.' },
          { text: 'Yes, if his state’s law permitted the killings', why: 'Principle II: the absence of a penalty in internal law does not relieve responsibility under international law.' },
        ],
      }}
    />
  );
}
