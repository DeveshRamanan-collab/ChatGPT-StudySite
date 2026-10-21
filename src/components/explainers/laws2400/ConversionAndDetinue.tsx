/*
SCENE: Conversion and detinue — two ladders on one footing
LENGTH: 4 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: Both torts are reachable by a right to immediate possession alone (no actual possession, unlike trespass);
  conversion climbs to a serious dealing inconsistent with the owner's dominion, detinue to demand-then-refusal
  and an order for return.
SUBJECT: the two ladders, climbed rung by rung from the shared footing.
STEPS: 1 the footing: right to immediate possession · 2 conversion's ladder · 3 detinue's ladder ·
  4 "serious enough?" — Penfolds and Bunnings.
REDUCED MOTION: the finished diagram with all four captions stacked.
BUDGET: < 6 KB gz. Narrow 360-unit canvas, two 150-unit columns.
Source: concept laws2400-w02-conversion-and-detinue; case cards penfolds-wines-pty-ltd-v-elliott,
  bunnings-group-ltd-v-chep-australia-ltd, hocking-v-director-general-of-the-national-archives-of-australia.
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const ui = { fontFamily: 'var(--font-ui)', fontSize: 13, letterSpacing: 1.5, fill: 'var(--ink)' } as const;
const small = { fontFamily: 'var(--font-ui)', fontSize: 12.5, fill: 'var(--ink-2)' } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 14, fill: 'var(--ink-2)' } as const;
const RUNGS = [470, 385, 300, 215];

function Ladder({ x, title, id, rungs }: { x: number; title: string; id: string; rungs: string[][] }) {
  const cx = x + 74;
  return (
    <>
      <text x={cx} y="160" textAnchor="middle" {...ui} data-label={id}>{title}</text>
      <line x1={x} y1="185" x2={x} y2="530" stroke="var(--ink)" strokeWidth="1.5" />
      <line x1={x + 148} y1="185" x2={x + 148} y2="530" stroke="var(--ink)" strokeWidth="1.5" />
      {rungs.map((lines, i) => (
        <g key={i}>
          <line x1={x} y1={RUNGS[i] + 12} x2={x + 148} y2={RUNGS[i] + 12} stroke="var(--ink-3)" strokeWidth="1.5" />
          {lines.map((l, k) => <text key={k} x={cx} y={RUNGS[i] - (lines.length - 1 - k) * 16} textAnchor="middle" {...small}>{l}</text>)}
        </g>
      ))}
    </>
  );
}

const figure = (
  <svg viewBox={`0 0 ${W} 610`} role="img" aria-label="Two ladders, conversion and detinue, standing on a shared footing: a right to immediate possession">
    <g data-step="1">
      <rect x="8" y="530" width={W - 16} height="72" rx="12" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x={W / 2} y="556" textAnchor="middle" {...ui} data-label="footing">RIGHT TO IMMEDIATE POSSESSION</text>
      <text x={W / 2} y="580" textAnchor="middle" {...body}>enough for both — no actual possession needed</text>
    </g>
    <g data-step="2">
      <Ladder x={16} id="conversion" title="CONVERSION" rungs={[['+ some proprietary', 'title (not merely', 'contractual)'], ['a serious dealing', 'with the goods'], ['inconsistent with', "the owner's dominion"], ['strict liability:', 'good faith is', 'no defence']]} />
    </g>
    <g data-step="3">
      <Ladder x={196} id="detinue" title="DETINUE" rungs={[['right to immediate', 'possession'], ['a clear demand', 'for the goods'], ['a wrongful refusal'], ['court may order', 'the goods returned', '(discretionary)']]} />
    </g>
    <g data-step="4">
      <rect x="8" y="10" width={W - 16} height="128" rx="12" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="6 6" />
      <text x="24" y="36" {...ui} data-label="serious-enough">SERIOUS ENOUGH?</text>
      <text x="24" y="60" {...body}>Penfolds: the owner's branded bottles used</text>
      <text x="24" y="79" {...body}>for one's own wine — conversion.</text>
      <text x="24" y="103" {...body}>Bunnings: storing goods on pallets — no;</text>
      <text x="24" y="122" {...body}>carrying its own goods on them — yes.</text>
    </g>
  </svg>
);

export default function ConversionAndDetinue() {
  return (
    <Diagram
      label="Conversion and detinue as two ladders on a shared footing"
      terms={[
        { term: 'Dominion', def: "Dealing with goods as if one had the owner's rights over them." },
        { term: 'Right to immediate possession', def: 'Entitlement to have the goods now, without actually holding them.' },
        { term: 'Strict liability', def: 'Liability regardless of good faith or mistake.' },
        { term: 'Detinue', def: 'The tort of wrongful detention; uniquely, the court may order return.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'Both torts stand on the same footing: a right to immediate possession. Unlike trespass, actual possession at the time is not needed.' },
        { caption: "Conversion (from trover): a serious dealing inconsistent with the owner's dominion — selling, taking, or using the goods. Some proprietary title is needed, and good faith is no defence (Hocking)." },
        { caption: 'Detinue: a right to immediate possession, a clear demand and a wrongful refusal. The court may, in its discretion, order the goods returned.' },
        { caption: '"Serious enough" is contestable: Penfolds (bottles used for own wine) versus Bunnings (storage on pallets was not conversion; transporting its own goods was).' },
      ]}
      check={{
        question: 'P wants the specific painting D is holding back after P demanded it. Which action fits best?',
        options: [
          { text: 'Trespass to goods', why: 'Trespass needs actual possession at the time of the interference, and it does not get the chattel back.' },
          { text: 'Detinue', correct: true, why: 'Detinue needs only a right to immediate possession, a clear demand and a wrongful refusal — and uniquely lets the court order return.' },
          { text: 'Conversion', why: 'Conversion suits a serious dealing already done; it does not give an order for the specific chattel.' },
        ],
      }}
    />
  );
}
