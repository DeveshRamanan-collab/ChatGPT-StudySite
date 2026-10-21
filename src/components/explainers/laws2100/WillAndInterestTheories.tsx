/*
SCENE: Human rights are rights — one entitlement tested by two theories of what a right is, then by universality
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → change the holder (adult party / infant), whether they control the duty, whether it protects an
  important interest, and how far it reaches → two lamps (will theory, interest theory) and a universality tag → check
INTENT: The will theory makes control or choice (autonomy) the mark of a right, the interest theory an important
  interest (welfare); the infant is the will theory's hard case, and universality separates human rights from rights
  we create by contract.
SUBJECT: the two lamps, lit or unlit.
BEAT 1 (0–100%): each control relights the lamps (opacity 180ms ease-out) and moves the reach marker (transform);
  verdict within 200ms.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: identical controls; the 180ms fades and glide are the only motion.
BUDGET: < 5 KB gz, no WebGL.
Source: concept laws2100-w09-will-and-interest-theories; authority universal-declaration-of-human-rights-1948.
*/
import { Simulation, type SimView } from '../bases/Simulation';

interface S extends Record<string, unknown> {
  holder: string;
  choice: boolean;
  interest: boolean;
  reach: string;
}

const initial: S = { holder: 'adult', choice: true, interest: true, reach: 'parties' };
const W = 360;
const head = { fontFamily: 'var(--font-ui)', fontSize: 11, letterSpacing: 1.2, fill: 'var(--ink-2)' } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 13, fill: 'var(--ink)' } as const;
const fade = { transition: 'opacity 180ms var(--ease-out)' } as const;
const glide = { transition: 'transform 180ms var(--ease-out)' } as const;

function lamp(x: number, on: boolean, title: string, value: string, note: string) {
  return (
    <g>
      <text x={x} y="24" textAnchor="middle" {...head}>{title}</text>
      <text x={x} y="42" textAnchor="middle" {...body} fontSize={12} fill="var(--ink-2)">{value}</text>
      <circle cx={x} cy="86" r="26" fill="none" stroke="var(--ink-2)" strokeWidth="1.5" />
      <circle cx={x} cy="86" r="18" fill="var(--ink)" style={{ ...fade, opacity: on ? 1 : 0 }} />
      <text x={x} y="134" textAnchor="middle" {...body}>{on ? 'a right' : 'no right'}</text>
      <text x={x} y="152" textAnchor="middle" {...body} fontSize={11} fill="var(--ink-2)">{note}</text>
    </g>
  );
}

function view(s: S): SimView {
  const infant = s.holder === 'infant';
  const canChoose = s.choice && !infant;
  const will = canChoose;
  const interest = s.interest;
  const universal = s.reach === 'everyone';
  const figure = (
    <svg viewBox={`0 0 ${W} 250`} role="img" aria-label={`Will theory: ${will ? 'a right' : 'no right'}. Interest theory: ${interest ? 'a right' : 'no right'}. Reach: ${universal ? 'every human being' : 'the parties only'}.`}>
      {lamp(92, will, 'WILL THEORY', 'control or choice', infant ? 'an infant cannot choose' : s.choice ? 'holder controls the duty' : 'holder has no say')}
      {lamp(268, interest, 'INTEREST THEORY', 'important interest', interest ? 'protects well-being' : 'no important interest')}
      <line x1="180" y1="16" x2="180" y2="160" stroke="var(--line)" strokeWidth="1" />
      <text x="24" y="192" {...head}>REACH</text>
      <line x1="24" y1="214" x2="336" y2="214" stroke="var(--ink-3)" strokeWidth="1.5" />
      <text x="24" y="238" {...body} fontSize={11} fill="var(--ink-2)">the parties only</text>
      <text x="336" y="238" textAnchor="end" {...body} fontSize={11} fill="var(--ink-2)">every human being</text>
      <g style={{ ...glide, transform: `translateX(${universal ? 300 : 0}px)` }}>
        <circle cx="30" cy="214" r="7" fill="var(--ink)" />
      </g>
    </svg>
  );
  let verdict: string;
  let tone: SimView['tone'];
  if (infant && interest && !will) {
    verdict = 'The lecture\'s objection: an infant cannot exercise choice, so the will theory finds no right — does the infant have no rights? The interest theory finds one, grounded in welfare.';
    tone = 'open';
  } else if (will && interest) {
    verdict = universal
      ? 'Both theories find a right, and it claims to apply to every human being: a candidate human right (plural, universal, high-priority).'
      : 'Both theories find a right. But it binds only the parties, like a contract, so it is not a human right: human rights claim to be universal.';
    tone = universal ? 'yes' : 'open';
  } else if (will || interest) {
    verdict = will
      ? 'The will theory finds a right (the holder controls whether others must act); the interest theory does not, as no important interest is protected.'
      : 'The interest theory finds a right (an important interest is protected); the will theory does not, as the holder has no control or choice.';
    tone = 'open';
  } else {
    verdict = 'Neither theory finds a right: no control or choice, and no important interest protected.';
    tone = 'no';
  }
  return { figure, verdict, tone };
}

function describe(a: S, b: S) {
  if (a.holder !== b.holder) return b.holder === 'infant' ? 'The holder is now an infant, who cannot exercise choice in the way adults can.' : 'The holder is now an adult party to a contract, able to insist on or release the duty.';
  if (a.choice !== b.choice) return b.choice ? 'The holder can now insist on the duty or release it: control or choice (autonomy).' : 'The holder no longer has any say over whether others must act.';
  if (a.interest !== b.interest) return b.interest ? 'The duty now protects an important interest of the holder: well-being (welfare).' : 'The duty no longer protects any important interest of the holder.';
  return b.reach === 'everyone' ? 'The entitlement now claims to apply to each and every human being: universality.' : 'The entitlement now binds only the parties, as a contract does.';
}

export default function WillAndInterestTheories() {
  return (
    <Simulation<S>
      label="One entitlement tested by the will theory and the interest theory of rights, and by universality"
      terms={[
        { term: 'Will theory', def: 'A right is control or choice over whether others must or must not act; rights are tools of free will (autonomy).' },
        { term: 'Interest theory', def: 'A right serves to protect an important interest; rights promote or safeguard well-being (welfare).' },
        { term: 'Universal', def: 'Applying to each and every human being, unlike a contract, which binds only its parties.' },
      ]}
      initial={initial}
      controls={[
        { key: 'holder', label: 'Who holds it?', type: 'select', options: [{ value: 'adult', label: 'An adult party to a contract' }, { value: 'infant', label: 'An infant' }] },
        { key: 'choice', label: 'The holder can insist on the duty or release it', type: 'toggle' },
        { key: 'interest', label: 'The duty protects an important interest of the holder', type: 'toggle' },
        { key: 'reach', label: 'How far does it reach?', type: 'select', options: [{ value: 'parties', label: 'Only the parties to the contract' }, { value: 'everyone', label: 'Every human being' }] },
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'Which theory struggles to explain why an infant has rights?',
        options: [
          { text: 'The will theory', correct: true, why: 'It ties rights to control or choice, and an infant cannot exercise choice as adults can: the lecture\'s objection.' },
          { text: 'The interest theory', why: 'The interest theory grounds rights in protecting important interests (welfare), so it explains an infant\'s rights easily.' },
          { text: 'Neither theory', why: 'Only the interest theory copes easily; the will theory\'s focus on control is exactly what the infant example tests.' },
        ],
      }}
    />
  );
}
