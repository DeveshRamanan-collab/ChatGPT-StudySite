/*
SCENE: Outsider jurisprudence — inside and outside of what? A standpoint marker moved around a legal system
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → choose a standpoint (and whether to apply the distinction to legal theory) → read what the law looks
  like from there → check
INTENT: Being "outside" law is not the trivial position of a visitor to a foreign system: on Hart's own existence
  conditions many people are subjects, even victims, of a system run by officials who accept its rules; outsider
  jurisprudence takes the standpoint of those the system marginalises, and the same inside/outside distinction
  applies to the canon of legal theory.
SUBJECT: the standpoint marker gliding between rings (CSS transform 180ms ease-out).
BEAT 1 (0–100%): a select for the standpoint and a toggle for "legal theory too"; ring labels switch between the legal
  system (officials, citizens, the marginalised) and legal theory (the canon, its challengers); verdict within 200ms.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: identical controls; the 180ms transform glide is the only motion.
BUDGET: < 6 KB gz, no WebGL.
Source: concept laws2100-w08-outsider-jurisprudence; week 8 notes (transcript on Hart's existence conditions and the
  trivial outsider); authority hart-the-concept-of-law.
*/
import { Simulation, type SimView } from '../bases/Simulation';

type Standpoint = 'official' | 'complier' | 'marginalised' | 'within' | 'visitor';

interface S extends Record<string, unknown> {
  standpoint: Standpoint;
  theory: boolean;
}

const initial: S = { standpoint: 'official', theory: false };
const W = 360;
const CX = 150, CY = 150;
const head = { fontFamily: 'var(--font-ui)', fontSize: 11, letterSpacing: 1.2, fill: 'var(--ink-2)' } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 13, fill: 'var(--ink)' } as const;
const glide = { transition: 'transform 180ms var(--ease-out)' } as const;

// Marker positions (relative to the ring centre) for each standpoint.
const POS: Record<Standpoint, [number, number]> = {
  official: [0, 0],
  complier: [0, -62],
  marginalised: [0, -108],
  within: [-33, -19], // on the officials' boundary
  visitor: [178, -96],
};

const SEES: Record<Standpoint, { law: string; theory: string }> = {
  official: {
    law: 'Officials accept the secondary rules from the internal point of view: Hart’s first condition.',
    theory: 'Inside the canon: analytical jurisprudence, which held a special status for decades.',
  },
  complier: {
    law: 'Citizens need only generally comply with the primary rules, perhaps out of fear.',
    theory: 'A reader of the canon who takes its questions as fixed.',
  },
  marginalised: {
    law: 'A system that reflects and perpetuates a dominant perspective and disadvantages the group.',
    theory: 'A challenger who questions how the canon framed its problems.',
  },
  within: {
    law: 'Has the language and position to be part of the system, yet belongs partly outside it.',
    theory: 'Masters the canon yet brings other perspectives to its concepts (Lacey, on the lecture’s reading).',
  },
  visitor: {
    law: 'A foreign system whose laws do not apply: the trivial sense of being external.',
    theory: 'Not a standpoint on any canon: simply elsewhere.',
  },
};

