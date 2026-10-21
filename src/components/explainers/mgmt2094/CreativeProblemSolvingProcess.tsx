/*
SCENE: Creative problem solving — six finding stages that open and close
LENGTH: 6 screens pinned (desktop, full motion); 6 paced beats otherwise
BEATS: 6
INTENT: The six stages run in order, and each has a shape: divergent stages open out to many options, convergent
  stages narrow to a choice, and the first two do both — so a learner can name a stage and its move.
SUBJECT: the stage glyphs (diamond = diverge then converge; fan out = diverge; fan in = converge), arriving one per
  beat, with the one accent marker under the current stage.
BEAT 1 (0–17%): Objective finding (diamond) fades in; caption: list problems, converge via ownership, priority,
  critical nature. Opacity scrubbed, ease none.
BEAT 2 (17–33%): Fact finding (diamond); earlier stage dims to 60%.
BEAT 3 (33–50%): Problem finding (fan in); caption: define the problem correctly (Markman).
BEAT 4 (50–67%): Idea finding (fan out). BEAT 5 (67–83%): Solution finding (fan in).
BEAT 6 (83–100%): Acceptance finding (fan out): obstacles, contingency plans, action plan.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none. The accent marker moves by transform (translate) only.
REDUCED MOTION: final frame (all six stages at full ink, no marker) with all six captions stacked.
BUDGET: < 7 KB gz, no WebGL. Wide (six columns) and tall (six rows) layouts.
Source: concept mgmt2094-w05-creative-problem-solving-process (Week 5 lecture slides 15–22; lecture transcript);
  authority mgmt2094-markman-2017-how-you-define-the-problem.
*/
import { ScrollExplainer } from '../bases/ScrollExplainer';

type Move = 'both' | 'out' | 'in';
const STAGES: { name: string; desc: [string, string]; move: Move }[] = [
  { name: 'OBJECTIVE', desc: ['defines the', 'problem area'], move: 'both' },
  { name: 'FACT', desc: ['gathers the', 'information'], move: 'both' },
  { name: 'PROBLEM', desc: ['defines the', 'problem correctly'], move: 'in' },
  { name: 'IDEA', desc: ['generates many', 'solutions'], move: 'out' },
  { name: 'SOLUTION', desc: ['chooses workable', 'solutions'], move: 'in' },
  { name: 'ACCEPTANCE', desc: ['plans to', 'implement them'], move: 'out' },
];
const N = STAGES.length;
const MOVE_LABEL: Record<Move, string> = { both: 'diverge → converge', out: 'diverge', in: 'converge' };
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const ui = { fontFamily: 'var(--font-ui)', fill: 'var(--ink)' } as const;
const body = { fontFamily: 'var(--font-body)', fill: 'var(--ink-2)' } as const;

function Glyph({ move, cx, cy, w, h }: { move: Move; cx: number; cy: number; w: number; h: number }) {
  const l = cx - w, r = cx + w;
  const s = { stroke: 'var(--ink)', strokeWidth: 1.5, fill: 'none', strokeLinecap: 'round' } as const;
  if (move === 'both') return <polygon points={`${l},${cy} ${cx},${cy - h} ${r},${cy} ${cx},${cy + h}`} {...s} strokeLinejoin="round" />;
  const ys = [cy - h, cy, cy + h];
  return (
    <>
      {ys.map((y) => (move === 'out'
        ? <line key={y} x1={l} y1={cy} x2={r} y2={y} {...s} />
        : <line key={y} x1={l} y1={y} x2={r} y2={cy} {...s} />))}
    </>
  );
}

function opacityFor(i: number, t: number) {
  const appear = clamp((t - i) * 3 + 0.25);
  const end = t >= N - 1e-3;
  return appear * (!end && t - i >= 1 ? 0.6 : 1);
}

