/*
SCENE: Theoretical disagreement — three lanes of issues, the middle one lit, officials converging then splitting
LENGTH: 4 screens pinned (desktop, full motion); 4 paced beats otherwise
BEATS: 4
INTENT: Lawsuits raise issues of fact, law and political morality; judges who agree on the criteria of validity can
  still disagree about the content of the law (Riggs) — which Hart's convergence account cannot explain.
SUBJECT: the officials' lines in the middle lane: converging on the rule of recognition, then forking.
BEAT 1 (0–25%): three lanes fade in. BEAT 2 (25–50%): the law lane lights; the other two dim.
  BEAT 3 (50–75%): officials' lines converge on "rule of recognition" (scrubbed translate, ease none).
  BEAT 4 (75–100%): the lines fork on Riggs — "Elmer inherits?" yes / no.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: final frame with all four captions stacked (base).
BUDGET: < 6 KB gz. Transform and opacity only.
Source: concept laws2100-w05-theoretical-disagreement; week spec laws2100-w05 (Riggs); authority dworkin-laws-empire.
*/
import { ScrollExplainer } from '../bases/ScrollExplainer';

const W = 360;
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const head = { fontFamily: 'var(--font-ui)', fontSize: 11, letterSpacing: 1.2, fill: 'var(--ink)' } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 13, fill: 'var(--ink-2)' } as const;
const LANES = [{ t: 'FACT', q: 'what happened?' }, { t: 'LAW', q: 'what is the pertinent law?' }, { t: 'POLITICAL MORALITY', q: 'is it unjust?' }];
const JUDGES = [60, 120, 180, 240, 300];

function scene(t: number) {
  const on = (i: number) => clamp((t - i) * 2 + 0.3);
  const lit = clamp(t - 1);
  const meet = clamp(t - 2);
  const fork = clamp(t - 3);
  return (
    <svg viewBox={`0 0 ${W} 440`} role="img" aria-label="Three lanes of issues; in the law lane, judges converge on the rule of recognition and then split on Riggs">
      {LANES.map((l, i) => (
        <g key={l.t} opacity={on(0) * (i === 1 ? 1 : 1 - 0.65 * lit)}>
          <rect x="8" y={8 + i * 56} width={W - 16} height="46" rx="10" fill="none" stroke={i === 1 ? 'var(--ink)' : 'var(--ink-3)'} strokeWidth="1.5" />
          <text x="20" y={28 + i * 56} {...head}>{l.t}</text>
          <text x="20" y={45 + i * 56} {...body} fontSize={12}>{l.q}</text>
        </g>
      ))}
      <g opacity={on(2)}>
        {JUDGES.map((x) => {
          const top = { x, y: 196 };
          const mid = { x: x + (180 - x) * meet, y: 280 };
          const end = { x: 180 + (x < 180 ? -110 : x > 180 ? 110 : -110) * fork, y: 280 + 80 * fork };
          return (
            <g key={x}>
              <circle cx={top.x} cy={top.y} r="7" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
              <line x1={top.x} y1={top.y + 7} x2={mid.x} y2={mid.y} stroke="var(--ink-2)" strokeWidth="1.2" />
              <line x1={mid.x} y1={mid.y} x2={end.x} y2={end.y} stroke="var(--ink-2)" strokeWidth="1.2" opacity={fork} />
            </g>
          );
        })}
        <text x={W / 2} y="186" textAnchor="middle" {...body} fontSize={12}>officials</text>
        <text x={W / 2} y="302" textAnchor="middle" {...body} fill="var(--ink)" opacity={meet}>agree: rule of recognition</text>
      </g>
      <g opacity={fork}>
        <text x="70" y="384" textAnchor="middle" {...body} fill="var(--ink)">Elmer inherits</text>
        <text x="290" y="384" textAnchor="middle" {...body} fill="var(--ink)">Elmer does not</text>
        <text x={W / 2} y="424" textAnchor="middle" {...head} fill="var(--ink-2)">DISAGREE: CONTENT OF THE LAW</text>
      </g>
    </svg>
  );
}

export default function TheoreticalDisagreement() {
  return (
    <ScrollExplainer
      label="Theoretical disagreement: judges agree on the criteria of validity and split on the content of the law"
      terms={[
        { term: 'Empirical disagreement', def: 'About what happened.' },
        { term: 'Theoretical disagreement', def: 'About what the pertinent law is.' },
        { term: 'Moral disagreement', def: 'About whether the law, so understood, is just.' },
      ]}
      beats={[
        { caption: '"Lawsuits always raise, at least in principle, three different kinds of issues: issues of fact, issues of law, and the twinned issues of political morality and fidelity" (LE 3).' },
        { caption: 'Legal practice is argumentative. Dworkin takes up the participants\' point of view, studying legal argument "from the judge\'s viewpoint" (LE 14) — and focuses on the middle lane.' },
        { caption: 'For Hart, the rule of recognition exists because officials converge in accepting it. If Hart is right, there should be no theoretical disagreements.' },
        { caption: 'Yet in Riggs the statute\'s text was clear and the judges split on whether Elmer was legally entitled — reading in principles of justice from legislators\' diffuse intention and coherence in principle.' },
      ]}
      scene={scene}
      check={{
        question: 'Why does theoretical disagreement trouble Hart, on Dworkin\'s argument?',
        options: [
          { text: 'Because judges disagree about what happened in the case', why: 'That is empirical disagreement, which any theory can accommodate.' },
          { text: 'Because agreement on the criteria of validity should leave no room to disagree about the law\'s content', correct: true, why: 'The rule of recognition rests on official convergence; Riggs shows judges agreeing on criteria yet splitting on content.' },
          { text: 'Because judges disagree about whether the law is just', why: 'That is moral disagreement — a separate, third kind of issue, not a dispute about what the law is.' },
        ],
      }}
    />
  );
}
