/*
SCENE: The Speluncean Explorers — § 12-A as a line, the judges placed by their distance from the text
LENGTH: 5 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: Each judge's distance from the words of § 12-A voices a theory of law and of the judicial office: on the
  text (Truepenny, Keen), its purpose (Foster 2), outside it (Foster 1), stepping back (Tatting), practical wisdom (Handy).
SUBJECT: the dots moving further from the statute line, row by row.
STEPS: 1 the facts and § 12-A · 2 on the text: Truepenny CJ, Keen J · 3 purpose: Foster J (second argument) ·
  4 outside the law: Foster J (first argument); Tatting J withdraws · 5 Handy J: common sense and public opinion.
REDUCED MOTION: the finished diagram with all five captions stacked.
BUDGET: < 7 KB gz. Labels right of each dot, ≤ 28 characters a line, on a 360-unit canvas.
Source: concept laws2100-w07-speluncean-explorers-five-options; authority fuller-the-case-of-the-speluncean-explorers.
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const head = { fontFamily: 'var(--font-ui)', fontSize: 11, letterSpacing: 1.2, fill: 'var(--ink)' } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 13, fill: 'var(--ink)' } as const;
const X = 28;
const JUDGES = [
  { step: 2, d: 0, name: 'TRUEPENNY CJ', ls: ['apply § 12-A; clemency', 'can mitigate'] },
  { step: 2, d: 0, name: 'KEEN J', ls: ['plain meaning: its scope,', 'not its conjectural purpose'] },
  { step: 3, d: 40, name: 'FOSTER J (2)', ls: ['purpose: an implicit', 'exception, like self-defence'] },
  { step: 4, d: 80, name: 'FOSTER J (1)', ls: ['outside the law:', 'a state of nature'] },
  { step: 4, d: 40, name: 'TATTING J', ls: ['many purposes;', 'withdraws'], dashed: true },
  { step: 5, d: 80, name: 'HANDY J', ls: ['practical wisdom;', 'public opinion'] },
];

const figure = (
  <svg viewBox={`0 0 ${W} 560`} role="img" aria-label="The statute as a vertical line; Truepenny and Keen on it, Foster's purpose argument near it, Foster's state of nature and Handy further out, Tatting withdrawing">
    <g data-step="1">
      <rect x="8" y="8" width={W - 16} height="78" rx="10" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="20" y="30" {...head}>§ 12-A</text>
      <text x="20" y="52" {...body}>"Whoever shall willfully take the life of</text>
      <text x="20" y="72" {...body}>another shall be punished by death."</text>
      <line x1={X} y1="86" x2={X} y2="548" stroke="var(--ink)" strokeWidth="2" />
      <text x={X + 8} y="108" {...body} fontSize={12} fill="var(--ink-2)">the text →  further from it</text>
    </g>
    {JUDGES.map((j, i) => {
      const y = 140 + i * 70;
      const cx = X + j.d;
      return (
        <g key={j.name} data-step={j.step}>
          {j.d > 0 && <line x1={X} y1={y} x2={cx - 6} y2={y} stroke="var(--ink-3)" strokeWidth="1" strokeDasharray="3 4" />}
          <circle cx={cx} cy={y} r="6" fill={j.dashed ? 'none' : 'var(--ink)'} stroke="var(--ink)" strokeWidth="1.5" strokeDasharray={j.dashed ? '2 2' : undefined} />
          <text x={cx + 14} y={y + 4} {...head} data-label={`judge-${i}`}>{j.name}</text>
          {j.ls.map((l, k) => <text key={k} x={cx + 14} y={y + 24 + k * 17} {...body} fill="var(--ink-2)">{l}</text>)}
        </g>
      );
    })}
  </svg>
);

export default function SpelunceanExplorersFiveOptions() {
  return (
    <Diagram
      label="The Speluncean Explorers: five options on § 12-A, placed by distance from the text"
      terms={[
        { term: '§ 12-A', def: '"Whoever shall willfully take the life of another shall be punished by death."' },
        { term: 'Cessante ratione legis, cessat et ipsa lex', def: 'When the reason for a law ceases, the law itself ceases.' },
        { term: 'Intelligent fidelity', def: "Foster: keeping faith with a law's purpose, not only its letter." },
      ]}
      figure={figure}
      steps={[
        { caption: "Fuller's imaginary case (1949): four explorers trapped in a cave for 32 days killed and ate Roger Whetmore on day 23; convicted, they are sentenced to hang." },
        { caption: 'On the text: Truepenny CJ applies § 12-A regardless of results, leaving clemency to mitigate. Keen J, putting clemency and moral judgment aside: the supremacy of the legislature requires plain meaning.' },
        { caption: 'Foster J (second argument): "A man may break the letter of the law without breaking the law itself" — by analogy with self-defence, an implicit exception; "intelligent and unintelligent fidelity".' },
        { caption: 'Foster J (first argument): positive law is predicated on a human society; the men were in a state of nature. Tatting J: more than one purpose, an exception of uncertain scope — he withdraws.' },
        { caption: 'Handy J: practical wisdom; forms and abstract concepts are instruments; common sense and public opinion. Fuller: "divergent philosophies of law and government".' },
      ]}
      check={{
        question: 'Which judge reads § 12-A in the light of its purpose, finding an implicit exception?',
        options: [
          { text: 'Keen J', why: 'Keen insists the question is "not the conjectural purpose of the rule, but its scope".' },
          { text: 'Foster J, in his second argument', correct: true, why: 'By analogy with self-defence: one may break the letter of the law without breaking the law itself.' },
          { text: 'Handy J', why: 'Handy turns to practical wisdom, common sense and public opinion, not the statute\'s purpose.' },
        ],
      }}
    />
  );
}
