/*
SCENE: After commercialisation — the chain that broke outside the supplier's process
LENGTH: 4 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: Show that the Deck Protector's development succeeded, and the project ended through links in the chain that
  Dow Corning did not control: the customer's commercials, the legal challenge, the takeover.
SUBJECT: the chain of boxes; a dashed boundary marks where Dow Corning's process ends; the last link breaks.
STEPS: 1 DFSS development (success) · 2 boundary + ArmorAll's TV commercials · 3 Thompson's challenge, ArmorAll loses ·
  4 broken link + takeover by Clorox, project stops.
REDUCED MOTION: the finished chain with all four captions stacked.
BUDGET: < 6 KB gz (DrawSVG is in the shared motion chunk). Narrow 360-unit canvas so text stays legible on phones.
Source: Week 9 slides 16–18; Week 10 recording of the guest lecture (marketing did not check with legal; B2B supplier);
concept mgmt2094-w09-customer-risk-after-commercialisation.
*/
import { Diagram } from '../bases/Diagram';

const W = 360;

function Box({ y, title, lines, id, dashed }: { y: number; title: string; lines: string[]; id: string; dashed?: boolean }) {
  return (
    <>
      <rect x="8" y={y} width={W - 16} height="76" rx="12" fill="none" stroke="var(--ink)" strokeWidth="1.5" strokeDasharray={dashed ? '6 5' : undefined} />
      <text x="24" y={y + 24} fontFamily="var(--font-ui)" fontSize="13" letterSpacing="1.2" fill="var(--ink)" data-label={id}>{title}</text>
      {lines.map((l, i) => <text key={i} x="24" y={y + 46 + i * 19} fontFamily="var(--font-body)" fontSize="15" fill="var(--ink-2)">{l}</text>)}
    </>
  );
}

const figure = (
  <svg viewBox={`0 0 ${W} 456`} role="img" aria-label="Chain: Dow Corning's successful development, then ArmorAll's commercials, Thompson's legal challenge, and the takeover by Clorox; the chain breaks outside Dow Corning's process">
    <g data-step="1">
      <Box id="development" y={10} title="DOW CORNING · DFSS DEVELOPMENT" lines={['Complete success: 4,500+ tonnes,', 'US$40m in 12 months, two awards']} />
    </g>
    <g data-step="2">
      <line x1="36" y1="86" x2="36" y2="136" stroke="var(--ink)" strokeWidth="1.5" />
      <line x1="8" y1="108" x2={W - 8} y2="108" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="5 5" />
      <text x="52" y="127" fontFamily="var(--font-ui)" fontSize="12" fill="var(--ink-2)">below: outside the supplier&apos;s process</text>
      <Box id="commercials" y={136} dashed title="ARMORALL'S TV COMMERCIALS" lines={['Marketing ran them without', 'checking with legal']} />
    </g>
    <g data-step="3">
      <line x1="36" y1="212" x2="36" y2="252" stroke="var(--ink)" strokeWidth="1.5" />
      <Box id="challenge" y={252} dashed title="THOMPSON'S CHALLENGE" lines={['A legal battle follows;', 'ArmorAll loses']} />
    </g>
    <g data-step="4">
      <line x1="36" y1="328" x2="36" y2="342" stroke="var(--ink)" strokeWidth="1.5" />
      <line x1="36" y1="354" x2="36" y2="368" stroke="var(--ink)" strokeWidth="1.5" />
      <line x1="27" y1="357" x2="45" y2="339" stroke="var(--clay)" strokeWidth="2" />
      <Box id="takeover" y={368} dashed title="TAKEOVER BY CLOROX" lines={['The financial impact forces it;', 'the project stops']} />
    </g>
  </svg>
);

export default function CustomerRiskAfterCommercialisation() {
  return (
    <Diagram
      label="Why a successful product stopped: the chain beyond the supplier"
      terms={[
        { term: 'Post-commercialisation', def: 'What happens once the product is on the market.' },
        { term: 'B2B supplier', def: 'A business that makes products for other businesses, here Dow Corning for ArmorAll.' },
        { term: 'Customer risk management', def: "How well the customer manages its own risks — here, its advertising's legal risk." },
      ]}
      figure={figure}
      steps={[
        { caption: 'The DFSS development was a complete success: over 4,500 tonnes and US$40 million in 12 months, and two achievement awards.' },
        { caption: "Then the chain leaves Dow Corning's hands. ArmorAll ran TV commercials; in the lecture, its marketing did not check with its legal people." },
        { caption: "Thompson's challenged the commercials. A legal battle followed, and ArmorAll lost." },
        { caption: 'The financial impact forced ArmorAll to be taken over by Clorox, and the project stopped. Lesson: no matter how good your commercialisation process, poor risk management by your customers can lead to project failure.' },
      ]}
      check={{
        question: 'Which lesson does the Deck Protector chain illustrate?',
        options: [
          { text: 'DFSS was the wrong method for a new product', why: 'The slides call the new approach a complete success; the method was not what failed.' },
          { text: "A customer's poor risk management can sink a well-run project", correct: true, why: 'The fourth lesson learned: no matter how good your commercialisation process, poor risk management by your customers can lead to project failure.' },
          { text: 'Production could not keep up with demand', why: 'Production was a success — over 4,500 tonnes in 12 months; the project stopped after the court case.' },
        ],
      }}
    />
  );
}
