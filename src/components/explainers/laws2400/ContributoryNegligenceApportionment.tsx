/*
SCENE: Contributory negligence — the just and equitable reduction, the s 5R standard and causation
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → change the facts → watch two gates and the damages bar → one check
INTENT: Show that damages are reduced only when the plaintiff fell below the s 5R standard AND that lack of care is
  causally linked to the injury; then the size of the reduction is the court's just and equitable finding.
SUBJECT: the damages bar; its reduced portion appears only when both gates pass.
BEAT 1 (0–100%): two gates (s 5R standard; causal link, Caswell) light sage or stop in clay; the bar's reduced share
  scales from the right (transform scaleX, 240ms ease-out; none in motion off); the verdict updates within 200ms.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: identical controls; the bar changes without transition.
BUDGET: < 8 KB gz, no WebGL.
Source: Tort Law Principles 3e p 478 flowchart; CLA s 5R (act-2002-022.pdf); concept
  laws2400-w12-contributory-negligence-apportionment-and-standard. The percentages are the court's finding, chosen by
  the learner: the materials give no formula, only "just and equitable" (LRMPA s 9(1)) weighed on the whole conduct
  and relative blameworthiness of each party (Pennington v Norris).
*/
import { Simulation, type SimView } from '../bases/Simulation';
import { useExplainer } from '../context';

interface S extends Record<string, unknown> {
  below: boolean;
  causal: boolean;
  share: '20' | '40' | '60';
}

const initial: S = { below: true, causal: true, share: '40' };

function Bar({ cut }: { cut: number }) {
  const { motion } = useExplainer();
  return (
    <g>
      <rect x="20" y="150" width="320" height="34" rx="6" fill="var(--ink)" />
      <rect x="20" y="150" width="320" height="34" rx="6" fill="var(--paper-3)" stroke="var(--ink-3)" strokeDasharray="4 3"
        style={{ transformBox: 'fill-box', transformOrigin: 'right center', transform: `scaleX(${cut})`, transition: motion === 'off' ? undefined : 'transform 240ms var(--ease-out)' }} />
    </g>
  );
}

function Gate({ x, label, sub, state }: { x: number; label: string; sub: string; state: 'pass' | 'stop' | 'idle' }) {
  const stroke = state === 'pass' ? 'var(--sage)' : state === 'stop' ? 'var(--clay)' : 'var(--ink-3)';
  return (
    <g data-gate={label} data-state={state}>
      <rect x={x} y="20" width="150" height="62" rx="10" fill="var(--paper)" stroke={stroke} strokeWidth={state === 'stop' ? 2.5 : 1.5} style={{ transition: 'stroke 180ms var(--ease-out)' }} />
      <text x={x + 75} y="45" textAnchor="middle" fontFamily="var(--font-ui)" fontSize="13" fill="var(--ink)">{label}</text>
      <text x={x + 75} y="65" textAnchor="middle" fontFamily="var(--font-ui)" fontSize="11.5" fill="var(--ink-2)">{state === 'pass' ? 'met' : state === 'stop' ? 'not met — stops here' : '—'}</text>
      <text x={x + 75} y="100" textAnchor="middle" fontFamily="var(--font-ui)" fontSize="11" fill="var(--ink-2)">{sub}</text>
    </g>
  );
}

