/*
SCENE: Reasonable and known reliance — Shaddock, San Sebastian, Tepko
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → set the statement, its source, its form and the speaker's knowledge → watch two requirements and the
  duty meter → one check
INTENT: Show that a negligent-misstatement duty turns on two questions the three cases answer differently: was the
  reliance known (or responsibility assumed), and was relying on this kind of statement, given this way, reasonable?
SUBJECT: the "your facts" marker on the duty meter; it slides toward the case the facts most resemble.
BEAT 1 (0–100%): selects for the kind of statement and its source, toggles for writing, knowledge and assumption of
  responsibility; the two requirement rows mark met / not met / open; the marker moves along the meter between the
  fixed San Sebastian and Tepko pins (no duty) and the Shaddock pin (duty). Verdict updates within 200ms.
  Ease: marker translateX --dur-ui --ease-inout in full motion only; colour --dur-micro.
CAMERA: none (HTML + SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: calm and off place the marker without sliding; colour changes only (off: instant).
BUDGET: < 6 KB gz, no WebGL.
Source: concept card laws2400-w07-reliance-and-knowledge-shaddock-san-sebastian-tepko; cases
  shaddock-and-associates-pty-ltd-v-parramatta-city-council, san-sebastian-pty-ltd-v-minister,
  tepko-pty-ltd-v-water-board; week spec §3 (Shaddock: only source, phone call alone might not have been enough;
  Mallonland's description of assumption of responsibility).
The meter is a teaching device, not a rule: the "open" states say only what the cases suggest, and the verdict says
  "leans". Information and advice are treated alike (Shaddock).
*/
import { Simulation, type SimView } from '../bases/Simulation';
import { useExplainer } from '../context';

type Kind = 'fact' | 'advice' | 'intention' | 'estimate';

interface S extends Record<string, unknown> {
  kind: Kind;
  source: 'only' | 'many';
  writing: boolean;
  knew: boolean;
  assumed: boolean;
}

/** Shaddock's facts: information from the only source, by phone then certificate, reliance known. */
const initial: S = { kind: 'fact', source: 'only', writing: true, knew: true, assumed: false };

type Mark = 'met' | 'fail' | 'open';
type Lean = 'duty' | 'none' | 'open';

interface Read { known: Mark; knownWhy: string; reasonable: Mark; reasonableWhy: string; lean: Lean; like: 'Shaddock' | 'San Sebastian' | 'Tepko' | null; x: number }

function read(s: S): Read {
  const known: Mark = s.knew || s.assumed ? 'met' : 'fail';
  const knownWhy = s.knew && s.assumed ? 'reliance known, and responsibility assumed'
    : s.knew ? 'the speaker knew or ought to have known it would be relied on'
      : s.assumed ? 'responsibility assumed, though reliance was not known'
        : 'neither known reliance nor an assumption of responsibility (Tepko)';
  let reasonable: Mark;
  let reasonableWhy: string;
  if (s.kind === 'intention') { reasonable = 'fail'; reasonableWhy = 'relying on a mere statement of intention is not reasonable (San Sebastian)'; }
  else if (s.kind === 'estimate') { reasonable = 'fail'; reasonableWhy = 'a reluctant, provisional ball-park estimate (Tepko)'; }
  else if (s.source === 'only' && s.writing) { reasonable = 'met'; reasonableWhy = 'the only source, confirmed in writing (Shaddock)'; }
  else if (s.source === 'only') { reasonable = 'open'; reasonableWhy = 'by phone only: Shaddock suggested the call alone might not have been enough'; }
  else if (s.writing) { reasonable = 'open'; reasonableWhy = 'one source among many: in Shaddock the council was the only source, which made the reliance clear'; }
  else { reasonable = 'open'; reasonableWhy = 'neither the only source nor in writing: weaker than Shaddock on both counts'; }

  if (reasonable === 'fail' || known === 'fail') {
    const like = s.kind === 'intention' ? 'San Sebastian' : 'Tepko';
    return { known, knownWhy, reasonable, reasonableWhy, lean: 'none', like, x: like === 'San Sebastian' ? 36 : 64 };
  }
  if (reasonable === 'met') return { known, knownWhy, reasonable, reasonableWhy, lean: 'duty', like: 'Shaddock', x: 288 };
  const x = s.source === 'only' ? 196 : s.writing ? 172 : 136;
  return { known, knownWhy, reasonable, reasonableWhy, lean: 'open', like: null, x };
}

