/*
SCENE: Can human rights be justified? — a claim on three legs, Bentham's strike, five sceptical questions, and the
  question of morality underneath
LENGTH: 4 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: The case for human rights rests on foundations (natural law, deontological principles, human dignity);
  Bentham knocks out natural rights ("nonsense upon stilts": only legal rights exist); five sceptical questions press
  on the rest; and the whole dispute turns on whether moral statements can be true or false.
SUBJECT: the central claim and the leg that is struck out.
STEPS: 1 the claim and its three legs · 2 Bentham strikes the natural-rights leg · 3 five sceptical questions ·
  4 relativism against objectivism.
REDUCED MOTION: the finished diagram with all four captions stacked.
BUDGET: < 5 KB gz.
Source: concept laws2100-w09-critiques-of-human-rights; authority bentham-anarchical-fallacies.
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const head = { fontFamily: 'var(--font-ui)', fontSize: 11, letterSpacing: 1.2, fill: 'var(--ink-2)' } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 13, fill: 'var(--ink)' } as const;
const QUESTIONS = [
  { x: 16, y: 272, t: 'human nature a myth?' },
  { x: 16, y: 292, t: 'rights selfish?' },
  { x: 16, y: 312, t: 'instrument of oppression?' },
  { x: 196, y: 272, t: 'threat to community?' },
  { x: 196, y: 292, t: 'ethnocentric?' },
];

const figure = (
  <svg viewBox={`0 0 ${W} 430`} role="img" aria-label="Human rights are justified, resting on natural law, deontological principles and human dignity; Bentham strikes natural rights; five sceptical questions; relativism against objectivism">
    <g data-step="1">
      <rect x="90" y="30" width="180" height="40" rx="6" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="180" y="55" textAnchor="middle" {...body}>human rights are justified</text>
      <line x1="126" y1="70" x2="96" y2="150" stroke="var(--ink)" strokeWidth="1.5" />
      <line x1="180" y1="70" x2="180" y2="150" stroke="var(--ink)" strokeWidth="1.5" />
      <line x1="234" y1="70" x2="264" y2="150" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="96" y="170" textAnchor="middle" {...body} fontSize={12}>natural law</text>
      <text x="180" y="170" textAnchor="middle" {...body} fontSize={12}>deontological</text>
      <text x="180" y="186" textAnchor="middle" {...body} fontSize={12}>principles</text>
      <text x="264" y="170" textAnchor="middle" {...body} fontSize={12}>human dignity</text>
    </g>
    <g data-step="2">
      <path d="M100 100 L122 122 M122 100 L100 122" fill="none" stroke="var(--ink)" strokeWidth="2" />
      <text x="16" y="216" {...head}>BENTHAM</text>
      <text x="16" y="234" {...body} fontSize={12}>"nonsense upon stilts": only legal rights exist</text>
    </g>
    <g data-step="3">
      <line x1="8" y1="248" x2={W - 8} y2="248" stroke="var(--ink-3)" strokeWidth="1" />
      <text x="16" y="262" {...head} fontSize={10}>ARE RIGHTS… / IS…</text>
      {QUESTIONS.map((q, i) => (
        <g key={i}>
          <path d={`M${q.x} ${q.y + 11} L${q.x + 8} ${q.y + 7} L${q.x} ${q.y + 3}`} fill="none" stroke="var(--ink-2)" strokeWidth="1.2" />
          <text x={q.x + 14} y={q.y + 12} {...body} fontSize={12}>{q.t}</text>
        </g>
      ))}
    </g>
    <g data-step="4">
      <line x1="8" y1="342" x2={W - 8} y2="342" stroke="var(--ink-2)" strokeWidth="1.5" />
      <line x1="180" y1="350" x2="180" y2="420" stroke="var(--ink-3)" strokeWidth="1" />
      <text x="16" y="366" {...head}>RELATIVISM</text>
      <text x="16" y="386" {...body} fontSize={12}>disagreements rationally</text>
      <text x="16" y="402" {...body} fontSize={12}>resolvable?</text>
      <text x="196" y="366" {...head}>OBJECTIVISM</text>
      <text x="196" y="386" {...body} fontSize={12}>(realism): statements apt</text>
      <text x="196" y="402" {...body} fontSize={12}>for truth and falsity?</text>
    </g>
  </svg>
);

export default function CritiquesOfHumanRights() {
  return (
    <Diagram
      label="Can human rights be justified? Foundations, Bentham's challenge, five sceptical questions and the nature of morality"
      terms={[
        { term: 'Natural rights', def: 'Rights grounded in natural law, independent of positive law: Bentham\'s target.' },
        { term: 'Moral relativism', def: 'Moral values and claims are relative to a particular culture or society.' },
        { term: 'Moral objectivism', def: 'There are moral facts, so moral statements can be true or false.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'Justification: some of the strongest arguments for human rights come from natural law, from deontological principles and from the idea of human dignity.' },
        { caption: 'Bentham: "Natural rights is simple nonsense … nonsense upon stilts." On the lecture\'s reading, for this utilitarian with a positivist outlook only legal rights exist; natural law is wishful thinking.' },
        { caption: 'The slide\'s sceptical questions: is human nature a myth (rights talk as rhetoric)? Are rights selfish? An instrument of oppression? A threat to community? Ethnocentric? (Yet comparison across legal systems suggests common ground.)' },
        { caption: 'Underneath: are moral disagreements rationally resolvable (relativism; metaethical v normative)? Are moral statements apt for truth and falsity (objectivism/realism)? The case for rights depends on the answer.' },
      ]}
      check={{
        question: 'What does Bentham\'s "nonsense upon stilts" deny?',
        options: [
          { text: 'That natural rights exist outside positive law', correct: true, why: 'On the lecture\'s reading, only legal rights exist for Bentham; natural rights are wishful thinking.' },
          { text: 'That rights may be weighed against utility in a hard case', why: 'Bentham was a utilitarian, but this line attacks the existence of natural rights, not a particular weighing.' },
          { text: 'That rights can be limited by a limitation clause', why: 'Limitation clauses are modern constitutional provisions; the 1843 quotation concerns natural rights.' },
        ],
      }}
    />
  );
}
