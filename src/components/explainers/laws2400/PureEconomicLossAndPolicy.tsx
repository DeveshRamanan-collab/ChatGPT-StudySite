/*
SCENE: Pure economic loss and why courts hesitate — a loss sorter
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → run the same cable cut with and without the fridge → sort another loss → watch the policy brakes → one check
INTENT: Show that the label depends on whether the economic loss flows from physical injury or property damage
  (consequential: foreseeability typically enough) or not (pure: more is needed), and that three policy concerns
  explain the courts' reluctance over pure loss.
SUBJECT: the "profits lost while shut" item; it moves between the two bins when the fridge toggle flips.
BEAT 1 (0–100%): the fridge toggle redraws the shop (spark + "stock spoiled") and re-sorts the lost profits; the
  compare select drops a second loss into its bin; the three brakes are dim for consequential loss, engaged for pure
  loss, and the one the compared loss raises is outlined. Verdict updates within 200ms.
  Ease: items fade in (opacity, --dur-ui, --ease-out); colour 180ms (--dur-micro). No positional movement.
CAMERA: none (HTML + small SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: identical minus the fades (durations are tokens, zero in off).
BUDGET: < 6 KB gz, no WebGL.
Source: concept card laws2400-w07-pure-economic-loss-and-policy; week spec content-src/laws2400-w07.yaml §2;
  authority civil-liability-act-2002-nsw-s5. The brakes are reasons for reluctance, not a test: only the lawful
  competition example is stated as "no duty arises"; the others are shown as concerns, not outcomes.
*/
import { Simulation, type SimView } from '../bases/Simulation';

type Kind = 'consequential' | 'pure';
type Brake = 'indeterminate' | 'contract' | 'competition';
type CompareKey = 'none' | 'wages' | 'advice' | 'architect' | 'podcast' | 'contract' | 'supermarket';

interface S extends Record<string, unknown> {
  fridge: boolean;
  compare: CompareKey;
}

const initial: S = { fridge: false, compare: 'none' };

const COMPARE: Record<Exclude<CompareKey, 'none'>, { label: string; kind: Kind; because: string; brake?: Brake }> = {
  wages: { label: 'Wages lost after an injury', kind: 'consequential', because: 'follows a physical injury' },
  advice: { label: 'Investment losses from negligent financial advice', kind: 'pure', because: 'no physical injury or property damage' },
  architect: { label: 'Property value lost through an architect’s defective advice', kind: 'pure', because: 'a drop in value, not physical damage' },
  podcast: { label: 'Losses from a “go out and buy” crypto tip on a podcast', kind: 'pure', because: 'relied on by an undefinable audience', brake: 'indeterminate' },
  contract: { label: 'Financial loss between parties who negotiated their terms by contract', kind: 'pure', because: 'money only; the parties set their own obligations', brake: 'contract' },
  supermarket: { label: 'A rival’s profits taken by a new supermarket', kind: 'pure', because: 'lost custom, nothing damaged', brake: 'competition' },
};

const BRAKES: { id: Brake; title: string; body: string }[] = [
  { id: 'indeterminate', title: 'Indeterminate liability', body: 'Liability with no boundaries. A large class is not the problem; an undefinable one is.' },
  { id: 'contract', title: 'Relationship with contract', body: 'Parties who negotiated terms should not have extra obligations imposed by a duty of care.' },
  { id: 'competition', title: 'Lawful commercial activity', body: 'A new supermarket that takes a rival’s profits causes pure loss, but no duty arises.' },
];

const T_COLOUR = 'color var(--dur-micro) var(--ease-out), border-color var(--dur-micro) var(--ease-out), opacity var(--dur-micro) var(--ease-out)';

