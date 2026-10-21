/*
SCENE: The standard of care — a line the defendant's conduct is measured against
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → set where the conduct sits → toggle personal best, leftover risk, act or omission → one check
INTENT: Show that breach is any shortfall from an objective standard of reasonable care: the margin does not matter,
  the defendant's personal best does not move the line, and leftover risk is not itself breach (Swain).
SUBJECT: the conduct marker on the scale; it slides relative to the fixed "standard of care" line.
BEAT 1 (0–100%): the conduct select moves the marker (transform only, --dur-ui, --ease-inout); the personal-best tag
  appears beside the marker but the line stays put; the leftover-risk note fades in (opacity, --dur-micro). The
  verdict updates within 200ms.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: identical; durations are tokens, zero in off, so the marker jumps instead of sliding.
BUDGET: < 5 KB gz, no WebGL.
Source: concept laws2400-w09-standard-of-care-reasonableness; Topic 9 flowchart p 381 (general common law
  principles); Swain v Waverley Municipal Council (Gleeson CJ at 520 [5]); Blyth v Birmingham Waterworks Co.
*/
import { Simulation, type SimView } from '../bases/Simulation';

type Conduct = 'meets' | 'just-short' | 'far-short';
type Form = 'act' | 'omission';

interface S extends Record<string, unknown> {
  conduct: Conduct;
  form: Form;
  personalBest: boolean;
  riskRemained: boolean;
}

const initial: S = { conduct: 'just-short', form: 'omission', personalBest: true, riskRemained: false };

// Marker x positions on the scale (the standard line sits at x = 230).
const X: Record<Conduct, number> = { 'far-short': 60, 'just-short': 196, meets: 266 };
const LINE = 230;

function Scale({ s }: { s: S }) {
  const t = { fontFamily: 'var(--font-ui)', fontSize: 11 } as const;
  const x = X[s.conduct];
  const short = s.conduct !== 'meets';
  return (
    <svg viewBox="0 0 320 150" role="img"
      aria-label={`The defendant's conduct ${short ? (s.conduct === 'far-short' ? 'falls far short of' : 'falls just short of') : 'meets'} the standard of care line`}>
      {/* the shortfall zone: everything left of the standard line */}
      <rect x="16" y="52" width={LINE - 16} height="40" fill="var(--paper-3)" />
      <text x="20" y="108" {...t} fill="var(--ink-2)">← any shortfall = breach</text>
      <line x1="16" y1="92" x2="304" y2="92" stroke="var(--ink-2)" strokeWidth="1.5" />
      <line x1={LINE} y1="30" x2={LINE} y2="108" stroke="var(--ink)" strokeWidth="2" />
      <text x={LINE} y="124" textAnchor="middle" {...t} fill="var(--ink)">standard of care</text>
      <text x="312" y="139" textAnchor="end" {...t} fill="var(--ink-2)">what a reasonable person would do</text>
      {/* the conduct marker: moved by transform only */}
      <g data-marker style={{ transform: `translateX(${x}px)`, transition: 'transform var(--dur-ui) var(--ease-inout)' }}>
        <circle cx="0" cy="72" r="7" fill="var(--ink)" />
        <text x="0" y="22" textAnchor="middle" {...t} fill="var(--ink)">D’s conduct</text>
        <text x="0" y="36" textAnchor="middle" {...t} fill="var(--ink-2)" style={{ opacity: s.personalBest ? 1 : 0, transition: 'opacity var(--dur-micro) var(--ease-out)' }}>(their personal best)</text>
      </g>
    </svg>
  );
}

