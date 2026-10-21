/*
SCENE: Legal realism against formalism — a sealed syllogism box, then the same box opened
LENGTH: 5 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: Formalism: rule + facts → result, nothing else enters. Realism opens the box: experience, social needs and
  policy flow in, and the paper rule becomes a label on the outside. Realism is a family of claims.
SUBJECT: the box lid — sealed, then open.
STEPS: 1 formalism's sealed box · 2 the same box opened (Holmes) · 3 inflows: facts, policy, social needs ·
  4 paper rule as outside label: books vs action · 5 descriptive (judges do) vs normative (judges should).
REDUCED MOTION: the finished diagram with all five captions stacked.
BUDGET: < 7 KB gz. Two stacked machines on a 360-unit canvas.
Source: concept laws2100-w06-realism-against-formalism; authority holmes-the-common-law.
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const head = { fontFamily: 'var(--font-ui)', fontSize: 11, letterSpacing: 1.2, fill: 'var(--ink)' } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 13, fill: 'var(--ink)' } as const;
const arrow = (x1: number, y: number, x2: number) => (
  <path d={`M${x1} ${y} L${x2} ${y} M${x2 - 7} ${y - 5} L${x2} ${y} L${x2 - 7} ${y + 5}`} fill="none" stroke="var(--ink-2)" strokeWidth="1.5" />
);
const INFLOW = [{ x: 118, t: 'facts' }, { x: 180, t: 'policy' }, { x: 242, t: 'social needs' }];

const figure = (
  <svg viewBox={`0 0 ${W} 540`} role="img" aria-label="Formalism as a sealed box turning rule and facts into a result; realism as the same box opened to facts, policy and social needs">
    <g data-step="1">
      <text x="8" y="22" {...head} fill="var(--ink-2)">FORMALISM</text>
      <text x="8" y="80" {...body}>rule</text>
      <text x="8" y="100" {...body}>+ facts</text>
      {arrow(58, 88, 94)}
      <rect x="96" y="48" width="168" height="80" rx="8" fill="none" stroke="var(--ink)" strokeWidth="2" />
      <text x="180" y="84" textAnchor="middle" {...body}>syllogism</text>
      <text x="180" y="104" textAnchor="middle" {...body} fontSize={11} fill="var(--ink-2)">nothing else enters</text>
      {arrow(266, 88, 300)}
      <text x={W - 8} y="93" textAnchor="end" {...body}>result</text>
    </g>
    <g data-step="2">
      <text x="8" y="176" {...head} fill="var(--ink-2)">REALISM</text>
      <path d="M96 270 L96 330 L264 330 L264 270" fill="none" stroke="var(--ink)" strokeWidth="2" />
      <path d="M96 270 L126 250 M264 270 L234 250" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="4 4" />
      <text x="180" y="316" textAnchor="middle" {...body}>decision</text>
      {arrow(266, 300, 300)}
      <text x={W - 8} y="305" textAnchor="end" {...body}>result</text>
    </g>
    <g data-step="3">
      {INFLOW.map((f) => (
        <g key={f.t}>
          <path d={`M${f.x} 214 L${f.x} 280 M${f.x - 5} 273 L${f.x} 280 L${f.x + 5} 273`} fill="none" stroke="var(--ink)" strokeWidth="1.5" />
          <text x={f.x} y="204" textAnchor="middle" {...body} fontSize={12}>{f.t}</text>
        </g>
      ))}
    </g>
    <g data-step="4">
      <rect x="8" y="286" width="80" height="30" rx="6" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="4 4" />
      <text x="48" y="306" textAnchor="middle" {...body} fontSize={12} fill="var(--ink-2)">paper rule</text>
      <text x="180" y="362" textAnchor="middle" {...body} fill="var(--ink-2)">law in books ≠ law in action</text>
    </g>
    <g data-step="5">
      <rect x="8" y="392" width="164" height="140" rx="12" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="20" y="416" {...head}>DESCRIPTIVE</text>
      {['judges do decide', 'on policy; rules', 'are indeterminate'].map((l, i) => <text key={l} x="20" y={440 + i * 18} {...body}>{l}</text>)}
      <rect x="188" y="392" width="164" height="140" rx="12" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="200" y="416" {...head}>NORMATIVE</text>
      {['judges should', 'decide by making', 'policy decisions'].map((l, i) => <text key={l} x="200" y={440 + i * 18} {...body}>{l}</text>)}
    </g>
  </svg>
);

export default function RealismAgainstFormalism() {
  return (
    <Diagram
      label="Legal realism against formalism: a sealed syllogism box and the same box opened"
      terms={[
        { term: 'Formalism', def: 'Law as a self-contained system of rules, applied by deduction: "mechanical jurisprudence".' },
        { term: 'Paper rules', def: 'The rules in the books, as against the real rules of law in action.' },
        { term: 'Legal realism', def: 'An umbrella term: American and Scandinavian families sharing a set of claims, not one theory.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'Formalism, the received view in US law schools: judges apply general rules to the facts by syllogism; rules generate the result like mathematical propositions, independent of moral, political, economic and social considerations.' },
        { caption: 'Is this what judges really do? Holmes: "The life of the law has not been logic; it has been experience" (The Common Law, 1881).' },
        { caption: 'Law is a product of historical experience, social needs and public policy. The law is indeterminate: general rules cannot decide concrete cases.' },
        { caption: 'Law in books differs from law in action: paper rules versus real rules. The traditional idea of law as a system of rules is a myth.' },
        { caption: 'Realism is a family of claims. Say which one you are attacking or defending, and whether it is descriptive (judges do) or normative (judges should).' },
      ]}
      check={{
        question: '"Judges should decide cases by weighing the social consequences." How should you classify this realist claim?',
        options: [
          { text: 'Descriptive', why: 'A descriptive claim says what judges do; this one says what they should do.' },
          { text: 'Normative', correct: true, why: 'It is the "(should)" in claim 4: judges (should) decide by making policy decisions.' },
          { text: 'Formalist', why: 'Formalism holds judicial reasoning independent of social considerations — the opposite.' },
        ],
      }}
    />
  );
}
