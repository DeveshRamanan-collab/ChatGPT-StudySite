/*
SCENE: Scope of liability — the second gate of causation
LENGTH: 4 screens pinned (desktop, full motion); 4 paced beats otherwise (ScrollExplainer base)
BEATS: 4
INTENT: Show that passing factual causation does not finish causation: a second gate, scope of liability
  (s 5D(1)(b)), has two parts joined by AND, and s 5D(4) frames it with the same responsibility question s 5D(2) asks
  at the first gate.
SUBJECT: the path from the first gate into the second gate and its two parts.
BEAT 1 (0–25%): gate 1, factual causation (s 5D(1)(a)), marked passed; the path leaves it. Fade (opacity), ease none.
BEAT 2 (25–50%): gate 2, scope of liability (s 5D(1)(b)) with its statutory words.
BEAT 3 (50–75%): its two parts draw in, joined by AND: new intervening acts, remoteness; note that Topic 10 only
  introduces them (intervening acts: March v Stramare, McKew) and Topic 11 decides them.
BEAT 4 (75–100%): the s 5D(4) band settles over gate 2; a dashed echo over gate 1 shows s 5D(2) asking the same
  question there, in an exceptional case only.
CAMERA: none (2D SVG; wide and tall variants). LIGHT: none. SOUND: none.
REDUCED MOTION: final frame with all four captions stacked (base); fades only, no positional movement.
BUDGET: < 6 KB gz; no WebGL; 60 fps at 4× throttle.
Source: concept laws2400-w10-scope-of-liability-element; Topic 10 flowchart p 433 (Causation 1); Civil Liability
  Act 2002 (NSW) s 5D(1)(b), (2), (4) (authority civil-liability-act-2002-nsw-s5d). How new intervening acts and
  remoteness are decided is Topic 11's subject, so the parts are shown as headings here.
*/
import { ScrollExplainer } from '../bases/ScrollExplainer';

const head = { fontFamily: 'var(--font-ui)', fontSize: 12.5, letterSpacing: 1, fill: 'var(--ink)' } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 14, fill: 'var(--ink-2)' } as const;
const small = { fontFamily: 'var(--font-ui)', fontSize: 12, fill: 'var(--ink-2)' } as const;
const mono = { fontFamily: 'var(--font-mono)', fontSize: 12.5, fill: 'var(--ink)' } as const;

const show = (t: number, k: number) => k === 0 || t >= k + 0.1;
const fade = (on: boolean) => ({ opacity: on ? 1 : 0, transition: 'opacity var(--dur-ui) var(--ease-out)' });

function wide(t: number) {
  return (
    <svg className="x-wide" viewBox="0 0 780 320" role="img"
      aria-label="Two gates: factual causation, passed, then scope of liability with two parts, new intervening acts and remoteness; section 5D(4) asks whether and why responsibility should be imposed">
      <g style={fade(show(t, 0))} data-beat="1">
        <rect x="20" y="120" width="180" height="84" rx="12" fill="none" stroke="var(--sage)" strokeWidth="2" />
        <text x="110" y="148" textAnchor="middle" {...head}>FACTUAL CAUSATION</text>
        <text x="110" y="170" textAnchor="middle" {...mono}>s 5D(1)(a)</text>
        <text x="110" y="191" textAnchor="middle" {...small}>passed</text>
        <line x1="200" y1="162" x2="250" y2="162" stroke="var(--ink)" strokeWidth="2" />
        <path d="M242 156 L250 162 L242 168" fill="none" stroke="var(--ink)" strokeWidth="2" />
      </g>
      <g style={fade(show(t, 1))} data-beat="2">
        <rect x="250" y="110" width="220" height="104" rx="12" fill="none" stroke="var(--ink)" strokeWidth="2" />
        <text x="360" y="136" textAnchor="middle" {...head}>SCOPE OF LIABILITY</text>
        <text x="360" y="156" textAnchor="middle" {...mono}>s 5D(1)(b)</text>
        <text x="360" y="180" textAnchor="middle" {...body}>appropriate for liability to</text>
        <text x="360" y="199" textAnchor="middle" {...body}>extend to the harm so caused?</text>
      </g>
      <g style={fade(show(t, 2))} data-beat="3">
        <path d="M470 162 H500 M500 125 V200 M500 125 H530 M500 200 H530" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
        <rect x="530" y="100" width="230" height="50" rx="10" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
        <text x="645" y="130" textAnchor="middle" {...body} fill="var(--ink)">new intervening acts</text>
        <text x="645" y="168" textAnchor="middle" {...head} fontSize="11.5">AND</text>
        <rect x="530" y="176" width="230" height="50" rx="10" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
        <text x="645" y="206" textAnchor="middle" {...body} fill="var(--ink)">remoteness</text>
        <text x="645" y="252" textAnchor="middle" {...small}>introduced in Topic 10 · decided in Topic 11</text>
      </g>
      <g style={fade(show(t, 3))} data-beat="4">
        <rect x="250" y="16" width="510" height="62" rx="12" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
        <text x="505" y="40" textAnchor="middle" {...mono}>s 5D(4)</text>
        <text x="505" y="63" textAnchor="middle" {...body} fill="var(--ink)">whether or not and why responsibility should be imposed</text>
        <line x1="360" y1="78" x2="360" y2="110" stroke="var(--ink-3)" strokeWidth="1.5" />
        <rect x="20" y="16" width="180" height="62" rx="12" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="5 5" />
        <text x="110" y="40" textAnchor="middle" {...mono} fill="var(--ink-2)">s 5D(2)</text>
        <text x="110" y="62" textAnchor="middle" {...small}>same question, exceptional case</text>
        <line x1="110" y1="78" x2="110" y2="120" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="4 4" />
        <text x="390" y="300" textAnchor="middle" {...small}>same question, different stage: s 5D(2) at factual causation · s 5D(4) at scope of liability</text>
      </g>
    </svg>
  );
}