function view(s: S): SimView {
  const short = s.conduct !== 'meets';
  const figure = (
    <div role="group" aria-label="A standard-of-care scale with the defendant's conduct marked on it">
      <Scale s={s} />
      <p data-note="risk" style={{ margin: 'var(--s-2) 0 0', fontSize: 'var(--t-xs)', color: 'var(--ink-2)', opacity: s.riskRemained ? 1 : 0.45, transition: 'opacity var(--dur-micro) var(--ease-out)' }}>
        {s.riskRemained ? 'Some risk of injury remained: the duty is to take reasonable care, not to eliminate risk (Swain).' : 'Leftover risk: none flagged.'}
      </p>
      <p style={{ margin: 'var(--s-2) 0 0', fontSize: 'var(--t-xs)', color: 'var(--ink-2)' }}>
        Blyth: negligence is the <strong style={{ color: s.form === 'omission' ? 'var(--ink)' : 'var(--ink-2)', fontWeight: s.form === 'omission' ? 600 : 400 }}>omission to do</strong> what the reasonable man would do, or <strong style={{ color: s.form === 'act' ? 'var(--ink)' : 'var(--ink-2)', fontWeight: s.form === 'act' ? 600 : 400 }}>doing</strong> what a prudent and reasonable man would not do.
      </p>
    </div>
  );
  const limb = s.form === 'omission' ? 'an omission (Blyth’s first limb)' : 'a positive act (Blyth’s second limb)';
  const verdict = short
    ? `Breach: the conduct — ${limb} — falls ${s.conduct === 'far-short' ? 'far' : 'just'} short of the standard, and the margin makes no difference.${s.personalBest ? ' Doing their personal best does not help: the standard is objective.' : ''}`
    : `No breach: the conduct meets the standard of reasonable care.${s.riskRemained ? ' Leftover risk does not change that — reasonableness, not elimination of risk, is the measure.' : ''}`;
  return { figure, verdict, tone: short ? 'yes' : 'no' };
}

function describe(a: S, b: S) {
  if (a.conduct !== b.conduct)
    return b.conduct === 'meets'
      ? 'The conduct now matches what a reasonable person would do: no shortfall, so no breach.'
      : b.conduct === 'just-short'
        ? 'Just short of the line: still a breach — it makes no difference whether the conduct falls far short or just short.'
        : 'Far short of the line: a breach — but no more of a breach than falling just short.';
  if (a.personalBest !== b.personalBest)
    return b.personalBest
      ? 'Personal best on: the standard line does not move. It is set by a reasonable person, not by this defendant.'
      : 'Personal best off: nothing changes — the defendant’s own effort was never the measure.';
  if (a.riskRemained !== b.riskRemained)
    return b.riskRemained
      ? 'Some risk remained: the duty is not an absolute duty to avoid injury, so leftover risk alone neither proves nor excuses breach.'
      : 'No leftover risk flagged: the verdict still turns only on where the conduct sits against the line.';
  if (a.form !== b.form)
    return b.form === 'omission'
      ? 'An omission: failing to do what the reasonable man would do is negligence under Blyth.'
      : 'A positive act: doing what a prudent and reasonable man would not do is negligence under Blyth.';
  return '';
}

export default function StandardOfCareReasonableness() {
  return (
    <Simulation<S>
      label="The standard of care: an objective line the defendant's conduct is measured against"
      terms={[
        { term: 'Standard of care', def: 'The yardstick for breach: what a reasonable person would do in response to a foreseeable injury.' },
        { term: 'Objective standard', def: 'Judged against the reasonable person, not the defendant’s own personal best.' },
        { term: 'Reasonable care', def: 'The duty is to take reasonable care — not an absolute duty to avoid injury (Swain).' },
      ]}
      initial={initial}
      controls={[
        {
          key: 'conduct', label: 'The defendant’s conduct', type: 'select', options: [
            { value: 'meets', label: 'Meets the standard' },
            { value: 'just-short', label: 'Falls just short of the standard' },
            { value: 'far-short', label: 'Falls far short of the standard' },
          ],
        },
        {
          key: 'form', label: 'Form of the conduct', type: 'select', options: [
            { value: 'omission', label: 'An omission (failing to act)' },
            { value: 'act', label: 'A positive act' },
          ],
        },
        { key: 'personalBest', label: 'The defendant did their personal best', type: 'toggle' },
        { key: 'riskRemained', label: 'Some risk of injury remained', type: 'toggle' },
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'A defendant did their genuine personal best, but a reasonable person would have done more. What follows?',
        options: [
          { text: 'No breach: a defendant who did their personal best has met the standard', why: 'Tempting because effort seems to matter, but the standard is objective; a personal best that is not reasonable falls short.' },
          { text: 'They may be in breach: the standard is a reasonable person’s response, not their best', correct: true, why: 'Conduct is judged against an objective standard, so falling short of what a reasonable person would do is breach.' },
          { text: 'Breach only if they fell far short of what a reasonable person would do', why: 'It makes no difference whether the conduct falls far short or just short: any shortfall is breach.' },
        ],
      }}
    />
  );
}
