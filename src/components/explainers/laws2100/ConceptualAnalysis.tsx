/*
SCENE: Conceptual analysis — drawing, contesting and widening a category's boundary
LENGTH: 4 screens pinned (desktop, full motion); 4 paced beats otherwise
BEATS: 4
INTENT: Conceptual theories set the boundaries of categories by necessary and sufficient conditions; the placement is
  contested; science theories use concepts without being conceptual theories; Twining widens the method.
SUBJECT: the boundary line around the category.
BEAT 1 (0–25%): a solid boundary around "law", cases inside and out; caption: necessary and sufficient conditions.
BEAT 2 (25–50%): a dashed rival boundary grows from the first (scale, ease none, scrubbed); semantic vs conceptual.
BEAT 3 (50–75%): beside it, natural- and social-science theories: use concepts, not conceptual theories.
BEAT 4 (75–100%): a wide outer frame — Twining's broader conception.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: final frame with all four captions stacked (base).
BUDGET: < 6 KB gz. Transform and opacity only.
Source: concept laws2100-w01-conceptual-analysis; authorities bix-jurisprudence-theory-and-context,
  twining-general-jurisprudence.
*/
import { ScrollExplainer } from '../bases/ScrollExplainer';

const W = 360;
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const head = { fontFamily: 'var(--font-ui)', fontSize: 12, letterSpacing: 1.2, fill: 'var(--ink)' } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 14, fill: 'var(--ink-2)' } as const;
const DOTS: [number, number][] = [[120, 92], [200, 88], [230, 132], [140, 150], [70, 60], [300, 70], [290, 170], [60, 180], [252, 186]];

function scene(t: number) {
  const on = (i: number) => clamp((t - i) * 3 + 0.25);
  const grow = 1 + 0.22 * clamp((t - 1) * 1.5);
  return (
    <svg viewBox={`0 0 ${W} 460`} role="img" aria-label="A boundary around a category, a rival boundary, science theories beside it, and a wider frame">
      <g opacity={on(3)}>
        <rect x="4" y="4" width={W - 8} height="452" rx="20" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="2 5" />
        <text x="20" y="444" {...body} fontSize={12}>Twining: a much broader conception</text>
      </g>
      <g opacity={on(0)}>
        {DOTS.map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="4" fill="var(--ink-2)" />)}
        <ellipse cx="180" cy="120" rx="96" ry="58" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
        <text x="180" y="124" textAnchor="middle" {...head}>LAW</text>
        <text x="20" y="226" {...body}>necessary and sufficient conditions</text>
      </g>
      <g opacity={on(1)}>
        <ellipse cx="180" cy="120" rx="96" ry="58" fill="none" stroke="var(--ink-2)" strokeWidth="1.5" strokeDasharray="6 6" transform={`translate(180 120) scale(${grow}) translate(-180 -120)`} />
        <text x="20" y="250" {...body}>the line is contested: semantic or</text>
        <text x="20" y="269" {...body}>conceptual disagreement?</text>
      </g>
      <g opacity={on(2)}>
        {[{ x: 20, t: 'NATURAL SCIENCES' }, { x: 188, t: 'SOCIAL SCIENCES' }].map((b) => (
          <g key={b.t}>
            <rect x={b.x} y="296" width="152" height="112" rx="12" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
            <text x={b.x + 12} y="320" {...head} fontSize={11}>{b.t}</text>
            {['use concepts, but', 'are not conceptual', 'theories'].map((l, k) => <text key={k} x={b.x + 12} y={346 + k * 19} {...body}>{l}</text>)}
          </g>
        ))}
      </g>
    </svg>
  );
}

export default function ConceptualAnalysis() {
  return (
    <ScrollExplainer
      label="Conceptual analysis: setting, contesting and widening the boundary of a category"
      terms={[
        { term: 'Analytical jurisprudence', def: 'Jurisprudence as the analysis of general ideas relevant in the legal domain (Bentham, Austin, then Hart).' },
        { term: 'Necessary and sufficient conditions', def: 'The conditions a thing must meet, and that are enough, to fall inside a category.' },
        { term: 'Semantic vs conceptual disagreement', def: 'About the meaning of a term, or not sharing the same concept at all.' },
      ]}
      beats={[
        { caption: 'Conceptual theories generally define terms by necessary and sufficient conditions. Bix: they "set the boundaries of categories" — a common ground for investigation.' },
        { caption: '"The placement of the boundaries is often contested." Ask what kind of disagreement it is: semantic, like \'football\' in the UK and Australia ("I meant soccer"), or conceptual.' },
        { caption: 'Theories in the natural and social sciences use concepts, but they are not conceptual theories.' },
        { caption: 'Twining keeps conceptual analysis but widens it: a much broader conception than Hart\'s, Raz\'s or Stone\'s, as important for social science as for legal exposition.' },
      ]}
      scene={scene}
      check={{
        question: 'Two people argue over whether "football" covers soccer, until one says "I meant soccer". What kind of disagreement was it?',
        options: [
          { text: 'Conceptual — they did not share the same concept', why: 'Once the word is cleared up, they agree; nothing shows they held different concepts.' },
          { text: 'Semantic — about the meaning of the term', correct: true, why: '"I meant soccer" fixes the meaning of the word, and context does the rest.' },
          { text: 'Empirical — about what happens on the field', why: 'Neither disputes any fact about the game; the dispute was over the word.' },
        ],
      }}
    />
  );
}