function view(s: S): SimView {
  const [dx, dy] = POS[s.standpoint];
  const L = s.theory
    ? { core: 'THE CANON', mid: 'ITS READERS', edge: 'ITS CHALLENGERS' }
    : { core: 'OFFICIALS', mid: 'CITIZENS', edge: 'THE MARGINALISED' };
  const figure = (
    <svg viewBox={`0 0 ${W} 300`} role="img" aria-label={`A legal system as three rings with a separate foreign system; the marker stands at: ${s.standpoint}`}>
      <circle cx={CX} cy={CY} r="128" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="5 5" />
      <circle cx={CX} cy={CY} r="84" fill="none" stroke="var(--ink-2)" strokeWidth="1.5" />
      <circle cx={CX} cy={CY} r="38" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x={CX} y={CY + 18} textAnchor="middle" {...head}>{L.core}</text>
      <text x={CX} y={CY + 64} textAnchor="middle" {...head}>{L.mid}</text>
      <text x={CX} y={CY + 106} textAnchor="middle" {...head}>{L.edge}</text>
      <circle cx="328" cy="54" r="24" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
      <text x="328" y="96" textAnchor="middle" {...head}>FOREIGN</text>
      <text x="8" y="292" {...body} fontSize={12} fill="var(--ink-2)">{s.theory ? 'legal theory: what is legal theory?' : 'a legal system: what is law?'}</text>
      <g style={{ ...glide, transform: `translate(${dx}px, ${dy}px)` }}>
        <circle cx={CX} cy={CY} r="9" fill="none" stroke="var(--ink)" strokeWidth="2.5" />
        <circle cx={CX} cy={CY} r="3" fill="var(--ink)" />
      </g>
    </svg>
  );
  const sees = s.theory ? SEES[s.standpoint].theory : SEES[s.standpoint].law;
  const reopens = s.standpoint === 'marginalised' || s.standpoint === 'within';
  const verdict =
    s.standpoint === 'visitor'
      ? `${sees} Outsider jurisprudence is not about this outsider.`
      : reopens
        ? `${sees} This is the standpoint outsider jurisprudence takes: it reopens ${s.theory ? '“what is legal theory?”' : '“what is law?”'}.`
        : `${sees} ${s.standpoint === 'official' ? 'An insider’s view.' : 'Inside the jurisdiction, outside the practice: a subject, perhaps a victim.'}`;
  return { figure, verdict, tone: s.standpoint === 'visitor' ? 'no' : reopens ? 'yes' : 'open' };
}

function describe(a: S, b: S) {
  if (a.theory !== b.theory)
    return b.theory
      ? 'Same distinction, applied to legal theory: a canon (analytical jurisprudence) and investigations that challenge it.'
      : 'Back to the legal system: officials, citizens, and those the system marginalises.';
  const moves: Record<Standpoint, string> = {
    official: 'To the centre: officials who accept the rules. Hart needs their acceptance for a legal system to exist.',
    complier: 'To the middle ring: in a dictatorship most people comply out of fear; that is enough for Hart’s second condition.',
    marginalised: 'To the edge: those the system oppresses or marginalises. Some suffer more in family, employment or contract law.',
    within: 'Onto the boundary: the outsider within, part of the system and partly outside it at once.',
    visitor: 'Out of the system altogether: a legal system you have never been subject to.',
  };
  return moves[b.standpoint];
}

export default function OutsiderJurisprudence() {
  return (
    <Simulation<S>
      label="Inside and outside of what? A standpoint moved around a legal system and the canon of legal theory"
      terms={[
        { term: 'Outsider jurisprudence', def: 'An umbrella term for theories (this week, feminist legal theory and critical race theory) written from the standpoint of those law marginalises.' },
        { term: 'Internal point of view', def: 'Hart: the view of those who voluntarily participate in a practice and accept its rules.' },
        { term: 'The canon', def: 'Analytical jurisprudence, which for decades held a special status in English-speaking legal theory.' },
      ]}
      initial={initial}
      controls={[
        {
          key: 'standpoint', label: 'Stand as', type: 'select', options: [
            { value: 'official', label: 'An official who accepts the secondary rules' },
            { value: 'complier', label: 'A citizen who complies out of fear' },
            { value: 'marginalised', label: 'A member of a group the law marginalises' },
            { value: 'within', label: 'The outsider within' },
            { value: 'visitor', label: 'A visitor thinking about a foreign system' },
          ],
        },
        { key: 'theory', label: 'Apply the distinction to legal theory too', type: 'toggle' },
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'Which kind of outsider does the lecture call trivial?',
        options: [
          { text: 'A citizen who complies with the primary rules only out of fear', why: 'This is the lecture’s central case of someone inside the jurisdiction yet outside the practice, perhaps a victim of the system.' },
          { text: 'Someone thinking about a foreign legal system they have never been subject to', correct: true, why: 'Those laws do not apply to them at all; outsider jurisprudence focuses instead on people a system oppresses or marginalises.' },
          { text: 'A member of a group that suffers more under family or employment law', why: 'This is a real outsider position: some members of a community suffer more in some areas of law than others.' },
        ],
      }}
    />
  );
}