function tall(t: number) {
  return (
    <svg className="x-tall" viewBox="0 0 360 600" role="img"
      aria-label="Factual causation, passed, leads to scope of liability, which has two parts, new intervening acts and remoteness; section 5D(4) asks whether and why responsibility should be imposed">
      <g style={fade(show(t, 0))} data-beat="1">
        <rect x="70" y="10" width="220" height="74" rx="12" fill="none" stroke="var(--sage)" strokeWidth="2" />
        <text x="180" y="36" textAnchor="middle" {...head}>FACTUAL CAUSATION</text>
        <text x="180" y="56" textAnchor="middle" {...mono}>s 5D(1)(a)</text>
        <text x="180" y="75" textAnchor="middle" {...small}>passed</text>
        <line x1="180" y1="84" x2="180" y2="114" stroke="var(--ink)" strokeWidth="2" />
        <path d="M174 106 L180 114 L186 106" fill="none" stroke="var(--ink)" strokeWidth="2" />
      </g>
      <g style={fade(show(t, 1))} data-beat="2">
        <rect x="20" y="114" width="320" height="104" rx="12" fill="none" stroke="var(--ink)" strokeWidth="2" />
        <text x="180" y="140" textAnchor="middle" {...head}>SCOPE OF LIABILITY</text>
        <text x="180" y="160" textAnchor="middle" {...mono}>s 5D(1)(b)</text>
        <text x="180" y="184" textAnchor="middle" {...body}>appropriate for liability to</text>
        <text x="180" y="203" textAnchor="middle" {...body}>extend to the harm so caused?</text>
      </g>
      <g style={fade(show(t, 2))} data-beat="3">
        <path d="M180 218 V236 M95 236 H265 M95 236 V252 M265 236 V252" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
        <rect x="20" y="252" width="150" height="58" rx="10" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
        <text x="95" y="277" textAnchor="middle" {...body} fill="var(--ink)">new intervening</text>
        <text x="95" y="296" textAnchor="middle" {...body} fill="var(--ink)">acts</text>
        <text x="180" y="285" textAnchor="middle" {...head} fontSize="11">AND</text>
        <rect x="190" y="252" width="150" height="58" rx="10" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
        <text x="265" y="286" textAnchor="middle" {...body} fill="var(--ink)">remoteness</text>
        <text x="180" y="334" textAnchor="middle" {...small}>introduced in Topic 10 · decided in Topic 11</text>
      </g>
      <g style={fade(show(t, 3))} data-beat="4">
        <rect x="20" y="356" width="320" height="76" rx="12" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
        <text x="180" y="380" textAnchor="middle" {...mono}>s 5D(4)</text>
        <text x="180" y="402" textAnchor="middle" {...body} fill="var(--ink)">whether or not and why responsibility</text>
        <text x="180" y="421" textAnchor="middle" {...body} fill="var(--ink)">should be imposed</text>
        <rect x="20" y="452" width="320" height="76" rx="12" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="5 5" />
        <text x="180" y="476" textAnchor="middle" {...mono} fill="var(--ink-2)">s 5D(2)</text>
        <text x="180" y="498" textAnchor="middle" {...small}>asks the same question at factual causation,</text>
        <text x="180" y="516" textAnchor="middle" {...small}>in an exceptional case only</text>
        <text x="180" y="560" textAnchor="middle" {...small}>same question, different stage</text>
      </g>
    </svg>
  );
}

function scene(t: number) {
  return <>{wide(t)}{tall(t)}</>;
}

export default function ScopeOfLiabilityElement() {
  return (
    <ScrollExplainer
      label="Scope of liability: the second gate of causation"
      terms={[
        { term: 'Factual causation', def: 'The first element: the negligence was a necessary condition of the harm (s 5D(1)(a)).' },
        { term: 'Scope of liability', def: 'The second element: is it appropriate for liability to extend to the harm so caused? (s 5D(1)(b)).' },
        { term: 'Responsibility question', def: 'Whether or not and why responsibility for the harm should be imposed on the negligent party.' },
      ]}
      beats={[
        { caption: 'Factual causation is the first gate (s 5D(1)(a)). Passing it does not finish causation — both branches of the flowchart must be satisfied.' },
        { caption: 'The second gate is scope of liability (s 5D(1)(b)): is it appropriate for the scope of the negligent person’s liability to extend to the harm so caused?' },
        { caption: 'The flowchart splits scope of liability into two parts joined by AND: new intervening acts, and remoteness. Topic 10 introduces intervening acts (a later event can break the chain — McKew — but not always — March v Stramare); Topic 11 decides both parts.' },
        { caption: 'Section 5D(4) tells the court to consider whether or not and why responsibility should be imposed — the same question s 5D(2) asks at the first gate, in an exceptional case. Same question, different stage.' },
      ]}
      scene={scene}
      check={{
        question: 'Section 5D(2) and s 5D(4) both ask whether and why responsibility should be imposed. Where does s 5D(4) ask it?',
        options: [
          { text: 'When determining scope of liability', correct: true, why: 's 5D(4) applies “for the purpose of determining the scope of liability” — the second element, s 5D(1)(b).' },
          { text: 'When deciding factual causation in an exceptional case', why: 'That is s 5D(2), which asks the question at the first gate, where necessary condition cannot be established.' },
          { text: 'When deciding whether there was a breach of duty', why: 'Neither subsection is about breach; both sit in the causation division of the Act (s 5D).' },
        ],
      }}
    />
  );
}
