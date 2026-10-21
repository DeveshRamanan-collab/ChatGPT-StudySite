/*
SCENE: International organisations — a constitutive treaty unfolding into four parts, with an NGO missing one
LENGTH: 4 screens pinned (desktop, full motion); 4 paced beats otherwise
BEATS: 4
INTENT: An IO is established by an instrument governed by international law and has its own personality; being
  governed by international law is what an NGO lacks; the constitutive instrument answers membership and personality.
SUBJECT: the four parts of the IO column.
BEAT 1 (0–25%): the four parts unfold in turn (opacity + 8px lift, scrubbed, ease none).
BEAT 2 (25–50%): the NGO column appears with part 2 an empty dashed slot.
BEAT 3 (50–75%): the constitutive instrument sets membership, withdrawal, expulsion.
BEAT 4 (75–100%): personality explicit or implied (Reparation); art 104 domestic capacity only.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: final frame with all four captions stacked.
BUDGET: < 8 KB gz.
Source: concept laws2000-w04-international-organisations-definition-and-personality; ARIO art 2(a); UN Charter arts
  4, 6, 104; Rome Statute art 127; WTO Agreement art VIII; Reparation for Injuries.
*/
import { ScrollExplainer } from '../bases/ScrollExplainer';

const ui = { fontFamily: 'var(--font-ui)', fontSize: 12, letterSpacing: 1, fill: 'var(--ink)' } as const;
const note = { fontFamily: 'var(--font-body)', fontSize: 13, fill: 'var(--ink)' } as const;
const sub = { fontFamily: 'var(--font-body)', fontSize: 12, fill: 'var(--ink-2)' } as const;
const on = (t: number, at: number) => Math.max(0, Math.min(1, t - at));
const PARTS = [
  { main: 'treaty or other instrument', sub: 'UN Charter; OPEC by resolution' },
  { main: 'governed by international law', sub: 'what an NGO lacks' },
  { main: 'own legal personality', sub: 'distinct from its members’' },
  { main: 'members', sub: 'may include non-states (EU in FAO)' },
];

function scene(t: number) {
  const later = on(t, 3);
  return (
    <svg viewBox="0 0 360 450" style={{ maxWidth: 440 }} role="img" aria-label="An international organisation's four defining parts beside an NGO lacking the second">
      <text x="8" y="22" {...ui}>IO · ARIO art 2(a)</text>
      {PARTS.map((p, i) => {
        const k = Math.min(1, Math.max(0, (t - i * 0.22) * 3));
        const y = 34 + i * 62;
        return (
          <g key={p.main} style={{ opacity: k, transform: `translateY(${(1 - k) * -8}px)` }}>
            <rect x="8" y={y} width="220" height="52" rx="8" fill="var(--paper-2)" stroke="var(--ink)" strokeWidth="1.5" />
            <text x="20" y={y + 22} {...note}><tspan fontFamily="var(--font-mono)">{i + 1} </tspan>{p.main}</text>
            {i === 2 ? (
              <>
                <text x="20" y={y + 41} {...sub} style={{ opacity: 1 - later }}>{p.sub}</text>
                <text x="20" y={y + 41} {...sub} style={{ opacity: later }}>explicit, or implied (Reparation)</text>
              </>
            ) : <text x="20" y={y + 41} {...sub}>{p.sub}</text>}
          </g>
        );
      })}
      <g style={{ opacity: on(t, 1) }}>
        <text x="240" y="22" {...ui}>NGO</text>
        <rect x="240" y="96" width="112" height="64" rx="8" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="4 4" />
        <text x="296" y="116" textAnchor="middle" {...sub}>missing: 2</text>
        <text x="296" y="132" textAnchor="middle" {...sub}>governed by</text>
        <text x="296" y="148" textAnchor="middle" {...sub}>international law</text>
        <text x="240" y="184" {...sub}>Greenpeace,</text>
        <text x="240" y="200" {...sub}>Amnesty</text>
        <text x="240" y="216" {...sub}>International</text>
      </g>
      <g style={{ opacity: on(t, 2) }}>
        <rect x="8" y="290" width="344" height="92" rx="12" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
        <text x="22" y="312" {...ui}>THE CONSTITUTIVE INSTRUMENT SETS</text>
        <text x="22" y="334" {...note}>membership · UN Charter art 4</text>
        <text x="22" y="352" {...note}>withdrawal · Rome Statute art 127</text>
        <text x="22" y="370" {...note}>expulsion · UN Charter art 6</text>
      </g>
      <g style={{ opacity: later }}>
        <text x="8" y="412" {...note}>personality: explicit (WTO art VIII) or implied</text>
        <text x="8" y="432" {...sub}>art 104 UN Charter: domestic capacity only</text>
      </g>
    </svg>
  );
}

export default function InternationalOrganisationsDefinitionAndPersonality() {
  return (
    <ScrollExplainer
      label="International organisations: definition, membership and legal personality"
      terms={[
        { term: 'International organisation', def: '“Established by a treaty or other instrument governed by international law and possessing its own international legal personality” (ARIO art 2(a)).' },
        { term: 'Constitutive instrument', def: 'The treaty or resolution that creates the IO and sets its membership rules.' },
        { term: 'Implied personality', def: 'Personality found from the functions the IO was intended to exercise, though its instrument is silent.' },
      ]}
      beats={[
        { caption: 'An IO is established by a treaty or other instrument governed by international law, has its own international legal personality, and may include non-states as members. Almost all are created by treaty (the UN Charter); some by resolution (OPEC; the ICTY and ICTR by Security Council resolution).' },
        { caption: 'Being governed by international law distinguishes IOs from NGOs such as Greenpeace or Amnesty International.' },
        { caption: 'The constitutive instrument sets membership (UN Charter art 4: “peace-loving states”), withdrawal (Rome Statute art 127: effective one year after notification; the UN Charter has no withdrawal clause) and expulsion (art 6, for persistent violation).' },
        { caption: 'Personality — concluding treaties, delegations, claims, responsibility — may be explicit (WTO art VIII) or implied: Reparation for Injuries (1949) found the UN an international person though the Charter is silent. Art 104 confers only domestic capacity, like renting offices in New York.' },
      ]}
      scene={scene}
      check={{
        question: 'An organisation’s founding treaty says nothing about international legal personality. What is the best argument?',
        options: [
          { text: 'It has none, because personality must be conferred expressly', why: 'Reparation for Injuries found the UN an international person although the Charter is silent.' },
          { text: 'Implied personality, from the functions it was intended to exercise', correct: true, why: 'Go to the constitutive instrument first; if silent, argue implied personality as in Reparation.' },
          { text: 'Art 104 of the UN Charter supplies it', why: 'Art 104 gives the UN only domestic legal capacity, not international personality.' },
        ],
      }}
    />
  );
}
