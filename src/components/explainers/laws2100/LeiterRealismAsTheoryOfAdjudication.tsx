/*
SCENE: Leiter — realism moved off positivism's map onto a layer of its own
LENGTH: 4 screens pinned (desktop, full motion); 4 paced beats otherwise
BEATS: 4
INTENT: Hart read realism as a rival theory of law; Leiter relocates it as a descriptive theory of adjudication, where
  Hart's arguments (aimed at conceptual scepticism) miss, and whose indeterminacy arguments presuppose positivism.
SUBJECT: the realism card, sliding from the theory-of-law layer to the adjudication layer.
BEAT 1 (0–25%): both cards on one layer — Hart's reading. BEAT 2 (25–50%): realism slides down (translateY, scrubbed,
  ease none) to "theory of adjudication". BEAT 3 (50–75%): Hart's arrows strike the conceptual layer; the empirical
  layer is untouched. BEAT 4 (75–100%): a dashed link — realist indeterminacy presupposes positivist criteria of legality.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: final frame with all four captions stacked (base).
BUDGET: < 6 KB gz. Transform and opacity only.
Source: concept laws2100-w06-leiter-realism-as-theory-of-adjudication; authority
  leiter-legal-realism-and-legal-positivism-reconsidered.
*/
import { ScrollExplainer } from '../bases/ScrollExplainer';

const W = 360;
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const head = { fontFamily: 'var(--font-ui)', fontSize: 11, letterSpacing: 1.2, fill: 'var(--ink)' } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 13, fill: 'var(--ink)' } as const;

function Card({ x, title, ls }: { x: number; title: string; ls: string[] }) {
  return (
    <>
      <rect x={x} y="40" width="156" height="96" rx="10" fill="var(--paper)" stroke="var(--ink)" strokeWidth="1.5" />
      <text x={x + 12} y="62" {...head}>{title}</text>
      {ls.map((l, i) => <text key={i} x={x + 12} y={84 + i * 18} {...body}>{l}</text>)}
    </>
  );
}

function scene(t: number) {
  const on = (i: number) => clamp((t - i) * 2 + 0.3);
  const move = clamp(t - 1);
  const hit = clamp(t - 2);
  return (
    <svg viewBox={`0 0 ${W} 440`} role="img" aria-label="Positivism on the theory-of-law layer; realism moved to a separate theory-of-adjudication layer; Hart's arguments hit only the first">
      <rect x="4" y="16" width={W - 8} height="136" rx="12" fill="none" stroke="var(--ink-3)" strokeWidth="1" />
      <text x="16" y="32" {...head} fill="var(--ink-2)">THEORY OF LAW · WHAT COUNTS AS LAW</text>
      <g opacity={on(1)}>
        <rect x="4" y="226" width={W - 8} height="136" rx="12" fill="none" stroke="var(--ink-3)" strokeWidth="1" />
        <text x="16" y="242" {...head} fill="var(--ink-2)">ADJUDICATION · WHAT CAUSES DECISIONS</text>
      </g>
      <Card x={12} title="POSITIVISM" ls={['social thesis', 'separability thesis']} />
      <g transform={`translate(180 ${210 * move})`}>
        <Card x={12} title="REALISM" ls={move > 0.5 ? ['judges react to', 'the facts; patterns', 'allow prediction'] : ['a rival theory', 'of law? (Hart)']} />
      </g>
      <g opacity={hit}>
        <path d="M18 212 L18 140 M11 150 L18 140 L25 150" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
        <text x="30" y="184" {...body} fontSize={12}>Hart: hits conceptual</text>
        <text x="30" y="204" {...body} fontSize={12} fill="var(--ink-2)">misses empirical</text>
      </g>
      <g opacity={on(3)}>
        <line x1="168" y1="136" x2="192" y2="250" stroke="var(--ink-2)" strokeWidth="1.5" strokeDasharray="4 4" />
        <text x="8" y="388" {...body}>realist indeterminacy presupposes positivist</text>
        <text x="8" y="406" {...body}>criteria of legality; the dispute left is</text>
        <text x="8" y="424" {...body}>empirical: how often do rules matter?</text>
      </g>
    </svg>
  );
}

export default function LeiterRealismAsTheoryOfAdjudication() {
  return (
    <ScrollExplainer
      label="Leiter: realism as a descriptive theory of adjudication, on a different layer from positivism"
      terms={[
        { term: 'Theory of law', def: 'What counts as law — positivism\'s Social Thesis and Separability thesis.' },
        { term: 'Theory of adjudication', def: 'What causes judicial decisions — where Leiter puts realism.' },
        { term: 'Empirical rule scepticism', def: 'Rules cannot explain decisions; the question is what the real, non-legal reasons are.' },
      ]}
      beats={[
        { caption: "Two widespread views — realism and positivism are incompatible, and realism is \"a jurisprudential joke\" — trace to Hart's chapter VII, which construed realism as a rival theory of law." },
        { caption: 'For Leiter realism is a descriptive theory of adjudication: judges react primarily to the facts; decisions fall into situation types that allow prediction; law is rationally indeterminate.' },
        { caption: 'Hart has good arguments against conceptual rule scepticism, but none against empirical rule scepticism.' },
        { caption: 'The realists "cannot be conceptual rule skeptics": their indeterminacy arguments presuppose criteria of legality with affinities to exclusive positivism (293). They disagree over how often rules play a causal role.' },
      ]}
      scene={scene}
      check={{
        question: 'On Leiter\'s reading, why do Hart\'s chapter VII arguments not defeat legal realism?',
        options: [
          { text: 'Because they target conceptual rule scepticism, and the realists are empirical rule sceptics', correct: true, why: 'Realism is a theory of adjudication; Hart\'s arguments hit the conceptual layer and miss the empirical one.' },
          { text: 'Because realism rejects the idea of criteria of legality', why: 'The reverse: realist indeterminacy arguments presuppose a positivistic account of the criteria of legality.' },
          { text: 'Because realists think law is fully determinate', why: 'Both realism and positivism think law is indeterminate, with different sources and scope.' },
        ],
      }}
    />
  );
}
