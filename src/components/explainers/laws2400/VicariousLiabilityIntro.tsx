/*
SCENE: Introducing vicarious liability — liability flowing up from employee to employer
LENGTH: 4 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: Vicarious liability is about who pays, not whether a tort was committed: the employee's tort comes first,
  then liability flows up to the employer for Fleming's policy reasons.
SUBJECT: the upward arrow from the employee's tort to the employer.
STEPS: 1 employee commits a tort in the course of employment · 2 liability flows up to the employer · 3 Fleming's
  three policy reasons as labelled arrows · 4 admonitory value (deterrence on larger units).
REDUCED MOTION: the finished diagram with all four captions stacked.
BUDGET: < 6 KB gz. Narrow 360-unit canvas.
Source: concept laws2400-w01-vicarious-liability-intro; authority fleming-vicarious-liability-policy-rationale.
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const ui = { fontFamily: 'var(--font-ui)', fontSize: 13, letterSpacing: 1.5, fill: 'var(--ink)' } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 15, fill: 'var(--ink-2)' } as const;
const small = { fontFamily: 'var(--font-ui)', fontSize: 12.5, fill: 'var(--ink-2)' } as const;

function Reason({ y, n, lines }: { y: number; n: string; lines: string[] }) {
  return (
    <>
      <path d={`M60 ${y + 30} L60 ${y} M54 ${y + 8} L60 ${y} L66 ${y + 8}`} fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
      <text x="76" y={y + 6} fontFamily="var(--font-mono)" fontSize="12" fill="var(--ink-2)">{n}</text>
      {lines.map((l, i) => <text key={i} x="96" y={y + 6 + i * 17} {...small}>{l}</text>)}
    </>
  );
}

const figure = (
  <svg viewBox={`0 0 ${W} 600`} role="img" aria-label="Employer above, employee below; liability flows up from the employee's tort, with Fleming's policy reasons as labelled arrows">
    <g data-step="1">
      <rect x="8" y="480" width={W - 16} height="100" rx="12" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x={W / 2} y="508" textAnchor="middle" {...ui} data-label="employee">EMPLOYEE</text>
      <text x={W / 2} y="534" textAnchor="middle" {...body}>commits a tort</text>
      <text x={W / 2} y="556" textAnchor="middle" {...body}>in the course of employment</text>
    </g>
    <g data-step="2">
      <rect x="8" y="10" width={W - 16} height="80" rx="12" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x={W / 2} y="38" textAnchor="middle" {...ui} data-label="employer">EMPLOYER</text>
      <text x={W / 2} y="64" textAnchor="middle" {...body}>liable for the employee's tort</text>
      <path d="M30 480 L30 90 M22 102 L30 90 L38 102" fill="none" stroke="var(--ink)" strokeWidth="2" />
    </g>
    <g data-step="3">
      <Reason y={130} n="1" lines={['Enterprise: engages others to advance', 'its own economic interests, so should', 'fairly bear the losses of that enterprise']} />
      <Reason y={220} n="2" lines={['Recompense: a more promising source', 'than an employee — often "a man of', 'straw without insurance"']} />
      <Reason y={310} n="3" lines={['Loss spreading: passed on through', 'liability insurance and higher prices']} />
    </g>
    <g data-step="4">
      <Reason y={390} n="+" lines={['Admonitory value: deterrence works best', 'on larger units that organise, supervise', 'and discipline staff']} />
    </g>
  </svg>
);

export default function VicariousLiabilityIntro() {
  return (
    <Diagram
      label="Vicarious liability: the employee's tort, liability flowing up to the employer, and Fleming's policy reasons"
      terms={[
        { term: 'Vicarious liability', def: 'Liability of one person or entity for a tort committed by someone else.' },
        { term: 'Course of employment', def: "The employee's tort must be committed while acting within their employment (tests: Topic 12)." },
        { term: 'Loss spreading', def: 'Passing a loss across many people, through insurance and prices.' },
        { term: 'Admonitory value', def: 'A warning effect that encourages accident prevention.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'Start with the employee: vicarious liability only arises once an employee has committed a tort in the course of their employment.' },
        { caption: "Liability then flows up: the employer is liable for the employee's tort. The question is who pays, not whether a tort was committed." },
        { caption: "Fleming's policy reasons: the enterprise should bear its own losses; the employer is a better source of recompense; and it can spread the loss through insurance and prices." },
        { caption: 'It also has admonitory value: deterrent pressure works best on employers, who can organise, supervise and discipline their staff.' },
      ]}
      check={{
        question: 'Before asking whether an employer is vicariously liable, what must be shown?',
        options: [
          { text: 'That the employer itself was at fault', why: "Vicarious liability does not need the employer's own fault — it is liability for someone else's tort." },
          { text: 'That the employee committed a tort', correct: true, why: "Vicarious liability is about who pays; the employee must still have committed a tort first." },
          { text: 'That the employee has no insurance', why: 'The "man of straw" point is a policy reason for the rule, not an element that must be proved.' },
        ],
      }}
    />
  );
}
