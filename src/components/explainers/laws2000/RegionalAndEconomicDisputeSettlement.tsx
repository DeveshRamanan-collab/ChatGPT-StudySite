/*
SCENE: Regional organisations and the WTO — art 52 as the hub, five regional spokes, one trade track
LENGTH: 4 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: Art 52 UN Charter lets regional arrangements settle local disputes first, before the Security Council; each
  regional body has its own peaceful-settlement provision; the WTO settles trade disputes through Annex 2.
SUBJECT: the art 52 hub at the top and the arrow "regional first, then the Security Council".
STEP 1: art 52 — (1) consistent with UN Purposes and Principles; (2) regional first; (3) the Council encourages.
STEP 2: AU (PSC Protocol art 4) and OAS (arts 24–25).
STEP 3: Arab League (arts 5, 7), Europe (OSCE court, Geneva), ASEAN (Treaty of Amity art 2(d)).
STEP 4: the WTO track — tariff ceilings, non-tariff barriers, non-discrimination → Annex 2.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: the finished figure with all four captions stacked (base).
BUDGET: < 8 KB gz. Strokes draw (DrawSVG), text fades. Narrow 360-unit canvas.
Source: concept laws2000-w08-regional-and-economic-dispute-settlement; Week 8 slides 38–48 (Part C, no transcript).
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const ui = { fontFamily: 'var(--font-ui)', fontSize: 12.5, letterSpacing: 1.1, fill: 'var(--ink)' } as const;
const note = { fontFamily: 'var(--font-body)', fontSize: 13.5, fill: 'var(--ink-2)' } as const;

function Spoke({ y, title, line, id }: { y: number; title: string; line: string; id: string }) {
  return (
    <>
      <line x1="24" y1={y - 4} x2="40" y2={y - 4} stroke="var(--ink)" strokeWidth="1.5" />
      <circle cx="44" cy={y - 4} r="3" fill="var(--ink)" />
      <text x="54" y={y} {...ui} data-label={id}>{title}</text>
      <text x="54" y={y + 19} {...note}>{line}</text>
    </>
  );
}

const figure = (
  <svg viewBox={`0 0 ${W} 640`} role="img" aria-label="Article 52 of the UN Charter as a hub with five regional organisations, and a separate WTO track ending in Annex 2">
    <g data-step="1">
      <rect x="8" y="8" width={W - 16} height="112" rx="12" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x={W / 2} y="32" textAnchor="middle" {...ui} data-label="art-52">ART 52 UN CHARTER</text>
      <text x={W / 2} y="56" textAnchor="middle" {...note}>(1) consistent with UN Purposes and Principles</text>
      <text x={W / 2} y="76" textAnchor="middle" {...note}>(2) regional first → then the Security Council</text>
      <text x={W / 2} y="96" textAnchor="middle" {...note}>(3) the Council shall encourage it</text>
    </g>
    <g data-step="2">
      <line x1="24" y1="120" x2="24" y2="216" stroke="var(--ink)" strokeWidth="1.5" />
      <Spoke y={158} id="au" title="AFRICAN UNION" line="PSC Protocol art 4: peaceful settlement" />
      <Spoke y={208} id="oas" title="OAS (1948)" line="arts 24–25: negotiation … arbitration" />
    </g>
    <g data-step="3">
      <line x1="24" y1="216" x2="24" y2="362" stroke="var(--ink)" strokeWidth="1.5" />
      <Spoke y={258} id="arab-league" title="ARAB LEAGUE" line="art 5 no force, Council mediates; art 7" />
      <Spoke y={308} id="europe" title="EUROPE" line="OSCE: Court of Conciliation and Arbitration" />
      <Spoke y={358} id="asean" title="ASEAN" line="Treaty of Amity art 2(d); Chapter IV" />
    </g>
    <g data-step="4">
      <rect x="8" y="420" width={W - 16} height="208" rx="12" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="6 5" />
      <text x={W / 2} y="446" textAnchor="middle" {...ui} data-label="wto">WTO — ECONOMIC DISPUTES</text>
      <text x="26" y="474" {...note}>tariffs: fixed upper limits (art II, schedules)</text>
      <text x="26" y="496" {...note}>non-tariff barriers: generally prohibited (XI)</text>
      <text x="26" y="518" {...note}>non-discrimination: most-favoured-nation</text>
      <text x="26" y="538" {...note}>and national treatment</text>
      <line x1={W / 2} y1="552" x2={W / 2} y2="572" stroke="var(--ink)" strokeWidth="1.5" />
      <text x={W / 2} y="594" textAnchor="middle" {...ui}>ANNEX 2 — RULES AND PROCEDURES</text>
      <text x={W / 2} y="614" textAnchor="middle" {...note}>governing the settlement of disputes</text>
    </g>
  </svg>
);

export default function RegionalAndEconomicDisputeSettlement() {
  return (
    <Diagram
      label="Regional organisations under article 52, and WTO dispute settlement"
      terms={[
        { term: 'Regional arrangement', def: 'A regional body that may deal with local disputes, consistently with the UN Charter (art 52).' },
        { term: 'Local dispute', def: 'A dispute between members of the same regional arrangement.' },
        { term: 'Annex 2', def: 'The WTO Agreement’s Understanding on rules and procedures governing the settlement of disputes.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'Art 33(1) includes resort to regional agencies or arrangements. Art 52: they must be consistent with UN Purposes and Principles; members shall make every effort to settle local disputes through them before going to the Security Council, which shall encourage this.' },
        { caption: 'The African Union’s Peace and Security Council is guided by peaceful settlement and early responses to contain crises (Protocol art 4). The OAS Charter sends disputes between members to listed peaceful procedures (arts 24–25).' },
        { caption: 'The Arab League bars force between members and its Council mediates disputes that may lead to war (art 5); unanimous decisions bind all, majority ones only those accepting (art 7). The OSCE’s 1992 Convention created a court in Geneva; ASEAN’s Treaty of Amity commits to peaceful means (art 2(d)).' },
        { caption: 'Trade disputes run on their own track: WTO rules cap tariffs (art II and schedules), generally prohibit non-tariff barriers (art XI) and require non-discrimination; disputes go through Annex 2 of the WTO Agreement.' },
      ]}
      check={{
        question: 'Two members of a regional arrangement have a local dispute that may endanger peace. Under art 52(2), what should they do first?',
        options: [
          { text: 'Refer it straight to the Security Council', why: 'Art 52(2) puts regional settlement first, before referral to the Security Council.' },
          { text: 'Make every effort to settle it through the regional arrangement', correct: true, why: 'Members shall make every effort to achieve pacific settlement of local disputes regionally before referring them to the Security Council.' },
          { text: 'Submit it to the WTO under Annex 2', why: 'Annex 2 governs WTO trade disputes; art 52 concerns regional arrangements for local disputes.' },
        ],
      }}
    />
  );
}
