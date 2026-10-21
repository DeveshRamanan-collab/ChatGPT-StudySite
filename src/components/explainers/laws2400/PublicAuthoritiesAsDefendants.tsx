/*
SCENE: Public authorities as defendants — the policy–operations line
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → choose what the complaint attacks → toggle foreseeability and "a power was all there was" → watch the
  marker on the policy–operations line and the verdict → one check
INTENT: Show that a public authority is not an ordinary defendant: foreseeability is always needed but never enough,
  high-level policy (self-regulation, the allocation of limited funds, how crime is investigated) is largely off
  limits, and operational conduct is where a duty becomes arguable (Zalewski) — while a bare power is not a duty
  (Stuart v Kirkland-Veenstra).
SUBJECT: the "the complaint" marker on the line from core policy to operations; it sits at the decision attacked.
BEAT 1 (0–100%): a select picks the decision under attack; two toggles; the marker jumps to its pin and the verdict
  updates within 200ms. Ease: marker translateX --dur-ui --ease-inout in full motion only; colour --dur-micro.
CAMERA: none (HTML + SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: calm and off place the marker without sliding; colour only (off: instant).
BUDGET: < 6 KB gz, no WebGL.
Source: concept card laws2400-w08-public-authorities-as-defendants; week spec §2 (policy and operations as the
  lecturer explained them; Heyman as the lecture describes it); cases hill-v-chief-constable-of-west-yorkshire,
  zalewski-v-turcarolo, stuart-v-kirkland-veenstra (verify: true on the cards — used only as the slides state them),
  sutherland-shire-council-v-heyman, graham-barclay-oysters-v-ryan.
The line is a teaching device: the verdicts say "off limits", "starting point" or "arguable", never "liable".
*/
import { Simulation, type SimView } from '../bases/Simulation';
import { useExplainer } from '../context';

type Kind = 'self-regulation' | 'budget' | 'investigation' | 'inspection' | 'response';

interface S extends Record<string, unknown> {
  kind: Kind;
  foreseeable: boolean;
  powerOnly: boolean;
}

const initial: S = { kind: 'self-regulation', foreseeable: true, powerOnly: false };

/** x on a 320-wide line: left = core policy, right = operations. */
const X: Record<Kind, number> = { 'self-regulation': 34, budget: 82, investigation: 138, inspection: 226, response: 286 };

const LABEL: Record<Kind, string> = {
  'self-regulation': 'letting an industry self-regulate',
  budget: 'where limited funds go',
  investigation: 'how crime is investigated',
  inspection: 'how an inspection is carried out',
  response: 'how a police response is carried out',
};

type Tone = SimView['tone'];

function read(s: S): { verdict: string; tone: Tone } {
  if (!s.foreseeable) return { verdict: 'No duty: reasonable foreseeability is always needed — and for a public authority it is never enough on its own.', tone: 'no' };
  if (s.powerOnly) return { verdict: 'Not enough: a statutory power to intervene is not of itself a duty to exercise it (Stuart v Kirkland-Veenstra).', tone: 'no' };
  switch (s.kind) {
    case 'self-regulation':
      return { verdict: 'Pretty much off limits: a high-level policy choice, like letting the oyster industry regulate itself (Graham Barclay Oysters), is the executive’s job.', tone: 'no' };
    case 'budget':
      return { verdict: 'Off limits: a court telling the executive where to spend limited public funds raises the separation of powers.', tone: 'no' };
    case 'investigation':
      return { verdict: 'Starting point: no duty to individual members of the public in investigating and suppressing crime (Hill) — conflicting responsibilities, resources, defensive policing.', tone: 'no' };
    case 'inspection':
      return { verdict: 'Operational, so more arguable — but hurdles remain: in the lecture’s account of Heyman, no duty was held because there was no reliance.', tone: 'open' };
    default:
      return { verdict: 'Arguable duty: negligent operational police conduct can attract a duty (Zalewski v Turcarolo) — Hill is not an immunity.', tone: 'yes' };
  }
}

function Marker({ x, tone }: { x: number; tone: Tone }) {
  const { motion } = useExplainer();
  const stroke = tone === 'yes' ? 'var(--sage)' : tone === 'no' ? 'var(--clay)' : 'var(--ink)';
  return (
    <g data-marker style={{ transform: `translateX(${x}px)`, transition: motion === 'full' ? 'transform var(--dur-ui) var(--ease-inout)' : 'none' }}>
      <circle cx="0" cy="48" r="9" fill="var(--paper)" stroke={stroke} strokeWidth="2.5" style={{ transition: 'stroke var(--dur-micro) var(--ease-out)' }} />
      {/* Near either end of the 320-wide line the label anchors inward so it stays inside the figure. */}
      <text x={x < 60 ? -9 : x > 260 ? 9 : 0} y="28" textAnchor={x < 60 ? 'start' : x > 260 ? 'end' : 'middle'} fontFamily="var(--font-ui)" fontSize="11" fill="var(--ink)">the complaint</text>
    </g>
  );
}

const pin = { fontFamily: 'var(--font-ui)', fontSize: 11, fill: 'var(--ink-2)' } as const;

