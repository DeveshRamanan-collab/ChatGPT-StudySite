/*
SCENE: Unpacking the reasonable person — which characteristics move the yardstick, and which do not
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → choose who the defendant is → watch the yardstick move down, stay, or rise → read the reason → one check
INTENT: Show that the reasonable person is an objective legal fiction that admits only some characteristics: age lowers
  the yardstick to a normal child of comparable age (McHale v Watson); abnormal traits, mental illness (Carrier v
  Bonham) and inexperience (Imbree v McNeilly) leave it unchanged; professed special skill raises it (Rogers v Whitaker).
SUBJECT: the yardstick marker against the fixed line of the ordinary reasonable person.
BEAT 1 (0–100%): the defendant select moves the marker (transform only, 240ms ease-in-out); the reason toggle reveals the
  court's reason (opacity only, 180ms ease-out); the verdict names the standard and case within 200ms.
CAMERA: none (HTML + SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: identical end states; the marker jumps rather than slides.
BUDGET: < 4 KB gz, no WebGL.
Source: concept laws2400-w09-the-reasonable-person; Topic 9 Lecture 2 slides 22–31 (legal fiction; Vaughan v Menlove;
  feminist critique; McHale v Watson and Kitto J; Carrier v Bonham and McPherson JA; Imbree v McNeilly; Rogers v
  Whitaker).
*/
import { Simulation, type SimView } from '../bases/Simulation';

type Who = 'child' | 'trait' | 'mental' | 'learner' | 'professional';

interface S extends Record<string, unknown> {
  who: Who;
  reason: boolean;
}

const initial: S = { who: 'child', reason: true };

const Y = { lower: 'down', same: 'level', higher: 'up' } as const;
type Move = keyof typeof Y;

const INFO: Record<Who, { move: Move; standard: string; caseName: string; why: string }> = {
  child: {
    move: 'lower', standard: 'a normal child of comparable age', caseName: 'McHale v Watson (1966) 115 CLR 199',
    why: 'Kitto J: a child may rely on a limitation on foresight or prudence characteristic of humanity at his stage of development.',
  },
  trait: {
    move: 'same', standard: 'the ordinary reasonable person (or normal child of that age)', caseName: 'McHale v Watson — Kitto J',
    why: 'It is no answer to be abnormally slow-witted, quick-tempered, absent-minded or inexperienced: the standard is objective.',
  },
  mental: {
    move: 'same', standard: 'the ordinary reasonable person', caseName: 'Carrier v Bonham [2002] 1 Qd R 474',
    why: 'McPherson JA: unsoundness of mind is not a stage of development all humanity passes through; no standard could judge such persons as a class.',
  },
  learner: {
    move: 'same', standard: 'a licensed driver', caseName: 'Imbree v McNeilly [2008] HCA 40',
    why: 'The standard is objective and impersonal; varying it with each driver’s experience would be unworkable.',
  },
  professional: {
    move: 'higher', standard: 'the ordinary skilled person exercising and professing that special skill', caseName: 'Rogers v Whitaker (1992) 175 CLR 479',
    why: 'A professional is judged by the skill they profess — now subject to s 5O for professional services.',
  },
};

const MARK_Y: Record<Move, number> = { lower: 92, same: 56, higher: 20 };

function Yardstick({ s }: { s: S }) {
  const t = { fontFamily: 'var(--font-ui)', fontSize: 11 } as const;
  const i = INFO[s.who];
  return (
    <svg viewBox="0 0 320 112" role="img" style={{ width: '100%', maxWidth: 480, display: 'block', margin: '0 auto' }}
      aria-label={`The standard moves ${Y[i.move]} from the ordinary reasonable person line`}>
      <line x1="16" y1="56" x2="304" y2="56" stroke="var(--ink)" strokeWidth="2" />
      <text x="304" y="50" textAnchor="end" {...t} fill="var(--ink)">the ordinary reasonable person</text>
      <text x="16" y="16" {...t} fill="var(--ink-3)">higher standard</text>
      <text x="16" y="108" {...t} fill="var(--ink-3)">lower standard</text>
      <g data-marker style={{ transform: `translateY(${MARK_Y[i.move] - 56}px)`, transition: 'transform var(--dur-ui) var(--ease-inout)' }}>
        <rect x="120" y="48" width="80" height="16" rx="8" fill="var(--paper-3)" stroke="var(--ink-2)" strokeWidth="1.5" />
        <text x="160" y="60" textAnchor="middle" {...t} fill="var(--ink)">D’s yardstick</text>
      </g>
    </svg>
  );
}

