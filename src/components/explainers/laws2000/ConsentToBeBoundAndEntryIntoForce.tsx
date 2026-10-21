/*
SCENE: Consent to be bound, entry into force and provisional application
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → toggle signature, ratification and the treaty's own conditions → watch the dial → one check
INTENT: Show that consent (arts 11–17) and entry into force (art 24) are separate switches, and that in the gap
  between them a state is under art 18's minimal duty or, if agreed, art 25's fuller provisional application.
SUBJECT: the dial's needle across four stops: not bound · art 18 · art 25 · bound and in force.
BEAT 1 (0–100%): toggles move the needle (transform only, 240ms ease-in-out, full motion only); the stop reached is
  named with its article; the verdict updates within 200ms.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: calm/off — the needle jumps to its final stop; verdict identical.
BUDGET: < 8 KB gz, no WebGL.
Source: concept card laws2000-w03-consent-to-be-bound-and-entry-into-force; VCLT arts 11, 14, 18, 24, 25 authority
  cards; UNCLOS art 306 example from the card.
*/
import { Simulation, type SimView } from '../bases/Simulation';
import { useExplainer } from '../context';

interface S extends Record<string, unknown> {
  signed: boolean;
  ratReq: boolean;
  ratified: boolean;
  inForce: boolean;
  provisional: boolean;
  optedOut: boolean;
}

const initial: S = { signed: true, ratReq: true, ratified: false, inForce: false, provisional: false, optedOut: false };

type Stop = 0 | 1 | 2 | 3;
const STOPS = ['not bound', 'art 18', 'art 25', 'in force'];

function status(s: S): { stop: Stop; why: string } {
  const consented = s.ratified || (s.signed && !s.ratReq);
  if (consented && s.inForce) return { stop: 3, why: s.ratified ? 'Consent by ratification (art 14) and the treaty is in force (art 24): the state is bound by every provision.' : 'Consent by signature, no ratification required (art 14), and the treaty is in force (art 24): fully bound.' };
  if (!s.inForce && (s.signed || s.ratified) && s.provisional && !s.optedOut) return { stop: 2, why: 'Not yet in force, but the treaty or the negotiating states agreed to provisional application (art 25): the treaty applies in full, pending entry into force.' };
  if (consented && !s.inForce) return { stop: 1, why: 'Consent given, treaty not yet in force: art 18(b) — refrain from defeating its object and purpose, provided entry into force is not unduly delayed. Its details do not yet bind.' };
  if (s.signed && s.ratReq && !s.ratified && !s.optedOut) return { stop: 1, why: `Signed subject to ratification${s.inForce ? ' (the treaty is in force for others, not this state)' : ''}: art 18(a) — refrain from defeating the object and purpose until it makes clear it will not become a party.` };
  if (s.signed && s.optedOut) return { stop: 0, why: 'The state has made clear it will not become a party: even the art 18 duty falls away.' };
  return { stop: 0, why: 'No signature and no consent: the treaty imposes nothing on this state.' };
}

function Dial({ stop }: { stop: Stop }) {
  const { motion } = useExplainer();
  const tr = motion === 'full' ? 'transform 240ms var(--ease-inout)' : 'none';
  const cx = 260, cy = 190, R = 150;
  const ang = (i: number) => Math.PI - (i + 0.5) * (Math.PI / 4);
  const deg = -90 + (stop + 0.5) * 45;
  return (
    <svg viewBox="0 0 520 240" role="img" aria-label={`Dial at: ${stop === 3 ? 'bound and in force' : STOPS[stop]}`}>
      {STOPS.map((label, i) => {
        const a0 = Math.PI - i * (Math.PI / 4), a1 = Math.PI - (i + 1) * (Math.PI / 4);
        const p = (a: number, r: number) => `${cx + r * Math.cos(a)} ${cy - r * Math.sin(a)}`;
        const on = i === stop;
        const lx = cx + (R + 20) * Math.cos(ang(i)), ly = cy - (R + 20) * Math.sin(ang(i));
        return (
          <g key={label}>
            <path d={`M ${p(a0, R)} A ${R} ${R} 0 0 1 ${p(a1, R)}`} fill="none" stroke={on ? (i === 0 ? 'var(--clay)' : i === 3 ? 'var(--sage)' : 'var(--ink-2)') : 'var(--paper-3)'} strokeWidth="16" style={{ transition: 'stroke 180ms var(--ease-out)' }} />
            <text x={lx} y={ly} textAnchor={i < 2 ? 'end' : 'start'} fontFamily="var(--font-ui)" fontSize="19" fill={on ? 'var(--ink)' : 'var(--ink-3)'}>{label}</text>
          </g>
        );
      })}
      <text x={cx} y={cy + 34} textAnchor="middle" fontFamily="var(--font-ui)" fontSize="15" fill="var(--ink-2)">arts 18 and 25 sit in the gap before entry into force</text>
      <g style={{ transform: `rotate(${deg}deg)`, transformOrigin: `${cx}px ${cy}px`, transition: tr }}>
        <line x1={cx} y1={cy} x2={cx} y2={cy - R + 22} stroke="var(--ink)" strokeWidth="4" strokeLinecap="round" />
      </g>
      <circle cx={cx} cy={cy} r="7" fill="var(--ink)" />
    </svg>
  );
}

