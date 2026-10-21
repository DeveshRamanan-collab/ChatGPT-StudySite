/*
SCENE: Rights holders and duty bearers — vertical and horizontal obligations, GC 31, groups and international organisations
LENGTH: 4 steps, scroll-drawn when pinned (≈ 320vh); Next/Back otherwise (Diagram base)
BEATS: 1 state → individual (vertical arrow) · 2 private actor and the state's shield between them (horizontal) ·
  3 General Comment 31 para 8 · 4 the two ends widen: groups as right bearers, international organisations as duty bearers
INTENT: Show that the state answers both for its own agents (vertical) and for failing to protect against private
  actors (horizontal), and that groups hold and IOs owe rights too.
SUBJECT: the state's two lines down — the arrow to the individual and the shield between individual and private actor.
BEAT 1 (0–25%): state box, vertical arrow, individual box. BEAT 2 (25–50%): private actor box, shield line.
BEAT 3 (50–75%): the GC 31 quotation. BEAT 4 (75–100%): groups and IO boxes, the WHO–Egypt line. DrawSVG, ease none.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: the finished diagram with all four captions stacked (base).
BUDGET: < 5 KB gz. Narrow 360-unit canvas.
Source: concept laws2000-w12-rights-holders-and-duty-bearers; authority hrc-general-comment-31-para-8; case
  interpretation-of-the-agreement-of-25-march-1951-between-the-who-and-egypt; Week 12 lecture slides 15–16.
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const ui = { fontFamily: 'var(--font-ui)' } as const;
const body = { fontFamily: 'var(--font-body)' } as const;

const box = (x: number, y: number, w: number, h: number) => (
  <rect x={x} y={y} width={w} height={h} rx="10" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
);

const figure = (
  <svg viewBox={`0 0 ${W} 520`} role="img" aria-label="The state above the individual with a vertical arrow for its own agents' duties, and a shield line between the individual and a private actor for its horizontal duty to protect; below, groups as right bearers and international organisations as duty bearers">
    <g data-step="1">
      {box(8, 10, W - 16, 56)}
      <text x={W / 2} y="36" textAnchor="middle" {...ui} fontSize="13" letterSpacing="1.4" fill="var(--ink)" data-label="state">STATE</text>
      <text x={W / 2} y="55" textAnchor="middle" {...ui} fontSize="12" fill="var(--ink-2)">primary duty bearer</text>
      <line x1="40" y1="66" x2="40" y2="150" stroke="var(--ink)" strokeWidth="1.5" />
      <polyline points="34,142 40,150 46,142" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="52" y="100" {...ui} fontSize="12" letterSpacing="1.2" fill="var(--ink)">VERTICAL</text>
      <text x="52" y="118" {...ui} fontSize="12" fill="var(--ink-2)">duties of its own</text>
      <text x="52" y="134" {...ui} fontSize="12" fill="var(--ink-2)">agents</text>
      {box(8, 150, 192, 56)}
      <text x="104" y="174" textAnchor="middle" {...ui} fontSize="13" letterSpacing="1.4" fill="var(--ink)" data-label="individual">INDIVIDUAL</text>
      <text x="104" y="194" textAnchor="middle" {...ui} fontSize="12" fill="var(--ink-2)">right bearer</text>
    </g>
    <g data-step="2">
      <line x1="214" y1="66" x2="214" y2="150" stroke="var(--ink)" strokeWidth="1.5" />
      <line x1="214" y1="150" x2="214" y2="206" stroke="var(--ink)" strokeWidth="4" />
      <text x="228" y="100" {...ui} fontSize="12" letterSpacing="1.2" fill="var(--ink)">HORIZONTAL</text>
      <text x="228" y="118" {...ui} fontSize="12" fill="var(--ink-2)">protect against</text>
      <text x="228" y="134" {...ui} fontSize="12" fill="var(--ink-2)">private actors</text>
      {box(228, 150, 124, 56)}
      <text x="290" y="174" textAnchor="middle" {...ui} fontSize="12" letterSpacing="1" fill="var(--ink)" data-label="private-actor">PRIVATE ACTOR</text>
      <text x="290" y="194" textAnchor="middle" {...ui} fontSize="12" fill="var(--ink-2)">torture · housing</text>
    </g>
    <g data-step="3">
      <line x1="8" y1="232" x2={W - 8} y2="232" stroke="var(--ink-3)" strokeWidth="1" />
      <text x={W / 2} y="258" textAnchor="middle" {...ui} fontSize="12" letterSpacing="1.2" fill="var(--ink)" data-label="gc31">GENERAL COMMENT 31, PARA 8</text>
      <text x={W / 2} y="282" textAnchor="middle" {...body} fontSize="14" fill="var(--ink-2)">duties are “only fully discharged” if</text>
      <text x={W / 2} y="302" textAnchor="middle" {...body} fontSize="14" fill="var(--ink-2)">people are protected from state agents</text>
      <text x={W / 2} y="322" textAnchor="middle" {...body} fontSize="14" fill="var(--ink-2)">and from private persons or entities</text>
    </g>
    <g data-step="4">
      {box(8, 348, 164, 78)}
      <text x="90" y="374" textAnchor="middle" {...ui} fontSize="12" letterSpacing="1.2" fill="var(--ink)" data-label="groups">GROUPS</text>
      <text x="90" y="394" textAnchor="middle" {...ui} fontSize="12" fill="var(--ink-2)">right bearers:</text>
      <text x="90" y="412" textAnchor="middle" {...ui} fontSize="12" fill="var(--ink-2)">collective rights</text>
      {box(188, 348, 164, 78)}
      <text x="270" y="374" textAnchor="middle" {...ui} fontSize="11" letterSpacing="0.6" fill="var(--ink)" data-label="io">INT’L ORGANISATION</text>
      <text x="270" y="394" textAnchor="middle" {...ui} fontSize="12" fill="var(--ink-2)">duty bearer, e.g.</text>
      <text x="270" y="412" textAnchor="middle" {...ui} fontSize="12" fill="var(--ink-2)">peacekeeping</text>
      <text x={W / 2} y="456" textAnchor="middle" {...body} fontSize="14" fill="var(--ink-2)">IOs are bound by general international law,</text>
      <text x={W / 2} y="476" textAnchor="middle" {...body} fontSize="14" fill="var(--ink-2)">their constitutions and their agreements</text>
      <text x={W / 2} y="500" textAnchor="middle" {...ui} fontSize="12" fill="var(--ink-2)">WHO–Egypt Advisory Opinion, ICJ 1980, para 37</text>
    </g>
  </svg>
);

export default function RightsHoldersAndDutyBearers() {
  return (
    <Diagram
      label="Rights holders and duty bearers: vertical and horizontal obligations"
      terms={[
        { term: 'Duty bearer', def: 'Who owes human rights obligations — primarily states; also international organisations.' },
        { term: 'Vertical obligation', def: 'The state’s duties toward individuals under its jurisdiction.' },
        { term: 'Horizontal obligation', def: 'The state’s duty to protect individuals from violations by other private actors.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'States are the primary duty bearers and individuals the right bearers. Vertically, the state owes duties toward individuals under its jurisdiction.' },
        { caption: 'Horizontally, the state must protect individuals from violations by other private actors — the slides’ examples are torture and non-discrimination in housing.' },
        { caption: 'General Comment 31, para 8: the Covenant is not a substitute for domestic criminal or civil law, but positive obligations are only fully discharged if people are protected from state agents and from private persons or entities.' },
        { caption: 'Both ends widen. Groups hold collective rights; international organisations (e.g. in peacekeeping) owe obligations under general international law, their constitutions and their agreements (WHO–Egypt, para 37).' },
      ]}
      check={{
        question: 'Private landlords in State R refuse to rent to an ethnic minority, and R has no law against it. Whose breach, if any, is this under the ICCPR?',
        options: [
          { text: 'The landlords’, because they discriminated', why: 'The landlords are private actors, not duty bearers under the Covenant; GC 31 says it is not a substitute for domestic law.' },
          { text: 'R’s — a failure of its horizontal duty to protect', correct: true, why: 'R must protect individuals from private violations (non-discrimination in housing is the slides’ example); doing nothing fails that duty.' },
          { text: 'No one’s, because no state agent was involved', why: 'Vertical duties concern state agents, but the horizontal duty means R can be in breach where private actors cause the harm.' },
        ],
      }}
    />
  );
}
