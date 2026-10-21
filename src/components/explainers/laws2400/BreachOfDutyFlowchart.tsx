/*
SCENE: Breach of duty — the textbook's two-question flowchart as a decision flow
LENGTH: 5 steps; pinned 400vh on desktop (scroll draws the flow), Next/Back otherwise (Diagram base)
BEATS: 5 (one per step)
INTENT: Show that breach starts from the objective standard of reasonable care, splits into the RISK and RESPONSE
  questions, and that s 5B(1)(a) AND (b) answer the first while s 5B(1)(c), with s 5B(2), answers the second —
  all three must be met for breach.
SUBJECT: the path from the general principles down through the three s 5B gates to the outcome.
STEP 1 (0–20%): general principles box draws on — standard of care, objective, reasonable care not elimination of risk.
STEP 2 (20–40%): the fork — 1 · THE RISK and 2 · THE RESPONSE boxes.
STEP 3 (40–60%): left column — s 5B(1)(a) foreseeable AND s 5B(1)(b) not insignificant.
STEP 4 (60–80%): right column — s 5B(1)(c) reasonable person's precautions; dashed s 5B(2) considerations beneath.
STEP 5 (80–100%): the columns join by AND into "breach"; a dashed box: any one fails → not negligent.
  Ease: strokes draw with ease none (scrubbed); text fades (opacity only).
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: the finished flow with all five captions stacked (base).
BUDGET: < 10 KB gz (DrawSVG is in the shared motion chunk); no WebGL; 60 fps at 4× throttle.
Source: concept laws2400-w09-breach-of-duty-flowchart; Topic 9 flowchart (Tort Law Principles 3e, pp 381–382);
  Civil Liability Act 2002 (NSW) s 5B (authority civil-liability-act-2002-nsw-s5b). The flowchart cites the WA Act;
  the NSW s 5B has the same (1)(a)–(c) and (2)(a)–(d) structure.
Updated Oct 2026 (Topic 9 Lecture 1, slides 8, 21): gate (b) no longer reads "arguably a real risk" — the slides say
  the Act raised the threshold above Wyong's "not far-fetched or fanciful" (Ipp Report), so a real risk alone is not enough.
*/
import { Diagram } from '../bases/Diagram';

// A narrow 360-unit canvas, two 168-unit columns, so text stays legible at phone width.
const W = 360;
const L = 92; // left column centre
const R = 268; // right column centre
const head = { fontFamily: 'var(--font-ui)', fontSize: 12.5, letterSpacing: 1.1, fill: 'var(--ink)' } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 13.5, fill: 'var(--ink-2)' } as const;
const mono = { fontFamily: 'var(--font-mono)', fontSize: 12, fill: 'var(--ink)' } as const;

function Lines({ x, y, lines, anchor = 'middle', gap = 18 }: { x: number; y: number; lines: string[]; anchor?: 'middle' | 'start'; gap?: number }) {
  return <>{lines.map((l, i) => <text key={i} x={x} y={y + i * gap} textAnchor={anchor} {...body}>{l}</text>)}</>;
}

function Gate({ x, y, h, code, lines, id }: { x: number; y: number; h: number; code: string; lines: string[]; id: string }) {
  return (
    <>
      <rect x={x} y={y} width="168" height={h} rx="10" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x={x + 84} y={y + 22} textAnchor="middle" {...mono} data-label={id}>{code}</text>
      <Lines x={x + 84} y={y + 42} lines={lines} />
    </>
  );
}

