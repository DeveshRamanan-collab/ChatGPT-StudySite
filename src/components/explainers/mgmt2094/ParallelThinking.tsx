/*
SCENE: Parallel thinking — an alternative to argument
LENGTH: 4 steps, scroll-drawn when pinned (≈ 320vh); Next/Back otherwise (Diagram base)
BEATS: 4
INTENT: Show that argument sends thinkers against each other, while parallel thinking points everyone the same way,
  one direction (hat) at a time, switching together — and that this answers de Bono's three difficulties.
SUBJECT: the arrows — first colliding head-on, then running side by side, then turning together.
BEAT 1 (0–25%): two arrows meet head-on with a clash mark; caption: attack and counter-attack. DrawSVG, ease none.
BEAT 2 (25–50%): four parallel arrows, one direction; caption: each thinker in parallel, e.g. all yellow.
BEAT 3 (50–75%): the four arrows turn together (now pointing down); caption: switch together, e.g. all black.
BEAT 4 (75–100%): three rows: emotions → feelings at the right place; helplessness → next steps; confusion →
  one direction at a time.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: the finished diagram with all four captions stacked (base handles calm/off).
BUDGET: < 6 KB gz, no WebGL. Narrow 360-unit canvas so text stays legible on phones.
Source: concept mgmt2094-w04-parallel-thinking (Week 4 slide 3; Kivunja 2015 on de Bono's three difficulties;
  the lecturer on argument mode and quiet members).
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const ui = { fontFamily: 'var(--font-ui)' } as const;

function Arrow({ x1, y1, x2, y2, dashed }: { x1: number; y1: number; x2: number; y2: number; dashed?: boolean }) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const h = 10;
  const p1 = [x2 - h * Math.cos(a - 0.45), y2 - h * Math.sin(a - 0.45)];
  const p2 = [x2 - h * Math.cos(a + 0.45), y2 - h * Math.sin(a + 0.45)];
  return (
    <>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--ink)" strokeWidth="2" strokeDasharray={dashed ? '6 5' : undefined} />
      <polyline points={`${p1[0]},${p1[1]} ${x2},${y2} ${p2[0]},${p2[1]}`} fill="none" stroke="var(--ink)" strokeWidth="2" />
    </>
  );
}

function Label({ x, y, children, size = 14, anchor = 'middle', tone = 'var(--ink-2)', id }: { x: number; y: number; children: string; size?: number; anchor?: 'start' | 'middle' | 'end'; tone?: string; id?: string }) {
  return <text x={x} y={y} textAnchor={anchor} fontSize={size} fill={tone} {...ui} data-label={id}>{children}</text>;
}

function Heading({ y, children, id }: { y: number; children: string; id: string }) {
  return <text x={W / 2} y={y} textAnchor="middle" fontSize="13" letterSpacing="1.5" fill="var(--ink)" {...ui} data-label={id}>{children}</text>;
}

const DIFFICULTIES: [string, string][] = [
  ['Emotions', 'feelings at the right place'],
  ['Helplessness', 'definite next steps'],
  ['Confusion', 'one direction at a time'],
];

const figure = (
  <svg viewBox={`0 0 ${W} 640`} role="img" aria-label="Argument as two arrows colliding; parallel thinking as four arrows side by side that turn together; three difficulties each matched to what the hats give">
    <g data-step="1">
      <Heading y={22} id="argument">ARGUMENT</Heading>
      <Arrow x1={30} y1={70} x2={164} y2={70} />
      <Arrow x1={330} y1={70} x2={196} y2={70} />
      <polyline points="172,56 180,66 172,74 182,84" fill="none" stroke="var(--ink-2)" strokeWidth="2" />
      <Label x={30} y={100} anchor="start">A attacks</Label>
      <Label x={330} y={100} anchor="end">B counter-attacks</Label>
      <Label x={W / 2} y={132}>the loudest voice fills the room</Label>
    </g>
    <g data-step="2">
      <Heading y={180} id="parallel">PARALLEL THINKING</Heading>
      {[208, 232, 256, 280].map((y, i) => (
        <g key={y}>
          <text x={24} y={y + 5} textAnchor="middle" fontSize="13" fill="var(--ink-2)" {...ui}>{'ABCD'[i]}</text>
          <Arrow x1={40} y1={y} x2={300} y2={y} />
        </g>
      ))}
      <Label x={W / 2} y={312}>one direction at once — e.g. all yellow</Label>
    </g>
    <g data-step="3">
      <Heading y={360} id="switch">THEN SWITCH TOGETHER</Heading>
      {[90, 150, 210, 270].map((x) => (
        <Arrow key={x} x1={x} y1={376} x2={x} y2={436} />
      ))}
      <Label x={W / 2} y={466}>all take off yellow, put on black: risks</Label>
    </g>
    <g data-step="4">
      <Heading y={510} id="difficulties">DIFFICULTIES → WHAT HATS GIVE</Heading>
      {DIFFICULTIES.map(([d, r], i) => {
        const y = 546 + i * 34;
        return (
          <g key={d}>
            <text x={16} y={y} fontSize="15" fill="var(--ink)" {...ui} data-label={d.toLowerCase()}>{d}</text>
            <line x1={118} y1={y - 5} x2={142} y2={y - 5} stroke="var(--ink-3)" strokeWidth="1.5" />
            <text x={150} y={y} fontSize="14" fill="var(--ink-2)" {...ui}>{r}</text>
          </g>
        );
      })}
    </g>
  </svg>
);

export default function ParallelThinking() {
  return (
    <Diagram
      label="Argument against parallel thinking, and the three difficulties the hats answer"
      terms={[
        { term: 'Parallel thinking', def: "Each thinker puts thoughts forward alongside the others', rather than attacking them." },
        { term: 'Argument', def: 'Point and counter-point — the mode parallel thinking is an alternative to.' },
        { term: 'Direction of thinking', def: 'What a hat is: something the whole group puts on and takes off together.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'Argument: one thinker attacks, the other counter-attacks. In meetings the loudest voices fill the room and quieter people hold back.' },
        { caption: 'Parallel thinking: each thinker puts thoughts forward alongside the others, all in one direction — say, everyone in the yellow hat listing benefits.' },
        { caption: 'Then the group switches together: everyone takes off one hat and puts on the next, say the black hat for risks. Hats are directions, not people.' },
        { caption: "De Bono's three difficulties, and the hats' answers: emotions get their right place, helplessness gets next steps, confusion gets one direction at a time." },
      ]}
      check={{
        question: 'Two managers attack and defend a new product idea while the rest of the team stays quiet. What would parallel thinking do?',
        options: [
          { text: 'Let the two keep debating until the stronger case wins', why: 'That is argument, the back-and-forth mode parallel thinking is offered as an alternative to.' },
          { text: 'Have everyone look one way at a time — all benefits, then all risks', correct: true, why: 'Parallel thinking guides thought in one direction at a time, so criticism becomes a shared black-hat turn, not an attack.' },
          { text: 'Ask everyone to vote straight away to avoid conflict', why: 'Voting skips the thinking; parallel thinking still explores the idea, one direction at a time.' },
        ],
      }}
    />
  );
}
