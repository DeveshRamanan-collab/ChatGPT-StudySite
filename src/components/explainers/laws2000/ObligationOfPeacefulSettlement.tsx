/*
SCENE: The obligation to settle peacefully — two Charter pillars on a customary footing, and a road with no finish line
LENGTH: 4 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: Art 2(3) (settle peacefully) and art 2(4) (no force) work in sequence; the duty is also custom (Nicaragua);
  it is an obligation of conduct, not result; and art 33(1) offers an open-ended list of means.
SUBJECT: the vertical path from art 2(3) down to art 2(4), then the footing and the open road beneath.
STEP 1: art 2(3) — settle by peaceful means.
STEP 2: art 2(4) — then never the threat or use of force; the order matters.
STEP 3: the footing — custom (Nicaragua, para 290), reiterated by five later instruments.
STEP 4: conduct, not result — a road that must be travelled but has no required finish; art 33(1) means branch off.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: the finished figure with all four captions stacked (base).
BUDGET: < 8 KB gz. Strokes draw (DrawSVG), text fades. Narrow 360-unit canvas so text stays legible on phones.
Source: concept laws2000-w08-obligation-of-peaceful-settlement; Week 8 slides 13–16; live lecture (Part A).
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const ui = { fontFamily: 'var(--font-ui)', fontSize: 13, letterSpacing: 1.2, fill: 'var(--ink)' } as const;
const note = { fontFamily: 'var(--font-body)', fontSize: 14, fill: 'var(--ink-2)' } as const;

function Box({ y, h, title, lines, id, dashed }: { y: number; h: number; title: string; lines: string[]; id: string; dashed?: boolean }) {
  return (
    <>
      <rect x="8" y={y} width={W - 16} height={h} rx="12" fill="none" stroke={dashed ? 'var(--ink-3)' : 'var(--ink)'} strokeWidth="1.5" strokeDasharray={dashed ? '6 5' : undefined} />
      <text x={W / 2} y={y + 26} textAnchor="middle" {...ui} data-label={id}>{title}</text>
      {lines.map((l, i) => <text key={l} x={W / 2} y={y + 50 + i * 20} textAnchor="middle" {...note}>{l}</text>)}
    </>
  );
}

const figure = (
  <svg viewBox={`0 0 ${W} 640`} role="img" aria-label="Article 2(3) then article 2(4) of the UN Charter, on a customary law footing, with an obligation of conduct and the open-ended means in article 33(1)">
    <g data-step="1">
      <Box id="art-2-3" y={8} h={84} title="ART 2(3) UN CHARTER" lines={['settle international disputes', 'by peaceful means']} />
    </g>
    <g data-step="2">
      <line x1={W / 2} y1="92" x2={W / 2} y2="132" stroke="var(--ink)" strokeWidth="1.5" />
      <text x={W / 2 + 10} y="117" {...note}>then</text>
      <Box id="art-2-4" y={132} h={84} title="ART 2(4) UN CHARTER" lines={['refrain from the threat', 'or use of force']} />
    </g>
    <g data-step="3">
      <line x1="8" y1="244" x2={W - 8} y2="244" stroke="var(--ink)" strokeWidth="2" />
      <text x={W / 2} y="270" textAnchor="middle" {...ui} data-label="custom">ALSO CUSTOM — NICARAGUA, PARA 290</text>
      <text x={W / 2} y="294" textAnchor="middle" {...note}>reiterated: OAS Charter 2(c) 1948 · Friendly</text>
      <text x={W / 2} y="314" textAnchor="middle" {...note}>Relations 1970 · Manila 1982 · Prevention</text>
      <text x={W / 2} y="334" textAnchor="middle" {...note}>and Removal of Disputes 1988 · AU 4(e) 2000</text>
    </g>
    <g data-step="4">
      <path d="M 36 380 L 290 380" fill="none" stroke="var(--ink)" strokeWidth="2" />
      <path d="M 280 372 L 292 380 L 280 388" fill="none" stroke="var(--ink)" strokeWidth="2" />
      <line x1="320" y1="364" x2="320" y2="396" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="4 4" />
      <text x="36" y="410" {...ui} data-label="conduct">CONDUCT: KEEP TRYING</text>
      <text x="36" y="432" {...note}>no settlement required — Hans Island:</text>
      <text x="36" y="452" {...note}>about 50 years, peaceful throughout</text>
      <Box id="art-33-1" y={478} h={154} title="ART 33(1) — THE MEANS" lines={['negotiation · enquiry · mediation', 'conciliation · arbitration', 'judicial settlement · regional', 'agencies or arrangements …', '“other peaceful means of their own choice”']} dashed />
    </g>
  </svg>
);

export default function ObligationOfPeacefulSettlement() {
  return (
    <Diagram
      label="The obligation to settle disputes peacefully"
      terms={[
        { term: 'Peaceful settlement', def: 'Resolving disputes by peaceful means before they escalate (art 2(3)).' },
        { term: 'Obligation of conduct', def: 'A duty to try in good faith, not a duty to achieve a settlement.' },
        { term: 'Customary international law', def: 'Binding on all states, whatever treaties they have joined (Week 2).' },
      ]}
      figure={figure}
      steps={[
        { caption: 'Art 2(3) UN Charter: all Members shall settle their international disputes by peaceful means, so that international peace and security, and justice, are not endangered.' },
        { caption: 'Art 2(4) follows: refrain from the threat or use of force against the territorial integrity or political independence of any state. The two work hand in hand, and the order matters.' },
        { caption: 'The obligation is binding under customary international law (Nicaragua, 1986, para 290), and is reiterated by the OAS Charter, the Friendly Relations Declaration, the Manila Declaration, the 1988 Declaration and the AU Constitutive Act.' },
        { caption: 'It is an obligation of conduct, not of result: states must keep trying peacefully, but need not reach any particular settlement — Canada and Denmark disputed Hans Island for about 50 years. Art 33(1) lists the means, ending “other peaceful means of their own choice”.' },
      ]}
      check={{
        question: 'Two states have peacefully disputed a boundary for forty years without agreement. Are they in breach of art 2(3)?',
        options: [
          { text: 'Yes — art 2(3) requires disputes to be resolved within a reasonable time', why: 'Art 2(3) imposes an obligation of conduct, not of result; no time limit or settlement is required.' },
          { text: 'No — they must keep seeking a peaceful settlement, not reach one', correct: true, why: 'States are not legally obliged to reach any particular settlement; they must keep trying peacefully and never use force.' },
          { text: 'Yes — after so long either state may use force to end the dispute', why: 'The obligation not to use force (art 2(4)) always remains, however long a dispute lasts.' },
        ],
      }}
    />
  );
}
