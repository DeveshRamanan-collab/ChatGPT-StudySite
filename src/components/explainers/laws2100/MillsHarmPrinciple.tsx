/*
SCENE: Mill's harm principle — the boundary drawn around the individual
LENGTH: 4 screens pinned (desktop, full motion); 4 paced beats otherwise
BEATS: 4
INTENT: The state's authority stops at a boundary around each mature individual; conduct crosses it only when it
  harms others (assault, theft), while self-regarding conduct, consensual harm and mere offence stay inside; two
  justifications hold the boundary up and three criticisms press on it.
SUBJECT: the circle around the individual: what crosses it and what stays inside.
BEAT 1 (0–25%): authority (the state) and liberty (the individual in a circle: "sovereign over body and mind").
BEAT 2 (25–50%): assault and theft arrows cross the circle to B: coercion permitted; own property and offence stay
  inside: the state would exceed its limits.
BEAT 3 (50–75%): the two supports: autonomy / presumptive case for liberty; long-run happiness (experiments in living).
BEAT 4 (75–100%): three criticisms light in turn: harm too narrow; no purely self-regarding affairs; indirect harms.
  All fades are scrubbed opacity, ease none.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: final frame with all four captions stacked (base).
BUDGET: < 6 KB gz. Opacity only.
Source: concept laws2100-w10-mills-harm-principle; authority mill-on-liberty (slides 7–12).
*/
import { ScrollExplainer } from '../bases/ScrollExplainer';

const W = 360;
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const head = { fontFamily: 'var(--font-ui)', fontSize: 11, letterSpacing: 1.2, fill: 'var(--ink)' } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 12, fill: 'var(--ink-2)' } as const;
const PROBLEMS = ['harm conceived too narrowly', 'no affairs affect only oneself', 'ignores indirect harms and offence'];

function scene(t: number) {
  const on = (i: number) => clamp((t - i) * 2 + 0.3);
  const lit = (k: number) => clamp((t - 3) * 4 - k);
  return (
    <svg viewBox={`0 0 ${W} 440`} role="img" aria-label="The state outside a circle drawn around the individual: harm to others crosses it, self-regarding conduct and offence stay inside; two justifications and three criticisms">
      <rect x="20" y="20" width="96" height="36" rx="6" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="68" y="43" textAnchor="middle" {...head}>STATE</text>
      <circle cx="180" cy="150" r="64" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="180" y="146" textAnchor="middle" {...head}>A</text>
      <text x="180" y="164" textAnchor="middle" {...body}>body and mind</text>
      <g opacity={on(0)}>
        <text x="180" y="236" textAnchor="middle" {...body} fill="var(--ink)">sovereign over self (mature adults)</text>
        <path d="M116 46 L136 104" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="4 4" />
      </g>
      <g opacity={on(1)}>
        <circle cx="318" cy="110" r="18" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
        <text x="318" y="114" textAnchor="middle" {...head}>B</text>
        <path d="M236 126 L296 112 M288 106 L298 112 L288 118" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
        <text x="266" y="94" textAnchor="middle" {...body} fill="var(--ink)">assault, theft</text>
        <text x="300" y="150" textAnchor="middle" {...body}>coercion permitted</text>
        <text x="180" y="190" textAnchor="middle" {...body} fontSize={11}>own property · offence</text>
        <text x="180" y="204" textAnchor="middle" {...body} fontSize={11}>"foolish, perverse, or wrong"</text>
      </g>
      <g opacity={on(2)}>
        <rect x="16" y="252" width="158" height="40" rx="6" fill="none" stroke="var(--ink-2)" strokeWidth="1" />
        <text x="95" y="268" textAnchor="middle" {...body} fill="var(--ink)">autonomy: freedom</text>
        <text x="95" y="284" textAnchor="middle" {...body} fill="var(--ink)">has intrinsic value</text>
        <rect x="186" y="252" width="158" height="40" rx="6" fill="none" stroke="var(--ink-2)" strokeWidth="1" />
        <text x="265" y="268" textAnchor="middle" {...body} fill="var(--ink)">long-run happiness:</text>
        <text x="265" y="284" textAnchor="middle" {...body} fill="var(--ink)">experiments in living</text>
      </g>
      <g opacity={on(3)}>
        {PROBLEMS.map((p, k) => (
          <g key={p} opacity={0.25 + 0.75 * lit(k)}>
            <rect x="16" y={316 + k * 36} width={W - 32} height="28" rx="6" fill="none" stroke="var(--ink-3)" strokeWidth="1" />
            <text x="30" y={335 + k * 36} {...body} fill="var(--ink)">{`criticism ${k + 1}: ${p}`}</text>
          </g>
        ))}
      </g>
    </svg>
  );
}

export default function MillsHarmPrinciple() {
  return (
    <ScrollExplainer
      label="Mill's harm principle: the boundary around the individual, what crosses it, and what presses on it"
      terms={[
        { term: 'Harm principle', def: 'The only purpose for which power can rightfully be exercised over anyone, against their will, is to prevent harm to others.' },
        { term: 'Harm', def: 'Infringing another\'s interests that we are under a duty not to infringe; not merely affecting their interests.' },
        { term: 'Presumptive case for liberty', def: 'Whatever we think about freedom, we agree it has intrinsic value for the individual and society.' },
      ]}
      beats={[
        { caption: 'On Liberty (1859): the struggle between authority and liberty. Over their own body and mind the individual is sovereign; the doctrine applies only to human beings "in the maturity of their faculties".' },
        { caption: 'The state may stop A assaulting B, or stealing B\'s property. It exceeds its limits if it stops A destroying her own property, or protects someone from being offended, however "foolish, perverse, or wrong" A\'s conduct.' },
        { caption: 'Two supports: personal autonomy and the presumptive case for liberty; and Mill\'s utilitarian argument that experiments in living, and the exercise of freedom itself, bring maximum happiness in the long run.' },
        { caption: 'Three criticisms: harm is conceived too narrowly (damage to person or property); no one\'s affairs affect only themselves; indirect harms, and offence that could become harm, are left out.' },
      ]}
      scene={scene}
      check={{
        question: 'On Mill\'s principle, may the state stop an adult from destroying her own property?',
        options: [
          { text: 'No: it harms only the actor', correct: true, why: 'The slides say the state exceeds its proper limits if it stops A destroying her own property: conduct that harms only the actor should be free.' },
          { text: 'Yes: destroying property is harm', why: 'Harm, for Mill, means infringing others\' interests we have a duty not to infringe; her own property involves no one else.' },
          { text: 'Yes: it is foolish and wrong', why: 'Mill says we should be free to act however "foolish, perverse, or wrong" our conduct, unless it harms others.' },
        ],
      }}
    />
  );
}
