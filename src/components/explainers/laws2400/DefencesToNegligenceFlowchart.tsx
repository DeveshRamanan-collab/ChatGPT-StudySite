/*
SCENE: Defences to negligence — the textbook's two flowcharts as one interactive decision flow
LENGTH: 4 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
BEATS: 4
INTENT: When the plaintiff's own conduct is in issue, show the two branches and where each ends: contributory
  negligence (seven boxes, a partial reduction) and voluntary assumption of risk (four boxes, a complete defence).
SUBJECT: the fork under "plaintiff's own conduct"; each box, once drawn, opens its rule and authority on click/Enter.
BEAT 1 (0–25%): root box and the fork into the two branch headers (partial reduction · complete defence). DrawSVG,
  ease none (scrubbed); text fades.
BEAT 2 (25–50%): the contributory negligence spine and its seven boxes (Pennington; s 5R; Caswell; employees; agony
  of the moment; rescuers s 56; intoxication s 50).
BEAT 3 (50–75%): the volenti spine, its four boxes (knowledge of risk; intoxicated drivers; s 5L; illegality) and
  the "defendant must show" note.
BEAT 4 (75–100%): the two exits — damages reduced (just and equitable, LRMPA s 9(1)) or claim defeated.
INTERACTION: every drawn box is a button (Enter/Space or click); the panel under the figure shows the box's rule and
  authority within one frame. Boxes not yet drawn are inert (tabIndex -1, no pointer events). Hover fill only for a
  mouse pointer; press = scale(0.97) 160 ms (not in motion off); keyboard focus = 2px accent stroke.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: the finished flow with all four captions stacked (base); boxes stay interactive.
BUDGET: < 12 KB gz; no WebGL.
Source: Tort Law Principles 3e pp 478–479 flowcharts (week 12 notes); concept laws2400-w12-defences-to-negligence-flowchart.
*/
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Diagram } from '../bases/Diagram';
import { useExplainer } from '../context';

interface Node { id: string; step: number; x: number; y: number; w: number; h: number; label: string[]; title: string; rule: string; auth: string }

const ui = { fontFamily: 'var(--font-ui)', fill: 'var(--ink)' } as const;
const BOX_W = 152, BOX_H = 30, GAP = 38, TOP = 116;

const cn = (i: number, id: string, label: string, title: string, rule: string, auth: string): Node =>
  ({ id, step: 2, x: 24, y: TOP + i * GAP, w: BOX_W, h: BOX_H, label: [label], title, rule, auth });
const vo = (i: number, id: string, label: string, title: string, rule: string, auth: string): Node =>
  ({ id, step: 3, x: 204, y: TOP + i * GAP, w: BOX_W, h: BOX_H, label: [label], title, rule, auth });

