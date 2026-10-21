/*
SCENE: Views of innovation — four sources wired to one innovation
LENGTH: 5 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: Sort the four views by the question each answers — society or the individual (who drives innovation?), the
  firm's resources or the market's conditions (where is its context?) — each with its slide example.
SUBJECT: the spine on the right that carries each source into the INNOVATION box.
STEPS: 1 the innovation box, with the popular (film) view outside the frame · 2 social deterministic (Covid) ·
  3 individualistic (born innovators; serendipity) · 4 resource-based (Starbucks) · 5 market-based (Share a Coke).
REDUCED MOTION: the finished diagram with all five captions stacked.
BUDGET: < 6 KB gz (DrawSVG is in the shared motion chunk). Vertical 360-unit layout so text stays legible on phones.
Source: concept mgmt2094-w11-views-of-innovation (Week 11 slide 3; Week 9 recording); examples covid-online-shift,
  starbucks, share-a-coke (verify), guest-founder-mark.
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const SPINE = 340;
const ui = { fontFamily: 'var(--font-ui)' } as const;
const serif = { fontFamily: 'var(--font-body)' } as const;

function Source({ y, title, lines, id }: { y: number; title: string; lines: string[]; id: string }) {
  const h = 34 + lines.length * 19;
  const mid = y + h / 2;
  return (
    <>
      <rect x="16" y={y} width={W - 56} height={h} rx="10" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="30" y={y + 24} {...serif} fontSize="16" fontWeight="600" fill="var(--ink)" data-label={id}>{title}</text>
      {lines.map((l, i) => (
        <text key={i} x="30" y={y + 46 + i * 19} {...ui} fontSize="13" fill="var(--ink-2)">{l}</text>
      ))}
      <line x1={W - 40} y1={mid} x2={SPINE} y2={mid} stroke="var(--ink-3)" strokeWidth="1.5" />
    </>
  );
}

const CENTRE = 300; // y of the innovation box's middle

const figure = (
  <svg viewBox={`0 0 ${W} 560`} role="img" aria-label="Four sources wired to one innovation: social deterministic and individualistic above it, resource-based and market-based below it; the popular film view sits outside the frame">
    <g data-step="1">
      <rect x="16" y="6" width={W - 32} height="48" rx="10" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="6 6" />
      <text x="30" y="26" {...ui} fontSize="11" letterSpacing="1.2" fill="var(--ink-2)">POPULAR VIEW · OUTSIDE THE FRAME</text>
      <text x="30" y="45" {...ui} fontSize="13" fill="var(--ink-2)">Hollywood and Disney films: Back to the Future</text>
      <rect x="16" y={CENTRE - 22} width={W - 56} height="44" rx="10" fill="var(--paper-3)" stroke="var(--ink)" strokeWidth="2" />
      <text x={(W - 40) / 2 + 8} y={CENTRE + 6} textAnchor="middle" {...ui} fontSize="15" letterSpacing="2" fill="var(--ink)" data-label="innovation">INNOVATION</text>
      <line x1={W - 40} y1={CENTRE} x2={SPINE} y2={CENTRE} stroke="var(--ink)" strokeWidth="1.5" />
    </g>
    <g data-step="2">
      <text x="16" y="78" {...ui} fontSize="11" letterSpacing="1.2" fill="var(--ink-2)">WHO DRIVES IT? SOCIETY…</text>
      <Source id="social" y={86} title="Social deterministic" lines={['external social factors combine', 'eg Covid → more online offerings']} />
      <line x1={SPINE} y1={86 + 36} x2={SPINE} y2={CENTRE} stroke="var(--ink-3)" strokeWidth="1.5" />
    </g>
    <g data-step="3">
      <text x="16" y="182" {...ui} fontSize="11" letterSpacing="1.2" fill="var(--ink-2)">…OR THE INDIVIDUAL?</text>
      <Source id="individual" y={190} title="Individualistic" lines={['unique talents: innovators are born', 'linked to serendipity']} />
    </g>
    <g data-step="4">
      <text x="16" y={CENTRE + 50} {...ui} fontSize="11" letterSpacing="1.2" fill="var(--ink-2)">WHERE IS ITS CONTEXT? THE FIRM…</text>
      <Source id="resource" y={CENTRE + 58} title="Resource-based" lines={["the firm's own resources", "eg Starbucks' coffee-based drinks"]} />
      <line x1={SPINE} y1={CENTRE} x2={SPINE} y2={CENTRE + 94} stroke="var(--ink-3)" strokeWidth="1.5" />
    </g>
    <g data-step="5">
      <text x="16" y={CENTRE + 154} {...ui} fontSize="11" letterSpacing="1.2" fill="var(--ink-2)">…OR THE MARKET?</text>
      <Source id="market" y={CENTRE + 162} title="Market-based" lines={['recognise the market opportunity', 'eg Share a Coke']} />
      <line x1={SPINE} y1={CENTRE + 94} x2={SPINE} y2={CENTRE + 198} stroke="var(--ink-3)" strokeWidth="1.5" />
    </g>
  </svg>
);

export default function ViewsOfInnovation() {
  return (
    <Diagram
      label="Views of innovation: four sources of one innovation"
      terms={[
        { term: 'Social deterministic', def: 'Innovation follows when external social conditions (demographic, cultural) are right.' },
        { term: 'Individualistic', def: 'Innovation comes from unique individual talents: innovators are born.' },
        { term: 'Resource-based', def: "The firm's own resources provide the context for innovative activity." },
        { term: 'Market-based', def: 'Market conditions facilitate or constrain innovation; the firm must recognise the opportunity.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'One innovation in the middle. The popular view, from films such as Back to the Future, sits outside the frame: it shapes how we imagine innovation.' },
        { caption: 'Social deterministic: external social factors such as demographic and cultural change combine, and when conditions are right innovation occurs — Covid and the shift online.' },
        { caption: 'Individualistic: innovations come from unique individual talents, so innovators are born. The slides link this view to serendipity.' },
        { caption: "Resource-based: the firm's own resources give the context for innovation — Starbucks innovating the style and type of its coffee-based drinks." },
        { caption: 'Market-based: market conditions facilitate or constrain innovation, so the firm must recognise the opportunity — Share a Coke; Mark\'s "hole in the market".' },
      ]}
      check={{
        question: 'A large firm builds a new product line from its own laboratories, cash and skilled staff. Which view does that illustrate?',
        options: [
          { text: 'Market-based innovation', why: 'Tempting because the line will meet demand, but the case stresses in-house resources, not a market opportunity the firm had to recognise.' },
          { text: 'Resource-based innovation', correct: true, why: "The firm's own resources provide the context for the innovative activity, as Starbucks' do for its drinks." },
          { text: 'The social deterministic school', why: 'Tempting because firms respond to society, but no external social factor drives this; the source is inside the firm.' },
        ],
      }}
    />
  );
}
