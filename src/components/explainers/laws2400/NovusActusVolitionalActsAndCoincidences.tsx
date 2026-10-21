/*
SCENE: New intervening acts — volitional conduct and coincidence (Topic 11 flowchart, Tort Law Principles 3e p 437)
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → choose the later event → set the two coincidence facts → watch the chain hold or snap → one check
INTENT: Show that, once 'but for' causation is established, a later event ordinarily severs the chain only if it is
  voluntary (volitional) human action or a causally independent, extremely unlikely coincidence — and that later
  negligence belongs to a different branch.
SUBJECT: the middle link of the chain from the defendant's negligence to the harm; it stays whole or opens a gap.
BEAT 1 (0–100%): a select sets the later event; two toggles set "causally independent" and "extremely unlikely";
  the two limbs light as met / not met and the verdict names the matching case group within 200ms. Ease: colour and
  opacity only, --dur-micro --ease-out; no positional movement.
CAMERA: none (2D SVG + HTML list). LIGHT: none. SOUND: none.
REDUCED MOTION: identical minus the fades (durations are tokens).
BUDGET: < 7 KB gz, no WebGL.
Source: concept laws2400-w11-novus-actus-volitional-acts-and-coincidences; flowchart p 437 (The Oropesa; Haber v
  Walker; the volitional "severed" group and the non-volitional "did not sever" group). The flowchart says the act
  must "ordinarily" be one of the two kinds, so verdicts say "ordinarily" / "likely". No case facts are shown: the
  materials give none.
*/
import { Simulation, type SimView } from '../bases/Simulation';

type Event = 'volitional' | 'nonvolitional' | 'natural' | 'negligent';

interface S extends Record<string, unknown> {
  event: Event;
  independent: boolean;
  unlikely: boolean;
}

const initial: S = { event: 'volitional', independent: false, unlikely: false };

const EVENT_LABEL: Record<Event, string> = {
  volitional: 'a deliberate, volitional act',
  nonvolitional: 'a non-volitional reaction',
  natural: 'a natural event',
  negligent: 'someone’s later negligence',
};

const T = 'stroke var(--dur-micro) var(--ease-out), opacity var(--dur-micro) var(--ease-out), fill var(--dur-micro) var(--ease-out)';
const ui = { fontFamily: 'var(--font-ui)' } as const;

function outcome(s: S): { state: 'snap' | 'hold' | 'other'; limb: 0 | 1 | 2 } {
  if (s.event === 'negligent') return { state: 'other', limb: 0 };
  if (s.event === 'volitional') return { state: 'snap', limb: 1 };
  if (s.independent && s.unlikely) return { state: 'snap', limb: 2 };
  return { state: 'hold', limb: 0 };
}

