/*
SCENE: Question 1(a) — was the risk foreseeable? A foreseeability tester for s 5B(1)(a)
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → record the court's findings on knowledge and remoteness → raise the defendant's three usual
  arguments → watch which ones matter → one check
INTENT: Show that s 5B(1)(a) is met by a risk the defendant knew or ought to have known of that is not far-fetched or
  fanciful (Wyong), and that an unforeseen manner, an unforeseen particular injury or the plaintiff's own foolhardy
  conduct do not defeat it.
SUBJECT: the two tests at the top (knowledge; not far-fetched); the argument cards below answer, but never flip, them.
BEAT 1 (0–100%): selects flip the two tests (colour only, --dur-micro); toggles light an argument card with the
  principle that answers it (opacity + border colour). Verdict updates within 200ms.
CAMERA: none (HTML). LIGHT: none. SOUND: none.
REDUCED MOTION: identical minus the fades (durations are tokens, zero in off).
BUDGET: < 5 KB gz, no WebGL.
Source: concept laws2400-w09-foreseeable-risk-s5b-1a; CLA (NSW) s 5B(1)(a); Topic 9 flowchart p 382 (relevant
  principles: Wyong Shire Council v Shirt; Nagle v Rottnest Island Board; McLean v Tedman; Swain, McHugh J).
The simulation does not decide knowledge or remoteness: those are findings, so the learner records them.
*/
import { Simulation, type SimView } from '../bases/Simulation';

type Knowledge = 'knew' | 'ought' | 'neither';
type Remote = 'real' | 'fanciful';

interface S extends Record<string, unknown> {
  knowledge: Knowledge;
  remoteness: Remote;
  manner: boolean;
  particular: boolean;
  foolhardy: boolean;
}

const initial: S = { knowledge: 'ought', remoteness: 'real', manner: false, particular: false, foolhardy: false };

const ARGS: { key: 'manner' | 'particular' | 'foolhardy'; claim: string; answer: string }[] = [
  { key: 'manner', claim: '“No one could foresee the precise way it happened.”', answer: 'Not needed: a reasonably foreseeable risk of injury of some kind to someone such as the plaintiff is enough.' },
  { key: 'particular', claim: '“This particular injury was unforeseeable.”', answer: 'Not needed either: the particular injury need not be foreseeable.' },
  { key: 'foolhardy', claim: '“The plaintiff behaved foolhardily.”', answer: 'Must be foreseen and guarded against, even if unlikely: Nagle v Rottnest Island Board; McLean v Tedman.' },
];

const T = 'color var(--dur-micro) var(--ease-out), border-color var(--dur-micro) var(--ease-out), opacity var(--dur-micro) var(--ease-out)';

function Test({ id, label, rule, pass }: { id: string; label: string; rule: string; pass: boolean }) {
  return (
    <li data-test={id} data-pass={pass ? 'true' : 'false'}
      style={{ padding: 'var(--s-2) var(--s-3)', background: 'var(--paper)', borderRadius: 'var(--r-sm)', border: `1.5px solid ${pass ? 'var(--sage)' : 'var(--clay)'}`, transition: T }}>
      <span style={{ display: 'block', fontSize: 'var(--t-sm)', fontWeight: 600, color: 'var(--ink)' }}>{pass ? '✓ ' : '✕ '}{label}</span>
      <span style={{ display: 'block', fontSize: 'var(--t-xs)', lineHeight: 1.35, color: 'var(--ink-2)' }}>{rule}</span>
    </li>
  );
}

