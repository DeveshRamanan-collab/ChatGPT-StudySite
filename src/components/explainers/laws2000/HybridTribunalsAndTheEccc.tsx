/*
SCENE: Hybrid tribunals — the ECCC drawn as a court inside Cambodia's courts, every feature sitting on a
  national–international seam
LENGTH: 5 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
BEATS: 5 (request and agreement → jurisdiction window → who → the seam → UN assistance and the contrast)
INTENT: The ECCC were built by agreement with the state and sit in its own courts, mixing national and international
  elements — unlike the ICTY and ICTR, created by the Security Council under Chapter VII.
SUBJECT: the dashed seam down the middle of the chambers, with national features on the left, international on the
  right.
BEAT 1 (0–20%): Cambodia's request to the UN; agreement 2004; the Cambodian courts frame.
BEAT 2 (20–40%): the window 17 April 1975 – 6 January 1979 and its four crime types.
BEAT 3 (40–60%): senior leaders of Democratic Kampuchea; those most responsible.
BEAT 4 (60–80%): the seam — Co-Prosecutors, judges, Co-Investigating Judges, civil parties.
BEAT 5 (80–100%): UNAKRT assistance; national and international law; the Chapter VII contrast. Ease: none (scrubbed).
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: the finished figure with all five captions stacked (base).
BUDGET: < 8 KB gz, no WebGL.
Source: concept laws2000-w11-hybrid-tribunals-and-the-eccc (Week 11 Lecture Slides, slides 30–31); the SCSL and STL
  slides are image-only, so they are named, not explained.
*/
import { Diagram } from '../bases/Diagram';

const ui = { fontFamily: 'var(--font-ui)', fontSize: 12, letterSpacing: 1.1, fill: 'var(--ink)' } as const;
const note = { fontFamily: 'var(--font-body)', fontSize: 12.5, fill: 'var(--ink-2)' } as const;
const ink = { fill: 'none', stroke: 'var(--ink)', strokeWidth: 1.5 } as const;
const faint = { fill: 'none', stroke: 'var(--ink-3)', strokeWidth: 1.5 } as const;

const pair = (y: number, left: string, right: string) => (
  <g key={left}>
    <text x="96" y={y} textAnchor="middle" {...note} fill="var(--ink)">{left}</text>
    <text x="264" y={y} textAnchor="middle" {...note} fill="var(--ink)">{right}</text>
  </g>
);

const figure = (
  <svg viewBox="0 0 360 560" role="img" aria-label="The ECCC inside the Cambodian courts, with national and international features either side of a seam">
    <g data-step="1">
      <text x="16" y="22" {...ui}>CAMBODIA</text>
      <text x="344" y="22" textAnchor="end" {...ui}>UNITED NATIONS</text>
      <path d="M96 34 H264 M256 29 L264 34 L256 39" {...ink} />
      <text x="180" y="52" textAnchor="middle" {...note}>request → agreement, 2004</text>
      <rect x="10" y="66" width="340" height="482" rx="14" {...faint} />
      <text x="24" y="88" {...ui} data-label="courts">CAMBODIAN COURTS · ECCC</text>
    </g>
    <g data-step="2">
      <rect x="22" y="100" width="316" height="112" rx="10" {...ink} />
      <text x="180" y="122" textAnchor="middle" {...ui} data-label="window">17 APR 1975 — 6 JAN 1979</text>
      <text x="36" y="146" {...note}>genocide (1948 Genocide Convention)</text>
      <text x="36" y="164" {...note}>crimes against humanity (Rome Statute)</text>
      <text x="36" y="182" {...note}>grave breaches (Geneva Conventions)</text>
      <text x="36" y="200" {...note}>crimes under Cambodian law</text>
    </g>
    <g data-step="3">
      <text x="24" y="240" {...ui}>WHO</text>
      <text x="74" y="240" {...note}>senior leaders of Democratic Kampuchea</text>
      <text x="74" y="258" {...note}>and those most responsible</text>
    </g>
    <g data-step="4">
      <text x="96" y="292" textAnchor="middle" {...ui}>NATIONAL</text>
      <text x="264" y="292" textAnchor="middle" {...ui}>INTERNATIONAL</text>
      <line x1="180" y1="278" x2="180" y2="398" stroke="var(--ink)" strokeWidth="1.5" strokeDasharray="4 5" />
      {pair(318, 'Co-Prosecutor', 'Co-Prosecutor')}
      {pair(342, 'majority of judges', 'international judges')}
      <rect x="22" y="356" width="316" height="58" rx="10" {...ink} />
      <text x="180" y="378" textAnchor="middle" {...note} fill="var(--ink)">Co-Investigating Judges investigate</text>
      <text x="180" y="400" textAnchor="middle" {...note}>(civil law structure) · civil parties take part</text>
    </g>
    <g data-step="5">
      <path d="M330 34 V96" {...faint} strokeDasharray="3 4" />
      <text x="24" y="448" {...ui}>UNAKRT</text>
      <text x="92" y="448" {...note}>international assistance</text>
      <text x="24" y="472" {...note}>applies national and international law</text>
      <line x1="24" y1="490" x2="336" y2="490" {...faint} />
      <text x="24" y="512" {...note}>contrast: ICTY and ICTR — created by the</text>
      <text x="24" y="530" {...note}>Security Council under Chapter VII</text>
    </g>
  </svg>
);

