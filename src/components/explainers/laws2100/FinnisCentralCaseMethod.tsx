/*
SCENE: Finnis's method — three moves lead inward from watered-down cases to the central case of law
LENGTH: 5 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: Even a descriptive theory must evaluate: practical point, central case and focal meaning, and viewpoint
  narrow inward to the central case of law, seen by the practically reasonable person.
SUBJECT: the rings closing on the centre, one move at a time.
STEPS: 1 periphery (watered-down cases) · 2 ring: practical point · 3 ring: central case / focal meaning ·
  4 ring: viewpoint (practically reasonable person) · 5 centre: central case of law; authority depends on justice.
REDUCED MOTION: the finished diagram with all five captions stacked.
BUDGET: < 6 KB gz. Concentric rings on a 360-unit canvas; ring labels sit inside each band's chord.
Source: concept laws2100-w04-finnis-central-case-method; authorities finnis-natural-law-and-natural-rights,
  hart-the-concept-of-law.
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const C = { x: 180, y: 200 };
const head = { fontFamily: 'var(--font-ui)', fontSize: 12, letterSpacing: 1.2, fill: 'var(--ink)' } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 13, fill: 'var(--ink-2)' } as const;
const DOTS = [[22, 52], [338, 52], [22, 356], [338, 356]];

const figure = (
  <svg viewBox={`0 0 ${W} 450`} role="img" aria-label="Watered-down cases on the periphery; three rings — practical point, central case, viewpoint — lead to the central case of law">
    <g data-step="1">
      <text x={W / 2} y="18" textAnchor="middle" {...head} fill="var(--ink-2)">PERIPHERY · WATERED-DOWN CASES</text>
      {DOTS.map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="4" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />)}
    </g>
    <g data-step="2">
      <circle cx={C.x} cy={C.y} r="170" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
      <text x={W / 2} y="60" textAnchor="middle" {...head} data-label="point">1 · PRACTICAL POINT</text>
    </g>
    <g data-step="3">
      <circle cx={C.x} cy={C.y} r="120" fill="none" stroke="var(--ink-2)" strokeWidth="1.5" />
      <text x={W / 2} y="108" textAnchor="middle" {...head} fontSize={11} data-label="central">2 · CENTRAL CASE</text>
      <text x={W / 2} y="124" textAnchor="middle" {...body} fontSize={12}>and focal meaning</text>
    </g>
    <g data-step="4">
      <circle cx={C.x} cy={C.y} r="62" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x={W / 2} y="178" textAnchor="middle" {...head} fontSize={11} data-label="viewpoint">3 · VIEWPOINT</text>
      <text x={W / 2} y="400" textAnchor="middle" {...body} fill="var(--ink)">viewpoint: the practically reasonable person</text>
    </g>
    <g data-step="5">
      <circle cx={C.x} cy={C.y + 10} r="4" fill="var(--ink)" stroke="var(--ink)" strokeWidth="1" />
      <text x={W / 2} y={C.y + 38} textAnchor="middle" {...body} fill="var(--ink)" data-label="law">central case</text>
      <text x={W / 2} y={C.y + 54} textAnchor="middle" {...body} fill="var(--ink)">of law</text>
      <text x={W / 2} y="426" textAnchor="middle" {...body}>authority depends on its justice (NLNR 260)</text>
    </g>
  </svg>
);

export default function FinnisCentralCaseMethod() {
  return (
    <Diagram
      label="Finnis's method: practical point, central case and viewpoint lead inward to the central case of law"
      terms={[
        { term: 'Central case', def: 'The fullest instance of a concept, against which watered-down cases are measured.' },
        { term: 'Focal meaning', def: 'The primary sense of a word, from which peripheral uses take their sense.' },
        { term: 'Practical reasonableness', def: "Finnis's standard: what is really required in relation to the basic human goods." },
      ]}
      figure={figure}
      steps={[
        { caption: '"No theorist can give a theoretical description and analysis of social facts without also participating in the work of evaluation" (NLNR 3). Evaluation is needed even for a descriptive theory.' },
        { caption: 'Hart and Raz beat the "rather naive methodologies of Bentham, Austin, and Kelsen" with three features (NLNR 6). First: attention to practical point.' },
        { caption: 'Second: selection of central case and focal meaning. Hart uses one (the union of rules, CL 155) — but by what criteria is a case central, and from what viewpoint?' },
        { caption: 'Third: viewpoint. Hart treats the internal point of view as an amalgam (CL 203); Finnis says focus on its central case, the practically reasonable person.' },
        { caption: 'In the central case of law, authority "depends … on its justice or at least its ability to secure justice" (NLNR 260).' },
      ]}
      check={{
        question: "What is Finnis's main complaint about Hart's use of the internal point of view?",
        options: [
          { text: 'Hart should not have given it explanatory priority', why: 'Finnis keeps the priority; his complaint is about which internal viewpoint Hart picks.' },
          { text: 'Hart treats it as an amalgam instead of focusing on its central case, the practically reasonable person', correct: true, why: 'Identifying that central case needs an evaluation of what practical reasonableness really requires.' },
          { text: 'Hart ignores central cases altogether', why: 'Hart does use a central case — the union of primary and secondary rules (CL 155).' },
        ],
      }}
    />
  );
}
