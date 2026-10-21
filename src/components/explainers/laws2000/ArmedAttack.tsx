/*
SCENE: The armed attack trigger — two nested rings, use of force outside, armed attack inside, and an incident dot
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → change scale and effects, target and who acted → watch the dot sit in the outer band, on the inner
  line (arguable) or inside the inner ring → one check
INTENT: Show that an armed attack is a grave subset of the use of force, measured by scale and effects, and that
  Nicaragua and Oil Platforms place some uses of force below the line.
SUBJECT: the incident dot and the ring it sits in.
BEAT 1 (0–100%): selects and toggles move the dot between three fixed positions (no tween — it is redrawn in place)
  and recolour it; the verdict updates within 200ms.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: identical — nothing moves positionally; colour only.
BUDGET: < 8 KB gz, no WebGL.
Source: concept laws2000-w09-armed-attack; Week 9 slides 18–19; Nicaragua (1986); Oil Platforms; the cumulative-effect
  point is the lecturer's (Part A transcript), flagged verify on the concept card.
*/
import { Simulation, type SimView } from '../bases/Simulation';

interface S extends Record<string, unknown> {
  scale: 'minor' | 'significant' | 'grave';
  target: 'territory' | 'military' | 'private';
  actor: 'own' | 'sent' | 'support';
  series: boolean;
}

const initial: S = { scale: 'minor', target: 'territory', actor: 'own', series: false };

type Zone = 'inner' | 'edge' | 'band';
type Result = { zone: Zone; verdict: string };

function classify(s: S): Result {
  if (s.actor === 'support')
    return { zone: 'band', verdict: 'Below the armed attack threshold (Nicaragua): providing arms, funds or logistical support to armed groups is not enough — significant involvement, effective control over the operations, is needed. It may still be an unlawful use of force.' };
  if (s.target === 'private')
    return { zone: 'band', verdict: 'Not an armed attack: attacks on private ships do not qualify, unlike attacks on a state’s military vessels (Oil Platforms). Self-defence is not open on this alone.' };
  const who = s.actor === 'sent' ? ' Armed bands sent by a state can carry out an armed attack (Nicaragua).' : '';
  const ship = s.target === 'military' ? ' Attacks on military vessels can constitute an armed attack (Oil Platforms).' : '';
  if (s.scale === 'grave')
    return { zone: 'inner', verdict: `An armed attack: grave in scale and effects, so self-defence is open — subject to necessity, proportionality and reporting.${who}${ship}` };
  if (s.scale === 'significant')
    return { zone: 'edge', verdict: `Arguable: there is no clear benchmark, so argue the scale and effects — casualties, damage to property.${s.target === 'military' ? ' The lecturer noted Oil Platforms suggests even one attack on a military vessel could be enough.' : ''}${who}` };
  if (s.series)
    return { zone: 'edge', verdict: 'Open: each incident alone is below the threshold, but the ICJ has left open that a series of smaller attacks could amount to an armed attack by their cumulative effect.' };
  return { zone: 'band', verdict: 'Below the threshold: a minor frontier incident is a use of force contrary to art 2(4), but not an armed attack (Nicaragua). Self-defence is not open.' };
}

const DOT: Record<Zone, { cy: number; fill: string; word: string }> = {
  inner: { cy: 100, fill: 'var(--sage)', word: 'inside: armed attack' },
  edge: { cy: 60, fill: 'var(--ink-2)', word: 'on the line: arguable' },
  band: { cy: 36, fill: 'var(--clay)', word: 'outer band: use of force only' },
};

