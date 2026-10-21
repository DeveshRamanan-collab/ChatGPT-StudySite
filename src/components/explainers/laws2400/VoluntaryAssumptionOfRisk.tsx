/*
SCENE: Voluntary assumption of risk — the specific risk and three gates the defendant must prove
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → change the facts → watch the path through the gates → one check
INTENT: Show that volenti is narrow: confined to the specific risk that materialised, and proved only when the
  plaintiff perceived it, fully appreciated its nature and extent, and voluntarily accepted it — then it is complete.
SUBJECT: the path down the left spine; any "no" sends the case out to the right (defence fails, claim continues).
BEAT 1 (0–100%): the "which risk?" select and three toggles; passed gates turn sage, the stopping gate clay, later
  gates dashed; verdict within 200ms. Colour transitions 180ms ease-out only.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: identical (colour changes only).
BUDGET: < 8 KB gz, no WebGL.
Source: Tort Law Principles 3e p 479 flowchart (Banovic v Perkovic; Carey v Lake Macquarie City Council; ICI v
  Shatwell); concept laws2400-w12-voluntary-assumption-of-risk. Whether each gate is met is the court's finding,
  recorded as a toggle.
*/
import { Simulation, type SimView } from '../bases/Simulation';

interface S extends Record<string, unknown> {
  risk: 'specific' | 'general';
  perceived: boolean;
  appreciated: boolean;
  accepted: boolean;
}

const initial: S = { risk: 'general', perceived: true, appreciated: true, accepted: true };

type Stop = 'scope' | 'g1' | 'g2' | 'g3' | 'end';
interface Gate { id: Exclude<Stop, 'end'>; tag: string; q: string[]; out: string }

const GATES: Gate[] = [
  { id: 'scope', tag: 'WHICH RISK?', q: ['The specific risk that', 'materialised?'], out: 'defence fails' },
  { id: 'g1', tag: 'PERCEIVED', q: ['Plaintiff perceived', 'the risk existed?'], out: 'defence fails' },
  { id: 'g2', tag: 'FULLY APPRECIATED', q: ['Its nature, extent and', 'likely manifestation?'], out: 'defence fails' },
  { id: 'g3', tag: 'VOLUNTARILY ACCEPTED', q: ['Accepted that specific', 'risk materialising?'], out: 'defence fails' },
];
const ORDER: Stop[] = ['scope', 'g1', 'g2', 'g3', 'end'];
const ui = { fontFamily: 'var(--font-ui)' } as const;

function stopAt(s: S): Stop {
  if (s.risk === 'general') return 'scope';
  if (!s.perceived) return 'g1';
  if (!s.appreciated) return 'g2';
  if (!s.accepted) return 'g3';
  return 'end';
}

function view(s: S): SimView {
  const stop = stopAt(s);
  const at = ORDER.indexOf(stop);
  const figure = (
    <svg viewBox="0 0 360 404" role="img" style={{ maxWidth: 440, margin: '0 auto' }}
      aria-label={stop === 'end' ? 'All gates passed on the specific risk: volenti is a complete defence.' : `The case leaves at ${GATES[at].tag.toLowerCase()}: ${GATES[at].out}.`}>
      {GATES.map((g, i) => {
        const y = 8 + i * 82;
        const state = i < at ? 'pass' : i === at ? 'stop' : 'idle';
        const stroke = state === 'pass' ? 'var(--sage)' : state === 'stop' ? 'var(--clay)' : 'var(--ink-3)';
        return (
          <g key={g.id} data-gate={g.id} data-state={state}>
            <rect x="8" y={y} width="206" height="62" rx="10" fill="var(--paper)" stroke={stroke} strokeWidth={state === 'stop' ? 2.5 : 1.5}
              strokeDasharray={state === 'idle' ? '4 3' : undefined} style={{ transition: 'stroke 180ms var(--ease-out)' }} />
            <text x="20" y={y + 20} {...ui} fontSize="11" letterSpacing="1" fill="var(--ink-2)">{g.tag}</text>
            {g.q.map((l, k) => <text key={k} x="20" y={y + 38 + k * 16} {...ui} fontSize="12.5" fill="var(--ink)">{l}</text>)}
            <line x1="214" y1={y + 31} x2="232" y2={y + 31} stroke={state === 'stop' ? 'var(--clay)' : 'var(--ink-3)'} strokeWidth="1.5" />
            <text x="238" y={y + 27} {...ui} fontSize="11" fill="var(--ink-2)">no</text>
            <text x="238" y={y + 43} {...ui} fontSize="12" fontWeight={state === 'stop' ? 600 : 400} fill={state === 'stop' ? 'var(--ink)' : 'var(--ink-2)'}>{g.out}</text>
            <line x1="40" y1={y + 62} x2="40" y2={y + 82} stroke={i < at ? 'var(--sage)' : 'var(--line)'} strokeWidth="3" />
            <text x="48" y={y + 76} {...ui} fontSize="11" fill="var(--ink-2)">yes</text>
          </g>
        );
      })}
      <g data-gate="end" data-state={stop === 'end' ? 'stop' : 'idle'}>
        <rect x="8" y="336" width="344" height="60" rx="12" fill="var(--paper)" stroke={stop === 'end' ? 'var(--ink)' : 'var(--ink-3)'}
          strokeWidth={stop === 'end' ? 2.5 : 1.5} strokeDasharray={stop === 'end' ? undefined : '4 3'} />
        <text x="20" y="360" {...ui} fontSize="11" letterSpacing="1" fill="var(--ink-2)">VOLENTI ESTABLISHED</text>
        <text x="20" y="381" {...ui} fontSize="13" fill="var(--ink)">A complete defence: the claim is defeated</text>
      </g>
    </svg>
  );
  const verdict = {
    scope: 'Volenti fails: the defence is narrowly confined to the specific risk and does not extend to an awareness of the general nature of the risk.',
    g1: 'Volenti fails: the defendant has not shown the plaintiff even perceived the existence of the risk.',
    g2: 'Volenti fails: the plaintiff did not fully appreciate the nature and likely manifestation of the risk (Banovic v Perkovic; Carey).',
    g3: 'Volenti fails: no acceptance of that specific risk materialising — effective knowledge needs more than awareness (Carey; ICI v Shatwell).',
    end: 'Volenti established: perceived, fully appreciated and voluntarily accepted the specific risk. A complete defence — the claim fails.',
  }[stop];
  return { figure, verdict, tone: stop === 'end' ? 'no' : 'yes' };
}

