/*
SCENE: International human rights machinery — Charter-based and treaty-based mechanisms, and the weight of their outputs
LENGTH: 4 steps, scroll-drawn when pinned (≈ 320vh); Next/Back otherwise (Diagram base)
BEATS: 1 the Human Rights Council · 2 its UPR and special procedures · 3 the treaty bodies and their four functions ·
  4 a weight gauge from "not binding" to "binding", marked "great weight" (Diallo)
INTENT: Separate the two pillars — the Council (a body of states) and the treaty committees (independent experts per
  treaty) — and fix that treaty body outputs are not binding but carry great weight.
SUBJECT: the box being drawn; in step 4, the marker on the gauge.
BEAT 1 (0–25%): Council box. BEAT 2 (25–50%): UPR and special procedures boxes. BEAT 3 (50–75%): treaty-based box.
BEAT 4 (75–100%): the gauge and its marker. DrawSVG strokes, ease none; text fades in.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: the finished diagram with all four captions stacked (base).
BUDGET: < 6 KB gz. Narrow 360-unit canvas.
Source: concept laws2000-w12-international-human-rights-machinery; authority unga-resolution-60-251; case
  ahmadou-sadio-diallo-republic-of-guinea-v-democratic-republic-of-the-congo (para 66); Week 12 lecture slides 23–29.
  The gauge marker's position is qualitative ("great weight"), not a measured value.
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const ui = { fontFamily: 'var(--font-ui)' } as const;
const body = { fontFamily: 'var(--font-body)' } as const;

function Box({ y, h, title, lines, id }: { y: number; h: number; title: string; lines: string[]; id: string }) {
  return (
    <>
      <rect x="8" y={y} width={W - 16} height={h} rx="10" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x={W / 2} y={y + 24} textAnchor="middle" {...ui} fontSize="12" letterSpacing="1.2" fill="var(--ink)" data-label={id}>{title}</text>
      {lines.map((l, i) => <text key={l} x={W / 2} y={y + 47 + i * 20} textAnchor="middle" {...body} fontSize="14" fill="var(--ink-2)">{l}</text>)}
    </>
  );
}

const figure = (
  <svg viewBox={`0 0 ${W} 676`} role="img" aria-label="Charter-based mechanisms (the Human Rights Council, its Universal Periodic Review and special procedures) above treaty-based committees, with a gauge showing their outputs as not binding but carrying great weight">
    <g data-step="1">
      <Box y={10} h={110} id="council" title="CHARTER-BASED · HUMAN RIGHTS COUNCIL" lines={['replaced the Commission, 2006 (res 60/251)', '47 states · 3-year terms · regional seats', 'sessions · UPR · special procedures']} />
    </g>
    <g data-step="2">
      <line x1={W / 2} y1="120" x2={W / 2} y2="138" stroke="var(--ink-3)" strokeWidth="1.5" />
      <Box y={138} h={90} id="upr" title="UNIVERSAL PERIODIC REVIEW" lines={['every state, every 4.5 years', '47-member working group · accept or note']} />
      <Box y={240} h={90} id="special" title="SPECIAL PROCEDURES" lines={['independent experts · 46 thematic, 14 country', 'visits with consent · complaints · reports']} />
    </g>
    <g data-step="3">
      <line x1="8" y1="352" x2={W - 8} y2="352" stroke="var(--ink-3)" strokeWidth="1" strokeDasharray="4 4" />
      <Box y={372} h={170} id="treaty" title="TREATY-BASED · A COMMITTEE PER TREATY" lines={['e.g. ICCPR → Human Rights Committee', 'state reports → concluding observations', 'individual complaints → “views”', 'inter-state: only three, all under ICERD', 'general comments: authoritative']} />
    </g>
    <g data-step="4">
      <line x1="30" y1="612" x2={W - 30} y2="612" stroke="var(--ink)" strokeWidth="1.5" />
      <line x1="30" y1="604" x2="30" y2="620" stroke="var(--ink)" strokeWidth="1.5" />
      <line x1={W - 30} y1="604" x2={W - 30} y2="620" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="30" y="640" textAnchor="start" {...ui} fontSize="12" fill="var(--ink-2)">no weight</text>
      <text x={W - 30} y="640" textAnchor="end" {...ui} fontSize="12" fill="var(--ink-2)">binding</text>
      <polygon points="230,598 238,612 222,612" fill="var(--ink)" stroke="var(--ink)" strokeWidth="1" />
      <text x="230" y="588" textAnchor="middle" {...ui} fontSize="12" letterSpacing="1" fill="var(--ink)" data-label="weight">GREAT WEIGHT</text>
      <text x={W / 2} y="666" textAnchor="middle" {...ui} fontSize="12" fill="var(--ink-2)">not binding — Diallo, ICJ 2010, para 66</text>
    </g>
  </svg>
);

export default function InternationalHumanRightsMachinery() {
  return (
    <Diagram
      label="International human rights machinery: Charter-based and treaty-based mechanisms"
      terms={[
        { term: 'Charter-based mechanism', def: 'Created under the UN Charter system: the Human Rights Council, its UPR and special procedures.' },
        { term: 'Treaty body', def: 'The committee a core treaty sets up to supervise it, e.g. the Human Rights Committee for the ICCPR.' },
        { term: 'Views', def: 'What a committee adopts at the end of an individual complaint — not binding, but carrying significant weight.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'The Human Rights Council replaced the UN Commission on Human Rights in 2006 (UNGA resolution 60/251): 47 states elected by the General Assembly for three-year terms, working through sessions, the UPR and special procedures.' },
        { caption: 'The UPR reviews every member state every 4.5 years; a 47-member working group issues recommendations the state accepts or notes (Australia, 2021: 344 received, 177 supported). Special procedures are independent experts with 46 thematic and 14 country mandates.' },
        { caption: 'Each core treaty has a committee. It considers state reports, decides individual complaints (written, confidential, ending in “views”), may hear inter-state complaints (only three ever, all under ICERD) and issues authoritative general comments.' },
        { caption: 'Legal nature: treaty body decisions are not binding but carry significant weight. In Diallo the ICJ was “in no way obliged” to follow the Human Rights Committee but ascribed “great weight” to its interpretation.' },
      ]}
      check={{
        question: 'State Z’s court calls the Human Rights Committee’s views “mere opinions with no legal weight”. How accurate is that?',
        options: [
          { text: 'Accurate — views are opinions and carry no legal weight', why: 'Half right: views are not binding, but Diallo says the Committee’s interpretation deserves great weight.' },
          { text: 'Inaccurate — views are binding judgments, like the ICJ’s', why: 'Too far: the slides say treaty body decisions are not binding; the ICJ itself is “in no way obliged” to follow them.' },
          { text: 'Partly — not binding, but they carry great weight', correct: true, why: 'Treaty body decisions are not binding but carry significant weight; the ICJ in Diallo (para 66) ascribed great weight to the Committee.' },
        ],
      }}
    />
  );
}
