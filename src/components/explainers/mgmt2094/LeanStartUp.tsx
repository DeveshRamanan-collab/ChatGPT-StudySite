/*
SCENE: Lean start-up — three streams meeting in Ries's Lean Startup
LENGTH: 8 events, learner-dragged (Timeline base)
INTENT: See that the lean start-up joins three streams — lean from Japan's manufacturing industry, agile from
  software, and Blank's customer development for start-ups — so its method is customer development + agile
  development, with the MVP and lean–agile development as its key principles.
SUBJECT: the handle; each event's detail beneath the track, tagged with its stream (Lean, Agile, Startup).
EVENTS: Toyota Production System and kanban (1978) → The New New Product Development Game (1986) → Design Patterns
  (1994) → Extreme Programming (1999) → Agile (2001) → Lean Software Development (2003) → The Four Steps to the
  Epiphany (2005) → Lean Startup (2011).
REDUCED MOTION: same controls, no glide (the base handles calm/off).
BUDGET: < 4 KB gz. Dates only as the slide's 'Agile & Lean' family tree and the reading give them.
Source: concept mgmt2094-w10-lean-start-up; slides 5, 7, 18 and 20 (notes "Lean principles used in the concept lean
  start-up"); Embracing Agile for the 2001 manifesto and Sutherland's debt to the 1986 article; example card
  mgmt2094-example-toyota.
*/
import { Timeline } from '../bases/Timeline';

export default function LeanStartUp() {
  return (
    <Timeline
      label="The streams that meet in the lean start-up, 1978 to 2011"
      terms={[
        { term: 'Lean', def: 'Principles from Japan’s manufacturing industry: Toyota’s Production System and kanban.' },
        { term: 'Agile development', def: 'Fast, iterative and incremental product development in short cycles.' },
        { term: 'Customer development', def: 'Testing a start-up’s hypotheses against facts that live outside the building.' },
        { term: 'Minimum viable product', def: 'Just the features needed to sell to early adopters and validate demand.' },
      ]}
      events={[
        { when: '1978', title: 'Toyota’s Production System and kanban', tag: 'Lean', body: 'Taiichi Ohno (1978 in Japanese, 1988 in English). The slides circle it as the source of ‘Lean’ in Japan’s manufacturing industry, and label a Toyota dashboard ‘Our MVP’.' },
        { when: '1986', title: 'The New New Product Development Game', tag: 'Agile', body: 'Takeuchi and Nonaka’s article. It leads to scrum (Sutherland and Schwaber); the reading says Sutherland was inspired in part by it.' },
        { when: '1994', title: 'Design Patterns', tag: 'Agile', body: 'The Gang of Four. In the family tree it leads to extreme programming.' },
        { when: '1999', title: 'Extreme Programming', tag: 'Agile', body: 'Kent Beck. With scrum, it feeds into Agile.' },
        { when: '2001', title: 'Agile', tag: 'Agile', body: 'The Agile Manifesto: 17 software developers in Snowbird, Utah, set four values against waterfall planning.' },
        { when: '2003', title: 'Lean Software Development', tag: 'Lean + Agile', body: 'Mary and Tom Poppendieck bring lean into software; scrumban (2009) and kanban (2010) follow.' },
        { when: '2005', title: 'The Four Steps to the Epiphany', tag: 'Startup', body: 'Steven G. Blank. Start-ups aren’t small versions of large organisations: they are about learning and discovery, and the facts live outside the building.' },
        { when: '2011', title: 'Lean Startup', tag: 'Lean + Agile + Startup', body: 'Eric Ries. Key principles: the MVP and lean–agile development. Method = customer development + agile development: MVP 1 → 2 → 3 → 4 → final product, shaped by customer feedback, with no waste of time and money.' },
      ]}
      check={{
        question: 'On the slides, what does the lean start-up method combine?',
        options: [
          { text: 'Customer development and agile development', correct: true, why: 'The slide reads: lean start-up method = customer development + agile development (fast, iterative and incremental).' },
          { text: 'Deliberate strategy and emergent strategy', why: 'That pairing is Collis’s lean strategy process, a counterweight to the lean start-up, not its method.' },
          { text: 'Waterfall planning and kanban', why: 'Waterfall is what the agile stream was created to replace; it is not part of the lean start-up method.' },
        ],
      }}
    />
  );
}