function view(s: S): SimView {
  const r = classify(s);
  const d = DOT[r.zone];
  const figure = (
    <div className="xgates">
      <svg viewBox="0 0 320 220" role="img" aria-label={`Nested rings: use of force outside, armed attack inside. The incident sits ${d.word}.`}>
        <circle cx="160" cy="110" r="100" fill="var(--paper)" stroke="var(--ink)" strokeWidth="1.5" />
        <circle cx="160" cy="110" r="50" fill="var(--paper-2)" stroke="var(--ink)" strokeWidth={r.zone === 'edge' ? 2.5 : 1.5} strokeDasharray={r.zone === 'edge' ? '5 4' : undefined} />
        <text x="160" y="190" textAnchor="middle" fontFamily="var(--font-ui)" fontSize="11" letterSpacing="1" fill="var(--ink-2)">USE OF FORCE · ART 2(4)</text>
        <text x="160" y="140" textAnchor="middle" fontFamily="var(--font-ui)" fontSize="11" letterSpacing="1" fill="var(--ink)">ARMED ATTACK</text>
        <text x="160" y="153" textAnchor="middle" fontFamily="var(--font-ui)" fontSize="11" letterSpacing="1" fill="var(--ink)">ART 51</text>
        <circle cx="160" cy={d.cy} r="9" fill={d.fill} stroke="var(--paper)" strokeWidth="2" data-zone={r.zone} style={{ transition: 'fill 180ms var(--ease-out)' }} />
      </svg>
      <div className="xgates__circ">
        <p className="xgates__circ-title">What decides it:</p>
        <ul>
          <li data-on={s.actor !== 'support' ? 'true' : undefined}>{s.actor !== 'support' ? '● ' : '○ '}who acted: {s.actor === 'own' ? 'the state’s own forces' : s.actor === 'sent' ? 'armed bands it sent' : 'others, with its arms or funds'}</li>
          <li data-on={s.target !== 'private' ? 'true' : undefined}>{s.target !== 'private' ? '● ' : '○ '}target: {s.target === 'territory' ? 'territory' : s.target === 'military' ? 'military vessels' : 'private ships'}</li>
          <li data-on={s.scale === 'grave' ? 'true' : undefined}>{s.scale === 'grave' ? '● ' : '○ '}scale and effects: {s.scale}</li>
        </ul>
      </div>
    </div>
  );
  return { figure, verdict: r.verdict, tone: r.zone === 'inner' ? 'yes' : r.zone === 'edge' ? 'open' : 'no' };
}

function describe(a: S, b: S) {
  if (a.scale !== b.scale) return b.scale === 'grave' ? 'Grave scale and effects: heavy casualties or destruction.' : b.scale === 'significant' ? 'Significant scale and effects: some casualties or real damage — no clear benchmark.' : 'Minor: a frontier incident, little or no harm.';
  if (a.target !== b.target) return b.target === 'territory' ? 'Target: the state’s territory.' : b.target === 'military' ? 'Target: the state’s military vessels — can be an armed attack (Oil Platforms).' : 'Target: private ships — not an armed attack (Oil Platforms).';
  if (a.actor !== b.actor) return b.actor === 'own' ? 'The state’s own forces acted.' : b.actor === 'sent' ? 'Armed bands, groups, irregulars or mercenaries sent by the state (Nicaragua).' : 'The state only supplied arms, funds or logistics — below the threshold (Nicaragua).';
  if (a.series !== b.series) return b.series ? 'One of a series of smaller incidents: their cumulative effect is an open question.' : 'A single, isolated incident.';
  return '';
}

export default function ArmedAttack() {
  return (
    <Simulation<S>
      label="The armed attack threshold: an incident placed inside or outside the armed attack ring"
      terms={[
        { term: 'Use of force', def: 'What art 2(4) prohibits — the wider ring.' },
        { term: 'Armed attack', def: 'The art 51 trigger for self-defence: one of the gravest forms of the use of force.' },
        { term: 'Scale and effects', def: 'Casualties, damage to property and so on — the measure of gravity, with no clear benchmark.' },
      ]}
      initial={initial}
      controls={[
        { key: 'scale', label: 'Scale and effects', type: 'select', options: [{ value: 'minor', label: 'Minor (a frontier incident)' }, { value: 'significant', label: 'Significant (some casualties or damage)' }, { value: 'grave', label: 'Grave (heavy casualties or destruction)' }] },
        { key: 'target', label: 'Target', type: 'select', options: [{ value: 'territory', label: 'The state’s territory' }, { value: 'military', label: 'The state’s military vessels' }, { value: 'private', label: 'Private ships' }] },
        { key: 'actor', label: 'Who acted', type: 'select', options: [{ value: 'own', label: 'The other state’s own forces' }, { value: 'sent', label: 'Armed bands that state sent' }, { value: 'support', label: 'Rebels it only armed, funded or supplied' }] },
        { key: 'series', label: 'One of a series of smaller incidents', type: 'toggle' },
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'State P funds, arms and trains rebels who attack State Q’s army. Has P made an armed attack on Q?',
        options: [
          { text: 'Yes — supplying the weapons used is an armed attack by P', why: 'Nicaragua placed the provision of arms, funds or logistical support below the armed attack threshold.' },
          { text: 'Not on that alone — Q must show P’s effective control over the operations', correct: true, why: 'Significant government involvement — effective control over the operations — is needed to meet the art 51 gravity threshold (Nicaragua).' },
          { text: 'No — conduct involving rebels can never be an armed attack', why: 'Armed bands, groups, irregulars or mercenaries sent by a state can carry out an armed attack (Nicaragua).' },
        ],
      }}
    />
  );
}
