/*
SCENE: Rules, principles and policies — a switch, a weight on a balance, an arrow to a goal
LENGTH: 5 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: Rules apply all-or-nothing; principles argue in one direction and have weight; policies set a community goal.
  When rules clash one must go; when principles clash they are weighed — and no pedigree test catches principles.
SUBJECT: the three shapes, then the two clashes.
STEPS: 1 rule (switch) · 2 principle (balance) · 3 policy (arrow to a goal) · 4 conflicts: rule removed vs balance
  tips · 5 pedigree test misses principles.
REDUCED MOTION: the finished diagram with all five captions stacked.
BUDGET: < 7 KB gz. Icon column 96 units, text column 240 units (≤ 34 characters a line).
Source: concept laws2100-w05-rules-principles-and-policies; authority dworkin-taking-rights-seriously.
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const head = { fontFamily: 'var(--font-ui)', fontSize: 11, letterSpacing: 1.2, fill: 'var(--ink)' } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 13, fill: 'var(--ink)' } as const;
const txt = (y: number, title: string, ls: string[], id: string) => (
  <>
    <text x="112" y={y} {...head} data-label={id}>{title}</text>
    {ls.map((l, i) => <text key={i} x="112" y={y + 22 + i * 18} {...body}>{l}</text>)}
  </>
);
const stroke = { fill: 'none', stroke: 'var(--ink)', strokeWidth: 1.5 } as const;

const figure = (
  <svg viewBox={`0 0 ${W} 520`} role="img" aria-label="A rule as an on-off switch, a principle as a weight on a balance, a policy as an arrow to a goal; clashing rules versus weighed principles">
    <g data-step="1">
      <rect x="16" y="22" width="72" height="30" rx="15" {...stroke} />
      <circle cx="73" cy="37" r="10" {...stroke} />
      <text x="30" y="42" {...body} fontSize={11} fill="var(--ink-2)">on</text>
      {txt(24, 'RULE', ['if A then B: applies in an', 'all-or-nothing fashion'], 'rule')}
    </g>
    <g data-step="2">
      <path d="M52 100 L52 150 M20 110 L84 110 M20 110 L12 130 M20 110 L28 130 M84 110 L76 126 M84 110 L92 126 M40 150 L64 150" {...stroke} />
      <path d="M10 130 Q20 138 30 130" {...stroke} /><path d="M74 126 Q84 134 94 126" {...stroke} />
      {txt(108, 'PRINCIPLE', ['a reason that argues in one', 'direction; has weight', 'eg no one may profit by his', 'own wrong'], 'principle')}
    </g>
    <g data-step="3">
      <circle cx="74" cy="228" r="16" {...stroke} /><circle cx="74" cy="228" r="6" {...stroke} />
      <path d="M14 228 L64 228 M56 222 L64 228 L56 234" {...stroke} />
      {txt(210, 'POLICY', ['a goal: improve an economic,', 'political or social feature', 'eg decrease car accidents'], 'policy')}
    </g>
    <g data-step="4">
      <line x1="8" y1="300" x2={W - 8} y2="300" stroke="var(--ink-3)" strokeWidth="1" />
      <text x="8" y="324" {...head} fill="var(--ink-2)">WHEN THEY CLASH</text>
      <rect x="8" y="338" width="164" height="92" rx="10" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
      <text x="20" y="362" {...body}>rule 1 vs rule 2</text>
      <text x="20" y="388" {...body}>rule 1 stays</text>
      <line x1="110" y1="384" x2="160" y2="384" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="112" y="388" {...body} fill="var(--ink-3)">rule 2</text>
      <text x="20" y="408" {...body}>one must go</text>
      <rect x="188" y="338" width="164" height="92" rx="10" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
      <path d="M210 380 L330 368 M270 374 L270 396" {...stroke} />
      <text x="200" y="362" {...body} fontSize={12}>principle vs principle</text>
      <text x="200" y="418" {...body} fontSize={12}>weighed: balance tips</text>
    </g>
    <g data-step="5">
      <rect x="8" y="450" width={W - 16} height="62" rx="12" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="6 6" />
      <text x="22" y="476" {...head} fill="var(--ink-2)">PEDIGREE TEST</text>
      <text x="22" y="498" {...body}>catches rules; misses principles</text>
    </g>
  </svg>
);

export default function RulesPrinciplesAndPolicies() {
  return (
    <Diagram
      label="Rules, principles and policies: a switch, a balance and an arrow"
      terms={[
        { term: 'Principle', def: 'A requirement "of justice or fairness or some other dimension of morality" (TRS 22).' },
        { term: 'Policy', def: 'A standard "that sets out a goal to be reached" for the community (TRS 22).' },
        { term: 'Dimension of weight', def: 'Principles have it; rules do not.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'Positivism is "a model of and for a system of rules" (TRS 22). A rule applies in an all-or-nothing fashion: if A then B.' },
        { caption: 'A principle states a reason that argues in one direction, observed because it is a requirement of justice or fairness: no man may profit by his own wrong.' },
        { caption: 'A policy sets out a goal, generally an improvement in some economic, political or social feature of the community: automobile accidents are to be decreased.' },
        { caption: '"A logical distinction" (TRS 24): conflicting rules — one must go; conflicting principles — weigh them. Form does not always tell you which it is: look at how legal actors reason with it.' },
        { caption: "Principles cannot be identified by pedigree: Dworkin's counterexample to the rule of recognition." },
      ]}
      check={{
        question: 'Two standards point to opposite results, and the court decides by asking which matters more here without striking either down. What kind of standards are they?',
        options: [
          { text: 'Rules', why: 'Conflicting rules cannot both survive: one must go.' },
          { text: 'Principles', correct: true, why: 'Principles have the dimension of weight; a clash is resolved by weighing, and the loser remains a principle.' },
          { text: 'You can tell only from their wording', why: 'Form does not always tell you: classify a standard by how it works in argument.' },
        ],
      }}
    />
  );
}
