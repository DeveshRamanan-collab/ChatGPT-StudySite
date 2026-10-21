/*
SCENE: Schauer — is legal reasoning special? A dial from "different in kind" to "same as ordinary reasoning"
LENGTH: 4 screens pinned (desktop, full motion); 4 paced beats otherwise
BEATS: 4
INTENT: Schauer's needle stops at "same methods, more concentrated": the reasoning shapes found everywhere are packed
  densely inside legal argument, which is an empirical claim, tied to law's generality and the Rule of Law.
SUBJECT: the needle (rotate, scrubbed, ease none).
BEAT 1 (0–25%): the dial and the question (vehicles in the park as "a debate within a debate").
BEAT 2 (25–50%): the sceptic tugs the needle to "nothing special". BEAT 3 (50–75%): the needle settles on
  "more concentrated"; the same dots, sparse outside and dense inside a courtroom outline. BEAT 4 (75–100%): the
  empirical claim and the wise-and-good caveat.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: final frame with all four captions stacked (base).
BUDGET: < 6 KB gz. Transform and opacity only.
Source: concept laws2100-w07-schauer-thinking-like-a-lawyer; authorities schauer-thinking-like-a-lawyer,
  schauer-a-critical-guide-to-vehicles-in-the-park.
*/
import { ScrollExplainer } from '../bases/ScrollExplainer';

const W = 360;
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const head = { fontFamily: 'var(--font-ui)', fontSize: 11, letterSpacing: 1.2, fill: 'var(--ink-2)' } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 13, fill: 'var(--ink)' } as const;
const SPARSE = [[30, 330], [70, 372], [44, 404], [300, 330], [334, 390], [312, 414]];
const DENSE = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((k) => [130 + (k % 4) * 33, 336 + Math.floor(k / 4) * 30]);

function scene(t: number) {
  const on = (i: number) => clamp((t - i) * 2 + 0.3);
  const tug = clamp(t - 1);
  const settle = clamp(t - 2);
  const angle = 80 * tug - 45 * settle; // 0 open question → 80 the sceptic → 35 Schauer
  return (
    <svg viewBox={`0 0 ${W} 440`} role="img" aria-label="A dial from different in kind to same as ordinary reasoning; Schauer's needle at same methods, more concentrated">
      <path d="M40 200 A140 140 0 0 1 320 200" fill="none" stroke="var(--ink-3)" strokeWidth="2" />
      <text x="8" y="222" {...head}>DIFFERENT IN KIND</text>
      <text x={W - 8} y="222" textAnchor="end" {...head}>SAME AS ORDINARY</text>
      <g style={{ transform: `rotate(${angle}deg)`, transformOrigin: '180px 200px' }}>
        <line x1="180" y1="200" x2="180" y2="76" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" />
      </g>
      <circle cx="180" cy="200" r="5" fill="var(--ink)" />
      <text x={W / 2} y="30" textAnchor="middle" {...body} opacity={on(0) * (1 - settle)}>do lawyers reason differently?</text>
      <text x={W / 2} y="30" textAnchor="middle" {...body} opacity={tug * (1 - settle)} dy="20" fill="var(--ink-2)">the sceptic: nothing special</text>
      <text x={W / 2} y="30" textAnchor="middle" {...body} opacity={settle}>Schauer: same methods,</text>
      <text x={W / 2} y="50" textAnchor="middle" {...body} opacity={settle}>more concentrated</text>
      <g opacity={on(2)}>
        <rect x="112" y="310" width="136" height="110" rx="4" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
        <text x="180" y="300" textAnchor="middle" {...head}>LEGAL ARGUMENT</text>
        {DENSE.map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="4" fill="var(--ink)" />)}
        {SPARSE.map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="4" fill="var(--ink-3)" />)}
        <text x="8" y="300" {...head}>EVERYWHERE</text>
      </g>
      <g opacity={on(3)}>
        <text x={W / 2} y="258" textAnchor="middle" {...body} fontSize={12} fill="var(--ink-2)">an empirical claim (p 11)</text>
      </g>
    </svg>
  );
}

export default function SchauerThinkingLikeALawyer() {
  return (
    <ScrollExplainer
      label="Schauer's dial: legal reasoning as ordinary methods, more concentrated"
      terms={[
        { term: 'Legal reasoning', def: '"Techniques of reasoning" said to be characteristic of legal decision-making.' },
        { term: 'The sceptic', def: 'Eg American legal realism: there is nothing distinctive about how judges reason.' },
        { term: 'Concentration', def: "Schauer's answer: methods found everywhere, but particularly concentrated and dominant in law." },
      ]}
      beats={[
        { caption: 'Vehicles in the park is "a debate within a debate". Fuller: "It shall be a misdemeanor … to sleep in any railway station." Can we interpret a word without knowing its aim? Thinking Like a Lawyer (2009) asks whether lawyers reason differently.' },
        { caption: 'Take the sceptic seriously: American legal realism doubts there is anything special here.' },
        { caption: 'If there are "methods of reasoning that are found everywhere but that are particularly concentrated and dominant in legal argument", legal reasoning is justified (p 8): special by concentration, not kind.' },
        { caption: 'Legal reasoning goes with law\'s generality, and is "in the final analysis an empirical claim" (p 11). "In a society governed by the wise and the good, legal reasoning is likely simply to get in the way."' },
      ]}
      scene={scene}
      check={{
        question: 'On Schauer\'s view, what makes legal reasoning special?',
        options: [
          { text: 'It uses methods found nowhere else', why: 'Schauer\'s methods are "found everywhere"; law is not different in kind.' },
          { text: 'Nothing — the realist sceptic is simply right', why: 'Schauer takes the sceptic seriously but answers "perhaps": there is something called legal reasoning.' },
          { text: 'Ordinary methods, particularly concentrated and dominant in legal argument', correct: true, why: 'Special by concentration — and whether it is so is, in the final analysis, an empirical claim.' },
        ],
      }}
    />
  );
}
