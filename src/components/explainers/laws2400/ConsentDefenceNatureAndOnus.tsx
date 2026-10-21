/*
SCENE: Consent — defence or element? A fork, and who loses on unclear evidence
LENGTH: 4 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: Consent is grounded in autonomy, but its classification is unsettled in Australia: as a defence the
  defendant proves it (McHugh J, obiter); as an element the plaintiff disproves it (Leeming JA, obiter). Whoever
  bears the onus loses if the evidence is inconclusive.
SUBJECT: the fork — root question, then each branch in turn, then the consequence box beneath both.
STEPS: 1 the root: what consent covers · 2 defence branch (Canada, Australia; McHugh J in Marion's Case) ·
  3 element branch (England, NZ; Leeming JA in White v Johnston) · 4 unsettled — onus decides who loses.
REDUCED MOTION: the finished figure with all four captions stacked.
BUDGET: < 6 KB gz. Narrow 360-unit canvas, two 164-unit columns.
Source: concept laws2400-w04-consent-defence-nature-and-onus; case cards secretary-department-of-health-and-
  community-services-v-jwb, white-v-johnston.
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const head = { fontFamily: 'var(--font-ui)', fontSize: 12.5, letterSpacing: 1.5, fill: 'var(--ink)' } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 14, fill: 'var(--ink-2)' } as const;
const stroke = { fill: 'none', stroke: 'var(--ink)', strokeWidth: 1.5 } as const;

function Branch({ x, title, lines, id }: { x: number; title: string; lines: string[]; id: string }) {
  return (
    <>
      <rect x={x} y="176" width="164" height="210" rx="12" {...stroke} />
      <text x={x + 14} y="202" {...head} data-label={id}>{title}</text>
      {lines.map((l, i) => <text key={i} x={x + 14} y={226 + i * 20} {...body}>{l}</text>)}
    </>
  );
}

const figure = (
  <svg viewBox={`0 0 ${W} 530`} role="img" aria-label="A fork: consent as a defence the defendant proves, or an element the plaintiff disproves">
    <g data-step="1">
      <rect x="8" y="8" width={W - 16} height="112" rx="12" {...stroke} />
      <text x={W / 2} y="36" textAnchor="middle" {...head} data-label="root">IS CONSENT A DEFENCE OR AN ELEMENT?</text>
      <text x={W / 2} y="62" textAnchor="middle" {...body}>free agreement to otherwise tortious conduct:</text>
      <text x={W / 2} y="82" textAnchor="middle" {...body}>battery, assault, false imprisonment,</text>
      <text x={W / 2} y="102" textAnchor="middle" {...body}>trespass to land, chattels — autonomy</text>
    </g>
    <g data-step="2">
      <path d={`M${W / 2} 120 V148 H90 V176`} {...stroke} />
      <Branch x={8} id="defence" title="A DEFENCE" lines={['D must plead and', 'prove consent', '', 'Canada, Australia', '', 'McHugh J, obiter,', "Marion's Case"]} />
    </g>
    <g data-step="3">
      <path d={`M${W / 2} 148 H270 V176`} {...stroke} />
      <Branch x={188} id="element" title="AN ELEMENT" lines={['P must plead and', 'disprove consent', '', 'England, NZ', '', 'Leeming JA, obiter,', 'White v Johnston']} />
    </g>
    <g data-step="4">
      <path d={`M90 386 V414 H270 V386 M${W / 2} 414 V430`} stroke="var(--ink-3)" strokeWidth="1.5" fill="none" />
      <rect x="8" y="430" width={W - 16} height="92" rx="12" fill="none" stroke="var(--ink)" strokeWidth="1.5" strokeDasharray="6 6" />
      <text x={W / 2} y="458" textAnchor="middle" {...head}>UNSETTLED IN AUSTRALIA</text>
      <text x={W / 2} y="484" textAnchor="middle" {...body}>whoever bears the onus loses</text>
      <text x={W / 2} y="504" textAnchor="middle" {...body}>if the evidence on consent is unclear</text>
    </g>
  </svg>
);

export default function ConsentDefenceNatureAndOnus() {
  return (
    <Diagram
      label="Consent: a defence the defendant proves, or an element the plaintiff disproves"
      terms={[
        { term: 'Consent', def: 'Freely agreeing to conduct that would otherwise be tortious.' },
        { term: 'Onus', def: 'The burden of proving a point; the party who bears it loses if the evidence is inconclusive.' },
        { term: 'Obiter', def: 'A judge’s remark not necessary to the decision, so not binding.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'Consent covers battery, assault, false imprisonment, trespass to land and interference with chattels, and rests on deference to autonomy. But what is it?' },
        { caption: 'As a defence, the defendant must plead and prove it. That is the view in Canada and Australia, and McHugh J’s obiter in Marion’s Case.' },
        { caption: 'As an element, the plaintiff must plead and disprove it — the view in England and New Zealand, and Leeming JA’s obiter in White v Johnston.' },
        { caption: 'In Australia it is unsettled: cite both obiter positions. It matters because whoever bears the onus loses when the evidence on consent is unclear.' },
      ]}
      check={{
        question: 'The evidence on whether P consented to a touching is evenly balanced. On McHugh J’s view, who wins?',
        options: [
          { text: 'P — D could not prove consent', correct: true, why: 'On McHugh J’s view consent is a defence, so D bears the onus and loses when the evidence is inconclusive.' },
          { text: 'D — P could not disprove consent', why: 'That follows Leeming JA’s view, where consent is an element P must disprove.' },
          { text: 'Neither — the court must decide consent is irrelevant', why: 'Consent is squarely in issue; the onus decides who loses on unclear evidence.' },
        ],
      }}
    />
  );
}