const NODES: Node[] = [
  { id: 'cn', step: 1, x: 4, y: 58, w: 176, h: 46, label: ['Contributory negligence', 'partial reduction'], title: 'Contributory negligence',
    rule: "A partial reduction in the damages otherwise recoverable, based on what is just and equitable having regard to the plaintiff's share in the responsibility for the damage.",
    auth: 'Law Reform (Miscellaneous Provisions) Act 1965 (NSW) s 9(1); Davies v Swan Motor Co (Swansea) Ltd; Jones v Livox Quarries Ltd' },
  { id: 'vo', step: 1, x: 184, y: 58, w: 172, h: 46, label: ['Volenti non fit injuria', 'complete defence'], title: 'Voluntary assumption of risk',
    rule: 'A complete defence to negligence. The defendant must show the plaintiff perceived the risk, fully appreciated its nature and extent, and voluntarily accepted that specific risk — not merely its general nature.',
    auth: 'Tort Law Principles 3e, p 479 (flowchart)' },
  cn(0, 'jae', 'Just and equitable?', "What is 'just and equitable'?",
    'Examine the whole conduct of each of the negligent parties and consider the relative blameworthiness of each.', 'Pennington v Norris'),
  cn(1, 'std', 'Standard of care · s 5R', 'Relevant standard of care',
    "The principles that decide negligence also decide contributory negligence: a reasonable person in the plaintiff's position, on what they knew or ought to have known at the time.", 'Civil Liability Act 2002 (NSW) s 5R'),
  cn(2, 'cause', 'Causal requirement', 'Causal requirement',
    "A causal link between the plaintiff's lack of care for their own safety and their injury must be established; ordinary principles of causation apply.", 'Caswell v Powell Duffryn Associated Collieries'),
  cn(3, 'emp', "Employees' inattention", 'Momentary thoughtlessness by employees',
    "In the employment context, inattention bred of familiarity and repetition, the urgency of the task, preoccupation with the matter in hand and other prevailing conditions may be taken into account.", 'McLean v Tedman; Staveley Iron and Chemical Co v Jones'),
  cn(4, 'agony', 'Agony of the moment', 'Agony of the moment',
    "Action that may seem to show a lack of reasonable care for the plaintiff's own safety may not be contributory negligence where it can be justified in a situation of perceived emergency.", 'Avram v Gusakoski; Caterson v Commissioner for Railways'),
  cn(5, 'resc', 'Rescuers · s 56', 'Rescuers',
    'Law in most jurisdictions now offers protection to those who act in good faith and without recklessness.', 'Civil Liability Act 2002 (NSW) s 56; Civil Law (Wrongs) Act 2002 (ACT) s 5'),
  cn(6, 'intox', 'Intoxication · s 50', 'Intoxication',
    'A legislative presumption of contributory negligence where the plaintiff is intoxicated: no damages unless the harm was likely anyway, then a reduction of 25% or more.', 'Civil Liability Act 2002 (NSW) s 50; Civil Law (Wrongs) Act 2002 (ACT) ss 95, 96'),
  vo(0, 'know', 'Knowledge of risk', 'Knowledge of risk',
    'The plaintiff must fully appreciate the nature and likely manifestation of the risk; effective knowledge extends beyond the mere existence of a risk to an acceptance of its materialisation.', 'Banovic v Perkovic; Carey v Lake Macquarie City Council; ICI v Shatwell'),
  vo(1, 'pass', 'Intoxicated drivers', 'Intoxicated drivers and passengers',
    'Courts are generally reluctant to allow volenti against passengers who rely on an intoxicated driver; legislation in some jurisdictions specifically excludes it.', 'Motor Accidents Act 1988 (NSW) s 76 (text not in the materials)'),
  vo(2, 'reform', 'Legislative reform · s 5L', 'Legislative reform',
    'Legislation that expands the defence: no liability for harm from the materialisation of an obvious risk of a dangerous recreational activity, whether or not the plaintiff was aware of the risk.', "Civil Liability Act 2002 (NSW) s 5L; Tapp v Australian Bushmen's Campdraft & Rodeo Association Ltd (2022) 273 CLR 454"),
  vo(3, 'illeg', 'Illegality', 'Illegality',
    'Where plaintiff and defendant were involved in the criminal enterprise and no appropriate standard of care can be determined, a defence of illegality is available — but not where the court can determine it.', 'Gala v Preston; Progress & Properties Ltd v Craft'),
];

function NodeBox({ n, shown, selected, onPick }: { n: Node; shown: boolean; selected: boolean; onPick: (id: string) => void }) {
  const { motion } = useExplainer();
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const [down, setDown] = useState(false);
  const key = (e: KeyboardEvent<SVGGElement>) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPick(n.id); }
  };
  const fill = selected || hover ? 'var(--paper-3)' : 'none';
  const stroke = focus ? 'var(--accent)' : selected ? 'var(--ink)' : 'var(--ink-3)';
  const head = n.step === 1;
  return (
    <g
      role="button"
      tabIndex={shown ? 0 : -1}
      aria-pressed={selected}
      aria-hidden={shown ? undefined : true}
      aria-label={`${n.title}: open its rule`}
      data-node={n.id}
      onClick={() => onPick(n.id)}
      onKeyDown={key}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      onPointerEnter={(e) => setHover(e.pointerType === 'mouse')}
      onPointerLeave={() => { setHover(false); setDown(false); }}
      onPointerDown={() => setDown(true)}
      onPointerUp={() => setDown(false)}
      style={{
        cursor: shown ? 'pointer' : 'default', pointerEvents: shown ? 'auto' : 'none', outline: 'none',
        transformBox: 'fill-box', transformOrigin: 'center',
        transform: down && motion !== 'off' ? 'scale(0.97)' : 'none',
        transition: motion === 'off' ? undefined : 'transform 160ms var(--ease-out)',
      }}
    >
      <rect x={n.x} y={n.y} width={n.w} height={n.h} rx={head ? 10 : 7} fill={fill} pointerEvents="all"
        stroke={stroke} strokeWidth={focus || selected ? 2 : head ? 1.5 : 1.2} style={{ transition: 'fill 180ms ease, stroke 180ms ease' }} />
      {head ? (
        <>
          <text x={n.x + n.w / 2} y={n.y + 20} textAnchor="middle" {...ui} fontSize="13" fontWeight="600" data-label={n.id}>{n.label[0]}</text>
          <text x={n.x + n.w / 2} y={n.y + 37} textAnchor="middle" {...ui} fontSize="11.5" fill="var(--ink-2)">{n.label[1]}</text>
        </>
      ) : (
        <text x={n.x + 10} y={n.y + 19.5} {...ui} fontSize="12" data-label={n.id}>{n.label[0]}</text>
      )}
    </g>
  );
}

