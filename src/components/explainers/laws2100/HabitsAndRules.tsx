/*
SCENE: Habits and rules — two identical crowds, then the view flips inside
LENGTH: 5 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: From outside, a habit and a rule look the same (convergent behaviour); inside, only the rule shows criticism
  of deviation, the rule cited as the reason, and an internal aspect — so the habit of obedience cannot carry
  Austin's sovereign.
SUBJECT: the right-hand (church) column, which gains one feature per step while the cinema column stays empty.
STEPS: 1 both crowds, convergent behaviour · 2 criticism of deviation · 3 the rule as a good reason ·
  4 internal aspect · 5 conclusion: replace the habit of obedience with a rule.
REDUCED MOTION: the finished diagram with all five captions stacked.
BUDGET: < 8 KB gz. Two 164-unit columns on a 360-unit canvas; short lines so nothing overflows at phone width.
Source: concept laws2100-w02-habits-and-rules; authority hart-the-concept-of-law.
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const head = { fontFamily: 'var(--font-ui)', fontSize: 12, letterSpacing: 1.2, fill: 'var(--ink)' } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 14, fill: 'var(--ink-2)' } as const;
const FEATURES = [
  { y: 150, rule: ['deviation meets', 'criticism'] },
  { y: 220, rule: ['the rule is a good', 'reason to criticise'] },
  { y: 290, rule: ['internal aspect:', 'a common standard'] },
];

function Crowd({ x }: { x: number }) {
  return <>{[0, 1, 2, 3, 4, 5].map((i) => <circle key={i} cx={x + 20 + (i % 3) * 30} cy={70 + Math.floor(i / 3) * 22} r="6" fill="none" stroke="var(--ink)" strokeWidth="1.5" />)}</>;
}

const figure = (
  <svg viewBox={`0 0 ${W} 470`} role="img" aria-label="Cinema-goers and hat-removers in church look the same from outside; only the church crowd shows the three marks of a rule">
    <g data-step="1">
      <text x="12" y="22" {...head}>HABIT · CINEMA</text>
      <text x="196" y="22" {...head}>RULE · CHURCH</text>
      <text x="12" y="44" {...body} fontSize={12}>go at the weekend</text>
      <text x="196" y="44" {...body} fontSize={12}>men remove hats</text>
      <Crowd x={8} /><Crowd x={192} />
      <text x={W / 2} y="130" textAnchor="middle" {...body} fontSize={12}>from outside: the same convergent behaviour</text>
      <line x1="180" y1="140" x2="180" y2="340" stroke="var(--line)" strokeWidth="1" />
    </g>
    {FEATURES.map((f, i) => (
      <g key={f.y} data-step={i + 2}>
        <text x="90" y={f.y + 24} textAnchor="middle" {...body} fill="var(--ink-3)">—</text>
        <rect x="192" y={f.y} width="160" height="56" rx="10" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
        {f.rule.map((l, k) => <text key={k} x="204" y={f.y + 23 + k * 19} {...body} fill="var(--ink)">{l}</text>)}
      </g>
    ))}
    <g data-step="5">
      <rect x="8" y="366" width={W - 16} height="96" rx="12" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="6 6" />
      <text x="24" y="390" {...head}>{"HART'S CONCLUSION"}</text>
      <text x="24" y="414" {...body}>replace the habit of obedience with</text>
      <text x="24" y="433" {...body}>the idea of a rule: law is a matter of</text>
      <text x="24" y="452" {...body}>authority, not only power</text>
    </g>
  </svg>
);

export default function HabitsAndRules() {
  return (
    <Diagram
      label="Habits and rules: the same behaviour from outside, three differences from inside"
      terms={[
        { term: 'Habit of obedience', def: "The pillar of Austin's sovereignty: the bulk of society habitually obeys." },
        { term: 'Social rule', def: 'Convergent behaviour plus criticism of deviation, the rule as a reason, and an internal aspect.' },
        { term: 'Normative', def: 'Able to confer rights or authority. "Habits are not \'normative\'" (CL 60).' },
      ]}
      figure={figure}
      steps={[
        { caption: 'In both habits and rules we observe convergence of behaviour: most people go to the cinema at the weekend; men remove hats in church.' },
        { caption: 'First difference: deviations from a rule are met with criticism. Nobody is criticised for skipping the cinema.' },
        { caption: 'Second: the rule is regarded as a good reason for making that criticism.' },
        { caption: 'Third: social rules have an internal aspect. Habits cannot confer rights or authority on anyone.' },
        { caption: "Without the idea of a rule, a theory like Austin's cannot explain legal obligation. Legal obligation is more than coercion, but different from moral obligation." },
      ]}
      check={{
        question: 'Why can a habit of obedience not explain legal obligation, for Hart?',
        options: [
          { text: 'Habits are too rare in real societies', why: 'Hart accepts that convergent behaviour is common; the problem is what habits lack, not how often they occur.' },
          { text: 'Habits are not normative: they cannot confer rights or authority', correct: true, why: 'A habit is only convergent behaviour; it gives no reason to criticise and no authority — so it cannot ground an obligation.' },
          { text: 'Habits depend on coercion', why: 'Nothing in the cinema example involves coercion; the contrast is about criticism, reasons and the internal aspect.' },
        ],
      }}
    />
  );
}
