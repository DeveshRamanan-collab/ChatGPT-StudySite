/*
SCENE: Herrmann's Whole Brain Model — your thinking profile against what the task needs
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → set a 1/2/3 code for each quadrant and pick a stage of the creative process → read the verdict → check
INTENT: The task decides which side of the model you need (A–B for preparation and verification, C–D for incubation
  and illumination); your profile says whether that side is preferred, competent or avoided — and if avoided, the
  lecture's advice is to push yourself there or lean on a teammate.
SUBJECT: the accent arc that swings to the side the chosen stage draws on; the two lit quadrants show your codes.
BEAT 1 (0–100%): selects change the codes and the stage; the arc rotates 180° between halves (transform only,
  240ms ease-out); unlit quadrants fade to 40% (opacity only). Verdict within 200ms.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: same controls; changes are instant (the base handles calm/off; transitions are CSS on transform and
  opacity only).
BUDGET: < 6 KB gz, no WebGL.
Source: concept mgmt2094-w05-whole-brain-model (Week 5 lecture slides 3–4; lecture transcript); example card
  mgmt2094-example-poincare-mathematical-discovery.
*/
import { Simulation, type SimView } from '../bases/Simulation';

type Code = '1' | '2' | '3';
type Stage = 'preparation' | 'incubation' | 'illumination' | 'verification';

interface S extends Record<string, unknown> {
  a: Code;
  b: Code;
  c: Code;
  d: Code;
  stage: Stage;
}

const initial: S = { a: '1', b: '2', c: '3', d: '3', stage: 'incubation' };

const CODE_LABEL: Record<Code, string> = { '1': 'preferred', '2': 'competent', '3': 'avoided' };
const STAGE_LABEL: Record<Stage, string> = { preparation: 'Preparation', incubation: 'Incubation', illumination: 'Illumination', verification: 'Verification' };
const leftSide = (st: Stage) => st === 'preparation' || st === 'verification';

const CX = 180;
const CY = 160;
const R = 130;
const QUADS = [
  { k: 'a', letter: 'A', word: 'Logical', word2: 'fact based', side: 'left', d: `M${CX},${CY} L${CX - R},${CY} A${R},${R} 0 0 1 ${CX},${CY - R} Z`, x: 122, y: 72 },
  { k: 'd', letter: 'D', word: 'Holistic', word2: 'synthesising', side: 'right', d: `M${CX},${CY} L${CX},${CY - R} A${R},${R} 0 0 1 ${CX + R},${CY} Z`, x: 238, y: 72 },
  { k: 'b', letter: 'B', word: 'Organised', word2: 'planned', side: 'left', d: `M${CX},${CY} L${CX},${CY + R} A${R},${R} 0 0 1 ${CX - R},${CY} Z`, x: 122, y: 190 },
  { k: 'c', letter: 'C', word: 'Interpersonal', word2: 'feeling based', side: 'right', d: `M${CX},${CY} L${CX + R},${CY} A${R},${R} 0 0 1 ${CX},${CY + R} Z`, x: 238, y: 190 },
] as const;

const ui = { fontFamily: 'var(--font-ui)', fill: 'var(--ink)' } as const;
const fade = { transition: 'opacity 180ms var(--ease-out)' } as const;

