/*
SCENE: Law and coercion — a spectrum of five views, then two questions: necessary? salient?
LENGTH: 7 screens pinned (desktop, full motion); 7 paced beats otherwise
BEATS: 7
INTENT: Lamond's five views place coercion from law's genus to the thing law guides; Raz's society of angels answers
  "necessary?" (no), Schauer's coercive experience answers "salient?" (yes) — keep the two questions apart.
SUBJECT: the slider handle on the spectrum, then the two question panels.
BEAT 1–5 (0–71%): the handle slides stop to stop (translate, scrubbed, ease none); the matching view lights up.
BEAT 6 (71–86%): NECESSARY? — Raz's society of angels. BEAT 7 (86–100%): SALIENT? — Schauer.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: final frame with all seven captions stacked (base).
BUDGET: < 6 KB gz. Transform and opacity only.
Source: concept laws2100-w02-law-and-coercion; authorities lamond-coercion-and-the-nature-of-law,
  schauer-was-austin-right-after-all.
*/
import { ScrollExplainer } from '../bases/ScrollExplainer';

const W = 360;
const clamp = (v: number, hi = 1) => Math.max(0, Math.min(hi, v));
const head = { fontFamily: 'var(--font-ui)', fontSize: 12, letterSpacing: 1.2, fill: 'var(--ink)' } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 14, fill: 'var(--ink-2)' } as const;
const VIEWS = [
  { view: 'coercion is the genus of law', who: 'Austin' },
  { view: 'a distinctive ordering by coercion', who: 'Kelsen' },
  { view: 'coercion is the most salient aspect', who: 'Bentham, Holmes, Raz' },
  { view: 'law regulates the use of coercion', who: 'Bobbio' },
  { view: "law's point: guide state coercion", who: 'Dworkin' },
];
const PANELS = [
  { x: 8, q: 'NECESSARY?', lines: ["Raz's angels: no", 'coercion, yet law', 'for coordination.', 'Answer: no'] },
  { x: 188, q: 'SALIENT?', lines: ['Schauer: law as', 'experienced is', 'overwhelmingly', 'coercive. Yes'] },
];

function scene(t: number) {
  const f = clamp(t - 1, 4);
  const now = Math.round(f);
  const on = (i: number) => clamp((t - i) * 3 + 0.25);
  return (
    <svg viewBox={`0 0 ${W} 470`} role="img" aria-label="A slider across five views of law and coercion, then two panels: necessary and salient">
      <text x="20" y="20" {...body} fontSize={12}>coercion defines law</text>
      <text x="340" y="20" textAnchor="end" {...body} fontSize={12}>law governs coercion</text>
      <line x1="30" y1="44" x2="330" y2="44" stroke="var(--ink-3)" strokeWidth="1.5" />
      {VIEWS.map((_, i) => <text key={i} x={30 + i * 75} y="74" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="12" fill="var(--ink-2)">{i + 1}</text>)}
      {VIEWS.map((_, i) => <line key={i} x1={30 + i * 75} y1="38" x2={30 + i * 75} y2="50" stroke="var(--ink-3)" strokeWidth="1.5" />)}
      <circle cx="0" cy="44" r="9" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2" transform={`translate(${30 + f * 75} 0)`} />
      {VIEWS.map((v, i) => (
        <g key={v.who} opacity={i === now && t < 5.5 ? 1 : 0.4}>
          <text x="20" y={106 + i * 44} fontFamily="var(--font-mono)" fontSize="12" fill="var(--ink-2)">{i + 1}</text>
          <text x="40" y={106 + i * 44} {...body} fill="var(--ink)">{v.view}</text>
          <text x="40" y={124 + i * 44} {...body} fontSize={12}>{v.who}</text>
        </g>
      ))}
      {PANELS.map((p, k) => (
        <g key={p.q} opacity={on(5 + k)}>
          <rect x={p.x} y="330" width="164" height="132" rx="12" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
          <text x={p.x + 12} y="354" {...head}>{p.q}</text>
          {p.lines.map((l, j) => <text key={j} x={p.x + 12} y={378 + j * 19} {...body}>{l}</text>)}
        </g>
      ))}
    </svg>
  );
}

export default function LawAndCoercion() {
  return (
    <ScrollExplainer
      label="Is coercion a necessary feature of law? Five views on a spectrum, then two questions"
      terms={[
        { term: 'Necessary feature', def: 'A feature without which something would not be law at all.' },
        { term: 'Salient feature', def: 'A feature that stands out in law as it is experienced, whether or not it is necessary.' },
        { term: 'Society of angels', def: "Raz's thought experiment: everyone complies, so no coercion is needed — yet coordination still calls for law." },
      ]}
      beats={[
        { caption: 'Austin: coercion is the genus of which law is a species.' },
        { caption: 'Kelsen: law is a distinctive form of social ordering because of its reliance upon coercion.' },
        { caption: 'Bentham, Holmes, Raz: coercion is the most salient aspect of law. Lamond: at best it is the most salient aspect of certain legal systems.' },
        { caption: 'Bobbio: law regulates the use of coercion. Lamond: the right to regulate coercion lies within law\'s distinctive claim to authority.' },
        { caption: 'Dworkin: the point of legal practice is to guide and constrain the coercive power of the state.' },
        { caption: 'Necessary? If a legal system without coercion can be imagined — Raz\'s society of angels — coercion is not a necessary feature of the concept of law.' },
        { caption: 'Salient? Schauer: "the phenomenon of law as it is experienced is overwhelmingly coercive"; a theory that ignores it may fail to fit the facts. What is legal theory for?' },
      ]}
      scene={scene}
      check={{
        question: "What does Raz's society of angels show?",
        options: [
          { text: 'Coercion is not a necessary feature of the concept of law', correct: true, why: 'Angels comply without coercion, yet coordination still calls for law — so law is imaginable without coercion.' },
          { text: 'Coercion is not a salient feature of real legal systems', why: 'Tempting, but the thought experiment is about necessity; Schauer argues coercion is salient in law as experienced.' },
          { text: 'Law is unnecessary where everyone complies', why: 'The opposite: coordination problems still call for law among angels.' },
        ],
      }}
    />
  );
}
