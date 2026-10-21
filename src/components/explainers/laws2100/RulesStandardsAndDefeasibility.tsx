/*
SCENE: Convergence of rules and standards — a ruleness spectrum that exceptions and concretisation pull together
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → add exceptions to a rule, concretise a standard → watch the two markers converge and certainty fall → check
INTENT: Rules and standards sit on one continuous spectrum; interpreters push rules towards standards (implicit
  exceptions: defeasibility) and standards towards rules (concretisation), so specificity manages discretion less
  than thought — yet "a rule that ends with the word 'unless…' is still a rule".
SUBJECT: the rule marker sliding from "specific rule" towards the middle as exceptions pile up.
BEAT 1 (0–100%): three exception toggles and one concretisation toggle move the markers (CSS transform 180ms
  ease-out); the certainty bar scales (transform: scaleX); verdict within 200ms.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: identical controls; a 180ms transform glide is the only motion.
BUDGET: < 6 KB gz, no WebGL.
Source: concept laws2100-w07-rules-standards-and-defeasibility; authorities schauer-the-convergence-of-rules-and-standards,
  hart-the-concept-of-law.
*/
import { Simulation, type SimView } from '../bases/Simulation';

interface S extends Record<string, unknown> {
  ill: boolean;
  priest: boolean;
  murderer: boolean;
  concretise: boolean;
}

const initial: S = { ill: false, priest: false, murderer: false, concretise: false };
const W = 360;
const X0 = 24, X1 = 336;
const head = { fontFamily: 'var(--font-ui)', fontSize: 11, letterSpacing: 1.2, fill: 'var(--ink-2)' } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 13, fill: 'var(--ink)' } as const;
const glide = { transition: 'transform 180ms var(--ease-out)' } as const;
const at = (p: number) => X0 + (X1 - X0) * p;

function view(s: S): SimView {
  const n = [s.ill, s.priest, s.murderer].filter(Boolean).length;
  const rule = 0.08 + n * 0.14;
  const std = s.concretise ? 0.6 : 0.92;
  const certainty = 1 - rule;
  const marker = (p: number, label: string, y: number, anchor: 'middle' | 'end' = 'middle') => (
    <g style={{ ...glide, transform: `translateX(${at(p) - X0}px)` }}>
      <path d={`M${X0} 118 L${X0 - 7} 106 L${X0 + 7} 106 Z`} fill="var(--ink)" />
      <text x={anchor === 'end' ? X0 + 10 : X0} y={y} textAnchor={anchor} {...body} fontSize={12}>{label}</text>
    </g>
  );
  const figure = (
    <svg viewBox={`0 0 ${W} 250`} role="img" aria-label={`Ruleness spectrum: rule marker at ${Math.round(rule * 100)}%, standard marker at ${Math.round(std * 100)}%`}>
      <text x={X0} y="22" {...head}>SPECIFIC RULE</text>
      <text x={X1} y="22" textAnchor="end" {...head}>VAGUE STANDARD</text>
      <line x1={X0} y1="120" x2={X1} y2="120" stroke="var(--ink-2)" strokeWidth="2" />
      {[0, 0.25, 0.5, 0.75, 1].map((p) => <line key={p} x1={at(p)} y1="114" x2={at(p)} y2="126" stroke="var(--ink-3)" strokeWidth="1.5" />)}
      {marker(rule, 'the rule', 146)}
      {marker(std, '"drive carefully"', 96, 'end')}
      <text x={X0} y="176" {...head}>CERTAINTY</text>
      <rect x={X0} y="186" width={X1 - X0} height="12" rx="6" fill="none" stroke="var(--ink-3)" strokeWidth="1" />
      <rect x={X0} y="186" width={X1 - X0} height="12" rx="6" fill="var(--ink-2)" style={{ ...glide, transform: `scaleX(${certainty})`, transformOrigin: `${X0}px 0` }} />
      <text x={X0} y="226" {...body} fill="var(--ink-2)">{n === 0 ? 'no exceptions yet' : `${n} implicit exception${n > 1 ? 's' : ''}: "unless…"`}</text>
    </svg>
  );
  const verdict = n > 0 && s.concretise
    ? 'Convergence: the rule has drifted towards a standard and the standard towards a rule — specificity manages discretion less than "has historically been thought" (319).'
    : n > 0
      ? `Defeasible: ${n === 1 ? 'an exception' : 'exceptions'} defeat the rule's conclusion in some cases. "A rule that ends with the word 'unless…' is still a rule" (CL 139) — but less certain.`
      : s.concretise
        ? 'Concretisation: interpreters push the vague standard towards specific rules.'
        : 'Conventional wisdom: choose a specific rule for little discretion, a vague standard for more.';
  return { figure, verdict, tone: n > 0 && s.concretise ? 'open' : 'yes' };
}

function describe(a: S, b: S) {
  if (a.ill !== b.ill) return b.ill ? 'Hart: a promise is not kept when someone is dangerously ill, yet the rule survives — "exceptions incapable of exhaustive statement".' : 'Promise exception removed.';
  if (a.priest !== b.priest) return b.priest ? 'Holy Trinity (1892): labour "of any kind", yet an English priest was not a foreign labourer — an implicit exception.' : 'Holy Trinity exception removed.';
  if (a.murderer !== b.murderer) return b.murderer ? 'Riggs v Palmer read the same way: the will takes effect unless the beneficiary murdered the testator.' : 'Riggs exception removed.';
  return b.concretise ? 'Interpreters concretise "drive carefully" into more specific directives: the standard moves towards a rule.' : 'The standard is left vague again.';
}

export default function RulesStandardsAndDefeasibility() {
  return (
    <Simulation<S>
      label="Rules and standards on one spectrum: exceptions and concretisation pull them together"
      terms={[
        { term: 'Rule vs standard', def: 'A specific directive (little discretion) against a vague one like "drive carefully" (more).' },
        { term: 'Convergence hypothesis', def: 'Schauer: over time interpreters push rules towards standards and standards towards rules.' },
        { term: 'Defeasible', def: 'Capable of being defeated: a conclusion justified by some criteria can be defeated if further criteria are met.' },
      ]}
      initial={initial}
      controls={[
        { key: 'ill', label: 'Promise rule: unless someone is dangerously ill (Hart)', type: 'toggle' },
        { key: 'priest', label: 'Contract-labour ban: unless the alien is a priest (Holy Trinity)', type: 'toggle' },
        { key: 'murderer', label: 'Wills statute: unless the heir murdered the testator (Riggs)', type: 'toggle' },
        { key: 'concretise', label: 'Concretise the standard "drive carefully"', type: 'toggle' },
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'Why does Hart reject Llewellyn\'s dilemma (the formalist\'s heaven or no rules)?',
        options: [
          { text: 'Because rules never have exceptions', why: 'Hart accepts that rules may have "exceptions incapable of exhaustive statement".' },
          { text: 'Because a rule with exceptions is still a rule', correct: true, why: '"A rule that ends with the word \'unless…\' is still a rule" (CL 139): the promise rule survives the sick-bed exception.' },
          { text: 'Because standards are always better than rules', why: 'Hart makes no such claim; Schauer\'s point is that the choice may matter less than assumed.' },
        ],
      }}
    />
  );
}
