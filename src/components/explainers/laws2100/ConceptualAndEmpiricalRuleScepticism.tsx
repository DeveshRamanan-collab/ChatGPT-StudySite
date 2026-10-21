/*
SCENE: Conceptual and empirical rule-scepticism — one fork, a cut wire, three sockets
LENGTH: 5 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: Conceptual scepticism denies rules are law (duty iff the courts say so); empirical scepticism keeps the rules
  but cuts the wire between rule and decision, with idiosyncratic, sociological and pragmatic factors deciding.
SUBJECT: the wire from rule to decision — whole on one side, cut on the other.
STEPS: 1 root (CL ch VII) · 2 conceptual branch · 3 empirical branch, wire cut · 4 three sockets (Frank, Llewellyn,
  Cohen) · 5 one can be empirical without being conceptual.
REDUCED MOTION: the finished diagram with all five captions stacked.
BUDGET: < 7 KB gz. Two 164-unit columns, full-width sockets on a 360-unit canvas.
Source: concept laws2100-w06-conceptual-and-empirical-rule-scepticism; authority hart-the-concept-of-law.
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const head = { fontFamily: 'var(--font-ui)', fontSize: 11, letterSpacing: 1.2, fill: 'var(--ink)' } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 13, fill: 'var(--ink)' } as const;
const SOCKETS = [['idiosyncratic', "Frank: the judge's preferences"], ['sociological', 'Llewellyn: judges as a class'], ['pragmatic', 'Cohen: policy consequences']];
const txt = (x: number, y: number, ls: string[], fill = 'var(--ink)') => ls.map((l, i) => <text key={i} x={x} y={y + i * 18} {...body} fill={fill}>{l}</text>);

const figure = (
  <svg viewBox={`0 0 ${W} 540`} role="img" aria-label="Rule-scepticism forks into conceptual (rules are not law) and empirical (rules exist but do not decide cases), with three kinds of non-legal factor">
    <g data-step="1">
      <rect x="60" y="8" width="240" height="40" rx="10" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x={W / 2} y="33" textAnchor="middle" {...head}>RULE-SCEPTICISM · CL VII</text>
    </g>
    <g data-step="2">
      <path d="M150 48 L90 76" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
      <rect x="8" y="76" width="164" height="190" rx="12" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="20" y="100" {...head} data-label="conceptual">CONCEPTUAL</text>
      {txt(20, 122, ['about the nature', 'of law'], 'var(--ink-2)')}
      {txt(20, 170, ['"paper rules" are', 'not the real law:', 'duty iff the courts', 'say so'])}
    </g>
    <g data-step="3">
      <path d="M210 48 L270 76" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
      <rect x="188" y="76" width="164" height="190" rx="12" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="200" y="100" {...head} data-label="empirical">EMPIRICAL</text>
      {txt(200, 122, ['about adjudication'], 'var(--ink-2)')}
      <rect x="200" y="140" width="52" height="28" rx="6" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="226" y="159" textAnchor="middle" {...body} fontSize={12}>rule</text>
      <rect x="288" y="140" width="52" height="28" rx="6" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="314" y="159" textAnchor="middle" {...body} fontSize={12}>result</text>
      <path d="M252 154 L264 154 M276 154 L288 154 M262 146 L268 162 M272 146 L278 162" fill="none" stroke="var(--ink-2)" strokeWidth="1.5" />
      {txt(200, 194, ['judges respond to', 'the facts; rules', 'support both sides'])}
    </g>
    <g data-step="4">
      <text x="8" y="296" {...head} fill="var(--ink-2)">NON-LEGAL FACTORS DECIDE</text>
      {SOCKETS.map(([k, v], i) => (
        <g key={k}>
          <circle cx="24" cy={326 + i * 46} r="9" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
          <text x="44" y={322 + i * 46} {...head} fontSize={10}>{k.toUpperCase()}</text>
          <text x="44" y={340 + i * 46} {...body}>{v}</text>
        </g>
      ))}
    </g>
    <g data-step="5">
      <rect x="8" y="464" width={W - 16} height="66" rx="12" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="6 6" />
      <text x="22" y="490" {...body}>empirical without conceptual: rules may</text>
      <text x="22" y="510" {...body}>exist, but judges do not use them to decide</text>
    </g>
  </svg>
);

export default function ConceptualAndEmpiricalRuleScepticism() {
  return (
    <Diagram
      label="Conceptual and empirical rule-scepticism: a fork, a cut wire and three non-legal factors"
      terms={[
        { term: 'Paper rules', def: 'Rules in the books — which the conceptual sceptic says are not the real law.' },
        { term: 'Conceptual rule-scepticism', def: 'A claim about the nature of law: rules do not really exist as law.' },
        { term: 'Empirical rule-scepticism', def: 'A claim about adjudication: rules exist, but do not decide cases.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'Chapter VII of The Concept of Law discusses varieties of rule-scepticism; the literature distinguishes two.' },
        { caption: 'Conceptual: we are under a legal duty not to do X iff the courts say so. It challenges whether rules exist, so Hart must defeat it to defend law as the union of primary and secondary rules.' },
        { caption: 'Empirical: judges respond to the underlying facts. So many rules might be relevant that there is always support for both sides; judges cherry-pick doctrine to reach a result reached on other grounds.' },
        { caption: 'The realists sought "laws of judicial behaviour": idiosyncratic (Frank), sociological (Llewellyn) and pragmatic (Cohen) adjudication.' },
        { caption: 'You can be an empirical rule-sceptic without embracing conceptual rule-scepticism. Name the kind before you rebut it.' },
      ]}
      check={{
        question: 'A realist says "judges decide on the facts, then find a rule to fit". Which scepticism is this, and does it deny that rules exist?',
        options: [
          { text: 'Conceptual — it denies rules are law', why: 'Nothing in the claim says rules are not law; it is about what causes decisions.' },
          { text: 'Empirical — it accepts rules may exist but says they do not decide cases', correct: true, why: 'Empirical scepticism is about adjudication: judges cherry-pick doctrine to reach a result reached on other grounds.' },
          { text: 'Neither — it is formalism', why: 'Formalism says rules mechanically generate results — the opposite claim.' },
        ],
      }}
    />
  );
}
