/*
SCENE: Brainstorming, brainwriting and brainwalking — three rooms
LENGTH: 4 steps, scroll-drawn when pinned (≈ 320vh); Next/Back otherwise (Diagram base)
BEATS: 4
INTENT: Show what moves in each format — one voice (brainstorming), the paper (brainwriting), the people
  (brainwalking) — and the gain each change adds.
SUBJECT: the arrows: from one speaker outwards, then round the table, then between stations on the walls.
BEAT 1 (0–25%): one speaker, five listeners; caption: one person talks, the first idea said aloud steers the rest.
BEAT 2 (25–50%): a table, six sheets and a loop arrow; caption: sheets pass round, 12 × 5 = 60 ideas.
BEAT 3 (50–75%): a room with flip-chart stations on the walls and walking arrows; caption: move the people.
BEAT 4 (75–100%): the gains: energy, public ideas, shared purpose, pairs, bigger ideas; all serve the diverge stage.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: the finished diagram with all four captions stacked (base handles calm/off).
BUDGET: < 6 KB gz, no WebGL. Narrow 360-unit canvas so text stays legible on phones.
Source: concept mgmt2094-w04-brainwriting-and-brainwalking (Mattimore 2012; the lecturer on brainstorming aloud and
  diverge–converge).
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const ui = { fontFamily: 'var(--font-ui)' } as const;

function Heading({ y, children, id }: { y: number; children: string; id: string }) {
  return <text x={W / 2} y={y} textAnchor="middle" fontSize="13" letterSpacing="1.5" fill="var(--ink)" {...ui} data-label={id}>{children}</text>;
}
function Line({ y, children, mono }: { y: number; children: string; mono?: boolean }) {
  return <text x={W / 2} y={y} textAnchor="middle" fontSize="14" fill="var(--ink-2)" fontFamily={mono ? 'var(--font-mono)' : 'var(--font-ui)'}>{children}</text>;
}

const LISTENERS = [0, 1, 2, 3, 4].map((k) => {
  const a = Math.PI * (0.15 + k * 0.175);
  return [180 + 78 * Math.cos(a), 74 + 42 * Math.sin(a) - 8] as const;
});
const SHEETS = [[90, 258], [90, 288], [180, 222], [270, 258], [270, 288], [180, 322]] as const;
const STATIONS = [[60, 438], [140, 438], [220, 438], [300, 438]] as const;

const figure = (
  <svg viewBox={`0 0 ${W} 690`} role="img" aria-label="Three rooms: one speaker with listeners; sheets passing round a table; people walking between flip-chart stations on the walls; then the gains of brainwalking">
    <g data-step="1">
      <Heading y={20} id="brainstorming">CLASSIC BRAINSTORMING</Heading>
      <circle cx={180} cy={58} r="13" fill="none" stroke="var(--ink)" strokeWidth="2" />
      {LISTENERS.map(([x, y], k) => (
        <g key={k}>
          <line x1={180} y1={71} x2={x} y2={y - 8} stroke="var(--ink-3)" strokeWidth="1.5" />
          <circle cx={x} cy={y} r="8" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
        </g>
      ))}
      <Line y={146}>one person talks, everyone else listens</Line>
      <Line y={166}>the first idea said aloud steers the rest</Line>
    </g>
    <g data-step="2">
      <Heading y={200} id="brainwriting">BRAINWRITING</Heading>
      <rect x={130} y={256} width="100" height="32" rx="10" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      {SHEETS.map(([x, y], k) => (
        <rect key={k} x={x - 9} y={y - 11} width="18" height="22" rx="2" fill="none" stroke="var(--ink-2)" strokeWidth="1.5" />
      ))}
      <path d="M 100 272 A 80 36 0 0 1 260 272 A 80 36 0 0 1 100 272" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="5 5" />
      <polyline points="254,264 260,274 266,264" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
      <Line y={354}>sheets pass round; each builds on the last</Line>
      <Line y={376} mono>12 people × 5 rounds = 60 ideas</Line>
    </g>
    <g data-step="3">
      <Heading y={410} id="brainwalking">BRAINWALKING</Heading>
      <rect x={20} y={422} width={W - 40} height="110" rx="6" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      {STATIONS.map(([x, y], k) => (
        <rect key={k} x={x - 22} y={y - 8} width="44" height="30" rx="2" fill="none" stroke="var(--ink-2)" strokeWidth="1.5" />
      ))}
      <path d="M 70 500 C 90 486, 118 486, 136 476" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
      <polyline points="128,474 137,476 132,484" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
      <path d="M 230 500 C 250 486, 278 486, 296 476" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
      <polyline points="288,474 297,476 292,484" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
      {[[64, 506], [76, 506], [224, 506], [236, 506]].map(([x, y], k) => (
        <circle key={k} cx={x} cy={y} r="5" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      ))}
      <Line y={556}>move the people, not the papers</Line>
      <Line y={576}>stations on the walls; pairs walk together</Line>
    </g>
    <g data-step="4">
      <line x1={40} y1={596} x2={W - 40} y2={596} stroke="var(--line)" strokeWidth="1" />
      <Line y={622}>+ energy · public ideas · shared purpose</Line>
      <Line y={644}>+ pairs: fewer, better ideas · bigger ideas</Line>
      <text x={W / 2} y={676} textAnchor="middle" fontSize="14" fill="var(--ink)" {...ui}>all three serve the diverge stage</text>
    </g>
  </svg>
);

export default function BrainwritingAndBrainwalking() {
  return (
    <Diagram
      label="Classic brainstorming, brainwriting and brainwalking compared"
      terms={[
        { term: 'Brainwriting', def: 'Each person writes an idea and passes the sheet on; the next builds on it.' },
        { term: 'Brainwalking', def: 'The same idea, but people move between flip-chart stations on the walls.' },
        { term: 'Ideation station', def: "Mattimore's name for a flip-chart sheet taped to the wall." },
        { term: 'Diverge', def: 'Open up many ideas once the problem is set; converging comes later.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'Classic brainstorming aloud: one person talks and everyone else listens, and once an idea is said out loud it influences everyone else’s.' },
        { caption: 'Brainwriting: write, pass, build. Twelve people and five rounds give 60 ideas, and everyone gets equal time to "speak" with their pen.' },
        { caption: 'Brainwalking — Mattimore’s fix for the Dentyne session: move the people instead of the papers, between ideation stations on the walls.' },
        { caption: 'Its gains: more energy, ideas in public, shared purpose, pairs that trade quantity for quality, bigger ideas in marker. All three tools serve diverging.' },
      ]}
      check={{
        question: 'What did Mattimore change to turn brainwriting into brainwalking?',
        options: [
          { text: 'He had people call their ideas out loud', why: 'Speaking aloud is classic brainstorming, the format both written methods improve on.' },
          { text: 'He moved the people instead of the papers', correct: true, why: 'Flip-chart ideation stations went on the walls and participants rotated between them.' },
          { text: 'He cut the session to a single round', why: 'Brainwalking still used about five rotations; the change was who moves, not how many rounds.' },
        ],
      }}
    />
  );
}
