/*
SCENE: International arbitration — two consent gates, three dials in the states' hands, one binding award
LENGTH: 4 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: Arbitration rests on consent (a treaty for future disputes, or a compromis for an existing one); the states
  control composition, applicable rules and confidentiality; tribunals are ad hoc; awards are final and binding —
  unlike the diplomatic modes, and with more control than the ICJ.
SUBJECT: the path from the two gates, through the tribunal and its dials, down to the award.
STEP 1: the two consent gates.
STEP 2: the tribunal and its three dials (composition, rules, confidentiality) + flexible procedure.
STEP 3: the award — final and binding upon the parties.
STEP 4: ad hoc, temporary — above a dashed outline of the standing ICJ (15 elected judges; ad hoc judge only).
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: the finished figure with all four captions stacked (base).
BUDGET: < 8 KB gz. Strokes draw (DrawSVG), text fades. Narrow 360-unit canvas.
Source: concept laws2000-w08-international-arbitration; Week 8 slides 23–25; live lecture (Part A).
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const ui = { fontFamily: 'var(--font-ui)', fontSize: 12.5, letterSpacing: 1.1, fill: 'var(--ink)' } as const;
const note = { fontFamily: 'var(--font-body)', fontSize: 13.5, fill: 'var(--ink-2)' } as const;

const figure = (
  <svg viewBox={`0 0 ${W} 600`} role="img" aria-label="Two consent gates lead to an arbitral tribunal whose composition, rules and confidentiality the states control, ending in a final and binding award">
    <g data-step="1">
      <rect x="8" y="8" width="164" height="92" rx="12" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="90" y="32" textAnchor="middle" {...ui} data-label="treaty">TREATY CLAUSE</text>
      <text x="90" y="56" textAnchor="middle" {...note}>future disputes</text>
      <text x="90" y="76" textAnchor="middle" {...note}>(e.g. UNCLOS)</text>
      <rect x="188" y="8" width="164" height="92" rx="12" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="270" y="32" textAnchor="middle" {...ui} data-label="compromis">COMPROMIS</text>
      <text x="270" y="56" textAnchor="middle" {...note}>special agreement,</text>
      <text x="270" y="76" textAnchor="middle" {...note}>after it has arisen</text>
      <path d="M 90 100 L 90 124 L 270 124 L 270 100" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
      <line x1="180" y1="124" x2="180" y2="150" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="190" y="142" {...note}>consent</text>
    </g>
    <g data-step="2">
      <rect x="8" y="150" width={W - 16} height="176" rx="12" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x={W / 2} y="176" textAnchor="middle" {...ui} data-label="tribunal">THE TRIBUNAL — STATES IN CONTROL</text>
      {[
        ['composition', 'number and identity of arbitrators —', 'often one each, the third agreed'],
        ['rules', 'rules applied — a specific treaty,', 'national law …'],
        ['confidentiality', 'proceedings may be kept confidential;', 'flexible procedure, often faster'],
      ].map(([id, a, b], i) => (
        <g key={id}>
          <circle cx="30" cy={204 + i * 40} r="6" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
          <text x="46" y={208 + i * 40} {...note} fill="var(--ink)">{a}</text>
          <text x="46" y={226 + i * 40} {...note}>{b}</text>
        </g>
      ))}
    </g>
    <g data-step="3">
      <line x1={W / 2} y1="326" x2={W / 2} y2="350" stroke="var(--ink)" strokeWidth="1.5" />
      <rect x="40" y="350" width={W - 80} height="88" rx="12" fill="none" stroke="var(--ink)" strokeWidth="2" />
      <text x={W / 2} y="378" textAnchor="middle" {...ui} data-label="award">ARBITRAL AWARD</text>
      <text x={W / 2} y="402" textAnchor="middle" {...note} fill="var(--ink)">final and binding</text>
      <text x={W / 2} y="422" textAnchor="middle" {...note}>upon the parties</text>
    </g>
    <g data-step="4">
      <text x="16" y="472" {...ui} data-label="ad-hoc">AD HOC — TEMPORARY TRIBUNALS</text>
      <rect x="8" y="486" width={W - 16} height="96" rx="12" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="6 5" />
      <text x={W / 2} y="510" textAnchor="middle" {...ui} fill="var(--ink-2)">CONTRAST: THE ICJ</text>
      <text x={W / 2} y="534" textAnchor="middle" {...note}>a standing court of 15 elected judges;</text>
      <text x={W / 2} y="554" textAnchor="middle" {...note}>parties may add only an ad hoc judge;</text>
      <text x={W / 2} y="574" textAnchor="middle" {...note}>procedure set by Statute and Rules</text>
    </g>
  </svg>
);

export default function InternationalArbitration() {
  return (
    <Diagram
      label="International arbitration: consent, state control, a binding award"
      terms={[
        { term: 'Compromis', def: 'A special agreement submitting a particular, existing dispute to a tribunal.' },
        { term: 'Ad hoc', def: 'Set up for one dispute, then dissolved — not a standing court.' },
        { term: 'Arbitral award', def: 'The tribunal’s final decision, binding upon the parties.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'Arbitration is founded on consent: by becoming party to a treaty that provides for arbitration of future disputes (e.g. UNCLOS), or by a special agreement (compromis) once a dispute has arisen.' },
        { caption: 'States keep close control: the composition (number and identity of arbitrators), the rules to be applied (a specific treaty, national law) and confidentiality. Flexible procedure can make it faster.' },
        { caption: 'Unlike the diplomatic modes, the award is final and binding upon the parties — as in the South China Sea arbitration brought by the Philippines against China under UNCLOS.' },
        { caption: 'Arbitral tribunals are ad hoc and temporary. Contrast the ICJ: a standing court of 15 judges elected by the Security Council and General Assembly, where parties may only add an ad hoc judge.' },
      ]}
      check={{
        question: 'Two states have a treaty with no dispute clause. A dispute arises and both want arbitration. How do they consent?',
        options: [
          { text: 'They cannot: consent must be given in a treaty before the dispute arises', why: 'Consent can also be given after a dispute arises, by special agreement.' },
          { text: 'By a compromis submitting this particular dispute to arbitration', correct: true, why: 'A compromis is the special agreement by which parties submit a particular dispute to arbitration after it has arisen.' },
          { text: 'By asking the General Assembly to refer the dispute to a tribunal', why: 'Arbitration rests on the parties’ own consent; the General Assembly cannot refer a dispute to arbitration.' },
        ],
      }}
    />
  );
}
