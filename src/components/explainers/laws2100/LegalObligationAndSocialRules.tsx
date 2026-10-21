/*
SCENE: Legal obligation — the same demand seen from outside and from inside
LENGTH: 4 screens pinned (desktop, full motion); 4 paced beats otherwise
BEATS: 4
INTENT: The gunman and the tax officer make the same demand; from outside only patterns show; from the participants'
  view the social rule appears (criticism, the rule as reason, a critical reflective attitude) — and "obliged"
  separates from "has an obligation".
SUBJECT: the two words under the figures, together at first, pulled apart at the end.
BEAT 1 (0–25%): two identical demands; the words sit together in the middle.
BEAT 2 (25–50%): external view — a queue of dots, only a pattern.
BEAT 3 (50–75%): internal view — the queue-jumper is criticised; the three marks of a social rule appear.
BEAT 4 (75–100%): the words slide apart (translate, scrubbed, ease none): gunman → obliged; tax officer → obligation.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: final frame with all four captions stacked (base).
BUDGET: < 6 KB gz. Transform and opacity only.
Source: concept laws2100-w03-legal-obligation-and-social-rules; authority hart-the-concept-of-law.
*/
import { ScrollExplainer } from '../bases/ScrollExplainer';

const W = 360;
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const head = { fontFamily: 'var(--font-ui)', fontSize: 12, letterSpacing: 1.2, fill: 'var(--ink)' } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 14, fill: 'var(--ink-2)' } as const;
const MARKS = ['deviation is met with criticism', 'the rule is the reason to criticise', 'a critical reflective attitude'];

function scene(t: number) {
  const on = (i: number) => clamp((t - i) * 3 + 0.25);
  const split = clamp((t - 3) * 1.5);
  const jump = clamp((t - 2) * 2);
  return (
    <svg viewBox={`0 0 ${W} 420`} role="img" aria-label="The gunman and the tax officer make the same demand; from inside, a social rule appears and obliged separates from obligation">
      {[{ x: 90, who: 'GUNMAN' }, { x: 270, who: 'TAX OFFICER' }].map((f) => (
        <g key={f.who}>
          <text x={f.x} y="20" textAnchor="middle" {...head}>{f.who}</text>
          <circle cx={f.x} cy="44" r="9" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
          <line x1={f.x} y1="54" x2={f.x} y2="84" stroke="var(--ink-3)" strokeWidth="1.5" />
          <text x={f.x + 8} y="74" {...body} fontSize={12}>pay</text>
          <circle cx={f.x} cy="94" r="7" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
        </g>
      ))}
      <text x={W / 2} y="134" textAnchor="middle" {...body} fill="var(--ink)" transform={`translate(${-90 * split} 0)`}>obliged</text>
      <text x={W / 2} y="154" textAnchor="middle" {...body} fill="var(--ink)" opacity={1 - split}>= an obligation?</text>
      <text x={W / 2} y="134" textAnchor="middle" {...body} fill="var(--ink)" opacity={split} transform={`translate(${90 * split} 0)`}>has an obligation</text>
      <g opacity={on(1)}>
        <text x="20" y="190" {...head} fontSize={11} fill="var(--ink-2)">OUTSIDE · ALIEN, FIRST-TIME SPECTATOR</text>
        {[0, 1, 2, 3, 4, 5, 6].map((k) => <circle key={k} cx={40 + k * 34} cy="226" r="6" fill="none" stroke="var(--ink)" strokeWidth="1.5" />)}
        <circle cx="0" cy="0" r="6" fill="var(--ink-2)" transform={`translate(${300 - jump * 243} ${226 - jump * 14})`} />
        <text x="20" y="258" {...body} fontSize={12}>only a pattern of behaviour</text>
      </g>
      <g opacity={on(2)}>
        <text x="20" y="294" {...head} fontSize={11} fill="var(--ink-2)">INSIDE · THE PARTICIPANTS</text>
        {MARKS.map((m, i) => (
          <g key={m}>
            <line x1="24" y1={314 + i * 26} x2="34" y2={314 + i * 26} stroke="var(--ink)" strokeWidth="1.5" />
            <text x="44" y={319 + i * 26} {...body} fill="var(--ink)">{m}</text>
          </g>
        ))}
        <text x="20" y="404" {...body} fontSize={12}>not feelings of compulsion; not a prediction</text>
      </g>
    </svg>
  );
}

export default function LegalObligationAndSocialRules() {
  return (
    <ScrollExplainer
      label="Legal obligation and the internal aspect of rules: the gunman and the tax officer"
      terms={[
        { term: 'Social rule', def: 'Convergent behaviour plus criticism of deviation, the rule as a good reason for criticism, and an internal aspect.' },
        { term: 'Internal point of view', def: "The participants' view — those who buy into the rules. You can understand it while only watching." },
        { term: 'External point of view', def: 'The observer who only registers patterns of behaviour.' },
      ]}
      beats={[
        { caption: 'Where there is law, conduct is made "in some sense non-optional or obligatory" (CL 82). Factually, the gunman and the tax officer look alike.' },
        { caption: 'From the external point of view you only register patterns of behaviour.' },
        { caption: 'Inside, the queue-jumper is criticised, the rule is cited as the reason, and there is "a critical reflective attitude to certain patterns of behaviour as a common standard" (CL 57) — not feelings of compulsion, not a prediction.' },
        { caption: '"Obliged" separates from "had an obligation" (CL 82): the gunman\'s victim is only obliged; a tax evader is still under an obligation.' },
      ]}
      scene={scene}
      check={{
        question: 'On Hart\'s account, what is the internal aspect of a rule?',
        options: [
          { text: 'A feeling of compulsion to conform', why: "Hart rejects this — it was his criticism of Scandinavian realism." },
          { text: 'A prediction that deviation will be punished', why: 'A prediction of consequences is what an observer could make; the internal aspect is not that.' },
          { text: 'A critical reflective attitude to a pattern of behaviour as a common standard', correct: true, why: 'That is Hart\'s phrase (CL 57): the participants treat the pattern as a standard for criticism and action.' },
        ],
      }}
    />
  );
}
