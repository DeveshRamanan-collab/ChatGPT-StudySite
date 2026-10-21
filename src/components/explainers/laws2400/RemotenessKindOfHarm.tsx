/*
SCENE: Remoteness of harm — a foreseeable kind, not extent or manner (Topic 11 flowchart, Tort Law Principles 3e p 438)
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → set three dials (kind, manner, extent) → watch which one moves the verdict → one check
INTENT: Show that remoteness turns on whether the kind of harm was reasonably foreseeable (a real, not far-fetched,
  risk), and that the extent of the harm and the precise manner of its occurrence need not be foreseeable.
SUBJECT: the kind dial, the only one wired to the verdict lamp; the other two dials visibly change nothing.
BEAT 1 (0–100%): three toggles; the "real risk ↔ far-fetched" scale shows where the kind of harm sits; the wired dial
  lights and the verdict updates within 200ms; changing manner or extent says so in the caption and leaves the verdict
  unchanged. Ease: colour and opacity only, --dur-micro --ease-out.
CAMERA: none (HTML + small SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: identical minus the fades (durations are tokens).
BUDGET: < 6 KB gz, no WebGL.
Source: concept laws2400-w11-remoteness-kind-of-harm; flowchart p 438 (Wagon Mound (No 1) leading case; Wagon Mound
  (No 2) real risk; extent-and-manner cases; kind-or-type cases). The materials do not say how "kind" is drawn in the
  listed cases, so the learner records the court's finding on kind as a toggle.
*/
import { Simulation, type SimView } from '../bases/Simulation';

interface S extends Record<string, unknown> {
  kind: boolean;
  manner: boolean;
  extent: boolean;
}

const initial: S = { kind: true, manner: false, extent: false };
const T = 'color var(--dur-micro) var(--ease-out), border-color var(--dur-micro) var(--ease-out), opacity var(--dur-micro) var(--ease-out)';

function Dial({ id, title, on, wired, note }: { id: string; title: string; on: boolean; wired: boolean; note: string }) {
  const edge = wired ? (on ? 'var(--sage)' : 'var(--clay)') : 'var(--line)';
  return (
    <li data-dial={id} data-on={on ? 'true' : undefined}
      style={{ display: 'grid', gridTemplateColumns: '5.5rem 1fr', gap: 'var(--s-3)', alignItems: 'center', padding: 'var(--s-2) var(--s-3)', border: `1.5px ${wired ? 'solid' : 'dashed'} ${edge}`, borderRadius: 'var(--r-md)', background: 'var(--paper)', transition: T }}>
      <span style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--t-sm)', color: 'var(--ink)', fontWeight: 600 }}>{title}</span>
      <span style={{ fontSize: 'var(--t-sm)', lineHeight: 1.35 }}>
        <span style={{ display: 'block', color: 'var(--ink)' }}>{on ? 'foreseeable' : 'not foreseeable'}</span>
        <span style={{ display: 'block', fontSize: 'var(--t-xs)', color: 'var(--ink-2)' }}>{note}</span>
      </span>
    </li>
  );
}

function Scale({ kind }: { kind: boolean }) {
  // The Wagon Mound (No 2) threshold: a real risk, as opposed to one brushed aside as far-fetched.
  const x = kind ? 70 : 270;
  return (
    <svg viewBox="0 0 340 64" role="img" aria-label={`Scale from real risk to far-fetched; the kind of harm sits at the ${kind ? 'real risk' : 'far-fetched'} end`}>
      <line x1="20" y1="30" x2="320" y2="30" stroke="var(--ink-3)" strokeWidth="2" />
      <line x1="170" y1="18" x2="170" y2="42" stroke="var(--ink-2)" strokeWidth="1.5" strokeDasharray="3 3" />
      <text x="20" y="58" fontFamily="var(--font-ui)" fontSize="12" fill="var(--ink-2)">real risk</text>
      <text x="320" y="58" textAnchor="end" fontFamily="var(--font-ui)" fontSize="12" fill="var(--ink-2)">far-fetched</text>
      <text x="170" y="12" textAnchor="middle" fontFamily="var(--font-ui)" fontSize="11" fill="var(--ink-3)">Wagon Mound (No 2) line</text>
      <circle cx="0" cy="30" r="8" fill="var(--ink)" style={{ transform: `translateX(${x}px)`, transition: 'transform var(--dur-ui) var(--ease-inout)' }} />
    </svg>
  );
}

