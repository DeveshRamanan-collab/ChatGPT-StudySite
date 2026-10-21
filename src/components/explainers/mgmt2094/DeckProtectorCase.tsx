/*
SCENE: The Deck Protector — Design for Six Sigma in practice
LENGTH: 5 screens pinned (desktop, full motion); 5 paced beats otherwise (ScrollExplainer base)
BEATS: 5
INTENT: Show front-loading: chemistry (the design of experiment), economics and process engineering ran at the same
  time and converged on one decision meeting, which is why the customer only had to choose.
SUBJECT: the three parallel lanes and the single node they converge on.
BEAT 1 (0–20%): the brief node — ArmorAll v Thompson's WaterSeal, SMO product, 18 months; pilot for DfSS.
BEAT 2 (20–40%): the chemistry lane draws left → right (clip-path, ease none): SMO emulsion, six-factor two-level DOE.
BEAT 3 (40–60%): economics and process-engineering lanes draw alongside it: concurrent, not sequential.
BEAT 4 (60–80%): the lanes converge on the key meeting: ArmorAll picks formulation and price.
BEAT 5 (80–100%): results — 4,500+ tonnes, US$40m in 12 months, two awards, the model for later projects.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: final frame with all five captions stacked.
BUDGET: < 8 KB gz, no WebGL. Each beat's element is fully drawn by the time its paced stop is reached.
Source: Week 9 slides 13–16; Week 10 recording of the guest lecture ("we spent a lot more time up front");
concept mgmt2094-w09-deck-protector-case.
*/
import { ScrollExplainer } from '../bases/ScrollExplainer';

/** Reveal progress for beat k (1-based): complete by t = k − 1, the paced stop for that beat. */
const prog = (t: number, k: number) => Math.max(0, Math.min(1, (t - (k - 2.5)) / 1.5));
const clip = (p: number) => ({ clipPath: `inset(0 ${(1 - p) * 100}% 0 0)` });
const clipDown = (p: number) => ({ clipPath: `inset(0 0 ${(1 - p) * 100}% 0)` });
const op = (p: number) => ({ opacity: p });

const LANES = [
  { y: 70, k: 2, title: 'CHEMISTRY', lines: ['SMO emulsion · six-factor, two-level DOE', 'silane · wax · surfactant'] },
  { y: 150, k: 3, title: 'ECONOMICS', lines: ['durability results + profitability data'] },
  { y: 230, k: 3, title: 'PROCESS ENGINEERING', lines: ["designed on ArmorAll's volumes"] },
];

function wide(t: number) {
  return (
    <svg className="x-wide" viewBox="0 0 820 300" role="img" aria-label="Brief, then three parallel lanes — chemistry, economics, process engineering — converging on one decision meeting, then results">
      <g style={op(prog(t, 1))}>
        <circle cx="60" cy="150" r="8" fill="var(--ink)" />
        <text x="60" y="196" textAnchor="middle" fontFamily="var(--font-ui)" fontSize="12" letterSpacing="1" fill="var(--ink-2)">BRIEF</text>
        <text x="60" y="214" textAnchor="middle" fontFamily="var(--font-body)" fontSize="13" fill="var(--ink)">beat Thompson&apos;s</text>
        <text x="60" y="231" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="12" fill="var(--ink-2)">18 months</text>
      </g>
      {LANES.map((l) => {
        const p = prog(t, l.k);
        return (
          <g key={l.title} data-lane={l.title}>
            <g style={clip(p)}>
              <path d={`M68 150 C 110 150, 120 ${l.y}, 150 ${l.y}`} fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
              <line x1="150" y1={l.y} x2="510" y2={l.y} stroke="var(--ink)" strokeWidth="2" />
            </g>
            <g style={op(p)}>
              <text x="160" y={l.y - 26} fontFamily="var(--font-ui)" fontSize="12" letterSpacing="1" fill="var(--ink-2)">{l.title}</text>
              <text x="160" y={l.y - 9} fontFamily="var(--font-body)" fontSize="14" fill="var(--ink)">{l.lines[0]}</text>
              {l.lines[1] && <text x="160" y={l.y + 20} fontFamily="var(--font-ui)" fontSize="12" fill="var(--ink-2)">{l.lines[1]}</text>}
            </g>
          </g>
        );
      })}
      <text x="330" y="292" textAnchor="middle" fontFamily="var(--font-ui)" fontSize="12" fill="var(--ink-2)" style={op(prog(t, 3))}>at the same time, not one after another</text>
      <g style={op(prog(t, 4))} data-node="meeting">
        {LANES.map((l) => <path key={l.y} d={`M510 ${l.y} C 550 ${l.y}, 560 150, 588 150`} fill="none" stroke="var(--ink)" strokeWidth="1.5" />)}
        <circle cx="596" cy="150" r="9" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2.5" />
        <text x="614" y="124" fontFamily="var(--font-ui)" fontSize="12" letterSpacing="1" fill="var(--ink-2)">KEY MEETING</text>
        <text x="614" y="142" fontFamily="var(--font-body)" fontSize="14" fill="var(--ink)">ArmorAll picks</text>
        <text x="614" y="160" fontFamily="var(--font-body)" fontSize="14" fill="var(--ink)">formulation + price</text>
      </g>
      <g style={op(prog(t, 5))} data-node="results">
        <line x1="596" y1="159" x2="596" y2="236" stroke="var(--ink)" strokeWidth="1.5" />
        <line x1="596" y1="236" x2="610" y2="236" stroke="var(--ink)" strokeWidth="1.5" />
        <rect x="610" y="186" width="202" height="104" rx="10" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
        <text x="624" y="208" fontFamily="var(--font-ui)" fontSize="12" letterSpacing="1" fill="var(--ink-2)">IN 12 MONTHS</text>
        <text x="624" y="228" fontFamily="var(--font-body)" fontSize="14" fill="var(--ink)">4,500+ tonnes · US$40m</text>
        <text x="624" y="248" fontFamily="var(--font-body)" fontSize="14" fill="var(--ink)">two achievement awards</text>
        <text x="624" y="268" fontFamily="var(--font-body)" fontSize="14" fill="var(--ink)">model for later projects</text>
      </g>
    </svg>
  );
}

