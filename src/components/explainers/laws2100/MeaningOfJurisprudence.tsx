/*
SCENE: One word, four uses; legal theory forks into general and particular
LENGTH: 4 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: 'Jurisprudence' has several meanings; ours is legal theory, which forks into general jurisprudence (puzzles of
  all legal systems) and particular jurisprudence (puzzles of some), joined because they are not disconnected.
SUBJECT: the legal-theory branch, the one that carries on down the page.
STEPS: 1 the word (iuris + prudentia) · 2 four uses · 3 fork: general / particular · 4 dotted join.
REDUCED MOTION: the finished diagram with all four captions stacked.
BUDGET: < 8 KB gz. A vertical tree on a 360-unit canvas.
Source: concept laws2100-w01-meaning-of-jurisprudence; authority bix-jurisprudence-theory-and-context.
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const head = { fontFamily: 'var(--font-ui)', fontSize: 12, letterSpacing: 1.2, fill: 'var(--ink)' } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 14, fill: 'var(--ink-2)' } as const;
const USES = ['a body of judicial decisions', 'religious law (halakha, sharia…)', 'medical jurisprudence', 'legal theory — ours'];

function Fork({ x, title, lines, id }: { x: number; title: string; lines: string[]; id: string }) {
  return (
    <>
      <rect x={x} y="330" width="164" height="128" rx="12" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x={x + 12} y="354" {...head} data-label={id}>{title}</text>
      {lines.map((l, i) => <text key={i} x={x + 12} y={378 + i * 19} {...body}>{l}</text>)}
    </>
  );
}

const figure = (
  <svg viewBox={`0 0 ${W} 520`} role="img" aria-label="Jurisprudence splits into four uses; legal theory forks into general and particular jurisprudence, joined by a dotted line">
    <g data-step="1">
      <text x={W / 2} y="26" textAnchor="middle" {...head} fontSize={14}>JURISPRUDENCE</text>
      <text x={W / 2} y="48" textAnchor="middle" {...body}>iuris (of law) + prudentia (wisdom)</text>
      <line x1="30" y1="62" x2="30" y2="254" stroke="var(--ink-3)" strokeWidth="1.5" />
    </g>
    <g data-step="2">
      {USES.map((u, i) => (
        <g key={u}>
          <line x1="30" y1={90 + i * 52} x2="48" y2={90 + i * 52} stroke="var(--ink-3)" strokeWidth="1.5" />
          <rect x="48" y={72 + i * 52} width={W - 56} height="36" rx="10" fill="none" stroke={i === 3 ? 'var(--ink)' : 'var(--ink-3)'} strokeWidth="1.5" />
          <text x="62" y={95 + i * 52} {...body} fill={i === 3 ? 'var(--ink)' : 'var(--ink-2)'}>{u}</text>
        </g>
      ))}
    </g>
    <g data-step="3">
      <path d="M 200 264 V 290 M 94 290 H 270 M 94 290 V 330 M 270 290 V 330" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <Fork id="general" x={12} title="GENERAL" lines={['puzzles of all', 'legal systems:', 'what is law? what', 'is a legal system?']} />
      <Fork id="particular" x={188} title="PARTICULAR" lines={['puzzles of some', 'systems: in what', 'sense is Parliament', 'sovereign?']} />
    </g>
    <g data-step="4">
      <line x1="176" y1="394" x2="188" y2="394" stroke="var(--ink)" strokeWidth="1.5" strokeDasharray="2 3" />
      <text x={W / 2} y="488" textAnchor="middle" {...body}>not disconnected: law in general is</text>
      <text x={W / 2} y="508" textAnchor="middle" {...body}>thought through knowledge of specific laws</text>
    </g>
  </svg>
);

export default function MeaningOfJurisprudence() {
  return (
    <Diagram
      label="What jurisprudence means: four uses, and legal theory's fork into general and particular jurisprudence"
      terms={[
        { term: 'Iurisprudentia', def: 'Iuris (of right, of law) + prudentia (wisdom, foresight, knowledge).' },
        { term: 'General jurisprudence', def: 'Philosophical puzzles thrown up by all legal systems: what is law? what is a legal system?' },
        { term: 'Particular jurisprudence', def: 'Puzzles that emerge in some legal systems or traditions but not necessarily all.' },
      ]}
      figure={figure}
      steps={[
        { caption: "The word has more than one meaning: iuris (of right, of law) + prudentia (wisdom, foresight, knowledge)." },
        { caption: "It can mean a body of judicial decisions ('the constitutional jurisprudence of the High Court'), religious law, or legal medicine. For our purposes: legal theory — a general theory of law." },
        { caption: 'General jurisprudence takes law in general as its object. Particular jurisprudence asks questions that only make sense in some systems — no parliamentary sovereignty, no question about it.' },
        { caption: 'The distinction is rough: we cannot think about law in general without our knowledge of specific laws. Say early which kind your question is — it fixes what counts as evidence.' },
      ]}
      check={{
        question: '"What is common about the common law?" — which kind of jurisprudence asks this?',
        options: [
          { text: 'General jurisprudence', why: 'Tempting because it is abstract, but it concerns one tradition, not puzzles thrown up by all legal systems.' },
          { text: 'Particular jurisprudence', correct: true, why: 'It is a puzzle that emerges in some legal systems or traditions but not necessarily all.' },
          { text: 'Medical jurisprudence', why: 'Medical jurisprudence is legal medicine — a different use of the word altogether.' },
        ],
      }}
    />
  );
}
