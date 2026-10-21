/*
SCENE: Limitation clauses and Alexy's proportionality test — a limiting measure walks through three gates
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → choose the right, then say whether the measure can achieve its aim, whether a less restrictive
  means exists and whether its benefits outweigh the detriment → the marker stops at the first gate it fails (or
  at a closed art 15(2) gate before the test begins) → check
INTENT: Rights as principles are optimised, so a limit is tested in order: suitability, necessity, balancing; some
  rights (ECHR art 15(2)) are put beyond derogation, which is where the debate on absolute rights begins.
SUBJECT: the measure's marker and the gate it stops at.
BEAT 1 (0–100%): each control moves the marker to its stopping gate (transform 240ms ease-in-out); the failed gate
  is crossed out (opacity 180ms); verdict within 200ms.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: identical controls; the transform and fades are the only motion.
BUDGET: < 5 KB gz, no WebGL.
Source: concept laws2100-w09-limitation-clauses-and-proportionality; authorities canadian-charter-of-rights-and-freedoms-s1,
  echr-art-15, charter-of-human-rights-and-responsibilities-act-2006-vic-s7, alexy-proportionality.
*/
import { Simulation, type SimView } from '../bases/Simulation';

interface S extends Record<string, unknown> {
  right: string;
  suitable: boolean;
  lessRestrictive: boolean;
  benefits: boolean;
}

const initial: S = { right: 'limitable', suitable: true, lessRestrictive: false, benefits: true };
const W = 360;
const head = { fontFamily: 'var(--font-ui)', fontSize: 9, letterSpacing: 0.6, fill: 'var(--ink-2)' } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 12, fill: 'var(--ink)' } as const;
const glide = { transition: 'transform 240ms var(--ease-inout)' } as const;
const fade = { transition: 'opacity 180ms var(--ease-out)' } as const;
// Gate x positions: 0 = art 15(2) bar, 1 suitability, 2 necessity, 3 balancing; 4 = through.
const GX = [52, 124, 196, 268];
const GATES = [
  { label: ['ART 15(2)', 'BAR'] },
  { label: ['SUITABILITY'] },
  { label: ['NECESSITY'] },
  { label: ['BALANCING'] },
];

function stop(s: S): number {
  if (s.right === 'torture') return 0;
  if (!s.suitable) return 1;
  if (s.lessRestrictive) return 2;
  if (!s.benefits) return 3;
  return 4;
}

function view(s: S): SimView {
  const k = stop(s);
  const x = k === 4 ? 330 : GX[k] - 22; // stop just before the failing gate
  const figure = (
    <svg viewBox={`0 0 ${W} 220`} role="img" aria-label={k === 4 ? 'The measure passes all three stages' : `The measure stops at ${GATES[k].label.join(' ').toLowerCase()}`}>
      <text x="16" y="22" {...head}>LIMITING MEASURE →</text>
      <line x1="16" y1="110" x2="344" y2="110" stroke="var(--ink-3)" strokeWidth="1.5" />
      {GATES.map((g, i) => {
        const gx = GX[i];
        const failed = k === i;
        const muted = i === 0 && s.right !== 'torture';
        return (
          <g key={i} style={{ ...fade, opacity: muted ? 0.35 : 1 }}>
            <line x1={gx} y1="64" x2={gx} y2="156" stroke="var(--ink)" strokeWidth={i === 0 ? 1 : 2} strokeDasharray={i === 0 ? '4 4' : undefined} />
            {g.label.map((l, j) => <text key={j} x={gx} y={176 + j * 14} textAnchor="middle" {...head}>{l}</text>)}
            <g style={{ ...fade, opacity: failed ? 1 : 0 }}>
              <path d={`M${gx - 10} 100 L${gx + 10} 120 M${gx + 10} 100 L${gx - 10} 120`} stroke="var(--ink)" strokeWidth="2" />
            </g>
          </g>
        );
      })}
      <text x="196" y="52" textAnchor="middle" {...body} fontSize={11} fill="var(--ink-2)">Alexy: three stages, in order</text>
      <g style={{ ...glide, transform: `translateX(${x}px)` }}>
        <circle cx="0" cy="110" r="8" fill="var(--ink)" />
      </g>
      <text x="344" y="98" textAnchor="end" {...body} fontSize={11} fill="var(--ink-2)">justified</text>
    </svg>
  );
  const verdicts: [string, SimView['tone']][] = [
    ['ECHR art 15(2): no derogation from art 3 (torture), even in war or public emergency — so the test never begins. Whether such rights are absolute is debated; some argue the prohibition of torture can never be limited.', 'no'],
    ['Fails suitability: the measure must be capable of achieving the legitimate aim. It goes no further.', 'no'],
    ['Fails necessity: there must be no less restrictive means to achieve the same goal (compare Victorian Charter s 7(2)(e)).', 'no'],
    ['Fails balancing (proportionality in the narrow sense): the benefits must outweigh the detriment to the right infringed.', 'no'],
    ['Passes all three stages: a reasonable limit "demonstrably justified in a free and democratic society" (Canada s 1; Victoria s 7(2)). The right is limited, not destroyed.', 'yes'],
  ];
  const [verdict, tone] = verdicts[k];
  return { figure, verdict, tone };
}

function describe(a: S, b: S) {
  if (a.right !== b.right) return b.right === 'torture' ? 'The right is now freedom from torture: ECHR art 15(2) bars derogation from art 3.' : 'The right is now one open to limitation under a clause like Canada s 1.';
  if (a.suitable !== b.suitable) return b.suitable ? 'The measure can now achieve its legitimate aim (suitability).' : 'The measure can no longer achieve its aim: it cannot pass suitability.';
  if (a.lessRestrictive !== b.lessRestrictive) return b.lessRestrictive ? 'An equally effective, less restrictive means now exists (necessity).' : 'No less restrictive means is available.';
  return b.benefits ? 'The benefits now outweigh the detriment to the right (balancing).' : 'The detriment to the right now outweighs the benefits.';
}

export default function LimitationClausesAndProportionality() {
  return (
    <Simulation<S>
      label="A limiting measure tested by Alexy's three stages, with the ECHR art 15(2) bar in front"
      terms={[
        { term: 'Limitation clause', def: 'A constitutional provision permitting the partial limitation of some constitutional rights.' },
        { term: 'Optimisation requirement', def: 'Alexy\'s principle: realised to the greatest extent possible, given legal and factual constraints.' },
        { term: 'Balancing', def: 'Proportionality in the narrow sense: the benefits must outweigh the detriment to the right.' },
      ]}
      initial={initial}
      controls={[
        { key: 'right', label: 'Which right is limited?', type: 'select', options: [{ value: 'limitable', label: 'A right open to limitation (eg Canada s 1)' }, { value: 'torture', label: 'Freedom from torture (ECHR art 3)' }] },
        { key: 'suitable', label: 'The measure can achieve its legitimate aim', type: 'toggle' },
        { key: 'lessRestrictive', label: 'An equally effective, less restrictive means exists', type: 'toggle' },
        { key: 'benefits', label: 'Its benefits outweigh the detriment to the right', type: 'toggle' },
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'A measure achieves its aim, but an equally effective, less restrictive measure exists. Which stage does it fail?',
        options: [
          { text: 'Suitability', why: 'It does achieve its aim, so it is suitable; the problem is the milder alternative.' },
          { text: 'Necessity', correct: true, why: 'Necessity requires that there be no less restrictive means to achieve the same goal.' },
          { text: 'Balancing', why: 'Balancing comes last; this measure fails earlier, because a less restrictive means exists.' },
        ],
      }}
    />
  );
}
