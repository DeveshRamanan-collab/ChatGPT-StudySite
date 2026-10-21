/*
SCENE: The separation of law and morals — overlap in fact, two blocked inferences, one gate
LENGTH: 4 screens pinned (desktop, full motion); 4 paced beats otherwise
BEATS: 4
INTENT: Law and morality overlap as a matter of historical fact, but the separation thesis blocks two inferences
  (immoral → not law; morally desirable → law) unless an express constitutional or legal provision lets morality in.
SUBJECT: the two blocked arrows.
BEAT 1 (0–25%): two circles slide into overlap (translate, scrubbed, ease none); "often, as a matter of fact".
BEAT 2 (25–50%): arrow 1 — violates morality ⇏ not law. BEAT 3 (50–75%): arrow 2 — morally desirable ⇏ law.
BEAT 4 (75–100%): the gate — an express constitutional or legal provision; no necessary connection, not no connection.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: final frame with all four captions stacked (base).
BUDGET: < 6 KB gz. Transform and opacity only.
Source: concept laws2100-w03-separation-of-law-and-morals; authorities green-adams-legal-positivism,
  austin-province-of-jurisprudence-determined, hart-the-concept-of-law, hart-positivism-and-the-separation-of-law-and-morals.
*/
import { ScrollExplainer } from '../bases/ScrollExplainer';

const W = 360;
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const head = { fontFamily: 'var(--font-ui)', fontSize: 12, letterSpacing: 1.2, fill: 'var(--ink)' } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 14, fill: 'var(--ink-2)' } as const;

function Blocked({ y, from, to }: { y: number; from: string; to: string }) {
  return (
    <>
      <text x="16" y={y + 5} {...body} fill="var(--ink)">{from}</text>
      <line x1="160" y1={y} x2="220" y2={y} stroke="var(--ink-3)" strokeWidth="1.5" />
      <polyline points={`213,${y - 6} 220,${y} 213,${y + 6}`} fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
      <line x1="182" y1={y + 9} x2="198" y2={y - 9} stroke="var(--ink)" strokeWidth="2" />
      <text x="232" y={y + 5} {...body} fill="var(--ink)">{to}</text>
    </>
  );
}

function scene(t: number) {
  const on = (i: number) => clamp((t - i) * 3 + 0.25);
  const meet = 30 * (1 - clamp(t * 1.4));
  return (
    <svg viewBox={`0 0 ${W} 440`} role="img" aria-label="Law and morality overlap; two inferences are blocked; morality enters law only through an express provision">
      <g opacity={on(0)}>
        <circle cx="130" cy="96" r="78" fill="none" stroke="var(--ink)" strokeWidth="1.5" transform={`translate(${-meet} 0)`} />
        <circle cx="230" cy="96" r="78" fill="none" stroke="var(--ink-2)" strokeWidth="1.5" transform={`translate(${meet} 0)`} />
        <text x="90" y="100" textAnchor="middle" {...head}>LAW</text>
        <text x="270" y="100" textAnchor="middle" {...head}>MORALITY</text>
        <text x={W / 2} y="196" textAnchor="middle" {...body} fontSize={12}>overlap: often so, as a matter of historical fact</text>
      </g>
      <g opacity={on(1)}><Blocked y={236} from="violates morality" to="not law" /></g>
      <g opacity={on(2)}><Blocked y={276} from="morally desirable" to="law" /></g>
      <g opacity={on(3)}>
        <rect x="8" y="306" width={W - 16} height="126" rx="12" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="6 6" />
        <text x="24" y="330" {...head}>THE GATE</text>
        <text x="300" y="360" textAnchor="middle" {...body}>morality</text>
        <line x1="266" y1="356" x2="96" y2="356" stroke="var(--ink)" strokeWidth="1.5" />
        <polyline points="103,350 96,356 103,362" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
        <text x="60" y="360" textAnchor="middle" {...body}>law</text>
        <line x1="170" y1="342" x2="170" y2="348" stroke="var(--ink)" strokeWidth="4" strokeLinecap="round" />
        <line x1="170" y1="364" x2="170" y2="370" stroke="var(--ink)" strokeWidth="4" strokeLinecap="round" />
        <text x="24" y="394" {...body}>only through an express constitutional</text>
        <text x="24" y="413" {...body}>or legal provision</text>
      </g>
    </svg>
  );
}

export default function SeparationOfLawAndMorals() {
  return (
    <ScrollExplainer
      label="The separation of law and morals: overlap in fact, two blocked inferences and one gate"
      terms={[
        { term: 'Legal positivism', def: '"The existence and content of law depends on social facts and not on its merits" (Green and Adams).' },
        { term: 'Law as it is / as it ought to be', def: 'The distinction defended by Bentham, Austin and Hart.' },
        { term: 'Necessary connection', def: 'A link that must hold in every legal system — what separation denies.' },
      ]}
      beats={[
        { caption: '"It is in no sense a necessary truth that laws reproduce or satisfy certain demands of morality, though in fact they have often done so" (CL 185–186).' },
        { caption: 'First simple thing: absent an express provision, a rule\'s violating morality does not show it is not law. "The existence of law is one thing; its merit and demerit another" (Austin).' },
        { caption: 'Second: a rule\'s being morally desirable does not show it is law.' },
        { caption: 'Bentham never denied that moral principles might enter a legal system through explicit legal provisions. Separation denies a necessary connection, not every connection.' },
      ]}
      scene={scene}
      check={{
        question: 'Suppose a statute expressly makes contracts contrary to good conscience void. Does applying that moral test contradict the separation thesis?',
        options: [
          { text: 'Yes — morality is now deciding what the law is', why: 'Morality enters here through an express legal provision, which Bentham and Austin never denied.' },
          { text: 'No — the thesis denies only a necessary connection, and this one is made by express provision', correct: true, why: 'The two simple things apply "absent an express constitutional or legal provision".' },
          { text: 'No — because the statute is not really law', why: 'Nothing suggests the statute is invalid; its moral content does not affect its status as law.' },
        ],
      }}
    />
  );
}