function view(s: S): SimView {
  const knows = s.knowledge !== 'neither';
  const real = s.remoteness === 'real';
  const raised = ARGS.filter((a) => s[a.key]);
  const figure = (
    <div role="group" aria-label="Two tests for section 5B(1)(a), and the defendant's arguments with the principles that answer them">
      <p className="label" style={{ margin: '0 0 var(--s-2)' }}>s 5B(1)(a): the risk was foreseeable</p>
      <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 'var(--s-2)', gridTemplateColumns: 'repeat(auto-fit, minmax(13rem, 1fr))' }}>
        <Test id="knowledge" pass={knows} label="Knew or ought to have known" rule={s.knowledge === 'knew' ? 'The defendant knew of the risk.' : s.knowledge === 'ought' ? 'The defendant ought to have known: actual knowledge is not needed.' : 'Neither knew nor ought to have known of the risk.'} />
        <Test id="wyong" pass={real} label="Not far-fetched or fanciful" rule={real ? 'Foreseeable in the Wyong sense (Mason J).' : 'A far-fetched or fanciful risk is not foreseeable (Wyong).'} />
      </ol>
      <p style={{ margin: 'var(--s-2) 0 0', fontSize: 'var(--t-xs)', color: 'var(--ink-2)' }}>
        At breach the test is more specific than at duty: the defendant’s actual conduct and the actual risk of injury in the circumstances — “a fact-value complex” (Swain, McHugh J).
      </p>
      <p className="label" style={{ margin: 'var(--s-4) 0 var(--s-2)' }}>The defendant argues…</p>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 'var(--s-2)' }}>
        {ARGS.map((a) => {
          const on = !!s[a.key];
          return (
            <li key={a.key} data-arg={a.key} data-on={on ? 'true' : undefined}
              style={{ padding: 'var(--s-2) var(--s-3)', borderRadius: 'var(--r-sm)', background: 'var(--paper)', border: on ? '1.5px solid var(--ink)' : '1px solid var(--line)', opacity: on ? 1 : 0.45, transition: T }}>
              <span style={{ display: 'block', fontSize: 'var(--t-sm)', color: 'var(--ink)' }}>{a.claim}</span>
              <span style={{ display: 'block', fontSize: 'var(--t-xs)', lineHeight: 1.35, color: 'var(--ink-2)' }}>{on ? a.answer : 'not raised'}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
  let verdict: string;
  let tone: SimView['tone'];
  if (!knows) {
    verdict = 'Not foreseeable under s 5B(1)(a): the defendant neither knew nor ought to have known of the risk, so it is not negligent for failing to guard against it.';
    tone = 'no';
  } else if (!real) {
    verdict = 'Not foreseeable: a far-fetched or fanciful risk fails s 5B(1)(a) (Wyong, Mason J). The defendant is not negligent.';
    tone = 'no';
  } else {
    const basis = s.knowledge === 'ought' ? 'the defendant ought to have known of it' : 'the defendant knew of it';
    const args = raised.length === 0 ? '' : raised.length === 1 ? ' The argument raised does not defeat it.' : ` None of the ${raised.length} arguments raised defeats it.`;
    verdict = `Foreseeable under s 5B(1)(a): ${basis}, and it is not far-fetched or fanciful.${args} Go on to (b).`;
    tone = 'yes';
  }
  return { figure, verdict, tone };
}

function describe(a: S, b: S) {
  if (a.knowledge !== b.knowledge)
    return b.knowledge === 'knew'
      ? 'Actual knowledge: the first half of the statutory gloss is met.'
      : b.knowledge === 'ought'
        ? 'Ought to have known: enough under s 5B(1)(a) — actual knowledge is not required.'
        : 'Neither knew nor ought to have known: the risk is not foreseeable within s 5B(1)(a).';
  if (a.remoteness !== b.remoteness)
    return b.remoteness === 'real'
      ? 'Not far-fetched or fanciful: foreseeable in the Wyong sense.'
      : 'Far-fetched or fanciful: Wyong says that is not foreseeable, so (a) fails.';
  for (const x of ARGS)
    if (a[x.key] !== b[x.key]) return b[x.key] ? `Argument raised — ${x.answer}` : 'Argument withdrawn: the verdict did not depend on it.';
  return '';
}

export default function ForeseeableRiskS5b1a() {
  return (
    <Simulation<S>
      label="Section 5B(1)(a): testing whether a risk was foreseeable"
      terms={[
        { term: 'Foreseeable risk', def: 'Under s 5B(1)(a), a risk of which the person knew or ought to have known.' },
        { term: 'Far-fetched or fanciful', def: 'What a foreseeable risk is not (Wyong Shire Council v Shirt, Mason J).' },
        { term: 'Injury of some kind', def: 'The level at which the risk is framed: to someone such as the plaintiff, not the precise injury.' },
      ]}
      initial={initial}
      controls={[
        {
          key: 'knowledge', label: 'The court finds the defendant…', type: 'select', options: [
            { value: 'knew', label: 'knew of the risk' },
            { value: 'ought', label: 'ought to have known of it' },
            { value: 'neither', label: 'neither knew nor ought to have known' },
          ],
        },
        {
          key: 'remoteness', label: 'The risk of injury of some kind was…', type: 'select', options: [
            { value: 'real', label: 'not far-fetched or fanciful' },
            { value: 'fanciful', label: 'far-fetched or fanciful' },
          ],
        },
        { key: 'manner', label: 'Defendant argues: the precise manner was unforeseeable', type: 'toggle' },
        { key: 'particular', label: 'Defendant argues: the particular injury was unforeseeable', type: 'toggle' },
        { key: 'foolhardy', label: 'Defendant argues: the plaintiff acted foolhardily', type: 'toggle' },
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'A plaintiff was hurt in an unusual way while acting foolishly. Does that make the risk unforeseeable under s 5B(1)(a)?',
        options: [
          { text: 'Yes: the precise manner of injury must be foreseeable', why: 'Tempting because the accident was unusual, but the precise manner need not be foreseeable — only a risk of injury of some kind.' },
          { text: 'Yes: defendants need not foresee foolish conduct by plaintiffs', why: 'The flowchart says even extremely foolhardy plaintiff conduct must be foreseen and guarded against (Nagle; McLean v Tedman).' },
          { text: 'No: a risk of injury of some kind that is not far-fetched is enough', correct: true, why: 'Neither the unusual manner nor the plaintiff’s foolishness defeats foreseeability; the question is whether the risk was far-fetched or fanciful.' },
        ],
      }}
    />
  );
}
