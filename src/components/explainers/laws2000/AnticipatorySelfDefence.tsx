/*
SCENE: Anticipatory self-defence — a slider along time, from an attack that has occurred to a mere "sufficient threat"
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → move the stage along the spectrum and set necessity, proportionality and reporting → watch the support
  label and the verdict change → one check
INTENT: Show that support for self-defence fades as the facts move away from an attack that "occurs", that only a
  specific, manifestly imminent attack attracts real support, and that the other conditions apply at every point.
SUBJECT: the marker on the time spectrum.
BEAT 1 (0–100%): the select moves the marker between four fixed stops (redrawn in place, no tween); toggles light the
  three always-on conditions; the verdict updates within 200ms. Colour transitions only (180ms ease-out).
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: identical — nothing moves positionally.
BUDGET: < 7 KB gz, no WebGL.
Source: concept laws2000-w09-anticipatory-self-defence; Week 9 slides 25–27; authority us-national-security-strategy-2002;
  tutorial Q2(b). "Too early can itself be aggression" and the failure-to-report inference are the lecturer's
  (transcripts), flagged verify on the concept card.
*/
import { Simulation, type SimView } from '../bases/Simulation';

interface S extends Record<string, unknown> {
  stage: 'occurred' | 'imminent' | 'buildup' | 'threat';
  necessary: boolean;
  proportionate: boolean;
  reported: boolean;
}

const initial: S = { stage: 'buildup', necessary: true, proportionate: true, reported: true };

const STOPS: { key: S['stage']; x: number; l1: string; l2: string; support: string }[] = [
  { key: 'occurred', x: 50, l1: 'attack', l2: 'has occurred', support: 'art 51' },
  { key: 'imminent', x: 130, l1: 'manifestly', l2: 'imminent', support: 'more support' },
  { key: 'buildup', x: 210, l1: 'forces', l2: 'massing', support: 'contested' },
  { key: 'threat', x: 290, l1: 'sufficient', l2: 'threat', support: 'little support' },
];

function verdict(s: S): { text: string; tone: SimView['tone'] } {
  const base = {
    occurred: { text: 'Art 51 applies: an armed attack has occurred.', tone: 'yes' as const },
    imminent: { text: 'More support where a specific attack is manifestly imminent — but it remains a grey area.', tone: 'open' as const },
    buildup: { text: 'Contested: preparations alone are not a specific, manifestly imminent attack, and a strike taken too early can itself be aggression.', tone: 'no' as const },
    threat: { text: 'Little support: the 2002 US claim to pre-empt a “sufficient threat”, even if time and place are uncertain, was not accepted.', tone: 'no' as const },
  }[s.stage];
  if (!s.necessary || !s.proportionate)
    return { text: `${base.text} In any case it fails: the response must be ${!s.necessary ? 'necessary — a last resort' : 'proportionate'}, whatever the timing.`, tone: 'no' };
  if (!s.reported)
    return { text: `${base.text} Not reported: art 51 requires an immediate report, and in Nicaragua a failure suggested the state did not believe it was acting in self-defence.`, tone: base.tone === 'yes' ? 'open' : base.tone };
  return base;
}

