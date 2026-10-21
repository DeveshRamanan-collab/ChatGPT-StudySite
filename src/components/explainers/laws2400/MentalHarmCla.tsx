/*
SCENE: Mental harm under the Civil Liability Act 2002 (NSW), Part 3
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → change the facts → watch the three gates → one check
INTENT: Show that a NSW mental-harm claim passes three statutory gates in order — s 32 (duty), s 31 (recognised
  psychiatric illness, pure harm only), s 30(2) (scene-witness or close family, pure harm from shock only).
SUBJECT: the path line through the three gates; it turns clay at the first gate that stops the claim.
BEAT 1 (0–100%): toggles for the facts; the four s 32(2) circumstances light as "present"; the verdict line updates
  within 200ms with the section that decides it. Ease: CSS 180ms ease-out on colour only.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: identical (no motion beyond colour); off mode shows the same controls.
BUDGET: < 10 KB gz, no WebGL.
Source: CLA ss 27, 30, 31, 32 (text in src/content/authorities/civil-liability-act-2002-nsw-s3*.md, from the Act in
raw/laws2400-torts/unit-wide); order of analysis per Wicks v State Rail Authority (NSW) (week 6 notes).
The simulation does NOT decide foreseeability: s 32 is an evaluative judgement "having regard to" the circumstances,
so the learner records the court's finding as a toggle.
*/
import { Simulation, type SimView } from '../bases/Simulation';

interface S extends Record<string, unknown> {
  harm: 'pure' | 'consequential';
  shock: boolean;
  witnessed: boolean;
  relationship: 'close-family' | 'other' | 'none';
  preExisting: boolean;
  foreseeable: boolean;
  illness: boolean;
}

const initial: S = { harm: 'pure', shock: true, witnessed: false, relationship: 'other', preExisting: false, foreseeable: true, illness: true };

type Gate = { id: 's32' | 's31' | 's30'; label: string; sub: string; applies: boolean; pass: boolean };

function gates(s: S): Gate[] {
  const pure = s.harm === 'pure';
  return [
    { id: 's32', label: 's 32', sub: 'duty: foreseeable to a person of normal fortitude', applies: true, pass: s.foreseeable },
    { id: 's31', label: 's 31', sub: 'recognised psychiatric illness', applies: pure, pass: s.illness },
    { id: 's30', label: 's 30(2)', sub: 'scene witness or close family', applies: pure && s.shock, pass: s.witnessed || s.relationship === 'close-family' },
  ];
}

function view(s: S): SimView {
  const gs = gates(s);
  const stop = gs.find((g) => g.applies && !g.pass);
  const circumstances = [
    { k: '(a) sudden shock', on: s.shock },
    { k: '(b) witnessed at the scene', on: s.witnessed },
    { k: '(c) relationship to the victim', on: s.relationship !== 'none' },
    { k: '(d) pre-existing relationship with the defendant', on: s.preExisting },
  ];
  let reached = true;
  // HTML, not SVG: a row of gates on wide screens, a column on narrow ones, so the text stays legible at any width.
  const figure = (
    <div className="xgates" role="group" aria-label="Three gates in order: section 32, section 31, section 30(2)">
      <ol className="xgates__row">
        {gs.map((g) => {
          const lit = reached;
          const blocked = g.applies && !g.pass && reached;
          if (blocked) reached = false;
          const state = !g.applies ? 'skip' : blocked ? 'stop' : lit ? 'pass' : 'idle';
          return (
            <li key={g.id} className="xgate" data-gate={g.id} data-state={state} data-lit={lit ? 'true' : undefined}>
              <span className="xgate__box">
                <span className="xgate__label mono">{g.label}</span>
                <span className="xgate__status">{g.applies ? (blocked ? 'stops here' : lit ? 'passed' : '—') : 'n/a'}</span>
              </span>
              <span className="xgate__sub">{g.sub}</span>
            </li>
          );
        })}
      </ol>
      <p className="xgates__end" data-state={stop ? 'stop' : 'pass'}>{stop ? 'claim fails' : 'on to breach'}</p>
      <div className="xgates__circ">
        <p className="xgates__circ-title">s 32(2) circumstances the court considers:</p>
        <ul>
          {circumstances.map((c) => <li key={c.k} data-on={c.on ? 'true' : undefined}>{c.on ? '● ' : '○ '}{c.k}</li>)}
        </ul>
      </div>
    </div>
  );
  const verdict = !stop
    ? s.harm === 'pure'
      ? 'Passes Part 3: duty (s 32), a recognised illness (s 31) and, for shock, s 30(2). Go on to breach and causation.'
      : 'Consequential mental harm: s 30 and s 31 speak only to pure mental harm. With a s 32 duty, go on to breach and causation.'
    : stop.id === 's32'
      ? 'No duty (s 32): a person of normal fortitude would not foreseeably suffer a recognised psychiatric illness.'
      : stop.id === 's31'
        ? 'No damages (s 31): pure mental harm must be a recognised psychiatric illness.'
        : 'Barred (s 30(2)): for pure mental harm from shock, the plaintiff must have witnessed it at the scene or be a close family member.';
  return { figure, verdict, tone: stop ? 'no' : 'yes' };
}

