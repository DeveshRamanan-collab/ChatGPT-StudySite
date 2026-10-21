/*
SCENE: Trespass — fault and the onus of proof
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → set the defendant's state of mind and the setting → watch the fault dial and the onus arrow → one check
INTENT: Show that trespass needs fault (intention, recklessness or negligence), and that once the plaintiff proves a
  direct interference the onus shifts to the defendant to disprove fault — except on the highway, and never in case.
SUBJECT: the onus arrow between plaintiff and defendant; it flips to point at whoever must deal with fault.
BEAT 1 (0–100%): a select sets the state of mind (the dial lights one segment, bracketed subjective / objective);
  selects for the action and the setting flip the arrow; the verdict updates within 200ms.
  Ease: CSS 240ms ease-in-out on the arrow's transform, 180ms ease-out on colour.
CAMERA: none (HTML + small SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: final states only (bases handle calm/off); no positional movement beyond the arrow flip.
BUDGET: < 6 KB gz, no WebGL.
Source: concept card laws2400-w01-trespass-fault-and-onus only (no cases or authorities linked).
*/
import { Simulation, type SimView } from '../bases/Simulation';

interface S extends Record<string, unknown> {
  action: 'trespass' | 'case';
  setting: 'ordinary' | 'highway';
  mind: 'intention' | 'recklessness' | 'negligence' | 'none';
  mistaken: boolean;
}

const initial: S = { action: 'trespass', setting: 'ordinary', mind: 'intention', mistaken: false };

const SEGMENTS: { id: S['mind']; label: string }[] = [
  { id: 'intention', label: 'Intention' },
  { id: 'recklessness', label: 'Recklessness' },
  { id: 'negligence', label: 'Negligence' },
  { id: 'none', label: 'No fault' },
];

/** Who must deal with fault: the plaintiff proves it, or the defendant disproves it. */
function onusOn(s: S): 'plaintiff' | 'defendant' {
  if (s.action === 'case') return 'plaintiff';
  return s.setting === 'highway' ? 'plaintiff' : 'defendant';
}

const party = (name: string, bears: boolean, task: string) => (
  <div
    data-bears={bears ? 'true' : undefined}
    style={{
      padding: 'var(--s-3)', borderRadius: 'var(--r-md)', background: 'var(--paper)', textAlign: 'center',
      border: bears ? '2px solid var(--ink)' : '1px solid var(--line)', transition: 'border-color 180ms var(--ease-out)',
    }}
  >
    <p style={{ margin: 0, fontWeight: 600, color: 'var(--ink)' }}>{name}</p>
    <p style={{ margin: 'var(--s-1) 0 0', fontSize: 'var(--t-xs)', lineHeight: 1.3, color: bears ? 'var(--ink)' : 'var(--ink-3)' }}>{task}</p>
  </div>
);

function view(s: S): SimView {
  const on = onusOn(s);
  const fault = s.mind !== 'none';
  const figure = (
    <div className="xgates" role="group" aria-label="Fault dial and onus of proof">
      <p className="label" style={{ margin: '0 0 var(--s-2)' }}>Fault: the defendant’s state of mind</p>
      <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 'var(--s-1)' }}>
        {SEGMENTS.map((g) => {
          const lit = s.mind === g.id;
          return (
            <li
              key={g.id}
              data-lit={lit ? 'true' : undefined}
              style={{
                padding: 'var(--s-2) var(--s-1)', textAlign: 'center', fontSize: 'var(--t-xs)', borderRadius: 'var(--r-sm)',
                background: lit ? 'var(--paper-3)' : 'var(--paper)', color: lit ? 'var(--ink)' : 'var(--ink-3)',
                border: `1.5px ${g.id === 'none' ? 'dashed' : 'solid'} ${lit ? 'var(--ink)' : 'var(--line)'}`,
                transition: 'border-color 180ms var(--ease-out), background-color 180ms var(--ease-out)',
              }}
            >
              {g.label}
            </li>
          );
        })}
      </ol>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 'var(--s-1)', marginTop: 'var(--s-1)', fontSize: 'var(--t-xs)', color: 'var(--ink-2)' }}>
        <span style={{ gridColumn: 'span 2', borderTop: '1px solid var(--ink-3)', paddingTop: 2, textAlign: 'center' }}>subjective: the defendant’s own mind</span>
        <span style={{ borderTop: '1px solid var(--ink-3)', paddingTop: 2, textAlign: 'center' }}>objective: reasonable person</span>
      </div>

      <p className="label" style={{ margin: 'var(--s-5) 0 var(--s-2)' }}>Onus of proof on fault</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 64px 1fr', alignItems: 'center', gap: 'var(--s-2)' }}>
        {party('Plaintiff', on === 'plaintiff', on === 'plaintiff' ? 'must prove the defendant’s fault' : 'proves only the direct interference')}
        <svg viewBox="0 0 64 24" width="64" height="24" aria-hidden="true">
          <g style={{ transformOrigin: '32px 12px', transform: on === 'plaintiff' ? 'scaleX(-1)' : 'scaleX(1)', transition: 'transform 240ms var(--ease-inout)' }}>
            <line x1="6" y1="12" x2="54" y2="12" stroke="var(--ink)" strokeWidth="2" />
            <path d="M46 5 L56 12 L46 19" fill="none" stroke="var(--ink)" strokeWidth="2" />
          </g>
        </svg>
        {party('Defendant', on === 'defendant', on === 'defendant' ? 'must disprove fault (eg inevitable accident)' : 'need not disprove fault')}
      </div>
      <p style={{ margin: 'var(--s-2) 0 0', fontSize: 'var(--t-xs)', color: 'var(--ink-2)' }}>
        {s.action === 'case' ? 'Action on the case: the plaintiff always bears the onus.' : s.setting === 'highway' ? 'Highway exception: road users accept some risk, so the plaintiff bears the onus.' : 'Trespass off the highway: the onus shifts once the interference is proved.'}
      </p>
    </div>
  );

  const who = on === 'plaintiff' ? 'the plaintiff must prove it' : 'the defendant must disprove it';
  let verdict: string;
  if (!fault) {
    verdict = on === 'defendant'
      ? 'No fault: the claim fails, but only if the defendant proves it — typically as an inevitable accident.'
      : 'No fault: the claim fails, because the plaintiff cannot prove the fault they must prove.';
  } else if (s.mind === 'intention') {
    verdict = `Fault present: intention as to the act (subjective)${s.mistaken ? ' — a mistake about who was touched is no defence' : ''}; on fault, ${who}.`;
  } else if (s.mind === 'recklessness') {
    verdict = `Fault present: recklessness (subjective) — consequences so likely they are taken to be foreseen. On fault, ${who}.`;
  } else {
    verdict = `Fault present: negligence (objective, reasonable-person standard) — rare in trespass now; usually sued in negligence. On fault, ${who}.`;
  }
  return { figure, verdict, tone: fault ? 'yes' : 'no' };
}