function Box({ y, h, title, lines }: { y: number; h: number; title: string; lines: string[] }) {
  return (
    <>
      <rect x="40" y={y} width="312" height={h} rx="10" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="54" y={y + 22} fontFamily="var(--font-ui)" fontSize="12" letterSpacing="1" fill="var(--ink-2)">{title}</text>
      {lines.map((l, i) => <text key={i} x="54" y={y + 42 + i * 19} fontFamily="var(--font-body)" fontSize="14" fill="var(--ink)">{l}</text>)}
    </>
  );
}

function tall(t: number) {
  return (
    <svg className="x-tall" viewBox="0 0 360 560" role="img" aria-label="Brief; then chemistry, economics and process engineering side by side in time; then the key meeting; then results">
      <g style={op(prog(t, 1))}>
        <Box y={8} h={70} title="BRIEF" lines={["Beat Thompson's WaterSeal with an", 'SMO product, in 18 months']} />
      </g>
      <g style={op(prog(t, 3))}>
        <g style={clipDown(prog(t, 3))}>
          <line x1="20" y1="104" x2="20" y2="328" stroke="var(--ink-2)" strokeWidth="2" />
        </g>
        <text x="14" y="98" fontFamily="var(--font-ui)" fontSize="11" letterSpacing="1" fill="var(--ink-2)">AT THE SAME TIME</text>
      </g>
      <g style={op(prog(t, 2))}><Box y={104} h={72} title="CHEMISTRY" lines={['SMO emulsion · six-factor, two-level', 'DOE on silane, wax, surfactant']} /></g>
      <g style={op(prog(t, 3))}><Box y={186} h={66} title="ECONOMICS" lines={['Durability results + profitability data']} /></g>
      <g style={op(prog(t, 3))}><Box y={262} h={66} title="PROCESS ENGINEERING" lines={["Designed on ArmorAll's volumes"]} /></g>
      <g style={op(prog(t, 4))}>
        <line x1="196" y1="330" x2="196" y2="352" stroke="var(--ink)" strokeWidth="1.5" />
        <Box y={352} h={70} title="KEY MEETING" lines={['ArmorAll picks formulation and price']} />
      </g>
      <g style={op(prog(t, 5))}>
        <line x1="196" y1="422" x2="196" y2="440" stroke="var(--ink)" strokeWidth="1.5" />
        <Box y={440} h={110} title="IN 12 MONTHS" lines={['4,500+ tonnes · US$40m revenue', 'Two achievement awards', 'Model for all later projects']} />
      </g>
    </svg>
  );
}

function scene(t: number) {
  return <>{wide(t)}{tall(t)}</>;
}

export default function DeckProtectorCase() {
  return (
    <ScrollExplainer
      label="The ArmorAll Deck Protector: three lanes of work converging on one decision"
      terms={[
        { term: 'SMO', def: 'Silicone modified organic: organic chemistry improved with silicone; Dow Corning\'s growth strategy.' },
        { term: 'Design of experiment (DOE)', def: 'Testing several factors at set levels together, rather than one at a time.' },
        { term: 'Concurrent', def: 'Running at the same time: here, process engineering alongside the chemistry.' },
        { term: 'Pilot', def: 'The first project run under a new method, here Design for Six Sigma.' },
      ]}
      beats={[
        { caption: "ArmorAll asks for an SMO product to take on Thompson's WaterSeal within 18 months, against a usual four years. It becomes the pilot for Design for Six Sigma." },
        { caption: 'The chemistry: an SMO emulsion, then a six-factor, two-level design of experiment to find the mix of silane, wax and surfactant; samples tested for waterproofing durability.' },
        { caption: "At the same time, the results are compiled with economic and profitability data, and a production process is designed on ArmorAll's volumes." },
        { caption: 'Everything converges on one key meeting: ArmorAll chooses the formulation and price, extremely impressed by the detail.' },
        { caption: 'In 12 months: over 4,500 tonnes, US$40 million of revenue and two achievement awards. It becomes the basis for all new commercialisation projects.' },
      ]}
      scene={scene}
      check={{
        question: 'What let ArmorAll choose the formulation and price at a single meeting?',
        options: [
          { text: 'The experiments, economics and process design were all done up front', correct: true, why: 'The guest lecturer said they spent far more time up front on experiments, financial analysis and process engineering, so the customer only had to choose.' },
          { text: 'Dow Corning copied the market leader\'s formula', why: 'The aim was to meet or exceed Thompson\'s performance, found through a design of experiment, not by copying.' },
          { text: 'Process engineering was left until after the meeting', why: 'The reverse: process engineering commenced concurrently, so the production process was ready when the choice was made.' },
        ],
      }}
    />
  );
}
