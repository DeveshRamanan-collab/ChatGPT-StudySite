/*
SCENE: Lex iniusta non est lex — one maxim forks into a strong and a weak thesis
LENGTH: 5 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: "An unjust law is not a law" can mean not legally valid (strong; Radbruch: only extremely unjust) or not law in
  its central case (weak; Finnis), and Finnis's four senses of "obligation to obey" show where injustice bites.
SUBJECT: the fork, then the four stacked senses, then the central-case axis.
STEPS: 1 the maxim · 2 strong branch · 3 weak branch · 4 four senses of obligation · 5 axis central case → periphery.
REDUCED MOTION: the finished diagram with all five captions stacked.
BUDGET: < 7 KB gz. Two 164-unit columns and full-width layers on a 360-unit canvas.
Source: concept laws2100-w04-lex-iniusta-strong-and-weak; authority finnis-natural-law-and-natural-rights.
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const head = { fontFamily: 'var(--font-ui)', fontSize: 12, letterSpacing: 1.2, fill: 'var(--ink)' } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 13, fill: 'var(--ink)' } as const;
const SENSES = ['empirical liability to sanction', 'legal obligation, intra-systemic', 'legal obligation in the moral sense', 'moral obligation not from legality'];
const lines = (x: number, y: number, ls: string[], fill = 'var(--ink)') => ls.map((l, i) => <text key={i} x={x} y={y + i * 18} {...body} fill={fill}>{l}</text>);

const figure = (
  <svg viewBox={`0 0 ${W} 570`} role="img" aria-label="The maxim forks into the strong thesis (not legally valid) and the weak thesis (not law in its central case); four senses of obligation; an axis from central case to periphery">
    <g data-step="1">
      <rect x="8" y="8" width={W - 16} height="56" rx="10" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x={W / 2} y="30" textAnchor="middle" {...head}>LEX INIUSTA NON EST LEX</text>
      <text x={W / 2} y="52" textAnchor="middle" {...body} fill="var(--ink-2)">an unjust law is not a law</text>
    </g>
    <g data-step="2">
      <path d="M180 64 L90 96" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
      <rect x="8" y="96" width="164" height="160" rx="12" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="20" y="120" {...head} data-label="strong">STRONG</text>
      {lines(20, 144, ['not legally valid', 'a claim about each', 'and every unjust law'])}
      {lines(20, 214, ['Radbruch: only', 'extremely unjust'], 'var(--ink-2)')}
    </g>
    <g data-step="3">
      <path d="M180 64 L270 96" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
      <rect x="188" y="96" width="164" height="160" rx="12" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="200" y="120" {...head} data-label="weak">WEAK · FINNIS</text>
      {lines(200, 144, ['not law in its', 'central case', 'morally and legally', 'defective — not', 'legally invalid'])}
    </g>
    <g data-step="4">
      <text x="8" y="286" {...head} fill="var(--ink-2)">"OBEY THE LAW": FOUR SENSES</text>
      {SENSES.map((s, i) => (
        <g key={s}>
          <rect x="8" y={298 + i * 50} width={W - 16} height="42" rx="8" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
          <text x="22" y={324 + i * 50} {...body} fontFamily="var(--font-mono)" fontSize={12} fill="var(--ink-2)">{i + 1}</text>
          <text x="42" y={324 + i * 50} {...body}>{s}</text>
        </g>
      ))}
    </g>
    <g data-step="5">
      <line x1="16" y1="514" x2={W - 16} y2="514" stroke="var(--ink-2)" strokeWidth="1.5" />
      <circle cx="16" cy="514" r="5" fill="var(--ink)" stroke="var(--ink)" strokeWidth="1" />
      <circle cx="220" cy="514" r="4" fill="none" stroke="var(--ink-2)" strokeWidth="1.5" />
      <circle cx="320" cy="514" r="4" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
      <text x="8" y="540" {...body}>central case</text>
      <text x={W - 8} y="540" textAnchor="end" {...body}>periphery</text>
      <text x={W / 2} y="562" textAnchor="middle" {...body} fontSize={12} fill="var(--ink-2)">the more unjust, the more peripheral</text>
    </g>
  </svg>
);

export default function LexIniustaStrongAndWeak() {
  return (
    <Diagram
      label="Lex iniusta non est lex: the strong and weak natural law theses and four senses of obligation"
      terms={[
        { term: 'Lex iniusta non est lex', def: 'An unjust law is not a law.' },
        { term: 'Strong thesis', def: 'Moral soundness is a necessary element of legal validity.' },
        { term: 'Weak thesis', def: 'Unjust "laws" are not laws in the true sense of the word (Finnis).' },
      ]}
      figure={figure}
      steps={[
        { caption: 'Lex iniusta non est lex. The key question is how injustice affects the obligation to obey the law.' },
        { caption: 'Strong thesis: unjust "laws" are not legally valid — a claim about each and every unjust law. For some (eg Gustav Radbruch) only extremely unjust "laws" are not valid.' },
        { caption: 'Weak thesis (Finnis): unjust "laws" are morally and legally defective, not law in their central case or focal meaning — but that is not to say they are legally invalid.' },
        { caption: "Finnis's four senses of 'the obligation to obey the law': sanction, intra-systemic legal obligation, legal obligation in the moral sense, and moral obligation not deriving from legality." },
        { caption: 'An unfaithful friend is not a friend; a fallacious argument is still an argument, but not properly one. The more unjust a system, the more peripheral it is to the central case.' },
      ]}
      check={{
        question: 'A critic shows that courts routinely enforce unjust statutes as valid. Whose thesis does this damage?',
        options: [
          { text: 'The strong thesis', correct: true, why: 'It claims unjust laws are not legally valid; enforcement as valid law is evidence against that.' },
          { text: "Finnis's weak thesis", why: 'Finnis never says unjust laws are legally invalid — only that they are defective, not law in the central case. Attacking the strong thesis does not touch him.' },
          { text: 'Both equally', why: 'The theses make different claims; always say which one a writer holds.' },
        ],
      }}
    />
  );
}
