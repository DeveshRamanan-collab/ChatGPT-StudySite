/*
SCENE: Trespass to land — the textbook flowchart (Tort Law Principles 3e, p 142) as an interactive decision flow
LENGTH: 7 steps, scroll-drawn when pinned (7 × 80vh); Next/Back otherwise (Diagram base)
BEATS: 7
INTENT: Show trespass to land as five gates in order, each with a "no" exit, so the learner sees that the first gate
  the facts fail ends the claim — and that an indirect interference exits towards private nuisance.
SUBJECT: the spine running from the definition down through the five gates to "actionable per se".
BEAT 1 (0–14%): the definition box (Barker v The Queen; Roy v O'Neill). Strokes draw on (DrawSVG, ease none); text fades.
BEAT 2 (14–29%): gate 1, exclusive possession ("title to sue"), and its exit: no title to sue (eg a licensee).
BEAT 3 (29–43%): gate 2, of land (airspace, fixtures, subsoil), and its exit: not land (high overflight, Bernstein).
BEAT 4 (43–57%): gate 3, direct invasion or interference, and its exit: indirect — consider private nuisance.
BEAT 5 (57–71%): gate 4, fault, and its exit: involuntary conduct, utterly without fault, is not actionable.
BEAT 6 (71–86%): gate 5, without lawful authority, justification or excuse, and its exit: consent, licence or excuse.
BEAT 7 (86–100%): the verdict — actionable per se — and the three remedies (natural and probable losses; user fee;
  injunction for a continuing or threatened trespass).
INTERACTION: each drawn gate is a switch (click, or Tab then Space/Enter) between yes and no. The first "no" lights
  its exit box and dims everything after it; the outcome line beside the figure updates in the same frame. Six fact
  patterns set the gates in one press and say why. Gates not yet drawn are inert (tabIndex -1, no pointer events);
  the fact patterns wait until the whole flow is drawn. Hover fill only for a mouse pointer; press = scale(0.97)
  160 ms (not in motion off); keyboard focus = 2px accent stroke. Dimming is an opacity change (180 ms).
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: the finished flow with all seven captions stacked (Diagram base off state); every switch still works.
BUDGET: < 12 KB gz (DrawSVG is in the shared motion chunk); 360-unit canvas so 12px type survives phone width.
Source: concept laws2400-w03-trespass-to-land-decision-flow; Topic 3 flowchart p 142; week 3 lecture slides 8, 12–14
  (Bernstein, cranes, implied licence) and the casebook extracts of Bernstein v Skyviews and Roy v O'Neill. Cases appear
  only for the propositions those materials give them.
*/
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Diagram } from '../bases/Diagram';
import { useExplainer } from '../context';

const ui = { fontFamily: 'var(--font-ui)' } as const;
const N = 7; // diagram steps
const GY = (i: number) => 120 + i * 70; // top of gate i
const GATE_H = 56;

interface Gate { title: string; q: [string, string]; exit: string[]; outcome: string; rule: string; auth: string }

