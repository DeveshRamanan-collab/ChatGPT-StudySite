/*
SCENE: Two kinds of gap case — multiple sufficient causes and material contribution to harm
LENGTH: 4 steps; pinned 320vh on desktop (scroll draws), Next/Back otherwise (Diagram base)
BEATS: 4 (one per step)
INTENT: Show the flowchart's answer to "what is an appropriate case?" for s 5D(2) as two columns that differ in the
  one thing that cannot be proved — each factor's share, or the cause itself — and then join at the same requirements.
SUBJECT: the underlined "can't prove" line in each column.
STEP 1 (0–25%): the question box (NSW text: exceptional case) forks into two columns.
STEP 2 (25–50%): left column — multiple sufficient causes, its description, "can't prove: each factor's share", cases.
STEP 3 (50–75%): right column — material contribution to harm, its description, "can't prove: the cause", cases.
STEP 4 (75–100%): the columns join: must also be a clear breach AND an evidentiary gap; the court's responsibility
  question. Ease: strokes draw with ease none (scrubbed); text fades (opacity only).
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: the finished figure with all four captions stacked (base).
BUDGET: < 8 KB gz (DrawSVG is in the shared motion chunk); no WebGL; 60 fps at 4× throttle.
Source: concept laws2400-w10-multiple-sufficient-causes-and-material-contribution; Topic 10 flowchart p 435
  (Causation 3), whose pairing of descriptions and cases is reproduced as drawn; Civil Liability Act 2002 (NSW)
  s 5D(2). Fixed Oct 2026 for the Topic 10 slides (Lecture 2, slides 8–13): the lectures call the flowchart's
  'material contribution' description increased risk (not enough — Amaca v Ellis) and treat Bonnington as a material
  contribution case, so the terms, captions and check now say which labels are the flowchart's.
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const head = { fontFamily: 'var(--font-ui)', fontSize: 12, letterSpacing: 1, fill: 'var(--ink)' } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 12.5, fill: 'var(--ink-2)' } as const;
const small = { fontFamily: 'var(--font-ui)', fontSize: 11.5, fill: 'var(--ink-2)' } as const;
const cite = { fontFamily: 'var(--font-body)', fontSize: 12.5, fontStyle: 'italic', fill: 'var(--ink)' } as const;

function Lines({ x, y, lines, gap = 18, style = body }: { x: number; y: number; lines: string[]; gap?: number; style?: Record<string, unknown> }) {
  return <>{lines.map((l, i) => <text key={i} x={x} y={y + i * gap} {...style}>{l}</text>)}</>;
}

function Column({ x, titles, desc, cant, cases, id }: { x: number; titles: string[]; desc: string[]; cant: string; cases: string[]; id: string }) {
  const cx = x + 84;
  return (
    <>
      <rect x={x} y="92" width="168" height="344" rx="10" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      {titles.map((t, i) => <text key={t} x={cx} y={114 + i * 16} textAnchor="middle" {...head} fontSize="11.5" letterSpacing=".8" data-label={i === 0 ? id : undefined}>{t}</text>)}
      <Lines x={x + 10} y={158} lines={desc} />
      <text x={x + 10} y="292" {...small}>can’t prove:</text>
      <text x={x + 10} y="311" {...body} fill="var(--ink)" fontWeight="600">{cant}</text>
      <line x1={x + 10} y1="317" x2={x + 150} y2="317" stroke="var(--ink)" strokeWidth="1.5" />
      <Lines x={x + 10} y={346} lines={cases} gap={18} style={cite} />
    </>
  );
}

const figure = (
  <svg viewBox={`0 0 ${W} 576`} role="img"
    aria-label="Two kinds of appropriate case for section 5D(2). Multiple sufficient causes: cumulative factors whose individual contributions are unascertainable. Material contribution to harm: conduct that materially increases the risk where science or medicine cannot prove the cause. Both also need a clear breach and an evidentiary gap.">
    <g data-step="1">
      <rect x="8" y="8" width={W - 16} height="56" rx="12" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x={W / 2} y="31" textAnchor="middle" {...head} data-label="question">s 5D(2) · WHAT IS AN APPROPRIATE CASE?</text>
      <text x={W / 2} y="51" textAnchor="middle" {...small}>NSW text: “an exceptional case”</text>
      <path d="M180 64 V76 M92 76 H268 M92 76 V92 M268 76 V92" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
    </g>
    <g data-step="2">
      <Column x={8} id="msc" titles={['MULTIPLE', 'SUFFICIENT CAUSES']}
        desc={['the cumulative', 'operation of factors', 'in the total harm,', 'where each factor’s', 'contribution to that', 'harm is', 'unascertainable']}
        cant="each factor’s share" cases={['Bonnington Castings', 'v Wardlaw', 'March v Stramare']} />
    </g>
    <g data-step="3">
      <Column x={184} id="mc" titles={['MATERIAL', 'CONTRIBUTION TO HARM']}
        desc={['negligent conduct that', 'materially increases', 'the risk of harm, where', 'scientific or medical', 'knowledge makes it', 'impossible to prove', 'the cause']}
        cant="the cause itself" cases={['Fairchild v Glenhaven', 'McGee v National', 'Coal Board', 'Amaca Pty Ltd v Ellis', 'Henville v Walker']} />
    </g>
    <g data-step="4">
      <path d="M92 436 V456 M268 436 V456 M92 456 H268 M180 456 V472" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
      <rect x="8" y="472" width={W - 16} height="96" rx="12" fill="none" stroke="var(--ink)" strokeWidth="2" />
      <text x={W / 2} y="494" textAnchor="middle" {...head} data-label="must-also">MUST ALSO BE</text>
      <text x={W / 2} y="516" textAnchor="middle" {...body} fontSize="13.5" fill="var(--ink)">a clear breach  AND  an evidentiary gap</text>
      <text x={W / 2} y="540" textAnchor="middle" {...small}>then the court considers whether or not and why</text>
      <text x={W / 2} y="557" textAnchor="middle" {...small}>responsibility should be imposed (s 5D(2))</text>
    </g>
  </svg>
);

export default function SufficientCausesAndMaterialContribution() {
  return (
    <Diagram
      label="Two kinds of gap case for s 5D(2): multiple sufficient causes and material contribution to harm"
      terms={[
        { term: 'Gap case', def: 'A case where the ‘but for’ / necessary condition test yields unsatisfactory results.' },
        { term: 'Multiple sufficient causes', def: 'Factors operating cumulatively, where each factor’s contribution to the harm is unascertainable.' },
        { term: 'Material contribution to harm', def: 'The flowchart’s label for conduct that materially increases the risk where science cannot prove the cause. The lectures call that increased risk, and keep ‘material contribution’ for a causal, more than negligible contribution.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'Where the ‘but for’ / necessary condition test yields unsatisfactory results, the flowchart asks what “an appropriate case” for s 5D(2) is (the NSW text says “an exceptional case”). It gives two kinds.' },
        { caption: 'Multiple sufficient causes: “the cumulative operation of factors in the occurrence of the total harm in circumstances in which the contribution of each factor to that harm is unascertainable” — eg Bonnington Castings v Wardlaw; March v Stramare.' },
        { caption: 'Material contribution to harm: “the negligent conduct that materially increases the risk of harm in circumstances in which the state of scientific or medical knowledge makes it impossible to prove the cause” — eg Fairchild; McGee; Amaca; Henville. The lectures call this increased risk, which Amaca v Ellis holds is not enough in Australia.' },
        { caption: 'Both kinds meet at the same requirements: a clear breach and an evidentiary gap, and the court considers whether and why responsibility should be imposed. The lectures relabel: Bonnington is a material contribution case (more than negligible), and increased risk alone is not enough (Ellis).' },
      ]}
      check={{
        question: 'Ana’s employer’s negligence materially increased her risk of a disease, but the state of medical knowledge cannot prove what caused it. Which kind of case is this on the textbook flowchart’s labels?',
        options: [
          { text: 'Material contribution to harm', correct: true, why: 'On the flowchart’s labels, increased risk plus a cause that science cannot prove is ‘material contribution to harm’. The lectures call it increased risk — and Amaca v Ellis holds that is not enough.' },
          { text: 'Multiple sufficient causes', why: 'That kind is about cumulative factors whose separate contributions cannot be worked out; here the cause itself cannot be proved.' },
          { text: 'Neither: necessary condition is established', why: 'It is not: the cause cannot be proved, so the necessary condition test yields an unsatisfactory result — the point at which s 5D(2) comes in.' },
        ],
      }}
    />
  );
}