function view(s: S): SimView {
  const left = leftSide(s.stage);
  const lit = left ? (['a', 'b'] as const) : (['c', 'd'] as const);
  const best = Math.min(...lit.map((k) => Number(s[k]))) as 1 | 2 | 3;
  const sideName = left ? 'A–B' : 'C–D';
  const figure = (
    <svg viewBox="0 0 360 360" role="img" aria-label={`Whole Brain Model: ${STAGE_LABEL[s.stage]} draws on the ${sideName} side; codes A ${s.a}, B ${s.b}, C ${s.c}, D ${s.d}`}>
      {QUADS.map((q) => {
        const on = left ? q.side === 'left' : q.side === 'right';
        const code = s[q.k] as Code;
        return (
          <g key={q.k} style={fade} opacity={on ? 1 : 0.4}>
            <path d={q.d} fill={on ? 'var(--paper-3)' : 'var(--paper-2)'} stroke="var(--ink-3)" strokeWidth="1.5" />
            <text x={q.x} y={q.y} textAnchor="middle" {...ui} fontSize="18" fontWeight="600">{q.letter}</text>
            <text x={q.x} y={q.y + 18} textAnchor="middle" {...ui} fontSize="12">{q.word}</text>
            <text x={q.x} y={q.y + 33} textAnchor="middle" {...ui} fontSize="12" fill="var(--ink-2)">{q.word2}</text>
            <text x={q.x} y={q.y + 50} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="11" fill="var(--ink)">{code} · {CODE_LABEL[code]}</text>
          </g>
        );
      })}
      {/* The one accent element: an arc along the half of the circle the stage draws on. */}
      <g style={{ transform: `rotate(${left ? 180 : 0}deg)`, transformOrigin: `${CX}px ${CY}px`, transition: 'transform 240ms var(--ease-out)' }}>
        <path d={`M${CX},${CY - R - 6} A${R + 6},${R + 6} 0 0 1 ${CX},${CY + R + 6}`} fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" />
      </g>
      <text x={CX} y="322" textAnchor="middle" {...ui} fontSize="12" letterSpacing="1">{STAGE_LABEL[s.stage].toUpperCase()} DRAWS ON THE {sideName} SIDE</text>
      <text x={CX} y="344" textAnchor="middle" {...ui} fontSize="11" fill="var(--ink-2)">A–B: preparation, verification · C–D: incubation, illumination</text>
    </svg>
  );
  const verdict =
    best === 1
      ? `Preferred side: ${STAGE_LABEL[s.stage]} draws on ${sideName}, and you have a quadrant there coded 1 — you are likely to go there naturally.`
      : best === 2
        ? `Competent side: you can work on ${sideName} for ${STAGE_LABEL[s.stage].toLowerCase()}, though it may not be your first choice.`
        : `Avoided side: both ${sideName} quadrants are coded 3. The task still needs them — be aware of it and consciously push yourself there, or draw on a teammate who prefers them.`;
  return { figure, verdict, tone: best === 1 ? 'yes' : best === 2 ? 'open' : 'no' };
}

function describe(a: S, b: S) {
  if (a.stage !== b.stage)
    return leftSide(b.stage)
      ? `${STAGE_LABEL[b.stage]} is conscious, structured work: the slide places it on the A and B sides (logical, organised).`
      : `${STAGE_LABEL[b.stage]} is where ideas form: the slide places it on the C and D sides (interpersonal, holistic).`;
  for (const k of ['a', 'b', 'c', 'd'] as const)
    if (a[k] !== b[k]) return `Quadrant ${k.toUpperCase()} is now coded ${b[k]} — ${CODE_LABEL[b[k]]}. More than one quadrant may share a number.`;
  return '';
}

const codeOptions = [
  { value: '1', label: '1 · preferred' },
  { value: '2', label: '2 · competent' },
  { value: '3', label: '3 · avoided' },
];

export default function WholeBrainModel() {
  return (
    <Simulation<S>
      label="Herrmann's Whole Brain Model: a thinking profile against the side a creative stage needs"
      terms={[
        { term: 'Thinking profile', def: 'How you first look at a problem: your response to each of the four quadrants.' },
        { term: '1 · 2 · 3', def: 'Preferred mode is 1; competent mode is 2 (how you function, not your first choice); avoidance is 3.' },
        { term: 'A–B and C–D sides', def: 'A and B are preparation and verification; C and D are incubation and illumination.' },
      ]}
      initial={initial}
      controls={[
        { key: 'a', label: 'A — logical, analytical, fact based, quantitative', type: 'select', options: codeOptions },
        { key: 'b', label: 'B — organised, sequential, planned, detailed', type: 'select', options: codeOptions },
        { key: 'c', label: 'C — interpersonal, feeling based, kinaesthetic, emotional', type: 'select', options: codeOptions },
        { key: 'd', label: 'D — holistic, intuitive, integrating, synthesising', type: 'select', options: codeOptions },
        { key: 'stage', label: 'The task in front of you', type: 'select', options: [
          { value: 'preparation', label: 'Preparation — explore the problem' },
          { value: 'incubation', label: 'Incubation — let it mull' },
          { value: 'illumination', label: 'Illumination — the idea arrives' },
          { value: 'verification', label: 'Verification — check it works' },
        ] },
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'A task needs the C and D sides, and you have coded both 3. What does the lecture advise?',
        options: [
          { text: 'Stick to your preferred A and B sides, since preference should lead', why: 'Preference does not decide the quadrant: the lecture says the task does, so avoiding C and D leaves the task undone.' },
          { text: 'Be aware of it and consciously push yourself there, or use a teammate who prefers them', correct: true, why: 'The lecture: to solve a certain problem you need to go to a certain quadrant; if you avoid it, push yourself there, and teams with different preferences complement each other.' },
          { text: 'Recode C and D as 1, because codes should match the task', why: 'The codes describe how you respond to each quadrant; changing the numbers does not change how you think.' },
        ],
      }}
    />
  );
}
