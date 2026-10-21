/*
SCENE: Diplomatic and consular immunities — concentric rings around the mission
LENGTH: 5 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: Protection is strongest at the centre (inviolable premises and archives, the diplomatic agent) and narrows
  outward (family and staff, then consuls), with the receiving state's remedies at the edge.
SUBJECT: the rings, drawn centre-out; each ring's number keys a legend row beneath.
STEP 1: ring 1 — mission premises, property, archives: inviolable, immune from search and execution (VCDR arts 22, 24).
STEP 2: ring 2 — diplomatic agent: criminal immunity; civil with three exceptions; person, residence inviolable (arts 29–31, 41).
STEP 3: ring 3 — family, administrative and technical staff, service staff (official acts): narrower.
STEP 4: ring 4 — consul: restricted (VCCR arts 41, 43).
STEP 5: the edge — receiving state's remedies: persona non grata (art 9), sever, unfriendly act, waiver.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: the finished figure with all five captions stacked (base).
BUDGET: < 8 KB gz. Strokes draw (DrawSVG), text fades.
Source: concept laws2000-w06-diplomatic-and-consular-immunities; Tehran Hostages; VCDR arts 9, 22, 24, 29–31, 41; VCCR arts 41–43.
*/
import { Diagram } from '../bases/Diagram';

const W = 360, CX = 180, CY = 196;
const ui = { fontFamily: 'var(--font-ui)', fontSize: 12.5, letterSpacing: 1.1, fill: 'var(--ink)' } as const;
const note = { fontFamily: 'var(--font-body)', fontSize: 13.5, fill: 'var(--ink-2)' } as const;
const arc = (r: number) => `M ${CX - r} ${CY} A ${r} ${r} 0 0 1 ${CX + r} ${CY}`;

const RINGS = [
  { r: 44, id: 'premises', title: 'PREMISES · PROPERTY · ARCHIVES', line: 'inviolable; immune from search (arts 22, 24)' },
  { r: 88, id: 'agent', title: 'DIPLOMATIC AGENT', line: 'criminal immunity; civil, save 3 exceptions' },
  { r: 132, id: 'staff', title: 'FAMILY · ADMIN & TECH · SERVICE', line: 'narrower; service staff official acts only' },
  { r: 170, id: 'consul', title: 'CONSUL (VCCR)', line: "arrest for a 'grave crime'; ratione materiae" },
];

const figure = (
  <svg viewBox={`0 0 ${W} 560`} role="img" aria-label="Concentric rings: mission premises, diplomatic agent, family and staff, consul; the receiving state's remedies at the edge">
    {RINGS.map((g, i) => {
      const inner = i ? RINGS[i - 1].r : 0;
      const y = 226 + i * 56;
      return (
        <g key={g.id} data-step={i + 1}>
          <path d={arc(g.r)} fill="none" stroke="var(--ink)" strokeWidth={i === 0 ? 2 : 1.5} />
          <text x={CX} y={CY - (inner + g.r) / 2 + 5} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="13" fill="var(--ink)">{i + 1}</text>
          <text x="16" y={y} {...ui} data-label={g.id}><tspan fontFamily="var(--font-mono)">{i + 1}  </tspan>{g.title}</text>
          <text x="34" y={y + 20} {...note}>{g.line}</text>
        </g>
      );
    })}
    <g data-step="5">
      <line x1="6" y1={CY} x2={W - 6} y2={CY} stroke="var(--ink-3)" strokeWidth="1.5" />
      <rect x="6" y="452" width={W - 12} height="100" rx="12" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="6 5" />
      <text x="20" y="476" {...ui} data-label="remedies">THE EDGE: RECEIVING STATE'S REMEDIES</text>
      <text x="20" y="498" {...note}>persona non grata (art 9) · sever relations</text>
      <text x="20" y="518" {...note}>unfriendly act · do nothing</text>
      <text x="20" y="538" {...note}>seek waiver from the sending state</text>
    </g>
  </svg>
);

export default function DiplomaticAndConsularImmunities() {
  return (
    <Diagram
      label="Diplomatic and consular immunities as concentric rings"
      terms={[
        { term: 'Inviolability', def: 'Protection from entry, arrest or search: the premises, and the person of the diplomatic agent.' },
        { term: 'Receiving state', def: 'The state hosting the mission, whose jurisdiction the immunities restrict.' },
        { term: 'Persona non grata', def: 'A declaration by the receiving state that a diplomat is unwelcome (VCDR art 9).' },
        { term: 'Ratione materiae', def: 'Immunity for official acts only — the consul’s immunity (VCCR art 43).' },
      ]}
      figure={figure}
      steps={[
        { caption: 'Mission premises are inviolable: no entry without the head of mission’s consent, and the receiving state must protect them. Premises, property, transport and archives are immune from search and execution.' },
        { caption: 'The diplomatic agent is immune from criminal jurisdiction, and from civil jurisdiction except private immovable property, private succession, and professional or commercial activity outside official functions. No arrest; residence and papers inviolable. The agent must respect local law (art 41).' },
        { caption: 'Family members, administrative and technical staff, and service staff (official acts only) have narrower protection — generally not if nationals or permanent residents of the receiving state.' },
        { caption: 'Consuls have restricted immunities: limited inviolability, with arrest possible for a ‘grave crime’ (VCCR art 41), and immunity ratione materiae (art 43).' },
        { caption: 'For abuse, the receiving state may declare a diplomat persona non grata, sever relations, act unfriendly, do nothing, or seek waiver. In Tehran Hostages the ICJ called diplomatic law a “self-contained regime”.' },
      ]}
      check={{
        question: 'A diplomatic agent is sued over a private commercial venture outside their official functions. Are they immune?',
        options: [
          { text: 'Yes — a diplomatic agent is immune from all civil jurisdiction', why: 'Art 31 civil immunity has three exceptions, including professional or commercial activity outside official functions.' },
          { text: 'No — this falls within an art 31 exception to civil immunity', correct: true, why: 'Professional or commercial activity outside official functions is one of the three civil exceptions.' },
          { text: 'Only if the receiving state first declares them persona non grata', why: 'Persona non grata is a remedy for abuse, not a condition of the civil exceptions.' },
        ],
      }}
    />
  );
}
