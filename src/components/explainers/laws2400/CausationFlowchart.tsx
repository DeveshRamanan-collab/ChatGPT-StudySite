/*
SCENE: The causation flowchart as an interactive decision flow
LENGTH: 5 steps; pinned 400vh on desktop (scroll draws the flow), Next/Back otherwise (Diagram base)
BEATS: 5 (one per step); the learner answers the decision boxes at any time once they are drawn
INTENT: Show that causation has two branches that must both be satisfied, that factual causation is one question
  (necessary condition / its 'but for' mirror) with three answers — yes, no, or cannot be shown — and that only the
  third leads to s 5D(2), whose clear breach + evidentiary gap gate decides whether the path reaches scope of liability.
SUBJECT: the lit path from the learner's answer to its outcome box (sage satisfied, clay not satisfied), then on to
  scope of liability.
STEP 1 (0–20%): CAUSATION splits AND into factual causation (s 5D(1)(a)) and scope of liability (s 5D(1)(b)).
STEP 2 (20–40%): the necessary condition question, with its common law 'but for' mirror; three answer chips.
STEP 3 (40–60%): three outcomes — satisfied · not satisfied · gap case.
STEP 4 (60–80%): the s 5D(2) box — exceptional case (flowchart: appropriate case), the two kinds of case, the clear
  breach AND evidentiary gap chips.
STEP 5 (80–100%): scope of liability — new intervening acts AND remoteness, s 5D(4); routes in from "satisfied"
  and from "s 5D(2), if accepted".
  Ease: strokes draw with ease none (scrubbed); text fades (opacity). Path colour changes 180ms (--dur-micro);
  chip press scale .97 160ms (--dur-press). No positional movement.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: the finished flow with all five captions stacked (base); chips still work, colour changes instant
  (duration tokens are 0 in off).
BUDGET: < 10 KB gz (DrawSVG is in the shared motion chunk); no WebGL; 60 fps at 4× throttle.
Source: concept laws2400-w10-causation-flowchart; Topic 10 flowchart (Tort Law Principles 3e, pp 433–435); Civil
  Liability Act 2002 (NSW) s 5D (authority civil-liability-act-2002-nsw-s5d). The NSW s 5D(2) says "exceptional
  case"; the flowchart says "appropriate case" (verify: true on the concepts that rely on it).
Interaction: chips are SVG buttons (role="button", Enter/Space), focusable only once their step has been drawn (read
  from the base's data-step-now on the enclosing <figure>).
*/
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Diagram } from '../bases/Diagram';

const W = 360;
const H = 736;
const N = 5;
type A1 = 'yes' | 'no' | 'gap' | null;
type A2 = 'yes' | 'no' | null;

const head = { fontFamily: 'var(--font-ui)', fontSize: 12, letterSpacing: 1, fill: 'var(--ink)' } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 13.5, fill: 'var(--ink)' } as const;
const small = { fontFamily: 'var(--font-ui)', fontSize: 11.5, fill: 'var(--ink-2)' } as const;
const mono = { fontFamily: 'var(--font-mono)', fontSize: 12, fill: 'var(--ink)' } as const;
const tone = { transition: 'stroke var(--dur-micro) var(--ease-out), stroke-width var(--dur-micro) var(--ease-out)' };

// Local, prefixed classes only (never a shared component class): chip states per CLAUDE.md rule 8.
const CSS = `
.cfx-chip { cursor: pointer; outline: none; transform-box: fill-box; transform-origin: center; transition: transform var(--dur-press) var(--ease-out); }
.cfx-chip .cfx-face { fill: var(--paper); stroke: var(--ink-3); stroke-width: 1.5px; transition: fill var(--dur-micro) var(--ease-hover), stroke var(--dur-micro) var(--ease-out); }
.cfx-chip .cfx-label { fill: var(--ink); font-family: var(--font-ui); font-size: 12.5px; }
.cfx-chip[aria-pressed='true'] .cfx-face { fill: var(--paper-3); stroke: var(--ink); stroke-width: 2px; }
.cfx-chip .cfx-ring { fill: none; stroke: transparent; stroke-width: 2px; }
.cfx-chip:focus-visible .cfx-ring { stroke: var(--accent); }
.cfx-chip:not([aria-disabled='true']):active { transform: scale(0.97); }
.cfx-chip[aria-disabled='true'] { cursor: default; }
.cfx-chip[aria-disabled='true'] .cfx-label { fill: var(--ink-3); }
@media (hover: hover) and (pointer: fine) { .cfx-chip:not([aria-disabled='true']):hover .cfx-face { fill: var(--paper-3); } }
`;

