/*
SCENE: Omissions and control of the conduct of others
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → choose the source of harm → switch on the ingredients → watch the duty lamp → one check
INTENT: Show that for an omission foreseeability is never enough: a duty switches on only with a special
  relationship, knowledge and control (Hargrave v Goldman) — and that control over premises is not control over the
  criminals who use them (Modbury v Anzil).
SUBJECT: the duty lamp at the end of the row of switches; it lights only when the needed ingredients are all on.
BEAT 1 (0–100%): a select sets the source of harm (a danger on the land, or a third party's criminal conduct); toggles
  light switches sage; the lamp and verdict update within 200ms. Ease: CSS 180ms ease-out on colour only.
CAMERA: none (HTML). LIGHT: none. SOUND: none.
REDUCED MOTION: identical (colour only).
BUDGET: < 6 KB gz, no WebGL.
Source: concept card laws2400-w06-omissions-and-control-of-others; cases hargrave-v-goldman (verify: true on the case
  card; used here only as the concept card states it), modbury-triangle-shopping-centre-v-anzil.
*/
import { Simulation, type SimView } from '../bases/Simulation';

interface S extends Record<string, unknown> {
  source: 'danger' | 'third-party';
  foreseeable: boolean;
  relationship: boolean;
  knowledge: boolean;
  control: boolean;
  predictable: boolean;
  assumed: boolean;
}

const initial: S = { source: 'danger', foreseeable: true, relationship: false, knowledge: false, control: false, predictable: false, assumed: false };

type Sw = { k: string; label: string; on: boolean; needed: boolean };

function switches(s: S): Sw[] {
  if (s.source === 'danger') {
    return [
      { k: 'foreseeable', label: 'Foreseeability', on: s.foreseeable, needed: true },
      { k: 'relationship', label: 'Special relationship', on: s.relationship, needed: true },
      { k: 'knowledge', label: 'Knowledge of the danger', on: s.knowledge, needed: true },
      { k: 'control', label: 'Control over the danger', on: s.control, needed: true },
    ];
  }
  return [
    { k: 'foreseeable', label: 'Foreseeability', on: s.foreseeable, needed: true },
    { k: 'control', label: 'Control over the third party', on: s.control, needed: false },
    { k: 'predictable', label: 'High foreseeability and predictability', on: s.predictable, needed: false },
    { k: 'assumed', label: 'Reliance or assumption of responsibility', on: s.assumed, needed: false },
  ];
}

function duty(s: S): boolean {
  if (!s.foreseeable) return false;
  if (s.source === 'danger') return s.relationship && s.knowledge && s.control;
  return s.control || s.predictable || s.assumed;
}

function view(s: S): SimView {
  const sw = switches(s);
  const on = duty(s);
  const figure = (
    <div className="xgates" role="group" aria-label="Ingredients for a duty over an omission, and whether the duty switches on">
      <p style={{ margin: '0 0 var(--s-3)', fontSize: 'var(--t-xs)', color: 'var(--ink-2)' }}>
        {s.source === 'danger' ? 'Need all four (Hargrave v Goldman).' : 'Need foreseeability plus at least one of the other three (Modbury v Anzil).'}
      </p>
      <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 'var(--s-2)', gridTemplateColumns: 'repeat(auto-fit, minmax(9rem, 1fr))' }}>
        {sw.map((w) => (
          <li
            key={w.k}
            data-on={w.on ? 'true' : undefined}
            style={{
              padding: 'var(--s-3)', borderRadius: 'var(--r-md)', background: 'var(--paper)', fontSize: 'var(--t-sm)', lineHeight: 1.3,
              border: `1.5px ${w.needed ? 'solid' : 'dashed'} ${w.on ? 'var(--sage)' : 'var(--ink-3)'}`,
              color: w.on ? 'var(--ink)' : 'var(--ink-3)', transition: 'border-color 180ms var(--ease-out), color 180ms var(--ease-out)',
            }}
          >
            <span aria-hidden="true">{w.on ? '● ' : '○ '}</span>{w.label}
            <span style={{ display: 'block', fontSize: 'var(--t-xs)', color: 'var(--ink-2)', marginTop: 2 }}>{w.needed ? 'required' : 'any one'}</span>
          </li>
        ))}
      </ol>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-3)', marginTop: 'var(--s-4)' }}>
        <span
          aria-hidden="true"
          data-lamp={on ? 'on' : 'off'}
          style={{ width: 24, height: 24, borderRadius: 'var(--r-pill)', flex: 'none', border: `2px solid ${on ? 'var(--sage)' : 'var(--ink-3)'}`, background: on ? 'var(--sage)' : 'transparent', transition: 'background-color 180ms var(--ease-out), border-color 180ms var(--ease-out)' }}
        />
        <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{on ? 'Duty switches on' : 'No duty'}</span>
      </div>
      {s.source === 'third-party' && s.relationship && s.knowledge && !on && (
        <p style={{ margin: 'var(--s-2) 0 0', fontSize: 'var(--t-xs)', color: 'var(--ink-2)' }}>
          Control over and knowledge of the premises do not reach the third parties’ independent criminal conduct.
        </p>
      )}
    </div>
  );
  let verdict: string;
  if (!s.foreseeable) verdict = 'No duty: without foreseeable harm there is nothing to build on.';
  else if (on) verdict = s.source === 'danger'
    ? 'Duty: foreseeability plus a special relationship, knowledge and control — the Hargrave ingredients.'
    : `Duty against the third party’s conduct: ${s.control ? 'real control over the third party' : s.predictable ? 'high foreseeability and predictability' : 'reliance or an assumption of responsibility'}.`;
  else verdict = s.source === 'danger'
    ? `No duty: foreseeability alone is never enough for an omission — missing ${sw.filter((w) => !w.on).map((w) => w.label.toLowerCase()).join(', ')}.`
    : 'No duty: as in Modbury, controlling the car park lighting is not controlling the criminals who attacked there.';
  return { figure, verdict, tone: on ? 'yes' : 'no' };
}