function view(s: S): SimView {
  const at = STOPS.find((p) => p.key === s.stage)!;
  const v = verdict(s);
  const conds: [string, boolean][] = [['necessity', s.necessary], ['proportionality', s.proportionate], ['reported to the Council', s.reported]];
  const figure = (
    <div className="xgates">
      <svg viewBox="0 0 340 124" role="img" aria-label={`Time spectrum from an attack that has occurred to a sufficient threat. Selected: ${at.l1} ${at.l2}, ${at.support}.`}>
        <text x="50" y="16" fontFamily="var(--font-ui)" fontSize="11" letterSpacing="1" fill="var(--ink-2)">FURTHER FROM AN ATTACK →</text>
        <line x1="50" y1="40" x2="290" y2="40" stroke="var(--ink-3)" strokeWidth="1.5" />
        {STOPS.map((p) => {
          const on = p.key === s.stage;
          return (
            <g key={p.key} data-stop={p.key} data-on={on || undefined}>
              <circle cx={p.x} cy="40" r={on ? 9 : 4} fill={on ? 'var(--ink)' : 'var(--paper)'} stroke="var(--ink)" strokeWidth="1.5" />
              <text x={p.x} y="68" textAnchor="middle" fontFamily="var(--font-body)" fontSize="12" fill={on ? 'var(--ink)' : 'var(--ink-2)'}>{p.l1}</text>
              <text x={p.x} y="82" textAnchor="middle" fontFamily="var(--font-body)" fontSize="12" fill={on ? 'var(--ink)' : 'var(--ink-2)'}>{p.l2}</text>
              <text x={p.x} y="108" textAnchor="middle" fontFamily="var(--font-ui)" fontSize="11" fill={on ? 'var(--ink)' : 'var(--ink-3)'} fontWeight={on ? 600 : 400}>{p.support}</text>
            </g>
          );
        })}
      </svg>
      <div className="xgates__circ">
        <p className="xgates__circ-title">Always switched on, at every point:</p>
        <ul>
          {conds.map(([k, ok]) => <li key={k} data-on={ok ? 'true' : undefined}>{ok ? '● ' : '○ '}{k}{ok ? '' : ' — not met'}</li>)}
        </ul>
      </div>
    </div>
  );
  return { figure, verdict: v.text, tone: v.tone };
}

function describe(a: S, b: S) {
  if (a.stage !== b.stage) return {
    occurred: 'The attack has occurred: the words of art 51 are satisfied.',
    imminent: 'A specific attack is manifestly imminent — e.g. a missile already on its way.',
    buildup: 'Troops and missiles are massing at the border, but no specific attack is known.',
    threat: 'A “sufficient threat” whose time and place are uncertain — the 2002 US doctrine.',
  }[b.stage];
  if (a.necessary !== b.necessary) return b.necessary ? 'No other means of halting the attack: force is the last resort.' : 'Other means are available (diplomacy, the Security Council): force is not necessary.';
  if (a.proportionate !== b.proportionate) return b.proportionate ? 'The response is in proportion.' : 'The response goes beyond what is proportionate.';
  if (a.reported !== b.reported) return b.reported ? 'Measures reported immediately to the Security Council.' : 'Measures not reported to the Security Council.';
  return '';
}

export default function AnticipatorySelfDefence() {
  return (
    <Simulation<S>
      label="Anticipatory self-defence: support fades as the facts move away from an attack that has occurred"
      terms={[
        { term: 'If an armed attack occurs', def: 'The trigger in art 51 — on its strict wording, the attack must already have happened.' },
        { term: 'Manifestly imminent', def: 'A specific attack about to happen — where support for anticipation is strongest.' },
        { term: 'Sufficient threat', def: 'The 2002 US test: act even if the time and place of attack are uncertain.' },
      ]}
      initial={initial}
      controls={[
        { key: 'stage', label: 'How close is the attack?', type: 'select', options: [
          { value: 'occurred', label: 'The attack has occurred' },
          { value: 'imminent', label: 'A specific attack is manifestly imminent' },
          { value: 'buildup', label: 'Forces massing at the border' },
          { value: 'threat', label: 'A sufficient threat, time and place uncertain' },
        ] },
        { key: 'necessary', label: 'No other means of halting it', type: 'toggle' },
        { key: 'proportionate', label: 'The response is proportionate', type: 'toggle' },
        { key: 'reported', label: 'Reported to the Security Council', type: 'toggle' },
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'Satellite images show State B deploying troops and short-range missiles at its border with State C; no attack has happened. Can C rely on art 51 now?',
        options: [
          { text: 'Yes — the 2002 US doctrine allows force against any sufficient threat', why: 'That expanded definition attracted little support; it is not accepted law.' },
          { text: 'Probably not — a build-up alone is not a specific, manifestly imminent attack', correct: true, why: 'Art 51 speaks of an attack that “occurs”; support for anticipation exists only where a specific attack is manifestly imminent, and the other conditions still apply.' },
          { text: 'Yes — if C reports its strike to the Security Council immediately', why: 'Reporting is required, but it cannot supply the missing armed attack or imminence.' },
        ],
      }}
    />
  );
}