function Chip({ x, y, w, h = 32, label, pressed, enabled, onPick }: { x: number; y: number; w: number; h?: number; label: string; pressed: boolean; enabled: boolean; onPick: () => void }) {
  const key = (e: KeyboardEvent<SVGGElement>) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (enabled) onPick(); }
  };
  return (
    <g className="cfx-chip" role="button" tabIndex={enabled ? 0 : -1} aria-pressed={pressed} aria-disabled={!enabled}
      aria-label={label} onClick={() => enabled && onPick()} onKeyDown={key} style={{ pointerEvents: enabled ? 'auto' : 'none' }}>
      <rect className="cfx-ring" x={x - 3} y={y - 3} width={w + 6} height={h + 6} rx={(h + 6) / 2} />
      <rect className="cfx-face" x={x} y={y} width={w} height={h} rx={h / 2} />
      <text className="cfx-label" x={x + w / 2} y={y + h / 2 + 4.5} textAnchor="middle">{label}</text>
    </g>
  );
}

const line = (on: boolean, color = 'var(--ink)') => ({ stroke: on ? color : 'var(--ink-3)', strokeWidth: on ? 2.5 : 1.5, fill: 'none', style: tone });
const box = (on: boolean, color = 'var(--ink)') => ({ stroke: on ? color : 'var(--ink-3)', strokeWidth: on ? 2.5 : 1.5, fill: 'none', style: tone });

function status(a1: A1, a2: A2): [string, string] {
  if (a1 === 'yes') return ['Factual causation satisfied —', 'now scope of liability (both are needed).'];
  if (a1 === 'no') return ['Factual causation not satisfied:', 'on the flowchart, causation fails here.'];
  if (a1 === 'gap') {
    if (a2 === 'yes') return ['s 5D(2) is open: the court weighs whether', 'and why responsibility should be imposed.'];
    if (a2 === 'no') return ['Without both, the s 5D(2) route is not open:', 'factual causation is not established.'];
    return ['Necessary condition can’t be shown.', 's 5D(2): a clear breach and an evidentiary gap?'];
  }
  return ['Answer the necessary condition question', 'to follow the path.'];
}

