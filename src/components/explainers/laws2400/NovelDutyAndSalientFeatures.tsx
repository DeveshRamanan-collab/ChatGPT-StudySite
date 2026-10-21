/*
SCENE: Novel duty situations and the salient features approach
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → say whether the case is novel → drop salient features on either pan → watch the beam → one check
INTENT: Show that outside an established category foreseeability alone is not enough: the court weighs the salient
  features of the relationship, and coherence or indeterminacy can outweigh the rest (Sullivan v Moody).
SUBJECT: the balance beam; it tips toward "duty" or "no duty" as features are added.
BEAT 1 (0–100%): toggles add features to the "for" pan (control, vulnerability, reliance, assumption of
  responsibility, knowledge) or the "against" pan (indeterminate liability, incoherence); the beam rotates and the
  verdict updates within 200ms. Ease: CSS 240ms ease-in-out on the beam's transform (rotate), 180ms on colour.
CAMERA: none (SVG + HTML). LIGHT: none. SOUND: none.
REDUCED MOTION: final beam angle only (bases handle calm/off).
BUDGET: < 6 KB gz, no WebGL.
Source: concept card laws2400-w05-novel-duty-and-salient-features; cases caltex-refineries-pty-ltd-v-stavar,
  sullivan-v-moody.
The beam is a teaching device, not a rule: the salient features are weighed evaluatively, not counted, and need not
  all be satisfied. The verdict says "leans".
*/
import { Simulation, type SimView } from '../bases/Simulation';

interface S extends Record<string, unknown> {
  category: 'novel' | 'established';
  foreseeable: boolean;
  control: boolean;
  vulnerability: boolean;
  reliance: boolean;
  assumption: boolean;
  knowledge: boolean;
  indeterminate: boolean;
  incoherent: boolean;
}

const initial: S = { category: 'novel', foreseeable: true, control: false, vulnerability: false, reliance: false, assumption: false, knowledge: false, indeterminate: false, incoherent: false };

const FOR: { k: keyof S & string; label: string }[] = [
  { k: 'control', label: 'Control over the risk' },
  { k: 'vulnerability', label: 'Vulnerability (cannot self-protect)' },
  { k: 'reliance', label: 'Reliance' },
  { k: 'assumption', label: 'Assumption of responsibility' },
  { k: 'knowledge', label: 'Knowledge of the risk' },
];
const AGAINST: { k: keyof S & string; label: string }[] = [
  { k: 'indeterminate', label: 'Risk of indeterminate liability' },
  { k: 'incoherent', label: 'Incoherence with statute or common law' },
];

type Out = { lean: 'duty' | 'none' | 'open'; why: string };

function weigh(s: S): Out {
  if (s.category === 'established') return { lean: 'duty', why: 'An established category: no weighing needed — the duty follows from the relationship.' };
  if (!s.foreseeable) return { lean: 'none', why: 'No foreseeable harm: nothing to weigh.' };
  if (s.incoherent || s.indeterminate) return { lean: 'none', why: 'However foreseeable, a duty that would be incoherent or create indeterminate liability is not recognised (Sullivan v Moody).' };
  const n = FOR.filter((f) => s[f.k]).length;
  if (n === 0) return { lean: 'none', why: 'Foreseeability alone is not enough in a novel case.' };
  if (n === 1) return { lean: 'open', why: 'One feature beyond foreseeability: finely balanced — argue it from the facts.' };
  return { lean: 'duty', why: 'Several salient features point the same way: leans toward a duty (cf Caltex v Stavar).' };
}

