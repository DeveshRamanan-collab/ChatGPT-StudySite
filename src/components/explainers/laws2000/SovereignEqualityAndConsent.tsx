/*
SCENE: Sovereign equality and state consent — unequal states drawn equal, then a treaty that binds only who consents
LENGTH: 4 screens pinned (desktop, full motion); 4 paced beats otherwise
BEATS: 4
INTENT: Show two separate principles: every state counts equally (one vote), and no rule binds a state that has not
  consented — so states end up with different obligations.
SUBJECT: the two state tokens (China, Malta).
BEAT 1 (0–25%): tokens start sized by population and scale to equal size (transform, scrubbed, ease none).
BEAT 2 (25–50%): "1 vote" appears under each; the General Assembly line (Art 2 UN Charter).
BEAT 3 (50–75%): a treaty below; China's consent line is solid (bound), Malta's dashed (not bound).
BEAT 4 (75–100%): consent express or implicit; states as makers and subjects.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: final frame (equal tokens, both lines, all labels) with all four captions stacked.
BUDGET: < 8 KB gz.
Source: concept laws2000-w01-sovereign-equality-and-consent; authority card un-charter-art-2-1. Which state consents is illustrative.
*/
import { ScrollExplainer } from '../bases/ScrollExplainer';

const ui = { fontFamily: 'var(--font-ui)', fontSize: 12.5, letterSpacing: 1.1, fill: 'var(--ink)' } as const;
const note = { fontFamily: 'var(--font-body)', fontSize: 13.5, fill: 'var(--ink-2)' } as const;
const on = (t: number, at: number) => Math.max(0, Math.min(1, t - at));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

const STATES = [
  { x: 100, name: 'China', pop: '1.4 billion people', from: 1.5, bound: true },
  { x: 260, name: 'Malta', pop: 'half a million', from: 0.25, bound: false },
];

function scene(t: number) {
  const k = on(t, 0);
  return (
    <svg viewBox="0 0 360 450" style={{ maxWidth: 440 }} role="img" aria-label="China and Malta as equal tokens with one vote each; a treaty binds only the state that consented">
      {STATES.map((s) => (
        <g key={s.name}>
          <g style={{ transform: `scale(${lerp(s.from, 1, k)})`, transformOrigin: `${s.x}px 70px` }}>
            <circle cx={s.x} cy="70" r="40" fill="var(--paper-2)" stroke="var(--ink)" strokeWidth="1.5" />
          </g>
          <text x={s.x} y="75" textAnchor="middle" {...ui}>{s.name.toUpperCase()}</text>
          <text x={s.x} y="136" textAnchor="middle" {...note}>{s.pop}</text>
          <text x={s.x} y="160" textAnchor="middle" {...ui} style={{ opacity: on(t, 1) }}>1 VOTE</text>
          <g style={{ opacity: on(t, 2) }}>
            <line x1={s.x} y1="200" x2={s.x < 180 ? 150 : 210} y2="240" stroke="var(--ink)" strokeWidth={s.bound ? 2.5 : 1.5} strokeDasharray={s.bound ? undefined : '4 5'} />
            <text x={s.x} y="330" textAnchor="middle" {...note} fill="var(--ink)">{s.bound ? 'consented:' : 'no consent:'}</text>
            <text x={s.x} y="348" textAnchor="middle" {...ui}>{s.bound ? 'BOUND' : 'NOT BOUND'}</text>
          </g>
        </g>
      ))}
      <text x="180" y="186" textAnchor="middle" {...note} style={{ opacity: on(t, 1) }}>General Assembly: equal weight (Art 2)</text>
      <g style={{ opacity: on(t, 2) }}>
        <rect x="130" y="240" width="100" height="56" rx="4" fill="var(--paper)" stroke="var(--ink-2)" strokeWidth="1.5" />
        <text x="180" y="273" textAnchor="middle" {...ui}>TREATY</text>
      </g>
      <g style={{ opacity: on(t, 3) }}>
        <rect x="8" y="370" width="344" height="72" rx="12" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
        <text x="22" y="394" {...note} fill="var(--ink)">consent: express (ratifying) or implicit</text>
        <text x="22" y="412" {...note} fill="var(--ink)">(practice believed binding — custom)</text>
        <text x="22" y="432" {...note}>states make the law and are bound by it</text>
      </g>
    </svg>
  );
}

export default function SovereignEqualityAndConsent() {
  return (
    <ScrollExplainer
      label="Sovereign equality and state consent"
      terms={[
        { term: 'Sovereign equality', def: 'Each state, however large or small, counts equally (Art 2 UN Charter).' },
        { term: 'State consent', def: 'No treaty or rule binds a state unless it has consented to be bound.' },
        { term: 'Implicit consent', def: 'Following a customary practice in the belief that it is legally binding.' },
      ]}
      beats={[
        { caption: 'China has 1.4 billion people; Malta has half a million. Sovereign equality draws them the same size: each state counts equally.' },
        { caption: 'In the UN General Assembly each has one vote, and in most international organisations every member’s vote carries the same weight (Art 2, UN Charter).' },
        { caption: 'Consent is separate: no state can be compelled to join a treaty. The state that consents is bound; the one that does not is not — so states end up with different obligations.' },
        { caption: 'Consent can be express (ratifying a treaty) or implicit (custom). States are the makers and the subjects of international law at once, so it cannot impose obligations the way a parliament can.' },
      ]}
      scene={scene}
      check={{
        question: 'Most states have ratified a treaty. State Z has not. Is Z bound by the treaty?',
        options: [
          { text: 'Yes — the majority binds every state, as in the General Assembly', why: 'Equal votes in the Assembly are sovereign equality; they do not replace consent to a treaty.' },
          { text: 'No — a treaty binds only a state that has consented to it', correct: true, why: 'Ask what Z actually consented to; never assume a rule binds because most others accept it.' },
          { text: 'Yes, if Z is a small state', why: 'Size is irrelevant: sovereign equality means Z counts the same as any other state.' },
        ],
      }}
    />
  );
}
