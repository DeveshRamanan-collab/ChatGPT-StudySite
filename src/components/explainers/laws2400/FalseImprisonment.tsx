/*
SCENE: False imprisonment — four gates, the last tested by the exits
LENGTH: 5 loci; pinned 300vh on desktop (scroll walks), paced otherwise
BEATS: 5 (four gates, then the lawful-justification question held apart from "total")
INTENT: Separate "was the restraint total?" (any reasonable escape?) from "was there lawful justification?".
SUBJECT: the amber light standing at the current gate.
BEAT 1: Positive act. BEAT 2: Direct — including directing another (Coles Myer v Webster).
BEAT 3: Intentional or negligent; reasonable mistake is no justification.
BEAT 4: Total restraint — no reasonable means of escape (Bird v Jones); no walls needed.
BEAT 5: Without lawful justification — a condition of entry (Balmain New Ferry v Robertson).
CAMERA: 35mm-equivalent dolly, yaw ≤ 15°, no cuts. LIGHT: one amber point at the gate. SOUND: none.
REDUCED MOTION: the loci as a numbered list (no WebGL).
BUDGET: own chunk < 6 KB gz, draw calls < 20, 60 fps at 4× throttle.
Source: concept laws2400-w02-false-imprisonment; case card balmain-new-ferry-v-robertson.
*/
import { Palace } from '../bases/Palace';

export default function FalseImprisonment() {
  return (
    <Palace
      label="Four gates of false imprisonment, with total restraint tested by whether any reasonable exit exists"
      terms={[
        { term: 'False imprisonment', def: "The direct total restraint of the plaintiff's liberty by an intentional or negligent act, without lawful justification." },
        { term: 'Total restraint', def: 'No reasonable means of escape — walls are not required.' },
        { term: 'Lawful justification', def: 'A valid legal power, or an accepted condition of entry.' },
      ]}
      loci={[
        { title: 'Gate 1 · Positive act', body: 'The defendant must act; the restraint comes from their conduct.' },
        { title: 'Gate 2 · Direct', body: 'Includes a defendant who directs, promotes or causes another person to detain the plaintiff, not only one who detains personally (Coles Myer v Webster).' },
        { title: 'Gate 3 · Intentional or negligent', body: 'An intentional imprisonment can attract liability even where the defendant reasonably but mistakenly believed they were acting lawfully.' },
        { title: 'Gate 4 · Total restraint', body: 'Mental coercion, an assertion of authority or a threat can imprison as well as a locked room; the plaintiff need not know at the time (Meering; Symes v Mahon). Total only if there is no reasonable means of escape (Bird v Jones).' },
        { title: '…without lawful justification', body: 'A condition attached to a lawful entry — paying to leave a wharf — is a lawful excuse and defeats the claim (Balmain New Ferry v Robertson). Ask this separately from "total".' },
      ]}
      check={{
        question: 'P is blocked from going forward but can reasonably leave the way she came. Is the restraint total?',
        options: [
          { text: 'Yes — she was stopped from going where she wanted', why: 'Being stopped in one direction is not enough; restraint is total only with no reasonable means of escape.' },
          { text: 'No — a reasonable means of escape existed', correct: true, why: 'Bird v Jones: where there is a reasonable way out, the restraint is partial, not total.' },
          { text: 'It depends only on whether she knew she was restrained', why: 'Knowledge is not required (Meering); the test for "total" is whether a reasonable exit existed.' },
        ],
      }}
    />
  );
}
