/*
SCENE: What counts as land, and who can sue — a cross-section of a property, then the possession test
LENGTH: 4 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: Trespass protects soil, fixtures and airspace up to the height needed for ordinary use; above that the
  owner is one of the public. The plaintiff needs exclusive possession (factual control + intention to exclude),
  not ownership.
SUBJECT: the cross-section, drawn from the ground up, then the two-part possession box.
STEPS: 1 soil and fixtures · 2 low airspace (Kelsen sign, LJP scaffolding) · 3 the height limit and the public zone
  above (Bernstein v Skyviews) · 4 exclusive possession (Newington v Windeyer).
REDUCED MOTION: the finished figure with all four captions stacked.
BUDGET: < 6 KB gz. Narrow 360-unit canvas.
Source: concept laws2400-w03-trespass-to-land-scope; case cards bernstein-v-skyviews, kelsen-v-imperial-tobacco-co,
  ljp-investments-v-howard-chia-investments, newington-v-windeyer.
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const head = { fontFamily: 'var(--font-ui)', fontSize: 12.5, letterSpacing: 1.5, fill: 'var(--ink)' } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 14, fill: 'var(--ink-2)' } as const;
const stroke = { fill: 'none', stroke: 'var(--ink)', strokeWidth: 1.5 } as const;

const figure = (
  <svg viewBox={`0 0 ${W} 600`} role="img" aria-label="Cross-section of a property: soil and fixtures, low airspace protected, the public zone above; then the possession test">
    <g data-step="3">
      <line x1="8" y1="120" x2={W - 8} y2="120" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="6 6" />
      <path d="M200 72 l60 0 l14 -10 M232 72 l-12 14 M232 72 l-12 -14" {...stroke} />
      <text x="16" y="34" {...head} data-label="public">NO GREATER RIGHTS THAN THE PUBLIC</text>
      <text x="16" y="56" {...body}>aircraft photographing</text>
      <text x="16" y="74" {...body}>(Bernstein v Skyviews)</text>
      <text x="16" y="112" {...body}>height for ordinary use and enjoyment</text>
    </g>
    <g data-step="2">
      <rect x="8" y="140" width={W - 16} height="150" rx="10" fill="none" stroke="var(--ink-3)" strokeWidth="1" />
      <line x1="330" y1="200" x2="290" y2="200" {...stroke} />
      <rect x="266" y="190" width="24" height="20" {...stroke} />
      <line x1="330" y1="150" x2="330" y2="300" {...stroke} />
      <path d="M40 300 L40 170 M70 300 L70 170 M40 210 L70 210 M40 250 L70 250" {...stroke} />
      <text x="84" y="164" {...head} data-label="airspace">LOW AIRSPACE</text>
      <text x="84" y="190" {...body}>sign 24 cm in (Kelsen)</text>
      <text x="192" y="270" {...body}>scaffolding (LJP)</text>
    </g>
    <g data-step="1">
      <line x1="8" y1="300" x2={W - 8} y2="300" stroke="var(--ink)" strokeWidth="2" />
      <path d="M120 300 L120 240 L150 215 L180 240 L180 300" {...stroke} />
      <path d="M20 318 l12 12 M80 318 l12 12 M140 318 l12 12 M200 318 l12 12 M260 318 l12 12 M320 318 l12 12" stroke="var(--ink-3)" strokeWidth="1.5" />
      <text x="16" y="358" {...head} data-label="soil">SOIL + FIXTURES</text>
      <text x="16" y="378" {...body}>house, factory, unharvested crops</text>
    </g>
    <g data-step="4">
      <rect x="8" y="404" width={W - 16} height="186" rx="12" {...stroke} />
      <text x="24" y="432" {...head} data-label="possession">WHO CAN SUE: EXCLUSIVE POSSESSION</text>
      <text x="24" y="456" {...body}>not ownership — a tenant can sue</text>
      <circle cx="32" cy="486" r="6" {...stroke} />
      <text x="48" y="491" {...body}>factual control</text>
      <circle cx="32" cy="512" r="6" {...stroke} />
      <text x="48" y="517" {...body}>+ intention to exclude all others</text>
      <text x="24" y="550" {...body}>Newington v Windeyer: 50 years of parties,</text>
      <text x="24" y="570" {...body}>garden and rates — never the owner</text>
    </g>
  </svg>
);

export default function TrespassToLandScope() {
  return (
    <Diagram
      label="What counts as land, and who can sue in trespass"
      terms={[
        { term: 'Land', def: 'Soil, fixtures, and airspace up to the height needed for ordinary use and enjoyment.' },
        { term: 'Fixtures', def: 'Things attached to the land: a house, a factory, unharvested crops.' },
        { term: 'Exclusive possession', def: 'Factual control plus an intention to exclude all others — not ownership.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'From the ground: the soil and its fixtures — a house, a factory, crops not yet harvested — are land.' },
        { caption: 'Low airspace is land too: a sign projecting 24 cm (Kelsen v Imperial Tobacco) and encroaching scaffolding (LJP Investments) were trespasses.' },
        { caption: 'Above the height needed for ordinary use, the owner has no greater rights than the public: the aircraft in Bernstein v Skyviews committed no trespass. Drones and minerals: work them through the same test.' },
        { caption: 'To sue, the plaintiff needs exclusive possession at the time — factual control plus intention to exclude. In Newington v Windeyer a 50-year occupier who was never the registered owner could sue.' },
      ]}
      check={{
        question: 'A neighbour’s crane swings its arm low over P’s yard. P rents the house. Can P sue in trespass?',
        options: [
          { text: 'No — only the owner can sue', why: 'Trespass protects exclusive possession, not ownership; a tenant can sue.' },
          { text: 'No — airspace is not land', why: 'Airspace up to the height for ordinary use is land (Kelsen; LJP).' },
          { text: 'Yes — low airspace is land and P, as tenant, has exclusive possession', correct: true, why: 'A low-level intrusion into airspace is trespass, and exclusive possession, not ownership, gives title to sue.' },
        ],
      }}
    />
  );
}
