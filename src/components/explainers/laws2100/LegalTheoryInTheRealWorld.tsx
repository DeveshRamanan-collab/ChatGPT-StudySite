/*
SCENE: Legal theory in the courtroom — three theories, three cases, one return arrow
LENGTH: 4 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: Concepts from legal theory filter back into judicial reasoning (Austin → Milirrpum, Kelsen → Madzimbamuto,
  Hart → Miller), and legal knowledge puts pressure back on the theories.
SUBJECT: the arrow from each theory into its case.
STEPS: 1 Austin → Milirrpum · 2 Kelsen → Madzimbamuto · 3 Hart → Miller · 4 return arrow: pressure on the theories.
REDUCED MOTION: the finished diagram with all four captions stacked.
BUDGET: < 8 KB gz. Rows stacked vertically on a 360-unit canvas.
Source: concept laws2100-w01-legal-theory-in-the-real-world; case cards milirrpum-v-nabalco-pty-ltd,
  madzimbamuto-v-lardner-burke, r-miller-v-secretary-of-state-for-exiting-the-european-union.
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const head = { fontFamily: 'var(--font-ui)', fontSize: 12, letterSpacing: 1.2, fill: 'var(--ink)' } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 14, fill: 'var(--ink-2)' } as const;

function Row({ y, theory, kase, lines, id }: { y: number; theory: string; kase: string; lines: string[]; id: string }) {
  return (
    <>
      <rect x="28" y={y} width="92" height="40" rx="10" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="74" y={y + 25} textAnchor="middle" {...head}>{theory}</text>
      <line x1="120" y1={y + 20} x2="166" y2={y + 20} stroke="var(--ink)" strokeWidth="1.5" />
      <polyline points={`159,${y + 14} 166,${y + 20} 159,${y + 26}`} fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="176" y={y + 25} {...body} fill="var(--ink)" fontStyle="italic" data-label={id}>{kase}</text>
      {lines.map((l, i) => <text key={i} x="176" y={y + 48 + i * 19} {...body}>{l}</text>)}
    </>
  );
}

const figure = (
  <svg viewBox={`0 0 ${W} 470`} role="img" aria-label="Austin to Milirrpum, Kelsen to Madzimbamuto, Hart to Miller, and a return arrow from legal knowledge to the theories">
    <g data-step="1"><Row id="milirrpum" y={8} theory="AUSTIN" kase="Milirrpum (1971)" lines={['Aboriginal customary', 'rules not described', 'as legal rules']} /></g>
    <g data-step="2"><Row id="madzimbamuto" y={118} theory="KELSEN" kase="Madzimbamuto (1969)" lines={["legality of Rhodesia's", '1965 declaration of', 'independence']} /></g>
    <g data-step="3"><Row id="miller" y={228} theory="HART" kase="Miller (2017)" lines={['the rule of recognition:', 'the sources of law [173]']} /></g>
    <g data-step="4">
      <path d="M 14 350 V 28 M 14 138 H 26 M 14 248 H 26 M 14 28 H 26" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="4 4" />
      <rect x="8" y="350" width={W - 16} height="110" rx="12" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="6 6" />
      <text x="24" y="374" {...head}>THE RETURN ARROW</text>
      <text x="24" y="398" {...body}>use your legal knowledge to put</text>
      <text x="24" y="417" {...body}>pressure on the theories — look for</text>
      <text x="24" y="436" {...body}>timeless problems under topical ones</text>
    </g>
  </svg>
);

export default function LegalTheoryInTheRealWorld() {
  return (
    <Diagram
      label="Legal theory in the real world: Austin, Kelsen and Hart in three cases, and a return arrow"
      terms={[
        { term: 'Legal theory', def: 'A general theory of law whose concepts judges use, more or less explicitly, to decide cases.' },
        { term: 'Rule of recognition', def: '"The rule which identifies the sources of law in our legal system" (Miller [173]).' },
        { term: "'Default setting'", def: "Green: legal philosophy offers an escape from the default setting of your own little legal system." },
      ]}
      figure={figure}
      steps={[
        { caption: 'Milirrpum v Nabalco (the Gove land rights case): Aboriginal claims were questioned because customary rules could not be described as legal rules — assumptions from Austin. You cannot fully understand Mabo without it.' },
        { caption: "Madzimbamuto v Lardner-Burke: the Privy Council considered the legality of Rhodesia's 1965 Unilateral Declaration of Independence in light of Kelsen's theory." },
        { caption: "Miller (UK Supreme Court): could the Government withdraw from the EU without an Act of Parliament? The Court used Hart's rule of recognition." },
        { caption: 'The traffic runs both ways. Gardner: jurisprudence builds excellence in argument and looks for timeless problems underlying topical ones. Green: it shows how things are here versus how they ought to be.' },
      ]}
      check={{
        question: "Which case drew on Hart's rule of recognition?",
        options: [
          { text: 'Milirrpum v Nabalco', why: "Milirrpum rested on assumptions from Austin's theory about what counts as a legal rule." },
          { text: 'Madzimbamuto v Lardner-Burke', why: "The Privy Council there looked to Kelsen's theory to assess the legality of the declaration of independence." },
          { text: 'Miller', correct: true, why: 'The UK Supreme Court used the rule of recognition — "the rule which identifies the sources of law" [173].' },
        ],
      }}
    />
  );
}
