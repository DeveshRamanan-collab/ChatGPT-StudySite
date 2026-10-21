/*
SCENE: The creativity gym — three stages of developing creative skill
LENGTH: 4 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
BEATS: 4
INTENT: Show the gym as a staircase climbed in order — starting off, being proficient, becoming an expert — with
  feedback belonging to the top step only.
SUBJECT: the staircase line rising from step 1 to step 3.
BEAT 1 (0–25%): bottom step, starting off (learning and developing the skills; base level: know the industry).
BEAT 2 (25–50%): middle step, being proficient (training your mind, getting inspiration; a systematic approach).
BEAT 3 (50–75%): top step, becoming an expert (default creative mode; creativity part of who you are).
BEAT 4 (75–100%): a dashed loop on the top step: receiving feedback on those thoughts and actions.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: the finished diagram with all four captions stacked.
BUDGET: < 6 KB gz, no WebGL. Narrow 360-unit canvas so text stays legible at phone width.
Source: concept mgmt2094-w01-creativity-gym (Week 1 slide 14; lecture transcript; Lev-Ram 2015 on Imagineering).
*/
import { Diagram } from '../bases/Diagram';

const W = 360;

function Step({ x, y, n, title, lines, id }: { x: number; y: number; n: number; title: string; lines: string[]; id: string }) {
  const w = W - 8 - x;
  return (
    <>
      <rect x={x} y={y} width={w} height={96} rx="12" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x={x + 16} y={y + 28} fontFamily="var(--font-ui)" fontSize="13" letterSpacing="1.2" fill="var(--ink)" data-label={id}>
        <tspan fontFamily="var(--font-mono)" fill="var(--ink-2)">{n} · </tspan>{title}
      </text>
      {lines.map((l, i) => (
        <text key={i} x={x + 16} y={y + 54 + i * 20} fontFamily="var(--font-body)" fontSize="14" fill="var(--ink-2)">{l}</text>
      ))}
    </>
  );
}

function Riser({ x, y1, y2 }: { x: number; y1: number; y2: number }) {
  return (
    <>
      <line x1={x} y1={y1} x2={x} y2={y2} stroke="var(--ink-3)" strokeWidth="1.5" />
      <polyline points={`${x - 6},${y2 + 9} ${x},${y2} ${x + 6},${y2 + 9}`} fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
    </>
  );
}

const figure = (
  <svg viewBox={`0 0 ${W} 560`} role="img"
    aria-label="A staircase of three steps: starting off at the bottom, being proficient in the middle, becoming an expert at the top, with a feedback loop on the top step">
    <g data-step="1">
      <Step x={8} y={440} n={1} id="starting-off" title="STARTING OFF" lines={['learning and developing the skills', 'base level: know the industry']} />
    </g>
    <g data-step="2">
      <Riser x={40} y1={440} y2={394} />
      <Step x={30} y={290} n={2} id="proficient" title="BEING PROFICIENT" lines={['training your mind', 'getting inspiration, systematically']} />
    </g>
    <g data-step="3">
      <Riser x={62} y1={290} y2={244} />
      <Step x={52} y={140} n={3} id="expert" title="BECOMING AN EXPERT" lines={['default creative mode', 'part of who you are as a professional']} />
    </g>
    <g data-step="4">
      <path d="M300 140 C 300 92, 200 92, 200 132" fill="none" stroke="var(--ink)" strokeWidth="1.5" strokeDasharray="5 5" />
      <polyline points="194,124 200,134 206,124" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="250" y="44" textAnchor="middle" fontFamily="var(--font-ui)" fontSize="13" letterSpacing="1.2" fill="var(--ink)" data-label="feedback">RECEIVING FEEDBACK</text>
      <text x="250" y="66" textAnchor="middle" fontFamily="var(--font-body)" fontSize="14" fill="var(--ink-2)">on those thoughts and actions</text>
    </g>
  </svg>
);

export default function CreativityGym() {
  return (
    <Diagram
      label="The creativity gym: three stages from starting off to becoming an expert"
      terms={[
        { term: 'Creativity gym', def: 'The slides’ metaphor: creative skill is trained in stages, like a workout.' },
        { term: 'Default creative mode', def: 'At the expert stage, the mind goes into creative mode automatically.' },
        { term: 'Feedback', def: 'Received on your creative thoughts and actions; it belongs to the expert stage.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'Starting off: learning and developing the skills. The base level: to create a business, know and understand the industry and develop the skills to run one.' },
        { caption: 'Being proficient: training your mind and getting inspiration. Everyone and every organisation differs, so take a systematic approach to training minds and teams.' },
        { caption: 'Becoming an expert: practising creative thoughts until your mind goes automatically into default creative mode; creativity becomes part of who you are as a professional.' },
        { caption: "Then receiving feedback on those thoughts and actions. Disney's Imagineers, for instance, present their wildest innovations to the CEO each year (Lev-Ram 2015)." },
      ]}
      check={{
        question: 'Mei is taking workshops to learn design software and how the fashion industry works. Which stage is she at?',
        options: [
          { text: 'Becoming an expert', why: 'Nothing suggests creativity is her default mode yet, or that she is seeking feedback on practised work.' },
          { text: 'Being proficient', why: 'Being proficient is training the mind and getting inspiration; she is still learning the basic skills.' },
          { text: 'Starting off', correct: true, why: 'Learning and developing the skills, including understanding the industry, is the base level: starting off.' },
        ],
      }}
    />
  );
}
