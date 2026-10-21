/*
SCENE: Raz and Finnis on legal reasoning — the expected labels cross over
LENGTH: 5 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: You would expect the positivist to call legal reasoning technical and the natural lawyer to call it moral;
  the reverse is true, which shows specific claims are separable from general theories of law.
SUBJECT: the two crossing arrows from the expected labels to the actual ones.
STEPS: 1 two columns: Raz (positivist), Finnis (natural law) · 2 expected labels, faint · 3 actual labels, crossing
  arrows · 4 dotted line: specific claim vs general theory · 5 the real problem: different in kind?
REDUCED MOTION: the finished diagram with all five captions stacked.
BUDGET: < 6 KB gz. Two 164-unit columns on a 360-unit canvas.
Source: concept laws2100-w07-raz-and-finnis-on-legal-reasoning (no linked authorities).
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const head = { fontFamily: 'var(--font-ui)', fontSize: 11, letterSpacing: 1.2, fill: 'var(--ink)' } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 13, fill: 'var(--ink)' } as const;
const lines = (x: number, y: number, ls: string[], fill = 'var(--ink)') => ls.map((l, i) => <text key={i} x={x} y={y + i * 18} textAnchor="middle" {...body} fill={fill}>{l}</text>);

const figure = (
  <svg viewBox={`0 0 ${W} 500`} role="img" aria-label="Raz the positivist calls legal reasoning moral; Finnis the natural lawyer calls it technical — the reverse of what you might expect">
    <g data-step="1">
      <rect x="8" y="8" width="164" height="54" rx="10" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="90" y="32" textAnchor="middle" {...head} data-label="raz">RAZ</text>
      <text x="90" y="50" textAnchor="middle" {...body} fontSize={12} fill="var(--ink-2)">legal positivist</text>
      <rect x="188" y="8" width="164" height="54" rx="10" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="270" y="32" textAnchor="middle" {...head} data-label="finnis">FINNIS</text>
      <text x="270" y="50" textAnchor="middle" {...body} fontSize={12} fill="var(--ink-2)">natural law</text>
    </g>
    <g data-step="2">
      <text x={W / 2} y="92" textAnchor="middle" {...head} fontSize={10} fill="var(--ink-3)">EXPECTED</text>
      <rect x="40" y="102" width="100" height="30" rx="15" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="4 4" />
      <text x="90" y="122" textAnchor="middle" {...body} fill="var(--ink-3)">technical</text>
      <rect x="220" y="102" width="100" height="30" rx="15" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="4 4" />
      <text x="270" y="122" textAnchor="middle" {...body} fill="var(--ink-3)">moral</text>
    </g>
    <g data-step="3">
      <path d="M140 124 L230 180 M221 180 L230 180 L225 172 M220 124 L130 180 M139 180 L130 180 L135 172" fill="none" stroke="var(--ink-2)" strokeWidth="1.5" />
      <text x={W / 2} y="200" textAnchor="middle" {...head} fontSize={10} fill="var(--ink-2)">ACTUAL</text>
      <rect x="40" y="186" width="100" height="30" rx="15" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="90" y="206" textAnchor="middle" {...body}>moral</text>
      <rect x="220" y="186" width="100" height="30" rx="15" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="270" y="206" textAnchor="middle" {...body}>technical</text>
      {lines(90, 242, ['"an instance of', 'moral reasoning"'])}
      {lines(270, 242, ['"at least in large', 'part not moral"'])}
    </g>
    <g data-step="4">
      <line x1="8" y1="300" x2={W - 8} y2="300" stroke="var(--ink-2)" strokeWidth="1.5" strokeDasharray="2 5" />
      <text x="8" y="290" {...head} fontSize={10} fill="var(--ink-2)">SPECIFIC CLAIM ABOUT LEGAL REASONING</text>
      <text x="8" y="320" {...head} fontSize={10} fill="var(--ink-2)">GENERAL THEORY OF LAW</text>
      {lines(90, 346, ['law depends on', 'social facts'], 'var(--ink-2)')}
      {lines(270, 346, ['social facts +', 'moral standards'], 'var(--ink-2)')}
    </g>
    <g data-step="5">
      <rect x="8" y="396" width={W - 16} height="94" rx="12" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="6 6" />
      <text x="22" y="420" {...head} fill="var(--ink-2)">THE REAL PROBLEM</text>
      <text x="22" y="444" {...body}>is legal reasoning different in kind</text>
      <text x="22" y="463" {...body}>from other practical reasoning —</text>
      <text x="22" y="482" {...body}>reasoning geared towards a decision?</text>
    </g>
  </svg>
);

export default function RazAndFinnisOnLegalReasoning() {
  return (
    <Diagram
      label="Raz and Finnis on legal reasoning: the expected camps reversed"
      terms={[
        { term: 'Autonomy of legal reasoning', def: 'The thesis Raz rejects in its strong form: that legal reasoning is not moral reasoning.' },
        { term: 'Technical reasoning', def: "Finnis: legal reasoning's reliance on authoritative sources rather than open moral argument." },
        { term: 'Practical reasoning', def: 'Reasoning geared towards action — in law, a decision.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'Raz is a legal positivist; Finnis a natural law thinker.' },
        { caption: 'You might expect the positivist to call legal reasoning technical, and the natural law thinker to call it moral.' },
        { caption: 'The reverse is true. Raz: "Legal reasoning is an instance of moral reasoning" — courts follow their system\'s principles, "moral principles, though they may be mistaken". Finnis: "technical reasoning, at least in large part not moral reasoning".' },
        { caption: 'Lesson one: specific claims defended by specific arguments are separable (though not disconnected) from an author\'s general view of the nature of law.' },
        { caption: 'Lesson two: the real problem is whether legal reasoning is different in kind from other practical reasoning. Finnis\'s view fits his criticism of the one right answer thesis.' },
      ]}
      check={{
        question: 'What does the Raz–Finnis reversal teach about exam answers on legal reasoning?',
        options: [
          { text: "You can read off an author's view of legal reasoning from their theory of law", why: 'The reversal shows the opposite: the positivist calls it moral, the natural lawyer technical.' },
          { text: 'Zoom in on the specific claim and its argument, then ask how far it follows from the general theory', correct: true, why: 'Specific claims are separable, though not disconnected, from an author\'s general view.' },
          { text: 'Positivists and natural lawyers agree on everything about legal reasoning', why: 'They differ — just not in the direction you would expect.' },
        ],
      }}
    />
  );
}