function Chain({ s, state }: { s: S; state: 'snap' | 'hold' | 'other' }) {
  const snap = state === 'snap';
  const linkStroke = snap ? 'var(--clay)' : state === 'hold' ? 'var(--sage)' : 'var(--ink-3)';
  return (
    <svg viewBox="0 0 340 150" role="img" aria-label={`Chain from the defendant's negligence to the harm, with ${EVENT_LABEL[s.event]} intervening: ${snap ? 'the chain is broken' : state === 'hold' ? 'the chain holds' : 'a different branch decides'}`}>
      {/* Defendant's negligence */}
      <rect x="4" y="44" width="92" height="46" rx="8" fill="var(--paper)" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="50" y="63" textAnchor="middle" {...ui} fontSize="12" fill="var(--ink)">defendant’s</text>
      <text x="50" y="79" textAnchor="middle" {...ui} fontSize="12" fill="var(--ink)">negligence</text>
      {/* Harm */}
      <rect x="244" y="44" width="92" height="46" rx="8" fill="var(--paper)" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="290" y="63" textAnchor="middle" {...ui} fontSize="12" fill="var(--ink)">plaintiff’s</text>
      <text x="290" y="79" textAnchor="middle" {...ui} fontSize="12" fill="var(--ink)">harm</text>
      {/* The chain: three links; the middle one opens when the chain is severed */}
      <rect x="100" y="58" width="44" height="18" rx="9" fill="none" stroke={linkStroke} strokeWidth="2.5" style={{ transition: T }} />
      <rect x="196" y="58" width="44" height="18" rx="9" fill="none" stroke={linkStroke} strokeWidth="2.5" style={{ transition: T }} />
      <rect x="148" y="58" width="44" height="18" rx="9" fill="none" stroke={linkStroke} strokeWidth="2.5" style={{ opacity: snap ? 0 : 1, transition: T }} />
      <path d="M150 58 q-2 9 4 18 M190 58 q2 9 -4 18" fill="none" stroke="var(--clay)" strokeWidth="2.5" style={{ opacity: snap ? 1 : 0, transition: T }} />
      {/* The later event drops onto the middle link */}
      <line x1="170" y1="22" x2="170" y2="54" stroke="var(--ink-2)" strokeWidth="1.5" strokeDasharray="3 3" />
      <text x="170" y="14" textAnchor="middle" {...ui} fontSize="12" fill="var(--ink)">later: {EVENT_LABEL[s.event]}</text>
      <text x="170" y="112" textAnchor="middle" {...ui} fontSize="12" fill="var(--ink-2)">
        {snap ? 'chain broken: outside the scope of liability' : state === 'hold' ? 'chain holds' : 'go to the negligent-acts branch'}
      </text>
      <text x="170" y="134" textAnchor="middle" {...ui} fontSize="11" fill="var(--ink-3)">‘but for’ causation is assumed throughout</text>
    </svg>
  );
}

function view(s: S): SimView {
  const o = outcome(s);
  const limb1 = s.event === 'volitional';
  const limb2 = s.independent && s.unlikely;
  const limbs = [
    { k: 'limb1', title: 'Voluntary human action', sub: 'conduct which is ‘volitional’', met: limb1 },
    { k: 'limb2', title: 'Extremely unlikely coincidence', sub: 'causally independent and extremely unlikely (Haber v Walker)', met: limb2 },
  ];
  const off = s.event === 'negligent';
  const figure = (
    <div role="group" aria-label="The chain of causation and the two ways an intervening act can sever it" style={{ fontFamily: 'var(--font-ui)' }}>
      <Chain s={s} state={o.state} />
      <p className="label" style={{ margin: 'var(--s-3) 0 var(--s-2)' }}>To sever the chain, the act must ordinarily be</p>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 'var(--s-2)' }}>
        {limbs.map((l, i) => (
          <li key={l.k} data-limb={l.k} data-met={!off && l.met ? 'true' : undefined}
            style={{ display: 'grid', gridTemplateColumns: '1.25rem 1fr', gap: 'var(--s-2)', fontSize: 'var(--t-sm)', lineHeight: 1.35, color: off ? 'var(--ink-3)' : 'var(--ink)', transition: 'color var(--dur-micro) var(--ease-out)' }}>
            <span aria-hidden="true" style={{ color: !off && l.met ? 'var(--ink)' : 'var(--ink-3)', transition: 'color var(--dur-micro) var(--ease-out)' }}>{!off && l.met ? '●' : '○'}</span>
            <span>
              <span style={{ display: 'block' }}>{i === 0 ? '' : 'or '}{l.title}</span>
              <span style={{ display: 'block', fontSize: 'var(--t-xs)', color: 'var(--ink-2)' }}>{l.sub} · {off ? 'not this branch' : l.met ? 'met' : 'not met'}</span>
            </span>
          </li>
        ))}
      </ul>
      <p style={{ margin: 'var(--s-3) 0 0', fontSize: 'var(--t-xs)', color: 'var(--ink-2)', lineHeight: 1.4 }}>
        The Oropesa: is the event ultroneous, unwarrantable, a new cause which disturbs the sequence of events — unreasonable, extraneous or extrinsic?
      </p>
    </div>
  );

  let verdict: string;
  let tone: SimView['tone'];
  if (o.state === 'other') {
    verdict = 'Different branch: later negligence, by a third party or the plaintiff, is a matter of fact and degree (Mahony) and does not necessarily sever the chain.';
    tone = 'open';
  } else if (o.limb === 1) {
    verdict = 'Chain broken: volitional human action ordinarily severs it — compare Rickards v Lothian, Yates v Jones, CES v Superclinics. The harm falls outside the scope of liability.';
    tone = 'no';
  } else if (o.limb === 2) {
    verdict = 'Chain broken: a causally independent, extremely unlikely coincidence (Haber v Walker). The harm falls outside the scope of liability.';
    tone = 'no';
  } else if (s.event === 'nonvolitional') {
    verdict = 'Chain holds: non-volitional conduct did not sever it in Urbanski v Patel, Haynes v G Harwood & Son, Medlin and Hirst v Nominal Defendant.';
    tone = 'yes';
  } else {
    verdict = 'Chain holds: an event that is not volitional human action must be both causally independent and extremely unlikely to sever it (Haber v Walker).';
    tone = 'yes';
  }
  return { figure, verdict, tone };
}

