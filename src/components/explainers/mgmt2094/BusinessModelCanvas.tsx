/*
SCENE: The business model canvas — nine blocks, nine hypotheses
LENGTH: 6 steps, scroll-drawn when pinned (≈ 480vh); Next/Back otherwise (Diagram base)
INTENT: Fix the canvas's geography — value propositions at the centre, the customer side to the right, partners,
  activities and resources to the left, costs and revenue along the bottom — and the question each block asks, read
  as a hypothesis an MVP can test.
SUBJECT: the block being drawn; its question is the caption.
STEPS: 1 value propositions · 2 customer segments · 3 customer relationships + channels · 4 key activities + key
  resources · 5 key partners · 6 cost structure + revenue streams.
LAYOUT NOTE: the slide's canvas has five columns; at phone width five columns cannot carry legible labels, so the two
  left columns and the two right columns are stacked into one column each. Sides and order are unchanged.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: the finished canvas with all six captions stacked (base 'off' state).
BUDGET: < 5 KB gz. 340-unit canvas, labels 13.5 units, cues 12.5 units.
Source: concept mgmt2094-w10-business-model-canvas; lecture slides 7 (core concepts) and 8 (the canvas and its
  questions).
*/
import { Diagram } from '../bases/Diagram';

interface Block { id: string; x: number; y: number; w: number; h: number; label: string[]; cue: string[] }

function B({ id, x, y, w, h, label, cue }: Block) {
  const cx = x + w / 2;
  return (
    <>
      <rect x={x} y={y} width={w} height={h} rx="8" fill="none" stroke="var(--ink)" strokeWidth="1.4" />
      {label.map((l, i) => (
        <text key={l} x={cx} y={y + 24 + i * 17} textAnchor="middle" fontFamily="var(--font-ui)" fontSize="13.5" fontWeight="600" fill="var(--ink)" data-label={i === 0 ? id : undefined}>{l}</text>
      ))}
      {cue.map((c, i) => (
        <text key={c} x={cx} y={y + 30 + label.length * 17 + i * 16} textAnchor="middle" fontFamily="var(--font-body)" fontStyle="italic" fontSize="12.5" fill="var(--ink-2)">{c}</text>
      ))}
    </>
  );
}

const L = 4, C = 117, R = 230, CW = 106; // column x positions and width
const figure = (
  <svg viewBox="0 0 340 460" role="img" aria-label="The business model canvas: partners, activities and resources on the left; value propositions in the centre; relationships, channels and segments on the right; costs and revenue along the bottom">
    <g data-step="1">
      <B id="value-propositions" x={C} y={4} w={CW} h={322} label={['Value', 'propositions']} cue={['what value', 'do we deliver?', '', 'what is the', 'MVP?']} />
    </g>
    <g data-step="2">
      <B id="customer-segments" x={R} y={222} w={CW} h={104} label={['Customer', 'segments']} cue={['for whom?']} />
    </g>
    <g data-step="3">
      <B id="customer-relationships" x={R} y={4} w={CW} h={104} label={['Customer', 'relationships']} cue={['get, keep, grow']} />
      <B id="channels" x={R} y={113} w={CW} h={104} label={['Channels']} cue={['how do we', 'reach them?']} />
    </g>
    <g data-step="4">
      <B id="key-activities" x={L} y={113} w={CW} h={104} label={['Key', 'activities']} cue={['what we do']} />
      <B id="key-resources" x={L} y={222} w={CW} h={104} label={['Key', 'resources']} cue={['what we need']} />
    </g>
    <g data-step="5">
      <B id="key-partners" x={L} y={4} w={CW} h={104} label={['Key', 'partners']} cue={['who helps us?']} />
    </g>
    <g data-step="6">
      <B id="cost-structure" x={L} y={334} w={164} h={120} label={['Cost structure']} cue={['most important costs', 'inherent to the model']} />
      <B id="revenue-streams" x={172} y={334} w={164} h={120} label={['Revenue streams']} cue={['what are customers', 'willing to pay for?']} />
    </g>
  </svg>
);

export default function BusinessModelCanvas() {
  return (
    <Diagram
      label="The business model canvas, block by block"
      terms={[
        { term: 'Business model canvas', def: 'All nine building blocks of a business on one page, with their hypotheses.' },
        { term: 'Value proposition', def: 'The value we deliver: the problems we help customers solve.' },
        { term: 'Customer segment', def: 'A group of customers for whom we are creating value.' },
        { term: 'Hypothesis', def: 'An assumption in a block that the market can confirm or overturn.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'Value propositions, at the centre: what value do we deliver? Which customer problems are we helping to solve, which needs are we satisfying — and what is the minimum viable product?' },
        { caption: 'Customer segments, far right: for whom are we creating value? Who are our most important customers?' },
        { caption: 'Customer relationships (how do we get, keep and grow customers, and how costly are they?) and channels (through which channels do our segments want to be reached?).' },
        { caption: 'Key activities and key resources, to the left: what activities and resources do our value propositions require?' },
        { caption: 'Key partners: who are our key partners and suppliers, and which key activities do partners perform?' },
        { caption: 'Along the bottom: cost structure (the most important costs; which resources and activities are most expensive?) and revenue streams (for what value are customers really willing to pay?).' },
      ]}
      check={{
        question: 'A founder is unsure whether customers would rather subscribe or pay per use. Which block holds that hypothesis?',
        options: [
          { text: 'Cost structure', why: 'Cost structure asks about the business’s most important costs, not how customers pay.' },
          { text: 'Revenue streams', correct: true, why: 'Revenue streams asks what customers will really pay for, the revenue model and the pricing tactics.' },
          { text: 'Channels', why: 'Channels asks how customer segments want to be reached, not how they pay.' },
        ],
      }}
    />
  );
}