function FlowFigure() {
  const root = useRef<HTMLDivElement>(null);
  const [sel, setSel] = useState<string | null>(null);
  const [now, setNow] = useState(Infinity); // the base's current step (data-step-now); off mode has none = all drawn
  useEffect(() => {
    const fig = root.current?.closest('figure');
    if (!fig) return;
    const read = () => {
      const v = fig.getAttribute('data-step-now');
      setNow(v === null ? Infinity : Number(v));
    };
    read();
    const mo = new MutationObserver(read);
    mo.observe(fig, { attributes: true, attributeFilter: ['data-step-now'] });
    return () => mo.disconnect();
  }, []);
  const chosen = NODES.find((n) => n.id === sel && n.step <= now);
  const lastCn = TOP + 6 * GAP + BOX_H / 2;
  const lastVo = TOP + 3 * GAP + BOX_H / 2;
  // Each branch's boxes sit inside that branch's data-step group, so the base draws them with it.
  const boxes = (k: number) => NODES.filter((n) => n.step === k).map((n) => (
    <NodeBox key={n.id} n={n} shown={now >= k} selected={sel === n.id} onPick={setSel} />
  ));
  return (
    <div ref={root} style={{ width: '100%', maxWidth: 480, margin: '0 auto' }}>
      <svg viewBox="0 0 360 452" role="group" style={{ maxHeight: '56vh' }}
        aria-label="The plaintiff's own conduct splits into contributory negligence (seven boxes, partial reduction) and voluntary assumption of risk (four boxes, complete defence). Each box opens its rule.">
        <g data-step="1">
          <rect x="80" y="4" width="200" height="30" rx="8" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
          <text x="180" y="23.5" textAnchor="middle" {...ui} fontSize="11" letterSpacing="1.2">{"PLAINTIFF'S OWN CONDUCT"}</text>
          <path d="M180 34 V46 M92 46 H270 M92 46 V58 M270 46 V58" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
          {boxes(1)}
        </g>
        <g data-step="2">
          <path d={`M14 104 V${lastCn}`} fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
          {NODES.filter((n) => n.step === 2).map((n) => <line key={n.id} x1="14" y1={n.y + BOX_H / 2} x2="24" y2={n.y + BOX_H / 2} stroke="var(--ink-3)" strokeWidth="1.5" />)}
          {boxes(2)}
        </g>
        <g data-step="3">
          <path d={`M194 104 V${lastVo}`} fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
          {NODES.filter((n) => n.step === 3).map((n) => <line key={n.id} x1="194" y1={n.y + BOX_H / 2} x2="204" y2={n.y + BOX_H / 2} stroke="var(--ink-3)" strokeWidth="1.5" />)}
          {boxes(3)}
          <rect x="184" y="282" width="172" height="86" rx="8" fill="none" stroke="var(--ink-3)" strokeWidth="1" strokeDasharray="3 3" />
          <text x="196" y="302" {...ui} fontSize="10.5" letterSpacing="1" fill="var(--ink-2)">DEFENDANT MUST SHOW</text>
          {['the plaintiff perceived the risk,', 'fully appreciated its nature', 'and extent, and voluntarily', 'accepted that specific risk'].map((l, i) => (
            <text key={l} x="196" y={320 + i * 14} {...ui} fontSize="11.5" fill="var(--ink)">{l}</text>
          ))}
        </g>
        <g data-step="4">
          <path d={`M92 ${TOP + 6 * GAP + BOX_H} V392 M270 368 V392`} fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
          <rect x="4" y="392" width="176" height="54" rx="10" fill="none" stroke="var(--ink)" strokeWidth="2" />
          <text x="92" y="414" textAnchor="middle" {...ui} fontSize="11" letterSpacing="1.2" data-label="reduced">DAMAGES REDUCED</text>
          <text x="92" y="433" textAnchor="middle" {...ui} fontSize="11.5" fill="var(--ink-2)">just and equitable · s 9(1)</text>
          <rect x="184" y="392" width="172" height="54" rx="10" fill="none" stroke="var(--ink)" strokeWidth="2" />
          <text x="270" y="414" textAnchor="middle" {...ui} fontSize="11" letterSpacing="1.2" data-label="defeated">CLAIM DEFEATED</text>
          <text x="270" y="433" textAnchor="middle" {...ui} fontSize="11.5" fill="var(--ink-2)">only on that narrow proof</text>
        </g>
      </svg>
      <div aria-live="polite" style={{ minHeight: '8.5em', marginTop: 'var(--s-3)', fontFamily: 'var(--font-ui)', fontSize: 'var(--t-sm)', lineHeight: 1.45, textAlign: 'left' }}>
        {chosen ? (
          <>
            <p style={{ margin: 0, fontWeight: 600, color: 'var(--ink)' }}>{chosen.title}</p>
            <p style={{ margin: 'var(--s-1) 0', color: 'var(--ink)' }}>{chosen.rule}</p>
            <p className="mono" style={{ margin: 0, fontSize: 'var(--t-xs)', color: 'var(--ink-2)' }}>{chosen.auth}</p>
          </>
        ) : (
          <p style={{ margin: 0, color: 'var(--ink-2)' }}>Choose a box (click, or Tab then Enter) to open its rule and the authority the flowchart cites.</p>
        )}
      </div>
    </div>
  );
}