function view(s: S): SimView {
  const o = weigh(s);
  const novel = s.category === 'novel';
  const forN = (s.foreseeable ? 1 : 0) + FOR.filter((f) => s[f.k]).length;
  const agN = AGAINST.filter((f) => s[f.k]).length;
  // Beam tilts toward the heavier pan; policy features (coherence, indeterminacy) weigh heavily, per Sullivan.
  const angle = !novel ? 0 : o.lean === 'duty' ? -10 : o.lean === 'none' ? 10 : -3;
  const beamColour = o.lean === 'duty' ? 'var(--sage)' : o.lean === 'none' ? 'var(--clay)' : 'var(--ink-2)';
  const pill = (label: string, on: boolean, key: string) => (
    <li key={key} data-on={on ? 'true' : undefined} style={{ fontSize: 'var(--t-xs)', lineHeight: 1.3, color: on ? 'var(--ink)' : 'var(--ink-3)' }}>
      {on ? '● ' : '○ '}{label}
    </li>
  );
  const figure = (
    <div className="xgates" role="group" aria-label="A balance weighing salient features for and against a duty">
      <svg viewBox="0 0 320 120" role="img" aria-label={novel ? `Beam tilts ${o.lean === 'duty' ? 'toward a duty' : o.lean === 'none' ? 'toward no duty' : 'slightly'}` : 'Established category: no weighing'} style={{ opacity: novel ? 1 : 0.4, transition: 'opacity 180ms var(--ease-out)' }}>
        <path d="M160 40 L144 110 L176 110 Z" fill="var(--paper-3)" stroke="var(--ink-3)" strokeWidth="1" />
        <g style={{ transformOrigin: '160px 40px', transform: `rotate(${angle}deg)`, transition: 'transform 240ms var(--ease-inout)' }}>
          <line x1="40" y1="40" x2="280" y2="40" stroke={beamColour} strokeWidth="3" style={{ transition: 'stroke 180ms var(--ease-out)' }} />
          <line x1="50" y1="40" x2="50" y2="62" stroke="var(--ink-3)" strokeWidth="1" />
          <line x1="270" y1="40" x2="270" y2="62" stroke="var(--ink-3)" strokeWidth="1" />
          <path d="M22 62 L78 62 L70 72 L30 72 Z" fill="var(--paper)" stroke="var(--ink-2)" strokeWidth="1.5" />
          <path d="M242 62 L298 62 L290 72 L250 72 Z" fill="var(--paper)" stroke="var(--ink-2)" strokeWidth="1.5" />
          <text x="50" y="90" textAnchor="middle" fontSize="12" fill="var(--ink)" fontFamily="var(--font-ui)">duty · {forN}</text>
          <text x="270" y="90" textAnchor="middle" fontSize="12" fill="var(--ink)" fontFamily="var(--font-ui)">no duty · {agN}</text>
        </g>
        <circle cx="160" cy="40" r="4" fill="var(--ink)" />
      </svg>
      <div style={{ display: 'grid', gap: 'var(--s-4)', gridTemplateColumns: 'repeat(auto-fit, minmax(12rem, 1fr))', marginTop: 'var(--s-3)' }}>
        <div>
          <p className="label" style={{ margin: '0 0 var(--s-1)' }}>For a duty</p>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 2 }}>
            {pill('Foreseeability of harm (needed, not enough)', s.foreseeable, 'foreseeable')}
            {FOR.map((f) => pill(f.label, !!s[f.k], f.k))}
          </ul>
        </div>
        <div>
          <p className="label" style={{ margin: '0 0 var(--s-1)' }}>Against a duty</p>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 2 }}>
            {AGAINST.map((f) => pill(f.label, !!s[f.k], f.k))}
          </ul>
        </div>
      </div>
      <p style={{ margin: 'var(--s-3) 0 0', fontSize: 'var(--t-xs)', color: 'var(--ink-2)' }}>The list is non-exhaustive, and the features are weighed, not counted.</p>
    </div>
  );
  const verdict = o.lean === 'duty' ? (novel ? `Leans to a duty. ${o.why}` : o.why) : o.lean === 'none' ? `Leans to no duty. ${o.why}` : `Open. ${o.why}`;
  return { figure, verdict, tone: o.lean === 'duty' ? 'yes' : o.lean === 'none' ? 'no' : 'open' };
}

const NAMES: Record<string, string> = Object.fromEntries([...FOR, ...AGAINST].map((f) => [f.k, f.label.toLowerCase()]));

function describe(a: S, b: S) {
  if (a.category !== b.category) return b.category === 'novel' ? 'Novel: outside an established category, so the salient features must be weighed.' : 'Established category of relationship: the duty is recognised without the salient-features weighing.';
  if (a.foreseeable !== b.foreseeable) return b.foreseeable ? 'Harm foreseeable: the starting point — but alone it is not enough in a novel case.' : 'Harm not foreseeable: no duty, whatever else is present.';
  if (a.indeterminate !== b.indeterminate || a.incoherent !== b.incoherent) {
    const k = a.indeterminate !== b.indeterminate ? 'indeterminate' : 'incoherent';
    return b[k] ? `Added ${NAMES[k]}: in Sullivan v Moody this defeated a duty despite foreseeable harm.` : `Removed ${NAMES[k]}.`;
  }
  const k = FOR.find((f) => a[f.k] !== b[f.k])?.k;
  if (k) return b[k] ? `Added ${NAMES[k]} to the “duty” pan.` : `Removed ${NAMES[k]}.`;
  return '';
}

export default function NovelDutyAndSalientFeatures() {
  return (
    <Simulation<S>
      label="Weighing the salient features in a novel duty case"
      terms={[
        { term: 'Novel case', def: 'One that falls outside an established category of relationship.' },
        { term: 'Salient features', def: 'A non-exhaustive list of features of the relationship the court weighs (Caltex v Stavar).' },
        { term: 'Incremental approach', def: 'Courts extend duty step by step, not on foreseeability alone.' },
        { term: 'Coherence', def: 'Whether a duty would fit with statute and the common law; its absence can negate a duty (Sullivan v Moody).' },
      ]}
      initial={initial}
      controls={[
        { key: 'category', label: 'The relationship', type: 'select', options: [{ value: 'novel', label: 'Novel (outside an established category)' }, { value: 'established', label: 'An established category' }] },
        { key: 'foreseeable', label: 'Harm to the plaintiff was foreseeable', type: 'toggle' },
        ...FOR.map((f) => ({ key: f.k, label: f.label, type: 'toggle' as const })),
        ...AGAINST.map((f) => ({ key: f.k, label: f.label, type: 'toggle' as const })),
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'In Sullivan v Moody, why was no duty owed to the father under investigation, though harm to him was foreseeable?',
        options: [
          { text: 'Because the harm to him was not reasonably foreseeable', why: 'Tempting, but the reasoning did not turn on foreseeability: mere foreseeability, the Court said, could not found liability here.' },
          { text: 'Coherence with child-protection duties and the risk of indeterminate liability outweighed it', correct: true, why: 'A duty would have conflicted with the paramount duty to protect children and could extend to anyone suspected of abuse.' },
          { text: 'Because the case fell within an established category that excludes investigators', why: 'The case was novel; the salient features were weighed precisely because no established category applied.' },
        ],
      }}
    />
  );
}
