/*
SCENE: The innovation process and innovation management — a corridor walk
LENGTH: 10 loci; pinned 600vh on desktop (scroll walks), paced otherwise (Palace base)
BEATS: 10 (one per locus)
INTENT: Fix the order of the eight-step innovation process (with steps 3 and 4 as a buy-or-build choice), then the
  three levels at which innovation occurs and what innovation management is, including the organisational process.
SUBJECT: the amber light standing at the current locus.
BEAT 1–8: the eight steps in the slide's order — scan, align, acquire, generate, explore and select, execute, learn,
  develop — with Lego's in-house materials search (Reed, 2018) at steps 4 and 5.
BEAT 9: three levels — national (government policies and support), enterprise, individual and group.
BEAT 10: innovation management — the most appropriate solution, effective routines, managed learning — and the
  organisational process from market learning to paying the innovators well.
CAMERA: 35mm-equivalent, dolly along the corridor, yaw ≤ 15° toward the locus, no cuts (base).
LIGHT: one amber point at the current locus; paper fill. SOUND: none.
REDUCED MOTION: the ten loci as a numbered list (no WebGL).
BUDGET: own chunk < 6 KB gz (three is a shared vendor chunk), draw calls < 20, 60 fps at 4× throttle.
Source: concept mgmt2094-w08-innovation-process-and-management (Week 8 slides 11–14; lecture recording on buy, build
  or hybrid and on routines); authority mgmt2094-reed-2018-lego-plastic-free-brick.
*/
import { Palace } from '../bases/Palace';

export default function InnovationProcessAndManagement() {
  return (
    <Palace
      label="A corridor with ten frames: the eight steps of the innovation process, the three levels, and innovation management"
      terms={[
        { term: 'Innovation process', def: 'The eight steps from scanning the environment to developing the organisation.' },
        { term: 'Routine', def: 'The established way things are done; innovation by definition changes routines.' },
        { term: 'Innovation management', def: 'Finding the most appropriate solution, searching for effective routines and managing the learning process.' },
      ]}
      loci={[
        { title: '1. Scan the environment', body: 'Recognising or scanning the environment: notice what is changing outside — technology, competitors, customers, regulation.' },
        { title: '2. Align strategy and innovation', body: 'Aligning the overall business strategy and the proposed innovation: does it fit who we are and strengthen the strategy, or must the strategy change?' },
        { title: '3. Acquire technology from outside', body: 'Buy it in — or go to step 4. Steps 3 and 4 are a choice: acquire, generate in-house, or a hybrid of both.' },
        { title: '4. Generate technology in-house', body: 'Build it yourself. Lego\'s search for plastic-free materials (Reed, 2018) — its own lab, about 1 billion kroner and some 100 new hires — is generating in-house.' },
        { title: '5. Explore and select', body: 'Exploring and selecting the most suitable response to the environment. Lego has tested around 200 alternative materials; most have fallen short so far.' },
        { title: '6. Execute and implement', body: 'Executing and implementing the innovation — usually a rocky road.' },
        { title: '7. Learn lessons', body: 'Learning lessons for improvement, as the organisation goes along with the innovation.' },
        { title: '8. Develop the organisation', body: 'Developing the organisation: adding to its capabilities so it becomes more competitive.' },
        { title: 'Three levels', body: 'National level — government policies and support. Enterprise level — enterprise policies, support and initiatives. Individual level — individual and group innovation activities. A team\'s solution can rise to the organisational level.' },
        { title: 'Managing innovation', body: 'Find the most appropriate solution for the organisation\'s circumstances; search for effective routines (hard: people are used to them); manage the learning. The organisational process runs from market learning to paying the innovators well.' },
      ]}
      check={{
        question: 'A retailer licenses an app platform instead of building its own, then tests three designs and launches one. Which step did it skip?',
        options: [
          { text: 'Generating technology in-house — a mistake', why: 'Generating in-house is the alternative to acquiring from outside, so leaving it out is a choice, not a mistake.' },
          { text: 'None it needed: buying rather than building is a valid choice', correct: true, why: 'Steps 3 and 4 are a buy-or-build choice (or a hybrid); it acquired, then explored and selected, then executed.' },
          { text: 'Exploring and selecting', why: 'Testing three designs and choosing one is exactly exploring and selecting the most suitable response.' },
        ],
      }}
    />
  );
}
