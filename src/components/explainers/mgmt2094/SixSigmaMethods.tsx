/*
SCENE: Six Sigma's three principal methods — the triangle with leadership at the centre
LENGTH: 4 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: Show the slide's triangle: DFSS creates new, DMAIC improves existing, Process Management sustains the gains,
  and leaders at the centre drive and align all three.
SUBJECT: the triangle; each side draws on with its label and its one-line job in the key beneath.
STEPS: 1 Leadership at the centre · 2 DFSS side (new) · 3 DMAIC side (existing) · 4 Process Management base (sustain).
REDUCED MOTION: the finished triangle and key with all four captions stacked.
BUDGET: < 6 KB gz (DrawSVG is in the shared motion chunk). Narrow 360-unit canvas so text stays legible on phones.
Source: Week 9 slide 11 (the three principal methods and the triangle); concept mgmt2094-w09-six-sigma-methods.
Only the slide's content is drawn; the lecture-only details (DMAIC's letters, Motorola, GE) stay on the concept card.
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const A = { x: 180, y: 24 }; // apex
const L = { x: 36, y: 268 }; // bottom left
const R = { x: 324, y: 268 }; // bottom right

function Key({ y, title, lines, id }: { y: number; title: string; lines: string[]; id: string }) {
  return (
    <>
      <rect x="8" y={y} width={W - 16} height="80" rx="12" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="24" y={y + 25} fontFamily="var(--font-ui)" fontSize="14" letterSpacing="1.2" fill="var(--ink)" data-label={id}>{title}</text>
      {lines.map((l, i) => (
        <text key={i} x="24" y={y + 48 + i * 20} fontFamily="var(--font-body)" fontSize="15" fill="var(--ink-2)">{l}</text>
      ))}
    </>
  );
}

const figure = (
  <svg viewBox={`0 0 ${W} 660`} role="img" aria-label="Triangle: Design for Six Sigma on the left side, DMAIC on the right side, Process Management along the base, Leadership at the centre">
    <g data-step="1">
      <circle cx="180" cy="186" r="40" fill="none" stroke="var(--ink-2)" strokeWidth="1.5" />
      <text x="180" y="191" textAnchor="middle" fontFamily="var(--font-ui)" fontSize="14" letterSpacing="1.2" fill="var(--ink)" data-label="leadership">LEADERSHIP</text>
      <Key id="leadership-key" y={308} title="LEADERSHIP · centre" lines={['Drives and aligns the efforts', 'strategically']} />
    </g>
    <g data-step="2">
      <line x1={L.x} y1={L.y} x2={A.x} y2={A.y} stroke="var(--ink)" strokeWidth="2.5" />
      <text x="84" y="136" textAnchor="middle" fontFamily="var(--font-ui)" fontSize="15" fontWeight="600" fill="var(--ink)" data-label="dfss">DFSS</text>
      <Key id="dfss-key" y={396} title="DFSS · Design for Six Sigma" lines={['Generates new processes, products,', 'services and/or plants']} />
    </g>
    <g data-step="3">
      <line x1={A.x} y1={A.y} x2={R.x} y2={R.y} stroke="var(--ink)" strokeWidth="2.5" />
      <text x="278" y="136" textAnchor="middle" fontFamily="var(--font-ui)" fontSize="15" fontWeight="600" fill="var(--ink)" data-label="dmaic">DMAIC</text>
      <Key id="dmaic-key" y={484} title="DMAIC · the Improvement Process" lines={['Improves existing process', 'performance']} />
    </g>
    <g data-step="4">
      <line x1={L.x} y1={L.y} x2={R.x} y2={R.y} stroke="var(--ink)" strokeWidth="2.5" />
      <text x="180" y="290" textAnchor="middle" fontFamily="var(--font-ui)" fontSize="13" fontWeight="600" fill="var(--ink)" data-label="pm">PROCESS MANAGEMENT</text>
      <Key id="pm-key" y={572} title="PROCESS MANAGEMENT · base" lines={['Enables leverage and sustains the', 'gains of DFSS and DMAIC']} />
    </g>
  </svg>
);

export default function SixSigmaMethods() {
  return (
    <Diagram
      label="The three principal methods of Six Sigma, with leadership at the centre"
      terms={[
        { term: 'Six Sigma', def: 'A quality-improvement methodology about processes and discipline.' },
        { term: 'DFSS', def: 'Design for Six Sigma: the method for creating something new.' },
        { term: 'DMAIC', def: 'The Improvement Process: the method for improving something that already exists.' },
        { term: 'Process Management', def: 'The system that holds and leverages the gains once they are made.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'Business leaders sit at the centre: they drive the three principal methods and align the efforts strategically.' },
        { caption: 'Design for Six Sigma generates new processes, products, services and/or plants. Dow Corning used it for new-product development.' },
        { caption: 'DMAIC, the Improvement Process, improves the performance of processes that already exist.' },
        { caption: 'Process Management is the system that enables leverage and sustains the gains achieved by DFSS and the improvement process.' },
      ]}
      check={{
        question: 'A firm must design a service it has never offered before. Which side of the triangle fits?',
        options: [
          { text: 'DMAIC, the Improvement Process', why: 'DMAIC improves existing process performance; there is no existing service here to improve.' },
          { text: 'Design for Six Sigma (DFSS)', correct: true, why: 'DFSS generates new processes, products, services and/or plants, so a brand-new service is its job.' },
          { text: 'Process Management', why: 'Process Management sustains the gains once they exist; it does not design anything new.' },
        ],
      }}
    />
  );
}
