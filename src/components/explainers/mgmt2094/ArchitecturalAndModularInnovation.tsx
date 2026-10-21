/*
SCENE: Architectural vs modular innovation — redraw the structure, or swap one part
LENGTH: 5 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: Show the level of change: in architectural innovation the whole product structure is redrawn (phone →
  smartphone); in modular innovation the structure stays and one component technology is swapped (steam → fuel engine).
SUBJECT: what gets redrawn — the whole phone, versus only the engine box inside an unchanged car outline.
STEPS: 1 the mobile phone · 2 arrow → the smartphone (still a phone, new structure, more capabilities) · 3 the car with a
  steam engine · 4 the same car outline, only the engine box swapped to fuel · 5 the test.
REDUCED MOTION: the finished diagram with all five captions stacked.
BUDGET: < 6 KB gz (DrawSVG is in the shared motion chunk). 360-unit canvas, schematic line drawings only.
Source: concept mgmt2094-w11-architectural-and-modular-innovation (Week 11 slide 7; Week 9 recording); examples
  mobile-phone-to-smartphone, steam-to-fuel-engine.
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const ui = { fontFamily: 'var(--font-ui)' } as const;
const serif = { fontFamily: 'var(--font-body)' } as const;

function Car({ x, engine, faint }: { x: number; engine: string; faint?: boolean }) {
  const body = faint ? 'var(--ink-3)' : 'var(--ink)';
  return (
    <>
      <path d={`M${x} 330 L${x} 304 L${x + 30} 304 L${x + 46} 282 L${x + 104} 282 L${x + 120} 304 L${x + 148} 304 L${x + 148} 330 Z`} fill="none" stroke={body} strokeWidth="1.5" />
      <circle cx={x + 32} cy="334" r="11" fill="var(--paper-2)" stroke={body} strokeWidth="1.5" />
      <circle cx={x + 116} cy="334" r="11" fill="var(--paper-2)" stroke={body} strokeWidth="1.5" />
      <rect x={x + 6} y="308" width="44" height="18" rx="3" fill="var(--paper-3)" stroke="var(--ink)" strokeWidth="2" />
      <text x={x + 28} y="321" textAnchor="middle" {...ui} fontSize="11" fill="var(--ink)">{engine}</text>
    </>
  );
}

const keypad = Array.from({ length: 12 }, (_, i) => ({ x: 62 + (i % 3) * 13, y: 104 + Math.floor(i / 3) * 12 }));
const apps = Array.from({ length: 12 }, (_, i) => ({ x: 251 + (i % 3) * 13, y: 58 + Math.floor(i / 3) * 22 }));

const figure = (
  <svg viewBox={`0 0 ${W} 500`} role="img" aria-label="Top: a mobile phone redrawn as a smartphone, a change in product structure. Bottom: the same car outline twice, with only the engine swapped from steam to fuel, a change in component technology">
    <g data-step="1">
      <text x="8" y="18" {...ui} fontSize="11" letterSpacing="1.2" fill="var(--ink-2)">ARCHITECTURAL · CHANGE IN PRODUCT STRUCTURE</text>
      <rect x="54" y="42" width="52" height="118" rx="8" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <line x1="96" y1="42" x2="96" y2="30" stroke="var(--ink)" strokeWidth="1.5" />
      <rect x="62" y="52" width="36" height="40" rx="2" fill="none" stroke="var(--ink)" strokeWidth="1.2" />
      {keypad.map((k, i) => <rect key={i} x={k.x} y={k.y} width="9" height="7" rx="1.5" fill="none" stroke="var(--ink-2)" strokeWidth="1" />)}
      <text x="80" y="182" textAnchor="middle" {...serif} fontSize="15" fill="var(--ink)" data-label="mobile-phone">mobile phone</text>
    </g>
    <g data-step="2">
      <line x1="122" y1="100" x2="222" y2="100" stroke="var(--ink-2)" strokeWidth="1.5" />
      <polyline points="214,94 222,100 214,106" fill="none" stroke="var(--ink-2)" strokeWidth="1.5" />
      <text x="172" y="90" textAnchor="middle" {...ui} fontSize="12" fill="var(--ink-2)">structure redrawn</text>
      <rect x="242" y="42" width="56" height="118" rx="9" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <rect x="247" y="50" width="46" height="100" rx="3" fill="none" stroke="var(--ink)" strokeWidth="1.2" />
      {apps.map((a, i) => <rect key={i} x={a.x} y={a.y} width="9" height="9" rx="2" fill="none" stroke="var(--ink-2)" strokeWidth="1" />)}
      <text x="270" y="182" textAnchor="middle" {...serif} fontSize="15" fill="var(--ink)" data-label="smartphone">smartphone</text>
      <text x={W / 2} y="208" textAnchor="middle" {...ui} fontSize="12" fill="var(--ink-2)">still a phone: new structure, more capabilities</text>
    </g>
    <g data-step="3">
      <text x="8" y="252" {...ui} fontSize="11" letterSpacing="1.2" fill="var(--ink-2)">MODULAR · CHANGE IN COMPONENT TECHNOLOGY</text>
      <Car x={8} engine="steam" />
      <text x="82" y="368" textAnchor="middle" {...serif} fontSize="15" fill="var(--ink)" data-label="steam-engine">steam engine</text>
    </g>
    <g data-step="4">
      <line x1="164" y1="312" x2="190" y2="312" stroke="var(--ink-2)" strokeWidth="1.5" />
      <polyline points="183,306 190,312 183,318" fill="none" stroke="var(--ink-2)" strokeWidth="1.5" />
      <Car x={204} engine="fuel" faint />
      <text x="278" y="368" textAnchor="middle" {...serif} fontSize="15" fill="var(--ink)" data-label="fuel-engine">fuel engine</text>
      <text x={W / 2} y="394" textAnchor="middle" {...ui} fontSize="12" fill="var(--ink-2)">same car, same structure: one component swapped</text>
    </g>
    <g data-step="5">
      <rect x="8" y="418" width={W - 16} height="74" rx="10" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="22" y="444" {...ui} fontSize="13" fill="var(--ink)">Structure redrawn? → architectural</text>
      <text x="22" y="474" {...ui} fontSize="13" fill="var(--ink)">One part swapped, structure kept? → modular</text>
    </g>
  </svg>
);

export default function ArchitecturalAndModularInnovation() {
  return (
    <Diagram
      label="Architectural and modular innovation: the smartphone and the car engine"
      terms={[
        { term: 'Architectural innovation', def: 'A change in product structure: how the product is put together and what it can do.' },
        { term: 'Modular innovation', def: 'A change in component technology: one part replaced, the product and its structure kept.' },
        { term: 'Legacy product', def: 'The earlier product a new one grows out of, as the smartphone grows out of the phone.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'Start with the mobile phone: a small screen above a keypad.' },
        { caption: 'Architectural innovation redraws the structure: the smartphone is still a phone, but restructured, with many more capabilities. It departs quite a bit, yet grows out of the legacy product.' },
        { caption: 'Now a car, with a steam engine as one of its components.' },
        { caption: 'Modular innovation keeps the car and its structure (drawn faint: unchanged) and swaps one component technology — the steam engine becomes a fuel engine.' },
        { caption: 'The test is the level of change. Both are also product innovations; architectural and modular say what changed inside the product.' },
      ]}
      check={{
        question: 'An e-bike maker replaces its lead-acid battery with a lithium battery; frame, motor and controls are unchanged. Which is it?',
        options: [
          { text: 'Architectural innovation', why: 'Tempting because a better battery matters, but the bike\'s structure is unchanged; only one component is new.' },
          { text: 'Modular innovation', correct: true, why: 'One component technology changes inside the same product structure, like the steam engine becoming a fuel engine.' },
          { text: 'Process innovation', why: 'Tempting because the factory may change too, but the innovation is inside the product, not in how the firm works.' },
        ],
      }}
    />
  );
}
