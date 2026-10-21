/*
SCENE: Definition per genus et differentiam — two nested sets that work, one that does not
LENGTH: 4 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: The method places a kind inside a wider family and marks it off; it works for triangles and elephants, but
  for law the outer family has no agreed boundary — and "does not work" hides two different claims.
SUBJECT: the inner set in each figure, with its distinguishing marks.
STEPS: 1 triangle in rectilinear figures · 2 elephant in quadrupeds · 3 law in a dashed family: "does not work" ·
  4 two claims: impossible (Hart) vs possible but worse.
REDUCED MOTION: the finished diagram with all four captions stacked.
BUDGET: < 8 KB gz. Narrow 360-unit canvas, vertical, so text stays legible at phone width.
Source: concept laws2100-w01-definition-per-genus-et-differentiam; authority hart-the-concept-of-law.
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const head = { fontFamily: 'var(--font-ui)', fontSize: 12, letterSpacing: 1.2, fill: 'var(--ink-2)' } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 14, fill: 'var(--ink)' } as const;

function Nested({ y, outer, inner, marks, dashed, id }: { y: number; outer: string; inner: string; marks: string[]; dashed?: boolean; id: string }) {
  return (
    <>
      <rect x="8" y={y} width={W - 16} height="130" rx="20" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray={dashed ? '6 6' : undefined} />
      <text x="24" y={y + 24} {...head}>{outer}</text>
      <rect x="24" y={y + 40} width="130" height="74" rx="12" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="89" y={y + 82} textAnchor="middle" {...body} data-label={id}>{inner}</text>
      {marks.map((m, i) => <text key={m} x="172" y={y + 62 + i * 20} {...body} fill="var(--ink-2)">{m}</text>)}
    </>
  );
}

const figure = (
  <svg viewBox={`0 0 ${W} 640`} role="img" aria-label="Triangle inside rectilinear figures; elephant inside quadrupeds; law inside a family with no agreed boundary, marked does not work">
    <g data-step="1"><Nested id="triangle" y={8} outer="GENUS: RECTILINEAR FIGURES" inner="triangle" marks={['marked off by:', 'three sides']} /></g>
    <g data-step="2"><Nested id="elephant" y={158} outer="GENUS: QUADRUPEDS" inner="elephant" marks={['marked off by:', 'thick skin, tusks', 'and trunk']} /></g>
    <g data-step="3">
      <Nested id="law" y={308} dashed outer="GENUS? NO AGREED BOUNDARY" inner="law" marks={['features that', 'belong only to', 'law?']} />
      <text x={W / 2} y="470" textAnchor="middle" {...body}>Hart: this method does not work for law</text>
    </g>
    <g data-step="4">
      <rect x="8" y="494" width="166" height="130" rx="12" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="20" y="518" {...head}>CLAIM 1 · STRONGER</text>
      {['impossible to define', 'law this way —', "Hart's claim, so he", 'must define law', 'another way'].map((l, i) => <text key={i} x="20" y={544 + i * 18} {...body}>{l}</text>)}
      <rect x="186" y="494" width="166" height="130" rx="12" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="6 6" />
      <text x="198" y="518" {...head}>CLAIM 2 · WEAKER</text>
      {['possible, but there', 'are better', 'definitions of law'].map((l, i) => <text key={i} x="198" y={544 + i * 18} {...body}>{l}</text>)}
    </g>
  </svg>
);

export default function DefinitionPerGenusEtDifferentiam() {
  return (
    <Diagram
      label="Definition per genus et differentiam: two nested sets that work, and one for law that does not"
      terms={[
        { term: 'Genus', def: 'The general kind or wider family a thing belongs to.' },
        { term: 'Differentia', def: 'The features that mark the thing off from others of that family.' },
        { term: 'Essential properties', def: 'What a good definition must capture: a four-sided shape is not a triangle.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'Triangle = three-sided rectilinear figure. The definition translates the word into well-understood terms and locates the kind of thing it refers to.' },
        { caption: 'Elephant = quadruped distinguished from others by its thick skin, tusks and trunk: shared features with the family, plus the features that mark it off.' },
        { caption: 'Austin and Kelsen tried this for law — place it among games, etiquette, religion, and find what belongs only to law. Hart says this type of definition does not work for law.' },
        { caption: 'Two different claims: it is impossible, or it is possible but there are better definitions. Hart makes the first, stronger claim, so he must define law another way.' },
      ]}
      check={{
        question: 'A critic shows that law can be defined per genus et differentiam, though clumsily. Which claim has the critic defeated?',
        options: [
          { text: 'Only the impossibility claim — Hart\'s claim', correct: true, why: 'A workable definition, however clumsy, refutes "impossible"; it leaves "there are better definitions" standing.' },
          { text: 'Both claims', why: 'The "better definition" claim survives: a clumsy definition may still be worse than another method.' },
          { text: 'Neither claim', why: 'If a definition works at all, the stronger claim that it is impossible falls.' },
        ],
      }}
    />
  );
}
