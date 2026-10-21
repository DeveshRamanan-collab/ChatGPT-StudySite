/*
SCENE: Treaties as a source — one agreement, a consent switch, and the obligation it turns on
LENGTH: 4 screens pinned (desktop, full motion); 4 paced beats otherwise
BEATS: 4
INTENT: A treaty binds because the parties consented — whatever it is called — so ratification is the switch that
  turns the obligation on, making the treaty the first and strongest point of reference.
SUBJECT: the consent switch's knob and the obligation it lights.
BEAT 1 (0–25%): two states and an agreement; the labels beneath (label doesn't matter).
BEAT 2 (25–50%): the switch slides from "not ratified" to "ratified" (translateX, scrubbed, ease none); "obligation on" fades in.
BEAT 3 (50–75%): pacta sunt servanda; domestic law must be consistent.
BEAT 4 (75–100%): check ratification first, before custom or general principles.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: final frame (switch on) with all four captions stacked.
BUDGET: < 8 KB gz.
Source: concept laws2000-w02-treaties-as-a-source; authority card vclt-art-2-1-a.
*/
import { ScrollExplainer } from '../bases/ScrollExplainer';

const ui = { fontFamily: 'var(--font-ui)', fontSize: 12.5, letterSpacing: 1.1, fill: 'var(--ink)' } as const;
const note = { fontFamily: 'var(--font-body)', fontSize: 13.5, fill: 'var(--ink-2)' } as const;
const on = (t: number, at: number) => Math.max(0, Math.min(1, t - at));

function scene(t: number) {
  const k = on(t, 1);
  return (
    <svg viewBox="0 0 360 420" style={{ maxWidth: 440 }} role="img" aria-label="Two states and a treaty; ratification switches the obligation on">
      <g style={{ opacity: on(t, 0) }}>
        {[20, 260].map((x, i) => (
          <g key={x}>
            <rect x={x} y="24" width="80" height="56" rx="8" fill="var(--paper-2)" stroke="var(--ink)" strokeWidth="1.5" />
            <text x={x + 40} y="57" textAnchor="middle" {...ui}>STATE {i ? 'B' : 'A'}</text>
          </g>
        ))}
        <line x1="100" y1="52" x2="140" y2="52" stroke="var(--ink)" strokeWidth="1.5" />
        <line x1="220" y1="52" x2="260" y2="52" stroke="var(--ink)" strokeWidth="1.5" />
        <rect x="140" y="20" width="80" height="64" rx="4" fill="var(--paper)" stroke="var(--ink-2)" strokeWidth="1.5" />
        <text x="180" y="57" textAnchor="middle" {...ui} fontSize="11.5">TREATY</text>
        <text x="180" y="112" textAnchor="middle" {...note}>or agreement · convention · protocol ·</text>
        <text x="180" y="130" textAnchor="middle" {...note}>covenant · exchange of letters</text>
      </g>
      <g style={{ opacity: Math.min(1, on(t, 0.5) * 2) }}>
        <text x="96" y="186" textAnchor="end" {...note}>not ratified</text>
        <rect x="106" y="168" width="84" height="28" rx="14" fill="var(--paper-3)" stroke="var(--ink-3)" strokeWidth="1.5" />
        <g style={{ transform: `translateX(${k * 56}px)` }}>
          <circle cx="120" cy="182" r="11" fill="var(--ink)" />
        </g>
        <text x="200" y="186" {...note}>ratified</text>
        <text x="180" y="226" textAnchor="middle" {...ui} style={{ opacity: k }}>OBLIGATION ON</text>
      </g>
      <g style={{ opacity: on(t, 2) }}>
        <text x="180" y="262" textAnchor="middle" {...ui}>PACTA SUNT SERVANDA</text>
        <text x="180" y="284" textAnchor="middle" {...note}>honour the obligation; keep domestic law</text>
        <text x="180" y="302" textAnchor="middle" {...note}>and practice consistent with it</text>
      </g>
      <g style={{ opacity: on(t, 3) }}>
        <rect x="8" y="324" width="344" height="86" rx="12" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
        <text x="22" y="348" {...ui}>FIRST AND STRONGEST REFERENCE</text>
        <text x="22" y="370" {...note}>check ratification or accession before</text>
        <text x="22" y="390" {...note}>reaching for custom or general principles</text>
      </g>
    </svg>
  );
}

export default function TreatiesAsASource() {
  return (
    <ScrollExplainer
      label="Treaties as a source: consent turns the obligation on"
      terms={[
        { term: 'Treaty', def: '“An international agreement concluded between States in written form and governed by international law” (VCLT art 2(1)(a)).' },
        { term: 'Ratification', def: 'The act by which a state becomes a party and consents to be bound.' },
        { term: 'Pacta sunt servanda', def: 'States are bound to honour their treaty obligations.' },
      ]}
      beats={[
        { caption: 'A treaty is an agreement between states (sometimes international organisations, like the EU), bilateral or multilateral. The label does not matter — what counts is consent to be bound.' },
        { caption: 'Consent is the switch: becoming a party implies consent to the obligations, so checking ratification shows directly whether a state accepted them.' },
        { caption: 'Pacta sunt servanda: the state must honour the obligation and make its domestic law and practice consistent with it. Treaties also create organisations, like the UN Charter and NATO.' },
        { caption: 'Once a treaty applies between the states concerned, it is usually the first and strongest point of reference: check ratification before reaching for custom or general principles.' },
      ]}
      scene={scene}
      check={{
        question: 'A document between two states is titled “Covenant”. Does that stop it being a treaty?',
        options: [
          { text: 'Yes — only documents called “treaty” are treaties', why: 'Agreements, conventions, protocols and covenants can all be treaties.' },
          { text: 'No — the label does not matter; what counts is whether the parties consented to be bound', correct: true, why: 'Consent to be bound, not the title, is what makes the obligation binding.' },
          { text: 'Yes — covenants are soft law', why: 'Covenant is one of the usual names for a treaty; the card lists it alongside convention and protocol.' },
        ],
      }}
    />
  );
}