function scene(t: number) {
  const end = t >= N - 1e-3;
  const cur = Math.min(N - 1, Math.floor(t + 1e-6));
  const slide = { transition: 'transform 240ms var(--ease-out)' } as const;
  return (
    <>
      <svg className="x-wide" viewBox="0 0 720 270" role="img" aria-label="Six stages of creative problem solving in a row, each drawn as diverging, converging or both">
        {STAGES.map((st, i) => {
          const cx = 60 + i * 120;
          return (
            <g key={st.name} opacity={opacityFor(i, t)}>
              <Glyph move={st.move} cx={cx} cy={78} w={38} h={30} />
              <text x={cx} y="140" textAnchor="middle" {...ui} fontSize="11" letterSpacing="1">{st.name}</text>
              <text x={cx} y="155" textAnchor="middle" {...ui} fontSize="11" letterSpacing="1">FINDING</text>
              <text x={cx} y="182" textAnchor="middle" {...body} fontSize="13">{st.desc[0]}</text>
              <text x={cx} y="199" textAnchor="middle" {...body} fontSize="13">{st.desc[1]}</text>
              <text x={cx} y="224" textAnchor="middle" {...ui} fontSize="11" fill="var(--ink-2)">{MOVE_LABEL[st.move]}</text>
            </g>
          );
        })}
        {!end && (
          <g style={{ ...slide, transform: `translate(${cur * 120}px, 0)` }}>
            <line x1="26" y1="246" x2="94" y2="246" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" />
          </g>
        )}
      </svg>
      <svg className="x-tall" viewBox="0 0 360 560" role="img" aria-label="Six stages of creative problem solving in a column, each drawn as diverging, converging or both">
        {STAGES.map((st, i) => {
          const y0 = 12 + i * 90;
          return (
            <g key={st.name} opacity={opacityFor(i, t)}>
              <Glyph move={st.move} cx={56} cy={y0 + 36} w={34} h={26} />
              <text x="114" y={y0 + 22} {...ui} fontSize="12" letterSpacing="1">{st.name} FINDING</text>
              <text x="114" y={y0 + 44} {...body} fontSize="15" fill="var(--ink)">{st.desc[0]} {st.desc[1]}</text>
              <text x="114" y={y0 + 64} {...ui} fontSize="12" fill="var(--ink-2)">{MOVE_LABEL[st.move]}</text>
            </g>
          );
        })}
        {!end && (
          <g style={{ ...slide, transform: `translate(0, ${cur * 90}px)` }}>
            <line x1="102" y1="18" x2="102" y2="80" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" />
          </g>
        )}
      </svg>
    </>
  );
}

export default function CreativeProblemSolvingProcess() {
  return (
    <ScrollExplainer
      label="Creative problem solving: six finding stages that diverge, converge or both"
      terms={[
        { term: 'Divergent thinking', def: 'Coming up with many possible solutions to the one problem.' },
        { term: 'Convergent thinking', def: 'Solving a problem with only one single correct solution — narrowing to a choice.' },
        { term: 'Hits and hotspots', def: 'The promising items picked out, by questioning, as the process converges.' },
      ]}
      beats={[
        { caption: 'Objective finding defines the problem area: diverge to list problems, then converge on the most relevant by asking about ownership, priority and critical nature (urgency).' },
        { caption: 'Fact finding gathers the information. It increases comprehension, helps new ideas, and may show the earlier problems from a new perspective.' },
        { caption: 'Problem finding uses the hits from fact finding to define the problem correctly — the most productive definition possible. Markman: the statement you choose cues what you remember.' },
        { caption: 'Idea finding is mainly divergent: generate many solutions, using a variety of idea generation aids.' },
        { caption: 'Solution finding is the choice of ideas that can be transformed into workable solutions.' },
        { caption: 'Acceptance finding is divergent again: obstacles and ways to overcome them, preventive actions and contingency plans, and an action plan.' },
      ]}
      scene={scene}
      check={{
        question: 'A team lists what could block adoption of its new app, prepares contingency plans and drafts an action plan. Which stage is this, and which kind of thinking?',
        options: [
          { text: 'Solution finding — convergent', why: 'Solution finding chooses workable ideas; this team has already chosen and is planning implementation.' },
          { text: 'Acceptance finding — divergent', correct: true, why: 'Obstacles and fixes, preventive and contingency plans, and an action plan are acceptance finding, which the slides call a divergent activity.' },
          { text: 'Idea finding — divergent', why: 'Idea finding generates solutions to the problem; ideas about implementing a chosen solution belong to acceptance finding.' },
        ],
      }}
    />
  );
}