function describe(a: S, b: S) {
  if (a.harm !== b.harm) return b.harm === 'pure' ? 'Pure mental harm: s 31 and (for shock) s 30 now apply.' : 'Consequential mental harm: s 31 and s 30 drop away; s 32 still decides duty.';
  if (a.shock !== b.shock) return b.shock ? 'Shock: s 30 applies to pure mental harm arising from shock, and it is s 32(2)(a).' : 'No shock: s 30 is not engaged, though s 32 still applies.';
  if (a.witnessed !== b.witnessed) return b.witnessed ? 'Witnessed at the scene: satisfies s 30(2)(a) and is s 32(2)(b).' : 'Not a scene witness: s 30(2) now depends on close family.';
  if (a.relationship !== b.relationship) return b.relationship === 'close-family' ? 'Close family member of the victim: satisfies s 30(2)(b).' : 'Not close family: s 30(2) now depends on witnessing at the scene.';
  if (a.preExisting !== b.preExisting) return 'A pre-existing relationship with the defendant is s 32(2)(d): a circumstance the court weighs, not a gate.';
  if (a.foreseeable !== b.foreseeable) return b.foreseeable ? 'Court finds the harm foreseeable to a person of normal fortitude: a s 32 duty exists.' : 'Not foreseeable to a person of normal fortitude: no duty under s 32, whatever else is true.';
  if (a.illness !== b.illness) return b.illness ? 'A recognised psychiatric illness: s 31 is satisfied.' : 'Distress or grief without a recognised illness: s 31 bars pure mental harm damages.';
  return '';
}

export default function MentalHarmCla() {
  return (
    <Simulation<S>
      label="Mental harm claims under the Civil Liability Act: three gates"
      terms={[
        { term: 'Pure mental harm', def: 'Mental harm that is not consequential on another personal injury (s 27).' },
        { term: 'Recognised psychiatric illness', def: 'What s 31 requires for pure mental harm — more than grief or distress.' },
        { term: 'Normal fortitude', def: 'The s 32 yardstick: would a person of ordinary resilience foreseeably be harmed?' },
        { term: 'Close member of the family', def: 'One of the two routes through s 30(2), the other being witnessing at the scene.' },
      ]}
      initial={initial}
      controls={[
        { key: 'harm', label: 'Type of mental harm', type: 'select', options: [{ value: 'pure', label: 'Pure mental harm' }, { value: 'consequential', label: 'Consequential on a physical injury' }] },
        { key: 'shock', label: 'Arose from shock at the victim being killed, injured or put in peril', type: 'toggle' },
        { key: 'witnessed', label: 'Plaintiff witnessed it at the scene', type: 'toggle' },
        { key: 'relationship', label: 'Relationship to the victim', type: 'select', options: [{ value: 'close-family', label: 'Close member of the family' }, { value: 'other', label: 'Other relationship' }, { value: 'none', label: 'None' }] },
        { key: 'preExisting', label: 'Pre-existing relationship with the defendant', type: 'toggle' },
        { key: 'foreseeable', label: 'Court finds it foreseeable to a person of normal fortitude', type: 'toggle' },
        { key: 'illness', label: 'Harm is a recognised psychiatric illness', type: 'toggle' },
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'For pure mental harm arising from shock, who can get past s 30(2)?',
        options: [
          { text: 'Only people who witnessed the event at the scene', why: 'Witnessing at the scene is one route, but close family members of the victim are the other (s 30(2)(b)).' },
          { text: 'Scene witnesses, or close members of the victim’s family', correct: true, why: 'Section 30(2) lets through a plaintiff who witnessed it at the scene or is a close member of the victim’s family.' },
          { text: 'Anyone whose harm is a recognised psychiatric illness', why: 'A recognised illness is the s 31 requirement; s 30(2) is a separate limit on who may recover.' },
        ],
      }}
    />
  );
}