const GATES: Gate[] = [
  {
    title: 'Exclusive possession', q: ['In possession when the', 'interference happened?'], exit: ['No title', 'to sue', '(eg a licensee)'],
    outcome: 'no title to sue in trespass.',
    rule: "Often referred to as 'title to sue': the plaintiff must be in possession when the interference is said to have taken place — by title, by consent under a lease, or by adverse possession. Licences typically will not confer exclusive possession; an owner whose tenant stays on after the lease ends must retake possession to sue.",
    auth: 'Tort Law Principles 3e, p 142 (flowchart)',
  },
  {
    title: 'Of land', q: ['Land, incl. airspace,', 'fixtures or subsoil?'], exit: ['Not land:', 'high airspace', '(Bernstein)'],
    outcome: 'not an interference with land.',
    rule: 'Can extend to invasion or other direct interference with possession of airspace, fixtures or subsoil — but airspace only up to the height necessary for the ordinary use and enjoyment of the land.',
    auth: 'Flowchart p 142; Bernstein v Skyviews & General Ltd [1977] 2 All ER 902',
  },
  {
    title: 'Direct interference', q: ['Direct? Incl. exceeding a', 'licence, or after it ends'], exit: ['Indirect:', 'consider private', 'nuisance'],
    outcome: 'the interference is indirect — consider private nuisance instead.',
    rule: 'Can include exceeding the terms of a licence, or going beyond its expiry or revocation. Indirect interference may constitute another tort, such as private nuisance.',
    auth: "Flowchart p 142; Roy v O'Neill (licence concluded, exceeded or revoked)",
  },
  {
    title: 'Fault', q: ['Intentional or negligent', 'act? (mistake no excuse)'], exit: ['Involuntary,', 'without fault:', 'not actionable'],
    outcome: 'involuntary conduct, utterly without fault, is not actionable.',
    rule: 'The act constituting the trespassory conduct must be intentional or negligent. The defendant need not intend to trespass, and mistake is generally not a defence. Involuntary conduct, where the defendant is utterly without fault, is not actionable.',
    auth: 'Tort Law Principles 3e, p 142 (flowchart)',
  },
  {
    title: 'No lawful authority', q: ['Without lawful authority,', 'justification or excuse?'], exit: ['Consent,', 'licence or', 'lawful excuse'],
    outcome: 'consent, a licence or another lawful excuse answers the claim.',
    rule: 'Entry must be justified by lawful authority, including consent or licence — such as the implied licence to approach the front door for lawful communication — or another lawful excuse, such as the exercise of a lawful duty.',
    auth: "Roy v O'Neill; Halliday v Nevill (1984) 155 CLR 1; lecture 1, slide 6",
  },
];

interface Facts { id: string; label: string; facts: string; ans: boolean[]; why: string }

const ALL = [true, true, true, true, true];
const no = (i: number) => ALL.map((_, k) => k !== i);
const FACTS: Facts[] = [
  { id: 'guest', label: 'Guest sues', ans: no(0), facts: 'A house guest sues a neighbour who cut across the lawn.',
    why: 'A guest is a licensee, and licences typically will not confer exclusive possession.' },
  { id: 'plane', label: 'Overflight', ans: no(1), facts: 'A plane photographs the house from several hundred feet up.',
    why: 'Bernstein v Skyviews: rights in airspace reach only the height needed for the ordinary use and enjoyment of the land.' },
  { id: 'dust', label: 'Drifting dust', ans: no(2), facts: "Dust from next door's renovation settles on the garden each day.",
    why: 'Indirect interference may constitute another tort, such as private nuisance.' },
  { id: 'shove', label: 'Shoved in', ans: no(3), facts: "A stranger shoves D through P's open gate onto the lawn.",
    why: 'D did no intentional or negligent act: involuntary conduct, utterly without fault, is not actionable.' },
  { id: 'courier', label: 'Courier knocks', ans: no(4), facts: 'A courier walks up an open, unsigned path to deliver a parcel.',
    why: 'Halliday v Nevill: an unobstructed path carries an implied licence to approach for lawful communication or delivery.' },
  { id: 'stay', label: 'Told to leave', ans: ALL, facts: 'A visitor stays on after the occupier revokes permission to remain.',
    why: 'Going beyond the revocation of a licence is a direct interference, and every gate passes.' },
];

function Lines({ x, y, lines, size = 12, anchor = 'middle', fill = 'var(--ink-2)', gap = 15, weight }: {
  x: number; y: number; lines: string[]; size?: number; anchor?: 'middle' | 'start' | 'end'; fill?: string; gap?: number; weight?: number;
}) {
  return (
    <>
      {lines.map((l, i) => (
        <text key={i} x={x} y={y + i * gap} textAnchor={anchor} {...ui} fontSize={size} fill={fill} fontWeight={weight}>{l}</text>
      ))}
    </>
  );
}

const fade = (motion: string) => ({ transition: motion === 'off' ? undefined : 'opacity 180ms var(--ease-out)' });

