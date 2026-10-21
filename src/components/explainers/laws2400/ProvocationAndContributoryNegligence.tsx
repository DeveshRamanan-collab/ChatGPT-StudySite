/*
SCENE: Provocation and contributory negligence — two doors, both closed for intentional torts
LENGTH: 4 screens pinned (desktop, full motion); 4 paced beats otherwise
BEATS: 4
INTENT: Neither provocation nor contributory negligence reduces liability for an intentional tort (bar a Qld/WA
  side-door for provocation), because intentional wrongdoing differs from carelessness in kind, not degree.
SUBJECT: the two doors and their CLOSED stamps.
BEAT 1 (0–25%): provocation door, stamped closed (Fontin v Katapodis; exemplary damages note). Ease none (scrubbed).
BEAT 2 (25–50%): the Qld/WA side-door opens beside it (dashed).
BEAT 3 (50–75%): contributory negligence door, stamped closed (Horkin: degree vs kind).
BEAT 4 (75–100%): an open question mark over conversion of an unlocked car.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: final frame with all four captions stacked (base).
BUDGET: < 6 KB gz. Opacity and transform only.
Source: concept laws2400-w04-provocation-and-contributory-negligence; case cards fontin-v-katapodis,
  horkin-v-north-melbourne-football-club.
*/
import { ScrollExplainer } from '../bases/ScrollExplainer';

const W = 360;
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const head = { fontFamily: 'var(--font-ui)', fontSize: 12.5, letterSpacing: 1.5, fill: 'var(--ink)' } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 14, fill: 'var(--ink-2)' } as const;

function Door({ x, title, lines, on, stamp }: { x: number; title: string; lines: string[]; on: number; stamp: number }) {
  return (
    <g opacity={on}>
      <text x={x + 70} y="22" textAnchor="middle" {...head}>{title}</text>
      <rect x={x + 10} y="34" width="120" height="170" rx="4" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <circle cx={x + 112} cy="124" r="4" fill="var(--ink)" />
      <g opacity={stamp} transform={`rotate(-12 ${x + 70} 120)`}>
        <rect x={x + 22} y="104" width="96" height="32" rx="4" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2" />
        <text x={x + 70} y="126" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="15" letterSpacing="3" fill="var(--ink)">CLOSED</text>
      </g>
      {lines.map((l, k) => <text key={k} x={x + 4} y={228 + k * 19} {...body}>{l}</text>)}
    </g>
  );
}

function scene(t: number) {
  const side = clamp((t - 1) * 3 + 0.25);
  const q = clamp((t - 3) * 3 + 0.25);
  return (
    <svg viewBox={`0 0 ${W} 440`} role="img" aria-label="Two doors, provocation and contributory negligence, both closed for intentional torts">
      <Door x={0} title="PROVOCATION" on={clamp(t * 3 + 0.25)} stamp={clamp((t - 0.4) * 4)} lines={['no cut to compensatory', 'damages; may cut', 'exemplary (Fontin)']} />
      <Door x={180} title="CONTRIB. NEGLIGENCE" on={clamp((t - 2) * 3 + 0.25)} stamp={clamp((t - 2.4) * 4)} lines={['30% cut reversed:', '"not merely in degree', 'but in kind" (Horkin)']} />
      <g opacity={side}>
        <rect x="8" y="296" width="150" height="40" rx="4" fill="none" stroke="var(--ink-2)" strokeWidth="1.5" strokeDasharray="5 5" />
        <text x="83" y="321" textAnchor="middle" {...body}>side-door: Qld, WA</text>
      </g>
      <g opacity={q}>
        <rect x="8" y="356" width={W - 16} height="76" rx="12" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="6 6" />
        <text x="24" y="382" {...head}>? CONVERSION OF AN UNLOCKED CAR</text>
        <text x="24" y="404" {...body}>keys in the ignition, then stolen —</text>
        <text x="24" y="422" {...body}>a live policy question</text>
      </g>
    </svg>
  );
}

export default function ProvocationAndContributoryNegligence() {
  return (
    <ScrollExplainer
      label="Provocation and contributory negligence: two closed doors for intentional torts"
      terms={[
        { term: 'Provocation', def: 'Conduct by P that goads D — a defence to a criminal charge, generally not to an intentional tort.' },
        { term: 'Contributory negligence', def: 'P’s own carelessness contributing to P’s injury.' },
        { term: 'Exemplary damages', def: 'Damages beyond compensation; provocation may reduce or prevent them.' },
      ]}
      beats={[
        { caption: 'Provocation is closed as a tort defence. In Fontin v Katapodis, glass thrown at P’s face: provocation cannot reduce compensatory damages, though it may reduce or prevent exemplary damages.' },
        { caption: 'The exception: in Queensland and Western Australia, provocation may be pleaded as a tort defence.' },
        { caption: 'Contributory negligence is closed too. In Horkin, a 30% reduction was reversed: intentional battery and carelessness differ "not merely in degree but in kind".' },
        { caption: 'Open question: should contributory negligence apply to conversion — a car left unlocked with keys in the ignition, then stolen? Personal responsibility versus excusing theft.' },
      ]}
      scene={scene}
      check={{
        question: 'In NSW, D punches P after P’s taunts; P was also careless in staying. Can D reduce the compensatory damages?',
        options: [
          { text: 'Yes — for provocation', why: 'Fontin: provocation cannot reduce compensatory damages, and NSW is not one of the Qld/WA exceptions.' },
          { text: 'Yes — for contributory negligence', why: 'Horkin: carelessness differs in kind from intentional battery, so no reduction.' },
          { text: 'No — neither reduces liability for an intentional tort', correct: true, why: 'Both doors are closed; provocation may at most affect exemplary damages.' },
        ],
      }}
    />
  );
}