function Flow() {
  const ref = useRef<SVGSVGElement>(null);
  const [now, setNow] = useState(N);
  const [a1, setA1] = useState<A1>(null);
  const [a2, setA2] = useState<A2>(null);

  // Which step the base has drawn: chips become focusable only once visible.
  useEffect(() => {
    const fig = ref.current?.closest('figure');
    if (!fig) return;
    const read = () => { const v = fig.getAttribute('data-step-now'); setNow(v === null ? N : Number(v)); };
    read();
    const mo = new MutationObserver(read);
    mo.observe(fig, { attributes: true, attributeFilter: ['data-step-now'] });
    return () => mo.disconnect();
  }, []);

  const pick1 = (v: Exclude<A1, null>) => { setA1(v); setA2(null); };
  const gap = a1 === 'gap';
  const accepted = gap && a2 === 'yes';
  const scope = a1 === 'yes' || accepted;
  const [s1, s2] = status(a1, a2);

  return (
    <svg ref={ref} viewBox={`0 0 ${W} ${H}`} role="group"
      aria-label="Causation flowchart. Causation splits into factual causation and scope of liability, both needed. Answer whether the fault was a necessary condition of the harm: yes leads to satisfied and on to scope of liability; no leads to not satisfied; cannot be shown leads to section 5D(2), which needs a clear breach and an evidentiary gap.">
      <style>{CSS}</style>
      <g data-step="1">
        <rect x="110" y="8" width="140" height="34" rx="10" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
        <text x={W / 2} y="30" textAnchor="middle" {...head} data-label="causation">CAUSATION</text>
        <path d="M180 42 V52 M92 52 H268 M92 52 V72 M268 52 V72" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
        <text x={W / 2} y="67" textAnchor="middle" {...small} fill="var(--ink)">AND</text>
        <rect x="8" y="72" width="168" height="54" rx="10" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
        <text x="92" y="94" textAnchor="middle" {...head} data-label="factual">FACTUAL CAUSATION</text>
        <text x="92" y="114" textAnchor="middle" {...mono}>s 5D(1)(a)</text>
        <rect x="184" y="72" width="168" height="54" rx="10" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
        <text x="268" y="94" textAnchor="middle" {...head} data-label="scope">SCOPE OF LIABILITY</text>
        <text x="268" y="114" textAnchor="middle" {...mono}>s 5D(1)(b)</text>
      </g>

      <g data-step="2">
        <line x1="92" y1="126" x2="92" y2="140" stroke="var(--ink-3)" strokeWidth="1.5" />
        <rect x="8" y="140" width="344" height="78" rx="12" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
        <text x={W / 2} y="164" textAnchor="middle" {...body}>Was the defendant’s fault a necessary</text>
        <text x={W / 2} y="183" textAnchor="middle" {...body}>condition of the harm?</text>
        <text x={W / 2} y="205" textAnchor="middle" {...small}>common law: the ‘but for’ question — its mirror image</text>
        <path d="M60 218 V228 M180 218 V228 M300 218 V228" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
        <Chip x={8} y={230} w={104} label="Yes" pressed={a1 === 'yes'} enabled={now >= 2} onPick={() => pick1('yes')} />
        <Chip x={128} y={230} w={104} label="No" pressed={a1 === 'no'} enabled={now >= 2} onPick={() => pick1('no')} />
        <Chip x={248} y={230} w={104} label="Can’t be shown" pressed={gap} enabled={now >= 2} onPick={() => pick1('gap')} />
      </g>

      <g data-step="3">
        <line x1="60" y1="264" x2="60" y2="282" {...line(a1 === 'yes')} />
        <line x1="180" y1="264" x2="180" y2="282" {...line(a1 === 'no')} />
        <line x1="300" y1="264" x2="300" y2="282" {...line(gap)} />
        <rect x="8" y="282" width="104" height="62" rx="10" {...box(a1 === 'yes', 'var(--sage)')} />
        <text x="60" y="304" textAnchor="middle" {...head} fontSize="11" letterSpacing=".6" data-label="satisfied">SATISFIED</text>
        <text x="60" y="322" textAnchor="middle" {...small}>go on to scope</text>
        <text x="60" y="337" textAnchor="middle" {...small}>of liability</text>
        <rect x="128" y="282" width="104" height="62" rx="10" {...box(a1 === 'no', 'var(--clay)')} />
        <text x="180" y="304" textAnchor="middle" {...head} fontSize="11" letterSpacing=".6" data-label="not-satisfied">NOT SATISFIED</text>
        <text x="180" y="322" textAnchor="middle" {...small}>causation</text>
        <text x="180" y="337" textAnchor="middle" {...small}>fails here</text>
        <rect x="248" y="282" width="104" height="62" rx="10" {...box(gap)} />
        <text x="300" y="304" textAnchor="middle" {...head} fontSize="11" letterSpacing=".6" data-label="gap">GAP CASE</text>
        <text x="300" y="322" textAnchor="middle" {...small}>s 5D(2) route</text>
        <text x="300" y="337" textAnchor="middle" {...small}>(below)</text>
      </g>

      <g data-step="4">
        <line x1="300" y1="344" x2="300" y2="364" {...line(gap)} />
        <rect x="128" y="364" width="224" height="176" rx="12" {...box(gap, a2 === 'no' ? 'var(--clay)' : 'var(--ink)')} />
        <text x="240" y="386" textAnchor="middle" {...mono} data-label="s5d2">s 5D(2) · exceptional case</text>
        <text x="240" y="404" textAnchor="middle" {...small}>flowchart: ‘an appropriate case’</text>
        <text x="240" y="428" textAnchor="middle" {...body} fill="var(--ink-2)">multiple sufficient causes, or</text>
        <text x="240" y="446" textAnchor="middle" {...body} fill="var(--ink-2)">material contribution to harm</text>
        <text x="240" y="470" textAnchor="middle" {...body}>must also be: a clear breach</text>
        <text x="240" y="488" textAnchor="middle" {...body}>AND an evidentiary gap?</text>
        <Chip x={144} y={500} w={88} h={30} label="Both" pressed={a2 === 'yes'} enabled={now >= 4 && gap} onPick={() => setA2('yes')} />
        <Chip x={248} y={500} w={88} h={30} label="Not both" pressed={a2 === 'no'} enabled={now >= 4 && gap} onPick={() => setA2('no')} />
      </g>

      <g data-step="5">
        <path d="M60 344 V354 H20 V588" {...line(a1 === 'yes', 'var(--sage)')} />
        <text x="30" y="440" {...small}>factual</text>
        <text x="30" y="456" {...small}>causation</text>
        <text x="30" y="472" {...small}>satisfied</text>
        <line x1="240" y1="540" x2="240" y2="588" {...line(accepted)} />
        <text x="248" y="568" {...small}>if accepted</text>
        <rect x="8" y="588" width="344" height="98" rx="12" {...box(scope)} />
        <text x={W / 2} y="610" textAnchor="middle" {...head} data-label="scope-detail">SCOPE OF LIABILITY · s 5D(1)(b)</text>
        <text x={W / 2} y="634" textAnchor="middle" {...body}>new intervening acts  AND  remoteness</text>
        <text x={W / 2} y="656" textAnchor="middle" {...small}>s 5D(4): whether or not and why responsibility</text>
        <text x={W / 2} y="673" textAnchor="middle" {...small}>should be imposed on the negligent party</text>
      </g>

      <g aria-live="polite" style={{ opacity: now >= 2 ? 1 : 0, transition: 'opacity var(--dur-ui) var(--ease-out)' }} data-verdict>
        <text x={W / 2} y="712" textAnchor="middle" {...body} fontWeight="600">{s1}</text>
        <text x={W / 2} y="730" textAnchor="middle" {...body}>{s2}</text>
      </g>
    </svg>
  );
}

