/*
SCENE: Volenti and legislation — the common law gate, narrowed one way and widened the other by statute
LENGTH: 4 screens pinned (desktop, full motion); 4 paced beats otherwise (ScrollExplainer base)
BEATS: 4
INTENT: Show that statute reshapes common law volenti in opposite directions: it is excluded for passengers who rely
  on an intoxicated driver, and expanded by CLA s 5L, which applies whether or not the plaintiff was aware of the risk.
SUBJECT: the gate in each lane — its opening is how far the defence reaches.
BEAT 1 (0–25%): centre lane, common law volenti: a narrow opening (perceived, fully appreciated, voluntarily
  accepted the specific risk). Opacity fade, ease none (scrubbed).
BEAT 2 (25–50%): left lane, intoxicated drivers and passengers: the gate barred (courts reluctant; legislation such
  as Motor Accidents Act 1988 (NSW) s 76 excludes the defence).
BEAT 3 (50–75%): right lane, CLA s 5L: a wide opening (no liability for the materialisation of an obvious risk of a
  dangerous recreational activity engaged in by the plaintiff).
BEAT 4 (75–100%): the s 5L(2) note — whether or not the plaintiff was aware of the risk — and Tapp for guidance.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: final frame with all four captions stacked (base).
BUDGET: < 10 KB gz; no WebGL.
Source: Tort Law Principles 3e p 479 flowchart; CLA s 5L (act-2002-022.pdf); concept laws2400-w12-volenti-and-legislation.
  The Motor Accidents Act 1988 (NSW) s 76 text is not in the materials: it is named, not quoted.
*/
import { ScrollExplainer } from '../bases/ScrollExplainer';

const fade = (on: boolean) => ({ opacity: on ? 1 : 0, transition: 'opacity 240ms var(--ease-out)' });
const ui = { fontFamily: 'var(--font-ui)', fill: 'var(--ink)' } as const;

function Gate({ cx, y, open, closed }: { cx: number; y: number; open: number; closed?: boolean }) {
  const l = cx - open / 2 - 8, r = cx + open / 2;
  return (
    <g>
      <rect x={l} y={y} width="8" height="46" fill="var(--ink)" />
      <rect x={r} y={y} width="8" height="46" fill="var(--ink)" />
      {closed ? (
        <>
          <line x1={l + 8} y1={y + 23} x2={r} y2={y + 23} stroke="var(--clay)" strokeWidth="4" />
          <text x={cx} y={y + 66} textAnchor="middle" {...ui} fontSize="11" letterSpacing="1" fill="var(--ink-2)">EXCLUDED</text>
        </>
      ) : (
        <path d={`M${cx} ${y - 14} V${y + 58} M${cx - 6} ${y + 50} L${cx} ${y + 58} L${cx + 6} ${y + 50}`} fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
      )}
    </g>
  );
}

const LANES = [
  { key: 'common', at: 0.05, title: 'COMMON LAW VOLENTI', open: 24, lines: ['defendant must show the', 'plaintiff perceived, fully', 'appreciated and voluntarily', 'accepted the specific risk'] },
  { key: 'narrow', at: 1.05, title: 'INTOXICATED DRIVERS', open: 24, closed: true, lines: ['courts generally reluctant;', 'legislation may exclude it —', 'eg Motor Accidents Act', '1988 (NSW) s 76'] },
  { key: 'wide', at: 2.05, title: 'CLA s 5L', open: 120, lines: ['no liability for an obvious', 'risk of a dangerous', 'recreational activity', 'engaged in by the plaintiff'] },
] as const;

function wide(t: number) {
  const X = { narrow: 130, common: 390, wide: 650 } as const;
  return (
    <svg className="x-wide" viewBox="0 0 780 320" role="img" aria-label="Three lanes: common law volenti with a narrow gate; passengers of intoxicated drivers with the gate barred; CLA s 5L with a wide gate">
      {LANES.map((ln) => {
        const cx = X[ln.key];
        return (
          <g key={ln.key} style={fade(t >= ln.at)} data-lane={ln.key}>
            <text x={cx} y="40" textAnchor="middle" {...ui} fontSize="12.5" letterSpacing="1.2">{ln.title}</text>
            <Gate cx={cx} y={72} open={ln.open} closed={'closed' in ln ? ln.closed : false} />
            {ln.lines.map((l, i) => <text key={l} x={cx} y={168 + i * 18} textAnchor="middle" {...ui} fontSize="13" fill="var(--ink-2)">{l}</text>)}
          </g>
        );
      })}
      <g style={fade(t >= 3.05)} data-lane="awareness">
        <line x1="40" y1="256" x2="740" y2="256" stroke="var(--line)" strokeWidth="1" />
        <text x="390" y="282" textAnchor="middle" {...ui} fontSize="13">s 5L(2): it applies whether or not the plaintiff was aware of the risk — unlike common law volenti.</text>
        <text x="390" y="304" textAnchor="middle" {...ui} fontSize="12" fill="var(--ink-2)">{"Guidance on applying it: Tapp v Australian Bushmen's Campdraft & Rodeo Association Ltd (2022) 273 CLR 454"}</text>
      </g>
    </svg>
  );
}

