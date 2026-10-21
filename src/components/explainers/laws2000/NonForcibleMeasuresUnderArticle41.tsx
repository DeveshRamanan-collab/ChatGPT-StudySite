/*
SCENE: Art 41 — a spectrum from comprehensive to targeted sanctions, with tribunals and ICC referral branching off
LENGTH: 4 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
BEATS: 1 art 41 and its non-exhaustive list · 2 the comprehensive → targeted spectrum · 3 who sets and applies the
  details · 4 tribunals and ICC referral
INTENT: Show that art 41 is a wide, open-ended toolbox of non-military coercion, that practice has moved from
  comprehensive to targeted sanctions because of the impact on populations, and that it reaches criminal justice too.
SUBJECT: the spectrum line; the two ends draw on, then the boxes below it.
BEAT 1 (0–25%): the art 41 frame. BEAT 2 (25–50%): the spectrum line with its two ends and examples.
  BEAT 3 (50–75%): sanctions committees and state implementation. BEAT 4 (75–100%): tribunals and ICC referral.
  Scrubbed, ease: none (base).
CAMERA: none (SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: the finished diagram with all four captions stacked (base).
BUDGET: < 8 KB gz, no WebGL. Narrow 360-unit canvas for phone legibility.
Source: concept laws2000-w10-non-forcible-measures-under-article-41; Week 10 slides 15, 18–23; UN Charter art 41;
  S/RES/2397 (2017); Rome Statute art 13(b).
*/
import { Diagram } from '../bases/Diagram';

const W = 360;

function Box({ y, h, title, lines, id }: { y: number; h: number; title: string; lines: string[]; id: string }) {
  return (
    <>
      <rect x="8" y={y} width={W - 16} height={h} rx="12" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x={W / 2} y={y + 26} textAnchor="middle" fontFamily="var(--font-ui)" fontSize="13" letterSpacing="1.5" fill="var(--ink)" data-label={id}>{title}</text>
      {lines.map((l, i) => (
        <text key={i} x={W / 2} y={y + 50 + i * 20} textAnchor="middle" fontFamily="var(--font-body)" fontSize="15" fill="var(--ink-2)">{l}</text>
      ))}
    </>
  );
}

const T = (x: number, y: number, s: string, anchor: 'start' | 'end') => (
  <text x={x} y={y} textAnchor={anchor} fontFamily="var(--font-body)" fontSize="15" fill="var(--ink-2)">{s}</text>
);

const figure = (
  <svg viewBox={`0 0 ${W} 660`} role="img" aria-label="Art 41 measures: a spectrum from comprehensive sanctions on a whole state to targeted sanctions on commodities, groups or individuals, set by sanctions committees and applied by states, plus ad hoc tribunals and referral to the ICC">
    <g data-step="1">
      <Box id="art-41" y={8} h={112} title="ART 41 · NO ARMED FORCE" lines={['interruption of economic relations', 'and of communications; severance', 'of diplomatic relations — and more']} />
    </g>
    <g data-step="2">
      <text x="20" y="160" fontFamily="var(--font-ui)" fontSize="13" letterSpacing="1.5" fill="var(--ink)" data-label="comprehensive">COMPREHENSIVE</text>
      <text x="340" y="160" textAnchor="end" fontFamily="var(--font-ui)" fontSize="13" letterSpacing="1.5" fill="var(--ink)" data-label="targeted">TARGETED</text>
      <line x1="20" y1="176" x2="340" y2="176" stroke="var(--ink)" strokeWidth="1.5" />
      <polyline points="328,170 340,176 328,182" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <circle cx="20" cy="176" r="4" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      {T(20, 206, 'a whole state’s economy', 'start')}
      {T(20, 226, 'Iraq 1990s · DPRK today', 'start')}
      {T(20, 246, 'harm to populations', 'start')}
      {T(340, 276, 'a commodity, group or person', 'end')}
      {T(340, 296, 'conflict diamonds', 'end')}
      {T(340, 316, 'travel bans · asset freezes', 'end')}
    </g>
    <g data-step="3">
      <Box id="committees" y={344} h={92} title="WHO SETS AND APPLIES THEM" lines={['sanctions committees set details;', 'states interpret and apply them']} />
    </g>
    <g data-step="4">
      <Box id="tribunals" y={456} h={72} title="AD HOC TRIBUNALS" lines={['ICTY · ICTR — serious IHL crimes']} />
      <Box id="icc" y={548} h={104} title="REFERRAL TO THE ICC" lines={['Rome Statute art 13(b)', 'e.g. Darfur, 2005', 'the ICC is not part of the UN']} />
    </g>
  </svg>
);

export default function NonForcibleMeasuresUnderArticle41() {
  return (
    <Diagram
      label="Art 41 measures: from comprehensive to targeted sanctions, plus tribunals and ICC referral"
      terms={[
        { term: 'Art 41', def: 'The Council’s power to decide measures not involving the use of armed force — a non-exhaustive list.' },
        { term: 'Comprehensive sanctions', def: 'Financial, trade and other economic measures against a state as a whole.' },
        { term: 'Targeted (“smart”) sanctions', def: 'Measures aimed at a commodity, or at particular groups, corporations or individuals.' },
        { term: 'Referral', def: 'The Council sending a situation to the ICC Prosecutor under Chapter VII (Rome Statute art 13(b)).' },
      ]}
      figure={figure}
      steps={[
        { caption: 'Art 41: the Council may decide measures not involving the use of armed force — interruption of economic relations and of communications, severance of diplomatic relations. The list is non-exhaustive.' },
        { caption: 'Comprehensive sanctions hit a whole state (Iraq in the 1990s; North Korea today) and are controversial for their impact on populations — hence the trend to targeted ones: a commodity such as conflict diamonds, or travel bans and asset freezes on particular groups, corporations or individuals.' },
        { caption: 'Details are often set by Security Council sanctions committees; proper implementation ultimately depends on how states interpret and apply the regime.' },
        { caption: 'Art 41 also covers ad hoc tribunals (the ICTY and ICTR) and — though the ICC is not part of the UN — a Chapter VII referral to its Prosecutor (Rome Statute art 13(b)), as for Darfur in 2005.' },
      ]}
      check={{
        question: 'Why has the Security Council moved towards targeted sanctions?',
        options: [
          { text: 'Art 41 was amended to forbid comprehensive sanctions', why: 'Art 41 has not changed; the shift is a matter of Council practice.' },
          { text: 'Because of the impact of comprehensive sanctions on populations, as in Iraq in the 1990s', correct: true, why: 'The slides say the trend to targeted or “smart” sanctions came in response to the impact of comprehensive sanctions on populations.' },
          { text: 'Targeted sanctions need no art 39 determination', why: 'Every art 41 measure follows an art 39 determination; targeting does not change that.' },
        ],
      }}
    />
  );
}