/** The shop on the cut cable. The fridge sparks only when the cut also short-circuits it. */
function Shop({ fridge }: { fridge: boolean }) {
  const t = { fontFamily: 'var(--font-ui)', fontSize: 11 } as const;
  return (
    <svg viewBox="0 0 320 120" role="img" aria-label={fridge ? 'A cut power cable to a cake business; the fridge has shorted and the stock is spoiled' : 'A cut power cable to a cake business; the shop is shut but nothing is damaged'}>
      <line x1="24" y1="20" x2="24" y2="104" stroke="var(--ink-2)" strokeWidth="2" />
      <path d="M24 28 L96 46" stroke="var(--ink)" strokeWidth="2" fill="none" />
      <path d="M120 52 L172 66" stroke="var(--ink)" strokeWidth="2" fill="none" />
      <path d="M101 40 L115 56 M115 40 L101 56" stroke="var(--ink)" strokeWidth="2" />
      <text x="108" y="30" textAnchor="middle" {...t} fill="var(--ink-2)">negligent cut</text>
      <rect x="172" y="40" width="138" height="64" rx="6" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="241" y="32" textAnchor="middle" {...t} fill="var(--ink)">cake business · shut</text>
      <rect x="278" y="56" width="24" height="40" rx="3" fill="none" stroke={fridge ? 'var(--ink)' : 'var(--ink-3)'} strokeWidth={fridge ? 2 : 1.5} style={{ transition: 'stroke var(--dur-micro) var(--ease-out)' }} />
      <path d="M284 50 L290 60 L286 62 L294 74" fill="none" stroke="var(--ink)" strokeWidth="1.5" style={{ opacity: fridge ? 1 : 0, transition: 'opacity var(--dur-micro) var(--ease-out)' }} />
      <text x="182" y="72" {...t} fill={fridge ? 'var(--ink)' : 'var(--ink-3)'}>{fridge ? 'stock spoiled' : 'fridge working'}</text>
      <text x="182" y="88" {...t} fill="var(--ink-2)">{fridge ? 'property damage' : 'nothing damaged'}</text>
    </svg>
  );
}

function Item({ label, because, id }: { label: string; because: string; id: string }) {
  return (
    <li data-item={id} style={{ padding: 'var(--s-2) var(--s-3)', background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 'var(--r-sm)', animation: 'fade-in var(--dur-ui) var(--ease-out) both' }}>
      <span style={{ display: 'block', fontSize: 'var(--t-sm)', lineHeight: 1.35, color: 'var(--ink)' }}>{label}</span>
      <span style={{ display: 'block', fontSize: 'var(--t-xs)', lineHeight: 1.3, color: 'var(--ink-2)' }}>{because}</span>
    </li>
  );
}

function view(s: S): SimView {
  const cableKind: Kind = s.fridge ? 'consequential' : 'pure';
  const cmp = s.compare === 'none' ? null : COMPARE[s.compare];
  const items = [
    { id: `cable-${cableKind}`, label: 'Profits lost while the business is shut', because: s.fridge ? 'follows the property damage (spoiled stock)' : 'no physical injury or property damage', kind: cableKind },
    ...(cmp ? [{ id: `cmp-${s.compare}`, label: cmp.label, because: cmp.because, kind: cmp.kind }] : []),
  ];
  const anyPure = items.some((i) => i.kind === 'pure');
  const bin = (kind: Kind, title: string, rule: string) => {
    const mine = items.filter((i) => i.kind === kind);
    return (
      <div data-bin={kind} style={{ padding: 'var(--s-3)', background: 'var(--paper-2)', borderRadius: 'var(--r-md)', minHeight: '9rem' }}>
        <p className="label" style={{ margin: 0 }}>{title}</p>
        <p style={{ margin: '2px 0 var(--s-2)', fontSize: 'var(--t-xs)', color: 'var(--ink-2)' }}>{rule}</p>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 'var(--s-2)' }}>
          {mine.map((i) => <Item key={i.id} id={i.id} label={i.label} because={i.because} />)}
          {mine.length === 0 && <li style={{ fontSize: 'var(--t-xs)', color: 'var(--ink-3)' }}>empty</li>}
        </ul>
      </div>
    );
  };
  const figure = (
    <div className="xgates" role="group" aria-label="A loss sorter: consequential or pure economic loss, and the policy brakes on pure loss">
      <Shop fridge={s.fridge} />
      <div style={{ display: 'grid', gap: 'var(--s-3)', gridTemplateColumns: 'repeat(auto-fit, minmax(13rem, 1fr))', marginTop: 'var(--s-3)' }}>
        {bin('consequential', 'Consequential economic loss', 'follows physical injury or property damage: foreseeability is typically enough')}
        {bin('pure', 'Pure economic loss', 'no physical injury to person or property: more is needed')}
      </div>
      <p className="label" style={{ margin: 'var(--s-4) 0 var(--s-2)' }}>Why courts hesitate over pure loss</p>
      <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 'var(--s-2)', gridTemplateColumns: 'repeat(auto-fit, minmax(11rem, 1fr))' }}>
        {BRAKES.map((b) => {
          const bites = cmp?.brake === b.id;
          return (
            <li key={b.id} data-brake={b.id} data-on={anyPure ? 'true' : undefined} data-bites={bites ? 'true' : undefined}
              style={{ padding: 'var(--s-2) var(--s-3)', borderRadius: 'var(--r-sm)', background: 'var(--paper)', border: bites ? '2px solid var(--ink)' : '1px solid var(--line)', opacity: anyPure ? 1 : 0.45, transition: T_COLOUR }}>
              <span style={{ display: 'block', fontSize: 'var(--t-sm)', fontWeight: 600, color: 'var(--ink)' }}>{b.title}{bites ? ' · raised here' : ''}</span>
              <span style={{ display: 'block', fontSize: 'var(--t-xs)', lineHeight: 1.3, color: 'var(--ink-2)' }}>{b.body}</span>
            </li>
          );
        })}
      </ol>
      <p style={{ margin: 'var(--s-3) 0 0', fontSize: 'var(--t-xs)', color: 'var(--ink-2)' }}>CLA s 5: “harm” includes economic loss, so pure economic loss is still harm for the negligence Part.</p>
    </div>
  );

  const cableLine = s.fridge
    ? 'The cut also spoiled the stock: property damage, so the lost profits are consequential — foreseeability is typically enough.'
    : 'The cut damaged nothing physical: the lost profits are pure economic loss — foreseeability alone is not enough.';
  let verdict = cableLine;
  let tone: SimView['tone'] = s.fridge ? 'yes' : 'open';
  if (cmp) {
    const brake = cmp.brake ? BRAKES.find((b) => b.id === cmp.brake)! : null;
    verdict = cmp.kind === 'consequential'
      ? `${cmp.label}: consequential — it follows a physical injury. ${s.fridge ? 'The cable losses are consequential too.' : 'The cable losses stay pure.'}`
      : `${cmp.label}: pure economic loss${brake ? `, and it raises the ${brake.title.toLowerCase()} concern` : ''}${cmp.brake === 'competition' ? ' — no duty arises' : ''}. ${s.fridge ? 'The cable losses are consequential.' : 'The cable losses are pure too.'}`;
    tone = cmp.kind === 'consequential' ? 'yes' : cmp.brake === 'competition' ? 'no' : 'open';
  }
  return { figure, verdict, tone };
}

