/*
SCENE: International law as an aid to interpretation — an ambiguous word passing a sequence of gates
LENGTH: 4 screens pinned (desktop, full motion); 4 paced beats otherwise
BEATS: 4
INTENT: International law helps read an ambiguous statute through each gate in turn, but wherever the words are clear
  the journey stops: clear words always win.
SUBJECT: the token (the ambiguous word) travelling down the track.
BEAT 1 (0–25%): gate 1 — incorporated treaty text (Applicant A); the token descends (translateY, scrubbed, ease none).
BEAT 2 (25–50%): gate 2 — s 15AB(2)(d) conditions; clear words cannot be modified (Yager).
BEAT 3 (50–75%): gate 3 — the Jumbunna presumption (not against clear legislation, Polites) and legality (Coco).
BEAT 4 (75–100%): gate 4 — the Constitution? no majority (Kirby J v McHugh J); the hard stop below.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: final frame with all four captions stacked.
BUDGET: < 8 KB gz.
Source: concept laws2000-w05-international-law-in-australian-interpretation; Acts Interpretation Act 1901 (Cth)
  s 15AB; Applicant A; Yager; Jumbunna; Polites; Coco; Newcrest; Al-Kateb; Practitioner's Guide (2014).
*/
import { ScrollExplainer } from '../bases/ScrollExplainer';

const ui = { fontFamily: 'var(--font-ui)', fontSize: 12, letterSpacing: 1, fill: 'var(--ink)' } as const;
const note = { fontFamily: 'var(--font-body)', fontSize: 13, fill: 'var(--ink-2)' } as const;
const on = (t: number, at: number) => Math.max(0, Math.min(1, t - at));
const GATES = [
  { y: 70, title: 'INCORPORATED TEXT', lines: ['read as the treaty means, unless', 'contrary intention (Applicant A)'] },
  { y: 160, title: 's 15AB(2)(d)', lines: ['participated in before the Act; used to', 'confirm, or resolve ambiguity/absurdity'] },
  { y: 250, title: 'PRESUMPTIONS', lines: ['Jumbunna: accord with international law', 'legality: rights curtailed only clearly'] },
  { y: 340, title: 'THE CONSTITUTION?', lines: ['no majority: Kirby J for (Newcrest);', 'McHugh J: “heretical” (Al-Kateb)'] },
];

function scene(t: number) {
  const k = Math.min(4, t);
  const tokenY = 50 + k * 87.5;
  return (
    <svg viewBox="0 0 360 470" style={{ maxWidth: 440 }} role="img" aria-label="An ambiguous statutory word passing four interpretive gates, stopped wherever the words are clear">
      <line x1="40" y1="40" x2="40" y2="410" stroke="var(--ink-3)" strokeWidth="1.5" />
      {GATES.map((g, i) => (
        <g key={g.title} style={{ opacity: Math.min(1, 0.25 + on(t, i) * 1.5) }}>
          <line x1="24" y1={g.y} x2="56" y2={g.y} stroke="var(--ink)" strokeWidth="2.5" />
          <text x="70" y={g.y - 4} {...ui}><tspan fontFamily="var(--font-mono)">{i + 1}  </tspan>{g.title}</text>
          {g.lines.map((l, j) => <text key={l} x="70" y={g.y + 16 + j * 17} {...note}>{l}</text>)}
        </g>
      ))}
      <g style={{ transform: `translateY(${tokenY}px)` }}>
        <circle cx="40" cy="0" r="7" fill="var(--ink)" />
      </g>
      <text x="24" y="28" {...note} fontSize="12">ambiguous word</text>
      <g style={{ opacity: on(t, 3) }}>
        <rect x="8" y="416" width="344" height="46" rx="12" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
        <text x="180" y="444" textAnchor="middle" {...ui}>CLEAR WORDS ALWAYS WIN: HARD STOP</text>
      </g>
    </svg>
  );
}

export default function InternationalLawInAustralianInterpretation() {
  return (
    <ScrollExplainer
      label="International law as an aid to interpreting Australian statutes"
      terms={[
        { term: 's 15AB', def: 'Acts Interpretation Act 1901 (Cth) provision allowing extrinsic material, including treaties, to assist interpretation.' },
        { term: 'Jumbunna presumption', def: 'In ambiguity, favour a construction that accords with international law.' },
        { term: 'Principle of legality', def: 'Parliament is not taken to curtail fundamental rights without clear, unambiguous language (Coco).' },
      ]}
      beats={[
        { caption: 'Where a statute directly incorporates a treaty’s text, it is interpreted in line with the treaty’s meaning unless Parliament expressed a contrary intention (Applicant A).' },
        { caption: 'Under s 15AB(2)(d) a treaty assists only if (a) Australia participated in it before the Act was enacted, and (b) it confirms the ordinary meaning, or the Act is ambiguous or obscure or would be manifestly absurd or unreasonable. It cannot modify words that are otherwise clear (Yager, Mason J).' },
        { caption: 'Two common law presumptions: in ambiguity, favour a construction according with international law (Jumbunna) — only a presumption, not applying to clear contrary legislation (Polites); and the principle of legality (Coco). Obligations are identified as they exist when the question arises.' },
        { caption: 'The Constitution? No majority: Kirby J (Newcrest) read it to accommodate international law “to the full extent that its text permits”; McHugh J (Al-Kateb) called that “heretical”. Clear, valid Australian law prevails — Parliament may legislate in breach, “taking the risk of international complications”.' },
      ]}
      scene={scene}
      check={{
        question: 'A statute’s words are clear, but a treaty Australia ratified points the other way. Which reading does the court adopt?',
        options: [
          { text: 'The treaty’s — the Jumbunna presumption requires it', why: 'Jumbunna is only a presumption for ambiguity; it does not apply to clear contrary legislation (Polites).' },
          { text: 'The statute’s clear words', correct: true, why: 'A treaty cannot modify words that are otherwise clear (Yager); clear words always win.' },
          { text: 'The treaty’s, if Australia participated in it before the Act (s 15AB)', why: 's 15AB lets a treaty confirm meaning or resolve ambiguity; it cannot override clear words.' },
        ],
      }}
    />
  );
}