function describe(a: S, b: S) {
  if (a.action !== b.action) return b.action === 'case' ? 'Action on the case: the plaintiff always bears the onus of proving fault.' : 'Trespass: the plaintiff proves the direct interference; the onus on fault can then shift.';
  if (a.setting !== b.setting) return b.setting === 'highway' ? 'Harm from use of the highway: the onus stays with the plaintiff to prove fault.' : 'Off the highway: in trespass the defendant must now disprove fault.';
  if (a.mind !== b.mind) {
    if (b.mind === 'intention') return 'Intention: needed only as to performing the act, not its consequences.';
    if (b.mind === 'recklessness') return 'Recklessness: the consequences were so likely the defendant is taken to have foreseen them. Rare.';
    if (b.mind === 'negligence') return 'Negligence: judged objectively, by a reasonable person in the defendant’s position.';
    return 'No fault: an inevitable accident. Trespass requires fault, so it fails.';
  }
  if (a.mistaken !== b.mistaken) return b.mistaken ? 'Mistaken identity (thought it was their partner): still an intentional act; the mistake is no defence.' : 'No mistake about who was touched.';
  return '';
}

export default function TrespassFaultAndOnus() {
  return (
    <Simulation<S>
      label="Fault in trespass and who bears the onus of proving it"
      terms={[
        { term: 'Fault', def: 'Intention, recklessness or negligence accompanying the direct interference.' },
        { term: 'Subjective / objective', def: 'Intention and recklessness look at the defendant’s own mind; negligence at a reasonable person.' },
        { term: 'Onus of proof', def: 'Which party must prove (or disprove) a matter to win on it.' },
        { term: 'Inevitable accident', def: 'The usual way a defendant disproves fault once the onus shifts.' },
      ]}
      initial={initial}
      controls={[
        { key: 'action', label: 'Form of action', type: 'select', options: [{ value: 'trespass', label: 'Trespass' }, { value: 'case', label: 'Action on the case' }] },
        { key: 'setting', label: 'Where the harm arose', type: 'select', options: [{ value: 'ordinary', label: 'Off the highway' }, { value: 'highway', label: 'Out of use of the highway' }] },
        { key: 'mind', label: 'Defendant’s state of mind', type: 'select', options: SEGMENTS.map((g) => ({ value: g.id, label: g.label })) },
        { key: 'mistaken', label: 'Defendant touched the plaintiff mistakenly believing it was their partner', type: 'toggle' },
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'A plaintiff proves a direct interference in trespass, away from the highway. Who must deal with fault?',
        options: [
          { text: 'The plaintiff must prove intention, recklessness or negligence', why: 'That is the position on the highway, or in an action on the case — not ordinary trespass.' },
          { text: 'The defendant must disprove fault, eg by proving inevitable accident', correct: true, why: 'Once the direct interference is proved, the onus shifts to the defendant to disprove fault.' },
          { text: 'No one: trespass is actionable without fault', why: 'Trespass requires fault; the question is only who bears the onus on it.' },
        ],
      }}
    />
  );
}