function view(s: S): SimView {
  const r = read(s);
  const figure = (
    <div role="group" aria-label="A line from core policy to operational conduct, with the complaint marked on it">
      <svg viewBox="0 0 320 112" role="img" aria-label={`The complaint attacks ${LABEL[s.kind]}: ${s.kind === 'inspection' || s.kind === 'response' ? 'the operational end' : 'the policy end'} of the line`}>
        <line x1="20" y1="48" x2="300" y2="48" stroke="var(--ink-3)" strokeWidth="2" />
        <text x="20" y="12" {...pin}>core policy</text>
        <text x="300" y="12" textAnchor="end" {...pin}>operations</text>
        {(Object.keys(X) as Kind[]).map((k) => <circle key={k} cx={X[k]} cy="48" r="4" fill="var(--ink-3)" />)}
        <line x1={X.investigation} y1="54" x2={X.investigation} y2="72" stroke="var(--ink-3)" strokeWidth="1" />
        <text x={X.investigation} y="86" textAnchor="middle" {...pin}>Hill</text>
        <line x1={X.response} y1="54" x2={X.response} y2="72" stroke="var(--ink-3)" strokeWidth="1" />
        <text x={X.response} y="86" textAnchor="middle" {...pin}>Zalewski</text>
        <line x1={X['self-regulation']} y1="54" x2={X['self-regulation']} y2="92" stroke="var(--ink-3)" strokeWidth="1" />
        <text x={X['self-regulation'] - 4} y="106" {...pin}>Graham Barclay</text>
        <Marker x={X[s.kind]} tone={r.tone} />
      </svg>
      <p style={{ margin: 'var(--s-3) 0 0', fontSize: 'var(--t-sm)', color: 'var(--ink)' }}>
        Attacking: <strong>{LABEL[s.kind]}</strong>
      </p>
      <p style={{ margin: 'var(--s-2) 0 0', fontSize: 'var(--t-xs)', color: 'var(--ink-2)' }}>
        Policy is the high-level approach; operations are how it is carried out. The further right, the more arguable a
        duty — but foreseeability is never enough on its own.
      </p>
    </div>
  );
  return { figure, verdict: r.verdict, tone: r.tone };
}

const NOTE: Record<Kind, string> = {
  'self-regulation': 'A high-level policy choice: the State’s decision to let an industry regulate itself.',
  budget: 'The allocation of limited resources — the lecturer’s biggest reason authorities are treated differently.',
  investigation: 'Investigating and suppressing crime: the Hill starting point for police.',
  inspection: 'Carrying a policy out on the ground: operational, the end where a duty is more arguable.',
  response: 'An operational police response, as in Zalewski v Turcarolo (a police shooting during a response).',
};

function describe(a: S, b: S) {
  if (a.kind !== b.kind) return NOTE[b.kind];
  if (a.foreseeable !== b.foreseeable) return b.foreseeable ? 'Harm foreseeable: always needed, but for a public authority never sufficient.' : 'Not foreseeable: no duty, whoever the defendant is.';
  if (a.powerOnly !== b.powerOnly) return b.powerOnly ? 'The only argument is that the authority could have used its power: a power is not a duty.' : 'More than a bare power is argued: control, knowledge, vulnerability.';
  return '';
}

export default function PublicAuthoritiesAsDefendants() {
  return (
    <Simulation<S>
      label="Where a complaint against a public authority sits on the line from policy to operations"
      terms={[
        { term: 'Public authority', def: 'A body created by statute to perform public functions or act in the public interest.' },
        { term: 'Policy', def: 'The high-level approach (“this is our approach”) — pretty much off limits for a duty.' },
        { term: 'Operations', def: 'How the policy is carried out — negligence here is more arguable, with hurdles.' },
        { term: 'Separation of powers', def: 'Courts should not tell the executive how to allocate its limited funds.' },
      ]}
      initial={initial}
      controls={[
        {
          key: 'kind', label: 'What the complaint attacks', type: 'select', options: [
            { value: 'self-regulation', label: 'Letting an industry self-regulate' },
            { value: 'budget', label: 'Where limited funds were spent' },
            { value: 'investigation', label: 'How police investigated a crime' },
            { value: 'inspection', label: 'How an inspection was carried out' },
            { value: 'response', label: 'How a police response was carried out' },
          ],
        },
        { key: 'foreseeable', label: 'Harm was reasonably foreseeable', type: 'toggle' },
        { key: 'powerOnly', label: 'The only argument: the authority had a power and did not use it', type: 'toggle' },
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'Police carry out an operational response carelessly and a man is shot. Does Hill v Chief Constable of West Yorkshire rule out a duty?',
        options: [
          { text: 'Yes — Hill gives police immunity for everything they do on duty', why: 'Tempting, but the slide says Hill is “not an immunity”; it is the starting point for investigating crime.' },
          { text: 'No — Hill is a starting point for investigating crime; operational conduct can attract a duty (Zalewski)', correct: true, why: 'Zalewski v Turcarolo found a duty for a police shooting during an operational response.' },
          { text: 'No — any foreseeable harm caused by a public authority creates a duty', why: 'Foreseeability is always needed but never enough for a public authority; the operational character does the work.' },
        ],
      }}
    />
  );
}