export default function CausationFlowchart() {
  return (
    <Diagram
      label="The causation flowchart as a decision flow: factual causation, the s 5D(2) route, and scope of liability"
      terms={[
        { term: 'Factual causation', def: 'Was the negligence a necessary condition of the harm? (s 5D(1)(a); at common law, the ‘but for’ test).' },
        { term: 'Scope of liability', def: 'Is it appropriate for liability to extend to the harm so caused? (s 5D(1)(b)).' },
        { term: 'Gap case', def: 'Negligence cannot be established as a necessary condition: multiple sufficient causes, or material contribution to harm.' },
        { term: 'Evidentiary gap', def: 'What the s 5D(2) route needs, with a clear breach, on the textbook flowchart.' },
      ]}
      figure={<Flow />}
      steps={[
        { caption: 'Causation has two branches, and both must be satisfied: factual causation (s 5D(1)(a)) and scope of liability (s 5D(1)(b)).' },
        { caption: 'Factual causation asks one question: was the defendant’s fault a necessary condition of the harm? At common law the mirror question is ‘would the injuries have been suffered but for the negligence?’ Choose an answer to light the path.' },
        { caption: 'Yes: factual causation is satisfied. No: it is not satisfied, and causation fails. If necessary condition cannot be shown — multiple sufficient causes, or material contribution to harm — the flowchart turns to s 5D(2).' },
        { caption: 'Section 5D(2) applies in an exceptional case (the flowchart says ‘an appropriate case’). There must also be a clear breach and an evidentiary gap; then the court considers whether and why responsibility should be imposed.' },
        { caption: 'Scope of liability has two parts joined by AND: new intervening acts and remoteness, with the s 5D(4) responsibility question. Topic 10 introduces intervening acts; Topic 11 decides both parts.' },
      ]}
      check={{
        question: 'Lee’s injuries would have been suffered anyway, whatever the defendant did. Where does the flowchart path end?',
        options: [
          { text: 'Factual causation not satisfied — the fault was not a necessary condition', correct: true, why: 'If the injuries would have happened anyway, the statutory answer is No (and the ‘but for’ answer Yes): the flowchart marks factual causation not satisfied.' },
          { text: 'The s 5D(2) route, because the result is hard on the plaintiff', why: 's 5D(2) is for cases where necessary condition cannot be established — an evidentiary gap — not where the evidence shows the harm would have happened anyway.' },
          { text: 'Scope of liability, because a clear breach is enough for factual causation', why: 'A clear breach does not establish factual causation; scope of liability is reached only after factual causation is satisfied.' },
        ],
      }}
    />
  );
}