export default function DefencesToNegligenceFlowchart() {
  return (
    <Diagram
      label="Defences to negligence: an interactive decision flow from the textbook flowcharts"
      terms={[
        { term: 'Contributory negligence', def: "The plaintiff's own lack of care: a partial reduction in damages on what is just and equitable." },
        { term: 'Volenti non fit injuria', def: 'Voluntary assumption of risk: a complete defence to negligence.' },
        { term: 'Just and equitable', def: "The measure of the reduction, having regard to the plaintiff's share in the responsibility." },
        { term: 'Specific risk', def: 'Volenti is confined to the risk that materialised, not the general nature of the risk.' },
      ]}
      figure={<FlowFigure />}
      steps={[
        { caption: "The plaintiff's own conduct is in issue. The flowcharts split it two ways: contributory negligence (a partial reduction) and voluntary assumption of risk (a complete defence)." },
        { caption: 'Contributory negligence has seven boxes: just and equitable (Pennington v Norris), standard of care (s 5R), causation (Caswell), employees, agony of the moment, rescuers (s 56) and intoxication (s 50).' },
        { caption: 'Volenti: the defendant must show the plaintiff perceived, fully appreciated and voluntarily accepted the specific risk. Its boxes: knowledge of risk, intoxicated drivers, legislative reform (s 5L) and illegality.' },
        { caption: 'The exits: damages reduced on what is just and equitable (LRMPA s 9(1)), or the claim defeated. Choose any box to open its rule.' },
      ]}
      check={{
        question: 'A plaintiff fully appreciated and voluntarily accepted the specific risk that injured her. Where does the flowchart send the case?',
        options: [
          { text: 'Damages reduced on what is just and equitable', why: 'That is the contributory negligence exit. Proof of full appreciation and voluntary acceptance of the specific risk is the volenti branch.' },
          { text: 'Claim defeated: volenti is a complete defence', correct: true, why: 'The defendant has shown what volenti needs, and volenti operates as a complete defence to negligence.' },
          { text: 'Damages reduced by at least 25% under s 50', why: 'The 25% floor belongs to the s 50 intoxication presumption, on the contributory negligence chart.' },
        ],
      }}
    />
  );
}
