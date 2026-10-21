/*
SCENE: Holmes's bad man and the puzzled man at the courthouse door
LENGTH: 4 screens pinned (desktop, full motion); 4 paced beats otherwise
BEATS: 4
INTENT: The bad man asks only what the court will do to him — law as prediction of official behaviour; the puzzled
  man asks what the law requires, and the counterarguments light up on his path.
SUBJECT: the two arrows to the door: prediction (bad man) and rule (puzzled man).
BEAT 1 (0–25%): door and bad man; the prediction arrow fades in (scrubbed opacity, ease none).
BEAT 2 (25–50%): "duty = likely adverse ruling"; officials, not commands. BEAT 3 (50–75%): Ross's tû-tû placeholder.
BEAT 4 (75–100%): the puzzled man and four counterarguments light one after another.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: final frame with all four captions stacked (base).
BUDGET: < 6 KB gz. Transform and opacity only.
Source: concept laws2100-w06-holmes-prediction-theory; authorities holmes-the-path-of-the-law, ross-tu-tu.
*/
import { ScrollExplainer } from '../bases/ScrollExplainer';

const W = 360;
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const head = { fontFamily: 'var(--font-ui)', fontSize: 11, letterSpacing: 1.2, fill: 'var(--ink)' } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 13, fill: 'var(--ink-2)' } as const;
const COUNTER = ['misses the internal point of view', 'no court could make a mistake about law', 'why prefer the bad man to the puzzled?', 'without rules, who is a judge?'];

const Figure = ({ x, label }: { x: number; label: string }) => (
  <g>
    <circle cx={x} cy="170" r="9" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
    <path d={`M${x} 179 L${x} 206 M${x - 12} 190 L${x + 12} 190 M${x} 206 L${x - 9} 226 M${x} 206 L${x + 9} 226`} fill="none" stroke="var(--ink)" strokeWidth="1.5" />
    <text x={x} y="246" textAnchor="middle" {...head}>{label}</text>
  </g>
);

function scene(t: number) {
  const on = (i: number) => clamp((t - i) * 2 + 0.3);
  const lit = (k: number) => clamp((t - 3) * 4 - k);
  return (
    <svg viewBox={`0 0 ${W} 440`} role="img" aria-label="The bad man asks what the court will do; the puzzled man asks what the law requires; four objections to the prediction theory">
      <path d="M130 50 L180 20 L230 50 Z M136 50 L136 130 M224 50 L224 130 M130 130 L230 130" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="180" y="100" textAnchor="middle" {...head} fill="var(--ink-2)">COURT</text>
      <g opacity={on(0)}>
        <Figure x={56} label="BAD MAN" />
        <line x1="72" y1="170" x2="128" y2="108" stroke="var(--ink)" strokeWidth="1.5" strokeDasharray="4 4" />
        <text x="8" y="270" {...body} fill="var(--ink)">"what will the court</text>
        <text x="8" y="288" {...body} fill="var(--ink)">do to me?"</text>
      </g>
      <g opacity={on(1)}>
        <text x="180" y="160" textAnchor="middle" {...body} fontSize={12}>prediction:</text>
        <text x="180" y="176" textAnchor="middle" {...body} fontSize={12}>duty = likely</text>
        <text x="180" y="192" textAnchor="middle" {...body} fontSize={12}>adverse ruling</text>
      </g>
      <g opacity={on(2)}>
        <rect x="140" y="206" width="80" height="30" rx="15" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="4 4" />
        <text x="180" y="226" textAnchor="middle" {...body} fontSize={12}>"tû-tû"</text>
      </g>
      <g opacity={on(3)}>
        <Figure x={304} label="PUZZLED" />
        <line x1="288" y1="170" x2="232" y2="108" stroke="var(--ink)" strokeWidth="1.5" />
        <text x={W - 8} y="270" textAnchor="end" {...body} fill="var(--ink)">"what does the law</text>
        <text x={W - 8} y="288" textAnchor="end" {...body} fill="var(--ink)">require of me?"</text>
        {COUNTER.map((c, k) => (
          <g key={c} opacity={0.25 + 0.75 * lit(k)}>
            <rect x="8" y={312 + k * 30} width={W - 16} height="24" rx="6" fill="none" stroke="var(--ink-3)" strokeWidth="1" />
            <text x="20" y={329 + k * 30} {...body} fill="var(--ink)">{c}</text>
          </g>
        ))}
      </g>
    </svg>
  );
}

export default function HolmesPredictionTheory() {
  return (
    <ScrollExplainer
      label="Holmes's bad man and the prediction theory, with the puzzled man's objections"
      terms={[
        { term: 'Bad man', def: 'Holmes\'s lens: someone who cares only about the practical consequences of breaking rules.' },
        { term: 'Prediction theory', def: 'Law is a prediction of what courts will do in fact.' },
        { term: 'Puzzled man', def: "Hart's answer: someone who wishes to arrange their affairs according to law." },
      ]}
      beats={[
        { caption: '"The prophecies of what the courts will do in fact, and nothing more pretentious, are what I mean by the law" (Holmes, The Path of the Law, 1897).' },
        { caption: 'We are under a legal duty not to do X because doing X is likely to result in an adverse court ruling. Unlike Austin, the focus is not commands and sanctions but the behaviour of officials.' },
        { caption: 'Ross, the leading Scandinavian realist, reached realism through a criticism of Kelsen: in "Tû-Tû" (1957) ownership has no semantic reference — a placeholder linking facts to legal consequences.' },
        { caption: 'Objections: it misses the internal point of view; no court could make a mistake about the law; why prefer the bad man to the puzzled person? And without legal rules, how do we know who a judge is?' },
      ]}
      scene={scene}
      check={{
        question: 'Which objection is Hart\'s sharpest against the prediction theory?',
        options: [
          { text: 'It makes it impossible to say a court has made a mistake about the law', correct: true, why: 'If law is just a prediction of what courts do, whatever the final court does is the law — the finality/infallibility point.' },
          { text: 'It focuses on commands and sanctions', why: 'That is Austin; the prediction theory focuses on the behaviour of officials.' },
          { text: 'It gives ownership a fixed semantic reference', why: "The reverse: Ross's point is that ownership has no semantic reference." },
        ],
      }}
    />
  );
}
