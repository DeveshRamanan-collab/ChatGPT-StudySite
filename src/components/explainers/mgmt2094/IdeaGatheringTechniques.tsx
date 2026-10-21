/*
SCENE: Idea gathering — from the 1721 idea box to crowdsourcing, with brainstorming alongside
LENGTH: 5 events, learner-dragged (Timeline base)
INTENT: See participatory innovation move outward — a rewarded box inside one organisation (1721), quality circles
  and Kaizen (seventies), idea management software (2000s), crowds outside the firm (2010s) — and set the undated,
  in-meeting technique (brainstorming) beside it, so the two strands of idea gathering are not confused.
SUBJECT: the handle; each event's detail beneath the track.
EVENTS: 1721 idea box → seventies quality circles and Kaizen → 2000s idea management software → 2010s idea
  crowdsourcing → (undated, placed last and labelled "alongside") brainstorming.
REDUCED MOTION: same controls, no glide (base).
BUDGET: < 5 KB gz. Dates only where the slide gives them; brainstorming carries none.
Source: concept mgmt2094-w02-idea-gathering-techniques; week 2 lecture slides 9–10 and 13 (content-src/mgmt2094-w02.yaml);
  example cards mgmt2094-example-tokugawa-idea-box, mgmt2094-example-idea-crowdsourcing,
  mgmt2094-example-osborne-bbdo-brainstorming (the slides spell the name "Orborn" and "Osborne": verify).
*/
import { Timeline } from '../bases/Timeline';

export default function IdeaGatheringTechniques() {
  return (
    <Timeline
      label="Idea gathering: participatory innovation from 1721 to the 2010s, and brainstorming"
      terms={[
        { term: 'Idea gathering', def: 'One of the four families of creativity techniques: collecting ideas from people.' },
        { term: 'Participatory innovation', def: 'Open procedures for the collection, analysis and application of ideas.' },
        { term: 'Idea crowdsourcing', def: 'Seeking new ideas outside the organisation.' },
        { term: 'Brainstorming', def: 'In a meeting: as many ideas as possible, no censorship, sort them afterwards.' },
      ]}
      events={[
        { when: '1721', title: 'The idea box (meyasu bako)', tag: 'participatory innovation', body: 'The best ideas deposited in an "idea box" are rewarded — Shôgun Tokugawa Yoshimune.' },
        { when: 'Seventies', title: 'Quality circles and Kaizen', tag: 'participatory innovation', body: 'Japanese companies develop quality circles and « Kaizen ».' },
        { when: '2000s', title: 'Idea management software', tag: 'participatory innovation', body: 'Idea management software; participatory innovation: open procedures for the collection, analysis and application of ideas.' },
        { when: '2010s', title: 'Idea crowdsourcing', tag: 'outside the firm', body: 'Companies seek new ideas outside, through idea crowdsourcing: Crossing, YourEncore, CrowdSpirit, InnoCentive.' },
        { title: 'Alongside: brainstorming (Alex Osborne, BBDO)', tag: 'in-meeting technique, not dated', body: 'In order to answer a question, generate in a meeting as many ideas as possible in a short time without exercising censorship on the participants. Analyse and prioritise ideas afterwards. Usage: product ideas, solutions to a problem, names, slogans.' },
      ]}
      check={{
        question: 'A firm wants solutions to a hard technical problem from people outside the company. Which step fits?',
        options: [
          { text: 'Quality circles and Kaizen', why: 'Quality circles work inside Japanese companies, not with outsiders.' },
          { text: 'Idea crowdsourcing', correct: true, why: 'Seeking new ideas outside the organisation is the 2010s step: idea crowdsourcing (e.g. InnoCentive).' },
          { text: 'The 1721 idea box', why: 'The idea box collected ideas within one organisation, rewarding the best.' },
        ],
      }}
    />
  );
}