function view(s: S): SimView {
  const i = INFO[s.who];
  const figure = (
    <div role="group" aria-label="A yardstick that moves with the defendant's characteristics">
      <Yardstick s={s} />
      <p style={{ margin: 'var(--s-3) 0 0', fontSize: 'var(--t-sm)', color: 'var(--ink)' }}>
        Measured against: <strong style={{ fontWeight: 600 }}>{i.standard}</strong>
      </p>
      <p className="mono" style={{ margin: 'var(--s-1) 0 0', fontSize: 'var(--t-xs)', color: 'var(--ink-2)' }}>{i.caseName}</p>
      <p data-reason style={{ margin: 'var(--s-2) 0 0', fontSize: 'var(--t-xs)', color: 'var(--ink-2)', opacity: s.reason ? 1 : 0, transition: 'opacity var(--dur-micro) var(--ease-out)' }} aria-hidden={!s.reason}>
        {i.why}
      </p>
    </div>
  );
  const verdict = i.move === 'lower'
    ? `Lowered to ${i.standard}: age is the characteristic the law allows (McHale v Watson).`
    : i.move === 'higher'
      ? `Raised to ${i.standard} (Rogers v Whitaker); for a professional service, s 5O is applied first if pleaded.`
      : `Unchanged: measured against ${i.standard}. ${s.who === 'mental' ? 'Mental illness does not lower the standard (Carrier v Bonham).' : s.who === 'learner' ? 'Inexperience does not lower it (Imbree v McNeilly).' : 'Abnormal personal traits are no answer (Kitto J).'}`;
  return { figure, verdict, tone: 'open' };
}

function describe(a: S, b: S) {
  if (a.who !== b.who) {
    const i = INFO[b.who];
    return i.move === 'lower'
      ? 'A child: the yardstick drops to a normal child of the same age — a stage of development everyone passes through.'
      : i.move === 'higher'
        ? 'A professional: the yardstick rises to the skill they profess.'
        : 'The yardstick stays on the line: this characteristic does not change the objective standard.';
  }
  if (a.reason !== b.reason) return b.reason ? 'The court’s reason is shown under the case.' : 'Reason hidden — try to say it before you show it again.';
  return '';
}

export default function TheReasonablePerson() {
  return (
    <Simulation<S>
      label="Which defendant characteristics move the reasonable person yardstick"
      terms={[
        { term: 'Reasonable person', def: 'A legal fiction judges use to apply the objective test (first “the man of ordinary prudence”, Vaughan v Menlove).' },
        { term: 'Comparable age', def: 'The child’s standard: a normal child of the same age (McHale v Watson).' },
        { term: 'Objective and impersonal', def: 'Why inexperience and mental illness do not lower the standard.' },
      ]}
      initial={initial}
      controls={[
        {
          key: 'who', label: 'The defendant is…', type: 'select', options: [
            { value: 'child', label: 'A 12-year-old child' },
            { value: 'trait', label: 'Unusually absent-minded or quick-tempered' },
            { value: 'mental', label: 'A person with a mental illness' },
            { value: 'learner', label: 'A learner driver' },
            { value: 'professional', label: 'A professional (an eye surgeon)' },
          ],
        },
        { key: 'reason', label: 'Show the court’s reason', type: 'toggle' },
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'Why does age adjust the standard of care when mental illness does not?',
        options: [
          { text: 'Childhood is a stage of development all humanity passes through; mental illness is not', correct: true, why: 'McPherson JA in Carrier v Bonham, building on Kitto J in McHale: there is a normal child of each age, but no “normal” unsound mind.' },
          { text: 'The Civil Liability Act lowers the standard for children only', why: 'Tempting because the Act modifies breach, but the child standard comes from the common law (McHale v Watson).' },
          { text: 'Children are more often defendants, so a special standard is efficient', why: 'Tempting as a policy reason, but the courts’ reason is that a class standard exists for age and not for mental illness.' },
        ],
      }}
    />
  );
}
