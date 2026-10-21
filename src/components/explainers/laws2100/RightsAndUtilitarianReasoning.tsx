/*
SCENE: Rights against utility — the ticking-bomb balance, read by three reasoners
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → set the lives at stake, choose the reasoner, add the innocent-child variant → the beam tips (or is
  locked) and the verdict states that reasoner's answer → check
INTENT: An act-utilitarian lets the numbers decide, so the beam tips towards the lives saved; a true commitment to
  rights treats the right as a trump that locks the beam; on the lecture's account Waldron's indirect utilitarian
  takes the calculation away from the official, for utilitarian reasons.
SUBJECT: the beam: tipping, or held level by the lock.
BEAT 1 (0–100%): changing the lives re-weights the right-hand pan (beam rotates, transform 240ms ease-in-out);
  choosing a trump or indirect reasoner draws the lock (opacity 180ms); verdict within 200ms.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: identical controls; the transform and fades are the only motion.
BUDGET: < 5 KB gz, no WebGL.
Source: concept laws2100-w09-rights-and-utilitarian-reasoning (verify: true — trumps/shields attributions and the
  Waldron reading come from the 2025 recording); authorities dworkin-taking-rights-seriously,
  waldron-the-law-theory-and-practice-in-british-politics.
*/
import { Simulation, type SimView } from '../bases/Simulation';

interface S extends Record<string, unknown> {
  lives: string;
  reasoner: string;
  innocent: boolean;
}

const initial: S = { lives: '100', reasoner: 'act', innocent: false };
const W = 360;
const head = { fontFamily: 'var(--font-ui)', fontSize: 11, letterSpacing: 1.2, fill: 'var(--ink-2)' } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 13, fill: 'var(--ink)' } as const;
const tilt = { transition: 'transform 240ms var(--ease-inout)', transformOrigin: '180px 70px' } as const;
const fade = { transition: 'opacity 180ms var(--ease-out)' } as const;
const ANGLE: Record<string, number> = { '10': 6, '100': 11, '1000': 16 };

function view(s: S): SimView {
  const act = s.reasoner === 'act';
  const angle = act ? ANGLE[s.lives] : 0; // positive (clockwise): the right-hand pan (lives) goes down
  const who = s.innocent ? 'the suspect\'s innocent child' : 'the suspect';
  const figure = (
    <svg viewBox={`0 0 ${W} 250`} role="img" aria-label={act ? `The beam tips towards ${s.lives} lives saved` : 'The beam is locked level: the right is not weighed against the lives'}>
      <path d="M180 70 L162 214 L198 214 Z" fill="none" stroke="var(--ink-2)" strokeWidth="1.5" />
      <line x1="140" y1="214" x2="220" y2="214" stroke="var(--ink-2)" strokeWidth="1.5" />
      <g style={{ ...tilt, transform: `rotate(${angle}deg)` }}>
        <line x1="40" y1="70" x2="320" y2="70" stroke="var(--ink)" strokeWidth="2" />
        <line x1="60" y1="70" x2="60" y2="110" stroke="var(--ink-3)" strokeWidth="1" />
        <line x1="300" y1="70" x2="300" y2="110" stroke="var(--ink-3)" strokeWidth="1" />
        <path d="M22 110 L98 110 L88 124 L32 124 Z" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
        <path d="M262 110 L338 110 L328 124 L272 124 Z" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
        <text x="60" y="146" textAnchor="middle" {...body} fontSize={12}>{s.innocent ? 'innocent child' : 'one suspect'}</text>
        <text x="60" y="162" textAnchor="middle" {...body} fontSize={11} fill="var(--ink-2)">not to be tortured</text>
        <text x="300" y="146" textAnchor="middle" {...body} fontSize={12}>{`${s.lives} lives`}</text>
        <text x="300" y="162" textAnchor="middle" {...body} fontSize={11} fill="var(--ink-2)">aggregate happiness</text>
      </g>
      <g style={{ ...fade, opacity: act ? 0 : 1 }}>
        <rect x="166" y="42" width="28" height="22" rx="4" fill="var(--paper)" stroke="var(--ink)" strokeWidth="1.5" />
        <path d="M172 42 L172 34 A8 8 0 0 1 188 34 L188 42" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      </g>
      <text x="24" y="20" {...head}>RIGHT</text>
      <text x={W - 24} y="20" textAnchor="end" {...head}>GENERAL INTEREST</text>
      <text x="180" y="240" textAnchor="middle" {...body} fontSize={11} fill="var(--ink-2)">{`torture ${who}?`}</text>
    </svg>
  );
  if (act)
    return {
      figure,
      verdict: s.innocent
        ? 'Act-utilitarian: following consequentialist thinking, even torturing an innocent child may look justifiable in light of the lives saved. The variant tests our moral intuitions; it does not solve the dilemma.'
        : `Act-utilitarian: judged by its consequences under the principle of utility, torturing one person to save ${s.lives} lives may be justified, because aggregate happiness rises.`,
      tone: 'no',
    };
  if (s.reasoner === 'trump')
    return {
      figure,
      verdict: 'True commitment to human rights: not acceptable, however many lives are at stake. The right has priority over the general interest; it trumps (or shields against) the calculation.',
      tone: 'yes',
    };
  return {
    figure,
    verdict: 'Indirect utilitarian (Waldron, on the lecture\'s account): for utilitarian reasons we build structures in which officials do not calculate. The interrogator respects the right; the utility argument was made when the structure was chosen.',
    tone: 'yes',
  };
}