function describe(a: S, b: S) {
  if (a.event !== b.event) {
    if (b.event === 'volitional') return 'A deliberate, free choice by another person: the first limb, voluntary human action.';
    if (b.event === 'nonvolitional') return 'A reaction that is not an act of will: the flowchart’s non-volitional cases left the chain intact.';
    if (b.event === 'natural') return 'Not human action at all: only the coincidence limb can sever the chain now.';
    return 'Later negligence is analysed on its own branch: fact and degree, not the voluntary-act test.';
  }
  if (a.independent !== b.independent) return b.independent ? 'Causally independent: nothing in the defendant’s negligence made the event happen.' : 'Connected to the situation the defendant created: not a causally independent coincidence.';
  if (a.unlikely !== b.unlikely) return b.unlikely ? 'Extremely unlikely: together with independence, that is the Haber v Walker limb.' : 'Not extremely unlikely: the coincidence limb fails.';
  return '';
}

export default function NovusActusVolitionalActsAndCoincidences() {
  return (
    <Simulation<S>
      label="New intervening acts: does the later event break the chain of causation?"
      terms={[
        { term: 'Novus actus interveniens', def: 'A new intervening act: a later event affecting the situation the negligence created.' },
        { term: 'Volitional', def: 'Done by an act of will: the flowchart’s test of voluntary human action.' },
        { term: 'Causally independent', def: 'Not brought about by the defendant’s negligence or the situation it created.' },
        { term: 'Ultroneous', def: 'The Oropesa’s word: unwarrantable, a new cause that disturbs the sequence of events.' },
      ]}
      initial={initial}
      controls={[
        { key: 'event', label: 'The later event is', type: 'select', options: [
          { value: 'volitional', label: 'A deliberate, volitional act by another person' },
          { value: 'nonvolitional', label: 'A non-volitional reaction (eg a reflex)' },
          { value: 'natural', label: 'A natural event (eg lightning)' },
          { value: 'negligent', label: 'A careless act by a third party or the plaintiff' },
        ] },
        { key: 'independent', label: 'Causally independent of the defendant’s negligence', type: 'toggle' },
        { key: 'unlikely', label: 'Extremely unlikely', type: 'toggle' },
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'A freak, causally independent lightning strike injures a plaintiff who is in bed because of the defendant’s negligence. On the flowchart?',
        options: [
          { text: 'The chain holds: only voluntary human action can sever it', why: 'Voluntary human action is one limb, but the flowchart gives a second: a causally independent, extremely unlikely coincidence.' },
          { text: 'It can sever the chain as an extremely unlikely coincidence', correct: true, why: 'Haber v Walker: a causally independent act which is a coincidence which is extremely unlikely can sever the connection.' },
          { text: 'The chain holds because “but for” causation is satisfied', why: 'The novus actus question starts where “but for” causation is established; passing that test does not end it.' },
        ],
      }}
    />
  );
}