/** The "your facts" marker: slides in full motion, jumps in calm and off. */
function Marker({ x, tone }: { x: number; tone: Lean }) {
  const { motion } = useExplainer();
  const stroke = tone === 'duty' ? 'var(--sage)' : tone === 'none' ? 'var(--clay)' : 'var(--ink)';
  return (
    <g data-marker style={{ transform: `translateX(${x}px)`, transition: motion === 'full' ? 'transform var(--dur-ui) var(--ease-inout)' : 'none' }}>
      <circle cx="0" cy="44" r="9" fill="var(--paper)" stroke={stroke} strokeWidth="2.5" style={{ transition: 'stroke var(--dur-micro) var(--ease-out)' }} />
      <text x="0" y="24" textAnchor="middle" fontFamily="var(--font-ui)" fontSize="11" fill="var(--ink)">your facts</text>
    </g>
  );
}

function Row({ title, mark, why }: { title: string; mark: Mark; why: string }) {
  const c = mark === 'met' ? 'var(--sage)' : mark === 'fail' ? 'var(--clay)' : 'var(--ink-2)';
  return (
    <li data-state={mark} style={{ display: 'grid', gridTemplateColumns: '1.25rem 1fr', gap: 'var(--s-2)', fontSize: 'var(--t-sm)', lineHeight: 1.35 }}>
      <span aria-hidden="true" style={{ color: c, transition: 'color var(--dur-micro) var(--ease-out)' }}>{mark === 'met' ? '●' : mark === 'fail' ? '✕' : '?'}</span>
      <span>
        <span style={{ display: 'block', color: 'var(--ink)', fontWeight: 600 }}>{title}<span className="visually-hidden">: {mark === 'met' ? 'met' : mark === 'fail' ? 'not met' : 'open'}</span></span>
        <span style={{ display: 'block', fontSize: 'var(--t-xs)', color: 'var(--ink-2)' }}>{why}</span>
      </span>
    </li>
  );
}

const pinText = { fontFamily: 'var(--font-ui)', fontSize: 11, fill: 'var(--ink-2)' } as const;

function view(s: S): SimView {
  const r = read(s);
  const figure = (
    <div className="xgates" role="group" aria-label="Two requirements and a duty meter comparing your facts with Shaddock, San Sebastian and Tepko">
      <svg viewBox="0 0 320 104" role="img" aria-label={`Duty meter: your facts ${r.lean === 'duty' ? 'sit with Shaddock (duty)' : r.lean === 'none' ? `sit with ${r.like} (no duty)` : 'sit between the cases (open)'}`}>
        <line x1="20" y1="44" x2="300" y2="44" stroke="var(--ink-3)" strokeWidth="2" />
        <text x="20" y="10" {...pinText}>no duty</text>
        <text x="300" y="10" textAnchor="end" {...pinText}>duty</text>
        <circle cx="36" cy="44" r="4" fill="var(--ink-3)" />
        <circle cx="64" cy="44" r="4" fill="var(--ink-3)" />
        <circle cx="288" cy="44" r="4" fill="var(--ink-3)" />
        <line x1="36" y1="50" x2="36" y2="66" stroke="var(--ink-3)" strokeWidth="1" />
        <line x1="64" y1="50" x2="64" y2="84" stroke="var(--ink-3)" strokeWidth="1" />
        <text x="40" y="70" {...pinText}>San Sebastian</text>
        <text x="68" y="90" {...pinText}>Tepko</text>
        <line x1="288" y1="50" x2="288" y2="66" stroke="var(--ink-3)" strokeWidth="1" />
        <text x="292" y="70" textAnchor="end" {...pinText}>Shaddock</text>
        <Marker x={r.x} tone={r.lean} />
      </svg>
      <ol style={{ listStyle: 'none', margin: 'var(--s-3) 0 0', padding: 0, display: 'grid', gap: 'var(--s-3)' }}>
        <Row title="Known reliance, or an assumption of responsibility" mark={r.known} why={r.knownWhy} />
        <Row title="Reasonable reliance" mark={r.reasonable} why={r.reasonableWhy} />
      </ol>
      <p style={{ margin: 'var(--s-3) 0 0', fontSize: 'var(--t-xs)', color: 'var(--ink-2)' }}>No request is needed (San Sebastian), and no separate special skill (Shaddock). The meter is a guide; courts weigh the circumstances.</p>
    </div>
  );
  let verdict: string;
  if (r.lean === 'duty') {
    verdict = `Leans to a duty, like Shaddock: ${s.kind === 'advice' ? 'advice' : 'information'} from the only source, confirmed in writing, and ${s.knew ? 'the speaker knew it would be relied on' : 'the speaker assumed responsibility for it'}.`;
  } else if (r.lean === 'none') {
    if (s.kind === 'intention') verdict = `Leans to no duty, like San Sebastian: relying on a mere statement of intention was not reasonable, even if the reliance was genuine${r.known === 'fail' ? '; nor was the reliance known' : ''}.`;
    else if (s.kind === 'estimate') verdict = `Leans to no duty, like Tepko: reliance on a reluctant, provisional estimate was not reasonable${r.known === 'fail' ? ', and the speaker neither knew nor should have known of it' : ''}.`;
    else verdict = 'Leans to no duty, like Tepko: a duty needs known reliance, an assumption of responsibility, or both — neither is here.';
  } else {
    verdict = `Open — argue it: ${r.reasonableWhy}.`;
  }
  return { figure, verdict, tone: r.lean === 'duty' ? 'yes' : r.lean === 'none' ? 'no' : 'open' };
}

