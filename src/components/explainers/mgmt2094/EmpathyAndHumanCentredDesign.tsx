/*
SCENE: Empathy in human-centred design — an observer, a user, two kinds of empathy and four filters in between
LENGTH: 5 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
BEATS: 5
INTENT: Human-centred design needs the observer to reach the user's unarticulated needs: affective empathy only mirrors
  a feeling; cognitive empathy (perspective taking) crosses into the user's world — unless one of four roadblocks bends
  the line; Temple Grandin shows what unprejudiced observation finds.
SUBJECT: the line of sight from observer to user.
STEP 1: observer and user (unarticulated needs). STEP 2: affective empathy — a mirrored circle beside the observer.
STEP 3: cognitive empathy — the line of sight crosses to the user. STEP 4: the four roadblocks as bars across the line.
STEP 5: Grandin — a straight path (panic) against a curved corral (calm).
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: the finished diagram with all five captions stacked (base).
BUDGET: < 8 KB gz (DrawSVG is in the shared motion chunk). Vertical 360-unit canvas so text stays legible on phones.
Source: concept mgmt2094-w03-empathy-and-human-centred-design; authorities mgmt2094-reading-mitchem-empathy,
  mgmt2094-example-temple-grandin (Week 3 reading pp 19–20).
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const X = 56;
const head = { fontFamily: 'var(--font-ui)', fontSize: 12, letterSpacing: 1.2, fill: 'var(--ink-2)' } as const;
const body = { fontFamily: 'var(--font-ui)', fontSize: 13, fill: 'var(--ink)' } as const;

const ROADBLOCKS: [string, string, number][] = [
  ['idealism', 'as we expect it to be', 236],
  ['egoism', 'as we want it to be', 284],
  ['realism', 'as we think it is', 332],
  ['circumstantialism', 'only what we can see', 380],
];

const figure = (
  <svg viewBox={`0 0 ${W} 640`} role="img" aria-label="An observer and a user joined by a line of sight; affective empathy mirrors, cognitive empathy crosses over; four roadblocks bend the line; Temple Grandin's curved corral">
    <g data-step="1">
      <circle cx={X} cy="40" r="18" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="128" y="36" {...head} data-label="observer">OBSERVER</text>
      <text x="128" y="54" {...body} fill="var(--ink-2)">designer, marketer, team</text>
      <circle cx={X} cy="450" r="18" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="128" y="446" {...head} data-label="user">USER</text>
      <text x="128" y="464" {...body} fill="var(--ink-2)">unarticulated needs</text>
    </g>
    <g data-step="2">
      <circle cx={X + 44} cy="40" r="18" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="4 4" />
      <text x="128" y="96" {...head} data-label="affective">AFFECTIVE EMPATHY</text>
      <text x="128" y="114" {...body}>a shared, mirrored emotion —</text>
      <text x="128" y="130" {...body}>you see someone sad, you feel sad</text>
    </g>
    <g data-step="3">
      <line x1={X} y1="58" x2={X} y2="432" stroke="var(--ink)" strokeWidth="1.5" />
      <path d={`M${X - 6} 422 L${X} 432 L${X + 6} 422`} fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="128" y="164" {...head} data-label="cognitive">COGNITIVE EMPATHY</text>
      <text x="128" y="182" {...body}>perspective taking: stepping</text>
      <text x="128" y="198" {...body}>into their worldview and fears</text>
    </g>
    <g data-step="4">
      {ROADBLOCKS.map(([name, gloss, y]) => (
        <g key={name}>
          <line x1={X - 22} y1={y} x2={X + 22} y2={y} stroke="var(--ink-2)" strokeWidth="3" />
          <text x="128" y={y - 3} {...body} data-label={name}>{name}</text>
          <text x="128" y={y + 13} {...body} fill="var(--ink-2)">{gloss}</text>
        </g>
      ))}
    </g>
    <g data-step="5">
      <text x="16" y="512" {...head} data-label="grandin">TEMPLE GRANDIN</text>
      <line x1="16" y1="546" x2="168" y2="546" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="6 6" />
      <text x="16" y="570" {...body} fill="var(--ink-2)">straight path: stress, panic</text>
      <path d="M192 546 C 240 506, 300 586, 344 546" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="192" y="590" {...body}>curved corral: calmer</text>
      <text x="16" y="622" {...body} fill="var(--ink-2)">seen by observing behaviour without assumptions</text>
    </g>
  </svg>
);

export default function EmpathyAndHumanCentredDesign() {
  return (
    <Diagram
      label="Empathy in human-centred design: from observer to user"
      terms={[
        { term: 'Unarticulated needs', def: 'Needs users have but do not say — or may not recognise themselves.' },
        { term: 'Affective empathy', def: 'A shared, mirrored emotion.' },
        { term: 'Cognitive empathy', def: 'Perspective taking: understanding another person’s worldview, beliefs and fears.' },
        { term: 'Roadblocks to empathy', def: 'Idealism, egoism, realism and circumstantialism — ways observers fall back on assumptions.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'Human-centred design starts with the user: a deep understanding of their unarticulated needs, gained through empathy, inspires creativity and innovation.' },
        { caption: 'Affective empathy mirrors a feeling: you see someone sad and you feel sad. It stays on the observer’s side of the line.' },
        { caption: 'Cognitive empathy is perspective taking: stepping into the user’s world — the kind design needs. Empathetic design observes users in their environments: closer to anthropology than market science.' },
        { caption: 'Four roadblocks bend the line: idealism (as we expect), egoism (as we want), realism (we think we see things as they are), circumstantialism (only what we see). Set your beliefs aside; ask the stupid questions.' },
        { caption: 'Temple Grandin watched livestock without assuming “that’s just what cows do”, saw that straight paths caused stress and panic, and designed curved corrals.' },
      ]}
      check={{
        question: 'A manager insists he “sees things as they are”; told he misread his customers, he blames something in the scene. Which roadblock is this?',
        options: [
          { text: 'Idealism', why: 'Idealism is seeing things as we expect them to be; the mark here is claiming to see things as they are.' },
          { text: 'Realism', correct: true, why: 'Realism: people think they see things as they are, and when wrong they blame the scene rather than their own expectations.' },
          { text: 'Circumstantialism', why: 'Circumstantialism is thinking only about what is visible; this manager is misattributing his own error.' },
        ],
      }}
    />
  );
}