function view(s: S): SimView {
  const { stop, why } = status(s);
  return { figure: <Dial stop={stop} />, verdict: why, tone: stop === 3 ? 'yes' : stop === 0 ? 'no' : 'open' };
}

function describe(a: S, b: S) {
  if (a.signed !== b.signed) return b.signed ? 'Signed: the first step, and consent itself if ratification is not required.' : 'Unsigned: no consent and no art 18 duty from signature.';
  if (a.ratReq !== b.ratReq) return b.ratReq ? 'Ratification required (art 14): signature alone is no longer consent — the Australian norm for multilateral treaties.' : 'No ratification required: signature expresses consent to be bound.';
  if (a.ratified !== b.ratified) return b.ratified ? 'Ratified: consent to be bound is given — but that is not the same as the treaty being in force.' : 'Not ratified: if ratification is required, the state has not yet consented.';
  if (a.inForce !== b.inForce) return b.inForce ? 'The treaty’s own conditions are met (art 24) — as UNCLOS’s were in 1994, 12 months after the 60th ratification.' : 'The treaty’s conditions are not yet met: it is not in force for anyone (art 24).';
  if (a.provisional !== b.provisional) return b.provisional ? 'Provisional application agreed (art 25): a stronger, opt-in status than art 18.' : 'No agreement on provisional application: only art 18 can reach the gap.';
  if (a.optedOut !== b.optedOut) return b.optedOut ? 'The state makes clear it will not become a party: art 18(a) ends.' : 'The state has not disowned the treaty.';
  return '';
}

export default function ConsentToBeBoundAndEntryIntoForce() {
  return (
    <Simulation<S>
      label="A dial from not bound, through arts 18 and 25, to bound and in force"
      terms={[
        { term: 'Consent to be bound', def: 'How a state agrees to a treaty (arts 11–17): signature, ratification, accession and others.' },
        { term: 'Entry into force', def: 'When the treaty starts to operate, on the terms it sets (art 24).' },
        { term: 'Art 18 duty', def: 'In the gap: refrain from acts that would defeat the object and purpose — nothing more.' },
        { term: 'Provisional application', def: 'Art 25: the treaty, or part, applies in full before entry into force, if agreed.' },
      ]}
      initial={initial}
      controls={[
        { key: 'signed', label: 'The state has signed', type: 'toggle' },
        { key: 'ratReq', label: 'Ratification required (art 14)', type: 'toggle' },
        { key: 'ratified', label: 'The state has ratified', type: 'toggle' },
        { key: 'inForce', label: 'The treaty’s entry-into-force conditions are met (art 24)', type: 'toggle' },
        { key: 'provisional', label: 'Treaty or parties agree to provisional application (art 25)', type: 'toggle' },
        { key: 'optedOut', label: 'The state has made clear it will not become a party', type: 'toggle' },
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'Australia has ratified a treaty that is not yet in force, with no agreement on provisional application. What binds it?',
        options: [
          { text: 'Every provision of the treaty, from the date of ratification', why: 'Consent is not entry into force: the details bind only once the treaty is in force (art 24).' },
          { text: 'Only a duty not to defeat the treaty’s object and purpose', correct: true, why: 'Art 18(b): a state that has consented, pending entry into force, must refrain from defeating the object and purpose (if entry is not unduly delayed).' },
          { text: 'Nothing at all until the treaty enters into force', why: 'Art 18 imposes a minimal duty in the gap, so it is not nothing.' },
        ],
      }}
    />
  );
}