const KIND_NOTE: Record<Kind, string> = {
  fact: 'A statement of fact (information): Shaddock — the duty covers information as well as advice.',
  advice: 'Advice: treated like information (Shaddock); the questions are knowledge and reasonable reliance.',
  intention: 'A statement of intention, like the exhibited scheme in San Sebastian: relying on a mere intention was not reasonable.',
  estimate: 'A reluctant “ball-park” estimate, as in Tepko: reliance on a provisional figure was not reasonable.',
};

function describe(a: S, b: S) {
  if (a.kind !== b.kind) return KIND_NOTE[b.kind];
  if (a.source !== b.source) return b.source === 'only' ? 'The speaker is the only source — as the council was in Shaddock.' : 'Other sources were available: Shaddock’s reliance was clear partly because the council was the only source.';
  if (a.writing !== b.writing) return b.writing ? 'Confirmed in writing, like Shaddock’s certificate after the phone call.' : 'Phone call only: in Shaddock the Court suggested the call alone might not have been enough.';
  if (a.knew !== b.knew) return b.knew ? 'The speaker knew, or ought to have known, the statement would be relied on.' : 'The speaker neither knew nor should have known of the reliance — Tepko’s first problem.';
  if (a.assumed !== b.assumed) return b.assumed ? 'The speaker assumed responsibility: Tepko needed known reliance, an assumption of responsibility, or both.' : 'No assumption of responsibility.';
  return '';
}

export default function RelianceAndKnowledgeShaddockSanSebastianTepko() {
  return (
    <Simulation<S>
      label="Reasonable and known reliance across Shaddock, San Sebastian and Tepko"
      terms={[
        { term: 'Negligent misstatement', def: 'Negligent words — information or advice — that cause pure economic loss.' },
        { term: 'Known reliance', def: 'The speaker knew, or ought to have known, the statement would be relied on.' },
        { term: 'Reasonable reliance', def: 'Relying on this statement, given this way, was reasonable in the circumstances.' },
        { term: 'Assumption of responsibility', def: 'An undertaking to take on a task from which acceptance of reasonable care can be inferred (Mallonland).' },
      ]}
      initial={initial}
      controls={[
        {
          key: 'kind', label: 'What kind of statement', type: 'select', options: [
            { value: 'fact', label: 'Information (a fact)' },
            { value: 'advice', label: 'Advice' },
            { value: 'intention', label: 'A statement of intention' },
            { value: 'estimate', label: 'A reluctant ball-park estimate' },
          ],
        },
        { key: 'source', label: 'Where else it could come from', type: 'select', options: [{ value: 'only', label: 'The speaker is the only source' }, { value: 'many', label: 'One of many sources' }] },
        { key: 'writing', label: 'Confirmed in writing (not just a phone call)', type: 'toggle' },
        { key: 'knew', label: 'Speaker knew or ought to have known it would be relied on', type: 'toggle' },
        { key: 'assumed', label: 'Speaker assumed responsibility for it', type: 'toggle' },
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'Developers relied on a council’s publicly exhibited redevelopment scheme, which was later abandoned. Why was there no duty in San Sebastian?',
        options: [
          { text: 'No one had asked the council for the information', why: 'Tempting, since Shaddock began with a request, but San Sebastian holds a duty can arise without any request.' },
          { text: 'It was a statement of intention, and relying on a mere intention was not reasonable', correct: true, why: 'The reliance was genuine, but relying on a statement of intention was not reasonable, so no duty arose.' },
          { text: 'The council did not know the developers would rely on it', why: 'Tempting, because unknown reliance sank Tepko, but San Sebastian failed on the reasonableness of relying on an intention.' },
        ],
      }}
    />
  );
}