function describe(a: S, b: S) {
  if (a.lives !== b.lives) return `${b.lives} lives now sit in the right-hand pan. Only the act-utilitarian's beam responds to the number.`;
  if (a.innocent !== b.innocent) return b.innocent ? 'The harder variant: the suspect will talk only if their innocent child is tortured — a trolley problem writ large.' : 'Back to the suspect alone.';
  if (b.reasoner === 'act') return 'Act-utilitarianism: each act is judged by its consequences, so the lock comes off and the numbers decide.';
  if (b.reasoner === 'trump') return 'Rights as trumps: the right has priority over the general interest, so the beam is locked level.';
  return 'Indirect utilitarianism: the official is asked not to reason as a utilitarian — for utilitarian reasons.';
}

export default function RightsAndUtilitarianReasoning() {
  return (
    <Simulation<S>
      label="The ticking-bomb balance: one person's right against the lives at stake, read by three reasoners"
      terms={[
        { term: 'Principle of utility', def: 'The greatest happiness for the greatest number; act-utilitarianism judges each act by its consequences.' },
        { term: 'Trumps or shields', def: 'Images of rights\' priority over the general interest (the lecture names Dworkin for trumps, Schauer for shields).' },
        { term: 'Indirect utilitarianism', def: 'On the lecture\'s account of Waldron: officials asked, for utilitarian reasons, not to reason as utilitarians.' },
      ]}
      initial={initial}
      controls={[
        { key: 'lives', label: 'Lives at stake', type: 'select', options: [{ value: '10', label: '10' }, { value: '100', label: '100' }, { value: '1000', label: '1,000' }] },
        { key: 'reasoner', label: 'Who is reasoning?', type: 'select', options: [{ value: 'act', label: 'An act-utilitarian' }, { value: 'trump', label: 'Someone committed to rights (trumps)' }, { value: 'indirect', label: 'An official under indirect utilitarianism' }] },
        { key: 'innocent', label: 'Harder variant: the person to be tortured is the suspect\'s innocent child', type: 'toggle' },
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'Why does the act-utilitarian\'s verdict move with the number of lives, when the rights view does not?',
        options: [
          { text: 'It judges the act by its consequences: aggregate happiness', correct: true, why: 'Act-utilitarianism is a form of consequentialism: more lives saved means more aggregate happiness on the scale.' },
          { text: 'It judges the act by the principle behind it', why: 'That is deontological reasoning, which the lecture calls the opposite of consequentialism; it would not move with the numbers.' },
          { text: 'It asks whether a court would enforce the right', why: 'Legal enforceability is Bentham\'s test of which rights exist, not the act-utilitarian\'s standard for judging an act.' },
        ],
      }}
    />
  );
}
