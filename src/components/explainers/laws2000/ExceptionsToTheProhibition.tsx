/*
SCENE: Exceptions to the prohibition — a gate (art 2(4)) with three routes past it, and everything else stopped
LENGTH: 5 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: Fix that only Security Council authorisation (art 42) and self-defence (art 51) are exceptions, and that an
  invitation from the government is different: consent means there is no violation at all.
SUBJECT: the spine running down from the gate; each route branches off it in turn.
STEP 1: the gate — art 2(4).
STEP 2: consent — the government's invitation (never an opposition group's: Nicaragua).
STEP 3: Security Council authorisation — art 42, art 24, Chapter VII.
STEP 4: self-defence — art 51, an armed attack, until the Council acts.
STEP 5: dashed box — everything else stops at the gate (humanitarian intervention: no Charter basis).
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: the finished figure with all five captions stacked (base).
BUDGET: < 8 KB gz. Strokes draw (DrawSVG), text fades (base).
Source: concept laws2000-w09-exceptions-to-the-prohibition; Week 9 slides 14–16, 28–29; authorities un-charter-art-42,
  un-charter-art-24, un-charter-art-51; Nicaragua (1986) on requests by an opposition group.
*/
import { Diagram } from '../bases/Diagram';

const ui = { fontFamily: 'var(--font-ui)', fontSize: 12.5, letterSpacing: 1.1, fill: 'var(--ink)' } as const;
const note = { fontFamily: 'var(--font-body)', fontSize: 13.5, fill: 'var(--ink-2)' } as const;
const ink = { fill: 'none', stroke: 'var(--ink)', strokeWidth: 1.5 } as const;

function Route({ y, title, lines, id, from }: { y: number; title: string; lines: string[]; id: string; from: number }) {
  const mid = y + 48;
  return (
    <>
      <line x1="28" y1={from} x2="28" y2={mid} {...ink} />
      <line x1="28" y1={mid} x2="48" y2={mid} {...ink} />
      <rect x="48" y={y} width="304" height="96" rx="10" {...ink} />
      <text x="62" y={y + 26} {...ui} data-label={id}>{title}</text>
      {lines.map((l, i) => <text key={i} x="62" y={y + 50 + i * 20} {...note}>{l}</text>)}
    </>
  );
}

const figure = (
  <svg viewBox="0 0 360 580" role="img" aria-label="Art 2(4) as a gate with three routes past it — consent, Security Council authorisation under art 42, self-defence under art 51 — and every other use of force stopped">
    <g data-step="1">
      <rect x="8" y="10" width="344" height="84" rx="10" fill="var(--paper-2)" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="180" y="38" textAnchor="middle" {...ui} data-label="gate">ART 2(4) · THE PROHIBITION</text>
      <text x="180" y="62" textAnchor="middle" {...note}>no threat or use of force</text>
      <text x="180" y="82" textAnchor="middle" {...note}>in international relations</text>
    </g>
    <g data-step="2">
      <Route id="consent" from={94} y={122} title="CONSENT · INVITATION" lines={['the government asks for help:', 'no violation at all', 'never an opposition group (Nicaragua)']} />
    </g>
    <g data-step="3">
      <Route id="art42" from={170} y={242} title="SECURITY COUNCIL · ART 42" lines={['if art 41 measures are inadequate', 'primary responsibility (art 24)', 'powers in Chapter VII']} />
    </g>
    <g data-step="4">
      <Route id="art51" from={290} y={362} title="SELF-DEFENCE · ART 51" lines={['if an armed attack occurs', 'individual or collective', 'until the Council acts']} />
    </g>
    <g data-step="5">
      <rect x="8" y="486" width="344" height="84" rx="10" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="6 6" />
      <text x="180" y="512" textAnchor="middle" {...ui} data-label="rest">EVERYTHING ELSE STOPS HERE</text>
      <text x="180" y="536" textAnchor="middle" {...note}>e.g. humanitarian intervention:</text>
      <text x="180" y="556" textAnchor="middle" {...note}>no Charter basis — a grey area</text>
    </g>
  </svg>
);

export default function ExceptionsToTheProhibition() {
  return (
    <Diagram
      label="Exceptions to the prohibition on the use of force: consent, Security Council authorisation and self-defence"
      terms={[
        { term: 'Exception', def: 'A Charter route that makes force lawful despite art 2(4): art 42 or art 51.' },
        { term: 'Invitation', def: 'The territorial state’s government consents to force on its territory — no violation at all.' },
        { term: 'Chapter VII', def: 'The Security Council’s powers over threats to the peace, breaches of the peace and acts of aggression.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'Art 2(4) prohibits the threat or use of force in states’ international relations. Every use of force between states starts here, at the gate.' },
        { caption: 'Invitation is not strictly an exception: the government’s consent means there is no violation at all. But in Nicaragua the ICJ said non-intervention would lose its effectiveness if a mere request from an opposition group could justify intervention.' },
        { caption: 'Exception one: if art 41 measures would be or have proved inadequate, the Security Council may take action by air, sea or land forces (art 42). Members confer on it primary responsibility for international peace and security (art 24); its powers are in Chapter VII.' },
        { caption: 'Exception two: the inherent right of individual or collective self-defence if an armed attack occurs (art 51) — to halt the attacks and restore the status quo ante bellum, and only until the Security Council has taken the necessary measures.' },
        { caption: 'Any other force stays behind the gate. Humanitarian intervention, for example, is not addressed in the Charter: it remains a legal grey area.' },
      ]}
      check={{
        question: 'Rebels holding part of State X ask State Z to send troops to help them. X’s government objects. Can Z rely on the rebels’ invitation?',
        options: [
          { text: 'Yes — any invitation from within the state is consent', why: 'Consent must come from the government; Nicaragua rejects requests from an opposition group as a justification.' },
          { text: 'No — an opposition group’s request cannot justify intervention (Nicaragua)', correct: true, why: 'The ICJ said non-intervention would lose its effectiveness if a mere request by an opposition group could justify intervention.' },
          { text: 'Yes — if the rebels control a large part of the territory', why: 'Territorial control by the rebels does not turn their request into the state’s consent; at most it may weaken the government’s own capacity to consent.' },
        ],
      }}
    />
  );
}