function view(s: S): SimView {
  const figure = (
    <div role="group" aria-label="Three dials: kind of harm (decides remoteness), manner and extent (need not be foreseeable)" style={{ fontFamily: 'var(--font-ui)' }}>
      <p className="label" style={{ margin: '0 0 var(--s-2)' }}>Where does the kind of harm sit?</p>
      <Scale kind={s.kind} />
      <ul style={{ listStyle: 'none', margin: 'var(--s-3) 0 0', padding: 0, display: 'grid', gap: 'var(--s-2)' }}>
        <Dial id="kind" title="Kind" on={s.kind} wired note="decides remoteness · Tremain v Pike, Nader, McLean, Metrolink" />
        <Dial id="manner" title="Manner" on={s.manner} wired={false} note="need not be foreseeable · Hughes v Lord Advocate, Jolley" />
        <Dial id="extent" title="Extent" on={s.extent} wired={false} note="need not be foreseeable · Pusey, Gittani Stone, Waller v James" />
      </ul>
      <p style={{ margin: 'var(--s-3) 0 0', fontSize: 'var(--t-xs)', color: 'var(--ink-2)', lineHeight: 1.4 }}>
        Leading case: The Wagon Mound (No 1) — the extent of liability for losses is set by a reasonable foreseeability test.
      </p>
    </div>
  );
  const unforeseen = [!s.manner && 'manner', !s.extent && 'extent'].filter(Boolean) as string[];
  const tail = unforeseen.length ? ` The unforeseen ${unforeseen.join(' and ')} ${unforeseen.length > 1 ? 'do' : 'does'} not matter.` : '';
  const verdict = s.kind
    ? `Not too remote: the kind of harm was a real risk, so it was reasonably foreseeable (The Wagon Mound (No 1), (No 2)).${tail}`
    : 'Too remote: the kind of harm was a risk a reasonable person would brush aside as far-fetched. It falls outside the scope of liability, whatever the manner or extent.';
  return { figure, verdict, tone: s.kind ? 'yes' : 'no' };
}

function describe(a: S, b: S) {
  if (a.kind !== b.kind) return b.kind ? 'The kind of harm is now a real risk: the remoteness gate opens.' : 'The kind of harm is now far-fetched: the harm is too remote.';
  if (a.manner !== b.manner) return `The precise manner is now ${b.manner ? '' : 'not '}foreseeable — the verdict does not move: manner need not be reasonably foreseeable (eg Hughes v Lord Advocate).`;
  if (a.extent !== b.extent) return `The extent is now ${b.extent ? '' : 'not '}foreseeable — the verdict does not move: extent need not be reasonably foreseeable (eg Jolley; Waller v James).`;
  return '';
}

export default function RemotenessKindOfHarm() {
  return (
    <Simulation<S>
      label="Remoteness of harm: which foreseeability matters?"
      terms={[
        { term: 'Remoteness of harm', def: 'Concerned with the extent of the defendant’s liability for losses.' },
        { term: 'Real risk', def: 'One a reasonable person in the defendant’s position would not brush aside as far-fetched.' },
        { term: 'Kind of harm', def: 'The type of damage suffered; it must be reasonably foreseeable.' },
        { term: 'Extent and manner', def: 'How bad the harm was and exactly how it happened; neither need be foreseeable.' },
      ]}
      initial={initial}
      controls={[
        { key: 'kind', label: 'The kind of harm was a real, not far-fetched, risk', type: 'toggle' },
        { key: 'manner', label: 'The precise manner it happened was foreseeable', type: 'toggle' },
        { key: 'extent', label: 'The extent of the harm was foreseeable', type: 'toggle' },
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'Burns were a foreseeable kind of harm, but they came from an explosion nobody could have predicted. Too remote?',
        options: [
          { text: 'Yes — the precise manner had to be foreseeable', why: 'The flowchart says the precise manner of the harm’s occurrence need not be reasonably foreseeable.' },
          { text: 'No — the kind was foreseeable; manner need not be', correct: true, why: 'Remoteness asks whether the kind of harm was reasonably foreseeable; the manner and extent need not be (eg Hughes v Lord Advocate).' },
          { text: 'Only if the egg-shell skull rule applies', why: 'The egg-shell skull rule concerns the plaintiff’s own weaknesses and attributes; this is the extent-and-manner rule.' },
        ],
      }}
    />
  );
}