function GateSwitch({ i, yes, shown, dim, selected, onToggle }: {
  i: number; yes: boolean; shown: boolean; dim: boolean; selected: boolean; onToggle: (i: number) => void;
}) {
  const { motion } = useExplainer();
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const [down, setDown] = useState(false);
  const g = GATES[i];
  const y = GY(i);
  const key = (e: KeyboardEvent<SVGGElement>) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(i); }
  };
  return (
    <g
      role="switch"
      tabIndex={shown ? 0 : -1}
      aria-checked={yes}
      aria-hidden={shown ? undefined : true}
      aria-label={`Gate ${i + 1}, ${g.title}: ${g.q.join(' ')}`}
      data-gate={i + 1}
      onClick={() => onToggle(i)}
      onKeyDown={key}
      onFocus={(e) => setFocus(e.currentTarget.matches(':focus-visible'))}
      onBlur={() => setFocus(false)}
      onPointerEnter={(e) => setHover(e.pointerType === 'mouse')}
      onPointerLeave={() => { setHover(false); setDown(false); }}
      onPointerDown={() => setDown(true)}
      onPointerUp={() => setDown(false)}
      style={{
        cursor: shown ? 'pointer' : 'default', pointerEvents: shown ? 'auto' : 'none', outline: 'none',
        opacity: dim ? 0.35 : 1, transformBox: 'fill-box', transformOrigin: 'center',
        transform: down && motion !== 'off' ? 'scale(0.97)' : 'none',
        transition: motion === 'off' ? undefined : 'transform 160ms var(--ease-out), opacity 180ms var(--ease-out)',
      }}
    >
      <rect x="32" y={y} width="196" height={GATE_H} rx="8" pointerEvents="all"
        fill={hover || selected ? 'var(--paper-3)' : 'none'}
        stroke={focus ? 'var(--accent)' : selected || !yes ? 'var(--ink)' : 'var(--ink-3)'}
        strokeWidth={focus || selected || !yes ? 2 : 1.5} />
      <text x="44" y={y + 21} {...ui} fontSize="12.5" fontWeight="600" fill="var(--ink)" data-label={`gate${i + 1}`}>{g.title}</text>
      <text x="218" y={y + 21} textAnchor="end" fontFamily="var(--font-mono)" fontSize="11" letterSpacing="0.8"
        fill={yes ? 'var(--ink-2)' : 'var(--ink)'} fontWeight={yes ? 400 : 700}>{yes ? 'YES' : 'NO'}</text>
      <Lines x={44} y={y + 37} lines={g.q} size={11.5} anchor="start" gap={14} />
    </g>
  );
}

function Exit({ i, active, dim }: { i: number; active: boolean; dim: boolean }) {
  const { motion } = useExplainer();
  const y = GY(i);
  const mid = y + GATE_H / 2;
  return (
    <g style={{ opacity: dim ? 0.35 : 1, ...fade(motion) }}>
      <line x1="228" y1={mid} x2="244" y2={mid} stroke={active ? 'var(--ink)' : 'var(--ink-3)'} strokeWidth="1.5" />
      <polyline points={`238,${mid - 4} 244,${mid} 238,${mid + 4}`} fill="none" stroke={active ? 'var(--ink)' : 'var(--ink-3)'} strokeWidth="1.5" />
      <text x="236" y={mid - 7} textAnchor="middle" {...ui} fontSize="10" fill="var(--ink-2)">no</text>
      <rect x="246" y={y} width="106" height={GATE_H} rx="8" fill={active ? 'var(--paper-3)' : 'none'}
        stroke={active ? 'var(--ink)' : 'var(--ink-3)'} strokeWidth={active ? 2 : 1.2} />
      <Lines x={299} y={y + 19} lines={GATES[i].exit} size={11} gap={14} fill={active ? 'var(--ink)' : 'var(--ink-2)'} weight={active ? 600 : undefined} />
    </g>
  );
}

