/*
SCENE: Where does the spark come from? Grace, accident, association, cognition
LENGTH: 4 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: The slides pair four theories — grace against accident (a gift, or chance) and association against cognition
  (a deliberate transfer between areas, or ordinary reasoning) — and the readings pin a qualification under each.
SUBJECT: the four boxes in two labelled pairs; each reading note sits under the theory it qualifies.
STEPS: 1 grace · 2 accident (+ the prepared mind) · 3 association (+ Darwin and Malthus) · 4 cognitive (+ Claman).
REDUCED MOTION: the finished diagram with all four captions stacked.
BUDGET: < 8 KB gz (DrawSVG is in the shared motion chunk). Vertical layout so text stays legible on phones.
Source: concept mgmt2094-w05-grace-accident-association-and-cognitive-theories (Week 5 lecture slides 13–14;
  lecture transcript); authorities mgmt2094-example-accidental-discoveries,
  mgmt2094-example-darwin-and-wallace-natural-selection, mgmt2094-claman-2017-spark-creativity-in-a-rut.
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const pair = { fontFamily: 'var(--font-ui)', fontSize: 11, letterSpacing: 1.4, fill: 'var(--ink-2)' } as const;
const head = { fontFamily: 'var(--font-ui)', fontSize: 12, letterSpacing: 1.2, fill: 'var(--ink)' } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 14, fill: 'var(--ink)' } as const;
const note = { fontFamily: 'var(--font-ui)', fontSize: 12, fill: 'var(--ink-2)' } as const;

interface BoxProps { y: number; id: string; title: string; lines: string[]; notes: string[] }

function Box({ y, id, title, lines, notes }: BoxProps) {
  const h = 36 + lines.length * 20 + notes.length * 17 + 8;
  const ny = y + 30 + lines.length * 20 + 8;
  return (
    <>
      <rect x="8" y={y} width={W - 16} height={h} rx="12" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="22" y={y + 22} {...head} data-label={id}>{title}</text>
      {lines.map((l, k) => <text key={k} x="22" y={y + 44 + k * 20} {...body}>{l}</text>)}
      <line x1="22" y1={ny - 4} x2="60" y2={ny - 4} stroke="var(--ink-3)" strokeWidth="1" />
      {notes.map((l, k) => <text key={k} x="22" y={ny + 12 + k * 17} {...note}>{l}</text>)}
    </>
  );
}

const figure = (
  <svg viewBox={`0 0 ${W} 590`} role="img" aria-label="Two pairs of theories: grace and accident, then association and cognition, each with a note from the readings">
    <g data-step="1">
      <text x="10" y="18" {...pair}>A GIFT, OR CHANCE?</text>
      <Box y={28} id="grace" title="CREATIVITY BY GRACE" lines={['genius endowed with a superhuman', 'potential: a divine gift']} notes={['lecture: you are either creative or not']} />
    </g>
    <g data-step="2">
      <Box y={150} id="accident" title="CREATIVITY BY ACCIDENT" lines={['it rises by chance: immunisation from', 'interrupted work, radioactivity']} notes={['reading: chance favours the prepared', 'mind — Becquerel was already immersed']} />
    </g>
    <g data-step="3">
      <text x="10" y="306" {...pair}>A TRANSFER, OR ORDINARY REASONING?</text>
      <Box y={316} id="association" title="CREATIVE ASSOCIATION" lines={['procedures from one area applied to', 'another; behind brainstorming']} notes={['reading: Darwin, a biologist, drew on', 'Malthus’ political economy']} />
    </g>
    <g data-step="4">
      <Box y={455} id="cognitive" title="COGNITIVE CREATIVITY" lines={['a normal human activity: reasoning,', 'recognition and understanding']} notes={['Claman: everyone has it — not just', 'the talented few; ruts make it fade']} />
    </g>
  </svg>
);

export default function GraceAccidentAssociationAndCognitiveTheories() {
  return (
    <Diagram
      label="Theories of creative grace, accident, association and cognition"
      terms={[
        { term: 'Creativity by grace', def: 'The idea of genius: creativity as a divine gift of superhuman potential.' },
        { term: 'Creativity by accident', def: 'Creativity that rises by chance, as in accidental discoveries.' },
        { term: 'Creative association', def: 'Applying procedures from one area to another.' },
        { term: 'Cognitive creativity', def: 'Creativity as a normal human activity of reasoning, recognition and understanding.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'Creativity by grace: the idea of genius — people endowed with a superhuman potential; creativity as a divine gift. On this view you are either super creative or you are not.' },
        { caption: 'Creativity by accident: it rises by chance — immunisation from an interruption in work, radioactivity from a wrong hypothesis. The reading adds that chance favours the prepared mind.' },
        { caption: 'Creative association: applying procedures from one area to another — the justification for lateral thinking and brainstorming. Darwin, a biologist, drew on Malthus’ political economy.' },
        { caption: 'Cognitive creativity: a normal human activity of reasoning, recognition and understanding. Claman: everyone has creativity when confronted with new problems; it fades in a rut but can be rebuilt.' },
      ]}
      check={{
        question: 'A hospital team adopts the pit-stop routines of motor-racing crews to speed up patient handovers. Which theory does this illustrate?',
        options: [
          { text: 'Creativity by accident', why: 'Nothing happened by chance: the team deliberately borrowed a routine from another field.' },
          { text: 'Creative association', correct: true, why: 'Applying a procedure from one area (motor racing) to another (patient handovers) is creative association.' },
          { text: 'Creativity by grace', why: 'The idea needs no divine gift; its mechanism is a transfer between fields that anyone could make.' },
        ],
      }}
    />
  );
}
