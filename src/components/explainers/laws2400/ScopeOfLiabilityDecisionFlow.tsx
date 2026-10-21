/*
SCENE: Scope of liability — the s 5D decision flow (Topic 11 flowchart, Tort Law Principles 3e pp 436–438)
LENGTH: 6 steps, scroll-drawn when pinned (6 × 80vh); Next/Back otherwise (Diagram base)
BEATS: 6
INTENT: Walk the learner down the flowchart as a decision flow: s 5D(1)(b) → s 5D(4) → split into the two common law
  concepts → each branch's gate and its two exits → the harm is within scope unless a branch cuts it off.
SUBJECT: the single path from "scope of liability" down to "within scope"; each gate draws on as its step arrives.
BEAT 1 (0–17%): factual causation (dashed: assumed) and the s 5D(1)(b) question. Strokes draw on (DrawSVG, ease none).
BEAT 2 (17–33%): s 5D(4) — whether or not and why; Wallace v Kam (policy, articulated); Ruddock v Taylor (ought).
BEAT 3 (33–50%): the split — new intervening act (left) and remoteness (right).
BEAT 4 (50–67%): left gate — volitional act or extremely unlikely coincidence? exits: chain broken / later negligence.
BEAT 5 (67–83%): right gate — kind of harm a real risk? exits: too remote / extent and manner need not be foreseen.
BEAT 6 (83–100%): both "holds" exits join: harm within the scope of liability.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: the finished flow with all six captions stacked (Diagram base off state); calm = quicker steps.
BUDGET: < 12 KB gz (DrawSVG is in the shared motion chunk); 360-unit canvas so 13px type survives phone width.
Source: concept laws2400-w11-scope-of-liability-decision-flow; Topic 11 flowchart pp 436–438; CLA s 5D(1)(b), (4)
  (src/content/authorities/civil-liability-act-2002-nsw-s5d.md). Cases appear only for the propositions the flowchart
  cites them for.
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const ui = { fontFamily: 'var(--font-ui)' } as const;

function Lines({ x, y, lines, size = 13, anchor = 'middle', fill = 'var(--ink-2)', gap = 17 }: {
  x: number; y: number; lines: string[]; size?: number; anchor?: 'middle' | 'start'; fill?: string; gap?: number;
}) {
  return (
    <>
      {lines.map((l, i) => (
        <text key={i} x={x} y={y + i * gap} textAnchor={anchor} {...ui} fontSize={size} fill={fill}>{l}</text>
      ))}
    </>
  );
}

function Title({ x, y, children, id }: { x: number; y: number; children: string; id?: string }) {
  return <text x={x} y={y} textAnchor="middle" {...ui} fontSize="12.5" letterSpacing="1.2" fill="var(--ink)" data-label={id}>{children}</text>;
}

function Arrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return (
    <>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--ink-3)" strokeWidth="1.5" />
      <polyline points={`${x2 - 4},${y2 - 6} ${x2},${y2} ${x2 + 4},${y2 - 6}`} fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
    </>
  );
}

const L = 90; // left column centre
const R = 270; // right column centre

const figure = (
  <svg viewBox={`0 0 ${W} 816`} role="img" aria-label="Decision flow: section 5D(1)(b), section 5D(4), then two branches — new intervening act and remoteness — each with an exit outside the scope of liability, joining at 'within the scope of liability'">
    <g data-step="1">
      <rect x="40" y="6" width={W - 80} height="42" rx="10" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="5 5" />
      <Title x={W / 2} y={24}>FACTUAL CAUSATION · s 5D(1)(a)</Title>
      <Lines x={W / 2} y={40} lines={['assumed satisfied']} size={12} />
      <Arrow x1={W / 2} y1={48} x2={W / 2} y2={70} />
      <rect x="8" y="72" width={W - 16} height="78" rx="12" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <Title x={W / 2} y={96} id="s5d1b">SCOPE OF LIABILITY · s 5D(1)(b)</Title>
      <Lines x={W / 2} y={118} lines={['Is it appropriate for liability to', 'extend to the harm so caused?']} size={14} fill="var(--ink)" gap={19} />
    </g>
    <g data-step="2">
      <Arrow x1={W / 2} y1={150} x2={W / 2} y2={172} />
      <rect x="8" y="174" width={W - 16} height="104" rx="12" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <Title x={W / 2} y={196} id="s5d4">s 5D(4)</Title>
      <Lines x={W / 2} y={217} lines={['whether or not and why responsibility', 'should be imposed on the negligent party']} size={13} fill="var(--ink)" />
      <Lines x={W / 2} y={252} lines={['policy, articulated — Wallace v Kam', 'normative: ought? — Ruddock v Taylor']} size={12} />
    </g>
    <g data-step="3">
      <line x1={W / 2} y1={278} x2={W / 2} y2={294} stroke="var(--ink-3)" strokeWidth="1.5" />
      <line x1={L} y1={294} x2={R} y2={294} stroke="var(--ink-3)" strokeWidth="1.5" />
      <Arrow x1={L} y1={294} x2={L} y2={312} />
      <Arrow x1={R} y1={294} x2={R} y2={312} />
      <rect x="8" y="314" width="164" height="62" rx="10" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <Title x={L} y={334} id="novus">NEW INTERVENING</Title>
      <Title x={L} y={350}>ACT</Title>
      <Lines x={L} y={367} lines={['a later event?']} size={12} />
      <rect x="188" y="314" width="164" height="62" rx="10" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <Title x={R} y={334} id="remoteness">REMOTENESS</Title>
      <Title x={R} y={350}>OF HARM</Title>
      <Lines x={R} y={367} lines={['an unexpected harm?']} size={12} />
    </g>
    <g data-step="4">
      <Arrow x1={L} y1={376} x2={L} y2={394} />
      <rect x="8" y="396" width="164" height="108" rx="10" fill="none" stroke="var(--ink-2)" strokeWidth="1.5" />
      <Lines x={L} y={414} lines={['Volitional human act,', 'or an extremely', 'unlikely, independent', 'coincidence?']} size={12.5} fill="var(--ink)" gap={16} />
      <Lines x={L} y={482} lines={['The Oropesa', 'Haber v Walker']} size={11.5} gap={15} />
      <Arrow x1={41} y1={504} x2={41} y2={526} />
      <Lines x={47} y={520} lines={['yes']} size={11} anchor="start" />
      <rect x="8" y="528" width="66" height="62" rx="8" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="4 4" />
      <Lines x={41} y={548} lines={['chain', 'broken:', 'outside']} size={11.5} fill="var(--ink)" gap={15} />
      <Arrow x1={126} y1={504} x2={126} y2={526} />
      <Lines x={132} y={520} lines={['no']} size={11} anchor="start" />
      <rect x="80" y="528" width="92" height="120" rx="8" fill="none" stroke="var(--ink-2)" strokeWidth="1.5" />
      <Lines x={126} y={546} lines={['negligence', 'instead? fact', 'and degree;', 'very risk →', 'chain holds']} size={11.5} fill="var(--ink)" gap={15} />
      <Lines x={126} y={640} lines={['Mahony; March']} size={10.5} />
    </g>
    <g data-step="5">
      <Arrow x1={R} y1={376} x2={R} y2={394} />
      <rect x="188" y="396" width="164" height="108" rx="10" fill="none" stroke="var(--ink-2)" strokeWidth="1.5" />
      <Lines x={R} y={414} lines={['Was the kind of harm', 'a real risk, not', 'far-fetched?']} size={12.5} fill="var(--ink)" gap={16} />
      <Lines x={R} y={482} lines={['Wagon Mound (No 1)', 'Wagon Mound (No 2)']} size={11.5} gap={15} />
      <Arrow x1={221} y1={504} x2={221} y2={526} />
      <Lines x={227} y={520} lines={['no']} size={11} anchor="start" />
      <rect x="188" y="528" width="66" height="62" rx="8" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="4 4" />
      <Lines x={221} y={548} lines={['too', 'remote:', 'outside']} size={11.5} fill="var(--ink)" gap={15} />
      <Arrow x1={306} y1={504} x2={306} y2={526} />
      <Lines x={312} y={520} lines={['yes']} size={11} anchor="start" />
      <rect x="260" y="528" width="92" height="120" rx="8" fill="none" stroke="var(--ink-2)" strokeWidth="1.5" />
      <Lines x={306} y={546} lines={['extent and', 'manner need', 'not be', 'foreseen;', 'take P as', 'found']} size={11.5} fill="var(--ink)" gap={15} />
      <Lines x={306} y={640} lines={['Hughes; Nader']} size={10.5} />
    </g>
    <g data-step="6">
      <line x1={126} y1={648} x2={126} y2={676} stroke="var(--ink-3)" strokeWidth="1.5" />
      <line x1={306} y1={648} x2={306} y2={676} stroke="var(--ink-3)" strokeWidth="1.5" />
      <line x1={126} y1={676} x2={306} y2={676} stroke="var(--ink-3)" strokeWidth="1.5" />
      <Arrow x1={216} y1={676} x2={216} y2={698} />
      <rect x="8" y="700" width={W - 16} height="74" rx="12" fill="none" stroke="var(--ink)" strokeWidth="2" />
      <Title x={W / 2} y={724} id="within">WITHIN THE SCOPE OF LIABILITY</Title>
      <Lines x={W / 2} y={746} lines={['the chain holds and the harm is not', 'too remote: the defendant answers for it']} size={12.5} />
      <Lines x={W / 2} y={802} lines={['Either branch alone can take the harm outside.']} size={11.5} />
    </g>
  </svg>
);

export default function ScopeOfLiabilityDecisionFlow() {
  return (
    <Diagram
      label="Scope of liability: the section 5D decision flow"
      terms={[
        { term: 'Scope of liability', def: 'CLA s 5D(1)(b): is it appropriate for liability to extend to the harm so caused?' },
        { term: 'Normative question', def: 'A question of what ought to be: should this defendant be held liable for this harm?' },
        { term: 'Novus actus interveniens', def: 'A new intervening act: a later event that may break the chain of causation.' },
        { term: 'Remoteness of harm', def: 'Whether the damage was of a reasonably foreseeable kind; it fixes the extent of liability.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'Factual causation is assumed. Scope of liability is the second element: s 5D(1)(b) asks whether it is appropriate for liability to extend to the harm so caused.' },
        { caption: 'Section 5D(4): the court considers whether or not and why responsibility should be imposed — policy it must articulate (Wallace v Kam), a normative "ought" question (Ruddock v Taylor).' },
        { caption: 'Scope of liability raises two common law concepts. Run the branch the facts raise: a later event, or an unexpected kind, extent or manner of harm.' },
        { caption: 'New intervening act: volitional human action, or an extremely unlikely, causally independent coincidence, ordinarily breaks the chain. Later negligence is fact and degree; where the defendant created that very risk, the chain holds.' },
        { caption: 'Remoteness: was the kind of harm a real, not far-fetched, risk? If not, it is too remote. If so, its extent and manner need not be foreseen, and the defendant takes the plaintiff as found.' },
        { caption: 'If neither branch takes the harm outside, it is within the scope of the defendant\'s liability.' },
      ]}
      check={{
        question: 'After the defendant\'s negligence, a stranger deliberately intervenes. Which question does the flowchart send you to first?',
        options: [
          { text: 'Was the kind of harm a real risk, not far-fetched?', why: 'That is the remoteness question. A later human act sends you to the new intervening act branch.' },
          { text: 'Was the later act volitional, or an extremely unlikely coincidence?', correct: true, why: 'A later event is a novus actus question: volitional human action, or an extremely unlikely, causally independent coincidence, ordinarily breaks the chain.' },
          { text: 'Was the negligence a necessary condition of the harm?', why: 'That is factual causation under s 5D(1)(a), which the scope of liability branch assumes is already satisfied.' },
        ],
      }}
    />
  );
}
