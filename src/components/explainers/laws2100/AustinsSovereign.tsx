/*
SCENE: Austin's sovereign — a pyramid of habitual obedience
LENGTH: 4 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: A society is political when the bulk of its members habitually obey one determinate common superior, and
  independent when that superior habitually obeys no one; remove the superior and the society splits or falls into a
  state of nature.
SUBJECT: the sovereign node at the apex — every arrow points at it, none leaves it.
STEPS: 1 the bulk of members · 2 habit-of-obedience arrows up to one superior · 3 no outgoing arrow: independent ·
  4 without the superior: state of nature, or two societies.
REDUCED MOTION: the finished diagram with all four captions stacked.
BUDGET: < 8 KB gz. Hierarchy drawn top-down on a 360-unit canvas.
Source: concept laws2100-w02-austins-sovereign; authorities austin-province-of-jurisprudence-determined,
  austin-lectures-on-jurisprudence.
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const head = { fontFamily: 'var(--font-ui)', fontSize: 12, letterSpacing: 1.2, fill: 'var(--ink)' } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 14, fill: 'var(--ink-2)' } as const;
const XS = [40, 88, 136, 184, 232, 280, 328];

const figure = (
  <svg viewBox={`0 0 ${W} 520`} role="img" aria-label="Members linked by habit-of-obedience arrows to one sovereign, who obeys no one; without the sovereign the society splits">
    <g data-step="1">
      {XS.map((x) => <circle key={x} cx={x} cy="230" r="6" fill="none" stroke="var(--ink)" strokeWidth="1.5" />)}
      <text x={W / 2} y="262" textAnchor="middle" {...head}>THE BULK OF THE MEMBERS</text>
    </g>
    <g data-step="2">
      {XS.map((x) => <line key={x} x1={x} y1="222" x2={W / 2 + (x - W / 2) * 0.08} y2="112" stroke="var(--ink-3)" strokeWidth="1.2" />)}
      <circle cx={W / 2} cy="100" r="12" fill="none" stroke="var(--ink)" strokeWidth="2" />
      <text x="204" y="98" {...head} data-label="sovereign">DETERMINATE</text>
      <text x="204" y="114" {...head}>COMMON SUPERIOR</text>
      <text x={W / 2} y="282" textAnchor="middle" {...body} fontSize={12}>each line up: a habit of obedience</text>
    </g>
    <g data-step="3">
      <line x1={W / 2} y1="88" x2={W / 2} y2="40" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="4 4" />
      <line x1={W / 2 - 9} y1="55" x2={W / 2 + 9} y2="37" stroke="var(--ink-2)" strokeWidth="2" />
      <text x={W / 2} y="22" textAnchor="middle" {...body} fontSize={12}>obeys no one habitually: independent</text>
    </g>
    <g data-step="4">
      <rect x="8" y="296" width={W - 16} height="216" rx="12" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="6 6" />
      <text x="24" y="320" {...head}>REMOVE THE COMMON SUPERIOR</text>
      {[40, 70, 104, 150, 176].map((x, i) => <circle key={x} cx={x} cy={360 + (i % 2) * 16} r="5" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />)}
      <text x="24" y="410" {...body}>a state of nature — no habitual</text>
      <text x="24" y="429" {...body}>obedience to one superior</text>
      <circle cx="250" cy="352" r="7" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <circle cx="318" cy="352" r="7" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <path d="M 236 384 L 250 359 M 264 384 L 250 359 M 304 384 L 318 359 M 332 384 L 318 359" fill="none" stroke="var(--ink-3)" strokeWidth="1.2" />
      <text x="24" y="466" {...body}>or two or more independent political</text>
      <text x="24" y="485" {...body}>societies, each with its own superior</text>
    </g>
  </svg>
);

export default function AustinsSovereign() {
  return (
    <Diagram
      label="Austin's sovereign: the bulk of a society habitually obeying one superior who obeys no one"
      terms={[
        { term: 'Sovereign', def: 'The determinate and common superior whom the bulk of a society habitually obeys.' },
        { term: 'Independent political society', def: 'A political society whose superior does not habitually obey another person or body.' },
        { term: 'Positivism (Austin)', def: '"The existence of law is one thing; its merit or demerit is another."' },
      ]}
      figure={figure}
      steps={[
        { caption: '"Every positive law is set by a sovereign person, or a sovereign body of persons, to a member or members of the independent political society" (PJD 165).' },
        { caption: 'A society is political if the generality of its members is in a habit of obedience to a determinate and common superior. No territory is needed: the key is the power relation.' },
        { caption: 'It is political and independent if that superior does not habitually obey another person or body. The model fits a city state, an absolute monarchy or a constitutional democracy.' },
        { caption: 'Without habitual obedience by the bulk to one and the same superior, the society is in a state of nature or split into two or more independent political societies.' },
      ]}
      check={{
        question: "A governor is habitually obeyed by the population but habitually obeys a distant emperor. On Austin's test, is the governor sovereign?",
        options: [
          { text: 'Yes — the bulk habitually obey the governor', why: 'That makes the society political, but independence needs a superior who habitually obeys no one else.' },
          { text: 'No — the governor habitually obeys another', correct: true, why: 'A sovereign has no outgoing habit of obedience; the emperor is the determinate common superior.' },
          { text: 'No — the society is in a state of nature', why: 'There is habitual obedience to a determinate superior here, so it is not a state of nature.' },
        ],
      }}
    />
  );
}
