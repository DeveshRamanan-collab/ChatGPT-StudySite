/*
SCENE: Possibility, risk and contribution — Tabet v Gett and the dust disease cases
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → choose a mode (lost chance / dust disease) → change the facts → watch the verdict → one check
INTENT: Show that factual causation needs proof on the balance of probabilities: a less than even chance of a better
  outcome is a possibility, not a probability (Tabet v Gett); and in dust disease cases evidence of increased risk is
  not enough (Amaca v Ellis), while evidence that the exposure contributed — more than negligibly — is (Bonnington;
  Amaca v Booth, where contribution was inferred).
SUBJECT: lost chance — the marker against the 50% line; dust disease — the four evidence rows, each marked as on the
  Booth side or the Ellis side.
BEAT 1 (0–100%): select controls; the marker / rows recolour; the verdict line updates within 200ms. Colour and
  opacity only (--dur-micro, --ease-out); the marker sits at its value with no positional animation.
CAMERA: none (HTML). LIGHT: none. SOUND: none.
REDUCED MOTION: identical (duration tokens are 0 in off); no positional movement anywhere.
BUDGET: < 7 KB gz, no WebGL.
Source: concept laws2400-w10-risk-chance-and-material-contribution; Topic 10 Lecture 2, slides 6–13; case cards
  tabet-v-gett, bonnington-castings-v-wardlaw, amaca-pty-ltd-v-ellis, amaca-v-booth,
  fairchild-v-glenhaven-funeral-services-ltd; Civil Liability Act 2002 (NSW) s 5E, s 3B(1).
The chance values are illustrative settings, not figures from any case. The dust mode compares a fact profile with the
  two cases the slides contrast (slide 12); it does not decide a case — mixed profiles are shown as open.
*/
import type { CSSProperties } from 'react';
import { Simulation, type SimView } from '../bases/Simulation';

interface S extends Record<string, unknown> {
  mode: 'chance' | 'dust';
  chance: '15' | '30' | '45' | '60' | '80';
  disease: 'meso' | 'lung';
  exposure: 'heavy' | 'limited';
  evidence: 'mechanism' | 'risk';
  competing: boolean;
}

const initial: S = { mode: 'chance', chance: '30', disease: 'meso', exposure: 'heavy', evidence: 'mechanism', competing: false };

const fade: CSSProperties = { transition: 'border-color var(--dur-micro) var(--ease-out), color var(--dur-micro) var(--ease-out), background-color var(--dur-micro) var(--ease-out), opacity var(--dur-micro) var(--ease-out)' };
const small: CSSProperties = { fontFamily: 'var(--font-ui)', fontSize: 'var(--t-xs)', letterSpacing: '0.08em', color: 'var(--ink-2)' };

function ChanceFigure({ pct }: { pct: number }) {
  const probable = pct > 50;
  return (
    <div style={{ display: 'grid', gap: 'var(--s-3)', fontFamily: 'var(--font-ui)' }} role="group" aria-label={`Chance of a better outcome with proper care: ${pct}%, against the 50% line`}>
      <span style={small}>CHANCE OF A BETTER OUTCOME WITH PROPER CARE</span>
      <div style={{ position: 'relative', height: 44, border: '1.5px solid var(--ink)', borderRadius: 'var(--r-sm)', background: 'var(--paper)' }}>
        <div style={{ ...fade, position: 'absolute', inset: 0, width: `${pct}%`, background: probable ? 'var(--accent-soft)' : 'var(--paper-3)', borderRadius: 'var(--r-sm) 0 0 var(--r-sm)' }} />
        <div aria-hidden style={{ position: 'absolute', top: -6, bottom: -6, left: '50%', borderLeft: '2px dashed var(--ink)' }} />
        <span className="mono" data-chance style={{ position: 'absolute', top: '50%', left: `${pct}%`, transform: 'translate(-50%, -50%)', padding: '1px var(--s-2)', border: '1.5px solid var(--ink)', borderRadius: 'var(--r-pill)', background: 'var(--paper)', fontSize: 'var(--t-sm)' }}>{pct}%</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--s-3)', fontSize: 'var(--t-xs)', color: 'var(--ink-2)' }}>
        <span>possible, not probable</span>
        <span>50% — more probable than not</span>
        <span>probable</span>
      </div>
      <p style={{ margin: 0, fontSize: 'var(--t-sm)', color: 'var(--ink)', borderLeft: '3px solid var(--ink-3)', paddingLeft: 'var(--s-3)' }}>
        Tabet v Gett: a delayed CT scan; the child’s chance of a better outcome was less than 50%. In personal injury, Australian common law does not entertain an action for the loss of a chance of a better outcome.
      </p>
    </div>
  );
}