const COMPARE_NOTE: Record<CompareKey, string> = {
  none: 'No second loss: just the cable cut.',
  wages: 'Wages lost after an injury: consequential — this kind of loss has never been a problem.',
  advice: 'Investment losses from negligent advice: pure — nothing physical was harmed.',
  architect: 'Property value lost through defective advice: pure — the value fell, but nothing was physically damaged.',
  podcast: 'A tip to an undefinable audience: pure, and the indeterminacy brake engages — no way to define who relied.',
  contract: 'Parties who negotiated their terms: the contract brake engages — a duty of care should not add obligations.',
  supermarket: 'Lawful competition: pure loss, but no duty arises.',
};

function describe(a: S, b: S) {
  if (a.fridge !== b.fridge) return b.fridge
    ? 'Same cut, but the fridge shorts and the stock spoils: there is now property damage, so the lost profits become consequential.'
    : 'Only the cable is cut: nothing physical is damaged, so the lost profits are pure economic loss.';
  if (a.compare !== b.compare) return COMPARE_NOTE[b.compare];
  return '';
}

export default function PureEconomicLossAndPolicy() {
  return (
    <Simulation<S>
      label="Sorting economic loss into consequential and pure, with the policy brakes on pure loss"
      terms={[
        { term: 'Pure economic loss', def: 'Economic loss that does not result from any physical injury to the person or property.' },
        { term: 'Consequential economic loss', def: 'Economic loss that follows physical injury or property damage — wages, medical expenses, home modifications.' },
        { term: 'Indeterminate liability', def: 'Liability with no boundaries: to a class that cannot be defined.' },
      ]}
      initial={initial}
      controls={[
        { key: 'fridge', label: 'The cut also short-circuits the fridge and spoils the stock', type: 'toggle' },
        {
          key: 'compare', label: 'Sort another loss', type: 'select', options: [
            { value: 'none', label: 'None' },
            { value: 'wages', label: 'Wages lost after an injury' },
            { value: 'advice', label: 'Investment losses from negligent advice' },
            { value: 'architect', label: 'Value lost through an architect’s advice' },
            { value: 'podcast', label: 'Losses from a podcast crypto tip' },
            { value: 'contract', label: 'Loss between contracting parties' },
            { value: 'supermarket', label: 'Rival’s profits taken by a new supermarket' },
          ],
        },
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'Which of these is pure economic loss?',
        options: [
          { text: 'Medical expenses after a negligently caused injury', why: 'Tempting because it is money, but it follows a physical injury, so it is consequential economic loss.' },
          { text: 'Profits lost when a negligently cut cable shuts a business, with nothing damaged', correct: true, why: 'No physical injury to person or property: the loss is pure, so foreseeability alone is not enough.' },
          { text: 'Profits lost when the same cut also spoils the stock in the fridge', why: 'Tempting because it is the same cut, but the spoiled stock is property damage, so the lost profits become consequential.' },
        ],
      }}
    />
  );
}
