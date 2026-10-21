/*
SCENE: The humanistic theory — creativity unlocks at the top of Maslow's hierarchy, then takes three forms
LENGTH: 4 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: On the humanistic theory creativity follows needs met, not hardship: the four lower levels must be (at least
  partly) met before self-actualisation frees us to be creative; Maslow then names three types of creativity.
SUBJECT: the pyramid filling from the base; the self-actualisation band (the one accent stroke) is where creativity
  unlocks.
STEPS: 1 the four lower levels · 2 self-actualisation · 3 primary, secondary, integrated · 4 the contrast with the
  psychoanalytical theory (dashed).
REDUCED MOTION: the finished diagram with all four captions stacked.
BUDGET: < 8 KB gz (DrawSVG is in the shared motion chunk). Vertical layout so text stays legible on phones.
Source: concept mgmt2094-w05-humanistic-theory-and-maslows-types (Week 5 lecture slides 10–12; lecture transcript).
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const C = W / 2;
const head = { fontFamily: 'var(--font-ui)', fontSize: 12, letterSpacing: 1.2, fill: 'var(--ink)' } as const;
const sub = { fontFamily: 'var(--font-ui)', fontSize: 11, fill: 'var(--ink-2)' } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 14, fill: 'var(--ink)' } as const;

const hw = (y: number) => 70 + (y - 16) * 0.37;
const band = (i: number) => {
  const y0 = 16 + i * 56;
  const y1 = y0 + 52;
  return { y0, y1, points: `${C - hw(y0)},${y0} ${C + hw(y0)},${y0} ${C + hw(y1)},${y1} ${C - hw(y1)},${y1}` };
};

// Top (0) to base (4).
const LEVELS = [
  { name: 'Self-actualisation', needs: 'become the most one can be' },
  { name: 'Esteem', needs: 'respect, status, recognition' },
  { name: 'Love and belonging', needs: 'friendship, family, connection' },
  { name: 'Safety', needs: 'security, employment, health' },
  { name: 'Physiological', needs: 'air, water, food, shelter, sleep' },
];

const TYPES = [
  { t: 'PRIMARY', a: 'escape the daily grind and stress', b: 'painting, drawing, writing' },
  { t: 'SECONDARY', a: 'a higher level of thought', b: 'more thought out and involved' },
  { t: 'INTEGRATED', a: 'both: may start spontaneously, but', b: 'much thought first (philosophy, science)' },
];

function Level({ i, accent = false }: { i: number; accent?: boolean }) {
  const b = band(i);
  return (
    <>
      <polygon points={b.points} fill="none" stroke={accent ? 'var(--accent)' : 'var(--ink)'} strokeWidth={accent ? 2.5 : 1.5} strokeLinejoin="round" />
      <text x={C} y={b.y0 + 24} textAnchor="middle" {...body}>{LEVELS[i].name}</text>
      <text x={C} y={b.y0 + 42} textAnchor="middle" {...sub}>{LEVELS[i].needs}</text>
    </>
  );
}

const figure = (
  <svg viewBox={`0 0 ${W} 600`} role="img" aria-label="Maslow's hierarchy with self-actualisation at the top, three types of creativity below, and a contrast with the psychoanalytical theory">
    <g data-step="1">
      {[4, 3, 2, 1].map((i) => <Level key={i} i={i} />)}
    </g>
    <g data-step="2">
      <Level i={0} accent />
    </g>
    <g data-step="3">
      <line x1={C} y1="300" x2={C} y2="316" stroke="var(--ink-3)" strokeWidth="1.5" />
      {TYPES.map((r, k) => {
        const y = 316 + k * 66;
        return (
          <g key={r.t}>
            <rect x="8" y={y} width={W - 16} height="60" rx="10" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
            <text x="22" y={y + 20} {...head} data-label={r.t.toLowerCase()}>{r.t}</text>
            <text x="22" y={y + 38} {...body} fontSize="13">{r.a}</text>
            <text x="22" y={y + 53} {...sub}>{r.b}</text>
          </g>
        );
      })}
    </g>
    <g data-step="4">
      <rect x="8" y="520" width={W - 16} height="74" rx="10" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="6 6" />
      <text x="22" y="542" {...head}>CONTRAST</text>
      <text x="22" y="562" {...body} fontSize="13">psychoanalytical: creativity from hardship</text>
      <text x="22" y="582" {...body} fontSize="13">humanistic: from needs being met</text>
    </g>
  </svg>
);

export default function HumanisticTheoryAndMaslowsTypes() {
  return (
    <Diagram
      label="The humanistic theory of creativity and Maslow's three types"
      terms={[
        { term: 'Hierarchy of needs', def: 'Maslow: physiological, safety, love and belonging, esteem, then self-actualisation at the top.' },
        { term: 'Self-actualisation', def: 'The desire to become the most that one can be — where the humanistic theory places creativity.' },
        { term: 'Primary, secondary, integrated', def: 'Maslow’s three types: escape, higher thought, and the two combined.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'Maslow’s hierarchy of needs: physiological, safety, love and belonging, esteem. The lecture: we cannot be creative unless these are, at least partly, met.' },
        { caption: 'At the top, self-actualisation. There we are free and comfortable enough to express ourselves creatively; the theory argues environment is not a factor, and creativity is central to growth and learning.' },
        { caption: 'Maslow’s three types: primary (an escape from the daily grind — painting, drawing, writing), secondary (a higher level of thought) and integrated (both — e.g. philosophy and scientific discoveries).' },
        { caption: 'The humanistic theory (Maslow; Rogers and Fromm) starts from the opposite end to the psychoanalytical theory: creativity follows needs met, not hardship.' },
      ]}
      check={{
        question: 'An accountant sketches in a park on Sundays purely to unwind from a stressful week. Which type of creativity is this?',
        options: [
          { text: 'Primary', correct: true, why: 'Creativity that lets us escape the daily grind and stress of life is primary; it need not be any good to count.' },
          { text: 'Secondary', why: 'Secondary creativity is a higher level of thought, more thought out and involved — not an escape from stress.' },
          { text: 'Integrated', why: 'Integrated creativity combines spontaneity with much prior thought about what we hope to achieve, as in philosophy or science.' },
        ],
      }}
    />
  );
}