function describe(a: S, b: S) {
  if (a.risk !== b.risk) return b.risk === 'specific' ? 'Now the plaintiff knew of the specific risk that materialised: the three gates decide it.' : 'Only the general nature of the risk was known: the defence stops at once, whatever else is true.';
  if (a.perceived !== b.perceived) return b.perceived ? 'The plaintiff perceived the risk — necessary, but "not only" that: two gates remain.' : 'Not perceived: the defendant cannot get past the first gate.';
  if (a.appreciated !== b.appreciated) return b.appreciated ? 'Full appreciation of its nature and likely manifestation (Banovic; Carey).' : 'Perceiving a risk is not fully appreciating its nature and extent: the defence fails here.';
  if (a.accepted !== b.accepted) return b.accepted ? 'Voluntary acceptance of that risk materialising (Carey; ICI v Shatwell).' : 'Knowing is not accepting: without acceptance of the risk materialising, volenti fails.';
  return '';
}

export default function VoluntaryAssumptionOfRisk() {
  return (
    <Simulation<S>
      label="Voluntary assumption of risk: the specific risk and three gates"
      terms={[
        { term: 'Volenti non fit injuria', def: 'Voluntary assumption of risk: a complete defence to negligence.' },
        { term: 'Specific risk', def: 'The risk that materialised — the defence does not reach the general nature of the risk.' },
        { term: 'Effective knowledge', def: 'More than knowing a risk exists: an acceptance of its materialisation (Carey; ICI v Shatwell).' },
      ]}
      initial={initial}
      controls={[
        { key: 'risk', label: 'What the plaintiff knew about', type: 'select', options: [{ value: 'general', label: 'Only the general nature of the risk' }, { value: 'specific', label: 'The specific risk that materialised' }] },
        { key: 'perceived', label: 'Perceived that the risk existed', type: 'toggle' },
        { key: 'appreciated', label: 'Fully appreciated its nature, extent and likely manifestation', type: 'toggle' },
        { key: 'accepted', label: 'Voluntarily accepted that risk materialising', type: 'toggle' },
      ]}
      view={view}
      describe={describe}
      check={{
        question: "Jai knew quad bikes can roll. His bike's negligently maintained brakes fail on a hill. Does volenti defeat his claim?",
        options: [
          { text: 'Yes: he knew quad biking was dangerous', why: 'Awareness of the general nature of the risk is exactly what the defence does not extend to.' },
          { text: 'No: he never accepted the specific risk of brake failure', correct: true, why: 'Volenti is confined to the specific risk that materialised; he did not perceive, appreciate or accept brake failure.' },
          { text: 'Partly: his damages are reduced', why: 'Volenti is a complete defence or nothing; partial reductions belong to contributory negligence.' },
        ],
      }}
    />
  );
}