const figure = (
  <svg viewBox={`0 0 ${W} 700`} role="img"
    aria-label="Breach flowchart: general principles lead to two questions, the risk and the response. Section 5B(1)(a) and (b) answer the risk; section 5B(1)(c), considering section 5B(2), answers the response. All three met means breach; any one failing means not negligent.">
    <g data-step="1">
      <rect x="8" y="8" width={W - 16} height="104" rx="12" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x={W / 2} y="34" textAnchor="middle" {...head} data-label="general">GENERAL PRINCIPLES</text>
      <Lines x={W / 2} y={58} lines={['conduct measured against a standard of care', 'objective: a reasonable person’s response', 'reasonable care — not elimination of risk']} gap={19} />
    </g>
    <g data-step="2">
      <path d={`M${W / 2} 112 V132 M${L} 132 H${R} M${L} 132 V152 M${R} 132 V152`} fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
      <rect x="8" y="152" width="168" height="96" rx="10" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x={L} y="176" textAnchor="middle" {...head} data-label="risk">1 · THE RISK</text>
      <Lines x={L} y={198} lines={['reasonably foreseeable?', 'what standard is owed?']} />
      <rect x="184" y="152" width="168" height="96" rx="10" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x={R} y="176" textAnchor="middle" {...head} data-label="response">2 · THE RESPONSE</text>
      <Lines x={R} y={198} lines={['reasonable?', 'has the standard', 'been met?']} />
    </g>
    <g data-step="3">
      <line x1={L} y1="248" x2={L} y2="268" stroke="var(--ink-3)" strokeWidth="1.5" />
      <Gate x={8} y={268} h={82} id="s5b1a" code="s 5B(1)(a)" lines={['foreseeable: knew or', 'ought to have known']} />
      <line x1={L} y1="350" x2={L} y2="384" stroke="var(--ink-3)" strokeWidth="1.5" />
      <text x={L + 8} y="372" {...head} fontSize="11.5">AND</text>
      <Gate x={8} y={384} h={82} id="s5b1b" code="s 5B(1)(b)" lines={['not insignificant —', 'above not far-fetched']} />
    </g>
    <g data-step="4">
      <line x1={R} y1="248" x2={R} y2="268" stroke="var(--ink-3)" strokeWidth="1.5" />
      <Gate x={184} y={268} h={100} id="s5b1c" code="s 5B(1)(c)" lines={['a reasonable person in', 'D’s position would have', 'taken the precautions']} />
      <line x1={R} y1="368" x2={R} y2="384" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="3 4" />
      <rect x="184" y="384" width="168" height="112" rx="10" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="6 6" />
      <text x={R} y="404" textAnchor="middle" {...mono} data-label="s5b2">considering s 5B(2)</text>
      <Lines x={198} y={426} anchor="start" lines={['(a) probability', '(b) seriousness', '(c) burden', '(d) social utility']} gap={17} />
    </g>
    <g data-step="5">
      <path d={`M${L} 466 V532 M${R} 496 V532 M${L} 532 H${R} M${W / 2} 532 V560`} fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
      <text x={W / 2 + 8} y="550" {...head} fontSize="11.5">AND</text>
      <rect x="8" y="560" width={W - 16} height="60" rx="12" fill="none" stroke="var(--ink)" strokeWidth="2" />
      <text x={W / 2} y="584" textAnchor="middle" {...head} data-label="breach">ALL THREE MET → BREACH</text>
      <Lines x={W / 2} y={605} lines={['then causation and damage']} />
      <rect x="8" y="632" width={W - 16} height="60" rx="12" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="6 6" />
      <text x={W / 2} y="656" textAnchor="middle" {...head} data-label="not-negligent">ANY ONE FAILS → NOT NEGLIGENT</text>
      <Lines x={W / 2} y={677} lines={['“not negligent … unless” (s 5B(1))']} />
    </g>
  </svg>
);

export default function BreachOfDutyFlowchart() {
  return (
    <Diagram
      label="The breach of duty flowchart: two questions mapped onto section 5B"
      terms={[
        { term: 'Standard of care', def: 'What the defendant’s conduct is measured against: reasonable care, judged objectively.' },
        { term: 'The RISK question', def: 'Was the risk of injury to the plaintiff reasonably foreseeable? (what standard is owed?)' },
        { term: 'The RESPONSE question', def: 'Was the defendant’s response to that risk reasonable? (has the standard been met?)' },
        { term: 'Section 5B', def: 'The Civil Liability Act’s statutory criteria for breach, though it sits under a “Duty of care” heading.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'Start with the general principles: the court measures the defendant’s conduct against a standard of care. It is objective, and the duty is to take reasonable care, not to eliminate risk. Falling far short or just short makes no difference.' },
        { caption: 'Then two questions. 1: was the RISK of injury to the plaintiff reasonably foreseeable — what standard is owed? 2: was the defendant’s RESPONSE to that risk reasonable — has the standard been met?' },
        { caption: 'The risk question maps onto s 5B(1)(a) — a risk the defendant knew or ought to have known of — AND s 5B(1)(b) — a risk that was not insignificant. The higher the degree of risk, the less reasonable it is to do nothing.' },
        { caption: 'The response question maps onto s 5B(1)(c) — would a reasonable person in the defendant’s position have taken those precautions? — considering s 5B(2): probability, seriousness, burden and social utility, amongst other things.' },
        { caption: 'The paragraphs are joined by “and”: only a path through (a), (b) and (c) reaches breach; if any one fails, the defendant is not negligent. (The flowchart cites the WA Act; the NSW s 5B has the same structure.)' },
      ]}
      check={{
        question: 'Which parts of s 5B answer the RESPONSE question — was the defendant’s response to the risk reasonable?',
        options: [
          { text: 's 5B(1)(a) and (b)', why: 'Tempting because the response is to a foreseeable risk, but the flowchart links (a) and (b) to the RISK question.' },
          { text: 's 5B(1)(c), considering s 5B(2)(a)–(d)', correct: true, why: 'The flowchart links s 5B(1)(c) and s 5B(2)(a)–(d) to the second question: has the standard been met?' },
          { text: 's 5B(2) only, because s 5B(1) is all about foreseeability', why: 's 5B(1)(c) is itself the response question: what would a reasonable person in the defendant’s position have done?' },
        ],
      }}
    />
  );
}
