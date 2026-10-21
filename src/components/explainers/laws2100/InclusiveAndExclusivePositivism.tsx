/*
SCENE: Inclusive and exclusive positivism — the same equality principle plugged into two validity tests
LENGTH: 5 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: Social sources feed the validity test; inclusive positivists let a system incorporate a moral criterion (for
  that system only), exclusive positivists say the incorporated principle becomes a legal criterion and morality
  stays outside.
SUBJECT: the equality-principle tag, first labelled moral, then legal.
STEPS: 1 social sources · 2 validity test (social sources thesis) · 3 inclusive (Hart) · 4 exclusive (Raz) ·
  5 an intramural debate, started by Dworkin's criticisms.
REDUCED MOTION: the finished diagram with all five captions stacked.
BUDGET: < 7 KB gz. Two 164-unit columns on a 360-unit canvas.
Source: concept laws2100-w05-inclusive-and-exclusive-positivism; authority hart-the-concept-of-law.
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const head = { fontFamily: 'var(--font-ui)', fontSize: 11, letterSpacing: 1.2, fill: 'var(--ink)' } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 13, fill: 'var(--ink)' } as const;
const SOURCES = [['legislation'], ['judicial', 'decisions'], ['social', 'customs']];
const txt = (x: number, y: number, ls: string[], fill = 'var(--ink)') => ls.map((l, i) => <text key={i} x={x} y={y + i * 18} {...body} fill={fill}>{l}</text>);

function Column({ x, title, tag, ls, id }: { x: number; title: string; tag: string; ls: string[]; id: string }) {
  return (
    <>
      <line x1={x + 82} y1="148" x2={x + 82} y2="172" stroke="var(--ink-3)" strokeWidth="1.5" />
      <rect x={x} y="172" width="164" height="196" rx="12" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x={x + 12} y="196" {...head} data-label={id}>{title}</text>
      <rect x={x + 12} y="210" width="140" height="30" rx="6" fill="none" stroke="var(--ink-2)" strokeWidth="1.5" />
      <text x={x + 82} y="230" textAnchor="middle" {...body} fontSize={12}>equality principle</text>
      <text x={x + 12} y="262" {...head} fill="var(--ink-2)">{tag}</text>
      {txt(x + 12, 286, ls)}
    </>
  );
}

const figure = (
  <svg viewBox={`0 0 ${W} 520`} role="img" aria-label="Social sources feed a validity test; inclusive positivism plugs in a moral criterion, exclusive positivism relabels it a legal criterion">
    <g data-step="1">
      {SOURCES.map((ls, i) => (
        <g key={i}>
          <rect x={8 + i * 118} y="8" width="108" height="54" rx="8" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
          {ls.map((l, k) => <text key={l} x={62 + i * 118} y={(ls.length === 1 ? 40 : 30) + k * 18} textAnchor="middle" {...body}>{l}</text>)}
          <line x1={62 + i * 118} y1="62" x2="180" y2="96" stroke="var(--ink-3)" strokeWidth="1.5" />
        </g>
      ))}
    </g>
    <g data-step="2">
      <rect x="8" y="96" width={W - 16} height="52" rx="10" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x={W / 2} y="118" textAnchor="middle" {...head}>VALIDITY TEST</text>
      <text x={W / 2} y="138" textAnchor="middle" {...body} fontSize={12} fill="var(--ink-2)">the social sources thesis (CL 269)</text>
    </g>
    <g data-step="3"><Column id="inclusive" x={8} title="INCLUSIVE · HART" tag="MORAL CRITERION" ls={['for this system', 'only: contingent,', 'not necessary']} /></g>
    <g data-step="4">
      <Column id="exclusive" x={188} title="EXCLUSIVE · RAZ" tag="LEGAL CRITERION" ls={['once incorporated,', 'it is a legal', 'criterion']} />
      <rect x="188" y="384" width="164" height="36" rx="18" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="5 5" />
      <text x="270" y="407" textAnchor="middle" {...body} fill="var(--ink-2)">morality: outside</text>
    </g>
    <g data-step="5">
      <line x1="8" y1="444" x2={W - 8} y2="444" stroke="var(--ink-3)" strokeWidth="1" />
      <text x={W / 2} y="472" textAnchor="middle" {...body} fill="var(--ink-2)">an intramural debate (Bix 46–49) — begun</text>
      <text x={W / 2} y="492" textAnchor="middle" {...body} fill="var(--ink-2)">because Dworkin's criticisms had merit</text>
    </g>
  </svg>
);

export default function InclusiveAndExclusivePositivism() {
  return (
    <Diagram
      label="Inclusive and exclusive positivism: the same equality principle in two validity tests"
      terms={[
        { term: 'Social sources thesis', def: 'Law is identified by its social sources "without reference to morality except where the law thus identified has itself incorporated moral criteria" (CL 269).' },
        { term: 'Inclusive (soft) positivism', def: 'A particular system may make moral criteria necessary or sufficient for validity.' },
        { term: 'Exclusive (hard) positivism', def: 'Moral criteria can be neither sufficient nor necessary conditions for validity.' },
      ]}
      figure={figure}
      steps={[
        { caption: "Hart's Postscript, his unfinished reply to critics, reads as a response to Dworkin. The social sources: legislation, judicial decisions, social customs." },
        { caption: 'They identify the existence and content of law without reference to morality — except where that law has itself incorporated moral criteria (CL 269). Does law necessarily set moral tests?' },
        { caption: 'Inclusive (Hart): a constitutional equality principle can invalidate a procedurally correct but discriminatory statute — in that system only. The connection is contingent.' },
        { caption: 'Exclusive (Raz): moral criteria are never conditions of legal validity. Once incorporated into the law, they become legal criteria; morality stays outside.' },
        { caption: 'Criticised as intramural, the debate began because the positivist camp recognised that Dworkin\'s criticisms had merit.' },
      ]}
      check={{
        question: 'A statute says "unfair contract terms are void". Why is an inclusive positivist still a positivist in applying it?',
        options: [
          { text: 'Because the moral test binds only because this system\'s social sources incorporated it', correct: true, why: 'The connection is contingent — made by this system — not a necessary connection between law and morality.' },
          { text: 'Because fairness is not really a moral idea', why: 'Inclusive positivism accepts that the criterion is moral; that is what distinguishes it from the exclusive view.' },
          { text: 'Because every legal system must contain such tests', why: 'That would be a necessary connection, which positivism denies.' },
        ],
      }}
    />
  );
}