function FlowFigure() {
  const { motion } = useExplainer();
  const root = useRef<HTMLDivElement>(null);
  const [ans, setAns] = useState<boolean[]>(ALL);
  const [sel, setSel] = useState<number | null>(null);
  const [facts, setFacts] = useState<string | null>(null);
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

  const first = ans.indexOf(false); // the first gate the facts fail; -1 = trespass made out
  const toggle = (i: number) => {
    setAns((a) => a.map((v, k) => (k === i ? !v : v)));
    setSel(i);
    setFacts(null);
  };
  const pick = (f: Facts) => {
    setAns(f.ans);
    setFacts(f.id);
    const k = f.ans.indexOf(false);
    setSel(k < 0 ? null : k);
  };
  const chosen = FACTS.find((f) => f.id === facts);
  const gate = sel !== null && now >= sel + 2 ? GATES[sel] : null;
  const allDrawn = now >= N;
  const spineTop = (i: number) => (i === 0 ? 106 : GY(i - 1) + GATE_H / 2);
  const verdictDim = first >= 0;

  return (
    <div ref={root} style={{ width: '100%', display: 'flex', flexWrap: 'wrap', gap: 'var(--s-5)', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ flex: '1 1 300px', maxWidth: 400 }}>
        <svg viewBox="0 0 360 610" role="group" style={{ maxHeight: '62vh' }}
          aria-label="Trespass to land as five gates in order — exclusive possession, of land, direct interference, fault, no lawful authority — each with a 'no' exit, ending in 'actionable per se' and three remedies. Each gate is a yes/no switch.">
          <g data-step="1">
            <rect x="8" y="4" width="344" height="102" rx="12" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
            <text x="180" y="26" textAnchor="middle" {...ui} fontSize="12.5" letterSpacing="1.2" fill="var(--ink)" data-label="definition">TRESPASS TO LAND</text>
            <Lines x={180} y={46} lines={['direct, intentional or negligent interference', "with land in the plaintiff's possession, without", 'lawful authority, justification or excuse']} size={12.5} fill="var(--ink)" gap={16} />
            <Lines x={180} y={95} lines={["Barker v The Queen · Roy v O'Neill"]} size={11} />
          </g>
          {GATES.map((_, i) => (
            <g key={i} data-step={i + 2}>
              <line x1="20" y1={spineTop(i)} x2="20" y2={GY(i) + GATE_H / 2} stroke="var(--ink-3)" strokeWidth="1.5" />
              <line x1="20" y1={GY(i) + GATE_H / 2} x2="32" y2={GY(i) + GATE_H / 2} stroke="var(--ink-3)" strokeWidth="1.5" />
              <GateSwitch i={i} yes={ans[i]} shown={now >= i + 2} dim={first >= 0 && i > first} selected={sel === i} onToggle={toggle} />
              <Exit i={i} active={first === i} dim={first >= 0 && i > first} />
            </g>
          ))}
          <g data-step="7">
            <g style={{ opacity: verdictDim ? 0.35 : 1, ...fade(motion) }}>
              <path d={`M20 ${GY(4) + GATE_H / 2} V462 H180 V476`} fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
              <polyline points="176,470 180,476 184,470" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
              <rect x="8" y="478" width="344" height="46" rx="12" fill={!verdictDim && allDrawn ? 'var(--paper-3)' : 'none'} stroke="var(--ink)" strokeWidth="2" />
              <text x="180" y="498" textAnchor="middle" {...ui} fontSize="12.5" letterSpacing="1.2" fill="var(--ink)" data-label="per-se">TRESPASS · ACTIONABLE PER SE</text>
              <Lines x={180} y={515} lines={['no damage need be proved']} size={11.5} />
              <path d="M180 524 V532 M62 532 H298 M62 532 V540 M180 532 V540 M298 532 V540" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
              {[
                { x: 8, lines: ['Damages:', 'natural and', 'probable losses'] },
                { x: 126, lines: ['or damages on', "the 'user fee'", 'principle'] },
                { x: 244, lines: ['Injunction:', 'continuing or', 'threatened'] },
              ].map((r) => (
                <g key={r.x}>
                  <rect x={r.x} y="540" width="108" height="62" rx="8" fill="none" stroke="var(--ink-2)" strokeWidth="1.2" />
                  <Lines x={r.x + 54} y={558} lines={r.lines} size={11.5} gap={15} fill="var(--ink)" />
                </g>
              ))}
            </g>
          </g>
        </svg>
      </div>
      <div style={{ flex: '1 1 220px', maxWidth: 320, fontFamily: 'var(--font-ui)', fontSize: 'var(--t-sm)', lineHeight: 1.45, textAlign: 'left' }}>
        <p className="label" style={{ margin: 0 }}>Outcome</p>
        <p aria-live="polite" style={{ margin: 'var(--s-1) 0 var(--s-3)', fontWeight: 600, color: 'var(--ink)', minHeight: '2.9em' }}>
          {first < 0
            ? 'Every gate passes: trespass to land, actionable per se. Move to remedies.'
            : `Exits at gate ${first + 1}, ${GATES[first].title.toLowerCase()}: ${GATES[first].outcome}`}
        </p>
        <div style={{ minHeight: '7.5em' }}>
          {chosen ? (
            <>
              <p style={{ margin: 0, color: 'var(--ink)' }}>{chosen.facts}</p>
              <p style={{ margin: 'var(--s-1) 0 0', color: 'var(--ink-2)' }}>{chosen.why}</p>
            </>
          ) : gate ? (
            <>
              <p style={{ margin: 0, color: 'var(--ink)' }}>{gate.rule}</p>
              <p className="mono" style={{ margin: 'var(--s-1) 0 0', fontSize: 'var(--t-xs)', color: 'var(--ink-2)' }}>{gate.auth}</p>
            </>
          ) : (
            <p style={{ margin: 0, color: 'var(--ink-2)' }}>Switch any gate to NO (click, or Tab then Space) to see where the flow exits — or try a fact pattern.</p>
          )}
        </div>
        <p className="label" style={{ margin: 'var(--s-3) 0 var(--s-1)' }}>Try facts</p>
        <div role="group" aria-label="Fact patterns" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--s-1)' }}>
          {FACTS.map((f) => (
            <button key={f.id} type="button" disabled={!allDrawn} aria-pressed={facts === f.id}
              className={facts === f.id ? 'btn btn--secondary btn--sm' : 'btn btn--ghost btn--sm'} onClick={() => pick(f)}>
              {f.label}
            </button>
          ))}
        </div>
        {!allDrawn && <p style={{ margin: 'var(--s-1) 0 0', fontSize: 'var(--t-xs)', color: 'var(--ink-2)' }}>The fact patterns open once the whole flow is drawn.</p>}
      </div>
    </div>
  );
}

