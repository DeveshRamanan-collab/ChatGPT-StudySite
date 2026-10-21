/*
SCENE: History I — the polis to Westphalia
LENGTH: not pinned — a draggable Timeline (learner-paced), 7 events
BEATS: terms → drag from the polis to 1648 → each node opens its key idea → one check
INTENT: Show competing sources of authority (nature, church, empire, consent) converging on Westphalia, the hinge
  after which the system is about sovereign states.
SUBJECT: the handle; events up to it are inked.
CAMERA: none (HTML track). LIGHT: none. SOUND: none.
REDUCED MOTION: off — the handle jumps instead of gliding (base); same controls.
BUDGET: < 5 KB gz. Dates only where the card gives them (lifespans go in titles, not the track).
Source: concept laws2000-w01-history-ancient-to-westphalia.
*/
import { Timeline } from '../bases/Timeline';

export default function HistoryAncientToWestphalia() {
  return (
    <Timeline
      label="Timeline of international law from the Greek polis to the Peace of Westphalia"
      terms={[
        { term: 'Jus naturale', def: 'Natural law: universal values governing relations between people.' },
        { term: 'Jus gentium', def: 'Human-made law of nations, variable in time and place, resting on states’ consent.' },
        { term: 'Sovereignty', def: 'Supreme authority of a state over its territory and people — born, on the usual account, at Westphalia.' },
      ]}
      events={[
        { title: 'The Greek polis and “nomos”', tag: 'Ancient', body: 'City-states with mutual expectations of behaviour; nomos restricts natural freedoms for expediency and self-interest. Thucydides: “the strong do what they can and the weak suffer what they must” — echoed, inverted, in sovereign equality.' },
        { title: 'Roman law', tag: 'Ancient', body: 'Rome’s jus naturale and jus civile carry the idea of shared rules forward.' },
        { title: 'Late Middle Ages: natural law', tag: '15th–16th centuries', body: 'Most textbooks place international law’s emergence as a system here, under the Holy Roman Empire and the Catholic Church, and the theory of natural law.' },
        { title: 'Francisco de Vitoria (1483–1546)', tag: 'Colonialism', body: 'Native populations of the New World were part of the human race, so natural law applied to them; “discovery” was rejected as a justification for conquest.' },
        { title: 'Hugo Grotius (1583–1645)', tag: 'Secular turn', body: 'Secularised natural law and distinguished it from jus gentium, whose validity rested on states’ consent rather than natural reason.' },
        { title: 'Suarez and Vattel', tag: 'Law of Nations', body: 'Francisco Suarez and Emmerich de Vattel followed; Vattel underlined the equality of states irrespective of power.' },
        { when: '1648', title: 'Peace of Westphalia', tag: 'The hinge', body: 'The treaties of Munster and Osnabruck end the Thirty Years’ War: the “beginning” of the international state system, organising territory and people into states — and the birth of sovereignty itself.' },
      ]}
      check={{
        question: 'Why is Westphalia (1648) treated as the hinge of the story?',
        options: [
          { text: 'It created the first international court', why: 'Courts came much later (the PCA from 1899, the PCIJ in 1920).' },
          { text: 'It began the state system: before it, competing sources of authority; after it, sovereign states', correct: true, why: 'The card’s exam use: Westphalia organised territory and people into states and gave birth to sovereignty.' },
          { text: 'Grotius wrote it into natural law', why: 'Grotius secularised natural law; Westphalia is a set of peace treaties, not a theory.' },
        ],
      }}
    />
  );
}
