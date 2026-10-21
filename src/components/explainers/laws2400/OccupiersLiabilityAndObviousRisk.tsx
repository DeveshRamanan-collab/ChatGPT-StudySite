/*
SCENE: Occupiers' duty and obvious risk
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → move the danger from concealed to obvious → watch the duty-to-warn bar shrink → try the s 5H(2)
  exceptions and the s 5G presumption → one check
INTENT: Show that an occupier's duty is measured in scope by the obviousness of the danger (Romeo): as the danger
  becomes obvious (s 5F), the duty to warn or guard falls away (s 5H), subject to three exceptions.
SUBJECT: the duty-to-warn bar; it shrinks toward zero as the dial moves to "obvious".
BEAT 1 (0–100%): a select moves the dial needle along concealed → obvious; the bar scales (transform: scaleX) and the
  verdict updates within 200ms. Ease: CSS 240ms ease-in-out on transforms, 180ms ease-out on colour.
CAMERA: none (SVG + HTML). LIGHT: none. SOUND: none.
REDUCED MOTION: final positions only (bases handle calm/off).
BUDGET: < 6 KB gz, no WebGL.
Source: concept card laws2400-w06-occupiers-liability-and-obvious-risk; case romeo-v-conservation-commission-nt;
  authorities civil-liability-act-2002-nsw-s5f, -s5g, -s5h (text of s 5H(1)–(3) and s 5G(1)).
*/
import { Simulation, type SimView } from '../bases/Simulation';

interface S extends Record<string, unknown> {
  risk: 'concealed' | 'obvious' | 'obvious-low';
  exception: 'none' | 'advice' | 'written-law' | 'professional';
  rebutted: boolean;
}

const initial: S = { risk: 'concealed', exception: 'none', rebutted: false };

const POS: Record<S['risk'], number> = { concealed: 40, obvious: 280, 'obvious-low': 230 };

const EXC: Record<Exclude<S['exception'], 'none'>, string> = {
  advice: 's 5H(2)(a): the plaintiff requested advice or information about the risk',
  'written-law': 's 5H(2)(b): a written law requires the defendant to warn',
  professional: 's 5H(2)(c): a professional, and a risk of death or personal injury from a professional service',
};

function view(s: S): SimView {
  const obvious = s.risk !== 'concealed';
  const exc = s.exception !== 'none';
  const duty = !obvious ? 1 : exc ? 0.5 : 0.04;
  const figure = (
    <div className="xgates" role="group" aria-label="Dial from concealed to obvious danger, and the duty to warn">
      <svg viewBox="0 0 320 64" role="img" aria-label={`Danger: ${obvious ? 'obvious' : 'concealed'}`}>
        <line x1="40" y1="30" x2="280" y2="30" stroke="var(--line)" strokeWidth="6" strokeLinecap="round" />
        <text x="40" y="58" textAnchor="middle" fontSize="12" fill="var(--ink-2)" fontFamily="var(--font-ui)">concealed</text>
        <text x="280" y="58" textAnchor="middle" fontSize="12" fill="var(--ink-2)" fontFamily="var(--font-ui)">obvious</text>
        <g style={{ transform: `translateX(${POS[s.risk]}px)`, transition: 'transform 240ms var(--ease-inout)' }}>
          <circle cx="0" cy="30" r="9" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2" />
        </g>
      </svg>

      <p className="label" style={{ margin: 'var(--s-4) 0 var(--s-1)' }}>Proactive duty to warn of, or guard against, the risk</p>
      <div style={{ height: 14, borderRadius: 'var(--r-pill)', background: 'var(--paper-3)', overflow: 'hidden' }}>
        <div
          data-duty={duty}
          style={{ height: '100%', background: 'var(--ink-2)', transformOrigin: 'left center', transform: `scaleX(${duty})`, transition: 'transform 240ms var(--ease-inout)' }}
        />
      </div>
      <p style={{ margin: 'var(--s-1) 0 0', fontSize: 'var(--t-xs)', color: 'var(--ink-2)' }}>
        {!obvious ? 'Concealed: the duty extends to warning or guarding.' : exc ? 's 5H(1) displaced — but s 5H(3): no presumption of a duty to warn.' : 'Obvious: no duty to warn (s 5H(1)) — nor, per Romeo, to fence.'}
      </p>

      <div style={{ display: 'grid', gap: 'var(--s-3)', gridTemplateColumns: 'repeat(auto-fit, minmax(13rem, 1fr))', marginTop: 'var(--s-4)' }}>
        <div style={{ padding: 'var(--s-3)', background: 'var(--paper)', borderRadius: 'var(--r-md)', border: '1px solid var(--line)', color: obvious ? 'var(--ink)' : 'var(--ink-3)', fontSize: 'var(--t-sm)', lineHeight: 1.4 }}>
          <p className="label" style={{ margin: '0 0 var(--s-1)' }}>s 5G awareness</p>
          {!obvious ? 'Not engaged: the risk is not obvious.' : s.rebutted ? 'Presumption rebutted: the plaintiff proved on the balance of probabilities they were unaware.' : 'Plaintiff presumed aware of the obvious risk.'}
        </div>
        <div style={{ padding: 'var(--s-3)', background: 'var(--paper)', borderRadius: 'var(--r-md)', border: '1px solid var(--line)', color: obvious ? 'var(--ink)' : 'var(--ink-3)', fontSize: 'var(--t-sm)', lineHeight: 1.4 }}>
          <p className="label" style={{ margin: '0 0 var(--s-1)' }}>s 5H(2) exception</p>
          {s.exception === 'none' ? 'None applies.' : EXC[s.exception]}
        </div>
      </div>
    </div>
  );
  const verdict = !obvious
    ? 'Concealed danger: the occupier’s duty of reasonable care extends to warning or guarding. Go on to breach.'
    : exc
      ? 'Obvious risk, but a s 5H(2) exception applies: s 5H(1) does not remove the duty to warn — though no duty is presumed (s 5H(3)).'
      : `Obvious risk (s 5F${s.risk === 'obvious-low' ? ', even if low-probability or not conspicuous' : ''}): no duty to warn (s 5H(1)). Breach need not be reached.`;
  return { figure, verdict, tone: !obvious ? 'yes' : exc ? 'open' : 'no' };
}

