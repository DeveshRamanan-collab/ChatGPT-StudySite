/*
SCENE: Types of innovation — a corridor of eight frames
LENGTH: 8 loci; pinned 480vh on desktop (scroll walks the corridor), paced Next/Back otherwise (Palace base)
BEATS: 8 (one per locus)
INTENT: Fix the seven types of innovation in the slide's order, each with its slide example, after first setting
  radical against incremental — so a scenario can be named precisely (online recruiting is process, JIT production).
SUBJECT: the amber light standing at the current frame.
BEAT 1: radical vs incremental — both count; incremental far more frequent.
BEAT 2–8: product (Braille Rubik's cube) · process (online recruiting) · organisational (new venture division, new
  accounting procedure) · management (TQM) · production (quality circles, JIT) · commercial/marketing (guerrilla
  campaigns) · service (internet-based financial services).
CAMERA: 35mm-equivalent dolly along the corridor, yaw ≤ 15° toward the frame, no cuts (base).
LIGHT: one amber point at the current locus; paper fill. SOUND: none.
REDUCED MOTION: the eight loci as a numbered list (no WebGL), check beneath.
BUDGET: own chunk < 4 KB gz (three and the Palace base are shared), draw calls < 20, 60 fps at 4× throttle.
Source: concept mgmt2094-w11-types-of-innovation (Week 11 slide 2; Week 9 recording for the lecturer's gloss);
  example mgmt2094-example-braille-rubiks-cube.
*/
import { Palace } from '../bases/Palace';

export default function TypesOfInnovation() {
  return (
    <Palace
      label="A corridor of eight frames: radical and incremental, then the seven types of innovation"
      terms={[
        { term: 'Radical innovation', def: 'A major advance, such as a completely new product.' },
        { term: 'Incremental innovation', def: 'A minor advance that improves on what exists; far more frequent than radical.' },
        { term: 'Type of innovation', def: 'Where the change happens: the product, a process, the organisation, its management, production, marketing or service.' },
      ]}
      loci={[
        { title: 'Radical or incremental', body: 'Industrial innovation includes major (radical) innovation and minor (incremental) technological advances. Both count, and incremental improvements happen far more often than completely new products.' },
        { title: 'Product', body: "The development of a new or improved product. Slide example: the Braille Rubik's cube, which people with vision impairment can use." },
        { title: 'Process', body: 'A new process, such as a manufacturing process or online recruiting in HR. It mostly happens inside the firm, so it is less noticeable, yet it can be substantial.' },
        { title: 'Organisational', body: 'A change to how the organisation is set up. Slide examples: a new venture division; a new accounting procedure.' },
        { title: 'Management', body: 'A new approach to managing. Slide example: TQM (Total Quality Management).' },
        { title: 'Production', body: 'New systems for organising production. Slide examples: quality circles; JIT (just in time).' },
        { title: 'Commercial/marketing', body: 'A new way of promoting and selling. Slide example: guerrilla marketing campaigns.' },
        { title: 'Service', body: 'A new way of serving the customer. Slide example: internet-based financial services.' },
      ]}
      check={{
        question: 'On the slides, which type of innovation is a new accounting procedure?',
        options: [
          { text: 'Process innovation', why: 'Tempting because accounting sounds like a process, but the slides list a new accounting procedure under organisational innovation; the process example is online recruiting.' },
          { text: 'Organisational innovation', correct: true, why: 'The slides give a new venture division and a new accounting procedure as the examples of organisational innovation.' },
          { text: 'Management innovation', why: 'Tempting because managers use the accounts, but the slides keep management innovation for TQM.' },
        ],
      }}
    />
  );
}
