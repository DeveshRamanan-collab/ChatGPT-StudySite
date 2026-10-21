/*
SCENE: Rule of recognition vs basic norm — two columns sharing one job, split by four rows
LENGTH: 5 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: Both explain legal validity and the unity of a legal order; they part on fact vs presupposition, validity,
  content, and law and morals — underneath, validity as membership vs validity as binding force.
SUBJECT: the shared header bar, then each row splitting Hart (left) from Kelsen (right).
STEPS: 1 shared job · 2 fact vs presupposition · 3 neither valid nor invalid vs presupposed valid ·
  4 content varies vs always the same · 5 law and morals can conflict vs cannot; membership vs binding force.
REDUCED MOTION: the finished diagram with all five captions stacked.
BUDGET: < 8 KB gz. Two 164-unit columns on a 360-unit canvas; short lines so nothing overflows at phone width.
Source: concept laws2100-w03-recognition-vs-basic-norm; authorities hart-the-concept-of-law, kelsen-pure-theory-of-law.
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const head = { fontFamily: 'var(--font-ui)', fontSize: 12, letterSpacing: 1.2, fill: 'var(--ink)' } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 14, fill: 'var(--ink-2)' } as const;
const ROWS = [
  { label: 'EXISTENCE', hart: ['a social fact:', 'officials buy into it'], kelsen: ['a presupposition:', 'juristic hypothesis'] },
  { label: 'VALIDITY', hart: ['neither valid', 'nor invalid'], kelsen: ['presupposed', 'as valid'] },
  { label: 'CONTENT', hart: ['may differ by', 'jurisdiction'], kelsen: ['always the same;', 'only the first', 'constitution varies'] },
  { label: 'LAW AND MORALS', hart: ['can conflict'], kelsen: ['cannot both be', 'valid: no conflict'] },
];

const figure = (
  <svg viewBox={`0 0 ${W} 560`} role="img" aria-label="Hart's rule of recognition and Kelsen's basic norm share one job, then differ on existence, validity, content, and law and morals">
    <g data-step="1">
      <rect x="8" y="8" width={W - 16} height="44" rx="10" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x={W / 2} y="35" textAnchor="middle" {...head}>SHARED JOB: EXPLAIN LEGAL VALIDITY</text>
      <line x1="90" y1="52" x2="90" y2="68" stroke="var(--ink-3)" strokeWidth="1.5" />
      <line x1="270" y1="52" x2="270" y2="68" stroke="var(--ink-3)" strokeWidth="1.5" />
      <text x="90" y="86" textAnchor="middle" {...head} data-label="hart">HART</text>
      <text x="90" y="104" textAnchor="middle" {...body} fontSize={12}>rule of recognition</text>
      <text x="270" y="86" textAnchor="middle" {...head} data-label="kelsen">KELSEN</text>
      <text x="270" y="104" textAnchor="middle" {...body} fontSize={12}>basic norm</text>
    </g>
    {ROWS.map((r, i) => {
      const y = 124 + i * 96;
      return (
        <g key={r.label} data-step={i + 2}>
          <line x1="8" y1={y} x2={W - 8} y2={y} stroke="var(--ink-3)" strokeWidth="1" />
          <text x={W / 2} y={y + 20} textAnchor="middle" {...head} fontSize={11} fill="var(--ink-2)">{r.label}</text>
          {r.hart.map((l, k) => <text key={k} x="90" y={y + 46 + k * 19} textAnchor="middle" {...body} fill="var(--ink)">{l}</text>)}
          {r.kelsen.map((l, k) => <text key={k} x="270" y={y + 46 + k * 19} textAnchor="middle" {...body} fill="var(--ink)">{l}</text>)}
        </g>
      );
    })}
    <g data-step="5">
      <rect x="8" y="508" width={W - 16} height="44" rx="10" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="6 6" />
      <text x="90" y="535" textAnchor="middle" {...body} fontSize={13}>validity = membership</text>
      <text x="270" y="535" textAnchor="middle" {...body} fontSize={13}>validity = binding force</text>
    </g>
  </svg>
);

export default function RecognitionVsBasicNorm() {
  return (
    <Diagram
      label="Hart's rule of recognition and Kelsen's basic norm: one job, four differences"
      terms={[
        { term: 'Rule of recognition', def: "Hart: a real social rule whose existence is a complex, empirical question of fact." },
        { term: 'Basic norm', def: 'Kelsen: a "juristic hypothesis", a "postulated ultimate rule", a "fiction" — presupposed.' },
        { term: 'Unity of a legal order', def: 'What both are meant to explain, alongside legal validity.' },
      ]}
      figure={figure}
      steps={[
        { caption: "In Kelsen's theory the basic norm performs the same function as Hart's rule of recognition: each explains legal validity and the unity of a legal order." },
        { caption: 'Fact or presupposition: the rule of recognition exists if officials buy into it; the basic norm is presupposed, not part of the legal order.' },
        { caption: 'Validity: a jurist must presuppose the validity of the basic norm; the rule of recognition is neither valid nor invalid.' },
        { caption: 'Content: the basic norm always says the same ("who laid down the first constitution ought to be obeyed"); rules of recognition may differ between jurisdictions.' },
        { caption: 'Hart chose the name to avoid Kelsen\'s view that a legal and a moral norm cannot both be valid at once (CL 293). Underneath: membership versus binding force.' },
      ]}
      check={{
        question: 'Which statement fits Hart\'s rule of recognition but not Kelsen\'s basic norm?',
        options: [
          { text: 'It explains legal validity', why: 'Both do that — it is the job they share.' },
          { text: 'Its existence is a question of social fact', correct: true, why: 'For Hart it is a real social rule that exists if officials buy into it; the basic norm is presupposed, not a fact.' },
          { text: 'It is presupposed as valid', why: 'That is Kelsen: the jurist presupposes the basic norm\'s validity. Hart says his rule is neither valid nor invalid.' },
        ],
      }}
    />
  );
}