type Side = 'booth' | 'ellis' | 'neutral';
function rows(s: S): { label: string; value: string; side: Side }[] {
  return [
    { label: 'Disease', value: s.disease === 'meso' ? 'Mesothelioma — asbestos effectively its only known cause' : 'Lung cancer — more than one possible cause', side: s.disease === 'meso' ? 'booth' : 'ellis' },
    { label: 'Defendant’s exposure', value: s.exposure === 'heavy' ? 'Long and heavy; other exposures trivial by comparison' : 'Limited', side: s.exposure === 'heavy' ? 'booth' : 'ellis' },
    { label: 'Evidence', value: s.evidence === 'mechanism' ? 'Expert evidence that cumulative exposure contributes to the disease' : 'Mainly epidemiological evidence: exposure increases the risk', side: s.evidence === 'mechanism' ? 'booth' : 'ellis' },
    { label: 'Competing cause', value: s.competing ? 'Yes (eg smoking)' : 'None in the evidence', side: s.competing ? 'ellis' : 'booth' },
  ];
}

function dustResult(s: S): 'booth' | 'ellis' | 'open' {
  if (s.evidence === 'risk') return 'ellis';
  if (s.disease === 'meso' && s.exposure === 'heavy' && !s.competing) return 'booth';
  return 'open';
}

function DustFigure({ s }: { s: S }) {
  return (
    <div style={{ display: 'grid', gap: 'var(--s-3)', fontFamily: 'var(--font-ui)' }} role="group" aria-label="Four features of the evidence, each matched to Amaca v Booth or Amaca v Ellis">
      <div style={{ display: 'flex', justifyContent: 'space-between', ...small }}>
        <span>THE EVIDENCE</span><span>CLOSER TO</span>
      </div>
      {rows(s).map((r) => (
        <div key={r.label} data-row={r.label} data-side={r.side} style={{ ...fade, display: 'grid', gridTemplateColumns: '1fr auto', gap: 'var(--s-3)', alignItems: 'center', border: '1px solid var(--line)', borderLeft: `3px solid ${r.side === 'booth' ? 'var(--ink)' : 'var(--ink-3)'}`, borderRadius: 'var(--r-sm)', padding: 'var(--s-2) var(--s-3)', background: 'var(--paper)' }}>
          <span style={{ display: 'grid', gap: 2 }}>
            <span style={small}>{r.label.toUpperCase()}</span>
            <span style={{ fontSize: 'var(--t-sm)', color: 'var(--ink)', lineHeight: 1.4 }}>{r.value}</span>
          </span>
          <span style={{ fontSize: 'var(--t-sm)', fontStyle: 'italic', fontFamily: 'var(--font-body)', color: r.side === 'booth' ? 'var(--ink)' : 'var(--ink-2)' }}>{r.side === 'booth' ? 'Booth' : 'Ellis'}</span>
        </div>
      ))}
      <p style={{ margin: 0, fontSize: 'var(--t-xs)', color: 'var(--ink-2)' }}>
        Increased risk: probabilistic, looks forward. Material contribution: causal, looks back, more than negligible (Bonnington). Fairchild (UK) accepted materially increased risk; Australian common law has not adopted it.
      </p>
    </div>
  );
}

function view(s: S): SimView {
  if (s.mode === 'chance') {
    const pct = Number(s.chance);
    const probable = pct > 50;
    return {
      figure: <ChanceFigure pct={pct} />,
      verdict: probable
        ? `${pct}%: more probable than not. The claim no longer rests on a lost chance — the ordinary ‘but for’ question can be answered on the balance of probabilities (s 5E).`
        : `${pct}%: a possibility, not a probability. Like Tabet v Gett, a lost chance of a better medical outcome is not recoverable in personal injury.`,
      tone: probable ? 'yes' : 'no',
    };
  }
  const r = dustResult(s);
  return {
    figure: <DustFigure s={s} />,
    verdict:
      r === 'booth'
        ? 'Like Amaca v Booth: an inference that the exposure contributed to the disease is reasonably open — material contribution, not mere risk.'
        : r === 'ellis'
          ? 'Like Amaca v Ellis: the evidence shows only an increased risk, which is not enough — contribution must be proved on the balance of probabilities.'
          : 'Between the two cases: ask whether the evidence proves a more than negligible contribution (Bonnington, Booth) or only an increased risk (Ellis).',
    tone: r === 'booth' ? 'yes' : r === 'ellis' ? 'no' : 'open',
  };
}

