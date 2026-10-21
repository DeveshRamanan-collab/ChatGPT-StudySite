/*
SCENE: Dworkin's doughnut — discretion as the hole left by a belt of standards, and Riggs's principle filling it
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → move discretion from weak to strong, decide whether the principle is law → read the obligation → check
INTENT: If principles like "no one shall profit by his own wrong" are law, discretion is only weak and an obligation
  can come from a constellation of principles; if not, the judge has strong discretion and no obligation exists until
  a new rule is made.
SUBJECT: the hole in the doughnut — its width, and whether principles fill it.
BEAT 1 (0–100%): a select steps discretion weak (judgment) → weak (finality) → strong; a toggle makes the Riggs
  principle law or extra-legal; the hole's radius and the verdict update within 200ms (CSS 180ms ease-out, r only via
  transform scale).
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: identical controls; no motion beyond an opacity/scale change.
BUDGET: < 6 KB gz, no WebGL.
Source: concept laws2100-w05-discretion-riggs-and-obligation; week spec laws2100-w05 (Riggs v Palmer facts);
  authority dworkin-taking-rights-seriously.
*/
import { Simulation, type SimView } from '../bases/Simulation';

interface S extends Record<string, unknown> {
  discretion: 'judgment' | 'finality' | 'strong';
  principleIsLaw: boolean;
}

const initial: S = { discretion: 'strong', principleIsLaw: false };
const W = 360;
const head = { fontFamily: 'var(--font-ui)', fontSize: 11, letterSpacing: 1.2, fill: 'var(--ink-2)' } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 13, fill: 'var(--ink)' } as const;
const HOLE = { judgment: 0.62, finality: 0.62, strong: 1 } as const;
const HOLE_TEXT = { judgment: ['needs', 'judgment'], finality: ['final', 'authority'], strong: ['not bound by', 'standards'] } as const;

function view(s: S): SimView {
  const k = HOLE[s.discretion];
  const filled = s.principleIsLaw;
  const figure = (
    <svg viewBox={`0 0 ${W} 340`} role="img" aria-label={`A doughnut: the ring of standards surrounds a ${s.discretion === 'strong' ? 'wide' : 'narrow'} hole of discretion${filled ? ' filled by principles' : ''}`}>
      <circle cx="180" cy="170" r="130" fill="var(--paper-3)" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="180" y="22" textAnchor="middle" {...head}>BELT OF STANDARDS · RULES</text>
      <g style={{ transform: `scale(${k})`, transformOrigin: '180px 170px', transition: 'transform 180ms var(--ease-out)' }}>
        <circle cx="180" cy="170" r="92" fill="var(--paper)" stroke="var(--ink)" strokeWidth={1.5 / k} />
      </g>
      <circle cx="180" cy="170" r={92 * k - 8} fill="none" stroke="var(--ink-2)" strokeWidth="1.5" strokeDasharray="4 5" opacity={filled ? 1 : 0} style={{ transition: 'opacity 180ms var(--ease-out)' }} />
      {filled
        ? <><text x="180" y="166" textAnchor="middle" {...body}>principles</text><text x="180" y="184" textAnchor="middle" {...body} fontSize={11} fill="var(--ink-2)">no profit by wrong</text></>
        : <><text x="180" y="166" textAnchor="middle" {...body}>{HOLE_TEXT[s.discretion][0]}</text><text x="180" y="184" textAnchor="middle" {...body}>{HOLE_TEXT[s.discretion][1]}</text></>}
      <text x="180" y="330" textAnchor="middle" {...head}>{s.discretion === 'strong' ? 'STRONG DISCRETION' : 'WEAK DISCRETION'}</text>
    </svg>
  );
  if (filled && s.discretion === 'strong')
    return { figure, tone: 'open', verdict: 'These cannot both hold: if the principle binds the judge as law, discretion is only weak. Move the dial to weak.' };
  if (filled)
    return { figure, tone: 'yes', verdict: 'Elmer does not inherit. The obligation is "imposed by a constellation of principles as well as by an established rule" (TRS 44); the first and third tenets fall.' };
  if (s.discretion === 'strong')
    return { figure, tone: 'open', verdict: 'Positivist reading: no rule settles it, so no obligation exists until the judge creates a new rule for the future. The principle is extra-legal (Raz, the realists).' };
  return { figure, tone: 'no', verdict: 'Rules only, weakly applied: literally construed, the statutes give Elmer the property — the minority: the laws are silent, and refusing him would add a punishment.' };
}

function describe(a: S, b: S) {
  if (a.principleIsLaw !== b.principleIsLaw)
    return b.principleIsLaw ? 'The principle is now law: it fills the hole, and controls the judge as a sergeant\'s orders control him.' : 'The principle is now extra-legal: the judge reaches beyond the law when using it.';
  if (b.discretion === 'strong') return 'Strong discretion: on this issue the official "is simply not bound by standards set by the authority in question" (TRS 32).';
  return b.discretion === 'judgment' ? 'Weak discretion: the standards cannot be applied mechanically but demand judgment. Dworkin accepts this sense.' : 'Weak discretion: the official has final authority and cannot be reviewed. Dworkin accepts this sense too.';
}

export default function DiscretionRiggsAndObligation() {
  return (
    <Simulation<S>
      label="Dworkin's doughnut: discretion, the Riggs principle and legal obligation"
      terms={[
        { term: 'Doughnut', def: '"Discretion, like the hole in a doughnut, does not exist except as an area left open by a surrounding belt of restriction" (TRS 31).' },
        { term: 'Weak discretion', def: 'Standards that demand judgment, or final authority that cannot be reviewed.' },
        { term: 'Strong discretion', def: 'The official is not bound by standards set by the authority in question.' },
        { term: 'Riggs v Palmer', def: 'Elmer murdered his grandfather to secure his inheritance under a valid will.' },
      ]}
      initial={initial}
      controls={[
        { key: 'discretion', label: 'Discretion, weak to strong', type: 'select', options: [{ value: 'judgment', label: 'Weak: standards demand judgment' }, { value: 'finality', label: 'Weak: final, unreviewable authority' }, { value: 'strong', label: 'Strong: not bound by standards' }] },
        { key: 'principleIsLaw', label: '"No one shall profit by his own wrong" is law, binding the judge', type: 'toggle' },
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'If the Riggs principle is law, what follows for the positivist tenets?',
        options: [
          { text: 'Nothing: positivists already accept strong discretion', why: 'Strong discretion is what the positivist is forced into when no rule applies — the thing Dworkin denies.' },
          { text: 'The master rule goes, discretion is only weak, and obligation can arise from principles', correct: true, why: 'Principles lack pedigree, fill the hole in the doughnut, and impose obligations as rules do (TRS 44).' },
          { text: 'Judges must create a new rule for the future', why: 'That is the positivist alternative, which applies only if the principle is not law.' },
        ],
      }}
    />
  );
}
