/*
SCENE: Implied licence to enter — a decision flow from the front path to the entrant's purpose
LENGTH: 4 screens pinned (desktop, full motion); 4 paced beats otherwise
BEATS: 4
INTENT: An open path carries a narrow, purpose-specific licence for lawful communication; test the entrant's actual
  purpose(s) against it, and whether a sign, lock, revocation or later conduct took them outside.
SUBJECT: the flow, one box lighting at a time.
BEAT 1 (0–25%): the licence exists — unlocked, unobstructed path, no sign (Halliday v Nevill). Ease none (scrubbed).
BEAT 2 (25–50%): purposes outside it — breath test (Munnings v Barrett), summons (Plenty v Dillon) → trespass.
BEAT 3 (50–75%): a mixed purpose does not defeat it (Roy v O'Neill).
BEAT 4 (75–100%): when the entrant becomes a trespasser — sole purpose outside, revoked and remains, inconsistent act.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: final frame with all four captions stacked (base).
BUDGET: < 6 KB gz. Opacity only.
Source: concept laws2400-w03-implied-licence; case cards halliday-v-nevill, munnings-v-barrett, plenty-v-dillon,
  roy-v-oneill.
*/
import { ScrollExplainer } from '../bases/ScrollExplainer';

const W = 360;
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const head = { fontFamily: 'var(--font-ui)', fontSize: 12.5, letterSpacing: 1.5, fill: 'var(--ink)' } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 14, fill: 'var(--ink-2)' } as const;

const BOXES = [
  { title: 'OPEN PATH, NO LOCK, NO SIGN', lines: ['→ licence to approach and knock', 'for lawful communication (Halliday)'] },
  { title: 'PURPOSE OUTSIDE IT → TRESPASS', lines: ['breath-testing the occupier (Munnings)', 'serving a summons (Plenty v Dillon)'] },
  { title: 'MIXED PURPOSE → STILL LICENSED', lines: ['welfare check + checking a DVO:', 'the extra purpose does not negate it (Roy)'] },
  { title: 'TRESPASSER ONLY IF', lines: ['sole purpose is outside the licence,', 'or it is revoked and they remain,', 'or they act inconsistently with it'] },
];

function scene(t: number) {
  let y = 8;
  return (
    <svg viewBox={`0 0 ${W} 470`} role="img" aria-label="Decision flow: open path gives a licence; does the entrant's purpose fit, or has the licence been revoked or exceeded?">
      {BOXES.map((b, i) => {
        const h = 40 + b.lines.length * 20;
        const top = y;
        y += h + 30;
        const on = clamp((t - i) * 3 + 0.25);
        const now = Math.min(3, Math.floor(t + 1e-6)) === i;
        return (
          <g key={b.title} opacity={on}>
            <rect x="8" y={top} width={W - 16} height={h} rx="12" fill="none" stroke={now ? 'var(--ink)' : 'var(--ink-3)'} strokeWidth="1.5" strokeDasharray={i === 3 ? '6 6' : undefined} />
            <text x="24" y={top + 26} {...head}>{b.title}</text>
            {b.lines.map((l, k) => <text key={k} x="24" y={top + 50 + k * 20} {...body}>{l}</text>)}
            {i < 3 && <path d={`M${W / 2} ${top + h + 4} v20 M${W / 2 - 5} ${top + h + 19} l5 5 l5 -5`} fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />}
          </g>
        );
      })}
    </svg>
  );
}

export default function ImpliedLicence() {
  return (
    <ScrollExplainer
      label="Implied licence to enter: a decision flow"
      terms={[
        { term: 'Implied licence', def: 'Permission, not spoken, for any member of the public on lawful business to approach the front door and knock.' },
        { term: 'Lawful communication', def: 'Genuine business with the occupier — the purpose the licence covers.' },
        { term: 'Revocation', def: 'The occupier withdrawing the licence; remaining afterwards is trespass.' },
      ]}
      beats={[
        { caption: 'An unlocked, unobstructed path with no sign carries an implied licence to approach and knock. In Halliday v Nevill a police officer could enter an open driveway to arrest a disqualified driver.' },
        { caption: 'The licence is narrow. Breath-testing the occupier (Munnings v Barrett) or serving a summons (Plenty v Dillon) falls outside lawful communication, so entering for it is trespass.' },
        { caption: 'A mixed purpose is not fatal. In Roy v O’Neill, police checking on a protected occupant’s welfare were licensed; also having DVO compliance in mind did not negate it.' },
        { caption: 'An entrant becomes a trespasser only if their sole purpose is outside the licence, the licence is revoked and they remain, or they act inconsistently with it.' },
      ]}
      scene={scene}
      check={{
        question: 'An officer walks up an open driveway solely to serve a summons on the occupier. Is she a trespasser?',
        options: [
          { text: 'No — anyone may use an open driveway', why: 'The licence covers lawful communication only; it is purpose-specific.' },
          { text: 'Yes — serving a summons falls outside the licence', correct: true, why: 'Plenty v Dillon: entering solely to serve a summons is outside the implied licence, so it is trespass.' },
          { text: 'No — police always have a licence to enter', why: 'Police have the same implied licence as anyone else, limited to its purpose.' },
        ],
      }}
    />
  );
}