export default function HybridTribunalsAndTheEccc() {
  return (
    <Diagram
      label="The Extraordinary Chambers in the Courts of Cambodia: a hybrid tribunal"
      terms={[
        { term: 'International(ised) tribunal', def: 'A criminal court mixing national and international elements — the SCSL, ECCC, STL, SPSC, IHT and KSC are on the slides’ list.' },
        { term: 'UNAKRT', def: 'United Nations Assistance to the Khmer Rouge Trials — the ECCC’s international assistance.' },
        { term: 'Co-Investigating Judges', def: 'Judges, not prosecutors, responsible for investigations, as in a civil law system.' },
        { term: 'Civil party', def: 'A participant with a right to take part in proceedings.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'After a request made by Cambodia to the UN, the ECCC were established through an international agreement in 2004, following lengthy negotiations, to try individuals responsible for serious crimes under the Khmer Rouge regime. They sat within the Cambodian court structure.' },
        { caption: 'Jurisdiction: crimes committed between 17 April 1975 and 6 January 1979 — genocide under the 1948 Genocide Convention, crimes against humanity as per the Rome Statute, grave breaches of the Geneva Conventions, and crimes under Cambodian law.' },
        { caption: 'The ECCC investigated and prosecuted senior leaders of Democratic Kampuchea and those most responsible for crimes and serious violations of Cambodian and international law in that period.' },
        { caption: 'Distinctive features: two Co-Prosecutors, one national and one international; a majority of national judges in all Chambers; a structure more akin to civil law, reflecting Cambodia’s legal system, so Co-Investigating Judges — not Prosecutors — investigated; and civil parties had a right to participate.' },
        { caption: 'International assistance came through UNAKRT; the ECCC applied national and international law. Contrast the ICTY and ICTR, created by the Security Council under Chapter VII rather than by agreement with the state.' },
      ]}
      check={{
        question: 'At the ECCC, who was responsible for investigations?',
        options: [
          { text: 'The two Co-Prosecutors, one national and one international', why: 'The Co-Prosecutors prosecuted; investigations sat with the Co-Investigating Judges.' },
          { text: 'Co-Investigating Judges, reflecting a civil law structure', correct: true, why: 'The slides say Co-Investigating Judges, not Prosecutors, were responsible for investigations, reflecting Cambodia’s legal system.' },
          { text: 'A commission of inquiry set up by the Security Council', why: 'The ECCC rest on a UN–Cambodia agreement; the Security Council ran no investigations for them.' },
        ],
      }}
    />
  );
}
