/*
SCENE: Battery — five gates in a row
LENGTH: 5 loci; pinned 300vh on desktop (scroll walks), paced otherwise
BEATS: 5 (one per element; the plaintiff must clear all five)
INTENT: Fix the five elements in order, with the two mark-losers flagged: the fault onus and unlawful touching.
SUBJECT: the amber light standing at the current gate.
BEAT 1: Positive act (Innes v Wylie; Fagan). BEAT 2: Direct. BEAT 3: Intentional or negligent (onus).
BEAT 4: Bodily contact (Binsaris). BEAT 5: Unlawful touching (Rixon).
CAMERA: 35mm-equivalent dolly, yaw ≤ 15°, no cuts. LIGHT: one amber point at the gate. SOUND: none.
REDUCED MOTION: the five gates as a numbered list (no WebGL).
BUDGET: own chunk < 6 KB gz, draw calls < 20, 60 fps at 4× throttle.
Source: concept laws2400-w02-battery; case cards innes-v-wylie, fagan-v-metropolitan-police-commissioner,
  binsaris-v-northern-territory, rixon-v-star-city-pty-ltd.
*/
import { Palace } from '../bases/Palace';

export default function Battery() {
  return (
    <Palace
      label="Five gates of battery: positive act, direct, intentional or negligent, bodily contact, unlawful touching"
      terms={[
        { term: 'Battery', def: 'A direct, intentional or negligent act causing physical contact without consent or lawful justification.' },
        { term: 'Positive act', def: 'Conduct, not a mere omission — standing passively is no battery.' },
        { term: 'Unlawful touching', def: 'Any touching without lawful excuse; it need not be hostile.' },
      ]}
      loci={[
        { title: 'Gate 1 · Positive act', body: 'Trespass cannot generally be committed by omission — standing passively is no battery (Innes v Wylie). But a continuing failure to undo an earlier positive act can count (Fagan).' },
        { title: 'Gate 2 · Direct', body: "The contact must follow directly from the defendant's act." },
        { title: 'Gate 3 · Intentional or negligent', body: 'Fault is intention or negligence. The defendant bears the onus to disprove it, except in highway cases.' },
        { title: 'Gate 4 · Bodily contact', body: "Contact need not be body to body: a weapon, a car or tear gas is enough, so long as it is direct (Binsaris v Northern Territory)." },
        { title: 'Gate 5 · Unlawful touching', body: "Any slight touching without lawful excuse, because every person's body is inviolate (Rixon). Consent, everyday jostling or a tap on the shoulder, and reasonable self-defence are not unlawful." },
      ]}
      check={{
        question: 'D taps P on the shoulder in a crowd to get her attention. Which gate does P fail?',
        options: [
          { text: 'Gate 1 — positive act', why: 'Tapping is a positive, voluntary act; that gate is cleared.' },
          { text: 'Gate 4 — bodily contact', why: 'A tap is physical contact with the body; that gate is cleared.' },
          { text: 'Gate 5 — unlawful touching', correct: true, why: 'A tap to get attention is one of the exigencies of everyday life, so the touching is not unlawful.' },
        ],
      }}
    />
  );
}