function tall(t: number) {
  const order = ['common', 'narrow', 'wide'] as const;
  return (
    <svg className="x-tall" viewBox="0 0 360 620" role="img" aria-label="Three stacked lanes: common law volenti with a narrow gate; passengers of intoxicated drivers barred; CLA s 5L with a wide gate">
      {order.map((k, i) => {
        const ln = LANES.find((x) => x.key === k)!;
        const y0 = 8 + i * 170;
        return (
          <g key={k} style={fade(t >= ln.at)} data-lane={k}>
            <text x="12" y={y0 + 16} {...ui} fontSize="12" letterSpacing="1.2">{ln.title}</text>
            <Gate cx={80} y={y0 + 40} open={Math.min(ln.open, 90)} closed={'closed' in ln ? ln.closed : false} />
            {ln.lines.map((l, j) => <text key={l} x="150" y={y0 + 46 + j * 18} {...ui} fontSize="13" fill="var(--ink-2)">{l}</text>)}
          </g>
        );
      })}
      <g style={fade(t >= 3.05)} data-lane="awareness">
        <line x1="12" y1="520" x2="348" y2="520" stroke="var(--line)" strokeWidth="1" />
        <text x="12" y="544" {...ui} fontSize="13">s 5L(2): whether or not the plaintiff</text>
        <text x="12" y="562" {...ui} fontSize="13">was aware of the risk.</text>
        <text x="12" y="588" {...ui} fontSize="12" fill="var(--ink-2)">Guidance: Tapp v Australian Bushmen's Campdraft</text>
        <text x="12" y="606" {...ui} fontSize="12" fill="var(--ink-2)">{'& Rodeo Association Ltd (2022) 273 CLR 454'}</text>
      </g>
    </svg>
  );
}

function scene(t: number) {
  return <>{wide(t)}{tall(t)}</>;
}

export default function VolentiAndLegislation() {
  return (
    <ScrollExplainer
      label="Volenti and legislation: excluded for passengers of intoxicated drivers, expanded by CLA s 5L"
      terms={[
        { term: 'Volenti non fit injuria', def: 'Voluntary assumption of risk: a complete defence, confined to the specific risk.' },
        { term: 'Obvious risk', def: 'The kind of risk s 5L speaks of, for a dangerous recreational activity.' },
        { term: 'Dangerous recreational activity', def: 'The activity s 5L covers: harm from its obvious risks brings no liability.' },
      ]}
      beats={[
        { caption: 'Common law volenti is narrow: the defendant must show the plaintiff perceived, fully appreciated and voluntarily accepted the specific risk.' },
        { caption: 'Narrowed: courts are generally reluctant to allow volenti against passengers who rely on an intoxicated driver, and legislation in some jurisdictions excludes it (eg Motor Accidents Act 1988 (NSW) s 76).' },
        { caption: 'Expanded: under CLA s 5L a defendant is not liable for harm from the materialisation of an obvious risk of a dangerous recreational activity engaged in by the plaintiff.' },
        { caption: "Section 5L(2): this applies whether or not the plaintiff was aware of the risk. For guidance on applying it, the flowchart cites Tapp (2022) 273 CLR 454." },
      ]}
      scene={scene}
      check={{
        question: 'A plaintiff who did not know of the risk is hurt when an obvious risk of a dangerous recreational activity she was doing materialises. What can still protect the defendant?',
        options: [
          { text: 'Common law volenti', why: 'Volenti needs the plaintiff to have perceived, fully appreciated and accepted the specific risk; she did not know of it.' },
          { text: 'CLA s 5L', correct: true, why: 'Section 5L(2) says it applies whether or not the plaintiff was aware of the risk.' },
          { text: 'Neither, since both depend on her knowledge', why: 'Only volenti depends on her knowledge; s 5L expressly does not.' },
        ],
      }}
    />
  );
}