function view(s: S): SimView {
  const g1 = s.below ? 'pass' : 'stop';
  const g2 = !s.below ? 'idle' : s.causal ? 'pass' : 'stop';
  const found = s.below && s.causal;
  const pct = Number(s.share);
  const cut = found ? pct / 100 : 0;
  const figure = (
    <svg viewBox="0 0 360 230" role="img" style={{ maxWidth: 460, margin: '0 auto' }}
      aria-label={`Two gates — the s 5R standard and the causal link — then the damages bar: ${found ? `${pct}% reduction, ${100 - pct}% recovered` : 'no reduction, full damages'}.`}>
      <Gate x={14} label="s 5R standard" sub="knew or ought to have known" state={g1} />
      <line x1="164" y1="51" x2="196" y2="51" stroke={s.below ? 'var(--sage)' : 'var(--line)'} strokeWidth="3" />
      <Gate x={196} label="Causal link" sub="Caswell · ordinary causation" state={g2} />
      <text x="20" y="140" fontFamily="var(--font-ui)" fontSize="11" letterSpacing="1" fill="var(--ink-2)">DAMAGES OTHERWISE RECOVERABLE</text>
      <Bar cut={cut} />
      <text x="20" y="208" fontFamily="var(--font-ui)" fontSize="12.5" fill="var(--ink)">{found ? `Recovers ${100 - pct}%` : 'Recovers 100%'}</text>
      <text x="340" y="208" textAnchor="end" fontFamily="var(--font-ui)" fontSize="12.5" fill="var(--ink-2)">{found ? `reduced by ${pct}% (just and equitable)` : 'no reduction'}</text>
    </svg>
  );
  const verdict = !s.below
    ? 'No contributory negligence: she did not fall below the standard of a reasonable person in her position (s 5R). Full damages.'
    : !s.causal
      ? 'No reduction: her lack of care is not causally linked to her injury (Caswell v Powell Duffryn). Full damages.'
      : `Contributory negligence: damages reduced by ${pct}% — the share the court finds just and equitable, weighing the whole conduct of each party (Pennington v Norris).`;
  return { figure, verdict, tone: found ? 'open' : 'yes' };
}

function describe(a: S, b: S) {
  if (a.below !== b.below) return b.below ? 'She fell below the s 5R standard: a reasonable person in her position, on what she knew or ought to have known, would have taken that precaution.' : 'She met the s 5R standard, so there is no contributory negligence at all — causation and apportionment never arise.';
  if (a.causal !== b.causal) return b.causal ? 'Her lack of care is now causally linked to her injury: the causal requirement is met.' : 'No causal link between her lack of care and her injury: under Caswell the damages are not reduced.';
  if (a.share !== b.share) return `The court now finds ${b.share}% just and equitable. The materials give no formula: the figure comes from weighing each party's whole conduct and relative blameworthiness.`;
  return '';
}

export default function ContributoryNegligenceApportionment() {
  return (
    <Simulation<S>
      label="Contributory negligence: two gates and the damages bar"
      terms={[
        { term: 'Contributory negligence', def: "The plaintiff's own failure to take reasonable care for their own safety." },
        { term: 'Just and equitable', def: "The measure of the reduction, having regard to the plaintiff's share in the responsibility (LRMPA s 9(1))." },
        { term: 'Relative blameworthiness', def: 'Weighed over the whole conduct of each negligent party (Pennington v Norris).' },
        { term: 'Causal requirement', def: "The plaintiff's lack of care must be causally linked to the injury (Caswell)." },
      ]}
      initial={initial}
      controls={[
        { key: 'below', label: 'She fell below a reasonable person in her position, on what she knew or ought to have known (s 5R)', type: 'toggle' },
        { key: 'causal', label: 'Her lack of care is causally linked to her injury', type: 'toggle' },
        { key: 'share', label: 'Reduction the court finds just and equitable', type: 'select', options: [{ value: '20', label: '20%' }, { value: '40', label: '40%' }, { value: '60', label: '60%' }] },
      ]}
      view={view}
      describe={describe}
      check={{
        question: "A plaintiff fell below the s 5R standard, but her lack of care had nothing to do with how she was injured. What happens to her damages?",
        options: [
          { text: 'They are reduced by a just and equitable share', why: 'Only if the causal requirement is met; a causal link between her lack of care and her injury must be established.' },
          { text: 'They are not reduced: there is no causal link', correct: true, why: 'Caswell, as cited in the flowchart: a causal link between the lack of care and the injury must be established.' },
          { text: 'Her claim fails entirely', why: 'The flowchart describes contributory negligence as a partial reduction in damages, and without a causal link there is no reduction here at all.' },
        ],
      }}
    />
  );
}