function describe(a: S, b: S) {
  if (a.risk !== b.risk) {
    if (b.risk === 'concealed') return 'Concealed danger: the scope of the duty reaches warning or guarding.';
    if (b.risk === 'obvious-low') return 'Still obvious under s 5F: obvious to a reasonable person in the plaintiff’s position, even if unlikely or not conspicuous.';
    return 'Obvious danger, like the Dripstone Cliffs in Romeo: no duty to fence or warn.';
  }
  if (a.exception !== b.exception) return b.exception === 'none' ? 'No exception: s 5H(1) applies in full to an obvious risk.' : `${EXC[b.exception]}. The exception lifts s 5H(1) but creates no presumption of a duty (s 5H(3)).`;
  if (a.rebutted !== b.rebutted) return b.rebutted ? 'The plaintiff proves they were unaware: the s 5G presumption is displaced. s 5H(1) turns on obviousness, not awareness.' : 'Presumed aware of the obvious risk (s 5G).';
  return '';
}

export default function OccupiersLiabilityAndObviousRisk() {
  return (
    <Simulation<S>
      label="How the obviousness of a danger shrinks an occupier's duty to warn"
      terms={[
        { term: 'Scope of duty', def: 'Romeo: the duty is not owed in the abstract; the question is usually how far it extends.' },
        { term: 'Obvious risk (s 5F)', def: 'Obvious to a reasonable person in the plaintiff’s position, even if low-probability or not conspicuous.' },
        { term: 'Presumed awareness (s 5G)', def: 'The plaintiff is presumed aware of an obvious risk unless they prove otherwise.' },
        { term: 'No duty to warn (s 5H)', def: 'No proactive duty to warn of an obvious risk, subject to three exceptions.' },
      ]}
      initial={initial}
      controls={[
        { key: 'risk', label: 'The danger', type: 'select', options: [{ value: 'concealed', label: 'Concealed' }, { value: 'obvious-low', label: 'Obvious, though low-probability or not conspicuous' }, { value: 'obvious', label: 'Obvious' }] },
        { key: 'exception', label: 's 5H(2) exception', type: 'select', options: [{ value: 'none', label: 'None' }, { value: 'advice', label: 'Plaintiff requested advice' }, { value: 'written-law', label: 'Written law requires a warning' }, { value: 'professional', label: 'Professional service, risk of death or injury' }] },
        { key: 'rebutted', label: 'Plaintiff proves they were not aware of the risk', type: 'toggle' },
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'Why did the Conservation Commission in Romeo not have to fence the cliff edge?',
        options: [
          { text: 'It owed entrants no duty of care at all', why: 'Tempting, but the Commission did owe a duty of reasonable care; the issue was its scope.' },
          { text: 'The danger was obvious, so the duty did not extend to fencing or warning', correct: true, why: 'The danger was measured by its obviousness and the care ordinarily exercised by the public; no duty to guard against an obvious risk.' },
          { text: 'Romeo proved she was unaware of the risk', why: 'Awareness is the later s 5G presumption; Romeo turned on the obviousness of the danger and the scope of the duty.' },
        ],
      }}
    />
  );
}
