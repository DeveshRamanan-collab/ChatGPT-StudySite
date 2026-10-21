/*
SCENE: Kelsen's Stufenbau — the chain of validity up to a presupposed basic norm
LENGTH: 4 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: The gangster and the tax officer issue commands with the same subjective meaning; only the officer's is
  authorised by a valid norm. Asking why a norm is valid climbs a stack of norms to the historically first
  constitution, above which the basic norm must be presupposed.
SUBJECT: the stack of norms, climbed from the bottom; the dashed basic norm at the top.
STEPS: 1 gangster vs tax officer · 2 regulation → authorising norm → statute · 3 constitution → earlier
  constitutions → historically first constitution · 4 dashed, presupposed basic norm.
REDUCED MOTION: the finished diagram with all four captions stacked.
BUDGET: < 8 KB gz. A vertical stack on a 360-unit canvas (read bottom-up).
Source: concept laws2100-w03-kelsen-pure-theory; authorities kelsen-pure-theory-of-law,
  kelsen-pure-theory-and-analytical-jurisprudence.
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const head = { fontFamily: 'var(--font-ui)', fontSize: 12, letterSpacing: 1.2, fill: 'var(--ink)' } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 14, fill: 'var(--ink-2)' } as const;

function Tier({ y, text, inset, id }: { y: number; text: string; inset: number; id: string }) {
  return (
    <>
      <rect x={8 + inset} y={y} width={W - 16 - inset * 2} height="36" rx="8" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x={W / 2} y={y + 23} textAnchor="middle" {...body} fill="var(--ink)" data-label={id}>{text}</text>
      <line x1={W / 2} y1={y + 36} x2={W / 2} y2={y + 48} stroke="var(--ink-3)" strokeWidth="1.5" />
    </>
  );
}

const figure = (
  <svg viewBox={`0 0 ${W} 560`} role="img" aria-label="A stack of norms from a council regulation up to the historically first constitution, with a dashed presupposed basic norm on top">
    <g data-step="4">
      <rect x="40" y="8" width={W - 80} height="58" rx="10" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="6 6" />
      <text x={W / 2} y="30" textAnchor="middle" {...head} data-label="grundnorm">BASIC NORM · PRESUPPOSED</text>
      <text x={W / 2} y="52" textAnchor="middle" {...body} fontSize={13}>you ought to obey the first constitution</text>
      <line x1={W / 2} y1="66" x2={W / 2} y2="80" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="3 3" />
    </g>
    <g data-step="3">
      <Tier id="first" y={80} inset={48} text="historically first constitution" />
      <Tier id="earlier" y={128} inset={40} text="earlier constitutions" />
      <Tier id="constitution" y={176} inset={32} text="the constitution" />
    </g>
    <g data-step="2">
      <Tier id="statute" y={224} inset={24} text="the statute" />
      <Tier id="authorising" y={272} inset={16} text="the norm authorising the council" />
      <rect x="8" y="320" width={W - 16} height="36" rx="8" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x={W / 2} y="343" textAnchor="middle" {...body} fill="var(--ink)" data-label="regulation">a council regulation</text>
    </g>
    <g data-step="1">
      <line x1={W / 2} y1="392" x2={W / 2} y2="358" stroke="var(--ink-3)" strokeWidth="1.5" />
      <text x={W / 2 + 10} y="380" {...body} fontSize={12}>why valid?</text>
      <rect x="8" y="400" width="164" height="150" rx="12" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="20" y="424" {...head}>TAX OFFICER</text>
      {['same subjective', 'meaning — but', 'authorised by an', 'objectively valid', 'legal norm'].map((l, i) => <text key={i} x="20" y={448 + i * 19} {...body}>{l}</text>)}
      <rect x="188" y="400" width="164" height="150" rx="12" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="6 6" />
      <text x="200" y="424" {...head}>GANGSTER</text>
      {['same subjective', 'meaning — no', 'authorising norm'].map((l, i) => <text key={i} x="200" y={448 + i * 19} {...body}>{l}</text>)}
    </g>
  </svg>
);

export default function KelsenPureTheory() {
  return (
    <Diagram
      label="Kelsen's pure theory: the chain of validity from a council regulation to the presupposed basic norm"
      terms={[
        { term: 'Stufenbau', def: 'The hierarchical structure of a legal order, revealed by the search for the reason of validity.' },
        { term: 'Validity', def: 'For Kelsen, binding force — not membership. It cannot be a fact.' },
        { term: 'Basic norm (Grundnorm)', def: 'A transcendental-logical presupposition: you ought to obey the historically first constitution.' },
      ]}
      figure={figure}
      steps={[
        { caption: '"The law is a coercive order." The gangster and the tax officer give commands with the same subjective meaning, but only the tax officer\'s is authorised by an objectively valid legal norm.' },
        { caption: 'A council regulation is valid because a higher norm authorised the council; that norm is valid because of the statute. Only a competent authority can create a valid norm.' },
        { caption: 'Up to the constitution, then back through earlier constitutions to the historically first constitution — the chain of validity. Law regulates its own creation.' },
        { caption: 'Why is the first constitution valid? We must presuppose a norm: you ought to obey it. The theory is pure: it answers what the law is, not what it ought to be.' },
      ]}
      check={{
        question: 'For Kelsen, what ultimately makes the historically first constitution valid?',
        options: [
          { text: 'The fact that officials accept it', why: "That is Hart's answer for the rule of recognition; for Kelsen validity cannot be a fact." },
          { text: 'A presupposed basic norm: you ought to obey it', correct: true, why: 'The chain of validity ends in a norm that is presupposed, not created — the Grundnorm.' },
          { text: 'An earlier constitution', why: 'There is no earlier one: it is historically first, so the chain can only end in a presupposition.' },
        ],
      }}
    />
  );
}