export default function TrespassToLandDecisionFlow() {
  return (
    <Diagram
      label="Trespass to land: an interactive decision flow from the textbook flowchart"
      terms={[
        { term: 'Title to sue', def: 'Exclusive possession of the land at the time of the interference — not ownership.' },
        { term: 'Licence', def: 'Permission to be on land. It typically gives no exclusive possession, and can be exceeded, expire or be revoked.' },
        { term: 'Actionable per se', def: 'Actionable without proof of damage.' },
        { term: 'Involuntary conduct', def: 'Conduct where the defendant is utterly without fault; not actionable in trespass.' },
      ]}
      figure={<FlowFigure />}
      steps={[
        { caption: "The flowchart's definition: a direct, intentional or negligent invasion of land in the plaintiff's possession, without lawful authority, justification or excuse. Its general principles run as five gates." },
        { caption: "Gate 1, exclusive possession ('title to sue'): possession at the time of the interference — by title, by a lease, or by adverse possession. A licence typically does not give it." },
        { caption: 'Gate 2, of land: it extends to airspace, fixtures and subsoil — airspace only as high as the ordinary use and enjoyment of the land needs (Bernstein v Skyviews).' },
        { caption: 'Gate 3, direct interference: it includes exceeding a licence, or going beyond its expiry or revocation. An indirect interference exits here, towards private nuisance.' },
        { caption: 'Gate 4, fault: an intentional or negligent act. No intention to trespass is needed and mistake is generally no defence, but involuntary conduct, utterly without fault, is not actionable.' },
        { caption: 'Gate 5, without lawful authority, justification or excuse: consent, a licence (express or implied) or another lawful excuse answers the claim.' },
        { caption: "Every gate passed: trespass is actionable per se. Damages for natural and probable losses, or on the 'user fee' principle; an injunction for a continuing or threatened trespass. Now switch a gate, or try a fact pattern." },
      ]}
      check={{
        question: "Smoke from a neighbour's incinerator drifts across P's garden most evenings. Where does a claim in trespass to land leave the flow?",
        options: [
          { text: 'Gate 1: P has no title to sue', why: 'Nothing suggests P lacks possession of the garden; the problem is how the smoke arrives, which is gate 3.' },
          { text: 'Gate 3: the interference is indirect, so consider private nuisance', correct: true, why: 'Drifting smoke is an indirect interference, which the flowchart says may constitute another tort such as private nuisance.' },
          { text: 'Gate 4: the neighbour never intended to trespass', why: 'The fault gate needs only an intentional or negligent act; the defendant need not intend to trespass.' },
        ],
      }}
    />
  );
}
