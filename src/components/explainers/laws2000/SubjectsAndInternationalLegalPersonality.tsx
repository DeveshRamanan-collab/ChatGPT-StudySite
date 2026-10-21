/*
SCENE: Subjects and legal personality — a dial of five capacities, fully lit for the state, partly for an IO
LENGTH: 4 screens pinned (desktop, full motion); 4 paced beats otherwise
BEATS: 4
INTENT: Personality is a set of capacities held in degrees: states hold all five fully; other subjects, like an IO,
  only partially — so ask which capacities, and from where.
SUBJECT: the five dial segments and how far each is lit.
BEAT 1 (0–25%): the dial outline and its five numbered capacities.
BEAT 2 (25–50%): every segment fills for the state (fill radius scrubbed, ease none).
BEAT 3 (50–75%): the fill recedes to part-way; the centre reads "IO" (Reparation).
BEAT 4 (75–100%): the exam question beneath.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: final frame (IO, part-lit) with all four captions stacked.
BUDGET: < 8 KB gz. The partial fill is uniform: the card does not say which capacities an IO lacks.
Source: concept laws2000-w04-subjects-and-international-legal-personality; Reparation for Injuries (1949).
*/
import { ScrollExplainer } from '../bases/ScrollExplainer';

const ui = { fontFamily: 'var(--font-ui)', fontSize: 12.5, letterSpacing: 1.1, fill: 'var(--ink)' } as const;
const note = { fontFamily: 'var(--font-body)', fontSize: 13.5, fill: 'var(--ink-2)' } as const;
const on = (t: number, at: number) => Math.max(0, Math.min(1, t - at));
const CX = 180, CY = 130, R0 = 44, R1 = 110;
const CAPS = ['claim rights (bring claims)', 'enter diplomatic relations', 'bear obligations directly', 'create law (binding treaties)', 'immunity from other states’ courts'];

const pt = (r: number, a: number) => `${CX + r * Math.sin(a)} ${CY - r * Math.cos(a)}`;
function seg(r0: number, r1: number, i: number) {
  const g = 0.04, a0 = (i * 2 * Math.PI) / 5 + g, a1 = ((i + 1) * 2 * Math.PI) / 5 - g;
  return `M ${pt(r0, a0)} A ${r0} ${r0} 0 0 1 ${pt(r0, a1)} L ${pt(r1, a1)} A ${r1} ${r1} 0 0 0 ${pt(r1, a0)} Z`;
}

function scene(t: number) {
  const extent = on(t, 1) - 0.5 * on(t, 2); // 0 → 1 (state) → 0.5 (IO)
  const io = on(t, 2);
  return (
    <svg viewBox="0 0 360 440" style={{ maxWidth: 440 }} role="img" aria-label="A dial of five capacities: fully lit for a state, part-lit for an international organisation">
      <g style={{ opacity: on(t, 0) }}>
        {CAPS.map((c, i) => {
          const mid = ((i + 0.5) * 2 * Math.PI) / 5;
          return (
            <g key={c}>
              <path d={seg(R0, R1, i)} fill="none" stroke="var(--ink)" strokeWidth="1.5" />
              {extent > 0.001 && <path d={seg(R0, R0 + (R1 - R0) * extent, i)} fill="var(--ink)" fillOpacity="0.22" />}
              <text x={CX + 92 * Math.sin(mid)} y={CY - 92 * Math.cos(mid) + 5} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="13" fill="var(--ink)">{i + 1}</text>
            </g>
          );
        })}
        <text x={CX} y={CY + 5} textAnchor="middle" {...ui} style={{ opacity: Math.min(1, on(t, 1) * 2) * (1 - io) }}>STATE</text>
        <text x={CX} y={CY + 5} textAnchor="middle" {...ui} style={{ opacity: io }}>IO</text>
        {CAPS.map((c, i) => (
          <text key={c} x="24" y={270 + i * 20} {...note}><tspan fontFamily="var(--font-mono)" fill="var(--ink)">{i + 1}  </tspan>{c}</text>
        ))}
      </g>
      <g style={{ opacity: on(t, 3) }}>
        <rect x="8" y="376" width="344" height="56" rx="12" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
        <text x="22" y="400" {...note} fill="var(--ink)">not “is X a subject?” but which</text>
        <text x="22" y="420" {...note} fill="var(--ink)">capacities does X have, and from where?</text>
      </g>
    </svg>
  );
}

export default function SubjectsAndInternationalLegalPersonality() {
  return (
    <ScrollExplainer
      label="Subjects of international law as a dial of capacities"
      terms={[
        { term: 'Subject', def: 'An entity with international rights and obligations, able to bring claims and be subjected to them (Crawford).' },
        { term: 'International legal personality', def: 'Being a subject: who has it, and to what extent.' },
        { term: 'Partial capacity', def: 'Holding some capacities, or holding them to a lesser extent, than a state.' },
      ]}
      beats={[
        { caption: 'A subject is “an entity possessing international rights and obligations and having the capacity (1) to maintain its rights by bringing international claims; and (2) to be responsible for its breaches of obligation by being subjected to such claims” (Crawford). Five capacities are ascribed to subjecthood.' },
        { caption: 'States are the only subjects with full legal capacity. Immunity shows it: Australia cannot try New Zealand in its courts, because there is no authority above a sovereign state.' },
        { caption: 'Others have only partial capacity. In Reparation for Injuries (1949) the UN was an international person — “not the same thing as saying that it is a State”; subjects “are not necessarily identical in their nature or in the extent of their rights”.' },
        { caption: 'So never ask only “is X a subject?” Ask which capacities X has, and where they come from.' },
      ]}
      scene={scene}
      check={{
        question: 'What did Reparation for Injuries (1949) decide about the UN?',
        options: [
          { text: 'It is a state, because it can bring claims', why: 'The ICJ said personality is “not the same thing as saying that it is a State”.' },
          { text: 'It is an international person, though its rights need not match a state’s', correct: true, why: 'Subjects are not necessarily identical in their nature or in the extent of their rights.' },
          { text: 'It has no personality, because the Charter never confers it', why: 'The Court found personality although the Charter never says so.' },
        ],
      }}
    />
  );
}