function describe(a: S, b: S) {
  if (a.source !== b.source) return b.source === 'danger' ? 'Harm from a danger the defendant failed to abate (like the burning tree in Hargrave).' : 'Harm from a third party’s independent criminal conduct (like the attack in Modbury).';
  if (a.foreseeable !== b.foreseeable) return b.foreseeable ? 'Harm foreseeable: necessary, but never enough for an omission.' : 'Not foreseeable: no duty at all.';
  if (a.relationship !== b.relationship) return b.source === 'danger' ? (b.relationship ? 'A special relationship, such as occupier–neighbour.' : 'No special relationship.') : 'A relationship alone does not give control over a third party.';
  if (a.knowledge !== b.knowledge) return b.source === 'danger' ? (b.knowledge ? 'The defendant knew of the danger.' : 'The defendant did not know of the danger.') : 'Knowledge of the premises does not reach the third party’s criminal conduct.';
  if (a.control !== b.control) return b.control ? (b.source === 'danger' ? 'Practical control over the danger: the ingredient that does most of the work.' : 'Real control over the third party: enough to found a duty.') : 'No control over the source of harm.';
  if (a.predictable !== b.predictable) return b.source === 'danger' ? 'Predictability of third-party conduct matters only when the harm comes from a third party.' : b.predictable ? 'High foreseeability and predictability of the conduct: an occupier can owe a duty.' : 'Ordinary foreseeability of crime is not enough.';
  if (a.assumed !== b.assumed) return b.source === 'danger' ? 'Reliance and assumption of responsibility are routes over a third party’s conduct.' : b.assumed ? 'Reliance or an assumption of responsibility can found a duty — neither was made out in Modbury.' : 'No reliance or assumption of responsibility.';
  return '';
}

export default function OmissionsAndControlOfOthers() {
  return (
    <Simulation<S>
      label="When an omission, or a third party's conduct, attracts a duty of care"
      terms={[
        { term: 'Omission', def: 'A failure to act, as opposed to a positive act; generally no duty to rescue.' },
        { term: 'Special relationship', def: 'A relationship such as occupier–neighbour that, with knowledge and control, founds a duty.' },
        { term: 'Control', def: 'Practical control over the source of the harm — the ingredient that does most of the work.' },
        { term: 'Good Samaritan (ss 55–58)', def: 'One who helps in good faith without expecting reward; protected unless they caused the risk or were impaired.' },
      ]}
      initial={initial}
      controls={[
        { key: 'source', label: 'Source of the harm', type: 'select', options: [{ value: 'danger', label: 'A danger on the defendant’s land' }, { value: 'third-party', label: 'A third party’s criminal conduct' }] },
        { key: 'foreseeable', label: 'Harm was reasonably foreseeable', type: 'toggle' },
        { key: 'relationship', label: 'Special relationship (eg occupier–neighbour)', type: 'toggle' },
        { key: 'knowledge', label: 'Defendant knew of the danger', type: 'toggle' },
        { key: 'control', label: 'Defendant had practical control over the source of the harm', type: 'toggle' },
        { key: 'predictable', label: 'Third party’s conduct highly foreseeable and predictable', type: 'toggle' },
        { key: 'assumed', label: 'Reliance or assumption of responsibility', type: 'toggle' },
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'Why did the shopping centre in Modbury v Anzil owe no duty to protect Anzil from his attackers?',
        options: [
          { text: 'The attack was not foreseeable at all', why: 'Tempting, but the point was not bare foreseeability: even foreseeable crime needs more for an omission.' },
          { text: 'It controlled the premises, but not the criminals who attacked him', correct: true, why: 'The occupier’s duty rested on control over and knowledge of the premises, which did not extend to independent criminal conduct.' },
          { text: 'It was a Good Samaritan protected by ss 55–58', why: 'Sections 55–58 protect people who help someone at risk; the centre was not assisting anyone.' },
        ],
      }}
    />
  );
}
