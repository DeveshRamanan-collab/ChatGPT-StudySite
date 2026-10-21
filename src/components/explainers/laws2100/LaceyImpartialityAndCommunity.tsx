/*
SCENE: Lacey — the assumptions of conventional legal scholarship, then the community every theory of law presupposes
LENGTH: 5 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: Law presents its reasoning as objective and impartial (for equality before the law); the feminist challenge,
  mapped by Lacey, questions seven assumptions of conventional scholarship, and her chapter on community exposes the
  community that Austin, Hart, Finnis and Dworkin all presuppose.
SUBJECT: the divider between favoured and excluded reasoning, then the "community" hub and its four spokes.
STEPS: 1 favoured vs excluded reasoning · 2 the seven assumptions under challenge · 3 community as a discursive figure
  · 4 four spokes: Austin, Hart, Finnis, Dworkin · 5 liberal vs communitarian selves.
REDUCED MOTION: the finished diagram with all five captions stacked.
BUDGET: < 7 KB gz. 360-unit canvas, strokes only.
Source: concept laws2100-w08-lacey-impartiality-and-community; authorities lacey-unspeakable-subjects,
  austin-province-of-jurisprudence-determined, hart-the-concept-of-law; week 8 notes (slides 19–22; transcript on
  the community each theory assumes).
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const head = { fontFamily: 'var(--font-ui)', fontSize: 11, letterSpacing: 1.2, fill: 'var(--ink-2)' } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 13, fill: 'var(--ink)' } as const;
const ASSUMPTIONS = [
  'the neutral framework of legal reasoning',
  'law’s autonomy and discreteness',
  'law’s neutrality and objectivity',
  'law’s centrality',
  'law as a system of enacted rules or norms',
  'law’s unity and coherence',
  'law’s rationality',
];
const HUB = { x: 180, y: 400 };
const SPOKES = [
  { x: 8, y: 330, who: 'Austin', what: 'political society' },
  { x: 248, y: 330, who: 'Hart', what: 'officials, citizens' },
  { x: 8, y: 432, who: 'Finnis', what: 'the common good' },
  { x: 248, y: 432, who: 'Dworkin', what: 'integrity' },
];

const figure = (
  <svg viewBox={`0 0 ${W} 600`} role="img" aria-label="Favoured and excluded reasoning; seven assumptions of conventional legal scholarship; community at the hub of Austin, Hart, Finnis and Dworkin; liberal and communitarian selves">
    <g data-step="1">
      <text x="8" y="18" {...head}>LAW’S STYLE OF REASONING</text>
      <line x1={W / 2} y1="30" x2={W / 2} y2="92" stroke="var(--ink)" strokeWidth="2" />
      <text x="168" y="48" textAnchor="end" {...body} fontSize={12}>objective</text>
      <text x="168" y="66" textAnchor="end" {...body} fontSize={12}>impartial</text>
      <text x="168" y="84" textAnchor="end" {...body} fontSize={12}>disinterested</text>
      <text x="192" y="57" {...body} fontSize={12} fill="var(--ink-2)">emotion</text>
      <text x="192" y="75" {...body} fontSize={12} fill="var(--ink-2)">personal opinion</text>
      <text x="8" y="110" {...head}>FAVOURED</text>
      <text x={W - 8} y="110" textAnchor="end" {...head}>EXCLUDED</text>
    </g>
    <g data-step="2">
      <text x="8" y="138" {...head}>THE FEMINIST CHALLENGE (LACEY)</text>
      {ASSUMPTIONS.map((a, i) => (
        <g key={a}>
          <circle cx="16" cy={154 + i * 20} r="4" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
          <text x="28" y={158 + i * 20} {...body} fontSize={12}>{a}</text>
        </g>
      ))}
    </g>
    <g data-step="3">
      <circle cx={HUB.x} cy={HUB.y} r="40" fill="none" stroke="var(--ink)" strokeWidth="2" />
      <text x={HUB.x} y={HUB.y + 4} textAnchor="middle" {...head} fill="var(--ink)" data-label="community">COMMUNITY</text>
      <text x={HUB.x} y={HUB.y + 88} textAnchor="middle" {...body} fontSize={11} fill="var(--ink-2)">a discursive figure (p 128)</text>
    </g>
    <g data-step="4">
      {SPOKES.map((s) => {
        const cx = s.x + 52, cy = s.y + 20;
        return (
          <g key={s.who}>
            <line x1={cx < HUB.x ? cx + 52 : cx - 52} y1={cy} x2={HUB.x + (cx < HUB.x ? -34 : 34)} y2={HUB.y + (cy < HUB.y ? -20 : 20)} stroke="var(--ink-2)" strokeWidth="1.5" />
            <rect x={s.x} y={s.y} width="104" height="40" rx="8" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
            <text x={cx} y={s.y + 17} textAnchor="middle" {...body} fontSize={12}>{s.who}</text>
            <text x={cx} y={s.y + 33} textAnchor="middle" {...body} fontSize={11} fill="var(--ink-2)">{s.what}</text>
          </g>
        );
      })}
    </g>
    <g data-step="5">
      <rect x="8" y="500" width="168" height="92" rx="10" fill="none" stroke="var(--ink-2)" strokeWidth="1.5" />
      <text x="20" y="522" {...head}>LIBERAL</text>
      <text x="20" y="544" {...body} fontSize={12}>autonomous agent</text>
      <text x="20" y="562" {...body} fontSize={12}>rights, autonomy</text>
      <text x="20" y="580" {...body} fontSize={12}>universal norms</text>
      <rect x="184" y="500" width="168" height="92" rx="10" fill="none" stroke="var(--ink-2)" strokeWidth="1.5" />
      <text x="196" y="522" {...head}>COMMUNITARIAN</text>
      <text x="196" y="544" {...body} fontSize={12}>socially embedded self</text>
      <text x="196" y="562" {...body} fontSize={12}>traditions, social roles</text>
      <text x="196" y="580" {...body} fontSize={12}>shared practices</text>
    </g>
  </svg>
);

export default function LaceyImpartialityAndCommunity() {
  return (
    <Diagram
      label="Lacey: law's claimed impartiality, seven assumptions under challenge, and the community every theory of law presupposes"
      terms={[
        { term: 'Equality before the law', def: 'The justification for impartial reasoning: everyone treated equally, regardless of race, sex or religion.' },
        { term: 'Conventional legal scholarship', def: 'The received view of law as neutral, autonomous, central, unified and rational.' },
        { term: 'Discursive figure', def: 'Lacey on "community": an idea that does rhetorical work in legal theory, not a neutral fact.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'Law appears to favour objective, impartial and disinterested thought over emotion or personal opinion. The justification: everyone will be treated equally before the law, regardless of race, sex or religion.' },
        { caption: 'Nicola Lacey, Unspeakable Subjects (1998): the feminist challenge targets seven assumptions of conventional legal scholarship, from the neutral framework of legal reasoning to law’s rationality.' },
        { caption: 'Chapter 5, "Community in Legal Theory: Idea, Ideal or Ideology?": community is "one particular discursive figure in contemporary Anglo-American legal theory" (p 128). Lacey assesses the rhetorical function of appeals to it.' },
        { caption: 'The lecture: every theory studied assumes a community. Austin finds the sovereign in an independent political society; Hart has officials and citizens; Finnis’s law promotes the common good; Dworkin’s integrity rests on a community’s political morality.' },
        { caption: 'The liberal–communitarian debate: autonomous agents with rights and universal norms, or socially embedded selves shaped by communities, traditions and shared practices? Ask whose community a theory presupposes.' },
      ]}
      check={{
        question: 'Why does the lecture say Lacey’s focus on community matters for the theories studied earlier?',
        options: [
          { text: 'Because only Dworkin’s theory relies on any idea of community', why: 'Austin, Hart and Finnis also presuppose a community: a political society, officials and citizens, a common good.' },
          { text: 'Because every one of them presupposes a community: law of a community, for a community', correct: true, why: 'Austin, Hart, Finnis and Dworkin all assume a community, so the appeal to it is worth examining, as Lacey does.' },
          { text: 'Because community is the basic norm of every legal order', why: 'The basic norm is Kelsen’s idea; Lacey treats community as a discursive figure, not as a basic norm.' },
        ],
      }}
    />
  );
}
