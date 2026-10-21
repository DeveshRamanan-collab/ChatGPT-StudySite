/*
SCENE: Duty for the conduct of third parties — the triangle
LENGTH: 5 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: Show that a duty for a third party's conduct needs an edge in the triangle — control of the third party
  (Dorset Yacht) or a protective relationship with the plaintiff — that policy can cut the scope short, and that
  with neither edge there is no duty (Modbury); Refrigerated Roadways shows a duty where the risk was not only criminal.
SUBJECT: the triangle's edges; each draws on in turn with its case.
STEPS: 1 the triangle (third party → plaintiff) · 2 control edge (Dorset Yacht) · 3 the scope limit · 4 the missing
  edges (Modbury) · 5 side note: RTA v Refrigerated Roadways.
REDUCED MOTION: the finished diagram with all five captions stacked.
BUDGET: < 12 KB gz (DrawSVG is in the shared motion chunk). Narrow 360-unit canvas, vertical layout, ≥ 13px text.
Source: concept card laws2400-w08-third-party-conduct-dorset-yacht-and-modbury; cases
  home-office-v-dorset-yacht-co-ltd, modbury-triangle-shopping-centre-v-anzil, rta-v-refrigerated-roadways
  (Topic 8 Lecture 2 slides 17–20; Lecture 1 slides 30–33).
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const ui = { fontFamily: 'var(--font-ui)' } as const;

function Node({ x, y, title, id }: { x: number; y: number; title: string; id: string }) {
  return (
    <>
      <rect x={x} y={y} width="136" height="44" rx="10" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x={x + 68} y={y + 27} textAnchor="middle" {...ui} fontSize="13" letterSpacing="1.2" fill="var(--ink)" data-label={id}>{title}</text>
    </>
  );
}

const figure = (
  <svg viewBox={`0 0 ${W} 620`} role="img" aria-label="A triangle of defendant, third party and plaintiff: control of the third party founds a duty in Dorset Yacht, limited in scope; with no control and no protective relationship there is no duty in Modbury">
    <g data-step="1">
      <Node x={112} y={10} title="DEFENDANT" id="defendant" />
      <Node x={8} y={180} title="THIRD PARTY" id="third-party" />
      <Node x={216} y={180} title="PLAINTIFF" id="plaintiff" />
      <line x1="144" y1="202" x2="210" y2="202" stroke="var(--ink)" strokeWidth="1.5" />
      <polyline points="202,196 210,202 202,208" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="180" y="244" textAnchor="middle" {...ui} fontSize="13" fill="var(--ink-2)">causes the harm</text>
    </g>
    <g data-step="2">
      <line x1="150" y1="54" x2="90" y2="180" stroke="var(--ink)" strokeWidth="2" />
      <text x="16" y="104" {...ui} fontSize="13" fill="var(--ink)">control</text>
      <text x="16" y="122" {...ui} fontSize="13" fill="var(--ink-2)">Dorset Yacht</text>
    </g>
    <g data-step="3">
      <rect x="8" y="270" width={W - 16} height="96" rx="10" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="6 6" />
      <text x={W / 2} y="296" textAnchor="middle" {...ui} fontSize="13" letterSpacing="1.2" fill="var(--ink)" data-label="scope">SCOPE OF THE DUTY</text>
      <text x={W / 2} y="320" textAnchor="middle" fontFamily="var(--font-body)" fontSize="15" fill="var(--ink-2)">near the escape, just after it: covered</text>
      <text x={W / 2} y="344" textAnchor="middle" fontFamily="var(--font-body)" fontSize="15" fill="var(--ink-2)">later, while at large: no duty (policy)</text>
    </g>
    <g data-step="4">
      <line x1="210" y1="54" x2="270" y2="180" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="5 5" />
      <text x="250" y="104" {...ui} fontSize="13" fill="var(--ink)">protective</text>
      <text x="250" y="122" {...ui} fontSize="13" fill="var(--ink)">relationship?</text>
      <rect x="8" y="388" width={W - 16} height="104" rx="10" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x={W / 2} y="414" textAnchor="middle" {...ui} fontSize="13" letterSpacing="1.2" fill="var(--ink)" data-label="modbury">MODBURY TRIANGLE</text>
      <text x={W / 2} y="438" textAnchor="middle" fontFamily="var(--font-body)" fontSize="15" fill="var(--ink-2)">no control of the attackers,</text>
      <text x={W / 2} y="460" textAnchor="middle" fontFamily="var(--font-body)" fontSize="15" fill="var(--ink-2)">no protective relationship, risk not</text>
      <text x={W / 2} y="482" textAnchor="middle" fontFamily="var(--font-body)" fontSize="15" fill="var(--ink-2)">created — no duty</text>
    </g>
    <g data-step="5">
      <rect x="8" y="514" width={W - 16} height="96" rx="10" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="6 6" />
      <text x={W / 2} y="540" textAnchor="middle" {...ui} fontSize="13" letterSpacing="1.2" fill="var(--ink)" data-label="rta">RTA v REFRIGERATED ROADWAYS</text>
      <text x={W / 2} y="564" textAnchor="middle" fontFamily="var(--font-body)" fontSize="15" fill="var(--ink-2)">harm not only criminal; unique role;</text>
      <text x={W / 2} y="586" textAnchor="middle" fontFamily="var(--font-body)" fontSize="15" fill="var(--ink-2)">vulnerable drivers — duty (no breach)</text>
    </g>
  </svg>
);

export default function ThirdPartyConductDorsetYachtModbury() {
  return (
    <Diagram
      label="Duty for the conduct of third parties: Dorset Yacht and Modbury Triangle"
      terms={[
        { term: 'Third party', def: 'Someone other than the defendant whose conduct actually injures the plaintiff.' },
        { term: 'Control', def: 'The defendant’s control over the third party — the basis of the duty in Dorset Yacht.' },
        { term: 'Protective relationship', def: 'A pre-existing relationship that makes the defendant responsible for protecting the plaintiff.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'A third party’s conduct injures the plaintiff, but the plaintiff sues the defendant — often because the third party has no money to pay.' },
        { caption: 'A duty can arise where the defendant controls the third party. In Dorset Yacht the detention officers controlled the boys, and damage on escape was reasonably foreseeable.' },
        { caption: 'Policy limits the scope: damage in the vicinity immediately after the escape was covered; further damage while the boys remained at large was not (indeterminate liability).' },
        { caption: 'With neither edge — no control over the attackers, no protective relationship — and a risk the defendant did not create, Modbury Triangle found no duty to protect against a stranger’s crime.' },
        { caption: 'Refrigerated Roadways distinguished Modbury: harm from objects falling off an overpass was not only criminal, the RTA had a unique role and drivers were vulnerable. Duty, but no breach.' },
      ]}
      check={{
        question: 'Why did Dorset Yacht find a duty when Modbury Triangle did not?',
        options: [
          { text: 'The Home Office controlled the boys; the shopping centre had no control over the attackers and no protective relationship', correct: true, why: 'Control of the third party is the edge Dorset Yacht had and Modbury lacked.' },
          { text: 'The damage in Dorset Yacht was foreseeable; the attack in Modbury was not', why: 'Foreseeability is necessary in both, but the cases turn on control and relationship, not on foreseeability alone.' },
          { text: 'Dorset Yacht involved property damage, and Modbury only pure economic loss', why: 'Anzil suffered physical injury from an assault; the type of harm is not the difference.' },
        ],
      }}
    />
  );
}