function describe(a: S, b: S) {
  if (a.mode !== b.mode) return b.mode === 'chance' ? 'Lost chance mode: where does the chance sit against the 50% line?' : 'Dust disease mode: does the evidence show contribution, or only risk?';
  if (b.mode === 'chance' && a.chance !== b.chance) {
    const was = Number(a.chance) > 50, now = Number(b.chance) > 50;
    return was === now ? `The chance moved to ${b.chance}%, on the same side of the line — same result.` : now ? `At ${b.chance}% the better outcome becomes probable, not merely possible.` : `At ${b.chance}% the better outcome is only possible: the Tabet v Gett problem.`;
  }
  if (b.mode === 'chance') return 'That setting belongs to the dust disease mode; switch modes to see it.';
  if (a.evidence !== b.evidence) return b.evidence === 'risk' ? 'Risk evidence only: Amaca v Ellis says increased risk is not enough.' : 'Mechanism evidence: cumulative exposure contributes — the kind of evidence that supported the inference in Booth.';
  if (a.disease !== b.disease) return b.disease === 'meso' ? 'Mesothelioma: asbestos is effectively its only known cause.' : 'Lung cancer: other causes are possible, as in Ellis.';
  if (a.exposure !== b.exposure) return b.exposure === 'heavy' ? 'Long, heavy exposure from the defendant, others trivial — as in Booth.' : 'Limited exposure — as in Ellis.';
  if (a.competing !== b.competing) return b.competing ? 'A competing cause (eg smoking) makes contribution by the exposure harder to prove.' : 'No competing cause in the evidence.';
  return '';
}

export default function RiskChanceAndMaterialContribution() {
  return (
    <Simulation<S>
      label="Possibility, risk and contribution: Tabet v Gett and the dust disease cases"
      terms={[
        { term: 'Possible v probable', def: 'Probable means more likely than not (over 50%); a lesser chance is only a possibility.' },
        { term: 'Increased risk', def: 'Probabilistic and forward-looking: the conduct made harm more likely. Not enough in Australia.' },
        { term: 'Material contribution', def: 'Causal and backward-looking: the conduct was part of how the harm came about.' },
        { term: 'De minimis', def: 'Negligible. A material contribution must be more than de minimis (Bonnington).' },
      ]}
      initial={initial}
      controls={[
        { key: 'mode', label: 'Kind of case', type: 'select', options: [
          { value: 'chance', label: 'Lost chance of a better outcome' },
          { value: 'dust', label: 'Dust disease' },
        ] },
        { key: 'chance', label: 'Lost chance: chance of a better outcome', type: 'select', options: [
          { value: '15', label: '15%' }, { value: '30', label: '30%' }, { value: '45', label: '45%' }, { value: '60', label: '60%' }, { value: '80', label: '80%' },
        ] },
        { key: 'disease', label: 'Dust: disease', type: 'select', options: [
          { value: 'meso', label: 'Mesothelioma' },
          { value: 'lung', label: 'Lung cancer' },
        ] },
        { key: 'exposure', label: 'Dust: defendant’s exposure', type: 'select', options: [
          { value: 'heavy', label: 'Long and heavy' },
          { value: 'limited', label: 'Limited' },
        ] },
        { key: 'evidence', label: 'Dust: kind of evidence', type: 'select', options: [
          { value: 'mechanism', label: 'Cumulative-mechanism expert evidence' },
          { value: 'risk', label: 'Epidemiological risk evidence only' },
        ] },
        { key: 'competing', label: 'Dust: a competing cause is in the evidence', type: 'toggle' },
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'A worker with lung cancer smoked for years, had limited asbestos exposure, and has only evidence that asbestos increases the risk of lung cancer. On the Topic 10 cases, what follows?',
        options: [
          { text: 'Causation fails, as in Amaca v Ellis: increased risk alone does not prove contribution', correct: true, why: 'Limited exposure, risk evidence only and a competing cause is the Ellis profile; the claimant must prove on the balance of probabilities that the exposure actually contributed.' },
          { text: 'Causation succeeds, as in Fairchild: materially increasing the risk is enough', why: 'Fairchild is a UK policy-based exception; Australian common law has not adopted a risk-based test in that form.' },
          { text: 'Causation succeeds, as in Amaca v Booth: asbestos was a possible cause', why: 'Booth’s inference rested on mesothelioma’s single known cause, heavy exposure and cumulative-mechanism evidence — none of which is present here.' },
        ],
      }}
    />
  );
}
