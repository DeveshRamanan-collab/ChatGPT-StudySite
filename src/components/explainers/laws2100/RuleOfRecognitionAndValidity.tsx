/*
SCENE: The rule of recognition as a gate — validity as membership, the gate itself like the metre bar
LENGTH: 4 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: Rules pass the gate's criteria into the system (validity = membership); the gate itself is neither valid nor
  invalid, only accepted by officials; a legal system exists when two minimum conditions hold.
SUBJECT: the gate and its five criteria.
STEPS: 1 the gate of criteria · 2 through it: a valid rule, a member of the system · 3 the gate beside the standard
  metre: accepted, neither valid nor invalid · 4 existence of a legal system: two conditions.
REDUCED MOTION: the finished diagram with all four captions stacked.
BUDGET: < 8 KB gz. Vertical flow on a 360-unit canvas.
Source: concept laws2100-w03-rule-of-recognition-and-validity; authority hart-the-concept-of-law; case card
  r-miller-v-secretary-of-state-for-exiting-the-european-union.
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const head = { fontFamily: 'var(--font-ui)', fontSize: 12, letterSpacing: 1.2, fill: 'var(--ink)' } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 14, fill: 'var(--ink-2)' } as const;
const CRITERIA = ['an authoritative text', 'legislative enactment', 'customary practice', 'declarations of specified persons', 'past judicial decisions'];

const figure = (
  <svg viewBox={`0 0 ${W} 590`} role="img" aria-label="Rules pass a gate of five criteria into the legal system; the gate stands beside the standard metre, accepted by officials">
    <g data-step="1">
      <text x="24" y="22" {...head} data-label="gate">THE GATE · RULE OF RECOGNITION</text>
      <rect x="8" y="34" width={W - 16} height="130" rx="12" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      {CRITERIA.map((c, i) => <text key={c} x="24" y={60 + i * 22} {...body}>{`${i + 1}. ${c}`}</text>)}
    </g>
    <g data-step="2">
      <line x1={W / 2} y1="164" x2={W / 2} y2="196" stroke="var(--ink)" strokeWidth="1.5" />
      <polyline points={`${W / 2 - 6},188 ${W / 2},196 ${W / 2 + 6},188`} fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <rect x="40" y="200" width={W - 80} height="64" rx="12" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x={W / 2} y="226" textAnchor="middle" {...head}>INSIDE THE SYSTEM</text>
      <text x={W / 2} y="250" textAnchor="middle" {...body}>valid = passes all the tests</text>
    </g>
    <g data-step="3">
      <rect x="8" y="290" width={W - 16} height="118" rx="12" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="6 6" />
      <line x1="30" y1="318" x2="140" y2="318" stroke="var(--ink)" strokeWidth="4" strokeLinecap="round" />
      <text x="152" y="323" {...body} fontSize={12}>the standard metre, Paris</text>
      <text x="24" y="352" {...body}>the gate itself can neither be valid</text>
      <text x="24" y="371" {...body}>nor invalid — it is simply accepted,</text>
      <text x="24" y="390" {...body}>kept alive by officials and judges</text>
    </g>
    <g data-step="4">
      <text x="24" y="444" {...head}>A LEGAL SYSTEM EXISTS WHEN</text>
      <rect x="8" y="456" width="164" height="126" rx="12" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      {['1 · valid rules', 'are generally', 'obeyed', '(factual)'].map((l, i) => <text key={i} x="20" y={482 + i * 19} {...body}>{l}</text>)}
      <rect x="188" y="456" width="164" height="126" rx="12" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      {['2 · officials accept', 'recognition, change', 'and adjudication as', 'common standards'].map((l, i) => <text key={i} x="200" y={482 + i * 19} {...body}>{l}</text>)}
    </g>
  </svg>
);

export default function RuleOfRecognitionAndValidity() {
  return (
    <Diagram
      label="The rule of recognition: a gate of criteria, validity as membership, and the existence of a legal system"
      terms={[
        { term: 'Rule of recognition', def: 'Authoritative criteria for identifying the primary rules of obligation.' },
        { term: 'Validity (Hart)', def: 'Membership: passing all the tests provided by the rule of recognition.' },
        { term: 'Ultimate rule', def: 'The supreme criterion; there may be several rules of recognition and one ultimate rule.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'Private persons and officials get authoritative criteria for identifying primary rules (CL 100). For Austin sovereignty came first; for Hart the rule comes first.' },
        { caption: '"To say that a given rule is valid is to recognize it as passing all the tests provided by the rule of recognition and so as a rule of the system" (CL 103).' },
        { caption: 'Is the rule of recognition valid? "No such question can arise": like the standard metre bar in Paris, it is simply accepted as appropriate for use (CL 109).' },
        { caption: 'Two minimum conditions, necessary and sufficient: general obedience (factual), and official acceptance of the secondary rules — what Hart adds to Austin. Both concern existence, not legitimacy.' },
      ]}
      check={{
        question: 'Asked "Is the rule of recognition itself valid?", what does Hart answer?',
        options: [
          { text: 'Yes — it passes its own tests', why: 'Validity means passing the tests the rule provides; for the rule itself, Hart says, "no such question can arise".' },
          { text: 'It is presupposed as valid', why: "That is Kelsen's move with the basic norm, not Hart's." },
          { text: 'Neither valid nor invalid — simply accepted', correct: true, why: 'Like the standard metre bar, it is the measure, accepted as appropriate for use in this way (CL 109).' },
        ],
      }}
    />
  );
}
