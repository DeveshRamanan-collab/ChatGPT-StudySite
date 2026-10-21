/*
SCENE: Hart's project — from knowing the town to drawing its map
LENGTH: 4 screens pinned (desktop, full motion); 4 paced beats otherwise
BEATS: 4
INTENT: We can know law and yet not understand it; Hart's aim is a map of the relationships between law and coercion,
  morality and rules, with paradigm cases at the centre and borderline cases at the edge.
SUBJECT: the walker, then the map's centre.
BEAT 1 (0–25%): a street grid; a walker crosses it (translate, ease none, scrubbed) — "knows the way, can't give
  directions". BEAT 2 (25–50%): the map: law at the centre, three spokes (coercion, morality, rules).
BEAT 3 (50–75%): paradigm cases in the inner ring, borderline cases at the edge.
BEAT 4 (75–100%): the aim — not a test for word use but an improved analysis.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: final frame with all four captions stacked (base).
BUDGET: < 6 KB gz. Transform and opacity only.
Source: concept laws2100-w01-harts-project; authorities hart-the-concept-of-law, hart-definition-and-theory-in-jurisprudence.
*/
import { ScrollExplainer } from '../bases/ScrollExplainer';

const W = 360;
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const head = { fontFamily: 'var(--font-ui)', fontSize: 12, letterSpacing: 1.2, fill: 'var(--ink)' } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 14, fill: 'var(--ink-2)' } as const;
const SPOKES = [
  { x: 180, y: 206, anchor: 'middle', lx: 180, ly: 214, label: 'COERCION' },
  { x: 8, y: 304, anchor: 'start', lx: 96, ly: 300, label: 'MORALITY' },
  { x: 352, y: 304, anchor: 'end', lx: 290, ly: 300, label: 'RULES' },
] as const;

function scene(t: number) {
  const on = (i: number) => clamp((t - i) * 3 + 0.25);
  const walk = clamp(t * 1.2);
  const seg = walk * 3; // along a street, down a lane, along another street
  const [wx, wy] = seg < 1 ? [60 + seg * 90, 30] : seg < 2 ? [150, 30 + (seg - 1) * 80] : [150 + (seg - 2) * 180, 110];
  return (
    <svg viewBox={`0 0 ${W} 476`} role="img" aria-label="A walker crosses a familiar town; then a map shows law related to coercion, morality and rules">
      <g opacity={t > 1 ? 0.35 : on(0)}>
        {[30, 70, 110].map((y) => <line key={y} x1="20" y1={y} x2="340" y2={y} stroke="var(--line)" strokeWidth="6" />)}
        {[60, 150, 240, 330].map((x) => <line key={x} x1={x} y1="20" x2={x} y2="120" stroke="var(--line)" strokeWidth="6" />)}
        <circle cx="0" cy="0" r="6" fill="var(--ink)" transform={`translate(${wx} ${wy})`} />
        <text x="20" y="144" {...body} fontSize={12}>knows the way — cannot give directions</text>
      </g>
      <g opacity={on(1)}>
        {SPOKES.map((s) => (
          <g key={s.label}>
            <line x1="180" y1="300" x2={s.lx} y2={s.ly} stroke="var(--ink-3)" strokeWidth="1.5" />
            <text x={s.x} y={s.y} textAnchor={s.anchor} {...head}>{s.label}</text>
          </g>
        ))}
      </g>
      <g opacity={on(2)}>
        <circle cx="180" cy="300" r="66" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="4 5" />
        <text x={W / 2} y="392" textAnchor="middle" {...body} fontSize={12}>centre: legal systems of modern states</text>
        <text x={W / 2} y="410" textAnchor="middle" {...body} fontSize={12}>edge: primitive law, international law</text>
      </g>
      <g opacity={on(1)}>
        <circle cx="180" cy="300" r="30" fill="var(--paper-2)" stroke="var(--ink)" strokeWidth="1.5" />
        <text x="180" y="304" textAnchor="middle" {...head}>LAW</text>
      </g>
      <g opacity={on(3)}>
        <text x={W / 2} y="442" textAnchor="middle" {...body} fill="var(--ink)">not a test for using the word —</text>
        <text x={W / 2} y="462" textAnchor="middle" {...body} fill="var(--ink)">an improved analysis of its structure</text>
      </g>
    </svg>
  );
}

export default function HartsProject() {
  return (
    <ScrollExplainer
      label="Hart's project: from knowing law to understanding it — a map of law, coercion, morality and rules"
      terms={[
        { term: 'Knowing vs understanding', def: '"In law as elsewhere, we can know and yet not understand" (Hart, 1953).' },
        { term: 'Paradigm case', def: 'A clear instance of law: the legal systems of modern states.' },
        { term: 'Borderline case', def: 'A contested instance at the edge: primitive law, international law.' },
      ]}
      beats={[
        { caption: 'Like someone who can cross a familiar town but cannot give directions, most people can cite examples of law without being able to say what law is. Confusion can coexist with firm knowledge of the law.' },
        { caption: 'Three persistent questions (CL 6): how does law relate to orders backed by threats? to moral obligation? to what extent is law an affair of rules?' },
        { caption: '"What is law?" expresses perplexity about the general nature of law: paradigm cases sit at the centre, borderline cases at the edge.' },
        { caption: 'Not a definition to test the correct use of the word, but "an improved analysis of the distinctive structure of a municipal legal system" (CL 17) — an essay in descriptive sociology.' },
      ]}
      scene={scene}
      check={{
        question: 'What does Hart say his book aims to provide?',
        options: [
          { text: 'A definition by which the correct use of the word "law" can be tested', why: 'Hart expressly says this is not his purpose (CL 17).' },
          { text: 'A better understanding of law, coercion and morality as different but related social phenomena', correct: true, why: 'That is his stated aim (CL 6): a map of relationships, not a dictionary test.' },
          { text: 'A list of the paradigm cases of law', why: 'Most people can already cite examples; the puzzle is understanding, not listing.' },
        ],
      }}
    />
  );
}
